/**
 * Monitoring and Error Tracking Utilities
 * 
 * Provides infrastructure for error logging, performance monitoring,
 * and user tracking. Prepared for Sentry integration.
 */

import { isDevelopment, isProduction } from './env'

interface ErrorContext {
  user?: {
    id?: string
    email?: string
    role?: string
  }
  tags?: Record<string, string>
  extra?: Record<string, any>
}

interface PerformanceMetric {
  name: string
  value: number
  tags?: Record<string, string>
}

class MonitoringService {
  private static instance: MonitoringService
  private isInitialized = false

  private constructor() {
    this.initialize()
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  private initialize() {
    if (this.isInitialized) return

    // TODO: Initialize Sentry when DSN is available
    // Sentry.init({
    //   dsn: import.meta.env.VITE_SENTRY_DSN,
    //   environment: import.meta.env.MODE,
    //   enabled: isProduction(),
    //   tracesSampleRate: 1.0,
    // })

    this.isInitialized = true
  }

  /**
   * Log an error with context
   */
  public logError(error: Error, context?: ErrorContext): void {
    // In development, log to console
    if (isDevelopment()) {
      console.error('Error logged:', error, context)
    }

    // In production, send to Sentry
    if (isProduction()) {
      // TODO: Send to Sentry
      // Sentry.captureException(error, {
      //   user: context?.user,
      //   tags: context?.tags,
      //   extra: context?.extra,
      // })
      
      // Fallback: log to console in production for now
      console.error('Production error:', error.message, context)
    }
  }

  /**
   * Log a message (non-error)
   */
  public logMessage(message: string, level: 'info' | 'warning' | 'debug' = 'info', context?: ErrorContext): void {
    if (isDevelopment()) {
      console[level === 'warning' ? 'warn' : 'log'](`[${level.toUpperCase()}]`, message, context)
    }

    if (isProduction() && level !== 'debug') {
      // TODO: Send to Sentry
      // Sentry.captureMessage(message, {
      //   level,
      //   user: context?.user,
      //   tags: context?.tags,
      //   extra: context?.extra,
      // })
    }
  }

  /**
   * Set user context for error tracking
   */
  public setUser(user: { id: string; email?: string; role?: string } | null): void {
    if (!user) {
      // TODO: Clear Sentry user
      // Sentry.setUser(null)
      return
    }

    // TODO: Set Sentry user
    // Sentry.setUser({
    //   id: user.id,
    //   email: user.email,
    //   role: user.role,
    // })
  }

  /**
   * Add breadcrumb for debugging
   */
  public addBreadcrumb(message: string, category: string, data?: Record<string, any>): void {
    if (isDevelopment()) {
      console.log(`[Breadcrumb] ${category}:`, message, data)
    }

    // TODO: Add to Sentry
    // Sentry.addBreadcrumb({
    //   message,
    //   category,
    //   data,
    //   level: 'info',
    // })
  }

  /**
   * Track performance metric
   */
  public trackPerformance(metric: PerformanceMetric): void {
    if (isDevelopment()) {
      console.log(`[Performance] ${metric.name}:`, metric.value, 'ms', metric.tags)
    }

    // TODO: Send to monitoring service
    // This could be Sentry, DataDog, New Relic, etc.
  }

  /**
   * Track page view
   */
  public trackPageView(path: string): void {
    this.addBreadcrumb(`Page view: ${path}`, 'navigation')
    
    // TODO: Send to analytics
    // Google Analytics, Mixpanel, etc.
  }

  /**
   * Track custom event
   */
  public trackEvent(eventName: string, properties?: Record<string, any>): void {
    if (isDevelopment()) {
      console.log(`[Event] ${eventName}:`, properties)
    }

    // TODO: Send to analytics
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance()

// Export convenience functions
export const logError = (error: Error, context?: ErrorContext) => monitoring.logError(error, context)
export const logMessage = (message: string, level?: 'info' | 'warning' | 'debug', context?: ErrorContext) => 
  monitoring.logMessage(message, level, context)
export const setUser = (user: { id: string; email?: string; role?: string } | null) => monitoring.setUser(user)
export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => 
  monitoring.addBreadcrumb(message, category, data)
export const trackPerformance = (metric: PerformanceMetric) => monitoring.trackPerformance(metric)
export const trackPageView = (path: string) => monitoring.trackPageView(path)
export const trackEvent = (eventName: string, properties?: Record<string, any>) => 
  monitoring.trackEvent(eventName, properties)
