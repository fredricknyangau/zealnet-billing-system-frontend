# Quick Test Checklist

Use this checklist to quickly verify all buttons and pages work.

## Authentication Test

### Test Customer Login
1. Go to `/login`
2. Phone: `+254712345678`
3. OTP: `123456`
4. ✅ Should redirect to `/dashboard`

### Test Admin Login
1. Go to `/login`
2. Phone: `+254799999999` (contains "999")
3. OTP: `123456`
4. ✅ Should redirect to `/admin`

### Test Reseller Login
1. Go to `/login`
2. Phone: `+254788888888` (contains "888")
3. OTP: `123456`
4. ✅ Should redirect to `/reseller`

## Captive Portal (`/portal`)

### Voucher Tab
- [ ] Enter voucher code: `TEST123`
- [ ] Click "Connect Now"
- [ ] ✅ Should redirect to dashboard

### Phone Tab
- [ ] Enter phone: `+254712345678`
- [ ] Click "Send OTP"
- [ ] Enter OTP: `123456`
- [ ] Click "Verify"
- [ ] ✅ Should redirect to dashboard

### Plan Selection
- [ ] Click on any plan
- [ ] Enter phone for payment
- [ ] Click "Pay with M-Pesa"
- [ ] ✅ Payment should process

## Customer Dashboard (`/dashboard`)

- [ ] Click "Buy More" → ✅ Modal opens
- [ ] Click "Upgrade" → ✅ Modal opens
- [ ] Click "Pause" → ✅ Subscription pauses
- [ ] Click "Resume" → ✅ Subscription resumes
- [ ] Click download receipt → ✅ Opens receipt
- [ ] Click logout → ✅ Redirects to portal

## Admin Dashboard (`/admin`)

- [ ] Click "Dashboard" in sidebar → ✅ Shows overview
- [ ] Click "Customers" in sidebar → ✅ Shows customer list
- [ ] Enter search term → ✅ Filters customers
- [ ] Change status filter → ✅ Filters customers
- [ ] Click "View" on customer → ✅ Shows toast
- [ ] Click logout → ✅ Redirects to login

## Reseller Dashboard (`/reseller`)

- [ ] Click "Manage Tenants" → ✅ Shows toast
- [ ] Click logout → ✅ Redirects to login

## Common Elements

- [ ] Language switcher → ✅ Changes language
- [ ] Theme toggle → ✅ Changes theme
- [ ] All navigation works
- [ ] All modals open/close
- [ ] All forms submit

## All Tests Pass? ✅

If all checkboxes are checked, all buttons and pages are working!

