# Dark Mode — Design Spec

**Date:** 2026-05-31  
**Status:** Approved

---

## Overview

Add dark mode support to the ESign web app and signer app. Mode defaults to the OS `prefers-color-scheme` setting but users can override it via the Configuration → Appearance section. The preference is persisted to `localStorage`.

---

## 1. Dark Token Palette

A `[data-theme="dark"]` block is added to `packages/ui/src/globals.css` that overrides the surface, ink, border, and shadow tokens. Brand and semantic colors are retained (terracotta reads well on dark). The palette is warm dark — deep charcoal-brown backgrounds with warm white text.

### Token overrides

| Token | Light | Dark |
|---|---|---|
| `--color-paper` | `oklch(0.987 0.008 75)` | `oklch(0.13 0.012 55)` |
| `--color-surface` | `oklch(0.996 0.004 75)` | `oklch(0.16 0.012 55)` |
| `--color-surface-hover` | `oklch(0.965 0.012 70)` | `oklch(0.20 0.014 55)` |
| `--color-surface-raised` | `oklch(1 0 0)` | `oklch(0.19 0.012 55)` |
| `--color-surface-sunken` | `oklch(0.955 0.013 70)` | `oklch(0.11 0.010 55)` |
| `--color-ink` | `oklch(0.21 0.018 60)` | `oklch(0.93 0.008 75)` |
| `--color-ink-muted` | `oklch(0.42 0.014 60)` | `oklch(0.72 0.010 70)` |
| `--color-ink-subtle` | `oklch(0.58 0.010 60)` | `oklch(0.55 0.010 65)` |
| `--color-ink-faint` | `oklch(0.72 0.008 60)` | `oklch(0.38 0.008 60)` |
| `--color-ink-inverse` | `oklch(0.987 0.008 75)` | `oklch(0.13 0.012 55)` |
| `--color-border` | `oklch(0.910 0.010 65)` | `oklch(0.26 0.012 55)` |
| `--color-border-strong` | `oklch(0.820 0.014 65)` | `oklch(0.34 0.014 55)` |
| `--color-border-subtle` | `oklch(0.945 0.008 65)` | `oklch(0.20 0.010 55)` |
| `--color-brand` | `oklch(0.665 0.155 38)` | `oklch(0.72 0.155 38)` |
| `--color-brand-soft` | `oklch(0.945 0.040 40)` | `oklch(0.22 0.045 38)` |
| `--color-brand-strong` | `oklch(0.500 0.170 38)` | `oklch(0.82 0.140 38)` |
| `--shadow-focus` | `0 0 0 3px oklch(0.945 0.040 40)` | `0 0 0 3px oklch(0.22 0.045 38)` |
| `--shadow-1` | warm light | `0 1px 2px oklch(0 0 0 / 0.25)` |
| `--shadow-2` | warm light | `0 8px 24px oklch(0 0 0 / 0.40), 0 2px 4px oklch(0 0 0 / 0.20)` |
| `--shadow-3` | warm light | `0 24px 48px oklch(0 0 0 / 0.55), 0 4px 8px oklch(0 0 0 / 0.25)` |

Semantic colors (success, warning, danger, info, status, signer palette) are **unchanged** — they are vivid enough to work on both backgrounds.

---

## 2. Theme Infrastructure

### 2a. Web app (`apps/web`) — `next-themes`

**Install:** `next-themes` added to `apps/web/package.json`.

**`apps/web/app/providers.tsx`** — wrap existing providers with `ThemeProvider`:
```tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
  {/* existing QueryClientProvider + TooltipProvider */}
</ThemeProvider>
```

**`apps/web/app/layout.tsx`** — add `suppressHydrationWarning` to `<html>` to prevent Next.js hydration mismatch (next-themes injects `data-theme` before hydration):
```tsx
<html lang="en" suppressHydrationWarning ...>
```

### 2b. Signer app (`apps/signer`) — standalone hook

No SSR, so no library needed. A `useTheme` hook in `apps/signer/src/lib/use-theme.ts`:
- Reads preference from `localStorage` key `esign:theme` (`"light"` | `"dark"` | `"system"`)
- Falls back to `window.matchMedia('(prefers-color-scheme: dark)')` when value is `"system"`
- Sets `data-theme="dark"` or `data-theme="light"` on `document.documentElement`
- Listens for system preference changes when in `"system"` mode
- Returns `{ theme, resolvedTheme, setTheme }` — same API shape as `next-themes`

---

## 3. Appearance Toggle UI

### Location
**Configuration page** (`apps/web/app/(app)/configuration/page.tsx`) — new **"Appearance"** entry added to `AdminSubNav` alongside Users, Audit Log, General, Branding.

### Component
New `AppearanceSection` in `apps/web/components/admin/sections.tsx`.

**UI:** A segmented 3-button control:
```
[ Light ]  [ System ]  [ Dark ]
```
- Active option highlighted with brand color fill
- Calls `useTheme().setTheme('light' | 'system' | 'dark')` from `next-themes`
- State is immediately reflected — no save button needed (persisted by next-themes to localStorage automatically)

### AdminSubNav update
`atoms.tsx` — add `'Appearance'` to the nav items list with a `Sun` or `Palette` icon from Lucide.

---

## 4. Scope

| Item | In scope |
|---|---|
| Dark token palette in shared CSS | Yes |
| Web app ThemeProvider (next-themes) | Yes |
| Signer app standalone useTheme hook | Yes |
| Configuration → Appearance section + toggle | Yes |
| Per-user theme persisted to backend DB | No — localStorage only for v1 |
| Auth pages (login/signup) dark mode | Yes — inherits from CSS vars automatically |
| PDF editor / field overlay dark mode | Yes — inherits from CSS vars |
| Email templates dark mode | No — emails rendered server-side, out of scope |

---

## 5. Files Changed

| File | Change |
|---|---|
| `packages/ui/src/globals.css` | Add `[data-theme="dark"]` token overrides |
| `apps/web/package.json` | Add `next-themes` dependency |
| `apps/web/app/layout.tsx` | Add `suppressHydrationWarning` to `<html>` |
| `apps/web/app/providers.tsx` | Wrap with `ThemeProvider` |
| `apps/web/components/admin/atoms.tsx` | Add "Appearance" to AdminSubNav items |
| `apps/web/components/admin/sections.tsx` | Add `AppearanceSection` component |
| `apps/web/app/(app)/configuration/page.tsx` | Wire `AppearanceSection` to "Appearance" section |
| `apps/signer/src/lib/use-theme.ts` | New standalone theme hook |
