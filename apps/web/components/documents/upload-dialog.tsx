'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2 } from 'lucide-react'
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
            'flex h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-surface px-6 py-8 text-center transition-colors',
            'hover:border-border-strong hover:bg-surface-hover',
            dragOver && 'border-brand bg-brand-soft/40',
          )}
        >
          {upload.isPending ? (
            <Loader2 className="size-7 animate-spin text-brand" />
          ) : (
            <Upload className="size-7 text-ink-faint" />
          )}
          <div className="text-sm font-medium text-ink">
            {upload.isPending ? 'Uploading…' : 'Drag and drop your PDF here'}
          </div>
          <div className="text-xs text-ink-subtle">or click to browse files</div>
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

        <p className="text-xs text-ink-subtle">
          Maximum file size 25 MB. Only PDF files are supported.
        </p>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={upload.isPending}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
