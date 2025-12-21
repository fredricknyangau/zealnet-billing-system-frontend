/**
 * Peak Usage Chart Component
 * 
 * Displays hourly usage patterns as a bar chart
 */

import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { UsageMetrics } from '@/lib/analytics-api'

interface PeakUsageChartProps {
  data: UsageMetrics
}

export const PeakUsageChart: React.FC<PeakUsageChartProps> = ({ data }) => {
  // Format hour labels (0-23 to 12AM-11PM)
  const chartData = data.peak_hours.map((item) => ({
    ...item,
    hourLabel: `${item.hour === 0 ? '12' : item.hour > 12 ? item.hour - 12 : item.hour}${
      item.hour >= 12 ? 'PM' : 'AM'
    }`,
  }))

  // Find peak hour
  const peakHour = data.peak_hours.reduce((max, item) =>
    item.session_count > max.session_count ? item : max
  )

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Peak Usage Hours</h3>
        <p className="text-sm text-muted-foreground">
          Peak hour: {peakHour.hour}:00 ({peakHour.session_count.toLocaleString()} sessions)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart 
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="hourLabel"
            className="text-xs fill-muted-foreground"
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis className="text- xs fill-muted-foreground" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
            }}
            labelFormatter={(value, payload) => {
              if (payload && payload[0]) {
                const hour = payload[0].payload.hour
                return `${hour}:00 - ${hour + 1}:00`
              }
              return value
            }}
            formatter={(value: number) => [
              `${value.toLocaleString()} sessions`,
              'Sessions',
            ]}
          />
          <Bar dataKey="session_count" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
