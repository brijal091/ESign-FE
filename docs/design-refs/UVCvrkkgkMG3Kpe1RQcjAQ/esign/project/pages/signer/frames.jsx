// =============================================================
// 06 — Signer · 6 screens × {mobile, desktop} + 2 annotations
// =============================================================

// ============ Screen 1 — Welcome / intent-to-sign ============
function SignerWelcomeScreen({ mode = "mobile", consented = true }) {
  return (
    <SignerShell
      mode={mode}
      top={<SignerTopLogoBar mode={mode} />}
      bottom={
        <SignerBottomBar mode={mode}>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            <Button block size="lg" disabled={!consented} iconRight="arrow-right">Continue</Button>
            <Button block variant="ghost" size="sm" style={{ color: "var(--color-ink-muted)" }}>Decline</Button>
          </div>
        </SignerBottomBar>
      }
      contentBg="var(--color-paper)"
    >
      <div style={{
        padding: mode === "mobile" ? "20px 16px 16px" : "0",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        <HeroCard padding={mode === "mobile" ? "22px" : "28px"}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44,
              borderRadius: 999,
              background: "var(--color-brand-soft)",
              color: "var(--color-brand-strong)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}>{I("file-signature", 22, "currentColor")}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-ink-subtle)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}>Invitation to sign</div>
              <h3 style={{
                margin: 0,
                fontSize: mode === "mobile" ? 20 : 24,
                fontWeight: 600,
                color: "var(--color-ink)",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}>You've been invited to sign</h3>
            </div>
          </div>
          <p style={{
            margin: 0,
            fontSize: 14.5,
            color: "var(--color-ink-muted)",
            lineHeight: 1.55,
          }}>
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>Brijal K.</strong> from{" "}
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>Acme Corp</strong>{" "}
            has sent you a document to sign.
          </p>

          {/* Filename row */}
          <div style={{
            marginTop: 18,
            padding: "12px 14px",
            background: "var(--color-surface-sunken)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <PdfThumb />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>Service_Agreement_2026Q1.pdf</div>
              <div style={{
                fontSize: 12,
                color: "var(--color-ink-subtle)",
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {I("file-text", 11, "var(--color-ink-subtle)")} 12 pages
                </span>
                <span style={{ color: "var(--color-border-strong)" }}>·</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  {I("clock", 11, "var(--color-ink-subtle)")} ~3 minutes
                </span>
              </div>
            </div>
          </div>
        </HeroCard>

        {/* Consent block */}
        <div style={{
          padding: mode === "mobile" ? "16px 18px" : "18px 24px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--radius-md)",
        }}>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13.5,
            fontWeight: 600,
            color: "var(--color-ink)",
            marginBottom: 6,
          }}>Consent to electronic signature</div>
          <p style={{
            margin: "0 0 12px",
            fontSize: 12.5,
            color: "var(--color-ink-muted)",
            lineHeight: 1.55,
          }}>
            By clicking <strong style={{ color: "var(--color-ink-muted)", fontWeight: 600 }}>Continue</strong>,
            you agree that your electronic signature has the same legal effect as a handwritten signature,
            in accordance with the ESIGN Act and eIDAS.
          </p>
          <Checkbox checked={consented}>I agree to use electronic signatures.</Checkbox>
        </div>

        {/* Trust marks */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          padding: "0 4px",
          marginTop: 4,
        }}>
          {[
            { icon: "shield-check", label: "SOC 2 · AES-256" },
            { icon: "lock", label: "End-to-end encrypted" },
            { icon: "scroll", label: "Audit trail included" },
          ].map(t => (
            <span key={t.label} style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontFamily: "var(--font-sans)",
              fontSize: 11.5,
              color: "var(--color-ink-subtle)",
            }}>
              {I(t.icon, 13, "var(--color-brand-strong)")} {t.label}
            </span>
          ))}
        </div>
      </div>
    </SignerShell>
  );
}

// ============ Screen 2 — Document Review ============
function SignerReviewScreen({ mode = "mobile" }) {
  const w = mode === "mobile" ? 343 : 700;
  return (
    <SignerShell
      mode={mode}
      top={<SignerTopStepperBar current={0} mode={mode} />}
      contentBg="var(--color-surface-sunken)"
      bottom={
        <SignerBottomBar mode={mode}>
          <IconButton icon="chevron-left" size={40} variant="outline" />
          <div style={{
            flex: 1,
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-ink-muted)",
          }}>
            <strong style={{ color: "var(--color-ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>2 / 5</strong> fields
          </div>
          <Button size="lg" iconRight="chevron-right" style={{ minWidth: 120 }}>Next</Button>
        </SignerBottomBar>
      }
    >
      <div style={{
        padding: mode === "mobile" ? "16px 16px 24px" : "0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <div style={{ position: "relative" }}>
          <SignerPdfPage mode={mode} scale={mode === "mobile" ? 1 : 1.6} />
          {/* Fields placed across the PDF */}
          {mode === "mobile" ? (
            <>
              <SignerField type="name"      x={32}  y={130} w={170} h={28} state="filled" value="Caleb Mwangi" />
              <SignerField type="email"     x={32}  y={166} w={170} h={28} state="filled" value="caleb@acmecorp.com" />
              <SignerField type="date"      x={172} y={510} w={140} h={28} state="empty" required label="Today's date" />
              <SignerField type="signature" x={32}  y={555} w={140} h={42} state="empty" required label="Signature" />
              <SignerField type="initials"  x={262} y={555} w={50}  h={42} state="empty" required={false} label="Init" />
            </>
          ) : (
            <>
              <SignerField type="name"      x={60}  y={195} w={300} h={34} state="filled" value="Caleb Mwangi" />
              <SignerField type="email"     x={60}  y={245} w={300} h={34} state="filled" value="caleb@acmecorp.com" />
              <SignerField type="date"      x={360} y={802} w={200} h={36} state="empty" required label="Today's date" />
              <SignerField type="signature" x={60}  y={845} w={260} h={56} state="empty" required label="Tap to sign" />
              <SignerField type="initials"  x={530} y={845} w={90}  h={56} state="empty" required={false} label="Init" />
            </>
          )}
        </div>

        {/* "next field" floating hint near current required field */}
        <div style={{
          marginTop: 18,
          padding: "10px 14px",
          background: "var(--color-brand)",
          color: "var(--color-ink-inverse)",
          borderRadius: 999,
          boxShadow: "var(--shadow-2)",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
        }}>
          {I("arrow-up", 14, "currentColor")}
          Tap a highlighted field to fill it
        </div>
      </div>
    </SignerShell>
  );
}

// ============ Screen 3 — Signature Pad open over Review ============
function SignerSignaturePadScreen({ mode = "mobile" }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <SignerReviewScreen mode={mode} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "oklch(0.21 0.018 60 / 0.55)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: mode === "mobile" ? "flex-end" : "center",
        justifyContent: "center",
        padding: mode === "mobile" ? "0 0 12px" : 24,
      }}>
        <SignaturePad mode={mode} />
      </div>
    </div>
  );
}

// ============ Screen 4 — Field interactions cluster ============
function SignerFieldInteractionsScreen({ mode = "mobile" }) {
  // Composed of 4 mini-frames inside the scroll area.
  const titleStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: 10.5,
    color: "var(--color-ink-subtle)",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: 8,
    fontWeight: 600,
  };
  const cellStyle = {
    padding: mode === "mobile" ? "14px" : "18px 20px",
    background: "var(--color-surface)",
    border: "1px solid var(--color-border-subtle)",
    borderRadius: "var(--radius-md)",
  };

  return (
    <SignerShell
      mode={mode}
      top={<SignerTopStepperBar current={1} mode={mode} />}
      contentBg="var(--color-paper)"
      bottom={
        <SignerBottomBar mode={mode}>
          <IconButton icon="chevron-left" size={40} variant="outline" />
          <div style={{ flex: 1, textAlign: "center", fontSize: 13, color: "var(--color-ink-muted)" }}>
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>3 / 5</strong> fields
          </div>
          <Button size="lg" iconRight="chevron-right" style={{ minWidth: 120 }}>Next</Button>
        </SignerBottomBar>
      }
    >
      <div style={{
        padding: mode === "mobile" ? "16px" : "0",
        display: "grid",
        gridTemplateColumns: mode === "mobile" ? "1fr" : "1fr 1fr",
        gap: 14,
      }}>
        {/* (a) Text field focused */}
        <div style={cellStyle}>
          <div style={titleStyle}>a · Text field</div>
          <Field label="Full name" hint="Required">
            <Input
              icon="user"
              value="Caleb Mwangi"
              state="focus"
            />
          </Field>
        </div>

        {/* (b) Checkbox field */}
        <div style={cellStyle}>
          <div style={titleStyle}>b · Checkbox field</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Checkbox checked>I have read the terms.</Checkbox>
            <Checkbox checked={false}>I agree to the conditions.</Checkbox>
          </div>
        </div>

        {/* (c) Date with popover */}
        <div style={{ ...cellStyle, position: "relative" }}>
          <div style={titleStyle}>c · Date field · calendar open</div>
          <Field label="Effective date">
            <Input
              icon="calendar"
              value="Mar 17, 2026"
              state="focus"
              trailing={I("chevron-down", 14, "var(--color-ink-subtle)")}
            />
          </Field>
          <div style={{ marginTop: 12 }}>
            <DatePopover />
          </div>
        </div>

        {/* (d) Selection dropdown */}
        <div style={cellStyle}>
          <div style={titleStyle}>d · Selection · dropdown open</div>
          <Field label="Governing state">
            <Input
              icon="map-pin"
              value="California"
              state="focus"
              trailing={I("chevron-up", 14, "var(--color-ink-subtle)")}
            />
          </Field>
          <div style={{ marginTop: 8 }}>
            <OpenDropdown
              options={["California", "New York", "Washington"]}
              selected="California"
            />
          </div>
        </div>
      </div>
    </SignerShell>
  );
}

// ============ Screen 5 — Decline reason ============
function SignerDeclineScreen({ mode = "mobile" }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.6 }}>
        <SignerReviewScreen mode={mode} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: "oklch(0.21 0.018 60 / 0.55)",
        backdropFilter: "blur(2px)",
        display: "flex",
        alignItems: mode === "mobile" ? "flex-end" : "center",
        justifyContent: "center",
        padding: mode === "mobile" ? "0 0 12px" : 24,
      }}>
        <div style={{
          width: mode === "mobile" ? 343 : 440,
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-3)",
          overflow: "hidden",
          fontFamily: "var(--font-sans)",
        }}>
          <DialogBody padding="20px 22px 4px">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: 999,
                background: "var(--color-danger-soft)",
                color: "var(--color-danger-strong)",
                display: "grid", placeItems: "center",
                flexShrink: 0,
              }}>{I("triangle-alert", 18, "currentColor")}</div>
              <div style={{ flex: 1 }}>
                <h2 style={{
                  margin: 0,
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: "var(--color-ink)",
                  lineHeight: 1.3,
                }}>Decline this document?</h2>
                <p style={{
                  margin: "6px 0 0",
                  fontSize: 13.5,
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.5,
                }}>Tell the sender why. They'll be notified.</p>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Field>
                <div style={{
                  padding: "10px 12px",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface)",
                  minHeight: 88,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13.5,
                  color: "var(--color-ink-faint)",
                  lineHeight: 1.5,
                }}>Add a reason (optional)…</div>
              </Field>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive" icon="x-circle">Decline</Button>
          </DialogFooter>
        </div>
      </div>
    </div>
  );
}

// ============ Screen 6 — Success ============
function SignerSuccessScreen({ mode = "mobile" }) {
  return (
    <SignerShell
      mode={mode}
      top={<SignerTopStepperBar current={2} mode={mode} />}
      contentBg="var(--color-paper)"
      bottom={null}
    >
      <div style={{
        padding: mode === "mobile" ? "32px 20px" : "0",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <div style={{
          width: 96, height: 96,
          borderRadius: 999,
          background: "var(--color-success-soft)",
          color: "var(--color-success-strong)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 24px",
          position: "relative",
        }}>
          {I("check", 48, "currentColor", { strokeWidth: 2 })}
          {/* radiating rings */}
          <span style={{
            position: "absolute",
            inset: -12,
            borderRadius: 999,
            border: "1px solid color-mix(in oklch, var(--color-success) 25%, transparent)",
          }} />
          <span style={{
            position: "absolute",
            inset: -24,
            borderRadius: 999,
            border: "1px solid color-mix(in oklch, var(--color-success) 12%, transparent)",
          }} />
        </div>
        <h2 style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: mode === "mobile" ? 26 : 32,
          fontWeight: 600,
          color: "var(--color-ink)",
          letterSpacing: "-0.015em",
          lineHeight: 1.2,
        }}>All signed!</h2>
        <p style={{
          margin: "12px auto 0",
          fontFamily: "var(--font-sans)",
          fontSize: 14.5,
          color: "var(--color-ink-muted)",
          lineHeight: 1.55,
          maxWidth: 360,
        }}>
          Your signed document has been sent to <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>Brijal K.</strong>{" "}
          You'll receive a copy by email shortly.
        </p>

        <div style={{
          marginTop: 28,
          display: "flex",
          flexDirection: mode === "mobile" ? "column" : "row",
          gap: 10,
          justifyContent: "center",
        }}>
          <Button variant="secondary" size="lg" icon="download">Download a copy</Button>
          <Button variant="ghost" size="lg">Done</Button>
        </div>

        <div style={{
          marginTop: 36,
          paddingTop: 18,
          borderTop: "1px solid var(--color-border-subtle)",
          maxWidth: 320,
          margin: "36px auto 0",
          paddingTop: 18,
        }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--color-ink-subtle)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}>
            {I("scroll", 12, "var(--color-ink-subtle)")}
            Signed via ESign · Audit trail attached
          </div>
        </div>
      </div>
    </SignerShell>
  );
}

// =============================================================
// ANNOTATIONS — expired link · offline banner
// =============================================================
function SignerExpiredScreen({ mode = "mobile" }) {
  return (
    <SignerShell
      mode={mode}
      top={<SignerTopLogoBar mode={mode} />}
      contentBg="var(--color-paper)"
      bottom={null}
    >
      <div style={{
        padding: mode === "mobile" ? "32px 24px" : "0",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <div style={{
          width: 88, height: 88,
          borderRadius: 999,
          background: "var(--color-danger-soft)",
          color: "var(--color-danger-strong)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 22px",
        }}>{I("clock", 44, "currentColor")}</div>
        <h3 style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 600,
          color: "var(--color-ink)",
          letterSpacing: "-0.01em",
        }}>This signing link has expired</h3>
        <p style={{
          margin: "10px auto 0",
          fontSize: 14.5,
          color: "var(--color-ink-muted)",
          lineHeight: 1.55,
          maxWidth: 320,
        }}>Ask the sender to send a new invitation. The original document is unchanged.</p>
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
          <Button variant="secondary" size="lg" icon="mail">Contact the sender</Button>
        </div>
      </div>
    </SignerShell>
  );
}

function OfflineBannerAnno() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10.5,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "var(--color-ink-subtle)",
      }}>Offline banner · sticky top</div>
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
        <div style={{
          width: "100%",
          maxWidth: 343,
          padding: "11px 12px",
          background: "color-mix(in oklch, var(--color-danger) 12%, var(--color-surface))",
          border: "1px solid var(--color-danger)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{
            width: 28, height: 28,
            borderRadius: 999,
            background: "var(--color-danger-soft)",
            color: "var(--color-danger-strong)",
            display: "grid", placeItems: "center",
            flexShrink: 0,
          }}>{I("wifi-off", 15, "currentColor")}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-danger-strong)",
            }}>You're offline</div>
            <div style={{
              fontSize: 12,
              color: "var(--color-danger-strong)",
              opacity: 0.85,
              marginTop: 1,
            }}>Your progress is saved.</div>
          </div>
          <IconButton icon="refresh-cw" size={32} variant="ghost" title="Retry" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  SignerWelcomeScreen, SignerReviewScreen, SignerSignaturePadScreen,
  SignerFieldInteractionsScreen, SignerDeclineScreen, SignerSuccessScreen,
  SignerExpiredScreen, OfflineBannerAnno,
});
