'use client'

import { CheckCircle2, XCircle, Clock, Eye } from 'lucide-react'
import type { Signer } from '@esign/types'
import { Badge, Card } from '@esign/ui'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

type SignerTone = 'signed' | 'declined' | 'viewed' | 'pending'

function toneFor(s: Signer): SignerTone {
  if (s.signedAt) return 'signed'
  if (s.declinedAt) return 'declined'
  if (s.viewedAt) return 'viewed'
  return 'pending'
}

const TONE_META: Record<
  SignerTone,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  signed: { label: 'Signed', className: 'text-success-strong', Icon: CheckCircle2 },
  declined: { label: 'Declined', className: 'text-danger-strong', Icon: XCircle },
  viewed: { label: 'Viewed', className: 'text-warning-strong', Icon: Eye },
  pending: { label: 'Awaiting', className: 'text-ink-subtle', Icon: Clock },
}

interface SignersTabProps {
  signers: Signer[]
}

export function SignersTab({ signers }: SignersTabProps) {
  const completed = signers.filter((s) => s.signedAt).length

  return (
    <Card className="overflow-hidden p-0 shadow-[var(--shadow-1)]">
      <div className="flex items-baseline justify-between border-b border-border-subtle px-5 py-3.5">
        <h2 className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
          Signers · {completed} of {signers.length} complete
        </h2>
      </div>

      {signers.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-ink-muted">
          No signers configured.
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5 p-5">
          {signers.map((s) => {
            const tone = toneFor(s)
            const meta = TONE_META[tone]
            const ToneIcon = meta.Icon
            return (
              <li
                key={s.id}
                className="flex items-center gap-3 rounded-sm border border-border-subtle bg-surface px-3 py-2.5 transition-colors hover:bg-surface-raised"
              >
                <span
                  aria-hidden
                  className="grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-ink-inverse"
                  style={{ backgroundColor: s.color ?? 'var(--color-signer-1)' }}
                >
                  {initials(s.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="truncate text-[13.5px] font-medium text-ink">
                      {s.name}
                    </span>
                    {s.order !== undefined ? (
                      <Badge variant="outline" className="font-mono text-[10px]">
                        #{s.order}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="truncate text-xs text-ink-subtle">{s.email}</div>
                  {s.declineReason ? (
                    <div className="mt-1.5 rounded-xs bg-danger-soft/50 px-2 py-1 text-xs text-danger-strong">
                      Reason: {s.declineReason}
                    </div>
                  ) : null}
                </div>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${meta.className}`}
                >
                  <ToneIcon className="size-3.5" strokeWidth={1.5} />
                  {meta.label}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
