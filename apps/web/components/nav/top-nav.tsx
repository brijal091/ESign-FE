'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, LogOut } from 'lucide-react'
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  LogoWordmark,
} from '@esign/ui'
import { useAuth } from '@/lib/auth/use-auth'

const TABS = [
  { label: 'Documents', href: '/documents', match: '/documents' },
  { label: 'Templates', href: '/templates', match: '/templates' },
  { label: 'Contacts', href: '/contacts', match: '/contacts' },
  { label: 'Dashboard', href: '/dashboard', match: '/dashboard' },
  { label: 'Configuration', href: '/configuration', match: '/configuration' },
]

export function TopNav() {
  const pathname = usePathname() ?? ''
  const router = useRouter()
  const { signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-6 border-b border-border bg-paper/85 px-6 backdrop-blur-md">
      <Link href="/documents" className="flex items-center">
        <LogoWordmark height={48} />
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[12rem]">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleSignOut}
              className="gap-2 text-sm text-danger-strong focus:text-danger-strong"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
