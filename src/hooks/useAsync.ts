'use client'

import { useState, useCallback } from 'react'
import { type UseAsyncState } from '@/types'

export function useAsync<T = unknown, Args extends unknown[] = unknown[]>(
  asyncFunction: (...args: Args) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: Args) => {
      try {
        setLoading(true)
        setError(null)
        const result = await asyncFunction(...args)
        setData(result)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred'
        setError(errorMessage)
        console.error('Async operation failed:', err)
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setData(null)
    setLoading(false)
    setError(null)
  }, [])

  return {
    data,
    loading,
    error,
    execute,
    reset,
  }
}