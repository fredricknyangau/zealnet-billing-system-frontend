# ZealNet ISP Platform - Frontend

AI-Powered ISP Billing & Hotspot Platform (Africa-First) - Production-ready SaaS frontend.

## Features

- 🚀 **Mobile-First Design** - Optimized for low-end Android phones and feature phones
- 🌍 **Multi-Language Support** - English and Swahili (expandable)
- 💰 **Mobile Money Integration** - M-Pesa, MTN, Airtel support
- 🎨 **Dark Mode** - Battery-saving dark theme
- 📱 **PWA Ready** - Offline support and installable
- 🏢 **Multi-Tenant** - White-label ready for ISPs and resellers
- ⚡ **Performance Optimized** - Lighthouse score > 90 target
- 🔒 **Secure** - JWT-based authentication

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **i18next** for internationalization
- **PWA** support with Workbox

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=https://api.example.com
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI components (Button, Card, Input, etc.)
│   ├── LanguageSwitcher.tsx
│   ├── ThemeToggle.tsx
│   └── OfflineIndicator.tsx
├── pages/             # Page components
│   ├── CaptivePortal.tsx      # WiFi captive portal (highest priority)
│   ├── CustomerDashboard.tsx  # End-user dashboard
│   ├── AdminDashboard.tsx      # ISP admin dashboard
│   ├── ResellerDashboard.tsx   # Multi-tenant reseller dashboard
│   └── LoginPage.tsx
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configurations
│   ├── api.ts         # API client
│   ├── i18n.ts        # Internationalization setup
│   └── utils.ts       # Helper functions
├── stores/            # Zustand state stores
│   ├── authStore.ts
│   └── themeStore.ts
├── types/             # TypeScript type definitions
└── App.tsx            # Main app component
```

## Key Interfaces

### 1. Captive Portal (`/portal`)

- Voucher code login
- Phone number + OTP authentication
- M-Pesa STK Push payment
- QR code scanning
- Plan selection

### 2. Customer Dashboard (`/dashboard`)

- Real-time usage tracking
- Device management
- Payment history
- Session history
- Plan management

### 3. Admin Dashboard (`/admin`)

- Network metrics
- Customer management
- Billing & payments
- Plan management
- Network monitoring
- Reports & analytics

### 4. Reseller Dashboard (`/reseller`)

- Multi-tenant management
- White-label configuration
- Commission tracking
- Sub-account provisioning

## Performance Targets

- **Lighthouse Score**: > 90 (mobile)
- **First Contentful Paint**: < 2s on 3G
- **Time to Interactive**: < 3.5s
- **Bundle Size**: Optimized with code splitting

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (Android Chrome, iOS Safari)

## Development

### Code Style

- ESLint for linting
- TypeScript strict mode
- Prettier (recommended)

### Testing

```bash
# Run type checking
npm run type-check

# Run linter
npm run lint
```

## Deployment

The app is optimized for deployment on:

- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Build Output

The `dist/` folder contains the production build with:

- Optimized JavaScript bundles
- CSS extraction
- PWA manifest and service worker
- Static assets

## License

Proprietary - All rights reserved

## 📖 Documentation

Complete documentation is available in the [`docs/`](docs/) directory.

### 🏗️ Architecture

- **[Architecture Overview](docs/architecture/overview.md)** - Frontend architecture and design patterns
- **[Pages Summary](docs/architecture/pages.md)** - Overview of all application pages
- **[Components Summary](docs/architecture/components.md)** - UI components and button inventory

### 💻 Development

- **[Mock Data Guide](docs/development/mock-data.md)** - Working with mock data for development
- **[Performance Guide](docs/development/performance.md)** - Performance optimization techniques
- **[Quick Test Guide](docs/development/quick-test.md)** - Quick testing procedures

### 🧪 Testing

- **[Testing Guide](docs/testing/testing-guide.md)** - Comprehensive testing documentation

### 🛠️ Operations

- **[Requirements Compliance](docs/operations/requirements-compliance.md)** - Requirements compliance checklist
- **[Troubleshooting](docs/operations/troubleshooting.md)** - Common issues and solutions

## Support

For issues and questions, please contact the development team.
