import React from 'react'
import { AlertTriangle, TrendingDown, Users, Lightbulb, X } from 'lucide-react'
import { Badge } from './ui/Badge'
import { Card, CardContent } from './ui/Card'
import type { AIInsight } from '@/types'

interface AIInsightCardProps {
  insight: AIInsight
  onDismiss?: (id: string) => void
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight, onDismiss }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'revenue_drop':
        return <TrendingDown className="h-5 w-5" />
      case 'churn_risk':
        return <Users className="h-5 w-5" />
      case 'fraud_warning':
        return <AlertTriangle className="h-5 w-5" />
      case 'recommendation':
        return <Lightbulb className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getColorClasses = () => {
    switch (insight.severity) {
      case 'critical':
        return 'bg-danger-50 dark:bg-danger-900/20 border-danger-500 text-danger-700 dark:text-danger-300'
      case 'warning':
        return 'bg-warning-50 dark:bg-warning-900/20 border-warning-500 text-warning-700 dark:text-warning-300'
      case 'info':
      default:
        return 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300'
    }
  }

  return (
    <Card className={`border-l-4 ${getColorClasses()}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`mt-0.5 ${getColorClasses().split(' ')[0]}`}>{getIcon()}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{insight.title}</h4>
                <Badge
                  variant={
                    insight.severity === 'critical'
                      ? 'danger'
                      : insight.severity === 'warning'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                >
                  {insight.severity}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{insight.message}</p>
              {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  {Object.entries(insight.metadata).map(([key, value]) => (
                    <span key={key} className="mr-3">
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          {onDismiss && (
            <button
              onClick={() => onDismiss(insight.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

