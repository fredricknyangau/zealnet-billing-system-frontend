import React from 'react'
import { Shield, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface Device {
  id: string
  isCurrentDevice?: boolean
  lastSeen: string | Date
  loginCount?: number
  isTrusted?: boolean
}

interface DeviceTrustBadgeProps {
  device: Device
  className?: string
}

type TrustLevel = {
  label: string
  variant: 'success' | 'info' | 'warning' | 'danger' | 'default'
  icon: React.ComponentType<{ className?: string }>
  description: string
}

function calculateDaysSince(date: string | Date): number {
  const now = new Date()
  const lastSeen = new Date(date)
  const diffTime = Math.abs(now.getTime() - lastSeen.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function calculateTrustLevel(device: Device): TrustLevel {
  // Current device
  if (device.isCurrentDevice) {
    return {
      label: 'This Device',
      variant: 'success',
      icon: CheckCircle2,
      description: 'You are currently using this device'
    }
  }

  // Explicitly trusted
  if (device.isTrusted) {
    return {
      label: 'Trusted',
      variant: 'success',
      icon: Shield,
      description: 'This device has been marked as trusted'
    }
  }

  const daysSinceLastSeen = calculateDaysSince(device.lastSeen)

  // Inactive device (>30 days)
  if (daysSinceLastSeen > 30) {
    return {
      label: 'Inactive',
      variant: 'default',
      icon: Clock,
      description: `Not used in ${daysSinceLastSeen} days`
    }
  }

  // Recently used (<7 days) and frequent (>20 logins)
  if (daysSinceLastSeen < 7 && (device.loginCount || 0) > 20) {
    return {
      label: 'Trusted',
      variant: 'success',
      icon: Shield,
      description: 'Frequently used device'
    }
  }

  // Recently used but infrequent
  if (daysSinceLastSeen < 7) {
    return {
      label: 'Active',
      variant: 'info',
      icon: CheckCircle2,
      description: 'Recently used device'
    }
  }

  // Moderately inactive (7-30 days)
  if (daysSinceLastSeen < 30) {
    return {
      label: 'Active',
      variant: 'info',
      icon: Clock,
      description: `Last used ${daysSinceLastSeen} days ago`
    }
  }

  // New or unrecognized
  return {
    label: 'Verify',
    variant: 'warning',
    icon: AlertTriangle,
    description: 'New or unrecognized device'
  }
}

export const DeviceTrustBadge: React.FC<DeviceTrustBadgeProps> = ({ device, className }) => {
  const trustLevel = calculateTrustLevel(device)
  const Icon = trustLevel.icon

  return (
    <Badge 
      variant={trustLevel.variant} 
      size="sm" 
      className={className}
      title={trustLevel.description}
    >
      <Icon className="h-3 w-3 mr-1" />
      {trustLevel.label}
    </Badge>
  )
}
