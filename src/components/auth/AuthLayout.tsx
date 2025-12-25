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
    <div className="min-h-screen w-full bg-background">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Simple background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />

      {/* Main content */}
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row">
        {/* Branding - Hidden on mobile, left side on desktop */}
        {showBranding && (
          <div className="hidden lg:flex lg:w-2/5 xl:w-1/2 bg-gradient-to-br from-primary/10 to-accent/10 p-8 xl:p-12 flex-col justify-center">
            <div className="max-w-lg mx-auto space-y-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="p-3 bg-primary/20 rounded-xl border border-primary/30 group-hover:scale-110 transition-transform">
                  <Wifi className="h-8 w-8 text-primary" />
                </div>
                <span className="text-3xl font-bold">ZealNet</span>
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

              {/* Simple stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form section */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6">
            {/* Mobile logo */}
            {showBranding && (
              <div className="lg:hidden text-center">
                <Link to="/" className="inline-flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
                    <Wifi className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-2xl font-bold">ZealNet</span>
                </Link>
              </div>
            )}

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {/* Form content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
