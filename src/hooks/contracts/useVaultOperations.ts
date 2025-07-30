/**
 * React Hook for Vault Contract Operations
 * Provides easy-to-use interface for vault interactions
 */

import { useState, useCallback, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { vaultManagerService, TransactionResponse, GasEstimation } from '../../services/contracts/VaultManagerService'

// Transaction status types
export type TransactionStatus = 'idle' | 'estimating' | 'pending' | 'confirming' | 'confirmed' | 'failed'

// Hook return type
export interface UseVaultOperationsReturn {
  // Deposit operations
  deposit: (vaultAddress: string, amount: string) => Promise<void>
  isDepositing: boolean
  depositError: string | null
  depositTransaction: TransactionResponse | null

  // Withdrawal operations
  withdraw: (vaultAddress: string, shares: string) => Promise<void>
  isWithdrawing: boolean
  withdrawError: string | null
  withdrawTransaction: TransactionResponse | null

  // Approval operations
  approve: (vaultAddress: string, amount: string) => Promise<void>
  isApproving: boolean
  approvalError: string | null
  approvalTransaction: TransactionResponse | null

  // Gas estimation
  estimateGas: (vaultAddress: string, method: string, params: any[]) => Promise<GasEstimation | null>
  gasEstimation: GasEstimation | null
  isEstimatingGas: boolean

  // User balance operations
  getUserBalance: (vaultAddress: string) => Promise<void>
  userBalance: {
    shares: string
    underlyingValue: string
    sharePrice: string
  } | null
  isLoadingBalance: boolean

  // Vault information
  getVaultInfo: (vaultAddress: string) => Promise<void>
  vaultInfo: {
    name: string
    symbol: string
    decimals: number
    totalSupply: string
    totalAssets: string
    sharePrice: string
    apy: string
  } | null
  isLoadingVaultInfo: boolean

  // Transaction tracking
  trackTransaction: (hash: string) => Promise<TransactionResponse>
  transactionStatus: TransactionStatus
  clearTransactions: () => void

  // Utility functions
  needsApproval: (vaultAddress: string, amount: string) => Promise<boolean>
  formatAmount: (amount: string, decimals?: number) => string
  parseAmount: (amount: string, decimals?: number) => string
}

// Custom hook implementation
export function useVaultOperations(): UseVaultOperationsReturn {
  const { address: userAddress } = useAccount()

  // State management
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle')
  const [gasEstimation, setGasEstimation] = useState<GasEstimation | null>(null)
  const [isEstimatingGas, setIsEstimatingGas] = useState(false)

  // Transaction states
  const [isDepositing, setIsDepositing] = useState(false)
  const [depositError, setDepositError] = useState<string | null>(null)
  const [depositTransaction, setDepositTransaction] = useState<TransactionResponse | null>(null)

  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [withdrawError, setWithdrawError] = useState<string | null>(null)
  const [withdrawTransaction, setWithdrawTransaction] = useState<TransactionResponse | null>(null)

  const [isApproving, setIsApproving] = useState(false)
  const [approvalError, setApprovalError] = useState<string | null>(null)
  const [approvalTransaction, setApprovalTransaction] = useState<TransactionResponse | null>(null)

  // Balance and vault info states
  const [userBalance, setUserBalance] = useState<{
    shares: string
    underlyingValue: string
    sharePrice: string
  } | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const [vaultInfo, setVaultInfo] = useState<{
    name: string
    symbol: string
    decimals: number
    totalSupply: string
    totalAssets: string
    sharePrice: string
    apy: string
  } | null>(null)
  const [isLoadingVaultInfo, setIsLoadingVaultInfo] = useState(false)

  // Deposit function
  const deposit = useCallback(async (vaultAddress: string, amount: string) => {
    if (!userAddress) {
      throw new Error('Wallet not connected')
    }

    setIsDepositing(true)
    setDepositError(null)
    setTransactionStatus('estimating')

    try {
      // Check if approval is needed
      const needsApprovalCheck = await vaultManagerService.needsApproval(vaultAddress, userAddress, amount)
      
      if (needsApprovalCheck) {
        throw new Error('Token approval required. Please approve tokens first.')
      }

      setTransactionStatus('pending')
      const transaction = await vaultManagerService.deposit(vaultAddress, amount, userAddress)
      setDepositTransaction(transaction)

      setTransactionStatus('confirming')
      
      // Wait for confirmation
      await vaultManagerService.waitForTransaction(transaction.hash)
      setTransactionStatus('confirmed')

      // Refresh user balance
      getUserBalance(vaultAddress)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Deposit failed'
      setDepositError(errorMessage)
      setTransactionStatus('failed')
      throw error
    } finally {
      setIsDepositing(false)
    }
  }, [userAddress])

  // Withdrawal function
  const withdraw = useCallback(async (vaultAddress: string, shares: string) => {
    if (!userAddress) {
      throw new Error('Wallet not connected')
    }

    setIsWithdrawing(true)
    setWithdrawError(null)
    setTransactionStatus('estimating')

    try {
      setTransactionStatus('pending')
      const transaction = await vaultManagerService.withdraw(vaultAddress, shares, userAddress)
      setWithdrawTransaction(transaction)

      setTransactionStatus('confirming')
      
      // Wait for confirmation
      await vaultManagerService.waitForTransaction(transaction.hash)
      setTransactionStatus('confirmed')

      // Refresh user balance
      getUserBalance(vaultAddress)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Withdrawal failed'
      setWithdrawError(errorMessage)
      setTransactionStatus('failed')
      throw error
    } finally {
      setIsWithdrawing(false)
    }
  }, [userAddress])

  // Approval function
  const approve = useCallback(async (vaultAddress: string, amount: string) => {
    if (!userAddress) {
      throw new Error('Wallet not connected')
    }

    setIsApproving(true)
    setApprovalError(null)
    setTransactionStatus('estimating')

    try {
      setTransactionStatus('pending')
      const transaction = await vaultManagerService.approveTokens(vaultAddress, amount, userAddress)
      setApprovalTransaction(transaction)

      setTransactionStatus('confirming')
      
      // Wait for confirmation
      await vaultManagerService.waitForTransaction(transaction.hash)
      setTransactionStatus('confirmed')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Approval failed'
      setApprovalError(errorMessage)
      setTransactionStatus('failed')
      throw error
    } finally {
      setIsApproving(false)
    }
  }, [userAddress])

  // Gas estimation function
  const estimateGas = useCallback(async (vaultAddress: string, method: string, params: any[]): Promise<GasEstimation | null> => {
    if (!userAddress) {
      return null
    }

    setIsEstimatingGas(true)

    try {
      const estimation = await vaultManagerService.estimateGas(vaultAddress, method, params)
      setGasEstimation(estimation)
      return estimation
    } catch (error) {
      console.error('Gas estimation failed:', error)
      return null
    } finally {
      setIsEstimatingGas(false)
    }
  }, [userAddress])

  // Get user balance function
  const getUserBalance = useCallback(async (vaultAddress: string) => {
    if (!userAddress) {
      return
    }

    setIsLoadingBalance(true)

    try {
      const balance = await vaultManagerService.getUserVaultBalance(vaultAddress, userAddress)
      setUserBalance(balance)
    } catch (error) {
      console.error('Failed to get user balance:', error)
    } finally {
      setIsLoadingBalance(false)
    }
  }, [userAddress])

  // Get vault info function
  const getVaultInfo = useCallback(async (vaultAddress: string) => {
    setIsLoadingVaultInfo(true)

    try {
      const info = await vaultManagerService.getVaultInfo(vaultAddress)
      setVaultInfo(info)
    } catch (error) {
      console.error('Failed to get vault info:', error)
    } finally {
      setIsLoadingVaultInfo(false)
    }
  }, [])

  // Transaction tracking function
  const trackTransaction = useCallback(async (hash: string): Promise<TransactionResponse> => {
    setTransactionStatus('confirming')

    try {
      const transaction = await vaultManagerService.waitForTransaction(hash)
      setTransactionStatus('confirmed')
      return transaction
    } catch (error) {
      setTransactionStatus('failed')
      throw error
    }
  }, [])

  // Clear all transactions
  const clearTransactions = useCallback(() => {
    setDepositTransaction(null)
    setDepositError(null)
    setWithdrawTransaction(null)
    setWithdrawError(null)
    setApprovalTransaction(null)
    setApprovalError(null)
    setTransactionStatus('idle')
    setGasEstimation(null)
  }, [])

  // Check if approval is needed
  const needsApproval = useCallback(async (vaultAddress: string, amount: string): Promise<boolean> => {
    if (!userAddress) {
      return false
    }

    try {
      return await vaultManagerService.needsApproval(vaultAddress, userAddress, amount)
    } catch (error) {
      console.error('Approval check failed:', error)
      return true // Assume approval needed on error
    }
  }, [userAddress])

  // Utility function to format amounts
  const formatAmount = useCallback((amount: string, decimals: number = 18): string => {
    try {
      return ethers.formatUnits(amount, decimals)
    } catch (error) {
      return '0'
    }
  }, [])

  // Utility function to parse amounts
  const parseAmount = useCallback((amount: string, decimals: number = 18): string => {
    try {
      return ethers.parseUnits(amount, decimals).toString()
    } catch (error) {
      return '0'
    }
  }, [])

  // Auto-clear transaction status after success
  useEffect(() => {
    if (transactionStatus === 'confirmed') {
      const timer = setTimeout(() => {
        setTransactionStatus('idle')
      }, 5000) // Clear after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [transactionStatus])

  return {
    // Deposit operations
    deposit,
    isDepositing,
    depositError,
    depositTransaction,

    // Withdrawal operations
    withdraw,
    isWithdrawing,
    withdrawError,
    withdrawTransaction,

    // Approval operations
    approve,
    isApproving,
    approvalError,
    approvalTransaction,

    // Gas estimation
    estimateGas,
    gasEstimation,
    isEstimatingGas,

    // User balance operations
    getUserBalance,
    userBalance,
    isLoadingBalance,

    // Vault information
    getVaultInfo,
    vaultInfo,
    isLoadingVaultInfo,

    // Transaction tracking
    trackTransaction,
    transactionStatus,
    clearTransactions,

    // Utility functions
    needsApproval,
    formatAmount,
    parseAmount,
  }
}

// Export transaction status helper
export const getTransactionStatusMessage = (status: TransactionStatus): string => {
  switch (status) {
    case 'idle':
      return 'Ready'
    case 'estimating':
      return 'Estimating gas...'
    case 'pending':
      return 'Transaction pending...'
    case 'confirming':
      return 'Confirming transaction...'
    case 'confirmed':
      return 'Transaction confirmed!'
    case 'failed':
      return 'Transaction failed'
    default:
      return 'Unknown status'
  }
}

// Export transaction status color helper
export const getTransactionStatusColor = (status: TransactionStatus): string => {
  switch (status) {
    case 'idle':
      return 'text-gray-500'
    case 'estimating':
    case 'pending':
    case 'confirming':
      return 'text-blue-500'
    case 'confirmed':
      return 'text-green-500'
    case 'failed':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}