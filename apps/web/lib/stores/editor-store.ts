'use client'

import { create } from 'zustand'
import type { FieldType } from '@esign/types'

interface ActiveDrag {
  type: FieldType
  signerId: string
}

interface EditorState {
  selectedSignerId: string | null
  selectedFieldId: string | null
  activeDrag: ActiveDrag | null
  setSelectedSigner: (id: string | null) => void
  setSelectedField: (id: string | null) => void
  setActiveDrag: (drag: ActiveDrag | null) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  selectedSignerId: null,
  selectedFieldId: null,
  activeDrag: null,
  setSelectedSigner: (id) => set({ selectedSignerId: id }),
  setSelectedField: (id) => set({ selectedFieldId: id }),
  setActiveDrag: (drag) => set({ activeDrag: drag }),
}))
