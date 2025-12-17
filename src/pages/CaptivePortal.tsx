import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from '@tanstack/react-query'
import { 
  Wifi, 
  Smartphone, 
  CreditCard, 
  QrCode, 
  Clock, 
  Database, 
  Zap, 
  Calendar, 
  Download, 
  Upload,
  CheckCircle2,
  Info
} from 'lucide-react'
import { api } from '@/lib/api'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatBytes, formatDuration } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'
import { QRScanner } from '@/components/portal/QRScanner'
import { TermsModal } from '@/components/portal/TermsModal'
import { ChatbotWidget } from '@/components/ai/ChatbotWidget'

import toast from 'react-hot-toast'

// Helper function to get plan type badge
const getPlanTypeBadge = (type: string) => {
  switch (type) {
    case 'time':
      return { label: 'Time-Based', variant: 'info' as const, icon: Clock }
    case 'data':
      return { label: 'Data-Based', variant: 'success' as const, icon: Database }
    case 'hybrid':
      return { label: 'Hybrid', variant: 'warning' as const, icon: Zap }
    default:
      return { label: type, variant: 'default' as const, icon: Info }
  }
}

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

  const selectedPlanData = plans?.find((p) => p.id === selectedPlan)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4 shadow-lg">
            <Wifi className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('portal.welcome')}
          </h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for your internet needs
          </p>
        </div>

        {/* Plan Selection */}
        {!selectedPlan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                {t('portal.selectPlan')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plansLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {plans?.map((plan) => {
                    const typeBadge = getPlanTypeBadge(plan.type)
                    const TypeIcon = typeBadge.icon
                    
                    return (
                      <button
                        key={plan.id}
                        onClick={() => handlePlanSelect(plan.id)}
                        className="w-full text-left p-5 border-2 border-border rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300 group bg-card"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                {plan.name}
                              </h3>
                              <Badge variant={typeBadge.variant} size="sm">
                                <TypeIcon className="h-3 w-3 mr-1" />
                                {typeBadge.label}
                              </Badge>
                            </div>
                            {plan.description && (
                              <p className="text-sm text-muted-foreground">
                                {plan.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-primary">
                              {formatCurrency(plan.price, plan.currency)}
                            </div>
                          </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          {/* Time Limit */}
                          {plan.duration && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Duration</div>
                                <div className="font-semibold">{formatDuration(plan.duration)}</div>
                              </div>
                            </div>
                          )}

                          {/* Data Limit */}
                          {plan.dataLimit && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-2 bg-success/10 rounded-lg">
                                <Database className="h-4 w-4 text-success" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Data</div>
                                <div className="font-semibold">{formatBytes(plan.dataLimit)}</div>
                              </div>
                            </div>
                          )}

                          {/* Download Speed */}
                          {plan.speedLimit && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-2 bg-accent/10 rounded-lg">
                                <Download className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Speed</div>
                                <div className="font-semibold">{plan.speedLimit} Mbps</div>
                              </div>
                            </div>
                          )}

                          {/* Validity Period */}
                          {plan.type === 'hybrid' && plan.duration && (
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-2 bg-warning/10 rounded-lg">
                                <Calendar className="h-4 w-4 text-warning" />
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground">Valid for</div>
                                <div className="font-semibold">{formatDuration(plan.duration)}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Features */}
                        {plan.features && plan.features.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="text-xs font-semibold text-muted-foreground mb-2">What's Included:</div>
                            <div className="grid grid-cols-1 gap-1">
                              {plan.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Call to Action */}
                        <div className="mt-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              {plan.type === 'time' && 'Perfect for browsing'}
                              {plan.type === 'data' && 'Great for downloads'}
                              {plan.type === 'hybrid' && 'Best value package'}
                            </span>
                            <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">
                              Select Plan →
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Payment Section */}
        {selectedPlan && selectedPlanData && (
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Complete Payment</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedPlan(null)}>
                  Change Plan
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Plan Summary */}
              <div className="p-5 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/20">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {selectedPlanData.name}
                    </h3>
                    <Badge variant={getPlanTypeBadge(selectedPlanData.type).variant} size="sm">
                      {getPlanTypeBadge(selectedPlanData.type).label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedPlanData.price, selectedPlanData.currency)}
                    </div>
                  </div>
                </div>

                {/* Plan Features Summary */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedPlanData.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{formatDuration(selectedPlanData.duration)}</span>
                    </div>
                  )}
                  {selectedPlanData.dataLimit && (
                    <div className="flex items-center gap-2 text-sm">
                      <Database className="h-4 w-4 text-success" />
                      <span>{formatBytes(selectedPlanData.dataLimit)}</span>
                    </div>
                  )}
                  {selectedPlanData.speedLimit && (
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-accent" />
                      <span>{selectedPlanData.speedLimit} Mbps</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment Methods */}
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

              {/* Buy Button */}
              <div className="pt-2">
                <Button
                  fullWidth
                  onClick={handlePay}
                  isLoading={initiatePayment.isPending}
                  disabled={!phoneNumber.trim()}
                  icon={<CreditCard className="h-5 w-5" />}
                  className="h-12 text-base"
                >
                  {initiatePayment.isPending ? 'Processing...' : 'Buy Now'}
                </Button>
              </div>
              
              {/* Terms */}
              <p className="text-xs text-center text-muted-foreground">
                By purchasing, you agree to our{' '}
                <button onClick={() => setShowTerms(true)} className="text-primary hover:underline underline-offset-4 font-semibold">
                  Terms & Conditions
                </button>
              </p>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {!selectedPlan && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Need Help Choosing?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Not sure which plan is right for you? Our AI assistant can help you find the perfect plan based on your usage.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span>Instant activation after payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span>No contracts or hidden fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                </div>
              </div>
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
