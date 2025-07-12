'use client'

import { useState, useEffect } from 'react'
import { type UseLocalStorage } from '@/types'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorage<T> {
  // Get value from localStorage or use initial value
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  const setStoredValue = (newValue: T) => {
    try {
      setValue(newValue)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue))
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error)
    }
  }

  // Remove value from localStorage
  const removeValue = () => {
    try {
      setValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }

  // Listen for storage changes from other tabs
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing localStorage value for "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return {
    value,
    setValue: setStoredValue,
    removeValue,
  }
}