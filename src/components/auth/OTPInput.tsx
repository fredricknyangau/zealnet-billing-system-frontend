import React, { useRef, useState, KeyboardEvent, ClipboardEvent, useEffect } from 'react'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  disabled?: boolean
  error?: boolean
  autoFocus?: boolean
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  // Store the latest onComplete callback in a ref to avoid infinite re-renders
  const onCompleteRef = useRef(onComplete)
  
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  useEffect(() => {
    if (value.length === length && onCompleteRef.current) {
      onCompleteRef.current(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, length]) // Only depend on value and length, not the callback

  const focusInput = (index: number) => {
    if (index >= 0 && index < length && inputRefs.current[index]) {
      inputRefs.current[index]?.focus()
      setActiveIndex(index)
    }
  }

  const handleChange = (index: number, inputValue: string) => {
    if (disabled) return

    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1)
    
    if (digit) {
      const newValue = value.split('')
      newValue[index] = digit
      const finalValue = newValue.join('').slice(0, length)
      onChange(finalValue)
      
      // Auto-focus next input
      if (index < length - 1) {
        focusInput(index + 1)
      }
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault()
      const newValue = value.split('')
      
      if (newValue[index]) {
        // Delete current digit
        newValue[index] = ''
        onChange(newValue.join(''))
      } else if (index > 0) {
        // Move to previous and delete
        newValue[index - 1] = ''
        onChange(newValue.join(''))
        focusInput(index - 1)
      }
    }
    
    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusInput(index - 1)
    }
    
    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      focusInput(index + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return

    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasteData)
    
    // Focus the next empty input or the last one
    const nextIndex = pasteData.length < length ? pasteData.length : length - 1
    focusInput(nextIndex)
  }

  const getInputValue = (index: number) => {
    return value[index] || ''
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 sm:gap-3 justify-center">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={getInputValue(index)}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            disabled={disabled}
            className={`
              w-12 h-14 sm:w-14 sm:h-16 
              text-center text-2xl font-bold 
              rounded-xl border-2 
              transition-all duration-300
              focus:outline-none
              ${error
                ? 'border-destructive bg-destructive/5 text-destructive animate-shake'
                : activeIndex === index
                ? 'border-primary bg-primary/5 scale-105 shadow-lg shadow-primary/20 ring-4 ring-primary/10'
                : value[index]
                ? 'border-success bg-success/5 text-success'
                : 'border-border bg-muted/30 hover:border-border/80'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Success animation particles */}
      {value.length === length && !error && (
        <div className="flex justify-center gap-2">
          {[...Array(length)].map((_, i) => (
            <div
              key={i}
              className="h-1 w-1 rounded-full bg-success animate-ping"
              style={{ animationDelay: `${i * 100}ms`, animationDuration: '1s' }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
