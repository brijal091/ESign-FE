import type { FieldType } from '@esign/types'
import {
  PenLine,
  Type,
  User,
  Mail,
  Phone,
  Building2,
  AlignLeft,
  SquareCheck,
  CircleDot,
  ChevronDown,
  Calendar,
  Strikethrough,
  type LucideIcon,
} from 'lucide-react'

export interface FieldTypeMeta {
  type: FieldType
  label: string
  icon: LucideIcon
  defaultSize: { width: number; height: number } // percent of page
}

export const FIELD_TYPES: FieldTypeMeta[] = [
  { type: 'signature', label: 'Signature', icon: PenLine, defaultSize: { width: 22, height: 5 } },
  { type: 'initials', label: 'Initials', icon: Type, defaultSize: { width: 10, height: 5 } },
  { type: 'name', label: 'Name', icon: User, defaultSize: { width: 20, height: 3 } },
  { type: 'email', label: 'Email', icon: Mail, defaultSize: { width: 22, height: 3 } },
  { type: 'phone', label: 'Phone', icon: Phone, defaultSize: { width: 18, height: 3 } },
  { type: 'company', label: 'Company', icon: Building2, defaultSize: { width: 22, height: 3 } },
  { type: 'text', label: 'Text', icon: Type, defaultSize: { width: 20, height: 3 } },
  {
    type: 'multiline_text',
    label: 'Multiline Text',
    icon: AlignLeft,
    defaultSize: { width: 25, height: 7 },
  },
  { type: 'checkbox', label: 'Checkbox', icon: SquareCheck, defaultSize: { width: 3, height: 2 } },
  { type: 'radio', label: 'Radio', icon: CircleDot, defaultSize: { width: 3, height: 2 } },
  {
    type: 'selection',
    label: 'Selection',
    icon: ChevronDown,
    defaultSize: { width: 18, height: 3 },
  },
  { type: 'date', label: 'Date', icon: Calendar, defaultSize: { width: 12, height: 3 } },
  {
    type: 'strikethrough',
    label: 'Strikethrough',
    icon: Strikethrough,
    defaultSize: { width: 18, height: 1 },
  },
]

const BY_TYPE: Record<FieldType, FieldTypeMeta> = Object.fromEntries(
  FIELD_TYPES.map((m) => [m.type, m]),
) as Record<FieldType, FieldTypeMeta>

export function fieldTypeMeta(type: FieldType): FieldTypeMeta {
  return BY_TYPE[type]
}
