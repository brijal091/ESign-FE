# Dashboard Design System

_Started 2026-05-26 13:45 UTC_

---

## User

On the page "07 — Dashboard", create the following frames using App Shell. Reuse Card, Badge, Avatar, Table (compact), Button, Tabs, Empty State, Status Dot.

1. Dashboard — Main
   - Page header: h2 "Dashboard" + date range Tabs (Today · 7 days · 30 days · 90 days · Custom)
   - 4 KPI Cards in a 4-column grid:
     · "Total Sent" — h2 "1,284", caption "+12% vs last period" (success)
     · "Completed" — h2 "892", caption "+8%"
     · "Pending" — h2 "267", caption "−3%" (warning)
     · "Avg. Time to Sign" — h2 "1.4 days", caption "−0.2 days"
   - Second row:
     · Left 8/12: Card "Sending Volume" — line chart over 30 days, primary stroke + soft area fill, gridlines, x-axis day labels
     · Right 4/12: Card "Status Breakdown" — donut chart, 5 slices using status colors; legend list with count per status
   - Full-width Card "Recent Activity" — compact Table (no header) with 8 rows; each row: Status Dot + body actor name + caption action ("signed", "viewed", "sent") + caption truncated document name + caption time ("2m ago")
   - "View all activity →" link footer

2. Dashboard — Empty / first-time
   - Same shell + header
   - Empty State: bar-chart illustration, h3 "No data to show yet", body "Send your first document to see analytics here.", Primary "Upload a PDF & Sign"

3. Dashboard — Status drill-down
   - Same as frame 1, but the donut has "Pending" slice highlighted (others dimmed)
   - Below: populated Table filtered to pending only, titled "267 Pending Documents"

## Assistant

_[tool: list_files]_

_[tool: list_files]_

## User

continue

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: grep]_

_[tool: update_todos]_

Got it. Let me build the Dashboard page. I'll create dashboard atoms + frames, then a host HTML.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: done]_

_[tool: str_replace_edit]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Three dashboard frames built on App Shell, dropped onto the design canvas:

- **07.01 Main** — Page header (h2 + RangeTabs at "30 days") · 4-col KPI strip (Total Sent / Completed / Pending / Avg. Time to Sign with success/warning delta badges) · 8/4 split chart row (smooth-Bezier line chart with area fill + value pill on the last point, 5-slice donut with status-colored legend) · full-width Recent Activity card (8 compact rows, status dot + actor + caption action + truncated doc + time, "View all activity →" footer).
- **07.02 Empty** — Same shell + header, KPI cards rendered as dashed placeholders, big empty-state card with a bar-chart illustration (5 ascending bars in status colors), headline + body + primary "Upload a PDF & Sign".
- **07.03 Drill-down** — Donut emphasises the Pending slice (others dim, center label flips to 267 · Pending · To Sign); activity feed is replaced by a "267 Pending Documents" Table with sent/document/signers/status/waiting-on/aging columns and ageing-tinted text.

The donut legend totals 1,284 to match Total Sent (892 + 267 + 78 + 25 + 22).

