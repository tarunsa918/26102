# SPEC 00 — Mock-data contract (feeds all 5 routes)

## Purpose
One shared dummy-data contract so all screens build against identical shapes that future server fns + ML will return. Swapping mock → real = one-line change per call site. **No screen may invent its own work/anomaly field names** — import from here.

## Files to create
- `admin-dashboard/src/lib/mplads-schema.ts` — Zod schemas + inferred TS types (single source of truth).
- `admin-dashboard/src/lib/mplads-mock.ts` — seeded builders + the 40-work dataset + geo rollup + KPIs. Seeded RNG (mulberry32, seed `26102`) so every reload renders identical demo.
- Each route keeps a thin `-components/data.ts` that re-exports its slice (queue rows, dossier bundle, vb.) — never duplicated shapes.

## Exact Zod shapes

```ts
Work = { id: `W-${4 digits}`, title, type: road|community-hall|water|school|drainage|streetlight,
  state, district, agency, status: in-execution|completed|sanctioned|stalled,
  sanctionedLakh, expenditureLakh, progressPct, sanctionDate: yyyy-MM-dd,
  dueDate, lastUpdate, lat, lon }
Anomaly = { id: `A-${id}`, workId, kind: cost|expenditure|delay|duplicate|utilisation,
  severity: high|medium|low, headline, peerN: number, peerMedianLakh: number|null,
  actualLakh: number|null, unit: "₹L", corroboration: string,
  signals: { label, value: string }[] }   // ≥1 corroborating signal REQUIRED
Evidence = { id: `E-${id}`, workId, kind: doc|photo|report, name, sizeKb, uploadedAt, by }
Activity = { id, workId, at: ISO, actor, action, note? }
Decision = { workId, status: verified|dismissed|action-required, note, at, by }
OfficerRole = district|state|ministry
```

## Exact seed plan (deterministic)
- **Geography**: 6 states (Madhya Pradesh, Rajasthan, Bihar, Odisha, Karnataka, Assam) × 2 districts each = 12 districts. District names real (officers recognize them); **work titles/agencies fictionalized** (`Contractor-07`, `Agency-East-3`) — never a real person/constituency/MP.
- **Works**: 40 total — 18 in-execution, 8 stalled (>90d no update), 7 completed, 7 sanctioned. Amounts ₹4L–₹90L; peer groups = same type + same state, size 8–18.
- **Flags**: 12 works flagged → 5 high (2 cost, 1 duplicate, 1 delay, 1 expenditure), 4 medium (2 delay, 1 utilisation, 1 cost), 3 low. Flagship demo work `W-1014` (community hall): cost 2.4× peer median (₹58.9L vs ₹24.6L, peerN 18) + 96d stall — the double-signal the judge opens first.
- **Evidence**: 6 files across flagged works (site photos, completion certs, measurement sheets) + upload-simulated additions at runtime.
- **Activity**: 2–4 seeded entries per flagged work (system flag events + 1 officer note).
- **Geo rollup**: `{ state, works, high, delayed, stalled }` derived from works (compute, don't hand-write) for map + KPIs.
- **KPIs**: Total Works 12,482 (scheme-scale headline) / Under Execution 4,821 / Delayed 386 / High Risk 73 / Overrun exposure ₹41L — static constants (labeled "scheme snapshot"), while queue/dossier use the 40-work set (labeled "demo sample").

## Formatting rules (no exceptions)
- Money: existing `formatCurrency` idiom + `tabular-nums`; lakh display as `₹58.9L`.
- Dates: date-fns (`d MMM yyyy`, relative "96d ago" for stalls).
- Comparison sentence template (used by dossier + copilot + queue reason): "`{Actual} vs {peer} median across {N} similar {type} works in {district}`".

## Persistence (decided 2026-09-06)
Seed loads first visit; decisions/notes/uploads/conversations → localStorage key `mplads-demo-v1` (versioned; shape-change = bump + reseed). "Reset demo data" control in header account menu restores seeds.

## Out of scope
Real eSAKSHI ingestion, DB, ML engine, auth backend.

## Acceptance
- `mplads-schema.ts` parses the entire seed with zero errors; all 5 routes render offline; zero `any`; Biome clean.
