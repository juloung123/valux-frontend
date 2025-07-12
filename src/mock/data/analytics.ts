import { type PlatformMetrics, type ProtocolDistribution, type VaultPerformance } from '@/types'

/**
 * Mock platform analytics data for development
 * TODO: Replace with actual API calls to analytics service
 * API Endpoint: GET /api/analytics/platform
 * Documentation: https://docs.valux.finance/api/analytics
 */
export const mockPlatformMetrics: PlatformMetrics = {
  totalValueLocked: '$24.8M',
  totalUsers: '1,247',
  totalVaults: '12',
  totalTransactions: '8,934',
  averageAPY: '6.8%',
  monthlyGrowth: '+12.5%',
  totalYieldGenerated: '$892K',
  activeAutomations: '456'
}

/**
 * Mock protocol distribution data for charts
 * TODO: Calculate from real vault allocation data
 * API Endpoint: GET /api/analytics/protocols
 */
export const mockProtocolDistribution: ProtocolDistribution[] = [
  { name: 'Aave', value: 35, color: '#B6509E' },
  { name: 'Compound', value: 25, color: '#2EBAC6' },
  { name: 'Yearn', value: 20, color: '#0074D9' },
  { name: 'Curve', value: 15, color: '#FF851B' },
  { name: 'Lido', value: 5, color: '#F012BE' }
]

/**
 * Mock vault performance data for analytics
 * TODO: Calculate from real vault performance and user data
 * API Endpoint: GET /api/analytics/vaults/performance
 */
export const mockVaultPerformance: VaultPerformance[] = [
  {
    vaultId: '1',
    name: 'USDC Savings Vault',
    apy: '4.2%',
    tvl: '$2.4M',
    users: 156,
    monthlyReturn: '+3.5%',
    riskScore: 2.1
  },
  {
    vaultId: '2',
    name: 'ETH Staking Vault', 
    apy: '3.8%',
    tvl: '$5.2M',
    users: 89,
    monthlyReturn: '+3.1%',
    riskScore: 4.2
  },
  {
    vaultId: '3',
    name: 'BTC Yield Vault',
    apy: '2.1%',
    tvl: '$1.8M',
    users: 67,
    monthlyReturn: '+1.8%',
    riskScore: 2.5
  },
  {
    vaultId: '4',
    name: 'High Yield DeFi',
    apy: '12.5%',
    tvl: '$890K',
    users: 34,
    monthlyReturn: '+10.2%',
    riskScore: 8.1
  }
]

/**
 * Mock time-series data for charts
 * TODO: Fetch real historical data from time-series database
 * API Endpoint: GET /api/analytics/timeseries?period=30d
 */
export const mockTimeSeriesData = {
  tvlHistory: [
    { date: '2024-01-01', value: 18500000 },
    { date: '2024-01-07', value: 19200000 },
    { date: '2024-01-14', value: 20800000 },
    { date: '2024-01-21', value: 22100000 },
    { date: '2024-01-28', value: 24800000 }
  ],
  userGrowth: [
    { date: '2024-01-01', value: 892 },
    { date: '2024-01-07', value: 945 },
    { date: '2024-01-14', value: 1034 },
    { date: '2024-01-21', value: 1156 },
    { date: '2024-01-28', value: 1247 }
  ],
  yieldGenerated: [
    { date: '2024-01-01', value: 645000 },
    { date: '2024-01-07', value: 698000 },
    { date: '2024-01-14', value: 756000 },
    { date: '2024-01-21', value: 823000 },
    { date: '2024-01-28', value: 892000 }
  ]
}