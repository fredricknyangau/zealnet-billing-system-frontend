import React from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { DollarSign, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface RevenueDataPoint {
  date: string
  revenue: number
  transactions: number
  avgTicket: number
}

interface RevenueByPlan {
  name: string
  value: number
  color: string
}

interface RevenueChartsProps {
  data?: RevenueDataPoint[]
  planData?: RevenueByPlan[]
}

const COLORS = ['#2563eb', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6']

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-foreground">
            {entry.name?.includes('Revenue') || entry.name?.includes('Ticket')
              ? formatCurrency(Number(entry.value), 'KES')
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// Generate mock data
const generateMockRevenueData = (): RevenueDataPoint[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map(day => {
    const transactions = Math.floor(50 + Math.random() * 150)
    const avgTicket = 500 + Math.random() * 1500
    return {
      date: day,
      revenue: transactions * avgTicket,
      transactions,
      avgTicket,
    }
  })
}

const generateMockPlanData = (): RevenueByPlan[] => [
  { name: 'Basic (1GB)', value: 45000, color: COLORS[0] },
  { name: 'Standard (5GB)', value: 85000, color: COLORS[1] },
  { name: 'Premium (10GB)', value: 120000, color: COLORS[2] },
  { name: 'Unlimited', value: 65000, color: COLORS[3] },
]

export const RevenueCharts: React.FC<RevenueChartsProps> = ({ data, planData }) => {
  const revenueData = data || generateMockRevenueData()
  const planRevenueData = planData || generateMockPlanData()

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0)
  const avgDailyRevenue = totalRevenue / revenueData.length
  const totalTransactions = revenueData.reduce((sum, d) => sum + d.transactions, 0)

  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total (7 days)</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalRevenue, 'KES')}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                name="Revenue (KES)"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Avg Daily Revenue</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(avgDailyRevenue, 'KES')}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold text-foreground">Total Transactions</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalTransactions}</p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-warning" />
                <span className="text-sm font-semibold text-foreground">Avg Ticket Size</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(totalRevenue / totalTransactions, 'KES')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Plan & Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue by Plan (Pie Chart) */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold text-foreground mb-1">
                          {payload[0].name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(Number(payload[0].value), 'KES')}
                        </p>
                      </div>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2">
              {planRevenueData.map((plan, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span className="text-foreground">{plan.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(plan.value, 'KES')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="transactions"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Transactions"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
