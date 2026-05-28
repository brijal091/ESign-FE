'use client'

import { useState } from 'react'
import { AdminSubNav } from '../../../components/admin/atoms'
import {
  UsersSection,
  AuditLogSection,
  GeneralSettingsSection,
  BrandingSection,
  PlaceholderSection,
} from '../../../components/admin/sections'

export default function ConfigurationPage() {
  const [section, setSection] = useState('Users')

  return (
    <div className="flex flex-1 overflow-hidden">
      <AdminSubNav active={section} onSelect={setSection} />
      <div className="flex flex-1 flex-col overflow-hidden bg-paper">
        {section === 'Users' ? (
          <UsersSection />
        ) : section === 'Audit Log' ? (
          <AuditLogSection />
        ) : section === 'General' ? (
          <GeneralSettingsSection />
        ) : section === 'Branding' ? (
          <BrandingSection />
        ) : (
          <PlaceholderSection title={section === 'Roles' ? 'Roles & Permissions' : section} />
        )}
      </div>
    </div>
  )
}
