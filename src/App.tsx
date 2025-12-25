import React, { useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { OfflineIndicator } from './components/OfflineIndicator'
import { SkeletonText } from '@/components/ui/Skeleton'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { CookieConsent } from '@/components/CookieConsent'

// Lazy Loaded Pages
const Landing = React.lazy(() => import('./pages/Landing').then(module => ({ default: module.Landing })))
const CaptivePortal = React.lazy(() => import('./pages/CaptivePortal').then(module => ({ default: module.CaptivePortal })))
const CustomerDashboard = React.lazy(() => import('./pages/CustomerDashboard').then(module => ({ default: module.CustomerDashboard })))
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
// ResellerDashboard is a named export, so we handle it similarly
const ResellerDashboard = React.lazy(() => import('./pages/ResellerDashboard').then(module => ({ default: module.ResellerDashboard })))
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const SignupPage = React.lazy(() => import('./pages/SignupPage').then(module => ({ default: module.SignupPage })))
const ChatSimulator = React.lazy(() => import('./pages/ChatSimulator').then(module => ({ default: module.ChatSimulator })))
// Static Pages
const AboutPage = React.lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })))
const ContactPage = React.lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })))
const CareersPage = React.lazy(() => import('./pages/CareersPage').then(module => ({ default: module.CareersPage })))
const PrivacyPage = React.lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })))
const TermsPage = React.lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })))
const CookiesPage = React.lazy(() => import('./pages/CookiesPage').then(module => ({ default: module.CookiesPage })))
// Error Pages
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))
const ServerErrorPage = React.lazy(() => import('./pages/ServerErrorPage').then(module => ({ default: module.ServerErrorPage })))
// Password Reset Pages
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })))
const ResetPasswordPage = React.lazy(() => import('./pages/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })))
// Settings Page
const SettingsPage = React.lazy(() => import('./pages/SettingsPage').then(module => ({ default: module.SettingsPage })))
// Help Page
const HelpPage = React.lazy(() => import('./pages/HelpPage').then(module => ({ default: module.HelpPage })))
// Top Up Page
const TopUpPage = React.lazy(() => import('./pages/TopUpPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  // Use selectors to prevent infinite re-renders
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

// Loading Fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-4 w-full max-w-md px-6">
      <SkeletonText lines={3} />
      <p className="text-center text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
)

function App() {
  const { effectiveTheme } = useThemeStore()

  useEffect(() => {
    const root = document.documentElement
    if (effectiveTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [effectiveTheme])

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/portal" element={<CaptivePortal />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/chat-simulator" element={<ChatSimulator />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            
            {/* Error Pages */}
            <Route path="/500" element={<ServerErrorPage />} />

            {/* Customer routes */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/topup"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <TopUpPage />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Reseller routes */}
            <Route
              path="/reseller/*"
              element={
                <ProtectedRoute allowedRoles={['reseller']}>
                  <ResellerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Fallback - 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </Suspense>
          <OfflineIndicator />
          <CookieConsent />
          <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: effectiveTheme === 'dark' ? '#1f2937' : '#fff',
              color: effectiveTheme === 'dark' ? '#f9fafb' : '#111827',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
