/**
 * Dashboard Page - Production Authentication
 * Portfolio overview with proper authentication integration
 */

'use client'

import React, { useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Download } from 'lucide-react'
import { Card, CardHeader, CardContent, Button, Badge, Loading } from '@/components/ui'
import { ProtectedPage } from '@/components/auth/AuthGuard'
import { useAuth } from '@/hooks/useAuth'
import { useAsync } from '@/hooks'
import { portfolioService } from '@/services'

const DashboardContent = () => {
  const { user, address } = useAuth()
  const userAddress = user?.address || address || '0x1234567890abcdef1234567890abcdef12345678'
  
  // Data fetching hooks
  const { 
    data: portfolioData, 
    loading: portfolioLoading, 
    error: portfolioError, 
    execute: fetchPortfolio 
  } = useAsync(async (address: string) => {
    // Handle different service return types
    if ('getPortfolioOverview' in portfolioService) {
      // Real API service returns overview directly
      const overview = await portfolioService.getPortfolioOverview(address)
      const positions = await portfolioService.getPortfolioPositions(address)
      return { positions, stats: overview }
    } else {
      // Mock service returns { positions, stats }
      return await (portfolioService as any).getPortfolioOverview(address)
    }
  })
  
  const { 
    data: transactionData, 
    loading: transactionsLoading, 
    error: transactionsError, 
    execute: fetchTransactions 
  } = useAsync((query: any) => {
    // Handle different service signatures
    if ('getPortfolioOverview' in portfolioService) {
      // Real API service
      return portfolioService.getTransactionHistory(query)
    } else {
      // Mock service expects userAddress and options
      return (portfolioService as any).getTransactionHistory(query.userAddress, { limit: query.limit })
    }
  })

  // Fetch data when component mounts (only when userAddress changes)
  useEffect(() => {
    if (userAddress) {
      fetchPortfolio(userAddress)
      // Handle different service signatures
      if (portfolioService && typeof portfolioService === 'object' && 'getPortfolioOverview' in portfolioService) {
        // Real API service
        fetchTransactions({ 
          address: userAddress, 
          limit: 10 
        })
      } else {
        // Mock service
        fetchTransactions({ 
          userAddress, 
          limit: 10 
        })
      }
    }
  }, [userAddress]) // Remove function dependencies to prevent infinite loops

  // Handle data export
  const handleExportData = async () => {
    try {
      // Handle different service signatures
      let exportResult: any
      if ('getPortfolioOverview' in portfolioService) {
        // Real API service expects PortfolioExportQueryDto
        exportResult = await (portfolioService as any).exportPortfolioData({ 
          address: userAddress, 
          format: 'csv' 
        } as any)
      } else {
        // Mock service expects separate parameters
        exportResult = await (portfolioService as any).exportPortfolioData(userAddress, 'csv')
      }
      console.log('Export result:', exportResult)
      // In production, this would trigger a download
      const filename = typeof exportResult === 'object' && 'filename' in exportResult ? exportResult.filename : 'portfolio_export.csv'
      alert(`Export ready: ${filename}`)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  // Loading state
  if (portfolioLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Loading />
            <p className="mt-4 text-gray-600">Loading your portfolio...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (portfolioError) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800">Failed to Load Portfolio</h3>
              <p className="mt-2 text-red-600">{portfolioError}</p>
              <Button 
                onClick={() => fetchPortfolio(userAddress)} 
                variant="primary" 
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Extract data with proper typing
  const positions = portfolioData ? (portfolioData as any).positions || [] : []
  const stats = portfolioData ? (portfolioData as any).stats : undefined
  const transactions = transactionData ? 
    (transactionData && typeof transactionData === 'object' && 'transactions' in transactionData ? 
      (transactionData as any).transactions : []) 
    : []

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Track your DeFi investments and automation rules
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button onClick={handleExportData} variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8">
          <Card className="p-4 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats ? parseFloat(stats.totalValue).toLocaleString() : '0'}
                </p>
                <p className="text-sm text-green-600">
                  +{stats ? stats.performance['30d'] : '0'}% (30d)
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">P&L</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats ? parseFloat(stats.totalPnL).toLocaleString() : '0'}
                </p>
                <p className="text-sm text-blue-600">
                  {stats ? stats.avgAPY : '0%'} APY
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">Positions</p>
                <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
                <p className="text-sm text-purple-600">
                  {stats ? stats.activePositions : 0} active
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 lg:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 truncate">Rules</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats ? stats.activeRules : 0}
                </p>
                <p className="text-sm text-orange-600">Active</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Positions */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Current Positions</h2>
              </CardHeader>
              <CardContent>
                {positions.length > 0 ? (
                  <div className="space-y-4">
                    {positions.map((position: any) => (
                      <div key={position.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {position.asset}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{position.vaultName}</p>
                            <p className="text-sm text-gray-500">
                              {position.apy} APY
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${parseFloat(position.currentValue).toLocaleString()}
                          </p>
                          <Badge variant={position.gainLoss.startsWith('+') ? 'success' : 'danger'}>
                            {position.gainLossPercentage}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No positions yet</h3>
                    <p className="text-gray-500 mb-4">Start investing in vaults to see your positions here</p>
                    <Button variant="primary">
                      Browse Vaults
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div>
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {(transactions as any[]).slice(0, 5).map((transaction: any) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === 'deposit' ? 'bg-green-100' : 
                            transaction.type === 'withdraw' ? 'bg-red-100' : 'bg-blue-100'
                          }`}>
                            {transaction.type === 'deposit' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : transaction.type === 'withdraw' ? (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">
                              {transaction.type}
                            </p>
                            <p className="text-xs text-gray-500">{transaction.vaultName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {transaction.amount} {transaction.asset}
                          </p>
                          <Badge 
                            variant={
                              transaction.status === 'completed' ? 'success' : 
                              transaction.status === 'pending' ? 'warning' : 'danger'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <DashboardContent />
    </ProtectedPage>
  )
}