/**
 * Rules Service
 * Handles automation rules API calls
 */

import { apiClient } from './client'
import { 
  RuleDto, 
  CreateRuleDto, 
  UpdateRuleDto, 
  RuleFilterDto, 
  RuleListResponseDto, 
  ExecuteRuleResponseDto 
} from './types'
import { 
  transformRule, 
  transformCreateRule 
} from './transformers'
import { AutomationRule } from '../../types'

export class RulesService {
  /**
   * Create new automation rule
   */
  async createRule(rule: any): Promise<AutomationRule> {
    const createDto = transformCreateRule(rule)
    const ruleDto = await apiClient.post<RuleDto>('/rules', createDto)
    return transformRule(ruleDto)
  }

  /**
   * Get user's automation rules
   */
  async getUserRules(
    address: string, 
    filters?: {
      vaultId?: string
      trigger?: string
      active?: boolean
      search?: string
      includeExecutions?: boolean
    }
  ): Promise<AutomationRule[]> {
    const params: Record<string, string> = {
      ...(filters?.vaultId && { vaultId: filters.vaultId }),
      ...(filters?.trigger && { trigger: filters.trigger }),
      ...(filters?.active !== undefined && { active: filters.active.toString() }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.includeExecutions !== undefined && { includeExecutions: filters.includeExecutions.toString() }),
    }

    const response = await apiClient.get<RuleListResponseDto>(
      `/rules/user/${address}`,
      params
    )

    return response.rules.map(transformRule)
  }

  /**
   * Get user's rules with pagination
   */
  async getUserRulesPaginated(
    address: string, 
    filters?: {
      vaultId?: string
      trigger?: string
      active?: boolean
      search?: string
      includeExecutions?: boolean
      page?: number
      limit?: number
    }
  ) {
    const params: Record<string, string> = {
      ...(filters?.vaultId && { vaultId: filters.vaultId }),
      ...(filters?.trigger && { trigger: filters.trigger }),
      ...(filters?.active !== undefined && { active: filters.active.toString() }),
      ...(filters?.search && { search: filters.search }),
      ...(filters?.includeExecutions !== undefined && { includeExecutions: filters.includeExecutions.toString() }),
      ...(filters?.page && { page: filters.page.toString() }),
      ...(filters?.limit && { limit: filters.limit.toString() }),
    }

    const response = await apiClient.get<RuleListResponseDto>(
      `/rules/user/${address}`,
      params
    )

    return {
      rules: response.rules.map(transformRule),
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
      hasNext: response.hasNext,
      hasPrev: response.hasPrev,
    }
  }

  /**
   * Get specific rule by ID
   */
  async getRuleById(id: string, userAddress: string): Promise<AutomationRule | null> {
    try {
      const ruleDto = await apiClient.get<RuleDto>(`/rules/${id}`, { userAddress })
      return transformRule(ruleDto)
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  }

  /**
   * Update automation rule
   */
  async updateRule(id: string, userAddress: string, updates: any): Promise<AutomationRule> {
    const updateDto: UpdateRuleDto = {
      ...(updates.name && { name: updates.name }),
      ...(updates.description && { description: updates.description }),
      ...(updates.trigger && { trigger: updates.trigger.toLowerCase() }),
      ...(updates.profitThreshold && { profitThreshold: updates.profitThreshold }),
      ...(updates.distributions && { 
        distributions: updates.distributions.map((dist: any) => ({
          recipient: dist.address,
          percentage: dist.percentage,
          description: dist.label,
        }))
      }),
      ...(updates.active !== undefined && { active: updates.active }),
    }

    const ruleDto = await apiClient.put<RuleDto>(`/rules/${id}?userAddress=${userAddress}`, updateDto)
    return transformRule(ruleDto)
  }

  /**
   * Delete automation rule
   */
  async deleteRule(id: string, userAddress: string): Promise<void> {
    await apiClient.delete<void>(`/rules/${id}?userAddress=${userAddress}`)
  }

  /**
   * Toggle rule active/inactive
   */
  async toggleRule(id: string, userAddress: string): Promise<AutomationRule> {
    const ruleDto = await apiClient.put<RuleDto>(`/rules/${id}/toggle?userAddress=${userAddress}`)
    return transformRule(ruleDto)
  }

  /**
   * Execute rule manually
   */
  async executeRule(id: string, userAddress: string): Promise<{
    success: boolean
    executionId: string
    profitAmount: string
    distributions: Array<{
      recipient: string
      amount: string
      transactionHash: string
    }>
    gasUsed: string
    executionTime: number
    message: string
  }> {
    const response = await apiClient.post<ExecuteRuleResponseDto>(
      `/rules/${id}/execute?userAddress=${userAddress}`
    )
    return response
  }

  /**
   * Get active rules for user
   */
  async getActiveRules(address: string): Promise<AutomationRule[]> {
    return this.getUserRules(address, { active: true })
  }

  /**
   * Get inactive/paused rules for user
   */
  async getInactiveRules(address: string): Promise<AutomationRule[]> {
    return this.getUserRules(address, { active: false })
  }

  /**
   * Get rules by trigger type
   */
  async getRulesByTrigger(
    address: string, 
    trigger: 'weekly' | 'monthly' | 'quarterly' | 'profit_threshold'
  ): Promise<AutomationRule[]> {
    return this.getUserRules(address, { trigger })
  }

  /**
   * Get rules for specific vault
   */
  async getRulesForVault(address: string, vaultId: string): Promise<AutomationRule[]> {
    return this.getUserRules(address, { vaultId })
  }

  /**
   * Search rules by name
   */
  async searchRules(address: string, query: string): Promise<AutomationRule[]> {
    return this.getUserRules(address, { search: query })
  }

  /**
   * Get rule execution history
   */
  async getRuleExecutions(address: string, ruleId?: string) {
    const rules = await this.getUserRules(address, { 
      includeExecutions: true,
      ...(ruleId && { search: ruleId })
    })

    // Extract execution data from rules
    return rules.map(rule => ({
      ruleId: rule.id,
      ruleName: rule.name,
      lastExecution: rule.lastExecution,
      nextExecution: rule.nextExecution,
      totalDistributed: rule.totalDistributed,
      status: rule.status,
    }))
  }

  /**
   * Get rule statistics
   */
  async getRuleStats(address: string) {
    const rules = await this.getUserRules(address, { includeExecutions: true })
    
    const activeRules = rules.filter(rule => rule.status === 'active')
    const totalDistributed = rules.reduce((sum, rule) => {
      return sum + parseFloat(rule.totalDistributed || '0')
    }, 0)

    return {
      totalRules: rules.length,
      activeRules: activeRules.length,
      inactiveRules: rules.length - activeRules.length,
      totalDistributed: totalDistributed.toString(),
      triggerBreakdown: {
        weekly: rules.filter(r => r.trigger === 'Weekly').length,
        monthly: rules.filter(r => r.trigger === 'Monthly').length,
        quarterly: rules.filter(r => r.trigger === 'Quarterly').length,
        profitThreshold: rules.filter(r => r.trigger === 'Profit Threshold').length,
      },
    }
  }

  /**
   * Activate rule
   */
  async activateRule(id: string, userAddress: string): Promise<AutomationRule> {
    const currentRule = await this.getRuleById(id, userAddress)
    if (!currentRule) {
      throw new Error('Rule not found')
    }

    if (currentRule.status === 'active') {
      return currentRule
    }

    return this.toggleRule(id, userAddress)
  }

  /**
   * Deactivate rule
   */
  async deactivateRule(id: string, userAddress: string): Promise<AutomationRule> {
    const currentRule = await this.getRuleById(id, userAddress)
    if (!currentRule) {
      throw new Error('Rule not found')
    }

    if (currentRule.status === 'paused') {
      return currentRule
    }

    return this.toggleRule(id, userAddress)
  }

  /**
   * Duplicate rule
   */
  async duplicateRule(id: string, userAddress: string): Promise<AutomationRule> {
    const originalRule = await this.getRuleById(id, userAddress)
    if (!originalRule) {
      throw new Error('Rule not found')
    }

    const duplicateData = {
      name: `${originalRule.name} (Copy)`,
      description: originalRule.description,
      userAddress,
      vaultId: originalRule.conditions.vaultIds[0],
      trigger: originalRule.conditions.frequency,
      profitThreshold: originalRule.conditions.minProfit,
      distributions: originalRule.distributions,
    }

    return this.createRule(duplicateData)
  }

  /**
   * Validate rule configuration
   */
  validateRule(rule: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!rule.name || rule.name.trim().length === 0) {
      errors.push('Rule name is required')
    }

    if (!rule.vaultId) {
      errors.push('Vault selection is required')
    }

    if (!rule.trigger) {
      errors.push('Trigger type is required')
    }

    if (!rule.distributions || rule.distributions.length === 0) {
      errors.push('At least one distribution is required')
    }

    if (rule.distributions) {
      const totalPercentage = rule.distributions.reduce((sum: number, dist: any) => sum + dist.percentage, 0)
      if (Math.abs(totalPercentage - 100) > 0.01) {
        errors.push('Distribution percentages must sum to 100%')
      }

      rule.distributions.forEach((dist: any, index: number) => {
        if (!dist.address || dist.address.trim().length === 0) {
          errors.push(`Distribution ${index + 1}: Address is required`)
        }
        if (dist.percentage <= 0 || dist.percentage > 100) {
          errors.push(`Distribution ${index + 1}: Percentage must be between 0 and 100`)
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export const rulesService = new RulesService()