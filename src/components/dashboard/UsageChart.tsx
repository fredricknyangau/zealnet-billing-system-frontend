import React, { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { formatBytes } from '@/lib/utils'
import { SkeletonText } from '@/components/ui/Skeleton'
import { useTranslation } from 'react-i18next'

export const UsageChart: React.FC = () => {
  const { t } = useTranslation()
  const { data: usageHistory, isLoading } = useQuery({
    queryKey: ['usageHistory', 7],
    queryFn: () => api.getUsageHistory(7),
  })

  const formattedData = useMemo(() => {
    if (!usageHistory) return []
    return usageHistory.map((item) => ({
      ...item,
      displayDate: new Date(item.date).toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
      }),
    }))
  }, [usageHistory])

  if (isLoading) {
    return (
      <Card variant="glass" className="h-[300px]">
        <CardHeader>
          <SkeletonText lines={1} />
        </CardHeader>
        <CardContent>
          <SkeletonText lines={5} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <CardTitle>{t('dashboard.dataUsage', 'Data Usage (Last 7 Days)')}</CardTitle>
        <CardDescription>Your daily data consumption</CardDescription>
      </CardHeader>
      <CardContent className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorBytes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="displayDate"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatBytes(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [formatBytes(value), 'Data Used']}
            />
            <Area
              type="monotone"
              dataKey="total_bytes"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorBytes)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
