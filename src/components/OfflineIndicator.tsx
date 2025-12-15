import React from 'react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'
import { Badge } from './ui/Badge'

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <Badge variant="warning" size="md" className="flex items-center gap-2 shadow-lg">
        <WifiOff className="h-4 w-4" />
        Offline Mode - Some features may be limited
      </Badge>
    </div>
  )
}

