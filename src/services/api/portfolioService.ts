/**
 * Portfolio Service
 * Handles portfolio-related API calls
 */

import { apiClient } from './client'
import { 
  PortfolioOverviewDto, 
  PortfolioPositionDto, 
  TransactionDto, 
  TransactionQueryDto, 
  TransactionListResponseDto, 
  PortfolioExportQueryDto, 
  PortfolioExportResponseDto 
} from './types'
import { 
  transformPortfolioOverview, 
  transformPortfolioPosition, 
  transformTransaction 
} from './transformers'

export class PortfolioService {
  /**
   * Get portfolio overview for a user
   */
  async getPortfolioOverview(address: string) {
    const dto = await apiClient.get<PortfolioOverviewDto>(`/portfolio/user/${address}`)
    return transformPortfolioOverview(dto)
  }

  /**
   * Get all portfolio positions for a user
   */
  async getPortfolioPositions(address: string) {
    const positions = await apiClient.get<PortfolioPositionDto[]>(`/portfolio/user/${address}/positions`)
    return positions.map(transformPortfolioPosition)
  }

  /**
   * Get transaction history for a user
   */
  async getTransactionHistory(query: TransactionQueryDto) {
    const params: Record<string, string> = {
      ...(query.type && { type: query.type }),
      ...(query.vaultId && { vaultId: query.vaultId }),
      ...(query.status && { status: query.status }),
      ...(query.startDate && { startDate: query.startDate }),
      ...(query.endDate && { endDate: query.endDate }),
      ...(query.page && { page: query.page.toString() }),
      ...(query.limit && { limit: query.limit.toString() }),
    }

    const response = await apiClient.get<TransactionListResponseDto>(
      `/portfolio/user/${query.address}/transactions`,
      params
    )

    return {
      transactions: response.transactions.map(transformTransaction),
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
      hasNext: response.hasNext,
      hasPrev: response.hasPrev,
    }
  }

  /**
   * Export portfolio data
   */
  async exportPortfolioData(query: PortfolioExportQueryDto) {
    const params: Record<string, string> = {
      ...(query.format && { format: query.format }),
      ...(query.year && { year: query.year.toString() }),
      ...(query.startDate && { startDate: query.startDate }),
      ...(query.endDate && { endDate: query.endDate }),
      ...(query.taxableOnly !== undefined && { taxableOnly: query.taxableOnly.toString() }),
    }

    const response = await apiClient.get<PortfolioExportResponseDto>(
      `/portfolio/user/${query.address}/export`,
      params
    )

    return response
  }

  /**
   * Get portfolio statistics
   */
  async getPortfolioStats(address: string) {
    const overview = await this.getPortfolioOverview(address)
    const positions = await this.getPortfolioPositions(address)

    const totalValue = parseFloat(overview.totalValue)
    const totalDeposited = parseFloat(overview.totalDeposited)
    const totalPnL = parseFloat(overview.totalPnL)

    return {
      overview,
      positions,
      stats: {
        totalValue,
        totalDeposited,
        totalPnL,
        pnlPercentage: totalDeposited > 0 ? (totalPnL / totalDeposited) * 100 : 0,
        positionCount: positions.length,
        avgAPY: overview.avgAPY,
        performance: overview.performance,
      },
    }
  }

  /**
   * Get transactions by type
   */
  async getTransactionsByType(
    address: string, 
    type: 'deposit' | 'withdrawal' | 'distribution' | 'reinvest'
  ) {
    return this.getTransactionHistory({
      address,
      type,
      limit: 100,
    })
  }

  /**
   * Get transactions by vault
   */
  async getTransactionsByVault(address: string, vaultId: string) {
    return this.getTransactionHistory({
      address,
      vaultId,
      limit: 100,
    })
  }

  /**
   * Get transactions by date range
   */
  async getTransactionsByDateRange(
    address: string, 
    startDate: string, 
    endDate: string
  ) {
    return this.getTransactionHistory({
      address,
      startDate,
      endDate,
      limit: 100,
    })
  }

  /**
   * Get pending transactions
   */
  async getPendingTransactions(address: string) {
    return this.getTransactionHistory({
      address,
      status: 'pending',
      limit: 50,
    })
  }

  /**
   * Get recent transactions
   */
  async getRecentTransactions(address: string, limit: number = 10) {
    return this.getTransactionHistory({
      address,
      limit,
      page: 1,
    })
  }

  /**
   * Calculate portfolio performance
   */
  async calculatePerformance(address: string) {
    const overview = await this.getPortfolioOverview(address)
    const positions = await this.getPortfolioPositions(address)

    const totalValue = parseFloat(overview.totalValue)
    const totalDeposited = parseFloat(overview.totalDeposited)
    const totalPnL = totalValue - totalDeposited

    return {
      totalValue,
      totalDeposited,
      totalPnL,
      pnlPercentage: totalDeposited > 0 ? (totalPnL / totalDeposited) * 100 : 0,
      bestPerforming: positions.reduce((best, pos) => {
        const currentPnL = parseFloat(pos.gainLoss.replace(/[+%,]/g, ''))
        const bestPnL = parseFloat(best.gainLoss.replace(/[+%,]/g, ''))
        return currentPnL > bestPnL ? pos : best
      }, positions[0]),
      worstPerforming: positions.reduce((worst, pos) => {
        const currentPnL = parseFloat(pos.gainLoss.replace(/[+%,]/g, ''))
        const worstPnL = parseFloat(worst.gainLoss.replace(/[+%,]/g, ''))
        return currentPnL < worstPnL ? pos : worst
      }, positions[0]),
      performance: overview.performance,
    }
  }

  /**
   * Get portfolio allocation
   */
  async getPortfolioAllocation(address: string) {
    const positions = await this.getPortfolioPositions(address)
    const totalValue = positions.reduce((sum, pos) => sum + parseFloat(pos.currentValue), 0)

    return positions.map(position => ({
      vaultId: position.vaultId,
      vaultName: position.vaultName,
      asset: position.asset,
      value: parseFloat(position.currentValue),
      percentage: totalValue > 0 ? (parseFloat(position.currentValue) / totalValue) * 100 : 0,
      pnl: parseFloat(position.gainLoss.replace(/[+%,]/g, '')),
    }))
  }

  /**
   * Export portfolio to CSV
   */
  async exportToCSV(address: string, year?: number) {
    return this.exportPortfolioData({
      address,
      format: 'csv',
      year,
    })
  }

  /**
   * Export portfolio to JSON
   */
  async exportToJSON(address: string, year?: number) {
    return this.exportPortfolioData({
      address,
      format: 'json',
      year,
    })
  }

  /**
   * Export portfolio to PDF
   */
  async exportToPDF(address: string, year?: number) {
    return this.exportPortfolioData({
      address,
      format: 'pdf',
      year,
    })
  }

  /**
   * Get tax report
   */
  async getTaxReport(address: string, year: number) {
    return this.exportPortfolioData({
      address,
      format: 'csv',
      year,
      taxableOnly: true,
    })
  }
}

export const portfolioService = new PortfolioService()