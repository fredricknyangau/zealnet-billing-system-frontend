# Mock Data Guide

This application uses mock data for development and testing when no real API is configured.

## How It Works

The API client automatically uses mock data when:
- `VITE_API_URL` is not set in `.env`, OR
- `VITE_API_URL` is set to the default `https://api.example.com`

## Mock Data Available

### Plans
- **Hourly Pass** (KES 50) - 1 hour, 10 Mbps
- **Daily Pass** (KES 200) - 24 hours, 5GB, 20 Mbps
- **Weekly Pass** (KES 1,000) - 7 days, 30GB, 50 Mbps
- **Monthly Unlimited** (KES 3,000) - 30 days, unlimited, 100 Mbps

### User Data
- Default user: John Doe (+254712345678)
- Active subscription with Daily Pass
- 2 devices (iPhone 14 Pro, MacBook Pro)
- Payment history with 3 transactions
- Session history with 3 past sessions

### Admin Data
- 4 mock customers with different statuses
- Network metrics showing 42 active users
- AI insights with revenue drop, churn risk, and recommendations
- Payment success rate: 94.5%

## Testing Authentication

### Phone + OTP Login
1. Enter any phone number (e.g., `+254712345678`)
2. Enter any 6-digit OTP (e.g., `123456`)
3. You'll be logged in as the mock user

### Voucher Login
1. Enter any voucher code (e.g., `TEST123`)
2. Invalid codes: anything containing "invalid" will fail
3. Valid codes: anything else will succeed

### M-Pesa Payment
1. Select a plan
2. Enter phone number
3. Click "Pay with M-Pesa"
4. Payment will complete automatically after ~3 seconds

## Mock Data Location

All mock data is defined in `src/lib/mockData.ts`

## Switching to Real API

To use a real API instead of mock data:

1. Create a `.env` file:
```env
VITE_API_URL=https://your-api-url.com
```

2. Restart the dev server

The app will automatically switch to using the real API.

## Customizing Mock Data

Edit `src/lib/mockData.ts` to customize:
- Plans and pricing
- User data
- Customer data
- Network metrics
- AI insights

## Mock API Delays

Mock API calls include realistic delays:
- Auth: 500-800ms
- Data fetching: 200-400ms
- Payments: 1000ms
- Subscriptions: 800ms

This simulates real network latency for better testing.

