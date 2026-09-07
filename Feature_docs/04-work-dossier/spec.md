# SPEC 04 — Work dossier (`/works/:workId`) — THE differentiator

## Purpose
One explainable case file per work. If this screen is average, we lose. 60-second "why flagged" test with a non-technical reader is the bar.

## Layout (exact — `profile/route.tsx` skeleton, same classes)
```
<div flex flex-col gap-4 py-4 data-content-padding=false>
  <Breadcrumb px-4: Works / {District} / #{id} / Dossier>
  <header px-4 lg:flex-row lg:items-end justify-between gap-5>          ← profile-header twin
    left: [status ring + type icon size-16] [h1 title text-xl/2xl + mono #W-1014 · agency · district]
          [badges: severity wash | status Verified/Dismissed/Action-needed | type | stalled?]
    right: [Assign][Export][⋮ duplicate menu]
  </header>
  <Tabs line scrollable border-y: Overview|Financials|Progress|Anomalies|Evidence|Activity>
  <div px-4 md:px-6> <TabsContent per tab> </div>
  <DecisionBar sticky bottom-0 />                                       ← every tab
  <ContextualAI docked right xl:col-span-4 / Sheet mobile>              ← Anomalies+ tabs
</div>
```

## Tab contents (donor → adaptation, field-level)

**Overview** (`profile-overview` 3-col `dl` grid: `dt muted xs / dd sm`): sanctioned / spent / utilisation % / agency / sanction date / due date / last update / progress / district-state. Right `18rem` aside (`profile-status-sidebar` twin): Record status (Active review + updated by/at) + Key dates (due, last update, stall days).
**Financials** (`finance` donors): KPI mini-row (Sanctioned ₹58.9L / Spent ₹41.2L / Utilisation 70% — `font-heading text-3xl` + delta badges) + `transactions-overview` **Line** (expenditure over time + peer-median dashed band via second series, `connectNulls`, time X) + `balance-distribution` **donut** (fund split: released/spent/balance + center total). All `formatCurrency` + `tabular-nums`.
**Progress** (`academy/performance` timeline idiom): milestone rows (Foundation/Lintel/Roofing/Finishing) each with planned-vs-actual stacked bar + % + dates; stall callout `Alert` amber ("No update in 96 days — expected fortnightly") when applicable.
**Anomalies** (NEW composition from primitives — the screen that wins):
```
per flag Card border-l-4 (destructive|amber|emerald by severity):
  header: [severity Badge + kind Badge]  headline font-medium
  "Why flagged" box (bg-muted/50 rounded-lg p-4):
    big line: ₹58.9L vs ₹24.6L median (text-2xl tabular-nums, actual in destructive)
    sub: across 18 similar community-hall works in Sehore
    peer bar: track h-3 rounded (median band marker + this-work marker, academy idiom)
    corroboration row: Clock icon "No progress update in 96 days" (signals[] each with icon)
    AI sentence muted: "Warrants manual review — spend and execution both deviate."
  actions: [Compare peers][View evidence → Evidence tab][Ask AI → opens contextual panel with prompt]
"Insufficient comparison" Empty state when peerN < 8 (eat own dogfood: show honesty UI).
```
**Evidence** (`file-manager` clone): Upload `Button` (wires `Attachment` states idle→uploading→done, simulated 1.2s) + `?view=` grid/list toggle (copy verbatim) + kind icons (doc/photo/report) + uploader + date meta. 2+ seeded files per flagged work.
**Activity** (`invoice`-timeline idiom): reverse-chron list (actor avatar + action + note + relative time); decision submissions prepend instantly.
**DecisionBar** (sticky `bottom-0 bg-background/95 backdrop-blur border-t px-4 py-3`): `ToggleGroup` Verified(green dot)/Dismissed(muteds)/Action Required(amber dot) + notes `Textarea` (`min-h-16`, placeholder per status) + Submit → `AlertDialog` confirm ("Record as Action Required? This writes to the activity log.") → toast + activity prepend + header status badge update + persist (SPEC 00).
**ContextualAI**: `chat` thread mini pre-seeded with work context + 3 suggestion chips ("Why was this flagged?" → scrolls Anomalies + highlights card; "Compare with peers"; "What's missing?" → MissingData amber callout). Desktop docked, mobile `Sheet`.

## Metrics & hierarchy (top→bottom priority)
1. Severity + headline (decision in 5s) 2. Why-flagged numbers (understand in 60s) 3. Financials/progress (verify) 4. Evidence/AI (depth) 5. Decision (act).

## Charts used (existing only)
Line+peer-band, donut, timeline stacked bars, peer marker bars. No new types.

## States
Every tab: loading `Skeleton`, empty `Empty`, error `Alert` + retry. Compensation-style lock pattern NOT used (all visible in prototype).

## Out of scope
Edit-work flows, real upload backend, assignment backend, role gating.

## Acceptance
- Non-technical 60-second test; decision end-to-end (toggle+note+confirm+toast+activity+badge+persist); upload simulates to done and appears; deep-link `/works/W-1014?tab=anomalies` works; dark + mobile (AI in Sheet).
