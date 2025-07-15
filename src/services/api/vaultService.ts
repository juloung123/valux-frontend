/**
 * Vault Service
 * Handles vault-related API calls
 */

import { apiClient } from './client'
import { 
  VaultDto, 
  VaultPerformanceDto, 
  VaultFilterDto, 
  PaginatedResponse 
} from './types'
import { 
  transformVault, 
  transformVaultFilters 
} from './transformers'
import { Vault, VaultFilters } from '../../types'

export class VaultService {
  /**
   * Get all available vaults with filtering
   */
  async getVaults(filters?: Partial<VaultFilters>): Promise<Vault[]> {
    const backendFilters = filters ? transformVaultFilters(filters) : {}
    
    // Create clean params object, filtering out undefined values
    const params: Record<string, string> = {}
    
    if (backendFilters.search) params.search = backendFilters.search
    if (backendFilters.riskLevel) params.riskLevel = backendFilters.riskLevel
    if (backendFilters.category) params.category = backendFilters.category
    if (backendFilters.minAPY) params.minAPY = backendFilters.minAPY.toString()
    if (backendFilters.maxAPY) params.maxAPY = backendFilters.maxAPY.toString()
    if (backendFilters.page) params.page = backendFilters.page.toString()
    if (backendFilters.limit) params.limit = backendFilters.limit.toString()
    
    // API client unwraps the response.data, so we get the direct data object
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    if (!response || !response.vaults) {
      throw new Error(`Invalid API response structure: ${JSON.stringify(response)}`)
    }
    
    return response.vaults.map(transformVault)
  }

  /**
   * Get paginated vaults with metadata
   */
  async getVaultsPaginated(filters?: Partial<VaultFilters & { page: number; limit: number }>) {
    const backendFilters = filters ? transformVaultFilters(filters) : {}
    
    // Create clean params object, filtering out undefined values
    const params: Record<string, string> = {}
    
    if (backendFilters.search) params.search = backendFilters.search
    if (backendFilters.riskLevel) params.riskLevel = backendFilters.riskLevel
    if (backendFilters.category) params.category = backendFilters.category
    if (backendFilters.minAPY) params.minAPY = backendFilters.minAPY.toString()
    if (backendFilters.maxAPY) params.maxAPY = backendFilters.maxAPY.toString()
    if (backendFilters.page) params.page = backendFilters.page.toString()
    if (backendFilters.limit) params.limit = backendFilters.limit.toString()
    
    // API client unwraps the response.data, so we get the direct data object
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return {
      vaults: response.vaults.map(transformVault),
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
      hasNext: response.page < response.totalPages,
      hasPrev: response.page > 1,
    }
  }

  /**
   * Get specific vault by ID
   */
  async getVaultById(id: string): Promise<Vault | null> {
    try {
      const vaultDto = await apiClient.get<VaultDto>(`/vaults/${id}`)
      return transformVault(vaultDto)
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  /**
   * Get vault by contract address
   */
  async getVaultByAddress(address: string): Promise<Vault | null> {
    try {
      const vaultDto = await apiClient.get<VaultDto>(`/vaults/address/${address}`)
      return transformVault(vaultDto)
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  /**
   * Get vault performance metrics
   */
  async getVaultPerformance(id: string): Promise<{
    vaultId: string
    currentAPY: number
    historicalAPY: Array<{ date: string; apy: number }>
    tvlHistory: Array<{ date: string; tvl: string }>
    lastUpdated: string
  }> {
    const performance = await apiClient.get<VaultPerformanceDto>(`/vaults/${id}/performance`)
    return performance
  }

  /**
   * Get all active vaults (helper method)
   */
  async getActiveVaults(): Promise<Vault[]> {
    const params: Record<string, string> = {
      active: 'true',
      limit: '100', // Get all active vaults
    }
    
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return response.vaults.map(transformVault)
  }

  /**
   * Search vaults by name or protocol
   */
  async searchVaults(query: string): Promise<Vault[]> {
    const params: Record<string, string> = {
      search: query,
      limit: '50',
    }
    
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return response.vaults.map(transformVault)
  }

  /**
   * Get vaults by risk level
   */
  async getVaultsByRisk(riskLevel: 'low' | 'medium' | 'high'): Promise<Vault[]> {
    const params: Record<string, string> = {
      riskLevel: riskLevel,
      limit: '50',
    }
    
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return response.vaults.map(transformVault)
  }

  /**
   * Get vaults by category
   */
  async getVaultsByCategory(category: 'stable' | 'yield' | 'growth'): Promise<Vault[]> {
    const params: Record<string, string> = {
      category: category,
      limit: '50',
    }
    
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return response.vaults.map(transformVault)
  }

  /**
   * Get vaults by protocol
   */
  async getVaultsByProtocol(protocol: string): Promise<Vault[]> {
    const params: Record<string, string> = {
      protocol: protocol,
      limit: '50',
    }
    
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return response.vaults.map(transformVault)
  }

  /**
   * Get top performing vaults
   */
  async getTopPerformingVaults(limit: number = 10): Promise<Vault[]> {
    const params: Record<string, string> = {
      sortBy: 'apy',
      sortOrder: 'desc',
      limit: limit.toString(),
    }
    
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return response.vaults.map(transformVault)
  }

  /**
   * Get vaults by TVL (highest first)
   */
  async getVaultsByTvl(limit: number = 10): Promise<Vault[]> {
    const params: Record<string, string> = {
      sortBy: 'tvl',
      sortOrder: 'desc',
      limit: limit.toString(),
    }
    
    const response = await apiClient.get<{ vaults: VaultDto[]; total: number; page: number; limit: number; totalPages: number }>('/vaults', params)
    
    return response.vaults.map(transformVault)
  }

  // TODO: These methods will be implemented when blockchain integration is ready
  // For now, they throw errors to indicate they're not yet available

  /**
   * Deposit into vault
   * TODO: Implement when blockchain integration is ready
   */
  async deposit(vaultId: string, amount: string, userAddress: string): Promise<{
    success: boolean
    transactionHash: string
    message: string
  }> {
    throw new Error('Deposit functionality not yet implemented. Blockchain integration required.')
  }

  /**
   * Withdraw from vault
   * TODO: Implement when blockchain integration is ready
   */
  async withdraw(vaultId: string, amount: string, userAddress: string): Promise<{
    success: boolean
    transactionHash: string
    message: string
  }> {
    throw new Error('Withdraw functionality not yet implemented. Blockchain integration required.')
  }

  /**
   * Get user's vault balance
   * TODO: Implement when blockchain integration is ready
   */
  async getUserVaultBalance(vaultId: string, userAddress: string): Promise<string> {
    throw new Error('Balance checking not yet implemented. Blockchain integration required.')
  }

  /**
   * Get user's vault positions
   * TODO: Implement when blockchain integration is ready
   */
  async getUserVaultPositions(userAddress: string): Promise<any[]> {
    throw new Error('Position tracking not yet implemented. Blockchain integration required.')
  }
}

export const vaultService = new VaultService()