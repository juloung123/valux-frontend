/**
 * Data Transformers
 * Convert between backend DTOs and frontend types
 */

import { 
  VaultDto, 
  PortfolioOverviewDto, 
  PortfolioPositionDto, 
  TransactionDto, 
  RuleDto, 
  PlatformAnalyticsDto, 
  TvlMetricsDto, 
  UserAnalyticsDto 
} from './types'

import { 
  Vault, 
  PortfolioPosition, 
  Transaction, 
  AutomationRule, 
  PlatformMetrics, 
  ProtocolDistribution, 
  VaultPerformance,
  RiskLevel 
} from '../../types'

/**
 * Transform backend VaultDto to frontend Vault
 */
export function transformVault(vaultDto: VaultDto): Vault {
  return {
    id: vaultDto.id,
    name: vaultDto.name,
    protocol: vaultDto.protocol,
    asset: vaultDto.tokenSymbol,
    apy: `${vaultDto.apy.toFixed(2)}%`,
    tvl: vaultDto.tvl,
    risk: capitalizeRiskLevel(vaultDto.riskLevel),
    description: `${vaultDto.protocol} ${vaultDto.tokenSymbol} vault with ${vaultDto.apy.toFixed(2)}% APY`,
    features: generateVaultFeatures(vaultDto),
    isInsured: vaultDto.insuranceAvailable,
    minDeposit: undefined, // Not provided by backend
    maxDeposit: undefined, // Not provided by backend
    category: vaultDto.category,
  }
}

/**
 * Transform backend PortfolioOverviewDto to frontend portfolio data
 */
export function transformPortfolioOverview(dto: PortfolioOverviewDto) {
  return {
    totalValue: dto.totalValue,
    totalDeposited: dto.totalDeposited,
    totalPnL: dto.totalUnrealizedPnl,
    totalDistributed: dto.totalDistributed,
    avgAPY: `${dto.avgAPY.toFixed(2)}%`,
    performance: {
      '24h': dto.performance['24h'],
      '7d': dto.performance['7d'],
      '30d': dto.performance['30d'],
      '1y': dto.performance['1y'],
    },
    activePositions: dto.activePositions,
    activeRules: dto.activeRules,
    lastUpdated: dto.lastUpdated,
  }
}

/**
 * Transform backend PortfolioPositionDto to frontend PortfolioPosition
 */
export function transformPortfolioPosition(dto: PortfolioPositionDto): PortfolioPosition {
  const pnl = parseFloat(dto.unrealizedPnl) + parseFloat(dto.realizedPnl)
  const deposited = parseFloat(dto.depositAmount)
  const pnlPercentage = deposited > 0 ? (pnl / deposited) * 100 : 0

  return {
    id: dto.id,
    vaultId: dto.vault.id,
    vaultName: dto.vault.name,
    asset: dto.vault.tokenSymbol,
    deposited: dto.depositAmount,
    currentValue: dto.currentValue,
    apy: `${dto.avgAPY.toFixed(2)}%`,
    gainLoss: pnl >= 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2),
    gainLossPercentage: dto.performancePercentage >= 0 ? `+${dto.performancePercentage.toFixed(2)}%` : `${dto.performancePercentage.toFixed(2)}%`,
    lastUpdated: dto.lastUpdated,
  }
}

/**
 * Transform backend TransactionDto to frontend Transaction
 */
export function transformTransaction(dto: TransactionDto): Transaction {
  return {
    id: dto.id,
    type: transformTransactionType(dto.type),
    vaultName: dto.vault.name,
    asset: dto.tokenSymbol,
    amount: dto.amount,
    value: dto.amount, // Backend doesn't separate amount and value
    status: dto.status === 'confirmed' ? 'completed' as const : dto.status as 'pending' | 'failed',
    timestamp: dto.executedAt,
    txHash: dto.hash,
    gasUsed: dto.gasUsed,
    gasFee: dto.gasFee,
  }
}

/**
 * Transform backend RuleDto to frontend AutomationRule
 */
export function transformRule(dto: RuleDto): AutomationRule {
  return {
    id: dto.id,
    name: dto.name,
    status: dto.active ? 'active' : 'paused',
    trigger: formatTrigger(dto.trigger),
    lastExecution: dto.lastExecuted || null,
    nextExecution: dto.nextExecution || null,
    totalDistributed: dto.totalDistributed,
    description: dto.description || `${dto.trigger} automation rule for ${dto.vault.name}`,
    conditions: {
      minProfit: dto.profitThreshold || '0',
      frequency: dto.trigger,
      vaultIds: [dto.vault.id],
    },
    distributions: dto.distributions.map(dist => ({
      address: dist.recipient,
      percentage: dist.percentage,
      label: dist.description || truncateAddress(dist.recipient),
    })),
  }
}

/**
 * Transform backend PlatformAnalyticsDto to frontend PlatformMetrics
 */
export function transformPlatformAnalytics(dto: PlatformAnalyticsDto): PlatformMetrics {
  // Handle nested backend response format
  const data = dto.data || dto
  
  // Transform protocols object to expected format
  const protocolsObj: Record<string, any> = {}
  if (data.protocols) {
    Object.entries(data.protocols).forEach(([name, info]: [string, any]) => {
      protocolsObj[name] = {
        tvl: info.tvl,
        percentage: info.percentage,
        apy: info.apy || '0.0'
      }
    })
  }

  return {
    totalValueLocked: data.tvl?.current || '0',
    totalUsers: data.users?.total?.toString() || '0',
    totalVaults: '6', // Static for now
    totalTransactions: data.transactions?.total?.toString() || '0',
    averageAPY: `${data.yields?.averageAPY?.toFixed(2) || '0'}%`,
    monthlyGrowth: data.users?.growth ? `${data.users.growth}%` : '0%',
    totalYieldGenerated: data.yields?.totalDistributed || '0',
    activeAutomations: data.rules?.activeRules?.toString() || '0',
    protocols: protocolsObj,
    tvl: {
      current: data.tvl?.current || '0',
      changePercentage: data.tvl?.changePercentage || 0
    },
    users: {
      total: data.users?.total || 0,
      growth: data.users?.growth || 0
    },
    transactions: {
      total: data.transactions?.total || 0,
      volume24h: data.transactions?.volume24h || '0'
    },
    rules: {
      totalRules: data.rules?.totalRules || 0,
      activeRules: data.rules?.activeRules || 0
    },
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  }
}

/**
 * Transform backend TvlMetricsDto to frontend format
 */
export function transformTvlMetrics(dto: TvlMetricsDto) {
  return {
    current: dto.current,
    change: dto.change,
    historical: dto.historical,
    byProtocol: dto.byProtocol,
    timeframe: dto.timeframe,
    lastUpdated: dto.lastUpdated,
  }
}

/**
 * Transform backend UserAnalyticsDto to frontend format
 */
export function transformUserAnalytics(dto: UserAnalyticsDto) {
  return {
    user: dto.user,
    portfolio: dto.portfolio,
    rules: dto.rules,
    rankings: dto.rankings,
    activity: dto.activity,
  }
}

/**
 * Transform backend protocol distribution to frontend format
 */
export function transformProtocolDistribution(
  protocols: Array<{ protocol: string; tvl: string; percentage: number }>
): ProtocolDistribution[] {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16'
  ]

  return protocols.map((protocol, index) => ({
    name: protocol.protocol,
    value: protocol.percentage,
    color: colors[index % colors.length],
  }))
}

/**
 * Transform backend vault performance to frontend format
 */
export function transformVaultPerformance(
  vaults: VaultDto[]
): VaultPerformance[] {
  return vaults.map(vault => ({
    vaultId: vault.id,
    name: vault.name,
    apy: `${vault.apy.toFixed(2)}%`,
    tvl: vault.tvl,
    users: Math.floor(Math.random() * 1000) + 100, // Mock data - not in backend
    monthlyReturn: `${(vault.apy / 12).toFixed(2)}%`,
    riskScore: getRiskScore(vault.riskLevel),
  }))
}

// Helper functions
function capitalizeRiskLevel(riskLevel: string): RiskLevel {
  return (riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)) as RiskLevel
}

function generateVaultFeatures(vaultDto: VaultDto): string[] {
  const features = []
  
  if (vaultDto.insuranceAvailable) {
    features.push('Insurance Available')
  }
  
  if (vaultDto.autoCompounding) {
    features.push('Auto-Compounding')
  }
  
  if (vaultDto.withdrawalTerms === 'instant') {
    features.push('Instant Withdrawal')
  }
  
  features.push(`${vaultDto.protocol} Protocol`)
  features.push(`${vaultDto.tokenSymbol} Asset`)
  
  return features
}

function transformTransactionType(
  backendType: 'deposit' | 'withdrawal' | 'distribution' | 'reinvest'
): 'deposit' | 'withdraw' | 'yield' | 'fee' {
  switch (backendType) {
    case 'deposit':
      return 'deposit'
    case 'withdrawal':
      return 'withdraw'
    case 'distribution':
      return 'yield'
    case 'reinvest':
      return 'yield'
    default:
      return 'deposit'
  }
}

function formatTrigger(trigger: string): string {
  switch (trigger) {
    case 'weekly':
      return 'Weekly'
    case 'monthly':
      return 'Monthly'
    case 'quarterly':
      return 'Quarterly'
    case 'profit_threshold':
      return 'Profit Threshold'
    default:
      return trigger
  }
}

function truncateAddress(address: string): string {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

function getRiskScore(riskLevel: string): number {
  switch (riskLevel) {
    case 'low':
      return 3
    case 'medium':
      return 6
    case 'high':
      return 9
    default:
      return 5
  }
}

// Reverse transformers (Frontend to Backend)
export function transformVaultFilters(filters: any): Record<string, any> {
  console.log('🔍 Input filters:', filters)
  const result: Record<string, any> = {}
  
  if (filters.search) result.search = filters.search
  // Only include riskLevel if it's not "All" or "all"
  if (filters.risk && filters.risk.toLowerCase() !== 'all') {
    result.riskLevel = filters.risk.toLowerCase()
  }
  // Only include category if it's not "All" or "all"
  if (filters.category && filters.category.toLowerCase() !== 'all') {
    result.category = filters.category.toLowerCase()
  }
  if (filters.minAPY !== undefined && filters.minAPY !== null && filters.minAPY !== '') {
    const minAPY = typeof filters.minAPY === 'number' ? filters.minAPY : parseFloat(filters.minAPY)
    if (!isNaN(minAPY) && minAPY >= 0) {
      result.minAPY = minAPY
    }
  }
  if (filters.maxAPY !== undefined && filters.maxAPY !== null && filters.maxAPY !== '') {
    const maxAPY = typeof filters.maxAPY === 'number' ? filters.maxAPY : parseFloat(filters.maxAPY)
    if (!isNaN(maxAPY) && maxAPY >= 0) {
      result.maxAPY = maxAPY
    }
  }
  if (filters.page !== undefined) result.page = filters.page || 1
  if (filters.limit !== undefined) result.limit = filters.limit || 20
  
  console.log('✅ Transformed filters:', result)
  return result
}

export function transformCreateRule(rule: any) {
  return {
    name: rule.name,
    description: rule.description,
    userAddress: rule.userAddress,
    vaultId: rule.vaultId,
    trigger: rule.trigger.toLowerCase(),
    profitThreshold: rule.profitThreshold,
    distributions: rule.distributions.map((dist: any) => ({
      recipient: dist.address,
      percentage: dist.percentage,
      description: dist.label,
    })),
  }
}