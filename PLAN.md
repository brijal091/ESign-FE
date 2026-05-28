# ESign Platform — Build Plan
**Created:** 2026-05-20

---

## Product Summary

E-Signature SaaS platform (DocuSign / Odoo Sign alternative).

**Core capabilities:**
- Upload PDF documents and place signature/form fields via drag-and-drop
- Send documents to signers (no account required for signers)
- Electronic signature capture: draw, type, or upload
- Sequential and parallel signing workflows
- Legally compliant audit trail (ESIGN Act US, eIDAS EU)
- Contact management with groups, CSV import/export
- Admin panel with RBAC user management

**Target market:** Global — US + EU primary, India (Aadhaar) future phase.
**Mobile strategy:** PWA now, React Native native app later.
**Embedded SDK:** Architecture supports it, build in a later phase.
**PDF engine:** Open-source (PDF.js / react-pdf).

---

## Architecture Decision

**Turborepo Monorepo** with two apps:

```
esign-monorepo/
├── apps/
│   ├── web/          # Next.js 15 — main SaaS dashboard
│   └── signer/       # Vite + React — public signing page (future embedded SDK)
├── packages/
│   ├── ui/           # shadcn/ui shared components
│   ├── pdf-engine/   # PDF.js shared utilities
│   ├── types/        # Zod schemas + TypeScript types
│   └── hooks/        # Business logic (future React Native share)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework (dashboard) | Next.js 15 App Router |
| Framework (signer) | Vite 6 + React 19 |
| Language | TypeScript 5 strict |
| Monorepo | Turborepo + pnpm workspaces |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Icons | Lucide React |
| PDF viewing | react-pdf (PDF.js wrapper) |
| Field editor overlay | PDF.js + DOM absolute-positioned div layer |
| Drag and drop | @dnd-kit/core |
| Signature drawing | react-signature-canvas |
| PDF finalization | pdf-lib (server-side only) |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| Forms | React Hook Form + Zod |
| Auth | NextAuth.js v5 — email/password + OAuth |
| Real-time | Server-Sent Events (Next.js route handlers) |
| PWA | next-pwa + @vite-pwa/plugin |
| Email templates | React Email + Resend |
| Charts | Recharts |
| Toasts | Sonner |
| Testing | Vitest + React Testing Library + Playwright |
| Package manager | pnpm |

---

## The 5 UI Surfaces

1. **Sender Dashboard** — upload, manage documents, view status, contacts, analytics
2. **Document Field Editor** — place signature/field boxes on PDF pages (hardest UI)
3. **Signing Page** — public, mobile-first, guided field-by-field signing flow
4. **Admin Panel** — user management, RBAC, audit logs
5. **Signer Auth Flow** — OTP verification, ESIGN consent screen

---

## Build Phases

### Phase 1 — Technical Spike (2–3 weeks) ← START HERE
> De-risk the hardest parts before writing any dashboard code.

- [ ] Turborepo + pnpm monorepo skeleton
- [ ] Render a multi-page PDF with react-pdf
- [ ] Add DOM overlay layer on top of PDF canvas
- [ ] Drag a field from palette, drop on page, store position as `x%/y%`
- [ ] Verify position survives zoom in/out and window resize
- [ ] Signature modal: Draw tab (bezier smoothing), Type tab, Upload tab
- [ ] Export signature at high resolution (devicePixelRatio × 3)
- [ ] Test everything on real iPhone Safari

**Exit criteria:** A field dropped at 50% from top of page 2 stays at 50% at any zoom level, on any browser.

---

### Phase 2 — Foundation (2–3 weeks)
- [ ] NextAuth.js — email/password, Google OAuth, role middleware
- [ ] Tailwind design tokens (all colors as CSS vars for white-label)
- [ ] Base layout: sidebar nav, top bar, responsive shell
- [ ] TanStack Query setup + auth-aware API client
- [ ] PWA manifest + service worker (both apps)
- [ ] Zod schemas for all shared types (Document, Contact, Field, Signer, AuditEvent)
- [ ] Playwright E2E scaffolding

---

### Phase 3 — Document Management (2 weeks)
- [ ] Document upload: react-dropzone, PDF-only validation, size limit
- [ ] Document list with status badges
- [ ] Document search + filter by status/date
- [ ] Template creation from existing document
- [ ] Document archive / soft delete

---

### Phase 4 — Field Editor (3 weeks)
- [ ] Multi-page PDF viewer with page thumbnail sidebar
- [ ] Field palette: Signature, Initials, Date, Text, Checkbox
- [ ] Drag fields from palette → drop onto page
- [ ] Resize fields with drag handles
- [ ] Assign fields to specific signers (color-coded per signer)
- [ ] Field properties panel: required/optional, validation
- [ ] Signing order config: sequential vs parallel, numbered order badges
- [ ] Save field layout as reusable template

---

### Phase 5 — Signing Experience (3 weeks)
- [ ] Signer page (Vite app, token-authenticated, no login required)
- [ ] ESIGN Act disclosure + consent screen (legally required)
- [ ] Guided flow: highlight next required field, auto-scroll
- [ ] Signature modal: Draw / Type / Upload tabs
- [ ] OTP email verification before final submission
- [ ] "Adopt signature" confirmation with legal language
- [ ] Server-side PDF finalization via pdf-lib
- [ ] Completion screen + download signed PDF
- [ ] Decline with reason flow
- [ ] Offline resilience: queue locally, submit when online

---

### Phase 6 — Contact Management (1–2 weeks)
- [ ] Contact CRUD (name, email, phone, company, notes, groups)
- [ ] Auto-suggest contacts when adding signers
- [ ] Contact groups
- [ ] CSV import with field mapping UI
- [ ] CSV export
- [ ] Search by name/email, filter by group/company

---

### Phase 7 — Notifications & Workflow (2 weeks)
- [ ] React Email templates: invitation, reminder, completion, declined
- [ ] Set expiration date per document
- [ ] Reminder scheduling (send reminder in N days)
- [ ] Real-time status updates in sender dashboard (SSE)
- [ ] Sequential workflow: next signer notified after previous completes
- [ ] Parallel workflow: all signers notified simultaneously

---

### Phase 8 — Dashboard & Admin (2 weeks)
- [ ] Analytics: documents sent/signed/pending, conversion rate (Recharts)
- [ ] Audit trail viewer: per-document timeline with IP, browser, timestamp
- [ ] Audit report download (alongside signed PDF)
- [ ] Admin: user list, create/deactivate, assign roles
- [ ] Admin: team usage stats

---

### Phase 9 — Compliance & Polish (1–2 weeks)
- [ ] ESIGN Act: full consent/disclosure flow, intent-to-sign confirmation
- [ ] eIDAS SES: IP + timestamp + email verification in audit trail
- [ ] SHA-256 hash display on completed documents
- [ ] Document integrity verification page
- [ ] WCAG 2.1 AA audit (keyboard nav, ARIA, color contrast)
- [ ] Safari / Firefox / Chrome cross-browser QA

---

### Phase 10 — Advanced (Future)
- [ ] White-label theming UI (tenant sets logo + colors)
- [ ] Embedded signing SDK (extract `apps/signer` as `<script>` widget)
- [ ] React Native mobile app (reuse `packages/hooks` + `packages/types`)
- [ ] Bulk document sending
- [ ] AI field detection (suggest where fields should go)
- [ ] Aadhaar eSign integration (India market)
- [ ] Blockchain attestation

---

## Top Risks

| Risk | Mitigation |
|---|---|
| Field positioning breaks on mobile/Safari | Phase 1 spike — test on real iPhone before Phase 4 |
| PDF.js canvas + DOM overlay z-index conflicts | Test with sticky headers during spike |
| Signature resolution too low for legal use | Export at `devicePixelRatio × 3`, minimum 300px tall |
| eIDAS "advanced" level needs qualified certificate | v1 targets "simple" eIDAS only |
| PDF finalization slow for large docs | Server-side only, show progress indicator |

---

## Critical Design Rules

1. **Field positions = percentages**, never pixels
2. **PDF finalization = server-side only** (legal requirement)
3. **Audit trail = append-only**, written only by server
4. **White-label = CSS custom properties**, never hardcoded colors
5. **Signer page = no account required**, short-lived JWT in URL only
