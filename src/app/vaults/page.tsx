'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, TrendingUp, Shield, Info } from 'lucide-react'
import { RISK_LEVELS } from '@/lib/constants'
import { type Vault, type RiskLevel, type VaultFilters } from '@/types'
import { Card, CardHeader, CardContent, CardFooter, Button, Badge, Input, Loading } from '@/components/ui'
import { useDebounce, useAsync } from '@/hooks'
import { vaultService } from '@/mock'

/**
 * Vaults Page Component
 * 
 * TODO: Future API Integration Tasks:
 * 1. Replace vaultService with real API client
 * 2. Add real-time vault data updates via WebSocket
 * 3. Implement vault deposit/withdrawal with smart contracts
 * 4. Add vault performance charts and analytics
 * 5. Integrate with user authentication for personalized data
 */

const VaultsPage = () => {
  const [filters, setFilters] = useState<VaultFilters>({
    search: '',
    risk: 'All',
    category: 'All',
    minAPY: ''
  })

  // Debounce search input for better performance
  const debouncedSearch = useDebounce(filters.search, 300)

  // Use async hook for vault data fetching
  // TODO: Replace with real API endpoint when backend is ready
  const { data: vaults, loading, error, execute: fetchVaults } = useAsync(vaultService.getVaults)

  // Fetch vaults on component mount and when filters change
  useEffect(() => {
    const filterParams = {
      search: debouncedSearch,
      risk: filters.risk,
      category: filters.category,
      minAPY: filters.minAPY
    }
    fetchVaults(filterParams)
  }, [debouncedSearch, filters.risk, filters.category, filters.minAPY, fetchVaults])

  // Use fetched vaults or empty array as fallback
  const displayVaults = vaults || []

  const updateFilter = (key: keyof VaultFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      risk: 'All',
      category: 'All',
      minAPY: ''
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Valux Vaults
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Choose from our carefully curated selection of DeFi vaults to maximize your yields
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8" padding="md">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <Input
                placeholder="Search vaults, assets, or protocols..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                startIcon={<Search className="h-4 w-4 text-gray-400" />}
                className="w-full"
              />
            </div>

            {/* Risk Filter */}
            <div>
              <select
                value={filters.risk}
                onChange={(e) => updateFilter('risk', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="All">All Risk Levels</option>
                <option value={RISK_LEVELS.LOW}>Low Risk</option>
                <option value={RISK_LEVELS.MEDIUM}>Medium Risk</option>
                <option value={RISK_LEVELS.HIGH}>High Risk</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="All">All Categories</option>
                <option value="stable">Stable</option>
                <option value="yield">Yield</option>
                <option value="growth">Growth</option>
              </select>
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
                size="md"
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="text-center py-8 mb-6 border-red-200 bg-red-50" padding="lg">
            <div className="text-red-600">
              <h3 className="text-lg font-medium mb-2">Failed to load vaults</h3>
              <p className="mb-4">{error}</p>
              <Button variant="primary" onClick={() => fetchVaults(filters)}>
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loading size="lg" />
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {displayVaults.length} vaults
              {/* TODO: Add total count from API response */}
            </p>
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        )}

        {/* Vaults Grid */}
        {!loading && !error && displayVaults.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayVaults.map((vault) => (
              <VaultCard key={vault.id} vault={vault} />
            ))}
          </div>
        ) : !loading && !error ? (
          <Card className="text-center py-12" padding="lg">
            <div className="text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No vaults found
              </h3>
              <p className="mb-4">
                No vaults match your current filters. Try adjusting your criteria.
              </p>
              <Button variant="primary" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </Card>
        ) : null}

        {/* Info Section */}
        <Card className="mt-16 bg-blue-50 border-blue-200" padding="lg">
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Security & Insurance
              </h3>
              <p className="text-gray-700 mb-4">
                All vaults are built on audited protocols and feature additional security measures including:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                {[
                  'Smart contract audits by leading firms',
                  'Real-time monitoring and alerts',
                  'Insurance coverage through DeFi protocols',
                  'Emergency pause mechanisms'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-3 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Vault Card Component
interface VaultCardProps {
  vault: Vault
}

const VaultCard = ({ vault }: VaultCardProps) => {
  const handleDeposit = () => {
    // TODO: Implement real deposit functionality
    // 1. Check user wallet connection
    // 2. Validate deposit amount and minimum requirements
    // 3. Call smart contract deposit function
    // 4. Handle transaction states (pending, success, error)
    // 5. Update user portfolio after successful deposit
    console.log('Deposit to vault:', vault.id)
  }

  const handleInfo = () => {
    // TODO: Implement vault info modal
    // 1. Fetch detailed vault information and performance data
    // 2. Show vault strategy, fees, and risk details
    // 3. Display historical performance charts
    // 4. Add links to protocol documentation
    console.log('Show vault info:', vault.id)
  }

  return (
    <Card hover padding="md" className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {vault.name}
            </h3>
            <p className="text-sm text-gray-500">
              {vault.protocol} • {vault.asset}
            </p>
          </div>
          <div className="ml-3 flex items-center space-x-2">
            <Badge variant="risk" riskLevel={vault.risk as RiskLevel} size="sm">
              {vault.risk} Risk
            </Badge>
            {vault.isInsured && (
              <Shield className="h-4 w-4 text-green-600" aria-label="Insured" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {/* Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">APY</span>
            <span className="text-lg font-semibold text-green-600 flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              {vault.apy}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">TVL</span>
            <span className="text-sm font-medium text-gray-900">{vault.tvl}</span>
          </div>
          {vault.minDeposit && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Min. Deposit</span>
              <span className="text-sm font-medium text-gray-900">
                {vault.minDeposit} {vault.asset}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {vault.description}
        </p>

        {/* Features */}
        <div className="space-y-2">
          {vault.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-xs text-gray-500">
              <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2 flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter align="between">
        <Button
          variant="primary"
          onClick={handleDeposit}
          className="flex-1"
          size="sm"
        >
          Deposit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleInfo}
          className="ml-2 p-2"
          aria-label={`More info about ${vault.name}`}
        >
          <Info className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default VaultsPage