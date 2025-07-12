'use client'

import { Plus, Edit3, Trash2, Play, Pause, Clock, Target, Settings, AlertCircle } from 'lucide-react'

interface Rule {
  id: string
  name: string
  vault: string
  trigger: 'weekly' | 'monthly' | 'quarterly'
  status: 'active' | 'paused'
  distributions: Distribution[]
  lastExecuted?: string
  nextExecution: string
}

interface Distribution {
  address: string
  percentage: number
  label: string
  type: 'wallet' | 'reinvest' | 'charity'
}

const rules: Rule[] = [
  {
    id: '1',
    name: 'Monthly Savings Plan',
    vault: 'USDC Savings Vault',
    trigger: 'monthly',
    status: 'active',
    distributions: [
      { address: '0x742d...8a9b', percentage: 60, label: 'Personal Savings', type: 'wallet' },
      { address: 'reinvest', percentage: 30, label: 'Reinvest', type: 'reinvest' },
      { address: '0x123d...4c5e', percentage: 10, label: 'Charity Donation', type: 'charity' }
    ],
    lastExecuted: '2025-01-01',
    nextExecution: '2025-02-01'
  },
  {
    id: '2',
    name: 'Family Support',
    vault: 'ETH Staking Vault',
    trigger: 'weekly',
    status: 'active',
    distributions: [
      { address: '0x456d...7e8f', percentage: 50, label: 'Family Wallet', type: 'wallet' },
      { address: 'reinvest', percentage: 50, label: 'Reinvest', type: 'reinvest' }
    ],
    nextExecution: '2025-01-17'
  },
  {
    id: '3',
    name: 'Conservative Growth',
    vault: 'BTC Yield Vault',
    trigger: 'quarterly',
    status: 'paused',
    distributions: [
      { address: 'reinvest', percentage: 100, label: 'Full Reinvest', type: 'reinvest' }
    ],
    nextExecution: '2025-04-01'
  }
]

export default function RulesPage() {

  const activeRules = rules.filter(rule => rule.status === 'active').length

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profit Distribution Rules</h1>
            <p className="mt-2 text-lg text-gray-600">Automate your DeFi profit distribution</p>
          </div>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all">
            <Plus className="h-5 w-5" />
            <span>Create Rule</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Rules</p>
                <p className="text-2xl font-bold text-gray-900">{activeRules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Rules</p>
                <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Next Execution</p>
                <p className="text-lg font-bold text-gray-900">Jan 17</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-6">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${rule.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-500">{rule.vault} • {rule.trigger} execution</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {rule.status === 'active' ? 'Active' : 'Paused'}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      {rule.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Distribution Breakdown */}
                <div className="space-y-3 mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Distribution Rules:</h4>
                  {rule.distributions.map((dist, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          dist.type === 'wallet' ? 'bg-blue-100' :
                          dist.type === 'reinvest' ? 'bg-green-100' : 'bg-purple-100'
                        }`}>
                          <span className={`text-xs font-bold ${
                            dist.type === 'wallet' ? 'text-blue-600' :
                            dist.type === 'reinvest' ? 'text-green-600' : 'text-purple-600'
                          }`}>
                            {dist.percentage}%
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{dist.label}</p>
                          <p className="text-xs text-gray-500">
                            {dist.address === 'reinvest' ? 'Automatic Reinvestment' : `${dist.address.slice(0, 6)}...${dist.address.slice(-4)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{dist.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Execution Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    {rule.lastExecuted && (
                      <span>Last executed: {new Date(rule.lastExecuted).toLocaleDateString()}</span>
                    )}
                    <span>Next execution: {new Date(rule.nextExecution).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="capitalize">{rule.trigger}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rules.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rules created yet</h3>
            <p className="text-gray-500 mb-6">Create your first profit distribution rule to get started</p>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all mx-auto">
              <Plus className="h-5 w-5" />
              <span>Create Your First Rule</span>
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How Rules Work</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Rules automatically execute when profits are available in your vaults</li>
                <li>• You can set multiple distribution addresses with custom percentages</li>
                <li>• All executions are powered by Chainlink Automation for reliability</li>
                <li>• Rules can be paused, edited, or deleted at any time</li>
                <li>• Gas fees for rule execution are automatically deducted from profits</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}