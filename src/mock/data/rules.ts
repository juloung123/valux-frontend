import { type AutomationRule } from '@/types'

/**
 * Mock automation rules data for development
 * TODO: Replace with actual API calls to rules engine service
 * API Endpoint: GET /api/user/{address}/rules
 * Documentation: https://docs.valux.finance/api/rules
 */
export const mockAutomationRules: AutomationRule[] = [
  {
    id: '1',
    name: 'USDC Profit Distribution',
    status: 'active',
    trigger: 'Monthly',
    lastExecution: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    nextExecution: new Date(Date.now() + 86400000 * 27).toISOString(), // 27 days from now
    totalDistributed: '$1,250.00',
    description: 'Distribute 50% of USDC vault profits to savings, 30% to reinvestment, 20% to wallet',
    conditions: {
      minProfit: '100',
      frequency: 'monthly',
      vaultIds: ['1']
    },
    distributions: [
      { address: '0x1234...5678', percentage: 50, label: 'Savings Account' },
      { address: '0xabcd...ef90', percentage: 30, label: 'Reinvestment' },
      { address: '0x9876...5432', percentage: 20, label: 'Personal Wallet' }
    ]
  },
  {
    id: '2', 
    name: 'ETH Staking Rewards',
    status: 'active',
    trigger: 'Weekly',
    lastExecution: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    nextExecution: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    totalDistributed: '$425.80',
    description: 'Weekly distribution of ETH staking rewards with 70% reinvestment, 30% to wallet',
    conditions: {
      minProfit: '50',
      frequency: 'weekly',
      vaultIds: ['2']
    },
    distributions: [
      { address: '0xdef0...1234', percentage: 70, label: 'Compound Strategy' },
      { address: '0x5678...90ab', percentage: 30, label: 'Withdrawal Wallet' }
    ]
  },
  {
    id: '3',
    name: 'DeFi Portfolio Rebalance',
    status: 'paused',
    trigger: 'Profit Threshold',
    lastExecution: new Date(Date.now() - 86400000 * 14).toISOString(), // 14 days ago
    nextExecution: null,
    totalDistributed: '$890.00',
    description: 'Rebalance DeFi portfolio when profits exceed 10% threshold',
    conditions: {
      minProfit: '500',
      frequency: 'threshold',
      vaultIds: ['4', '6']
    },
    distributions: [
      { address: '0xabc1...def2', percentage: 40, label: 'Stable Vaults' },
      { address: '0x3456...789a', percentage: 35, label: 'Growth Vaults' },
      { address: '0xbcde...f012', percentage: 25, label: 'Emergency Fund' }
    ]
  }
]

/**
 * Mock rule performance metrics for development
 * TODO: Calculate from actual execution history and performance data
 * API Endpoint: GET /api/user/{address}/rules/performance
 */
export const mockRulePerformance = {
  totalRules: 3,
  activeRules: 2,
  pausedRules: 1,
  totalDistributed: '$2,565.80',
  averageGasEfficiency: '98.5%',
  successRate: '99.2%',
  lastMonthSavings: '$156.70',
  automationUptime: '99.8%'
}