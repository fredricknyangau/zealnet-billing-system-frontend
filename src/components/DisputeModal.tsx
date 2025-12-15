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
        <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning-900 dark:text-warning-200">
                Dispute Process
              </p>
              <p className="text-xs text-warning-700 dark:text-warning-300 mt-1">
                Disputes are reviewed within 24 hours. You will receive a notification once your
                dispute has been resolved.
              </p>
            </div>
          </div>
        </div>

        {transactionId && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
            <p className="text-sm font-mono text-gray-900 dark:text-white">{transactionId}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason for Dispute
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
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

