import React, { useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'
import { OfflineIndicator } from './components/OfflineIndicator'
import { SkeletonText } from '@/components/ui/Skeleton'

// Lazy Loaded Pages
const CaptivePortal = React.lazy(() => import('./pages/CaptivePortal').then(module => ({ default: module.CaptivePortal })))
const CustomerDashboard = React.lazy(() => import('./pages/CustomerDashboard').then(module => ({ default: module.CustomerDashboard })))
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })))
// ResellerDashboard is a named export, so we handle it similarly
const ResellerDashboard = React.lazy(() => import('./pages/ResellerDashboard').then(module => ({ default: module.ResellerDashboard })))
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })))
const ChatSimulator = React.lazy(() => import('./pages/ChatSimulator').then(module => ({ default: module.ChatSimulator })))

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
  const { isAuthenticated, user } = useAuthStore()

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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<CaptivePortal />} />
            <Route path="/portal" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/chat-simulator" element={<ChatSimulator />} />

            {/* Customer routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
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
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/portal" replace />} />
          </Routes>
        </Suspense>
        <OfflineIndicator />
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
  )
}

export default App
