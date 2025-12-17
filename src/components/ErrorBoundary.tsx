import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logError } from '@/lib/monitoring'
import { isDevelopment } from '@/lib/env'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to monitoring service
    logError(error, {
      extra: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
    })

    // Update state with error info
    this.setState({
      errorInfo,
    })

    // Log to console in development
    if (isDevelopment()) {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}

/**
 * Default Error Fallback UI
 */
interface ErrorFallbackProps {
  error: Error | null
  onReset: () => void
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onReset }) => {
  const isDev = isDevelopment()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-danger"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-center mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground text-center mb-6">
            We're sorry for the inconvenience. The application encountered an unexpected error.
          </p>

          {/* Error Details (Development Only) */}
          {isDev && error && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">Error Details (Dev Only):</p>
              <p className="text-xs text-danger font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onReset}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
            >
              Go to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              Reload Page
            </button>
          </div>

          {/* Support Link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            If this problem persists,{' '}
            <a href="/contact" className="text-primary hover:underline">
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
