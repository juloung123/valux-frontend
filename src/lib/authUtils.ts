/**
 * Authentication Utilities
 * Helper functions for wallet authentication and token management
 */

import { authService } from '@/services'

/**
 * Mock authentication for development testing
 * This simulates wallet signing without requiring actual wallet interaction
 */
export async function mockAuthentication(address: string): Promise<boolean> {
  try {
    console.log('🔐 Starting mock authentication for:', address)
    
    // Step 1: Get nonce
    const nonceResponse = await authService.getNonce(address)
    console.log('✅ Got nonce:', nonceResponse.nonce)
    
    // Step 2: Create mock signature (in real app, this would be from wallet)
    const mockSignature = '0x' + '1'.repeat(130) // Mock signature
    
    // Step 3: Login with mock signature
    const loginResponse = await authService.login({
      address,
      signature: mockSignature,
      message: nonceResponse.message,
    })
    
    console.log('✅ Login successful:', {
      user: loginResponse.user.address,
      tokenLength: loginResponse.access_token.length,
    })
    
    return true
  } catch (error) {
    console.error('❌ Mock authentication failed:', error)
    return false
  }
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return authService.isAuthenticated()
}

/**
 * Get current authentication status
 */
export function getAuthStatus() {
  return {
    isAuthenticated: authService.isAuthenticated(),
    timestamp: new Date().toISOString(),
  }
}

/**
 * Clear authentication
 */
export function clearAuth(): void {
  authService.clearAuth()
  console.log('🔓 Authentication cleared')
}

/**
 * Development authentication helper
 * Automatically authenticates with a test address for development
 */
export async function devAuthenticate(): Promise<boolean> {
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678'
  
  if (process.env.NODE_ENV !== 'development') {
    console.warn('⚠️ Dev authentication only available in development mode')
    return false
  }
  
  console.log('🧪 Running development authentication...')
  return await mockAuthentication(testAddress)
}

// Expose to window for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  ;(window as any).valuxAuth = {
    mockAuth: mockAuthentication,
    devAuth: devAuthenticate,
    isAuth: isAuthenticated,
    status: getAuthStatus,
    clear: clearAuth,
  }
}