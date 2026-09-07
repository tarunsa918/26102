# Project Overview — SIH26102 MPLADS Sentinel

## What this is

An **AI-powered monitoring and analytics platform for MPLADS** (Members of Parliament Local Area Development Scheme) — **Smart India Hackathon 2026, problem statement SIH26102** (MoSPI, Software, Miscellaneous).

MPLADS funds thousands of local development works (roads, community halls, water facilities) through many implementing agencies. The system analyzes **sanctions, expenditures, cost estimates, work progress, payments, and asset creation** to detect **cost overruns, duplicate works, delayed/stalled projects, unusual spending patterns, and deviations from norms** — and turns them into **risk-based alerts, predictive insights, and decision-support dashboards** for District Authorities, State Nodal Authorities, MPs, and the Ministry.

## Product thesis (from our ChatGPT design study, `chat.md`)

> Don't build "an AI dashboard." Build a **government investigation workspace**: turn thousands of project records into a **prioritized, explainable case file** where every AI insight traces back to data or evidence.

Ruthless filter for every feature: **does this reduce the officer's time to identify, understand, verify, or act on a project?** If not, it doesn't belong in the MVP. Flags mean **"needs review," never "fraud."**

## The officer loop

**Overview** ("what needs attention?") → **Works** (search/filter the queue) → **Work dossier** (financials, progress, explained anomalies, evidence) → **AI copilot** ("why? compare? what's missing?") → **Officer decision** (Verified / Dismissed / Action Required) → activity log.

## MVP routes (5 routes, 3 core)

| Route | Purpose | Status |
|-------|---------|--------|
| `/login` | Officer sign-in (template auth screens) | reuse template |
| `/overview` | KPIs + India risk map + high-priority queue | **to build** |
| `/works` | Searchable/filterable works table, risk as a lens | **to build** |
| `/works/:workId` | Dossier: summary, financials, progress, explained anomalies, evidence, activity, contextual AI, status state machine | **to build** |
| `/ai` | Global AI copilot interface | **to build (template chat UI as base)** |

Everything else is a component/section/modal — not a page. Documents live **inside** a work, never as their own universe.

## Where we stand

- **Frontend shell: DONE.** `admin-dashboard/` (TanStack Start + shadcn) runs at `http://localhost:3000` with 20+ screens, 61 UI primitives, charts (recharts), an SVG map pattern (d3-geo + topojson), tables, chat, file-manager, kanban. This is our component donor — we reuse components, never its product structure.
- **Backend: NOT STARTED.** `src/server/` holds only cookie/preference functions. No database, no API for works/anomalies/evidence, no auth backend.
- **ML/anomaly engine: NOT STARTED.** Needed detectors: cost outlier vs peer groups, expenditure pattern, delay/stalled, near-duplicate works — plus explainable flag attribution.
- **Prototype strategy: UI-first, working demo.** For the hackathon prototype the UI must work end-to-end on **bundled mock data shaped like the real eSAKSHI schema** (same fields the backend/ML will later produce), so screens, flows, and the judge demo are real while backend/ML are built behind the same interfaces.

## Goals

1. **Win the demo**: a judge playing an officer finds a risky work, understands *why* in seconds, inspects evidence, asks the AI, and records a decision — in under 5 minutes.
2. **Explain every alert** with peer comparison numbers (no naked "Risk Score: 87").
3. **Real-data-shaped prototype**: mock data mirrors eSAKSHI fields (sanctions, expenditure, progress, payments, assets) so backend/ML can slot in without UI rewrites.
4. **No scope creep**: 5 routes max; template pages outside the officer loop stay out.

## Target audience

- **Primary**: District Authority officers (daily triage + investigation), State Nodal Authorities, MoSPI reviewers.
- **Secondary (demo day)**: SIH judges evaluating problem fit, AI credibility, and usability.
- Needs: which works need attention *now*, why they were flagged (in plain words + numbers), evidence to verify, a way to record what they decided. Pain: thousands of works, manual monitoring, opaque reports.

## Success metrics

- Judge completes Overview → queue → dossier → AI question → decision unaided.
- Every anomaly shown carries: peer-group size, median vs this work, and at least one corroborating signal.
- All 5 MVP routes work on mock data with loading/empty/error states; no dead buttons on the demo path.
- SIH submission: idea + working prototype aligned to the official PS (deadline 20 Sept 2026).
