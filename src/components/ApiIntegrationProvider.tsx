'use client'

import { useEffect } from 'react'
import { initializeApiIntegration } from '@/lib/apiIntegration'

/**
 * API Integration Provider
 * Initializes API integration status and provides development tools
 */
export default function ApiIntegrationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize API integration on client side
    initializeApiIntegration().catch(error => {
      console.error('Failed to initialize API integration:', error)
    })

    // Import auth utilities for development
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/authUtils').then(() => {
        console.log('🔐 Auth utilities loaded. Use window.valuxAuth for testing.')
      })
    }
  }, [])

  return <>{children}</>
}