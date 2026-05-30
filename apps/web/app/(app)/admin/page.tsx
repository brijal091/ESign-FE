import { redirect } from 'next/navigation'

export default function AdminPage(): never {
  // Canonical admin surface is /configuration (design-faithful + BE-wired).
  // Kept as a redirect so old links and toolbars continue to work.
  redirect('/configuration')
}
