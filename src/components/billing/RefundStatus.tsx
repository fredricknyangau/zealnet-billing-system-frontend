import React from 'react'
import { Check, Clock, X, AlertCircle } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'

interface RefundStatusProps {
  refund: {
    id: string
    paymentId: string
    amount: number
    currency: string
    reason: string
    status: 'pending' | 'approved' | 'rejected' | 'processing'
    createdAt: string
    updatedAt?: string
    adminNotes?: string
    expectedCompletionDate?: string
  }
}

export const RefundStatus: React.FC<RefundStatusProps> = ({ refund }) => {
  const getStatusConfig = () => {
    switch (refund.status) {
      case 'approved':
        return {
          icon: Check,
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Approved',
        }
      case 'rejected':
        return {
          icon: X,
          color: 'text-danger',
          bgColor: 'bg-danger/10',
          label: 'Rejected',
        }
      case 'processing':
        return {
          icon: AlertCircle,
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          label: 'Processing',
        }
      default:
        return {
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Pending',
        }
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Refund Request</p>
          <p className="font-mono text-sm">#{refund.id}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig.bgColor}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
          <span className={`text-sm font-medium ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4">
        <p className="text-2xl font-bold">
          {refund.currency} {refund.amount.toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground capitalize">
          Reason: {refund.reason.replace(/_/g, ' ')}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="flex-1">
            <p className="text-sm font-medium">Request Submitted</p>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(refund.createdAt)}
            </p>
          </div>
        </div>

        {refund.updatedAt && refund.updatedAt !== refund.createdAt && (
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${
              refund.status === 'approved' ? 'bg-success' :
              refund.status === 'rejected' ? 'bg-danger' :
              'bg-accent'
            }`} />
            <div className="flex-1">
              <p className="text-sm font-medium">Status Updated</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(refund.updatedAt)}
              </p>
            </div>
          </div>
        )}

        {refund.status === 'approved' && refund.expectedCompletionDate && (
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-muted" />
            <div className="flex-1">
              <p className="text-sm font-medium">Expected Completion</p>
              <p className="text-xs text-muted-foreground">
                {new Date(refund.expectedCompletionDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Admin Notes */}
      {refund.adminNotes && (
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-sm font-medium mb-1">Admin Notes</p>
          <p className="text-sm text-muted-foreground">{refund.adminNotes}</p>
        </div>
      )}

      {/* Status Message */}
      {refund.status === 'pending' && (
        <p className="text-xs text-muted-foreground mt-4">
          Your refund request is being reviewed. You will be notified once a decision is made.
        </p>
      )}
      {refund.status === 'approved' && (
        <p className="text-xs text-success mt-4">
          Your refund has been approved and will be processed within 5-7 business days.
        </p>
      )}
      {refund.status === 'rejected' && (
        <p className="text-xs text-danger mt-4">
          Your refund request has been rejected. Please contact support for more information.
        </p>
      )}
    </div>
  )
}
