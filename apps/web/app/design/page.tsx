import type { Metadata } from 'next'
import { DesignIndexView } from './design-index-view'

export const metadata: Metadata = {
  title: 'ESign · Design File',
  description: 'Paraph Design System — design file index for ESign v0.1.',
}

export default function DesignFilePage() {
  return <DesignIndexView />
}
