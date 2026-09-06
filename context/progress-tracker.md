# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

**Phase 0 — Project Foundation**

Template hardening: making the execution protocol enforceable so AI agents actually follow it.

## Current Goal

Fix the template so agents comply with the workflow: auto-loaded entry point, hard gates,
unambiguous rules, and instant project understanding via the three living context files.

## Completed

- **Skills bootstrap via `Skills.py --yes` (2026-09-06)** — installed 34 skills into `.agents/skills/` (8 GSAP, 1 Hallmark, 13 Taste, 12 Emil Kowalski — all security-clean per installer). Impeccable design engine FAILED (`npm ECOMPROMISED` — skipped, not forced). Side effect: `npm init -y` created root `package.json`. Open: Spec Kit (`specify`) install+init DONE (2026-09-06) — `specify-cli` via uv, `specify init --here --force --non-interactive --integration opencode`; `.specify/` + `.opencode/commands/` scaffolded, root `AGENTS.md` untouched.
- **Key-collision fix in `GitHubRepositoriesMenu` (2026-09-06)** — the menu hrefs were all `#` while the list used `key={repository.href}`, causing duplicate-key warnings; switched key to `repository.label`. No logic or routes changed.
- **Dashboard setup in `admin-dashboard/` (2026-09-06)** — pruned unused docs (`README.md`, `CONTRIBUTING.md`, `LICENSE`, `media/`); set package and display naming (`Admin Dashboard` in `package.json`, `package-lock.json`, `.cta.json`, `manifest.json`, `app-config.ts`, `AGENTS.md`); neutralized sidebar support card and header repository menu (placeholder links); standardized demo data on placeholder identities (`Alex Carter`, `Jordan Lee`, `Example Corp`, `example.com`). No logic or routes changed; no build/lint run per project rule (validation only on explicit request).

- **Root `AGENTS.md` added** — auto-loaded by agents; contains the 3 non-negotiable rules, file reading order, and failure consequences so agents see the protocol even if they never open `Agent.md`.
- **`Agent.md` rewritten for enforceability** — mandatory routine (read context → classify → load skill → design-first → implement → sync context → verify), required response status block, hard approval gate in the design workflow, context sync protocol, expanded pre-exit checks.
- **`context/flow.md` added** — Mermaid architecture/user-flow/request-response diagrams, function call maps, route + API tables, mandatory update protocol.
- **`context/decision.md` added** — append-only ADR-style decision log with template, index, and update rules.
- **`Scaffold.py` removed** — npm/create-app provides boilerplate; the `folder-structure` skill's canonical trees are now the source of truth, materialized by hand.
- **References updated** — `SKILLS.md`, `README.md`, `.agents/AGENTS.md`, `.agents/folder-structure/SKILL.md`, `context/ai-workflow-rules.md` all updated to remove Scaffold.py and point to the canonical trees + new context files.

## Next Up

1. Decide whether the `folder-structure` skill trees need simplification (user wants "concise and clear, senior-engineer hierarchy")
2. Fill the template `context/*.md` placeholders per project

## Open Questions

- None

## Architecture Decisions

See `context/decision.md` for full decision records.

