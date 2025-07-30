/**
 * Authentication Hook
 * Provides convenient access to authentication functionality
 */

import { useAuth as useAuthContext, AuthState } from '@/contexts/AuthContext'

// Re-export the auth context hook and types for convenience
export { useAuth, AuthState } from '@/contexts/AuthContext'
export { useAuthContext }

// Additional convenience hooks
export function useAuthActions() {
  const { login, logout, clearError } = useAuthContext()
  return { login, logout, clearError }
}

export function useAuthStatus() {
  const { authState, isAuthenticated, isGuest, isLoading, error } = useAuthContext()
  return { authState, isAuthenticated, isGuest, isLoading, error }
}

export function useUserData() {
  const { user, address } = useAuthContext()
  return { user, address }
}

// Helper function to check if user can access protected features
export function useCanAccessProtectedFeatures(): boolean {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated
}

// Helper function to check if user is in a specific auth state
export function useIsInAuthState(targetState: AuthState): boolean {
  const { authState } = useAuthContext()
  return authState === targetState
}

// Helper function to get user-friendly status messages
export function useAuthStatusMessage(): string {
  const { authState, error } = useAuthContext()
  
  if (error) {
    return error
  }
  
  switch (authState) {
    case AuthState.GUEST:
      return 'Connect your wallet to access all features'
    case AuthState.WALLET_DETECTED:
      return 'Wallet detected. Click to connect'
    case AuthState.CONNECTING:
      return 'Connecting to wallet...'
    case AuthState.CONNECTED:
      return 'Wallet connected. Sign message to authenticate'
    case AuthState.AUTHENTICATING:
      return 'Authenticating with your wallet...'
    case AuthState.AUTHENTICATED:
      return 'Successfully authenticated'
    case AuthState.ERROR:
      return 'Authentication error occurred'
    default:
      return 'Unknown authentication state'
  }
}

// Helper function to determine what action the user should take
export function useAuthAction(): { action: string; available: boolean } {
  const { authState, address } = useAuthContext()
  
  switch (authState) {
    case AuthState.GUEST:
    case AuthState.WALLET_DETECTED:
      return { action: 'Connect Wallet', available: true }
    case AuthState.CONNECTING:
      return { action: 'Connecting...', available: false }
    case AuthState.CONNECTED:
      return { action: 'Sign Message', available: !!address }
    case AuthState.AUTHENTICATING:
      return { action: 'Authenticating...', available: false }
    case AuthState.AUTHENTICATED:
      return { action: 'Authenticated', available: false }
    case AuthState.ERROR:
      return { action: 'Retry', available: true }
    default:
      return { action: 'Unknown', available: false }
  }
}