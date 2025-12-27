import axios, { AxiosInstance, AxiosError } from 'axios'
import type { User, Plan, Subscription, Payment, Device, Session, Customer, NetworkMetrics, Tenant } from '@/types'
import { mockApiResponses, mockUser, mockSubscription } from './mockData'
import { getApiUrl } from './env'

const API_BASE_URL = getApiUrl() // Validated environment variable
const USE_MOCK_DATA = false // Forced disabled for production integration

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true,  // Enable sending cookies
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Cookie expired, invalid, or forbidden (expired token) -> redirect to login
          localStorage.removeItem('access_token') // Clear fallback token too
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )

    // Request interceptor for Token Fallback
    this.client.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('access_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => Promise.reject(error)
    )
  }

  // Auth endpoints
  async loginWithPhone(phone: string): Promise<{ success: boolean; messageId?: string }> {
    if (USE_MOCK_DATA) {
      await delay(500)
      return { success: true, messageId: 'mock-msg-123' }
    }
    const { data } = await this.client.post('/auth/phone', { phone })
    return data
  }

  async verifyOTP(phone: string, otp: string): Promise<{ user: User; message: string; access_token?: string }> {
    if (USE_MOCK_DATA) {
      await delay(800)
      // Determine role based on phone number for testing
      let role: 'customer' | 'admin' | 'reseller' = 'customer'
      if (phone.includes('admin') || phone.includes('999')) {
        role = 'admin'
      } else if (phone.includes('reseller') || phone.includes('888')) {
        role = 'reseller'
      }
      const user = { ...mockUser, phone, role }
      return { user, message: 'Login successful', access_token: 'mock-token' }
    }
    const { data } = await this.client.post('/auth/verify', { phone, otp })
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
    }
    return data
  }

  async loginWithPassword(phone: string, password: string): Promise<{ user: User; message: string; access_token?: string }> {
    const { data } = await this.client.post('/auth/login', { phone, password })
    if (data.access_token) {
        localStorage.setItem('access_token', data.access_token)
    }
    return data
  }

  async signup(name: string, email: string | undefined, phone: string, password: string): Promise<{ user: User; message: string }> {
    const { data } = await this.client.post('/auth/signup', { name, email, phone, password })
    // Signup usually doesn't return token immediately in this flow (requires login), 
    // but if it did we would store it here.
    return data
  }

  async logout(): Promise<{ message: string }> {
    localStorage.removeItem('access_token')
    const { data } = await this.client.post('/auth/logout')
    return data
  }

  async loginWithVoucher(voucherCode: string): Promise<{ token: string; user: User }> {
    if (USE_MOCK_DATA) {
      await delay(600)
      if (voucherCode.toLowerCase().includes('invalid')) {
        throw new Error('Invalid voucher code')
      }
      const user = { ...mockUser }
      return { token: 'mock-jwt-token-' + Date.now(), user }
    }
    const { data } = await this.client.post('/auth/voucher', { voucherCode })
    return data
  }

  async redeemVoucher(code: string): Promise<any> {
    if (USE_MOCK_DATA) {
        await delay(500)
        return { success: true }
    }
    const { data } = await this.client.post('/vouchers/redeem', { code })
    return data
  }

  // Payment endpoints
  async initiateMpesaPayment(amount: number, phone: string): Promise<{ checkoutRequestId: string }> {
    if (USE_MOCK_DATA) {
      await delay(1000)
      return { checkoutRequestId: 'mock-checkout-' + Date.now() }
    }
    const { data } = await this.client.post('/payments/mpesa/stk-push', { amount, phone })
    return data
  }

  async initiateMTNPayment(amount: number, phone: string): Promise<{ checkoutRequestId: string }> {
    if (USE_MOCK_DATA) {
      await delay(1000)
      return { checkoutRequestId: 'mtn-checkout-' + Date.now() }
    }
    const { data } = await this.client.post('/payments/mtn/mobile-money', { amount, phone })
    return data
  }

  async initiateAirtelPayment(amount: number, phone: string): Promise<{ checkoutRequestId: string }> {
    if (USE_MOCK_DATA) {
      await delay(1000)
      return { checkoutRequestId: 'airtel-checkout-' + Date.now() }
    }
    const { data } = await this.client.post('/payments/airtel/money', { amount, phone })
    return data
  }

  async checkPaymentStatus(checkoutRequestId: string): Promise<Payment> {
    if (USE_MOCK_DATA) {
      await delay(500)
      // Simulate payment completion after a delay
      return {
        id: 'pay-mock',
        userId: 'user-1',
        amount: 200,
        currency: 'KES',
        method: 'mpesa',
        status: 'completed',
        transactionId: checkoutRequestId,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      }
    }
    const { data } = await this.client.get(`/payments/status/${checkoutRequestId}`)
    return data
  }

  // Plan endpoints
  async getPlans(): Promise<Plan[]> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.plans()
    }
    const { data } = await this.client.get('/plans/')
    
    // Transform backend format to frontend format
    return data.map((plan: any) => ({
      ...plan,
      // Convert kbps to Mbps and map field names
      downloadSpeed: plan.download_speed_kbps ? plan.download_speed_kbps / 1000 : undefined,
      uploadSpeed: plan.upload_speed_kbps ? plan.upload_speed_kbps / 1000 : undefined,
      // Map limit_time_seconds to duration
      duration: plan.limit_time_seconds,
      // Map limit_data_bytes to dataLimit
      dataLimit: plan.limit_data_bytes,
      // Set defaults for required fields
      description: plan.description || '',
      currency: plan.currency || 'KES',
      isActive: true,
      features: plan.features || [],
    }))
  }

  async subscribeToPlan(planId: string): Promise<Subscription> {
    if (USE_MOCK_DATA) {
      await delay(800)
      const plans = await mockApiResponses.plans()
      const plan = plans.find((p) => p.id === planId) || mockSubscription.plan
      return {
        ...mockSubscription,
        planId,
        plan,
      }
    }
    // Updated to match backend implementation
    const { data } = await this.client.post(`/plans/buy/${planId}`)
    return data
  }

  async buyPlan(planId: string): Promise<any> {
    if (USE_MOCK_DATA) {
        await delay(500)
        return { success: true }
    }
    const { data } = await this.client.post(`/plans/buy/${planId}`)
    return data
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    if (USE_MOCK_DATA) {
      await delay(200)
      return mockUser
    }
    const { data } = await this.client.get('/users/me')
    return data
  }

  async getWalletBalance(): Promise<{ balance: number; currency: string }> {
    if (USE_MOCK_DATA) {
      return { balance: 1250, currency: 'KES' }
    }
    const { data } = await this.client.get('/users/me/wallet')
    return data
  }

  async getUsageStats(): Promise<{ upload_bytes: number; download_bytes: number; total_bytes: number }> {
    if (USE_MOCK_DATA) {
      return { upload_bytes: 1024 * 1024 * 100, download_bytes: 1024 * 1024 * 500, total_bytes: 1024 * 1024 * 600 }
    }
    const { data } = await this.client.get('/users/me/usage')
    return data
  }

  async getUsageHistory(days = 7): Promise<{ date: string; total_bytes: number }[]> {
    if (USE_MOCK_DATA) {
        return Array.from({ length: days }).map((_, i) => ({
          date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
          total_bytes: Math.floor(Math.random() * 1024 * 1024 * 500),
        }))
    }
    const { data } = await this.client.get('/users/me/analytics/usage/history', { params: { days } })
    return data
  }
  
  async getSubscription(): Promise<Subscription | null> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.subscription()
    }
    const { data } = await this.client.get('/users/me/subscription')
    return data
  }

  async getDevices(): Promise<Device[]> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.devices()
    }
    const { data } = await this.client.get('/users/me/devices')
    return data
  }

  async getPayments(params?: { admin?: boolean; page?: number; limit?: number; status?: string; search?: string }): Promise<Payment[]> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.payments()
    }
    if (params?.admin) {
        // Remove 'admin' from params before sending to backend
        const { admin, ...queryParams } = params
        const { data } = await this.client.get('/admin/payments', { params: queryParams })
        return data
    }
    const { data } = await this.client.get('/users/me/payments')
    return data
  }

  async getSessions(): Promise<Session[]> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.sessions()
    }
    const { data } = await this.client.get('/users/me/sessions')
    return data
  }

  // Admin endpoints
  async getNetworkMetrics(): Promise<NetworkMetrics> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.networkMetrics()
    }
    const { data } = await this.client.get('/admin/metrics')
    return data
  }

  async getRevenueReport(days = 30): Promise<{ date: string; revenue: number }[]> {
    if (USE_MOCK_DATA) {
      return Array.from({ length: days }).map((_, i) => ({
        date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 5000) + 1000,
      }))
    }
    const { data } = await this.client.get('/admin/reports/revenue', { params: { days } })
    return data
  }

  async getUsageReport(days = 30): Promise<{ date: string; bytes_total: number }[]> {
    if (USE_MOCK_DATA) {
        return Array.from({ length: days }).map((_, i) => ({
          date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
          bytes_total: Math.floor(Math.random() * 1024 * 1024 * 1024 * 50),
        }))
    }
    const { data } = await this.client.get('/admin/reports/usage', { params: { days } })
    return data
  }

  async getCustomers(params?: { status?: string; search?: string }): Promise<Customer[]> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.customers(params)
    }
    const { data } = await this.client.get('/admin/customers', { params })
    return data
  }

  async getCustomer(customerId: string): Promise<Customer> {
    if (USE_MOCK_DATA) {
      await delay(300)
      const customers = await mockApiResponses.customers()
      const customer = customers.find((c) => c.id === customerId)
      if (!customer) throw new Error('Customer not found')
      return customer
    }
    const { data } = await this.client.get(`/admin/customers/${customerId}`)
    return data
  }

  async createPlan(plan: Partial<Plan>): Promise<Plan> {
    // Transform frontend format (Mbps, Plan interface) to backend format (kbps, DB schema)
    const backendPlan = {
      name: plan.name,
      description: plan.description,
      type: plan.type,
      price: plan.price,
      // Convert Mbps to kbps for storage
      download_speed_kbps: plan.downloadSpeed ? Math.round(plan.downloadSpeed * 1000) : null,
      upload_speed_kbps: plan.uploadSpeed ? Math.round(plan.uploadSpeed * 1000) : null,
      // Map field names to backend schema
      limit_time_seconds: plan.duration || null,
      limit_data_bytes: plan.dataLimit || null,
      validity_seconds: null, // Not currently used in UI
    }
    
    const { data } = await this.client.post('/admin/plans', backendPlan)
    
    // Transform response back to frontend format
    return {
      ...data,
      downloadSpeed: data.download_speed_kbps ? data.download_speed_kbps / 1000 : undefined,
      uploadSpeed: data.upload_speed_kbps ? data.upload_speed_kbps / 1000 : undefined,
      duration: data.limit_time_seconds,
      dataLimit: data.limit_data_bytes,
      description: data.description || '',
      currency: data.currency || 'KES',
      isActive: true,
      features: [],
    }
  }

  async updatePlan(planId: string, plan: Partial<Plan>): Promise<Plan> {
    // Transform frontend format to backend format (same as createPlan)
    const backendPlan = {
      name: plan.name,
      description: plan.description,
      type: plan.type,
      price: plan.price,
      download_speed_kbps: plan.downloadSpeed ? Math.round(plan.downloadSpeed * 1000) : null,
      upload_speed_kbps: plan.uploadSpeed ? Math.round(plan.uploadSpeed * 1000) : null,
      limit_time_seconds: plan.duration || null,
      limit_data_bytes: plan.dataLimit || null,
      validity_seconds: null,
    }
    
    const { data } = await this.client.put(`/admin/plans/${planId}`, backendPlan)
    
    // Transform response back
    return {
      ...data,
      downloadSpeed: data.download_speed_kbps ? data.download_speed_kbps / 1000 : undefined,
      uploadSpeed: data.upload_speed_kbps ? data.upload_speed_kbps / 1000 : undefined,
      duration: data.limit_time_seconds,
      dataLimit: data.limit_data_bytes,
      description: data.description || '',
      currency: data.currency || 'KES',
      isActive: true,
      features: [],
    }
  }

  async getLiveSessions(): Promise<Session[]> {
    const { data } = await this.client.get('/admin/sessions/live')
    return data
  }

  // Tenant endpoints
  async getTenant(tenantId?: string): Promise<Tenant> {
    if (USE_MOCK_DATA) {
      return mockApiResponses.tenant()
    }
    // If no ID passed, try to get current tenant from hostname or context
    // For admin/reseller, they might fetch specific tenants
    const url = tenantId ? `/tenants/${tenantId}` : '/tenants/' 
    // Note: backend 'read_tenant' endpoint is /tenants/{id}. 
    // We might need a way to get "current" tenant. 
    // For now, let's assume we are acting as admin listing tenants.
    
    // Actually, this method in ApiClient is likely for the End User getting THEIR tenant info.
    const { data } = await this.client.get(url)
    return this.mapTenantResponse(data)
  }

  async getTenants(skip = 0, limit = 100): Promise<Tenant[]> {
    const { data } = await this.client.get('/tenants/', { params: { skip, limit } })
    return data.map(this.mapTenantResponse)
  }

  async createTenant(tenant: Partial<Tenant>): Promise<Tenant> {
    const payload = {
      name: tenant.name,
      slug: tenant.domain?.split('.')[0] || tenant.name?.toLowerCase().replace(/\s+/g, '-'),
      branding: {
        logo: tenant.logo,
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
      },
      currency: tenant.currency,
      timezone: 'Africa/Nairobi', // Default for now
    }
    const { data } = await this.client.post('/tenants', payload)
    return this.mapTenantResponse(data)
  }

  async updateTenant(tenantId: string, tenant: Partial<Tenant>): Promise<Tenant> {
    const payload: any = {}
    if (tenant.name) payload.name = tenant.name
    if (tenant.primaryColor || tenant.secondaryColor || tenant.logo) {
      payload.branding = {
        primaryColor: tenant.primaryColor,
        secondaryColor: tenant.secondaryColor,
        logo: tenant.logo,
      }
    }
    if (tenant.currency) payload.currency = tenant.currency
    
    const { data } = await this.client.put(`/tenants/${tenantId}`, payload)
    return this.mapTenantResponse(data)
  }

  async deleteTenant(tenantId: string): Promise<void> {
    await this.client.delete(`/tenants/${tenantId}`)
  }

  async deletePlan(planId: string): Promise<void> {
    await this.client.delete(`/admin/plans/${planId}`)
  }

  async disconnectSession(sessionId: string): Promise<void> {
    await this.client.post(`/admin/sessions/${sessionId}/disconnect`)
  }

  // Tenant endpoints

  // Helper to map backend format to frontend interface
  private mapTenantResponse(data: any): Tenant {
    return {
      id: data.id,
      name: data.name,
      domain: data.slug + '.local', // Mock domain from slug
      logo: data.branding?.logo,
      primaryColor: data.branding?.primaryColor || '#2563eb',
      secondaryColor: data.branding?.secondaryColor || '#1d4ed8',
      locale: 'en', // Default
      currency: data.currency,
      isActive: true, // Backend doesn't have this yet
    }
  }

  // Password Reset endpoints
  async requestPasswordReset(phone: string): Promise<{ success: boolean; messageId?: string }> {
    const { data } = await this.client.post('/auth/password-reset/request', { phone })
    return data
  }

  async resetPassword(phone: string, otp: string, newPassword: string): Promise<{ success: boolean }> {
    const { data } = await this.client.post('/auth/password-reset/confirm', { phone, otp, newPassword })
    return data
  }

  // Account Management endpoints
  async deleteAccount(password: string): Promise<{ success: boolean }> {
    const { data } = await this.client.post('/users/me/delete', { password })
    return data
  }

  // Data Export endpoints (GDPR)
  async requestDataExport(format: 'json' | 'csv' = 'json'): Promise<{ exportId: string }> {
    const { data } = await this.client.post('/users/me/export', { format })
    return data
  }

  async checkExportStatus(exportId: string): Promise<{ status: string; downloadUrl?: string }> {
    const { data } = await this.client.get(`/users/me/export/${exportId}/status`)
    return data
  }

  async downloadDataExport(exportId: string): Promise<Blob> {
    const { data } = await this.client.get(`/users/me/export/${exportId}/download`, {
      responseType: 'blob',
    })
    return data
  }

  // Invoice endpoints
  async getInvoice(paymentId: string): Promise<any> {
    const { data } = await this.client.get(`/invoices/${paymentId}`)
    return data
  }

  async generateInvoicePDF(paymentId: string): Promise<Blob> {
    const { data } = await this.client.get(`/invoices/${paymentId}/pdf`, {
      responseType: 'blob',
    })
    return data
  }

  // Refund endpoints
  async requestRefund(paymentId: string, reason: string, details: string): Promise<any> {
    const { data } = await this.client.post('/refunds/request', { paymentId, reason, details })
    return data
  }

  async getRefundRequests(): Promise<any[]> {
    const { data } = await this.client.get('/refunds/my-requests')
    return data
  }

  async getAdminRefundRequests(): Promise<any[]> {
    const { data } = await this.client.get('/admin/refunds')
    return data
  }

  async updateRefundStatus(requestId: string, status: string, notes: string): Promise<any> {
    const { data} = await this.client.put(`/admin/refunds/${requestId}`, { status, notes })
    return data
  }

  // New Analytics Endpoints
  async getChurnAnalysis(months = 6): Promise<any> {
    const { data } = await this.client.get('/admin/analytics/churn', { params: { months } })
    return data
  }

  async getUsageHeatmap(days = 7): Promise<any> {
    const { data } = await this.client.get('/admin/analytics/usage-heatmap', { params: { days } })
    return data
  }

  async getRevenueBreakdown(days = 30): Promise<any> {
    const { data } = await this.client.get('/admin/analytics/revenue-breakdown', { params: { days } })
    return data
  }

  // Device & Security Endpoints
  async getUserDevices(): Promise<Device[]> {
    const { data } = await this.client.get('/devices')
    return data
  }

  async getLoginAlerts(days = 7): Promise<any[]> {
    const {data } = await this.client.get('/login-alerts', { params: { days } })
    return data
  }

  async revokeSession(sessionId: string): Promise<any> {
    const { data } = await this.client.post(`/sessions/${sessionId}/revoke`)
    return data
  }

  // Reseller Endpoints
  async createSubAccount(accountData: any): Promise<any> {
    const { data } = await this.client.post('/reseller/sub-accounts', accountData)
    return data
  }

  async getRevenueSplit(days = 30): Promise<any> {
    const { data } = await this.client.get('/reseller/revenue-split', { params: { days } })
    return data
  }

  async uploadTenantLogo(tenantId: string, file: File): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await this.client.post(`/reseller/tenants/${tenantId}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  }

  async getTenantsForSwitcher(): Promise<any[]> {
    const { data } = await this.client.get('/reseller/tenants')
    return data
  }

  // Generic HTTP methods for new components
  async get(url: string, config?: any): Promise<any> {
    return await this.client.get(url, config)
  }

  async post(url: string, data?: any, config?: any): Promise<any> {
    return await this.client.post(url, data, config)
  }

  async put(url: string, data?: any, config?: any): Promise<any> {
    return await this.client.put(url, data, config)
  }

  async delete(url: string, config?: any): Promise<any> {
    return await this.client.delete(url, config)
  }
}

// Helper function for delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = new ApiClient()

