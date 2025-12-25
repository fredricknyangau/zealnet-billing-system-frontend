# Testing Guide - All Pages & Buttons

This guide helps you test all pages and ensure every button works correctly.

## Quick Test Credentials

### End User (Customer Dashboard)

- **Phone**: `+254712345678` or any number
- **OTP**: Any 6 digits (e.g., `123456`)

### Admin User

- **Phone**: `+254999999999` or any number containing `admin` or `999`
- **OTP**: Any 6 digits
- **Result**: Redirects to `/admin`

### Reseller User

- **Phone**: `+254888888888` or any number containing `reseller` or `888`
- **OTP**: Any 6 digits
- **Result**: Redirects to `/reseller`

## Page-by-Page Testing

### 1. Captive Portal (`/portal`)

#### Voucher Login Tab

- [ ] Enter voucher code (e.g., `TEST123`)
- [ ] Click "Connect Now" button
- [ ] Should show success toast and redirect to dashboard
- [ ] Try invalid voucher (containing "invalid") - should show error

#### Phone Login Tab

- [ ] Enter phone number
- [ ] Click "Send OTP" button
- [ ] Should show OTP input field
- [ ] Enter 6-digit OTP
- [ ] Click "Verify" button
- [ ] Should redirect based on role
- [ ] Test "Change phone number" button

#### QR Code Tab

- [ ] Click QR Code tab
- [ ] Should show QR code placeholder

#### Plan Selection

- [ ] Select any plan from the list
- [ ] Should show payment section
- [ ] Enter phone number for M-Pesa
- [ ] Click "Pay with M-Pesa" button
- [ ] Should show payment pending, then success after ~3 seconds

#### Header Buttons

- [ ] Language switcher (top right) - should toggle English/Swahili
- [ ] Theme toggle (top right) - should toggle light/dark mode

### 2. Login Page (`/login`)

#### Phone Login Flow

- [ ] Enter phone number
- [ ] Click "Send OTP" button
- [ ] Should show OTP input
- [ ] Enter OTP and click "Verify"
- [ ] Should redirect based on role:
  - Regular number → `/dashboard`
  - Contains "admin" or "999" → `/admin`
  - Contains "reseller" or "888" → `/reseller`

#### Buttons

- [ ] "Send OTP" button - should be disabled until phone entered
- [ ] "Verify" button - should be disabled until 6-digit OTP entered
- [ ] "Change phone number" button - should reset to phone input
- [ ] Language switcher
- [ ] Theme toggle

### 3. Customer Dashboard (`/dashboard`)

#### Header

- [ ] Language switcher - should work
- [ ] Theme toggle - should work
- [ ] Logout button - should log out and redirect to portal

#### Subscription Card

- [ ] "Buy More" button - should open modal with plans
- [ ] "Upgrade" button - should open modal with upgrade options
- [ ] "Pause" button (if active) - should pause subscription
- [ ] "Resume" button (if paused) - should resume subscription

#### Buy More Modal

- [ ] Should show all available plans
- [ ] Click any plan - should show toast and redirect to portal
- [ ] Close button (X) - should close modal

#### Upgrade Modal

- [ ] Should show only plans with higher price
- [ ] Click any plan - should show toast and redirect to portal
- [ ] Close button (X) - should close modal

#### Devices Section

- [ ] Should display all devices
- [ ] Should show device status (Active/Inactive)
- [ ] Should show data usage per device

#### Payment History

- [ ] Should display payment transactions
- [ ] "Download Receipt" button - should open receipt URL
- [ ] Should show payment status badges

#### Session History

- [ ] Should display recent sessions
- [ ] Should show session duration and data used

### 4. Admin Dashboard (`/admin`)

#### Sidebar Navigation

- [ ] Dashboard link - should navigate to overview
- [ ] Customers link - should navigate to customers list
- [ ] Billing link - should navigate to billing page
- [ ] Plans link - should navigate to plans page
- [ ] Network link - should navigate to network page
- [ ] Reports link - should navigate to reports page
- [ ] Logout button - should log out and redirect to login
- [ ] Mobile menu toggle (hamburger) - should open/close sidebar

#### Overview Page (`/admin`)

- [ ] Should display 4 metric cards:
  - Active Users
  - Revenue Today
  - Payment Success Rate
  - Network Health
- [ ] Should show AI insights/alerts if any

#### Customers Page (`/admin/customers`)

- [ ] Search input - should filter customers
- [ ] Status filter dropdown - should filter by status
- [ ] "View" button for each customer - should show toast with customer info
- [ ] Table should be scrollable on mobile

#### Other Admin Pages

- [ ] Billing page - should load (placeholder)
- [ ] Plans page - should load (placeholder)
- [ ] Network page - should load (placeholder)
- [ ] Reports page - should load (placeholder)

#### Header

- [ ] Mobile menu button - should toggle sidebar
- [ ] Language switcher
- [ ] Theme toggle

### 5. Reseller Dashboard (`/reseller`)

#### Header

- [ ] Language switcher - should work
- [ ] Theme toggle - should work
- [ ] Logout button - should log out and redirect to login

#### Metric Cards

- [ ] Tenants card - should show count
- [ ] Revenue card - should show amount
- [ ] Settings card - should have "Manage Tenants" button

#### Buttons

- [ ] "Manage Tenants" button - should show info toast

## Testing Checklist

### Authentication Flow

- [ ] Voucher login works
- [ ] Phone + OTP login works
- [ ] Role-based redirect works (end_user, admin, reseller)
- [ ] Logout works on all pages
- [ ] Protected routes redirect to login when not authenticated

### Navigation

- [ ] All sidebar links work in admin dashboard
- [ ] Mobile menu toggle works
- [ ] Back navigation works
- [ ] Direct URL access works (with auth)

### Modals & Dialogs

- [ ] Buy More modal opens and closes
- [ ] Upgrade modal opens and closes
- [ ] Modal overlay click closes modal
- [ ] Modal escape key closes modal (if implemented)

### Forms

- [ ] All form inputs are accessible
- [ ] Form validation works
- [ ] Submit buttons are disabled when invalid
- [ ] Loading states show during submission

### Buttons

- [ ] All buttons have hover states
- [ ] All buttons have active/pressed states
- [ ] Disabled buttons are visually distinct
- [ ] Loading buttons show spinner
- [ ] Icon buttons have proper spacing

### Responsive Design

- [ ] Mobile view (< 768px) works
- [ ] Tablet view (768px - 1024px) works
- [ ] Desktop view (> 1024px) works
- [ ] Sidebar collapses on mobile
- [ ] Tables scroll horizontally on mobile

### Dark Mode

- [ ] Theme toggle works on all pages
- [ ] All components render correctly in dark mode
- [ ] Colors have proper contrast
- [ ] Theme persists across page reloads

### Internationalization

- [ ] Language switcher works on all pages
- [ ] All text translates correctly
- [ ] Language persists across page reloads
- [ ] Currency formatting works
- [ ] Date formatting works

### Error Handling

- [ ] Network errors show appropriate messages
- [ ] Invalid inputs show validation errors
- [ ] Failed API calls show error toasts
- [ ] 401 errors redirect to login

## Common Issues & Solutions

### Issue: Button doesn't respond

**Solution**: Check browser console for errors, verify onClick handler is attached

### Issue: Modal doesn't close

**Solution**: Check if onClose prop is properly passed, verify overlay click handler

### Issue: Navigation doesn't work

**Solution**: Verify route paths match, check if user is authenticated

### Issue: Data doesn't load

**Solution**: Check if mock data is enabled, verify API calls in network tab

### Issue: Role-based redirect fails

**Solution**: Check phone number format (admin: contains "admin" or "999", reseller: contains "reseller" or "888")

## Performance Testing

- [ ] Page loads in < 2 seconds
- [ ] No layout shift during load
- [ ] Smooth transitions between pages
- [ ] No console errors
- [ ] No memory leaks (check with DevTools)

## Accessibility Testing

- [ ] All buttons have accessible labels
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG standards

## Browser Compatibility

Test in:

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## Notes

- All mock data includes realistic delays (200-1000ms)
- Payment simulation completes after ~3 seconds
- Subscription pause/resume shows immediate feedback
- All toasts appear for 4 seconds by default
