'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@esign/ui'
import { UsersTable } from '../../../components/admin/users-table'
import { InviteUserDialog } from '../../../components/admin/invite-user-dialog'
import { BrandingForm } from '../../../components/admin/branding-form'

export default function AdminPage() {
  const [inviteOpen, setInviteOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-6 px-8 py-7">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Admin</h1>
        <p className="mt-1 text-[13.5px] text-ink-subtle">
          Manage team members and your workspace brand.
        </p>
      </header>

      <Tabs defaultValue="users" className="flex flex-1 flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-5 flex-1">
          <UsersTable onInvite={() => setInviteOpen(true)} />
          <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
        </TabsContent>

        <TabsContent value="branding" className="mt-5 flex-1">
          <BrandingForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
