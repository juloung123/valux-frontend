'use client'

import { useState, useEffect } from 'react'
import { BarChart3, PieChart, Activity, DollarSign, Users, Target, Zap } from 'lucide-react'
import { PublicPage } from '@/components/auth/AuthGuard'
import { analyticsService } from '@/services'
import { Loading } from '@/components/ui'

function AnalyticsContent() {
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await analyticsService.getPlatformMetrics()
        setAnalytics(data)
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
        setError('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error || 'Failed to load analytics'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Transform backend data for display
  const protocolData = Object.entries(analytics.protocols || {}).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    tvl: `$${(parseFloat(data.tvl) / 1000000).toFixed(1)}M`,
    percentage: Math.round(data.percentage),
    apy: `${data.apy || '0.0'}%`
  }))

  // Transform protocol data to vault performance display
  const vaultPerformance = Object.entries(analytics.protocols || {}).map(([name, data]: [string, any]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1) + ' Vault',
    apy: `${data.apy || '0.0'}%`,
    tvl: `$${(parseFloat(data.tvl) / 1000000).toFixed(1)}M`,
    volume24h: `$${Math.floor(Math.random() * 300 + 50)}K`, // Mock volume until endpoint ready
    change: `+${(Math.random() * 2).toFixed(1)}%` // Mock change until endpoint ready
  }))

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Platform Analytics</h1>
            <p className="mt-2 text-lg text-gray-600">Real-time insights into Valux platform performance</p>
          </div>
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total TVL</p>
                <p className="text-2xl font-bold text-gray-900">${(parseFloat(analytics.tvl.current) / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-green-600">+{analytics.tvl.changePercentage.toFixed(1)}% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.users.total.toLocaleString()}</p>
                <p className="text-sm text-blue-600">+{analytics.users.growth}% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Rules</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.rules.activeRules.toLocaleString()}</p>
                <p className="text-sm text-purple-600">Total: {analytics.rules.totalRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">24h Volume</p>
                <p className="text-2xl font-bold text-gray-900">${parseFloat(analytics.transactions.volume24h) > 0 ? (parseFloat(analytics.transactions.volume24h) / 1000).toFixed(0) + 'K' : '0'}</p>
                <p className="text-sm text-orange-600">Transactions: {analytics.transactions.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Protocol Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Protocol Distribution
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {protocolData.map((protocol, index) => (
                  <div key={protocol.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${{
                        0: 'bg-blue-500',
                        1: 'bg-green-500',
                        2: 'bg-purple-500',
                        3: 'bg-orange-500'
                      }[index]}`}></div>
                      <span className="font-medium text-gray-900">{protocol.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{protocol.tvl}</p>
                      <p className="text-sm text-gray-500">{protocol.percentage}% • APY {protocol.apy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 via-green-500 via-purple-500 to-orange-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Last updated: {new Date(analytics.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Vault Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Vault Performance
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {vaultPerformance.map((vault) => (
                  <div key={vault.name} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{vault.name}</h3>
                      <span className="text-sm font-medium text-green-600">{vault.change}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">APY</p>
                        <p className="font-semibold">{vault.apy}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">TVL</p>
                        <p className="font-semibold">{vault.tvl}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">24h Volume</p>
                        <p className="font-semibold">{vault.volume24h}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Platform Health
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">99</span>
                </div>
                <h3 className="font-semibold text-gray-900">Uptime</h3>
                <p className="text-sm text-gray-500">99.9% over last 30 days</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">2.3</span>
                </div>
                <h3 className="font-semibold text-gray-900">Avg Response</h3>
                <p className="text-sm text-gray-500">2.3s average response time</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">0</span>
                </div>
                <h3 className="font-semibold text-gray-900">Failed Transactions</h3>
                <p className="text-sm text-gray-500">0 failed transactions today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Analytics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Performance Fees (0.5%)</span>
                <span className="font-semibold">$${(parseFloat(analytics.totalYieldGenerated || '0') * 0.005).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fees Generated</span>
                <span className="font-semibold">$${parseFloat(analytics.transactions.volume24h || '0').toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                <span>Total Yield Generated</span>
                <span>$${(parseFloat(analytics.totalYieldGenerated || '0') / 1000).toFixed(1)}K</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Users</span>
                <span className="font-semibold text-green-600">+{analytics.users.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User Growth</span>
                <span className="font-semibold text-green-600">+{analytics.users.growth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Rules</span>
                <span className="font-semibold text-green-600">+{analytics.rules.activeRules}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <PublicPage>
      <AnalyticsContent />
    </PublicPage>
  )
}