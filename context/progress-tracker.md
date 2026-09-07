# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

**Phase 1 — SIH26102 MVP (MPLADS Sentinel)**

MPLADS anomaly-detection workspace for SIH 2026 (MoSPI). Frontend shell runs; prototype UI-first on mock data; backend/ML behind identical interfaces next.

## Current Goal

Scaffold the 5 MVP routes (`/login`, `/overview`, `/works`, `/works/:workId`, `/ai`) in `admin-dashboard/` by cloning donor screens, with `src/lib/mplads-schema.ts` Zod contract + bundled mock data — judge-demoable end to end.

## Completed

- **SPEC 02 polish on `003-spec02-overview` (2026-09-07, redesign-existing-projects skill)** — audit vs CRM/finance donors: KPI badges solid→outline tone washes (the "AI solid" tell); default role district→ministry (district scope showed only 3 Bhopal rows — the reported "3 dummies"); map failure now a visible "Map unavailable + Retry" card instead of an endless skeleton. Verified headless: ministry 8 rows W-1014 first / state 4 / district 3; tsc/biome/build clean.
- **SPEC 02 done on `003-spec02-overview` (2026-09-07)** — overview command centre at `/dashboard/overview` reconfigured from donors: `KpiStrip` (metric-cards anatomy, 5 static scheme cards), `IndiaRiskMap` (shipment-route-map mechanics on vendored `public/geo/india-states.json` — 35-state 2015-vintage GeoJSON slimmed 3.2MB→501KB, risk fills, Tooltip, SVG-anchor click → `?state=`), `PriorityQueue` (tasks row idiom as plain Table, top-8 flagship-first, dossier anchors interim to SPEC 04), role scoping (Bhopal/MP/all) + Bhopal relabel. Verify: tsc new-code clean, biome clean, `vite build` ✓, rg sweep clean.
- **SPEC 01 done on `002-spec01-login` (2026-09-07)** — login keeps v1 screen + validation, valid submit → toast "Signed in (prototype)" → `/dashboard/overview`; `/` + `/dashboard` redirect to overview; header `RoleSwitcher` (Badge + `Select size="sm"`) backed by `useRoleStore` + `mplads_role` cookie (7d), hydrated from dashboard loader; overview is a coming-soon stub until SPEC 02. Verify: tsc new-code clean (3 pre-existing template errors only), biome lint clean (4 remaining notes are pre-existing repo CRLF noise, proven on HEAD), `vite build` passes, rg sweep clean. Senior deltas from literal spec text: overview lives under the dashboard shell (`/dashboard/overview`, not top-level `/overview`) so the role lens stays visible; login keeps email/min-6 validation (demo hint supplies passing credentials).
- **SPEC 00 done on `001-mplads-contract` (2026-09-07)** — created `admin-dashboard/src/lib/mplads-schema.ts` (Zod Work/Anomaly/Evidence/Activity/Decision/OfficerRole contract, zero `any`) + `mplads-mock.ts` (mulberry32 seed `26102`, fixed DEMO_TODAY: 40 works 18/8/7/7, 12 flags 5-high/4-medium/3-low incl. W-1014 cost 58.9L vs 24.6L peerN 18 + 96d double-signal, 6 evidence, 33 activity rows, derived geo rollup, KPI constants). Verify: tsc shows only the 3 pre-existing template errors (new files clean); `biome check` clean; 37-assert throwaway seed script ALL PASSED + byte-identical across 2 runs (script deleted); `rg` sweep clean (1 self-match in the prompt text only).
- **Commit `17485d2` on `20260906-171235-project-setup` (2026-09-06)** — `chore: project setup with skills, spec-kit, and dashboard` (508 files). Verified pre-commit sweep: zero old-repo/author mentions; `node_modules`/`dist`/`build` excluded via `.gitignore`. Not pushed.
- **Context sync for SIH MVP (2026-09-06)** — rewrote all 8 context files for SIH26102: project thesis + 5-route scope, real TanStack architecture, full design-system bible (tokens, 61 primitives, layout idioms, anti-slop rules), colocation code standards, flow maps, ADR-006. Template mapped: donors per route, India TopoJSON identified as the one missing asset.
- **Feature specs + clarifications (2026-09-06)** — `Feature_docs/00–05` written (contract, login, overview, works, dossier, copilot) with min components mapped to donors + dummy-data shapes. Decided: scripted copilot brain, state-level map, localStorage persistence, open entry with header role switch. **AWAITING user approval to implement (design gate).**
- **Specs deep-detailed (2026-09-06)** — all 6 `Feature_docs` rewritten as build blueprints: exact ASCII layouts with grid spans, per-card anatomy, metric tables with values/badges/formats, component file references, chart configs, behaviors, states, acceptance tests. Zero new primitives/components specified — arrangement only.
- **Design-system deep catalog (2026-09-06)** — 8 parallel research agents mapped every screen file-by-file; `context/design-system.md` expanded to 41KB/11 sections: deep shells (preferences keys, search, account switcher), full primitive APIs (variants/sizes/props for all 61 + chart wrapper snippet), per-screen chart specs with stealable techniques, table/list/URL-state/cookie-layout patterns, dead-button must-wire list, ASCII + verdict for all 25+ pages, 220-line map technical breakdown, MVP reuse map, file index, checklist.
- **Commit `f6a5198` (2026-09-06)** — `docs: feature specs with donor-mapped blueprints` (16 files: 6 specs, 8 context files, design-system, SPEC-00 prompt). No junk staged. Left unpushed on `20260906-171235-project-setup`.
- **Design-system catalog (2026-09-06)** — new `context/design-system.md`: app shells ASCII, condensed tokens, all 61 primitives grouped by MVP use, full chart inventory per screen (recharts types + Funnel + d3-geo map), ASCII + verdict (reuse/adapt/reference/skip) for all 25+ pages, MVP reuse map, new-page checklist. Verified against every screen `route.tsx`.
- **Skills bootstrap via `Skills.py --yes` (2026-09-06)** — installed 34 skills into `.agents/skills/` (8 GSAP, 1 Hallmark, 13 Taste, 12 Emil Kowalski — all security-clean per installer). Impeccable design engine FAILED (`npm ECOMPROMISED` — skipped, not forced). Side effect: `npm init -y` created root `package.json`. Open: Spec Kit (`specify`) install+init DONE (2026-09-06) — `specify-cli` via uv, `specify init --here --force --non-interactive --integration opencode`; `.specify/` + `.opencode/commands/` scaffolded, root `AGENTS.md` untouched.
- **Key-collision fix in `GitHubRepositoriesMenu` (2026-09-06)** — the menu hrefs were all `#` while the list used `key={repository.href}`, causing duplicate-key warnings; switched key to `repository.label`. No logic or routes changed.
- **Dashboard setup in `admin-dashboard/` (2026-09-06)** — pruned unused docs (`README.md`, `CONTRIBUTING.md`, `LICENSE`, `media/`); set package and display naming (`Admin Dashboard` in `package.json`, `package-lock.json`, `.cta.json`, `manifest.json`, `app-config.ts`, `AGENTS.md`); neutralized sidebar support card and header repository menu (placeholder links); standardized demo data on placeholder identities (`Alex Carter`, `Jordan Lee`, `Example Corp`, `example.com`). No logic or routes changed; no build/lint run per project rule (validation only on explicit request).

- **Root `AGENTS.md` added** — auto-loaded by agents; contains the 3 non-negotiable rules, file reading order, and failure consequences so agents see the protocol even if they never open `Agent.md`.
- **`Agent.md` rewritten for enforceability** — mandatory routine (read context → classify → load skill → design-first → implement → sync context → verify), required response status block, hard approval gate in the design workflow, context sync protocol, expanded pre-exit checks.
- **`context/flow.md` added** — Mermaid architecture/user-flow/request-response diagrams, function call maps, route + API tables, mandatory update protocol.
- **`context/decision.md` added** — append-only ADR-style decision log with template, index, and update rules.
- **`Scaffold.py` removed** — npm/create-app provides boilerplate; the `folder-structure` skill's canonical trees are now the source of truth, materialized by hand.
- **References updated** — `SKILLS.md`, `README.md`, `.agents/AGENTS.md`, `.agents/folder-structure/SKILL.md`, `context/ai-workflow-rules.md` all updated to remove Scaffold.py and point to the canonical trees + new context files.

## Next Up

1. Create `src/lib/mplads-schema.ts` (Work/Anomaly/Evidence/Activity Zod shapes) + seed mock data
2. Build `/overview` (KPIs + priority queue; India map after TopoJSON sourced)
3. Build `/works` table + `/works/:workId` dossier (anomaly explainer first — it's the differentiator)
4. Wire `/ai` on chat donor; decide AI provider + tool layer
5. Replace sidebar nav with MVP items; prune nothing (leave template routes, just unnavigated)

## Open Questions

- DB choice for works/anomalies/evidence (sqlite/postgres/supabase?) and where the anomaly engine lives (server fns vs separate Python service)?
- Source for India state/district TopoJSON compatible with the d3-geo map pattern?
- AI provider + model for copilot tool calls (needs structured output + low cost for demo)?
- eSAKSHI data ingestion: scrape public dashboard now, or stay on hand-built mock for prototype?
- Auth backend scope: role switcher on mock for prototype, real sessions post-MVP?

## Architecture Decisions

See `context/decision.md` for full decision records.

