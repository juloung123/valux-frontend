'use client'

import { ReactNode, useEffect } from 'react'
import { WagmiProvider, http } from 'wagmi'
import { arbitrum, arbitrumSepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'

// Error handling for extension conflicts
const suppressExtensionErrors = () => {
  const originalError = console.error
  console.error = (...args) => {
    // Suppress specific extension errors
    const message = args.join(' ')
    if (
      message.includes('chrome-extension://') ||
      message.includes('Cannot read properties of null') ||
      message.includes('injected.js')
    ) {
      return
    }
    originalError.apply(console, args)
  }
}

const config = getDefaultConfig({
  appName: 'Valux.finance',
  projectId: 'YOUR_PROJECT_ID', // You would replace this with actual WalletConnect project ID
  chains: [arbitrum, arbitrumSepolia],
  transports: {
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on extension-related errors
        if (error?.message?.includes('extension') || error?.message?.includes('injected')) {
          return false
        }
        return failureCount < 3
      },
      staleTime: 60 * 1000, // 1 minute
    },
  },
})

interface Web3ProviderProps {
  children: ReactNode
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  useEffect(() => {
    // Apply error suppression on client side only
    if (typeof window !== 'undefined') {
      suppressExtensionErrors()
      
      // Add global error handler for unhandled extension errors
      const handleError = (event: ErrorEvent) => {
        if (
          event.filename?.includes('chrome-extension://') ||
          event.message?.includes('Cannot read properties of null')
        ) {
          event.preventDefault()
          return true
        }
      }
      
      window.addEventListener('error', handleError)
      
      return () => {
        window.removeEventListener('error', handleError)
      }
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={arbitrum}
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}