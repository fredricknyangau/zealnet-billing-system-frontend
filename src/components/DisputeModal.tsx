import React, { useState } from 'react'
import { AlertCircle, FileText } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'

import toast from 'react-hot-toast'

interface DisputeModalProps {
  isOpen: boolean
  onClose: () => void
  paymentId?: string
  transactionId?: string
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // In real app, this would call the API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success('Dispute submitted successfully. We will review it within 24 hours.')
    setReason('')
    setDescription('')
    setSubmitting(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Dispute" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Dispute Process
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Disputes are reviewed within 24 hours. You will receive a notification once your
                dispute has been resolved.
              </p>
            </div>
          </div>
        </div>

        {transactionId && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Transaction ID</p>
            <p className="text-sm font-mono text-foreground">{transactionId}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Reason for Dispute
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground"
            required
          >
            <option value="">Select a reason</option>
            <option value="unauthorized">Unauthorized transaction</option>
            <option value="duplicate">Duplicate charge</option>
            <option value="service_not_received">Service not received</option>
            <option value="incorrect_amount">Incorrect amount charged</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border-2 border-border bg-background text-foreground resize-none"
            placeholder="Please provide details about your dispute..."
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" fullWidth isLoading={submitting} icon={<FileText className="h-4 w-4" />}>
            Submit Dispute
          </Button>
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}

