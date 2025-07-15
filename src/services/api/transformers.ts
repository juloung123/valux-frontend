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
    vaultId: dto.vaultId,
    vaultName: dto.vault.name,
    asset: dto.vault.tokenSymbol,
    deposited: dto.depositAmount,
    currentValue: dto.currentValue,
    apy: 'N/A', // Not provided in backend DTO
    gainLoss: pnl >= 0 ? `+${pnl.toFixed(2)}` : pnl.toFixed(2),
    gainLossPercentage: pnlPercentage >= 0 ? `+${pnlPercentage.toFixed(2)}%` : `${pnlPercentage.toFixed(2)}%`,
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
    vaultName: dto.vault?.name || 'N/A',
    asset: dto.tokenSymbol,
    amount: dto.amount,
    value: dto.amount, // Backend doesn't separate amount and value
    status: dto.status,
    timestamp: dto.timestamp,
    txHash: dto.transactionHash,
    gasUsed: dto.gasUsed,
    gasFee: dto.gasPriceGwei,
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
  return {
    totalValueLocked: dto.totalTvl,
    totalUsers: dto.totalUsers.toString(),
    totalVaults: dto.totalVaults.toString(),
    totalTransactions: dto.totalTransactions.toString(),
    averageAPY: `${dto.avgAPY.toFixed(2)}%`,
    monthlyGrowth: 'N/A', // Not provided in backend DTO
    totalYieldGenerated: 'N/A', // Not provided in backend DTO
    activeAutomations: 'N/A', // Not provided in backend DTO
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
  backendType: 'deposit' | 'withdraw' | 'distribution' | 'automation'
): 'deposit' | 'withdraw' | 'yield' | 'fee' {
  switch (backendType) {
    case 'deposit':
      return 'deposit'
    case 'withdraw':
      return 'withdraw'
    case 'distribution':
      return 'yield'
    case 'automation':
      return 'fee'
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
export function transformVaultFilters(filters: any) {
  return {
    search: filters.search,
    // Only include riskLevel if it's not "All" or "all"
    riskLevel: filters.risk && filters.risk.toLowerCase() !== 'all' ? filters.risk.toLowerCase() : undefined,
    // Only include category if it's not "All" or "all"
    category: filters.category && filters.category.toLowerCase() !== 'all' ? filters.category.toLowerCase() : undefined,
    minAPY: filters.minAPY ? parseFloat(filters.minAPY) : undefined,
    maxAPY: filters.maxAPY ? parseFloat(filters.maxAPY) : undefined,
    page: filters.page || 1,
    limit: filters.limit || 20,
  }
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