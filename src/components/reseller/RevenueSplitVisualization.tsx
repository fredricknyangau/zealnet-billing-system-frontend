import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  TooltipProps,
} from 'recharts'
import { TrendingUp, DollarSign, Users, Percent } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { api } from '@/lib/api'

interface RevenueSplitItem {
  name: string
  revenue: number
  commission: number
  net: number
  color: string
}

interface RevenueSplitVisualizationProps {
  days?: number
}

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload as RevenueSplitItem

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-foreground mb-2">{data.name}</p>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Revenue:</span>
          <span className="font-medium text-foreground">{formatCurrency(data.revenue, 'KES')}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Commission:</span>
          <span className="font-medium text-warning">{formatCurrency(data.commission, 'KES')}</span>
        </div>
        <div className="flex justify-between gap-4 pt-1 border-t border-border">
          <span className="text-muted-foreground">Net:</span>
          <span className="font-semibold text-success">{formatCurrency(data.net, 'KES')}</span>
        </div>
      </div>
    </div>
  )
}

export const RevenueSplitVisualization: React.FC<RevenueSplitVisualizationProps> = ({ days = 30 }) => {
  // Fetch revenue split from backend
  const { data: revenueSplit, isLoading } = useQuery({
    queryKey: ['revenue-split', days],
    queryFn: () => api.getRevenueSplit(days),
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading revenue data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!revenueSplit || !revenueSplit.tenants || revenueSplit.tenants.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground py-12">
            No revenue data available for the selected period.
          </div>
        </CardContent>
      </Card>
    )
  }

  // Map backend data to chart format
  const splitData: RevenueSplitItem[] = revenueSplit.tenants.map((tenant: any, index: number) => ({
    name: tenant.name,
    revenue: tenant.revenue,
    commission: tenant.commission,
    net: tenant.net,
    color: tenant.color || COLORS[index % COLORS.length],
  }))

  const totalRevenue = revenueSplit.totals.revenue
  const totalCommission = revenueSplit.totals.commission
  const totalNet = revenueSplit.totals.net
  const avgCommissionRate = (totalCommission / totalRevenue) * 100

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalRevenue, 'KES')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <Percent className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="text-2xl font-bold text-warning">
                  {formatCurrency(totalCommission, 'KES')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Net Revenue</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(totalNet, 'KES')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-info/10 rounded-lg">
                <Users className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Commission</p>
                <p className="text-2xl font-bold text-foreground">
                  {avgCommissionRate.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Distribution (Pie Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={splitData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {splitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue vs Commission (Bar Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={splitData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="name"
                  tickFormatter={(value) => value.split(' ')[0]}
                  className="text-muted-foreground"
                />
                <YAxis className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#2563eb" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commission" fill="#f59e0b" name="Commission" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tenant Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 px-4 text-sm font-semibold text-muted-foreground">Tenant</th>
                  <th className="py-3 px-4 text-sm font-semibold text-muted-foreground text-right">Revenue</th>
                  <th className="py-3 px-4 text-sm font-semibold text-muted-foreground text-right">Commission</th>
                  <th className="py-3 px-4 text-sm font-semibold text-muted-foreground text-right">Rate</th>
                  <th className="py-3 px-4 text-sm font-semibold text-muted-foreground text-right">Net Revenue</th>
                  <th className="py-3 px-4 text-sm font-semibold text-muted-foreground text-center">Share</th>
                </tr>
              </thead>
              <tbody>
                {splitData.map((item, index) => {
                  const commissionRate = (item.commission / item.revenue) * 100
                  const revenueShare = (item.revenue / totalRevenue) * 100

                  return (
                    <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium text-foreground">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-foreground">
                        {formatCurrency(item.revenue, 'KES')}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-warning">
                        {formatCurrency(item.commission, 'KES')}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="warning" size="sm">
                          {commissionRate.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-success">
                        {formatCurrency(item.net, 'KES')}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="info" size="sm">
                          {revenueShare.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
                <tr className="bg-muted/50 font-semibold">
                  <td className="py-3 px-4 text-foreground">Total</td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {formatCurrency(totalRevenue, 'KES')}
                  </td>
                  <td className="py-3 px-4 text-right text-warning">
                    {formatCurrency(totalCommission, 'KES')}
                  </td>
                  <td className="py-3 px-4 text-right text-foreground">
                    {avgCommissionRate.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-right text-success">
                    {formatCurrency(totalNet, 'KES')}
                  </td>
                  <td className="py-3 px-4 text-center text-foreground">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
