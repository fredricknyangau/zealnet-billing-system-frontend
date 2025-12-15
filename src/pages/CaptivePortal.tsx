import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Wifi, Smartphone, CreditCard, QrCode } from 'lucide-react'
import { api } from '@/lib/api'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatBytes, formatDuration } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { ThemeToggle } from '@/components/ThemeToggle'
import { QRScanner } from '@/components/portal/QRScanner'
import { TermsModal } from '@/components/portal/TermsModal'
import { ChatbotWidget } from '@/components/ai/ChatbotWidget'


import toast from 'react-hot-toast'



export const CaptivePortal: React.FC = () => {
  const { t } = useTranslation()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod] = useState<'mpesa' | 'mtn' | 'airtel'>('mpesa')
  const [showScanner, setShowScanner] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.getPlans(),
  })

  const initiatePayment = useMutation({
    mutationFn: ({ planId, phone, method }: { planId: string; phone: string; method: 'mpesa' | 'mtn' | 'airtel' }) => {
      const plan = plans?.find((p) => p.id === planId)
      if (!plan) throw new Error('Plan not found')
      
      if (method === 'mtn') {
        return api.initiateMTNPayment(plan.price, phone)
      } else if (method === 'airtel') {
        return api.initiateAirtelPayment(plan.price, phone)
      } else {
        return api.initiateMpesaPayment(plan.price, phone)
      }
    },
    onSuccess: async (data) => {
      toast.success('Payment initiated. Check your phone.')
      // Poll for payment status
      const checkStatus = setInterval(async () => {
        try {
          const payment = await api.checkPaymentStatus(data.checkoutRequestId)
          if (payment.status === 'completed') {
            clearInterval(checkStatus)
            toast.success('Payment successful! Please log in.')
            setTimeout(() => {
              window.location.href = '/login'
            }, 1500)
          } else if (payment.status === 'failed') {
            clearInterval(checkStatus)
            toast.error(t('portal.paymentFailed'))
          }
        } catch (error) {
          // Continue polling
        }
      }, 3000)

      // Stop polling after 2 minutes
      setTimeout(() => clearInterval(checkStatus), 120000)
    },
    onError: () => {
      toast.error(t('portal.paymentFailed'))
    },
  })

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
  }

  const handlePay = () => {
    if (selectedPlan && phoneNumber.trim()) {
      initiatePayment.mutate({ planId: selectedPlan, phone: phoneNumber.trim(), method: paymentMethod })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <Wifi className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('portal.welcome')}
          </h1>
          <p className="text-muted-foreground">
            Select a plan to get started
          </p>
        </div>

        {/* Plan Selection */}
        {!selectedPlan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('portal.selectPlan')}</CardTitle>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {plans?.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handlePlanSelect(plan.id)}
                      className="w-full text-left p-4 border-2 border-border rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">
                          {plan.name}
                        </h3>
                        <span className="text-lg font-bold text-primary">
                          {formatCurrency(plan.price, plan.currency)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {plan.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {plan.duration && (
                          <Badge variant="info" size="sm">
                            {formatDuration(plan.duration)}
                          </Badge>
                        )}
                        {plan.dataLimit && (
                          <Badge variant="info" size="sm">
                            {formatBytes(plan.dataLimit)}
                          </Badge>
                        )}
                        {plan.speedLimit && (
                          <Badge variant="info" size="sm">
                            {plan.speedLimit} Mbps
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Section */}
        {selectedPlan && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Complete Payment</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(null)}>
                  Change Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {plans && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-semibold">
                      {plans.find((p) => p.id === selectedPlan)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(
                        plans.find((p) => p.id === selectedPlan)?.price || 0,
                        plans.find((p) => p.id === selectedPlan)?.currency || 'KES'
                      )}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Pay with Mobile Money</span>
                    </div>
                  </div>

                  <Input
                    type="tel"
                    placeholder="Phone number for M-Pesa"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    leftIcon={<Smartphone className="h-5 w-5" />}
                    disabled={initiatePayment.isPending}
                    autoFocus
                  />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or Use Voucher</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    fullWidth 
                    onClick={() => setShowScanner(true)}
                    icon={<QrCode className="h-4 w-4" />}
                  >
                    Scan Voucher QR Code
                  </Button>
              </div>

              <div className="pt-4">
                <Button
                    fullWidth
                    onClick={handlePay}
                    isLoading={initiatePayment.isPending}
                    disabled={!phoneNumber.trim()}
                    icon={<CreditCard className="h-5 w-5" />}
                >
                    Buy Now
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                By purchasing, you agree to our{' '}
                <button onClick={() => setShowTerms(true)} className="text-primary hover:underline underline-offset-4">
                    Terms & Conditions
                </button>
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modals & Widgets */}
      {showScanner && (
        <QRScanner 
            onScan={(code) => {
                toast.success(`Voucher Scanned: ${code}`)
                setShowScanner(false)
                // Simulate redeeming voucher
                setTimeout(() => {
                    toast.success("Voucher redeemed successfully!")
                    window.location.href = '/login'
                }, 1500)
            }}
            onClose={() => setShowScanner(false)} 
        />
      )}
      
      <TermsModal 
        isOpen={showTerms} 
        onClose={() => setShowTerms(false)}
        onAccept={() => {
            setShowTerms(false)
            toast.success("Terms accepted")
        }}
      />
      
      <ChatbotWidget />
    </div>
  )
}

