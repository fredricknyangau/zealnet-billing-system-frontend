import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Smartphone, ArrowLeft, Send, CheckCircle2 } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
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
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center animate-scale-in">
            <Send className="h-8 w-8 text-foreground" />
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-400 animate-scale-in" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">OTP Sent!</h3>
            <p className="text-muted-foreground">
              Check your phone for the verification code
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Instructions */}
            <p className="text-center text-muted-foreground text-sm">
              Enter your phone number and we'll send you an OTP to reset your password
            </p>

            {/* Phone Input */}
            <AnimatedInput
              type="tel"
              label="Phone Number"
              placeholder="+254 700 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Smartphone className="h-5 w-5" />}
              disabled={isLoading}
              autoFocus
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              disabled={!phone.trim() || isLoading}
              className="relative overflow-hidden group bg-primary/20 hover:bg-primary/30 border border-primary/30 text-foreground font-semibold py-3 rounded-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Send className="h-5 w-5 animate-pulse mr-2" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </Button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </form>
        )}

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link to="/login" className="text-foreground font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
