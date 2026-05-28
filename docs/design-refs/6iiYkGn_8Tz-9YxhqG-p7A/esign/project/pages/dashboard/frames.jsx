// =============================================================
// 07 — Dashboard · frames (Main, Empty, Status Drill-down)
// =============================================================

// ============ Page header (h2 + RangeTabs) ============
function DashHeader({ rangeActive = "30 days", actions }) {
  return (
    <div style={{
      padding: "28px 32px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 32,
      flexWrap: "wrap",
    }}>
      <div>
        <h2 style={{
          margin: 0,
          fontFamily: "var(--font-sans)",
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: "-0.015em",
          color: "var(--color-ink)",
          lineHeight: 1.15,
        }}>Dashboard</h2>
        <div style={{
          marginTop: 4,
          fontSize: 13,
          color: "var(--color-ink-subtle)",
          fontFamily: "var(--font-sans)",
        }}>Sending activity across your workspace · Feb 11 → Mar 12, 2026</div>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <RangeTabs active={rangeActive} />
        {actions}
      </div>
    </div>
  );
}

// ============ Body wrapper (scroll region + grid gutters) ============
function DashBody({ children }) {
  return (
    <div style={{
      flex: 1,
      overflow: "auto",
      padding: "8px 32px 32px",
      display: "flex",
      flexDirection: "column",
      gap: 18,
    }}>
      {children}
    </div>
  );
}

// ============ KPI Strip (4 cards) ============
function KpiStrip() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 16,
    }}>
      <KpiCard label="Total Sent"        value="1,284"    delta="+12%"      deltaTone="success" deltaSuffix="vs last period" />
      <KpiCard label="Completed"          value="892"      delta="+8%"       deltaTone="success" deltaSuffix="vs last period" />
      <KpiCard label="Pending"            value="267"      delta="−3%"       deltaTone="warning" deltaSuffix="vs last period" />
      <KpiCard label="Avg. Time to Sign"  value="1.4 days" delta="−0.2 days" deltaTone="success" deltaSuffix="faster" />
    </div>
  );
}

// ============ Sending Volume + Status Breakdown row ============
function ChartsRow({ donutHighlight = null }) {
  const total = STATUS_SLICES.reduce((s, x) => s + x.count, 0);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "8fr 4fr",
      gap: 16,
    }}>
      {/* Sending Volume */}
      <DashCard
        title="Sending Volume"
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              color: "var(--color-ink-muted)",
            }}>
              <span style={{
                width: 10, height: 10,
                background: "var(--color-brand)",
                borderRadius: 2,
              }} />
              Documents sent · daily
            </span>
            <IconButton icon="more-horizontal" size={28} variant="ghost" />
          </div>
        }
      >
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <LineChart data={VOLUME_30} height={240} />
        </div>
      </DashCard>

      {/* Status Breakdown */}
      <DashCard
        title="Status Breakdown"
        action={
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-ink-subtle)",
          }}>1,284 total</span>
        }
      >
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: 14,
          flex: 1,
        }}>
          <div style={{ display: "grid", placeItems: "center", padding: "6px 0 2px" }}>
            <DonutChart
              slices={STATUS_SLICES}
              size={160}
              thickness={22}
              highlight={donutHighlight}
              centerLabel={donutHighlight
                ? STATUS_SLICES.find(s => s.key === donutHighlight)?.count.toLocaleString()
                : "1,284"}
              centerSub={donutHighlight
                ? STATUS_SLICES.find(s => s.key === donutHighlight)?.label
                : "documents"}
            />
          </div>
          <DonutLegend slices={STATUS_SLICES} total={total} highlight={donutHighlight} />
        </div>
      </DashCard>
    </div>
  );
}

// ============ Recent Activity card (compact, no Table header) ============
function RecentActivityCard() {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-1)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "16px 20px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--color-ink)",
          }}>Recent Activity</h3>
          <div style={{
            marginTop: 2,
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            color: "var(--color-ink-subtle)",
          }}>Last 24 hours across all documents</div>
        </div>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--color-ink-subtle)",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 8px",
          background: "var(--color-success-soft)",
          color: "var(--color-success-strong)",
          borderRadius: 999,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-success)" }} />
          Live
        </span>
      </div>
      <div style={{ borderTop: "1px solid var(--color-border)" }}>
        {/* spacer row to absorb the borderTop on first ActivityRow */}
      </div>
      <div>
        {ACTIVITY.map((a, i) => (
          <ActivityRow key={i} {...a} />
        ))}
      </div>
      <div style={{
        padding: "12px 20px",
        borderTop: "1px solid var(--color-border-subtle)",
        background: "var(--color-surface-sunken)",
      }}>
        <a href="#" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-brand-strong)",
          textDecoration: "none",
        }}>
          View all activity {I("arrow-right", 14, "currentColor")}
        </a>
      </div>
    </div>
  );
}

// ============ FRAME 1 — Dashboard main ============
function DashboardMainFrame() {
  return (
    <AppShell active="Dashboard">
      <DashHeader rangeActive="30 days" />
      <DashBody>
        <KpiStrip />
        <ChartsRow />
        <RecentActivityCard />
      </DashBody>
    </AppShell>
  );
}

// ============ FRAME 2 — Empty / first-time ============
function DashboardEmptyFrame() {
  return (
    <AppShell active="Dashboard">
      <DashHeader rangeActive="30 days" />
      <div style={{
        flex: 1,
        overflow: "auto",
        padding: "8px 32px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}>
        {/* Disabled-looking KPI ghosts so the page has structure */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          opacity: 0.55,
        }}>
          {["Total Sent", "Completed", "Pending", "Avg. Time to Sign"].map(label => (
            <div key={label} style={{
              background: "var(--color-surface)",
              border: "1px dashed var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "18px 20px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                color: "var(--color-ink-subtle)",
                fontWeight: 500,
              }}>{label}</div>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 32,
                fontWeight: 600,
                color: "var(--color-ink-faint)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}>—</div>
              <div style={{
                height: 18,
                width: 84,
                borderRadius: 999,
                background: "var(--color-surface-sunken)",
              }} />
            </div>
          ))}
        </div>

        {/* Empty state card */}
        <div style={{
          flex: 1,
          minHeight: 380,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <EmptyState
            icon={<BarChartIllustration />}
            title="No data to show yet"
            body="Send your first document to see analytics here. Volume, completion rate, and signer activity will populate within seconds of your first send."
            action={
              <div style={{ display: "flex", gap: 10 }}>
                <Button icon="upload">Upload a PDF &amp; Sign</Button>
                <Button variant="secondary" icon="bookmark">Use a template</Button>
              </div>
            }
          />
        </div>
      </div>
    </AppShell>
  );
}

// ============ Pending Documents table (drill-down) ============
function PendingDocsCard() {
  return (
    <div style={{
      background: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      boxShadow: "var(--shadow-1)",
      overflow: "hidden",
    }}>
      {/* Card header */}
      <div style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        borderBottom: "1px solid var(--color-border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h3 style={{
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--color-ink)",
            letterSpacing: "-0.005em",
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}>
            <span style={{
              fontFamily: "var(--font-sans)",
              fontVariantNumeric: "tabular-nums",
              color: "var(--color-brand-strong)",
            }}>267</span>
            Pending Documents
          </h3>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "2px 9px",
            borderRadius: 999,
            background: "var(--color-info-soft)",
            color: "var(--color-info-strong)",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--color-info)" }} />
            Filter: Pending
            {I("x", 12, "currentColor", { marginLeft: 1, cursor: "pointer" })}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <DropdownTrigger label="Sort: Oldest first" icon="arrow-down-narrow-wide" />
          <Button variant="secondary" size="sm" icon="bell">Remind all</Button>
          <Button variant="secondary" size="sm" icon="download">Export</Button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        display: "grid",
        gridTemplateColumns: PENDING_COLS.template,
        gap: 14,
        padding: "11px 20px",
        background: "var(--color-surface-sunken)",
        borderBottom: "1px solid var(--color-border)",
        alignItems: "center",
      }}>
        {PENDING_COLS.labels.map((label, i) => (
          <div key={i} style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-ink-subtle)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>{label}</div>
        ))}
      </div>

      {PENDING_DOCS.map((d, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: PENDING_COLS.template,
          gap: 14,
          padding: "12px 20px",
          alignItems: "center",
          borderBottom: i === PENDING_DOCS.length - 1 ? "none" : "1px solid var(--color-border-subtle)",
        }}>
          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            color: "var(--color-ink-muted)",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}>{d.sent}</div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <PdfThumb />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--color-ink)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>{d.name}</div>
              <div style={{
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                color: "var(--color-ink-subtle)",
                marginTop: 2,
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
          }}>{d.waiting}</div>

          <div style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            color: parseInt(d.aging) >= 8 ? "var(--color-danger-strong)"
              : parseInt(d.aging) >= 5 ? "var(--color-warning-strong)"
              : "var(--color-ink-muted)",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}>{d.aging}</div>

          <RowKebab />
        </div>
      ))}

      <div style={{
        padding: "12px 20px",
        borderTop: "1px solid var(--color-border-subtle)",
        background: "var(--color-surface-sunken)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          color: "var(--color-ink-muted)",
        }}>
          Showing <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>1–8</span> of <span style={{ color: "var(--color-ink)", fontWeight: 500 }}>267</span>
        </span>
        <a href="#" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-brand-strong)",
          textDecoration: "none",
        }}>
          See all 267 pending {I("arrow-right", 14, "currentColor")}
        </a>
      </div>
    </div>
  );
}

// ============ FRAME 3 — Status drill-down ============
function DashboardDrilldownFrame() {
  return (
    <AppShell active="Dashboard">
      <DashHeader
        rangeActive="30 days"
        actions={
          <Button variant="secondary" size="md" icon="x-circle">Clear drill-down</Button>
        }
      />
      <DashBody>
        <KpiStrip />
        <ChartsRow donutHighlight="pending" />
        <PendingDocsCard />
      </DashBody>
    </AppShell>
  );
}

Object.assign(window, {
  DashHeader, DashBody, KpiStrip, ChartsRow, RecentActivityCard,
  PendingDocsCard,
  DashboardMainFrame, DashboardEmptyFrame, DashboardDrilldownFrame,
});
