/**
 * Vault Operations Component
 * Provides deposit and withdrawal UI for vault interactions
 */

import React, { useState, useEffect } from 'react'
import { Wallet, ArrowUp, ArrowDown, Loader, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { Button, Input, Card, Loading, Modal } from '../ui'
import { useVaultOperations, getTransactionStatusMessage, getTransactionStatusColor } from '../../hooks/contracts/useVaultOperations'
import { useAccount } from 'wagmi'
import { Vault } from '../../types'

interface VaultOperationsProps {
  vault: Vault
  onTransactionSuccess?: () => void
}

export const VaultOperations: React.FC<VaultOperationsProps> = ({ vault, onTransactionSuccess }) => {
  const { address: userAddress, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit')
  const [amount, setAmount] = useState('')
  const [showGasEstimation, setShowGasEstimation] = useState(false)

  const {
    deposit,
    withdraw,
    approve,
    isDepositing,
    isWithdrawing,
    isApproving,
    depositError,
    withdrawError,
    approvalError,
    depositTransaction,
    withdrawTransaction,
    approvalTransaction,
    transactionStatus,
    getUserBalance,
    userBalance,
    isLoadingBalance,
    getVaultInfo,
    vaultInfo,
    isLoadingVaultInfo,
    estimateGas,
    gasEstimation,
    isEstimatingGas,
    needsApproval,
    formatAmount,
    parseAmount,
    clearTransactions
  } = useVaultOperations()

  // Load user balance and vault info on mount
  useEffect(() => {
    if (isConnected && userAddress && vault.id) {
      getUserBalance(vault.contractAddress || '0xaave123...')
      getVaultInfo(vault.contractAddress || '0xaave123...')
    }
  }, [isConnected, userAddress, vault.id, vault.contractAddress, getUserBalance, getVaultInfo])

  // Auto-estimate gas when amount changes
  useEffect(() => {
    if (amount && parseFloat(amount) > 0 && isConnected) {
      const estimateTransaction = async () => {
        const parsedAmount = parseAmount(amount)
        const method = activeTab === 'deposit' ? 'deposit' : 'withdraw'
        await estimateGas(vault.contractAddress || '0xaave123...', method, [parsedAmount])
      }
      
      const debounce = setTimeout(estimateTransaction, 1000)
      return () => clearTimeout(debounce)
    }
  }, [amount, activeTab, isConnected, vault.contractAddress, estimateGas, parseAmount])

  // Handle successful transactions
  useEffect(() => {
    if (transactionStatus === 'confirmed') {
      setAmount('')
      onTransactionSuccess?.()
    }
  }, [transactionStatus, onTransactionSuccess])

  const handleDeposit = async () => {
    if (!amount || !userAddress) return

    try {
      const parsedAmount = parseAmount(amount)
      const contractAddress = vault.contractAddress || '0xaave123...'

      // Check if approval is needed
      const needsApprovalCheck = await needsApproval(contractAddress, parsedAmount)
      
      if (needsApprovalCheck) {
        // Request approval first
        await approve(contractAddress, parsedAmount)
        return
      }

      // Proceed with deposit
      await deposit(contractAddress, parsedAmount)
    } catch (error) {
      console.error('Deposit failed:', error)
    }
  }

  const handleWithdraw = async () => {
    if (!amount || !userAddress) return

    try {
      const parsedAmount = parseAmount(amount)
      const contractAddress = vault.contractAddress || '0xaave123...'
      
      await withdraw(contractAddress, parsedAmount)
    } catch (error) {
      console.error('Withdrawal failed:', error)
    }
  }

  const handleMaxAmount = () => {
    if (activeTab === 'deposit') {
      // For demo purposes, set a reasonable max deposit amount
      setAmount('1000')
    } else if (userBalance) {
      // Set max withdrawal to user's balance
      const maxShares = formatAmount(userBalance.shares)
      setAmount(maxShares)
    }
  }

  const isLoading = isDepositing || isWithdrawing || isApproving
  const hasError = depositError || withdrawError || approvalError
  const currentTransaction = depositTransaction || withdrawTransaction || approvalTransaction

  // Get current operation button text
  const getButtonText = () => {
    if (isApproving) return 'Approving...'
    if (isDepositing) return 'Depositing...'
    if (isWithdrawing) return 'Withdrawing...'
    if (activeTab === 'deposit') return 'Deposit'
    return 'Withdraw'
  }

  if (!isConnected) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Wallet</h3>
          <p className="text-gray-500 mb-4">Connect your wallet to interact with this vault</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('deposit')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'deposit'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ArrowUp className="h-4 w-4 inline mr-2" />
          Deposit
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'withdraw'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ArrowDown className="h-4 w-4 inline mr-2" />
          Withdraw
        </button>
      </div>

      {/* Vault Information */}
      {isLoadingVaultInfo ? (
        <Card className="p-4">
          <Loading />
        </Card>
      ) : vaultInfo && (
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">APY</p>
              <p className="font-semibold text-green-600">{vaultInfo.apy}%</p>
            </div>
            <div>
              <p className="text-gray-500">Share Price</p>
              <p className="font-semibold">{parseFloat(formatAmount(vaultInfo.sharePrice)).toFixed(4)}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Assets</p>
              <p className="font-semibold">${(parseFloat(formatAmount(vaultInfo.totalAssets)) / 1000000).toFixed(2)}M</p>
            </div>
            <div>
              <p className="text-gray-500">Your Balance</p>
              {isLoadingBalance ? (
                <Loading size="sm" />
              ) : userBalance ? (
                <p className="font-semibold">{parseFloat(formatAmount(userBalance.underlyingValue)).toFixed(4)} tokens</p>
              ) : (
                <p className="font-semibold">0.00 tokens</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Operation Form */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeTab === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
            </label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Enter ${activeTab} amount`}
                className="pr-20"
                disabled={isLoading}
              />
              <button
                onClick={handleMaxAmount}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                disabled={isLoading}
              >
                MAX
              </button>
            </div>
          </div>

          {/* Gas Estimation */}
          {gasEstimation && !isEstimatingGas && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center text-sm text-blue-700">
                <Info className="h-4 w-4 mr-2" />
                <span>Estimated gas: {parseFloat(gasEstimation.estimatedCost).toFixed(6)} ETH (~{gasEstimation.estimatedTime})</span>
              </div>
            </div>
          )}

          {/* Transaction Status */}
          {transactionStatus !== 'idle' && (
            <div className={`flex items-center p-3 rounded-lg ${
              transactionStatus === 'failed' ? 'bg-red-50 border border-red-200' :
              transactionStatus === 'confirmed' ? 'bg-green-50 border border-green-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              {transactionStatus === 'confirmed' ? (
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              ) : transactionStatus === 'failed' ? (
                <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
              ) : (
                <Loader className="h-4 w-4 mr-2 animate-spin text-blue-600" />
              )}
              <span className={`text-sm font-medium ${getTransactionStatusColor(transactionStatus)}`}>
                {getTransactionStatusMessage(transactionStatus)}
              </span>
            </div>
          )}

          {/* Error Display */}
          {hasError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center text-sm text-red-700">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>{hasError}</span>
              </div>
            </div>
          )}

          {/* Transaction Hash */}
          {currentTransaction && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
              <p className="text-sm font-mono text-gray-700 break-all">{currentTransaction.hash}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
              disabled={!amount || parseFloat(amount) <= 0 || isLoading}
              loading={isLoading}
              className="flex-1"
            >
              {getButtonText()}
            </Button>
            
            {(hasError || currentTransaction) && (
              <Button
                variant="outline"
                onClick={clearTransactions}
                disabled={isLoading}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Gas Estimation Toggle */}
          <button
            onClick={() => setShowGasEstimation(!showGasEstimation)}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showGasEstimation ? 'Hide' : 'Show'} gas estimation details
          </button>

          {/* Detailed Gas Estimation */}
          {showGasEstimation && gasEstimation && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-500">Gas Limit:</p>
                  <p className="font-mono">{parseInt(gasEstimation.gasLimit).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Gas Price:</p>
                  <p className="font-mono">{parseFloat(formatAmount(gasEstimation.gasPrice, 9)).toFixed(2)} Gwei</p>
                </div>
                <div>
                  <p className="text-gray-500">Max Fee:</p>
                  <p className="font-mono">{parseFloat(formatAmount(gasEstimation.maxFeePerGas || '0', 9)).toFixed(2)} Gwei</p>
                </div>
                <div>
                  <p className="text-gray-500">Priority Fee:</p>
                  <p className="font-mono">{parseFloat(formatAmount(gasEstimation.maxPriorityFeePerGas || '0', 9)).toFixed(2)} Gwei</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

export default VaultOperations