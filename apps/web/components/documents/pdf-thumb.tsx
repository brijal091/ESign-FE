import { cn } from '@esign/ui'

/**
 * Tiny paper-styled PDF thumbnail with a corner fold + faux text lines
 * and a "PDF" tag — mirrors the Paraph design's row affordance.
 */
export function PdfThumb({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative inline-block h-[38px] w-8 shrink-0 overflow-hidden rounded-[3px] border border-border bg-paper',
        className,
      )}
    >
      {/* corner fold */}
      <span className="absolute right-0 top-0 size-2 border-b border-l border-border bg-surface-sunken" />
      {/* faux lines */}
      <span className="absolute left-1 right-[11px] top-2 h-[1.5px] bg-border" />
      <span className="absolute left-1 right-[6px] top-3 h-[1.5px] bg-border" />
      <span className="absolute left-1 right-[13px] top-4 h-[1.5px] bg-border" />
      <span className="absolute left-1 right-1 top-5 h-[1.5px] bg-border" />
      {/* PDF tag */}
      <span className="absolute bottom-[3px] left-[3px] font-mono text-[7px] font-semibold tracking-wider text-brand-strong">
        PDF
      </span>
    </span>
  )
}
