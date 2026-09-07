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
