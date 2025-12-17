import React from 'react'
import { Button } from './Button'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  variant?: 'default' | 'no-results' | 'error'
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'no-results':
        return 'text-muted-foreground'
      case 'error':
        return 'text-danger'
      default:
        return 'text-primary'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {Icon && (
        <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4 ${getVariantStyles()}`}>
          <Icon className="w-8 h-8" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      
      {action && (
        <Button
          onClick={action.onClick}
          icon={action.icon ? <action.icon className="h-4 w-4" /> : undefined}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
