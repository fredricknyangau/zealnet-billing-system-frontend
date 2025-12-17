import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { sanitizeText } from '@/lib/sanitize'

interface RefundRequestModalProps {
  isOpen: boolean
  onClose: () => void
  payment: {
    id: string
    amount: number
    currency: string
    planName?: string
    date: string
  }
}

const REFUND_REASONS = [
  { value: 'service_issue', label: 'Service not working properly' },
  { value: 'accidental_purchase', label: 'Accidental purchase' },
  { value: 'duplicate_payment', label: 'Duplicate payment' },
  { value: 'unsatisfied', label: 'Not satisfied with service' },
  { value: 'other', label: 'Other reason' },
]

export const RefundRequestModal: React.FC<RefundRequestModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
  const [formData, setFormData] = useState({
    reason: '',
    details: '',
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.reason) {
      toast.error('Please select a reason for refund')
      return
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the refund terms')
      return
    }

    const sanitizedDetails = sanitizeText(formData.details)

    setIsSubmitting(true)

    try {
      await api.requestRefund(payment.id, formData.reason, sanitizedDetails)
      toast.success('Refund request submitted successfully')
      handleClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit refund request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ reason: '', details: '' })
    setAgreedToTerms(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request Refund">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Payment Details */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Payment Details</p>
          <div className="space-y-1">
            <p className="font-medium">{payment.planName || 'WiFi Service'}</p>
            <p className="text-sm">
              {payment.currency} {payment.amount.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(payment.date).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Reason Selection */}
        <div>
          <label htmlFor="reason" className="block text-sm font-medium mb-2">
            Reason for Refund *
          </label>
          <select
            id="reason"
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            required
          >
            <option value="">Select a reason...</option>
            {REFUND_REASONS.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>

        {/* Additional Details */}
        <div>
          <label htmlFor="details" className="block text-sm font-medium mb-2">
            Additional Details
          </label>
          <textarea
            id="details"
            value={formData.details}
            onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
            placeholder="Please provide any additional information about your refund request..."
            rows={4}
            className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Optional: Provide more details to help us process your request faster
          </p>
        </div>

        {/* Refund Policy */}
        <div className="bg-muted/30 border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground">
            <strong>Refund Policy:</strong> Refunds are processed within 5-7 business days.
            The amount will be credited back to your original payment method. Service access
            will be revoked upon refund approval.
          </p>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm cursor-pointer">
            I understand that my service access will be revoked if the refund is approved,
            and I agree to the refund terms and conditions.
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
            disabled={!formData.reason || !agreedToTerms}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  )
}
