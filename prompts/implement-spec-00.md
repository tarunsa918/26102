# PROMPT — Implement SPEC 00 (mock-data contract). Paste to agent. STOP after SPEC 00.

You are working in repo root `C:\Users\Hp\26102`. Implement ONLY `Feature_docs/00-mplads-contract/spec.md`. Do NOT touch specs 01–05. Do NOT start any route. Stop when SPEC 00 acceptance passes and await verification.

## Step 0 — Read context (non-negotiable, in order)
1. `Agent.md` (execution protocol + status-block format + approval gate)
2. `SKILLS.md`, then load the **`design-patterns`** skill and read its `SKILL.md` (data modeling, module interaction, production readiness) — state the loaded skill + one rule in your reply
3. `context/project-overview.md`, `context/architecture.md`, `context/ui-context.md`, `context/code-standards.md`
4. `context/progress-tracker.md`, `context/flow.md`, `context/decision.md`
5. `context/design-system.md` §2 (tokens) + §10 (file index)
6. `Feature_docs/00-mplads-contract/spec.md` (the ONLY spec you implement)

## Step 1 — Build (SPEC 00 only)
- Create `admin-dashboard/src/lib/mplads-schema.ts`: the exact Zod shapes from the spec (Work, Anomaly, Evidence, Activity, Decision, OfficerRole). Zero `any`. Biome style: double quotes, semicolons, 2-space indent, sorted imports.
- Create `admin-dashboard/src/lib/mplads-mock.ts`: seeded RNG (mulberry32, seed `26102`) + the exact seed plan from the spec (6 states × 2 districts, 40 works by status, 12 flags by kind/severity with peerN/median/actual/corroboration, flagship W-1014 double-signal, 6 evidence files, seeded activity, derived geo rollup, KPI constants). Amounts via existing `formatCurrency` idiom; dates via date-fns.
- Anonymization rule: district/state names real; work titles/agencies fictional (`Contractor-07`); NEVER real people/constituencies/MPs; flag language "needs review", never fraud.
- Do NOT create route files, components, stores, or server fns. Two files only (+ fix any type errors they cause).

## Step 2 — Verify (evidence required)
- `npx tsc --noEmit -p admin-dashboard/tsconfig.json` (or repo typecheck) passes.
- `npx biome check admin-dashboard/src/lib/mplads-schema.ts admin-dashboard/src/lib/mplads-mock.ts` passes.
- Write and run a throwaway node script asserting: schema parses entire seed with zero errors; 40 works; 12 flags; every flag has peerN ≥ 8 + ≥1 corroborating signal; geo rollup counts match works. Paste its output. Delete the script after.
- Regression sweep: `rg -i "arham|weblabs|studio admin|prior-author|debrand"` repo-wide (excl. `.git`, `node_modules`) returns CLEAN.

## Step 3 — Sync context (mandatory)
- Append one bullet under `context/progress-tracker.md` → Completed (SPEC 00 done + verification evidence).
- If you made any meaningful choice, append an ADR entry to `context/decision.md` (index + entry).
- Do NOT rewrite history entries.

## Step 4 — STOP
End your turn with: files created, verification outputs, and "SPEC 00 ready for verification — awaiting approval before SPEC 01." Do NOT proceed to SPEC 01 without explicit approval.
