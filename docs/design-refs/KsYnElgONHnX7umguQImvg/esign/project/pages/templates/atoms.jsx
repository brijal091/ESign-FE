// =============================================================
// 08 — Templates & Contacts: atoms.
// Reuses AppShell / PageHeader / Table / IconButton / DropdownTrigger /
// EmptyState / Dialog / Tabs / Pagination from documents/atoms.jsx
// and Button / Input / Avatar / TagChip / Field / Label / Stepper
// from auth/atoms.jsx and EditorLayout / EditorTopBar from editor/atoms.jsx.
// =============================================================

// ============ TplThumb — first-page miniature preview ============
// Rendered as a small contract page (title centered + faint body lines + signature line).
function TplThumb({ accent = "var(--color-brand-soft)", lines = 7, headline = true }) {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: 120,
      background: "var(--color-paper)",
      borderBottom: "1px solid var(--color-border)",
      overflow: "hidden",
    }}>
      {/* offset paper backdrop — second sheet peeking out */}
      <div style={{
        position: "absolute",
        left: 18, top: 14,
        right: 36, bottom: -6,
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: 2,
        transform: "rotate(-2.2deg)",
        boxShadow: "var(--shadow-1)",
      }} />
      {/* main page */}
      <div style={{
        position: "absolute",
        left: 24, top: 10,
        right: 24, bottom: -10,
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        borderRadius: 2,
        padding: "14px 18px 0",
        boxShadow: "var(--shadow-1)",
        overflow: "hidden",
      }}>
        {/* corner accent */}
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: 22, height: 3,
          background: "var(--color-brand)",
        }} />
        {headline && (
          <>
            <div style={{
              height: 6,
              width: "62%",
              background: "var(--color-ink)",
              borderRadius: 1,
              marginTop: 4,
              marginBottom: 4,
              opacity: 0.85,
            }} />
            <div style={{
              height: 3,
              width: "38%",
              background: "var(--color-brand)",
              borderRadius: 1,
              marginBottom: 9,
            }} />
          </>
        )}
        {/* body lines */}
        {[...Array(lines)].map((_, i) => (
          <div key={i} style={{
            height: 2,
            background: "var(--color-border-strong)",
            opacity: 0.55,
            borderRadius: 1,
            marginBottom: 4,
            width: `${i === lines - 1 ? 38 : i % 3 === 2 ? 72 : 88}%`,
          }} />
        ))}
        {/* signature line at the bottom */}
        <div style={{
          position: "absolute",
          left: 18, bottom: 14,
          width: 90,
          borderTop: "1px solid var(--color-ink)",
          paddingTop: 2,
          fontFamily: "var(--font-mono)",
          fontSize: 6,
          color: "var(--color-ink-subtle)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>Signature</div>
        <div style={{
          position: "absolute",
          right: 18, bottom: 14,
          width: 60,
          borderTop: "1px solid var(--color-ink)",
          paddingTop: 2,
          fontFamily: "var(--font-mono)",
          fontSize: 6,
          color: "var(--color-ink-subtle)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}>Date</div>
      </div>
    </div>
  );
}

// ============ CategoryBadge — semantic chip used on TemplateCards ============
// category drives color: NDA, HR, Sales, Vendor, Finance, Brand, Tax
const CATEGORY_PALETTE = {
  NDA:      { bg: "var(--color-info-soft)",    fg: "var(--color-info-strong)"    },
  HR:       { bg: "var(--color-success-soft)", fg: "var(--color-success-strong)" },
  Sales:    { bg: "var(--color-brand-soft)",   fg: "var(--color-brand-strong)"   },
  Vendor:   { bg: "oklch(0.955 0.035 280)",    fg: "oklch(0.460 0.130 280)"      },
  Finance:  { bg: "var(--color-warning-soft)", fg: "var(--color-warning-strong)" },
  Brand:    { bg: "oklch(0.94 0.05 320)",      fg: "oklch(0.45 0.15 320)"        },
  Tax:      { bg: "oklch(0.93 0.005 60)",      fg: "oklch(0.42 0.014 60)"        },
};

function CategoryBadge({ category }) {
  const p = CATEGORY_PALETTE[category] || CATEGORY_PALETTE.Tax;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      borderRadius: 999,
      background: p.bg,
      color: p.fg,
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
    }}>{category}</span>
  );
}

function FieldCountBadge({ count }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "2px 8px 2px 6px",
      borderRadius: 999,
      background: "var(--color-surface-sunken)",
      color: "var(--color-ink-muted)",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 500,
      whiteSpace: "nowrap",
      border: "1px solid var(--color-border-subtle)",
    }}>
      {I("text-cursor-input", 11, "currentColor")}
      {count} fields
    </span>
  );
}

// ============ TemplateCard — 280×240 ============
function TemplateCard({ category, title, fields, lastUsed, lines = 7 }) {
  return (
    <div style={{
      width: 280,
      height: 240,
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-1)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      <TplThumb lines={lines} />
      <div style={{
        padding: "10px 14px 0",
        display: "flex",
        gap: 6,
        alignItems: "center",
      }}>
        <CategoryBadge category={category} />
        <FieldCountBadge count={fields} />
      </div>
      <div style={{ padding: "8px 14px 0", flex: 1, minWidth: 0 }}>
        <h4 style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--color-ink)",
          letterSpacing: "-0.005em",
          lineHeight: 1.25,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>{title}</h4>
        <div style={{
          marginTop: 3,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--color-ink-subtle)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>Last used {lastUsed}</div>
      </div>
      <div style={{
        padding: "10px 12px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        borderTop: "1px solid var(--color-border-subtle)",
        background: "var(--color-surface-raised)",
      }}>
        <Button variant="secondary" size="sm" icon="arrow-right">Use</Button>
        <IconButton icon="more-horizontal" size={28} variant="ghost" />
      </div>
    </div>
  );
}

// ============ ContactsSidebar — 240w groups list ============
function ContactsSidebar({ activeGroup = "All Contacts" }) {
  const groups = [
    { name: "All Contacts", count: 247, icon: "users" },
    { name: "Clients",      count: 86,  icon: "briefcase" },
    { name: "Internal",     count: 38,  icon: "building" },
    { name: "Vendors",      count: 23,  icon: "package" },
  ];
  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      borderRight: "1px solid var(--color-border)",
      background: "var(--color-surface)",
      padding: "24px 0 16px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      overflow: "auto",
    }}>
      <div style={{
        padding: "0 20px 12px",
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--color-ink-subtle)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>Groups</div>
      {groups.map(g => {
        const isActive = g.name === activeGroup;
        return (
          <button key={g.name} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 14px 8px 18px",
            margin: "0 8px",
            background: isActive ? "var(--color-brand-soft)" : "transparent",
            border: "none",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            color: isActive ? "var(--color-brand-strong)" : "var(--color-ink-muted)",
            fontFamily: "var(--font-sans)",
            fontSize: 13.5,
            fontWeight: isActive ? 600 : 500,
            position: "relative",
            textAlign: "left",
          }}>
            {isActive && <span style={{
              position: "absolute",
              left: -8, top: 7, bottom: 7,
              width: 3,
              borderRadius: 999,
              background: "var(--color-brand)",
            }} />}
            {I(g.icon, 15, "currentColor")}
            <span style={{ flex: 1 }}>{g.name}</span>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              fontWeight: 500,
              color: isActive ? "var(--color-brand-strong)" : "var(--color-ink-faint)",
              fontVariantNumeric: "tabular-nums",
            }}>{g.count}</span>
          </button>
        );
      })}
      {/* New group ghost row */}
      <button style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 14px 8px 18px",
        margin: "6px 8px 0",
        background: "transparent",
        border: "none",
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        color: "var(--color-ink-subtle)",
        fontFamily: "var(--font-sans)",
        fontSize: 13.5,
        fontWeight: 500,
        textAlign: "left",
      }}>
        {I("plus", 15, "currentColor")}
        <span>New group</span>
      </button>

      <div style={{ flex: 1 }} />

      {/* Smart groups (extra context, no slop — looks like a real product) */}
      <div style={{
        padding: "12px 20px 6px",
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--color-ink-subtle)",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}>Smart</div>
      {[
        { name: "Recently contacted", count: 14, icon: "clock-3" },
        { name: "Unsigned for 7d+",   count: 6,  icon: "alert-circle" },
      ].map(g => (
        <button key={g.name} style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px 8px 18px",
          margin: "0 8px",
          background: "transparent",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          color: "var(--color-ink-muted)",
          fontFamily: "var(--font-sans)",
          fontSize: 13.5,
          fontWeight: 500,
          textAlign: "left",
        }}>
          {I(g.icon, 15, "currentColor")}
          <span style={{ flex: 1 }}>{g.name}</span>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--color-ink-faint)",
            fontVariantNumeric: "tabular-nums",
          }}>{g.count}</span>
        </button>
      ))}
    </aside>
  );
}

// ============ Sample data ============
const TEMPLATES = [
  { title: "NDA — Standard",          category: "NDA",     fields: 5,  lastUsed: "3 days ago",  lines: 8 },
  { title: "NDA — Mutual",            category: "NDA",     fields: 8,  lastUsed: "yesterday",   lines: 9 },
  { title: "Offer Letter",            category: "HR",      fields: 7,  lastUsed: "5 days ago",  lines: 7 },
  { title: "Vendor MSA",              category: "Vendor",  fields: 12, lastUsed: "2 weeks ago", lines: 10 },
  { title: "Statement of Work",       category: "Sales",   fields: 9,  lastUsed: "today",       lines: 8 },
  { title: "Photography Release",     category: "Brand",   fields: 4,  lastUsed: "last month",  lines: 6 },
  { title: "Equipment Lease",         category: "Finance", fields: 11, lastUsed: "1 week ago",  lines: 9 },
  { title: "W-9 Form",                category: "Tax",     fields: 6,  lastUsed: "4 days ago",  lines: 7 },
  { title: "Speaking Engagement",     category: "Brand",   fields: 5,  lastUsed: "2 days ago",  lines: 8 },
];

const CONTACTS = [
  { name: "Elena Mendoza",  email: "elena@acme.com",         phone: "+1 (415) 555-0142", company: "Acme Holdings",    tags: ["Client", "NDA"],       last: "2h ago",     colorIdx: 0 },
  { name: "Sarah Chen",     email: "sarah@northwind.co",     phone: "+1 (415) 555-0193", company: "Northwind Co.",    tags: ["Client"],              last: "yesterday",  colorIdx: 1 },
  { name: "Mira Okonkwo",   email: "mira@northbeam.io",      phone: "+1 (510) 555-0118", company: "Northbeam",        tags: ["Internal"],            last: "3d ago",     colorIdx: 2 },
  { name: "Caleb Mwangi",   email: "caleb.m@acme.com",       phone: "+1 (415) 555-0177", company: "Acme Holdings",    tags: ["Client", "New hire"],  last: "today",      colorIdx: 6 },
  { name: "Daniel Park",    email: "daniel@riverline.co",    phone: "+1 (212) 555-0124", company: "Riverline Holdings", tags: ["Client", "VIP"],     last: "1w ago",     colorIdx: 1 },
  { name: "Priya Shastri",  email: "priya@lumenstudio.io",   phone: "+1 (415) 555-0162", company: "Lumen Studio",     tags: ["Vendor"],              last: "4d ago",     colorIdx: 4 },
  { name: "Yusuf Demir",    email: "yusuf@tessera.studio",   phone: "+1 (718) 555-0146", company: "Tessera Studio",   tags: ["Client"],              last: "2w ago",     colorIdx: 7 },
  { name: "Aisha Bello",    email: "aisha@margate.co",       phone: "+1 (212) 555-0185", company: "Margate Co.",      tags: ["Vendor"],              last: "1mo ago",    colorIdx: 4 },
  { name: "Sana Ortiz",     email: "sana@folio.design",      phone: "+1 (415) 555-0131", company: "Folio",            tags: ["Client", "Brand"],     last: "5d ago",     colorIdx: 2 },
  { name: "Brijal Patel",   email: "brijal@northbeam.io",    phone: "+1 (415) 555-0109", company: "Northbeam",        tags: ["Internal"],            last: "today",      colorIdx: 0 },
  { name: "Lin Park",       email: "lin.p@northbeam.io",     phone: "—",                 company: "Northbeam",        tags: ["Internal"],            last: "6d ago",     colorIdx: 2 },
  { name: "Mateo Ortiz",    email: "mateo@brightway.print",  phone: "+1 (503) 555-0155", company: "Brightway Print",  tags: ["Vendor"],              last: "2d ago",     colorIdx: 3 },
];

// Contacts table cols: Checkbox · Name · Email · Phone · Company · Tags · Last contacted · Action
const CONTACT_COLS = {
  template: "40px minmax(200px, 1.4fr) minmax(180px, 1.3fr) 150px minmax(150px, 1fr) minmax(160px, 1fr) 130px 40px",
  labels:   ["_checkbox", "Name", "Email", "Phone", "Company", "Tags", "Last contacted", ""],
};

Object.assign(window, {
  TplThumb, CategoryBadge, FieldCountBadge, TemplateCard, ContactsSidebar,
  TEMPLATES, CONTACTS, CONTACT_COLS,
});
