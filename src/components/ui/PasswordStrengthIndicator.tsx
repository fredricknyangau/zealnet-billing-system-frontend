import React from 'react'
import { Check, X } from 'lucide-react'

interface PasswordStrengthIndicatorProps {
  password: string
  showRequirements?: boolean
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const requirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /[0-9]/.test(p) },
  { label: 'Contains special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
]

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showRequirements = true,
}) => {
  const metRequirements = requirements.filter((req) => req.test(password))
  const strength = metRequirements.length

  const getStrengthLabel = () => {
    if (strength === 0) return 'No password'
    if (strength <= 2) return 'Weak'
    if (strength <= 3) return 'Fair'
    if (strength <= 4) return 'Good'
    return 'Strong'
  }

  const getStrengthColor = () => {
    if (strength === 0) return 'bg-muted'
    if (strength <= 2) return 'bg-danger'
    if (strength <= 3) return 'bg-warning'
    if (strength <= 4) return 'bg-accent'
    return 'bg-success'
  }

  const getStrengthTextColor = () => {
    if (strength === 0) return 'text-muted-foreground'
    if (strength <= 2) return 'text-danger'
    if (strength <= 3) return 'text-warning'
    if (strength <= 4) return 'text-accent'
    return 'text-success'
  }

  return (
    <div className="space-y-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Password strength:</span>
          <span className={`font-medium ${getStrengthTextColor()}`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / requirements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      {showRequirements && password.length > 0 && (
        <div className="space-y-1 pt-2">
          {requirements.map((req, index) => {
            const isMet = req.test(password)
            return (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm ${
                  isMet ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                {isMet ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <X className="w-4 h-4" />
                )}
                <span>{req.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
