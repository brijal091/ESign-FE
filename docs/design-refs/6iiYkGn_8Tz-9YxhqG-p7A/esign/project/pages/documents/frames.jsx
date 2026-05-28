// =============================================================
// 04 — Documents · frames + annotations
// =============================================================

// Cols template — Checkbox (40), Created (110), Document (1fr/min 320),
// Signers (210), Status (140), Activity (140), Tags (180), Action (40)
const DOC_COLS = {
  template: "40px 110px minmax(280px, 1fr) 210px 140px 140px 180px 40px",
  labels: ["_checkbox", "Created", "Document", "Signers", "Status", "Last activity", "Tags", ""],
};

// ============ Row checkbox / kebab ============
function RowCheckbox({ checked = false }) {
  return (
    <span style={{
      width: 16, height: 16,
      borderRadius: 4,
      border: checked ? "1px solid var(--color-brand)" : "1px solid var(--color-border-strong)",
      background: checked ? "var(--color-brand)" : "var(--color-surface)",
      display: "grid", placeItems: "center",
    }}>
      {checked && I("check", 11, "var(--color-ink-inverse)", { strokeWidth: 2.5 })}
    </span>
  );
}
function RowKebab() {
  return (
    <button style={{
      width: 28, height: 28,
      background: "transparent",
      border: "none",
      borderRadius: "var(--radius-sm)",
      color: "var(--color-ink-faint)",
      display: "grid",
      placeItems: "center",
      cursor: "pointer",
    }}>{I("more-horizontal", 17, "currentColor")}</button>
  );
}

// ============ Document data (12 rows · all 7 statuses) ============
const DOCS = [
  {
    name: "Mutual NDA · Acme × Northwind", meta: "3 pages · 2.4 MB",
    created: "Mar 12, 2026",
    signers: [{ initials: "EM", colorIdx: 0 }, { initials: "SC", colorIdx: 1 }],
    status: "completed", activity: "Signed 2h ago",
    tags: ["NDA", "Legal"],
  },
  {
    name: "Q1 Contractor Onboarding · Lin Park", meta: "5 pages · 480 KB",
    created: "Mar 11, 2026",
    signers: [{ initials: "LP", colorIdx: 2 }],
    status: "draft", activity: "Updated 3h ago",
    tags: ["HR", "Onboarding"],
  },
  {
    name: "Vendor MSA · Brightway Print", meta: "12 pages · 1.1 MB",
    created: "Mar 10, 2026",
    signers: [
      { initials: "MO", colorIdx: 3 }, { initials: "JC", colorIdx: 0 },
      { initials: "RT", colorIdx: 2 }, { initials: "DK", colorIdx: 1 },
    ],
    status: "sent", activity: "Sent yesterday",
    tags: ["MSA", "Vendor"],
  },
  {
    name: "Offer Letter · Caleb Mwangi", meta: "2 pages · 220 KB",
    created: "Mar 10, 2026",
    signers: [{ initials: "CM", colorIdx: 6 }],
    status: "viewed", activity: "Viewed 14m ago",
    tags: ["HR", "Offer"],
  },
  {
    name: "SOW #2026-014 · Lumen Studio", meta: "8 pages · 1.8 MB",
    created: "Mar 9, 2026",
    signers: [
      { initials: "PS", colorIdx: 4 }, { initials: "AB", colorIdx: 1 },
      { initials: "EM", colorIdx: 0 },
    ],
    status: "signed", activity: "1 of 3 signed",
    tags: ["SOW", "Design"],
  },
  {
    name: "Mutual NDA · Tessera × Folio", meta: "3 pages · 410 KB",
    created: "Mar 8, 2026",
    signers: [{ initials: "YD", colorIdx: 7 }, { initials: "SO", colorIdx: 2 }],
    status: "completed", activity: "Signed Mar 8",
    tags: ["NDA"],
  },
  {
    name: "Sales Order · Riverline Holdings", meta: "6 pages · 720 KB",
    created: "Mar 7, 2026",
    signers: [
      { initials: "DP", colorIdx: 1 }, { initials: "LH", colorIdx: 3 },
      { initials: "MK", colorIdx: 5 }, { initials: "+2", colorIdx: 0 },
    ],
    status: "sent", activity: "Sent 3d ago",
    tags: ["Sales"],
  },
  {
    name: "Equipment lease · Margate Co.", meta: "9 pages · 1.4 MB",
    created: "Mar 6, 2026",
    signers: [{ initials: "AB", colorIdx: 4 }, { initials: "JR", colorIdx: 1 }],
    status: "declined", activity: "Cancelled Mar 6",
    tags: ["Lease", "Finance"],
  },
  {
    name: "Q4 Renewal · Northbeam", meta: "4 pages · 380 KB",
    created: "Mar 5, 2026",
    signers: [{ initials: "BP", colorIdx: 0 }, { initials: "GH", colorIdx: 6 }],
    status: "expired", activity: "Expired 2d ago",
    tags: ["Renewal"],
  },
  {
    name: "NDA · Folio × Brightway", meta: "2 pages · 180 KB",
    created: "Mar 4, 2026",
    signers: [{ initials: "SO", colorIdx: 2 }, { initials: "MO", colorIdx: 3 }],
    status: "viewed", activity: "Viewed 1d ago",
    tags: ["NDA"],
  },
  {
    name: "Photography release · Sana Ortiz", meta: "1 page · 90 KB",
    created: "Mar 3, 2026",
    signers: [{ initials: "SO", colorIdx: 2 }, { initials: "BP", colorIdx: 0 }],
    status: "signed", activity: "1 of 2 signed",
    tags: ["Release", "Brand"],
  },
  {
    name: "Office sublease · Tessera", meta: "11 pages · 1.9 MB",
    created: "Mar 1, 2026",
    signers: [
      { initials: "YD", colorIdx: 7 }, { initials: "PS", colorIdx: 4 },
      { initials: "LP", colorIdx: 2 },
    ],
    status: "draft", activity: "Updated yesterday",
    tags: ["Lease", "Office"],
  },
];

// ============ Toolbar ============
function Toolbar({ search = "" }) {
  return (
    <div style={{
      padding: "0 32px 18px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    }}>
      <div style={{
        width: 320,
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
          color: search ? "var(--color-ink)" : "var(--color-ink-faint)",
        }}>{search || "Search documents…"}</span>
      </div>

      <DropdownTrigger label="All status" />
      <DropdownTrigger label="All senders" />
      <DropdownTrigger label="Date range" icon="calendar" />

      <div style={{ flex: 1 }} />

      <div style={{
        display: "flex",
        padding: 2,
        background: "var(--color-surface-sunken)",
        borderRadius: "var(--radius-sm)",
        gap: 1,
      }}>
        <IconButton icon="rows-3" size={32} variant="ghost" active title="List view" />
        <IconButton icon="layout-grid" size={32} variant="ghost" title="Grid view" />
      </div>
    </div>
  );
}

// ============ FRAME 1 — Populated list ============
function DocumentsPopulatedFrame() {
  return (
    <AppShell active="Documents">
      <PageHeader
        title="Documents"
        actions={
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" icon="folder" size="md">New Folder</Button>
            <Button icon="upload" size="md">Upload a PDF &amp; Sign</Button>
          </div>
        }
      />
      <Toolbar />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Table cols={DOC_COLS}>
          {DOCS.map((d, i) => (
            <TableRow
              key={i}
              cols={DOC_COLS}
              last={i === DOCS.length - 1}
              strike={d.status === "declined"}
              selected={i === 4 /* highlight one selected row */}
            >
              <RowCheckbox checked={i === 4} />
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-ink-muted)",
                fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}>{d.created.replace(", 2026", "")}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <PdfThumb />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: d.status === "declined" ? "var(--color-ink-subtle)" : "var(--color-ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{d.name}</div>
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--color-ink-subtle)",
                    marginTop: 2,
                    textDecoration: "none",
                  }}>{d.meta}</div>
                </div>
              </div>
              <AvatarStack signers={d.signers} />
              <StatusBadge status={d.status} />
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-ink-muted)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>{d.activity}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {d.tags.map(t => <TagChip key={t}>{t}</TagChip>)}
              </div>
              <RowKebab />
            </TableRow>
          ))}
        </Table>
        <Pagination from={1} to={12} total={47} page={1} totalPages={4} />
      </div>
    </AppShell>
  );
}

// ============ FRAME 2 — Empty ============
function DocumentsEmptyFrame() {
  return (
    <AppShell active="Documents">
      <PageHeader
        title="Documents"
        actions={<Button icon="upload">Upload a PDF &amp; Sign</Button>}
      />
      <div style={{
        flex: 1,
        margin: "0 32px 32px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <EmptyState
          icon={<PaperStack />}
          title="No documents yet"
          body="Upload a PDF to start collecting signatures. Drop one in, place your fields, and send."
          action={
            <div style={{ display: "flex", gap: 10 }}>
              <Button icon="upload">Upload a PDF &amp; Sign</Button>
              <Button variant="secondary" icon="bookmark">Use a template</Button>
            </div>
          }
        />
      </div>
    </AppShell>
  );
}

// ============ FRAME 3 — Upload Dialog ============
function UploadDialogFrame({ selected = false } = {}) {
  return (
    <div style={{
      width: "100%", height: "100%",
      // page behind (slightly visible)
      background: "var(--color-paper)",
      position: "relative",
      fontFamily: "var(--font-sans)",
    }}>
      {/* faint page behind */}
      <div style={{ opacity: 0.5, pointerEvents: "none", height: "100%" }}>
        <AppShell active="Documents">
          <PageHeader title="Documents" actions={<Button icon="upload">Upload a PDF &amp; Sign</Button>} />
          <Toolbar />
        </AppShell>
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "oklch(0.21 0.018 60 / 0.45)",
        backdropFilter: "blur(2px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}>
        <div style={{
          width: 560,
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-3)",
          overflow: "hidden",
        }}>
          <DialogHeader
            title="Upload a PDF &amp; Sign"
            description="Drag and drop a file here, or click to browse."
          />
          <DialogBody>
            {selected ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 18px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface)",
              }}>
                <PdfThumb />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-ink)",
                  }}>Mutual_NDA_Acme_Northwind_2026Q1.pdf</div>
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--color-ink-subtle)",
                    marginTop: 2,
                  }}>3 pages · 2.4 MB</div>
                  {/* progress */}
                  <div style={{
                    marginTop: 9,
                    height: 4,
                    background: "var(--color-surface-sunken)",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: "100%",
                      height: "100%",
                      background: "var(--color-success)",
                      borderRadius: 999,
                    }} />
                  </div>
                  <div style={{
                    marginTop: 5,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--color-success-strong)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}>{I("check-circle-2", 13, "var(--color-success-strong)")} Upload complete</div>
                </div>
                <button style={{
                  width: 28, height: 28,
                  background: "transparent",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  color: "var(--color-ink-subtle)",
                  display: "grid",
                  placeItems: "center",
                }}>{I("x", 16, "currentColor")}</button>
              </div>
            ) : (
              <div style={{
                height: 200,
                border: "1.5px dashed var(--color-border-strong)",
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}>
                <div style={{
                  width: 44, height: 44,
                  borderRadius: 999,
                  background: "var(--color-brand-soft)",
                  color: "var(--color-brand-strong)",
                  display: "grid",
                  placeItems: "center",
                }}>{I("upload-cloud", 22, "currentColor")}</div>
                <div style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--color-ink)",
                }}>Drag and drop your PDF here</div>
                <div style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  color: "var(--color-ink-muted)",
                }}>
                  or{" "}
                  <a href="#" style={{ color: "var(--color-brand)", fontWeight: 500, textDecoration: "none" }}>
                    click to browse files
                  </a>
                </div>
              </div>
            )}

            <div style={{
              marginTop: 12,
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              color: "var(--color-ink-subtle)",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}>
              {I("info", 13, "var(--color-ink-subtle)")}
              Maximum file size 25 MB. Only PDF files are supported.
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button disabled={!selected} icon={selected ? "arrow-right" : null}>Upload</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

// ============ FRAME 4 — Document detail drawer ============
function DocumentDrawerFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      position: "relative",
      fontFamily: "var(--font-sans)",
      overflow: "hidden",
    }}>
      {/* faded page behind */}
      <div style={{ opacity: 0.5, pointerEvents: "none", height: "100%" }}>
        <AppShell active="Documents">
          <PageHeader title="Documents" actions={<Button icon="upload">Upload a PDF &amp; Sign</Button>} />
          <Toolbar />
        </AppShell>
      </div>
      {/* scrim */}
      <div style={{
        position: "absolute", inset: 0,
        background: "oklch(0.21 0.018 60 / 0.30)",
      }} />
      {/* drawer */}
      <Drawer width={480}>
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--color-border-subtle)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-ink-subtle)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}>Document · DOC-2026-0312-MNDA</div>
              <h3 style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-ink)",
                letterSpacing: "-0.01em",
                padding: "2px 6px",
                marginLeft: -6,
                borderRadius: "var(--radius-sm)",
                cursor: "text",
                outline: "1px dashed transparent",
                lineHeight: 1.3,
              }}>Mutual NDA · Acme × Northwind</h3>
              <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                <StatusBadge status="completed" />
                <TagChip>NDA</TagChip>
                <TagChip>Legal</TagChip>
                <button style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "3px 8px",
                  border: "1px dashed var(--color-border-strong)",
                  background: "transparent",
                  borderRadius: 999,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--color-ink-subtle)",
                  cursor: "pointer",
                }}>
                  {I("plus", 12, "currentColor")} Tag
                </button>
              </div>
            </div>
            <IconButton icon="x" size={28} />
          </div>
        </div>

        <Tabs items={["Overview", "Activity", "Signers"]} active="Overview" />

        <div style={{ flex: 1, overflow: "auto", padding: "20px 24px" }}>
          <dl style={{ display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 10, columnGap: 16, margin: 0 }}>
            {[
              ["Filename", "Mutual_NDA_Acme_Northwind_2026Q1.pdf"],
              ["File size", "2.4 MB"],
              ["Pages", "3"],
              ["Created", "Mar 12, 2026 · 9:42 AM PT"],
              ["Expires", "Apr 11, 2026"],
            ].map(([k, v]) => (
              <React.Fragment key={k}>
                <dt style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12.5,
                  color: "var(--color-ink-subtle)",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  fontWeight: 600,
                  paddingTop: 1,
                }}>{k}</dt>
                <dd style={{
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13.5,
                  color: "var(--color-ink)",
                }}>{v}</dd>
              </React.Fragment>
            ))}
            <dt style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              color: "var(--color-ink-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: 600,
              paddingTop: 5,
            }}>Sender</dt>
            <dd style={{ margin: 0, display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials="BP" size={28} color="var(--color-brand)" />
              <div>
                <div style={{ fontSize: 13.5, color: "var(--color-ink)", fontWeight: 500 }}>Brijal Patel</div>
                <div style={{ fontSize: 12, color: "var(--color-ink-subtle)" }}>brijal@northbeam.io</div>
              </div>
            </dd>
          </dl>

          <div style={{
            marginTop: 24,
            paddingTop: 18,
            borderTop: "1px solid var(--color-border-subtle)",
          }}>
            <div style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11.5,
              color: "var(--color-ink-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              fontWeight: 600,
              marginBottom: 12,
            }}>Signers · 2 of 2 complete</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { name: "Elena Mendoza", email: "elena@acme.com", color: 0, done: true },
                { name: "Sarah Chen", email: "sarah@northwind.co", color: 1, done: true },
              ].map(s => (
                <div key={s.email} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: "1px solid var(--color-border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                }}>
                  <div style={{
                    width: 28, height: 28,
                    borderRadius: 999,
                    background: SIGNER_COLORS[s.color],
                    color: "var(--color-ink-inverse)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-sans)",
                    fontSize: 11,
                    fontWeight: 600,
                  }}>{s.name.split(" ").map(p => p[0]).join("")}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--color-ink)" }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-ink-subtle)" }}>{s.email}</div>
                  </div>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    color: "var(--color-success-strong)",
                  }}>
                    {I("check-circle-2", 14, "currentColor")} Signed
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--color-border)",
          background: "var(--color-surface-raised)",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
        }}>
          <Button variant="secondary" icon="send-horizontal" size="sm">Resend</Button>
          <Button variant="secondary" icon="download" size="sm">Download</Button>
          <Button variant="secondary" icon="copy" size="sm">Duplicate</Button>
          <div style={{ flex: 1 }} />
          <Button variant="ghost" size="sm" style={{ color: "var(--color-danger-strong)" }}>Void</Button>
        </div>
      </Drawer>
    </div>
  );
}

// ============ FRAME 5 — Bulk delete confirm ============
function BulkDeleteFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      position: "relative",
      fontFamily: "var(--font-sans)",
    }}>
      {/* faded page behind */}
      <div style={{ opacity: 0.5, pointerEvents: "none", height: "100%" }}>
        <AppShell active="Documents">
          <PageHeader title="Documents" actions={<Button icon="upload">Upload a PDF &amp; Sign</Button>} />
          <Toolbar />
        </AppShell>
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "oklch(0.21 0.018 60 / 0.45)",
        backdropFilter: "blur(2px)",
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}>
        <div style={{
          width: 440,
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-3)",
          overflow: "hidden",
        }}>
          <DialogBody padding="24px 24px 8px">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: 999,
                background: "var(--color-danger-soft)",
                color: "var(--color-danger-strong)",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}>{I("triangle-alert", 18, "currentColor")}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h2 style={{
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--color-ink)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.3,
                }}>Delete 3 documents?</h2>
                <p style={{
                  margin: "6px 0 0",
                  fontFamily: "var(--font-sans)",
                  fontSize: 13.5,
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.5,
                }}>This will permanently delete the selected documents. This action cannot be undone.</p>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive" icon="trash-2">Delete 3</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// ANNOTATIONS
// =============================================================
function AnnoFrame({ title, children, bg = "var(--color-paper)" }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: bg,
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
      }}>{title}</div>
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>{children}</div>
    </div>
  );
}

function ToastDocSentAnno() {
  return (
    <AnnoFrame title="Toast · document sent">
      <Toast variant="success" title="Document sent" body="Sent to 2 signers." />
    </AnnoFrame>
  );
}
function ToastDocsDeletedAnno() {
  return (
    <AnnoFrame title="Toast · bulk delete success">
      <Toast variant="success" title="Documents deleted" body="3 documents removed. Undo available for 10 seconds." />
    </AnnoFrame>
  );
}
function SkeletonRowsAnno() {
  return (
    <AnnoFrame title="Skeleton · 5 ghost rows">
      <div style={{
        width: "100%",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "16px 32px 1fr 60px 70px",
            gap: 12,
            padding: "11px 14px",
            alignItems: "center",
            borderBottom: i === 4 ? "none" : "1px solid var(--color-border-subtle)",
          }}>
            <Skeleton width={16} height={16} radius={3} />
            <Skeleton width={28} height={32} radius={3} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Skeleton width={`${65 + ((i * 7) % 25)}%`} height={10} />
              <Skeleton width="30%" height={8} />
            </div>
            <Skeleton width={50} height={18} radius={999} />
            <Skeleton width={60} height={10} />
          </div>
        ))}
      </div>
    </AnnoFrame>
  );
}

Object.assign(window, {
  DocumentsPopulatedFrame, DocumentsEmptyFrame, UploadDialogFrame,
  DocumentDrawerFrame, BulkDeleteFrame,
  ToastDocSentAnno, ToastDocsDeletedAnno, SkeletonRowsAnno,
});
