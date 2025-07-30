'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Play, Pause, Clock, Target, Settings, AlertCircle, Loader2 } from 'lucide-react'
import { ProtectedPage } from '@/components/auth/AuthGuard'
import { useAuth } from '@/hooks/useAuth'
import { rulesService } from '@/services'
import { AutomationRule } from '@/types'

function RulesPageContent() {
  const { user, address } = useAuth()
  const userAddress = user?.address || address || '0x1234567890abcdef1234567890abcdef12345678'
  
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRules = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Authentication will be handled by proper wallet connection flow
      
      const userRules = await rulesService.getRulesForUser(userAddress)
      setRules(userRules)
    } catch (err) {
      console.error('Error fetching rules:', err)
      setError('Failed to load rules. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const activeRules = rules.filter(rule => rule.status === 'active').length

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Profit Distribution Rules</h1>
            <p className="mt-2 text-base sm:text-lg text-gray-600">Automate your DeFi profit distribution</p>
          </div>
          <button className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex-shrink-0">
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">Create Rule</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3 mb-6 sm:mb-8">
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
                  <p className="text-sm font-medium text-gray-500">Total Distributed</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${rules.reduce((sum, rule) => sum + parseFloat(rule.totalDistributed || '0'), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-8 w-8 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Rules</h3>
            <p className="text-gray-500">Fetching your automation rules...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Rules</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button 
              onClick={fetchRules}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Rules List */}
        {!loading && !error && (
          <div className="space-y-4 sm:space-y-6">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${rule.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{rule.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{rule.conditions?.vaultIds?.[0] || 'Unknown Vault'} • {rule.trigger} execution</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                          {rule.status === 'active' ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
                        </button>
                        <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <Edit3 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <button className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 flex-shrink-0">
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Distribution Breakdown */}
                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Distribution Rules:</h4>
                    {rule.distributions.map((dist, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            dist.address === 'reinvest' ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            <span className={`text-xs font-bold ${
                              dist.address === 'reinvest' ? 'text-green-600' : 'text-blue-600'
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      {rule.lastExecution && (
                        <span>Last: {new Date(rule.lastExecution).toLocaleDateString()}</span>
                      )}
                      {rule.nextExecution && (
                        <span>Next: {new Date(rule.nextExecution).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 self-start sm:self-auto">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="capitalize">{rule.trigger}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && rules.length === 0 && (
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

export default function RulesPage() {
  return (
    <ProtectedPage>
      <RulesPageContent />
    </ProtectedPage>
  )
}