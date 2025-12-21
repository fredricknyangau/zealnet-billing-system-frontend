import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Wifi, Activity, Server, Users, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

import { formatBytes, formatDuration, maskMacAddress } from '@/lib/utils'
import toast from 'react-hot-toast'

import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { SkeletonText } from '@/components/ui/Skeleton'
import { UsageHeatmap } from '@/components/admin/UsageHeatmap'

// Mock AP health data (Backend integration pending for AP management)
const mockAPHealth = [
  { id: 'ap-1', name: 'AP-01 Main Hall', status: 'healthy', connectedUsers: 15, load: 65 },
  { id: 'ap-2', name: 'AP-02 Office', status: 'healthy', connectedUsers: 8, load: 40 },
  { id: 'ap-3', name: 'AP-03 Outdoor', status: 'degraded', connectedUsers: 5, load: 85 },
  { id: 'ap-4', name: 'AP-04 Basement', status: 'down', connectedUsers: 0, load: 0 },
]

export const AdminNetwork: React.FC = () => {
  const { t } = useTranslation()
  const [refreshing, setRefreshing] = useState(false)

  const { data: liveSessions = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-live-sessions'],
    queryFn: () => api.getLiveSessions(),
  })

  const handleRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
    toast.success('Network data refreshed')
  }

  const disconnectSessionMutation = useMutation({
    mutationFn: (sessionId: string) => api.disconnectSession(sessionId),
    onSuccess: () => {
        refetch()
        toast.success('Session disconnected successfully')
    },
    onError: () => {
        toast.error('Failed to disconnect session')
    }
  })

  const handleDisconnect = (sessionId: string) => {
    if (confirm('Are you sure you want to disconnect this session?')) {
      disconnectSessionMutation.mutate(sessionId)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.network')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor live sessions and network health
          </p>
        </div>
        <Button
          variant="outline"
          icon={<RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          Refresh
        </Button>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {liveSessions.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Bandwidth</p>
              <Wifi className="h-5 w-5 text-success" />
            </div>
            <p className="text-3xl font-bold text-foreground">2.1 Gbps</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Access Points</p>
              <Server className="h-5 w-5 text-warning" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {mockAPHealth.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Healthy APs</p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">
              {mockAPHealth.filter((ap) => ap.status === 'healthy').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Access Point Health */}
      <Card>
        <CardHeader>
          <CardTitle>Access Point Health</CardTitle>
          <CardDescription>Monitor access point status and load</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAPHealth.map((ap) => (
              <div
                key={ap.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      ap.status === 'healthy'
                        ? 'bg-success'
                        : ap.status === 'degraded'
                        ? 'bg-warning'
                        : 'bg-destructive'
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground">{ap.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {ap.connectedUsers} users • {ap.load}% load
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    ap.status === 'healthy'
                      ? 'success'
                      : ap.status === 'degraded'
                      ? 'warning'
                      : 'danger'
                  }
                  size="sm"
                >
                  {ap.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Heatmap */}
      <UsageHeatmap />

      {/* Live Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.liveSessions')}</CardTitle>
          <CardDescription>Active user sessions on the network</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Speed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {isLoading ? (
                    <tr>
                        <td colSpan={7} className="p-4">
                            <SkeletonText lines={3} />
                        </td>
                    </tr>
                ) : liveSessions.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            No active sessions
                        </td>
                    </tr>
                ) : (
                liveSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-foreground">
                        {session.username || 'Unknown'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Using IP as device identifier proxy since device info is minimal from pure radius session */}
                      <p className="text-sm text-foreground">{session.ipAddress}</p>
                      <p className="text-xs text-muted-foreground">
                        {maskMacAddress(session.macAddress || '00:00:00:00:00:00')}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                      {session.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {formatDuration((Date.now() - new Date(session.startTime).getTime()) / 1000)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {formatBytes((session.upload || 0) + (session.download || 0))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info" size="sm">
                        Active
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDisconnect(session.id)}
                      >
                        Disconnect
                      </Button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

