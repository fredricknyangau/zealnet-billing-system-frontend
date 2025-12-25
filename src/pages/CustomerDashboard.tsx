import { CountdownTimer } from '@/components/dashboard/CountdownTimer'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Wifi,
  Smartphone,
  CreditCard,
  TrendingUp,
  LogOut,
  Pause,
  Play,
  XCircle,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { SkeletonText } from '@/components/ui/Skeleton'
import { Modal } from '@/components/ui/Modal'
import { formatCurrency, formatBytes, formatDuration, maskMacAddress, maskPhoneNumber } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useWebSocket } from '@/hooks/useWebSocket'
import { DeviceTrustBadge } from '@/components/security/DeviceTrustBadge'
import { LoginAlertsContainer } from '@/components/security/LoginAlert'
// DisputeModal import removed

import { UsageChart } from '@/components/dashboard/UsageChart'
import { ProfileSettingsModal } from '@/components/dashboard/ProfileSettingsModal'
import { SpeedTestWidget } from '@/components/dashboard/SpeedTestWidget'
import { LiveUsageWidget } from '@/components/dashboard/LiveUsageWidget'
import { VoucherRedemption } from '@/components/dashboard/VoucherRedemption'
import { EnhancedPaymentHistory } from '@/components/dashboard/EnhancedPaymentHistory'
import { Settings, Wallet as WalletIcon } from 'lucide-react'
import toast from 'react-hot-toast'

export const CustomerDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // Use selectors to prevent infinite re-renders
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const [showBuyMoreModal, setShowBuyMoreModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const [showSettingsModal, setShowSettingsModal] = useState(false)
  // removed unused dispute state
  const { showNotification, requestPermission } = usePushNotifications()

  // Request notification permission on mount
  useEffect(() => {
    const checkAndRequest = async () => {
       // We can't easily check isSupported synchronous state here as it might update, 
       // but requestPermission inside the hook already checks it.
       // However, to be safe and avoid the error log in the console we saw:
       if ('Notification' in window && 'serviceWorker' in navigator) {
          requestPermission()
       }
    }
    checkAndRequest()
  }, [requestPermission])
  // Listen for real-time subscription updates
  useWebSocket('subscription_update', (data: { lowBalance?: boolean; expiringSoon?: boolean; timeRemaining?: string }) => {
    queryClient.invalidateQueries({ queryKey: ['subscription'] })
    if (data.lowBalance) {
      showNotification('Low Balance Warning', {
        body: 'Your WiFi balance is running low. Consider topping up.',
      })
    }
    if (data.expiringSoon) {
      showNotification('Subscription Expiring Soon', {
        body: `Your subscription expires in ${data.timeRemaining}. Renew now to stay connected.`,
      })
    }
  })

  // Queries and Mutations (unchanged)
  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.getSubscription(),
  })

  const { data: plans } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.getPlans(),
  })

  const { data: devices, isLoading: devicesLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: () => api.getDevices(),
  })

  /* payments query removed (unused) */

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: () => api.getSessions(),
  })

  const pauseSubscription = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Subscription paused')
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: () => {
      toast.error('Failed to pause subscription')
    },
  })

  const resumeSubscription = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Subscription resumed')
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: () => {
      toast.error('Failed to resume subscription')
    },
  })

  const revokeSession = useMutation({
    mutationFn: async (_id: string) => {
      // In production: await api.revokeSession(_id)
      await new Promise((resolve) => setTimeout(resolve, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Session revoked successfully')
      queryClient.invalidateQueries({ queryKey: ['sessions'] })
    },
    onError: () => {
      toast.error('Failed to revoke session')
    },
  })

  // handleDispute removed because it was unused


  const handleLogout = () => {
    logout()
    navigate('/portal')
    toast.success('Logged out successfully')
  }

  const handleBuyMore = () => {
    setShowBuyMoreModal(true)
  }

  const handleUpgrade = () => {
    setShowUpgradeModal(true)
  }

  const handlePause = () => {
    if (confirm('Are you sure you want to pause your subscription?')) {
      pauseSubscription.mutate()
    }
  }

  const handleResume = () => {
    resumeSubscription.mutate()
  }

  const handleTopUp = () => {
    navigate('/topup')
  }

  const handleSettings = () => {
    setShowSettingsModal(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Wifi className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">WiFi Dashboard</h1>
                <p className="text-xs text-muted-foreground">
                  {user?.phone ? maskPhoneNumber(user.phone) : 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="sm" className="touch-target" onClick={handleSettings} icon={<Settings className="h-4 w-4" />} />
              <Button variant="ghost" size="sm" className="touch-target" onClick={handleLogout} icon={<LogOut className="h-4 w-4" />} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Login Alerts */}
        <LoginAlertsContainer className="mb-6" />
        {/* Subscription Status */}
        <Card className="mb-6" variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('dashboard.activePlan')}</CardTitle>
                <CardDescription>
                  {subscription ? subscription.plan.name : t('dashboard.noActivePlan')}
                </CardDescription>
              </div>
              {subscription && (
                <Badge
                  variant={subscription.status === 'active' ? 'success' : 'warning'}
                  size="md"
                >
                  {subscription.status}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {subLoading ? (
              <SkeletonText lines={3} />
            ) : subscription ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('dashboard.timeRemaining')}
                    </p>
                    <CountdownTimer initialSeconds={subscription.timeRemaining || 0} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('dashboard.dataUsed')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {formatBytes(subscription.dataUsed)}
                    </p>
                    {subscription.dataLimit && (
                      <p className="text-xs text-muted-foreground">
                        of {formatBytes(subscription.dataLimit)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('portal.speed')}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {subscription.speedTier} Mbps
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {t('dashboard.balance')}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(subscription.plan.price, subscription.plan.currency)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="primary"
                    icon={<CreditCard className="h-4 w-4" />}
                    onClick={handleBuyMore}
                  >
                    {t('dashboard.buyMore')}
                  </Button>
                  <Button
                    variant="outline"
                    icon={<TrendingUp className="h-4 w-4" />}
                    onClick={handleUpgrade}
                  >
                    {t('dashboard.upgrade')}
                  </Button>
                  {subscription.status === 'active' ? (
                    <Button
                      variant="outline"
                      icon={<Pause className="h-4 w-4" />}
                      onClick={handlePause}
                      isLoading={pauseSubscription.isPending}
                    >
                      {t('dashboard.pause')}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      icon={<Play className="h-4 w-4" />}
                      onClick={handleResume}
                      isLoading={resumeSubscription.isPending}
                    >
                      {t('dashboard.resume')}
                    </Button>
                  )}

                   <Button
                    variant="outline"
                    icon={<WalletIcon className="h-4 w-4" />}
                    onClick={handleTopUp}
                  >
                    Top Up
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No active subscription
                </p>
                <Button onClick={() => navigate('/portal')}>
                  {t('portal.buyData')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analytics & Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Live Usage Widget */}
            {user?.id && (
              <LiveUsageWidget userId={user.id} />
            )}
            
            {/* Voucher Redemption */}
            <VoucherRedemption />
        </div>

        {/* Usage Chart and Speed Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <UsageChart />
            <SpeedTestWidget />
        </div>

        {/* Devices */}
        <Card className="mb-6" variant="glass">
          <CardHeader>
            <CardTitle>{t('dashboard.devices')}</CardTitle>
            <CardDescription>Your connected devices</CardDescription>
          </CardHeader>
          <CardContent>
            {devicesLoading ? (
              <SkeletonText lines={3} />
            ) : devices && devices.length > 0 ? (
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {device.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {maskMacAddress(device.macAddress)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <DeviceTrustBadge device={device} />
                      <Badge variant={device.isActive ? 'success' : 'default'} size="sm">
                        {device.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatBytes(device.dataUsed)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No devices connected
              </p>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Payment History */}
        <div className="mb-6">
          <EnhancedPaymentHistory />
        </div>

        {/* Session History */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('dashboard.sessionHistory')}</CardTitle>
            <CardDescription>Your recent sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <SkeletonText lines={5} />
            ) : sessions && sessions.length > 0 ? (
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {new Date(session.startTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {formatDuration(session.duration)} •{' '}
                        {formatBytes(session.dataUsed)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="info" size="sm">
                        {session.ipAddress}
                      </Badge>
                      {!session.endTime && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<XCircle className="h-4 w-4" />}
                          onClick={() => {
                            if (confirm('Are you sure you want to revoke this session?')) {
                              revokeSession.mutate(session.id)
                            }
                          }}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No session history
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Buy More Modal */}
      <Modal
        isOpen={showBuyMoreModal}
        onClose={() => setShowBuyMoreModal(false)}
        title="Buy More Data"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Select a plan to add more data to your account:
          </p>
          <div className="space-y-2">
            {plans?.map((plan) => (
              <button
                key={plan.id}
                onClick={() => {
                  toast.success(`Selected ${plan.name}`)
                  navigate('/portal')
                  setShowBuyMoreModal(false)
                }}
                className="w-full text-left p-4 border-2 border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(plan.price, plan.currency)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade Plan"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Upgrade to a better plan for more speed and data:
          </p>
          <div className="space-y-2">
            {plans
              ?.filter((plan) => plan.price > (subscription?.plan.price || 0))
              .map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => {
                    toast.success(`Upgrading to ${plan.name}`)
                    navigate('/portal')
                    setShowUpgradeModal(false)
                  }}
                  className="w-full text-left p-4 border-2 border-border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(plan.price, plan.currency)}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </Modal>

      {/* Dispute Modal */}

      {/* Dispute Model removed (unused) */}

      <ProfileSettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  )
}

