import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { RefreshCw, Home, Mail } from 'lucide-react'

export const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate()
  const [isRetrying, setIsRetrying] = React.useState(false)
  const errorId = React.useMemo(() => `ERR-${Date.now().toString(36).toUpperCase()}`, [])

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-danger/20 mb-4">500</h1>
          <div className="w-32 h-32 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-16 h-16 text-danger/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl sm:text-4xl font-bold font-display mb-4">
          Server Error
        </h2>
        <p className="text-lg text-muted-foreground mb-2">
          Oops! Something went wrong on our end.
        </p>
        <p className="text-muted-foreground mb-8">
          Our team has been notified and we're working to fix the issue.
        </p>

        {/* Error ID */}
        <div className="inline-block bg-muted px-4 py-2 rounded-lg mb-8">
          <p className="text-sm text-muted-foreground">
            Error ID: <span className="font-mono font-semibold text-foreground">{errorId}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please reference this ID when contacting support
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button
            variant="primary"
            size="lg"
            onClick={handleRetry}
            isLoading={isRetrying}
            icon={<RefreshCw className="h-5 w-5" />}
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/')}
            icon={<Home className="h-5 w-5" />}
          >
            Go to Home
          </Button>
        </div>

        {/* What You Can Do */}
        <div className="border-t border-border pt-8 text-left max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-center">What you can do:</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Wait a few moments and try refreshing the page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Check your internet connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Try accessing the page from a different browser</span>
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="mt-8 p-6 bg-muted/30 rounded-lg">
          <h3 className="font-semibold mb-2">Still having issues?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Our support team is here to help you get back on track.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate('/contact')}
            icon={<Mail className="h-4 w-4" />}
          >
            Contact Support
          </Button>
        </div>

        {/* Status Page Link */}
        <p className="text-sm text-muted-foreground mt-6">
          Check our{' '}
          <a href="https://status.example.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            system status page
          </a>{' '}
          for any ongoing issues
        </p>
      </div>
    </div>
  )
}
