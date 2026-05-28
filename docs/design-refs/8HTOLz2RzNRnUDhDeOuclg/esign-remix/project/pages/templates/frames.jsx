// =============================================================
// 08 — Templates & Contacts · frames + annotations
// =============================================================

// ============ Toolbar for Templates list ============
function TemplatesToolbar({ search = "" }) {
  return (
    <div style={{
      padding: "0 32px 18px",
      display: "flex",
      alignItems: "center",
      gap: 10,
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
        }}>{search || "Search templates…"}</span>
      </div>
      <DropdownTrigger label="All categories" />
      <DropdownTrigger label="Sort: Recent" icon="arrow-down-narrow-wide" />
      <div style={{ flex: 1 }} />
      <div style={{
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        color: "var(--color-ink-subtle)",
      }}>
        <span style={{ color: "var(--color-ink)", fontWeight: 600 }}>9</span> templates
      </div>
    </div>
  );
}

// =============================================================
// FRAME 1 — Templates List
// =============================================================
function TemplatesListFrame() {
  return (
    <AppShell active="Templates">
      <PageHeader
        title="Templates"
        subtitle="Reusable documents with pre-placed fields and signer roles."
        actions={
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" icon="upload">Upload PDF</Button>
            <Button icon="plus">New Template</Button>
          </div>
        }
      />
      <TemplatesToolbar />
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: "0 32px 32px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 280px)",
          justifyContent: "start",
          gap: 20,
        }}>
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={i} {...t} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

// =============================================================
// FRAME 2 — Templates Editor (mirrors 05 populated editor)
// =============================================================
function TemplatesEditorFrame() {
  return (
    <EditorLayout
      topBar={
        <EditorTopBar
          title="Template: NDA — Standard"
          tags={["legal", "reusable"]}
          rightExtras={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TagInput width={180} placeholder="Add tags…" tags={[]} />
              <span style={{ width: 1, height: 20, background: "var(--color-border)" }} />
              <Button variant="secondary" size="md" icon="eye">Preview</Button>
              <Button size="md" icon="bookmark">Save as Template</Button>
            </div>
          }
        />
      }
      sidebar={
        <>
          <SidebarSection title="Document" count={1}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px",
              border: "1px solid var(--color-border-subtle)",
              background: "var(--color-surface-raised)",
              borderRadius: "var(--radius-sm)",
            }}>
              <PdfThumb />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)" }}>NDA_Standard_v3.pdf</div>
                <div style={{ fontSize: 11.5, color: "var(--color-ink-subtle)", marginTop: 1 }}>2 pages · 180 KB · template</div>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection
            title="Signer roles"
            count={2}
            action={
              <button style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--color-ink-subtle)", display: "grid", placeItems: "center",
                width: 22, height: 22, borderRadius: 4,
              }}>{I("user-plus", 14, "currentColor")}</button>
            }
          >
            <SignerBlock name="Recipient" email="(role · filled at send)" colorIdx={2} selected fieldCount={3} />
            <SignerBlock name="Counterparty" email="(role · filled at send)" colorIdx={1} collapsed fieldCount={2} />

            <div style={{
              padding: "10px 4px 4px",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-ink-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>Field types</span>
              <span style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                color: "var(--color-ink-faint)",
                fontWeight: 500,
                letterSpacing: 0,
                textTransform: "none",
              }}>Drag onto Recipient</span>
            </div>
            <FieldTypeGrid />
          </SidebarSection>

          <div style={{ padding: 12, marginTop: "auto" }}>
            <Button block variant="secondary" size="sm" icon="user-plus">Add role</Button>
          </div>
        </>
      }
      canvas={
        <PdfCanvas pageNum={1} pageTotal={2} zoom={100}>
          {/* Page 1 — recipient (green, colorIdx 2) fields */}
          <div style={{ position: "relative" }}>
            <PdfPage width={680}>
              <ContractPage1 />
            </PdfPage>
            <PlacedField type="signature" x={66}  y={595} w={250} h={56} signerColorIdx={2} label="Recipient · Signature" />
            <PlacedField type="date"      x={66}  y={657} w={140} h={32} signerColorIdx={2} label="Date" />
            <PlacedField type="initials"  x={544} y={36}  w={100} h={36} signerColorIdx={2} label="Initials" />
          </div>
          {/* Page 2 — counterparty (blue, colorIdx 1) */}
          <div style={{ position: "relative" }}>
            <PdfPage width={680}>
              <ContractPage2 />
            </PdfPage>
            <PlacedField type="signature" x={66}  y={595} w={250} h={56} signerColorIdx={1} label="Counterparty · Signature" />
            <PlacedField type="initials"  x={500} y={262} w={120} h={32} signerColorIdx={1} label="Initials" />
          </div>
        </PdfCanvas>
      }
    />
  );
}

// =============================================================
// FRAME 3 — Contacts List
// =============================================================
function ContactsListFrame() {
  return (
    <AppShell active="Contacts">
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <ContactsSidebar activeGroup="All Contacts" />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <PageHeader
            title="Contacts"
            subtitle="People you send documents to. 247 total · 12 added this month."
            actions={
              <div style={{ display: "flex", gap: 10 }}>
                <Button variant="secondary" icon="upload">Import CSV</Button>
                <Button icon="user-plus">Add Contact</Button>
              </div>
            }
          />

          {/* Toolbar */}
          <div style={{
            padding: "0 32px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
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
                color: "var(--color-ink-faint)",
              }}>Search by name, email, company…</span>
            </div>
            <DropdownTrigger label="All tags" icon="filter" />
            <DropdownTrigger label="All companies" />
            <div style={{ flex: 1 }} />
            <IconButton icon="rows-3" size={36} variant="outline" active title="Table view" />
            <IconButton icon="layout-grid" size={36} variant="outline" title="Card view" />
          </div>

          <div style={{ flex: 1, overflow: "auto" }}>
            <Table cols={CONTACT_COLS}>
              {CONTACTS.map((c, i) => (
                <TableRow
                  key={i}
                  cols={CONTACT_COLS}
                  last={i === CONTACTS.length - 1}
                  selected={i === 3}
                >
                  <RowCheckbox checked={i === 3} />
                  {/* Avatar + Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                    <div style={{
                      width: 32, height: 32,
                      borderRadius: 999,
                      background: SIGNER_COLORS[c.colorIdx % SIGNER_COLORS.length],
                      color: "var(--color-ink-inverse)",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: "var(--font-sans)",
                      fontSize: 11,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}>{c.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "var(--color-ink)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>{c.name}</div>
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
                  }}>{c.email}</div>
                  {/* Phone */}
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: c.phone === "—" ? "var(--color-ink-faint)" : "var(--color-ink-muted)",
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}>{c.phone}</div>
                  {/* Company */}
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--color-ink)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{c.company}</div>
                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {c.tags.map(t => <TagChip key={t}>{t}</TagChip>)}
                  </div>
                  {/* Last contacted */}
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--color-ink-muted)",
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}>{c.last}</div>
                  {/* Action */}
                  <RowKebab />
                </TableRow>
              ))}
            </Table>
            <Pagination from={1} to={12} total={247} page={1} totalPages={21} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// =============================================================
// FRAME 4 — CSV Import Dialog (md)
// =============================================================
function CsvImportDialogFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      position: "relative",
      fontFamily: "var(--font-sans)",
    }}>
      {/* faded contacts page behind */}
      <div style={{ opacity: 0.5, pointerEvents: "none", height: "100%" }}>
        <ContactsListFrame />
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
            title="Import contacts from CSV"
            description="Upload a .csv file. We'll let you map each column to a contact field in the next step."
          />

          {/* Stepper region (full-width, distinct from body) */}
          <div style={{
            padding: "16px 24px 18px",
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border-subtle)",
          }}>
            <Stepper steps={["Upload", "Map columns", "Review"]} current={0} />
          </div>

          <DialogBody>
            {/* Drop zone — reuses the Upload Dialog style */}
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
              }}>{I("file-spreadsheet", 22, "currentColor")}</div>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-ink)",
              }}>Drag and drop your CSV here</div>
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

            <div style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-ink-subtle)",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}>
                {I("info", 13, "var(--color-ink-subtle)")}
                Maximum 5,000 rows. UTF-8 encoding.
              </div>
              <a href="#" style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--color-brand-strong)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}>
                {I("download", 13, "currentColor")}
                Download a sample CSV
              </a>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button disabled iconRight="arrow-right">Next</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// ANNOTATION — Add Contact Dialog (sm)
// =============================================================
function AddContactDialogAnno() {
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
      }}>Dialog · sm · Add contact</div>
      <div style={{
        flex: 1,
        display: "grid",
        placeItems: "center",
        background: "oklch(0.21 0.018 60 / 0.10)",
        borderRadius: "var(--radius-md)",
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
          <DialogHeader
            title="New Contact"
            description="Add one person. They won't be notified."
          />
          <DialogBody>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Name" required>
                <Input value="Elena Mendoza" state="filled" />
              </Field>
              <Field label="Email" required>
                <Input icon="mail" value="elena@acme.com" state="filled" />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Phone" hint="Optional">
                  <Input icon="phone" placeholder="+1 (555) 000-0000" />
                </Field>
                <Field label="Company" hint="Optional">
                  <Input icon="building-2" placeholder="Acme Holdings" />
                </Field>
              </div>
              <Field label="Groups" hint="Select one or more">
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                  minHeight: 40,
                  padding: "6px 10px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                }}>
                  <TagChip variant="brand" icon="x">Clients</TagChip>
                  <TagChip variant="brand" icon="x">VIP</TagChip>
                  <span style={{
                    flex: 1,
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    color: "var(--color-ink-faint)",
                    minWidth: 80,
                  }}>Add group…</span>
                  {I("chevron-down", 14, "var(--color-ink-subtle)")}
                </div>
              </Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button icon="user-plus">Add</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  TemplatesListFrame, TemplatesEditorFrame,
  ContactsListFrame, CsvImportDialogFrame,
  AddContactDialogAnno,
});
