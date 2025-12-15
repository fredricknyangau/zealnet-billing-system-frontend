import type {
  Plan,
  Subscription,
  Device,
  Payment,
  Session,
  Customer,
  NetworkMetrics,
  Tenant,
  User,
  AIInsight,
} from '@/types'

// Mock Plans
export const mockPlans: Plan[] = [
  {
    id: 'plan-1',
    name: 'Hourly Pass',
    description: 'Perfect for quick browsing',
    type: 'time',
    price: 50,
    currency: 'KES',
    duration: 3600, // 1 hour
    speedLimit: 10,
    isActive: true,
    features: ['10 Mbps speed', '1 hour access', 'Unlimited data'],
  },
  {
    id: 'plan-2',
    name: 'Daily Pass',
    description: 'Full day access',
    type: 'hybrid',
    price: 200,
    currency: 'KES',
    duration: 86400, // 24 hours
    dataLimit: 5 * 1024 * 1024 * 1024, // 5GB
    speedLimit: 20,
    isActive: true,
    features: ['20 Mbps speed', '5GB data', '24 hour access'],
  },
  {
    id: 'plan-3',
    name: 'Weekly Pass',
    description: 'Best value for regular users',
    type: 'hybrid',
    price: 1000,
    currency: 'KES',
    duration: 604800, // 7 days
    dataLimit: 30 * 1024 * 1024 * 1024, // 30GB
    speedLimit: 50,
    isActive: true,
    features: ['50 Mbps speed', '30GB data', '7 days access'],
  },
  {
    id: 'plan-4',
    name: 'Monthly Unlimited',
    description: 'Unlimited data for heavy users',
    type: 'time',
    price: 3000,
    currency: 'KES',
    duration: 2592000, // 30 days
    speedLimit: 100,
    isActive: true,
    features: ['100 Mbps speed', 'Unlimited data', '30 days access'],
  },
]

// Mock User
export const mockUser: User = {
  id: 'user-1',
  phone: '+254712345678',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'customer',
  locale: 'en',
  createdAt: new Date().toISOString(),
}

// Mock Subscription
export const mockSubscription: Subscription = {
  id: 'sub-1',
  userId: 'user-1',
  planId: 'plan-2',
  plan: mockPlans[1],
  status: 'active',
  startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
  dataUsed: 2.5 * 1024 * 1024 * 1024, // 2.5GB
  dataLimit: 5 * 1024 * 1024 * 1024, // 5GB
  timeRemaining: 5 * 24 * 60 * 60, // 5 days in seconds
  speedTier: 20,
}

// Mock Devices
export const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'iPhone 14 Pro',
    macAddress: 'AA:BB:CC:DD:EE:01',
    ipAddress: '192.168.1.100',
    isActive: true,
    lastSeen: new Date().toISOString(),
    dataUsed: 1.2 * 1024 * 1024 * 1024, // 1.2GB
    sessionCount: 15,
  },
  {
    id: 'device-2',
    name: 'MacBook Pro',
    macAddress: 'AA:BB:CC:DD:EE:02',
    ipAddress: '192.168.1.101',
    isActive: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    dataUsed: 1.3 * 1024 * 1024 * 1024, // 1.3GB
    sessionCount: 8,
  },
]

// Mock Payments
export const mockPayments: Payment[] = [
  {
    id: 'pay-1',
    userId: 'user-1',
    amount: 200,
    currency: 'KES',
    method: 'mpesa',
    status: 'completed',
    transactionId: 'MPX123456789',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
    receiptUrl: 'https://example.com/receipts/pay-1.pdf',
  },
  {
    id: 'pay-2',
    userId: 'user-1',
    amount: 1000,
    currency: 'KES',
    method: 'mpesa',
    status: 'completed',
    transactionId: 'MPX987654321',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
    receiptUrl: 'https://example.com/receipts/pay-2.pdf',
  },
  {
    id: 'pay-3',
    userId: 'user-1',
    amount: 50,
    currency: 'KES',
    method: 'voucher',
    status: 'completed',
    transactionId: 'VOUCHER123',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    userId: 'user-1',
    deviceId: 'device-1',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    dataUsed: 500 * 1024 * 1024, // 500MB
    duration: 3600, // 1 hour
    ipAddress: '192.168.1.100',
  },
  {
    id: 'session-2',
    userId: 'user-1',
    deviceId: 'device-1',
    startTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    endTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    dataUsed: 300 * 1024 * 1024, // 300MB
    duration: 3600, // 1 hour
    ipAddress: '192.168.1.100',
  },
  {
    id: 'session-3',
    userId: 'user-1',
    deviceId: 'device-2',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(), // 23 hours ago
    dataUsed: 1.2 * 1024 * 1024 * 1024, // 1.2GB
    duration: 3600, // 1 hour
    ipAddress: '192.168.1.101',
  },
]

// Mock Customers (for admin)
export const mockCustomers: Customer[] = [
  {
    id: 'customer-1',
    phone: '+254712345678',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    subscription: mockSubscription,
    devices: mockDevices,
    totalSpent: 1250,
    lastPayment: mockPayments[0],
    churnRisk: 'low',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'customer-2',
    phone: '+254723456789',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    subscription: {
      ...mockSubscription,
      id: 'sub-2',
      userId: 'customer-2',
      status: 'active',
      timeRemaining: 2 * 24 * 60 * 60, // 2 days
      dataUsed: 4.8 * 1024 * 1024 * 1024, // 4.8GB (almost used up)
    },
    devices: [
      {
        ...mockDevices[0],
        id: 'device-3',
        name: 'Samsung Galaxy',
        macAddress: 'AA:BB:CC:DD:EE:03',
      },
    ],
    totalSpent: 500,
    lastPayment: {
      ...mockPayments[0],
      id: 'pay-4',
      userId: 'customer-2',
      amount: 200,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    churnRisk: 'medium',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'customer-3',
    phone: '+254734567890',
    name: 'Mike Johnson',
    status: 'expired',
    subscription: {
      ...mockSubscription,
      id: 'sub-3',
      userId: 'customer-3',
      status: 'expired',
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      timeRemaining: 0,
    },
    devices: [],
    totalSpent: 1000,
    lastPayment: {
      ...mockPayments[1],
      id: 'pay-5',
      userId: 'customer-3',
      createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    },
    churnRisk: 'high',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'customer-4',
    phone: '+254745678901',
    name: 'Sarah Williams',
    status: 'active',
    subscription: {
      ...mockSubscription,
      id: 'sub-4',
      userId: 'customer-4',
      planId: 'plan-4',
      plan: mockPlans[3],
      speedTier: 100,
    },
    devices: [
      {
        ...mockDevices[0],
        id: 'device-4',
        name: 'iPad Pro',
        macAddress: 'AA:BB:CC:DD:EE:04',
      },
      {
        ...mockDevices[1],
        id: 'device-5',
        name: 'Windows Laptop',
        macAddress: 'AA:BB:CC:DD:EE:05',
      },
    ],
    totalSpent: 5000,
    lastPayment: {
      ...mockPayments[1],
      id: 'pay-6',
      userId: 'customer-4',
      amount: 3000,
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    churnRisk: 'low',
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock AI Insights
export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'revenue_drop',
    title: 'Revenue Drop Detected',
    message: 'Revenue decreased by 15% compared to yesterday. Check payment gateway status.',
    severity: 'warning',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { dropPercentage: 15 },
  },
  {
    id: 'insight-2',
    type: 'churn_risk',
    title: 'High Churn Risk Customers',
    message: '3 customers show high churn risk. Consider reaching out with special offers.',
    severity: 'info',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    metadata: { customerCount: 3 },
  },
  {
    id: 'insight-3',
    type: 'recommendation',
    title: 'Peak Usage Recommendation',
    message: 'Network usage peaks at 6-9 PM. Consider surge pricing during these hours.',
    severity: 'info',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Mock Network Metrics
export const mockNetworkMetrics: NetworkMetrics = {
  activeUsers: 42,
  revenueToday: 12500,
  paymentSuccessRate: 94.5,
  networkHealth: 'healthy',
  alerts: mockAIInsights,
}

// Mock Tenant
export const mockTenant: Tenant = {
  id: 'tenant-1',
  name: 'Café WiFi Network',
  domain: 'cafe-wifi.local',
  logo: '/logo.png',
  primaryColor: '#2563eb',
  secondaryColor: '#1e40af',
  locale: 'en',
  currency: 'KES',
  isActive: true,
}

// Helper function to simulate API delay
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API responses with delays
export const mockApiResponses = {
  plans: async (): Promise<Plan[]> => {
    await delay(300)
    return mockPlans
  },
  subscription: async (): Promise<Subscription | null> => {
    await delay(200)
    return mockSubscription
  },
  devices: async (): Promise<Device[]> => {
    await delay(250)
    return mockDevices
  },
  payments: async (): Promise<Payment[]> => {
    await delay(300)
    return mockPayments
  },
  sessions: async (): Promise<Session[]> => {
    await delay(250)
    return mockSessions
  },
  customers: async (params?: { status?: string; search?: string }): Promise<Customer[]> => {
    await delay(400)
    let customers = [...mockCustomers]

    if (params?.status && params.status !== 'all') {
      customers = customers.filter((c) => c.status === params.status)
    }

    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      customers = customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchLower) ||
          c.phone.includes(searchLower) ||
          c.email?.toLowerCase().includes(searchLower)
      )
    }

    return customers
  },
  networkMetrics: async (): Promise<NetworkMetrics> => {
    await delay(350)
    return mockNetworkMetrics
  },
  tenant: async (): Promise<Tenant> => {
    await delay(200)
    return mockTenant
  },
}

