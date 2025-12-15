# Architecture Overview

## Frontend Architecture

This document outlines the architecture and design decisions for the WiFi Billing Platform frontend.

## Core Principles

1. **Mobile-First**: All interfaces are designed for mobile devices first, with desktop as secondary
2. **Performance**: Optimized for low-bandwidth, unstable networks (3G/4G)
3. **Offline-First**: PWA with aggressive caching for offline functionality
4. **Self-Service**: Minimal human support required
5. **Trust & Transparency**: Clear billing and usage visibility
6. **Multi-Tenant**: Built for white-labeling from day one

## Technology Stack

### Core
- **React 18**: UI library with hooks and concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool with HMR

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: System-aware theme switching
- **Responsive Design**: Mobile-first breakpoints

### State Management
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management with caching
- **React Router**: Client-side routing

### Internationalization
- **i18next**: Translation framework
- **Languages**: English (default), Swahili (expandable)

### PWA
- **Vite PWA Plugin**: Service worker generation
- **Workbox**: Caching strategies
- **Offline Support**: Network-first, cache-fallback

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── LanguageSwitcher.tsx
│   ├── ThemeToggle.tsx
│   └── OfflineIndicator.tsx
├── pages/              # Page components
│   ├── CaptivePortal.tsx
│   ├── CustomerDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── ResellerDashboard.tsx
│   └── LoginPage.tsx
├── hooks/              # Custom React hooks
│   ├── useOnlineStatus.ts
│   └── useDebounce.ts
├── lib/                # Utilities
│   ├── api.ts          # API client (Axios)
│   ├── i18n.ts         # i18n configuration
│   ├── utils.ts        # Helper functions
│   └── multiTenant.ts  # Multi-tenant theming
├── stores/             # Zustand stores
│   ├── authStore.ts    # Authentication state
│   └── themeStore.ts   # Theme state
├── types/              # TypeScript definitions
│   └── index.ts
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

## Key Features

### 1. Captive Portal (`/portal`)
**Priority**: Highest

**Features**:
- Voucher code authentication
- Phone + OTP authentication
- M-Pesa STK Push payment
- QR code scanning
- Plan selection and pricing

**UX Principles**:
- One primary CTA per screen
- No account creation required
- Ultra-lightweight (< 300KB initial load)
- Dark-mode friendly

### 2. Customer Dashboard (`/dashboard`)
**Target**: End users (café customers, home subscribers, students)

**Features**:
- Real-time usage tracking
- Device management
- Payment history with receipts
- Session history
- Plan management (upgrade/downgrade/pause)

**UX Principles**:
- WhatsApp-like minimalist design
- Offline-capable with cached data
- Push notifications for low balance
- Clear billing transparency

### 3. Admin Dashboard (`/admin`)
**Target**: ISP operators (non-technical)

**Features**:
- Network metrics dashboard
- Customer management
- Billing & payment reconciliation
- Plan creation/editing
- Network monitoring
- Reports & analytics
- AI insights

**UX Principles**:
- Desktop-first but tablet usable
- Fast table filtering
- No page reloads
- Optimistic UI updates

### 4. Reseller Dashboard (`/reseller`)
**Target**: Multi-tenant resellers

**Features**:
- Tenant switcher
- White-label branding controls
- Commission dashboard
- Sub-account provisioning
- Revenue split visualization

## State Management

### Authentication Store (`authStore`)
- User information
- JWT token
- Authentication status
- Persisted in localStorage

### Theme Store (`themeStore`)
- Theme preference (light/dark/system)
- Effective theme calculation
- System theme detection
- Persisted in localStorage

### Server State (TanStack Query)
- API responses cached
- Automatic refetching
- Optimistic updates
- Error handling

## API Integration

### API Client (`lib/api.ts`)
- Axios-based HTTP client
- JWT token injection
- Error handling
- Request/response interceptors

### Endpoints Structure
```
/auth/*          - Authentication
/payments/*      - Payment processing
/plans           - Plan management
/users/me/*      - Current user data
/admin/*         - Admin operations
/tenant          - Tenant information
```

## Performance Optimizations

### Code Splitting
- Route-based splitting
- Vendor chunk separation
- Lazy loading for heavy components

### Caching Strategy
- API responses: Network-first, 5min stale time
- Images: Cache-first, 30 days
- Static assets: Cache-first

### Bundle Optimization
- Tree shaking
- Minification
- Compression (gzip/brotli)

### Loading States
- Skeleton loaders
- Progressive enhancement
- Optimistic UI updates

## Accessibility

### WCAG Compliance
- High contrast ratios
- Keyboard navigation
- Screen reader support
- Focus management

### Low Literacy Support
- Icon-driven navigation
- Simple language mode
- Visual indicators
- Minimal text input

## Security

### Authentication
- JWT tokens in localStorage
- Automatic token refresh
- Secure logout

### Data Protection
- Masked sensitive data (phone, MAC)
- Secure payment indicators
- Session visibility

## Multi-Tenant Support

### Theming System
- Dynamic color application
- Logo customization
- Domain-based branding
- CSS custom properties

### Tenant Isolation
- Route-based tenant switching
- API tenant context
- Data isolation

## Internationalization

### Supported Languages
- English (default)
- Swahili
- Expandable to French, Hausa

### Localization
- Currency formatting
- Date/time formatting
- Number formatting
- RTL support (future)

## PWA Features

### Service Worker
- Offline support
- Background sync
- Push notifications (future)

### Manifest
- Installable app
- Standalone display
- Theme colors
- Icons

## Development Workflow

### Local Development
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview build
npm run lint       # Lint code
npm run type-check # Type checking
```

### Environment Variables
- `VITE_API_URL`: Backend API URL
- `VITE_ENABLE_ANALYTICS`: Analytics toggle
- `VITE_ENABLE_DEBUG`: Debug mode

## Deployment

### Build Output
- Static files in `dist/`
- Service worker generated
- Manifest included
- Optimized assets

### Hosting Options
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Any static hosting

## Future Enhancements

1. **WhatsApp/Telegram Integration**
   - Conversational UI flows
   - Button-based interactions
   - Text-only fallbacks

2. **Advanced Analytics**
   - Usage heatmaps
   - Churn prediction
   - Revenue forecasting

3. **AI Features**
   - Chatbot widget
   - Smart recommendations
   - Fraud detection UI

4. **Additional Payment Methods**
   - MTN Mobile Money
   - Airtel Money
   - Bank transfers

5. **Feature Phone Support**
   - USSD integration
   - SMS-based flows
   - Basic HTML interfaces

