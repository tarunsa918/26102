# SPEC 01 — Login + entry (`/login`, open app)

## Purpose
Auth screens kept for completeness; prototype **opens straight into `/overview`** (decided 2026-09-06). Role lens (District / State / Ministry) lives in the **dashboard header** so judges flip authority views anytime.

## Routes & files (all EXIST — arrange, don't create)
- KEEP VERBATIM: `routes/(main)/auth/v1/login/route.tsx` (split panel §1b) + `auth/-components/login-form.tsx` + `social-auth/google-button.tsx`. Submit (any input) → toast "Signed in (prototype)" → navigate `/overview`. Register link stays visual.
- Entry: `(external)/index.tsx`-style redirect — `/` and `/dashboard` → `/overview` (edit existing `dashboard/index.tsx` target; do NOT touch `__root.tsx`).
- ADD ONE control in `dashboard/-components/header/` (new file `role-switcher.tsx`, cloned from `ThemeSwitcher` button + `Select size="sm"` idiom): `Badge` (current role) + `Select` District/State/Ministry → zustand `useRoleStore` + cookie (copy `mail-layout-config.ts` loader pattern). Placed LEFT of `AccountSwitcher` in `dashboard/route.tsx` header row.

## Layout (header addition only — auth screens unchanged)
```
HEADER: [≡][|][⌕] ........ [⚙][☀][gh][Role▾ District][👤]
                                            ^^^^^^^^^^^^^^^ NEW
```
Role `SelectTrigger w-36 size="sm"`; role `Badge variant="outline"` prefix. Queue/dossier read role from store (District = Sehore-scope default filter; State = MP-wide; Ministry = all 6 states) — filter presets only, no hidden data in prototype.

## Metrics shown
None (entry has no KPIs). Login card keeps demo hint: `officer.demo@example.com / demo1234` muted caption under submit (any input accepted).

## Data display
- Roles constant: `[{value:"district",label:"District — Sehore"},{value:"state",label:"State — MP"},{value:"ministry",label:"Ministry — All states"}]`.
- Cookie `mplads_role` (7d, path `/`), read in dashboard loader alongside layout prefs; zustand mirrors.

## States
- First visit: role = district. Switch → toast "Viewing as State Nodal Authority" + queue re-scopes + persists reload.

## Out of scope
Real sessions, RBAC enforcement, password reset, register backend, route guards.

## Acceptance
- `/` → `/overview` with zero clicks; role switch re-scopes queue + persists; `/login` renders pixel-faithful (dark + mobile brand-hidden); no console errors.
