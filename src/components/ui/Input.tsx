import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { type FormFieldProps } from '@/types'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>, FormFieldProps {
  variant?: 'default' | 'filled'
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    variant = 'default',
    label,
    error,
    required = false,
    disabled = false,
    startIcon,
    endIcon,
    type = 'text',
    ...props
  }, ref) => {
    const variantStyles = {
      default: 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500',
      filled: 'border-transparent bg-gray-100 focus:border-blue-500 focus:ring-blue-500 focus:bg-white',
    }

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {startIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={type}
            className={cn(
              // Base styles
              'block w-full rounded-lg border px-3 py-2 text-sm placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
              // Variant styles
              variantStyles[variant],
              // Icon spacing
              startIcon && 'pl-10',
              endIcon && 'pr-10',
              // Error state
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              // Custom className
              className
            )}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {endIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p
            id={`${props.id}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input