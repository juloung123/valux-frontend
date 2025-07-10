# AI Assistant Guide for Valux Frontend

This file serves as a comprehensive guide for AI assistants (Claude Code, Gemini CLI, etc.) when working with the Valux Frontend project.

## Project Overview

**Valux** is a modern, user-friendly decentralized exchange (DEX) frontend application built with React, Next.js, and TypeScript. Inspired by PancakeSwap but designed with enhanced user experience and accessibility in mind.

### Project Identity
- **Name**: Valux
- **Type**: DeFi Frontend Application  
- **Inspiration**: PancakeSwap (enhanced for better UX)
- **Target Audience**: Both beginner and experienced DeFi users
- **Focus**: User-friendly interface, responsive design, accessibility
- **Launch**: December 2024

### Technical Foundation
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Lucide React icons, Framer Motion animations
- **Build Tool**: Turbopack for fast development

## Tech Stack & Dependencies

### Core Dependencies
```json
{
  "react": "^18.x",
  "next": "^15.x", 
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "lucide-react": "^0.x",
  "framer-motion": "^11.x"
}
```

### Development Tools
- **ESLint**: Code linting with Next.js config
- **TypeScript**: Strict type checking enabled
- **Turbopack**: Fast development builds
- **PostCSS**: CSS processing with Tailwind

## Project Structure

```
valux-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css         # Global styles and CSS variables
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── page.tsx            # Homepage
│   │   ├── swap/page.tsx       # Token swap functionality
│   │   ├── liquidity/page.tsx  # Liquidity pools management
│   │   └── [other-pages]/      # Additional pages
│   └── components/             # Reusable React components
│       ├── Header.tsx          # Navigation header
│       ├── Footer.tsx          # Site footer
│       └── [other-components]/ # UI components
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── README.md                   # Project documentation
├── CLAUDE.md                   # Same content as this file
└── GEMINI.md                   # This file
```

## Design System

### Brand Colors
```css
/* CSS Variables in globals.css */
:root {
  --primary: #3b82f6;          /* Blue */
  --primary-dark: #2563eb;     /* Darker blue */
  --secondary: #10b981;        /* Green (success) */
  --accent: #f59e0b;           /* Orange (warning) */
  --background: #f8fafc;       /* Light gray */
  --card: #ffffff;             /* White */
  --nav-bg: rgba(255, 255, 255, 0.95); /* Glass effect */
}

/* Dark mode variants */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f172a;      /* Dark slate */
    --card: #1e293b;            /* Dark card */
    --nav-bg: rgba(30, 41, 59, 0.95); /* Dark glass */
  }
}
```

### Typography System
- **Primary Font**: Geist Sans (with system fallbacks)
- **Headings**: Bold weights with gradient text effects
- **Body Text**: Regular weight with proper contrast ratios
- **Code**: Geist Mono for monospace needs

### Component Style Guide
- **Cards**: Rounded corners (rounded-xl), glass effect, hover animations
- **Buttons**: Gradient backgrounds, hover lift effects, proper spacing
- **Forms**: Clean inputs with focus states, proper labeling
- **Navigation**: Sticky header, dropdown menus, mobile-responsive

## Key Features & Pages

### 1. Homepage (`/`)
**Purpose**: Landing page with hero section and feature highlights
**Components**:
- Hero section with gradient background
- Feature grid with icons and descriptions
- Statistics section
- Call-to-action sections

**Key Elements**:
- Responsive hero with mobile-first design
- Feature cards with hover animations
- Stats counter with impressive numbers
- Clear navigation to main functions

### 2. Token Swap (`/swap`)
**Purpose**: Token exchange interface
**Features**:
- From/To token selection
- Real-time rate calculation
- Price impact display
- Transaction confirmation flow
- Slippage settings

**Technical Details**:
- State management with React hooks
- Form validation and error handling
- Responsive design for mobile trading
- Glass effect card design

### 3. Liquidity Pools (`/liquidity`)
**Purpose**: Liquidity provision and management
**Features**:
- Add/Remove liquidity tabs
- Pool statistics and APY display
- Position management
- LP token calculations
- Pool share visualization

**Components**:
- Tab-based interface
- Input forms with validation
- Statistics cards
- Position listings

### 4. Navigation System
**Components**:
- **Header**: Sticky navigation with dropdown menus
- **Footer**: Links and social media icons
- **Mobile Menu**: Hamburger menu for mobile devices

**Features**:
- Responsive design
- Wallet connect button
- Dark mode support
- Smooth animations

## Development Guidelines

### Code Style Standards
1. **TypeScript**: Use strict types, avoid `any`
2. **React**: Functional components with hooks
3. **Naming**: Descriptive variable and function names
4. **Components**: Reusable components in `/components`
5. **Pages**: Use App Router structure in `/app`
6. **Styling**: Tailwind utility classes, custom CSS in globals.css

### File Organization Rules
- **Components**: One component per file, named exports
- **Pages**: Use `page.tsx` for route components
- **Layouts**: Use `layout.tsx` for shared layouts
- **Styles**: Global styles in `globals.css`, component-specific styles inline
- when code update Always update Readme, GEMINI.md and CLAUDE.md (GEMINI.md is same with CLAUDE.md)

### Best Practices
1. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
2. **Accessibility**: Proper ARIA labels, keyboard navigation, color contrast
3. **Performance**: Lazy loading, optimized images, minimal bundle size
4. **SEO**: Proper meta tags, semantic HTML, structured data
5. **Dark Mode**: Support both light and dark themes

## Build & Development

### Available Scripts
```bash
# Development Commands
npm run dev          # Start development server (with Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
```

### Development Workflow
1. **Setup**: `npm install` to install dependencies
2. **Development**: `npm run dev` to start development server
3. **Testing**: Manual testing on different devices and browsers
4. **Build**: `npm run build` to create production build
5. **Deploy**: Deploy to hosting platform of choice

### Environment Configuration
```env
# Environment Variables (create .env.local)
NEXT_PUBLIC_API_URL=https://api.valux.com
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_APP_NAME=Valux
```

## Component Examples

### Reusable Component Structure
```tsx
'use client';

import { useState } from 'react';
import { Icon } from 'lucide-react';

interface ComponentProps {
  title: string;
  onClick?: () => void;
}

export default function Component({ title, onClick }: ComponentProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover-lift">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
      >
        Click me
      </button>
    </div>
  );
}
```

### Custom Utility Classes
```css
/* Custom Tailwind Classes in globals.css */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.glass-effect {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hover-lift {
  transition: all 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
```

## Common Issues & Solutions

### Icon Import Errors
**Problem**: `Export 'Telegram' doesn't exist in target module`
**Solution**: Use correct lucide-react icon names
```tsx
// ❌ Incorrect - These don't exist
import { Telegram, Discord } from 'lucide-react';

// ✅ Correct - Use these instead
import { Send, MessageCircle } from 'lucide-react';
```

### Next.js 15 Viewport Metadata
**Problem**: `Unsupported metadata viewport is configured in metadata export`
**Solution**: Separate viewport from metadata export
```tsx
// ❌ Old way (Next.js 14 and below)
export const metadata: Metadata = {
  title: "App",
  viewport: "width=device-width, initial-scale=1",
};

// ✅ New way (Next.js 15+)
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "App",
  // viewport removed from here
};
```

### Mobile Responsive Issues
**Problem**: Elements overflowing on mobile, buttons too large
**Solution**: Use responsive breakpoints and proper flex properties
```tsx
// ❌ Not responsive - elements overflow
<div className="flex items-center space-x-3">
  <input className="flex-1 text-2xl" />
  <button className="px-3 py-2">Token</button>
</div>

// ✅ Responsive design
<div className="flex items-center space-x-2 sm:space-x-3">
  <input className="flex-1 text-xl sm:text-2xl min-w-0" />
  <button className="px-2 sm:px-3 py-2 flex-shrink-0">
    <span className="text-sm sm:text-base">Token</span>
  </button>
</div>
```

### Build Errors
1. **TypeScript Errors**: Check types, avoid `any`
2. **Missing Dependencies**: Run `npm install`
3. **Import Errors**: Check import paths and exported names
4. **CSS Issues**: Verify Tailwind classes and dark mode variants

### Development Tips
1. **Browser Dev Tools**: Use for responsive testing and debugging
2. **Theme Testing**: Test both light and dark themes thoroughly
3. **Accessibility Testing**: Use screen readers and keyboard navigation
4. **Performance Testing**: Check with Lighthouse and Core Web Vitals
5. **Cross-Browser Testing**: Test on different browsers and devices

## User Experience Focus

### Accessibility Features
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color combinations
- **Font Scaling**: Responsive typography that scales well
- **Focus Indicators**: Clear focus states for all interactive elements

### Performance Optimizations
- **Image Optimization**: Next.js Image component with optimization
- **Code Splitting**: Automatic code splitting with App Router
- **Lazy Loading**: Components and images loaded on demand
- **Bundle Optimization**: Tree shaking and dead code elimination
- **Caching**: Proper caching strategies for static assets

### Mobile Experience
- **Touch-Friendly**: Large touch targets (minimum 44px)
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Fast Loading**: Optimized for mobile networks
- **Intuitive Navigation**: Easy-to-use mobile menu system

## Future Roadmap

### Planned Features
- [ ] **Wallet Integration**: MetaMask, WalletConnect support
- [ ] **Blockchain Integration**: Real smart contract interactions
- [ ] **Trading Charts**: Advanced charting with TradingView
- [ ] **Portfolio Tracking**: User portfolio and transaction history
- [ ] **Multi-language**: i18n support for global users
- [ ] **Mobile App**: React Native companion app

### Technical Improvements
- [ ] **Testing**: Unit tests with Jest and React Testing Library
- [ ] **Error Boundaries**: Proper error handling and reporting
- [ ] **Loading States**: Skeleton screens and loading indicators
- [ ] **Bundle Analysis**: Webpack bundle analyzer integration
- [ ] **PWA Features**: Service worker and offline support

## Security Considerations

### Best Practices
1. **Input Validation**: Always validate user inputs
2. **XSS Prevention**: Sanitize any user-generated content
3. **Environment Variables**: Keep sensitive data in environment variables
4. **HTTPS**: Always use HTTPS in production
5. **Dependencies**: Regularly update dependencies for security patches

### DeFi-Specific Security
1. **Wallet Security**: Never store private keys or sensitive data
2. **Transaction Safety**: Clear transaction confirmations and warnings
3. **Slippage Protection**: Proper slippage settings and warnings
4. **Smart Contract Audits**: Only interact with audited contracts

## Notes for AI Assistants

When working on this project, please:

1. **Maintain Design Consistency**: Follow the established design system and component patterns
2. **Prioritize User Experience**: Focus on simplicity, clarity, and intuitive interfaces
3. **Ensure Responsiveness**: Test on various screen sizes and devices
4. **Use TypeScript Properly**: Add appropriate types for all components and functions
5. **Follow Next.js Best Practices**: Use App Router patterns, proper imports, and optimizations
6. **Consider Accessibility**: Include proper ARIA labels and keyboard navigation support
7. **Optimize Performance**: Minimize bundle size, optimize images, and use lazy loading
8. **Check Icon Names**: Always verify lucide-react icon names before importing

### Context Understanding
This is a DeFi (Decentralized Finance) application frontend that:
- Facilitates cryptocurrency trading and liquidity provision
- Prioritizes user-friendly design over complex features
- Targets both beginner and experienced DeFi users
- Emphasizes security, transparency, and ease of use
- Competes with established platforms like PancakeSwap and Uniswap

Remember: Every change should enhance the user experience while maintaining the professional, trustworthy appearance that DeFi users expect.

---

**Last Updated**: December 2024
**Version**: 1.0.1
**Project Status**: Initial Development Complete
**Maintainer**: Valux Development Team