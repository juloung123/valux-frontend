/**
 * Analytics Service
 * Handles analytics and metrics API calls
 */

import { apiClient } from './client'
import { 
  PlatformAnalyticsDto, 
  TvlMetricsDto, 
  TvlMetricsQueryDto, 
  UserAnalyticsDto 
} from './types'
import { 
  transformPlatformAnalytics, 
  transformTvlMetrics, 
  transformUserAnalytics, 
  transformProtocolDistribution 
} from './transformers'
import { PlatformMetrics, ProtocolDistribution } from '../../types'

export class AnalyticsService {
  /**
   * Get platform-wide analytics
   */
  async getPlatformAnalytics(): Promise<PlatformMetrics> {
    const dto = await apiClient.get<PlatformAnalyticsDto>('/analytics/platform')
    return transformPlatformAnalytics(dto)
  }

  /**
   * Get TVL metrics with timeframe
   */
  async getTvlMetrics(timeframe?: '24h' | '7d' | '30d' | '1y') {
    const params: Record<string, string> = {}
    if (timeframe) {
      params.timeframe = timeframe
    }

    const dto = await apiClient.get<TvlMetricsDto>('/analytics/tvl', params)
    return transformTvlMetrics(dto)
  }

  /**
   * Get user-specific analytics
   */
  async getUserAnalytics(address: string) {
    const dto = await apiClient.get<UserAnalyticsDto>(`/analytics/user/${address}`)
    return transformUserAnalytics(dto)
  }

  /**
   * Get protocol distribution
   */
  async getProtocolDistribution(): Promise<ProtocolDistribution[]> {
    const dto = await apiClient.get<PlatformAnalyticsDto>('/analytics/platform')
    return transformProtocolDistribution(dto.topProtocols)
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    const analytics = await this.getPlatformAnalytics()
    const tvlMetrics = await this.getTvlMetrics('30d')

    return {
      totalUsers: parseInt(analytics.totalUsers),
      totalVaults: parseInt(analytics.totalVaults),
      totalTransactions: parseInt(analytics.totalTransactions),
      totalTvl: analytics.totalValueLocked,
      avgAPY: analytics.averageAPY,
      tvlChange: tvlMetrics.change,
      protocolDistribution: await this.getProtocolDistribution(),
    }
  }

  /**
   * Get TVL history for charts
   */
  async getTvlHistory(timeframe: '24h' | '7d' | '30d' | '1y' = '30d') {
    const tvlMetrics = await this.getTvlMetrics(timeframe)
    return tvlMetrics.historical
  }

  /**
   * Get protocol performance
   */
  async getProtocolPerformance() {
    const analytics = await this.getPlatformAnalytics()
    
    return {
      protocols: analytics.totalVaults,
      topProtocols: await this.getProtocolDistribution(),
      avgAPY: analytics.averageAPY,
    }
  }

  /**
   * Get user portfolio performance
   */
  async getUserPortfolioPerformance(address: string) {
    const userAnalytics = await this.getUserAnalytics(address)
    
    return {
      totalValue: userAnalytics.portfolio.totalValue,
      pnl: userAnalytics.portfolio.pnl,
      pnlPercentage: userAnalytics.portfolio.pnlPercentage,
      bestPerformingVault: userAnalytics.portfolio.bestPerformingVault,
      worstPerformingVault: userAnalytics.portfolio.worstPerformingVault,
      totalDeposited: userAnalytics.user.totalDeposited,
      totalEarned: userAnalytics.user.totalEarned,
    }
  }

  /**
   * Get user automation stats
   */
  async getUserAutomationStats(address: string) {
    const userAnalytics = await this.getUserAnalytics(address)
    
    return {
      totalRules: userAnalytics.rules.totalRules,
      activeRules: userAnalytics.rules.activeRules,
      totalExecutions: userAnalytics.rules.totalExecutions,
      totalDistributed: userAnalytics.rules.totalDistributed,
      avgExecutionTime: userAnalytics.rules.avgExecutionTime,
    }
  }

  /**
   * Get user rankings
   */
  async getUserRankings(address: string) {
    const userAnalytics = await this.getUserAnalytics(address)
    
    return {
      portfolioSize: userAnalytics.rankings.portfolioSize,
      totalEarnings: userAnalytics.rankings.totalEarnings,
      automationUsage: userAnalytics.rankings.automationUsage,
    }
  }

  /**
   * Get user activity feed
   */
  async getUserActivity(address: string) {
    const userAnalytics = await this.getUserAnalytics(address)
    
    return userAnalytics.activity
  }

  /**
   * Get platform growth metrics
   */
  async getPlatformGrowth() {
    const tvlMetrics = await this.getTvlMetrics('30d')
    const platformAnalytics = await this.getPlatformAnalytics()
    
    return {
      tvlGrowth: tvlMetrics.change,
      userGrowth: {
        total: parseInt(platformAnalytics.totalUsers),
        // Note: Growth percentage calculation would need historical data
        percentage: 0, // Placeholder
      },
      transactionGrowth: {
        total: parseInt(platformAnalytics.totalTransactions),
        // Note: Growth percentage calculation would need historical data
        percentage: 0, // Placeholder
      },
    }
  }

  /**
   * Get vault performance analytics
   */
  async getVaultPerformance() {
    const analytics = await this.getPlatformAnalytics()
    
    return {
      totalVaults: parseInt(analytics.totalVaults),
      avgAPY: analytics.averageAPY,
      protocolDistribution: await this.getProtocolDistribution(),
    }
  }

  /**
   * Get recent platform activity
   */
  async getRecentActivity() {
    const analytics = await this.getPlatformAnalytics()
    
    return analytics.recentActivity || []
  }

  /**
   * Get analytics summary for dashboard
   */
  async getAnalyticsSummary() {
    const [platformAnalytics, tvlMetrics] = await Promise.all([
      this.getPlatformAnalytics(),
      this.getTvlMetrics('30d')
    ])

    return {
      platform: platformAnalytics,
      tvl: tvlMetrics,
      protocolDistribution: await this.getProtocolDistribution(),
    }
  }

  /**
   * Get analytics for specific timeframe
   */
  async getAnalyticsByTimeframe(timeframe: '24h' | '7d' | '30d' | '1y') {
    const [tvlMetrics, platformAnalytics] = await Promise.all([
      this.getTvlMetrics(timeframe),
      this.getPlatformAnalytics()
    ])

    return {
      timeframe,
      tvl: tvlMetrics,
      platform: platformAnalytics,
    }
  }

  /**
   * Get comparative analytics
   */
  async getComparativeAnalytics() {
    const [current, previous] = await Promise.all([
      this.getTvlMetrics('30d'),
      this.getTvlMetrics('30d') // In real implementation, this would be previous period
    ])

    return {
      current,
      previous,
      growth: current.change,
    }
  }

  /**
   * Search analytics data
   */
  async searchAnalytics(query: string) {
    // This would typically search across various analytics data
    // For now, we'll just return protocol distribution filtered by query
    const protocolDistribution = await this.getProtocolDistribution()
    
    return {
      protocols: protocolDistribution.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase())
      ),
    }
  }
}

export const analyticsService = new AnalyticsService()