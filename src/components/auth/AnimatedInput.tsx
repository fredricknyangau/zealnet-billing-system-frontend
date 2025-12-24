import React, { useState, forwardRef, useEffect } from 'react'
import { Eye, EyeOff, Check, AlertCircle, Sparkles } from 'lucide-react'

interface AnimatedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  error?: string
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
  hint?: string
  // Support both onChange patterns
  onChange?: ((value: string) => void) | React.ChangeEventHandler<HTMLInputElement>
}

export const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ label, error, success, leftIcon, rightIcon, showPasswordToggle, type, className = '', onChange, hint, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

    const inputType = showPasswordToggle && showPassword ? 'text' : type

    // Trigger success animation when success prop changes to true
    useEffect(() => {
      if (success && !showSuccessAnimation) {
        setShowSuccessAnimation(true)
        setTimeout(() => setShowSuccessAnimation(false), 1000)
      }
    }, [success])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      
      if (onChange) {
        const onChangeHandler = onChange as any
        if (onChangeHandler.length === 1) {
          onChangeHandler(e.target.value)
        } else {
          onChangeHandler(e)
        }
      }
    }

    return (
      <div className="relative">
        {/* Input container */}
        <div
          className={`relative rounded-xl border-2 transition-all duration-300 ${
            error
              ? 'border-destructive bg-destructive/5 shadow-lg shadow-destructive/10'
              : success
              ? 'border-success bg-success/5 shadow-lg shadow-success/10'
              : isFocused
              ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
              : 'border-border hover:border-border/80 bg-muted/30'
          }`}
        >
          {/* Wave effect on focus */}
          {isFocused && !error && !success && (
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-wave" />
            </div>
          )}

          {/* Success particle effect */}
          {showSuccessAnimation && (
            <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="absolute h-3 w-3 text-success animate-particle"
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '50%',
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Left icon */}
          {leftIcon && (
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none ${
              isFocused || hasValue || props.value
                ? 'text-primary scale-110'
                : 'text-muted-foreground scale-100'
            }`}>
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={`w-full px-4 ${leftIcon ? 'pl-12' : ''} ${
              showPasswordToggle || success || rightIcon || error ? 'pr-12' : ''
            } pt-6 pb-2 bg-transparent text-foreground placeholder-transparent focus:outline-none transition-all duration-300 ${className}`}
            placeholder={label}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            {...props}
          />

          {/* Floating label */}
          <label
            className={`absolute left-4 ${leftIcon ? 'left-12' : ''} transition-all duration-300 pointer-events-none font-medium ${
              isFocused || hasValue || props.value
                ? 'top-2 text-xs'
                : 'top-1/2 -translate-y-1/2 text-base'
            } ${
              error
                ? 'text-destructive'
                : success
                ? 'text-success'
                : isFocused
                ? 'text-primary'
                : 'text-muted-foreground/60'
            }`}
          >
            {label}
          </label>

          {/* Right icons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Error icon */}
            {error && (
              <AlertCircle className="h-5 w-5 text-destructive animate-shake" />
            )}
            
            {/* Success icon */}
            {success && !error && (
              <div className="relative">
                <div className="absolute inset-0 bg-success/30 rounded-full blur-md animate-pulse" />
                <Check className="relative h-5 w-5 text-success animate-scale-in" />
              </div>
            )}
            
            {/* Custom right icon */}
            {rightIcon && !success && !error && (
              <div className="text-muted-foreground hover:text-foreground transition-colors">
                {rightIcon}
              </div>
            )}
            
            {/* Password toggle */}
            {showPasswordToggle && !success && !error && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 focus:outline-none"
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

          {/* Progress bar for focused state */}
          {isFocused && !error && !success && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-progress-bar" />
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(error || hint) && (
          <div className={`flex items-start gap-2 mt-2 text-sm animate-fade-in ${
            error ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {error && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
            <span>{error || hint}</span>
          </div>
        )}

        {/* Character count (for maxLength inputs) */}
        {props.maxLength && hasValue && (
          <div className="absolute -bottom-6 right-0 text-xs text-muted-foreground">
            {(props.value as string)?.length || 0} / {props.maxLength}
          </div>
        )}

        {/* Animations */}
        <style>{`
          @keyframes wave {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes scale-in {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          
          @keyframes progress-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
          
          @keyframes particle {
            0% { 
              transform: translate(0, 0) scale(0);
              opacity: 0;
            }
            50% {
              transform: translate(var(--x, 10px), -20px) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--x, 20px), -40px) scale(0);
              opacity: 0;
            }
          }
          
          @keyframes fade-in {
            from { 
              opacity: 0;
              transform: translateY(-10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-wave {
            animation: wave 2s linear infinite;
          }
          
          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }
          
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
          
          .animate-progress-bar {
            animation: progress-bar 1s ease-out;
          }
          
          .animate-particle {
            animation: particle 1s ease-out forwards;
          }
          
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>
    )
  }
)

AnimatedInput.displayName = 'AnimatedInput'
