/**
 * Authentication Context
 * Provides authentication state management for the entire application
 */

'use client'

import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, ReactNode } from 'react'
import { useAccount, useSignMessage } from 'wagmi'
import { authService } from '@/services'
import { UserDto } from '@/services/api/types'

// Authentication states
export enum AuthState {
  GUEST = 'guest',                    // No wallet, limited features
  WALLET_DETECTED = 'wallet_detected', // Wallet available, not connected
  CONNECTING = 'connecting',           // Wallet connection in progress
  CONNECTED = 'connected',             // Wallet connected, not authenticated
  AUTHENTICATING = 'authenticating',   // Authentication in progress
  AUTHENTICATED = 'authenticated',     // Fully authenticated user
  ERROR = 'error'                      // Connection/authentication error
}

interface AuthContextState {
  authState: AuthState
  user: UserDto | null
  address: string | null
  isAuthenticated: boolean
  isGuest: boolean
  isLoading: boolean
  error: string | null
}

interface AuthContextValue extends AuthContextState {
  login: () => Promise<void>
  logout: () => void
  clearError: () => void
}

// Action types for reducer
type AuthAction =
  | { type: 'SET_STATE'; payload: AuthState }
  | { type: 'SET_USER'; payload: UserDto }
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'LOGOUT' }

// Initial state
const initialState: AuthContextState = {
  authState: AuthState.GUEST,
  user: null,
  address: null,
  isAuthenticated: false,
  isGuest: true,
  isLoading: false,
  error: null,
}

// Reducer function
function authReducer(state: AuthContextState, action: AuthAction): AuthContextState {
  switch (action.type) {
    case 'SET_STATE':
      return {
        ...state,
        authState: action.payload,
        isAuthenticated: action.payload === AuthState.AUTHENTICATED,
        isGuest: action.payload === AuthState.GUEST,
        isLoading: action.payload === AuthState.CONNECTING || action.payload === AuthState.AUTHENTICATING,
      }
    
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        authState: AuthState.AUTHENTICATED,
        isAuthenticated: true,
        isGuest: false,
        isLoading: false,
        error: null,
      }
    
    case 'SET_ADDRESS':
      return {
        ...state,
        address: action.payload,
        authState: action.payload ? AuthState.CONNECTED : AuthState.WALLET_DETECTED,
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        authState: AuthState.ERROR,
        isLoading: false,
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
        authState: state.address ? AuthState.CONNECTED : AuthState.GUEST,
      }
    
    case 'LOGOUT':
      return {
        ...initialState,
        authState: state.address ? AuthState.CONNECTED : AuthState.GUEST,
        address: state.address, // Keep wallet connection
      }
    
    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextValue | null>(null)

// Custom hook to use auth context
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const [isVerifying, setIsVerifying] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [lastVerifiedAddress, setLastVerifiedAddress] = useState<string | null>(null)

  // Initialize authentication state once on mount
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true)
      
      if (isConnected && address && authService.isAuthenticated()) {
        setIsVerifying(true)
        verifyStoredAuth(address).finally(() => setIsVerifying(false))
      }
    }
  }, [hasInitialized, isConnected, address])

  // Handle wallet connection changes (without verification)
  useEffect(() => {
    if (isConnected && address) {
      // Reset verification tracking when address changes
      if (lastVerifiedAddress !== address) {
        setLastVerifiedAddress(null)
      }
      dispatch({ type: 'SET_ADDRESS', payload: address })
    } else if (!isConnected) {
      // Reset verification tracking when wallet disconnected
      setLastVerifiedAddress(null)
      // Wallet disconnected, clear guest state if no auth
      if (!authService.isAuthenticated()) {
        dispatch({ type: 'SET_STATE', payload: AuthState.GUEST })
      }
    }
  }, [address, isConnected, lastVerifiedAddress])

  // Verify stored authentication (memoized to prevent re-creation)
  const verifyStoredAuth = useCallback(async (currentAddress: string) => {
    // Skip if already verifying, already authenticated, or same address already verified
    if (isVerifying || 
        state.authState === AuthState.AUTHENTICATED || 
        lastVerifiedAddress === currentAddress) {
      return
    }

    setLastVerifiedAddress(currentAddress)
    
    try {
      const profile = await authService.getProfile()
      
      if (profile.address.toLowerCase() === currentAddress.toLowerCase()) {
        dispatch({ type: 'SET_USER', payload: profile })
      } else {
        // Address mismatch, clear auth
        authService.clearAuth()
        dispatch({ type: 'SET_STATE', payload: AuthState.CONNECTED })
      }
    } catch (error) {
      // Invalid token, clear auth
      authService.clearAuth()
      dispatch({ type: 'SET_STATE', payload: AuthState.CONNECTED })
    }
  }, [isVerifying, state.authState, lastVerifiedAddress])

  // Login function
  const login = async (): Promise<void> => {
    if (!address || !isConnected) {
      dispatch({ type: 'SET_ERROR', payload: 'Please connect your wallet first' })
      return
    }

    // Prevent multiple simultaneous login attempts
    if (state.authState === AuthState.AUTHENTICATING) {
      return
    }

    // Set timeout for authentication process
    const authTimeout = setTimeout(() => {
      dispatch({ type: 'SET_ERROR', payload: 'Authentication timed out. Please try again.' })
    }, 30000)

    try {
      dispatch({ type: 'SET_STATE', payload: AuthState.AUTHENTICATING })
      dispatch({ type: 'CLEAR_ERROR' })

      // Step 1: Get nonce for signing
      const nonceResponse = await authService.getNonce(address)
      
      // Step 2: Request signature from wallet
      const signature = await signMessageAsync({
        message: nonceResponse.message,
      })

      // Step 3: Authenticate with backend
      const loginResponse = await authService.login({
        address,
        signature,
        message: nonceResponse.message,
      })

      // Step 4: Set authenticated user
      clearTimeout(authTimeout)
      dispatch({ type: 'SET_USER', payload: loginResponse.user })

    } catch (error) {
      clearTimeout(authTimeout)
      
      // If it's a network error, show specific message
      let errorMessage = 'Authentication failed'
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to server. Please check if backend is running.'
        } else {
          errorMessage = error.message
        }
      }
      
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call backend logout (clears tokens)
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of backend response
      authService.clearAuth()
      dispatch({ type: 'LOGOUT' })
    }
  }

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Context value
  const value: AuthContextValue = {
    ...state,
    login,
    logout,
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper hooks
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

export function useIsGuest(): boolean {
  const { isGuest } = useAuth()
  return isGuest
}

export function useAuthState(): AuthState {
  const { authState } = useAuth()
  return authState
}

export function useUser(): UserDto | null {
  const { user } = useAuth()
  return user
}