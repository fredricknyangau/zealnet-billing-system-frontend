export type UserRole = 'customer' | 'admin' | 'reseller'

export interface User {
  id: string
  email?: string
  phone: string
  name?: string
  role: UserRole
  tenantId?: string
  locale: string
  balance: number
  createdAt: string
}

export interface Plan {
  id: string
  name: string
  description: string
  type: 'time' | 'data' | 'hybrid'
  price: number
  currency: string
  duration?: number // in seconds
  dataLimit?: number // in bytes
  uploadSpeed?: number // in Mbps (from upload_speed_kbps)
  downloadSpeed?: number // in Mbps (from download_speed_kbps)
  speedLimit?: number // in Mbps (deprecated, use uploadSpeed/downloadSpeed)
  isActive: boolean
  features: string[]
  testimonials?: Array<{
    author: string
    rating: number
    comment: string
  }>
}


export interface Subscription {
  id: string
  userId: string
  planId: string
  plan: Plan
  status: 'active' | 'expired' | 'paused' | 'cancelled'
  startDate: string
  endDate: string
  dataUsed: number
  dataLimit?: number
  timeRemaining: number
  speedTier: number
}

export interface Device {
  id: string
  name: string
  macAddress: string
  ipAddress?: string
  isActive: boolean
  lastSeen: string
  dataUsed: number
  sessionCount: number
}

export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  method: 'mpesa' | 'mtn' | 'airtel' | 'voucher'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  createdAt: string
  completedAt?: string
  receiptUrl?: string
  customerName?: string
  phone?: string
}

export interface Session {
  id: string
  userId: string
  deviceId: string
  startTime: string
  endTime?: string
  dataUsed: number
  duration: number
  ipAddress: string
  username?: string
  macAddress?: string
  upload?: number
  download?: number
}

export interface Tenant {
  id: string
  name: string
  domain?: string
  logo?: string
  primaryColor: string
  secondaryColor: string
  locale: string
  currency: string
  isActive: boolean
}

export interface AIInsight {
  id: string
  type: 'revenue_drop' | 'churn_risk' | 'fraud_warning' | 'recommendation'
  title: string
  message: string
  severity: 'info' | 'warning' | 'critical'
  createdAt: string
  metadata?: Record<string, any>
}

export interface NetworkMetrics {
  activeUsers: number
  revenueToday: number
  paymentSuccessRate: number
  networkHealth: 'healthy' | 'degraded' | 'down'
  alerts: AIInsight[]
}

export interface Customer {
  id: string
  phone: string
  name?: string
  email?: string
  status: 'active' | 'expired' | 'suspended'
  subscription?: Subscription
  devices: Device[]
  totalSpent: number
  lastPayment?: Payment
  churnRisk?: 'low' | 'medium' | 'high'
  createdAt: string
}

