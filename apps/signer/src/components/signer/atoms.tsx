import type { ReactNode } from 'react'
import {
  AlignLeft,
  Building2,
  Calendar,
  CaseSensitive,
  Check,
  CircleCheck,
  CircleDot,
  Clock,
  FileSignature,
  FileText,
  List,
  Mail,
  PenLine,
  PenTool,
  Phone,
  SquareCheck,
  Strikethrough,
  TextCursorInput,
  User,
  X,
} from 'lucide-react'
import { LogoWordmark } from '@esign/ui'

/* ============ Wordmark ============ */
export function Wordmark({ size = 24 }: { size?: number }) {
  return <LogoWordmark height={size} />
}

/* ============ Shell ============ */
export function SignerShell({
  top,
  bottom,
  contentBg = 'var(--color-paper)',
  children,
}: {
  top?: ReactNode
  bottom?: ReactNode
  contentBg?: string
  children: ReactNode
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface-sunken p-0 sm:p-6">
      <div
        className="flex h-screen w-full max-w-[480px] flex-col overflow-hidden font-sans text-ink sm:h-[860px] sm:rounded-xl sm:border sm:border-border sm:shadow-[var(--shadow-3)]"
        style={{ background: contentBg }}
      >
        {top}
        <div className="flex flex-1 flex-col overflow-auto">{children}</div>
        {bottom}
      </div>
    </div>
  )
}

/* ============ Top bar: logo + close ============ */
export function SignerTopLogoBar({ onClose }: { onClose?: () => void }) {
  return (
    <header className="grid h-14 shrink-0 grid-cols-[56px_1fr_56px] items-center border-b border-border-subtle bg-paper/90 backdrop-blur-md">
      <div />
      <div className="grid place-items-center">
        <Wordmark size={18} />
      </div>
      <div className="grid place-items-center">
        <button
          onClick={onClose}
          className="grid size-9 place-items-center rounded-sm text-ink-muted hover:bg-surface-hover hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>
    </header>
  )
}

/* ============ Top bar: stepper + progress ============ */
const STEPS = ['Review', 'Sign', 'Done']

export function SignerTopStepperBar({
  current = 0,
  completed = 2,
  total = 5,
  progress = 40,
  onClose,
}: {
  current?: number
  completed?: number
  total?: number
  progress?: number
  onClose?: () => void
}) {
  return (
    <header className="shrink-0 border-b border-border-subtle bg-paper/90 backdrop-blur-md">
      <div className="grid h-14 grid-cols-[1fr_auto] items-center gap-3 pl-4 pr-3.5">
        <div className="flex min-w-0 items-center gap-1 sm:gap-3.5">
          {STEPS.map((s, i) => {
            const isDone = i < current
            const isActive = i === current
            return (
              <div key={s} className="flex items-center gap-1 sm:gap-3.5">
                <span className="inline-flex shrink-0 items-center gap-1.5">
                  <span
                    className={`grid size-[18px] shrink-0 place-items-center rounded-full text-[10px] font-semibold ${
                      isActive
                        ? 'bg-brand text-ink-inverse'
                        : isDone
                          ? 'bg-success-soft text-success-strong'
                          : 'bg-surface-sunken text-ink-subtle'
                    }`}
                  >
                    {isDone ? <Check className="size-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span
                    className={`text-[12.5px] ${isActive ? 'font-semibold text-ink' : 'font-medium text-ink-muted'}`}
                  >
                    {s}
                  </span>
                </span>
                {i < STEPS.length - 1 && (
                  <span className={`h-px w-2.5 shrink-0 sm:w-7 ${isDone ? 'bg-success' : 'bg-border'}`} />
                )}
              </div>
            )
          })}
        </div>
        <button
          onClick={onClose}
          className="grid size-9 place-items-center rounded-sm text-ink-muted hover:bg-surface-hover hover:text-ink"
        >
          <X className="size-5" />
        </button>
      </div>
      {/* progress bar */}
      <div className="relative h-[3px] bg-surface-sunken">
        <div className="absolute inset-y-0 left-0 bg-brand transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between px-4 py-2 text-xs">
        <span className="text-ink-muted">
          <strong className="font-semibold tabular-nums text-ink">
            {completed} of {total}
          </strong>{' '}
          fields completed
        </span>
        <span className="inline-flex items-center gap-1.5 text-ink-subtle">
          <FileText className="size-3" /> Service Agreement
        </span>
      </div>
    </header>
  )
}

/* ============ Bottom bar ============ */
export function SignerBottomBar({ children }: { children: ReactNode }) {
  return (
    <footer className="shrink-0 border-t border-border bg-surface shadow-[0_-1px_2px_oklch(0.2_0.02_60/0.04)]">
      <div className="mx-auto flex min-h-16 w-full items-center gap-2 px-4 py-2.5">{children}</div>
    </footer>
  )
}

/* ============ Hero card ============ */
export function HeroCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-[22px] shadow-[var(--shadow-1)]">{children}</div>
  )
}

export function PdfThumb() {
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-sm bg-danger-soft text-danger-strong">
      <FileText className="size-4" />
    </span>
  )
}

/* ============ Checkbox ============ */
export function Checkbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean
  onChange?: (v: boolean) => void
  children: ReactNode
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-ink">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        className={`mt-px grid size-[18px] shrink-0 place-items-center rounded-xs border transition-colors ${
          checked ? 'border-brand bg-brand text-ink-inverse' : 'border-border-strong bg-surface'
        }`}
      >
        {checked ? <Check className="size-3" strokeWidth={3} /> : null}
      </button>
      <span>{children}</span>
    </label>
  )
}

/* ============ Mock PDF page ============ */
const PARAS = [
  'This Service Agreement is entered into as of the date last signed below between Acme Holdings, Inc. and the undersigned counterparty.',
  '1. Scope. Recipient shall perform the services in Schedule A in a professional and workmanlike manner.',
  '2. Compensation. Company shall pay Recipient the fees in Schedule B within thirty days of each invoice.',
  '3. Term. This Agreement shall commence on the Effective Date and continue until services are complete.',
  '4. Confidentiality. Each party shall hold in confidence all proprietary information of the other.',
]

export function SignerPdfPage({ children }: { children?: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[343px] rounded-md border border-border bg-surface-raised px-8 py-6 shadow-[var(--shadow-1)]" style={{ aspectRatio: '8.5 / 11' }}>
      <div className="text-center font-display text-lg">Service Agreement</div>
      <div className="mb-3.5 mt-1 text-center font-mono text-[8px] uppercase tracking-wide text-ink-subtle">
        Acme Holdings · 2026-Q1
      </div>
      {PARAS.map((p, i) => (
        <p key={i} className="mb-2 text-[8.5px] leading-[1.7] text-ink-muted">
          {p}
        </p>
      ))}
      {children}
    </div>
  )
}

/* ============ Signer overlay field ============ */
const FIELD_ICON: Record<string, typeof PenLine> = {
  signature: PenTool,
  initials: CaseSensitive,
  name: User,
  email: Mail,
  phone: Phone,
  company: Building2,
  text: TextCursorInput,
  multiline_text: AlignLeft,
  checkbox: SquareCheck,
  radio: CircleDot,
  selection: List,
  date: Calendar,
  strikethrough: Strikethrough,
}

export function SignerField({
  x,
  y,
  w,
  h,
  type = 'signature',
  state = 'empty',
  value,
  label,
  required = true,
  onClick,
}: {
  x: number
  y: number
  w: number
  h: number
  type?: string
  state?: 'empty' | 'filled' | 'active'
  value?: string
  label?: string
  required?: boolean
  onClick?: () => void
}) {
  const isFilled = state === 'filled'
  const isActive = state === 'active'
  const isEmpty = state === 'empty'
  const Icon = FIELD_ICON[type] ?? PenLine

  const border = isFilled
    ? '1.5px solid var(--color-success)'
    : isActive
      ? '2px solid var(--color-brand)'
      : '1.5px dashed var(--color-brand)'
  const bg = isFilled
    ? 'var(--color-success-soft)'
    : isActive
      ? 'var(--color-brand-soft)'
      : 'color-mix(in oklch, var(--color-brand) 8%, var(--color-surface))'
  const glow = (isEmpty && required) || isActive ? '0 0 0 4px oklch(0.665 0.155 38 / 0.18)' : 'none'

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute flex items-center gap-1.5 overflow-hidden rounded-xs px-2 text-[11px] font-medium"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        border,
        background: bg,
        boxShadow: glow,
        color: isFilled ? 'var(--color-success-strong)' : 'var(--color-brand-strong)',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {isFilled ? (
        <>
          <CircleCheck className="size-3.5 shrink-0" style={{ color: 'var(--color-success-strong)' }} />
          <span
            className="truncate"
            style={{
              fontFamily: type === 'signature' ? 'var(--font-display)' : 'var(--font-sans)',
              fontStyle: type === 'signature' ? 'italic' : 'normal',
              fontSize: type === 'signature' ? 16 : 11,
            }}
          >
            {value}
          </span>
        </>
      ) : (
        <>
          <Icon className="size-3.5 shrink-0" />
          <span className="flex-1 truncate text-left">{label}</span>
          {required ? (
            <span className="font-mono text-[9px] font-bold tracking-wide text-brand-strong">REQ</span>
          ) : null}
        </>
      )}
    </button>
  )
}

export { FileSignature, Clock }
