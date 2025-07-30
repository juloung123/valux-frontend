/**
 * API Client
 * Handles HTTP requests to the backend API with authentication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse } from './types'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
const API_PREFIX = 'api'

// Request timeout
const REQUEST_TIMEOUT = 30000 // 30 seconds

// Error classes
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

// Token management
class TokenManager {
  private static instance: TokenManager
  private accessToken: string | null = null
  private refreshToken: string | null = null

  private constructor() {
    // Load tokens from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('valux_access_token')
      this.refreshToken = localStorage.getItem('valux_refresh_token')
    }
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken
    this.refreshToken = refreshToken

    if (typeof window !== 'undefined') {
      localStorage.setItem('valux_access_token', accessToken)
      localStorage.setItem('valux_refresh_token', refreshToken)
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('valux_access_token')
      localStorage.removeItem('valux_refresh_token')
    }
  }
}

// API Client class
export class ApiClient {
  private axiosInstance: AxiosInstance
  private tokenManager: TokenManager
  private isRedirecting = false
  private abortController = new AbortController()

  constructor() {
    this.tokenManager = TokenManager.getInstance()

    // Create axios instance with default config
    this.axiosInstance = axios.create({
      baseURL: `${API_BASE_URL}/${API_PREFIX}`,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor for adding auth token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = this.tokenManager.getAccessToken()
        console.log('🔑 Request interceptor - token exists:', !!accessToken)
        console.log('🌐 Request URL:', config.url)
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`
          console.log('✅ Added Authorization header')
        } else {
          console.log('❌ No access token available')
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for handling auth errors and token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Return the response as-is, let HTTP methods handle processing
        return response
      },
      async (error) => {
        const originalRequest = error.config

        // Handle 401 errors - immediate redirect (no refresh for now)
        if (error.response?.status === 401 && !originalRequest._retry) {
          console.log('🚨 Got 401 error - redirecting immediately to prevent loops')
          originalRequest._retry = true

          // Skip token refresh and go straight to redirect
          console.log('❌ Authentication failed, clearing tokens and redirecting NOW')
          this.tokenManager.clearTokens()
          
          // Immediate redirect to prevent any further API calls
          if (typeof window !== 'undefined' && !this.isRedirecting) {
            this.isRedirecting = true
            // Abort all pending requests
            this.abortController.abort()
            this.abortController = new AbortController()
            // Immediate redirect - no timeout
            window.location.replace('/')
            // Also stop all pending requests
            return Promise.reject(new Error('Redirecting due to authentication failure'))
          }
          
          throw new AuthenticationError('Authentication failed. Please login again.')
        }

        // Handle other errors
        return this.handleError(error)
      }
    )
  }

  /**
   * Handle successful API response
   */
  private handleResponse<T>(response: AxiosResponse): T {
    const { data } = response

    // Handle backend API response format
    if (data && typeof data === 'object' && 'success' in data) {
      const apiResponse = data as ApiResponse<T>

      if (!apiResponse.success) {
        throw new ApiError(
          apiResponse.error || 'API request failed',
          response.status,
          undefined,
          apiResponse
        )
      }

      // Handle double-nested data structure from backend
      const responseData = apiResponse.data as any
      
      if (responseData && typeof responseData === 'object' && 'success' in responseData && 'data' in responseData) {
        return responseData.data as T
      }

      return apiResponse.data as T
    }

    return data as T
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      let errorMessage = `HTTP ${status}: ${error.response.statusText}`
      let errorCode = status.toString()
      let errorDetails: unknown = null

      if (data && typeof data === 'object') {
        errorMessage = data.message || errorMessage
        errorCode = data.code || errorCode
        errorDetails = data.details || data
      }

      throw new ApiError(errorMessage, status, errorCode, errorDetails)
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        throw new NetworkError('Request timeout')
      }
      throw new NetworkError('Network error occurred', error)
    } else {
      // Something else happened
      throw new NetworkError('Unknown error occurred', error)
    }
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.tokenManager.getRefreshToken()
    console.log('🔄 Refresh token exists:', !!refreshToken)
    
    if (!refreshToken) {
      console.log('❌ No refresh token available')
      return false
    }

    try {
      console.log('🔄 Attempting token refresh...')
      const response = await axios.post(`${API_BASE_URL}/${API_PREFIX}/auth/refresh`, {
        refresh_token: refreshToken,
      })

      console.log('🔄 Refresh response status:', response.status)
      if (response.status === 200) {
        const { access_token } = response.data
        console.log('✅ Got new access token:', !!access_token)
        this.tokenManager.setTokens(access_token, refreshToken)
        return true
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error)
    }

    return false
  }

  // HTTP Methods
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint, { params })
    // Process the response through handleResponse
    return this.handleResponse(response)
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data)
    // Process the response through handleResponse
    return this.handleResponse(response)
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data)
    // Process the response through handleResponse
    return this.handleResponse(response)
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.patch<T>(endpoint, data)
    // Process the response through handleResponse
    return this.handleResponse(response)
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint)
    // Process the response through handleResponse
    return this.handleResponse(response)
  }

  // Authentication methods
  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.tokenManager.setTokens(accessToken, refreshToken)
  }

  clearAuthTokens(): void {
    this.tokenManager.clearTokens()
  }

  isAuthenticated(): boolean {
    return this.tokenManager.getAccessToken() !== null
  }
}

// Export singleton instance
export const apiClient = new ApiClient()