#!/bin/bash

# Lighthouse Performance Audit Script
# Run this to verify 100% compliance with performance requirements

echo "🚀 Starting Lighthouse Performance Audit..."
echo "============================================"

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo "📦 Installing Lighthouse CLI..."
    npm install -g lighthouse
fi

# Start the dev server in background
echo "🔧 Starting development server..."
cd "$(dirname "$0")/.."
npm run dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Run Lighthouse audits
echo ""
echo "📊 Running Lighthouse Audit on Captive Portal..."
lighthouse http://localhost:5173/portal \
    --output html \
    --output-path ./lighthouse-reports/captive-portal.html \
    --chrome-flags="--headless" \
    --only-categories=performance,accessibility,best-practices,seo \
    --preset=mobile

echo ""
echo "📊 Running Lighthouse Audit on Customer Dashboard..."
lighthouse http://localhost:5173/dashboard \
    --output html \
    --output-path ./lighthouse-reports/customer-dashboard.html \
    --chrome-flags="--headless" \
    --only-categories=performance,accessibility,best-practices,seo \
    --preset=mobile

echo ""
echo "📊 Running Lighthouse Audit on Admin Dashboard..."
lighthouse http://localhost:5173/admin \
    --output html \
    --output-path ./lighthouse-reports/admin-dashboard.html \
    --chrome-flags="--headless" \
    --only-categories=performance,accessibility,best-practices,seo \
    --preset=desktop

# Kill the server
echo ""
echo "🛑 Stopping development server..."
kill $SERVER_PID

echo ""
echo "✅ Lighthouse audits complete!"
echo "📁 Reports saved to ./lighthouse-reports/"
echo ""
echo "Performance Targets:"
echo "  - Captive Portal: >90 (mobile)"
echo "  - Customer Dashboard: >90 (mobile)"
echo "  - Admin Dashboard: >85 (desktop)"
echo ""
echo "Review the HTML reports for detailed insights."
