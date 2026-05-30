import { useCallback, useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import {
  AlignLeft,
  ArrowRight,
  ArrowUp,
  Building2,
  Calendar,
  CaseSensitive,
  Check,
  CheckCircle2,
  CircleCheck,
  CircleDot,
  CircleX,
  Clock,
  Download,
  List,
  Loader2,
  Lock,
  Mail,
  PenTool,
  Phone,
  Scroll,
  ShieldCheck,
  SquareCheck,
  Strikethrough,
  TextCursorInput,
  TriangleAlert,
  User,
} from 'lucide-react'
import { toast } from '@esign/ui'
import { SignatureModal } from './components/signature/SignatureModal'
import {
  SignerShell,
  SignerTopLogoBar,
  SignerTopStepperBar,
  SignerBottomBar,
  HeroCard,
  PdfThumb,
  Checkbox,
  FileSignature,
} from './components/signer/atoms'
import {
  DateEditor,
  InlineTextEditor,
  MultilineEditor,
  SelectionEditor,
} from './components/signer/field-popovers'
import { signingApi, getToken, SigningApiError, type SignerField, type SigningDocument } from './lib/api'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PAGE_WIDTH = 343

type Screen = 'loading' | 'welcome' | 'review' | 'success' | 'declined' | 'expired' | 'error'

const TRUST = [
  { Icon: ShieldCheck, label: 'SOC 2 · AES-256' },
  { Icon: Lock, label: 'End-to-end encrypted' },
  { Icon: Scroll, label: 'Audit trail included' },
]

const SIGNATURE_TYPES = new Set(['signature', 'initials'])
const isFilled = (f: SignerField) => f.filledValue != null && f.filledValue !== ''

export function SignerFlow() {
  const [screen, setScreen] = useState<Screen>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [doc, setDoc] = useState<SigningDocument | null>(null)
  const [fields, setFields] = useState<SignerField[]>([])
  const [consented, setConsented] = useState(false)
  const [busy, setBusy] = useState(false)
  const [signatureFieldId, setSignatureFieldId] = useState<string | null>(null)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)
  const [showDecline, setShowDecline] = useState(false)
  const [numPages, setNumPages] = useState(0)

  useEffect(() => {
    if (!getToken()) {
      setScreen('error')
      setErrorMsg('This link is missing its signing token. Please use the link from your email.')
      return
    }
    signingApi
      .getDocument()
      .then((d) => {
        setDoc(d)
        setFields(d.fields)
        if (d.currentSigner.signedAt) setScreen('success')
        else setScreen('welcome')
      })
      .catch((e: SigningApiError) => {
        if (e.code === 'LINK_EXPIRED') setScreen('expired')
        else {
          setScreen('error')
          setErrorMsg(e.message)
        }
      })
  }, [])

  const completed = fields.filter(isFilled).length
  const requiredRemaining = fields.filter((f) => f.required && !isFilled(f)).length
  const progress = fields.length ? Math.round((completed / fields.length) * 100) : 0

  const applyFill = useCallback((id: string, value: string) => {
    setFields((curr) => curr.map((f) => (f.id === id ? { ...f, filledValue: value } : f)))
  }, [])

  const submitField = useCallback(
    async (id: string, value: string) => {
      try {
        await signingApi.fillField(id, value)
        applyFill(id, value)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not save field')
      }
    },
    [applyFill],
  )

  async function handleFieldTap(f: SignerField) {
    // 1. Instant-action types — no popover needed.
    if (SIGNATURE_TYPES.has(f.type)) {
      setSignatureFieldId(f.id)
      return
    }
    if (f.type === 'name' && doc && !isFilled(f)) {
      return submitField(f.id, doc.currentSigner.name)
    }
    if (f.type === 'checkbox' || f.type === 'radio' || f.type === 'strikethrough') {
      return submitField(f.id, isFilled(f) ? '' : 'true')
    }

    // 2. Editor types — open inline popover anchored to the field.
    setActiveFieldId(f.id)
  }

  function closeActiveEditor() {
    setActiveFieldId(null)
  }

  async function commitActiveEditor(value: string) {
    const id = activeFieldId
    setActiveFieldId(null)
    if (id) await submitField(id, value)
  }

  async function continueFromWelcome() {
    setBusy(true)
    try {
      await signingApi.consent()
      setScreen('review')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not continue')
    } finally {
      setBusy(false)
    }
  }

  async function finish() {
    setBusy(true)
    try {
      await signingApi.complete()
      setScreen('success')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not complete signing')
    } finally {
      setBusy(false)
    }
  }

  /* ---------- Loading ---------- */
  if (screen === 'loading') {
    return (
      <SignerShell top={<SignerTopLogoBar />}>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-ink-muted">
          <Loader2 className="size-6 animate-spin" />
          <span className="text-sm">Loading your document…</span>
        </div>
      </SignerShell>
    )
  }

  /* ---------- Error ---------- */
  if (screen === 'error') {
    return (
      <SignerShell top={<SignerTopLogoBar />}>
        <div className="flex flex-1 flex-col justify-center px-6 py-8 text-center">
          <div className="mx-auto mb-[22px] grid size-[88px] place-items-center rounded-full bg-danger-soft text-danger-strong">
            <TriangleAlert className="size-11" />
          </div>
          <h3 className="text-[22px] font-semibold tracking-tight text-ink">Something went wrong</h3>
          <p className="mx-auto mt-2.5 max-w-[320px] text-[14.5px] leading-relaxed text-ink-muted">{errorMsg}</p>
        </div>
      </SignerShell>
    )
  }

  /* ---------- Expired ---------- */
  if (screen === 'expired') {
    return (
      <SignerShell top={<SignerTopLogoBar />}>
        <div className="flex flex-1 flex-col justify-center px-6 py-8 text-center">
          <div className="mx-auto mb-[22px] grid size-[88px] place-items-center rounded-full bg-danger-soft text-danger-strong">
            <Clock className="size-11" />
          </div>
          <h3 className="text-[22px] font-semibold tracking-tight text-ink">This signing link has expired</h3>
          <p className="mx-auto mt-2.5 max-w-[320px] text-[14.5px] leading-relaxed text-ink-muted">
            Ask the sender to send a new invitation. The original document is unchanged.
          </p>
          <div className="mt-6 flex justify-center">
            <button className="inline-flex h-11 items-center gap-2 rounded-sm border border-border bg-surface px-5 text-base font-medium text-ink hover:bg-surface-hover">
              <Mail className="size-4" /> Contact the sender
            </button>
          </div>
        </div>
      </SignerShell>
    )
  }

  /* ---------- Declined ---------- */
  if (screen === 'declined') {
    return (
      <SignerShell top={<SignerTopLogoBar />}>
        <div className="flex flex-1 flex-col justify-center px-6 py-8 text-center">
          <div className="mx-auto mb-[22px] grid size-[88px] place-items-center rounded-full bg-surface-sunken text-ink-muted">
            <CircleX className="size-11" />
          </div>
          <h3 className="text-[22px] font-semibold tracking-tight text-ink">Document declined</h3>
          <p className="mx-auto mt-2.5 max-w-[320px] text-[14.5px] leading-relaxed text-ink-muted">
            We&apos;ve let the sender know you declined to sign. You can close this window.
          </p>
        </div>
      </SignerShell>
    )
  }

  /* ---------- Success ---------- */
  if (screen === 'success') {
    return (
      <SignerShell top={<SignerTopStepperBar current={2} completed={fields.length} total={fields.length} progress={100} />}>
        <div className="flex flex-1 flex-col justify-center px-5 py-8 text-center">
          <div className="relative mx-auto mb-6 grid size-24 place-items-center rounded-full bg-success-soft text-success-strong">
            <Check className="size-12" strokeWidth={2} />
            <span className="absolute -inset-3 rounded-full border" style={{ borderColor: 'color-mix(in oklch, var(--color-success) 25%, transparent)' }} />
            <span className="absolute -inset-6 rounded-full border" style={{ borderColor: 'color-mix(in oklch, var(--color-success) 12%, transparent)' }} />
          </div>
          <h2 className="text-[26px] font-semibold leading-tight tracking-tight text-ink">All signed!</h2>
          <p className="mx-auto mt-3 max-w-[360px] text-[14.5px] leading-relaxed text-ink-muted">
            Your signature has been recorded. A copy will be emailed to you once everyone has signed.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-2.5">
            <a
              href={signingApi.downloadUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-sm border border-border bg-surface text-base font-medium text-ink hover:bg-surface-hover"
            >
              <Download className="size-4" /> Download a copy
            </a>
          </div>
          <div className="mx-auto mt-9 max-w-[320px] border-t border-border-subtle pt-[18px]">
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-subtle">
              <Scroll className="size-3" /> Signed via ESign · Audit trail attached
            </div>
          </div>
        </div>
      </SignerShell>
    )
  }

  /* ---------- Welcome ---------- */
  if (screen === 'welcome' && doc) {
    return (
      <>
        <SignerShell
          top={<SignerTopLogoBar />}
          bottom={
            <SignerBottomBar>
              <div className="flex w-full flex-col gap-1.5">
                <button
                  disabled={!consented || busy}
                  onClick={continueFromWelcome}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-brand text-base font-medium text-ink-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? <Loader2 className="size-4 animate-spin" /> : <>Continue <ArrowRight className="size-4" /></>}
                </button>
                <button
                  onClick={() => setShowDecline(true)}
                  className="h-9 w-full rounded-sm text-sm font-medium text-ink-muted hover:bg-surface-hover"
                >
                  Decline
                </button>
              </div>
            </SignerBottomBar>
          }
        >
          <div className="flex flex-col gap-3.5 p-4">
            <HeroCard>
              <div className="mb-4 flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-strong">
                  <FileSignature className="size-[22px]" />
                </div>
                <div className="min-w-0">
                  <div className="mb-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-subtle">
                    Invitation to sign
                  </div>
                  <h3 className="text-xl font-semibold leading-tight tracking-tight text-ink">
                    You&apos;ve been invited to sign
                  </h3>
                </div>
              </div>
              {doc.message ? (
                <p className="m-0 text-[14.5px] leading-relaxed text-ink-muted">{doc.message}</p>
              ) : (
                <p className="m-0 text-[14.5px] leading-relaxed text-ink-muted">
                  Hi {doc.currentSigner.name}, please review and sign the document below.
                </p>
              )}
              <div className="mt-[18px] flex items-center gap-3 rounded-md bg-surface-sunken px-3.5 py-3">
                <PdfThumb />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{doc.title}</div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-ink-subtle">
                    <span>{doc.pageCount} page{doc.pageCount === 1 ? '' : 's'}</span>
                    <span className="text-border-strong">·</span>
                    <span>{fields.length} field{fields.length === 1 ? '' : 's'} to complete</span>
                  </div>
                </div>
              </div>
            </HeroCard>

            <div className="rounded-md border border-border-subtle bg-surface px-[18px] py-4">
              <div className="mb-1.5 text-[13.5px] font-semibold text-ink">Consent to electronic signature</div>
              <p className="mb-3 text-[12.5px] leading-relaxed text-ink-muted">
                By clicking <strong className="font-semibold">Continue</strong>, you agree that your electronic
                signature has the same legal effect as a handwritten signature, in accordance with the ESIGN Act and
                eIDAS.
              </p>
              <Checkbox checked={consented} onChange={setConsented}>
                I agree to use electronic signatures.
              </Checkbox>
            </div>

            <div className="mt-1 flex flex-wrap gap-2.5 px-1">
              {TRUST.map(({ Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-subtle">
                  <Icon className="size-3.5 text-brand-strong" /> {label}
                </span>
              ))}
            </div>
          </div>
        </SignerShell>
        {showDecline ? (
          <DeclineDialog
            onCancel={() => setShowDecline(false)}
            onConfirm={async (reason) => {
              setShowDecline(false)
              try {
                await signingApi.decline(reason)
                setScreen('declined')
              } catch (e) {
                toast.error(e instanceof Error ? e.message : 'Could not decline')
              }
            }}
          />
        ) : null}
      </>
    )
  }

  /* ---------- Review ---------- */
  return (
    <>
      <SignerShell
        contentBg="var(--color-surface-sunken)"
        top={<SignerTopStepperBar current={0} completed={completed} total={fields.length} progress={progress} />}
        bottom={
          <SignerBottomBar>
            <button
              onClick={() => setShowDecline(true)}
              className="grid h-10 place-items-center rounded-sm border border-border bg-surface px-3 text-sm text-ink-muted hover:bg-surface-hover"
            >
              Decline
            </button>
            <div className="flex-1 text-center text-[13px] text-ink-muted">
              <strong className="font-semibold tabular-nums text-ink">
                {completed} / {fields.length}
              </strong>{' '}
              fields
            </div>
            <button
              onClick={finish}
              disabled={requiredRemaining > 0 || busy}
              className="inline-flex h-10 min-w-[120px] items-center justify-center gap-1.5 rounded-sm bg-brand px-4 text-base font-medium text-ink-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <>Finish <CheckCircle2 className="size-4" /></>}
            </button>
          </SignerBottomBar>
        }
      >
        <div className="flex flex-col items-center gap-4 p-4 pb-6">
          <Document
            file={signingApi.pdfUrl()}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            loading={
              <div className="flex items-center gap-2 py-12 text-sm text-ink-subtle">
                <Loader2 className="size-4 animate-spin" /> Loading document…
              </div>
            }
            error={<div className="py-12 text-sm text-danger-strong">Couldn&apos;t load this document.</div>}
            className="flex flex-col items-center gap-4"
          >
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNumber) => (
              <PdfPageWithFields
                key={pageNumber}
                pageNumber={pageNumber}
                fields={fields.filter((f) => f.page === pageNumber)}
                activeFieldId={activeFieldId}
                signerEmail={doc?.currentSigner.email ?? ''}
                onFieldTap={handleFieldTap}
                onCommit={commitActiveEditor}
                onCancel={closeActiveEditor}
              />
            ))}
          </Document>

          {requiredRemaining > 0 ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-2.5 text-[13px] font-medium text-ink-inverse shadow-[var(--shadow-2)]">
              <ArrowUp className="size-3.5" />
              Tap a highlighted field to fill it
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-success px-3.5 py-2.5 text-[13px] font-medium text-ink-inverse shadow-[var(--shadow-2)]">
              <Check className="size-3.5" />
              All required fields complete — tap Finish
            </div>
          )}
        </div>
      </SignerShell>

      {signatureFieldId ? (
        <SignatureModal
          onCancel={() => setSignatureFieldId(null)}
          onConfirm={(dataUrl) => {
            const id = signatureFieldId
            setSignatureFieldId(null)
            if (id) submitField(id, dataUrl)
          }}
        />
      ) : null}
      {showDecline ? (
        <DeclineDialog
          onCancel={() => setShowDecline(false)}
          onConfirm={async (reason) => {
            setShowDecline(false)
            try {
              await signingApi.decline(reason)
              setScreen('declined')
            } catch (e) {
              toast.error(e instanceof Error ? e.message : 'Could not decline')
            }
          }}
        />
      ) : null}
    </>
  )
}

/* ---------- PDF page + percent-positioned field overlay ---------- */
function PdfPageWithFields({
  pageNumber,
  fields,
  activeFieldId,
  signerEmail,
  onFieldTap,
  onCommit,
  onCancel,
}: {
  pageNumber: number
  fields: SignerField[]
  activeFieldId: string | null
  signerEmail: string
  onFieldTap: (f: SignerField) => void
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  return (
    <div className="relative shadow-[var(--shadow-1)]" style={{ width: PAGE_WIDTH }}>
      <Page pageNumber={pageNumber} width={PAGE_WIDTH} renderAnnotationLayer={false} renderTextLayer={false} />
      <div className="absolute inset-0">
        {fields.map((f) => (
          <FieldOverlay
            key={f.id}
            field={f}
            active={f.id === activeFieldId}
            signerEmail={signerEmail}
            onClick={() => onFieldTap(f)}
            onCommit={onCommit}
            onCancel={onCancel}
          />
        ))}
      </div>
    </div>
  )
}

export const FIELD_ICON: Record<string, typeof Calendar> = {
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

const INLINE_INPUT_TYPES = new Set(['text', 'email', 'phone', 'company', 'name'])

function FieldOverlay({
  field,
  active,
  signerEmail,
  onClick,
  onCommit,
  onCancel,
}: {
  field: SignerField
  active: boolean
  signerEmail: string
  onClick: () => void
  onCommit: (value: string) => void
  onCancel: () => void
}) {
  const filled = field.filledValue != null && field.filledValue !== ''
  const Icon = FIELD_ICON[field.type] ?? TextCursorInput
  const isImage = field.filledValue?.startsWith('data:image')

  // ---------- Active editor states ----------
  if (active && INLINE_INPUT_TYPES.has(field.type)) {
    return (
      <div
        className="absolute"
        style={{
          left: `${field.x}%`,
          top: `${field.y}%`,
          width: `${field.width}%`,
          height: `${field.height}%`,
        }}
      >
        <InlineTextEditor
          field={field}
          defaultValue={field.type === 'email' ? signerEmail : undefined}
          onCommit={onCommit}
          onCancel={onCancel}
        />
      </div>
    )
  }

  // For popover types we still render the (now "active") button as the anchor,
  // and float the popover from it.
  return (
    <div
      className="absolute"
      style={{
        left: `${field.x}%`,
        top: `${field.y}%`,
        width: `${field.width}%`,
        height: `${field.height}%`,
      }}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex h-full w-full items-center gap-1 overflow-hidden rounded-xs px-1 text-[10px] font-medium"
        style={{
          border: filled
            ? '1.5px solid var(--color-success)'
            : active
              ? '2px solid var(--color-brand)'
              : '1.5px dashed var(--color-brand)',
          background: filled
            ? 'var(--color-success-soft)'
            : active
              ? 'var(--color-brand-soft)'
              : 'color-mix(in oklch, var(--color-brand) 8%, var(--color-surface))',
          boxShadow:
            (!filled && field.required) || active ? '0 0 0 3px oklch(0.665 0.155 38 / 0.22)' : 'none',
          color: filled ? 'var(--color-success-strong)' : 'var(--color-brand-strong)',
        }}
      >
        {filled ? (
          isImage ? (
            <img src={field.filledValue!} alt="signature" className="h-full w-full object-contain" />
          ) : (
            <>
              <CircleCheck className="size-3 shrink-0" />
              <span className="truncate">{field.filledValue}</span>
            </>
          )
        ) : (
          <>
            <Icon className="size-3 shrink-0" />
            <span className="flex-1 truncate text-left">{field.label ?? field.type}</span>
            {field.required ? <span className="font-mono text-[8px] font-bold">REQ</span> : null}
          </>
        )}
      </button>

      {active && field.type === 'multiline_text' ? (
        <MultilineEditor field={field} onCommit={onCommit} onCancel={onCancel} />
      ) : null}
      {active && field.type === 'date' ? (
        <DateEditor field={field} onCommit={onCommit} onCancel={onCancel} />
      ) : null}
      {active && field.type === 'selection' ? (
        <SelectionEditor field={field} onCommit={onCommit} onCancel={onCancel} />
      ) : null}
    </div>
  )
}

/* ---------- Decline dialog ---------- */
function DeclineDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void
  onConfirm: (reason: string) => void
}) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[oklch(0.21_0.018_60/0.55)] backdrop-blur-[2px] sm:items-center sm:p-6">
      <div className="w-full max-w-[440px] overflow-hidden rounded-t-lg border border-border bg-surface-raised shadow-[var(--shadow-3)] sm:rounded-lg">
        <div className="px-[22px] pb-1 pt-5">
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-danger-soft text-danger-strong">
              <TriangleAlert className="size-[18px]" />
            </div>
            <div className="flex-1">
              <h2 className="text-[17px] font-semibold leading-snug tracking-tight text-ink">
                Decline this document?
              </h2>
              <p className="mt-1.5 text-[13.5px] leading-normal text-ink-muted">
                Tell the sender why. They&apos;ll be notified.
              </p>
            </div>
          </div>
          <div className="mt-4">
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Add a reason (optional)…"
              className="min-h-[88px] w-full rounded-sm border border-border bg-surface px-3 py-2.5 text-[13.5px] leading-normal text-ink outline-none placeholder:text-ink-faint focus:border-brand"
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2.5 px-[22px] py-4">
          <button onClick={onCancel} className="rounded-sm px-4 py-2 text-sm font-medium text-ink hover:bg-surface-hover">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="inline-flex items-center gap-1.5 rounded-sm bg-danger px-4 py-2 text-sm font-medium text-ink-inverse hover:opacity-90"
          >
            <CircleX className="size-4" /> Decline
          </button>
        </div>
      </div>
    </div>
  )
}
