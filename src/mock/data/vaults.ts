import { type Vault } from '@/types'

/**
 * Mock vault data for development
 * TODO: Replace with actual API calls to backend service
 * API Endpoint: GET /api/vaults
 * Documentation: https://docs.valux.finance/api/vaults
 */
export const mockVaults: Vault[] = [
  {
    id: '1',
    name: 'USDC Savings Vault',
    protocol: 'Aave',
    asset: 'USDC',
    apy: '4.2%',
    tvl: '$2.4M',
    risk: 'Low',
    description: 'Stable yield with USDC lending on Aave protocol',
    features: ['Auto-compounding', 'Insurance covered', 'Instant withdrawals'],
    isInsured: true,
    minDeposit: '100',
    category: 'stable'
  },
  {
    id: '2',
    name: 'ETH Staking Vault',
    protocol: 'Lido',
    asset: 'ETH',
    apy: '3.8%',
    tvl: '$5.2M',
    risk: 'Medium',
    description: 'Ethereum 2.0 staking with liquid staking tokens',
    features: ['Liquid staking', 'Weekly rewards', 'No lock-up period'],
    minDeposit: '0.1',
    category: 'yield'
  },
  {
    id: '3',
    name: 'BTC Yield Vault',
    protocol: 'Compound',
    asset: 'WBTC',
    apy: '2.1%',
    tvl: '$1.8M',
    risk: 'Low',
    description: 'Conservative Bitcoin yield through Compound lending',
    features: ['Stable returns', 'Audited protocol', 'Real-time tracking'],
    minDeposit: '0.01',
    category: 'stable'
  },
  {
    id: '4',
    name: 'High Yield DeFi',
    protocol: 'Curve',
    asset: 'CRV-LP',
    apy: '12.5%',
    tvl: '$890K',
    risk: 'High',
    description: 'High-yield farming with Curve LP tokens',
    features: ['High APY', 'Auto-harvest', 'Impermanent loss protection'],
    minDeposit: '500',
    category: 'growth'
  },
  {
    id: '5',
    name: 'Stable Coin Basket',
    protocol: 'Yearn',
    asset: 'USDT',
    apy: '3.9%',
    tvl: '$3.1M',
    risk: 'Low',
    description: 'Diversified stable coin strategy with multiple protocols',
    features: ['Multi-protocol', 'Rebalancing', 'Gas optimization'],
    isInsured: true,
    minDeposit: '50',
    category: 'stable'
  },
  {
    id: '6',
    name: 'DeFi Blue Chip',
    protocol: 'Balancer',
    asset: 'BAL-LP',
    apy: '8.3%',
    tvl: '$1.2M',
    risk: 'Medium',
    description: 'Blue chip DeFi tokens liquidity providing',
    features: ['Balanced exposure', 'Fee earning', 'Governance tokens'],
    minDeposit: '1000',
    category: 'growth'
  }
]