import type { Signer } from '@esign/types'

const SIGNER_FALLBACKS = [
  'var(--color-signer-1)',
  'var(--color-signer-2)',
  'var(--color-signer-3)',
  'var(--color-signer-4)',
  'var(--color-signer-5)',
  'var(--color-signer-6)',
]

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

/**
 * Avatar stack — solid colored circle per signer, white outer ring,
 * negative margin overlap. Matches the Paraph design.
 */
export function SignerChips({ signers, max = 3 }: { signers: Signer[]; max?: number }) {
  if (signers.length === 0) {
    return <span className="text-xs text-ink-subtle">No signers</span>
  }

  const visible = signers.slice(0, max)
  const extra = signers.length - visible.length

  return (
    <div className="flex items-center">
      {visible.map((s, i) => {
        const color = s.color ?? SIGNER_FALLBACKS[i % SIGNER_FALLBACKS.length]
        return (
          <span
            key={s.id}
            title={`${s.name} · ${s.email}`}
            className="relative grid size-7 place-items-center rounded-full text-[10px] font-semibold text-ink-inverse ring-2 ring-paper"
            style={{
              backgroundColor: color,
              marginLeft: i === 0 ? 0 : -8,
              zIndex: visible.length - i,
            }}
          >
            {initials(s.name)}
          </span>
        )
      })}
      {extra > 0 ? (
        <span
          className="relative grid size-7 place-items-center rounded-full bg-surface-sunken text-[10px] font-semibold text-ink-muted ring-2 ring-paper"
          style={{ marginLeft: -8 }}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  )
}
