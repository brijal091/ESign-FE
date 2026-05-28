// =============================================================
// 05 — Editor · frames + annotations
// =============================================================

// ============ Reusable canvas content (PDF on muted bg with controls) ============
function PdfCanvas({ children, pageNum = 1, pageTotal = 12, zoom = 100, scrollOffset = 0 }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{
        position: "absolute",
        top: 32, left: 0, right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        paddingBottom: 80,
        transform: `translateY(${-scrollOffset}px)`,
      }}>
        {children}
      </div>
      <PageIndicator page={pageNum} total={pageTotal} />
      <ZoomControl zoom={zoom} />
    </div>
  );
}

// =============================================================
// FRAME 1 — Empty editor
// =============================================================
function EditorEmptyFrame() {
  return (
    <EditorLayout
      topBar={
        <EditorTopBar
          title="Untitled Document"
          tags={[]}
          rightExtras={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TagInput width={200} placeholder="Add tags…" />
              <span style={{ width: 1, height: 20, background: "var(--color-border)" }} />
              <Button variant="secondary" size="md" icon="pen-tool">Sign Now</Button>
              <Button size="md" icon="send-horizontal">Send</Button>
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
                <div style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>Sample Agreement.pdf</div>
                <div style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11.5,
                  color: "var(--color-ink-subtle)",
                  marginTop: 1,
                }}>12 pages · 480 KB</div>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection
            title="Recipients"
            count={1}
            action={
              <button style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--color-ink-subtle)", display: "grid", placeItems: "center",
                width: 22, height: 22, borderRadius: 4,
              }}>{I("user-plus", 14, "currentColor")}</button>
            }
          >
            <SignerBlock name="Signer 1" colorIdx={0} selected fieldCount={0} />
            <div style={{
              padding: "11px 12px 9px",
              fontFamily: "var(--font-sans)",
              fontSize: 11.5,
              color: "var(--color-ink-subtle)",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}>
              Drag a field type onto the PDF to assign it to this signer.
            </div>
            <InlineHint>Add a field type to get started ↓</InlineHint>

            <div style={{
              padding: "8px 4px 4px",
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-ink-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>Field types · 13</div>
            <FieldTypeGrid />
          </SidebarSection>

          <div style={{ padding: 12, marginTop: "auto" }}>
            <Button block variant="secondary" size="sm" icon="user-plus">Add signer</Button>
          </div>
        </>
      }
      canvas={
        <PdfCanvas pageNum={1} pageTotal={12} zoom={100}>
          <PdfPage width={680}>
            <ContractPage1 />
          </PdfPage>
        </PdfCanvas>
      }
    />
  );
}

// =============================================================
// FRAME 2 — With 2 signers and 5 placed fields
// =============================================================
function EditorPlacedFrame({ saveStatus = null, warningBanner = false } = {}) {
  return (
    <EditorLayout
      topBar={
        <EditorTopBar
          title="Service Agreement.pdf"
          tags={["legal", "Q2"]}
          saveStatus={saveStatus}
          rightExtras={
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <TagInput width={180} placeholder="Add tags…" tags={[]} />
              <span style={{ width: 1, height: 20, background: "var(--color-border)" }} />
              <Button variant="secondary" size="md" icon="pen-tool">Sign Now</Button>
              <Button size="md" icon="send-horizontal">Send</Button>
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
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)" }}>Service Agreement.pdf</div>
                <div style={{ fontSize: 11.5, color: "var(--color-ink-subtle)", marginTop: 1 }}>12 pages · 1.8 MB</div>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection
            title="Recipients"
            count={2}
            action={
              <button style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--color-ink-subtle)", display: "grid", placeItems: "center",
                width: 22, height: 22, borderRadius: 4,
              }}>{I("user-plus", 14, "currentColor")}</button>
            }
          >
            <SignerBlock name="Brijal K." email="brijal@example.com" colorIdx={2} selected fieldCount={3} />
            <SignerBlock name="Acme Counsel" email="legal@acme.com" colorIdx={1} collapsed fieldCount={2} />

            {warningBanner && (
              <div style={{
                margin: "8px 4px",
                padding: "9px 11px",
                background: "var(--color-warning-soft)",
                border: "1px solid oklch(0.85 0.10 80)",
                borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-sans)",
                fontSize: 11.5,
                color: "var(--color-warning-strong)",
                display: "flex",
                alignItems: "flex-start",
                gap: 7,
                lineHeight: 1.4,
              }}>
                {I("triangle-alert", 13, "var(--color-warning-strong)", { flexShrink: 0, marginTop: 1 })}
                <span style={{ flex: 1 }}>Signer 2 has no fields assigned.</span>
                <a href="#" style={{ color: "var(--color-warning-strong)", textDecoration: "underline", fontWeight: 600 }}>Review</a>
              </div>
            )}

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
              }}>Drag onto Brijal K.</span>
            </div>
            <FieldTypeGrid />
          </SidebarSection>

          <div style={{ padding: 12, marginTop: "auto" }}>
            <Button block variant="secondary" size="sm" icon="user-plus">Add signer</Button>
          </div>
        </>
      }
      canvas={
        <PdfCanvas pageNum={1} pageTotal={12} zoom={100}>
          {/* Page 1 — signer 1 (green, colorIdx 2) fields */}
          <div style={{ position: "relative" }}>
            <PdfPage width={680}>
              <ContractPage1 />
            </PdfPage>
            <PlacedField type="signature" x={66} y={595} w={250} h={56} signerColorIdx={2} label="Brijal · Signature" />
            <PlacedField type="date"      x={66} y={657} w={140} h={32} signerColorIdx={2} label="Date" />
            <PlacedField type="initials"  x={544} y={36}  w={100} h={36} signerColorIdx={2} label="Initials" />
          </div>
          {/* Page 2 — signer 2 (blue, colorIdx 1) + selected field with toolbar */}
          <div style={{ position: "relative" }}>
            <PdfPage width={680}>
              <ContractPage2 />
            </PdfPage>
            {/* Selected signature field (signer 2) */}
            <PlacedField type="signature" x={66} y={595} w={250} h={56} signerColorIdx={1} selected label="Acme · Signature" />
            <FieldToolbar x={66} y={595} />
            <PlacedField type="initials" x={500} y={262} w={120} h={32} signerColorIdx={1} label="Initials" />
          </div>
        </PdfCanvas>
      }
    />
  );
}

// =============================================================
// FRAME 3 — Send dialog
// =============================================================
function EditorSendDialogFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      position: "relative",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{ opacity: 0.5, pointerEvents: "none", height: "100%" }}>
        <EditorPlacedFrame />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "oklch(0.21 0.018 60 / 0.45)",
        backdropFilter: "blur(2px)",
        display: "grid", placeItems: "center",
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
            title="Send for Signature"
            description="Review recipient order and add a message."
          />
          <DialogBody>
            {/* Order toggle */}
            <div style={{
              display: "inline-flex",
              padding: 3,
              background: "var(--color-surface-sunken)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 16,
            }}>
              {[
                { id: "order", label: "Sign in order", icon: "list-ordered", active: true },
                { id: "any", label: "Anyone first", icon: "shuffle", active: false },
              ].map(t => (
                <button key={t.id} style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  background: t.active ? "var(--color-surface)" : "transparent",
                  border: t.active ? "1px solid var(--color-border)" : "1px solid transparent",
                  color: t.active ? "var(--color-ink)" : "var(--color-ink-muted)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12.5,
                  fontWeight: t.active ? 600 : 500,
                  borderRadius: 4,
                  cursor: "pointer",
                  boxShadow: t.active ? "var(--shadow-1)" : "none",
                }}>
                  {I(t.icon, 13, "currentColor")}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Recipients */}
            <div style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-ink-subtle)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}>Recipient order</div>
            <div style={{
              display: "flex", flexDirection: "column", gap: 6,
              marginBottom: 18,
            }}>
              {[
                { num: 1, name: "Brijal Patel",  email: "brijal@northbeam.io", colorIdx: 2 },
                { num: 2, name: "Acme Counsel",  email: "legal@acme.com",      colorIdx: 1 },
              ].map(r => (
                <div key={r.num} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 11px 9px 7px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                }}>
                  <span style={{
                    color: "var(--color-ink-faint)",
                    cursor: "grab",
                    display: "grid", placeItems: "center",
                  }}>{I("grip-vertical", 14, "currentColor")}</span>
                  <span style={{
                    width: 22, height: 22,
                    borderRadius: 999,
                    background: "var(--color-surface-sunken)",
                    color: "var(--color-ink-muted)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}>{r.num}</span>
                  <SignerColorChip colorIdx={r.colorIdx} size={14} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-ink)" }}>{r.name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-ink-subtle)" }}>{r.email}</div>
                  </div>
                  <a href="#" style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--color-brand)",
                    textDecoration: "none",
                  }}>Edit</a>
                </div>
              ))}
            </div>

            {/* Message */}
            <Field label="Message">
              <div style={{
                padding: "10px 12px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                background: "var(--color-surface)",
                minHeight: 76,
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-ink-muted)",
                lineHeight: 1.5,
              }}>
                Hi — attached is the Service Agreement for Q2. Please review and sign at your earliest convenience.
              </div>
            </Field>

            <div style={{
              marginTop: 14,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
            }}>
              <Field label="Expires">
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                  fontSize: 13,
                  color: "var(--color-ink)",
                }}>
                  <span>Expires in</span>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "2px 7px",
                    background: "var(--color-surface-sunken)",
                    borderRadius: 4,
                    fontFamily: "var(--font-mono)",
                    fontVariantNumeric: "tabular-nums",
                    fontWeight: 500,
                  }}>30 {I("chevron-down", 11, "var(--color-ink-subtle)")}</span>
                  <span>days</span>
                </div>
              </Field>
              <Field label="Reminder">
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                  cursor: "pointer",
                  fontSize: 13,
                }}>
                  <Switch checked size="sm" />
                  <span style={{ color: "var(--color-ink)" }}>Remind after 3 days</span>
                </label>
              </Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button icon="send-horizontal">Send</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// FRAME 4 — Field properties popover
// =============================================================
function EditorPropertiesFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      position: "relative",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{ pointerEvents: "none", height: "100%" }}>
        <EditorLayout
          topBar={
            <EditorTopBar
              title="Service Agreement.pdf"
              tags={["legal", "Q2"]}
              rightExtras={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TagInput width={180} placeholder="Add tags…" />
                  <span style={{ width: 1, height: 20, background: "var(--color-border)" }} />
                  <Button variant="secondary" size="md" icon="pen-tool">Sign Now</Button>
                  <Button size="md" icon="send-horizontal">Send</Button>
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
                    <div style={{ fontSize: 13, fontWeight: 500 }}>Service Agreement.pdf</div>
                    <div style={{ fontSize: 11.5, color: "var(--color-ink-subtle)", marginTop: 1 }}>12 pages</div>
                  </div>
                </div>
              </SidebarSection>
              <SidebarSection title="Recipients" count={2}>
                <SignerBlock name="Brijal K." email="brijal@example.com" colorIdx={2} selected fieldCount={3} />
                <SignerBlock name="Acme Counsel" email="legal@acme.com" colorIdx={1} collapsed fieldCount={2} />
                <div style={{ paddingTop: 10 }}>
                  <FieldTypeGrid />
                </div>
              </SidebarSection>
            </>
          }
          canvas={
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <div style={{
                position: "absolute",
                top: 32, left: 0, right: 0,
                display: "flex",
                justifyContent: "center",
              }}>
                <div style={{ position: "relative" }}>
                  <PdfPage width={680}>
                    <ContractPage1 />
                  </PdfPage>
                  {/* Selected text field */}
                  <PlacedField type="text" x={66} y={420} w={300} h={36} signerColorIdx={2} selected label="Project name" />
                </div>
              </div>
              <PageIndicator page={1} total={12} />
              <ZoomControl zoom={100} />
            </div>
          }
        />
      </div>

      {/* Floating popover anchored near the selected field */}
      <div style={{
        position: "absolute",
        left: 720,
        top: 480,
        width: 280,
        background: "var(--color-surface-raised)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-3)",
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}>
        <div style={{
          padding: "12px 14px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          borderBottom: "1px solid var(--color-border-subtle)",
        }}>
          {I("text-cursor-input", 15, "var(--color-ink-muted)")}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)" }}>Text Field</div>
          </div>
        </div>
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Label">
            <Input value="Project name" state="filled" size="sm" />
          </Field>
          <Field label="Placeholder">
            <Input value="e.g. Discovery sprint" />
          </Field>
          <Field label="Default value">
            <Input placeholder="(none)" />
          </Field>
          <label style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 0",
            cursor: "pointer",
            borderTop: "1px solid var(--color-border-subtle)",
            paddingTop: 10,
          }}>
            <span style={{ fontSize: 13, color: "var(--color-ink)" }}>Required</span>
            <Switch checked />
          </label>
          <Field label="Assigned signer">
            <button style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              height: 36,
              padding: "0 10px",
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              color: "var(--color-ink)",
              textAlign: "left",
            }}>
              <SignerColorChip colorIdx={2} size={14} />
              <span style={{ flex: 1 }}>Brijal K.</span>
              {I("chevron-down", 14, "var(--color-ink-subtle)")}
            </button>
          </Field>
        </div>
        <div style={{
          padding: "10px 14px",
          borderTop: "1px solid var(--color-border-subtle)",
          background: "var(--color-surface)",
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
        }}>
          <Button variant="ghost" size="sm" style={{ color: "var(--color-danger-strong)" }} icon="trash-2">Delete</Button>
          <Button size="sm">Done</Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// FRAME 5 — Save status states (3 variants)
// =============================================================
function EditorSavingFrame()  { return <EditorPlacedFrame saveStatus="saving" />; }
function EditorSavedFrame()   { return <EditorPlacedFrame saveStatus="saved" />; }
function EditorSaveErrorFrame() { return <EditorPlacedFrame saveStatus="error" />; }

// =============================================================
// ANNOTATIONS
// =============================================================
function EditorAnnoFrame({ title, children }) {
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
      }}>{title}</div>
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>{children}</div>
    </div>
  );
}

function ToastPdfErrorAnno() {
  return (
    <EditorAnnoFrame title="Toast · PDF load error">
      <Toast variant="error" title="Couldn't load PDF" body="Try again, or upload a different file." />
    </EditorAnnoFrame>
  );
}

function WarningBannerAnno() {
  return (
    <EditorAnnoFrame title="Pre-send warning banner">
      <div style={{ width: "100%", maxWidth: 360 }}>
        <div style={{
          padding: "11px 13px",
          background: "var(--color-warning-soft)",
          border: "1px solid oklch(0.85 0.10 80)",
          borderRadius: "var(--radius-sm)",
          fontFamily: "var(--font-sans)",
          fontSize: 12.5,
          color: "var(--color-warning-strong)",
          display: "flex",
          alignItems: "flex-start",
          gap: 8,
          lineHeight: 1.4,
        }}>
          {I("triangle-alert", 15, "var(--color-warning-strong)", { flexShrink: 0, marginTop: 1 })}
          <span style={{ flex: 1 }}>Signer 2 has no fields assigned.</span>
          <a href="#" style={{ color: "var(--color-warning-strong)", textDecoration: "underline", fontWeight: 600 }}>Review</a>
        </div>
      </div>
    </EditorAnnoFrame>
  );
}

Object.assign(window, {
  PdfCanvas,
  EditorEmptyFrame, EditorPlacedFrame, EditorSendDialogFrame,
  EditorPropertiesFrame,
  EditorSavingFrame, EditorSavedFrame, EditorSaveErrorFrame,
  ToastPdfErrorAnno, WarningBannerAnno,
});
