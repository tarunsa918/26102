# SPEC 05 — AI copilot (`/ai`)

## Purpose
Global investigation assistant where trust is the feature: grounded ONLY in SPEC-00 data, every claim cited, tool calls rendered as UI. Scripted brain for prototype (decided — no key, offline, demo-proof); signatures ready for real-LLM swap.

## Layout (exact — `(main)/chat` 3-pane clone, same classes)
```
<SidebarProvider flex-col> [--header-height var]
  <ChatHeader twin: "MPLADS Copilot" + search conversations + New chat>
  <div flex flex-1>
    <ConversationList w-[22.5rem]: groups Today/Earlier (avatar rows? no — title rows + time + pin)>
    <Thread flex-1: MessageScroller + composer>
    <ContextPanel hidden lg:block w-80: current scope snapshot (role, state filter, top-3 flags mini-cards)>
  </div>
  mobile: list/thread slide + Sheet for context
</SidebarProvider>
```

## Thread anatomy (donor components, exact)
- Messages: `Message align=start|end` + `Avatar size-8` (assistant: Sparkles in muted well; officer: initials) + `Bubble` (assistant `muted`, officer `primary`) + `BubbleReactions` on assistant turns + `MessageFooter` time muted xs. Auto-scroll + bottom button (`MessageScroller` verbatim).
- **Tool-call cards** (answer-as-interface, built from Card/Table/Badge — the ONLY new compositions):
  - `WorkCard`: severity badge + title link (→ dossier) + peer one-liner + amount. Used by top-risk answers.
  - `PeerCompareTable`: 3-col mini table (Metric | This work | Peer median) rows: expenditure, progress, stall days. Used by compare answers.
  - `MissingDataCallout`: amber `Alert` listing gaps ("Progress missing 96d · 2 evidence files, no completion cert").
- **Citations**: superscript `[1]` chips after claims → `Popover` (source: work field / evidence file / peer stat + "Open source" link). "No supporting data" muted state when corpus can't answer — NEVER invented numbers.
- **Composer**: chat composer verbatim + suggestion-chip row above it: ["Top risks in my scope", "Why was W-1014 flagged?", "Compare W-1014 with peers", "What's missing on W-1007?", "Summarize Sehore district"].
- Failure: service banner `Alert destructive` + Retry (scripted brain can't fail — banner reserved for real-LLM phase; include component hidden behind flag).

## Scripted brain (deterministic router — implement EXACTLY this)
```
match(intent):
  top-risk            → rank flagged in scope → text + WorkCard ×3 + "Open dossier" links
  why-flagged {id}    → flag explainer template (SPEC 00 sentence) + PeerCompareTable + MissingData?
  compare {id}        → PeerCompareTable + verdict sentence
  missing {id}        → MissingDataCallout + evidence list
  district {name}     → geo-rollup summary + top-2 WorkCards
  fallback            → "I can answer from works data: try one of the suggestions." + chips
```
Keyword match on id pattern `W-\d+`, district names, stems (risk/why/compare/missing/summary). Latency: 600ms simulated typing (spinner) for demo realism. Seeded demo conversation (officer asks top-risk → why W-1014 → compare) preloaded so judges see value instantly.

## Tools (signatures the future `ai.chat` server fn exposes; prototype = local fns over mock)
`searchWorks(filters)`, `getWork(id)`, `comparePeers(workId)`, `explainFlag(anomalyId)`, `listEvidence(workId)` — all typed by SPEC-00 Zod, all logged to activity when invoked from dossier context.

## Metrics shown
Context panel: role badge, scope counts (works/high/delayed in scope), top-3 flag mini-cards (severity dot + id + headline, click → dossier).

## Charts used
None in thread (cards/tables carry numbers). Context panel reuses badge meter idiom only.

## States & persistence
Conversations persist localStorage (SPEC 00); empty (new chat → suggestions); error banner (future); mobile Sheet.

## Out of scope
Real LLM/streaming/voice, file understanding beyond mock docs, multi-user history, server persistence.

## Acceptance
- All 5 suggestion prompts return cited tool cards with working dossier links; gibberish input hits fallback (never hallucinated numbers — test: ask about non-existent W-9999 → "not in demo sample"); reload restores thread; dark/mobile clean.
