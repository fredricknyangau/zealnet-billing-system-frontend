import React from 'react'
import { Link } from 'react-router-dom'
import { Wifi, Zap, Shield, TrendingUp } from 'lucide-react'
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
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Animated gradient background with particles */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-cyan-500/20 to-accent/20 dark:from-primary/10 dark:via-cyan-600/10 dark:to-accent/10">
          {/* Animated orbs */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* Dot pattern overlay */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground) / 0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gradient mesh overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
      </div>

      {/* Left side - Branding (hidden on mobile) */}
      {showBranding && (
        <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12">
          <div className="max-w-md space-y-10 animate-fade-in-up">
            {/* Logo with glow */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl group-hover:bg-primary/50 transition-all duration-500" />
                {/* Icon container */}
                <div className="relative p-3 bg-gradient-to-br from-primary/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <Wifi className="h-8 w-8 text-primary" />
                </div>
              </div>
              <span className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                WiFi Billing
              </span>
            </Link>

            {/* Tagline */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                Seamless WiFi Access Management
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Manage your WiFi billing, track usage, and provide exceptional service to your customers.
              </p>
            </div>

            {/* Features with animated icons */}
            <div className="space-y-4">
              {[
                { icon: Zap, text: 'Real-time usage tracking', delay: 0 },
                { icon: TrendingUp, text: 'Flexible pricing plans', delay: 100 },
                { icon: Shield, text: 'Automated billing', delay: 200 },
                { icon: Wifi, text: 'Multi-tenant support', delay: 300 },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 group/feature cursor-default"
                  style={{ animationDelay: `${feature.delay}ms` }}
                >
                  {/* Icon with backdrop */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover/feature:bg-primary/40 transition-all duration-300" />
                    <div className="relative p-2 bg-primary/10 rounded-lg border border-primary/20 group-hover/feature:scale-110 group-hover/feature:border-primary/40 transition-all duration-300">
                      <feature.icon className="h-5 w-5 text-primary group-hover/feature:rotate-12 transition-transform duration-300" />
                    </div>
                  </div>
                  {/* Text */}
                  <span className="text-muted-foreground group-hover/feature:text-foreground transition-colors duration-300">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              {[
                { value: '10K+', label: 'Users' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
              ].map((stat, index) => (
                <div key={index} className="text-center group/stat cursor-default">
                  <div className="text-2xl font-bold bg-gradient-to-br from-primary to-cyan-500 bg-clip-text text-transparent group-hover/stat:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Right side - Form */}
      <div className={`flex-1 relative z-10 flex items-center justify-center p-6 ${showBranding ? 'lg:w-1/2' : 'w-full'}`}>
        <div className="w-full max-w-md space-y-6 animate-fade-in-right">
          {/* Header - Mobile only logo */}
          {showBranding && (
            <div className="lg:hidden text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 group">
                <div className="p-2 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
                <span className="text-2xl font-bold">WiFi Billing</span>
              </Link>
            </div>
          )}

          {/* Page title */}
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

      {/* Add required animations to global CSS */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 10px) scale(1.05); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
