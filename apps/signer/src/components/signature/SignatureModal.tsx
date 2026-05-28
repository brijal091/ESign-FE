import { useRef, useState, useCallback } from 'react'
import SignatureCanvasImport from 'react-signature-canvas'
import { Upload, X, PenTool, Type as TypeIcon } from 'lucide-react'

// Vite's CJS interop can hand back the module namespace object instead of the
// class itself; unwrap a nested `.default` when present.
const SignatureCanvas = ((SignatureCanvasImport as unknown as { default?: typeof SignatureCanvasImport })
  .default ?? SignatureCanvasImport) as typeof SignatureCanvasImport
type SignatureCanvasRef = InstanceType<typeof SignatureCanvasImport>

type Tab = 'draw' | 'type' | 'upload'

const TYPED_FONTS = [
  { name: 'Cursive', style: 'var(--font-display), cursive' },
  { name: 'Script', style: '"Segoe Script", cursive' },
  { name: 'Print', style: 'Georgia, serif' },
]

interface SignatureModalProps {
  onConfirm: (dataUrl: string) => void
  onCancel: () => void
}

export function SignatureModal({ onConfirm, onCancel }: SignatureModalProps) {
  const [tab, setTab] = useState<Tab>('draw')
  const [typedText, setTypedText] = useState('')
  const [selectedFont, setSelectedFont] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)
  const [drawHasInk, setDrawHasInk] = useState(false)
  const canvasRef = useRef<SignatureCanvasRef>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDraw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || canvas.isEmpty()) return null
    return canvas.getTrimmedCanvas().toDataURL('image/png')
  }, [])

  const handleTyped = useCallback(() => {
    if (!typedText.trim()) return null
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.clearRect(0, 0, 600, 200)
    ctx.fillStyle = '#33251c'
    ctx.font = `80px ${TYPED_FONTS[selectedFont]?.style ?? 'cursive'}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(typedText, 300, 110)
    return canvas.toDataURL('image/png')
  }, [typedText, selectedFont])

  const handleConfirm = () => {
    let dataUrl: string | null = null
    if (tab === 'draw') dataUrl = handleDraw()
    else if (tab === 'type') dataUrl = handleTyped()
    else if (tab === 'upload') dataUrl = uploadedUrl
    if (dataUrl) onConfirm(dataUrl)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setUploadedUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  const hasValue =
    (tab === 'draw' && drawHasInk) ||
    (tab === 'type' && typedText.trim().length > 0) ||
    (tab === 'upload' && uploadedUrl !== null)

  const TABS: { id: Tab; label: string; icon: typeof PenTool }[] = [
    { id: 'draw', label: 'Draw', icon: PenTool },
    { id: 'type', label: 'Type', icon: TypeIcon },
    { id: 'upload', label: 'Upload', icon: Upload },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[oklch(0.21_0.018_60/0.55)] p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div className="w-full max-w-[480px] overflow-hidden rounded-t-lg border border-border bg-surface-raised shadow-[var(--shadow-3)] sm:rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-[18px] py-3">
          <h3 className="text-base font-semibold tracking-tight text-ink">Add your signature</h3>
          <button
            onClick={onCancel}
            className="grid size-7 place-items-center rounded-sm text-ink-subtle transition-colors hover:bg-surface-hover hover:text-ink"
            aria-label="Close"
          >
            <X className="size-4.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border-subtle px-[18px]">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`-mb-px inline-flex items-center gap-1.5 border-b-2 px-2.5 py-3 text-sm transition-colors ${
                  active
                    ? 'border-brand font-semibold text-ink'
                    : 'border-transparent font-medium text-ink-muted hover:text-ink'
                }`}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="p-[18px]">
          {tab === 'draw' && (
            <div>
              <div className="overflow-hidden rounded-sm border border-border bg-surface">
                <SignatureCanvas
                  ref={canvasRef}
                  penColor="#33251c"
                  canvasProps={{
                    width: 444,
                    height: 180,
                    className: 'w-full touch-none',
                    style: { display: 'block' },
                  }}
                  velocityFilterWeight={0.7}
                  minWidth={1.5}
                  maxWidth={3.5}
                  onEnd={() => setDrawHasInk(true)}
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">Sign here</p>
                <button
                  className="text-xs text-ink-muted underline hover:text-ink"
                  onClick={() => {
                    canvasRef.current?.clear()
                    setDrawHasInk(false)
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {tab === 'type' && (
            <div>
              <input
                type="text"
                value={typedText}
                onChange={(e) => setTypedText(e.target.value)}
                placeholder="Type your full name"
                className="mb-4 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand"
                maxLength={60}
              />
              <div className="grid grid-cols-3 gap-2">
                {TYPED_FONTS.map((font, i) => (
                  <button
                    key={font.name}
                    onClick={() => setSelectedFont(i)}
                    className={`rounded-sm border-2 p-3 text-center transition-colors ${
                      selectedFont === i ? 'border-brand bg-brand-soft/40' : 'border-border hover:border-border-strong'
                    }`}
                  >
                    <span style={{ fontFamily: font.style, fontSize: '22px', color: 'var(--color-ink)' }}>
                      {typedText || 'Signature'}
                    </span>
                    <p className="mt-1 text-[11px] text-ink-subtle">{font.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tab === 'upload' && (
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              {uploadedUrl ? (
                <div className="relative">
                  <img src={uploadedUrl} alt="Uploaded signature" className="mx-auto max-h-40 rounded-sm border border-border" />
                  <button
                    onClick={() => setUploadedUrl(null)}
                    className="absolute right-1 top-1 rounded-full border border-border bg-surface-raised p-1 shadow-[var(--shadow-1)] hover:bg-surface-hover"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-sm border-2 border-dashed border-border py-10 text-ink-muted transition-colors hover:border-brand hover:text-brand-strong"
                >
                  <Upload className="size-7" />
                  <p className="text-sm font-medium">Click to upload signature image</p>
                  <p className="text-xs">PNG, JPG, WebP accepted</p>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2.5 border-t border-border-subtle px-[18px] py-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-hover"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!hasValue}
            className="flex-[2] rounded-sm bg-brand px-4 py-2 text-sm font-medium text-ink-inverse transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply Signature
          </button>
        </div>
      </div>
    </div>
  )
}
