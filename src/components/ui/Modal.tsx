'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ModalProps } from '@/types'
import Button from './Button'

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  className,
  children,
}: ModalProps) => {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent background scroll
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={cn(
            // Base styles
            'relative w-full rounded-xl bg-white shadow-2xl transition-all',
            // Size
            modalSizes[size],
            // Custom className
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                {title}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full p-2"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Content */}
          <div className={cn('p-6', title && 'pt-0')}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  // Render in portal
  return typeof window !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null
}

// Modal Header Component
interface ModalHeaderProps {
  children: React.ReactNode
  className?: string
}

export const ModalHeader = ({ children, className }: ModalHeaderProps) => (
  <div className={cn('mb-4', className)}>
    {children}
  </div>
)

// Modal Body Component
interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

export const ModalBody = ({ children, className }: ModalBodyProps) => (
  <div className={cn('mb-6', className)}>
    {children}
  </div>
)

// Modal Footer Component
interface ModalFooterProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}

export const ModalFooter = ({ 
  children, 
  className, 
  align = 'right' 
}: ModalFooterProps) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return (
    <div className={cn(
      'flex gap-3 pt-4 border-t border-gray-200',
      alignmentClasses[align],
      className
    )}>
      {children}
    </div>
  )
}

export default Modal