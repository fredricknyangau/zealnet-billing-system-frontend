import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Lightbulb, TrendingUp, DollarSign, Users } from 'lucide-react'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Button } from './ui/Button'
import { Skeleton } from './ui/Skeleton'


export const AIRecommendations: React.FC = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => api.getNetworkMetrics(),
  })

  const recommendations = metrics?.alerts?.filter((alert) => alert.type === 'recommendation') || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 mb-2" />
          <Skeleton className="h-20" />
        </CardContent>
      </Card>
    )
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary-600" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No recommendations at this time
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary-600" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {recommendation.metadata?.category === 'revenue' ? (
                    <DollarSign className="h-5 w-5 text-primary-600" />
                  ) : recommendation.metadata?.category === 'users' ? (
                    <Users className="h-5 w-5 text-primary-600" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {recommendation.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {recommendation.message}
                  </p>
                  {recommendation.metadata?.action && (
                    <Button size="sm" variant="outline">
                      {recommendation.metadata.action}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

