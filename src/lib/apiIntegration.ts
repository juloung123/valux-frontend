/**
 * API Integration Utilities
 * Helper functions for managing API integration and fallback scenarios
 */

import { healthCheck, getServiceConfig } from '@/services'

// Integration status
interface IntegrationStatus {
  backendAvailable: boolean
  apiUrl: string
  useRealApi: boolean
  lastChecked: Date
  error?: string
}

let integrationStatus: IntegrationStatus | null = null

/**
 * Check if backend API is available
 */
export async function checkBackendAvailability(): Promise<boolean> {
  try {
    const response = await healthCheck()
    return response?.status === 'ok'
  } catch (error) {
    console.warn('Backend API check failed:', error)
    return false
  }
}

/**
 * Get integration status with caching
 */
export async function getIntegrationStatus(forceRefresh = false): Promise<IntegrationStatus> {
  if (!integrationStatus || forceRefresh) {
    const config = getServiceConfig()
    
    try {
      const backendAvailable = config.useRealApi ? await checkBackendAvailability() : false
      
      integrationStatus = {
        backendAvailable,
        apiUrl: config.apiUrl,
        useRealApi: config.useRealApi,
        lastChecked: new Date(),
      }
    } catch (error) {
      integrationStatus = {
        backendAvailable: false,
        apiUrl: config.apiUrl,
        useRealApi: config.useRealApi,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
  
  return integrationStatus
}

/**
 * Auto-fallback wrapper for API calls
 */
export async function withApiFallback<T>(
  realApiCall: () => Promise<T>,
  mockApiCall: () => Promise<T>,
  fallbackData?: T
): Promise<T> {
  const status = await getIntegrationStatus()
  
  if (status.useRealApi && status.backendAvailable) {
    try {
      return await realApiCall()
    } catch (error) {
      console.warn('Real API call failed, falling back to mock:', error)
      return await mockApiCall()
    }
  } else {
    return await mockApiCall()
  }
}

/**
 * Display integration status to developers
 */
export function logIntegrationStatus(): void {
  if (process.env.NODE_ENV === 'development') {
    getIntegrationStatus().then(status => {
      const style = status.backendAvailable ? 'color: green' : 'color: orange'
      console.log(
        `%c[Valux API Integration]`,
        style,
        {
          status: status.backendAvailable ? 'Connected' : 'Using Mock Data',
          apiUrl: status.apiUrl,
          useRealApi: status.useRealApi,
          lastChecked: status.lastChecked.toISOString(),
          error: status.error,
        }
      )
    })
  }
}

/**
 * Integration warnings for development
 */
export function showIntegrationWarnings(): void {
  if (process.env.NODE_ENV === 'development') {
    getIntegrationStatus().then(status => {
      if (status.useRealApi && !status.backendAvailable) {
        console.warn(
          '⚠️ Backend API is not available. Using mock data instead.\n' +
          'To start the backend server:\n' +
          '1. cd ../valux-backend\n' +
          '2. npm run server:start\n' +
          '3. Refresh this page'
        )
      }
      
      if (!status.useRealApi) {
        console.info(
          '📋 Currently using mock data for development.\n' +
          'To switch to real API:\n' +
          '1. Set NEXT_PUBLIC_USE_REAL_API=true in .env.local\n' +
          '2. Ensure backend is running on port 8080\n' +
          '3. Refresh this page'
        )
      }
    })
  }
}

/**
 * Startup initialization
 */
export async function initializeApiIntegration(): Promise<void> {
  await getIntegrationStatus(true)
  logIntegrationStatus()
  showIntegrationWarnings()
}

/**
 * Error boundary helper for API errors
 */
export function isApiError(error: unknown): boolean {
  return error instanceof Error && (
    error.name === 'ApiError' ||
    error.name === 'NetworkError' ||
    error.name === 'AuthenticationError' ||
    error.message.includes('fetch')
  )
}

/**
 * Format API errors for display
 */
export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    if (isApiError(error)) {
      return `API Error: ${error.message}`
    }
    return error.message
  }
  return 'An unknown error occurred'
}

/**
 * Development tools for API integration
 */
export const apiIntegrationTools = {
  checkStatus: () => getIntegrationStatus(true),
  switchToReal: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('VALUX_USE_REAL_API', 'true')
      window.location.reload()
    }
  },
  switchToMock: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('VALUX_USE_REAL_API', 'false')
      window.location.reload()
    }
  },
  testConnection: checkBackendAvailability,
  logStatus: logIntegrationStatus,
}

// Expose to window for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  ;(window as any).valuxApiTools = apiIntegrationTools
}