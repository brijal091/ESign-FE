'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LayoutTemplate, TriangleAlert } from 'lucide-react'
import { cn } from '@esign/ui'
import {
  useDesignManifest,
  type BadgeTone,
  type DesignPage,
  type DesignPageId,
} from '../../lib/hooks/use-design-manifest'

const badgeToneClass: Record<BadgeTone, string> = {
  default: 'bg-surface-sunken text-ink-muted',
  ready: 'bg-success-soft text-success-strong',
  done: 'bg-brand-soft text-brand-strong',
  empty: 'bg-surface-sunken text-ink-subtle',
  cover: 'bg-surface-sunken text-ink-muted',
}

export function DesignIndexView() {
  const pages = useDesignManifest()
  const [activeId, setActiveId] = useState<DesignPageId>('p00')
  const active = pages.find((p) => p.id === activeId) ?? pages[0]

  return (
    <div className="grid h-screen grid-rows-[48px_1fr] bg-paper text-ink">
      <Topbar />
      <div className="grid min-h-0 grid-cols-[280px_1fr]">
        <Sidebar pages={pages} activeId={activeId} onSelect={setActiveId} />
        <main
          className="min-h-0 overflow-auto px-10 pb-16 pt-8"
          style={{
            background:
              'radial-gradient(circle at 20% 10%, oklch(0.95 0.05 40 / 0.5), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.95 0.05 75 / 0.4), transparent 45%), var(--color-paper)',
          }}
        >
          <div className="mx-auto max-w-[1080px]">
            {active.id === 'p00' ? <Cover /> : <PageDetail page={active} />}
          </div>
        </main>
      </div>
    </div>
  )
}

function Topbar() {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-surface px-4 text-[13px]">
      <div
        className="grid h-6 w-6 place-items-center rounded-md bg-brand text-ink-inverse"
        style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 600, fontSize: 15, lineHeight: 1 }}
      >
        P
      </div>
      <div className="flex items-center gap-2 text-ink-muted">
        <span>Paraph Design</span>
        <span className="text-ink-faint">/</span>
        <span>Projects</span>
        <span className="text-ink-faint">/</span>
        <span className="font-medium text-ink">ESign · v0.1</span>
      </div>
      <div className="flex-1" />
      <div className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
        <span className="h-1.5 w-1.5 rounded-full bg-success" />
        All changes saved
      </div>
      <div className="grid h-[26px] w-[26px] place-items-center rounded-full text-[11px] font-semibold text-ink-inverse" style={{ background: 'oklch(0.78 0.06 38)' }}>
        JK
      </div>
    </header>
  )
}

function Sidebar({
  pages,
  activeId,
  onSelect,
}: {
  pages: DesignPage[]
  activeId: DesignPageId
  onSelect: (id: DesignPageId) => void
}) {
  return (
    <aside className="flex min-h-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-between px-4 pb-2 pt-3.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-subtle">Pages</span>
        <span className="rounded-full bg-surface-sunken px-1.5 py-0.5 text-[11px] font-medium text-ink-muted">
          {pages.length}
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {pages.map((p, i) => {
          const showDivider = i === 1 || i === 3
          const isActive = p.id === activeId
          return (
            <div key={p.id}>
              {showDivider && <div className="mx-1.5 my-2 h-px bg-border-subtle" />}
              <button
                type="button"
                onClick={() => onSelect(p.id)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-[7px] text-left text-[13px] transition-colors',
                  isActive ? 'bg-brand-soft text-brand-strong' : 'text-ink hover:bg-surface-hover',
                )}
              >
                <span
                  className={cn(
                    'min-w-[18px] text-[11px]',
                    isActive ? 'text-brand-strong' : 'text-ink-faint',
                  )}
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {p.num}
                </span>
                <span className="flex-1">{p.name}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                    isActive
                      ? 'bg-surface-raised text-brand-strong'
                      : badgeToneClass[p.badge.tone],
                  )}
                >
                  {p.badge.label}
                </span>
              </button>
            </div>
          )
        })}
      </nav>
      <div
        className="mx-3 mb-3 rounded-md border px-3 py-2.5 text-xs leading-snug text-info-strong"
        style={{ background: 'var(--color-info-soft)', borderColor: 'oklch(0.88 0.04 245)' }}
      >
        <strong className="font-semibold">Design system bound:</strong> Paraph DS (warm-paper palette,
        Geist + Instrument Serif, Lucide icons @ 1.5px). All screens consume tokens from{' '}
        <code className="text-[11px]" style={{ fontFamily: 'var(--font-mono)' }}>
          packages/ui/src/globals.css
        </code>
        .
      </div>
    </aside>
  )
}

function Cover() {
  return (
    <section
      className="relative overflow-hidden rounded-[20px] border border-border bg-surface px-16 py-[72px]"
      style={{ borderRadius: 'var(--radius-xl)' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 85% 10%, oklch(0.85 0.13 40 / 0.30), transparent 35%), radial-gradient(circle at 10% 90%, oklch(0.90 0.10 75 / 0.30), transparent 40%)',
        }}
      />
      <div className="relative">
        <div
          className="mb-4 text-xs uppercase tracking-[0.04em] text-brand-strong"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Project file · v0.1 · scaffold
        </div>
        <h1
          className="m-0 mb-[18px] text-ink"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 84,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          ESign
          <br />
          <em className="not-italic" style={{ fontStyle: 'italic', color: 'var(--color-brand)' }}>
            file structure
          </em>
        </h1>
        <p className="m-0 mb-10 max-w-[640px] text-[18px] leading-[1.55] text-ink-muted">
          An e‑signature SaaS, designed on Paraph DS. This file holds every surface — auth, documents,
          editor, signer, dashboard, templates, admin, and system states. Pages 03–10 are scaffolded
          and waiting on follow‑up flow prompts.
        </p>
        <dl className="grid max-w-[880px] grid-cols-4 gap-8 border-t border-border-subtle pt-7">
          <CoverMeta label="Design system" value="Paraph · Warm Paper" />
          <CoverMeta label="Sender / admin" value="1440 × 900 · desktop‑first" />
          <CoverMeta label="Signer" value={<>375 × 812 · mobile‑first<br />1440 fallback, centered</>} />
          <CoverMeta label="Pages" value="11 total · 8 empty" />
        </dl>
      </div>
    </section>
  )
}

function CoverMeta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-ink-subtle">
        {label}
      </dt>
      <dd className="m-0 text-[14px] leading-[1.45] text-ink">{value}</dd>
    </div>
  )
}

function PageDetail({ page }: { page: DesignPage }) {
  return (
    <>
      <header className="mb-8 flex items-end justify-between gap-8 border-b border-border-subtle pb-5">
        <div>
          <h1
            className="m-0 text-ink"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 44,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            <span
              className="mr-3.5 inline-block align-[6px] text-[18px] text-ink-faint"
              style={{ fontFamily: 'var(--font-mono)', fontStyle: 'normal', fontWeight: 400, letterSpacing: 0 }}
            >
              {page.num}
            </span>
            {page.name}
          </h1>
          {page.subtitle && (
            <p className="mt-1.5 max-w-[560px] text-[15px] text-ink-muted">{page.subtitle}</p>
          )}
        </div>
        {page.meta && (
          <div
            className="whitespace-nowrap text-right text-xs leading-[1.6] text-ink-subtle"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {page.meta.map((m) => (
              <div key={m.label}>
                <span className="text-ink-faint">{m.label}</span>&nbsp;&nbsp;{m.value}
              </div>
            ))}
          </div>
        )}
      </header>

      {page.refColumns && <RefColumns columns={page.refColumns} />}
      {page.id === 'p02' && <CoverageCallout />}
      {page.layoutRows && <LayoutPrimitives rows={page.layoutRows} />}
      {page.cards && <FrameCards cards={page.cards} />}
      {page.appHref && (
        <FramesLink href={page.appHref} label={page.appHrefLabel ?? 'Open page'} note={page.framesNote} />
      )}
    </>
  )
}

function RefColumns({
  columns,
}: {
  columns: { heading: string; rows: import('../../lib/hooks/use-design-manifest').DesignRefRow[] }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-7">
      {columns.map((col) => (
        <div key={col.heading}>
          <h2 className="m-0 mb-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-ink-subtle">
            {col.heading}
          </h2>
          <div className="grid gap-2">
            {col.rows.map((row) => {
              const Icon = row.icon
              return (
                <div
                  key={row.name}
                  className="grid grid-cols-[24px_1fr_auto] items-center gap-3 rounded-md border border-border bg-surface px-3.5 py-2.5"
                >
                  <span className="grid place-items-center text-ink-faint">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[13.5px] font-medium text-ink">
                    {row.name}
                    <small className="mt-0.5 block text-[12px] font-normal text-ink-subtle">
                      {row.detail}
                    </small>
                  </span>
                  <span
                    className={cn(
                      'text-[11px]',
                      row.stateGap ? 'text-warning-strong' : 'text-ink-subtle',
                    )}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {row.state}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function CoverageCallout() {
  return (
    <div
      className="mt-7 rounded-md border px-5 py-4 text-[13px] leading-[1.55] text-warning-strong"
      style={{ background: 'var(--color-warning-soft)', borderColor: 'oklch(0.85 0.10 80)' }}
    >
      <h3 className="m-0 mb-1.5 flex items-center gap-2 text-[13px] font-semibold">
        <TriangleAlert className="h-4 w-4" />
        Component coverage check
      </h3>
      Your prompt assumes 25 named components; Paraph DS currently ships 10. Before flow prompts begin
      populating pages 03–10, the 15 components marked <em>"define"</em> need to be added to page{' '}
      <strong>02 Components</strong>. Either:
      <ul className="m-0 mt-1.5 list-disc pl-[18px]">
        <li>extend the Paraph DS with the missing primitives (preferred — keeps a single source of truth), or</li>
        <li>let me draft them inline on page 02 as I encounter them in the flows, then back‑port to the DS.</li>
      </ul>
    </div>
  )
}

function LayoutPrimitives({
  rows,
}: {
  rows: { name: string; desc: string; dim: string }[]
}) {
  return (
    <div className="mt-7">
      <h2 className="m-0 mb-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-ink-subtle">
        Layout primitives
      </h2>
      <div className="grid gap-2.5">
        {rows.map((r) => (
          <div
            key={r.name}
            className="grid grid-cols-[140px_1fr_180px] items-center gap-4 rounded-md border border-border bg-surface px-3.5 py-3"
          >
            <span className="text-[13.5px] font-medium text-ink">{r.name}</span>
            <span className="text-[13px] text-ink-muted">{r.desc}</span>
            <span
              className="text-right text-[11.5px] text-ink-subtle"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {r.dim}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FrameCards({
  cards,
}: {
  cards: import('../../lib/hooks/use-design-manifest').DesignFrameCard[]
}) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {cards.map((c) => (
        <div key={c.num} className="rounded-md border border-border bg-surface px-[22px] py-5">
          <h3 className="m-0 mb-1 flex items-center gap-2.5 text-[16px] font-semibold text-ink">
            <span className="text-[11px] font-normal text-ink-faint" style={{ fontFamily: 'var(--font-mono)' }}>
              {c.num}
            </span>
            {c.title}
          </h3>
          <p className="mb-3.5 text-[13.5px] leading-[1.5] text-ink-muted">{c.desc}</p>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.04em] text-ink-subtle">
            Components
          </div>
          <div className="flex flex-wrap gap-1.5">
            {c.uses.map((u) => (
              <span
                key={u}
                className="rounded-full border px-2.5 py-0.5 text-xs leading-[1.5] text-brand-strong"
                style={{ background: 'var(--color-brand-soft)', borderColor: 'oklch(0.88 0.06 40)' }}
              >
                {u}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function FramesLink({
  href,
  label,
  note,
}: {
  href: string
  label: string
  note?: string
}) {
  return (
    <Link
      href={href}
      className="mt-6 block overflow-hidden rounded-lg border border-border bg-surface no-underline shadow-[var(--shadow-1)] transition-shadow hover:shadow-[var(--shadow-2)]"
    >
      <div className="flex items-center justify-between border-b border-border-subtle bg-surface-raised px-[18px] py-3.5">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] text-ink-faint"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <LayoutTemplate className="h-3.5 w-3.5" />
          {note ?? 'frames'}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-strong">
          {label}
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3 px-6 py-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-end rounded-sm border border-border p-2 text-[9px] text-ink-faint"
            style={{
              aspectRatio: '1440 / 900',
              fontFamily: 'var(--font-mono)',
              background:
                'linear-gradient(180deg, oklch(0.97 0.008 75) 0 64px, var(--color-surface) 64px 100%)',
            }}
          >
            Frame {String(i + 1).padStart(2, '0')}
          </div>
        ))}
      </div>
    </Link>
  )
}
