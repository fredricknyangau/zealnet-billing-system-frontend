/**
 * Compliance API Client
 * 
 * Provides TypeScript-safe API calls to backend compliance endpoints
 */

import { api } from './api'

export interface FinancialReport {
  report_type: string
  period: {
    month: number
    year: number
    start_date: string
    end_date: string
  }
  summary: {
    transaction_count: number
    total_revenue: number
    average_transaction: number
  }
  generated_at: string
}

export interface GDPRExport {
  user: {
    id: string
    phone_number: string
    name?: string
    email?: string
    created_at: string
    tenant_id: string
  }
  wallet?: {
    id: string
    balance: number
    currency: string
  }
  transactions: Array<{
    id: string
    amount: number
    type: string
    status: string
    created_at: string
  }>
  plans: Array<{
    id: string
    plan_id: string
    is_active: boolean
    data_quota_bytes?: number
    time_quota_seconds?: number
    created_at: string
    expires_at?: string
  }>
  sessions: Array<{
    id: string
    start_time?: string
    stop_time?: string
    session_time?: number
    input_octets?: number
    output_octets?: number
  }>
  audit_logs: Array<{
    timestamp: string
    action: string
    entity_type: string
  }>
  exported_at: string
}

// Helper to download blob as file
export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Export compliance API functions
export const complianceApi = {
  async exportAuditLogs(params: {
    start_date: string
    end_date: string
    format: 'csv' | 'json'
    action?: string
    entity_type?: string
    user_id?: string
  }): Promise<Blob> {
    const { data } = await (api as any).client.post(
      '/compliance/audit-export',
      params,
      { responseType: 'blob' }
    )
    return data
  },

  async exportGDPRData(user_id: string): Promise<GDPRExport> {
    const { data } = await (api as any).client.get('/compliance/gdpr-export', {
      params: { user_id },
    })
    return data
  },

  async getFinancialReport(params: {
    month: number
    year: number
    tenant_id?: string
  }): Promise<FinancialReport> {
    const { data } = await (api as any).client.get(
      '/compliance/financial-report',
      { params }
    )
    return data
  },
}


