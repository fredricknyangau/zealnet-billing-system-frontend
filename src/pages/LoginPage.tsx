import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Smartphone, Lock, Eye, EyeOff, CheckCircle2, Shield, Key, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'
import { extractErrorMessage } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
import { OTPInput } from '@/components/auth/OTPInput'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

type AuthMethod = 'password' | 'otp'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)  // Use selector instead of destructuring
  
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
      setAuth(data.user)
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
      const msg = extractErrorMessage(error, 'Invalid credentials')
      toast.error(msg)
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
      setAuth(data.user)
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
      setOtp('')
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

  const handleVerifyOtp = () => {
    if (!otp || otp.length < 6) {
      toast.error('Please enter the complete verification code')
      return
    }
    verifyOTP.mutate({ phone: phoneNumber, otp })
  }

  // OTP Verification Screen
  if (showOtpInput) {
    return (
      <AuthLayout title="Verify Your Phone">
        <AuthCard>
          <div className="text-center mb-8 space-y-4">
            {/* Icon with animated glow */}
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                <Shield className="h-10 w-10 text-primary animate-pulse" />
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Verify Your Phone
              </h1>
              <p className="text-muted-foreground">
                Enter the 6-digit code sent to
              </p>
              <p className="font-semibold text-primary mt-1">
                {phoneNumber}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <OTPInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={handleVerifyOtp}
              error={verifyOTP.isError}
              autoFocus
            />

            {/* Verify Button */}
            <Button
              type="button"
              onClick={handleVerifyOtp}
              fullWidth
              isLoading={verifyOTP.isPending}
              disabled={otp.length !== 6}
              icon={<CheckCircle2 className="h-5 w-5" />}
            >
              Verify & Sign In
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => requestOTP.mutate(phoneNumber)}
                disabled={requestOTP.isPending}
                className="text-sm text-primary hover:underline disabled:opacity-50 font-medium transition-all hover:scale-105"
              >
                {requestOTP.isPending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            {/* Change Phone Number */}
            <div className="text-center pt-4 border-t border-border/50">
              <button
                type="button"
                onClick={() => {
                  setShowOtpInput(false)
                  setOtp('')
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <span>←</span> Change phone number
              </button>
            </div>

            {/* Signup Link */}
            <div className="text-center text-sm pt-2">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    )
  }

  // Main Login Screen
  return (
    <AuthLayout title="Welcome Back">
      <AuthCard>
        <div className="text-center mb-8">
          {/* Welcome Animation */}
          <div className="inline-block mb-4">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to access your account
          </p>
        </div>

        {/* Authentication Method Toggle */}
        <div className="relative flex gap-2 p-1.5 bg-muted/50 rounded-xl mb-6 border border-border/50">
          {/* Sliding background */}
          <div
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.25rem)] bg-background shadow-md rounded-lg transition-all duration-300 ease-out ${
              authMethod === 'password' ? 'left-1.5' : 'left-[calc(50%+0.25rem)]'
            }`}
          />
          
          <button
            type="button"
            onClick={() => setAuthMethod('password')}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              authMethod === 'password'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="h-4 w-4" />
            Password
          </button>
          <button
            type="button"
            onClick={() => setAuthMethod('otp')}
            className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              authMethod === 'otp'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            OTP
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number */}
          <PhoneInput
            label="Phone Number"
            placeholder="712 345 678"
            value={phoneNumber}
            onChange={setPhoneNumber}
            required
            defaultCountry="KE"
          />

          {/* Password Field (only for password auth) */}
          {authMethod === 'password' && (
            <div className="animate-fade-in">
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
            </div>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring transition-all"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Remember me
              </span>
            </label>
            {authMethod === 'password' && (
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline font-medium transition-all hover:scale-105"
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
          <div className="text-center text-sm pt-4 border-t border-border/50">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </AuthCard>

      <style>{`
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
