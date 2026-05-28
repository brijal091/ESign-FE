import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-2">
      {/* Brand panel — 50% on md+ */}
      <aside className="relative hidden flex-col justify-between overflow-hidden p-12 md:flex">
        {/* Soft gradient mesh background */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background: `
              radial-gradient(circle at 80% 15%, oklch(0.85 0.13 40 / 0.32), transparent 45%),
              radial-gradient(circle at 15% 85%, oklch(0.90 0.10 75 / 0.30), transparent 40%),
              radial-gradient(circle at 50% 50%, oklch(0.95 0.05 30 / 0.18), transparent 60%),
              var(--paper)
            `,
          }}
        />

        <Link href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-md bg-brand text-ink-inverse font-display italic text-lg leading-none"
          >
            E
          </span>
          <span className="font-display text-2xl text-ink leading-none">ESign</span>
        </Link>

        <div className="max-w-md space-y-6">
          <p className="t-eyebrow text-brand-strong">Trusted e-signatures</p>
          <h1 className="font-display text-5xl leading-[0.95] tracking-tight text-ink">
            Send. Sign. <em className="not-italic text-brand">Done.</em>
            <br />— in minutes.
          </h1>
          <p className="text-lg leading-relaxed text-ink-muted">
            Legally binding electronic signatures backed by ESIGN Act and eIDAS compliance.
          </p>

          {/* Testimonial card */}
          <figure className="mt-10 rounded-md border border-border-subtle bg-surface/60 p-5 backdrop-blur-sm">
            <blockquote className="text-sm leading-relaxed text-ink">
              “We replaced two signature tools with ESign and our average contract turnaround
              dropped from four days to under two hours.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                aria-hidden
                className="grid size-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand-strong"
              >
                SC
              </span>
              <div className="text-xs leading-tight">
                <div className="font-medium text-ink">Sarah Chen</div>
                <div className="text-ink-subtle">Head of Ops, Northbeam</div>
              </div>
            </figcaption>
          </figure>
        </div>

        <p className="font-mono text-xs text-ink-faint">© ESign · v0.1</p>
      </aside>

      {/* Form panel — 400px form, vertically centered */}
      <main className="flex items-center justify-center p-6 md:p-12 bg-paper">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  )
}
