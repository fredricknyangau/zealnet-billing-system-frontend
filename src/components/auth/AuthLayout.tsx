import React from 'react'
import { Link } from 'react-router-dom'
import { Wifi } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBranding?: boolean
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBranding = true,
}) => {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Animated gradient background - Theme-aware */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/20 via-cyan-600/20 to-accent/20 dark:from-primary/10 dark:via-cyan-600/10 dark:to-accent/10 animate-gradient-shift">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDI0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00ek0xMiAxNmMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHptMCAyNGMwLTIuMjEgMS43OS00IDQtNHM0IDEuNzkgNCA0LTEuNzkgNC00IDQtNC0xLjc5LTQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Left side - Branding (hidden on mobile) */}
      {showBranding && (
        <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12 text-foreground">
          <div className="max-w-md space-y-8 animate-fade-in-up">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-3 bg-primary/10 backdrop-blur-sm rounded-2xl border border-primary/20 group-hover:bg-primary/20 transition-all duration-300">
                <Wifi className="h-8 w-8 text-primary" />
              </div>
              <span className="text-3xl font-bold">WiFi Billing</span>
            </Link>

            {/* Tagline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight">
                Seamless WiFi Access Management
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your WiFi billing, track usage, and provide exceptional service to your customers.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                'Real-time usage tracking',
                'Flexible pricing plans',
                'Automated billing',
                'Multi-tenant support',
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right side - Form */}
      <div className={`flex-1 relative z-10 flex items-center justify-center p-6 ${showBranding ? 'lg:w-1/2' : 'w-full'}`}>
        <div className="w-full max-w-md space-y-6 animate-fade-in-right">
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Form content */}
          {children}
        </div>
      </div>
    </div>
  )
}
