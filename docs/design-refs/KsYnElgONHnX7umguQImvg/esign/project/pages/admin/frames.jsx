// =============================================================
// 09 — Admin · frames + annotations
// =============================================================

// ============ Page header for admin (lives inside the right pane, not full-bleed) ============
function AdminPageHeader({ title, subtitle, actions }) {
  return (
    <div style={{
      padding: "28px 32px 18px",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
    }}>
      <div>
        <h2 style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 24,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          color: "var(--color-ink)",
        }}>{title}</h2>
        {subtitle && (
          <p style={{
            margin: "4px 0 0",
            fontFamily: "var(--font-sans)",
            fontSize: 13.5,
            color: "var(--color-ink-subtle)",
          }}>{subtitle}</p>
        )}
      </div>
      {actions && <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>{actions}</div>}
    </div>
  );
}

// ============ Search input (toolbar) ============
function ToolbarSearch({ placeholder = "Search…", width = 320, value = "" }) {
  return (
    <div style={{
      width,
      display: "flex",
      alignItems: "center",
      gap: 9,
      height: 36,
      padding: "0 12px",
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
    }}>
      {I("search", 15, "var(--color-ink-subtle)")}
      <span style={{
        flex: 1,
        fontFamily: "var(--font-sans)",
        fontSize: 13.5,
        color: value ? "var(--color-ink)" : "var(--color-ink-faint)",
      }}>{value || placeholder}</span>
    </div>
  );
}

// =============================================================
// FRAME 1 — User Management
// =============================================================
function UsersFrame() {
  return (
    <AdminLayout section="Users">
      <AdminPageHeader
        title="Users"
        subtitle="10 of 25 seats used. Admins can invite, change roles, and suspend access."
        actions={
          <Button icon="user-plus">Invite User</Button>
        }
      />

      {/* Toolbar */}
      <div style={{
        padding: "0 32px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <ToolbarSearch placeholder="Search by name or email…" />
        <DropdownTrigger label="All roles" icon="shield" />
        <DropdownTrigger label="Active / Suspended" icon="circle" />
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-subtle)",
        }}>
          <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>10</span> users
        </span>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "0 32px 32px" }}>
        <Table cols={USER_COLS}>
          {USERS.map((u, i) => (
            <TableRow
              key={i}
              cols={USER_COLS}
              last={i === USERS.length - 1}
            >
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                <div style={{
                  width: 32, height: 32,
                  borderRadius: 999,
                  background: SIGNER_COLORS[u.colorIdx % SIGNER_COLORS.length],
                  color: "var(--color-ink-inverse)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                }}>{u.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</div>
                <div style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: "var(--color-ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {u.name}
                  {i === 0 && <span style={{
                    marginLeft: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    color: "var(--color-ink-faint)",
                    fontWeight: 500,
                  }}>you</span>}
                </div>
              </div>
              {/* Email */}
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-ink-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>{u.email}</div>
              {/* Role */}
              <div><RoleBadge role={u.role} /></div>
              {/* Status */}
              <div><UserStatus status={u.status} /></div>
              {/* Last active */}
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-ink-muted)",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}>{u.last}</div>
              {/* Action */}
              <RowKebab />
            </TableRow>
          ))}
        </Table>
      </div>
    </AdminLayout>
  );
}

// =============================================================
// FRAME 2 — Audit Log
// =============================================================
function AuditLogFrame() {
  return (
    <AdminLayout section="Audit Log">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Every action — by team members and signers — for compliance and forensics."
        actions={
          <Button variant="secondary" icon="download">Export CSV</Button>
        }
      />

      {/* Toolbar — date range + filters */}
      <div style={{
        padding: "0 32px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
      }}>
        <DateRangeChip />
        <DropdownTrigger label="All actors" icon="user" />
        <DropdownTrigger label="8 action types" icon="filter" />
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-subtle)",
        }}>
          <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>1,284</span> events
        </span>
      </div>

      <div style={{ flex: 1, overflow: "auto" }}>
        <Table cols={AUDIT_COLS}>
          {AUDIT.map((row, i) => (
            <TableRow
              key={i}
              cols={AUDIT_COLS}
              last={i === AUDIT.length - 1}
            >
              {/* Timestamp */}
              <div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--color-ink)",
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}>{row.ts}</div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10.5,
                  color: "var(--color-ink-faint)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginTop: 1,
                }}>UTC</div>
              </div>
              {/* Actor */}
              <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
                <div style={{
                  width: 24, height: 24,
                  borderRadius: 999,
                  background: row.actor.system ? "var(--color-surface-sunken)" : SIGNER_COLORS[row.actor.colorIdx % SIGNER_COLORS.length],
                  color: row.actor.system ? "var(--color-ink-subtle)" : "var(--color-ink-inverse)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-sans)",
                  fontSize: 9.5,
                  fontWeight: 600,
                  flexShrink: 0,
                  border: row.actor.system ? "1px solid var(--color-border)" : "none",
                }}>
                  {row.actor.system
                    ? I("cpu", 12, "currentColor")
                    : row.actor.signer
                      ? row.actor.name[0].toUpperCase()
                      : row.actor.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: row.actor.signer ? "var(--font-mono)" : "var(--font-sans)",
                    fontSize: row.actor.signer ? 12 : 13,
                    fontWeight: row.actor.signer ? 400 : 500,
                    color: "var(--color-ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{row.actor.name}</div>
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    color: "var(--color-ink-faint)",
                    marginTop: 1,
                  }}>{row.actor.system ? "System" : row.actor.signer ? "Signer" : "Team member"}</div>
                </div>
              </div>
              {/* Action */}
              <div><ActionBadge action={row.action} /></div>
              {/* Document */}
              <a href="#" style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-ink)",
                textDecoration: "none",
                borderBottom: "1px dashed var(--color-border-strong)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline-block",
                maxWidth: "100%",
              }}>{row.doc}</a>
              {/* IP */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: row.ip === "—" ? "var(--color-ink-faint)" : "var(--color-ink-muted)",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}>{row.ip}</div>
              {/* User-Agent (truncated) */}
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12.5,
                color: "var(--color-ink-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                position: "relative",
              }} title={row.ua}>
                {row.ua}
                {/* tooltip indicator */}
                {i === 2 && <UATooltip text={row.ua} />}
              </div>
            </TableRow>
          ))}
        </Table>
        <Pagination from={1} to={14} total={1284} page={1} totalPages={92} />
      </div>
    </AdminLayout>
  );
}

// ============ DateRangeChip — toolbar date-range trigger ============
function DateRangeChip() {
  return (
    <button style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      height: 36,
      padding: "0 12px",
      background: "var(--color-surface)",
      color: "var(--color-ink)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-sans)",
      fontSize: 13.5,
      fontWeight: 500,
      cursor: "pointer",
    }}>
      {I("calendar", 14, "var(--color-ink-subtle)")}
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>May 20 → May 27, 2026</span>
      {I("chevron-down", 14, "var(--color-ink-subtle)")}
    </button>
  );
}

// ============ UA Tooltip (shown on one row to communicate the hover affordance) ============
function UATooltip({ text }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "calc(100% + 8px)",
      left: 0,
      zIndex: 5,
      padding: "8px 10px",
      background: "var(--color-ink)",
      color: "var(--color-ink-inverse)",
      borderRadius: "var(--radius-sm)",
      fontFamily: "var(--font-mono)",
      fontSize: 11.5,
      fontWeight: 400,
      whiteSpace: "nowrap",
      boxShadow: "var(--shadow-2)",
      pointerEvents: "none",
    }}>
      {text}
      <span style={{
        position: "absolute",
        bottom: -3,
        left: 14,
        width: 6, height: 6,
        background: "var(--color-ink)",
        transform: "rotate(45deg)",
      }} />
    </div>
  );
}

// =============================================================
// FRAME 3 — Account Settings · General
// =============================================================
function GeneralSettingsFrame() {
  return (
    <AdminLayout section="General">
      <div style={{ flex: 1, overflow: "auto" }}>
        <AdminPageHeader
          title="General"
          subtitle="Workspace identity, defaults, and team-wide preferences."
        />

        <div style={{
          padding: "0 32px 40px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxWidth: 820,
        }}>
          {/* Organization */}
          <SettingsCard
            title="Organization"
            description="Used in document footers, emails, and the audit certificate."
            action={<Button size="sm">Save</Button>}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Organization name">
                <Input value="Northbeam, Inc." state="filled" />
              </Field>
              <Field label="Organization domain" hint="Verified · read-only">
                <Input
                  value="northbeam.io"
                  state="filled"
                  trailing={I("check-circle-2", 14, "var(--color-success-strong)")}
                />
              </Field>
              <Field label="Time zone">
                <Select value="(UTC−07:00) Pacific Time — Los Angeles" icon="globe" />
              </Field>
              <Field label="Default language">
                <Select value="English (US)" icon="languages" />
              </Field>
            </div>
          </SettingsCard>

          {/* Notifications */}
          <SettingsCard
            title="Notifications"
            description="Emails Brijal receives. Other team members manage their own under Profile."
          >
            <SwitchRow
              title="Email me when a document is signed"
              sub="Sent the moment all signers have completed."
              checked={true}
            />
            <SwitchRow
              title="Email me when a document is declined"
              sub="Includes the reason the signer provided."
              checked={true}
            />
            <SwitchRow
              title="Daily digest at 9am"
              sub="One email per workday summarizing pending sends."
              checked={false}
              last
            />
          </SettingsCard>

          {/* Security */}
          <SettingsCard
            title="Security"
            description="Account-wide controls. Some changes require re-authentication."
            action={<Button size="sm" variant="secondary" icon="key-round">Manage SSO</Button>}
          >
            <SwitchRow
              title="Require 2FA for all team members"
              sub="New users will be required to enroll at first sign-in."
              checked={true}
            />
            <SwitchRow
              title="Auto-logout after 30 minutes of inactivity"
              sub="Recommended for shared workstations."
              checked={false}
              last
            />
          </SettingsCard>

          {/* Data Retention */}
          <SettingsCard
            title="Data retention"
            description="How long signed PDFs and audit certificates stay in your workspace."
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <RadioRow label="1 year"      sub="Minimum for most US states." />
              <RadioRow label="3 years"     sub="Default for new workspaces." selected />
              <RadioRow label="7 years"     sub="IRS / SOX compliance." />
              <RadioRow label="Indefinitely" sub="No automatic deletion." last />
            </div>
            <div style={{
              marginTop: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              background: "var(--color-warning-soft)",
              border: "1px solid oklch(0.86 0.10 80)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              color: "var(--color-warning-strong)",
            }}>
              {I("alert-triangle", 14, "currentColor")}
              Shortening retention will permanently delete documents older than the new window after 14 days.
            </div>
          </SettingsCard>
        </div>
      </div>
    </AdminLayout>
  );
}

// =============================================================
// FRAME 4 — Branding / White-label
// =============================================================
function BrandingFrame() {
  return (
    <AdminLayout section="Branding">
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <div style={{ flex: 1, overflow: "auto", paddingBottom: 80 }}>
          <AdminPageHeader
            title="Branding"
            subtitle="Your logo and colors on every email, signing page, and audit certificate."
          />

          <div style={{
            padding: "0 32px 32px",
            display: "grid",
            gridTemplateColumns: "minmax(380px, 1fr) minmax(380px, 1fr)",
            gap: 24,
          }}>
            {/* Left — controls */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <SettingsCard title="Logo" description="PNG or SVG with transparent background. Used on signing pages and email headers.">
                <BrandDropZone
                  width={240} height={120}
                  filled={{ name: "northbeam-logo.svg", size: "8.4 KB" }}
                />
              </SettingsCard>

              <SettingsCard title="Colors" description="Applied to buttons, links, and signer field tints across all surfaces.">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Primary">
                    <ColorInput swatch="#D97757" value="#D97757" />
                  </Field>
                  <Field label="Accent">
                    <ColorInput swatch="#2A6FDB" value="#2A6FDB" />
                  </Field>
                </div>
              </SettingsCard>

              <SettingsCard title="Email" description="What recipients see in their inbox.">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Field label="Email header image" hint="Optional · 1200×240 recommended">
                    <BrandDropZone
                      width="100%" height={64}
                      filled={{ name: "header-2026.png", size: "112 KB" }}
                      compact
                    />
                  </Field>
                  <Field label="Sender 'from' name">
                    <Input value="Northbeam" state="filled" />
                  </Field>
                </div>
              </SettingsCard>

              <SettingsCard title="Custom subdomain" description="Where signers land — replaces app.esign.app.">
                <Field label="Subdomain">
                  <Input value="northbeam" state="filled" trailing={
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12.5,
                      color: "var(--color-ink-subtle)",
                      paddingLeft: 4,
                    }}>.esign.app</span>
                  } />
                </Field>
              </SettingsCard>
            </div>

            {/* Right — live preview */}
            <div style={{ position: "sticky", top: 0, alignSelf: "start" }}>
              <SettingsCard
                title="Live preview"
                description="What your signers will see."
                action={
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "2px 8px",
                    background: "var(--color-success-soft)",
                    color: "var(--color-success-strong)",
                    borderRadius: 999,
                    fontFamily: "var(--font-sans)",
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-success)" }} />
                    Live
                  </div>
                }
              >
                <BrandPreview />
              </SettingsCard>
            </div>
          </div>
        </div>

        {/* Sticky save bar */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          padding: "12px 32px",
          background: "color-mix(in srgb, var(--color-paper) 92%, transparent)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-warning-strong)",
            fontWeight: 500,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: "var(--color-warning)" }} />
            3 unsaved changes
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="ghost">Discard</Button>
            <Button icon="check">Save Changes</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// ============ BrandDropZone — Logo / image upload with filled state ============
function BrandDropZone({ width = 240, height = 120, filled, compact = false }) {
  if (filled) {
    return (
      <div style={{
        width, height,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: compact ? "0 12px" : "10px 14px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
      }}>
        {/* mini logo glyph */}
        <div style={{
          width: compact ? 32 : 60, height: compact ? 32 : 60,
          flexShrink: 0,
          background: "var(--color-ink)",
          color: "var(--color-paper)",
          borderRadius: "var(--radius-sm)",
          display: "grid",
          placeItems: "center",
        }}>
          <NorthbeamMark size={compact ? 18 : 32} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>{filled.name}</div>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-ink-subtle)",
            marginTop: 1,
          }}>{filled.size}</div>
        </div>
        <button style={{
          background: "transparent",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          padding: "5px 10px",
          fontFamily: "var(--font-sans)",
          fontSize: 12.5,
          fontWeight: 500,
          color: "var(--color-ink-muted)",
          cursor: "pointer",
        }}>Replace</button>
      </div>
    );
  }
  return (
    <div style={{
      width, height,
      border: "1.5px dashed var(--color-border-strong)",
      borderRadius: "var(--radius-sm)",
      background: "var(--color-surface)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      color: "var(--color-ink-subtle)",
    }}>
      {I("upload-cloud", 22, "currentColor")}
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--color-ink-muted)" }}>
        Drop file or <span style={{ color: "var(--color-brand-strong)", fontWeight: 500 }}>browse</span>
      </div>
    </div>
  );
}

// Small bespoke mark — a stylized "N" arrow
function NorthbeamMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 19V5L19 19V5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ============ ColorInput — swatch + hex Input ============
function ColorInput({ swatch, value }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 0,
      height: 40,
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-sm)",
      overflow: "hidden",
    }}>
      <div style={{
        width: 40, height: "100%",
        background: swatch,
        borderRight: "1px solid var(--color-border)",
        position: "relative",
      }}>
        <span style={{
          position: "absolute",
          bottom: 3, right: 3,
          width: 14, height: 14,
          borderRadius: 3,
          background: "color-mix(in srgb, var(--color-paper) 80%, transparent)",
          display: "grid",
          placeItems: "center",
        }}>{I("pipette", 9, "var(--color-ink-muted)")}</span>
      </div>
      <span style={{
        flex: 1,
        padding: "0 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        color: "var(--color-ink)",
        textTransform: "uppercase",
      }}>{value}</span>
    </div>
  );
}

// ============ BrandPreview — mini signing page mockup ============
function BrandPreview() {
  const brand = "#D97757";
  return (
    <div style={{
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      border: "1px solid var(--color-border)",
      background: "var(--color-surface-sunken)",
    }}>
      {/* email header bar (white-labelled) */}
      <div style={{
        height: 56,
        background: "var(--color-ink)",
        color: "var(--color-paper)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 18px",
      }}>
        <NorthbeamMark size={22} />
        <span style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: 18,
          fontWeight: 500,
        }}>Northbeam</span>
        <div style={{ flex: 1 }} />
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11.5,
          color: "color-mix(in srgb, var(--color-paper) 60%, transparent)",
        }}>secure signing</span>
      </div>

      {/* "envelope" — letter from sender */}
      <div style={{
        padding: "24px 22px 22px",
        background: "var(--color-surface-raised)",
      }}>
        <div style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          color: "var(--color-ink-subtle)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 600,
          marginBottom: 6,
        }}>Document for review</div>
        <h4 style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 500,
          fontStyle: "italic",
          color: "var(--color-ink)",
          letterSpacing: "-0.01em",
        }}>Mutual NDA — Acme × Northbeam</h4>
        <p style={{
          margin: "10px 0 16px",
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
          lineHeight: 1.55,
        }}>
          Hi Elena, here's the mutual NDA ahead of our Tuesday call. Two pages — should take under a minute.
        </p>

        {/* signature block stub */}
        <div style={{
          marginTop: 8,
          padding: "12px 14px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 30, height: 30,
            borderRadius: 999,
            background: "oklch(0.78 0.06 38)",
            color: "var(--color-ink-inverse)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
          }}>BP</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, fontWeight: 500, color: "var(--color-ink)" }}>
              Brijal Patel
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 11.5, color: "var(--color-ink-subtle)" }}>
              brijal@northbeam.io
            </div>
          </div>
        </div>

        {/* CTA using brand color */}
        <button style={{
          marginTop: 18,
          width: "100%",
          height: 44,
          background: brand,
          color: "white",
          border: "none",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: "var(--shadow-1)",
        }}>
          Review and sign
          {I("arrow-right", 16, "currentColor")}
        </button>

        <div style={{
          marginTop: 14,
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          color: "var(--color-ink-faint)",
          textAlign: "center",
        }}>
          Secured by ESign · northbeam.esign.app
        </div>
      </div>
    </div>
  );
}

// =============================================================
// ANNOTATIONS
// =============================================================

// ---------- Invite User Dialog (md) ----------
function InviteUserDialogAnno() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-ink-subtle)",
      }}>Dialog · md · Invite User</div>

      <div style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        background: "oklch(0.21 0.018 60 / 0.10)",
        borderRadius: "var(--radius-md)",
        padding: 24,
      }}>
        <div style={{
          width: 520,
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-3)",
          overflow: "hidden",
        }}>
          <DialogHeader
            title="Invite User"
            description="They'll get an email with a sign-in link. Seats are billed monthly."
          />
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Name" required>
                  <Input placeholder="Jamie Liu" />
                </Field>
                <Field label="Email" required>
                  <Input icon="mail" placeholder="jamie@northbeam.io" />
                </Field>
              </div>
              <Field label="Role" required hint="You can change this later.">
                <Select value="Sender — create and send documents" icon="shield" />
              </Field>
              <Field label="Welcome note" hint="Optional · added to the invite email">
                <Textarea
                  value="Hey Jamie — adding you so you can send out the Q3 vendor renewals. Holler if anything's unclear. — Brijal"
                  rows={3}
                />
              </Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button icon="send">Send Invite</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

// ---------- Success Toast ----------
function BrandingToastAnno() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-ink-subtle)",
      }}>Toast · success · branding updated</div>

      <div style={{
        flex: 1,
        background: "oklch(0.21 0.018 60 / 0.10)",
        borderRadius: "var(--radius-md)",
        padding: 24,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}>
        <div style={{ width: 380 }}>
          <Toast
            variant="success"
            title="Branding updated"
            body="Changes are live across all signing pages and emails."
          />
        </div>
      </div>
    </div>
  );
}

// ---------- Destructive Confirm Dialog (sm) ----------
function DestructiveConfirmAnno() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-ink-subtle)",
      }}>Dialog · sm · destructive confirm (retention shortened)</div>

      <div style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        background: "oklch(0.21 0.018 60 / 0.10)",
        borderRadius: "var(--radius-md)",
        padding: 24,
      }}>
        <div style={{
          width: 420,
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-3)",
          overflow: "hidden",
        }}>
          <div style={{ padding: "22px 24px 14px", display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{
              width: 36, height: 36,
              borderRadius: 999,
              background: "var(--color-danger-soft)",
              color: "var(--color-danger-strong)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}>{I("alert-triangle", 18, "currentColor")}</div>
            <div>
              <h3 style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-ink)",
                letterSpacing: "-0.01em",
              }}>Are you sure?</h3>
              <p style={{
                margin: "6px 0 0",
                fontFamily: "var(--font-sans)",
                fontSize: 13.5,
                color: "var(--color-ink-muted)",
                lineHeight: 1.5,
              }}>
                Shortening retention to <strong style={{ color: "var(--color-ink)" }}>1 year</strong> will permanently delete
                {" "}<strong style={{ color: "var(--color-ink)" }}>184 documents</strong> after 14 days. This can't be undone.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive" icon="trash-2">Yes, shorten retention</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AdminPageHeader, ToolbarSearch,
  UsersFrame, AuditLogFrame, GeneralSettingsFrame, BrandingFrame,
  InviteUserDialogAnno, BrandingToastAnno, DestructiveConfirmAnno,
});
