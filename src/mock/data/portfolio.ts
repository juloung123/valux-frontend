import { type PortfolioPosition, type Transaction } from '@/types'

/**
 * Mock portfolio data for development
 * TODO: Replace with actual API calls to user portfolio service
 * API Endpoint: GET /api/user/{address}/portfolio
 * Documentation: https://docs.valux.finance/api/portfolio
 */
export const mockPortfolioPositions: PortfolioPosition[] = [
  {
    id: '1',
    vaultId: '1',
    vaultName: 'USDC Savings Vault',
    asset: 'USDC',
    deposited: '5000',
    currentValue: '5210.45',
    apy: '4.2%',
    gainLoss: '+210.45',
    gainLossPercentage: '+4.21%',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    vaultId: '2',
    vaultName: 'ETH Staking Vault',
    asset: 'ETH',
    deposited: '2.5',
    currentValue: '2.5847',
    apy: '3.8%',
    gainLoss: '+0.0847',
    gainLossPercentage: '+3.39%',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    vaultId: '4',
    vaultName: 'High Yield DeFi',
    asset: 'CRV-LP',
    deposited: '1000',
    currentValue: '1125.30',
    apy: '12.5%',
    gainLoss: '+125.30',
    gainLossPercentage: '+12.53%',
    lastUpdated: new Date().toISOString()
  }
]

/**
 * Mock transaction history for development
 * TODO: Replace with actual blockchain transaction data
 * API Endpoint: GET /api/user/{address}/transactions
 * Documentation: https://docs.valux.finance/api/transactions
 */
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    vaultName: 'USDC Savings Vault',
    asset: 'USDC',
    amount: '5000',
    value: '$5,000.00',
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    txHash: '0x1234567890abcdef1234567890abcdef12345678',
    gasUsed: '21000',
    gasFee: '$2.45'
  },
  {
    id: '2',
    type: 'deposit',
    vaultName: 'ETH Staking Vault',
    asset: 'ETH',
    amount: '2.5',
    value: '$4,850.00',
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    gasUsed: '45000',
    gasFee: '$8.90'
  },
  {
    id: '3',
    type: 'yield',
    vaultName: 'USDC Savings Vault',
    asset: 'USDC',
    amount: '210.45',
    value: '$210.45',
    status: 'completed',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    txHash: '0x9876543210fedcba9876543210fedcba98765432',
    gasUsed: '0',
    gasFee: '$0.00'
  },
  {
    id: '4',
    type: 'deposit',
    vaultName: 'High Yield DeFi',
    asset: 'CRV-LP',
    amount: '1000',
    value: '$1,000.00',
    status: 'pending',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    txHash: '0xfedcba9876543210fedcba9876543210fedcba98',
    gasUsed: '120000',
    gasFee: '$15.60'
  }
]

/**
 * Mock portfolio statistics for development
 * TODO: Calculate real-time from user positions and market data
 * API Endpoint: GET /api/user/{address}/stats
 */
export const mockPortfolioStats = {
  totalValue: '$12,335.75',
  totalDeposited: '$12,000.00',
  totalGainLoss: '+$335.75',
  totalGainLossPercentage: '+2.80%',
  averageAPY: '6.8%',
  activePositions: 3,
  totalTransactions: 4,
  lastUpdated: new Date().toISOString()
}