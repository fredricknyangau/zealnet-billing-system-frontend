import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { TrendingDown, TrendingUp, Users, UserMinus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface ChurnDataPoint {
  month: string
  churnRate: number
  retention: number
  newCustomers: number
  lostCustomers: number
}

interface ChurnAnalysisChartProps {
  data?: ChurnDataPoint[]
}

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
            {entry.value}
            {entry.name?.includes('Rate') || entry.name?.includes('Retention') ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  )
}

// Mock data generator
const generateMockData = (): ChurnDataPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((month, index) => ({
    month,
    churnRate: 5 + Math.random() * 10, // 5-15%
    retention: 85 + Math.random() * 10, // 85-95%
    newCustomers: Math.floor(100 + Math.random() * 200),
    lostCustomers: Math.floor(20 + Math.random() * 80),
  }))
}

export const ChurnAnalysisChart: React.FC<ChurnAnalysisChartProps> = ({ data }) => {
  const chartData = data || generateMockData()
  
  // Calculate trends
  const currentChurn = chartData[chartData.length - 1]?.churnRate || 0
  const previousChurn = chartData[chartData.length - 2]?.churnRate || 0
  const churnTrend = currentChurn - previousChurn
  const isImproving = churnTrend < 0 // Negative churn trend is good

  const currentRetention = chartData[chartData.length - 1]?.retention || 0
  const avgChurn = chartData.reduce((sum, d) => sum + d.churnRate, 0) / chartData.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5" />
            Churn Analysis
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Current Churn Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {currentChurn.toFixed(1)}%
              </p>
              <div className="flex items-center gap-1 text-xs">
                {isImproving ? (
                  <>
                    <TrendingDown className="h-3 w-3 text-success" />
                    <span className="text-success">
                      {Math.abs(churnTrend).toFixed(1)}% better
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-3 w-3 text-danger" />
                    <span className="text-danger">
                      {churnTrend.toFixed(1)}% worse
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Retention Rate</p>
              <p className="text-2xl font-bold text-success">
                {currentRetention.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Churn vs Retention Trend */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">Churn vs Retention Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="churnRate"
                stroke="#ef4444"
                strokeWidth={2}
                name="Churn Rate (%)"
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="retention"
                stroke="#22c55e"
                strokeWidth={2}
                name="Retention (%)"
                dot={{ fill: '#22c55e', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Movement */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Customer Movement</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="newCustomers"
                fill="#22c55e"
                name="New Customers"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="lostCustomers"
                fill="#ef4444"
                name="Lost Customers"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Avg Churn Rate</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgChurn.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-semibold text-foreground">Best Month</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {chartData.reduce((best, curr) =>
                curr.retention > best.retention ? curr : best
              ).month}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Highest retention</p>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold text-foreground">Risk Level</span>
            </div>
            <Badge variant={currentChurn > 10 ? 'danger' : currentChurn > 7 ? 'warning' : 'success'} size="md">
              {currentChurn > 10 ? 'High' : currentChurn > 7 ? 'Medium' : 'Low'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Current churn risk</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
