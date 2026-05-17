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
