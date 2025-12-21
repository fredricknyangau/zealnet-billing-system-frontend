/**
 * Analytics API Client
 * 
 * Provides TypeScript-safe API calls to backend analytics endpoints
 */

import { api } from './api'

export interface RevenueAnalytics {
  time_series: Array<{
    period: string
    revenue: number
    transaction_count: number
    avg_transaction: number
  }>
  summary: {
    total_revenue: number
    total_transactions: number
    average_transaction: number
    start_date: string
    end_date: string
    granularity: string
  }
}

export interface UserMetrics {
  new_users: number
  active_users: number
  total_users: number
  inactive_users: number
  churn_rate: number
  arpu: number
  period: {
    start_date: string
    end_date: string
  }
}

export interface UsageMetrics {
  total_data_gb: number
  total_sessions: number
  avg_session_duration_minutes: number
  peak_hours: Array<{
    hour: number
    session_count: number
  }>
  period: {
    start_date: string
    end_date: string
  }
}

export interface CohortAnalysis {
  cohorts: Array<{
    cohort_month: string
    cohort_size: number
    retention: number[]
  }>
  months_analyzed: number
}

export interface DashboardSummary {
  revenue: {
    last_30_days: number
    last_7_days: number
    arpu: number
  }
  users: {
    total: number
    active: number
    new_last_30_days: number
    churn_rate: number
  }
  usage: {
    total_data_gb: number
    total_sessions: number
    avg_session_minutes: number
  }
  generated_at: string
}

// Export analytics API functions
export const analyticsApi = {
  async getRevenue(params: {
    start_date: string
    end_date: string
    granularity?: 'daily' | 'weekly' | 'monthly'
    tenant_id?: string
  }): Promise<RevenueAnalytics> {
    const {data} = await (api as any).client.get('/analytics/revenue', { params })
    return data
  },

  async getUsers(params: {
    start_date: string
    end_date: string
    tenant_id?: string
  }): Promise<UserMetrics> {
    const { data } = await (api as any).client.get('/analytics/users', { params })
    return data
  },

  async getUsage(params: {
    start_date: string
    end_date: string
    tenant_id?: string
  }): Promise<UsageMetrics> {
    const { data } = await (api as any).client.get('/analytics/usage', { params })
    return data
  },

  async getCohorts(params: {
    months?: number
    tenant_id?: string
  }): Promise<CohortAnalysis> {
    const { data } = await (api as any).client.get('/analytics/cohorts', { params })
    return data
  },

  async getDashboard(tenant_id?: string): Promise<DashboardSummary> {
    const params = tenant_id ? { tenant_id } : {}
    const { data } = await (api as any).client.get('/analytics/dashboard', { params })
    return data
  },
}

