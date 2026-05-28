// =============================================================
// 09 — Admin: atoms.
// Reuses AppShell / PageHeader / Table / IconButton / DropdownTrigger /
// Pagination / DialogHeader/Body/Footer / Avatar / TagChip / Field /
// Input / Button / Switch / Toast / Stepper.
// =============================================================

// ============ Sub-nav (240w, left of content) ============
const ADMIN_SECTIONS = [
  { key: "General",      icon: "settings" },
  { key: "Users",        icon: "users" },
  { key: "Roles",        label: "Roles & Permissions", icon: "shield-check" },
  { key: "Branding",     icon: "palette" },
  { key: "Audit Log",    icon: "scroll-text" },
  { key: "Billing",      icon: "credit-card" },
  { key: "Integrations", icon: "plug" },
];

function AdminSubNav({ active = "General" }) {
  return (
    <aside style={{
      width: 240,
      flexShrink: 0,
      borderRight: "1px solid var(--color-border)",
      background: "var(--color-surface)",
      padding: "24px 0 16px",
      display: "flex",
      flexDirection: "column",
      gap: 2,
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
      }}>Workspace</div>

      {ADMIN_SECTIONS.map(s => {
        const isActive = s.key === active;
        const label = s.label || s.key;
        return (
          <button key={s.key} style={{
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
            {I(s.icon, 15, "currentColor")}
            <span style={{ flex: 1 }}>{label}</span>
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      <div style={{
        margin: "12px 16px",
        padding: "12px 12px",
        background: "var(--color-surface-sunken)",
        border: "1px solid var(--color-border-subtle)",
        borderRadius: "var(--radius-sm)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-ink-subtle)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          {I("zap", 11, "currentColor")} Business plan
        </div>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          color: "var(--color-ink-muted)",
          lineHeight: 1.4,
        }}>
          247 / 500 contacts · renews Jun 14
        </div>
        <a href="#" style={{
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--color-brand-strong)",
          textDecoration: "none",
          marginTop: 2,
        }}>Upgrade →</a>
      </div>
    </aside>
  );
}

// ============ AdminLayout (TopNav active=Configuration + sub-nav) ============
function AdminLayout({ section = "General", children }) {
  return (
    <AppShell active="Configuration">
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <AdminSubNav active={section} />
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "var(--color-paper)",
        }}>
          {children}
        </div>
      </div>
    </AppShell>
  );
}

// ============ Role Badge ============
// admin → destructive-tinted, sender → info-tinted, viewer → muted
function RoleBadge({ role }) {
  const map = {
    Admin:  { bg: "var(--color-danger-soft)",  fg: "var(--color-danger-strong)",  dot: "var(--color-danger)"  },
    Sender: { bg: "var(--color-info-soft)",    fg: "var(--color-info-strong)",    dot: "var(--color-info)"    },
    Viewer: { bg: "var(--color-surface-sunken)", fg: "var(--color-ink-muted)",    dot: "var(--color-ink-subtle)" },
  };
  const p = map[role];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "2px 9px 2px 7px",
      borderRadius: 999,
      background: p.bg,
      color: p.fg,
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      fontWeight: 600,
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 5, height: 5, borderRadius: 999, background: p.dot }} />
      {role}
    </span>
  );
}

// ============ User Status (Active dot / Suspended dot) ============
function UserStatus({ status }) {
  const isActive = status === "Active";
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: isActive ? "var(--color-ink)" : "var(--color-ink-subtle)",
    }}>
      <span style={{
        width: 8, height: 8,
        borderRadius: 999,
        background: isActive ? "var(--color-success)" : "var(--color-ink-faint)",
        boxShadow: isActive ? "0 0 0 3px var(--color-success-soft)" : "none",
      }} />
      {status}
    </span>
  );
}

// ============ Action Badge (audit log, muted) ============
const ACTION_PALETTE = {
  document_created:   { fg: "var(--color-ink-muted)",       bg: "var(--color-surface-sunken)" },
  document_sent:      { fg: "var(--color-info-strong)",     bg: "var(--color-info-soft)" },
  document_viewed:    { fg: "var(--color-ink-muted)",       bg: "var(--color-surface-sunken)" },
  document_signed:    { fg: "var(--color-success-strong)",  bg: "var(--color-success-soft)" },
  document_completed: { fg: "var(--color-success-strong)",  bg: "var(--color-success-soft)" },
  document_declined:  { fg: "var(--color-danger-strong)",   bg: "var(--color-danger-soft)" },
  otp_verified:       { fg: "var(--color-brand-strong)",    bg: "var(--color-brand-soft)" },
  field_completed:    { fg: "var(--color-ink-muted)",       bg: "var(--color-surface-sunken)" },
};
function ActionBadge({ action }) {
  const p = ACTION_PALETTE[action] || ACTION_PALETTE.document_viewed;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      borderRadius: "var(--radius-sm)",
      background: p.bg,
      color: p.fg,
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      fontWeight: 500,
      whiteSpace: "nowrap",
      letterSpacing: "-0.01em",
    }}>{action}</span>
  );
}

// ============ Settings Section Card (h3 + divider + form rows) ============
function SettingsCard({ title, description, action, children }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-1)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "18px 24px 14px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        borderBottom: "1px solid var(--color-border-subtle)",
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: 15,
            fontWeight: 600,
            color: "var(--color-ink)",
            letterSpacing: "-0.005em",
          }}>{title}</h3>
          {description && (
            <p style={{
              margin: "3px 0 0",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--color-ink-subtle)",
            }}>{description}</p>
          )}
        </div>
        {action}
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

// ============ Switch Row — label/sub on left, switch on right ============
function SwitchRow({ title, sub, checked = false, last = false }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "12px 0",
      borderBottom: last ? "none" : "1px solid var(--color-border-subtle)",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13.5,
          fontWeight: 500,
          color: "var(--color-ink)",
        }}>{title}</div>
        {sub && (
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12.5,
            color: "var(--color-ink-subtle)",
            marginTop: 2,
          }}>{sub}</div>
        )}
      </div>
      <Switch checked={checked} />
    </div>
  );
}

// ============ Radio Row (for data retention) ============
function RadioRow({ label, sub, selected = false, last = false }) {
  return (
    <label style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "12px 14px",
      borderRadius: "var(--radius-sm)",
      background: selected ? "var(--color-brand-soft)" : "transparent",
      border: selected ? "1px solid oklch(0.85 0.08 40)" : "1px solid var(--color-border-subtle)",
      cursor: "pointer",
      marginBottom: last ? 0 : 8,
    }}>
      <span style={{
        width: 16, height: 16,
        borderRadius: 999,
        border: selected ? "5px solid var(--color-brand)" : "1.5px solid var(--color-border-strong)",
        background: "var(--color-surface)",
        flexShrink: 0,
        marginTop: 2,
        boxSizing: "border-box",
        transition: "border var(--dur-1) var(--ease-out)",
      }} />
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13.5,
          fontWeight: selected ? 600 : 500,
          color: selected ? "var(--color-brand-strong)" : "var(--color-ink)",
        }}>{label}</div>
        {sub && (
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12.5,
            color: selected ? "oklch(0.45 0.10 38)" : "var(--color-ink-subtle)",
            marginTop: 2,
          }}>{sub}</div>
        )}
      </div>
    </label>
  );
}

// ============ Select (visual only, mirrors Input style) ============
function Select({ value, placeholder = "Select…", icon }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 9,
      height: 40,
      padding: "0 12px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: value ? "var(--color-ink)" : "var(--color-ink-faint)",
    }}>
      {icon && I(icon, 15, "var(--color-ink-subtle)")}
      <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {value || placeholder}
      </span>
      {I("chevron-down", 15, "var(--color-ink-subtle)")}
    </div>
  );
}

// ============ Textarea (visual only) ============
function Textarea({ value = "", placeholder, rows = 4 }) {
  return (
    <div style={{
      padding: "10px 12px",
      minHeight: rows * 20 + 20,
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      lineHeight: 1.5,
      color: value ? "var(--color-ink)" : "var(--color-ink-faint)",
      whiteSpace: "pre-wrap",
    }}>{value || placeholder}</div>
  );
}

// ============ Sample data — Users (10 rows) ============
const USERS = [
  { name: "Brijal Patel",   email: "brijal@northbeam.io",     role: "Admin",  status: "Active",    last: "2m ago",     colorIdx: 0 },
  { name: "Sarah Chen",     email: "sarah@northbeam.io",      role: "Sender", status: "Active",    last: "1h ago",     colorIdx: 1 },
  { name: "Mira Okonkwo",   email: "mira@northbeam.io",       role: "Sender", status: "Active",    last: "today",      colorIdx: 2 },
  { name: "Daniel Park",    email: "daniel@northbeam.io",     role: "Viewer", status: "Active",    last: "yesterday",  colorIdx: 1 },
  { name: "Lin Park",       email: "lin.p@northbeam.io",      role: "Sender", status: "Active",    last: "3d ago",     colorIdx: 2 },
  { name: "Priya Shastri",  email: "priya@northbeam.io",      role: "Sender", status: "Suspended", last: "2w ago",     colorIdx: 4 },
  { name: "Caleb Mwangi",   email: "caleb.m@northbeam.io",    role: "Viewer", status: "Active",    last: "4h ago",     colorIdx: 6 },
  { name: "Aisha Bello",    email: "aisha@northbeam.io",      role: "Admin",  status: "Active",    last: "5h ago",     colorIdx: 4 },
  { name: "Mateo Ortiz",    email: "mateo@northbeam.io",      role: "Viewer", status: "Suspended", last: "1mo ago",    colorIdx: 3 },
  { name: "Yusuf Demir",    email: "yusuf@northbeam.io",      role: "Sender", status: "Active",    last: "6d ago",     colorIdx: 7 },
];

const USER_COLS = {
  template: "minmax(220px, 1.4fr) minmax(220px, 1.4fr) 130px 130px 130px 40px",
  labels:   ["Name", "Email", "Role", "Status", "Last active", ""],
};

// ============ Sample data — Audit Log (14 rows) ============
// Times are within the last few days, formatted as "Mar 14, 09:42:18 UTC"
const AUDIT = [
  { ts: "May 27, 14:08:42", actor: { name: "Brijal Patel", colorIdx: 0 },                   action: "document_created",   doc: "Mutual NDA · Acme × Northwind", ip: "73.18.244.91",  ua: "Chrome 124 · macOS 14.5" },
  { ts: "May 27, 14:09:11", actor: { name: "Brijal Patel", colorIdx: 0 },                   action: "document_sent",      doc: "Mutual NDA · Acme × Northwind", ip: "73.18.244.91",  ua: "Chrome 124 · macOS 14.5" },
  { ts: "May 27, 14:21:03", actor: { name: "elena@acme.com", signer: true, colorIdx: 5 },   action: "document_viewed",    doc: "Mutual NDA · Acme × Northwind", ip: "104.220.18.6",  ua: "Safari 17 · iOS 17.4" },
  { ts: "May 27, 14:22:48", actor: { name: "elena@acme.com", signer: true, colorIdx: 5 },   action: "otp_verified",       doc: "Mutual NDA · Acme × Northwind", ip: "104.220.18.6",  ua: "Safari 17 · iOS 17.4" },
  { ts: "May 27, 14:24:17", actor: { name: "elena@acme.com", signer: true, colorIdx: 5 },   action: "field_completed",    doc: "Mutual NDA · Acme × Northwind", ip: "104.220.18.6",  ua: "Safari 17 · iOS 17.4" },
  { ts: "May 27, 14:25:02", actor: { name: "elena@acme.com", signer: true, colorIdx: 5 },   action: "document_signed",    doc: "Mutual NDA · Acme × Northwind", ip: "104.220.18.6",  ua: "Safari 17 · iOS 17.4" },
  { ts: "May 27, 14:25:09", actor: { name: "system", system: true, colorIdx: 3 },           action: "document_completed", doc: "Mutual NDA · Acme × Northwind", ip: "—",             ua: "ESign backend" },
  { ts: "May 27, 13:58:27", actor: { name: "Sarah Chen", colorIdx: 1 },                     action: "document_created",   doc: "Vendor MSA · Brightway Print",  ip: "98.207.61.4",   ua: "Chrome 124 · Win 11" },
  { ts: "May 27, 13:59:13", actor: { name: "Sarah Chen", colorIdx: 1 },                     action: "document_sent",      doc: "Vendor MSA · Brightway Print",  ip: "98.207.61.4",   ua: "Chrome 124 · Win 11" },
  { ts: "May 27, 11:42:08", actor: { name: "mateo@brightway.print", signer: true, colorIdx: 3 }, action: "document_viewed", doc: "Vendor MSA · Brightway Print", ip: "67.182.91.117", ua: "Firefox 125 · Win 11" },
  { ts: "May 27, 11:44:51", actor: { name: "mateo@brightway.print", signer: true, colorIdx: 3 }, action: "document_declined", doc: "Vendor MSA · Brightway Print", ip: "67.182.91.117", ua: "Firefox 125 · Win 11" },
  { ts: "May 27, 10:33:19", actor: { name: "Mira Okonkwo", colorIdx: 2 },                   action: "document_created",   doc: "Q1 Contractor Onboarding · Caleb Mwangi", ip: "73.18.244.91", ua: "Chrome 124 · macOS 14.5" },
  { ts: "May 27, 10:35:02", actor: { name: "Mira Okonkwo", colorIdx: 2 },                   action: "document_sent",      doc: "Q1 Contractor Onboarding · Caleb Mwangi", ip: "73.18.244.91", ua: "Chrome 124 · macOS 14.5" },
  { ts: "May 27, 10:48:14", actor: { name: "caleb.m@northbeam.io", signer: true, colorIdx: 6 }, action: "document_viewed", doc: "Q1 Contractor Onboarding · Caleb Mwangi", ip: "192.168.4.21", ua: "Chrome 124 · macOS 14.5" },
];

const AUDIT_COLS = {
  template: "180px minmax(180px, 1.2fr) 180px minmax(220px, 1.4fr) 130px minmax(180px, 1fr)",
  labels:   ["Timestamp", "Actor", "Action", "Document", "IP", "User-Agent"],
};

Object.assign(window, {
  ADMIN_SECTIONS, AdminSubNav, AdminLayout,
  RoleBadge, UserStatus, ActionBadge,
  SettingsCard, SwitchRow, RadioRow, Select, Textarea,
  USERS, USER_COLS, AUDIT, AUDIT_COLS,
});
