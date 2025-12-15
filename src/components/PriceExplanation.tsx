import React from 'react'
import { Info, Clock, Wifi, Database } from 'lucide-react'
import { Card, CardContent } from './ui/Card'
import type { Plan } from '@/types'
import { formatCurrency, formatBytes, formatDuration } from '@/lib/utils'

interface PriceExplanationProps {
  plan: Plan
}

export const PriceExplanation: React.FC<PriceExplanationProps> = ({ plan }) => {
  const getPlanTypeIcon = () => {
    if (plan.type === 'time') return <Clock className="h-5 w-5" />
    if (plan.type === 'data') return <Database className="h-5 w-5" />
    return <Wifi className="h-5 w-5" />
  }

  return (
    <Card className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-primary-600">{getPlanTypeIcon()}</div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              What You Get
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(plan.price, plan.currency)}
                </span>
              </div>
              {plan.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDuration(plan.duration)}
                  </span>
                </div>
              )}
              {plan.dataLimit && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Data Allowance:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatBytes(plan.dataLimit)}
                  </span>
                </div>
              )}
              {plan.speedLimit && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Speed:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Up to {plan.speedLimit} Mbps
                  </span>
                </div>
              )}
              {plan.type === 'hybrid' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  This plan includes both time and data limits. Whichever limit is reached first will
                  end your session.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

