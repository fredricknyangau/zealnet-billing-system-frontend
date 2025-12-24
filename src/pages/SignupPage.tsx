import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Sparkles
} from 'lucide-react'
import { api } from '@/lib/api'
import { extractErrorMessage } from '@/lib/utils'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { AuthCard } from '@/components/auth/AuthCard'
import { AnimatedInput } from '@/components/auth/AnimatedInput'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { validateE164 } from '@/lib/countries'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

interface PasswordStrength {
  score: number
  label: string
  color: string
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate()

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

  // Password strength calculation
  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { score, label: 'Weak', color: 'bg-destructive' }
    if (score <= 3) return { score, label: 'Fair', color: 'bg-warning' }
    if (score <= 4) return { score, label: 'Good', color: 'bg-primary' }
    return { score, label: 'Strong', color: 'bg-success' }
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
    if (!formData.phone.trim() || !validateE164(formData.phone)) {
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
    onSuccess: () => {
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
      navigate('/login')
    },
    onError: (error: any) => {
      const msg = extractErrorMessage(error, 'Registration failed')
      toast.error(msg)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      registerMutation.mutate()
    }
  }

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AuthLayout title="Create Your Account">
      <AuthCard>
        <div className="text-center mb-8">
          {/* Icon */}
          <div className="inline-block mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-primary/20 to-cyan-500/20 rounded-full flex items-center justify-center border border-primary/30">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Create Your Account
          </h1>
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
            success={formData.name.trim().length > 2}
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
            success={/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
            required
          />

          {/* Phone Number */}
          <PhoneInput
            label="Phone Number"
            placeholder="712 345 678"
            value={formData.phone}
            onChange={handleChange('phone')}
            required
            defaultCountry="KE"
          />

          {/* Password */}
          <div className="space-y-3">
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
              <div className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Password strength:</span>
                  <span className={`font-semibold ${
                    passwordStrength.score <= 2 ? 'text-destructive' :
                    passwordStrength.score <= 3 ? 'text-warning' :
                    passwordStrength.score <= 4 ? 'text-primary' : 'text-success'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                
                {/* Strength bars */}
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        level <= passwordStrength.score
                          ? passwordStrength.color
                          : 'bg-muted'
                      }`}
                      style={{
                        transform: level <= passwordStrength.score ? 'scaleY(1)' : 'scaleY(0.5)',
                      }}
                    />
                  ))}
                </div>
                
                {/* Requirements checklist */}
                <div className="text-xs space-y-1.5 pt-2">
                  <div className={`flex items-center gap-2 transition-colors ${
                    formData.password.length >= 8 ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {formData.password.length >= 8 ? (
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${
                    /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? (
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    )}
                    <span>Uppercase and lowercase letters</span>
                  </div>
                  <div className={`flex items-center gap-2 transition-colors ${
                    /\d/.test(formData.password) ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {/\d/.test(formData.password) ? (
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
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
            success={!!(formData.confirmPassword && formData.password === formData.confirmPassword)}
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : undefined}
            required
          />

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border/50">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring transition-all"
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline font-medium">
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
          <div className="text-center text-sm pt-4 border-t border-border/50">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
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
