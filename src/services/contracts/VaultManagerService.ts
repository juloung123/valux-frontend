/**
 * Mock Smart Contract Service for Vault Manager
 * Simulates blockchain interactions for development purposes
 */

import { ethers } from 'ethers'
import { Vault, Transaction } from '../../types'

// Mock transaction response type
export interface TransactionResponse {
  hash: string
  blockNumber?: number
  blockHash?: string
  timestamp?: number
  confirmations: number
  from: string
  to: string
  value: string
  gasPrice: string
  gasLimit: string
  gasUsed?: string
  status: 'pending' | 'confirmed' | 'failed'
  receipt?: {
    status: number
    gasUsed: string
    logs: any[]
  }
}

// Mock gas estimation response
export interface GasEstimation {
  gasLimit: string
  gasPrice: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  estimatedCost: string
  estimatedTime: string
}

// Vault contract interface
export interface VaultContract {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  balanceOf(address: string): Promise<string>
  allowance(owner: string, spender: string): Promise<string>
  approve(spender: string, amount: string): Promise<TransactionResponse>
  deposit(amount: string): Promise<TransactionResponse>
  withdraw(shares: string): Promise<TransactionResponse>
  getSharePrice(): Promise<string>
  getTotalAssets(): Promise<string>
}

// Mock vault contract implementation
class MockVaultContract implements VaultContract {
  constructor(
    public address: string,
    public name: string,
    public symbol: string,
    public decimals: number = 18
  ) {}

  get totalSupply(): string {
    // Mock total supply based on vault TVL
    return ethers.parseUnits('1000000', this.decimals).toString()
  }

  async balanceOf(address: string): Promise<string> {
    // Mock user balance - simulate user has some shares
    const mockBalance = Math.random() * 1000
    return ethers.parseUnits(mockBalance.toFixed(6), this.decimals).toString()
  }

  async allowance(owner: string, spender: string): Promise<string> {
    // Mock allowance - return high allowance for development
    return ethers.parseUnits('999999999', this.decimals).toString()
  }

  async approve(spender: string, amount: string): Promise<TransactionResponse> {
    return this.simulateTransaction('approve', {
      to: this.address,
      value: '0',
      data: `approve(${spender}, ${amount})`
    })
  }

  async deposit(amount: string): Promise<TransactionResponse> {
    return this.simulateTransaction('deposit', {
      to: this.address,
      value: amount,
      data: `deposit(${amount})`
    })
  }

  async withdraw(shares: string): Promise<TransactionResponse> {
    return this.simulateTransaction('withdraw', {
      to: this.address,
      value: '0',
      data: `withdraw(${shares})`
    })
  }

  async getSharePrice(): Promise<string> {
    // Mock share price - simulate 1 share = 1.05 underlying tokens (5% profit)
    const mockPrice = 1.05 + (Math.random() * 0.1) // 1.05 - 1.15
    return ethers.parseUnits(mockPrice.toFixed(6), this.decimals).toString()
  }

  async getTotalAssets(): Promise<string> {
    // Mock total assets - simulate vault has grown
    const mockAssets = 1000000 + (Math.random() * 100000) // 1M - 1.1M
    return ethers.parseUnits(mockAssets.toFixed(6), this.decimals).toString()
  }

  private async simulateTransaction(method: string, params: {
    to: string
    value: string
    data: string
  }): Promise<TransactionResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate mock transaction hash
    const hash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
    
    // Mock from address (user wallet)
    const from = '0x1234567890123456789012345678901234567890'
    
    // Mock gas values
    const gasPrice = ethers.parseUnits('20', 'gwei').toString()
    const gasLimit = '200000'
    const gasUsed = '150000'
    
    const transaction: TransactionResponse = {
      hash,
      from,
      to: params.to,
      value: params.value,
      gasPrice,
      gasLimit,
      gasUsed,
      confirmations: 0,
      status: 'pending'
    }

    // Simulate transaction confirmation after delay
    setTimeout(() => {
      transaction.status = Math.random() > 0.05 ? 'confirmed' : 'failed' // 95% success rate
      transaction.confirmations = 1
      transaction.blockNumber = Math.floor(Math.random() * 1000000) + 18000000
      transaction.blockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
      transaction.timestamp = Date.now()
      
      if (transaction.status === 'confirmed') {
        transaction.receipt = {
          status: 1,
          gasUsed,
          logs: []
        }
      }
    }, 3000 + Math.random() * 5000) // 3-8 seconds for confirmation

    return transaction
  }
}

// Main Vault Manager Service
export class VaultManagerService {
  private contracts: Map<string, MockVaultContract> = new Map()
  private transactions: Map<string, TransactionResponse> = new Map()

  constructor() {
    this.initializeMockContracts()
  }

  /**
   * Initialize mock contracts for development
   */
  private initializeMockContracts() {
    const mockVaults = [
      { address: '0xaave123...', name: 'Aave USDC Vault', symbol: 'aUSDC' },
      { address: '0xlido456...', name: 'Lido stETH Vault', symbol: 'stETH' },
      { address: '0xcomp789...', name: 'Compound ETH Vault', symbol: 'cETH' },
      { address: '0xcurve012...', name: 'Curve 3Pool Vault', symbol: 'c3CRV' },
      { address: '0xyearn345...', name: 'Yearn DAI Vault', symbol: 'yDAI' },
      { address: '0xbal678...', name: 'Balancer Vault', symbol: 'BAL' }
    ]

    mockVaults.forEach(vault => {
      this.contracts.set(vault.address, new MockVaultContract(
        vault.address,
        vault.name,
        vault.symbol
      ))
    })
  }

  /**
   * Get vault contract by address
   */
  getVaultContract(address: string): VaultContract | null {
    return this.contracts.get(address) || null
  }

  /**
   * Get all available vault contracts
   */
  getAllVaultContracts(): VaultContract[] {
    return Array.from(this.contracts.values())
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(vaultAddress: string, method: string, params: any[]): Promise<GasEstimation> {
    // Simulate gas estimation delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000))

    // Mock gas estimation based on method
    const baseGas = {
      'approve': 50000,
      'deposit': 150000,
      'withdraw': 120000,
      'transfer': 21000
    }[method] || 100000

    const gasLimit = (baseGas + Math.floor(Math.random() * 20000)).toString()
    const gasPrice = ethers.parseUnits((15 + Math.random() * 10).toFixed(2), 'gwei').toString()
    const maxFeePerGas = ethers.parseUnits((20 + Math.random() * 15).toFixed(2), 'gwei').toString()
    const maxPriorityFeePerGas = ethers.parseUnits((2 + Math.random() * 3).toFixed(2), 'gwei').toString()
    
    const estimatedCostWei = BigInt(gasLimit) * BigInt(gasPrice)
    const estimatedCost = ethers.formatEther(estimatedCostWei)
    
    const estimatedTime = Math.floor(15 + Math.random() * 30) // 15-45 seconds

    return {
      gasLimit,
      gasPrice,
      maxFeePerGas,
      maxPriorityFeePerGas,
      estimatedCost,
      estimatedTime: `${estimatedTime}s`
    }
  }

  /**
   * Get transaction by hash
   */
  getTransaction(hash: string): TransactionResponse | null {
    return this.transactions.get(hash) || null
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(hash: string, confirmations: number = 1): Promise<TransactionResponse> {
    return new Promise((resolve, reject) => {
      const checkStatus = () => {
        const tx = this.transactions.get(hash)
        if (!tx) {
          reject(new Error('Transaction not found'))
          return
        }

        if (tx.status === 'failed') {
          reject(new Error('Transaction failed'))
          return
        }

        if (tx.status === 'confirmed' && tx.confirmations >= confirmations) {
          resolve(tx)
          return
        }

        // Check again in 1 second
        setTimeout(checkStatus, 1000)
      }

      checkStatus()
    })
  }

  /**
   * Simulate deposit transaction
   */
  async deposit(vaultAddress: string, amount: string, userAddress: string): Promise<TransactionResponse> {
    const contract = this.getVaultContract(vaultAddress)
    if (!contract) {
      throw new Error('Vault contract not found')
    }

    const transaction = await contract.deposit(amount)
    this.transactions.set(transaction.hash, transaction)
    return transaction
  }

  /**
   * Simulate withdrawal transaction
   */
  async withdraw(vaultAddress: string, shares: string, userAddress: string): Promise<TransactionResponse> {
    const contract = this.getVaultContract(vaultAddress)
    if (!contract) {
      throw new Error('Vault contract not found')
    }

    const transaction = await contract.withdraw(shares)
    this.transactions.set(transaction.hash, transaction)
    return transaction
  }

  /**
   * Get user vault balance
   */
  async getUserVaultBalance(vaultAddress: string, userAddress: string): Promise<{
    shares: string
    underlyingValue: string
    sharePrice: string
  }> {
    const contract = this.getVaultContract(vaultAddress)
    if (!contract) {
      throw new Error('Vault contract not found')
    }

    const [shares, sharePrice] = await Promise.all([
      contract.balanceOf(userAddress),
      contract.getSharePrice()
    ])

    // Calculate underlying value
    const sharesDecimal = ethers.formatUnits(shares, contract.decimals)
    const priceDecimal = ethers.formatUnits(sharePrice, contract.decimals)
    const underlyingValue = (parseFloat(sharesDecimal) * parseFloat(priceDecimal)).toString()

    return {
      shares,
      underlyingValue: ethers.parseUnits(underlyingValue.slice(0, 10), contract.decimals).toString(),
      sharePrice
    }
  }

  /**
   * Get vault information
   */
  async getVaultInfo(vaultAddress: string): Promise<{
    name: string
    symbol: string
    decimals: number
    totalSupply: string
    totalAssets: string
    sharePrice: string
    apy: string
  }> {
    const contract = this.getVaultContract(vaultAddress)
    if (!contract) {
      throw new Error('Vault contract not found')
    }

    const [totalAssets, sharePrice] = await Promise.all([
      contract.getTotalAssets(),
      contract.getSharePrice()
    ])

    // Mock APY calculation
    const mockApy = (5 + Math.random() * 10).toFixed(2) // 5-15% APY

    return {
      name: contract.name,
      symbol: contract.symbol,
      decimals: contract.decimals,
      totalSupply: contract.totalSupply,
      totalAssets,
      sharePrice,
      apy: mockApy
    }
  }

  /**
   * Check if user needs to approve tokens
   */
  async needsApproval(vaultAddress: string, userAddress: string, amount: string): Promise<boolean> {
    const contract = this.getVaultContract(vaultAddress)
    if (!contract) {
      throw new Error('Vault contract not found')
    }

    const allowance = await contract.allowance(userAddress, vaultAddress)
    return BigInt(allowance) < BigInt(amount)
  }

  /**
   * Approve tokens for vault
   */
  async approveTokens(vaultAddress: string, amount: string, userAddress: string): Promise<TransactionResponse> {
    const contract = this.getVaultContract(vaultAddress)
    if (!contract) {
      throw new Error('Vault contract not found')
    }

    const transaction = await contract.approve(vaultAddress, amount)
    this.transactions.set(transaction.hash, transaction)
    return transaction
  }
}

// Export singleton instance
export const vaultManagerService = new VaultManagerService()

// Export types
export type { VaultContract as VaultContractType, TransactionResponse as TransactionResponseType, GasEstimation as GasEstimationType }