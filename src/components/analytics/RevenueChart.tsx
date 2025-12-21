/**
 * Revenue Chart Component
 * 
 * Displays revenue time series data using Recharts
 */

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { RevenueAnalytics } from '@/lib/analytics-api'
import { formatCurrency } from '@/lib/utils'

interface RevenueChartProps {
  data: RevenueAnalytics
  currency?: string
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ 
  data, 
  currency = 'KES' 
}) => {
  // Format data for chart
  const chartData = data.time_series.map((item) => ({
    ...item,
    date: new Date(item.period).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }))

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Revenue Trend</h3>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(data.summary.total_revenue, currency)} total revenue
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart 
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis 
            dataKey="date" 
            className="text-xs fill-muted-foreground"
          />
          <YAxis 
            className="text-xs fill-muted-foreground"
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
            formatter={(value: number) => formatCurrency(value, currency)}
            labelStyle={{ color: 'var(--foreground)' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            name="Revenue"
            dot={{ fill: 'hsl(var(--primary))' }}
          />
          <Line
            type="monotone"
            dataKey="transaction_count"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            name="Transactions"
            yAxisId="right"
            dot={{ fill: 'hsl(var(--chart-2))' }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-xl font-bold text-foreground">
            {data.summary.total_transactions.toLocaleString()}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Average Transaction</p>
          <p className="text-xl font-bold text-foreground">
            {formatCurrency(data.summary.average_transaction, currency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Period</p>
          <p className="text-sm font-medium text-foreground">
            {data.summary.granularity}
          </p>
        </div>
      </div>
    </div>
  )
}
