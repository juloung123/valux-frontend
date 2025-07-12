// App Configuration
export const APP_CONFIG = {
  name: 'Valux.finance',
  description: 'The most user-friendly DeFi automation platform for seamless profit distribution and yield optimization.',
  version: '1.0.0',
  author: 'Valux Finance Team',
} as const

// Navigation
export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/', icon: 'Home' },
  { name: 'Vaults', href: '/vaults', icon: 'Vault' },
  { name: 'Dashboard', href: '/dashboard', icon: 'BarChart3' },
  { name: 'Rules', href: '/rules', icon: 'Settings' },
  { name: 'Analytics', href: '/analytics', icon: 'TrendingUp' },
] as const

// UI Constants
export const UI = {
  HEADER_HEIGHT: 'h-16',
  MAX_WIDTH: 'max-w-7xl',
  BORDER_RADIUS: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  },
  SHADOWS: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  Z_INDEX: {
    header: 'z-40',
    modal: 'z-50',
    tooltip: 'z-60',
  },
} as const

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Colors
export const COLORS = {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  secondary: {
    50: '#fdf4ff',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
} as const

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const

export const RISK_COLORS = {
  [RISK_LEVELS.LOW]: 'bg-green-100 text-green-800',
  [RISK_LEVELS.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [RISK_LEVELS.HIGH]: 'bg-red-100 text-red-800',
} as const

// Web3 Constants
export const WEB3 = {
  SUPPORTED_CHAINS: ['arbitrum', 'arbitrumSepolia'] as const,
  WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  DEFAULT_CHAIN: 'arbitrum',
} as const

// API Endpoints (for future use)
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.valux.finance',
  ENDPOINTS: {
    vaults: '/vaults',
    transactions: '/transactions',
    rules: '/rules',
    analytics: '/analytics',
  },
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  theme: 'valux-theme',
  wallet: 'valux-wallet-connection',
  preferences: 'valux-user-preferences',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  TRANSACTION_SUCCESS: 'Transaction completed successfully',
  RULE_CREATED: 'Rule created successfully',
  RULE_UPDATED: 'Rule updated successfully',
  RULE_DELETED: 'Rule deleted successfully',
} as const