# PROMPT — Implement SPEC 01 (login + entry + role switcher). Paste to agent. STOP after SPEC 01.

You are working in repo root `C:\Users\Hp\26102`, on branch `002-spec01-login` (branched off SPEC-00 commit `1740dfc`). Implement ONLY `Feature_docs/01-login/spec.md`. Do NOT touch specs 00, 02–05. Do NOT start the overview queue. Stop when SPEC 01 acceptance passes and await verification.

## Step 0 — Read context (non-negotiable, in order)
1. `Agent.md` (execution protocol + status-block format + approval gate)
2. `SKILLS.md`, then load the **`design-patterns`** skill and read its `SKILL.md` (controller/state layering sized to the need — a role lens is local state + cookie, not a backend) — state the loaded skill + one rule in your reply
3. `context/project-overview.md`, `context/architecture.md`, `context/ui-context.md`, `context/code-standards.md`
4. `context/progress-tracker.md`, `context/flow.md`, `context/decision.md`
5. `context/design-system.md` §1a (dashboard shell + header controls + preferences system) + §1b (auth shells) + §10 (file index)
6. `Feature_docs/01-login/spec.md` (the ONLY spec you implement)

## Step 0b — Design gate (mandatory, no code before approval)
- Think properly; reuse prebuilt components first: `auth/v1` login screen + `login-form.tsx` + `google-button.tsx` verbatim, `ThemeSwitcher` button idiom + `Select size="sm"` for the switcher, `mail/-components/mail-layout-config.ts` cookie-loader pattern + `use-chat`/`use-mail` zustand shape for `useRoleStore`, `AccountSwitcher` placement row.
- Draw the ASCII header diagram (`[≡][|][⌕] … [Role▾ District][👤]`) plus the role→queue scope flow for the user to verify, then WAIT for explicit approval before writing code.

## Step 1 — Build (SPEC 01 only)
- Login (arrange, don't redesign): keep `routes/(main)/auth/v1/login/route.tsx`, `auth/-components/login-form.tsx`, `social-auth/google-button.tsx` pixel-faithful. Submit with ANY input → `toast` "Signed in (prototype)" → navigate `/overview`. Demo hint caption under submit: `officer.demo@example.com / demo1234` (`text-xs text-muted-foreground`). Register link stays visual only.
- Entry: `/` and `/dashboard` redirect → `/overview` (edit the existing `dashboard/index.tsx` redirect target only; do NOT touch `__root.tsx` or `routeTree.gen.ts`).
- Role switcher (the ONE new file): `dashboard/-components/header/role-switcher.tsx` — `Badge variant="outline"` (current role) + `SelectTrigger w-36 size="sm"` with District/State/Ministry; zustand `useRoleStore` (default `district`) + cookie `mplads_role` (7d, path `/`), read in the dashboard loader alongside layout prefs. Mount LEFT of `AccountSwitcher` in `dashboard/route.tsx` header row.
- Roles constant: `[{value:"district",label:"District — Sehore"},{value:"state",label:"State — MP"},{value:"ministry",label:"Ministry — All states"}]`. Role is a filter preset only (District = Sehore-scope default, State = MP-wide, Ministry = all 6 states) — no hidden data, no guards, no sessions.
- Switch behavior: toast "Viewing as State Nodal Authority" (matching label) + persists across reload.
- Anonymization rule: placeholder demo identity only (`officer.demo@example.com`); NEVER real people/constituencies/MPs.
- Biome style: double quotes, semicolons, 2-space indent, sorted imports. Zero `any`. Never edit `src/components/ui/*`, `src/components/calendar/*`, `routeTree.gen.ts`.
- Do NOT build queue/dossier/map/copilot UI. Do NOT modify `mplads-schema.ts` / `mplads-mock.ts` (consume `OfficerRole` type from the contract where needed).

## Step 2 — Verify (evidence required)
- `tsc --noEmit -p admin-dashboard/tsconfig.json` shows no NEW errors (paste output; the 3 pre-existing template errors in `scroll-area.tsx`, `app-config.ts`, `chat-sidebar.tsx` don't count — confirm none are in files you touched).
- `biome check` on every file you created/modified passes clean.
- Click-path demo (paste what you did + saw): open `/` → lands on `/overview` with zero clicks; flip role → toast appears + queue scope label changes + reload persists role; open `/login` → renders identically to before (check dark mode + mobile brand-hidden); devtools console has zero errors.
- Regression sweep: `rg -i "arham|weblabs|studio admin|prior-author|debrand"` repo-wide (excl. `.git`, `node_modules`) returns CLEAN (the prompt files' self-mention doesn't count).
- No dead buttons added: every control you touched works or is absent.

## Step 3 — Sync context (mandatory)
- Append one bullet under `context/progress-tracker.md` → Completed (SPEC 01 done + verification evidence).
- Append a `flow.md` note: entry redirect (`/` → `/overview`) + role-store state flow (header switch → zustand + `mplads_role` cookie → queue scope preset).
- If you made any meaningful choice, append an ADR entry to `context/decision.md` (index + entry).
- Do NOT rewrite history entries.

## Step 4 — STOP
End your turn with: files created/modified, verification outputs, click-path evidence, and "SPEC 01 ready for verification — awaiting approval before SPEC 02." Do NOT proceed to SPEC 02 without explicit approval.
