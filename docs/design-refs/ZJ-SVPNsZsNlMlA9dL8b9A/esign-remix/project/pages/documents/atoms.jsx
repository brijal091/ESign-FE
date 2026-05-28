// =============================================================
// 04 — Documents: shell + table + dialog atoms.
// Reuses Button / Input / Avatar / Toast / TagChip / Wordmark
// from ../auth/atoms.jsx (loaded first by the host page).
// =============================================================

// ============ Signer color palette (per-recipient color ring) ============
const SIGNER_COLORS = [
  "oklch(0.665 0.155 38)",   // brand terracotta
  "oklch(0.605 0.090 245)",  // info blue
  "oklch(0.575 0.110 145)",  // success sage
  "oklch(0.640 0.130 280)",  // viewed purple
  "oklch(0.760 0.140 75)",   // warning amber
  "oklch(0.605 0.180 22)",   // danger clay
  "oklch(0.55 0.10 200)",    // teal
  "oklch(0.55 0.10 320)",    // magenta
];

// ============ Top Nav (App Shell) ============
function TopNav({ active = "Documents", search = "" }) {
  const tabs = ["Documents", "Templates", "Contacts", "Dashboard", "Configuration"];
  return (
    <header style={{
      height: 64,
      background: "var(--color-paper)",
      borderBottom: "1px solid var(--color-border)",
      display: "flex",
      alignItems: "center",
      padding: "0 28px",
      gap: 28,
      flexShrink: 0,
    }}>
      <Wordmark size={20} />

      <nav style={{ display: "flex", gap: 4, marginLeft: 12 }}>
        {tabs.map(t => {
          const isActive = t === active;
          return (
            <button key={t} style={{
              padding: "8px 14px",
              border: "none",
              background: isActive ? "var(--color-surface-raised)" : "transparent",
              color: isActive ? "var(--color-ink)" : "var(--color-ink-muted)",
              fontFamily: "var(--font-sans)",
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              boxShadow: isActive ? "var(--shadow-1)" : "none",
              border: isActive ? "1px solid var(--color-border)" : "1px solid transparent",
            }}>{t}</button>
          );
        })}
      </nav>

      <div style={{ flex: 1, maxWidth: 320, marginLeft: "auto" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 36,
          padding: "0 12px",
          background: "var(--color-surface-sunken)",
          border: "1px solid transparent",
          borderRadius: "var(--radius-sm)",
        }}>
          {I("search", 15, "var(--color-ink-subtle)")}
          <span style={{
            flex: 1,
            fontFamily: "var(--font-sans)",
            fontSize: 13.5,
            color: "var(--color-ink-faint)",
          }}>{search || "Search everything"}</span>
          <kbd style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-ink-subtle)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 3,
            padding: "1px 5px",
          }}>⌘K</kbd>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button style={{
          width: 36, height: 36,
          background: "transparent",
          border: "1px solid transparent",
          borderRadius: "var(--radius-sm)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          position: "relative",
        }}>
          {I("bell", 17, "var(--color-ink-muted)")}
          <span style={{
            position: "absolute",
            top: 6, right: 7,
            width: 7, height: 7,
            borderRadius: 999,
            background: "var(--color-brand)",
            border: "1.5px solid var(--color-paper)",
          }} />
        </button>
        <Avatar initials="BP" size={32} color="var(--color-brand)" />
      </div>
    </header>
  );
}

// ============ AppShell (TopNav + content) ============
function AppShell({ active = "Documents", search, children }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "var(--color-paper)",
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      <TopNav active={active} search={search} />
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </main>
    </div>
  );
}

// ============ Page Header ============
function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      padding: "28px 32px 20px",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 32,
    }}>
      <div>
        <h2 style={{
          fontFamily: "var(--font-sans)",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          color: "var(--color-ink)",
          margin: 0,
          lineHeight: 1.15,
        }}>{title}</h2>
        {subtitle && <div style={{
          marginTop: 6,
          fontSize: 13.5,
          color: "var(--color-ink-muted)",
        }}>{subtitle}</div>}
      </div>
      {actions}
    </div>
  );
}

// ============ Status Badge (ESign 7-status mapping) ============
// schema → label → variant
//   draft     → "Draft"             muted
//   sent      → "To Sign"           info
//   viewed    → "Viewed"            info-light (purple)
//   signed    → "Partially Signed"  warning
//   completed → "Fully Signed"      success
//   declined  → "Cancelled"         muted + strikethrough
//   expired   → "Expired"           destructive
const STATUS = {
  draft:     { label: "Draft",            bg: "oklch(0.93 0.005 60)",   fg: "oklch(0.42 0.014 60)",   dot: "oklch(0.58 0.010 60)" },
  sent:      { label: "To Sign",          bg: "var(--color-info-soft)", fg: "var(--color-info-strong)", dot: "var(--color-info)" },
  viewed:    { label: "Viewed",           bg: "oklch(0.955 0.035 280)", fg: "oklch(0.460 0.130 280)", dot: "oklch(0.640 0.130 280)" },
  signed:    { label: "Partially Signed", bg: "var(--color-warning-soft)", fg: "var(--color-warning-strong)", dot: "var(--color-warning)" },
  completed: { label: "Fully Signed",     bg: "var(--color-success-soft)", fg: "var(--color-success-strong)", dot: "var(--color-success)" },
  declined:  { label: "Cancelled",        bg: "oklch(0.93 0.005 60)",   fg: "oklch(0.55 0.010 60)",   dot: "oklch(0.65 0.010 60)", strike: true },
  expired:   { label: "Expired",          bg: "var(--color-danger-soft)", fg: "var(--color-danger-strong)", dot: "var(--color-danger)" },
};

function StatusBadge({ status }) {
  const s = STATUS[status];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "3px 9px",
      borderRadius: 999,
      background: s.bg,
      color: s.fg,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.4,
      whiteSpace: "nowrap",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 999, background: s.dot, flexShrink: 0,
      }} />
      {s.label}
    </span>
  );
}

// ============ Avatar Stack (signer color ring) ============
function AvatarStack({ signers, max = 3 }) {
  const shown = signers.slice(0, max);
  const remaining = Math.max(0, signers.length - max);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((s, i) => (
        <div key={i} style={{
          width: 28, height: 28,
          borderRadius: 999,
          background: "var(--color-surface)",
          padding: 1.5,
          border: `2px solid ${SIGNER_COLORS[s.colorIdx % SIGNER_COLORS.length]}`,
          marginLeft: i === 0 ? 0 : -8,
          boxShadow: "0 0 0 1.5px var(--color-surface)",
          zIndex: shown.length - i,
        }}>
          <div style={{
            width: "100%", height: "100%",
            borderRadius: 999,
            background: SIGNER_COLORS[s.colorIdx % SIGNER_COLORS.length],
            color: "var(--color-ink-inverse)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-sans)",
            fontSize: 10,
            fontWeight: 600,
          }}>{s.initials}</div>
        </div>
      ))}
      {remaining > 0 && (
        <div style={{
          width: 28, height: 28,
          borderRadius: 999,
          background: "var(--color-surface-sunken)",
          color: "var(--color-ink-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          display: "grid",
          placeItems: "center",
          border: "2px solid var(--color-surface)",
          marginLeft: -8,
          boxShadow: "0 0 0 1.5px var(--color-surface)",
        }}>+{remaining}</div>
      )}
    </div>
  );
}

// ============ PDF thumb ============
function PdfThumb() {
  return (
    <div style={{
      width: 32, height: 38,
      background: "var(--color-paper)",
      border: "1px solid var(--color-border)",
      borderRadius: 3,
      flexShrink: 0,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* corner fold */}
      <div style={{
        position: "absolute",
        top: 0, right: 0,
        width: 8, height: 8,
        background: "var(--color-surface-sunken)",
        borderBottom: "1px solid var(--color-border)",
        borderLeft: "1px solid var(--color-border)",
      }} />
      {/* fake lines */}
      <div style={{ position: "absolute", left: 4, right: 11, top: 8, height: 1.5, background: "var(--color-border)" }} />
      <div style={{ position: "absolute", left: 4, right: 6, top: 12, height: 1.5, background: "var(--color-border)" }} />
      <div style={{ position: "absolute", left: 4, right: 13, top: 16, height: 1.5, background: "var(--color-border)" }} />
      <div style={{ position: "absolute", left: 4, right: 4, top: 20, height: 1.5, background: "var(--color-border)" }} />
      {/* PDF label */}
      <div style={{
        position: "absolute",
        bottom: 3, left: 3,
        fontFamily: "var(--font-mono)",
        fontSize: 7,
        fontWeight: 600,
        color: "var(--color-brand-strong)",
        letterSpacing: "0.04em",
      }}>PDF</div>
    </div>
  );
}

// ============ Icon Button ============
function IconButton({ icon, size = 32, variant = "ghost", active = false, badge = null, title }) {
  const styles = {
    ghost: { background: active ? "var(--color-surface-sunken)" : "transparent", border: "1px solid transparent", color: "var(--color-ink-muted)" },
    outline: { background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-ink-muted)" },
  }[variant];
  return (
    <button title={title} style={{
      width: size, height: size,
      ...styles,
      borderRadius: "var(--radius-sm)",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
      position: "relative",
      flexShrink: 0,
    }}>
      {I(icon, size <= 28 ? 15 : 17, "currentColor")}
      {badge !== null && (
        <span style={{
          position: "absolute",
          top: -4, right: -4,
          minWidth: 16, height: 16,
          padding: "0 4px",
          background: "var(--color-brand)",
          color: "var(--color-ink-inverse)",
          borderRadius: 999,
          fontFamily: "var(--font-sans)",
          fontSize: 10,
          fontWeight: 600,
          display: "grid",
          placeItems: "center",
        }}>{badge}</span>
      )}
    </button>
  );
}

// ============ Dropdown trigger ============
function DropdownTrigger({ label, icon, active = false }) {
  return (
    <button style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      height: 36,
      padding: "0 12px",
      background: active ? "var(--color-brand-soft)" : "var(--color-surface)",
      color: active ? "var(--color-brand-strong)" : "var(--color-ink)",
      border: active ? "1px solid oklch(0.85 0.08 40)" : "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      whiteSpace: "nowrap",
    }}>
      {icon && I(icon, 14, "currentColor")}
      {label}
      {I("chevron-down", 14, "currentColor", { marginLeft: 2 })}
    </button>
  );
}

// ============ Table primitives ============
function Table({ cols, children }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      margin: "0 32px",
      boxShadow: "var(--shadow-1)",
    }}>
      <TableHead cols={cols} />
      {children}
    </div>
  );
}

function TableHead({ cols }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols.template,
      gap: 14,
      padding: "11px 18px",
      background: "var(--color-surface-sunken)",
      borderBottom: "1px solid var(--color-border)",
      alignItems: "center",
    }}>
      {cols.labels.map((label, i) => (
        <div key={i} style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-ink-subtle)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          {label && label.length > 0 && (
            <>
              {label === "_checkbox"
                ? <span style={{
                    width: 16, height: 16,
                    border: "1px solid var(--color-border-strong)",
                    borderRadius: 4,
                    background: "var(--color-surface)",
                  }} />
                : label}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function TableRow({ cols, children, hover = false, selected = false, last = false, strike = false }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: cols.template,
      gap: 14,
      padding: "12px 18px",
      alignItems: "center",
      borderBottom: last ? "none" : "1px solid var(--color-border-subtle)",
      background: selected ? "var(--color-brand-soft)" : hover ? "var(--color-surface-hover)" : "transparent",
      transition: "background var(--dur-1) var(--ease-out)",
      textDecoration: strike ? "line-through" : "none",
      textDecorationColor: strike ? "var(--color-ink-faint)" : undefined,
      color: strike ? "var(--color-ink-subtle)" : "var(--color-ink)",
    }}>
      {children}
    </div>
  );
}

// ============ Empty State ============
function EmptyState({ icon, title, body, action }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      padding: "64px 24px",
    }}>
      {icon}
      <h3 style={{
        marginTop: 24,
        marginBottom: 8,
        fontFamily: "var(--font-sans)",
        fontSize: 18,
        fontWeight: 600,
        color: "var(--color-ink)",
        letterSpacing: "-0.01em",
      }}>{title}</h3>
      <p style={{
        margin: 0,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        lineHeight: 1.5,
        color: "var(--color-ink-muted)",
        maxWidth: 380,
      }}>{body}</p>
      {action && <div style={{ marginTop: 24 }}>{action}</div>}
    </div>
  );
}

// ============ Paper-stack empty illustration ============
function PaperStack() {
  return (
    <div style={{
      position: "relative",
      width: 120, height: 120,
      display: "grid",
      placeItems: "center",
    }}>
      {/* dotted grid background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(var(--color-border) 1px, transparent 1px)",
        backgroundSize: "12px 12px",
        opacity: 0.5,
        borderRadius: 999,
      }} />
      {/* stacked papers */}
      <div style={{ position: "relative", width: 72, height: 88 }}>
        <div style={{
          position: "absolute",
          left: 12, top: 6,
          width: 60, height: 76,
          background: "var(--color-surface-raised)",
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-xs)",
          transform: "rotate(8deg)",
          boxShadow: "var(--shadow-1)",
        }} />
        <div style={{
          position: "absolute",
          left: 0, top: 2,
          width: 60, height: 76,
          background: "var(--color-surface-raised)",
          border: "1.5px solid var(--color-border)",
          borderRadius: "var(--radius-xs)",
          transform: "rotate(-4deg)",
          boxShadow: "var(--shadow-1)",
        }} />
        <div style={{
          position: "absolute",
          left: 6, top: 0,
          width: 60, height: 76,
          background: "var(--color-surface)",
          border: "1.5px solid var(--color-border-strong)",
          borderRadius: "var(--radius-xs)",
          padding: 8,
          boxShadow: "var(--shadow-2)",
        }}>
          <div style={{ height: 2, background: "var(--color-border)", marginBottom: 5 }} />
          <div style={{ height: 2, background: "var(--color-border)", marginBottom: 5, width: "85%" }} />
          <div style={{ height: 2, background: "var(--color-border)", marginBottom: 5, width: "70%" }} />
          <div style={{
            position: "absolute",
            bottom: 10, right: 10,
            width: 22, height: 14,
            border: "1.5px solid var(--color-brand)",
            borderRadius: 3,
            transform: "rotate(-8deg)",
          }} />
        </div>
      </div>
    </div>
  );
}

// ============ Dialog (Modal) ============
function Dialog({ size = "md", children }) {
  const widths = { sm: 440, md: 560, lg: 720 };
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "oklch(0.21 0.018 60 / 0.45)",
      backdropFilter: "blur(2px)",
      display: "grid",
      placeItems: "center",
      padding: 24,
    }}>
      <div style={{
        width: widths[size],
        maxWidth: "100%",
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-3)",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}>{children}</div>
    </div>
  );
}

function DialogHeader({ title, description, onClose = true }) {
  return (
    <div style={{ padding: "22px 24px 16px", borderBottom: "1px solid var(--color-border-subtle)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <h2 style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 18,
          fontWeight: 600,
          color: "var(--color-ink)",
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
        }}>{title}</h2>
        {onClose && <button style={{
          width: 28, height: 28,
          background: "transparent",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
          color: "var(--color-ink-subtle)",
          marginTop: -3,
          marginRight: -6,
        }}>{I("x", 18, "currentColor")}</button>}
      </div>
      {description && <p style={{
        margin: "6px 0 0",
        fontFamily: "var(--font-sans)",
        fontSize: 13.5,
        color: "var(--color-ink-muted)",
        lineHeight: 1.5,
      }}>{description}</p>}
    </div>
  );
}

function DialogFooter({ children }) {
  return (
    <div style={{
      padding: "16px 24px",
      borderTop: "1px solid var(--color-border-subtle)",
      background: "var(--color-surface)",
      display: "flex",
      justifyContent: "flex-end",
      gap: 10,
    }}>{children}</div>
  );
}

function DialogBody({ children, padding = "20px 24px" }) {
  return <div style={{ padding }}>{children}</div>;
}

// ============ Skeleton (shimmer) ============
function Skeleton({ width = "100%", height = 14, radius = 4 }) {
  return (
    <div style={{
      width, height,
      borderRadius: radius,
      background: "linear-gradient(90deg, var(--color-surface-sunken) 0%, oklch(0.93 0.012 70) 50%, var(--color-surface-sunken) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s linear infinite",
    }} />
  );
}

// Inject shimmer keyframes once
if (typeof document !== "undefined" && !document.getElementById("paraph-skeleton-anim")) {
  const s = document.createElement("style");
  s.id = "paraph-skeleton-anim";
  s.textContent = "@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}";
  document.head.appendChild(s);
}

// ============ Pagination ============
function Pagination({ from, to, total, page = 1, totalPages = 5 }) {
  return (
    <div style={{
      padding: "14px 32px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <div style={{
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--color-ink-muted)",
      }}>
        Showing <span style={{ color: "var(--color-ink)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{from}–{to}</span> of <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>{total}</span>
      </div>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <IconButton icon="chevron-left" size={32} variant="outline" />
        {[...Array(totalPages)].map((_, i) => {
          const num = i + 1;
          const isActive = num === page;
          return (
            <button key={i} style={{
              minWidth: 32, height: 32,
              padding: "0 8px",
              background: isActive ? "var(--color-brand-soft)" : "transparent",
              color: isActive ? "var(--color-brand-strong)" : "var(--color-ink-muted)",
              border: isActive ? "1px solid oklch(0.85 0.08 40)" : "1px solid transparent",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontVariantNumeric: "tabular-nums",
            }}>{num}</button>
          );
        })}
        <span style={{ color: "var(--color-ink-faint)", padding: "0 4px" }}>…</span>
        <IconButton icon="chevron-right" size={32} variant="outline" />
      </div>
    </div>
  );
}

// ============ Drawer (right slide-over) ============
function Drawer({ width = 480, children }) {
  return (
    <div style={{
      position: "absolute",
      top: 0, right: 0, bottom: 0,
      width,
      background: "var(--color-surface)",
      borderLeft: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-2)",
      display: "flex",
      flexDirection: "column",
      zIndex: 10,
    }}>{children}</div>
  );
}

// ============ Tabs (underline) ============
function Tabs({ items, active }) {
  return (
    <div style={{
      display: "flex",
      borderBottom: "1px solid var(--color-border)",
      padding: "0 24px",
      gap: 4,
    }}>
      {items.map(t => {
        const isActive = t === active;
        return (
          <button key={t} style={{
            padding: "12px 4px",
            margin: "0 8px",
            border: "none",
            background: "transparent",
            color: isActive ? "var(--color-ink)" : "var(--color-ink-muted)",
            fontFamily: "var(--font-sans)",
            fontSize: 13.5,
            fontWeight: isActive ? 600 : 500,
            borderBottom: isActive ? "2px solid var(--color-brand)" : "2px solid transparent",
            marginBottom: -1,
            cursor: "pointer",
          }}>{t}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  SIGNER_COLORS, TopNav, AppShell, PageHeader, STATUS, StatusBadge,
  AvatarStack, PdfThumb, IconButton, DropdownTrigger,
  Table, TableHead, TableRow, EmptyState, PaperStack,
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Skeleton, Pagination, Drawer, Tabs,
});
