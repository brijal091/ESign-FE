import type { ReactNode } from 'react'

interface AuthFormShellProps {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthFormShell({ title, description, children, footer }: AuthFormShellProps) {
  return (
    <div className="space-y-7">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold leading-snug tracking-tight text-ink">{title}</h2>
        {description ? (
          <p className="text-base leading-normal text-ink-muted">{description}</p>
        ) : null}
      </div>
      <div>{children}</div>
      {footer ? <div className="text-sm text-ink-muted">{footer}</div> : null}
    </div>
  )
}
