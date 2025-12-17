import React, { useState, forwardRef } from 'react'
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react'

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: boolean
  leftIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, success, leftIcon, showPasswordToggle, type, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const inputType = showPasswordToggle && showPassword ? 'text' : type

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    return (
      <div className="relative">
        {/* Input container */}
        <div
          className={`relative rounded-xl border-2 transition-all duration-300 ${
            error
              ? 'border-destructive bg-destructive/10 animate-shake'
              : success
              ? 'border-success bg-success/10'
              : isFocused
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
              : 'border-border bg-muted/50'
          }`}
        >
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 ${leftIcon ? 'pl-12' : ''} ${
              showPasswordToggle || success ? 'pr-12' : ''
            } pt-6 pb-2 bg-transparent text-foreground placeholder-transparent focus:outline-none ${className}`}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            {...props}
          />

          {/* Floating label */}
          <label
            className={`absolute left-4 ${leftIcon ? 'left-12' : ''} transition-all duration-300 pointer-events-none ${
              isFocused || hasValue || props.value
                ? 'top-2 text-xs text-muted-foreground'
                : 'top-1/2 -translate-y-1/2 text-base text-muted-foreground/60'
            }`}
          >
            {label}
          </label>

          {/* Right icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {success && (
              <Check className="h-5 w-5 text-success animate-scale-in" />
            )}
            {showPasswordToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 mt-2 text-destructive text-sm animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'
