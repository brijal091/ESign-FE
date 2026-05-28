import * as React from 'react'
import { cn } from '../utils'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  body?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      {icon ? <div className="mb-5">{icon}</div> : null}
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      {body ? <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-muted">{body}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
