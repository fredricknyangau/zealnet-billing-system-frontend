import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  Plus,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkeletonText } from '@/components/ui/Skeleton'
import { ThemeToggle } from '@/components/ThemeToggle'
import { RevenueSplitVisualization } from '@/components/reseller/RevenueSplitVisualization'
import { TenantSwitcher } from '@/components/reseller/TenantSwitcher'
import { SubAccountWizard } from '@/components/reseller/SubAccountWizard'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// Sub-components for Reseller Pages
const ResellerOverview: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuthStore()

  // Fetch tenants for overview stats
  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['reseller-tenants'],
    queryFn: () => api.getTenantsForSwitcher(),
  })

  // Calculate aggregate stats
  const totalRevenue = tenants.reduce((acc, t) => acc + (t.monthlyRevenue || 0), 0)
  const totalCustomers = tenants.reduce((acc, t) => acc + (t.customerCount || 0), 0)
  const activeTenants = tenants.length

  if (isLoading) {
    return <SkeletonText lines={4} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {t('admin.dashboard')}
        </h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue (30d)</p>
              <CreditCard className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              KES {totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Customers</p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {totalCustomers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Sub-Accounts</p>
              <Users className="h-5 w-5 text-accent" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {activeTenants}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueSplitVisualization />
      </div>
    </div>
  )
}

const ResellerSubAccounts: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false)
  
  const { data: tenants = [], isLoading, refetch } = useQuery({
    queryKey: ['reseller-tenants'],
    queryFn: () => api.getTenantsForSwitcher(),
  })

  const handleCreateNewTenant = () => {
    setShowWizard(true)
  }

  const handleWizardComplete = async (data: any) => {
    try {
      await api.createSubAccount(data)
      toast.success('Sub-account created successfully!')
      refetch()
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create sub-account')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sub-Accounts</h2>
          <p className="text-muted-foreground">Manage your client tenants</p>
        </div>
        <Button onClick={handleCreateNewTenant} icon={<Plus className="h-4 w-4" />}>
          New Sub-Account
        </Button>
      </div>

      {isLoading ? (
        <SkeletonText lines={5} />
      ) : (
        <Card>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customers</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue (30d)</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">{tenant.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {tenant.domain}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {tenant.customerCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium text-success">
                        KES {tenant.monthlyRevenue?.toLocaleString() || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </td>
                    </tr>
                  ))}
                  {tenants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No sub-accounts found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <SubAccountWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  )
}

// Main Layout Component
export const ResellerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/reseller' },
    { icon: Users, label: 'Sub-Accounts', path: '/reseller/accounts' },
    // { icon: Package, label: 'Plans', path: '/reseller/plans' }, // Consolidate plans?
    // { icon: BarChart3, label: 'Reports', path: '/reseller/reports' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-card border-r border-border transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } transition-transform duration-200 flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">Partner Portal</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <ThemeToggle />
            </div>
            <Button variant="ghost" fullWidth onClick={handleLogout} icon={<LogOut className="h-4 w-4" />}>
              {t('auth.logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-card border-b border-border">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-4">
                 {/* Top right actions if needed */}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          <Routes>
            <Route path="/" element={<ResellerOverview />} />
            <Route path="/accounts" element={<ResellerSubAccounts />} />
            {/* Add more routes as needed */}
          </Routes>
        </div>
      </main>
    </div>
  )
}
