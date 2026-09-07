# Architecture Context — MPLADS Sentinel (SIH26102)

> NOTE: This file corrects the old Next.js placeholder content. The real stack is **TanStack Start** (see `admin-dashboard/AGENTS.md`, the source of truth for framework rules).

## Stack (actual, verified in `admin-dashboard/package.json`)

| Layer | Technology | Role |
|-------|-----------|------|
| Framework | TanStack Start + TanStack Router (file-based) + React 19 + TypeScript strict | SSR app, routes under `src/routes/` |
| UI | Tailwind CSS v4 + shadcn `base-nova` (61 local primitives in `src/components/ui/`) | Styling + components (justify with tokens, never raw colors) |
| Charts | recharts via `src/components/ui/chart.tsx` wrapper | KPI sparklines, bars, lines, pies, funnel — copy existing usages |
| Maps | d3-geo + topojson-client, SVG pattern in `logistics/-components/shipment-route-map.tsx` | Base for India state/district risk choropleth (India TopoJSON data NOT yet in repo — must add) |
| Tables | TanStack Table, pattern: `columns.tsx` + `schema.ts` + `table.tsx` + `data.json` | Works queue, evidence lists, activity log |
| Forms | React Hook Form + Zod | Login, upload, officer notes, filters |
| State | Zustand `stores/preferences/` (theme/layout only) | No domain stores yet — dossier/AI state to design |
| Server | TanStack `createServerFn` in `src/server/` (today: only cookie/preference fns) | Future: works/anomaly/evidence APIs behind same shapes as mock data |
| Misc in-repo | FullCalendar (`calendar/`), dnd-kit kanban, cmdk command/search, `date-range-picker` | Donor components; most stay OUT of MVP |
| Validation cmds | `npm run lint` / `check` / `build` (Biome) — run only when user explicitly requests | Per `admin-dashboard/AGENTS.md` |

## Frontend structure — colocation (actual)

```
admin-dashboard/src/
├── routes/
│   ├── __root.tsx                  # Root document shell + providers
│   ├── (main)/dashboard/route.tsx   # Dashboard shell: sidebar + header + <Outlet/>
│   ├── (main)/dashboard/<screen>/route.tsx   # Screen: SMALL, composes -components/
│   ├── (main)/dashboard/<screen>/-components/ # Screen-owned UI + data.ts (excluded from routing by `-` prefix)
│   ├── (main)/chat/  (main)/mail/  # Standalone app routes (AI + inbox donors)
│   └── (main)/auth/                # Login/register screens (reuse for /login)
├── components/ui/                  # 61 LOCAL shadcn primitives — NEVER MODIFY (per AGENTS.md)
├── components/calendar/            # FullCalendar wrapper — NEVER MODIFY
├── navigation/sidebar/sidebar-items.ts  # Sidebar nav — EDIT to install MVP nav
├── hooks/  lib/  config/  data/    # utils, preferences, app-config, demo users
├── stores/preferences/             # Theme/layout persistence (cookie-backed server fns)
├── server/server-actions.ts        # createServerFn fns (today: prefs only)
├── styles/styles.css + presets/    # OKLCH tokens; presets: neutral default, tangerine, brutalist, soft-pop
└── routeTree.gen.ts                # GENERATED — never edit by hand
```

Route groups `(main)`/`(external)`/`(legacy)` are organizational (no URL segments). `$param.tsx` = dynamic segment (`/works/:workId` pattern lives here). **Do not use `(legacy)/*` as reference for new screens.**

## MVP mapping — template → our 5 routes

| Our route | Build from (donor → adaptation) |
|-----------|----------------------------------|
| `/login` | `(main)/auth/` v1/v2 screens as-is; wire officer roles later |
| `/overview` | `default/` KPI cards + `performance-overview` chart + NEW India choropleth (clone `shipment-route-map.tsx` pattern + add India TopoJSON) + priority queue = top-N anomaly table |
| `/works` | `crm/` opportunities-table pattern (`columns`/`schema`/`table`) or `tasks/` toolbar+filters; row click → `/works/:workId` |
| `/works/:workId` | NEW dossier composing: `finance/` cards (financials), progress meters, anomaly explainer cards (NEW, most important UI), `file-manager/` grid/list (evidence), invoice-style activity timeline, status state machine (Verified/Dismissed/Action Required) |
| `/ai` | `(main)/chat/` thread UI (`bubble`/`message`/`message-scroller`) + `mail/` layout; tool-call rendering for "answer as interface" |

**Explicitly OUT**: ecommerce, academy, logistics, infrastructure, patient-monitoring, calendar, kanban, invoice-as-page, users, roles, email-as-page, productivity, analytics-as-page, all `(legacy)` screens.

## Backend + ML plan (to build behind mock-data interfaces)

```
route loader / component
  └─ createServerFn (src/server/mplads/*.ts, Zod-validated input)
       ├─ works.list/get (filters, search, sort)      [prototype: bundled data.ts]
       ├─ anomalies.list (by workId, with peer stats)  [prototype: precomputed flags]
       ├─ evidence.list/upload                         [prototype: local records]
       ├─ decisions.record + activity.append           [prototype: in-memory/zustand]
       └─ ai.chat (tool layer: getWork, comparePeers, explainFlag, searchWorks)
            └─ anomaly engine (later): cost-outlier, expenditure, delay, near-duplicate
```

Prototype rule: **mock data lives in each route's `-components/data.ts` with the exact field shapes the server fns will return**, so swapping mock → real is a one-line change per call site. New: `src/lib/mplads-schema.ts` (Zod Work/Anomaly/Evidence/Activity shapes) as the single contract both sides honor.

## System boundaries

- `src/routes/**` — file-based routes; `route.tsx` composes, never fetches directly (use loaders/server fns)
- `-components/` — screen-owned code; promote to shared ONLY on second use
- `src/components/ui/` + `src/components/calendar/` — frozen vendor-style code
- `src/navigation/` — nav is data (`sidebar-items.ts`); MVP nav replaces template groups
- `src/server/` — all server-only work; validate every client-controlled input with Zod
- `src/stores/` — client UI state only (today: preferences); dossier/AI conversation state design pending (see open questions)

## Dependency direction

```
routes (screens) → -components/ (screen code) → shared (components/ui, hooks, lib)
server fns → lib schemas; client → server fns (never direct DB)
NEVER: screens importing other screens' -components/
NEVER: edits inside components/ui/ or components/calendar/
NEVER: raw color values — semantic tokens only (see ui-context.md)
```

## Auth and access model (MVP)

Template auth screens for login; officer roles (District / State / Ministry) as a **frontend role switcher on mock data** for the prototype. Real auth (session, RBAC) is post-prototype — tracked as an open question, not MVP scope.

## Invariants

1. SSR by default; no `"use client"` (does nothing here) — browser-only code goes in effects, `<ClientOnly>`, or `createClientOnlyFn`.
2. Semantic theme tokens only; Tailwind named palette only if a token truly can't express it; never arbitrary hex/RGB/OKLCH.
3. `route.tsx` stays small — logic lives in `-components/`; components stay single-purpose, ~300 lines max.
4. Tables follow columns/schema/table; charts go through `ui/chart.tsx`; maps follow the `shipment-route-map.tsx` SVG pattern.
5. Every anomaly render includes: peer-group size, median-vs-actual, ≥1 corroborating signal (see flow.md).
6. Biome style: double quotes, semicolons, 2-space indent, sorted imports, 120-col width; `@/` alias imports.
7. No `--force` installs; no new deps without a decision entry; morph charts/maps from in-repo patterns first.
