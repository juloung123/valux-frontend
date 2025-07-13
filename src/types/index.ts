// Base Types
export type Status = 'pending' | 'loading' | 'success' | 'error'
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type TransactionType = 'deposit' | 'withdraw' | 'profit' | 'fee'
export type RuleStatus = 'active' | 'paused' | 'inactive'
export type TriggerFrequency = 'weekly' | 'monthly' | 'quarterly'
export type DistributionType = 'wallet' | 'reinvest' | 'charity'

// Vault Types
export interface Vault {
  id: string
  name: string
  protocol: string
  asset: string
  apy: string
  tvl: string
  risk: RiskLevel
  description: string
  features: string[]
  isInsured?: boolean
  minDeposit?: string
  maxDeposit?: string
  category?: 'stable' | 'growth' | 'yield'
}

export interface VaultPosition {
  id: string
  vaultId: string
  vault: string
  asset: string
  deposited: string
  currentValue: string
  pnl: string
  pnlPercentage: number
  apy: string
  depositDate: string
  lastUpdate: string
}

// Portfolio Types
export interface PortfolioPosition {
  id: string
  vaultId: string
  vaultName: string
  asset: string
  deposited: string
  currentValue: string
  apy: string
  gainLoss: string
  gainLossPercentage: string
  lastUpdated: string
}

// Transaction Types
export interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'yield' | 'fee'
  vaultName: string
  asset: string
  amount: string
  value: string
  status: 'pending' | 'completed' | 'failed'
  timestamp: string
  txHash: string
  gasUsed: string
  gasFee: string
}

// Vault Filters Type
export interface VaultFilters {
  search: string
  risk: string
  category: string
  minAPY: string
}

// Rule Engine Types
export interface Distribution {
  address: string
  percentage: number
  label: string
}

export interface AutomationRule {
  id: string
  name: string
  status: 'active' | 'paused'
  trigger: string
  lastExecution: string | null
  nextExecution: string | null
  totalDistributed: string
  description: string
  conditions: {
    minProfit: string
    frequency: string
    vaultIds: string[]
  }
  distributions: Distribution[]
}

// Analytics Types
export interface ProtocolDistribution {
  name: string
  value: number
  color: string
}

export interface VaultPerformance {
  vaultId: string
  name: string
  apy: string
  tvl: string
  users: number
  monthlyReturn: string
  riskScore: number
}

export interface PlatformMetrics {
  totalValueLocked: string
  totalUsers: string
  totalVaults: string
  totalTransactions: string
  averageAPY: string
  monthlyGrowth: string
  totalYieldGenerated: string
  activeAutomations: string
}

// User Types
export interface UserProfile {
  address: string
  ensName?: string
  avatar?: string
  joinDate: string
  totalDeposited: string
  totalEarned: string
  activePositions: number
  activeRules: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  currency: 'USD' | 'ETH' | 'BTC'
  notifications: {
    email: boolean
    push: boolean
    ruleExecutions: boolean
    priceAlerts: boolean
  }
  privacy: {
    showBalance: boolean
    shareAnalytics: boolean
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T = unknown> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface FormFieldProps extends BaseComponentProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
}

// Hook Types
export interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: unknown[]) => Promise<void>
  reset: () => void
}

export interface UseLocalStorage<T> {
  value: T
  setValue: (value: T) => void
  removeValue: () => void
}

// Web3 Types
export interface WalletConnection {
  address: string
  chainId: number
  isConnected: boolean
  balance?: string
  ensName?: string
}

export interface ContractCall {
  contractAddress: string
  abi: unknown[]
  functionName: string
  args?: unknown[]
  value?: string
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: string
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message)
    this.name = 'NetworkError'
  }
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}