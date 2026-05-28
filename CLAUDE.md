# ESign — Claude Code Project Guide

## Project Overview

An E-Signature SaaS platform (DocuSign/Odoo Sign alternative) supporting document upload, drag-and-drop field placement, electronic signing, workflow management, audit trails, and legal compliance (ESIGN Act / eIDAS).

## Architecture

**Turborepo Monorepo** — two apps, three shared packages:

```
esign-monorepo/
├── apps/
│   ├── web/          # Next.js 15 App Router — dashboard, sender UI, admin
│   └── signer/       # Vite 6 + React 19 — standalone signing page (future embedded SDK)
├── packages/
│   ├── ui/           # shadcn/ui component library (shared)
│   ├── pdf-engine/   # PDF.js utilities (shared)
│   ├── types/        # Zod schemas + TypeScript types (shared)
│   └── hooks/        # Business logic hooks (future React Native code share)
└── turbo.json
```

**Why two apps:** The signer page is public (token-only auth), mobile-first, and must become an embeddable JS widget later. Vite produces a lighter bundle than Next.js for this. The main dashboard benefits from SSR.

## Tech Stack

### Core
- **React 19** + **TypeScript 5** (strict mode everywhere)
- **Next.js 15** App Router (web app)
- **Vite 6** (signer app)
- **Turborepo** (monorepo build orchestration)

### Styling & UI
- **Tailwind CSS v4** — all brand colors as CSS custom properties (white-label ready)
- **shadcn/ui** — copy-owned components, no vendor lock-in
- **Lucide React** — icons
- **Sonner** — toast notifications

### PDF & Document
- **react-pdf** — PDF.js wrapper for viewing
- **PDF.js** — direct usage in field editor
- **DOM absolute-positioned overlay** on PDF canvas (NOT canvas-on-canvas)
- **@dnd-kit/core** — field drag-and-drop
- **react-signature-canvas** — signature drawing with bezier smoothing
- **pdf-lib** — server-side PDF finalization (signatures embedded server-side only)

### State
- **TanStack Query v5** — server state, caching, optimistic updates
- **Zustand** — client/UI state (editor state, signing flow progress)
- **React Hook Form + Zod** — forms and validation

### Auth
- **NextAuth.js v5 (Auth.js)** — email/password + Google/Microsoft OAuth
- Signer auth: short-lived JWT in URL (no account required)

### Real-time
- **Server-Sent Events** via Next.js route handlers (document status updates)

### PWA
- **next-pwa** (web app)
- **@vite-pwa/plugin** (signer app — offline signing resilience)

### Analytics
- **Recharts** — dashboard charts

### Email
- **React Email + Resend** — transactional email templates built in React

### Testing
- **Vitest + React Testing Library** — unit/component
- **Playwright** — E2E, cross-browser

## Critical Design Decisions

### Field Position Storage
Always store field positions as percentage coordinates relative to page dimensions:
```ts
{ x: number, y: number, width: number, height: number, page: number }
// All x/y/width/height are 0–100 (percent), NOT pixels
```
This survives zoom, responsive layout, retina screens, and different DPRs. Never store pixel coordinates.

### PDF Finalization is Server-Side Only
The client sends signature images + field positions to the server. The server uses pdf-lib to embed everything into the final PDF. Never trust the client to assemble the signed document — this is a legal/compliance requirement.

### Audit Trail is Append-Only
Audit events are written only by server code, never by client. Each event includes: timestamp (UTC), IP address, user agent, action type, document ID, signer identity.

### White-Label Theming
All colors defined as CSS custom properties in Tailwind config. Switching a tenant's brand = one CSS variable override file. Never hardcode color values in components.

## User Roles
- **Admin** — user management, system settings
- **Sender** — upload documents, configure fields, request signatures
- **Signer** — review and sign (no account required, token-based)
- **Viewer** — read-only access

## Compliance Targets
- **ESIGN Act (US)** — intent-to-sign consent, disclosure, attribution, retention
- **eIDAS (EU)** — simple electronic signature (SES) for v1
- **IT Act (India)** — future phase (Aadhaar eSign)

## Document Statuses
`Draft` → `Sent` → `Viewed` → `Signed` → `Completed` | `Expired` | `Declined`

## Build Phases Summary
1. **Technical Spike** — PDF editor + signing canvas (de-risk first)
2. **Foundation** — monorepo, auth, layout, design tokens, PWA
3. **Document Management** — upload, list, templates
4. **Field Editor** — drag-and-drop field placement on PDF
5. **Signing Experience** — signer page, signature capture, PDF finalization
6. **Contact Management** — CRUD, groups, CSV, auto-suggest
7. **Notifications & Workflow** — email templates, sequential/parallel signing
8. **Dashboard & Admin** — analytics, audit trail, user management
9. **Compliance & Polish** — ESIGN/eIDAS flows, WCAG 2.1 AA, cross-browser QA
10. **Advanced** — embedded SDK, React Native, white-label UI, AI field detection

## Dev Commands (once set up)
```bash
pnpm dev           # Start all apps in parallel
pnpm dev --filter=web      # Start only web app
pnpm dev --filter=signer   # Start only signer app
pnpm build         # Build all
pnpm test          # Run all tests
pnpm lint          # Lint all packages
pnpm typecheck     # TypeScript check all
```

## Package Manager
**pnpm** with workspaces. Always use pnpm, never npm or yarn.

## Code Style
- TypeScript strict mode — no `any`, no implicit returns
- Zod schemas defined in `packages/types`, imported everywhere
- No comments unless the WHY is non-obvious
- shadcn/ui components live in `packages/ui`, never duplicated per-app
- All API calls go through TanStack Query hooks, never raw fetch in components

## Key Files to Know
- `turbo.json` — build pipeline config
- `packages/types/src/index.ts` — all shared Zod schemas
- `apps/web/middleware.ts` — auth + RBAC route protection
- `apps/signer/src/main.tsx` — signer app entry (future SDK extraction point)
- `packages/pdf-engine/src/index.ts` — PDF.js utilities shared by both apps
