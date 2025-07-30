'use client'

import { useState, useCallback } from 'react'

export function useAsync<T = unknown, Args extends unknown[] = unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldStop, setShouldStop] = useState(false)

  const execute = useCallback(
    async (...args: Args) => {
      // Don't execute if we should stop (e.g., due to auth errors)
      if (shouldStop) {
        console.log('⏹️ useAsync execution stopped due to authentication error')
        return
      }

      try {
        setLoading(true)
        setError(null)
        const result = await asyncFunction(...args)
        setData(result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Async operation failed:', err)
        
        // Stop further executions if this is an authentication error
        if (err instanceof Error && err.message.includes('Authentication failed')) {
          console.log('🛑 Stopping useAsync due to authentication error')
          setShouldStop(true)
        }
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction, shouldStop]
  )

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
    setShouldStop(false)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
    shouldStop,
  }
}