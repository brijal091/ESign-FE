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

export function SignerChips({ signers }: { signers: Signer[] }) {
  if (signers.length === 0) {
    return <span className="text-xs text-ink-subtle">No signers</span>
  }

  const visible = signers.slice(0, 3)
  const extra = signers.length - visible.length

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((s, i) => {
        const color = s.color ?? SIGNER_FALLBACKS[i % SIGNER_FALLBACKS.length]
        return (
          <span
            key={s.id}
            title={s.name}
            className="grid size-7 place-items-center rounded-full border-2 border-paper bg-surface text-[10px] font-semibold leading-none text-ink shadow-[var(--shadow-1)]"
            style={{
              boxShadow: `inset 0 0 0 1.5px ${color}`,
              color,
            }}
          >
            {initials(s.name)}
          </span>
        )
      })}
      {extra > 0 ? (
        <span className="grid size-7 place-items-center rounded-full border-2 border-paper bg-surface-sunken text-[10px] font-medium text-ink-subtle">
          +{extra}
        </span>
      ) : null}
    </div>
  )
}
