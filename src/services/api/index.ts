/**
 * API Services Index
 * Centralized exports for all API services
 */

// Core API infrastructure
export { apiClient, ApiError, NetworkError, AuthenticationError } from './client'

// Type definitions
export * from './types'

// Data transformers
export * from './transformers'

// Service instances
export { authService } from './authService'
export { vaultService } from './vaultService'
export { portfolioService } from './portfolioService'
export { rulesService } from './rulesService'
export { analyticsService } from './analyticsService'

// Service classes (for advanced usage)
export { AuthService } from './authService'
export { VaultService } from './vaultService'
export { PortfolioService } from './portfolioService'
export { RulesService } from './rulesService'
export { AnalyticsService } from './analyticsService'

// Health check utility
export const healthCheck = async () => {
  const { apiClient } = await import('./client')
  return apiClient.get('/health')
}

// API status utility
export const getApiStatus = async () => {
  const { apiClient } = await import('./client')
  return apiClient.get('/stats')
}

// Environment utilities
export const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
}

export const isProduction = () => {
  return process.env.NODE_ENV === 'production'
}

export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development'
}