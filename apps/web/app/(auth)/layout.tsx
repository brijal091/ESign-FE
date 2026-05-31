'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoWordmark } from '@esign/ui'

type BrandVariant =
  | 'welcome'
  | 'default'
  | 'verify'
  | 'organization'
  | 'reset'
  | 'invite'
  | 'confirm'

interface BrandCopy {
  headline: ReactNode
  quote: string
  author: string
  role: string
  tags: string[]
}

const BRAND_COPY: Record<BrandVariant, BrandCopy> = {
  welcome: {
    headline: (
      <>
        Welcome
        <br />
        back to <em className="font-display italic text-brand">ESign.</em>
      </>
    ),
    quote:
      'It is the only tool our finance, legal, and people teams all log into voluntarily. That is a first.',
    author: 'Daniel Park',
    role: 'COO, Riverline Holdings',
    tags: ['Finance', 'Legal', 'People'],
  },
  default: {
    headline: (
      <>
        Send.
        <br />
        Sign.
        <br />
        Done.
        <br />
        <em className="font-display italic text-brand">— in minutes.</em>
      </>
    ),
    quote:
      "We went from chasing PDFs in email to closing onboarding in a single afternoon. The signers don't even need an account.",
    author: 'Mira Okonkwo',
    role: 'Head of People, Northbeam',
    tags: ['NDA', 'Offer letter', 'Vendor MSA'],
  },
  verify: {
    headline: (
      <>
        One code.
        <br />
        One <em className="font-display italic text-brand">signature.</em>
        <br />
        Zero printers.
      </>
    ),
    quote:
      'Verification used to take three emails and a phone call. Now it is six digits and a tap.',
    author: 'Priya Shastri',
    role: 'Sales Operations, Lumen Studio',
    tags: ['OTP', 'Email verify'],
  },
  organization: {
    headline: (
      <>
        Built for the
        <br />
        way <em className="font-display italic text-brand">teams</em>
        <br />
        actually work.
      </>
    ),
    quote:
      'I onboarded twenty-three contractors in the time it used to take to onboard three.',
    author: 'Yusuf Demir',
    role: 'Founder, Tessera Studio',
    tags: ['Templates', 'Roles', 'Audit log'],
  },
  reset: {
    headline: (
      <>
        Locked out?
        <br />
        Back in <em className="font-display italic text-brand">thirty seconds.</em>
      </>
    ),
    quote:
      'Most password resets feel like an interrogation. This one feels like a doorman waving you through.',
    author: 'Aisha Bello',
    role: 'IT Lead, Margate Co.',
    tags: ['Account recovery'],
  },
  invite: {
    headline: (
      <>
        You&apos;ve been
        <br />
        invited to
        <br />
        <em className="font-display italic text-brand">ESign.</em>
      </>
    ),
    quote:
      'I joined Tuesday, sent my first contract Wednesday. The onboarding is honestly embarrassing how short it is.',
    author: 'Caleb Mwangi',
    role: 'New hire, Acme Corp.',
    tags: ['Workspace invite'],
  },
  confirm: {
    headline: (
      <>
        Check your
        <br />
        inbox.
        <br />
        <em className="font-display italic text-brand">We sent a link.</em>
      </>
    ),
    quote:
      "The email arrives before you switch tabs. I tested it three times because I didn't believe it.",
    author: 'Sana Ortiz',
    role: 'Brand Manager, Folio',
    tags: ['Magic link'],
  },
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function BrandPanel({ variant }: { variant: BrandVariant }) {
  const v = BRAND_COPY[variant]
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-paper px-14 py-12 md:flex">
      {/* Gradient mesh — three radial passes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(56% 50% at 8% 0%, oklch(0.86 0.10 60 / 0.55), transparent 70%),
            radial-gradient(40% 55% at 95% 28%, oklch(0.94 0.05 70 / 0.85), transparent 75%),
            radial-gradient(70% 60% at 75% 100%, oklch(0.70 0.155 38 / 0.18), transparent 65%)
          `,
        }}
      />
      {/* Dotted grain overlay — 18px raster */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(oklch(0.55 0.05 38 / 0.06) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      {/* Wordmark */}
      <div className="relative z-10">
        <Link href="/" className="inline-flex items-center">
          <LogoWordmark height={60} />
        </Link>
      </div>

      {/* Headline + testimonial + tags */}
      <div className="relative z-10 max-w-[480px]">
        <h1 className="m-0 font-display text-[64px] font-normal leading-[1.02] tracking-[-0.025em] text-ink">
          {v.headline}
        </h1>

        {/* Testimonial card */}
        <figure
          className="mt-9 max-w-[420px] rounded-md border border-border bg-surface-raised px-5 py-[18px]"
          style={{ boxShadow: 'var(--shadow-1)' }}
        >
          <div className="flex items-start gap-[14px]">
            <span
              aria-hidden
              className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-ink-inverse"
              style={{ background: 'oklch(0.78 0.06 38)' }}
            >
              {initialsOf(v.author)}
            </span>
            <div className="min-w-0 flex-1">
              <blockquote className="m-0 text-[14px] leading-[1.5] text-ink">
                <span
                  aria-hidden
                  className="mr-0.5 align-[-2px] font-display text-[18px] text-brand"
                >
                  &ldquo;
                </span>
                {v.quote}
              </blockquote>
              <figcaption className="mt-2 text-xs text-ink-subtle">
                <strong className="font-semibold text-ink-muted">{v.author}</strong>
                <span> · {v.role}</span>
              </figcaption>
            </div>
          </div>
        </figure>

        <div className="mt-[22px] flex flex-wrap gap-1.5">
          {v.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border border-border bg-surface-raised px-[9px] py-1 text-xs font-medium text-ink-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="relative z-10 text-xs text-ink-subtle">
        © 2026 ESign ·{' '}
        <Link href="#" className="hover:text-ink-muted">
          Terms
        </Link>{' '}
        ·{' '}
        <Link href="#" className="hover:text-ink-muted">
          Privacy
        </Link>
      </p>
    </aside>
  )
}

function variantFromPath(pathname: string | null): BrandVariant {
  if (!pathname) return 'welcome'
  if (pathname.startsWith('/login')) return 'welcome'
  if (pathname.startsWith('/signup')) return 'default'
  if (pathname.startsWith('/forgot-password')) return 'reset'
  if (pathname.startsWith('/set-password')) return 'invite'
  if (pathname.startsWith('/email-sent')) return 'confirm'
  if (pathname.startsWith('/session-expired')) return 'default'
  return 'welcome'
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const variant = variantFromPath(pathname)

  return (
    <div className="grid min-h-screen bg-paper md:grid-cols-2">
      <BrandPanel variant={variant} />
      <main className="flex items-center justify-center border-border bg-surface px-6 py-12 md:border-l md:px-16">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  )
}
