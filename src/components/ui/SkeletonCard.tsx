import React from 'react'

interface SkeletonCardProps {
  variant?: 'stat' | 'list' | 'table' | 'default'
  count?: number
  className?: string
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'default',
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'stat':
        return (
          <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                <div className="h-8 bg-muted rounded w-32 animate-pulse" />
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        )

      case 'list':
        return (
          <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'table':
        return (
          <div className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}>
            <div className="p-4 border-b border-border">
              <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            </div>
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 flex items-center gap-4">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return (
          <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
            </div>
          </div>
        )
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  )
}
