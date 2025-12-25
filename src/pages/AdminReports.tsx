import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { 
  Download, 
  TrendingUp, 
  Users, 
  CreditCard,
  Wifi,
  Calendar,
  FileText,
  BarChart3,
  Activity
} from 'lucide-react'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
// Card imports removed (unused)
import { Badge } from '@/components/ui/Badge'
import { AuthCard } from '@/components/auth/AuthCard'
import { formatCurrency, formatBytes } from '@/lib/utils'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

type ReportType = 'revenue' | 'users' | 'usage' | 'payments'
type DateRange = '7' | '30' | '90' | '365'

export const AdminReports: React.FC = () => {
  const { t } = useTranslation()
  const [selectedReport, setSelectedReport] = useState<ReportType>('revenue')
  const [dateRange, setDateRange] = useState<DateRange>('30')

  // Fetch revenue data
  const { data: revenueData = [], isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue-report', dateRange],
    queryFn: () => api.getRevenueReport(parseInt(dateRange)),
    enabled: selectedReport === 'revenue'
  })

  // Fetch usage data
  const { data: usageData = [], isLoading: usageLoading } = useQuery({
    queryKey: ['admin-usage-report', dateRange],
    queryFn: () => api.getUsageReport(parseInt(dateRange)),
    enabled: selectedReport === 'usage'
  })

  // Fetch customers
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => api.getCustomers(),
    enabled: selectedReport === 'users'
  })

  // Fetch payments
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: () => api.getPayments({ admin: true }),
    enabled: selectedReport === 'payments'
  })

  // Calculate summary stats
  const totalRevenue = revenueData.reduce((sum, day) => sum + (day.revenue || 0), 0)
  const totalUsage = usageData.reduce((sum, day) => sum + (day.bytes_total || 0), 0)
  const totalCustomers = customers.length
  const totalPayments = payments.length

  const handleExportCSV = () => {
    let csvContent = ''
    let filename = ''

    switch (selectedReport) {
      case 'revenue':
        csvContent = 'Date,Revenue\n' + revenueData.map(d => `${d.date},${d.revenue}`).join('\n')
        filename = `revenue_report_${dateRange}days.csv`
        break
      case 'usage':
        csvContent = 'Date,Bytes\n' + usageData.map(d => `${d.date},${d.bytes_total}`).join('\n')
        filename = `usage_report_${dateRange}days.csv`
        break
      case 'users':
        csvContent = 'Name,Email,Phone,Status\n' + customers.map(c => 
          `${c.name},${c.email || 'N/A'},${c.phone},${c.status || 'active'}`
        ).join('\n')
        filename = 'users_report.csv'
        break
      case 'payments':
        csvContent = 'Date,Amount,Method,Status\n' + payments.map(p => 
          `${p.createdAt},${p.amount},${p.method},${p.status}`
        ).join('\n')
        filename = 'payments_report.csv'
        break
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('Report exported successfully!', { icon: '📊' })
  }

  const handleExportPDF = () => {
    toast('PDF export will be implemented with jsPDF library', { icon: 'ℹ️' })
  }

  const reportTypes = [
    { id: 'revenue' as ReportType, label: 'Revenue', icon: TrendingUp, color: 'text-success' },
    { id: 'users' as ReportType, label: 'Users', icon: Users, color: 'text-primary' },
    { id: 'usage' as ReportType, label: 'Usage', icon: Wifi, color: 'text-accent' },
    { id: 'payments' as ReportType, label: 'Payments', icon: CreditCard, color: 'text-warning' },
  ]

  const isLoading = revenueLoading || usageLoading || customersLoading || paymentsLoading

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('admin.reports', 'Reports & Analytics')}
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            icon={<Download className="h-4 w-4" />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            icon={<FileText className="h-4 w-4" />}
            onClick={handleExportPDF}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reportTypes.map((type) => (
          <AuthCard key={type.id}>
            <button
              onClick={() => setSelectedReport(type.id)}
              className={`w-full text-left p-6 transition-all ${
                selectedReport === type.id ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <type.icon className={`h-8 w-8 ${type.color}`} />
                {selectedReport === type.id && (
                  <Badge variant="success">Active</Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg">{type.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {type.id === 'revenue' && formatCurrency(totalRevenue, 'KES')}
                {type.id === 'users' && `${totalCustomers} total`}
                {type.id === 'usage' && formatBytes(totalUsage)}
                {type.id === 'payments' && `${totalPayments} transactions`}
              </p>
            </button>
          </AuthCard>
        ))}
      </div>

      {/* Date Range Filter */}
      {(selectedReport === 'revenue' || selectedReport === 'usage') && (
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Date Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      )}

      {/* Report Content */}
      <AuthCard>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center space-y-4">
                <Activity className="h-12 w-12 text-primary animate-pulse mx-auto" />
                <p className="text-muted-foreground">Loading report data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Revenue Report */}
              {selectedReport === 'revenue' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-success" />
                      Revenue Report
                    </h3>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-3xl font-bold text-success">
                        {formatCurrency(totalRevenue, 'KES')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="hsl(var(--success))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--success))', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Daily</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(totalRevenue / revenueData.length || 0, 'KES')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Highest Day</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(Math.max(...revenueData.map(d => d.revenue || 0)), 'KES')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lowest Day</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(Math.min(...revenueData.map(d => d.revenue || 0)), 'KES')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Usage Report */}
              {selectedReport === 'usage' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Wifi className="h-6 w-6 text-accent" />
                      Usage Report
                    </h3>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Usage</p>
                      <p className="text-3xl font-bold text-accent">
                        {formatBytes(totalUsage)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                          tickFormatter={(value) => formatBytes(value)}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: any) => formatBytes(value)}
                        />
                        <Legend />
                        <Bar 
                          dataKey="bytes_total" 
                          fill="hsl(var(--accent))" 
                          name="Data Usage"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-sm text-muted-foreground">Average Daily</p>
                      <p className="text-xl font-bold">
                        {formatBytes((totalUsage / usageData.length) || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peak Day</p>
                      <p className="text-xl font-bold">
                        {formatBytes(Math.max(...usageData.map(d => d.bytes_total || 0)))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lowest Day</p>
                      <p className="text-xl font-bold">
                        {formatBytes(Math.min(...usageData.map(d => d.bytes_total || 0)))}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Report */}
              {selectedReport === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <Users className="h-6 w-6 text-primary" />
                      Users Report
                    </h3>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-3xl font-bold text-primary">{totalCustomers}</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left p-4 font-semibold">Name</th>
                          <th className="text-left p-4 font-semibold">Contact</th>
                          <th className="text-left p-4 font-semibold">Status</th>
                          <th className="text-right p-4 font-semibold">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.slice(0, 20).map((customer, idx) => (
                          <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="p-4 font-medium">{customer.name}</td>
                            <td className="p-4 text-muted-foreground">
                              {customer.email || customer.phone}
                            </td>
                            <td className="p-4">
                              <Badge variant="success">Active</Badge>
                            </td>
                            <td className="p-4 text-right text-muted-foreground">
                              {new Date(customer.createdAt || Date.now()).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payments Report */}
              {selectedReport === 'payments' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <CreditCard className="h-6 w-6 text-warning" />
                      Payments Report
                    </h3>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                      <p className="text-3xl font-bold text-warning">{totalPayments}</p>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-border">
                          <th className="text-left p-4 font-semibold">Date</th>
                          <th className="text-left p-4 font-semibold">Amount</th>
                          <th className="text-left p-4 font-semibold">Method</th>
                          <th className="text-left p-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.slice(0, 20).map((payment, idx) => (
                          <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                            <td className="p-4 text-muted-foreground">
                              {new Date(payment.createdAt).toLocaleString()}
                            </td>
                            <td className="p-4 font-bold">
                              {formatCurrency(payment.amount, payment.currency)}
                            </td>
                            <td className="p-4">
                              <Badge variant="info">{payment.method}</Badge>
                            </td>
                            <td className="p-4">
                              <Badge 
                                variant={
                                  payment.status === 'completed' ? 'success' :
                                  payment.status === 'pending' ? 'warning' : 'default'
                                }
                              >
                                {payment.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </AuthCard>
    </div>
  )
}
