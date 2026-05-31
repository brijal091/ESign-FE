import type { ReactNode } from 'react'
import { TopNav } from '../../components/nav/top-nav'
import { AuthGuard } from '../../components/auth/auth-guard'
import { OfflineBanner } from '../../components/system/offline-banner'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col overflow-hidden bg-paper">
        <TopNav />
        <OfflineBanner />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </AuthGuard>
  )
}
