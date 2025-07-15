/**
 * Authentication Service
 * Handles Web3 wallet authentication with backend
 */

import { apiClient } from './client'
import { NonceResponse, LoginRequest, LoginResponse, UserDto } from './types'

export class AuthService {
  /**
   * Get nonce for wallet signature
   */
  async getNonce(address: string): Promise<NonceResponse> {
    return apiClient.get<NonceResponse>('/auth/nonce', { address })
  }

  /**
   * Login with wallet signature
   */
  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', loginData)
    
    // Store tokens in client
    apiClient.setAuthTokens(response.access_token, response.refresh_token)
    
    return response
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<{ access_token: string; expires_in: number }> {
    return apiClient.post<{ access_token: string; expires_in: number }>('/auth/refresh')
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserDto> {
    return apiClient.get<UserDto>('/auth/profile')
  }

  /**
   * Logout user
   */
  async logout(): Promise<{ message: string; timestamp: string }> {
    const response = await apiClient.post<{ message: string; timestamp: string }>('/auth/logout')
    
    // Clear tokens from client
    apiClient.clearAuthTokens()
    
    return response
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated()
  }

  /**
   * Clear authentication tokens
   */
  clearAuth(): void {
    apiClient.clearAuthTokens()
  }
}

export const authService = new AuthService()