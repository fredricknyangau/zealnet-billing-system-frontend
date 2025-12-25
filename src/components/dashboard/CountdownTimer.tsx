import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  initialSeconds: number
}

export function CountdownTimer({ initialSeconds }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)

  useEffect(() => {
    if (seconds <= 0) return

    const interval = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(interval)
  }, [seconds])

  const formatTime = (totalSeconds: number) => {
    if (totalSeconds <= 0) return '00:00:00'
    
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getColorClass = () => {
    if (seconds <= 300) return 'text-red-500' // Last 5 minutes
    if (seconds <= 900) return 'text-yellow-500' // Last 15 minutes
    return 'text-foreground'
  }

  return (
    <div className="flex flex-col items-center">
      <span className={`text-2xl font-bold ${getColorClass()} font-mono transition-colors`}>
        {formatTime(seconds)}
      </span>
      {seconds <= 300 && seconds > 0 && (
        <span className="text-xs text-red-500 animate-pulse mt-1">
          Expiring soon!
        </span>
      )}
      {seconds === 0 && (
        <span className="text-xs text-red-500 mt-1">
          Expired
        </span>
      )}
    </div>
  )
}
