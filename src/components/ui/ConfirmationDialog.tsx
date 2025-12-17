import React from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  requiresCheckbox?: boolean
  checkboxLabel?: string
  isLoading?: boolean
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  requiresCheckbox = false,
  checkboxLabel = 'I understand the consequences',
  isLoading = false,
}) => {
  const [isChecked, setIsChecked] = React.useState(false)

  const handleConfirm = () => {
    if (requiresCheckbox && !isChecked) return
    onConfirm()
  }

  const handleClose = () => {
    setIsChecked(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-4">
        {/* Warning Icon for Danger Variant */}
        {variant === 'danger' && (
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
          </div>
        )}

        {/* Message */}
        <p className="text-muted-foreground text-center">{message}</p>

        {/* Checkbox Confirmation */}
        {requiresCheckbox && (
          <div className="flex items-start gap-2 p-4 bg-muted/30 rounded-lg">
            <input
              type="checkbox"
              id="confirm-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="confirm-checkbox" className="text-sm cursor-pointer">
              {checkboxLabel}
            </label>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            fullWidth
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            fullWidth
            onClick={handleConfirm}
            disabled={requiresCheckbox && !isChecked}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
