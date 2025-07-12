# Valux.finance Frontend

A production-ready DeFi automation platform built with modern web technologies. Valux.finance enables users to automate profit distribution from yield farming and lending protocols on Arbitrum with an intuitive, accessible interface.

## 🚀 Features

- **🏦 DeFi Vaults**: Browse and interact with curated DeFi vaults with advanced filtering
- **📊 Portfolio Dashboard**: Real-time investment tracking with comprehensive P/L analysis
- **⚙️ Rules Engine**: Visual automation builder for profit distribution rules
- **📈 Analytics**: Platform-wide metrics with interactive charts and insights
- **🔗 Web3 Integration**: Seamless multi-wallet support via RainbowKit
- **📱 Mobile Responsive**: Optimized for all devices with touch-friendly interactions
- **♿ Accessibility**: WCAG 2.1 compliant with full keyboard navigation support
- **⚡ Performance**: Code splitting, lazy loading, and optimized bundle size

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS with custom design system
- **Web3**: Wagmi + RainbowKit + Viem
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Performance**: Dynamic imports, code splitting, memoization
- **Quality**: ESLint, Prettier, TypeScript strict mode

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/valux.finance.git
cd valux.finance/valux-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Required for wallet connectivity
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: for custom RPC endpoints
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_id
NEXT_PUBLIC_INFURA_ID=your_infura_id

# Optional: API configuration
NEXT_PUBLIC_API_URL=https://api.valux.finance
```

## 🏗 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # Run TypeScript compiler check
npm run format       # Format code with Prettier

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Analyze bundle size
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Landing page
│   ├── vaults/            # Vaults management
│   ├── dashboard/         # Portfolio dashboard
│   ├── rules/             # Rules engine
│   ├── analytics/         # Platform analytics
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx    # Button with variants
│   │   ├── Card.tsx      # Flexible card component
│   │   ├── Badge.tsx     # Status indicators
│   │   ├── Input.tsx     # Form inputs
│   │   ├── Modal.tsx     # Portal-based modals
│   │   └── Loading.tsx   # Loading states
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useAsync.ts
│   └── useDebounce.ts
├── lib/                  # Utilities
│   ├── constants.ts      # App constants
│   └── utils.ts          # Helper functions
├── types/                # TypeScript definitions
│   └── index.ts          # All type definitions
└── providers/            # React providers
    └── Web3Provider.tsx  # Web3 integration
```

## 🎨 Design System

### Component Library

Our custom UI component library provides:

#### **Button Component**
```typescript
<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```
Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
Sizes: `sm`, `md`, `lg`

#### **Card Component**
```typescript
<Card hover padding="md">
  <CardHeader title="Card Title" />
  <CardContent>Content here</CardContent>
  <CardFooter>Footer content</CardFooter>
</Card>
```

#### **Badge Component**
```typescript
<Badge variant="risk" riskLevel="Low" size="sm">
  Low Risk
</Badge>
```

#### **Input Component**
```typescript
<Input
  label="Amount"
  placeholder="Enter amount"
  error={error}
  startIcon={<DollarSign />}
/>
```

### Color Palette
```typescript
// Primary colors
primary: {
  50: '#eff6ff',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
}

// Status colors
success: '#22c55e'
warning: '#f59e0b'
error: '#ef4444'
```

### Typography
- **Font Family**: Inter (optimized for web)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Responsive scaling**: Fluid typography with Tailwind CSS

## 🔗 Web3 Integration

### Supported Features
- **Networks**: Arbitrum, Arbitrum Sepolia (testnet)
- **Wallets**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow, Trust Wallet
- **Features**: 
  - Account connection/disconnection
  - Network switching
  - Transaction signing
  - Balance fetching
  - ENS resolution

### Configuration
```typescript
// Web3 provider setup
const config = getDefaultConfig({
  appName: 'Valux.finance',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains: [arbitrum, arbitrumSepolia],
})
```

## 📱 Mobile Responsiveness

- **Mobile-first design** approach
- **Touch-friendly** interface elements
- **Collapsible navigation** menu
- **Optimized layouts** for all screen sizes
- **Performance optimized** for mobile devices

### Breakpoints
```typescript
sm: '640px'   // Small devices
md: '768px'   // Medium devices  
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large
2xl: '1536px' // 2X large
```

## ♿ Accessibility Features

### WCAG 2.1 Compliance
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: AA-level contrast ratios throughout
- **Alt Text**: Descriptive alternative text for images

### Implementation Examples
```typescript
// ARIA labels for screen readers
<button
  aria-label="Close modal"
  aria-expanded={isOpen}
  aria-controls="modal-content"
>

// Form validation with accessibility
<Input
  label="Email"
  error={error}
  aria-invalid={!!error}
  aria-describedby="email-error"
/>
```

## ⚡ Performance Optimizations

### Bundle Optimization
- **Code Splitting**: Dynamic imports for heavy components
- **Tree Shaking**: Unused code elimination
- **Bundle Analysis**: Regular size monitoring
- **Lazy Loading**: Components loaded on demand

### Runtime Performance
- **Memoization**: React.memo and useMemo for expensive calculations
- **Debouncing**: Input debouncing for search and filters
- **Virtual Scrolling**: For large data sets
- **Image Optimization**: Next.js automatic image optimization

### Metrics
- **Lighthouse Score**: 90+ across all categories
- **Core Web Vitals**: 
  - LCP < 2.5s (Largest Contentful Paint)
  - FID < 100ms (First Input Delay)  
  - CLS < 0.1 (Cumulative Layout Shift)

## 🧪 Testing Strategy

### Unit Testing
```bash
npm run test          # Run unit tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Testing Stack
- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing

### Coverage Requirements
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Deployment Platforms

#### **Vercel (Recommended)**
```bash
npm i -g vercel
vercel --prod
```

#### **Other Platforms**
- **Netlify**: Drag & drop or Git integration
- **AWS Amplify**: Full-stack deployment
- **Railway**: Container-based deployment
- **Self-hosted**: Docker or traditional hosting

### Environment Setup
```bash
# Production environment variables
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=prod_project_id
NEXT_PUBLIC_API_URL=https://api.valux.finance
NODE_ENV=production
```

## 🔒 Security Features

### Web3 Security
- **Non-custodial architecture**: Users maintain full control of funds
- **Secure wallet connections**: Industry-standard connection protocols
- **Transaction validation**: Pre-transaction checks and confirmations
- **Error handling**: Graceful handling of Web3 errors and edge cases

### Application Security
- **XSS Prevention**: Input sanitization and Content Security Policy
- **CSRF Protection**: SameSite cookie configuration
- **Type Safety**: TypeScript strict mode prevents runtime errors
- **Dependency Scanning**: Regular security audits of dependencies

## 📊 Analytics & Monitoring

### Performance Monitoring
- **Real User Monitoring**: Core Web Vitals tracking
- **Error Tracking**: Client-side error reporting
- **Performance Budgets**: Automated performance regression detection

### User Analytics
- **Privacy-first**: No personal data collection
- **Opt-in tracking**: User consent for analytics
- **GDPR compliant**: European privacy law compliance

## 🤝 Contributing

### Development Setup
1. **Fork** the repository
2. **Clone** your fork locally
3. **Install** dependencies: `npm install`
4. **Create** feature branch: `git checkout -b feature/amazing-feature`
5. **Make** your changes with tests
6. **Commit** using conventional commits
7. **Push** and create Pull Request

### Code Standards
- **TypeScript**: Strict mode, no `any` types
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Commits**: Conventional commit format

### Pull Request Checklist
- [ ] Tests pass locally
- [ ] TypeScript compilation successful
- [ ] ESLint warnings resolved
- [ ] Accessibility tested
- [ ] Mobile responsiveness verified
- [ ] Documentation updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time community support
- **Documentation**: Comprehensive guides and API reference

### Enterprise Support
- **Priority Support**: Dedicated support channels
- **Custom Development**: Tailored feature development
- **SLA Guarantees**: Service level agreements

## 🗺 Roadmap

### Q1 2025
- [ ] Smart contract integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support

### Q2 2025
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Advanced rule conditions
- [ ] Portfolio optimization tools
- [ ] API for third-party integrations

### Q3 2025
- [ ] Institutional features
- [ ] Advanced charting
- [ ] Social trading features
- [ ] Enhanced security features

---

**Built with ❤️ by the Valux.finance team**

For detailed development information, see [CLAUDE.md](../CLAUDE.md)