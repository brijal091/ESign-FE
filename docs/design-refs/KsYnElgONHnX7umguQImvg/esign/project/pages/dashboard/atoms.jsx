// =============================================================
// 07 — Dashboard: atoms specific to the analytics surface.
// Reuses AppShell / PageHeader / TopNav / StatusBadge / Table /
// IconButton / EmptyState from documents/atoms.jsx and Button /
// Avatar / TagChip from auth/atoms.jsx (both loaded first).
// =============================================================

// ============ Card ============
// A neutral container — used for KPIs, chart panels, the activity list.
function DashCard({ title, action, children, padding = 20, style = {} }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-1)",
      display: "flex",
      flexDirection: "column",
      ...style,
    }}>
      {(title || action) && (
        <div style={{
          padding: `${padding - 4}px ${padding}px ${padding - 8}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          {title && <h3 style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-ink)",
            letterSpacing: "-0.005em",
          }}>{title}</h3>}
          {action}
        </div>
      )}
      <div style={{
        padding: title || action
          ? `0 ${padding}px ${padding}px`
          : padding,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}>
        {children}
      </div>
    </div>
  );
}

// ============ Delta Badge (KPI trend) ============
// tone: success | warning | danger | muted
function DeltaBadge({ value, tone = "muted", arrow = true }) {
  const palette = {
    success: { color: "var(--color-success-strong)", bg: "var(--color-success-soft)" },
    warning: { color: "var(--color-warning-strong)", bg: "var(--color-warning-soft)" },
    danger:  { color: "var(--color-danger-strong)",  bg: "var(--color-danger-soft)" },
    muted:   { color: "var(--color-ink-muted)",      bg: "var(--color-surface-sunken)" },
  }[tone];
  // Pick arrow by sign of leading char
  const dir = /^[+\u2191]/.test(value) ? "up"
    : /^[-−\u2193]/.test(value) ? "down"
    : "flat";
  const iconName = dir === "up" ? "arrow-up-right"
    : dir === "down" ? "arrow-down-right"
    : "minus";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px 2px 6px",
      borderRadius: 999,
      background: palette.bg,
      color: palette.color,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.4,
      whiteSpace: "nowrap",
      fontVariantNumeric: "tabular-nums",
    }}>
      {arrow && I(iconName, 12, "currentColor", { strokeWidth: 2 })}
      {value}
    </span>
  );
}

// ============ KPI Card ============
function KpiCard({ label, value, delta, deltaTone, deltaSuffix }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-1)",
      padding: "18px 20px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 12,
      minWidth: 0,
    }}>
      <div style={{
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--color-ink-muted)",
        fontWeight: 500,
        letterSpacing: 0,
      }}>{label}</div>
      <div style={{
        fontFamily: "var(--font-sans)",
        fontSize: 32,
        fontWeight: 600,
        letterSpacing: "-0.02em",
        color: "var(--color-ink)",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}>{value}</div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: -2,
      }}>
        <DeltaBadge value={delta} tone={deltaTone} />
        {deltaSuffix && <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--color-ink-subtle)",
        }}>{deltaSuffix}</span>}
      </div>
    </div>
  );
}

// ============ Range Tabs (segmented pill) ============
function RangeTabs({ items = ["Today", "7 days", "30 days", "90 days", "Custom"], active = "30 days" }) {
  return (
    <div style={{
      display: "inline-flex",
      padding: 3,
      background: "var(--color-surface-sunken)",
      borderRadius: "var(--radius-sm)",
      border: "1px solid var(--color-border)",
      gap: 0,
    }}>
      {items.map(t => {
        const isActive = t === active;
        const isCustom = t === "Custom";
        return (
          <button key={t} style={{
            padding: "6px 12px",
            background: isActive ? "var(--color-surface)" : "transparent",
            color: isActive ? "var(--color-ink)" : "var(--color-ink-muted)",
            border: isActive ? "1px solid var(--color-border)" : "1px solid transparent",
            borderRadius: 5,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: isActive ? 600 : 500,
            cursor: "pointer",
            boxShadow: isActive ? "var(--shadow-1)" : "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}>
            {isCustom && I("calendar", 13, "currentColor")}
            {t}
          </button>
        );
      })}
    </div>
  );
}

// ============ Status Dot ============
function StatusDot({ status = "completed", size = 8 }) {
  const color = STATUS[status]?.dot || status; // accepts a token or raw color
  return (
    <span style={{
      width: size,
      height: size,
      borderRadius: 999,
      background: color,
      flexShrink: 0,
      display: "inline-block",
    }} />
  );
}

// ============ Sending Volume — Line Chart ============
// 30 daily values. Smooth path + soft area fill + gridlines + x labels.
function LineChart({
  data,
  width = 760,
  height = 240,
  padding = { top: 18, right: 18, bottom: 28, left: 36 },
  color = "var(--color-brand)",
  areaColor = "var(--color-brand-soft)",
}) {
  const W = width, H = height;
  const innerW = W - padding.left - padding.right;
  const innerH = H - padding.top - padding.bottom;
  const max = Math.max(...data) * 1.15;
  const min = 0;
  const xAt = i => padding.left + (i / (data.length - 1)) * innerW;
  const yAt = v => padding.top + innerH - ((v - min) / (max - min)) * innerH;

  // Smooth Catmull-Rom → Bezier
  const pts = data.map((v, i) => [xAt(i), yAt(v)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`;
  }
  const area = d + ` L ${pts[pts.length - 1][0]} ${padding.top + innerH} L ${pts[0][0]} ${padding.top + innerH} Z`;

  // Gridline values (4 horizontal)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(p => Math.round(min + (max - min) * p));
  // X labels every 5th day, starting at day 1
  const xLabels = data.map((_, i) => i).filter(i => i % 5 === 0 || i === data.length - 1);

  // Highlighted point (last)
  const lastIdx = data.length - 1;
  const lastX = xAt(lastIdx);
  const lastY = yAt(data[lastIdx]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
      {/* Y gridlines + labels */}
      {yTicks.map((v, i) => {
        const y = yAt(v);
        return (
          <g key={i}>
            <line
              x1={padding.left} x2={W - padding.right}
              y1={y} y2={y}
              stroke="var(--color-border-subtle)"
              strokeWidth={1}
              strokeDasharray={i === 0 ? "0" : "2 4"}
            />
            <text
              x={padding.left - 8} y={y + 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="10"
              fill="var(--color-ink-faint)"
            >{v}</text>
          </g>
        );
      })}

      {/* Area fill */}
      <path d={area} fill={areaColor} opacity={0.55} />
      {/* Line */}
      <path d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {/* X axis day labels */}
      {xLabels.map(i => (
        <text
          key={i}
          x={xAt(i)}
          y={H - padding.bottom + 16}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="10"
          fill="var(--color-ink-subtle)"
        >Mar {i + 1}</text>
      ))}

      {/* Last data point marker + value pill */}
      <circle cx={lastX} cy={lastY} r={3.5} fill={color} stroke="var(--color-surface)" strokeWidth={2} />
      <g transform={`translate(${lastX - 18} ${lastY - 30})`}>
        <rect width={36} height={20} rx={4} fill="var(--color-ink)" />
        <text
          x={18} y={14}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fontWeight="500"
          fill="var(--color-ink-inverse)"
        >{data[lastIdx]}</text>
      </g>
    </svg>
  );
}

// ============ Donut Chart ============
// slices: [{ key, label, count, color }]
function DonutChart({
  slices,
  size = 180,
  thickness = 26,
  highlight = null, // slice key to emphasize (others dim)
  centerLabel,
  centerSub,
}) {
  const R = size / 2;
  const r = R - thickness / 2;
  const c = 2 * Math.PI * r;
  const total = slices.reduce((s, x) => s + x.count, 0);

  // Spacing between slices (in deg)
  const gapDeg = 1.4;
  let offsetDeg = -90; // start at top

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size, display: "block" }}>
      {/* track */}
      <circle cx={R} cy={R} r={r} fill="none"
        stroke="var(--color-surface-sunken)" strokeWidth={thickness} />
      {slices.map((s, i) => {
        const portion = s.count / total;
        const arcDeg = portion * 360 - gapDeg;
        const arc = (arcDeg / 360) * c;
        const dasharray = `${arc} ${c - arc}`;
        // dashoffset adjusts start position
        const offset = -((offsetDeg + 90) / 360) * c;
        const dim = highlight && s.key !== highlight;
        const isHi = highlight && s.key === highlight;
        offsetDeg += portion * 360;
        return (
          <circle
            key={s.key}
            cx={R} cy={R} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={isHi ? thickness + 4 : thickness}
            strokeDasharray={dasharray}
            strokeDashoffset={offset}
            opacity={dim ? 0.18 : 1}
            transform={`rotate(-90 ${R} ${R})`}
            style={{ transition: "opacity .2s, stroke-width .2s" }}
          />
        );
      })}
      {centerLabel && (
        <text x={R} y={R - 2}
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="22"
          fontWeight="600"
          fill="var(--color-ink)"
          style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em" }}
        >{centerLabel}</text>
      )}
      {centerSub && (
        <text x={R} y={R + 16}
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize="11"
          fill="var(--color-ink-subtle)"
        >{centerSub}</text>
      )}
    </svg>
  );
}

// ============ Donut legend ============
function DonutLegend({ slices, total, highlight = null }) {
  return (
    <ul style={{
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 9,
    }}>
      {slices.map(s => {
        const dim = highlight && s.key !== highlight;
        const isHi = highlight && s.key === highlight;
        return (
          <li key={s.key} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: dim ? 0.5 : 1,
            transition: "opacity .2s",
          }}>
            <span style={{
              width: 10, height: 10,
              borderRadius: 3,
              background: s.color,
              flexShrink: 0,
              boxShadow: isHi ? "0 0 0 2px var(--color-surface), 0 0 0 3.5px " + s.color : "none",
            }} />
            <span style={{
              flex: 1,
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: isHi ? "var(--color-ink)" : "var(--color-ink-muted)",
              fontWeight: isHi ? 600 : 500,
            }}>{s.label}</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-ink-muted)",
              fontVariantNumeric: "tabular-nums",
            }}>{s.count}</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--color-ink-faint)",
              fontVariantNumeric: "tabular-nums",
              minWidth: 30,
              textAlign: "right",
            }}>{Math.round((s.count / total) * 100)}%</span>
          </li>
        );
      })}
    </ul>
  );
}

// ============ Recent Activity row (compact, no table header) ============
function ActivityRow({ actor, action, document, time, status }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "14px minmax(0, 1fr) auto",
      gap: 12,
      padding: "10px 18px",
      alignItems: "center",
      borderTop: "1px solid var(--color-border-subtle)",
    }}>
      <StatusDot status={status} size={8} />
      <div style={{
        minWidth: 0,
        display: "flex",
        alignItems: "baseline",
        gap: 6,
        flexWrap: "nowrap",
      }}>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13.5,
          fontWeight: 500,
          color: "var(--color-ink)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{actor}</span>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}>{action}</span>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0,
          flex: 1,
        }}>{document}</span>
      </div>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--color-ink-subtle)",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}>{time}</span>
    </div>
  );
}

// ============ Bar-chart illustration (empty state) ============
function BarChartIllustration() {
  // 5 bars of increasing height, faintly receding
  const bars = [
    { h: 28, c: "var(--color-status-draft)",  opacity: 0.35 },
    { h: 44, c: "var(--color-status-sent)",   opacity: 0.55 },
    { h: 62, c: "var(--color-status-viewed)", opacity: 0.7 },
    { h: 84, c: "var(--color-warning)",       opacity: 0.85 },
    { h: 96, c: "var(--color-brand)",         opacity: 1 },
  ];
  return (
    <div style={{
      position: "relative",
      width: 168, height: 132,
      display: "grid",
      placeItems: "end center",
      padding: "0 6px 18px",
    }}>
      {/* dotted background plate */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(var(--color-border) 1px, transparent 1px)",
        backgroundSize: "12px 12px",
        opacity: 0.45,
        borderRadius: "var(--radius-md)",
        WebkitMaskImage: "radial-gradient(circle at center, #000 60%, transparent 100%)",
        maskImage: "radial-gradient(circle at center, #000 60%, transparent 100%)",
      }} />
      {/* baseline */}
      <div style={{
        position: "absolute",
        left: 18, right: 18, bottom: 18,
        height: 1,
        background: "var(--color-border)",
      }} />
      {/* bars */}
      <div style={{
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        height: "100%",
        paddingBottom: 19,
      }}>
        {bars.map((b, i) => (
          <div key={i} style={{
            width: 18,
            height: b.h,
            background: b.c,
            opacity: b.opacity,
            borderRadius: "3px 3px 0 0",
            boxShadow: "var(--shadow-1)",
          }} />
        ))}
      </div>
      {/* sparkle dot */}
      <div style={{
        position: "absolute",
        top: 14, right: 18,
        width: 6, height: 6,
        borderRadius: 999,
        background: "var(--color-brand)",
        boxShadow: "0 0 0 3px var(--color-brand-soft)",
      }} />
    </div>
  );
}

// ============ Mock daily volume data (30 days) — deterministic ============
const VOLUME_30 = [
  18, 22, 17, 26, 31, 29, 24,
  20, 28, 35, 32, 40, 47, 42,
  38, 44, 51, 58, 53, 49,
  56, 62, 68, 64, 71, 75, 70,
  78, 84, 92,
];

// ============ Status breakdown — 5 slices summing to 1284 ============
// (matches the KPI bar above: Completed 892, Pending 267, etc.)
const STATUS_SLICES = [
  { key: "completed", label: "Fully Signed",    count: 892, color: "var(--color-status-signed)" },
  { key: "pending",   label: "Pending · To Sign", count: 267, color: "var(--color-status-sent)" },
  { key: "draft",     label: "Drafts",           count:  78, color: "var(--color-status-draft)" },
  { key: "expired",   label: "Expired",          count:  25, color: "var(--color-warning)" },
  { key: "declined",  label: "Declined",         count:  22, color: "var(--color-status-declined)" },
];

// ============ Recent activity feed (8 rows) ============
const ACTIVITY = [
  { actor: "Elena Marquez", action: "signed",   document: "Mutual NDA · Acme × Northwind", time: "2m ago",    status: "completed" },
  { actor: "Lin Park",      action: "viewed",   document: "Q1 Contractor Onboarding",      time: "14m ago",   status: "viewed" },
  { actor: "Sana Ortiz",    action: "signed",   document: "NDA · Folio × Brightway",       time: "1h ago",    status: "completed" },
  { actor: "You",           action: "sent",     document: "Vendor MSA · Brightway Print",  time: "2h ago",    status: "sent" },
  { actor: "Caleb Mwangi",  action: "viewed",   document: "Offer Letter · Caleb Mwangi",   time: "3h ago",    status: "viewed" },
  { actor: "Priya Shastri", action: "signed",   document: "SOW #2026-014 · Lumen Studio",  time: "4h ago",    status: "signed" },
  { actor: "You",           action: "sent",     document: "Mutual NDA · Tessera × Folio",  time: "yesterday", status: "sent" },
  { actor: "Daniel Park",   action: "declined", document: "Equipment lease · Margate Co.", time: "yesterday", status: "declined" },
];

// ============ Pending-only filtered docs (for drill-down) ============
const PENDING_DOCS = [
  {
    name: "Vendor MSA · Brightway Print", meta: "12 pages · 1.1 MB",
    sent: "Mar 10",
    signers: [
      { initials: "MO", colorIdx: 3 }, { initials: "JC", colorIdx: 0 },
      { initials: "RT", colorIdx: 2 }, { initials: "DK", colorIdx: 1 },
    ],
    status: "sent", waiting: "0 of 4 signed", aging: "2 days",
  },
  {
    name: "Offer Letter · Caleb Mwangi", meta: "2 pages · 220 KB",
    sent: "Mar 10",
    signers: [{ initials: "CM", colorIdx: 6 }],
    status: "viewed", waiting: "Opened, not signed", aging: "2 days",
  },
  {
    name: "SOW #2026-014 · Lumen Studio", meta: "8 pages · 1.8 MB",
    sent: "Mar 9",
    signers: [
      { initials: "PS", colorIdx: 4 }, { initials: "AB", colorIdx: 1 },
      { initials: "EM", colorIdx: 0 },
    ],
    status: "signed", waiting: "1 of 3 signed", aging: "3 days",
  },
  {
    name: "Sales Order · Riverline Holdings", meta: "6 pages · 720 KB",
    sent: "Mar 7",
    signers: [
      { initials: "DP", colorIdx: 1 }, { initials: "LH", colorIdx: 3 },
      { initials: "MK", colorIdx: 5 }, { initials: "+2", colorIdx: 0 },
    ],
    status: "sent", waiting: "0 of 6 signed", aging: "5 days",
  },
  {
    name: "NDA · Folio × Brightway", meta: "2 pages · 180 KB",
    sent: "Mar 4",
    signers: [{ initials: "SO", colorIdx: 2 }, { initials: "MO", colorIdx: 3 }],
    status: "viewed", waiting: "Opened, not signed", aging: "8 days",
  },
  {
    name: "Mutual NDA · Tessera × Folio (re-send)", meta: "3 pages · 410 KB",
    sent: "Mar 3",
    signers: [{ initials: "YD", colorIdx: 7 }, { initials: "SO", colorIdx: 2 }],
    status: "sent", waiting: "0 of 2 signed", aging: "9 days",
  },
  {
    name: "Reseller agreement · Halcyon Labs", meta: "14 pages · 2.6 MB",
    sent: "Mar 1",
    signers: [
      { initials: "TR", colorIdx: 5 }, { initials: "NH", colorIdx: 4 },
    ],
    status: "sent", waiting: "0 of 2 signed", aging: "11 days",
  },
  {
    name: "Photography release · Sana Ortiz", meta: "1 page · 90 KB",
    sent: "Feb 28",
    signers: [{ initials: "SO", colorIdx: 2 }, { initials: "BP", colorIdx: 0 }],
    status: "signed", waiting: "1 of 2 signed", aging: "12 days",
  },
];

// Pending-only Table columns
const PENDING_COLS = {
  template: "90px minmax(280px, 1fr) 200px 140px 130px 100px 40px",
  labels: ["Sent", "Document", "Signers", "Status", "Waiting on", "Aging", ""],
};

Object.assign(window, {
  DashCard, DeltaBadge, KpiCard, RangeTabs, StatusDot,
  LineChart, DonutChart, DonutLegend,
  ActivityRow, BarChartIllustration,
  VOLUME_30, STATUS_SLICES, ACTIVITY, PENDING_DOCS, PENDING_COLS,
});
