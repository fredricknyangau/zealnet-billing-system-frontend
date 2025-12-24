import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle2, Mail } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { sanitizeText } from '@/lib/sanitize'

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const sanitizedPhone = sanitizeText(phone)
    
    if (!sanitizedPhone || sanitizedPhone.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setIsLoading(true)

    try {
      await api.requestPasswordReset(sanitizedPhone)
      setIsSuccess(true)
      toast.success('OTP sent to your phone', {
        icon: '📱',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
      })
      
      // Navigate after short delay to show success state
      setTimeout(() => {
        navigate(`/reset-password?phone=${encodeURIComponent(sanitizedPhone)}`)
      }, 1500)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="No worries, we'll send you reset instructions"
      showBranding={false}
    >
      <AuthCard>
        {isSuccess ? (
          /* Success State */
          <div className="text-center space-y-6 animate-fade-in py-8">
            <div className="relative inline-block">
              {/* Animated glow rings */}
              <div className="absolute inset-0 bg-success/30 rounded-full blur-3xl animate-ping" />
              <div className="absolute inset-0 bg-success/20 rounded-full blur-2xl animate-pulse" />
              
              {/* Success icon */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-success/20 to-success/10 rounded-full flex items-center justify-center mx-auto border-2 border-success/30">
                <CheckCircle2 className="h-12 w-12 text-success animate-scale-in" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Check Your Phone!
              </h3>
              <p className="text-muted-foreground">
                We've sent a verification code to
              </p>
              <p className="font-semibold text-primary mt-1">
                {phone}
              </p>
            </div>

            {/* Redirect message */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span>Redirecting...</span>
            </div>
          </div>
        ) : (
          /* Form State */
          <>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-2xl animate-pulse" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-2xl border border-primary/30 flex items-center justify-center">
                  <Mail className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Instructions */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  Reset Your Password
                </h3>
                <p className="text-sm text-muted-foreground">
                  Enter your phone number and we'll send you an OTP to reset your password
                </p>
              </div>

              {/* Phone Input */}
              <PhoneInput
                label="Phone Number"
                placeholder="712 345 678"
                value={phone}
                onChange={setPhone}
                disabled={isLoading}
                required
                defaultCountry="KE"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={!phone.trim() || isLoading}
                isLoading={isLoading}
                icon={<Send className="h-5 w-5" />}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>

              {/* Back to Login */}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-300 py-2 rounded-lg hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Remember your password?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline transition-all">
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scale-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .animate-fade-in {
            animation: fade-in 0.4s ease-out;
          }
          
          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }
        `}</style>
      </AuthCard>
    </AuthLayout>
  )
}
