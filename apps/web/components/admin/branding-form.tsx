'use client'

import { useMemo, useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import type { UpdateBrandingInput } from '@esign/types'
import { UpdateBrandingInputSchema } from '@esign/types'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Skeleton,
  toast,
} from '@esign/ui'
import { useBranding, useUpdateBranding } from '../../lib/hooks/use-admin'

type FormState = {
  companyName: string
  logoUrl: string
  primaryColor: string
  accentColor: string
  supportEmail: string
  emailFromName: string
}

const EMPTY: FormState = {
  companyName: '',
  logoUrl: '',
  primaryColor: '',
  accentColor: '',
  supportEmail: '',
  emailFromName: '',
}

const DEFAULT_PRIMARY = '#D97757'
const DEFAULT_ACCENT = '#2A6FDB'

function isValidHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(v)
}

export function BrandingForm() {
  const { data, isLoading, isError } = useBranding()
  const update = useUpdateBranding()

  const initial: FormState = useMemo(() => {
    if (!data) return EMPTY
    return {
      companyName: data.companyName ?? '',
      logoUrl: data.logoUrl ?? '',
      primaryColor: data.primaryColor ?? '',
      accentColor: data.accentColor ?? '',
      supportEmail: data.supportEmail ?? '',
      emailFromName: data.emailFromName ?? '',
    }
  }, [data])

  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [lastInitial, setLastInitial] = useState(initial)
  if (lastInitial !== initial) {
    setLastInitial(initial)
    setForm(initial)
    setErrors({})
  }

  const dirty = useMemo(() => {
    return (Object.keys(initial) as (keyof FormState)[]).some(
      (k) => initial[k] !== form[k],
    )
  }, [initial, form])

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const payload: UpdateBrandingInput = {}
    if (form.companyName !== initial.companyName) payload.companyName = form.companyName
    if (form.logoUrl !== initial.logoUrl) payload.logoUrl = form.logoUrl
    if (form.primaryColor !== initial.primaryColor) payload.primaryColor = form.primaryColor
    if (form.accentColor !== initial.accentColor) payload.accentColor = form.accentColor
    if (form.supportEmail !== initial.supportEmail) payload.supportEmail = form.supportEmail
    if (form.emailFromName !== initial.emailFromName) payload.emailFromName = form.emailFromName

    const parsed = UpdateBrandingInputSchema.safeParse(payload)
    if (!parsed.success) {
      const next: Partial<Record<keyof FormState, string>> = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string') {
          next[key as keyof FormState] = issue.message
        }
      }
      setErrors(next)
      return
    }
    setErrors({})

    try {
      await update.mutateAsync(parsed.data)
      toast.success('Branding updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    }
  }

  function handleDiscard() {
    setForm(initial)
    setErrors({})
  }

  if (isLoading) {
    return (
      <div className="grid gap-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-md border border-danger bg-danger-soft p-4 text-sm text-danger-strong">
        Failed to load branding. Refresh and try again.
      </div>
    )
  }

  const previewPrimary = isValidHex(form.primaryColor)
    ? form.primaryColor
    : DEFAULT_PRIMARY
  const previewAccent = isValidHex(form.accentColor)
    ? form.accentColor
    : DEFAULT_ACCENT

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                Shown in document footers, emails, and the audit certificate.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="companyName">Company name</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                  aria-invalid={Boolean(errors.companyName)}
                />
                {errors.companyName ? (
                  <span className="text-xs text-danger">{errors.companyName}</span>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="supportEmail">Support email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => set('supportEmail', e.target.value)}
                  aria-invalid={Boolean(errors.supportEmail)}
                  placeholder="help@yourdomain.com"
                />
                {errors.supportEmail ? (
                  <span className="text-xs text-danger">{errors.supportEmail}</span>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                Public URL of a PNG or SVG. Used in signing pages and email headers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={form.logoUrl}
                  onChange={(e) => set('logoUrl', e.target.value)}
                  aria-invalid={Boolean(errors.logoUrl)}
                  placeholder="https://cdn.example.com/logo.svg"
                />
                {errors.logoUrl ? (
                  <span className="text-xs text-danger">{errors.logoUrl}</span>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>
                Applied to buttons, links, and signer field tints.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="primaryColor">Primary</Label>
                <div className="flex h-9 items-center overflow-hidden rounded-sm border border-border bg-surface">
                  <input
                    type="color"
                    aria-label="Primary color swatch"
                    value={isValidHex(form.primaryColor) ? form.primaryColor : DEFAULT_PRIMARY}
                    onChange={(e) => set('primaryColor', e.target.value.toUpperCase())}
                    className="h-full w-10 cursor-pointer border-r border-border bg-transparent p-0"
                  />
                  <input
                    id="primaryColor"
                    value={form.primaryColor}
                    onChange={(e) => set('primaryColor', e.target.value)}
                    placeholder="#D97757"
                    aria-invalid={Boolean(errors.primaryColor)}
                    className="flex-1 bg-transparent px-3 font-mono text-[13px] uppercase text-ink outline-none placeholder:text-ink-faint"
                  />
                </div>
                {errors.primaryColor ? (
                  <span className="text-xs text-danger">{errors.primaryColor}</span>
                ) : null}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="accentColor">Accent</Label>
                <div className="flex h-9 items-center overflow-hidden rounded-sm border border-border bg-surface">
                  <input
                    type="color"
                    aria-label="Accent color swatch"
                    value={isValidHex(form.accentColor) ? form.accentColor : DEFAULT_ACCENT}
                    onChange={(e) => set('accentColor', e.target.value.toUpperCase())}
                    className="h-full w-10 cursor-pointer border-r border-border bg-transparent p-0"
                  />
                  <input
                    id="accentColor"
                    value={form.accentColor}
                    onChange={(e) => set('accentColor', e.target.value)}
                    placeholder="#2A6FDB"
                    aria-invalid={Boolean(errors.accentColor)}
                    className="flex-1 bg-transparent px-3 font-mono text-[13px] uppercase text-ink outline-none placeholder:text-ink-faint"
                  />
                </div>
                {errors.accentColor ? (
                  <span className="text-xs text-danger">{errors.accentColor}</span>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email</CardTitle>
              <CardDescription>What recipients see in their inbox.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="emailFromName">From name</Label>
                <Input
                  id="emailFromName"
                  value={form.emailFromName}
                  onChange={(e) => set('emailFromName', e.target.value)}
                  aria-invalid={Boolean(errors.emailFromName)}
                  placeholder="Northbeam"
                />
                {errors.emailFromName ? (
                  <span className="text-xs text-danger">{errors.emailFromName}</span>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="self-start lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Approximate signer-facing look.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-md border border-border bg-surface-sunken">
                <div className="flex h-12 items-center gap-2 px-4 text-paper" style={{ background: previewPrimary }}>
                  {form.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.logoUrl}
                      alt="logo preview"
                      className="h-7 w-auto object-contain"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="font-display text-base italic">
                      {form.companyName || 'Your brand'}
                    </span>
                  )}
                </div>
                <div className="bg-surface-raised p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-subtle">
                    Document for review
                  </div>
                  <div className="mt-1 font-display text-lg italic text-ink">
                    Mutual NDA — Acme × {form.companyName || 'your company'}
                  </div>
                  <p className="my-2.5 text-[13px] leading-relaxed text-ink-muted">
                    Quick preview of how your brand appears to signers.
                  </p>
                  <button
                    type="button"
                    disabled
                    className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-sm text-sm font-semibold text-white"
                    style={{ background: previewPrimary }}
                  >
                    Review and sign
                  </button>
                  <div className="mt-3 text-[11px]" style={{ color: previewAccent }}>
                    Secured by ESign
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-md border border-border bg-paper/90 px-4 py-3 backdrop-blur">
        <span className="text-[13px] text-ink-muted">
          {dirty ? 'Unsaved changes' : 'All changes saved'}
        </span>
        <div className="flex gap-2.5">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDiscard}
            disabled={!dirty || update.isPending}
          >
            Discard
          </Button>
          <Button type="submit" className="gap-1.5" disabled={!dirty || update.isPending}>
            {update.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Check className="size-4" />
            )}
            Save changes
          </Button>
        </div>
      </div>
    </form>
  )
}
