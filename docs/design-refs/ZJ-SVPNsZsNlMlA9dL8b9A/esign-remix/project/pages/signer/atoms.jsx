// =============================================================
// 06 — Signer: mobile-first atoms.
// Each top-level screen takes a `mode` prop ("mobile" | "desktop")
// so the same content renders at 375×812 and at 1440×900 (centered
// in a max-720 column).
// =============================================================

// ============ SignerShell — top + scroll content + bottom ============
function SignerShell({ top, bottom, mode = "mobile", contentBg = "var(--color-paper)", children }) {
  if (mode === "mobile") {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: contentBg,
        display: "flex", flexDirection: "column",
        fontFamily: "var(--font-sans)",
        color: "var(--color-ink)",
        overflow: "hidden",
      }}>
        {top}
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
          {children}
        </div>
        {bottom}
      </div>
    );
  }
  // Desktop: full-width top/bottom bars, content centered max-720.
  return (
    <div style={{
      width: "100%", height: "100%",
      background: contentBg,
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
      overflow: "hidden",
    }}>
      <div style={{ position: "relative" }}>{top}</div>
      <div style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        justifyContent: "center",
        padding: "0",
      }}>
        <div style={{
          width: "100%",
          maxWidth: 720,
          padding: "32px 24px 24px",
          display: "flex",
          flexDirection: "column",
        }}>
          {children}
        </div>
      </div>
      {bottom}
    </div>
  );
}

// ============ Top bar (logo + close X) ============
function SignerTopLogoBar({ mode = "mobile" }) {
  return (
    <header style={{
      height: 56,
      background: "var(--color-paper)",
      borderBottom: "1px solid var(--color-border-subtle)",
      display: "grid",
      gridTemplateColumns: "56px 1fr 56px",
      alignItems: "center",
      flexShrink: 0,
      backdropFilter: "blur(8px)",
    }}>
      <div />
      <div style={{ display: "grid", placeItems: "center" }}>
        <Wordmark size={18} />
      </div>
      <div style={{ display: "grid", placeItems: "center" }}>
        <button style={{
          width: 36, height: 36,
          background: "transparent",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          color: "var(--color-ink-muted)",
          display: "grid",
          placeItems: "center",
        }}>{I("x", 20, "currentColor")}</button>
      </div>
    </header>
  );
}

// ============ Top bar (stepper + close X) ============
function SignerTopStepperBar({ current = 1, mode = "mobile" }) {
  const steps = ["Review", "Sign", "Done"];
  return (
    <header style={{
      background: "var(--color-paper)",
      borderBottom: "1px solid var(--color-border-subtle)",
      flexShrink: 0,
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        height: 56,
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        padding: "0 14px 0 16px",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: mode === "mobile" ? 4 : 14, minWidth: 0 }}>
          {steps.map((s, i) => {
            const isDone = i < current;
            const isActive = i === current;
            return (
              <React.Fragment key={s}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  flexShrink: 0,
                }}>
                  <span style={{
                    width: 18, height: 18,
                    borderRadius: 999,
                    background: isActive
                      ? "var(--color-brand)"
                      : isDone
                      ? "var(--color-success-soft)"
                      : "var(--color-surface-sunken)",
                    color: isActive
                      ? "var(--color-ink-inverse)"
                      : isDone
                      ? "var(--color-success-strong)"
                      : "var(--color-ink-subtle)",
                    fontFamily: "var(--font-sans)",
                    fontSize: 10,
                    fontWeight: 600,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}>
                    {isDone ? I("check", 11, "currentColor", { strokeWidth: 3 }) : i + 1}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12.5,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--color-ink)" : "var(--color-ink-muted)",
                  }}>{s}</span>
                </span>
                {i < steps.length - 1 && (
                  <span style={{
                    width: mode === "mobile" ? 10 : 28,
                    height: 1,
                    background: isDone ? "var(--color-success)" : "var(--color-border)",
                    flexShrink: 0,
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <button style={{
          width: 36, height: 36,
          background: "transparent",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          color: "var(--color-ink-muted)",
          display: "grid", placeItems: "center",
        }}>{I("x", 20, "currentColor")}</button>
      </div>
      {/* progress bar */}
      <div style={{
        height: 3,
        background: "var(--color-surface-sunken)",
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: "40%",
          background: "var(--color-brand)",
          transition: "width var(--dur-2) var(--ease-out)",
        }} />
      </div>
      <div style={{
        padding: "8px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
      }}>
        <span style={{ color: "var(--color-ink-muted)" }}>
          <strong style={{ color: "var(--color-ink)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>2 of 5</strong> fields completed
        </span>
        <span style={{ color: "var(--color-ink-subtle)", display: "inline-flex", alignItems: "center", gap: 5 }}>
          {I("file-text", 12, "var(--color-ink-subtle)")} Service Agreement
        </span>
      </div>
    </header>
  );
}

// ============ Bottom bar — generic 64h sticky ============
function SignerBottomBar({ children, mode = "mobile" }) {
  const inner = (
    <div style={{
      maxWidth: mode === "mobile" ? "100%" : 720,
      margin: "0 auto",
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: mode === "mobile" ? "10px 16px" : "12px 24px",
      minHeight: 64,
    }}>{children}</div>
  );
  return (
    <footer style={{
      flexShrink: 0,
      background: "var(--color-surface)",
      borderTop: "1px solid var(--color-border)",
      boxShadow: "0 -1px 2px oklch(0.2 0.02 60 / 0.04)",
    }}>{inner}</footer>
  );
}

// ============ Hero Card ============
function HeroCard({ children, padding = "24px" }) {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      padding,
      boxShadow: "var(--shadow-1)",
    }}>{children}</div>
  );
}

// ============ Signer PDF view (page rendered with overlay fields) ============
function SignerPdfPage({ mode, scale = 1 }) {
  const w = mode === "mobile" ? 343 : 700;
  return (
    <div style={{
      width: w,
      aspectRatio: "8.5 / 11",
      background: "var(--color-surface-raised)",
      border: "1px solid var(--color-border)",
      borderRadius: 6,
      boxShadow: "var(--shadow-1)",
      padding: `${24 * scale}px ${32 * scale}px`,
      position: "relative",
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
      margin: "0 auto",
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 18 * scale,
        textAlign: "center",
        margin: 0,
      }}>Service Agreement</div>
      <div style={{
        fontFamily: "var(--font-mono)",
        fontSize: 8 * scale,
        textAlign: "center",
        color: "var(--color-ink-subtle)",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        marginTop: 4,
        marginBottom: 14 * scale,
      }}>Acme Holdings · 2026-Q1</div>
      {[
        "This Service Agreement is entered into as of the date last signed below between Acme Holdings, Inc. and the undersigned counterparty.",
        "1. Scope. Recipient shall perform the services in Schedule A in a professional and workmanlike manner.",
        "2. Compensation. Company shall pay Recipient the fees in Schedule B within thirty days of each invoice.",
        "3. Term. This Agreement shall commence on the Effective Date and continue until services are complete.",
        "4. Confidentiality. Each party shall hold in confidence all proprietary information of the other.",
      ].map((p, i) => (
        <p key={i} style={{
          fontSize: 8.5 * scale,
          lineHeight: 1.7,
          color: "var(--color-ink-muted)",
          margin: `0 0 ${8 * scale}px`,
        }}>{p}</p>
      ))}
      {/* Signature blocks at bottom */}
      <div style={{ position: "absolute", left: 32 * scale, right: 32 * scale, bottom: 32 * scale }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 * scale }}>
          <div>
            <div style={{
              borderTop: "1px solid var(--color-border-strong)",
              paddingTop: 4 * scale,
              fontFamily: "var(--font-mono)",
              fontSize: 7 * scale,
              color: "var(--color-ink-subtle)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>Signature</div>
          </div>
          <div>
            <div style={{
              borderTop: "1px solid var(--color-border-strong)",
              paddingTop: 4 * scale,
              fontFamily: "var(--font-mono)",
              fontSize: 7 * scale,
              color: "var(--color-ink-subtle)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}>Date</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Signer overlay field — empty / filled, with primary glow if required-empty ============
function SignerField({ x, y, w, h, type = "signature", state = "empty", value, label, required = true }) {
  // state: empty | filled | active
  const isEmpty = state === "empty";
  const isFilled = state === "filled";
  const isActive = state === "active";
  const ft = FIELD_TYPES.find(f => f.id === type) || FIELD_TYPES[0];

  const border = isFilled
    ? `1.5px solid var(--color-success)`
    : isActive
    ? `2px solid var(--color-brand)`
    : `1.5px dashed var(--color-brand)`;
  const bg = isFilled
    ? `var(--color-success-soft)`
    : isActive
    ? `var(--color-brand-soft)`
    : `color-mix(in oklch, var(--color-brand) 8%, var(--color-surface))`;
  const glow = (isEmpty && required) || isActive
    ? `0 0 0 4px oklch(0.665 0.155 38 / 0.18)`
    : "none";

  return (
    <div style={{
      position: "absolute",
      left: x, top: y, width: w, height: h,
      borderRadius: "var(--radius-xs)",
      border,
      background: bg,
      boxShadow: glow,
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "0 8px",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 500,
      color: isFilled ? "var(--color-success-strong)" : "var(--color-brand-strong)",
      overflow: "hidden",
    }}>
      {isFilled
        ? <>
            {I("check-circle-2", 13, "var(--color-success-strong)", { flexShrink: 0 })}
            <span style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontFamily: type === "signature" ? "var(--font-display)" : "var(--font-sans)",
              fontStyle: type === "signature" ? "italic" : "normal",
              fontSize: type === "signature" ? 16 : 11,
              color: "var(--color-success-strong)",
            }}>{value}</span>
          </>
        : <>
            {I(ft.icon, 13, "currentColor", { flexShrink: 0 })}
            <span style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flex: 1,
            }}>{label || ft.label}</span>
            {required && <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 700,
              color: "var(--color-brand-strong)",
              letterSpacing: "0.04em",
            }}>REQ</span>}
          </>
      }
    </div>
  );
}

// ============ Signature Pad (Dialog content) ============
function SignaturePad({ mode = "mobile" }) {
  return (
    <div style={{
      width: mode === "mobile" ? 343 : 480,
      background: "var(--color-surface-raised)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-3)",
      overflow: "hidden",
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        padding: "16px 18px 12px",
        borderBottom: "1px solid var(--color-border-subtle)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--color-ink)",
        }}>Add your signature</h3>
        <button style={{
          width: 28, height: 28,
          background: "transparent",
          border: "none",
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          color: "var(--color-ink-subtle)",
          display: "grid", placeItems: "center",
          marginTop: -3, marginRight: -6,
        }}>{I("x", 18, "currentColor")}</button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        padding: "0 18px",
        gap: 0,
        borderBottom: "1px solid var(--color-border-subtle)",
      }}>
        {[
          { id: "draw", label: "Draw", icon: "pen-tool", active: true },
          { id: "type", label: "Type", icon: "type" },
          { id: "upload", label: "Upload", icon: "upload" },
        ].map(t => (
          <button key={t.id} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "11px 10px",
            background: "transparent",
            border: "none",
            color: t.active ? "var(--color-ink)" : "var(--color-ink-muted)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: t.active ? 600 : 500,
            borderBottom: t.active ? "2px solid var(--color-brand)" : "2px solid transparent",
            marginBottom: -1,
            cursor: "pointer",
          }}>
            {I(t.icon, 14, "currentColor")}
            {t.label}
          </button>
        ))}
      </div>

      {/* Draw canvas with sample stroke */}
      <div style={{ padding: 18 }}>
        <div style={{
          height: mode === "mobile" ? 160 : 200,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* dotted baseline */}
          <div style={{
            position: "absolute",
            left: 16, right: 16,
            bottom: 36,
            height: 0,
            borderTop: "1px dashed var(--color-border-strong)",
          }} />
          <div style={{
            position: "absolute",
            left: 16, bottom: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            color: "var(--color-ink-faint)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}>Sign here</div>
          {/* Sample stroke — flowing cursive */}
          <svg
            viewBox="0 0 320 140"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <path
              d="M 30 95 C 36 70, 50 50, 58 70 S 60 100, 50 100 C 42 96, 62 80, 76 78 S 80 92, 92 82 C 100 76, 102 90, 110 84 C 120 76, 128 60, 142 70 C 156 80, 156 100, 142 100 C 132 98, 150 78, 168 80 S 172 92, 184 84 C 196 76, 196 60, 210 64 S 230 88, 218 100 C 208 102, 222 80, 240 80 S 260 100, 250 102 C 246 100, 260 78, 280 90"
              stroke="oklch(0.21 0.018 60)"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <button style={{
            position: "absolute",
            top: 10, right: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 9px",
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-ink-muted)",
            cursor: "pointer",
          }}>
            {I("rotate-ccw", 12, "currentColor")} Clear
          </button>
        </div>

        <label style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          marginTop: 14,
          fontFamily: "var(--font-sans)",
          fontSize: 12.5,
          color: "var(--color-ink-muted)",
          cursor: "pointer",
        }}>
          <Switch checked size="sm" />
          <span>Use this signature for all fields on this document</span>
        </label>
      </div>

      <div style={{
        padding: "12px 18px",
        borderTop: "1px solid var(--color-border-subtle)",
        display: "flex",
        gap: 10,
      }}>
        <Button variant="ghost" size="md" style={{ flex: 1 }}>Cancel</Button>
        <Button size="md" style={{ flex: 2 }}>Apply Signature</Button>
      </div>
    </div>
  );
}

// ============ Date Popover (mini calendar) ============
function DatePopover() {
  // March 2026, day 17 is selected, today's marker on day 24
  const days = [];
  for (let d = -3; d <= 31; d++) {
    days.push(d > 0 ? d : null);
  }
  const selectedDay = 17;
  const todayDay = 24;
  return (
    <div style={{
      width: 268,
      background: "var(--color-surface-raised)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-3)",
      padding: 14,
      fontFamily: "var(--font-sans)",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 13.5,
          fontWeight: 600,
          color: "var(--color-ink)",
        }}>March 2026</span>
        <div style={{ display: "flex", gap: 2 }}>
          <button style={{
            width: 26, height: 26,
            background: "transparent",
            border: "none",
            borderRadius: 4,
            color: "var(--color-ink-muted)",
            display: "grid", placeItems: "center",
            cursor: "pointer",
          }}>{I("chevron-left", 14, "currentColor")}</button>
          <button style={{
            width: 26, height: 26,
            background: "transparent",
            border: "none",
            borderRadius: 4,
            color: "var(--color-ink-muted)",
            display: "grid", placeItems: "center",
            cursor: "pointer",
          }}>{I("chevron-right", 14, "currentColor")}</button>
        </div>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2,
        marginBottom: 4,
      }}>
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <div key={i} style={{
            textAlign: "center",
            fontFamily: "var(--font-sans)",
            fontSize: 10.5,
            fontWeight: 600,
            color: "var(--color-ink-subtle)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            padding: "4px 0",
          }}>{d}</div>
        ))}
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: 2,
      }}>
        {days.map((d, i) => {
          if (!d) return <div key={i} style={{ height: 30 }} />;
          const isSelected = d === selectedDay;
          const isToday = d === todayDay;
          return (
            <button key={i} style={{
              height: 30,
              background: isSelected ? "var(--color-brand)" : "transparent",
              color: isSelected ? "var(--color-ink-inverse)" : "var(--color-ink)",
              border: "none",
              borderRadius: 6,
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              fontWeight: isSelected || isToday ? 600 : 500,
              cursor: "pointer",
              fontVariantNumeric: "tabular-nums",
              position: "relative",
            }}>
              {d}
              {isToday && !isSelected && (
                <span style={{
                  position: "absolute",
                  bottom: 4, left: "50%",
                  transform: "translateX(-50%)",
                  width: 3, height: 3,
                  borderRadius: 999,
                  background: "var(--color-brand)",
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============ Open Dropdown (3 options) ============
function OpenDropdown({ options = ["California", "New York", "Washington"], selected = "California" }) {
  return (
    <div style={{
      width: 280,
      background: "var(--color-surface-raised)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-3)",
      padding: 6,
      fontFamily: "var(--font-sans)",
    }}>
      {options.map(o => {
        const isSel = o === selected;
        return (
          <button key={o} style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "9px 10px",
            background: isSel ? "var(--color-brand-soft)" : "transparent",
            color: isSel ? "var(--color-brand-strong)" : "var(--color-ink)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            fontFamily: "var(--font-sans)",
            fontSize: 13.5,
            fontWeight: isSel ? 600 : 500,
            cursor: "pointer",
            textAlign: "left",
          }}>
            <span style={{ flex: 1 }}>{o}</span>
            {isSel && I("check", 14, "var(--color-brand-strong)", { strokeWidth: 2.5 })}
          </button>
        );
      })}
    </div>
  );
}

// ============ Status-bar imitation (mobile device frame top) ============
function DeviceStatusBar() {
  return (
    <div style={{
      height: 24,
      flexShrink: 0,
      background: "var(--color-paper)",
      borderBottom: "1px solid var(--color-border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 18px",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--color-ink)",
    }}>
      <span style={{ fontFeatureSettings: '"tnum"' }}>9:41</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        {I("signal", 12, "var(--color-ink)")}
        {I("wifi", 12, "var(--color-ink)")}
        <span style={{
          width: 18, height: 9,
          border: "1.2px solid var(--color-ink)",
          borderRadius: 2,
          position: "relative",
          padding: 1,
        }}>
          <span style={{
            display: "block", width: "85%", height: "100%",
            background: "var(--color-ink)",
            borderRadius: 1,
          }} />
        </span>
      </span>
    </div>
  );
}

Object.assign(window, {
  SignerShell, SignerTopLogoBar, SignerTopStepperBar, SignerBottomBar,
  HeroCard, SignerPdfPage, SignerField, SignaturePad, DatePopover,
  OpenDropdown, DeviceStatusBar,
});
