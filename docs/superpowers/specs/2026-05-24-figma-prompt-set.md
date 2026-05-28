# ESign Figma Prompt Set

**Date:** 2026-05-24
**Purpose:** Ready-to-paste prompts for generating ~35 Figma screens of the ESign product. References the existing design system (tokens + components) — does not redefine them.

## How to use

1. Open your ESign Figma project (the one with the existing design system).
2. Paste **Prompt 0 — Master** into the AI design tool first. It sets product context, voice, file structure, and confirms component reuse. It creates pages 03–10 as empty.
3. Paste any of **Prompts 1–8** to populate the matching page. They're independent — run them in any order, skip any, or re-run any one to regenerate its page.
4. After all flows run, do prototyping wiring by hand.

---

## Prompt 0 — MASTER (paste first)

```text
Context — you're designing an e-signature SaaS called ESign. Visual reference: Odoo Sign (pragmatic, slightly playful, color-coded badges, tag chips, dense tables). Sender/Admin screens are desktop-first 1440×900. Signer screens are mobile-first 375×812 with a desktop fallback 1440-wide centered.

A complete design system already exists in this Figma project — color styles, text styles, spacing, radii, shadows, and named components (Button, Icon Button, Input, Textarea, Label, Badge, Status Dot, Table, Card, Dialog, Dropdown Menu, Tabs, Tooltip, Toast, Top Nav, Sidebar Section, Signer Color Chip, Field-Type Chip, Tag Chip, Avatar, Progress Stepper, Empty State, Skeleton Loader, Switch, Signature Pad). USE THESE COMPONENTS. Do not redraw or redefine them. Reference them by name in every screen.

Users:
- Sender — uploads documents, places fields, requests signatures (has an account).
- Signer — reviews and signs (no account; receives a signed token via email link).
- Admin — manages users, audit log, branding.
- Viewer — read-only.

Terminology (use exactly): Document, Sender, Signer, Recipient, Template, Contact, Field, Sign Now, Send for Signature.

Voice: sentence case for labels and helper text; Title Case for primary button labels. Direct microcopy ("Upload a PDF", not "Please upload a PDF document"). No legalese in UI copy unless explicitly required (intent-to-sign disclosure).

Status badge mapping (schema → UI label → badge variant):
  draft     → "Draft"            muted
  sent      → "To Sign"          info
  viewed    → "Viewed"           info-light
  signed    → "Partially Signed" warning
  completed → "Fully Signed"     success
  declined  → "Cancelled"        muted (strikethrough text)
  expired   → "Expired"          destructive

Field types (13) — used in the editor and signer experience:
signature, initials, name, email, phone, company, text, multiline_text, checkbox, radio, selection, date, strikethrough.

Layout primitives (already in DS):
- App Shell — Top Nav (64h) + content area.
- Auth Split — 50/50, brand panel left, form right (400w form, vertically centered).
- Editor Layout — top action bar 56h + left sidebar 320w + center PDF canvas.
- Mobile Signer — 56h sticky top + scroll content + 64h sticky bottom action bar.

Figma file structure — create these 11 pages exactly in this order:
00 — Cover
01 — Foundations          (already populated from the DS; leave as-is)
02 — Components           (already populated from the DS; leave as-is)
03 — Auth
04 — Documents
05 — Editor
06 — Signer
07 — Dashboard
08 — Templates & Contacts
09 — Admin
10 — System States

Deliverable for this prompt: create pages 03–10 as empty pages, ready to be populated by the follow-up flow prompts. Do not generate screens yet. Confirm component reuse and file structure are set up.
```

---

## Prompt 1 — AUTH (page 03 — Auth, 1440×900)

```text
On the page "03 — Auth", create the following frames using the Auth Split layout. Reuse Button, Input, Label, Tag Chip, Avatar, Progress Stepper, Checkbox, Toast.

1. Login
   - h2 "Welcome back", body-lg muted "Sign in to continue to ESign."
   - Email Input, Password Input (trailing eye toggle)
   - Right-aligned link "Forgot password?" under password
   - Primary "Sign In" full-width
   - Separator with caption "or"
   - Secondary full-width: "Continue with Google" (Google G icon), "Continue with Microsoft"
   - Footer: "Don't have an account? Sign up" (last 2 words linked)
   - Include a sibling variant with inline email-error "Enter a valid email address."

2. Signup — Step 1 (Email)
   - Progress Stepper at top: Email · Verify · Organization
   - h2 "Create your ESign account", body muted "We'll send a 6-digit code to verify your email."
   - Email Input
   - Primary "Send Code"
   - Footer link "Already have an account? Sign in"

3. Signup — Step 2 (OTP)
   - Stepper on step 2
   - h2 "Verify your email", body muted "We sent a code to brijal@example.com. Enter it below."
   - 6 separate single-digit Inputs (48×56, 8px gap, body-lg center)
   - Caption "Didn't get it? Resend in 0:42" ("Resend" disabled)
   - Primary "Verify" full-width (disabled until 6 digits entered)
   - Ghost "Change email" below

4. Signup — Step 3 (Organization)
   - Stepper on step 3
   - h2 "Tell us about you"
   - Inputs (stacked): Organization name, Your full name, Password, Confirm password
   - Password helper "At least 8 characters with a number and symbol"
   - Checkbox "I agree to the Terms and Privacy Policy" (linked)
   - Primary "Create Account" full-width
   - Ghost "Back"

5. Forgot Password — Step 1 (Email)
   - h2 "Reset your password", body muted "Enter your email and we'll send a reset code."
   - Email Input, Primary "Send Reset Code"
   - Footer link "Back to sign in"

6. Forgot Password — Step 2 (OTP) — reuse Step 2 OTP style with title "Confirm your identity".

7. Forgot Password — Step 3 (New password)
   - h2 "Set a new password"
   - Inputs: New password, Confirm new password
   - Live rules checklist (caption with check icons turning success as they pass): "At least 8 characters", "Contains a number", "Contains a symbol"
   - Primary "Reset Password"

8. Set Password (invite acceptance)
   - h2 "Welcome to ESign", body muted "You've been invited by Acme Corp. Set a password to get started."
   - Inputs + checklist (same as #7)
   - Primary "Activate Account"

9. Email-sent confirmation
   - Empty State: paper-plane illustration, h3 "Check your inbox", body "We sent a link to brijal@example.com. It expires in 24 hours.", Ghost "Back to sign in"

Annotation frames (small, beside the relevant screens):
- Login error Toast: "Invalid email or password."
- OTP wrong code: "That code didn't match. Try again."
- OTP expired: "Code expired. Tap 'Resend' to get a new one."
- Confirm-password mismatch inline: "Passwords don't match."

Brand panel content (vary slightly across screens):
- ESign wordmark + logomark
- 4-line value prop: "Send. Sign. Done. — in minutes."
- Small testimonial card (avatar + 2-line quote + name/company)
```

---

## Prompt 2 — DOCUMENTS (page 04, 1440×900)

```text
On the page "04 — Documents", create the following frames using App Shell with "Documents" tab active. Reuse Table, Badge, Button, Input, Dialog, Dropdown Menu, Tag Chip, Avatar, Empty State, Toast, Skeleton.

1. Documents — Populated list (hero)
   - Page header: h2 "Documents" left, Primary "Upload a PDF & Sign" right (Upload icon)
   - Toolbar: search Input (320w, leading magnifier, placeholder "Search documents…"); filter dropdowns "All Status", "All Senders", "Date range"; right: view toggle (grid/list icon buttons)
   - Table columns: Checkbox (40), Creation Date (120), Document Name (flex, PDF icon + filename), Signers (max 280, stacked Avatars max 3 + "+N", each with signer-color ring), Status (140, Badge + Status Dot), Last Activity (140, caption muted "Viewed 2h ago"), Tags (180, Tag Chips wrapped), Action (48, three-dot Icon Button)
   - 12 rows spanning all 7 statuses (at least one of each)
   - Pagination footer: "Showing 1–12 of 47", page buttons, prev/next

2. Documents — Empty
   - Same shell + header
   - No toolbar
   - Empty State: paper-stack illustration, h3 "No documents yet", body "Upload a PDF to start collecting signatures.", Primary "Upload a PDF & Sign"

3. Upload Dialog (Modal md)
   - Title "Upload a PDF & Sign", description "Drag and drop a file here, or click to browse."
   - Drop zone 200h, dashed input border, centered Upload icon + body "Drag and drop your PDF here" + caption "or click to browse files". Hover state: primary border + primary @ 4% bg.
   - Caption under drop zone: "Maximum file size 25MB. Only PDF files are supported."
   - Footer: Ghost "Cancel" + Primary "Upload" (disabled until file selected)
   - Sibling variant: file-selected state with filename + size + remove X.

4. Document detail / audit drawer (480w right drawer over list)
   - Top: close X, title (h3, inline-editable look), Status Badge, Tag Chips
   - Tabs: "Overview" / "Activity" / "Signers" — Overview active
   - Overview content: filename, file size, page count, created date, expires date, sender row (Avatar + name)
   - Quick actions row: Secondary "Resend", "Download", "Duplicate"; destructive Ghost "Void"

5. Bulk delete confirm (Modal sm)
   - Title "Delete 3 documents?", description "This will permanently delete the selected documents. This action cannot be undone."
   - Footer: Ghost "Cancel" + Destructive "Delete 3"

Annotation micro-frames:
- Success Toast: "Document sent to 2 signers."
- Success Toast: "Documents deleted."
- Skeleton state (5 ghost Table rows)
```

---

## Prompt 3 — EDITOR (page 05, 1440×900)

```text
On the page "05 — Editor", create the following frames using the Editor Layout (56h top action bar, 320w left sidebar, center PDF canvas on muted bg). Reuse Button, Icon Button, Input, Tag Chip, Sidebar Section, Signer Color Chip, Field-Type Chip, Dialog, Tabs, Switch, Toast.

1. Editor — Empty (no signers' fields placed)
   Top action bar:
     - Left: Ghost "← Documents", separator, inline-editable title "Untitled Document" (body-lg medium, hover pencil)
     - Right: compact Tag input 200w "Add tags…", separator, Secondary "Sign Now", Primary "Send"
   Left sidebar:
     - Sidebar Section "Documents" (expanded): row with PDF icon + "Sample Agreement.pdf" + caption "12 pages"
     - Sidebar Section "Recipients" (expanded):
       · One Signer block: header bar with signer-1 Color Chip + "Signer 1" (inline editable) + small × delete
       · Body empty with caption "Drag a field type onto the PDF to assign it to this signer."
       · Inline hint banner (muted-foreground @ 8% bg, caption): "Add a field type to get started ↓"
       · 13 Field-Type Chips in 2-column grid (Signature, Initials, Name, Email, Phone, Company, Text, Multiline, Checkbox, Radio, Selection, Date, Strikethrough)
     - Ghost "+ Add signer" full-width at bottom
   Center canvas:
     - Rendered PDF page (placeholder legal-document content)
     - Floating page indicator top-right "Page 1 of 12"
     - Floating zoom control bottom-right (− / 100% / +)

2. Editor — With 2 signers and 5 placed fields
   - Top bar title "Service Agreement.pdf", 2 Tag Chips "legal", "Q2"
   - Sidebar Recipients section:
     · Signer 1 block (signer-1 green) — selected (2px primary left border): "Brijal K." + caption email row "brijal@example.com"
     · Signer 2 block (signer-2 blue, collapsed): "Acme Counsel"
     · 13 Field-Type Chips below (always available; drag assigns to selected signer)
   - Center canvas:
     · Page 1: 3 placed fields in signer-1 green tint (signature bottom-left, date next to it, initials top-right)
     · Page 2 visible below (scrolls): 2 placed fields in signer-2 blue
     · One selected field with primary focus ring and floating toolbar above it: "Required" Switch, Duplicate Icon Button, Delete Icon Button (destructive)

3. Editor — Send dialog (Modal md)
   - Title "Send for Signature", description "Review recipient order and add a message."
   - Recipient order: numbered drag-handle rows (Color Chip + name + email + "Edit" link)
   - Sequential / Parallel Tabs: "Sign in order" / "Anyone first"
   - Textarea md "Add a personal message for all recipients…"
   - Expiry inline: "Expires in [30] days" small numeric dropdown
   - Reminder row: Switch + "Send reminder after 3 days if not signed"
   - Footer: Ghost "Cancel" + Primary "Send" (paper-plane icon)

4. Editor — Field properties popover (small)
   - Floating Card 280w, shadow-lg, anchored to a selected Text field
   - Title (body-medium) "Text Field"
   - Inputs sm stacked: Label, Placeholder, Default value
   - Required Switch row
   - Assigned signer Dropdown showing current signer + Color Chip
   - Footer: Ghost destructive "Delete" + Primary "Done"

5. Editor — Save status states
   - Variant a: same as frame 2 with top-bar indicator left of buttons: spinner + caption "Saving…"
   - Variant b: check icon + caption "Saved" (muted-foreground)
   - Variant c: destructive icon + "Couldn't save. Retry" link

Annotation frames:
- Error Toast: "Couldn't load PDF. Try again."
- Pre-send warning banner above Send button (warning tint): "Signer 2 has no fields assigned." + "Review" link
```

---

## Prompt 4 — SIGNER (page 06, mobile 375×812 + desktop 1440 fallback per frame)

```text
On the page "06 — Signer", create the following frames at 375×812 (mobile-first). Place a desktop variant of each in a second column to the right (1440-wide, content centered max-width 720). Reuse Button, Input, Badge, Progress Stepper, Dialog, Avatar, Tag Chip, Checkbox, Switch, Signature Pad, Empty State, Toast.

1. Signer Welcome (intent-to-sign)
   - Sticky top: ESign brand mark center, close X right
   - Hero Card (24px padding):
     · h3 "You've been invited to sign"
     · body "Brijal K. from Acme Corp has sent you a document to sign."
     · Document filename row with PDF icon
     · Page count + estimated time row: "12 pages · ~3 minutes"
   - Consent block:
     · body-medium "Consent to electronic signature"
     · body small muted: "By clicking Continue, you agree that your electronic signature has the same legal effect as a handwritten signature, in accordance with the ESIGN Act and eIDAS."
     · Checkbox "I agree to use electronic signatures."
   - Sticky bottom: Primary "Continue" full-width (disabled until checkbox checked), Ghost "Decline" below

2. Signer Document Review
   - Sticky top header: Progress Stepper (Review · Sign · Done), close X
   - Below: progress bar "2 of 5 fields completed" with primary fill
   - Scrollable PDF view with colored field overlays — required-but-empty fields have a primary glow ring; filled fields show the value
   - Sticky bottom action bar:
     · Left: chevron-left Icon Button "Previous field"
     · Center: caption "2 / 5 fields"
     · Right: Primary "Next" with chevron-right

3. Signer — Signature Pad open (Dialog sm overlaying Review)
   - Signature Pad component with Draw tab active by default and a sample stroke present
   - Apply button enabled

4. Signer — Field interactions cluster (4 mini-frames composed in one larger frame, or side by side)
   a. Text field — focused Input with label "Full name", helper "Required"
   b. Checkbox field — two stacked: "I have read the terms" (checked), "I agree to the conditions" (unchecked)
   c. Date field — Input with calendar trigger + popover calendar open
   d. Selection — opened Dropdown with 3 options

5. Signer — Decline reason (Dialog sm)
   - Title "Decline this document?", description "Tell the sender why. They'll be notified."
   - Textarea md "Add a reason (optional)…"
   - Footer: Ghost "Cancel" + Destructive "Decline"

6. Signer — Success
   - Empty State: large success check icon, h2 "All signed!", body "Your signed document has been sent to Brijal K. You'll receive a copy by email shortly."
   - Secondary "Download a copy" + Ghost "Done"
   - Footer caption "Signed via ESign · Audit trail attached"

Annotation frames:
- Expired link state (mobile): Empty State, destructive clock icon, h3 "This signing link has expired", body "Ask the sender to send a new invitation.", Secondary "Contact the sender"
- Offline banner: sticky top destructive @ 12% bg, body "You're offline. Your progress is saved." + retry Icon Button
```

---
## Prompt 5 — DASHBOARD (page 07, 1440×900)

```text
On the page "07 — Dashboard", create the following frames using App Shell. Reuse Card, Badge, Avatar, Table (compact), Button, Tabs, Empty State, Status Dot.

1. Dashboard — Main
   - Page header: h2 "Dashboard" + date range Tabs (Today · 7 days · 30 days · 90 days · Custom)
   - 4 KPI Cards in a 4-column grid:
     · "Total Sent" — h2 "1,284", caption "+12% vs last period" (success)
     · "Completed" — h2 "892", caption "+8%"
     · "Pending" — h2 "267", caption "−3%" (warning)
     · "Avg. Time to Sign" — h2 "1.4 days", caption "−0.2 days"
   - Second row:
     · Left 8/12: Card "Sending Volume" — line chart over 30 days, primary stroke + soft area fill, gridlines, x-axis day labels
     · Right 4/12: Card "Status Breakdown" — donut chart, 5 slices using status colors; legend list with count per status
   - Full-width Card "Recent Activity" — compact Table (no header) with 8 rows; each row: Status Dot + body actor name + caption action ("signed", "viewed", "sent") + caption truncated document name + caption time ("2m ago")
   - "View all activity →" link footer

2. Dashboard — Empty / first-time
   - Same shell + header
   - Empty State: bar-chart illustration, h3 "No data to show yet", body "Send your first document to see analytics here.", Primary "Upload a PDF & Sign"

3. Dashboard — Status drill-down
   - Same as frame 1, but the donut has "Pending" slice highlighted (others dimmed)
   - Below: populated Table filtered to pending only, titled "267 Pending Documents"
```

--
## Prompt 6 — TEMPLATES & CONTACTS (page 08, 1440×900)

```text
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
```

---

## Prompt 7 — ADMIN (page 09, 1440×900)
TODO
```text
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
```

---

## Prompt 8 — SYSTEM STATES (page 10, mixed widths in a 3-column grid)

```text
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
```

---

## Coverage summary

| Page | Screens (incl. annotations) |
| --- | --- |
| 03 Auth | 9 |
| 04 Documents | 5 |
| 05 Editor | 5 |
| 06 Signer | 6 (mobile + 6 desktop variants) |
| 07 Dashboard | 3 |
| 08 Templates & Contacts | 4 |
| 09 Admin | 4 |
| 10 System States | 8 |
| **Total** | **~44 frames** |
