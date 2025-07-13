import { mockAutomationRules, mockRulePerformance } from '../data/rules'
import { type AutomationRule } from '@/types'

/**
 * Mock Rules Service
 * Simulates API calls for automation rules operations
 * 
 * TODO: Replace with actual API integration
 * - Implement smart contract integration for rule execution
 * - Add real-time rule monitoring
 * - Integrate with automation engine backend
 * - Add rule validation and testing
 */

class MockRulesService {
  /**
   * Get user automation rules
   * TODO: Replace with GET /api/user/{address}/rules
   */
  async getRules(userAddress: string): Promise<{
    rules: AutomationRule[]
    performance: typeof mockRulePerformance
  }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!userAddress) {
      throw new Error('User address is required')
    }
    
    return {
      rules: mockAutomationRules,
      performance: mockRulePerformance
    }
  }

  /**
   * Create new automation rule
   * TODO: Replace with POST /api/user/{address}/rules
   */
  async createRule(
    userAddress: string,
    rule: Omit<AutomationRule, 'id' | 'lastExecution' | 'totalDistributed'>
  ): Promise<{
    success: boolean
    ruleId: string
    message: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (!userAddress) {
      throw new Error('User address is required')
    }
    
    // Mock rule validation
    if (!rule.name || rule.name.length < 3) {
      throw new Error('Rule name must be at least 3 characters')
    }
    
    if (!rule.distributions || rule.distributions.length === 0) {
      throw new Error('At least one distribution is required')
    }
    
    const totalPercentage = rule.distributions.reduce((sum, dist) => sum + dist.percentage, 0)
    if (totalPercentage !== 100) {
      throw new Error('Distribution percentages must sum to 100%')
    }
    
    const ruleId = `rule_${Date.now()}`
    
    return {
      success: true,
      ruleId,
      message: 'Automation rule created successfully'
    }
  }

  /**
   * Update existing automation rule
   * TODO: Replace with PUT /api/user/{address}/rules/{ruleId}
   */
  async updateRule(
    userAddress: string,
    ruleId: string,
    updates: Partial<AutomationRule>
  ): Promise<{
    success: boolean
    message: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    if (!userAddress || !ruleId) {
      throw new Error('User address and rule ID are required')
    }
    
    const existingRule = mockAutomationRules.find(r => r.id === ruleId)
    if (!existingRule) {
      throw new Error('Rule not found')
    }
    
    // TODO: Apply updates to rule when integrating real API
    console.log(`Updating rule ${ruleId} for user ${userAddress}:`, updates)
    
    return {
      success: true,
      message: 'Rule updated successfully'
    }
  }

  /**
   * Delete automation rule
   * TODO: Replace with DELETE /api/user/{address}/rules/{ruleId}
   */
  async deleteRule(userAddress: string, ruleId: string): Promise<{
    success: boolean
    message: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    if (!userAddress || !ruleId) {
      throw new Error('User address and rule ID are required')
    }
    
    return {
      success: true,
      message: 'Rule deleted successfully'
    }
  }

  /**
   * Pause/Resume automation rule
   * TODO: Replace with POST /api/user/{address}/rules/{ruleId}/toggle
   */
  async toggleRule(userAddress: string, ruleId: string): Promise<{
    success: boolean
    newStatus: 'active' | 'paused'
    message: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    if (!userAddress || !ruleId) {
      throw new Error('User address and rule ID are required')
    }
    
    const rule = mockAutomationRules.find(r => r.id === ruleId)
    if (!rule) {
      throw new Error('Rule not found')
    }
    
    const newStatus = rule.status === 'active' ? 'paused' : 'active'
    
    return {
      success: true,
      newStatus,
      message: `Rule ${newStatus === 'active' ? 'activated' : 'paused'} successfully`
    }
  }

  /**
   * Execute rule manually (for testing)
   * TODO: Replace with POST /api/user/{address}/rules/{ruleId}/execute
   */
  async executeRule(userAddress: string, ruleId: string): Promise<{
    success: boolean
    transactionHash: string
    distributedAmount: string
    message: string
  }> {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate blockchain execution
    
    if (!userAddress || !ruleId) {
      throw new Error('User address and rule ID are required')
    }
    
    const rule = mockAutomationRules.find(r => r.id === ruleId)
    if (!rule) {
      throw new Error('Rule not found')
    }
    
    if (rule.status !== 'active') {
      throw new Error('Cannot execute paused rule')
    }
    
    return {
      success: true,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      distributedAmount: '$125.50',
      message: 'Rule executed successfully'
    }
  }

  /**
   * Get rule execution history
   * TODO: Replace with GET /api/user/{address}/rules/{ruleId}/history
   */
  async getRuleHistory(
    userAddress: string,
    ruleId: string,
    limit: number = 10
  ): Promise<Array<{
    executionId: string
    timestamp: string
    status: 'success' | 'failed' | 'pending'
    distributedAmount: string
    transactionHash: string
    gasUsed: string
    errorMessage?: string
  }>> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Mock execution history
    const history = []
    for (let i = 0; i < Math.min(limit, 5); i++) {
      history.push({
        executionId: `exec_${Date.now() - i * 86400000}`,
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        status: Math.random() > 0.1 ? 'success' : 'failed' as 'success' | 'failed',
        distributedAmount: `$${(Math.random() * 200 + 50).toFixed(2)}`,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gasUsed: `${Math.floor(Math.random() * 50000 + 21000)}`,
        errorMessage: Math.random() > 0.9 ? 'Insufficient gas fee' : undefined
      })
    }
    
    return history
  }
}

export const rulesService = new MockRulesService()