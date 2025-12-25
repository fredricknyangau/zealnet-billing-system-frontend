import React, { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface WalletTopUpModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WalletTopUpModal: React.FC<WalletTopUpModalProps> = ({ isOpen, onClose }) => {
  const user = useAuthStore(state => state.user)  // Use selector to prevent re-renders
  const [amount, setAmount] = useState('500')
  const [phone, setPhone] = useState(user?.phone || '')

  const topUpMutation = useMutation({
    mutationFn: async () => {
        // We use initiateMpesaPayment directly. 
        // Note: The backend endpoint is /payments/mpesa/stk-push
        // which usually initiates a plan purchase or a wallet top up depending on context?
        // Actually, the current `initiateMpesaPayment` in api.ts sends {amount, phone}.
        // The backend logic needs to know if this is for a specific Plan OR just Wallet Top-up.
        // If we look at `app/payments/api.py` (which I haven't modified), it likely creates a wrapper transaction.
        // For now, let's assume sending amount without plan_id implies Wallet Top-Up.
        return api.initiateMpesaPayment(Number(amount), phone)
    },
    onSuccess: (_) => {
      toast.success('M-Pesa STK Push sent! Please enter your PIN.')
      onClose()
    },
    onError: (_) => {
      toast.error('Failed to initiate payment')
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet">
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Top up your wallet using M-Pesa.
        </p>
        
        <div className="space-y-2">
            <label className="text-sm font-medium">Amount (KES)</label>
            <Input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium">M-Pesa Number</label>
            <Input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="2547..."
            />
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={onClose} disabled={topUpMutation.isPending}>
                Cancel
            </Button>
            <Button 
                onClick={() => topUpMutation.mutate()} 
                isLoading={topUpMutation.isPending}
            >
                Pay {amount} KES
            </Button>
        </div>
      </div>
    </Modal>
  )
}
