# Route URL Replacements Needed

These tour route URLs were verified dead during Phase 2 link-health sweep (iter 3, 2026-05-17) and have been set to `null` in `routeUrls` so the app stops surfacing broken links. They need replacement with new Alpenvereinaktiv or Outdooractive tracks for the same hiking route.

| Tour | Route name (old) | Old URL | Status | Replacement needed |
|---|---|---|---|---|
| 16 | Rundwanderweg Zeller See | https://www.outdooractive.com/de/route/wanderung/zell-am-see-kaprun/rundwanderweg-zeller-see/7750068/ | HTTP 410 Gone | Find any AlpenVereinAktiv- or Outdooractive-published track for the Zeller See Rundweg (~12 km, ⚠️teils Hund baden, type `see`) |
| 17 | Rundweg Klammsee | https://www.outdooractive.com/de/route/wanderung/zell-am-see-kaprun/rundweg-klammsee/1362539/ | HTTP 410 Gone | Find an OA/AV track for the Sigmund-Thun-Klamm → Klammsee Rundweg (~2.8 km, ❌ Hund baden, type `fluss-klamm`) |

## Pre-existing TODOs from `projektwissen-wanderungen-1.md` (project knowledge doc)

Three additional tours have been known-missing for some time. These are the items in Phase 4 of GOAL.md:

| Tour | Route name | Status | Notes |
|---|---|---|---|
| 4 | Langbathseen | `routeUrls[4]: null` | "nicht gefunden" per projektwissen line 137 |
| 10 | Gößl → Toplitzsee | `routeUrls[10]: null` | "nicht gefunden" per projektwissen line 143 |
| 23 | Traunsee-Westufer | (entry missing) | Per DOCUMENTATION.md open-task: promenade not officially published on OA/AV |

## How to find replacements

OA/AV catalog search is *not* automatable from Lighthouse (same Cloudflare-bot-detection issues as P4N search, see LEARNED.md iter 1 failure-mode entries). These need manual research — Phase 4 of the loop will attempt them but may also need a Coding Agent that can search interactively.

Suggested approach (manual, ~5 min per tour):

1. Open https://www.alpenvereinaktiv.com and search by tour name + region
2. Filter: language=de, type=Wanderung, distance roughly matches
3. Verify the published track covers the same area as the WomoHiking description
4. Copy the URL into routeUrls in `wanderungen-v3-1.html`

## Health snapshot at time of writing

- 34 of 36 route URLs alive (94.4%)
- 0 soft-404s (LEARNED.md heuristic: OA/AV use proper status codes when content is gone, not HTML fake-pages)
- Combined Phase 2 health (P4N + routes): 69 of 73 URLs alive (94.5%) — within 5% CI threshold but tight
