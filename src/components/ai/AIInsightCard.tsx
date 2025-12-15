
import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TrendingDown, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react'
import { motion } from 'framer-motion'

export type InsightType = 'revenue_drop' | 'churn_risk' | 'growth_opportunity' | 'network_anomaly'

interface AIInsightProps {
  type: InsightType
  title: string
  description: string
  metric?: string
  change?: number
  confidence: number
  onDismiss?: () => void
}

export const AIInsightCard: React.FC<AIInsightProps> = ({
  type,
  title,
  description,
  metric,
  change,
  confidence,
  onDismiss
}) => {
  const getIcon = () => {
    switch (type) {
      case 'revenue_drop': return <TrendingDown className="h-5 w-5 text-destructive" />
      case 'churn_risk': return <AlertTriangle className="h-5 w-5 text-warning" />
      case 'growth_opportunity': return <TrendingUp className="h-5 w-5 text-success" />
      case 'network_anomaly': return <AlertTriangle className="h-5 w-5 text-destructive" />
      default: return <Lightbulb className="h-5 w-5 text-primary" />
    }
  }

  const getColor = () => {
    switch (type) {
      case 'revenue_drop': return 'border-destructive/50 bg-destructive/10'
      case 'churn_risk': return 'border-warning/50 bg-warning/10'
      case 'growth_opportunity': return 'border-success/50 bg-success/10'
      case 'network_anomaly': return 'border-destructive/50 bg-destructive/10'
      default: return 'border-primary/50 bg-primary/10'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="mb-4"
    >
      <Card className={`border-l-4 ${getColor()} overflow-hidden relative`}>
        <div className="absolute top-0 right-0 p-2 opacity-10">
           {getIcon()}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${getColor()} bg-opacity-50`}>
              {getIcon()}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-foreground">{title}</h4>
                <Badge variant="info" size="sm" className="text-xs">
                  {confidence}% AI Confidence
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{description}</p>
              
              {metric && (
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span>Impact: {metric}</span>
                  {change && (
                    <span className={change > 0 ? 'text-success' : 'text-destructive'}>
                      {change > 0 ? '+' : ''}{change}%
                    </span>
                  )}
                </div>
              )}
            </div>
            {onDismiss && (
                <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
                    ×
                </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
