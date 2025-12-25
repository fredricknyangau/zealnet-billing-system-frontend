import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  Network,
  BarChart3,
  LogOut,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Ticket,
  TrendingUp,
  AlertOctagon,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkeletonText } from '@/components/ui/Skeleton'
import { Input } from '@/components/ui/Input'
import { formatCurrency } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import toast from 'react-hot-toast'
import { AdminBilling } from './AdminBilling'
import { AdminPlans } from './AdminPlans'
import { AdminNetwork } from './AdminNetwork'
import { AdminReports } from './AdminReports'
import { AIInsightCard, InsightType } from '@/components/ai/AIInsightCard'
import { DLQMonitoringPanel } from '@/components/admin/DLQMonitoringPanel'
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard'
import { VoucherManagement } from '@/components/admin/VoucherManagement'

const AdminOverview: React.FC = () => {
  const { t } = useTranslation()
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => api.getNetworkMetrics(),
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SkeletonText lines={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {t('admin.dashboard')}
        </h2>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {t('admin.activeUsers')}
              </p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {metrics?.activeUsers || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {t('admin.revenueToday')}
              </p>
              <CreditCard className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(metrics?.revenueToday || 0, 'KES')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {t('admin.paymentSuccessRate')}
              </p>
              <BarChart3 className="h-5 w-5 text-warning" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {metrics?.paymentSuccessRate || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {t('admin.networkHealth')}
              </p>
              {metrics?.networkHealth === 'healthy' ? (
                <CheckCircle className="h-5 w-5 text-success" />
              ) : metrics?.networkHealth === 'degraded' ? (
                <AlertTriangle className="h-5 w-5 text-warning" />
              ) : (
                <XCircle className="h-5 w-5 text-destructive" />
              )}
            </div>
            <Badge
              variant={
                metrics?.networkHealth === 'healthy'
                  ? 'success'
                  : metrics?.networkHealth === 'degraded'
                  ? 'warning'
                  : 'danger'
              }
              size="md"
            >
              {metrics?.networkHealth || 'unknown'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Alerts */}
      {metrics?.alerts && metrics.alerts.length > 0 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Insights & Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.alerts.map((alert) => (
                  <AIInsightCard 
                    key={alert.id}
                    type={alert.type as InsightType}
                    title={alert.title}
                    description={alert.message}
                    confidence={85} // Mock confidence
                    metric={alert.metadata?.metric}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

const AdminCustomers: React.FC = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers', statusFilter, search],
    queryFn: () =>
      api.getCustomers({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined,
      }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {t('admin.customerList')}
        </h2>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <SkeletonText lines={10} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {customers?.map((customer) => (
                    <tr key={customer.id} className="hover:bg-muted">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {customer.name || customer.phone}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {customer.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          variant={
                            customer.status === 'active'
                              ? 'success'
                              : customer.status === 'expired'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {customer.subscription?.plan.name || 'No plan'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {formatCurrency(customer.totalSpent, 'KES')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            toast.success(`Viewing customer: ${customer.name || customer.phone}`)
                            // In a real app, this would navigate to customer detail page
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.dashboard'), path: '/admin' },
    { icon: Users, label: t('admin.customers'), path: '/admin/customers' },
    { icon: CreditCard, label: t('admin.billing'), path: '/admin/billing' },
    { icon: Package, label: t('admin.plans'), path: '/admin/plans' },
    { icon: Network, label: t('admin.network'), path: '/admin/network' },
    { icon: BarChart3, label: t('admin.reports'), path: '/admin/reports' },
    { icon: TrendingUp, label: 'Analytics', path: '/admin/analytics' },
    { icon: AlertOctagon, label: 'DLQ Monitor', path: '/admin/dlq' },
    { icon: Ticket, label: 'Vouchers', path: '/admin/vouchers' },
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
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
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
                  className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[52px] rounded-lg transition-colors ${
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
          </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto scrollbar-thin">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/customers" element={<AdminCustomers />} />
            <Route path="/billing" element={<AdminBilling />} />
            <Route path="/plans" element={<AdminPlans />} />
            <Route path="/network" element={<AdminNetwork />} />
            <Route path="/reports" element={<AdminReports />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/dlq" element={<DLQMonitoringPanel />} />
            <Route path="/vouchers" element={<VoucherManagement />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

