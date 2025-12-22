import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input' // Assuming Input exists, if not use standard input
import { Ticket } from 'lucide-react'
import { api } from '@/lib/api'
import { extractErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

export const VoucherRedemptionCard: React.FC = () => {
  const { t } = useTranslation()
  const [code, setCode] = useState('')
  const queryClient = useQueryClient()

  const redeemMutation = useMutation({
    mutationFn: (voucherCode: string) => api.redeemVoucher(voucherCode),
    onSuccess: (_) => {
      toast.success('Voucher redeemed successfully!')
      setCode('')
      // Invalidate relevant queries to update UI
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: (error: any) => {
        const msg = extractErrorMessage(error, 'Failed to redeem voucher')
        toast.error(msg)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    redeemMutation.mutate(code)
  }

  return (
    <Card variant="glass" className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            <CardTitle>{t('dashboard.redeemVoucher', 'Redeem Voucher')}</CardTitle>
        </div>
        <CardDescription>
          Enter your voucher code to activate a plan or top up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Enter voucher code (e.g. ABCD-1234)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={redeemMutation.isPending}
            className="bg-background/50"
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={redeemMutation.isPending}
            disabled={!code.trim()}
          >
            {t('dashboard.redeem', 'Redeem')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
