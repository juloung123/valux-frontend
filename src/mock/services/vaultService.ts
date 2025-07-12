import { mockVaults } from '../data/vaults'
import { type Vault, type VaultFilters } from '@/types'

/**
 * Mock Vault Service
 * Simulates API calls for vault-related operations
 * 
 * TODO: Replace with actual API integration
 * - Implement real HTTP client (axios/fetch)
 * - Add proper error handling
 * - Implement caching strategy
 * - Add retry logic for failed requests
 */

class MockVaultService {
  /**
   * Get all available vaults
   * TODO: Replace with GET /api/vaults
   */
  async getVaults(filters?: Partial<VaultFilters>): Promise<Vault[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredVaults = [...mockVaults]
    
    if (filters) {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredVaults = filteredVaults.filter(vault =>
          vault.name.toLowerCase().includes(searchTerm) ||
          vault.asset.toLowerCase().includes(searchTerm) ||
          vault.protocol.toLowerCase().includes(searchTerm)
        )
      }
      
      if (filters.risk && filters.risk !== 'All') {
        filteredVaults = filteredVaults.filter(vault => vault.risk === filters.risk)
      }
      
      if (filters.category && filters.category !== 'All') {
        filteredVaults = filteredVaults.filter(vault => vault.category === filters.category)
      }
      
      if (filters.minAPY) {
        const minAPY = parseFloat(filters.minAPY)
        filteredVaults = filteredVaults.filter(vault => 
          parseFloat(vault.apy.replace('%', '')) >= minAPY
        )
      }
    }
    
    return filteredVaults
  }

  /**
   * Get specific vault by ID
   * TODO: Replace with GET /api/vaults/{id}
   */
  async getVaultById(id: string): Promise<Vault | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const vault = mockVaults.find(v => v.id === id)
    return vault || null
  }

  /**
   * Get vault performance metrics
   * TODO: Replace with GET /api/vaults/{id}/performance
   */
  async getVaultPerformance(id: string): Promise<{
    historicalAPY: Array<{ date: string; apy: number }>
    riskMetrics: { volatility: number; sharpeRatio: number }
    fees: { managementFee: number; performanceFee: number }
  }> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // TODO: Use id to fetch specific vault performance data when integrating real API
    console.log(`Fetching performance data for vault ${id}`)
    
    // Mock performance data
    return {
      historicalAPY: [
        { date: '2024-01-01', apy: 4.1 },
        { date: '2024-01-15', apy: 4.3 },
        { date: '2024-01-30', apy: 4.2 }
      ],
      riskMetrics: {
        volatility: 0.05,
        sharpeRatio: 1.2
      },
      fees: {
        managementFee: 0.5, // 0.5%
        performanceFee: 10  // 10%
      }
    }
  }

  /**
   * Deposit into vault
   * TODO: Replace with POST /api/vaults/{id}/deposit
   * Integrate with smart contract interaction
   */
  async deposit(vaultId: string, amount: string, userAddress: string): Promise<{
    success: boolean
    transactionHash: string
    message: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate blockchain delay
    
    // TODO: Add validation for vaultId and userAddress when integrating real API
    console.log(`Depositing ${amount} to vault ${vaultId} for user ${userAddress}`)
    
    // Mock successful deposit
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      message: `Successfully deposited ${amount} into vault`
    }
  }

  /**
   * Withdraw from vault
   * TODO: Replace with POST /api/vaults/{id}/withdraw
   * Integrate with smart contract interaction
   */
  async withdraw(vaultId: string, amount: string, userAddress: string): Promise<{
    success: boolean
    transactionHash: string
    message: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate blockchain delay
    
    // TODO: Add validation for vaultId and userAddress when integrating real API
    console.log(`Withdrawing ${amount} from vault ${vaultId} for user ${userAddress}`)
    
    // Mock successful withdrawal
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      message: `Successfully withdrew ${amount} from vault`
    }
  }
}

export const vaultService = new MockVaultService()