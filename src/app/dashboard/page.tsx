'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Download } from 'lucide-react'

interface Position {
  id: string
  vault: string
  asset: string
  deposited: string
  currentValue: string
  pnl: string
  pnlPercentage: number
  apy: string
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'profit'
  vault: string
  amount: string
  date: string
  txHash: string
}

const positions: Position[] = [
  {
    id: '1',
    vault: 'USDC Savings Vault',
    asset: 'USDC',
    deposited: '10,000',
    currentValue: '10,420',
    pnl: '+420',
    pnlPercentage: 4.2,
    apy: '4.2%'
  },
  {
    id: '2',
    vault: 'ETH Staking Vault',
    asset: 'ETH',
    deposited: '5.0',
    currentValue: '5.19',
    pnl: '+0.19',
    pnlPercentage: 3.8,
    apy: '3.8%'
  },
  {
    id: '3',
    vault: 'BTC Yield Vault',
    asset: 'WBTC',
    deposited: '0.5',
    currentValue: '0.5105',
    pnl: '+0.0105',
    pnlPercentage: 2.1,
    apy: '2.1%'
  }
]

const transactions: Transaction[] = [
  {
    id: '1',
    type: 'profit',
    vault: 'USDC Savings Vault',
    amount: '+42.00 USDC',
    date: '2025-01-10',
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    type: 'deposit',
    vault: 'ETH Staking Vault',
    amount: '2.5 ETH',
    date: '2025-01-08',
    txHash: '0x2345...6789'
  },
  {
    id: '3',
    type: 'profit',
    vault: 'BTC Yield Vault',
    amount: '+0.001 WBTC',
    date: '2025-01-05',
    txHash: '0x3456...7890'
  },
  {
    id: '4',
    type: 'withdraw',
    vault: 'USDC Savings Vault',
    amount: '1,000 USDC',
    date: '2025-01-03',
    txHash: '0x4567...8901'
  }
]

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30d')

  const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.currentValue.replace(',', '')), 0)
  const totalPnL = positions.reduce((sum, pos) => sum + parseFloat(pos.pnl.replace('+', '')), 0)
  const totalPnLPercentage = (totalPnL / (totalValue - totalPnL)) * 100

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Portfolio Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Track your DeFi investments and earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total P&L</p>
                <p className="text-2xl font-bold text-green-600">+${totalPnL.toFixed(2)}</p>
                <p className="text-sm text-green-600">+{totalPnLPercentage.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Vaults</p>
                <p className="text-2xl font-bold text-gray-900">{positions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg APY</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(positions.reduce((sum, pos) => sum + parseFloat(pos.apy.replace('%', '')), 0) / positions.length).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Positions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your Positions</h2>
                <select
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1.5"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7d">7 days</option>
                  <option value="30d">30 days</option>
                  <option value="90d">90 days</option>
                  <option value="1y">1 year</option>
                </select>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div key={position.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-sm font-bold">{position.asset[0]}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{position.vault}</h3>
                          <p className="text-sm text-gray-500">{position.asset} • APY {position.apy}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{position.currentValue} {position.asset}</p>
                        <p className={`text-sm flex items-center justify-end ${position.pnlPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {position.pnlPercentage >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {position.pnl} ({position.pnlPercentage > 0 ? '+' : ''}{position.pnlPercentage.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 transition-colors">
                  <Download className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'profit' ? 'bg-green-100' :
                        tx.type === 'deposit' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {tx.type === 'profit' ? <TrendingUp className="h-4 w-4 text-green-600" /> :
                         tx.type === 'deposit' ? <DollarSign className="h-4 w-4 text-blue-600" /> :
                         <TrendingDown className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 capitalize">{tx.type}</p>
                        <p className="text-xs text-gray-500 truncate">{tx.vault}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          tx.type === 'profit' ? 'text-green-600' :
                          tx.type === 'withdraw' ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {tx.amount}
                        </p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                  View all transactions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tax-Friendly Export</h3>
              <p className="text-gray-600">Download your profit distribution history for tax reporting</p>
            </div>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}