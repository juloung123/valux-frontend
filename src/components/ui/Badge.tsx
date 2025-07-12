import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { type BaseComponentProps, type RiskLevel } from '@/types'
import { RISK_COLORS } from '@/lib/constants'

interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'risk'
  size?: 'sm' | 'md' | 'lg'
  riskLevel?: RiskLevel
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  risk: '', // Will be determined by riskLevel
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-sm',
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    riskLevel,
    children,
    ...props
  }, ref) => {
    const getRiskVariant = () => {
      if (variant === 'risk' && riskLevel) {
        return RISK_COLORS[riskLevel]
      }
      return badgeVariants[variant]
    }

    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center rounded-full font-medium',
          // Variant styles
          getRiskVariant(),
          // Size styles
          badgeSizes[size],
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export default Badge