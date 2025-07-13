/**
 * Mock Data and Services Export
 * 
 * This file provides centralized access to all mock data and services
 * used throughout the application for development and testing.
 * 
 * TODO: Replace with actual API integration
 * - Remove mock services and replace with real API clients
 * - Implement proper error handling and retry logic
 * - Add request/response interceptors for logging
 * - Set up proper authentication and rate limiting
 */

// Mock Data Exports
export { mockVaults } from './data/vaults'
export { 
  mockPortfolioPositions, 
  mockTransactions, 
  mockPortfolioStats 
} from './data/portfolio'
export { mockAutomationRules, mockRulePerformance } from './data/rules'
export { 
  mockPlatformMetrics, 
  mockProtocolDistribution, 
  mockVaultPerformance, 
  mockTimeSeriesData 
} from './data/analytics'

// Mock Service Exports
export { vaultService } from './services/vaultService'
export { portfolioService } from './services/portfolioService'
export { rulesService } from './services/rulesService'
export { analyticsService } from './services/analyticsService'

/**
 * Mock API Configuration
 * TODO: Replace with real API configuration
 */
export const MOCK_CONFIG = {
  // Simulated API delays (in milliseconds)
  delays: {
    fast: 200,      // For simple data fetching
    medium: 500,    // For complex queries
    slow: 1000,     // For heavy operations
    blockchain: 2000 // For blockchain transactions
  },
  
  // Mock error rates for testing error handling
  errorRates: {
    network: 0.02,     // 2% chance of network errors
    server: 0.01,      // 1% chance of server errors
    validation: 0.05,  // 5% chance of validation errors
    blockchain: 0.03   // 3% chance of blockchain errors
  },
  
  // Feature flags for mock services
  features: {
    realTimeUpdates: true,
    errorSimulation: false,
    loadingStates: true,
    cachingEnabled: false
  }
} as const