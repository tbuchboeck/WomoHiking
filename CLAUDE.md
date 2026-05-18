# CLAUDE.md — Project-Local Instructions for Overnight Loop

**This file is read every iteration**. Override defaults from `~/.claude/CLAUDE.md` (the global one) where contradictory.

## Mission

Operate as the Coding Agent in a Two-Agent Harness (Anthropic Engineering pattern):
- The **Initializer** (interactive human + Claude session, 2026-05-17 evening) wrote `GOAL.md`, `LEARNED.md`, `PROGRESS.json`, this file, and committed Phase-0 fixes to the branch `claude/overnight-rework-2026-05-17`.
- You are the **Coding Agent**: each wakeup, read state, work on one open item, commit, schedule next wakeup, end your turn.

## At the start of every iteration

1. **Read in order**: `GOAL.md` (priority + Hard Rules) → `LEARNED.md` (prior insights) → `PROGRESS.json` (machine-readable state)
2. **Confirm branch**: `git rev-parse --abbrev-ref HEAD` must equal `claude/overnight-rework-2026-05-17`. If not, `git checkout` it.
3. **Pick ONE open item** from the highest unfinished phase. Phases run in numerical order (1 → 2 → 3a → 3b → 4 → 5 → 6 → 7).
4. **Check stop conditions** (`GOAL.md` "Stop Conditions" section). If any triggered, write the appropriate marker file (`STOPPED.md` / `BLOCKED.md`) and exit without rescheduling.

## At the end of every iteration

1. **Commit per task** (Hard Rule #7). Message format: `phase N: <short label> — <one-line why>`
2. **Update `PROGRESS.json`**: flip the item's `done: true`, increment `iteration` counter
3. **Append `LEARNED.md`** with any new insight (`operational`, `data-quirk`, `heuristic`, `failure-mode`, `decision`)
4. **Append `LOOP.log`**: `[iter N | YYYY-MM-DD HH:MM | phase X | item-id] <action summary>`
5. **`git push origin claude/overnight-rework-2026-05-17`**
6. **Schedule next wakeup** (15–20 min in the future via `ScheduleWakeup` with sentinel `<<autonomous-loop-dynamic>>`)

## Constraints

- **No destructive git operations**: no `--force`, `--no-verify`, `reset --hard`, `clean -f`, `checkout --`, `branch -D`.
- **No merging to `main`**: PR is opened at end; Thomas merges.
- **No MCP tools**: no Gmail / Slack / Drive / Calendar / Atlassian / Playwright. Filesystem + git + gh + curl + jq + vercel CLI only.
- **No changes to auth stack**: `auth.js`, `auth.css`, `manifest.json` auth-related fields are out of scope. The 2026-05-17 security incident is closed; do not re-open it.
- **No new dependencies**: the single-file-HTML pattern is intentional (`~/wiki/wiki/concepts/single-file-html-pattern.md`). No bundler, no build step. CSS/JS inline in the HTML.
- **External API throttling** (GOAL.md Hard Rule #5):
  - Park4Night: 1 req / 3 sec (back off to 1/10 on 429)
  - Outdooractive / Alpenvereinaktiv: 1 req / 2 sec
  - Cache responses in `.loop-state/cache/<url-hash>.json` to avoid duplicate hits across iterations

## What to do when you get stuck

If an iteration cannot make progress on its picked item:

1. **First try** something different: search for an alternative source, relax a constraint, or skip to the next box.
2. **If still stuck**: leave the item unchanged, add an entry to `LEARNED.md` under `failure-mode` with what you tried + why it failed, pick the *next* open item.
3. **3 consecutive no-progress iterations** = STOP (GOAL.md stop condition). Write `BLOCKED.md` describing what couldn't move + which items got skipped. Push. Exit without rescheduling.

## Resources you can read

- `~/wiki/wiki/concepts/autonomous-overnight-loop-criteria.md` — the architecture of this loop (Reflexion + Two-Agent)
- `~/wiki/wiki/projects/20260404-womo-hiking/overview.md` — historical project context (may be stale, last_updated 2026-04-25)
- `~/wiki/wiki/me/preferences.md` and `working-style.md` — Thomas's user profile
- The project's own `DOCUMENTATION.md` and `projektwissen-wanderungen-1.md`

## Resources you should NOT touch

- `~/.claude.json` (already-rotated Supabase keys live here — touching = bad)
- `~/.bashrc`, `~/.zshrc`, `~/.ssh/`, anything in `~/.claude/`
- Any other project under `~/projects/` — this loop is scoped to `~/projects/20260517-womohiking/` only
