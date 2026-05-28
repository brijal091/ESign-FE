'use client'

import {
  Mail,
  Phone,
  Building2,
  ChevronDown,
  X,
  FileSpreadsheet,
  Info,
  Download,
  ArrowRight,
  Check,
} from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@esign/ui'

/* ============ Add Contact (sm) ============ */
export function AddContactDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <DialogTitle>New Contact</DialogTitle>
          <DialogDescription>Add one person. They won&apos;t be notified.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3.5">
          <div className="space-y-1.5">
            <Label>
              Name <span className="text-danger-strong">*</span>
            </Label>
            <Input defaultValue="Elena Mendoza" />
          </div>
          <div className="space-y-1.5">
            <Label>
              Email <span className="text-danger-strong">*</span>
            </Label>
            <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
              <Mail className="size-4 text-ink-faint" />
              <input
                defaultValue="elena@acme.com"
                className="flex-1 bg-transparent text-sm text-ink outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                Phone <span className="text-xs font-normal text-ink-subtle">Optional</span>
              </Label>
              <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
                <Phone className="size-4 text-ink-faint" />
                <input placeholder="+1 (555) 000-0000" className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                Company <span className="text-xs font-normal text-ink-subtle">Optional</span>
              </Label>
              <div className="flex h-9 items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-brand">
                <Building2 className="size-4 text-ink-faint" />
                <input placeholder="Acme Holdings" className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint" />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              Groups <span className="text-xs font-normal text-ink-subtle">Select one or more</span>
            </Label>
            <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-sm border border-border bg-surface px-2.5 py-1.5">
              {['Clients', 'VIP'].map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-soft py-0.5 pl-2 pr-1 text-xs font-medium text-brand-strong"
                >
                  {g}
                  <button className="grid size-3.5 place-items-center rounded-full hover:bg-brand/20">
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
              <span className="min-w-[80px] flex-1 text-[13px] text-ink-faint">Add group…</span>
              <ChevronDown className="size-3.5 text-ink-subtle" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="gap-1.5">
            <Check className="size-4" /> Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ============ CSV Import (md, stepper) ============ */
const STEPS = ['Upload', 'Map columns', 'Review']

function Stepper({ current = 0 }: { current?: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const active = i === current
        const done = i < current
        return (
          <div key={s} className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2">
              <span
                className={
                  'grid size-5 place-items-center rounded-full text-[11px] font-semibold ' +
                  (active
                    ? 'bg-brand text-ink-inverse'
                    : done
                      ? 'bg-success-soft text-success-strong'
                      : 'bg-surface-sunken text-ink-subtle')
                }
              >
                {done ? <Check className="size-3" strokeWidth={3} /> : i + 1}
              </span>
              <span className={'text-[13px] ' + (active ? 'font-semibold text-ink' : 'font-medium text-ink-muted')}>
                {s}
              </span>
            </span>
            {i < STEPS.length - 1 ? <span className="h-px w-8 bg-border" /> : null}
          </div>
        )
      })}
    </div>
  )
}

export function CsvImportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] gap-0 p-0">
        <div className="p-6 pb-4">
          <DialogHeader>
            <DialogTitle>Import contacts from CSV</DialogTitle>
            <DialogDescription>
              Upload a .csv file. We&apos;ll let you map each column to a contact field in the next step.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="border-y border-border-subtle bg-surface px-6 py-4">
          <Stepper current={0} />
        </div>

        <div className="p-6">
          <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-border-strong bg-surface">
            <span className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand-strong">
              <FileSpreadsheet className="size-[22px]" />
            </span>
            <div className="text-sm font-medium text-ink">Drag and drop your CSV here</div>
            <div className="text-[13px] text-ink-muted">
              or <a href="#" className="font-medium text-brand">click to browse files</a>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
              <Info className="size-3.5" /> Maximum 5,000 rows. UTF-8 encoding.
            </div>
            <a href="#" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand-strong hover:underline">
              <Download className="size-3.5" /> Download a sample CSV
            </a>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border-subtle px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled className="gap-1.5">
            Next <ArrowRight className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
