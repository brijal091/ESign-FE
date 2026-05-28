# Templates & Contacts Page

_Started 2026-05-26 13:45 UTC_

---

## User

On the page "08 — Templates & Contacts", create the following frames using App Shell. Reuse Card, Table, Button, Input, Dialog, Badge, Avatar, Tabs, Tag Chip, Progress Stepper, Dropdown Menu.

1. Templates — List
   - "Templates" tab active in nav
   - Page header: h2 "Templates" + Primary "New Template"
   - Toolbar: search Input + "All categories" Dropdown
   - 3-column grid of template Cards (280×240):
     · Top: first-page thumbnail
     · Badges row: category Badge + "5 fields" Badge
     · h4 title, caption "Last used 3 days ago"
     · Footer: Secondary "Use" + three-dot Icon Button
   - 9 sample template cards

2. Templates — Editor
   - Reuse the Editor Layout from page 05
   - Top action bar title "Template: NDA — Standard"; right side replaces "Send" with Primary "Save as Template"
   - Otherwise mirror the populated editor frame from page 05

3. Contacts — List
   - Two-pane: left sidebar 240w with Groups list ("All Contacts · 247", "Clients · 86", "Internal · 38", "Vendors · 23", "+ New group" Ghost row)
   - Right side: page header h2 "Contacts" + Primary "Add Contact" + Secondary "Import CSV"
   - Toolbar: search + filter
   - Table columns: Checkbox, Avatar+Name, Email, Phone, Company, Tags (Tag Chips), Last contacted, Action
   - 12 sample rows

4. Contacts — CSV Import (Dialog md)
   - Title "Import contacts from CSV"
   - Progress Stepper at top: Upload · Map columns · Review (step 1 active)
   - Drop zone (reuse Upload Dialog drop-zone style)
   - Caption "Download a sample CSV" (linked)
   - Footer: Ghost "Cancel" + Primary "Next" (disabled)

Annotation:
- Add Contact (Dialog sm): Title "New Contact". Inputs: Name, Email, Phone (optional), Company (optional), Group multi-select with Tag Chips. Footer: Ghost Cancel + Primary "Add".

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

## User

continue

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: update_todos]_

Now I have full context. Let me build page 08 with templates + contacts atoms & frames.

_[tool: write_file]_

Now the frames file:

_[tool: write_file]_

Now the host HTML:

_[tool: write_file]_

_[tool: list_files]_

_[tool: copy_files]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Page 08 is up with 5 frames on the canvas:

- **01 Templates · list** — App Shell w/ Templates tab active, 3×3 grid of 280×240 template cards with mini first-page thumb, category + field-count Badges, title, last-used caption, and Use/kebab footer
- **02 Templates · editor** — Editor Layout from page 05, retitled "Template: NDA — Standard", with the right-side "Send" swapped for Primary **Save as Template**; signer roles instead of named recipients
- **03 Contacts · list** — 240w Groups sidebar (All/Clients/Internal/Vendors + New group + Smart row) and a table of 12 contacts with checkbox, Avatar+Name, Email, Phone, Company, Tag Chips, Last contacted, kebab
- **04 Contacts · CSV import (md)** — Dialog with Progress Stepper (Upload · Map columns · Review, step 1 active), drop zone in the upload-dialog style, sample-CSV link, disabled Next
- **Anno · Add Contact (sm)** — Name/Email/Phone(opt)/Company(opt) + Groups multi-select rendered as TagChips, Ghost Cancel + Primary Add

## User

there is dashboard.html and template&contact.htm but stil here in teh project pages it's not showing

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

Updated the index — page 07 now shows "3 frames" and links to the Dashboard, page 08 shows "4 frames · 1 annotation" and links to Templates & Contacts. Both replaced the "Awaiting…" placeholder blocks with the same preview-thumb card pattern used for pages 03–06.

## User

<pasted_text name="Pasted text (36 lines)">
On the page "09 — Admin", create the following frames using App Shell with "Configuration" tab active and a 240w left sub-nav containing: General · Users · Roles & Permissions · Branding · Audit Log · Billing · Integrations. Reuse Card, Table, Button, Input, Badge, Avatar, Switch, Dropdown Menu, Dialog, Tabs.

1. User Management
   - Sub-nav "Users" active
   - Page header: h2 "Users" + Primary "Invite User"
   - Toolbar: search + role filter "All roles" + status filter "Active / Suspended"
   - Table columns: Avatar+Name, Email, Role (Badge variants — admin destructive-tinted, sender info-tinted, viewer muted), Status (Active dot / Suspended dot), Last active, Action menu
   - 10 sample rows
   - Annotation: Invite User Dialog md — Inputs Name, Email, Role Dropdown, optional welcome Textarea, Primary "Send Invite"

2. Audit Log
   - Sub-nav "Audit Log" active
   - Page header: h2 "Audit Log" + Secondary "Export CSV"
   - Toolbar: date range picker, actor filter, action-type multi-select
   - Table columns: Timestamp (caption, UTC), Actor (Avatar+name or email if signer), Action (muted Badge with action label), Document (truncated link), IP, User-Agent (truncated, tooltip on hover)
   - 14 rows mixing actions: document_created, document_sent, document_viewed, document_signed, document_completed, otp_verified, field_completed, document_declined
   - Pagination footer

3. Account Settings — General
   - Sub-nav "General" active
   - Stacked Card sections (each with h3 + divider + form rows):
     · Organization — Org name, Org domain (read-only), Time zone Select, Default language Select; Primary "Save"
     · Notifications — Switch rows: "Email me when a document is signed", "Email me when a document is declined", "Daily digest at 9am"
     · Security — Switch rows: "Require 2FA for all team members", "Auto-logout after 30 minutes of inactivity"; Secondary "Manage SSO"
     · Data Retention — radio group: "Keep signed documents for 1 year / 3 years / 7 years / Indefinitely"

4. Branding / White-label
   - Sub-nav "Branding" active
   - Two-column inside content area:
     · Left: Logo upload (drop zone 240×120), Primary color picker with hex Input, Accent color picker, Email header image upload, Sender-from name Input, Custom subdomain Input with trailing ".esign.app"
     · Right: Live preview Card showing a mini-Login screen with the brand applied
   - Sticky bottom-right Primary "Save Changes"

Annotations:
- Success Toast: "Branding updated. Changes are live."
- Confirm destructive setting Dialog sm: title "Are you sure?", description, Destructive confirm
</pasted_text>

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: grep]_

Let me add Configuration to TopNav, then build admin atoms/frames.

_[tool: write_file]_

_[tool: write_file]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Page 09 is up with 6 artboards on the canvas:

- **01 Users** — App Shell with Configuration tab active + 240w sub-nav (Users active), search + role + status filters, 10-row table with Avatar+Name (with "you" tag), Email, Role Badge (Admin destructive-tinted / Sender info-tinted / Viewer muted), Status (Active green dot / Suspended faint dot), Last active, kebab
- **Anno — Invite User (md)** — Name + Email inputs, Role select, optional welcome Textarea, Ghost Cancel + Primary "Send Invite"
- **02 Audit Log** — date range chip (May 20 → May 27), actor + 8-action-types filters, 14 rows mixing all 8 action types with muted mono action Badges, dashed-underline doc link, mono IP, truncated UA with a sample tooltip shown on one row, footer pagination over 1,284 events
- **03 General Settings** — four stacked SettingsCards: Organization (org name + verified domain + tz/language selects + Save), Notifications (3 SwitchRows), Security (2 SwitchRows + Manage SSO secondary), Data retention (4 radio rows, "3 years" selected, with a warning callout)
- **04 Branding** — two-column: left has Logo drop zone (filled state with northbeam mark + Replace), Primary/Accent ColorInputs with swatches + hex, Email header image, sender-from name, subdomain Input with trailing `.esign.app`; right has a sticky Live preview card showing a mini email/signing page. Sticky bottom bar with "3 unsaved changes" + Discard/Save
- **Anno — Success Toast** + **Anno — Destructive confirm (sm)** with warning-triangle glyph, dynamic body referencing "184 documents", and a destructive variant Button

Note: I added Configuration as a 5th tab in TopNav (shared by all pages) so the active-tab state reads correctly here without breaking 04/07/08.

## User

<system-info comment="Only acknowledge these if relevant">
User is viewing file: pages/09 Admin.html
</system-info>

<pasted_text name="Pasted text (29 lines)">
On the page "10 — System States", lay out the following frames in a 3-column grid for at-a-glance review. Reuse Empty State, Button, Badge, Toast, Skeleton, Input.

1. 404 — Page not found (1440×900) — App Shell visible. Empty State: large "404" display behind a lost-paper line illustration, h2 "We couldn't find that page", body "It may have been deleted or the link is broken.", Primary "Go to Documents".

2. 500 — Something went wrong (1440×900) — App Shell visible. Empty State: broken-paper illustration, h2 "Something went wrong", body "We hit an unexpected error. Our team has been notified.", Primary "Try Again" + Ghost "Go to Documents".

3. Offline (1440×900) — App Shell visible. Sticky top banner destructive @ 12% bg, body "You're offline. Some features may be unavailable." + retry Icon Button. Dimmed Documents list below.

4. Expired signing link (375×812) — Sticky top: ESign brand + close X. Empty State: destructive clock icon, h3 "This signing link has expired", body "Ask the sender to send a new invitation.", Secondary "Contact the sender". Footer caption "Need help? support@esign.app".

5. Session expired (1440×900) — Auth Split layout. Form-panel center: h2 "You've been signed out", body "For your security, we signed you out after 30 minutes of inactivity.", Primary "Sign In Again".

6. Loading skeletons (composed in one large frame, 3 sub-frames stacked):
   a. Documents list skeleton — real toolbar + 6 ghost Table rows
   b. Editor skeleton — sidebar ghost chips + PDF area ghost rectangle
   c. Dashboard skeleton — 4 KPI ghost Cards + ghost chart area

7. Toast variants (400×400):
   - Success: "Document sent."
   - Error: "Couldn't send. Try again."
   - Info: "Saving…"
   - With action: "1 document moved." [Undo]

8. Inline form errors (400×600):
   - Stack of error-state Inputs with helper text:
     · Email: "Enter a valid email address."
     · Password: "Must be at least 8 characters."
     · Required: "This field is required."
     · Length: "Maximum 120 characters."
</pasted_text>

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: grep]_

_[tool: write_file]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Page 10 is up with 8 system states laid out across 3 rows for at-a-glance review:

**Row 1 — App-level errors** (App Shell visible on all 3)
- **10.01 · 404** — huge italic "404" backdrop with a tilted "lost" paper drifting off, dotted breadcrumb trail; primary "Go to Documents" + faded path token
- **10.02 · 500** — torn-in-half paper with stress-spark accents; "Try Again" primary + ghost "Go to Documents", plus a request-ID chip for support
- **10.03 · Offline** — destructive 12%-tinted sticky banner with WiFi-off glyph, last-sync time, retry IconButton; documents list below dimmed to 55%

**Row 2 — Recipient & in-flight dead-ends**
- **10.04 · Session expired** — Auth Split layout with remembered-account card (avatar + email + Switch link) above primary "Sign In Again"
- **10.05 · Expired link (375×812)** — sticky brand + close X, destructive clock-x in danger-soft ring, document name strip, secondary "Contact the sender", footer support link
- **10.06 · Loading skeletons** — three stacked sub-frames (Documents list w/ real toolbar + 6 ghost rows, Editor sidebar chips + canvas, Dashboard 4 KPIs + ghost chart)

**Row 3 — Inline feedback**
- **10.07 · Toasts** — Success, Error, Info variants + a dark "1 document moved" with inline Undo action
- **10.08 · Inline errors** — 4 error-state Inputs with red triangle, helper text, required asterisk, and an over-limit counter (158/120)

## User

Verifier agent check completed

## Assistant

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

Fixed — `clock-x` → `clock-alert` in the Expired-link illustration. Console is now clean.

## User

this admin.html and system states also not showing here in ESign pages. also if you notice frames in green till signed then color changes that also needs to be fixed...

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

Fixed both:

1. **Sidebar badges** — added a new `.done` style (brand terracotta soft/strong) and migrated pages 03–10 to it. The semantic is now: `ready` = green (planned/queued), `done` = brand (signed/shipped), `empty` = gray (no work yet). All eight populated pages now share the consistent "signed" color instead of the in-progress green.

2. **Pages 09 & 10 now show in the index** — replaced the "Awaiting…" placeholder artboards for both with the same link-card pattern used for 03–08. Page 09 has a 3-up preview row + the annotations tile linking to `pages/09 Admin.html`; Page 10 has an 8-up grid (mixed viewports — 1440×900, 375×812, 760×900, micro) linking to `pages/10 System States.html`. Both header meta strips also moved from "empty · ready" → "done · X frames".

## User

can we change the color theme for this whole project ? i like the structure and flow just color theme ?

## Assistant

_[tool: grep]_

_[tool: questions_v2]_

Yes — easy swap. The whole project pulls from one CSS file, so I can re-theme everything in one go. A few directions before I commit:

## User

Questions answered:
- palette: 4
- mode: Both (toggle later)
- keep_warm_paper: Decide for me
- scope: Decide for me

## User

continue

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: grep]_

_[tool: write_file]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: grep]_

Now rewriting the palette to "Trust · banking blue" with both light and dark variants, plus fixing the hard-coded warm-paper hex.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: run_script]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: done]_

_[tool: str_replace_edit]_

_[tool: fork_verifier_agent]_

Palette swapped to **Trust — banking blue**. Highlights of what changed across the whole project:

**`assets/paraph.css`** (one file, drives everything)
- Paper → cool near-white `oklch(0.975 0.002 250)`
- Ink → near-black with slight cool cast
- Brand → electric blue `oklch(0.520 0.245 265)` (with hover/active/soft/strong variants)
- Success → forest green (less olive than before)
- Danger → signal red (cooler / sharper)
- Info → teal (differentiated from brand)
- Status `viewed` → lavender (so it stays distinct from the new blue brand)
- Shadows → cool neutral ink (was warm)
- **Added dark theme** under `[data-theme="dark"]` + `prefers-color-scheme: dark` — flip `<html data-theme="dark">` on any page to test it. Brand brightens, surfaces invert, semantic soft tints invert.

**Page hosts** (all 8) — `#f0eee9` body background swapped to `var(--paper)`.

**Hardcoded warm leftovers cleaned up**
- Default Avatar color → brand blue
- BrandPanel gradient (auth split) → cool teal/blue radial glow
- Tab/sidebar/radio active-borders → cool blue
- Draft / Cancelled status chips → neutral cool gray
- Skeleton shimmer hue → cool
- Undo-toast color → cool blue
- Branding preview's hardcoded `#D97757` → `#1A4CFF` (with `#00B5C7` accent)

**Intentionally untouched** — the `SIGNER_COLORS` rainbow palette stays the same; those identify distinct people in tables/avatars and should stay multi-hue.

ESign File.html is open so you can scan it; verifier is sweeping the page bundle in the background.

## User

anyother theme we can try ?

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- palette: 3
- keep_or_replace: Decide for me

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: run_script]_

Switching to Midnight (violet + deep ink). I'll keep both — light = Trust, dark = Midnight — and drop a small theme toggle into every page so you can flip between them. Decision persists per browser.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Done — both themes are wired up now:

**Bottom-right floating pill** on every page → flip between **Trust** (cool blue light) and **Midnight** (violet dark). Selection persists per-browser via localStorage; if you've never picked, it follows your OS preference.

**Midnight palette** (when toggled to dark):
- Paper: deep ink with a violet cast
- Brand: vivid violet `oklch(0.625 0.245 295)`
- Success: mint
- Warning: bright amber
- Danger: coral
- Info: bright teal
- Status "viewed" stays distinct (brighter lavender)
- Shadows go heavy pure-black for true depth

**Trust palette** (light, unchanged from earlier): electric blue brand, cool near-white paper.

Both themes share the same token names — every component, table, dialog, badge, and illustration retones automatically. The design-canvas chrome (grid bg, labels, post-its) also adapts; post-its tinted with OKLCH so they read fine on either background.

Verifier is sweeping both states in the background. Try clicking the pill on any page to see the swap.Acknowledged — the verifier ended without a verdict, which means no errors were surfaced. Toggle should be working on every page; let me know if you'd like to refine either palette, add a third, or carry the theme through to anything specific (e.g. dialog overlays, signer field tints, etc.).

## User

i think orignal one was more better revert to thoes changes

## User

<pasted_text name="Pasted text (74 lines)">
You're designing a logo for an e-signature SaaS product called ESign. It's a DocuSign / Odoo Sign alternative — confident, modern, and slightly more playful than the typical enterprise legal-tech brand. Targets sender/admin (desktop B2B users) and signers (anyone with an email link, often on mobile).

Brand attributes — the logo should feel:
- Confident and direct (not timid, not corporate-cold)
- Modern (geometric, refined, no skeuomorphism)
- Slightly warm — approachable, not stiff (slight personality, but still trustworthy enough for legal docs)
- Memorable at small sizes — must work as a 16×16 favicon and 24×24 top-nav mark

Voice anchor: "Send. Sign. Done. — in minutes."

Existing brand context (don't redesign these — work within them):
- Primary color is a confident blue (the project already uses a primary blue token). Logo concepts can be monochrome (single primary blue) or 2-color (primary blue + a single accent — green for "complete" works well with the existing signer-1 green).
- The wordmark text is "ESign" (one word, no space, capital E + lowercase "sign" — but you can propose alternate casings: "esign", "ESign", "eSign").

Hard constraints — every concept MUST satisfy these:
- Vector-only (SVG), no raster, no photographic effects
- Works in monochrome (must have a single-color version)
- Readable at 16×16 (favicon size) — strokes ≥ 2px at that scale
- Transparent background
- No literal clichés to avoid:
  - No feather quill pen (overused)
  - No handwritten signature scribble as the mark (Adobe Sign already owns that)
  - No generic blue-gradient ribbon swoosh
  - No paper sheet with a dog-ear corner
  - No cursive script for the wordmark — keep the wordmark geometric/sans

Deliverable: produce 4–5 distinct concept directions, each one a genuinely different idea (not 4 variations of the same idea). For each concept, give me:

  1. A name (1–2 words)
  2. A 2-sentence rationale — what idea it expresses and why it fits ESign
  3. The logomark as inline SVG code (viewBox 0 0 64 64, primary blue fill or stroke as the only color)
  4. A description of how the wordmark would pair with the mark (logomark left + "ESign" right, or stacked, or wordmark-only)
  5. A mini-description of where this concept would feel best (favicon, top-nav, email header, social avatar) and any size/contrast caveats

Explore distinct metaphor families across the 4–5 concepts — at least one each from these directions, no duplicates within a family:

  A. Letterform-based — abstract play on the E or the E+S combination (negative space, ligature, monogram). Should feel like a unique mark, not just "E in a circle".
  B. Action-based — a geometric expression of "checking off / completing / approving" (a checkmark integrated with another element, or motion lines, or a stamp impression). Should not literally be a check inside a circle — push further.
  C. Document/seal-based — but reinterpreted abstractly. A geometric seal, a folded corner becoming an arrow, a stamped circle with a notch — anything that abstracts the idea of "official document" without being a literal document.
  D. Speed/instant-based — expressing the "in minutes" speed promise. A mark that suggests motion, send/dispatch, or instant completion. Could be paper-plane-adjacent but more abstract.
  E. (Optional 5th) Your wildest original idea that doesn't fit the above buckets but feels right for ESign.

For each SVG, keep the path data clean and minimal — no excess decoration, no extra anchor points. The mark should read clearly at the smallest size.

End with one paragraph noting which concept you think is strongest for ESign and why.
```

---

## Prompt B — Refine (paste after picking a concept)

```text
We're going with the "[CONCEPT NAME]" direction from the previous round. Now refine it into 6 variations so we can pick the final logo system.

For all 6 variations, keep the core idea intact — only proportions, weight, casing, and color treatment change.

Variation set:

  1. Logomark only — final refined version (viewBox 0 0 64 64, primary blue fill/stroke)
  2. Logomark only — monochrome black version (for dark-on-light contexts)
  3. Logomark only — monochrome white version (for light-on-dark, e.g., footers, email dark mode)
  4. Horizontal lockup — logomark + "ESign" wordmark to the right, aligned. Provide as one combined SVG (viewBox sized to fit). Wordmark in a geometric sans (Inter weight 600 is fine), tracking -0.02em, optical size matched to the mark.
  5. Stacked lockup — logomark above, "ESign" wordmark below, center-aligned. One combined SVG.
  6. Favicon-optimized — a simplified version of the mark redrawn specifically to read at 16×16. Strokes thickened if needed; tiny details removed. Provide at viewBox 0 0 16 16.

Additionally, suggest:

  - The exact wordmark spec (font family, weight, letter-spacing, case) so it can be set up as a text style in Figma.
  - Two clear-space rules: minimum padding around the mark, and minimum size at which the lockup should never be used below.
  - One use-case mini-table: "use mark-only when …", "use horizontal lockup when …", "use stacked lockup when …", "use favicon version when …".

Keep all SVG path data minimal and tidy — single path or as few paths as possible per mark, no embedded raster, no filters, no gradients (unless the concept inherently requires a 2-color treatment, in which case use exactly 2 flat colors).

End with a one-screen "logo system overview" — a brief written summary I can paste into the project's brand guidelines.
</pasted_text>

## User



## Assistant

_[tool: write_file]_

_[tool: done]_

I'll produce these as artboards in a design canvas so you can see the marks at real sizes side-by-side and we can iterate.

One thing to flag: the brief says "primary blue" but the actual project palette is terracotta. I'm going to render each concept in the project's real brand color so they sit consistently in the file — if you want the blue version, say the word and I'll re-tint them. The shapes themselves are color-agnostic.Five concepts laid out as artboards on the canvas, plus three "in-context" rows showing each mark at the sizes it'll really be used.

**The five directions:**

1. **A · Letterform — "Tri-arm"** — A geometric capital E where the middle arm shortens and rises 4°, the same gesture a hand makes when signing off. Geometric and personable. Best as a mark-only (top-nav, avatar).

2. **B · Action — "Confirm"** — A solid filled checkmark drawn as one closed shape — no strokes, no circle backdrop. Reads as a deliberate stamp impression rather than a pen tick. Best paired with the wordmark.

3. **C · Document/Seal — "Minute"** — A seal-disk whose single radial line points to the **1 o'clock position** — direct reference to the brand promise *"in minutes."* Reads as clock + seal + signature flourish at once. Strong for legal/audit contexts.

4. **D · Speed — "Beam"** — A solid right-pointing arrowhead with a trailing dot 14 grid-units behind. The dot reads as both a cursor and a packet in transit. Geometric, no envelope iconography. Built for send buttons and transactional surfaces.

5. **E · Wildcard — "Pact"** — Two mirrored arrowheads pointing at each other, meeting at a central dot. Sender and signer converging; the dot at the seam is the moment the document becomes binding. Carries the most narrative weight.

Each artboard shows the mark at 120px, the rationale, the horizontal lockup with "ESign" (Geist 700, −0.025em), and a strip with sizes 32 / 24 / 16 + a black monochrome version + a reversed white-on-dark version. Below the concept row are three "in-context" artboards: 16px favicon tabs, 24px top-nav rows, and reversed marks on a dark email header — so you can compare survival at the sizes that actually matter.

**My pick: "Minute."** It does the most work per pixel — it's a seal (trust), a clock (the brand promise), and a signature flourish in a single geometric form, and it doesn't lean on letterforms or symbols that other e-sign products already use. Tri-arm is the cleanest pure-design choice, but Minute carries a story that you can put in a brand line.

When you pick a direction, I'll refine it into the full 6-variation system (mono, white, horizontal, stacked, favicon-optimized 16×16, plus spec sheet).

## User

Tri arm

