/**
 * Authentication Button Component
 * Handles wallet connection and authentication states
 */

'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAuth, AuthState } from '@/hooks/useAuth'
import { Button } from '@/components/ui'

export default function AuthButton() {
  const { authState, login, logout, clearError, error } = useAuth()

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Prevent hydration mismatch
        if (!mounted) {
          return null
        }

        // Handle different authentication states
        const renderAuthButton = () => {
          switch (authState) {
            case AuthState.GUEST:
            case AuthState.WALLET_DETECTED:
              return (
                <Button onClick={openConnectModal} variant="primary">
                  Connect Wallet
                </Button>
              )

            case AuthState.CONNECTING:
              return (
                <Button variant="primary" disabled>
                  Connecting...
                </Button>
              )

            case AuthState.CONNECTED:
              return (
                <div className="flex items-center space-x-2">
                  <Button onClick={login} variant="primary">
                    Sign Message
                  </Button>
                  <Button 
                    onClick={openAccountModal} 
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>{account?.displayName}</span>
                  </Button>
                </div>
              )

            case AuthState.AUTHENTICATING:
              return (
                <Button variant="primary" disabled>
                  Authenticating...
                </Button>
              )

            case AuthState.AUTHENTICATED:
              return (
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={openAccountModal}
                    variant="outline" 
                    className="flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{account?.displayName}</span>
                  </Button>
                  <Button onClick={logout} variant="ghost" className="text-sm">
                    Logout
                  </Button>
                </div>
              )

            case AuthState.ERROR:
              return (
                <div className="flex items-center space-x-2">
                  <Button onClick={clearError} variant="danger">
                    Retry
                  </Button>
                  {account && (
                    <Button 
                      onClick={openAccountModal} 
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{account?.displayName}</span>
                    </Button>
                  )}
                </div>
              )

            default:
              return (
                <Button onClick={openConnectModal} variant="primary">
                  Connect Wallet
                </Button>
              )
          }
        }

        // Handle wrong network
        if (chain?.unsupported) {
          return (
            <Button onClick={openChainModal} variant="danger">
              Wrong Network
            </Button>
          )
        }

        return (
          <div className="flex flex-col items-end">
            {renderAuthButton()}
            {error && (
              <div className="mt-1 text-xs text-red-600 max-w-xs truncate">
                {error}
              </div>
            )}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}