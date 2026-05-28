'use client'

import type { ReactNode } from 'react'
import { useDroppable } from '@dnd-kit/core'

export const droppableIdForPage = (page: number) => `page-${page}`

export function DroppablePage({
  page,
  children,
}: {
  page: number
  children: ReactNode
}) {
  const { setNodeRef } = useDroppable({
    id: droppableIdForPage(page),
    data: { kind: 'pdf-page', page },
  })

  return (
    <div ref={setNodeRef} className="relative">
      {children}
    </div>
  )
}
