# Code Standards (verified against `admin-dashboard/`)

## General

- Keep components small and single-purpose (~300 lines max); `route.tsx` only composes `-components/`
- Fix root causes — grep every caller, fix once where all callers route through
- Never `npm install --force` / `npx install --force`
- Reuse in-repo patterns before new code: existing screen → stdlib → installed dep → only then new code

## TypeScript

- Strict mode; no `any` — precise interfaces (`interface` for objects, `type` for unions/aliases)
- Validate all client-controlled input with **Zod** at server-function boundaries
- `@/` import alias everywhere; Biome: double quotes, semicolons, 2-space indent, sorted imports, 120-col width

## TanStack Start (NOT Next.js — no app router, no server components, no `index.ts` public APIs)

- File-based routes in `src/routes/`; `(main)`/`(external)`/`(legacy)` are organizational only; `-`-prefixed files/dirs are route-excluded
- `route.tsx` per directory creates the route/layout; nested content via `<Outlet />`; `$param.tsx` = dynamic segment
- **Never edit `src/routeTree.gen.ts`** (generated; `npm run generate-routes`)
- **Never edit `src/components/ui/*` or `src/components/calendar/*`**
- SSR by default; browser-only APIs in effects, guarded client code, `<ClientOnly>`, or `createClientOnlyFn`
- Server work via `createServerFn` in `src/server/` (+ Zod `.validator()`); do not expose raw server imports to client beyond the fn
- New screen checklist: closest reference screen inspected → `-components/` split → added to `sidebar-items.ts` if navigable → theme-token-only styling → loading/empty/error/disabled/overflow states → a11y (labels, focus, ARIA)

## Colocation (actual structure — NOT features//shared/)

- Screen code lives with its route: `src/routes/(main)/dashboard/<screen>/-components/` (+ local `data.ts` for prototype mock data)
- Shared donors: `src/components/` (ui primitives, date-range-picker), `src/hooks/` (`use-mobile`, `use-lg`), `src/lib/` (utils, preferences, data-table-features), `src/navigation/`, `src/stores/preferences/`
- Promote to shared only on second use; never import another screen's `-components/`; never use `(legacy)/*` as reference

## Data & tables

- Tables: TanStack Table with `columns.tsx` + `schema.ts` (+ Zod) + `table.tsx` + data file — copy `crm/` or `tasks/`
- Prototype mock data: `-components/data.ts` typed by Zod shapes in `src/lib/mplads-schema.ts` (to create) — identical shape to future server responses so mock→real is a one-line swap
- Charts: always through `src/components/ui/chart.tsx` (recharts); maps: `shipment-route-map.tsx` SVG pattern (d3-geo + topojson-client)

## Styling

- Semantic tokens only (`bg-card text-muted-foreground border …`); named Tailwind palette only when tokens can't express it; never raw hex/RGB/OKLCH
- Match nearby screens in density/borders/radius/width; `tabular-nums` for figures

## Animation

- `transform` + `opacity` only, ≤300ms, `ease-out` (never `ease-in`), never from `scale(0)`; `prefers-reduced-motion` respected everywhere

## Backend (to build)

- `src/server/mplads/*.ts`: `works.list/get`, `anomalies.list`, `evidence.list/upload`, `decisions.record`, `activity.append`, `ai.chat` — each a validated `createServerFn`
- Anomaly engine + DB choice are open questions (see progress-tracker); prototype runs on bundled mock data behind the same function signatures

## Pre-commit checks

1. `npm run lint` / `check` / `build` pass (run only when user explicitly requests validation)
2. `progress-tracker.md` (+ `flow.md`/`decision.md` if applicable) updated
3. No hardcoded colors; motion-safe; no `components/` dumping; colocation respected
