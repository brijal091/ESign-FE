import { useMemo } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Droplet,
  Palette,
  CircleAlert,
  BadgeCheck,
  Type,
  Ruler,
  Layers,
  Zap,
  Square,
  TextCursorInput,
  Hash,
  ListOrdered,
  Tag,
  Bell,
  SquareStack,
  Table as TableIcon,
  Puzzle,
  Activity,
  MousePointerClick,
  Type as TypeIcon,
  Circle,
  SquareDashed,
  ChevronDown,
  RectangleHorizontal,
  MessageSquare,
  PanelTop,
  PanelLeft,
  SquarePen,
  UserCircle,
  Inbox,
  Loader,
  ToggleLeft,
  PenTool,
} from 'lucide-react'

export type DesignPageId =
  | 'p00'
  | 'p01'
  | 'p02'
  | 'p03'
  | 'p04'
  | 'p05'
  | 'p06'
  | 'p07'
  | 'p08'
  | 'p09'
  | 'p10'

export type BadgeTone = 'default' | 'ready' | 'done' | 'empty' | 'cover'

export interface DesignFrameCard {
  num: string
  title: string
  desc: string
  uses: string[]
}

export interface DesignRefRow {
  icon: LucideIcon
  name: string
  detail: string
  state: string
  stateGap?: boolean
}

export interface DesignPage {
  id: DesignPageId
  num: string
  name: string
  badge: { label: string; tone: BadgeTone }
  subtitle?: string
  meta?: { label: string; value: string }[]
  cards?: DesignFrameCard[]
  refColumns?: { heading: string; rows: DesignRefRow[] }[]
  /** Deep-link into the actual implemented app route, when one exists. */
  appHref?: string
  appHrefLabel?: string
  framesNote?: string
  layoutRows?: { name: string; desc: string; dim: string }[]
}

const manifest: DesignPage[] = [
  {
    id: 'p00',
    num: '00',
    name: 'Cover',
    badge: { label: 'cover', tone: 'cover' },
  },
  {
    id: 'p01',
    num: '01',
    name: 'Foundations',
    badge: { label: 'DS', tone: 'ready' },
    subtitle:
      'Color, type, spacing, radii, shadows, motion — already populated from the Paraph DS. Leave as‑is.',
    meta: [
      { label: 'status', value: 'ready' },
      { label: 'source', value: 'paraph.css' },
    ],
    refColumns: [
      {
        heading: 'Color tokens',
        rows: [
          {
            icon: Droplet,
            name: 'Surfaces & ink',
            detail: 'paper, surface, ink, ink‑muted, ink‑subtle, ink‑faint',
            state: '12 tokens',
          },
          {
            icon: Palette,
            name: 'Brand',
            detail: 'brand, brand‑hover, brand‑active, brand‑soft, brand‑strong',
            state: '5 tokens',
          },
          {
            icon: CircleAlert,
            name: 'Semantic',
            detail: 'success · warning · danger · info (×3 each)',
            state: '12 tokens',
          },
          {
            icon: BadgeCheck,
            name: 'Status',
            detail: 'draft · sent · viewed · signed · declined · expired',
            state: '6 tokens',
          },
        ],
      },
      {
        heading: 'Type, spacing, motion',
        rows: [
          {
            icon: Type,
            name: 'Type families',
            detail: 'Geist · Instrument Serif · Geist Mono',
            state: '3 families',
          },
          {
            icon: Ruler,
            name: 'Spacing scale',
            detail: '4px base · 0,1,2,3,4,6,8,12,16,20,24…',
            state: '15 steps',
          },
          {
            icon: Square,
            name: 'Radii',
            detail: 'xs 4 · sm 6 · md 10 · lg 14 · xl 20 · full',
            state: '6 steps',
          },
          {
            icon: Layers,
            name: 'Shadows',
            detail: 'shadow‑1, shadow‑2, shadow‑3, focus',
            state: '4 elev.',
          },
          {
            icon: Zap,
            name: 'Motion',
            detail: 'dur‑1…4 · ease‑out · ease‑in‑out',
            state: '6 tokens',
          },
        ],
      },
    ],
  },
  {
    id: 'p02',
    num: '02',
    name: 'Components',
    badge: { label: 'DS', tone: 'ready' },
    subtitle:
      'Components shipped with the Paraph DS. Pages 03–10 reference these by name — never redraw.',
    meta: [
      { label: 'status', value: 'ready (10 of 25)' },
      { label: 'gaps', value: '15 to add' },
    ],
    refColumns: [
      {
        heading: 'Shipped in Paraph DS',
        rows: [
          { icon: Square, name: 'Button', detail: 'primary · secondary · ghost · destructive · sm/md/lg', state: 'ready' },
          { icon: TextCursorInput, name: 'Input', detail: 'default · focus · filled · error · disabled', state: 'ready' },
          { icon: Hash, name: 'OTP input', detail: '6‑digit segmented', state: 'ready' },
          { icon: ListOrdered, name: 'Progress Stepper', detail: 'active · complete · upcoming', state: 'ready' },
          { icon: Tag, name: 'Badge', detail: 'Draft · Sent · Viewed · Signed · Declined · Expired', state: 'ready' },
          { icon: Bell, name: 'Toast', detail: 'success · info · warning · error · loading', state: 'ready' },
          { icon: SquareStack, name: 'Dialog (Modal)', detail: 'header · body · footer · destructive variant', state: 'ready' },
          { icon: TableIcon, name: 'Table row', detail: 'avatar stack · status badge · date · menu', state: 'ready' },
          { icon: Puzzle, name: 'Field chip', detail: 'signature · initials · date · text · checkbox', state: 'ready' },
          { icon: Activity, name: 'Audit event', detail: 'icon · actor · action · timestamp', state: 'ready' },
        ],
      },
      {
        heading: 'To define before flow prompts (gap)',
        rows: [
          { icon: MousePointerClick, name: 'Icon Button', detail: 'square button · 28/32/36 · ghost & outline', state: 'define', stateGap: true },
          { icon: TypeIcon, name: 'Textarea', detail: 'multi‑line input · resize handle', state: 'define', stateGap: true },
          { icon: Tag, name: 'Label', detail: 'field label · required asterisk · helper text', state: 'define', stateGap: true },
          { icon: Circle, name: 'Status Dot', detail: '6 status colors · 8px · with optional label', state: 'define', stateGap: true },
          { icon: SquareDashed, name: 'Card', detail: 'generic content card · padding 20/24', state: 'define', stateGap: true },
          { icon: ChevronDown, name: 'Dropdown Menu', detail: 'items · separators · destructive item · submenu', state: 'define', stateGap: true },
          { icon: RectangleHorizontal, name: 'Tabs', detail: 'underline · pill variants', state: 'define', stateGap: true },
          { icon: MessageSquare, name: 'Tooltip', detail: '4 placements · keyboard shortcut row', state: 'define', stateGap: true },
          { icon: PanelTop, name: 'Top Nav', detail: '64h · logo · primary nav · search · avatar', state: 'define', stateGap: true },
          { icon: PanelLeft, name: 'Sidebar Section', detail: 'group label · nav items · collapsible', state: 'define', stateGap: true },
          { icon: Palette, name: 'Signer Color Chip', detail: 'per‑signer color · circular swatch', state: 'define', stateGap: true },
          { icon: SquarePen, name: 'Field‑Type Chip', detail: '13 field types · iconified', state: 'define', stateGap: true },
          { icon: Hash, name: 'Tag Chip', detail: 'document tag · removable', state: 'define', stateGap: true },
          { icon: UserCircle, name: 'Avatar', detail: 'initials · image · sm/md/lg · stack', state: 'define', stateGap: true },
          { icon: Inbox, name: 'Empty State', detail: 'icon · headline · body · CTA', state: 'define', stateGap: true },
          { icon: Loader, name: 'Skeleton Loader', detail: 'line · block · table row shimmer', state: 'define', stateGap: true },
          { icon: ToggleLeft, name: 'Switch', detail: 'off · on · disabled · with label', state: 'define', stateGap: true },
          { icon: PenTool, name: 'Signature Pad', detail: 'draw / type / upload tabs · clear · accept', state: 'define', stateGap: true },
        ],
      },
    ],
    layoutRows: [
      { name: 'App Shell', desc: 'Top Nav (64h) + content area · used by Documents, Dashboard, Templates, Admin', dim: '1440 × 900' },
      { name: 'Auth Split', desc: '50/50 · brand panel left · form right (400w form, vertically centered)', dim: '1440 × 900' },
      { name: 'Editor Layout', desc: 'Top action bar 56h + left sidebar 320w + center PDF canvas', dim: '1440 × 900' },
      { name: 'Mobile Signer', desc: '56h sticky top + scroll content + 64h sticky bottom action bar', dim: '375 × 812 · 1440 fallback' },
    ],
  },
  {
    id: 'p03',
    num: '03',
    name: 'Auth',
    badge: { label: '9 frames', tone: 'done' },
    subtitle: 'Sender account creation, login, password recovery. Mounted in Auth Split layout.',
    meta: [
      { label: 'status', value: 'empty · ready' },
      { label: 'layout', value: 'auth‑split 1440×900' },
    ],
    appHref: '/login',
    appHrefLabel: 'Open /login',
    framesNote: '9 frames · 4 annotations',
    cards: [
      { num: '03.01', title: 'Log in', desc: 'Email + password. Magic‑link option. Errors on invalid credentials. SSO buttons reserved (Google / Microsoft).', uses: ['Input', 'Button', 'Label', 'Toast'] },
      { num: '03.02', title: 'Sign up — email', desc: 'Step 1 of 3. Capture email, present T&C. Stepper visible.', uses: ['Progress Stepper', 'Input', 'Button', 'Label'] },
      { num: '03.03', title: 'Sign up — OTP', desc: 'Step 2. 6‑digit code from email. Resend timer. Error on mismatch.', uses: ['OTP Input', 'Progress Stepper', 'Button', 'Toast'] },
      { num: '03.04', title: 'Sign up — org details', desc: 'Step 3. Company name, role, team size. Submit → Documents (empty state).', uses: ['Input', 'Dropdown Menu', 'Progress Stepper', 'Button'] },
      { num: '03.05', title: 'Forgot password', desc: 'Single‑field reset request. Toast on send.', uses: ['Input', 'Button', 'Toast'] },
      { num: '03.06', title: 'Reset password', desc: 'Token‑gated. Two password fields, validation rules visible.', uses: ['Input', 'Label', 'Button'] },
    ],
  },
  {
    id: 'p04',
    num: '04',
    name: 'Documents',
    badge: { label: '5 frames', tone: 'done' },
    subtitle:
      "The sender's primary surface. Lists every Document with status, signers, dates. Filters, bulk actions, row menus.",
    meta: [
      { label: 'status', value: 'empty · ready' },
      { label: 'layout', value: 'app‑shell 1440×900' },
    ],
    appHref: '/documents',
    appHrefLabel: 'Open /documents',
    framesNote: '5 frames · 3 annotations',
    cards: [
      { num: '04.01', title: 'All documents — populated', desc: 'Default view. Mixed status. Filter bar, search, "Send for Signature" CTA.', uses: ['Top Nav', 'Table', 'Badge', 'Avatar', 'Tag Chip', 'Dropdown Menu', 'Button'] },
      { num: '04.02', title: 'Filtered: "To Sign"', desc: 'Sent documents awaiting signers. Sorted by sent date desc.', uses: ['Table', 'Badge', 'Tabs'] },
      { num: '04.03', title: 'Empty state', desc: 'No documents yet. "Upload a PDF" primary action.', uses: ['Empty State', 'Button'] },
      { num: '04.04', title: 'Document detail drawer', desc: 'Side drawer: thumbnail, signer list with progress, audit timeline, actions.', uses: ['Dialog', 'Badge', 'Avatar', 'Audit Event', 'Button'] },
      { num: '04.05', title: 'Upload dialog', desc: 'Drag‑drop or click. Accepts PDF only. Progress + cancel.', uses: ['Dialog', 'Button', 'Skeleton Loader'] },
      { num: '04.06', title: 'Bulk actions', desc: 'Row checkbox selection state. Floating action bar with archive / remind / delete.', uses: ['Table', 'Button', 'Tooltip'] },
    ],
  },
  {
    id: 'p05',
    num: '05',
    name: 'Editor',
    badge: { label: '7 frames', tone: 'done' },
    subtitle: 'Field placement on a PDF. Sender drops fields, assigns each to a signer, sets order, sends.',
    meta: [
      { label: 'status', value: 'empty · ready' },
      { label: 'layout', value: 'editor 1440×900' },
    ],
    appHref: '/documents',
    appHrefLabel: 'Open Editor (via Documents)',
    framesNote: '7 frames · 2 annotations',
    cards: [
      { num: '05.01', title: 'Editor — empty PDF', desc: 'Fresh upload. Sidebar shows 13 field types. Recipients = sender only.', uses: ['Sidebar Section', 'Field‑Type Chip', 'Signer Color Chip', 'Button'] },
      { num: '05.02', title: 'Adding recipients', desc: 'Add Signer / Recipient / Viewer rows. Color assigned per signer. Set signing order.', uses: ['Input', 'Dropdown Menu', 'Signer Color Chip', 'Switch'] },
      { num: '05.03', title: 'Placing fields', desc: 'Mid‑placement state. Dragging a signature field onto canvas. Field properties popover on right.', uses: ['Field‑Type Chip', 'Tooltip', 'Dialog'] },
      { num: '05.04', title: 'All 13 field types placed', desc: 'Showcase frame: signature, initials, name, email, phone, company, text, multiline_text, checkbox, radio, selection, date, strikethrough.', uses: ['Field‑Type Chip', 'Signer Color Chip', 'Label'] },
      { num: '05.05', title: 'Send for Signature dialog', desc: 'Subject, message, send order summary, expiration. "Send" primary CTA.', uses: ['Dialog', 'Input', 'Textarea', 'Button'] },
      { num: '05.06', title: 'Sign Now (sender self‑sign)', desc: 'Editor in self‑sign mode. Single signer, Signature Pad open.', uses: ['Signature Pad', 'Field‑Type Chip', 'Button'] },
    ],
  },
  {
    id: 'p06',
    num: '06',
    name: 'Signer',
    badge: { label: '14 frames', tone: 'done' },
    subtitle: 'No‑account flow. Recipient opens email link → mobile‑first sign experience. Desktop 1440 fallback centered.',
    meta: [
      { label: 'status', value: 'empty · ready' },
      { label: 'layout', value: 'mobile signer 375×812' },
    ],
    framesNote: '6 screens × {mobile + desktop} · 2 annotations',
    cards: [
      { num: '06.01', title: 'Welcome / intent‑to‑sign', desc: 'Document title, sender, page count. Required legal disclosure. "Begin" CTA.', uses: ['Button', 'Avatar', 'Label'] },
      { num: '06.02', title: 'Document scroll + sticky next field', desc: 'PDF rendered in viewport. Sticky bottom bar shows next required field, progress.', uses: ['Progress Stepper', 'Field‑Type Chip', 'Button'] },
      { num: '06.03', title: 'Signature pad — draw / type / upload', desc: 'Three‑tab sheet. Save signature for future fields toggle.', uses: ['Signature Pad', 'Tabs', 'Switch', 'Button'] },
      { num: '06.04', title: 'Text / date / checkbox field entry', desc: 'In‑place input UI for non‑signature fields. Keyboard‑safe layout.', uses: ['Input', 'Textarea', 'Switch'] },
      { num: '06.05', title: 'Decline to sign', desc: 'Confirm dialog with reason field. Sender is notified.', uses: ['Dialog', 'Textarea', 'Button'] },
      { num: '06.06', title: 'Completed / download copy', desc: 'Success state. Download signed PDF + audit certificate.', uses: ['Empty State', 'Button', 'Toast'] },
    ],
  },
  {
    id: 'p07',
    num: '07',
    name: 'Dashboard',
    badge: { label: '3 frames', tone: 'done' },
    subtitle: 'Account overview. Activity, completion rates, pending actions. Sender\'s "home".',
    meta: [
      { label: 'status', value: 'done · 3 frames' },
      { label: 'layout', value: 'app‑shell 1440×900' },
    ],
    appHref: '/dashboard',
    appHrefLabel: 'Open /dashboard',
    framesNote: '3 frames',
    cards: [
      { num: '07.01', title: 'Dashboard home', desc: 'Stat cards (Sent / Signed / Pending / Expired), recent activity feed, quick actions.', uses: ['Top Nav', 'Card', 'Badge', 'Audit Event', 'Button'] },
      { num: '07.02', title: 'Dashboard — empty', desc: 'First‑use state. Onboarding tiles guiding upload → send → sign.', uses: ['Empty State', 'Card', 'Button'] },
    ],
  },
  {
    id: 'p08',
    num: '08',
    name: 'Templates & Contacts',
    badge: { label: '5 frames', tone: 'done' },
    subtitle: 'Reusable Templates with pre‑placed Fields. Contacts directory for quick‑add to new sends.',
    meta: [
      { label: 'status', value: 'done · 4 frames + 1 anno' },
      { label: 'layout', value: 'app‑shell 1440×900' },
    ],
    appHref: '/templates',
    appHrefLabel: 'Open /templates · /contacts',
    framesNote: '4 frames · 1 annotation',
    cards: [
      { num: '08.01', title: 'Templates list', desc: 'Grid or table of saved Templates. Usage count, last used, tags. "Use template" action.', uses: ['Table', 'Tag Chip', 'Dropdown Menu', 'Button'] },
      { num: '08.02', title: 'Create template', desc: 'Editor in template mode. Roles instead of named signers (e.g. "Buyer", "Seller").', uses: ['Sidebar Section', 'Field‑Type Chip', 'Input'] },
      { num: '08.03', title: 'Contacts list', desc: 'Name, email, last used, document count. Search + filter.', uses: ['Table', 'Avatar', 'Input', 'Dropdown Menu'] },
      { num: '08.04', title: 'Add / edit contact', desc: 'Dialog with name, email, phone, company, role.', uses: ['Dialog', 'Input', 'Label', 'Button'] },
    ],
  },
  {
    id: 'p09',
    num: '09',
    name: 'Admin',
    badge: { label: '6 frames', tone: 'done' },
    subtitle: 'Workspace administration. Users + roles, audit log, branding. Viewer role read‑only across the product.',
    meta: [
      { label: 'status', value: 'done · 4 frames + 3 anno' },
      { label: 'layout', value: 'app‑shell 1440×900' },
    ],
    appHref: '/configuration',
    appHrefLabel: 'Open /configuration',
    framesNote: '4 frames · 3 annotations',
    cards: [
      { num: '09.01', title: 'Users & roles', desc: 'List of workspace users with role (Sender / Admin / Viewer). Invite, change role, remove.', uses: ['Table', 'Avatar', 'Badge', 'Dropdown Menu', 'Button'] },
      { num: '09.02', title: 'Invite user dialog', desc: 'Email + role select. Optional message.', uses: ['Dialog', 'Input', 'Textarea', 'Dropdown Menu'] },
      { num: '09.03', title: 'Audit log', desc: 'Workspace‑wide event timeline. Filter by actor, action, date range.', uses: ['Audit Event', 'Tabs', 'Input'] },
      { num: '09.04', title: 'Branding', desc: 'Logo, primary color, sender email "from" name, custom signing page banner.', uses: ['Card', 'Input', 'Switch', 'Button'] },
    ],
  },
  {
    id: 'p10',
    num: '10',
    name: 'System States',
    badge: { label: '8 frames', tone: 'done' },
    subtitle: 'Cross‑cutting states every surface inherits: loading, empty, error, expired link, 404, no‑permission.',
    meta: [
      { label: 'status', value: 'done · 8 frames' },
      { label: 'layout', value: 'mixed' },
    ],
    framesNote: '8 frames · mixed viewports',
    cards: [
      { num: '10.01', title: 'Loading skeletons', desc: 'Documents table, editor sidebar, audit log — all in shimmer state.', uses: ['Skeleton Loader'] },
      { num: '10.02', title: 'Empty states catalog', desc: 'All 6 empty states side‑by‑side: documents, templates, contacts, audit, search, signer history.', uses: ['Empty State', 'Button'] },
      { num: '10.03', title: 'Error states', desc: 'Inline form errors, page‑level error, network failure with retry.', uses: ['Toast', 'Button', 'Label'] },
      { num: '10.04', title: 'Signer link — expired', desc: 'Recipient clicks an expired email link. Request new link CTA.', uses: ['Empty State', 'Button'] },
      { num: '10.05', title: '404 / not found', desc: 'Document or page not found. Return to Documents.', uses: ['Empty State', 'Button'] },
      { num: '10.06', title: 'Viewer — no permission', desc: 'Read‑only viewer attempts a send action. Inline lock state.', uses: ['Tooltip', 'Badge', 'Toast'] },
    ],
  },
]

export function useDesignManifest(): DesignPage[] {
  return useMemo(() => manifest, [])
}
