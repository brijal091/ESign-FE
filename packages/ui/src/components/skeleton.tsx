import * as React from 'react'
import { cn } from '../utils'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string
  height?: number | string
  radius?: number | string
}

export function Skeleton({ width, height, radius = 6, className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-surface-sunken', className)}
      style={{ width, height, borderRadius: radius, ...style }}
      {...props}
    />
  )
}
