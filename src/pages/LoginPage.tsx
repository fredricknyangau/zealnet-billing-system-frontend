import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Smartphone, Lock, Eye, EyeOff, CheckCircle2, Shield, Key } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

type AuthMethod = 'password' | 'otp'

export const LoginPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  
  // Auth method selection
  const [authMethod, setAuthMethod] = useState<AuthMethod>('password')
  
  // Form state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // OTP state
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [otp, setOtp] = useState('')

  // Password login mutation
  const passwordLogin = useMutation({
    mutationFn: async () => {
      return await api.loginWithPassword(phoneNumber, password)
    },
    onSuccess: (data) => {
      setAuth(data.user, '') // No token needed, using cookies
      toast.success('Login successful!', {
        icon: '✨',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
      })
      // Redirect based on user role
      const redirectPath = data.user.role === 'admin' ? '/admin' 
        : data.user.role === 'reseller' ? '/reseller' 
        : '/dashboard'
      navigate(redirectPath)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Invalid credentials')
    },
  })

  // OTP request mutation
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

  // OTP verification mutation
  const verifyOTP = useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) => api.verifyOTP(phone, otp),
    onSuccess: (data) => {
      setAuth(data.user, '') // No token needed, using cookies
      toast.success('Login successful!', {
        icon: '✨',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
      })
      // Redirect based on user role
      const redirectPath = data.user.role === 'admin' ? '/admin' 
        : data.user.role === 'reseller' ? '/reseller' 
        : '/dashboard'
      navigate(redirectPath)
    },
    onError: () => {
      toast.error('Invalid OTP code')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number')
      return
    }

    if (authMethod === 'password') {
      if (!password.trim()) {
        toast.error('Please enter your password')
        return
      }
      passwordLogin.mutate()
    } else {
      requestOTP.mutate(phoneNumber)
    }
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || otp.length < 4) {
      toast.error('Please enter the verification code')
      return
    }
    verifyOTP.mutate({ phone: phoneNumber, otp })
  }

  // OTP Verification Screen
  if (showOtpInput) {
    return (
      <AuthLayout>
        <AuthCard>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Verify Your Phone</h1>
            <p className="text-muted-foreground">
              Enter the 6-digit code sent to {phoneNumber}
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <AnimatedInput
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={setOtp}
              leftIcon={<Lock className="h-5 w-5" />}
              maxLength={6}
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              isLoading={verifyOTP.isPending}
              icon={<CheckCircle2 className="h-5 w-5" />}
            >
              Verify & Sign In
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => requestOTP.mutate(phoneNumber)}
                disabled={requestOTP.isPending}
                className="text-sm text-primary hover:underline disabled:opacity-50"
              >
                {requestOTP.isPending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp('')
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Change phone number
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center text-sm pt-4 border-t border-border">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </form>
        </AuthCard>
      </AuthLayout>
    )
  }

  // Main Login Screen
  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        {/* Authentication Method Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              authMethod === 'password'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="h-4 w-4" />
            Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('otp')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
              authMethod === 'otp'
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Phone Number */}
          <AnimatedInput
            type="tel"
            label="Phone Number"
            placeholder="+254 700 000 000"
            value={phoneNumber}
            onChange={setPhoneNumber}
            leftIcon={<Smartphone className="h-5 w-5" />}
            required
          />

          {/* Password Field (only for password auth) */}
          {authMethod === 'password' && (
            <AnimatedInput
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              leftIcon={<Lock className="h-5 w-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              }
              required
            />
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">Remember me</span>
            </label>
            {authMethod === 'password' && (
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            isLoading={authMethod === 'password' ? passwordLogin.isPending : requestOTP.isPending}
            icon={authMethod === 'password' ? <Key className="h-5 w-5" /> : <Smartphone className="h-5 w-5" />}
          >
            {authMethod === 'password' ? 'Sign In' : 'Send OTP'}
          </Button>

          {/* Signup Link */}
          <div className="text-center text-sm pt-4 border-t border-border">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
