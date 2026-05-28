// =============================================================
// 10 — System States · frames
// Each frame is self-contained. The host lays them out in a 3-col grid.
// =============================================================

// ============ 1. 404 ============
function NotFoundFrame() {
  return (
    <AppShell active="Documents">
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "var(--color-paper)",
      }}>
        <EmptyState
          icon={<Illust404 />}
          title="We couldn't find that page"
          body="It may have been deleted, or the link is broken. Check the URL, or head back to your documents."
          action={<Button icon="arrow-right">Go to Documents</Button>}
        />
        <div style={{
          marginTop: 28,
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          color: "var(--color-ink-faint)",
          letterSpacing: "0.04em",
        }}>
          /documents/8f2c-1d4b · 404
        </div>
      </div>
    </AppShell>
  );
}

// ============ 2. 500 ============
function ServerErrorFrame() {
  return (
    <AppShell active="Documents">
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "var(--color-paper)",
      }}>
        <EmptyState
          icon={<Illust500 />}
          title="Something went wrong"
          body="We hit an unexpected error. Our team has been notified and is on it."
          action={
            <div style={{ display: "flex", gap: 10 }}>
              <Button icon="rotate-cw">Try Again</Button>
              <Button variant="ghost">Go to Documents</Button>
            </div>
          }
        />
        <div style={{
          marginTop: 28,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 999,
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          color: "var(--color-ink-subtle)",
        }}>
          {I("hash", 11, "var(--color-ink-faint)")}
          error · req_7a4f9c2e · 2026-05-27 14:31 UTC
        </div>
      </div>
    </AppShell>
  );
}

// ============ 3. Offline ============
function OfflineFrame() {
  // Mini documents list rendered dimmed below the banner
  const ROWS = [
    { name: "Mutual NDA · Acme × Northwind",        meta: "2 pages · sent",     status: "Pending"   },
    { name: "Vendor MSA · Brightway Print",         meta: "12 pages · sent",    status: "Pending"   },
    { name: "Q1 Contractor Onboarding · Caleb M.",  meta: "4 pages · draft",    status: "Draft"     },
    { name: "Speaking agreement · Sana Ortiz",      meta: "3 pages · signed",   status: "Completed" },
    { name: "Photography release · Lumen Studio",   meta: "1 page · sent",      status: "Pending"   },
  ];
  return (
    <AppShell active="Documents">
      <OfflineBanner />
      <div style={{
        flex: 1,
        overflow: "hidden",
        opacity: 0.55,
        pointerEvents: "none",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* page header (faded) */}
        <div style={{
          padding: "24px 32px 16px",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: 24,
              fontWeight: 600,
              color: "var(--color-ink)",
              letterSpacing: "-0.015em",
            }}>Documents</h2>
            <p style={{
              margin: "4px 0 0",
              fontFamily: "var(--font-sans)",
              fontSize: 13.5,
              color: "var(--color-ink-subtle)",
            }}>Cached view · 12 documents</p>
          </div>
          <Button icon="upload">Send a document</Button>
        </div>

        {/* toolbar */}
        <div style={{
          padding: "0 32px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <div style={{
            width: 320,
            height: 36,
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "0 12px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
          }}>
            {I("search", 15, "var(--color-ink-subtle)")}
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, color: "var(--color-ink-faint)" }}>
              Search documents…
            </span>
          </div>
        </div>

        {/* mini list */}
        <div style={{ padding: "0 32px" }}>
          <div style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
          }}>
            {ROWS.map((r, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 130px",
                gap: 14,
                padding: "14px 18px",
                alignItems: "center",
                borderBottom: i === ROWS.length - 1 ? "none" : "1px solid var(--color-border-subtle)",
              }}>
                <div style={{
                  width: 28, height: 36,
                  background: "var(--color-surface-raised)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 2,
                }} />
                <div>
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-ink)",
                  }}>{r.name}</div>
                  <div style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 12.5,
                    color: "var(--color-ink-subtle)",
                    marginTop: 2,
                  }}>{r.meta}</div>
                </div>
                <span style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--color-ink-muted)",
                  textAlign: "right",
                }}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// ============ 4. Expired signing link (375×812) ============
function ExpiredLinkFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--color-paper)",
      fontFamily: "var(--font-sans)",
      color: "var(--color-ink)",
      overflow: "hidden",
    }}>
      {/* sticky top — brand + close */}
      <header style={{
        height: 56,
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 18px",
        gap: 12,
        flexShrink: 0,
      }}>
        <Wordmark size={20} />
        <div style={{ flex: 1 }} />
        <button style={{
          width: 36, height: 36,
          background: "transparent",
          border: "1px solid transparent",
          borderRadius: "var(--radius-sm)",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          color: "var(--color-ink-muted)",
        }}>
          {I("x", 20, "currentColor")}
        </button>
      </header>

      {/* content */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 28px",
        textAlign: "center",
      }}>
        <IllustExpired />
        <h3 style={{
          margin: "20px 0 8px",
          fontFamily: "var(--font-sans)",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: "-0.01em",
          color: "var(--color-ink)",
        }}>This signing link has expired</h3>
        <p style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          lineHeight: 1.5,
          color: "var(--color-ink-muted)",
          maxWidth: 280,
        }}>Ask the sender to send a new invitation — links stay valid for 14 days.</p>

        {/* details strip */}
        <div style={{
          marginTop: 20,
          padding: "10px 14px",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-subtle)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          maxWidth: 280,
        }}>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--color-ink-subtle)" }}>Document</div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, color: "var(--color-ink)" }}>
              Mutual NDA · Acme × Northwind
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--color-ink-faint)",
        }}>expired May 13, 2026</div>

        <div style={{ marginTop: 24, width: "100%", maxWidth: 280 }}>
          <Button variant="secondary" block icon="mail">Contact the sender</Button>
        </div>
      </main>

      <footer style={{
        padding: "16px 24px",
        textAlign: "center",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--color-ink-subtle)",
        borderTop: "1px solid var(--color-border-subtle)",
      }}>
        Need help? <a href="#" style={{ color: "var(--color-brand-strong)", textDecoration: "none", fontWeight: 500 }}>support@esign.app</a>
      </footer>
    </div>
  );
}

// ============ 5. Session expired (1440×900 · Auth Split) ============
function SessionExpiredFrame() {
  return (
    <AuthSplit
      brand={<BrandPanel variant="default" />}
      formWidth={440}
    >
      <FormPanel width={400}>
        <div style={{
          width: 64, height: 64,
          borderRadius: 999,
          background: "var(--color-warning-soft)",
          color: "var(--color-warning-strong)",
          display: "grid",
          placeItems: "center",
          marginBottom: 20,
        }}>
          {I("log-out", 28, "currentColor")}
        </div>
        <FormHeading
          title={<>You've been signed out</>}
          body="For your security, we signed you out after 30 minutes of inactivity. Sign in again to pick up where you left off."
        />

        {/* prefilled email row, like a remembered account */}
        <div style={{
          marginTop: 4,
          marginBottom: 16,
          padding: "12px 14px",
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <Avatar initials="BP" size={36} color="var(--color-brand)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: 500, color: "var(--color-ink)" }}>
              Brijal Patel
            </div>
            <div style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--color-ink-subtle)" }}>
              brijal@northbeam.io
            </div>
          </div>
          <a href="#" style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12.5,
            fontWeight: 500,
            color: "var(--color-brand-strong)",
            textDecoration: "none",
          }}>Switch</a>
        </div>

        <Button block size="lg" iconRight="arrow-right">Sign In Again</Button>

        <div style={{
          marginTop: 18,
          textAlign: "center",
          fontFamily: "var(--font-sans)",
          fontSize: 12.5,
          color: "var(--color-ink-subtle)",
        }}>
          Session timeout can be adjusted in
          {" "}<a href="#" style={{ color: "var(--color-ink)", textDecoration: "underline", textDecorationColor: "var(--color-border-strong)", textUnderlineOffset: 3 }}>workspace security settings</a>.
        </div>
      </FormPanel>
    </AuthSplit>
  );
}

// ============ 6. Loading skeletons (composed) ============
function SkeletonSubLabel({ children }) {
  return (
    <div style={{
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      color: "var(--color-ink-faint)",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      padding: "0 0 8px",
    }}>{children}</div>
  );
}

function DocumentsListSkeleton() {
  return (
    <div>
      <SkeletonSubLabel>a · Documents list — toolbar + 6 ghost rows</SkeletonSubLabel>
      {/* real-feeling toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderTopLeftRadius: "var(--radius-md)",
        borderTopRightRadius: "var(--radius-md)",
        borderBottom: "none",
      }}>
        <div style={{
          width: 280, height: 32,
          display: "flex", alignItems: "center", gap: 9,
          padding: "0 12px",
          background: "var(--color-surface-sunken)",
          borderRadius: "var(--radius-sm)",
        }}>
          {I("search", 14, "var(--color-ink-faint)")}
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--color-ink-faint)" }}>Search documents…</span>
        </div>
        <Skeleton width={92} height={32} radius={6} />
        <Skeleton width={92} height={32} radius={6} />
        <div style={{ flex: 1 }} />
        <Skeleton width={120} height={32} radius={6} />
      </div>
      {/* 6 ghost rows */}
      <div style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderTop: "none",
        borderBottomLeftRadius: "var(--radius-md)",
        borderBottomRightRadius: "var(--radius-md)",
        overflow: "hidden",
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "16px 32px 1fr 140px 90px 90px 24px",
            gap: 14,
            padding: "13px 16px",
            alignItems: "center",
            borderBottom: i === 5 ? "none" : "1px solid var(--color-border-subtle)",
          }}>
            <Skeleton width={16} height={16} radius={3} />
            <Skeleton width={28} height={32} radius={3} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <Skeleton width={`${55 + (i * 7) % 30}%`} height={11} radius={3} />
              <Skeleton width={`${28 + (i * 11) % 22}%`} height={9} radius={3} />
            </div>
            <Skeleton width={"82%"} height={10} radius={3} />
            <Skeleton width={68} height={20} radius={999} />
            <Skeleton width={66} height={10} radius={3} />
            <Skeleton width={18} height={18} radius={3} />
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div>
      <SkeletonSubLabel>b · Editor — sidebar chips + PDF canvas</SkeletonSubLabel>
      <div style={{
        display: "grid",
        gridTemplateColumns: "260px 1fr",
        gap: 12,
        height: 280,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
      }}>
        {/* sidebar */}
        <div style={{
          padding: 16,
          background: "var(--color-surface-raised)",
          borderRight: "1px solid var(--color-border-subtle)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}>
          <Skeleton width={"60%"} height={12} radius={3} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Skeleton width={"100%"} height={48} radius={6} />
            <Skeleton width={"100%"} height={48} radius={6} />
          </div>
          <Skeleton width={"50%"} height={11} radius={3} />
          {/* field-type chip ghosts (3x2 grid) */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 6,
          }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} width={"100%"} height={36} radius={6} />
            ))}
          </div>
        </div>
        {/* canvas */}
        <div style={{
          padding: 18,
          background: "var(--color-surface-sunken)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Skeleton width={120} height={10} radius={3} />
            <div style={{ flex: 1 }} />
            <Skeleton width={28} height={28} radius={6} />
            <Skeleton width={60} height={28} radius={6} />
            <Skeleton width={28} height={28} radius={6} />
          </div>
          <Skeleton width={"100%"} height={"100%"} radius={6} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div>
      <SkeletonSubLabel>c · Dashboard — 4 KPI cards + chart</SkeletonSubLabel>
      {/* 4 KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            padding: 16,
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            <Skeleton width={"50%"} height={10} radius={3} />
            <Skeleton width={"70%"} height={26} radius={4} />
            <Skeleton width={"40%"} height={12} radius={999} />
          </div>
        ))}
      </div>
      {/* chart area */}
      <div style={{
        padding: 18,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Skeleton width={140} height={14} radius={3} />
          <div style={{ flex: 1 }} />
          <Skeleton width={200} height={28} radius={6} />
        </div>
        {/* ghost chart with implied bars/line */}
        <div style={{
          height: 160,
          position: "relative",
          padding: "12px 0",
        }}>
          {/* gridlines */}
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              position: "absolute",
              left: 0, right: 0,
              top: `${(i / 3) * 100}%`,
              borderTop: "1px dashed var(--color-border-subtle)",
            }} />
          ))}
          {/* ghost area block */}
          <div style={{
            position: "absolute",
            inset: "20px 0 0 0",
            background: "linear-gradient(180deg, var(--color-surface-sunken) 0%, transparent 100%)",
            borderRadius: 4,
          }} />
        </div>
      </div>
    </div>
  );
}

function LoadingSkeletonsFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      padding: 28,
      overflow: "auto",
      fontFamily: "var(--font-sans)",
      display: "flex",
      flexDirection: "column",
      gap: 22,
    }}>
      <DocumentsListSkeleton />
      <EditorSkeleton />
      <DashboardSkeleton />
    </div>
  );
}

// ============ 7. Toast variants ============
function ToastVariantsFrame() {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 14,
      fontFamily: "var(--font-sans)",
    }}>
      <Toast variant="success" title="Document sent" body="2 signers will receive an email." />
      <Toast variant="error"   title="Couldn't send"  body="Try again, or check your connection." />
      <Toast variant="info"    title="Saving…"        body="Your changes are syncing." />

      {/* With action — Undo */}
      <div style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0,
        padding: "12px 4px 12px 14px",
        background: "var(--color-ink)",
        color: "var(--color-ink-inverse)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-2)",
        maxWidth: 360,
      }}>
        {I("check-circle-2", 18, "oklch(0.85 0.14 150)", { marginTop: 1, marginRight: 10 })}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>1 document moved to <span style={{ fontWeight: 600 }}>Archive</span></div>
        </div>
        <button style={{
          background: "transparent",
          border: "none",
          color: "oklch(0.92 0.05 38)",
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 600,
          padding: "0 12px",
          cursor: "pointer",
          letterSpacing: "0.02em",
        }}>Undo</button>
        <button style={{
          width: 28,
          background: "transparent",
          border: "none",
          color: "color-mix(in srgb, var(--color-paper) 50%, transparent)",
          cursor: "pointer",
          display: "grid",
          placeItems: "center",
        }}>{I("x", 14, "currentColor")}</button>
      </div>
    </div>
  );
}

// ============ 8. Inline form errors ============
function InlineErrorsFrame() {
  const items = [
    { label: "Email",    value: "elena@",                              hint: "Enter a valid email address.",     icon: "mail" },
    { label: "Password", value: "secret",                              hint: "Must be at least 8 characters.",   type: "password" },
    { label: "Full name",value: "",                                    hint: "This field is required.",          required: true },
    { label: "Bio",      value: "A short blurb that ran over the limit by quite a few characters and the system caught it before submission could happen.",
      hint: "Maximum 120 characters.", counter: { current: 158, max: 120 } },
  ];

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "var(--color-paper)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 18,
      fontFamily: "var(--font-sans)",
    }}>
      {items.map((it, i) => (
        <div key={i}>
          <div style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 6,
          }}>
            <label style={{
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              fontWeight: 500,
              color: "var(--color-ink)",
            }}>
              {it.label}
              {it.required && <span style={{ color: "var(--color-danger)", marginLeft: 3 }}>*</span>}
            </label>
            {it.counter && (
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                color: "var(--color-danger-strong)",
                fontVariantNumeric: "tabular-nums",
              }}>{it.counter.current} / {it.counter.max}</span>
            )}
          </div>
          <Input
            icon={it.icon}
            type={it.type || "text"}
            value={it.value}
            state="error"
            placeholder={it.label}
            trailing={I("alert-circle", 15, "var(--color-danger-strong)")}
          />
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginTop: 6,
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-danger-strong)",
          }}>
            {I("alert-circle", 12, "currentColor")}
            <span>{it.hint}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  NotFoundFrame, ServerErrorFrame, OfflineFrame,
  ExpiredLinkFrame, SessionExpiredFrame,
  LoadingSkeletonsFrame, ToastVariantsFrame, InlineErrorsFrame,
});
