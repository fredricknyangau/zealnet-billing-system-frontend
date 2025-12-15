import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const baseStyles = 'skeleton bg-gray-200 dark:bg-gray-700'

  const variants = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? undefined : '1rem'),
        ...style,
      }}
      {...props}
    />
  )
}

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className,
}) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        className={i < lines - 1 ? 'mb-2' : ''}
        style={{ width: i === lines - 1 ? '80%' : '100%' }}
      />
    ))}
  </div>
)

