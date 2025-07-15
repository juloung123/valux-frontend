/**
 * Backend API Response Types
 * These types match the backend DTOs exactly
 */

// Base API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

// Pagination Response
export interface PaginatedResponse<T = unknown> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Authentication Types
export interface NonceResponse {
  nonce: string
  message: string
}

export interface LoginRequest {
  address: string
  signature: string
  message: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: UserDto
  expires_in: number
}

export interface UserDto {
  id: string
  address: string
  createdAt: string
  updatedAt: string
}

// Vault Types (Backend DTOs)
export interface VaultDto {
  id: string
  name: string
  address: string
  protocol: string
  tokenAddress: string
  tokenSymbol: string
  apy: number
  riskLevel: 'low' | 'medium' | 'high'
  category: 'stable' | 'yield' | 'growth'
  tvl: string
  active: boolean
  insuranceAvailable: boolean
  autoCompounding: boolean
  withdrawalTerms: string | null
  createdAt: string
  updatedAt: string
}

export interface VaultPerformanceDto {
  vaultId: string
  currentAPY: number
  historicalAPY: Array<{ date: string; apy: number }>
  tvlHistory: Array<{ date: string; tvl: string }>
  lastUpdated: string
}

export interface VaultFilterDto {
  search?: string
  riskLevel?: 'low' | 'medium' | 'high'
  category?: 'stable' | 'yield' | 'growth'
  minAPY?: number
  maxAPY?: number
  protocol?: string
  active?: boolean
  page?: number
  limit?: number
  sortBy?: 'apy' | 'tvl' | 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Portfolio Types (Backend DTOs)
export interface PortfolioOverviewDto {
  totalValue: string
  totalDeposited: string
  totalUnrealizedPnl: string
  totalRealizedPnl: string
  totalDistributed: string
  avgAPY: number
  performance: {
    '24h': number
    '7d': number
    '30d': number
    '1y': number
  }
  activePositions: number
  activeRules: number
  lastUpdated: string
}

export interface PortfolioPositionDto {
  id: string
  vaultId: string
  vault: {
    id: string
    name: string
    protocol: string
    tokenSymbol: string
  }
  depositAmount: string
  currentValue: string
  unrealizedPnl: string
  realizedPnl: string
  lastUpdated: string
}

export interface TransactionDto {
  id: string
  userId: string
  vaultId?: string
  type: 'deposit' | 'withdraw' | 'distribution' | 'automation'
  amount: string
  tokenSymbol: string
  transactionHash: string
  blockNumber: number
  gasUsed: string
  gasPriceGwei: string
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: string
  vault?: {
    id: string
    name: string
    protocol: string
  }
}

export interface TransactionQueryDto {
  address: string
  type?: 'deposit' | 'withdrawal' | 'distribution' | 'reinvest'
  vaultId?: string
  status?: 'pending' | 'confirmed' | 'failed'
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface TransactionListResponseDto {
  transactions: TransactionDto[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PortfolioExportQueryDto {
  address: string
  format?: 'csv' | 'json' | 'pdf'
  year?: number
  startDate?: string
  endDate?: string
  taxableOnly?: boolean
}

export interface PortfolioExportResponseDto {
  format: 'csv' | 'json' | 'pdf'
  data: string | object
  filename: string
  generatedAt: string
}

// Rules Types (Backend DTOs)
export interface DistributionDto {
  id: string
  recipient: string
  percentage: number
  description?: string
}

export interface RuleDto {
  id: string
  name: string
  description?: string
  userAddress: string
  vault: {
    id: string
    name: string
    protocol: string
    tokenSymbol: string
  }
  trigger: 'weekly' | 'monthly' | 'quarterly' | 'profit_threshold'
  profitThreshold?: string
  active: boolean
  lastExecuted?: string
  nextExecution?: string
  distributions: DistributionDto[]
  createdAt: string
  updatedAt: string
  executionsCount: number
  totalDistributed: string
}

export interface CreateRuleDto {
  name: string
  description?: string
  userAddress: string
  vaultId: string
  trigger: 'weekly' | 'monthly' | 'quarterly' | 'profit_threshold'
  profitThreshold?: string
  distributions: Array<{
    recipient: string
    percentage: number
    description?: string
  }>
}

export interface UpdateRuleDto {
  name?: string
  description?: string
  trigger?: 'weekly' | 'monthly' | 'quarterly' | 'profit_threshold'
  profitThreshold?: string
  distributions?: Array<{
    recipient: string
    percentage: number
    description?: string
  }>
  active?: boolean
}

export interface RuleFilterDto {
  address: string
  vaultId?: string
  trigger?: 'weekly' | 'monthly' | 'quarterly' | 'profit_threshold'
  active?: boolean
  search?: string
  includeExecutions?: boolean
}

export interface RuleListResponseDto {
  rules: RuleDto[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ExecuteRuleResponseDto {
  success: boolean
  executionId: string
  profitAmount: string
  distributions: Array<{
    recipient: string
    amount: string
    transactionHash: string
  }>
  gasUsed: string
  executionTime: number
  message: string
}

// Analytics Types (Backend DTOs)
export interface PlatformAnalyticsDto {
  totalUsers: number
  totalVaults: number
  totalTvl: string
  totalVolume: string
  totalTransactions: number
  avgAPY: number
  topProtocols: Array<{
    protocol: string
    tvl: string
    percentage: number
  }>
  recentActivity: Array<{
    type: 'deposit' | 'withdraw' | 'rule_execution'
    amount: string
    timestamp: string
  }>
  timestamp: string
}

export interface TvlMetricsQueryDto {
  timeframe?: '24h' | '7d' | '30d' | '1y'
}

export interface TvlMetricsDto {
  current: string
  change: {
    amount: string
    percentage: number
  }
  historical: Array<{
    date: string
    tvl: string
  }>
  byProtocol: Array<{
    protocol: string
    tvl: string
    percentage: number
  }>
  timeframe: '24h' | '7d' | '30d' | '1y'
  lastUpdated: string
}

export interface UserAnalyticsDto {
  user: {
    address: string
    joinDate: string
    totalDeposited: string
    totalEarned: string
    totalDistributed: string
  }
  portfolio: {
    totalValue: string
    pnl: string
    pnlPercentage: number
    bestPerformingVault: string
    worstPerformingVault: string
  }
  rules: {
    totalRules: number
    activeRules: number
    totalExecutions: number
    totalDistributed: string
    avgExecutionTime: number
  }
  rankings: {
    portfolioSize: number
    totalEarnings: number
    automationUsage: number
  }
  activity: Array<{
    type: string
    description: string
    timestamp: string
  }>
}

// Health Check Types
export interface HealthCheckResponse {
  status: 'ok' | 'error'
  info: {
    database: { status: 'up' | 'down' }
    redis: { status: 'up' | 'down' }
    blockchain: { 
      status: 'up' | 'down'
      network: object
      blockNumber: number
    }
  }
  error: object
  details: object
}

export interface StatsResponse {
  uptime: number
  timestamp: string
  environment: string
  version: string
  memory: object
  cpu: object
}