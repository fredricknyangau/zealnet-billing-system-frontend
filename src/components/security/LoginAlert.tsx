import React, { useState, useEffect } from 'react'
import { AlertCircle, MapPin, Smartphone, Clock, X } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'

interface LoginAlertData {
  id: string
  deviceName: string
  location?: string
  ipAddress: string
  timestamp: Date
  isNewDevice: boolean
}

interface LoginAlertProps {
  alert: LoginAlertData
  onDismiss: (id: string) => void
  onRevokeSession: (id: string) => void
}

export const LoginAlert: React.FC<LoginAlertProps> = ({ alert, onDismiss, onRevokeSession }) => {
  const [isVisible, setIsVisible] = useState(true)

  // Auto-dismiss after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onDismiss(alert.id), 300)
    }, 30000)

    return () => clearTimeout(timer)
  }, [alert.id, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss(alert.id), 300)
  }

  const handleRevoke = () => {
    onRevokeSession(alert.id)
    handleDismiss()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="mb-4"
        >
          <Card className="border-warning/50 bg-warning/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-warning/10 rounded-lg flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      {alert.isNewDevice && (
                        <Badge variant="warning" size="sm">New Device</Badge>
                      )}
                      Login from {alert.deviceName}
                    </h4>
                    <button
                      onClick={handleDismiss}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Dismiss alert"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    {alert.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{alert.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-3 w-3" />
                      <span>{alert.ipAddress}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{formatDateTime(alert.timestamp)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.isNewDevice && (
                      <p className="text-sm text-warning flex-1">
                        This login is from a device we don't recognize. If this wasn't you, revoke access immediately.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDismiss}
                    >
                      This was me
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleRevoke}
                    >
                      Revoke Access
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Container component for managing multiple alerts
interface LoginAlertsContainerProps {
  className?: string
}

export const LoginAlertsContainer: React.FC<LoginAlertsContainerProps> = ({ className }) => {
  const [alerts, setAlerts] = useState<LoginAlertData[]>([])

  // Listen for new login events (would be from WebSocket in production)
  useEffect(() => {
    // Mock alert for demonstration (currently disabled)
    // const _mockAlert: LoginAlertData = {
    //   id: 'alert-' + Date.now(),
    //   deviceName: 'Chrome on Windows',
    //   location: 'Nairobi, Kenya',
    //   ipAddress: '41.90.xxx.xxx',
    //   timestamp: new Date(),
    //   isNewDevice: true
    // }

    // Uncomment to test
    // setTimeout(() => setAlerts([_mockAlert]), 2000)
  }, [])

  const handleDismiss = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id))
  }

  const handleRevokeSession = (id: string) => {
    // Call API to revoke session
    console.log('Revoking session:', id)
    // In production: api.revokeSession(id)
  }

  if (alerts.length === 0) return null

  return (
    <div className={className}>
      {alerts.map(alert => (
        <LoginAlert
          key={alert.id}
          alert={alert}
          onDismiss={handleDismiss}
          onRevokeSession={handleRevokeSession}
        />
      ))}
    </div>
  )
}
