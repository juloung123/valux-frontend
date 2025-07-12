# Mock Data & Services

This directory contains mock data and services used for development and testing purposes. All mock implementations should be replaced with real API integrations when the backend services are ready.

## 📁 Directory Structure

```
src/mock/
├── data/              # Mock data files
│   ├── vaults.ts      # Vault information and configurations
│   ├── portfolio.ts   # User portfolio positions and transactions
│   ├── rules.ts       # Automation rules and performance data
│   └── analytics.ts   # Platform analytics and metrics
├── services/          # Mock service implementations
│   ├── vaultService.ts     # Vault operations (deposit, withdraw, etc.)
│   ├── portfolioService.ts # Portfolio and transaction management
│   ├── rulesService.ts     # Rules engine operations
│   └── analyticsService.ts # Platform analytics and reporting
├── index.ts           # Main export file for all mock data/services
└── README.md          # This documentation file
```

## 🎯 Purpose

The mock data system serves several important purposes:

1. **Development Independence**: Allows frontend development without waiting for backend APIs
2. **Testing**: Provides consistent data for testing scenarios
3. **Demo Environment**: Enables product demonstrations with realistic data
4. **API Design**: Helps define API contracts and data structures
5. **Performance Testing**: Allows testing with various data sizes and scenarios

## 📊 Mock Data Categories

### Vaults (`data/vaults.ts`)
- DeFi vault configurations
- Protocol information (Aave, Compound, Curve, etc.)
- APY rates and TVL data
- Risk levels and insurance status
- Minimum deposit requirements

### Portfolio (`data/portfolio.ts`)
- User portfolio positions
- Transaction history
- P&L calculations
- Portfolio statistics and metrics

### Rules (`data/rules.ts`)
- Automation rule configurations
- Distribution settings
- Execution history and performance
- Rule status and scheduling

### Analytics (`data/analytics.ts`)
- Platform-wide metrics
- Protocol distribution data
- Vault performance statistics
- Time-series data for charts

## 🔧 Mock Services

### VaultService
```typescript
// Example usage
import { vaultService } from '@/mock'

// Get all vaults with filtering
const vaults = await vaultService.getVaults({ risk: 'Low' })

// Deposit into vault (mock transaction)
const result = await vaultService.deposit('vault-id', '1000', 'user-address')
```

### PortfolioService
```typescript
// Get user portfolio
const portfolio = await portfolioService.getPortfolio('user-address')

// Get transaction history
const transactions = await portfolioService.getTransactionHistory('user-address')
```

### RulesService
```typescript
// Create automation rule
const rule = await rulesService.createRule('user-address', ruleConfig)

// Execute rule manually
const result = await rulesService.executeRule('user-address', 'rule-id')
```

### AnalyticsService
```typescript
// Get platform metrics
const metrics = await analyticsService.getPlatformMetrics()

// Get time-series data
const chartData = await analyticsService.getTimeSeriesData('tvl', '30d')
```

## ⚡ Features

### Realistic API Simulation
- Simulated network delays (200ms - 2000ms)
- Error simulation for testing error handling
- Pagination support for large data sets
- Filtering and search capabilities

### Data Consistency
- Related data maintains consistency (vault IDs, user addresses)
- Realistic data relationships and constraints
- Time-series data with proper chronological order

### Performance Simulation
- Different response times for different operations
- Bulk operations take longer than simple queries
- Blockchain operations simulate longer delays

## 🔄 Migration Path

When migrating to real APIs, follow these steps:

### 1. Replace Service Imports
```typescript
// Current (mock)
import { vaultService } from '@/mock'

// Future (real API)
import { vaultService } from '@/services/api'
```

### 2. Update Service Implementations
- Replace mock services with real HTTP clients
- Add proper error handling and retry logic
- Implement authentication and authorization
- Add request/response interceptors for logging

### 3. Environment Configuration
```typescript
// Use environment variables to switch between mock and real APIs
const apiService = process.env.NODE_ENV === 'development' 
  ? mockVaultService 
  : realVaultService
```

### 4. Data Structure Validation
- Ensure real API responses match mock data structures
- Update TypeScript interfaces if needed
- Test with real API data to catch any inconsistencies

## 🧪 Testing with Mock Data

### Unit Tests
```typescript
import { mockVaults } from '@/mock/data/vaults'

describe('VaultCard', () => {
  it('renders vault information correctly', () => {
    render(<VaultCard vault={mockVaults[0]} />)
    // Test component with consistent mock data
  })
})
```

### Integration Tests
```typescript
import { vaultService } from '@/mock'

describe('Vault Integration', () => {
  it('handles vault deposit flow', async () => {
    const result = await vaultService.deposit('1', '1000', 'user-address')
    expect(result.success).toBe(true)
  })
})
```

## 📝 TODO: Future API Integration

### High Priority
- [ ] Replace vault operations with smart contract interactions
- [ ] Connect portfolio data to blockchain indexing service
- [ ] Implement real-time data updates via WebSocket
- [ ] Add user authentication and authorization

### Medium Priority
- [ ] Integrate with external price feeds for accurate APY calculations
- [ ] Add comprehensive error handling and retry logic
- [ ] Implement request caching and optimization
- [ ] Add API rate limiting and request queuing

### Low Priority
- [ ] Add API monitoring and logging
- [ ] Implement A/B testing framework
- [ ] Add advanced analytics and user tracking
- [ ] Create API documentation and testing tools

## 🔒 Security Considerations

### Mock Environment
- Mock services should never be deployed to production
- Sensitive data should not be included in mock files
- Use environment variables to control mock usage

### Real API Migration
- Implement proper authentication (JWT, API keys)
- Add input validation and sanitization
- Use HTTPS for all API communications
- Implement rate limiting and DDoS protection

## 📚 Additional Resources

- [API Integration Guide](../../../docs/api-integration.md)
- [Testing Strategy](../../../docs/testing.md)
- [Deployment Guide](../../../docs/deployment.md)
- [Smart Contract Integration](../../../docs/smart-contracts.md)

---

**Note**: This mock system is designed to be a temporary solution for development. All mock implementations should be replaced with real API integrations before production deployment.