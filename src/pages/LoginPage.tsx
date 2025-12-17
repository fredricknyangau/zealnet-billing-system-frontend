import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Smartphone, Key, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const requestOTP = useMutation({
    mutationFn: (phone: string) => api.loginWithPhone(phone),
    onSuccess: () => {
      setShowOtpInput(true)
      toast.success('OTP sent to your phone', {
        icon: '📱',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
      })
    },
    onError: () => {
      toast.error('Failed to send OTP')
    },
  })

  const verifyOTP = useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => api.verifyOTP(phone, otp),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      toast.success(t('auth.login'), {
        icon: '✨',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
      })
      
      // Show success animation before redirect
      setTimeout(() => {
        if (data.user.role === 'admin') {
          navigate('/admin')
        } else if (data.user.role === 'reseller') {
          navigate('/reseller')
        } else {
          navigate('/dashboard')
        }
      }, 500)
    },
    onError: () => {
      toast.error('Invalid OTP')
    },
  })

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneNumber.trim()) {
      requestOTP.mutate(phoneNumber.trim())
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.trim() && phoneNumber.trim()) {
      verifyOTP.mutate({ phone: phoneNumber.trim(), otp: otp.trim() })
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your WiFi billing dashboard"
    >
      <AuthCard>
        {!showOtpInput ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            {/* Phone Input */}
            <AnimatedInput
              type="tel"
              label={t('auth.phoneNumber')}
              placeholder="+254 712 345 678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              leftIcon={<Smartphone className="h-5 w-5" />}
              disabled={requestOTP.isPending}
              autoFocus
              required
            />

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              disabled={!phoneNumber.trim() || requestOTP.isPending}
              className="relative overflow-hidden group bg-primary/20 hover:bg-primary/30 border border-primary/30 text-foreground font-semibold py-3 rounded-xl transition-all duration-300"
            >
              {requestOTP.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </Button>

            {/* Social Auth */}
            <SocialAuthButtons />

            {/* Forgot Password */}
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            {/* Success Message */}
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                OTP sent to <span className="font-semibold text-foreground">{phoneNumber}</span>
              </p>
            </div>

            {/* OTP Input */}
            <AnimatedInput
              type="text"
              label={t('auth.enterOtp')}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              leftIcon={<Key className="h-5 w-5" />}
              maxLength={6}
              disabled={verifyOTP.isPending}
              success={otp.length === 6}
              autoFocus
              required
            />

            {/* Verify Button */}
            <Button
              type="submit"
              fullWidth
              disabled={!otp.trim() || otp.length !== 6 || verifyOTP.isPending}
              className="relative overflow-hidden group bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              {verifyOTP.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  {t('auth.verify')}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </Button>

            {/* Change Number */}
            <button
              type="button"
              onClick={() => {
                setShowOtpInput(false)
                setOtp('')
              }}
              className="w-full text-sm text-white/70 hover:text-white transition-colors"
            >
              Change phone number
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => requestOTP.mutate(phoneNumber)}
                disabled={requestOTP.isPending}
                className="text-sm text-white/70 hover:text-white transition-colors disabled:opacity-50"
              >
                Didn't receive OTP? <span className="font-semibold">Resend</span>
              </button>
            </div>
          </form>
        )}

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-foreground font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </AuthCard>
    </AuthLayout>
  )
}
