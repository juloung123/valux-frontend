'use client'

import { useState } from 'react'
import { BarChart3, PieChart, Activity, DollarSign, Users, Target, Zap } from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')

  const protocolData = [
    { name: 'Aave', tvl: '$2.4M', percentage: 40, apy: '4.2%' },
    { name: 'Compound', tvl: '$1.8M', percentage: 30, apy: '3.1%' },
    { name: 'Lido', tvl: '$1.2M', percentage: 20, apy: '3.8%' },
    { name: 'Curve', tvl: '$0.6M', percentage: 10, apy: '8.5%' }
  ]

  const vaultPerformance = [
    { name: 'USDC Savings', apy: '4.2%', tvl: '$2.4M', volume24h: '$125K', change: '+0.3%' },
    { name: 'ETH Staking', apy: '3.8%', tvl: '$1.2M', volume24h: '$89K', change: '+0.1%' },
    { name: 'BTC Yield', apy: '2.1%', tvl: '$1.8M', volume24h: '$67K', change: '+0.2%' },
    { name: 'High Yield DeFi', apy: '12.5%', tvl: '$0.6M', volume24h: '$234K', change: '+2.1%' }
  ]

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
                <p className="text-2xl font-bold text-gray-900">$6.0M</p>
                <p className="text-sm text-green-600">+12.5% from last month</p>
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
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-sm text-blue-600">+8.3% from last month</p>
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
                <p className="text-2xl font-bold text-gray-900">3,492</p>
                <p className="text-sm text-purple-600">+15.2% from last month</p>
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
                <p className="text-2xl font-bold text-gray-900">$515K</p>
                <p className="text-sm text-orange-600">+5.7% from yesterday</p>
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
                <span className="font-semibold">$2,580</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gas Optimization Savings</span>
                <span className="font-semibold">$890</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                <span>Total Monthly Revenue</span>
                <span>$3,470</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">New Users (30d)</span>
                <span className="font-semibold text-green-600">+156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vault Deposits (30d)</span>
                <span className="font-semibold text-green-600">+$1.2M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rules Created (30d)</span>
                <span className="font-semibold text-green-600">+248</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}