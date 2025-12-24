import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Lock, CheckCircle2, Shield, Sparkles } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
import { OTPInput } from '@/components/auth/OTPInput'
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
    const sanitizedPassword = formData.newPassword

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
      
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
        {isSuccess ? (
          /* Success State */
          <div className="text-center space-y-6 animate-fade-in py-8">
            <div className="relative inline-block">
              {/* Animated glow rings */}
              <div className="absolute inset-0 bg-success/30 rounded-full blur-3xl animate-ping" />
              <div className="absolute inset-0 bg-success/20 rounded-full blur-2xl animate-pulse" />
              
              {/* Success icon with sparkles */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-success/20 to-success/10 rounded-full flex items-center justify-center mx-auto border-2 border-success/30">
                <CheckCircle2 className="h-12 w-12 text-success animate-scale-in" />
                
                {/* Floating sparkles */}
                {[...Array(6)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className="absolute h-4 w-4 text-success animate-float"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 200}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Password Reset!
              </h3>
              <p className="text-muted-foreground">
                Your password has been successfully reset
              </p>
            </div>

            {/* Redirect message */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span>Redirecting to login...</span>
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
                  <Shield className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Display */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Resetting password for{' '}
                  <span className="font-semibold text-foreground">{phoneFromUrl}</span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-foreground">
                  Enter OTP Code
                </label>
                <OTPInput
                  length={6}
                  value={formData.otp}
                  onChange={handleChange('otp')}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

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
                hint="Must be at least 8 characters"
              />

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
                  formData.otp.length !== 6 ||
                  !formData.newPassword ||
                  !formData.confirmPassword ||
                  formData.newPassword !== formData.confirmPassword ||
                  isLoading
                }
                isLoading={isLoading}
                icon={<Shield className="h-5 w-5" />}
              >
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </Button>

              {/* Resend OTP */}
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-all duration-300 py-2 rounded-lg hover:bg-muted/50"
              >
                Didn't receive OTP? <span className="font-semibold text-primary">Resend</span>
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
          
          @keyframes float {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(0);
              opacity: 0;
            }
            25% {
              transform: translate(10px, -20px) rotate(90deg) scale(1);
              opacity: 1;
            }
            50% {
              transform: translate(-10px, -40px) rotate(180deg) scale(1);
              opacity: 1;
            }
            75% {
              transform: translate(15px, -60px) rotate(270deg) scale(1);
              opacity: 0.5;
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.4s ease-out;
          }
          
          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }
          
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
        `}</style>
      </AuthCard>
    </AuthLayout>
  )
}
