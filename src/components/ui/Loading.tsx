import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export const LoadingSpinner = ({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps) => (
  <Loader2 
    className={cn(
      'animate-spin text-blue-600',
      spinnerSizes[size],
      className
    )} 
  />
)

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  message?: string
}

export const LoadingOverlay = ({ 
  isLoading, 
  children, 
  className,
  message = 'Loading...'
}: LoadingOverlayProps) => (
  <div className={cn('relative', className)}>
    {children}
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600">{message}</p>
        </div>
      </div>
    )}
  </div>
)

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  width?: string | number
  height?: string | number
}

export const Skeleton = ({ 
  className,
  variant = 'text',
  width,
  height
}: SkeletonProps) => {
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  }

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variantClasses[variant],
        className
      )}
      style={style}
    />
  )
}

// Skeleton presets for common patterns
export const SkeletonCard = ({ className }: { className?: string }) => (
  <div className={cn('p-6 border border-gray-200 rounded-xl', className)}>
    <div className="flex items-center space-x-3 mb-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
    <div className="flex justify-between mt-6">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
)

export const SkeletonTable = ({ 
  rows = 5, 
  cols = 4,
  className 
}: { 
  rows?: number
  cols?: number
  className?: string 
}) => (
  <div className={cn('space-y-4', className)}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-6 flex-1" />
        ))}
      </div>
    ))}
  </div>
)

// Simple Loading component alias for LoadingSpinner
export const Loading = LoadingSpinner