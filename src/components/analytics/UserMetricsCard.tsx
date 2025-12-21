/**
 * User Metrics Card Component
 * 
 * Displays user growth and engagement metrics
 */

import React from 'react'
import { Users, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { UserMetrics } from '@/lib/analytics-api'
import { formatCurrency } from '@/lib/utils'

interface UserMetricsCardProps {
  metrics: UserMetrics
  currency?: string
}

const MetricCard: React.FC<{
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}> = ({ title, value, subtitle, icon, trend, trendValue }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="text-primary">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {trend && trendValue && (
          <div className="flex items-center mt-2 text-sm">
            {trend === 'up' && (
              <TrendingUp className="h-4 w-4 text-success mr-1" />
            )}
            {trend === 'down' && (
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
            )}
            <span
              className={
                trend === 'up'
                  ? 'text-success'
                  : trend === 'down'
                  ? 'text-destructive'
                  : 'text-muted-foreground'
              }
            >
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export const UserMetricsCard: React.FC<UserMetricsCardProps> = ({ 
  metrics, 
  currency = 'KES' 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Active Users"
        value={metrics.active_users.toLocaleString()}
        subtitle={`${((metrics.active_users / metrics.total_users) * 100).toFixed(1)}% of total`}
        icon={<Users className="h-5 w-5" />}
        trend={metrics.churn_rate < 10 ? 'up' : 'down'}
        trendValue={`${(100 - metrics.churn_rate).toFixed(1)}% retention`}
      />

      <MetricCard
        title="New Users"
        value={metrics.new_users.toLocaleString()}
        subtitle="Last period"
        icon={<TrendingUp className="h-5 w-5" />}
      />

      <MetricCard
        title="Total Users"
        value={metrics.total_users.toLocaleString()}
        subtitle={`${metrics.inactive_users.toLocaleString()} inactive`}
        icon={<Users className="h-5 w-5" />}
      />

      <MetricCard
        title="ARPU"
        value={formatCurrency(metrics.arpu, currency)}
        subtitle="Average Revenue Per User"
        icon={<DollarSign className="h-5 w-5" />}
      />
    </div>
  )
}
