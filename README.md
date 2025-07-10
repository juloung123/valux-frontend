# Valux - User-Friendly DeFi Exchange

Valux is a modern, user-friendly decentralized exchange (DEX) platform built with React, Next.js, and TypeScript. Inspired by PancakeSwap but designed with simplicity and user experience in mind.

## ✨ Features

- **Token Swapping**: Seamless token exchange with real-time rates
- **Liquidity Pools**: Provide liquidity and earn trading fees
- **Yield Farming**: Stake tokens to earn rewards
- **Multi-Chain Support**: Trade across multiple blockchain networks
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark Mode**: Eye-friendly theme switching
- **Real-time Analytics**: Track your portfolio and market data

## 🚀 Tech Stack

- **Frontend**: React 18 + Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Build Tool**: Turbopack (Next.js)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd valux-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
valux-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles and CSS variables
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── page.tsx            # Homepage
│   │   ├── swap/               # Token swap page
│   │   ├── liquidity/          # Liquidity pools page
│   │   └── ...                 # Other pages
│   └── components/             # Reusable React components
│       ├── Header.tsx          # Navigation header
│       ├── Footer.tsx          # Site footer
│       └── ...                 # Other components
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) to Purple (#6366f1) gradient
- **Secondary**: Green (#10b981) for success states
- **Accent**: Orange (#f59e0b) for highlights
- **Background**: Light gray (#f8fafc) / Dark slate (#0f172a)

### Typography
- **Font Family**: Geist Sans (system fallback)
- **Headings**: Bold weights with gradient text effects
- **Body**: Regular weight with proper contrast ratios

### Components
- **Cards**: Rounded corners with glass effect and hover animations
- **Buttons**: Gradient backgrounds with hover lift effects
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with dropdown menus

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler (if available)
```

### Common Issues & Solutions

#### Icon Import Errors
If you encounter icon import errors from lucide-react:
```bash
# Check available icons at: https://lucide.dev/icons/
# Use correct icon names, for example:
import { Send, MessageCircle } from 'lucide-react'; // ✅ Correct
import { Telegram, Discord } from 'lucide-react';   // ❌ Not available
```

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Implement responsive design patterns
- Apply consistent naming conventions
- Add proper TypeScript types

## 🌟 Key Pages

### Home Page (`/`)
- Hero section with call-to-action
- Feature highlights
- Statistics and metrics
- User testimonials

### Swap Page (`/swap`)
- Token selection interface
- Real-time rate calculation
- Price impact and fee display
- Transaction confirmation

### Liquidity Page (`/liquidity`)
- Add/remove liquidity tabs
- Pool statistics
- Position management
- APY calculations

## 🎯 Features Roadmap

- [ ] Wallet connectivity (MetaMask, WalletConnect)
- [ ] Real blockchain integration
- [ ] Advanced trading charts
- [ ] Portfolio tracking
- [ ] Multi-language support
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by PancakeSwap's excellent UX
- Built with modern React and Next.js patterns
- Designed for accessibility and performance

## 📞 Support

For questions, issues, or contributions:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Built with ❤️ by the Valux Team**
