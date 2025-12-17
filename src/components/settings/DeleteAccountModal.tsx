import React, { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { AlertTriangle, Lock } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'warning' | 'confirm'>('warning')

  const handleClose = () => {
    setPassword('')
    setConfirmText('')
    setStep('warning')
    onClose()
  }

  const handleContinue = () => {
    setStep('confirm')
  }

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm')
      return
    }

    if (!password) {
      toast.error('Please enter your password')
      return
    }

    setIsLoading(true)

    try {
      await api.deleteAccount(password)
      toast.success('Account deleted successfully')
      logout()
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Delete Account">
      <div className="space-y-4">
        {step === 'warning' ? (
          <>
            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-danger" />
              </div>
            </div>

            {/* Warning Message */}
            <div className="space-y-3">
              <h3 className="font-semibold text-center text-lg">
                Are you sure you want to delete your account?
              </h3>
              <p className="text-muted-foreground text-center">
                This action is permanent and cannot be undone.
              </p>

              {/* Consequences List */}
              <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
                <p className="font-medium text-sm mb-2">You will lose:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-danger mt-0.5">•</span>
                    <span>All your account data and personal information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-danger mt-0.5">•</span>
                    <span>Access to all active subscriptions and plans</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-danger mt-0.5">•</span>
                    <span>Payment history and transaction records</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-danger mt-0.5">•</span>
                    <span>Any unused credits or wallet balance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-danger mt-0.5">•</span>
                    <span>The ability to recover this account</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" fullWidth onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="danger" fullWidth onClick={handleContinue}>
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation Step */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To confirm deletion, please type <span className="font-mono font-bold">DELETE</span> and enter your password.
              </p>

              {/* Confirmation Text */}
              <div>
                <label htmlFor="confirmText" className="block text-sm font-medium mb-2">
                  Type DELETE to confirm
                </label>
                <Input
                  id="confirmText"
                  type="text"
                  placeholder="DELETE"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="h-5 w-5" />}
                  required
                />
              </div>

              {/* Final Warning */}
              <div className="bg-muted/50 border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  ⚠️ This action is irreversible. Your account and all associated data will be permanently deleted within 30 days.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setStep('warning')}>
                  Back
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  onClick={handleDelete}
                  isLoading={isLoading}
                  disabled={confirmText !== 'DELETE' || !password}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
