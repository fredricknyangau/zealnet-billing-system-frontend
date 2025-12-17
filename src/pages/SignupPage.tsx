import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { 
  User, 
  Mail, 
  Smartphone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Shield
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface PasswordStrength {
  score: number
  label: string
  color: string
}

export const SignupPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  
  // Removed OTP state - using direct password signup

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: 'Weak', color: 'text-danger' }
    if (score <= 3) return { score, label: 'Fair', color: 'text-warning' }
    if (score <= 4) return { score, label: 'Good', color: 'text-primary' }
    return { score, label: 'Strong', color: 'text-success' }
  }

  const passwordStrength = calculatePasswordStrength(formData.password)

  // Validation
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Please enter your full name')
      return false
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }
    if (!formData.phone.trim() || !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number')
      return false
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }
    if (!/[A-Z]/.test(formData.password)) {
      toast.error('Password must contain at least one uppercase letter')
      return false
    }
    if (!/[a-z]/.test(formData.password)) {
      toast.error('Password must contain at least one lowercase letter')
      return false
    }
    if (!/\d/.test(formData.password)) {
      toast.error('Password must contain at least one number')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    if (!acceptedTerms) {
      toast.error('Please accept the terms and conditions')
      return false
    }
    return true
  }

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async () => {
      return await api.signup(formData.name, formData.email, formData.phone, formData.password)
    },
    onSuccess: (data) => {
      // Don't auto-login, redirect to login page
      toast.success('Account created successfully! Please log in.', {
        icon: '✨',
        duration: 4000,
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          color: '#10b981',
        },
      })
      // Redirect to login page
      navigate('/login')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Registration failed')
    },
  })

  // Verify OTP mutation - REMOVED, using direct password signup
  // const verifyOtpMutation = useMutation({ ... })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      registerMutation.mutate()
    }
  }

  // Removed handleVerifyOtp - no longer needed

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Removed OTP verification screen - direct signup now

  return (
    <AuthLayout>
      <AuthCard>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">
            Join thousands of satisfied customers
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {/* Full Name */}
          <AnimatedInput
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange('name')}
            leftIcon={<User className="h-5 w-5" />}
            autoComplete="off"
            required
          />

          {/* Email */}
          <AnimatedInput
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange('email')}
            leftIcon={<Mail className="h-5 w-5" />}
            autoComplete="off"
            required
          />

          {/* Phone Number */}
          <AnimatedInput
            type="tel"
            label="Phone Number"
            placeholder="+254 700 000 000"
            value={formData.phone}
            onChange={handleChange('phone')}
            leftIcon={<Smartphone className="h-5 w-5" />}
            autoComplete="off"
            required
          />

          {/* Password */}
          <div>
            <AnimatedInput
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange('password')}
              leftIcon={<Lock className="h-5 w-5" />}
              autoComplete="new-password"
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={`font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= passwordStrength.score
                          ? passwordStrength.score <= 2
                            ? 'bg-danger'
                            : passwordStrength.score <= 3
                            ? 'bg-warning'
                            : passwordStrength.score <= 4
                            ? 'bg-primary'
                            : 'bg-success'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    {formData.password.length >= 8 ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>Uppercase and lowercase letters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/\d/.test(formData.password) ? (
                      <CheckCircle2 className="h-3 w-3 text-success" />
                    ) : (
                      <XCircle className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>At least one number</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <AnimatedInput
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            leftIcon={<Lock className="h-5 w-5" />}
            autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Eye className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
            }
            success={formData.confirmPassword && formData.password === formData.confirmPassword}
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
            required
          />

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            isLoading={registerMutation.isPending}
            icon={registerMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
            disabled={!acceptedTerms}
          >
            Create Account
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthLayout>
  )
}
