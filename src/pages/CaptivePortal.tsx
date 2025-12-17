import React, { useState, useMemo } from 'react'
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
  Info,
  Star,
  ChevronDown,
  ChevronUp,
  GitCompare,
  Sparkles,
  MessageCircle,
  X
} from 'lucide-react'
import { api } from '@/lib/api'
import { Plan } from '@/types'

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

// Mock FAQs data
const FAQS = [
  {
    question: "How do I activate my plan after payment?",
    answer: "Your plan activates automatically within 30 seconds after successful payment. You'll receive a confirmation SMS and can start browsing immediately."
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes! You can change your plan anytime from your dashboard. Unused data or time from your current plan will be credited to your new plan."
  },
  {
    question: "What happens when my data runs out?",
    answer: "Your internet will be paused. You can purchase a new plan or top-up your existing one anytime. No data is lost, just paused until renewal."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer full refunds within 24 hours of purchase if you haven't used any data. Contact support for assistance."
  },
  {
    question: "Can I share my plan with others?",
    answer: "Plans are tied to your device. However, you can purchase multiple plans for different devices using the same account."
  }
]

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

// AI Recommendation Component
const AIRecommendation: React.FC<{ plans: Plan[] }> = ({ plans }) => {
  const [showRecommendation, setShowRecommendation] = useState(true)
  
  // Simple AI logic: recommend hybrid plan if available, otherwise data plan
  const recommendedPlan = useMemo(() => {
    const hybridPlans = plans.filter(p => p.type === 'hybrid')
    if (hybridPlans.length > 0) {
      return hybridPlans[0]
    }
    const dataPlans = plans.filter(p => p.type === 'data')
    return dataPlans[0] || plans[0]
  }, [plans])

  if (!showRecommendation || !recommendedPlan) return null

  return (
    <Card className="mb-6 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                AI Recommendation
                <Badge variant="success" size="sm">Best Value</Badge>
              </h4>
              <button
                onClick={() => setShowRecommendation(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Based on popular choices, we recommend <span className="font-semibold text-foreground">{recommendedPlan.name}</span> for the best balance of speed, data, and value.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-muted-foreground">
                {recommendedPlan.type === 'hybrid' && 'Perfect for both browsing and downloads'}
                {recommendedPlan.type === 'data' && 'Great for heavy data users'}
                {recommendedPlan.type === 'time' && 'Ideal for casual browsing'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Testimonial Component
const TestimonialCard: React.FC<{ testimonial: { author: string; rating: number; comment: string } }> = ({ testimonial }) => {
  return (
    <div className="p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < testimonial.rating ? 'text-warning fill-warning' : 'text-muted-foreground'}`}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-foreground">{testimonial.author}</span>
      </div>
      <p className="text-xs text-muted-foreground italic">"{testimonial.comment}"</p>
    </div>
  )
}

// FAQ Item Component
const FAQItem: React.FC<{ faq: { question: string; answer: string } }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-foreground">{faq.question}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-muted-foreground animate-fade-in">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

// Plan Comparison Component
const PlanComparison: React.FC<{ plans: Plan[]; onClose: () => void }> = ({ plans, onClose }) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Compare Plans
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center p-3 font-semibold text-foreground">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 text-muted-foreground">Price</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="p-3 text-center font-bold text-primary">
                        {formatCurrency(plan.price, plan.currency)}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-muted-foreground">Type</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="p-3 text-center">
                        <Badge variant={getPlanTypeBadge(plan.type).variant} size="sm">
                          {getPlanTypeBadge(plan.type).label}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-muted-foreground">Duration</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="p-3 text-center text-foreground">
                        {plan.duration ? formatDuration(plan.duration) : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-muted-foreground">Data</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="p-3 text-center text-foreground">
                        {plan.dataLimit ? formatBytes(plan.dataLimit) : 'Unlimited'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-muted-foreground">Download Speed</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="p-3 text-center text-foreground">
                        {plan.downloadSpeed || plan.speedLimit ? `${plan.downloadSpeed || plan.speedLimit} Mbps` : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 text-muted-foreground">Upload Speed</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="p-3 text-center text-foreground">
                        {plan.uploadSpeed ? `${plan.uploadSpeed} Mbps` : '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export const CaptivePortal: React.FC = () => {
  const { t } = useTranslation()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [paymentMethod] = useState<'mpesa' | 'mtn' | 'airtel'>('mpesa')
  const [showScanner, setShowScanner] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [showChat, setShowChat] = useState(false)

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

        {/* AI Recommendation */}
        {!selectedPlan && plans && plans.length > 0 && (
          <AIRecommendation plans={plans} />
        )}

        {/* Plan Selection */}
        {!selectedPlan && (
          <>
            {/* Compare Plans Button */}
            {plans && plans.length > 1 && (
              <div className="flex justify-end mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComparison(true)}
                  icon={<GitCompare className="h-4 w-4" />}
                >
                  Compare Plans
                </Button>
              </div>
            )}

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
                            {(plan.downloadSpeed || plan.speedLimit) && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="p-2 bg-accent/10 rounded-lg">
                                  <Download className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Download</div>
                                  <div className="font-semibold">{plan.downloadSpeed || plan.speedLimit} Mbps</div>
                                </div>
                              </div>
                            )}

                            {/* Upload Speed */}
                            {plan.uploadSpeed && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="p-2 bg-info/10 rounded-lg">
                                  <Upload className="h-4 w-4 text-info" />
                                </div>
                                <div>
                                  <div className="text-xs text-muted-foreground">Upload</div>
                                  <div className="font-semibold">{plan.uploadSpeed} Mbps</div>
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

                          {/* Testimonials */}
                          {plan.testimonials && plan.testimonials.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <div className="text-xs font-semibold text-muted-foreground mb-2">Customer Reviews:</div>
                              <div className="space-y-2">
                                {plan.testimonials.slice(0, 2).map((testimonial, idx) => (
                                  <TestimonialCard key={idx} testimonial={testimonial} />
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
          </>
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
                  {(selectedPlanData.downloadSpeed || selectedPlanData.speedLimit) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-accent" />
                      <span>{selectedPlanData.downloadSpeed || selectedPlanData.speedLimit} Mbps</span>
                    </div>
                  )}
                  {selectedPlanData.uploadSpeed && (
                    <div className="flex items-center gap-2 text-sm">
                      <Upload className="h-4 w-4 text-info" />
                      <span>{selectedPlanData.uploadSpeed} Mbps</span>
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

        {/* FAQs Section */}
        {!selectedPlan && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {FAQS.map((faq, idx) => (
                <FAQItem key={idx} faq={faq} />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        {!selectedPlan && (
          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Need Help Choosing?</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Not sure which plan is right for you? Our AI assistant can help you find the perfect plan based on your usage.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowChat(true)}
                    icon={<MessageCircle className="h-4 w-4" />}
                  >
                    Chat with AI Assistant
                  </Button>
                  <div className="text-xs text-muted-foreground space-y-1 mt-4">
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

      {showComparison && plans && (
        <PlanComparison plans={plans} onClose={() => setShowComparison(false)} />
      )}
      
      <ChatbotWidget />
    </div>
  )
}
