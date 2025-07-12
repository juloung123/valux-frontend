import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { type BaseComponentProps } from '@/types'

interface CardProps extends BaseComponentProps {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const cardVariants = {
  default: 'bg-white',
  outlined: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-lg border border-gray-100',
}

const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'outlined',
    padding = 'md',
    hover = false,
    children,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl transition-all duration-200',
          // Variants
          cardVariants[variant],
          // Padding
          cardPadding[padding],
          // Hover effect
          hover && 'hover:shadow-md hover:-translate-y-0.5',
          // Custom className
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
interface CardHeaderProps extends BaseComponentProps {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between',
          className
        )}
        {...props}
      >
        <div className="min-w-0 flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 truncate">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

// Card Content Component
interface CardContentProps extends BaseComponentProps {
  spacing?: 'sm' | 'md' | 'lg'
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mt-4', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

// Card Footer Component
interface CardFooterProps extends BaseComponentProps {
  align?: 'left' | 'center' | 'right' | 'between'
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'right', children, ...props }, ref) => {
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mt-6 flex items-center',
          alignmentClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export default Card