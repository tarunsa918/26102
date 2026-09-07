# Decision Log

> **Purpose**: The "why" file. An **append-only** log of every meaningful decision —
> which library was chosen and why, architecture choices, feature decisions, branch
> decisions, tradeoffs. When anyone (human or AI) wonders "why is it built this way?",
> the answer is here.
>
> **Update rule (MANDATORY)**: Append a new entry for EVERY meaningful decision.
> **Never edit or delete past entries** — that would rewrite history and break the
> log's purpose. Before making a new decision, check this log first (don't decide
> twice).

---

## What counts as a "meaningful decision"? (MANDATORY — log all of these)

- **Library / framework / tool choice** — component library, icon set, state manager, animation lib, styling approach
- **Architecture / pattern choice** — folder structure, data flow, error strategy, server vs client components
- **Feature design decisions** — scope, UX, API shape, data model
- **Branch / workflow decisions** — git flow, release process, deployment target
- **Anything you had to think about for more than ~5 seconds**

---

## How to add a decision

1. Copy the **Template** below into the **Decision Entries** section (newest on top)
2. Fill it in — the **Why** line is the most important part
3. Add a row to the **Decision Index** table
4. If it supersedes an earlier decision, mark the old one as `Superseded by ADR-NNN`

---

## Decision Index

| ID | Date | Decision | Status | Affects |
|----|------|----------|--------|---------|
| ADR-012 | 2026-09-07 | SPEC 03: URL-owned filters + table-local checks, plain anchors to dossier, no fake skeleton, relative Updated sub-line | Accepted | dashboard/works |
| ADR-011 | 2026-09-07 | Blank-map root cause: wrongly-wound fit bbox → world-scale projection; adopted React-19-native simple-maps fork with verified fit | Accepted | overview india-risk-map, package.json |
| ADR-010 | 2026-09-07 | SPEC 02 polish: ministry-first default, CRM outline badges, visible map error+retry | Accepted | role store, overview components |
| ADR-009 | 2026-09-07 | SPEC 02: vendored 2015-vintage states GeoJSON (slimmed, GeoJSON not TopoJSON), plain-Table queue, SVG-anchor map selection, Bhopal scope | Accepted | dashboard/overview, public/geo, role store |
| ADR-008 | 2026-09-07 | SPEC 01: overview under dashboard shell, interim stub, validation kept, standalone role store on existing cookie fns | Accepted | dashboard routes, header, src/stores/role/ |
| ADR-007 | 2026-09-07 | SPEC 00 mock contract: seeded mulberry32 + fixed demo date, derived geo rollup, INR/lakh helpers on existing idioms | Accepted | admin-dashboard/src/lib/mplads-schema.ts, mplads-mock.ts |
| ADR-006 | 2026-09-06 | SIH MVP: 5 routes, reuse template components (not structure), UI-first prototype on mock data | Accepted | admin-dashboard/, all context files |
| ADR-005 | 2026-09-06 | Skip Impeccable install after npm ECOMPROMISED refusal; do not --force | Accepted | repo root tooling |
| ADR-004 | 2026-09-06 | Initial dashboard setup: neutral naming, placeholder demo data, pruned docs | Accepted | admin-dashboard/ (docs, config, demo data) |
| ADR-003 | 2026-08-11 | Remove Scaffold.py; canonical trees are the source of truth | Accepted | repo root, folder-structure skill |
| ADR-002 | 2026-08-11 | Add flow.md + decision.md as living context files | Accepted | context/, all docs |
| ADR-001 | YYYY-MM-DD | [One-line decision] | Accepted | [files/features] |

---

## Template

### ADR-NNN: [Short title]
- **Date**: YYYY-MM-DD
- **Status**: Proposed | Accepted | Rejected | Superseded by ADR-NNN
- **Context**: [what triggered this decision — the problem being solved]
- **Options considered**: [alternatives, and why each was rejected]
- **Decision**: [what was chosen]
- **Why**: [the reasoning — this is the important part. Write enough that a future agent
  understands without re-deriving it.]
- **Consequences**: [positive and negative effects, things to watch out for]
- **Affects**: [features / files / branches this touches]

---

## Decision Entries

### ADR-012: SPEC 03 works table — URL-owned filters, interim anchors, honest states
- **Date**: 2026-09-07
- **Status**: Accepted
- **Context**: SPEC 03 demands shareable `?lens=&state=&q=` plus header selects, toolbar checks, search, sort, pagination — without prop-drilling the table instance up to the route.
- **Options considered**: All filters in table state (rejected — URL wouldn't restore); lifting `useTable` into the route (rejected — breaks the tasks donor structure); typed `Link` to dossier (rejected — SPEC 04 route doesn't exist, tsc fails); fake skeleton shimmer on sync data (rejected — decoration).
- **Decision**: `?lens=&state=&district=&type=&q=` owned by the URL (extends acceptance superset), synced into column filters via effect + page reset; severity/kind multi-checks stay table-local; header Reset clears URL + bumps a reset key that clears local checks; dossier links are plain anchors until SPEC 04; Updated sub-line shows relative "Xd ago" (date-only data has no times for `h:mm a`).
- **Why**: Single source of truth per filter, every combination shareable/restorable, donor file shapes preserved, zero dead controls.
- **Consequences**: Typing in search navigates (replace, no reload, focus kept); severity/kind selections don't survive reload (documented, out of acceptance scope).
- **Affects**: `dashboard/works/` (data/columns/works-toolbar/table/route)

### ADR-011: Blank map was a wrong-winding fit bbox; now on react19-simple-maps
- **Date**: 2026-09-07
- **Status**: Accepted
- **Context**: Risk map rendered empty across three implementations. Headless d3 probing pinned it: my hand-made India bbox ring was wound opposite to d3-geo's expectation, so `fitExtent` measured the world-minus-India complement and set scale ≈60 instead of ≈680 — the whole country rendered ~30px wide (invisible speck). Data, fetch/import, and fills were all innocent.
- **Options considered**: `react-simple-maps@3` (rejected — React 18-only peer vs repo React 19, no `--force`); hand-rolled d3 with corrected fit (rejected — user asked for a real map library, and manual projection math already burned us once); `@vnedyalk0v/react19-simple-maps@2.0.10` (chosen — React-19-native simple-maps fork, 21k weekly downloads, GeoJSON-object input so no fetch layer, ZoomableGroup for the requested pan/zoom, Sphere for ocean).
- **Decision**: `IndiaRiskMap` rebuilt on the fork (`ComposableMap` geoMercator scale 680.42 center [82.06, 21.85] — numbers extracted from a verified d3 fit, not guessed); fills via inline `var()`/`color-mix` (dark-mode correct, zero Tailwind-generation dependence); hover via cursor-anchored HTML readout; states without demo data get native `<title>`.
- **Why**: Library owns projection/path/event wiring (the exact layers that failed silently); verified numbers, not hoped-for ones; pan/zoom included per request.
- **Consequences**: One new dependency (0 vulnerabilities at install); `d3-geo`/`topojson-client` stay for the logistics donor; if the map is STILL blank after this, the cause is environmental (stale branch/server/cache), not code — verify via KPI badge style (outline = new code running).
- **Affects**: `dashboard/overview/-components/india-risk-map.tsx`, `package.json`

### ADR-010: SPEC 02 polish — ministry-first default, outline badges, visible map errors
- **Date**: 2026-09-07
- **Status**: Accepted
- **Context**: Live review reported three symptoms: KPI strip looked "AI solid", queue showed only 3 rows with no pagination, map fully blank. Audit (redesign-existing-projects skill) vs CRM/finance donors found: solid-fill badges (metric-cards ships 2 solid + 3 solid-destructive; CRM uses outline tone washes); district-first default scoped the queue to 5 Bhopal works → 3 flagged rows; map failure rendered an endless `Skeleton` with the error only in the console.
- **Options considered**: Pagination on the 8-row card (rejected — decoration on a fixed list; the full filterable table is SPEC 03); rebuilding cards from scratch (rejected — donor anatomy stays, only badge language changed); keeping district-first per SPEC-01 text (rejected — the command centre's first paint must be the full demo, scoping is one click away).
- **Decision**: Default role `ministry` (store + `parseRole` fallback + label fallback); KPI badges to `outline` + green/destructive washes (CRM idiom, same layout/captions); map gets a visible "Map unavailable + Retry" state (retry counter, `useExhaustiveDependencies` suppression documented inline).
- **Why**: First paint now shows the judged story (8 rows, W-1014 first, 6-state map); badges match the repo's most premium strip; a blank map is now a diagnosable state instead of a mystery.
- **Consequences**: Overrides SPEC-01 "district first" acceptance — spec text kept for history, behavior is ministry-first; role switch still demonstrates scoping (verified headless: 8/4/3 rows).
- **Affects**: `src/stores/role/role-store.ts`, overview `kpi-strip`/`india-risk-map`/`priority-queue`

### ADR-009: SPEC 02 overview — vendored GeoJSON, plain-Table queue, SVG-anchor selection
- **Date**: 2026-09-07
- **Status**: Accepted
- **Context**: SPEC 02 needs India state geometry (not in repo) plus a queue that is deliberately dumber than the tasks table (8 fixed rows, no sort/filter/pagination).
- **Options considered**: 11MB full-res states GeoJSON (rejected — demo weight); hand-rolled TopoJSON conversion (rejected — no offline tooling); full TanStack table for 8 static rows (rejected — machinery with every feature explicitly out of scope); `role="button"` on SVG paths (rejected — trips `useSemanticElements` with no valid suppression point).
- **Decision**: Vendored click_that_hood 35-state GeoJSON (2015 vintage: undivided J&K, has Telangana; covers all 6 seed states), stripped to `{name}` + 2-decimal coords + dupe removal (3.2MB→501KB) at `public/geo/india-states.json` — GeoJSON rendered natively by d3 (no TopoJSON step, no new deps). Queue = plain `Table` with tasks row classes. Map states = SVG `<a href="?state=">` (progressive enhancement + free keyboard/focus) with SPA `preventDefault` navigate; no-data states get native `<title>`.
- **Why**: Smallest honest build: component clones donor mechanics, data file is cached once, queue matches its actual requirements, selection is semantic HTML instead of ARIA workarounds.
- **Consequences**: Map vintage predates Ladakh split — fine for demo choropleth, revisit with official LGD/SOI source before production; dossier/works anchors are plain `<a>` until SPEC 03/04 own the routes (typed `Link` would fail tsc today).
- **Affects**: `dashboard/overview/`, `public/geo/india-states.json`, role label (Bhopal)

### ADR-008: SPEC 01 entry + role lens — shell mapping, stub, kept validation
- **Date**: 2026-09-07
- **Status**: Accepted
- **Context**: SPEC 01 text says `/overview`, but the dashboard shell (sidebar/header/role switcher) only renders under `/dashboard/*`; a top-level `/overview` would hide the role lens the queue needs.
- **Options considered**: Literal top-level `/overview` route outside the shell (rejected — no header/role switcher where judges need it); keep `/dashboard` → default until SPEC 02 (rejected — breaks SPEC-01 acceptance); overview under the shell + coming-soon stub now, real queue in SPEC 02 (chosen).
- **Decision**: `dashboard/overview/route.tsx` (URL `/dashboard/overview`, stub cloned from `coming-soon/route.tsx`); `/` + `/dashboard` redirect there; login keeps email/min-6 Zod validation (demo hint supplies passing credentials) and navigates there with a prototype toast; role = standalone zustand `create` store (chat/mail precedent, not the heavier preferences provider) on existing `getValueFromCookie`/`setValueToCookie`, validated by SPEC-00 `officerRoleSchema`, hydrated once from the dashboard loader.
- **Why**: Every branch stays demo-able with zero console errors; no working behavior destroyed (validation, error states); smallest store that fits a cross-route lens; zero new server fns, zero new deps.
- **Consequences**: SPEC 02 replaces the stub body (route file stays); if literal top-level paths are ever wanted, it's a route-file move, not a rewrite.
- **Affects**: dashboard routes/header, `src/stores/role/`, entry redirects

### ADR-007: SPEC 00 mock-data contract — seeded RNG, fixed demo date, derived rollup
- **Date**: 2026-09-07
- **Status**: Accepted
- **Context**: SPEC 00 needs one shared dummy-data contract (40 works, 12 flags, flagship W-1014) that renders identically on every reload and that future server fns + ML can return behind the same shapes.
- **Options considered**: `Math.random` + live `new Date()` (rejected — demo drifts between reloads/judges); hand-written static JSON (rejected — 40 works × relations by hand is error-prone and hard to reseed); seeded builder (chosen).
- **Decision**: `mulberry32` seeded `26102` + fixed `DEMO_TODAY 2026-09-07` (all dates derived via date-fns, never `Date.now`); geo rollup computed from works (not hand-written); money via existing `formatCurrency` idiom (`formatINR`) plus a `formatLakh` shorthand for the `₹58.9L` comparison template; delay/duplicate anomalies use the schema's nullable median/actual fields; verification via throwaway ts-node/native-hook script (deleted after, byte-identical across runs).
- **Why**: Deterministic seed = every reload renders the identical demo the judges approved; derived rollup can't drift from the works table; reusing `formatCurrency`/date-fns keeps the ponytail ladder (existing repo code first, minimal new code).
- **Consequences**: Routes must import shapes only from `mplads-schema.ts`; shape change = bump `mplads-demo-v1` and reseed; localStorage persistence + `-components/data.ts` slices belong to SPEC 01–05, not here.
- **Affects**: `admin-dashboard/src/lib/mplads-schema.ts`, `admin-dashboard/src/lib/mplads-mock.ts`

<!-- Newest decisions go at the top of this section. Keep this section growing — it is
     the living memory of the project. Delete the two example entries below once you
     have real decisions. -->

### ADR-006: SIH MVP scope + template-reuse strategy + UI-first prototype
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: SIH26102 (MoSPI) needs an AI anomaly-detection workspace for MPLADS works. We own a 20+-screen TanStack Start + shadcn template. Design study (`chat.md`) concluded: 5 routes max, officer-loop-driven, explain every alert.
- **Options considered**: Build MVP screens from scratch (rejected — template donors cover tables/charts/chat/files; custom work would look worse and take longer); adopt template nav as-is (rejected — CRM/Finance/etc. pages aren't the officer's workflow); backend-first (rejected — judge demo needs working UI now).
- **Decision**: 5 routes (`/login`, `/overview`, `/works`, `/works/:workId`, `/ai`); clone closest donor screens and adapt; charts via `ui/chart.tsx`+recharts, India map via `shipment-route-map.tsx` pattern + added TopoJSON; prototype on bundled mock data typed by shared Zod shapes so server fns slot in later.
- **Why**: Components are professional and proven; structure is wrong for the domain. Mock-behind-contract keeps the demo real today and the backend swap trivial tomorrow.
- **Consequences**: Must add India TopoJSON + choose DB + anomaly-engine home + AI provider (open questions). Template pages outside the loop stay unbuilt.
- **Affects**: `admin-dashboard/`, all context files

### ADR-005: Skip Impeccable — npm blocked it as compromised, do not force
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: `Skills.py` failed on `npx impeccable install` with `npm error code ECOMPROMISED` (npm's compromised-package block).
- **Options considered**: Retry with `--force` (rejected — Agent.md explicitly forbids `--force` installs and bypassing a compromise block is a security violation); skip Impeccable, keep the 34 skills that installed cleanly (chosen).
- **Decision**: Leave Impeccable uninstalled. Revisit only if the package is unflagged upstream.
- **Why**: Security over completeness — 34 of 35 skill targets landed; one blocked package isn't worth overriding npm's integrity protection.
- **Consequences**: No Impeccable design engine available; GSAP/Hallmark/Taste/Emil skills cover design needs.
- **Affects**: repo root tooling

### ADR-004: Dashboard setup — neutral naming and placeholder demo data
- **Date**: 2026-09-06
- **Status**: Accepted
- **Context**: Needed a clean starting point for the dashboard with neutral project naming and realistic placeholder demo data.
- **Options considered**: Keep unused docs at the template root (rejected — dead weight); leave external links in shared components (rejected — they'd point outside the project); keep real-looking personal demo identities (rejected — placeholders are safer for a shared prototype).
- **Decision**: Set up `admin-dashboard/` with package/display naming (`Admin Dashboard`); pruned unused docs (`README.md`, `CONTRIBUTING.md`, `LICENSE`, `media/`); neutralized `support-card` and `github-repositories-menu` (placeholder links); standardized demo data on placeholder identities (`Alex Carter`/`Jordan Lee`/`Example Corp`/`example.com`).
- **Why**: Placeholders keep demo screens realistic without implying real people or external dependencies. Logic, routes, and structure untouched.
- **Consequences**: No license file ships with the template — add one before distributing. Header menu links are placeholders (`#`) until real links are wired.
- **Affects**: `admin-dashboard/` docs, config, demo data; `context/progress-tracker.md`

### ADR-003: Remove Scaffold.py — canonical trees are the source of truth
- **Date**: 2026-08-11
- **Status**: Accepted
- **Context**: Scaffold.py generated a folder skeleton, but `npm install` / create-app already provides boilerplate. The generator produced a generic tree that ignored per-project needs and duplicated what the `folder-structure` skill already defines.
- **Options considered**: Keep Scaffold.py but improve it (extra maintenance, still redundant with the skill); remove it and rely on the canonical trees (chosen).
- **Decision**: Delete Scaffold.py. The `folder-structure` skill (`.agents/folder-structure/SKILL.md`) is the single source of truth; agents materialize its canonical trees by hand, creating only folders the product needs.
- **Why**: One source of truth instead of two. The skill's trees are the "senior engineer" hierarchy — feature-first frontend, controller-service-repository backend. Remove the Python dependency from the workflow.
- **Consequences**: Agents must create folders manually — the skill's Step 2 shows how. All docs updated (Agent.md, SKILLS.md, README.md, .agents/AGENTS.md).
- **Affects**: repo root, `.agents/folder-structure/SKILL.md`, all docs referencing it

### ADR-002: Add `flow.md` + `decision.md` as living context files
- **Date**: 2026-08-11
- **Status**: Accepted
- **Context**: Agents couldn't understand the project instantly and didn't update context properly. `progress-tracker.md` alone didn't capture HOW the app works (function call maps, user flows) or WHY decisions were made.
- **Options considered**: Fold this info into existing files (overloaded, no single "how/why" home); new dedicated files (chosen).
- **Decision**: Create `context/flow.md` (Mermaid call maps, user flows, request/response, routes) and `context/decision.md` (append-only ADR log). Both are updated on EVERY task, alongside `progress-tracker.md`.
- **Why**: Reading the three files (progress-tracker + flow + decision) gives state, structure, and rationale instantly. Decision log prevents re-deciding and preserves reasoning.
- **Consequences**: Agents must keep diagrams in sync; stale diagrams are treated as bugs. Sync protocol is enforced via AGENTS.md + Agent.md.
- **Affects**: `context/`, `AGENTS.md`, `Agent.md`, `SKILLS.md`, `.agents/AGENTS.md`, `ai-workflow-rules.md`

### ADR-001: Choose Next.js 16 + TypeScript
- **Date**: YYYY-MM-DD
- **Status**: Accepted
- **Context**: Need an SSR-capable framework with strong typing for a multi-page product.
- **Options considered**: React + Vite (no SSR, worse SEO), Astro (less dynamic for app routes), SvelteKit (smaller ecosystem for the team).
- **Decision**: Next.js 16 + TypeScript.
- **Why**: SSR/SSG out of the box, App Router supports the feature-first layout, TypeScript strict mode is a hard requirement, largest ecosystem.
- **Consequences**: Must default to server components; avoid heavy client bundles.
- **Affects**: entire app

### ADR-002: [Example — component library choice]
- **Date**: YYYY-MM-DD
- **Status**: Accepted
- **Context**: Need form controls and modals for the [feature] section.
- **Options considered**: HeroUI (too heavy to default), MUI (banned), custom (slow).
- **Decision**: Pull the [X] components from Astryx, animate with [Y].
- **Why**: Matches the design language in `ui-context.md`; copy-paste ownership preferred per `DESIGN.md`.
- **Consequences**: [things to watch out for]
- **Affects**: `features/<feature>/components/`
