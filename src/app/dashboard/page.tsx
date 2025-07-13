'use client'

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Download } from 'lucide-react'
import { Card, CardHeader, CardContent, Button, Badge, Loading } from '@/components/ui'
import { useAsync } from '@/hooks'
import { portfolioService } from '@/mock'

/**
 * Dashboard Page Component
 * 
 * TODO: Future API Integration Tasks:
 * 1. Connect to user wallet for automatic address detection
 * 2. Replace portfolioService with real API client
 * 3. Add real-time portfolio updates via WebSocket
 * 4. Implement portfolio analytics and performance charts
 * 5. Add portfolio rebalancing suggestions
 * 6. Integrate with tax calculation service for exports
 */

const DashboardPage = () => {
  // TODO: Get user address from wallet connection
  const [userAddress] = useState('0x1234567890abcdef1234567890abcdef12345678') // Mock address
  
  // Use async hooks for data fetching
  const { 
    data: portfolioData, 
    loading: portfolioLoading, 
    error: portfolioError, 
    execute: fetchPortfolio 
  } = useAsync(portfolioService.getPortfolio)
  
  const { 
    data: transactionData, 
    loading: transactionsLoading, 
    error: transactionsError, 
    execute: fetchTransactions 
  } = useAsync(portfolioService.getTransactionHistory)

  // Fetch data on component mount
  useEffect(() => {
    if (userAddress) {
      fetchPortfolio(userAddress)
      fetchTransactions(userAddress, { limit: 10 })
    }
  }, [userAddress, fetchPortfolio, fetchTransactions])

  // Extract data with fallbacks
  const positions = portfolioData?.positions || []
  const stats = portfolioData?.stats
  const transactions = transactionData?.transactions || []

  const handleExportData = async () => {
    // TODO: Implement real export functionality
    // 1. Generate comprehensive portfolio report
    // 2. Include transaction history for tax purposes
    // 3. Add performance analytics and insights
    // 4. Support multiple export formats (CSV, PDF, JSON)
    try {
      const exportResult = await portfolioService.exportPortfolioData(userAddress, 'csv')
      // In real implementation, trigger download
      console.log('Export result:', exportResult)
      alert(`Export ready: ${exportResult.filename}`)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }

  if (portfolioLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          {/* Loading Header */}
          <div className="mb-6 lg:mb-10">
            <div className="animate-pulse">
              <div className="h-8 sm:h-10 bg-gray-200 rounded-lg w-80 mb-2"></div>
              <div className="h-4 sm:h-5 bg-gray-100 rounded w-96"></div>
            </div>
          </div>

          {/* Loading Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-10">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-white shadow-sm border-0 animate-pulse" padding="md">
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Loading Positions */}
            <div className="xl:col-span-2">
              <Card className="bg-white shadow-sm border-0 animate-pulse">
                <CardHeader className="border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-48"></div>
                            <div className="h-3 bg-gray-100 rounded w-32"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-100 rounded w-16"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Loading Sidebar */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-white shadow-sm border-0 animate-pulse">
                  <CardHeader className="border-b border-gray-100">
                    <div className="h-5 bg-gray-200 rounded w-28"></div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-16 bg-gray-50 rounded-lg"></div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (portfolioError) {
    return (
      <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
          <div className="min-h-[60vh] flex items-center justify-center">
            <Card className="text-center max-w-md mx-auto border-red-200 bg-red-50" padding="lg">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Activity className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-red-900 mb-2">
                  Failed to load portfolio
                </h3>
                <p className="text-sm text-red-700 mb-6">
                  {portfolioError}
                </p>
                <div className="space-y-3">
                  <Button 
                    variant="primary" 
                    onClick={() => fetchPortfolio(userAddress)}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Refresh Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="mb-6 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
                Portfolio Dashboard
              </h1>
              <p className="mt-1 sm:mt-2 text-base sm:text-lg text-gray-600">
                Monitor your DeFi investments and track performance
                {/* TODO: Add last updated timestamp */}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleExportData} className="hidden sm:flex">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="primary" size="sm" className="hidden sm:flex">
                Add Funds
              </Button>
            </div>
          </div>
        </div>

        {/* Portfolio Overview - Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-10">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-0" padding="md">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total Value</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {stats?.totalValue || '$0.00'}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-0" padding="md">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Total P&L</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    {stats?.totalGainLoss || '+$0.00'}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-0" padding="md">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Avg APY</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {stats?.averageAPY || '0%'}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-purple-100 rounded-full">
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 border-0" padding="md">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Active</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                    {stats?.activePositions || 0}
                  </p>
                </div>
                <div className="p-2 sm:p-3 bg-orange-100 rounded-full">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Portfolio Positions - Full width on mobile, 2/3 on desktop */}
          <div className="xl:col-span-2">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Your Positions</h2>
                  <Button variant="outline" size="sm" onClick={handleExportData} className="sm:hidden">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {positions.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <PieChart className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No positions yet</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-sm mx-auto">
                      Start investing in vaults to see your positions here
                    </p>
                    <Button variant="primary" size="sm" className="w-full sm:w-auto">
                      Browse Vaults
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {positions.map((position) => (
                      <div 
                        key={position.id} 
                        className="p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                      >
                        {/* Mobile-first layout */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            {/* Vault Icon */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm sm:text-lg font-bold">
                                {position.asset.charAt(0)}
                              </span>
                            </div>
                            
                            {/* Vault Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                                {position.vaultName}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-500">
                                {position.asset} • APY {position.apy}
                              </p>
                            </div>
                          </div>

                          {/* Performance Indicator */}
                          <div className="text-left sm:text-right flex-shrink-0">
                            <div className="text-lg sm:text-xl font-bold text-gray-900">
                              {position.currentValue} {position.asset}
                            </div>
                            <div className={`flex items-center sm:justify-end text-xs sm:text-sm font-medium ${
                              position.gainLoss.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {position.gainLoss.startsWith('+') ? (
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              )}
                              {position.gainLoss} ({position.gainLossPercentage})
                            </div>
                          </div>
                        </div>

                        {/* Position Details - Responsive grid */}
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-3 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Deposited</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {position.deposited} {position.asset}
                            </p>
                          </div>
                          <div className="sm:block">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Updated</p>
                            <p className="text-xs sm:text-sm font-medium text-gray-900">
                              {new Date(position.lastUpdated).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Performance</p>
                            <p className={`text-xs sm:text-sm font-medium ${
                              position.gainLoss.startsWith('+') ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {position.gainLossPercentage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Responsive stacking */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Transactions */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h2>
                  {transactionsLoading && <Loading size="sm" />}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {transactionsError ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Failed to load</h3>
                    <Button variant="outline" size="sm" onClick={() => fetchTransactions(userAddress, { limit: 10 })}>
                      Retry
                    </Button>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Activity className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">No transactions yet</h3>
                    <p className="text-xs text-gray-600 mb-4">Your activity will appear here</p>
                    <Button variant="primary" size="sm" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 6).map((tx) => (
                      <div 
                        key={tx.id} 
                        className="p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          {/* Transaction Icon */}
                          <div className={`p-2 rounded-full ${
                            tx.type === 'deposit' ? 'bg-green-100' :
                            tx.type === 'withdraw' ? 'bg-red-100' :
                            'bg-blue-100'
                          }`}>
                            {tx.type === 'deposit' ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : tx.type === 'withdraw' ? (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            ) : (
                              <DollarSign className="h-3 w-3 text-blue-600" />
                            )}
                          </div>
                          
                          {/* Transaction Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-medium text-gray-900 capitalize">
                                {tx.type}
                              </p>
                              <Badge 
                                variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'error'}
                                size="sm"
                              >
                                {tx.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-1">
                              {tx.vaultName}
                            </p>
                            <p className={`text-xs font-medium ${
                              tx.type === 'deposit' ? 'text-green-600' :
                              tx.type === 'withdraw' ? 'text-red-600' :
                              'text-blue-600'
                            }`}>
                              {tx.type === 'withdraw' ? '-' : '+'}{tx.amount} {tx.asset}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* View All Link */}
                    <div className="text-center pt-3 border-t border-gray-100">
                      <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 w-full sm:w-auto">
                        View All Transactions
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Summary */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="border-b border-gray-100">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Portfolio Summary</h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-5">
                  {/* Performance Chart Placeholder */}
                  <div className="h-28 sm:h-32 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-inner">
                    <div className="text-center">
                      <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-xs font-medium text-gray-700">Portfolio Chart</p>
                      <p className="text-xs text-gray-500">Coming Soon</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <p className="text-xs text-gray-600 mb-1">Best Performer</p>
                      <p className="text-sm font-bold text-green-600">+12.53%</p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-600 mb-1">Total Earned</p>
                      <p className="text-sm font-bold text-gray-900">{stats?.totalGainLoss || '$0'}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <Button variant="primary" size="sm" className="w-full h-9 text-sm">
                      Add Funds
                    </Button>
                    <Button variant="outline" size="sm" className="w-full h-9 text-sm">
                      Withdraw
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications/Alerts */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Alerts</h2>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1">New Vault Available</p>
                        <p className="text-xs text-blue-700">USDT Stable Vault - 4.5% APY</p>
                        <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto mt-2">
                          View Details →
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-50/50 rounded-xl border border-green-100 hover:border-green-200 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-green-900 mb-1">Yield Distributed</p>
                        <p className="text-xs text-green-700">+$125.30 from automation rules</p>
                        <Button variant="ghost" size="sm" className="text-xs text-green-600 hover:text-green-700 p-0 h-auto mt-2">
                          View Transaction →
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* View All Alerts */}
                  <div className="text-center pt-3 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="text-xs text-gray-600 hover:text-gray-700 w-full sm:w-auto">
                      View All Alerts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage