// =============================================================
// 10 — System States: bespoke illustrations + helpers.
// Reuses EmptyState, Skeleton, Toast, Input, Button, AppShell.
// =============================================================

// ============ 404 illustration: "lost" paper trailing dotted path ============
function Illust404() {
  return (
    <div style={{
      position: "relative",
      width: 320, height: 200,
      display: "grid",
      placeItems: "center",
    }}>
      {/* Huge 404 backdrop */}
      <div style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-display)",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: 200,
        color: "var(--color-surface-sunken)",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        userSelect: "none",
        zIndex: 0,
      }}>404</div>

      {/* The "lost" paper, slightly off-center, with a dotted trail */}
      <svg width="320" height="200" viewBox="0 0 320 200" style={{ position: "relative", zIndex: 1 }}>
        {/* dotted trail of breadcrumb dots — the document came from somewhere and got lost */}
        <path d="M 28 168 Q 80 140, 130 152 T 232 110"
              stroke="var(--color-border-strong)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2 6"
              strokeLinecap="round" />
        {/* tiny X markers along the trail */}
        <g stroke="var(--color-ink-faint)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="24" y1="164" x2="32" y2="172"/><line x1="32" y1="164" x2="24" y2="172"/>
        </g>

        {/* paper drifting off, tilted */}
        <g transform="translate(180,46) rotate(14)">
          <rect x="0" y="0" width="84" height="104" rx="2"
                fill="var(--color-surface)"
                stroke="var(--color-border-strong)" strokeWidth="1.5"
                filter="drop-shadow(0 4px 10px oklch(0.21 0.018 60 / 0.10))" />
          {/* page lines */}
          <line x1="10" y1="22" x2="74" y2="22" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="10" y1="32" x2="64" y2="32" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="10" y1="42" x2="70" y2="42" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="10" y1="52" x2="50" y2="52" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          {/* missing signature line */}
          <line x1="10" y1="86" x2="50" y2="86" stroke="var(--color-ink)" strokeWidth="1.5"/>
          {/* question mark over the signature line */}
          <text x="60" y="82" fontFamily="var(--font-display)" fontStyle="italic" fontSize="22" fill="var(--color-brand)">?</text>
        </g>
      </svg>
    </div>
  );
}

// ============ 500 illustration: torn / broken paper ============
function Illust500() {
  return (
    <div style={{
      position: "relative",
      width: 220, height: 180,
      display: "grid",
      placeItems: "center",
    }}>
      <svg width="220" height="180" viewBox="0 0 220 180">
        {/* dotted backdrop ring */}
        <circle cx="110" cy="90" r="68" fill="none" stroke="var(--color-border)" strokeWidth="1.4" strokeDasharray="2 6"/>

        {/* left half of paper, tilted left */}
        <g transform="translate(48,26) rotate(-8)">
          <path d="M 0 0 L 56 0 L 50 18 L 58 36 L 48 54 L 56 72 L 46 90 L 54 108 L 0 108 Z"
                fill="var(--color-surface)"
                stroke="var(--color-border-strong)" strokeWidth="1.5"
                filter="drop-shadow(0 4px 8px oklch(0.21 0.018 60 / 0.10))" />
          <line x1="10" y1="22" x2="42" y2="22" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="10" y1="34" x2="36" y2="34" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="10" y1="58" x2="40" y2="58" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="10" y1="70" x2="32" y2="70" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
        </g>

        {/* right half, tilted right, slightly offset down */}
        <g transform="translate(118,38) rotate(10)">
          <path d="M 6 0 L 60 0 L 60 108 L 16 108 L 24 90 L 14 72 L 22 54 L 12 36 L 20 18 Z"
                fill="var(--color-surface-raised)"
                stroke="var(--color-border-strong)" strokeWidth="1.5"
                filter="drop-shadow(0 4px 8px oklch(0.21 0.018 60 / 0.10))" />
          <line x1="28" y1="22" x2="54" y2="22" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="22" y1="34" x2="50" y2="34" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="26" y1="58" x2="54" y2="58" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
          <line x1="22" y1="70" x2="48" y2="70" stroke="var(--color-border-strong)" strokeWidth="1.4" opacity="0.6"/>
        </g>

        {/* small fragments / dust around the break */}
        <g fill="var(--color-border-strong)">
          <rect x="106" y="60" width="3" height="3" rx="0.5" transform="rotate(20 107 61)"/>
          <rect x="100" y="84" width="2" height="4" rx="0.5" transform="rotate(-12 101 86)"/>
          <rect x="116" y="112" width="3" height="2" rx="0.5"/>
          <rect x="98" y="124" width="2" height="2" rx="0.5"/>
        </g>

        {/* small spark — accent that something snapped */}
        <g stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="108" y1="50" x2="108" y2="40"/>
          <line x1="102" y1="56" x2="94" y2="50"/>
          <line x1="116" y1="56" x2="124" y2="50"/>
        </g>
      </svg>
    </div>
  );
}

// ============ Expired clock illustration (destructive ring + clock) ============
function IllustExpired() {
  return (
    <div style={{
      width: 84, height: 84,
      borderRadius: 999,
      background: "var(--color-danger-soft)",
      border: "1px solid oklch(0.86 0.10 28)",
      display: "grid",
      placeItems: "center",
      color: "var(--color-danger-strong)",
    }}>
      {I("clock-alert", 36, "currentColor")}
    </div>
  );
}

// ============ Offline banner (sticky destructive @ 12% bg) ============
function OfflineBanner() {
  return (
    <div style={{
      padding: "10px 24px",
      background: "color-mix(in srgb, var(--color-danger) 12%, var(--color-paper))",
      borderBottom: "1px solid color-mix(in srgb, var(--color-danger) 28%, var(--color-border))",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0,
      position: "relative",
      zIndex: 5,
    }}>
      <span style={{
        width: 24, height: 24,
        borderRadius: 999,
        background: "var(--color-danger)",
        color: "var(--color-ink-inverse)",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}>{I("wifi-off", 13, "currentColor")}</span>
      <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13.5,
          fontWeight: 600,
          color: "var(--color-danger-strong)",
        }}>You're offline.</span>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
        }}>Some features may be unavailable. Changes will sync when you reconnect.</span>
      </div>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        color: "var(--color-ink-subtle)",
      }}>last sync 2m ago</span>
      <button style={{
        width: 30, height: 30,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        color: "var(--color-ink-muted)",
      }} title="Retry connection">
        {I("rotate-cw", 14, "currentColor")}
      </button>
    </div>
  );
}

// ============ Frame label (above each artboard's interior chrome on the grid) ============
function FrameLabel({ num, title, viewport }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 12,
      padding: "0 4px 10px",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--color-ink-faint)",
          letterSpacing: "0.04em",
        }}>{num}</span>
        <span style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: "var(--color-ink)",
        }}>{title}</span>
      </div>
      <span style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        color: "var(--color-ink-faint)",
      }}>{viewport}</span>
    </div>
  );
}

Object.assign(window, {
  Illust404, Illust500, IllustExpired, OfflineBanner, FrameLabel,
});
