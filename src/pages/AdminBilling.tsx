import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

import { formatCurrency, maskPhoneNumber } from '@/lib/utils'
import toast from 'react-hot-toast'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { SkeletonText } from '@/components/ui/Skeleton'

export const AdminBilling: React.FC = () => {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('today')

  const { data: payments = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-payments', statusFilter, search],
    queryFn: () => api.getPayments({
        admin: true,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined
    }),
    // Debounce search ideally, but for now relies on search state
    // keepPreviousData: true
  })

  // We rely on backend filtering now, but can still filter for some client-side things if needed.
  // Ideally backend handles filtering.
  const filteredPayments = payments

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const handleRetryPayment = (paymentId: string) => {
    toast.success(`Retrying payment ${paymentId}`)
    // In real app, this would call API
  }

  const handleRefund = (paymentId: string) => {
    if (confirm('Are you sure you want to issue a refund?')) {
      toast.success(`Refund issued for payment ${paymentId}`)
      // In real app, this would call API
    }
  }

  const handleExport = () => {
    toast.success('Exporting payment data...')
    // In real app, this would generate and download CSV/PDF
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('admin.billing')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage payments, refunds, and reconciliation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download className="h-4 w-4" />} onClick={handleExport}>
            Export
          </Button>
          <Button variant="outline" icon={<RefreshCw className="h-4 w-4" />} onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalRevenue, 'KES')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Completed</p>
            <p className="text-2xl font-bold text-success">
              {filteredPayments.filter((p) => p.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-warning">
              {filteredPayments.filter((p) => p.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Failed</p>
            <p className="text-2xl font-bold text-destructive">
              {filteredPayments.filter((p) => p.status === 'failed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search by customer, phone, or transaction ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-border bg-card text-foreground"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            {filteredPayments.length} transaction{filteredPayments.length !== 1 ? 's' : ''} found
          </CardDescription>
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
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
                            <SkeletonText lines={5} />
                        </td>
                    </tr>
                ) : filteredPayments.length === 0 ? (
                    <tr>
                         <td colSpan={7} className="p-8 text-center text-muted-foreground">
                             No payments found
                         </td>
                    </tr>
                ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {payment.customerName || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground">{payment.phone ? maskPhoneNumber(payment.phone as string) : 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {formatCurrency(payment.amount, payment.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info" size="sm">
                        {payment.method.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          payment.status === 'completed'
                            ? 'success'
                            : payment.status === 'pending'
                            ? 'warning'
                            : 'danger'
                        }
                        size="sm"
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-mono">
                      {payment.transactionId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {payment.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetryPayment(payment.id)}
                          >
                            Retry
                          </Button>
                        )}
                        {payment.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRefund(payment.id)}
                          >
                            Refund
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Download className="h-3 w-3" />}
                          onClick={() => toast.success('Downloading receipt...')}
                        >
                          Receipt
                        </Button>
                      </div>
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

