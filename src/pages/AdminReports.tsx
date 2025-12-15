import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, TrendingUp, Download, Users, DollarSign } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export const AdminReports: React.FC = () => {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState('week')

  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => api.getNetworkMetrics(),
  })

  // Revenue Report
  const { data: revenueData = [] } = useQuery({
    queryKey: ['admin-revenue-report', dateRange],
    queryFn: () => {
        const days = dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365
        return api.getRevenueReport(days)
    }
  })

  // Usage Report
  const { data: usageData = [] } = useQuery({
    queryKey: ['admin-usage-report', dateRange],
    queryFn: () => {
        const days = dateRange === 'today' ? 1 : dateRange === 'week' ? 7 : dateRange === 'month' ? 30 : 365
        return api.getUsageReport(days)
    }
  })

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} report...`)
    // In real app, this would generate and download report
  }

  const totalRevenue = revenueData.reduce((sum, d: any) => sum + (d.revenue || 0), 0)
  const avgDailyRevenue = revenueData.length ? totalRevenue / revenueData.length : 0
  const totalUsers = 0 
  const avgDailyUsers = 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.reports')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analytics, insights, and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(totalRevenue, 'KES')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {formatCurrency(avgDailyRevenue, 'KES')}/day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">{totalUsers}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {avgDailyUsers} users/day
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Payment Success</p>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {metrics?.paymentSuccessRate || 94.5}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Churn Risk</p>
              <BarChart3 className="h-5 w-5 text-warning" />
            </div>
            <p className="text-3xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground mt-1">High risk customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Daily revenue over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2563eb" name="Revenue (KES)" />
              {/* Users not yet in backend response, commenting out or using 0 */}
              {/* <Line type="monotone" dataKey="users" stroke="#22c55e" name="Active Users" /> */}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Usage Heatmap Placeholder - Adapted to daily usage trend */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Trend</CardTitle>
          <CardDescription>Daily data usage trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {usageData.map((data) => (
              <div key={data.date} className="flex items-center gap-4">
                <div className="w-24 text-sm text-muted-foreground">{new Date(data.date).toLocaleDateString()}</div>
                <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.min((data.bytes_total / (1024 * 1024 * 1024)) * 10, 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{(data.bytes_total / (1024 * 1024)).toFixed(0)} MB</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Report</CardTitle>
            <CardDescription>Detailed revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {revenueData.map((data) => (
                <div
                  key={data.date}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(data.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {/* {data.users} active users */}
                      N/A active users
                    </p>
                  </div>
                  <p className="text-sm font-bold text-success">
                    {formatCurrency(data.revenue, 'KES')}
                  </p>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              onClick={() => handleExport('revenue')}
              icon={<Download className="h-4 w-4" />}
            >
              Export Revenue Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Analytics</CardTitle>
            <CardDescription>User growth and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">New Users</span>
                <span className="text-lg font-bold text-foreground">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="text-lg font-bold text-foreground">
                  {metrics?.activeUsers || 42}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Retention Rate</span>
                <span className="text-lg font-bold text-success">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Avg Session Time</span>
                <span className="text-lg font-bold text-foreground">2h 15m</span>
              </div>
            </div>
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              onClick={() => handleExport('users')}
              icon={<Download className="h-4 w-4" />}
            >
              Export User Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

