// =============================================================
// 05 — Editor: shell + sidebar + canvas atoms.
// Reuses Button / Input / Avatar / Toast / TagChip / Wordmark / Dialog
// / Switch primitives from earlier atom files.
// =============================================================

// ============ Field types (13) ============
const FIELD_TYPES = [
  { id: "signature",       label: "Signature",   icon: "pen-tool" },
  { id: "initials",        label: "Initials",    icon: "case-sensitive" },
  { id: "name",            label: "Name",        icon: "user" },
  { id: "email",           label: "Email",       icon: "mail" },
  { id: "phone",           label: "Phone",       icon: "phone" },
  { id: "company",         label: "Company",     icon: "building-2" },
  { id: "text",            label: "Text",        icon: "text-cursor-input" },
  { id: "multiline_text",  label: "Multiline",   icon: "align-left" },
  { id: "checkbox",        label: "Checkbox",    icon: "square-check" },
  { id: "radio",           label: "Radio",       icon: "circle-dot" },
  { id: "selection",       label: "Selection",   icon: "list" },
  { id: "date",            label: "Date",        icon: "calendar" },
  { id: "strikethrough",   label: "Strikethrough", icon: "strikethrough" },
];

// ============ Switch ============
function Switch({ checked = false, size = "md" }) {
  const w = size === "sm" ? 30 : 34;
  const h = size === "sm" ? 18 : 20;
  const knob = h - 4;
  return (
    <span style={{
      width: w, height: h,
      borderRadius: 999,
      background: checked ? "var(--color-brand)" : "var(--color-surface-sunken)",
      border: checked ? "1px solid var(--color-brand)" : "1px solid var(--color-border-strong)",
      position: "relative",
      display: "inline-block",
      transition: "background var(--dur-1) var(--ease-out)",
      cursor: "pointer",
      flexShrink: 0,
    }}>
      <span style={{
        position: "absolute",
        top: 1, left: checked ? w - knob - 3 : 1,
        width: knob, height: knob,
        borderRadius: 999,
        background: "var(--color-surface-raised)",
        boxShadow: "0 1px 2px oklch(0.2 0.02 60 / 0.25)",
        transition: "left var(--dur-1) var(--ease-out)",
      }} />
    </span>
  );
}

// ============ Signer Color Chip ============
// A colored dot/disc that identifies a signer (per-recipient color).
function SignerColorChip({ colorIdx = 0, size = 18, label = null }) {
  const color = SIGNER_COLORS[colorIdx % SIGNER_COLORS.length];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      flexShrink: 0,
    }}>
      <span style={{
        width: size, height: size,
        borderRadius: 999,
        background: color,
        border: "2px solid var(--color-surface)",
        boxShadow: `0 0 0 1.5px ${color}`,
        flexShrink: 0,
      }} />
      {label && <span style={{
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: 500,
        color: "var(--color-ink-muted)",
      }}>{label}</span>}
    </span>
  );
}

// ============ Sidebar Section ============
function SidebarSection({ title, expanded = true, count = null, action = null, children }) {
  return (
    <section style={{
      borderBottom: "1px solid var(--color-border-subtle)",
      padding: "12px 0",
    }}>
      <header style={{
        padding: "0 16px 8px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {I(expanded ? "chevron-down" : "chevron-right", 14, "var(--color-ink-subtle)")}
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-ink-subtle)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>{title}</span>
          {count !== null && <span style={{
            background: "var(--color-surface-sunken)",
            color: "var(--color-ink-muted)",
            padding: "1px 6px",
            borderRadius: 999,
            fontFamily: "var(--font-sans)",
            fontSize: 10.5,
            fontWeight: 600,
          }}>{count}</span>}
        </div>
        {action}
      </header>
      {expanded && <div style={{ padding: "0 12px" }}>{children}</div>}
    </section>
  );
}

// ============ Signer Block (sidebar item) ============
function SignerBlock({ name, email, colorIdx, selected = false, collapsed = false, fieldCount = 0, onDelete = true }) {
  const color = SIGNER_COLORS[colorIdx % SIGNER_COLORS.length];
  return (
    <div style={{
      borderRadius: "var(--radius-sm)",
      border: selected ? "1px solid var(--color-brand)" : "1px solid var(--color-border-subtle)",
      background: selected ? "var(--color-brand-soft)" : "var(--color-surface)",
      marginBottom: 6,
      position: "relative",
      overflow: "hidden",
    }}>
      {selected && <div style={{
        position: "absolute",
        left: 0, top: 0, bottom: 0,
        width: 2,
        background: "var(--color-brand)",
      }} />}
      <div style={{
        padding: "9px 10px 9px 12px",
        display: "flex",
        alignItems: "center",
        gap: 9,
      }}>
        <SignerColorChip colorIdx={colorIdx} size={14} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{name}</div>
          {email && !collapsed && <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11.5,
            color: "var(--color-ink-subtle)",
            marginTop: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{email}</div>}
        </div>
        {fieldCount > 0 && <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: color,
          fontWeight: 600,
          background: "var(--color-surface-raised)",
          padding: "2px 6px",
          borderRadius: 999,
          border: `1px solid ${color}`,
        }}>{fieldCount}</span>}
        {onDelete && (
          <button style={{
            width: 22, height: 22,
            background: "transparent",
            border: "none",
            borderRadius: 4,
            color: "var(--color-ink-faint)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}>{I("x", 14, "currentColor")}</button>
        )}
      </div>
    </div>
  );
}

// ============ Field-Type Chip ============
function FieldTypeChip({ type, draggable = true, dragging = false }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 9px",
      background: "var(--color-surface)",
      border: dragging ? "1px solid var(--color-brand)" : "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      cursor: draggable ? "grab" : "default",
      boxShadow: dragging ? "var(--shadow-2)" : "none",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--color-ink)",
      minWidth: 0,
      transition: "all var(--dur-1) var(--ease-out)",
    }}>
      {I(type.icon, 14, "var(--color-ink-muted)", { flexShrink: 0 })}
      <span style={{
        flex: 1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontWeight: 500,
      }}>{type.label}</span>
      {draggable && I("grip-vertical", 12, "var(--color-ink-faint)", { flexShrink: 0 })}
    </div>
  );
}

// ============ Field-Type Chips grid (13 items, 2 cols) ============
function FieldTypeGrid() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 6,
      padding: "0 4px",
    }}>
      {FIELD_TYPES.map(t => <FieldTypeChip key={t.id} type={t} />)}
    </div>
  );
}

// ============ Placed Field (on the PDF canvas) ============
function PlacedField({ type, x, y, w = 160, h = 40, signerColorIdx = 0, selected = false, label = null }) {
  const color = SIGNER_COLORS[signerColorIdx % SIGNER_COLORS.length];
  const ft = FIELD_TYPES.find(f => f.id === type) || FIELD_TYPES[0];
  return (
    <div style={{
      position: "absolute",
      left: x, top: y,
      width: w, height: h,
      borderRadius: "var(--radius-xs)",
      border: selected ? `2px solid var(--color-brand)` : `1.5px dashed ${color}`,
      background: `color-mix(in oklch, ${color} 14%, var(--color-surface))`,
      boxShadow: selected ? "var(--shadow-focus)" : "none",
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 9px",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      color: color,
      fontWeight: 500,
      cursor: "move",
      overflow: "hidden",
    }}>
      {I(ft.icon, 13, color, { flexShrink: 0 })}
      <span style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}>{label || ft.label}</span>
      {/* resize handle */}
      <div style={{
        position: "absolute",
        right: -3, bottom: -3,
        width: 8, height: 8,
        background: selected ? "var(--color-brand)" : color,
        border: "1.5px solid var(--color-surface)",
        borderRadius: 2,
        opacity: selected ? 1 : 0.7,
      }} />
    </div>
  );
}

// ============ Field-action floating toolbar (above a selected field) ============
function FieldToolbar({ x, y }) {
  return (
    <div style={{
      position: "absolute",
      left: x, top: y - 44,
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "5px 7px",
      background: "var(--color-ink)",
      color: "var(--color-ink-inverse)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-2)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      whiteSpace: "nowrap",
      zIndex: 5,
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0 5px" }}>
        <Switch checked size="sm" />
        <span style={{ fontSize: 11.5 }}>Required</span>
      </span>
      <span style={{ width: 1, height: 16, background: "oklch(1 0 0 / 0.15)" }} />
      <button style={{
        width: 24, height: 24,
        background: "transparent",
        border: "none",
        borderRadius: 4,
        color: "var(--color-ink-inverse)",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        opacity: 0.85,
      }}>{I("copy", 14, "currentColor")}</button>
      <button style={{
        width: 24, height: 24,
        background: "transparent",
        border: "none",
        borderRadius: 4,
        color: "oklch(0.85 0.13 22)",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
      }}>{I("trash-2", 14, "currentColor")}</button>
      {/* arrow */}
      <div style={{
        position: "absolute",
        bottom: -5, left: 18,
        width: 10, height: 10,
        background: "var(--color-ink)",
        transform: "rotate(45deg)",
        zIndex: -1,
      }} />
    </div>
  );
}

// ============ PDF Page (placeholder document content) ============
function PdfPage({ width = 720, pageNum = 1, totalPages = 12, children, paragraphs = 5 }) {
  return (
    <div style={{
      width,
      aspectRatio: "8.5 / 11",
      background: "var(--color-surface-raised)",
      border: "1px solid var(--color-border)",
      borderRadius: 2,
      boxShadow: "var(--shadow-1)",
      padding: "48px 60px",
      position: "relative",
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

// Realistic-looking legal contract content (no real legalese — just placeholders).
function ContractPage1() {
  return (
    <div style={{ height: "100%" }}>
      <h1 style={{
        fontFamily: "var(--font-display)",
        fontSize: 26,
        fontWeight: 400,
        letterSpacing: "-0.02em",
        textAlign: "center",
        margin: "0 0 4px",
        color: "var(--color-ink)",
      }}>Service Agreement</h1>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        textAlign: "center",
        color: "var(--color-ink-subtle)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        marginBottom: 22,
      }}>Acme Holdings · 2026-Q1</div>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        This Service Agreement ("Agreement") is entered into as of the date last signed below
        between Acme Holdings, Inc. ("Company") and the undersigned counterparty ("Recipient")
        for the engagement of professional services described in Schedule A.
      </p>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        <strong style={{ color: "var(--color-ink)" }}>1. Scope.</strong> Recipient shall perform
        the services set forth in Schedule A in a professional and workmanlike manner, in accordance
        with the timelines and deliverables described therein.
      </p>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        <strong style={{ color: "var(--color-ink)" }}>2. Compensation.</strong> Company shall pay
        Recipient the fees described in Schedule B within thirty (30) days of receipt of each
        approved invoice.
      </p>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        <strong style={{ color: "var(--color-ink)" }}>3. Term.</strong> This Agreement shall commence
        on the Effective Date and continue until the services described in Schedule A are completed,
        unless earlier terminated as provided herein.
      </p>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        <strong style={{ color: "var(--color-ink)" }}>4. Confidentiality.</strong> Each party
        agrees to hold in confidence all proprietary information of the other party and to use
        such information solely for the purposes of this Agreement.
      </p>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        <strong style={{ color: "var(--color-ink)" }}>5. Governing law.</strong> This Agreement
        shall be governed by and construed in accordance with the laws of the State of California,
        without regard to its conflict-of-laws principles.
      </p>
      {/* Signature block (bottom) */}
      <div style={{ position: "absolute", left: 60, right: 60, bottom: 60 }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
        }}>
          <div>
            <div style={{
              borderTop: "1px solid var(--color-border-strong)",
              paddingTop: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--color-ink-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>Signature</div>
            <div style={{
              marginTop: 6,
              fontSize: 9,
              color: "var(--color-ink-subtle)",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>Date</div>
          </div>
          <div>
            <div style={{
              borderTop: "1px solid var(--color-border-strong)",
              paddingTop: 6,
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--color-ink-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>Counterparty signature</div>
            <div style={{
              marginTop: 6,
              fontSize: 9,
              color: "var(--color-ink-subtle)",
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>Date</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractPage2() {
  return (
    <div style={{ height: "100%" }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        color: "var(--color-ink-subtle)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        marginBottom: 18,
      }}>Schedule A · Scope of work</div>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        Recipient will deliver the following work product to the Company:
      </p>
      <ul style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", paddingLeft: 18, margin: "0 0 14px" }}>
        <li>Discovery interviews with up to twelve (12) named stakeholders.</li>
        <li>A written research synthesis of no fewer than fifteen (15) pages.</li>
        <li>Two (2) workshop sessions of no longer than ninety (90) minutes each.</li>
        <li>A final readout to the Company's executive team.</li>
      </ul>
      <p style={{ fontSize: 11, lineHeight: 1.7, color: "var(--color-ink-muted)", margin: "0 0 11px" }}>
        <strong style={{ color: "var(--color-ink)" }}>Counterparty acknowledgement.</strong>
        By signing below, Recipient affirms understanding of the scope and acceptance of the
        deliverables described above.
      </p>

      {/* Initials block (top right area for placed field) */}
      <div style={{ position: "absolute", right: 60, top: 220, fontSize: 9, color: "var(--color-ink-subtle)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Initial here</div>

      <div style={{ position: "absolute", left: 60, right: 60, bottom: 100 }}>
        <div style={{
          borderTop: "1px solid var(--color-border-strong)",
          paddingTop: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "var(--color-ink-subtle)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          width: 240,
        }}>Counterparty initials</div>
      </div>
    </div>
  );
}

// ============ Page indicator (floating top-right) ============
function PageIndicator({ page = 1, total = 12 }) {
  return (
    <div style={{
      position: "absolute",
      top: 16, right: 24,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 12px",
      background: "var(--color-surface-raised)",
      border: "1px solid var(--color-border)",
      borderRadius: 999,
      boxShadow: "var(--shadow-1)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--color-ink-muted)",
      zIndex: 4,
    }}>
      {I("file-text", 13, "var(--color-ink-subtle)")}
      <span>Page <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>{page}</strong> of {total}</span>
    </div>
  );
}

// ============ Zoom control (floating bottom-right) ============
function ZoomControl({ zoom = 100 }) {
  return (
    <div style={{
      position: "absolute",
      bottom: 16, right: 24,
      display: "flex",
      alignItems: "center",
      gap: 0,
      background: "var(--color-surface-raised)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      boxShadow: "var(--shadow-1)",
      overflow: "hidden",
      zIndex: 4,
    }}>
      <button style={{
        width: 32, height: 32,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--color-ink-muted)",
        display: "grid",
        placeItems: "center",
      }}>{I("minus", 14, "currentColor")}</button>
      <span style={{
        padding: "0 10px",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        color: "var(--color-ink)",
        fontWeight: 500,
        minWidth: 48,
        textAlign: "center",
      }}>{zoom}%</span>
      <button style={{
        width: 32, height: 32,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--color-ink-muted)",
        display: "grid",
        placeItems: "center",
      }}>{I("plus", 14, "currentColor")}</button>
    </div>
  );
}

// ============ Save status indicator (top action bar) ============
function SaveStatus({ status = "saved" }) {
  // status: saving | saved | error
  if (status === "saving") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-sans)", fontSize: 12.5,
        color: "var(--color-ink-muted)",
      }}>
        <span style={{
          width: 12, height: 12,
          border: "1.5px solid var(--color-border-strong)",
          borderTopColor: "var(--color-brand)",
          borderRadius: 999,
          animation: "paraph-spin 0.8s linear infinite",
          display: "inline-block",
        }} />
        Saving…
      </span>
    );
  }
  if (status === "error") {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontFamily: "var(--font-sans)", fontSize: 12.5,
        color: "var(--color-danger-strong)",
      }}>
        {I("alert-circle", 13, "var(--color-danger-strong)")}
        Couldn't save. <a href="#" style={{ color: "var(--color-danger-strong)", textDecoration: "underline", fontWeight: 500 }}>Retry</a>
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "var(--font-sans)", fontSize: 12.5,
      color: "var(--color-ink-subtle)",
    }}>
      {I("check", 13, "var(--color-success-strong)")}
      Saved
    </span>
  );
}

// inject spinner keyframes once
if (typeof document !== "undefined" && !document.getElementById("paraph-editor-anim")) {
  const s = document.createElement("style");
  s.id = "paraph-editor-anim";
  s.textContent = "@keyframes paraph-spin{to{transform:rotate(360deg)}}";
  document.head.appendChild(s);
}

// ============ Editor Top Bar (56h) ============
function EditorTopBar({ title, tags = [], rightExtras = null, saveStatus = null }) {
  return (
    <header style={{
      height: 56,
      background: "var(--color-paper)",
      borderBottom: "1px solid var(--color-border)",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      gap: 14,
      flexShrink: 0,
    }}>
      <button style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 10px 6px 8px",
        background: "transparent",
        border: "1px solid transparent",
        borderRadius: "var(--radius-sm)",
        color: "var(--color-ink-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        cursor: "pointer",
      }}>
        {I("arrow-left", 15, "currentColor")} Documents
      </button>
      <span style={{ width: 1, height: 20, background: "var(--color-border)" }} />

      {/* Inline-editable title */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "4px 8px",
        borderRadius: "var(--radius-sm)",
        cursor: "text",
        background: "transparent",
        border: "1px dashed transparent",
      }}>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          fontWeight: 500,
          color: "var(--color-ink)",
        }}>{title}</span>
        {I("pencil", 12, "var(--color-ink-faint)")}
      </div>

      {tags.length > 0 && (
        <div style={{ display: "flex", gap: 5 }}>
          {tags.map(t => <TagChip key={t}>{t}</TagChip>)}
        </div>
      )}

      <div style={{ flex: 1 }} />

      {saveStatus && (
        <>
          <SaveStatus status={saveStatus} />
          <span style={{ width: 1, height: 20, background: "var(--color-border)" }} />
        </>
      )}

      {rightExtras}
    </header>
  );
}

// ============ Tag input (compact) ============
function TagInput({ width = 200, placeholder = "Add tags…", tags = [] }) {
  return (
    <div style={{
      width,
      display: "flex",
      alignItems: "center",
      gap: 6,
      height: 36,
      padding: "0 10px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
    }}>
      {I("hash", 13, "var(--color-ink-subtle)")}
      {tags.length > 0 ? (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {tags.map(t => <TagChip key={t}>{t}</TagChip>)}
        </div>
      ) : (
        <span style={{
          flex: 1,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-faint)",
        }}>{placeholder}</span>
      )}
    </div>
  );
}

// ============ Editor Layout (top bar + sidebar + canvas) ============
function EditorLayout({ topBar, sidebar, canvas }) {
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
      {topBar}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <aside style={{
          width: 320,
          flexShrink: 0,
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-border)",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}>{sidebar}</aside>
        <section style={{
          flex: 1,
          background: "var(--color-surface-sunken)",
          position: "relative",
          overflow: "auto",
          backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}>{canvas}</section>
      </div>
    </div>
  );
}

// ============ Inline hint banner ============
function InlineHint({ children }) {
  return (
    <div style={{
      margin: "8px 4px 10px",
      padding: "9px 11px",
      background: "color-mix(in oklch, var(--color-ink-muted) 8%, transparent)",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: 11.5,
      color: "var(--color-ink-muted)",
      display: "flex",
      alignItems: "center",
      gap: 6,
      lineHeight: 1.4,
    }}>
      {I("lightbulb", 13, "var(--color-ink-subtle)", { flexShrink: 0 })}
      <span>{children}</span>
    </div>
  );
}

Object.assign(window, {
  FIELD_TYPES, Switch, SignerColorChip, SidebarSection, SignerBlock,
  FieldTypeChip, FieldTypeGrid, PlacedField, FieldToolbar,
  PdfPage, ContractPage1, ContractPage2, PageIndicator, ZoomControl,
  SaveStatus, EditorTopBar, TagInput, EditorLayout, InlineHint,
});
