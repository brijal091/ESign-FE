'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@esign/ui'

const TABS = [
  { label: 'Documents', href: '/documents', match: '/documents' },
  { label: 'Templates', href: '/templates', match: '/templates' },
  { label: 'Contacts', href: '/contacts', match: '/contacts' },
  { label: 'Dashboard', href: '/dashboard', match: '/dashboard' },
  { label: 'Configuration', href: '/configuration', match: '/configuration' },
]

export function TopNav() {
  const pathname = usePathname() ?? ''
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-6 border-b border-border bg-paper/85 px-6 backdrop-blur-md">
      <Link href="/documents" className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="grid size-7 place-items-center rounded-md bg-brand text-ink-inverse font-display italic text-base leading-none"
        >
          E
        </span>
        <span className="font-display text-xl leading-none text-ink">ESign</span>
      </Link>

      <nav className="flex items-center gap-1 text-sm">
        {TABS.map((tab) => {
          const active = pathname.startsWith(tab.match)
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                'rounded-md px-3 py-1.5 font-medium text-ink-muted transition-colors',
                'hover:bg-surface-hover hover:text-ink',
                active && 'bg-brand-soft text-brand-strong hover:bg-brand-soft hover:text-brand-strong',
              )}
            >
              {tab.label}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-ink-muted hover:bg-surface-hover hover:text-ink"
        >
          <span
            aria-hidden
            className="grid size-6 place-items-center rounded-full bg-brand-soft text-[10px] font-semibold text-brand-strong"
          >
            MC
          </span>
          <span>My Company</span>
          <ChevronDown className="size-3.5" />
        </button>
      </div>
    </header>
  )
}
