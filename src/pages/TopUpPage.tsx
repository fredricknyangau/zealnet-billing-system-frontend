import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  Wallet, 
  Plus, 
  ArrowLeft, 
  History,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react'
import { api } from '@/lib/api'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import toast from 'react-hot-toast'
import MobileMoneyPayment from '@/components/payments/MobileMoneyPayment'
import PaymentHistory from '@/components/payments/PaymentHistory'

export default function TopUpPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [showPayment, setShowPayment] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000]

  // Fetch wallet balance
  const { data: walletData, isLoading: balanceLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const data = await api.getWalletBalance()
      return { balance: data.balance || 0, currency: data.currency || 'KES' }
    },
  })

  const balance = walletData?.balance || 0
  const currency = walletData?.currency || 'KES'

  const handleQuickAmount = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCustomAmount(value)
    setSelectedAmount(value ? parseInt(value) : null)
  }

  const handleTopUp = () => {
    if (selectedAmount && selectedAmount >= 1) {
      setShowPayment(true)
    }
  }

  const handlePaymentSuccess = (paymentId: string) => {
    console.log('Payment successful:', paymentId)
    setShowPayment(false)
    setSelectedAmount(null)
    setCustomAmount('')
    
    // Invalidate and refetch balance
    queryClient.invalidateQueries({ queryKey: ['wallet'] })
    
    toast.success('Payment successful! Your wallet has been topped up.', {
      icon: '✨',
      style: {
        background: 'rgba(16, 185, 129, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        color: '#10b981',
      },
    })
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  return (
    <AuthLayout title="Wallet Top-Up" showBranding={false}>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        {/* Balance Card */}
        <AuthCard>
          <div className="relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-cyan-500/20 to-accent/20 animate-gradient-shift" />
            
            {/* Content */}
            <div className="relative p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Current Balance
                  </p>
                  {balanceLoading ? (
                    <div className="h-12 w-48 bg-muted/50 rounded-lg animate-pulse" />
                  ) : (
                    <p className="text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {currency} {balance.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                  <Wallet className="relative h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </AuthCard>

        {/* Tab Navigation */}
        <div className="relative flex gap-2 p-1.5 bg-muted/50 rounded-xl border border-border/50">
          {/* Sliding background */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.25rem)] bg-background shadow-md rounded-lg transition-all duration-300 ease-out ${
              showHistory ? 'left-[calc(50%+0.25rem)]' : 'left-1.5'
            }`}
          />
          
          <button
            onClick={() => setShowHistory(false)}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              !showHistory ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Top Up</span>
          </button>
          
          <button
            onClick={() => setShowHistory(true)}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              showHistory ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="h-4 w-4" />
            <span>History</span>
          </button>
        </div>

        {/* Content */}
        {showHistory ? (
          <AuthCard>
            <PaymentHistory />
          </AuthCard>
        ) : (
          <AuthCard>
            <div className="space-y-6">
              {/* Quick Amounts */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Quick Amounts
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleQuickAmount(amount)}
                      className={`group relative p-4 rounded-xl border-2 transition-all font-semibold overflow-hidden ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary bg-primary/5 scale-105'
                          : 'border-border hover:border-primary/50 hover:scale-105'
                      }`}
                    >
                      {/* Hover gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:to-accent/10 transition-all duration-300" />
                      
                      <div className="relative space-y-1">
                        <div className="text-2xl font-bold">{currency} {amount.toLocaleString()}</div>
                        {selectedAmount === amount && !customAmount && (
                          <div className="flex items-center gap-1 text-xs text-primary">
                            <CheckCircle2 className="h-3 w-3" />
                            Selected
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Custom Amount
                </h3>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                    {currency}
                  </span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter amount"
                    className="w-full pl-20 pr-4 py-4 text-lg rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                {customAmount && parseInt(customAmount) < 1 && (
                  <p className="mt-2 text-sm text-destructive flex items-center gap-2">
                    <span className="inline-block w-1 h-1 bg-destructive rounded-full" />
                    Minimum amount is {currency} 1
                  </p>
                )}
              </div>

              {/* Summary */}
              {selectedAmount && selectedAmount >= 1 && (
                <div className="animate-fade-in">
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Amount to add:</span>
                        <span className="text-3xl font-bold text-primary">
                          {currency} {selectedAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">New balance:</span>
                        <span className="text-xl font-semibold text-foreground flex items-center gap-2">
                          {currency} {(balance + selectedAmount).toLocaleString()}
                          <TrendingUp className="h-4 w-4 text-success" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Top Up Button */}
              <Button
                onClick={handleTopUp}
                fullWidth
                size="lg"
                disabled={!selectedAmount || selectedAmount < 1}
                icon={<Plus className="h-5 w-5" />}
              >
                Top Up with M-Pesa
              </Button>

              {/* Info */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm text-foreground">How it works</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      You will receive an M-Pesa prompt on your phone. Enter your PIN to complete the payment.
                      The funds will be added to your wallet immediately after successful payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AuthCard>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && selectedAmount && (
        <MobileMoneyPayment
          amount={selectedAmount}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </AuthLayout>
  )
}
