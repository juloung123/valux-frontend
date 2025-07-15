/**
 * Service Configuration
 * Central configuration for switching between mock and real API services
 */

// Configuration flag to switch between mock and real API services
// Set to true to use real API services, false to use mock services
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true' || false

// Import real API services
import { 
  authService as realAuthService,
  vaultService as realVaultService,
  portfolioService as realPortfolioService,
  rulesService as realRulesService,
  analyticsService as realAnalyticsService
} from './api'

// Import mock services
import { 
  vaultService as mockVaultService,
  portfolioService as mockPortfolioService,
  rulesService as mockRulesService,
  analyticsService as mockAnalyticsService
} from '../mock'

// Export the configured services
export const authService = realAuthService // Auth service is always real (no mock equivalent)

export const vaultService = USE_REAL_API ? realVaultService : mockVaultService
export const portfolioService = USE_REAL_API ? realPortfolioService : mockPortfolioService
export const rulesService = USE_REAL_API ? realRulesService : mockRulesService
export const analyticsService = USE_REAL_API ? realAnalyticsService : mockAnalyticsService

// Health check utility
export const healthCheck = async () => {
  if (USE_REAL_API) {
    const { healthCheck } = await import('./api')
    return healthCheck()
  } else {
    // Mock health check response
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'mock'
    }
  }
}

// Configuration utilities
export const getServiceConfig = () => ({
  useRealApi: USE_REAL_API,
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  environment: process.env.NODE_ENV || 'development',
})

// Service switching utility for development
export const switchToRealApi = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('VALUX_USE_REAL_API', 'true')
    window.location.reload()
  }
}

export const switchToMockApi = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('VALUX_USE_REAL_API', 'false')
    window.location.reload()
  }
}

// Developer utilities
export const debugServices = () => {
  console.log('Service Configuration:', {
    useRealApi: USE_REAL_API,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    environment: process.env.NODE_ENV,
    services: {
      auth: 'real-api',
      vaults: USE_REAL_API ? 'real-api' : 'mock',
      portfolio: USE_REAL_API ? 'real-api' : 'mock',
      rules: USE_REAL_API ? 'real-api' : 'mock',
      analytics: USE_REAL_API ? 'real-api' : 'mock',
    }
  })
}

// Default export for convenience
export default {
  auth: authService,
  vaults: vaultService,
  portfolio: portfolioService,
  rules: rulesService,
  analytics: analyticsService,
  config: getServiceConfig(),
  healthCheck,
  debugServices,
}