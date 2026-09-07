# SPEC 02 — Overview (`/overview`)

## Purpose
Morning command centre answering "what needs attention?" in 30 seconds. Most-judged screen. Deliberately chart-light: KPIs + map + queue beat pie charts (chat study).

## Layout (exact — clone `default/route.tsx` rhythm)
```
<div @container/main flex flex-col gap-4 md:gap-6>
  <KpiStrip/>                                            ← §A
  <div grid grid-cols-1 gap-4 xl:grid-cols-12>
    <div xl:col-span-7> <IndiaRiskMap/> </div>            ← §B
    <div xl:col-span-5> <PriorityQueue/> </div>           ← §C
  </div>
</div>
```
No page-title hero (KPIs ARE the header). Mobile stacks map above queue.

## §A KPI strip — 5 cards (clone `default/metric-cards.tsx` anatomy EXACTLY)
Card anatomy per metric: `Card` (no CardAction) → `CardHeader > CardTitle > div.flex.size-7.rounded-lg.border.bg-muted.text-muted-foreground > Lucide size-4` + `CardDescription` + `CardContent flex flex-col gap-1 > div flex flex-wrap items-center gap-2 > div font-medium text-3xl tabular-nums leading-none tracking-tight + Badge + p text-muted-foreground text-sm`. Grid `grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4`. NO sparklines.

| # | Icon | Title (CardTitle) | Value | Badge | Caption |
|---|------|-------------------|-------|-------|---------|
| 1 | LayoutDashboard | Total Works | 12,482 | default `+2.1%` TrendingUp | Scheme snapshot, all states |
| 2 | Loader | Under Execution | 4,821 | default `+3.4%` | Active works in demo scope |
| 3 | Clock3 | Delayed | 386 | destructive `-8.2%` TrendingDown | Past due date |
| 4 | AlertTriangle | High Risk | 73 | destructive `9 new` | Needs review now |
| 5 | Banknote | Overrun exposure | ₹41L | destructive `+₹6L` | Above peer estimates |

"Scheme snapshot" = static constants; queue/map below use the 40-work demo set (caption the queue card "Demo sample · 40 works" to stay honest).

## §B India risk map (clone `logistics/shipment-route-map.tsx` mechanics EXACTLY)
- Same file shape (220-line pattern): `geoMercator()` + `fitExtent([[72,72],[928,448]], indiaBbox)` + `geoPath`; `topojson feature` (states fill) + `mesh(a!==b)` (state borders); container `size-full overflow-hidden`, SVG `viewBox 0 0 1000 520 preserveAspectRatio=xMidYMid meet`, row height 320/420px.
- **Source**: India STATE TopoJSON (**TO ADD** — state-level only, decided; put in `public/geo/india-states.json`, fetch client-side with cancel flag like the donor; failure → zinc silhouette + `Skeleton`).
- **Fills**: base states `fill-muted`-equivalent zinc; risk wash by high-flag count: 0 = zinc, 1 = amber `bg-amber-500/15`, ≥2 = destructive `bg-destructive/15`; borders hairline. Selected state: `stroke-primary strokeWidth 2`.
- **Interactions**: hover → `Tooltip` (`{State} · {works} works · {high} high-risk`); click → navigate `/works?state={State}` (validateSearch pattern §5 catalog); selected state persists via URL.
- **Chrome**: `Card` wrapper with title "Risk geography" + `CardDescription` "High-flag concentration by state" + legend row (3 swatches zinc/amber/red + labels) bottom-left overlay.
- Colors via theme tokens where possible; keep donor's hardcoded ocean/land hexes ONLY for ocean/land base (documented exception §2 catalog).

## §C Priority queue (clone `tasks` table condensed to 8 rows, NO pagination)
- `Card` titled "Needs your attention" + `CardDescription` "Demo sample · 40 works" + `CardAction` link-button "View all →" → `/works?lens=high-risk`.
- Columns: Severity (`Badge` wash + dot, §2) | Work (link `font-medium text-sm` + mono `#W-1014` muted sub) | Reason one-liner (`text-sm`, generated from comparison template SPEC 00, truncate) | District (muted) | Amount (`tabular-nums` right).
- Rows: top-8 by severity then amount; row click → `/works/W-1014`-style dossier. First row MUST be flagship `W-1014` (cost 2.4× + 96d stall).
- Empty: `Empty` + "All clear — no high-risk works in scope."

## Charts used
Map (SVG geo) + badges only. NO recharts on this route — by design.

## Behaviors & states
- Map click ↔ queue filter two-way via `?state=`; role switch re-scopes counts; `Skeleton` cards while "loading" (simulate 400ms for demo realism? NO — render instantly, skeletons only for map fetch); dark mode verified.

## Out of scope
District drill-down, time-range selects, export, second tab.

## Acceptance
- 30-second story test (new viewer narrates the problem without help); map click filters queue; every row navigates; judge's first click lands on W-1014 dossier; zero dead controls.
