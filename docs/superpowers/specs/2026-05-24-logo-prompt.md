# ESign Logo Prompt

**Date:** 2026-05-24
**Purpose:** Prompt for designing a unique modern logo for the ESign product. Two-pass workflow: concept exploration, then refinement of the chosen direction. Deliverables come back as SVG you paste straight into Figma.

## How to use

1. Paste **Prompt A — Concepts** first. You'll get 4–5 distinct directions as SVG snippets + descriptions.
2. Pick the one you like. Paste **Prompt B — Refine** (fill in the bracketed slot with the chosen concept's name/description).
3. You'll get 6 refined variations of that one direction — different proportions, weights, with/without wordmark, monochrome — final SVGs ready for Figma.

---

## Prompt A — Concepts (paste first)

```text
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
```

---

## Notes for the project

- Save the final SVGs into `apps/web/public/brand/` once chosen (`logo.svg`, `logo-mark.svg`, `logo-mono.svg`, `favicon.svg`, etc.).
- Update `apps/web/app/layout.tsx` `metadata.icons` to point at the favicon SVG.
- The auth split-screen brand panel (left side of Login/Signup) should use the stacked lockup, the top nav should use the horizontal lockup, and the favicon SVG handles browser tabs.
- The signer mobile experience uses the logomark only (16–24px) in the sticky top header — make sure the favicon-optimized variant from Prompt B-6 holds up there.
