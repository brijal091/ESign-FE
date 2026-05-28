'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { FileSpreadsheet, Info, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@esign/ui'
import type { CsvImportResult } from '@esign/types'
import { useImportCsv } from '../../lib/hooks/use-contacts'

interface Props {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function CsvImportDialog({ open, onOpenChange }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<CsvImportResult | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const importMut = useImportCsv()

  function reset() {
    setFile(null)
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function close() {
    reset()
    onOpenChange(false)
  }

  function pickFile(f: File | null) {
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please select a .csv file')
      return
    }
    setFile(f)
    setResult(null)
  }

  async function onImport() {
    if (!file) return
    try {
      const res = await importMut.mutateAsync(file)
      setResult(res)
      if (res.imported > 0) {
        toast.success(`${res.imported} contact(s) imported`)
      }
      if (res.skipped > 0) {
        toast.warning(`${res.skipped} row(s) skipped`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Import failed')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Import contacts from CSV</DialogTitle>
          <DialogDescription>
            Upload a .csv file. Header: <code className="font-mono text-xs">name,email,phone?,company?</code>
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-4">
              <CheckCircle2 className="size-6 text-success-strong" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink">
                  {result.imported} imported, {result.skipped} skipped
                </div>
              </div>
            </div>
            {result.errors.length > 0 ? (
              <div className="rounded-md border border-border bg-warning-soft p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-warning-strong">
                  <AlertTriangle className="size-4" />
                  Row errors ({result.errors.length})
                </div>
                <ul className="max-h-48 overflow-auto space-y-0.5 text-xs text-ink-muted">
                  {result.errors.map((e, i) => (
                    <li key={i} className="font-mono">
                      Row {e.row}: {e.reason}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <label
              htmlFor="csv-file-input"
              className="flex h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-border-strong bg-surface transition-colors hover:bg-surface-hover"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                pickFile(e.dataTransfer.files[0] ?? null)
              }}
            >
              <span className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand-strong">
                <FileSpreadsheet className="size-[22px]" />
              </span>
              {file ? (
                <>
                  <div className="text-sm font-medium text-ink">{file.name}</div>
                  <div className="text-[12px] text-ink-muted">{(file.size / 1024).toFixed(1)} KB</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-ink">Drag and drop your CSV here</div>
                  <div className="text-[13px] text-ink-muted">or click to browse</div>
                </>
              )}
            </label>
            <input
              id="csv-file-input"
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
                <Info className="size-3.5" /> Required header: name,email. Optional: phone,company.
              </div>
              {file ? (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink"
                >
                  <X className="size-3.5" /> Clear
                </button>
              ) : null}
            </div>
          </div>
        )}

        <DialogFooter>
          {result ? (
            <Button onClick={close}>Done</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={close} disabled={importMut.isPending}>
                Cancel
              </Button>
              <Button onClick={onImport} disabled={!file || importMut.isPending}>
                {importMut.isPending ? 'Importing…' : 'Import'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
