# PROMPT — Implement SPEC 02 (overview command centre). Paste to agent. STOP after SPEC 02.

You are working in repo root `C:\Users\Hp\26102`. Work on branch `003-spec02-overview` (create it from current `002-spec01-login` so the uncommitted SPEC-01 stack carries over; do NOT commit unless explicitly asked). Implement ONLY `Feature_docs/02-overview/spec.md`. Do NOT touch specs 00–01 (except the one stated Bhopal relabel) or 03–05. Do NOT build the works table, dossier, or copilot — link to them only. Stop when SPEC 02 acceptance passes and await verification.

## Decided inputs (do not re-ask)
- India TopoJSON: YOU source a public India **states** TopoJSON, vendor it to `public/geo/india-states.json`, verify states fill + mesh borders render. No new deps (`d3-geo` + `topojson-client` already installed). Fetch client-side with cancel flag like the donor; failure → zinc silhouette + `Skeleton` (never a crash).
- URL family: everything lives under the dashboard shell — overview is the existing `/dashboard/overview` stub (replace its body), works links are `/dashboard/works?state={State}` / `/dashboard/works?lens=high-risk`, dossier rows link `/dashboard/works/W-1014` (SPEC 04 builds it; the not-found template covers the interim — verify no console errors, not that the dossier renders).
- District scope: remap to Bhopal (the seed has no Sehore works). Update the roles constant label in `src/stores/role/role-store.ts` from "District — Sehore" to "District — Bhopal". District scope = Bhopal works, State scope = MP (Bhopal + Indore), Ministry = all 40. Default role is ministry (full demo scope on first paint; ADR-010) — queue/map verify at 8 rows W-1014 first under ministry.

## Step 0 — Read context (non-negotiable, in order)
1. `Agent.md` (execution protocol + status-block format + approval gate)
2. `SKILLS.md`, then load the **`design-patterns`** skill and read its `SKILL.md` (size the design: route composes, screen-owned `-components/`, no new layers) — state the loaded skill + one rule in your reply
3. `context/project-overview.md`, `context/architecture.md`, `context/ui-context.md`, `context/code-standards.md`
4. `context/progress-tracker.md`, `context/flow.md`, `context/decision.md`
5. `context/design-system.md` §2 (tokens) + §5 (table/`validateSearch` patterns) + §7 Default/CRM/Tasks/Logistics verdicts + §8 (map deep dive) + §10 (file index)
6. `Feature_docs/02-overview/spec.md` (the ONLY spec you implement)

## Step 0b — Reuse doctrine + design gate (mandatory, no code before approval)
- REUSE, don't rebuild. This route is a reconfiguration of existing donors: `default/route.tsx` rhythm + `default/metric-cards.tsx` card anatomy (§A) + `logistics/shipment-route-map.tsx` mechanics (§B) + `tasks` table pattern (§C). Copy each donor file into `dashboard/overview/-components/` and reconfigure values/labels — NEVER import another screen's `-components/`, never invent new visual language, no new primitives, no new chart libs (NO recharts on this route — map + badges only).
- Draw the ASCII layout (§A strip of 5 → §B 7-col map + §C 5-col queue) naming the donor file behind every block, plus the `?state=` two-way filter flow. WAIT for explicit user approval before writing code.

## Step 1 — Build (SPEC 02 only)
- `dashboard/overview/route.tsx`: thin composition only (`KpiStrip` + 7/5 grid of `IndiaRiskMap` + `PriorityQueue`), same `gap-4 md:gap-6` rhythm as `default/`. No page-title hero.
- §A `kpi-strip.tsx` (from `metric-cards.tsx` anatomy, NO sparklines, grid `grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4`): Total Works 12,482 (+2.1%) / Under Execution 4,821 (+3.4%) / Delayed 386 destructive (−8.2%) / High Risk 73 destructive (9 new) / Overrun exposure ₹41L destructive (+₹6L) — values from SPEC-00 `MPLADS_KPIS` + `formatLakh`, icons LayoutDashboard/Loader/Clock3/AlertTriangle/Banknote, `tabular-nums`.
- §B `india-risk-map.tsx` (from `shipment-route-map.tsx` file shape): `geoMercator` + `fitExtent` India bbox, states fill by high-flag count (0 zinc / 1 amber wash / ≥2 destructive wash), hairline borders, selected `stroke-primary`; hover `Tooltip` (`{State} · {works} works · {high} high-risk`); click → `/dashboard/works?state=` (URL-state pattern, selected persists); `Card` chrome "Risk geography" + legend row; 320/420px rows; dark-mode verified.
- §C `priority-queue.tsx` (from `tasks` table, condensed 8 rows, NO pagination): `Card` "Needs your attention" + "Demo sample · 40 works" + `CardAction` "View all →" → `/dashboard/works?lens=high-risk`; columns Severity badge+dot / Work link + mono `#W-1014` sub / Reason one-liner from SPEC-00 `compareSentence` (truncate) / District muted / Amount right `tabular-nums`; top-8 severity-then-amount with flagship `W-1014` first; row click → dossier link; `Empty` state "All clear — no high-risk works in scope."
- Role scoping: counts/rows filter by store role (Bhopal / MP / all); queue caption stays honest about the demo sample.
- Rules: Biome style (double quotes, semicolons, 2-space, sorted imports, 120-col); zero `any`; Zod-validate `?state=` against known states; never edit `ui/*`, `calendar/*`, `routeTree.gen.ts` (regen via local `tsr`, never `npx`); never real people/constituencies/MPs; flag language "needs review".
- Out of scope: district drill-down, time-range selects, export, second tab, any works/dossier/copilot UI.

## Step 2 — Verify (evidence required)
- `tsc --noEmit -p admin-dashboard/tsconfig.json`: no NEW errors (the 3 pre-existing template errors don't count — confirm none in touched files).
- `biome check` on every created/modified file: no new findings (repo-wide CRLF format noise is pre-existing — prove via `git show HEAD:<file> | biome check --stdin-file-path` if disputed).
- `vite build` (local binary) passes.
- Click-path (paste what you did + saw): 30-second story test narrates without help; map click filters queue via `?state=` and back; every row link fires; first row is W-1014; role switch re-scopes counts and persists reload; dark + mobile checked; devtools console zero errors; zero dead controls.
- Regression sweep: `rg -i "arham|weblabs|studio admin|prior-author|debrand"` repo-wide (excl. `.git`, `node_modules`) CLEAN (prompt self-mentions don't count).

## Step 3 — Sync context (mandatory)
- Append one bullet under `context/progress-tracker.md` → Completed (SPEC 02 done + verification evidence).
- Update `context/flow.md`: overview composition tree + `?state=`/`?lens=` URL-state contract (SPEC 03 consumes it) + Bhopal scope note.
- If you made any meaningful choice, append an ADR entry to `context/decision.md` (index + entry). Do NOT rewrite history entries.

## Step 4 — STOP
End your turn with: files created/modified (+ donor cloned for each), verification outputs, click-path evidence, and "SPEC 02 ready for verification — awaiting approval before SPEC 03." Do NOT proceed to SPEC 03 without explicit approval.
