import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Key, Lock, CheckCircle2, Shield } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { sanitizeText } from '@/lib/sanitize'

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const phoneFromUrl = searchParams.get('phone') || ''

  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (!phoneFromUrl) {
      toast.error('Invalid reset link')
      navigate('/forgot-password')
    }
  }, [phoneFromUrl, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const sanitizedOtp = sanitizeText(formData.otp)
    const sanitizedPassword = formData.newPassword // Don't sanitize password

    // Validation
    if (sanitizedOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    if (sanitizedPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (sanitizedPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      await api.resetPassword(phoneFromUrl, sanitizedOtp, sanitizedPassword)
      setIsSuccess(true)
      toast.success('Password reset successfully!', {
        icon: '✨',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
      })
      
      // Navigate after showing success
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const passwordsMatch = formData.newPassword && formData.confirmPassword && 
                        formData.newPassword === formData.confirmPassword

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new password for your account"
      showBranding={false}
    >
      <AuthCard>
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center animate-scale-in">
            <Shield className="h-8 w-8 text-foreground" />
          </div>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 animate-fade-in">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-400 animate-scale-in" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Password Reset!</h3>
            <p className="text-muted-foreground">
              Your password has been successfully reset. Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Display */}
            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl">
              <Key className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Resetting password for <span className="font-semibold text-foreground">{phoneFromUrl}</span>
              </p>
            </div>

            {/* OTP Input */}
            <AnimatedInput
              type="text"
              label="OTP Code"
              placeholder="000000"
              value={formData.otp}
              onChange={handleChange('otp')}
              leftIcon={<Key className="h-5 w-5" />}
              maxLength={6}
              success={formData.otp.length === 6}
              disabled={isLoading}
              autoFocus
              required
            />

            {/* New Password */}
            <AnimatedInput
              type="password"
              label="New Password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
              leftIcon={<Lock className="h-5 w-5" />}
              showPasswordToggle
              disabled={isLoading}
              required
            />

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="animate-fade-in">
                <PasswordStrengthIndicator password={formData.newPassword} />
              </div>
            )}

            {/* Confirm Password */}
            <AnimatedInput
              type="password"
              label="Confirm Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              leftIcon={<Lock className="h-5 w-5" />}
              showPasswordToggle
              success={!!passwordsMatch}
              error={
                formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
              disabled={isLoading}
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              disabled={
                !formData.otp ||
                !formData.newPassword ||
                !formData.confirmPassword ||
                formData.newPassword !== formData.confirmPassword ||
                isLoading
              }
              className="relative overflow-hidden group bg-primary/20 hover:bg-primary/30 border border-primary/30 text-foreground font-semibold py-3 rounded-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Shield className="h-5 w-5 animate-pulse mr-2" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </Button>

            {/* Resend OTP */}
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Didn't receive OTP? <span className="font-semibold">Resend</span>
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
