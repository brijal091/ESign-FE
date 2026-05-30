'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UploadCloud, Loader2, Info, ArrowRight } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  cn,
  toast,
} from '@esign/ui'
import { useUploadDocument } from '../../lib/hooks/use-documents'

export function UploadDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const upload = useUploadDocument()

  async function handleFile(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported')
      return
    }
    try {
      const doc = await upload.mutateAsync({ file })
      toast.success(`Uploaded ${doc.title}`)
      setOpen(false)
      router.push(`/documents/${doc.id}/edit`)
    } catch (e) {
      toast.error('Upload failed')
      console.error(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload a PDF &amp; Sign</DialogTitle>
          <DialogDescription>
            Drag and drop a file here, or click to browse.
          </DialogDescription>
        </DialogHeader>

        <label
          onDragEnter={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
          className={cn(
            'flex h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-[1.5px] border-dashed border-border-strong bg-surface px-6 py-8 text-center transition-colors',
            'hover:border-brand hover:bg-brand-soft/30',
            dragOver && 'border-brand bg-brand-soft/50',
            upload.isPending && 'pointer-events-none opacity-80',
          )}
        >
          <span
            aria-hidden
            className="grid size-11 place-items-center rounded-full bg-brand-soft text-brand-strong"
          >
            {upload.isPending ? (
              <Loader2 className="size-[22px] animate-spin" strokeWidth={1.5} />
            ) : (
              <UploadCloud className="size-[22px]" strokeWidth={1.5} />
            )}
          </span>
          <div className="text-sm font-medium text-ink">
            {upload.isPending ? 'Uploading…' : 'Drag and drop your PDF here'}
          </div>
          <div className="text-[13px] text-ink-muted">
            or{' '}
            <span className="font-medium text-brand-strong">click to browse files</span>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
            }}
          />
        </label>

        <p className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
          <Info className="size-3.5" strokeWidth={1.5} />
          Maximum file size 25 MB. Only PDF files are supported.
        </p>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={upload.isPending}
          >
            Cancel
          </Button>
          <Button disabled className="gap-2">
            Upload
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
