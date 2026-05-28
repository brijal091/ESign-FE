'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Loader2, ChevronDown, FileText } from 'lucide-react'
import { TEMPLATE_CATEGORIES, type TemplateCategory } from '@esign/types'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  cn,
  toast,
} from '@esign/ui'
import { useCreateTemplate } from '../../lib/hooks/use-templates'

export function UploadTemplateDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<TemplateCategory | ''>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const create = useCreateTemplate()

  function reset() {
    setFile(null)
    setName('')
    setCategory('')
    setDragOver(false)
  }

  function pickFile(f: File) {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Only PDF files are supported')
      return
    }
    setFile(f)
    if (!name) setName(f.name.replace(/\.pdf$/i, ''))
  }

  async function handleSubmit() {
    if (!file) {
      toast.error('Select a PDF file')
      return
    }
    if (!name.trim()) {
      toast.error('Template name is required')
      return
    }
    try {
      const t = await create.mutateAsync({
        file,
        name: name.trim(),
        category: category || undefined,
      })
      toast.success(`Template "${t.name}" created`)
      setOpen(false)
      reset()
      router.push(`/templates/${t.id}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Template</DialogTitle>
          <DialogDescription>
            Upload a PDF and add details. You can place fields in the editor next.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {file ? (
            <div className="flex items-center gap-3 rounded-md border border-border bg-surface px-3 py-2.5">
              <FileText className="size-5 shrink-0 text-brand" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{file.name}</div>
                <div className="text-xs text-ink-subtle">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                disabled={create.isPending}
              >
                Replace
              </Button>
            </div>
          ) : (
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
                const f = e.dataTransfer.files?.[0]
                if (f) pickFile(f)
              }}
              className={cn(
                'flex h-[140px] cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-surface px-6 py-6 text-center transition-colors',
                'hover:border-border-strong hover:bg-surface-hover',
                dragOver && 'border-brand bg-brand-soft/40',
              )}
            >
              <Upload className="size-6 text-ink-faint" />
              <div className="text-sm font-medium text-ink">Drag and drop a PDF</div>
              <div className="text-xs text-ink-subtle">or click to browse</div>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) pickFile(f)
                }}
              />
            </label>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="tpl-name">Name</Label>
            <Input
              id="tpl-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NDA — Standard"
              disabled={create.isPending}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  disabled={create.isPending}
                  className="inline-flex h-9 w-full items-center justify-between rounded-sm border border-border bg-surface px-3 text-sm text-ink transition-colors hover:bg-surface-hover disabled:opacity-50"
                >
                  <span className={cn(!category && 'text-ink-faint')}>
                    {category || 'Select category (optional)'}
                  </span>
                  <ChevronDown className="size-3.5 text-ink-faint" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                <DropdownMenuItem onSelect={() => setCategory('')}>None</DropdownMenuItem>
                {TEMPLATE_CATEGORIES.map((c) => (
                  <DropdownMenuItem key={c} onSelect={() => setCategory(c)}>
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={create.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={create.isPending || !file}>
            {create.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading…
              </>
            ) : (
              'Create Template'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
