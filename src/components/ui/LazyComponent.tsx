import React from 'react'
import dynamic from 'next/dynamic'
import { LoadingSpinner } from './Loading'

// Lazy load components with custom loading states
export const LazyModal = dynamic(() => import('./Modal'), {
  loading: () => <LoadingSpinner size="md" />,
  ssr: false,
})

// TODO: Create Chart component when needed
// export const LazyChart = dynamic(() => import('../charts/Chart'), {
//   loading: () => (
//     <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
//       <LoadingSpinner size="lg" />
//     </div>
//   ),
//   ssr: false,
// })

// HOC for lazy loading any component
export function withLazyLoading<P extends object>(
  componentImport: () => Promise<{ default: React.ComponentType<P> }>,
  fallback?: React.ComponentType
) {
  return dynamic(componentImport, {
    loading: fallback ? () => React.createElement(fallback) : () => <LoadingSpinner />,
    ssr: false,
  })
}