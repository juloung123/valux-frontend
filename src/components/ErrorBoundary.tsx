'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Don't catch extension-related errors
    if (
      error.message?.includes('chrome-extension://') ||
      error.message?.includes('Cannot read properties of null') ||
      error.stack?.includes('injected.js')
    ) {
      return { hasError: false }
    }
    
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log non-extension errors
    if (
      !error.message?.includes('chrome-extension://') &&
      !error.message?.includes('Cannot read properties of null') &&
      !error.stack?.includes('injected.js')
    ) {
      console.error('Uncaught error:', error, errorInfo)
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠️</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h1>
              <p className="text-gray-600 mb-6">
                We encountered an unexpected error. Please refresh the page and try again.
              </p>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary