# SPEC 03 — Works queue (`/works`)

## Purpose
The full ledger with **risk as a lens** — "tell me which 20 deserve attention". Search + filter + sort + paginate over the 40-work set, every row opening its dossier.

## Layout (exact — `ecommerce` header + `tasks` toolbar + `crm` table)
```
<div flex flex-col gap-4>
  <div flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between>   ← ecommerce header
    <div> h1 text-3xl tracking-tight "Works" + p muted sm "{N} MPLADS works · demo sample" </div>
    <div flex flex-wrap items-end gap-2> [State▾ w-40][District▾ w-40][Type▾][Reset] </div>
  </div>
  <Card>                                                                    ← tasks Card
    <toolbar border-b px-4 py-4: [search Input h-7 pl-8 lg:w-80] [Severity multi-check] [Anomaly-kind multi-check] [column-visibility menu]>
    <lens ToggleGroup ?lens=all|review|high>                                ← file-manager URL pattern
    <Table: columns below> <footer: selected + rows-per-page + sliding pagination>
  </Card>
</div>
```

## Columns (clone `crm/opportunities-table/columns.tsx` cell idioms EXACTLY)
| Col | Cell anatomy | Data |
|-----|--------------|------|
| select | Checkbox + Subscribe(rowSelection) | — |
| ID | `div w-20 font-mono text-sm text-muted-foreground` | `#W-1014` |
| Work | icon-cell: `span size-8 rounded-md border bg-muted` + type Lucide + `div: truncate font-medium text-sm` title + `truncate text-xs muted` agency | title/agency |
| District | `text-sm` + muted state sub | Sehore · MP |
| Amount | `font-medium tabular-nums text-right` | ₹58.9L |
| Progress | mini meter: `h-1.5 rounded-full bg-muted` fill + `%` muted (emerald <55 / amber ≥55 / destructive ≥70 per infra idiom) | 12% + "96d stall" destructive suffix when stalled |
| Severity | `Badge outline gap-1.5 rounded-sm` + `size-1.5 rounded-full bg-current` dot + label | High/Medium/Low/Clear |
| Kind | `Badge outline rounded-sm` (cost/expenditure/delay/duplicate/utilisation/—) | kind or "—" |
| Updated | two-line joined (`d MMM yyyy` + muted `h:mm a`) | lastUpdate |
| actions | ghost icon `MoreHorizontal` → menu: Open dossier / Copy ID | — |

## Filters & sorts (all client-side via `lib/data-table-features.ts` fns)
- Search: id+title+agency `includesString` (resets page).
- Header selects: State / District / Type (`equalsString`); toolbar: Severity multi-check, Kind multi-check; lens toggle `?lens=` (all | needs-review = severity≠clear | high-risk); Reset (destructive `Button` w/ X) clears all.
- Sort: severity rank → amount desc default; clickable Amount/Updated headers (tasks title-menu idiom).
- Pagination: 10/page default, 10/20/30/40/50, sliding window + `Page X of Y` + rows-per-page (copy `tasks` footer verbatim).

## Metrics shown
- Subtitle count updates with filters ("23 of 40 works"); footer "N of M selected"; lens counts in toggle labels (All 40 · Review 12 · High 5).

## Charts used
None — table + inline meters only. Progress meters ARE the visualization.

## States
- Loading: `Skeleton` rows (first paint only). Empty: `Empty` + "No works match — clear filters" + Reset button. Row hover `bg-muted/20`; selected `border-primary bg-muted/50` (logistics idiom).

## Out of scope
Server pagination, saved views, bulk actions, export, column pinning.

## Acceptance
- Combine state+severity+kind+search → correct subset + counts; URL (`?lens=&state=&q=`) shareable and restores; every row opens correct dossier; empty state reachable and recoverable; keyboard navigable.
