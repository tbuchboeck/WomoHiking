# WomoHiking — Overnight Rework Loop Goal

**Branch**: `claude/overnight-rework-2026-05-17`
**Initialized**: 2026-05-17 by interactive Initializer (Thomas + Claude)
**Pattern**: Reflexion (Shinn et al. 2023) + Anthropic Two-Agent Harness
**Source for criteria**: `~/wiki/wiki/concepts/autonomous-overnight-loop-criteria.md`

## Hard Rules (promoted from LEARNED.md — read every iteration)

1. **No force-push, no rewriting public history.** All commits go on this feature branch. No `--force`, no `--no-verify`, no amends to pushed commits.
2. **No merge to `main`.** PR is opened at end, Thomas reviews + merges.
3. **No MCP-tool calls.** This loop touches only files, git, gh, curl, jq, vercel CLI. No Slack/Gmail/Drive/Calendar/Atlassian/Browser.
4. **No auth changes.** auth-buchboeck and the Supabase/Passkey stack are out of scope after the 2026-05-17 incident closeout. Don't touch `auth.js`, `auth.css`, `manifest.json` auth flow.
5. **External APIs are throttled.**
   - Park4Night: max 1 request / 3 seconds; back off to 1 / 10s on first HTTP 429.
   - Outdooractive / Alpenvereinaktiv: max 1 / 2 seconds.
   - Cache every external response in `.loop-state/cache/<url-hash>.json` so reruns don't re-hit.
6. **No subjective judgment in-loop.** "Looks better" / "feels right" are not oracles. If a task requires visual judgment, write the candidate to a file and defer to Thomas's morning review.
7. **Commit per task, not per phase.** One green checkbox = one commit. Bad iterations stay isolated and `git revert`-able.
8. **Update LEARNED.md whenever you discover something new** (rate limit, URL pattern, data quirk, decision rationale). Format: `## YYYY-MM-DD HH:MM (iter N) — category: insight`.
9. **Hand off via PR when DONE.** Final action: `gh pr create` with phase-by-phase summary referencing this file.

## Stop Conditions

- ✅ All Phase 1–5 boxes checked AND PR opened → DONE (graceful exit, no more wakeups)
- ⏱️ `iteration > 80` → STOP (write `STOPPED.md` with reason, push, exit)
- 🕑 `wall_clock > 10h` from 2026-05-17 evening → STOP (same as above)
- 🚧 3 consecutive no-progress iterations → STOP with `BLOCKED.md` describing what couldn't move

---

## Phase 0 — Pre-Loop Manual Fixes (DONE by Initializer)

These were applied interactively before launch because the loop cannot self-detect data-shape bugs (silent rendering corruption):

- [x] Tour 1 (Nussensee) `type:"see-fluss"` → `type:"see"` (`wanderungen-v3-1.html:196`)
- [x] dogSwimMap entries for Tour 26 (Vilsalpsee = `'nein'`) and Tour 27 (Schwarzensee = `'ja'`)
- [x] womoRating entries for Tour 26 (`2`, unverified Stellplatz) and Tour 27 (`2`, no overnight Stellplatz)
- [x] Title tag: dropped stale count "26"
- [x] Header h1: added `<span id="hdrCount">` with dynamic update via `syncTourCounts()`
- [x] Stats widget: added `<span id="statCount">` with dynamic update
- [x] Filter button "Alle 21" → `Alle ${tours.length}` (auto-updates as tours added in later phases)
- [x] Init flow: added `syncTourCounts()` call before `initFilters()`

---

## Phase 1 — Stellplatz Discovery (output-only, NO mutations to HTML)

**Why first** (per Critic, 2026-05-17 review): Discovery and mutation are independent workstreams. Running discovery first while rate limits are fresh means even if the loop runs long on mutation phases, the highest-value research output is locked in by morning.

**Output**: `stellplatz-candidates.json` in repo root (committed but NOT auto-merged into tour array — Thomas reviews before any new tour goes live).

- [ ] Query Park4Night for Womo-Stellplätze within 75 km of Bad Ischl (47.7128, 13.6256)
  - Filter: `type=stellplatz` OR `type=parking_nightallowed`; exclude `campingsite`
  - Filter: `vehicleHeight >= 3.20` (or unspecified)
- [ ] Deduplicate against the 27 existing tours' Stellplatz P4N-IDs (already in tour array)
- [ ] For each candidate Stellplatz: list 1–3 nearby Wanderungen (within 5 km Luftlinie) from Alpenvereinaktiv/Outdooractive
- [ ] Score each candidate by Thomas-criteria: dog-swim availability nearby (lake/river match), Elnagh-compatibility (height ≤ 3.20m, length ≤ 5.99m), Stellplatz reviews ≥ 4.0/5
- [ ] Write top-15 candidates to `stellplatz-candidates.json` (ranked) with all source evidence
- [ ] Commit: `phase 1: stellplatz-candidates.json with N=<count> ranked candidates`

---

## Phase 2 — Link-Health Sweep

**Goal**: Every URL in the app returns HTTP 200 today, OR is documented as dead with a date stamp.

- [ ] Extract all P4N URLs from `wanderungen-v3-1.html` (expect: 36 unique IDs across 27 tours)
- [ ] HEAD-check each P4N URL (allow 1 req/3s per Hard Rule #5). Record `{url, status, checked_at}` in `.loop-state/p4n-health.json`
- [ ] For each P4N URL that returns 404/410: replace with Google Maps fallback (`?q=lat,lng`) and add `// P4N #XXXXX gone 2026-05-XX, see git log` comment
- [ ] Extract all routeUrls entries (expect: 28 outdooractive + 8 alpenvereinaktiv per Critic count)
- [ ] HEAD-check each route URL (1 req/2s). For 200 responses, also verify page title contains the tour name (text match, case-insensitive). Per Critic: this replaces the dropped "Phase 2.5 Faktencheck"
- [ ] For each failing route URL: mark with `// URL dead/wrong content 2026-05-XX, replace candidate: <gh search query>` and add to `route-url-replacements-needed.md`
- [ ] Commit per fix: `phase 2: link-health — <tour-id> <specific change>`
- [ ] Final commit: `phase 2: link-health complete — N green, M replaced, K documented dead`

---

## Phase 3 — Content-Integrity & Documentation Sync

**Two related concerns**: code-side data-shape audit + Markdown-side doc sync. Both produce "WomoHiking now accurately describes itself."

### 3a. Code-side data-shape audit
- [ ] Verify every tour in the `tours` array has every field listed in the DOCUMENTATION.md "Tour Object" schema (line 70-101). Flag missing/extra fields.
- [ ] Re-verify lookup-map completeness: `dogSwimMap`, `womoRating`, `routeUrls` each have an entry for every tour ID 1–27. (Phase 0 patched 26+27; this verifies nothing else slipped.)
- [ ] Audit `typeColors` map: every distinct `type` value in tours array has an entry. No tour uses a `type` that falls back to `#666`.
- [ ] Render-fallback pattern sweep: grep for `||'` and `||3` and `||[]` in render code; document each false-negative-default location in `LEARNED.md` under `data-quirk`
- [ ] Commit: `phase 3a: data-shape audit complete — <N> fields verified, <M> drift bugs found and fixed`

### 3b. DOCUMENTATION.md auth-section rewrite (security-audit follow-up)
Auth migrated to Passkey via auth.apps.buchboeck.at on 2026-05-14 (commit `df789a2`), but DOCUMENTATION.md still describes the old Supabase-PIN architecture in **7 places** (lines 7, 15, 18, 40–41, 132, 144 per security-auditor 2026-05-17).

- [ ] Rewrite line 7 ("Current state") to say: "27 curated hiking tours with verified parking, overnight options, dog ratings, Womo ratings, route links, and Passkey-protected access via auth.apps.buchboeck.at."
- [ ] Rewrite line 15 ("External dependencies") to drop Supabase JS CDN
- [ ] Rewrite line 18 ("PIN auth") to describe Passkey flow via `auth.js` → auth.apps.buchboeck.at
- [ ] Rewrite lines 40-41 (Prerequisites) to drop "4-digit PIN" + "Supabase PIN verification"
- [ ] Rewrite line 132 (App Feature #1) — "PIN Lock Screen" → "Passkey Lock Screen"
- [ ] Rewrite line 144 ("Technical Patterns: Supabase PIN pattern") — replace with "Passkey via shared auth.apps.buchboeck.at service" + note that the legacy PIN system was retired 2026-05-14
- [ ] Tour count update wherever it appears (search for "26 tours" / "21 tours" / "25 tours")
- [ ] Commit: `phase 3b: docs/DOCUMENTATION.md — sync auth section to passkey (post 2026-05-14 migration + 2026-05-17 incident)`

---

## Phase 4 — Named Tour Tasks

Each task = one commit. Evidence requirement = the new P4N-ID resolved to HTTP 200 OR the new route URL returned 200 with the tour name in the title.

- [ ] **Tour 3 (Bürglstein, Wolfgangsee)**: replace `Camping Berau` Stellplatz with non-campingsite alternative within 10 km. Verified P4N-ID required.
- [ ] **Tour 7 (Fuschlsee)**: replace `Camping Panorama Mondsee` Stellplatz with proper Womo-Stellplatz (per `projektwissen-wanderungen-1.md` open-task list)
- [ ] **Tour 8 (Hintersee)**: replace `Camping Panorama Mondsee` Stellplatz (same as Tour 7 — likely same replacement)
- [ ] **Tour 4 (Langbathseen)**: find Alpenvereinaktiv or Outdooractive route URL (currently `null`)
- [ ] **Tour 10 (Gößl→Toplitzsee)**: find Alpenvereinaktiv or Outdooractive route URL (currently `null`)
- [ ] **Tour 23 (Traunsee-Westufer)**: find direct route track (promenade not officially published on OA/AV per existing TODO)

---

## Phase 5 — Critical UX/A11y Fixes (from UX-reviewer 2026-05-17)

These are HIGH-impact accessibility bugs found in the agent review. All have concrete code snippets in the agent's report (review file at `/tmp/...`, content captured in the session transcript).

- [ ] **WCAG-AA fail: Bergsee color (`#7209B7`, 1.95:1 against `#13131D`)** — replace `typeColors.bergsee` value with `#A78BFA` (6.0:1, passes AA). Verify with calc.
- [ ] **WCAG-AA fail: See+Fluss color (`#2D6A4F`, 1.85:1)** — replace `typeColors['see-fluss']` value with `#34D399` (8.2:1, passes AA).
- [ ] **Sort-header keyboard accessibility** — add `role="button" tabindex="0"` to each `<th onclick="sortTable(...)">` element (lines 547-554) + `onkeydown` Enter/Space handler + dynamic `aria-sort` attribute updated in `sortTable()`
- [ ] **Card-header as button, not div** — convert `.card-header` from `<div onclick>` to `<button class="card-header" aria-expanded="false" aria-controls="body-${t.id}">` per UX-reviewer snippet. Update `toggleCard()` to toggle `aria-expanded` and `hidden` instead of `style.display`.
- [ ] **Empty State for zero-match filters** — when `filtered.length===0`, render a centered "🔍 Keine Tour passt zu diesen Filtern" panel with "Alle Filter zurücksetzen" button. Snippet in UX-reviewer report.
- [ ] **Stale-counts dynamic update** — Phase 0 fixed the visible counts; verify nothing else hardcodes a tour count (grep for `\b2[1-9]\b.*[Tt]our` or `[Tt]our.*\b2[1-9]\b`)
- [ ] Commit per fix.

---

## Phase 6 — GitHub Actions CI Link-Check

- [ ] Create `.github/workflows/link-check.yml` that runs weekly (cron `0 6 * * 0`, Sundays 06:00 UTC)
- [ ] Job: extract all P4N + route URLs from `wanderungen-v3-1.html`, HEAD-check each with appropriate throttling, fail the job if >5% of URLs are dead
- [ ] First run on the feature branch must be green before phase counts as done
- [ ] Add `last-verified-by-ci` badge link to README.md
- [ ] Commit: `phase 6: weekly link-health CI workflow (.github/workflows/link-check.yml)`

---

## Phase 7 — Open PR + Final Report

- [ ] Generate `LOOP.log` summary: count of iterations, commits, lines changed, time spent per phase, LEARNED.md entries added
- [ ] `gh pr create --title "overnight rework: phases 1-6 (auto-generated 2026-05-17 by Initializer + Coding-Agent loop)" --body "<phase-by-phase summary>"`
- [ ] Final commit on this branch: `loop: completed N iterations, see PR for summary`
- [ ] Do NOT call `gh pr merge` — that requires Thomas's review.

---

## Phases explicitly DEFERRED (not for this loop, captured for next session)

- **Phase 6-alt: Data-map → tour-object embedding refactor** (per code-reviewer recommendation). Big architectural change with broad surface. Risk too high for unattended overnight. Add to wiki backlog instead.
- **Phase 7-alt: `onclick.toString()`-based filter detection → data-value attributes** (per code-reviewer line 442-448). Touches the filter render path. Defer; covered in Phase 5 if time permits but not required.
- **Phase 9: BFG Repo-Cleaner on leaked anon-key git history** (per security-auditor). Key is dead (disabled 2026-05-17T20:32:52Z) so risk is zero — only hygiene. Defer to next session.
- **3 hardcoded apps to env-var migration** (breakfast-dashboard, dog-food-tracker, everyfood). Out of scope for this repo. Add to wiki cross-app TODO.
- **Wiki entity page "everyfood-Supabase-Project"** (per Thomas's 2026-05-17 question B). Belongs in `~/wiki/wiki/entities/`, not this repo. Auto-drain will likely produce a draft from this session.
