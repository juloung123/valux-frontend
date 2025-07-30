/**
 * Authentication Guard Component
 * Provides page-level authentication protection and guest access control
 */

'use client'

import { ReactNode } from 'react'
import { useAuth, AuthState } from '@/hooks/useAuth'
import { Button, Loading } from '@/components/ui'
import AuthButton from './AuthButton'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  allowGuest?: boolean
  fallback?: ReactNode
}

interface UnauthenticatedPromptProps {
  title: string
  description: string
  showConnectButton?: boolean
}

// Component for unauthenticated users
function UnauthenticatedPrompt({ 
  title, 
  description, 
  showConnectButton = true 
}: UnauthenticatedPromptProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {description}
          </p>
        </div>

        {showConnectButton && (
          <div className="flex justify-center">
            <AuthButton />
          </div>
        )}
      </div>
    </div>
  )
}

// Component for loading states
function AuthLoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loading />
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  )
}

// Component for error states
function AuthErrorState({ error, clearError }: { error: string; clearError: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Authentication Error
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
        <div className="space-y-4">
          <Button onClick={clearError} variant="primary" className="w-full">
            Try Again
          </Button>
          <AuthButton />
        </div>
      </div>
    </div>
  )
}

export default function AuthGuard({ 
  children, 
  requireAuth = false, 
  allowGuest = true, 
  fallback 
}: AuthGuardProps) {
  const { authState, isAuthenticated, isLoading, error, clearError } = useAuth()

  // Handle loading states
  if (isLoading) {
    return <AuthLoadingState />
  }

  // Handle error states
  if (error && authState === AuthState.ERROR) {
    return <AuthErrorState error={error} clearError={clearError} />
  }

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Different prompts based on current auth state
    switch (authState) {
      case AuthState.GUEST:
        return (
          <UnauthenticatedPrompt
            title="Connect Your Wallet"
            description="Please connect your wallet to access this feature"
          />
        )

      case AuthState.WALLET_DETECTED:
        return (
          <UnauthenticatedPrompt
            title="Connect Your Wallet"
            description="Wallet detected. Please connect to continue"
          />
        )

      case AuthState.CONNECTED:
        return (
          <UnauthenticatedPrompt
            title="Sign Message"
            description="Please sign the message to authenticate your wallet"
          />
        )

      case AuthState.CONNECTING:
      case AuthState.AUTHENTICATING:
        return <AuthLoadingState />

      default:
        return (
          <UnauthenticatedPrompt
            title="Authentication Required"
            description="Please authenticate to access this feature"
          />
        )
    }
  }

  // If guest access is not allowed and user is not authenticated
  if (!allowGuest && !isAuthenticated) {
    return (
      <UnauthenticatedPrompt
        title="Authentication Required"
        description="This page requires authentication. Please connect your wallet to continue."
      />
    )
  }

  // Render children for:
  // - Authenticated users
  // - Guest users when allowGuest is true
  // - Any user when requireAuth is false
  return <>{children}</>
}

// Convenient wrapper components for common use cases
export function ProtectedPage({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <AuthGuard requireAuth={true} allowGuest={false} fallback={fallback}>
      {children}
    </AuthGuard>
  )
}

export function PublicPage({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={false} allowGuest={true}>
      {children}
    </AuthGuard>
  )
}

export function GuestRestrictedPage({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requireAuth={false} allowGuest={false}>
      {children}
    </AuthGuard>
  )
}