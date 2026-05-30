import type { ReactNode } from 'react'

interface AuthFormShellProps {
  title: string
  description?: string
  eyebrow?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthFormShell({
  title,
  description,
  eyebrow,
  children,
  footer,
}: AuthFormShellProps) {
  return (
    <div>
      <div className="mb-7">
        {eyebrow ? (
          <div className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-brand-strong">
            {eyebrow}
          </div>
        ) : null}
        <h2 className="m-0 text-[26px] font-semibold leading-[1.2] tracking-[-0.015em] text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-[14.5px] leading-[1.5] text-ink-muted">{description}</p>
        ) : null}
      </div>
      <div>{children}</div>
      {footer ? <div className="mt-7 text-sm text-ink-muted">{footer}</div> : null}
    </div>
  )
}
