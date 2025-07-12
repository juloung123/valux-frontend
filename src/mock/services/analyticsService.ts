import { 
  mockPlatformMetrics, 
  mockProtocolDistribution, 
  mockVaultPerformance, 
  mockTimeSeriesData 
} from '../data/analytics'
import { type PlatformMetrics, type ProtocolDistribution, type VaultPerformance } from '@/types'

/**
 * Mock Analytics Service
 * Simulates API calls for platform analytics and metrics
 * 
 * TODO: Replace with actual API integration
 * - Implement real-time data aggregation
 * - Add data caching and optimization
 * - Integrate with business intelligence tools
 * - Add custom dashboard creation
 */

class MockAnalyticsService {
  /**
   * Get platform-wide metrics
   * TODO: Replace with GET /api/analytics/platform
   */
  async getPlatformMetrics(): Promise<PlatformMetrics> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Simulate real-time updates with slight variations
    const baseMetrics = { ...mockPlatformMetrics }
    
    // Add small random variations to simulate live data
    const variation = (value: string, percentage: number = 0.01) => {
      const numericValue = parseFloat(value.replace(/[$,%KM]/g, ''))
      const factor = 1 + (Math.random() - 0.5) * percentage
      const newValue = numericValue * factor
      
      if (value.includes('M')) return `$${(newValue / 1000000).toFixed(1)}M`
      if (value.includes('K')) return `$${(newValue / 1000).toFixed(0)}K`
      if (value.includes('$')) return `$${newValue.toFixed(0)}`
      if (value.includes('%')) return `${newValue.toFixed(1)}%`
      return Math.floor(newValue).toString()
    }
    
    return {
      ...baseMetrics,
      totalValueLocked: variation(baseMetrics.totalValueLocked),
      totalUsers: variation(baseMetrics.totalUsers, 0.005),
      totalTransactions: variation(baseMetrics.totalTransactions, 0.02),
      totalYieldGenerated: variation(baseMetrics.totalYieldGenerated)
    }
  }

  /**
   * Get protocol distribution data
   * TODO: Replace with GET /api/analytics/protocols
   */
  async getProtocolDistribution(): Promise<ProtocolDistribution[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    return mockProtocolDistribution
  }

  /**
   * Get vault performance metrics
   * TODO: Replace with GET /api/analytics/vaults
   */
  async getVaultPerformance(): Promise<VaultPerformance[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return mockVaultPerformance
  }

  /**
   * Get time-series data for charts
   * TODO: Replace with GET /api/analytics/timeseries
   */
  async getTimeSeriesData(
    metric: 'tvl' | 'users' | 'yield',
    period: '1d' | '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<Array<{ date: string; value: number }>> {
    await new Promise(resolve => setTimeout(resolve, 700))
    
    // TODO: Filter data based on period when integrating real API
    console.log(`Fetching ${metric} data for period: ${period}`)
    
    const dataMap = {
      tvl: mockTimeSeriesData.tvlHistory,
      users: mockTimeSeriesData.userGrowth,
      yield: mockTimeSeriesData.yieldGenerated
    }
    
    return dataMap[metric] || []
  }

  /**
   * Get user analytics for admin dashboard
   * TODO: Replace with GET /api/analytics/users
   */
  async getUserAnalytics(): Promise<{
    activeUsers: number
    newUsers: number
    retentionRate: string
    averageDeposit: string
    topCountries: Array<{ country: string; users: number }>
    userGrowthRate: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return {
      activeUsers: 892,
      newUsers: 156,
      retentionRate: '78.5%',
      averageDeposit: '$3,245',
      topCountries: [
        { country: 'United States', users: 342 },
        { country: 'United Kingdom', users: 189 },
        { country: 'Germany', users: 156 },
        { country: 'Singapore', users: 98 },
        { country: 'Canada', users: 87 }
      ],
      userGrowthRate: '+24.3%'
    }
  }

  /**
   * Get revenue analytics
   * TODO: Replace with GET /api/analytics/revenue
   */
  async getRevenueAnalytics(): Promise<{
    totalRevenue: string
    monthlyRevenue: string
    revenueGrowth: string
    feesByProtocol: Array<{ protocol: string; fees: number }>
    projectedRevenue: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    return {
      totalRevenue: '$156,890',
      monthlyRevenue: '$23,450',
      revenueGrowth: '+18.7%',
      feesByProtocol: [
        { protocol: 'Aave', fees: 8450 },
        { protocol: 'Compound', fees: 6780 },
        { protocol: 'Yearn', fees: 4320 },
        { protocol: 'Curve', fees: 2890 },
        { protocol: 'Lido', fees: 1010 }
      ],
      projectedRevenue: '$320,000'
    }
  }

  /**
   * Get risk analytics
   * TODO: Replace with GET /api/analytics/risk
   */
  async getRiskAnalytics(): Promise<{
    overallRiskScore: number
    riskDistribution: Array<{ level: string; percentage: number }>
    protocolRisks: Array<{ protocol: string; riskScore: number }>
    recommendations: string[]
  }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      overallRiskScore: 4.2,
      riskDistribution: [
        { level: 'Low', percentage: 45 },
        { level: 'Medium', percentage: 35 },
        { level: 'High', percentage: 20 }
      ],
      protocolRisks: [
        { protocol: 'Aave', riskScore: 2.1 },
        { protocol: 'Compound', riskScore: 2.8 },
        { protocol: 'Yearn', riskScore: 4.5 },
        { protocol: 'Curve', riskScore: 6.2 },
        { protocol: 'Lido', riskScore: 3.1 }
      ],
      recommendations: [
        'Consider rebalancing towards lower-risk protocols',
        'Monitor Curve protocol exposure due to higher volatility',
        'Diversify across more protocols to reduce concentration risk'
      ]
    }
  }
}

export const analyticsService = new MockAnalyticsService()