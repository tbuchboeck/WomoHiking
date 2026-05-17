# LEARNED.md — Reflection Log (Reflexion pattern)

**Read this file at the START of every iteration**, before planning what to do.
**Append to it** when an iteration surfaces a new insight, failure mode, or decision worth not re-litigating.

## Format

```
## YYYY-MM-DD HH:MM (iter N) — <category>
<concise insight, ideally 1-3 sentences, can include evidence URL or file:line>
```

## Stable categories

- **`operational`** — runtime constraints learned the hard way (rate limits, timeouts, build-time quirks)
- **`data-quirk`** — domain-specific data shape surprises (URL patterns, schema gotchas, naming inconsistencies)
- **`heuristic`** — search/strategy refinements ("X works better than Y for this task")
- **`failure-mode`** — known sharp edges with recovery procedure
- **`decision`** — judgment calls worth not re-litigating (with rationale)

## Curation

When this file exceeds ~500 lines, the next iteration's first action is a compaction pass: dedupe near-duplicates, merge related entries, drop `failure-mode`s that haven't triggered in 10 iterations. Entries re-verified 3+ times get promoted to "Hard Rules" in `GOAL.md`.

---

## Pre-seeded Hard Rules (from the 2026-05-17 Initializer session)

These were established before the loop began, distilled from the security incident response, the 4-agent pre-loop review, and the existing wiki page `autonomous-overnight-loop-criteria.md`. Treat as load-bearing.

## 2026-05-17 17:00 (iter 0) — operational
Park4Night API rate-limits at ~25 req/min. Recipe: 1 req/3 sec sustained, back off to 1/10 sec on first HTTP 429. Cache every response in `.loop-state/cache/p4n-<id>.json` so re-runs (and Phase 1 + Phase 2 both hitting same IDs) don't duplicate calls.

## 2026-05-17 17:00 (iter 0) — operational
Outdooractive + Alpenvereinaktiv don't have published rate limits but both serve from CDN behind aggressive bot detection. Stay under 1 req/2 sec. They commonly return HTML 200 even for missing-page errors (soft 404). Verify by checking `<title>` doesn't contain "404" / "nicht gefunden" / "Seite nicht verfügbar".

## 2026-05-17 17:00 (iter 0) — failure-mode
`git push` may be rejected with "non-fast-forward" if Vercel-bot or auto-drain push commits while we work. Recovery: `git fetch origin <branch> && git rebase origin/<branch>` then retry. Never `--force` on this branch (Hard Rule #1).

## 2026-05-17 17:00 (iter 0) — data-quirk
Three lookup maps in `wanderungen-v3-1.html` (`dogSwimMap`, `womoRating`, `routeUrls`) are *separate* from the tours array. Adding a tour requires editing 4 places. Render code falls back to false-negatives (`||'nein'`, `||3`, `||[]`) when an entry is missing — silent corruption. The pattern: if any new tour gets added in Phase 1 candidates → 4 explicit map updates needed, no exceptions. The deep fix (embed into tour objects) is deferred to next session per GOAL.md.

## 2026-05-17 17:00 (iter 0) — data-quirk
WomoHiking branch convention is **mixed**: `dog-food-tracker` uses `main`, `breakfast-dashboard` + `everyfood` use `master`. THIS repo (WomoHiking) uses `main`. Check `git rev-parse --abbrev-ref HEAD` before push, don't hardcode the branch name.

## 2026-05-17 17:00 (iter 0) — decision
Phase 3 (Stellplatz Discovery) runs FIRST despite being numbered "Phase 1" in GOAL.md (Critic's inversion recommendation, 2026-05-17 review). Rationale: discovery is read-only and rate-limit-sensitive — best to do while quotas are fresh and the loop has its longest uninterrupted window. Mutations come after with more confident data.

## 2026-05-17 17:00 (iter 0) — decision
Phase 2.5 "Faktencheck vs live AlpenVereinAktiv" was DROPPED from this loop per Critic's argument: violates loop-criteria #2 (subjective judgment) and #5 (unstable API). Reframed narrowly: "verify each route URL returns 200 + title contains tour name" — now part of Phase 2 link-health.

## 2026-05-17 17:00 (iter 0) — operational
Supabase Management API has a body-parsing quirk: `PUT /v1/projects/{ref}/api-keys/legacy` requires `enabled` as a **query parameter** (`?enabled=false`), NOT in the JSON body — despite the request accepting `Content-Type: application/json`. Body submissions fail with `"enabled: Required"` regardless of shape. Verified working 2026-05-17 20:32 UTC.

## 2026-05-17 17:00 (iter 0) — operational
Supabase data-plane (PostgREST behind Cloudflare) caches auth state for ~30-60 sec after a config change. After disabling legacy keys via Management API, leaked keys may still return 200 for up to a minute. Wait + retest before declaring rotation complete.

## 2026-05-17 17:00 (iter 0) — heuristic
For Stellplatz searches (Phase 1): P4N coordinate search (`lat`, `lng`, `radius`) returns 3–5× more candidates than name-based search for the same area. Use coordinate search when targeting "everything in N km of point X".

## 2026-05-17 20:51 (iter 1) — failure-mode: Park4Night no longer has a public REST endpoint
Probed `/services/v3/lieux.php` (HTTP 404), `/en/search` (HTTP 200 but SPA — JS-rendered, not scrapable without a headless browser, which is out of scope per CLAUDE.md and RAM-prohibitive on Lighthouse per autonomous-overnight-loop-criteria §"Lighthouse-specific constraints"). The pre-seeded `operational` entry from iter 0 about "P4N rate limit 25 req/min" was historical knowledge that no longer applies to the public surface. **Action**: any future "search P4N programmatically" task must be marked needs-manual or migrated to OSM Overpass / Nominatim.

## 2026-05-17 20:52 (iter 1) — failure-mode: Overpass-API.de returns HTTP 406 to all requests from Lighthouse
Tested: GET, POST, GET-via-curl-G, kumi.systems mirror (504 timeout), single-line query, multi-line query, with/without User-Agent, with/without `Accept: */*`, even a bare `HEAD /api/interpreter` and `/api/status`. **All return 406** with the same Apache 4.4.67 error page. The block is server-side and IP-range-based — Lighthouse (Oracle Cloud Always-Free A1 ARM, Stockholm) sits in an IP range that overpass-api.de mod_security blocks unconditionally. **Action**: any Phase 1 / Phase 3 task that needs OSM Overpass from Lighthouse is blocked. Workarounds for the next session (not in-loop): (a) run query from Thomas's WSL2 machine (Clam), (b) use OSM static data dumps via Geofabrik regional extract, (c) use a different cloud egress (e.g., via Tailscale exit-node back through home network).

## 2026-05-17 20:52 (iter 1) — decision: Phase 1 (Stellplatz Discovery) skipped this loop
Per CLAUDE.md "What to do when you get stuck" §2: leave items unchanged, document failure, pick next item. Both discovery sources (P4N API + OSM Overpass) are unreachable from Lighthouse. The whole phase depends on candidate-fetching, so dependent items (dedupe-existing, wandering-pairing, thomas-scoring, rank-output) are also blocked. Phase 1 will need to run interactively or from a different host. **Pivot to Phase 2 (Link-Health)** which only HEAD-checks URLs already in the HTML — those domains (park4night.com individual place pages, outdooractive.com, alpenvereinaktiv.com) are direct HTTP and should not be IP-blocked. Mark Phase 1 items as `blocked` in PROGRESS.json so future iterations skip them.

## 2026-05-17 21:00 (iter 2) — data-quirk: P4N individual place pages ARE reachable (just not search/API)
While the search SPA + legacy `/services/v3/lieux.php` API are dead from Lighthouse (iter 1 failure-mode), individual `https://park4night.com/en/place/<id>` URLs are direct HTTP and return 200 normally at 1 req/3s. Out of 37 unique IDs in the WomoHiking tours array: 35 alive, 2 dead (#213799 Schiederweiher, #58708 Schafbergbahn). Implication: Phase 2 link-health works fine even though Phase 1 discovery is blocked — the two phases have very different network requirements (deep-link-check vs catalog-query).

## 2026-05-17 21:00 (iter 2) — heuristic: Google Maps `?q=<address>` fallback is more robust than `?q=lat,lng`
For dead P4N replacements, used `?q=<URL-encoded street-address>` instead of guessing lat/lng coordinates. Google resolves the address server-side, no risk of off-by-one degree. Pattern: `https://www.google.com/maps?q=<street>,+<zipcode>+<city>` — works for both P7 Schafbergbahn (Au 22, 5360 St. Wolfgang) and Parkplatz Schiederweiher (Goierweg, 4573 Hinterstoder). The existing projektwissen doc preferred `?q=lat,lng` but for unattended replacement that's a hallucination risk; address-form is safer.

## 2026-05-17 21:00 (iter 2) — operational: dead-rate close to Phase 6 CI threshold
Today's dead-rate: 2/37 = 5.4%, just above the 5% threshold GOAL.md §"Phase 6" defines as CI-fail. If next quarter another P4N place goes 404, CI will start failing weekly. Decision deferred — Thomas should choose between (a) raise threshold to 8%, (b) add a `--ignore=<dead-ids>` allowlist mechanism, (c) accept periodic CI-red as a signal to do quarterly cleanup. Noted for Phase 6 implementation.

## 2026-05-17 21:04 (iter 3) — data-quirk: outdooractive.com uses proper HTTP 410 (not soft-404)
The pre-seeded LEARNED.md entry (iter 0) warned that OA/AV "commonly return HTML 200 even for missing-page errors (soft 404)". Empirically tested across 36 route URLs: zero soft-404s observed. Two URLs returned proper HTTP 410 Gone (Tour 16 Rundwanderweg Zeller See OA#7750068, Tour 17 Rundweg Klammsee OA#1362539). OA's behavior is correct: retired/removed routes return 410 with empty body. Soft-404 worry was unfounded for the 2026-vintage OA platform; the title-check still ran with zero cost.

## 2026-05-17 21:04 (iter 3) — operational: Phase 2 complete network behavior summary
Total Phase-2 surface: 73 external URLs (37 P4N + 36 OA/AV). Total elapsed across iter 2-3: 216s (126 + 90). Zero rate-limit hits. Combined alive: 69/73 = 94.5%. All failures (2 P4N 404 + 2 OA 410) replaced/nulled with audit trail in git log + route-url-replacements-needed.md. Phase 2 closes cleanly with no blockers and no manual intervention needed before morning review.

## 2026-05-17 21:04 (iter 3) — decision: broken route URLs set to `null` (not removed) to match existing pattern
Tour 4 + Tour 10 already use `null` in routeUrls (per projektwissen-wanderungen-1.md TODO list, "nicht gefunden"). Tour 16 + Tour 17 now also use `null` with inline `// comment` linking to route-url-replacements-needed.md. Render code uses `routeUrls[t.id]||[]` → null falls through to empty array → no button shown. Consistent with existing pattern, no behavior surprise.

## 2026-05-17 21:09 (iter 4) — data-quirk: routeUrls[26] (Vilsalpsee) was missing entirely
Phase 0 (iter 0) added Tour 26 entries to `dogSwimMap` and `womoRating`, but Phase 3a audit caught that `routeUrls[26]` was still absent — not `null`, simply not in the map. With render code doing `routeUrls[t.id]||[]`, the missing-key falls through silently to empty array → no route button shown for Vilsalpsee. Fixed in iter 4 by inserting `26:null` (matches pattern of Tour 4, Tour 10, Tour 16, Tour 17). Replacement research deferred to Phase 4 (named tasks).

## 2026-05-17 21:09 (iter 4) — heuristic: regex-based JS-object-literal field audit produces false positives
Tried verifying every tour has every documented field via Python regex on the source. Hit two issues: (1) the leading `{id:N,...` opens without a comma so regex `(?:^|,)\s*(\w+)\s*:` misses `id`; (2) sub-object keys (`address`, `cost`, `extras`, `p4n` from `parking`+`stellplatz`) bubble up as extras. Result: 27 false-positive "drift" reports. **For real schema verification, parse JS with esprima/Acorn or convert to JSON first — regex on object literals is unreliable.** Schema check therefore documented-but-not-trusted; the embed-into-tour-object refactor (deferred Phase 6-alt) would let us use proper JSON tooling.

## 2026-05-17 21:09 (iter 4) — operational: 4 documented false-negative-fallback sites in render code
For the "fallback-pattern-sweep" audit, here are all `[t.id]||X` sites in `wanderungen-v3-1.html`:
- line 460: `(dogSwimMap[t.id]||'nein')` — filter logic (a missing dogSwim entry would silently match the "no swimming" filter)
- line 507: `womoStars(womoRating[t.id]||3)` — card display (missing entry shows 3 stars by default)
- line 522: same `womoRating[t.id]||3` for Womo-Tauglichkeit section
- line 527: `(routeUrls[t.id]||[]).map(...)` — route-button list (missing entry shows no button)
- line 566: `data-sort="${womoRating[t.id]||3}"` + repeat — table cell + sort key
These are the surface area for the data-map drift class of bugs. Phase 0 + Phase 3a have brought all 3 maps to 27/27 completeness, but the fallback pattern itself is unchanged — any future tour added without the 4-map-update discipline will silent-corrupt again. The structural fix (embed maps into tour objects) is in deferred backlog.

## 2026-05-17 21:13 (iter 5) — decision: keep historical Timeline PIN/Supabase references unchanged
DOCUMENTATION.md Timeline entries (lines 193–196) describe PR #1–9 chronologically. They mention "PIN lock screen" (line 196, PR #3). Per CLAUDE.md "do NOT touch auth stack" was about runtime code — the Timeline is a HISTORICAL log that accurately describes what was true on that date. Rewriting historical entries to retroactively use Passkey wording would falsify the record. Decision: leave PR #1–9 timeline as-is, append new entries for 2026-05-14 (Passkey migration) + 2026-05-17 (security incident response + this loop) instead.

## 2026-05-17 21:18 (iter 6) — decision: card-header refactor deferred to iter 7
UX-reviewer flagged the `.card-header` is currently `<div onclick>` instead of `<button aria-expanded>`. Investigation revealed the onclick is actually on the OUTER `.card` div (line 488), not on `.card-header`. Converting to a button requires (1) moving the onclick from card div to a new button element wrapping header content, (2) ensuring button-default CSS doesn't break the rendered look, (3) updating `toggleCard()` to set aria-expanded. The change is correct but touches CSS surface and could regress visual rendering. Decision: do it as its own focused iteration where I can verify visual sanity afterward, rather than bundling 5+ unrelated edits in one commit.

## 2026-05-17 21:18 (iter 6) — heuristic: aria-sort dynamic update in 4 lines
For sortable table headers, the minimal a11y addition is: (a) every `<th>` gets `role="button" tabindex="0" aria-sort="none"` plus `onkeydown` for Enter/Space, (b) the sort function appends `th.setAttribute('aria-sort', ascending|descending|none)` in its existing post-sort loop. That's the full pattern — no library needed, no focus-management complications because `<th>` already has its own selection model. Worked first-try here; reusable for other apps.

## 2026-05-17 21:18 (iter 6) — heuristic: empty-state with `role="status" aria-live="polite"`
For zero-match filter UIs, the empty-state container should be `role="status" aria-live="polite"` so screen readers announce the transition from "N tours found" to "zero matches" without requiring focus shift. The reset button doesn't need any special ARIA (default `<button type="button">` semantics are correct). Pattern: visible emoji-icon decorative-only (`aria-hidden="true"`), short headline, one-sentence guidance, one CTA button.

## 2026-05-17 21:23 (iter 7) — heuristic: card-header CSS was already button-prepared
Refactor risk was much lower than expected because:
1. `.card-header` CSS (line 55) already had `border:none; background:none; cursor:pointer; width:100%; text-align:left` — exactly the resets you'd want for a `<button>`. Someone anticipated this conversion.
2. `.card-body` already had inline `onclick="event.stopPropagation()"` so body-clicks didn't bubble — no behavior change from moving onclick out of outer card.
3. The visit-tracking buttons inside .card-body also had per-button `event.stopPropagation()` on their onclicks. Consistent pattern.

The visible change: card-header is now keyboard-focusable (Tab through cards works), Enter/Space toggles, screen readers announce "expanded/collapsed" via aria-expanded. Outer card div lost its onclick (was the only barrier to clicks-on-card-body propagating, but stopPropagation already prevented that).

## 2026-05-17 21:23 (iter 7) — decision: no custom :focus-visible style added for card-header button
Default browser focus outline preserves accessibility (sighted keyboard users see focus ring). Could be styled with `.card-header:focus-visible { outline: 2px solid var(--c); outline-offset: -2px; }` for a more polished look, but that's polish work and risks visual regression. Default outline preserved; Thomas can decide morning whether to add custom focus styling.

## 2026-05-17 21:27 (iter 8) — operational: GitHub Actions link-check rate-limited 1 req/3s for P4N, 1 req/2s for routes
The workflow inherits the same throttling we discovered iter 2-3 from Lighthouse (P4N tolerates 1/3s, OA/AV 1/2s — both with zero 429s observed). Total expected runtime: ~37 P4N × 3s + ~34 OA × 2s ≈ ~3 minutes per fire. Weekly cron + push-trigger (paths: HTML or workflow file only) keeps the CI ~3 minutes/week + on-demand. Well under the GitHub Actions Free-tier 2000-minutes/month budget.

## 2026-05-17 21:27 (iter 8) — heuristic: README badge URL hardcodes branch=main
The Link-Health badge URL ends with `?branch=main` so it shows the production-branch health, not the feature-branch health. This means the badge will go red right after merge if any URL dies — exactly when you want to know. Adding branch=main rather than letting it default also avoids the awkward "last fired on claude/... branch" badge when the workflow runs on this loop branch before merge.

## 2026-05-17 21:28 (iter 8) — failure-mode: gh OAuth token lacks `workflow` scope
First `git push` of `.github/workflows/link-check.yml` was rejected by GitHub:

  ! [remote rejected]: refusing to allow an OAuth App to create or
    update workflow `.github/workflows/link-check.yml` without
    `workflow` scope

The Lighthouse gh token has scopes `gist,read:org,repo` (per `gh auth status` from iter 0 inventory) — no `workflow`. Adding it requires interactive `gh auth refresh -s workflow` which the loop cannot do unattended (opens a browser-flow). **Workaround applied**: workflow file relocated to `docs/proposed/link-check.yml` with a sibling README explaining the install procedure. Phase 6 `workflow-file` and `ci-first-run-green` items remain `done:false` with blocker_logged set. Thomas can do the 30-second `gh auth refresh -s workflow` + `git mv` + commit in the morning to complete Phase 6.

## 2026-05-17 21:28 (iter 8) — heuristic: README badge for not-yet-existing workflow is OK
The README badge added in this iter (`...actions/workflows/link-check.yml/badge.svg?branch=main`) will show "workflow not found" red until the file is moved into `.github/workflows/`. This is intentional — when Thomas installs the workflow, the badge automatically goes green on the next CI run. No README edit needed at install time. Documented in `docs/proposed/README.md`.

## 2026-05-17 21:33 (iter 9) — data-quirk: GOAL.md Phase 4 was based on stale projektwissen
Five of six "named tasks" in Phase 4 were ALREADY COMPLETED in the HTML at loop launch:

  Tour 4 (Langbathseen): GOAL said "find OA/AV URL", but routeUrls[4] has 2 URLs
  Tour 10 (Gößl→Toplitzsee): GOAL said "find OA/AV URL", routeUrls[10] has 1
  Tour 23 (Traunsee-Westufer): GOAL said "find direct route track", routeUrls[23] has 2
  Tour 7 (Fuschlsee): GOAL said "replace Camping Panorama Mondsee", stellplatz already = Nachtparkplatz Fuschl Dorfstraße
  Tour 8 (Hintersee): GOAL said "replace Camping Panorama Mondsee", stellplatz already = Stellplatz Wunderburg Gmunden

Only Tour 3 (Bürglstein) genuinely still has Camping Berau as stellplatz — and replacing it needs P4N search which is the same Lighthouse-blocked failure-mode from Phase 1.

Root cause: `GOAL.md` Phase 4 was sourced from `projektwissen-wanderungen-1.md` ("Offene Aufgaben" section, lines 250-257) which describes a snapshot from ~Apr 2026, before subsequent PRs that added URLs and replaced Stellplätze. **Lesson for next Initializer session**: when drafting GOAL.md from older project-knowledge docs, do a pre-flight check against the current HTML state. The Critic agent caught some staleness (the URL-count discrepancy of 26 vs actual 36) but not the per-item TODO staleness.

## 2026-05-17 21:33 (iter 9) — decision: Phase 4 closed as "5/6 done, 1 blocked, no harmful drift"
Marking 5 of 6 Phase 4 items as `done:true` with `note` fields capturing the discovery (audit-trail in git log + PROGRESS.json). Tour 3 stellplatz remains the single genuine open Phase-4 item, blocker_logged for P4N search. Phase 4 effectively closed for this loop.
