# WomoHiking — Documentation

## Overview

A standalone single-file HTML app for planning motorhome-based hiking trips in the Salzkammergut, Salzburger Land & Berchtesgaden region, starting from Bad Ischl, Austria. Built for an Elnagh Baron 531 motorhome (5.99m L, 2.35m W, 3.20m H, 3500 kg GVW).

**Current state:** 26 curated hiking tours with verified parking, overnight options, dog ratings, Womo ratings, route links, and PIN-protected access via Supabase.

**Repo:** [github.com/tbuchboeck/WomoHiking](https://github.com/tbuchboeck/WomoHiking)

## Architecture

- **Single HTML file** — no framework, no build step, no backend
- **Vanilla JS/CSS** — all logic inline in `<script>`, all styles in `<style>`
- **External dependencies:** Google Fonts (DM Sans + Playfair Display), Supabase JS SDK (CDN)
- **Design:** Dark mode (#0A0A12), mobile-first, Playfair Display headers
- **Data:** Tour objects in a JS array, ratings/routes in separate map objects
- **PIN auth:** Supabase `app_config` table, SHA-256 hash, sessionStorage persistence
- **Stellplatz-First philosophy:** Parking viability drives tour selection, not the other way around

## File Inventory

| File | Purpose | Status |
|------|---------|--------|
| `wanderungen-v3-1.html` | The app — 26 tours, single-file vanilla JS/CSS, ~86 KB | Active |
| `projektwissen-wanderungen-1.md` | Project knowledge document (German) — context for AI-assisted development | Active |
| `README.md` | Public-facing repo description | Active |
| `.gitignore` | Excludes `CLAUDE.md` from repo | Active |
| `icon.svg` | App icon — flat-fill hiking boot on navy `#0A0A12` with mountain silhouette | Active |
| `icon-{192,512,maskable-512}.png` | Android home-screen + adaptive (maskable) icons | Active |
| `apple-touch-icon.png` | 180×180 iOS home-screen icon | Active |
| `favicon.ico` | Multi-size favicon | Active |
| `manifest.json` | PWA manifest — `start_url: ./wanderungen-v3-1.html`, `background_color: #0A0A12` | Active |

## Usage

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for: Google Fonts, Supabase PIN verification, external route/parking links
- The 4-digit PIN (stored as SHA-256 hash in shared Supabase instance)

### Running the App

Open the HTML file directly in a browser:

```bash
# From WSL — open in Windows browser
wslpath -w wanderungen-v3-1.html
# → paste result in browser address bar

# Or serve locally
python3 -m http.server 8000
# → open http://localhost:8000/wanderungen-v3-1.html
```

### Viewing on GitHub

The raw HTML won't render interactively on GitHub. Use:
```
https://htmlpreview.github.io/?https://github.com/tbuchboeck/WomoHiking/blob/main/wanderungen-v3-1.html
```

## Data Structure

### Tour Object

Each tour is a JS object with these fields:

```javascript
{
  id: 1,                    // Unique numeric ID
  group: "nah",             // Distance group: nah/mittel/weit
  type: "see-fluss",        // Water type: see/bergsee/fluss-klamm/see-fluss/alm
  name: "...",              // Tour name
  subtitle: "...",          // Location + tagline
  distance: "9 km",         // Hiking distance
  duration: "2–2,5 h",      // Estimated duration
  difficulty: "Leicht",     // Difficulty level
  elevation: "175 Hm",      // Elevation gain
  water: "...",             // Water bodies visited
  dogRating: 5,             // Dog-friendliness 1–5
  dogInfo: "...",           // Dog detail text
  parking: {                // Day parking
    name, address, cost, extras,
    p4n: "https://park4night.com/en/place/XXXXX"  // or Google Maps fallback
  },
  stellplatz: {             // Overnight parking (nullable)
    name, address, cost, extras, p4n
  },
  restrictions: "...",      // Warning text
  description: "...",       // Route description
  highlight: "...",         // Key highlights
  color: "#2D6A4F",        // Theme color (hex)
  icon: "🌲",              // Card icon emoji
  distanceFromBase: "0 km", // Distance from Bad Ischl
  driveTime: "0 Min.",      // Drive time from Bad Ischl
  extraInfo: "...",         // Additional info
  personal: "🏰 ...|🥗 ...", // Castle + veggie tips (pipe-separated)
  isNew: false              // Show NEU badge
}
```

### Separate Data Maps

```javascript
const dogSwimMap = { 1:'ja', 2:'ja', ... };      // Dog swimming: ja/teils/nein
const womoRating = { 1:5, 2:4, ... };            // Womo suitability 1–5
const routeUrls = { 1:[{l:'Name',u:'URL'}], ... }; // Route track arrays
```

### Distance Groups

| Group | Range | Label |
|-------|-------|-------|
| `nah` | 0–30 km | 📍 Nahbereich |
| `mittel` | 30–60 km | 🗺️ Entdeckungen |
| `weit` | 60+ km | 🌍 Abenteuer |

### Water Types

| Type | Label | Color |
|------|-------|-------|
| `see` | 🏊 See-Runde | #4895EF |
| `bergsee` | ⛰️ Bergsee | #7209B7 |
| `fluss-klamm` | 🏞️ Fluss & Klamm | #2EC4B6 |
| `see-fluss` | 🌊 See + Fluss | #2D6A4F |
| `alm` | 🏔️ Alm & Panorama | #D97706 |

## App Features

1. **PIN Lock Screen** — 4-digit numpad, SHA-256 via Supabase `app_config`, sessionStorage
2. **Triple Filter** — distance + water type + dog swimming (combinable)
3. **Sortable Comparison Table** — 7 columns: Tour, km, 🐾, 🚐, Typ, Fahrzeit, Stellplatz
4. **Expandable Tour Cards** — pills, route, dog info, Womo rating, parking, restrictions, tips, highlights
5. **Multi-Route Links** — multiple Alpenvereinaktiv/Outdooractive tracks per tour
6. **Dog Swimming Badges** — green (ja), yellow (teils), red (kein Baden) on every card
7. **Womo Rating** — 1–5 🚐 based on Stellplatz quality, access, height limits

## Technical Patterns

- **Park4Night link verification**: All P4N IDs are manually verified — never guessed. Format: `https://park4night.com/en/place/XXXXX`. Fallback: Google Maps `?q=LAT,LNG`
- **Standalone HTML over frameworks**: Chosen because `target="_blank"` links are blocked in Claude's artifact sandbox. All external links use `target="_blank" rel="noopener"`.
- **Supabase PIN pattern**: Shared across multiple apps (EcoFlowMon, CoffeeTrack, EveryFood). Same `app_config` table, same anon key, different `sessionStorage` keys per app.
- **Route URL arrays**: `routeUrls[id]` is an array of `{l:'Label', u:'URL'}` objects. Short property names (`l`, `u` instead of `label`, `url`) save ~800 bytes across 33 entries.
- **CSS custom properties for theming**: All colors defined in `:root` — `--bg`, `--card`, `--accent`, etc. Makes dark mode consistent.
- **Paw/star rating rendering**: `paws(n)` and `womoStars(n)` generate 5 emoji spans with opacity 1 (filled) or 0.15 (empty).
- **Cost parsing for table sort**: `parseCost()` extracts numeric values from strings like "17–22 €/Nacht" for correct column sorting.
- **Dog swim badge with ternary chain**: Inline IIFE `${(()=>{...})()}` to render conditional badges in template literals.
- **PWA install via sibling icons + manifest**: Single-file HTML can still be installable. Icons sit beside the HTML file (no `public/` folder), all `<link>` tags use relative URLs (`./icon.svg`, `./manifest.json`), and `start_url`/`scope` in the manifest point at the HTML file. Works whether opened directly, from `python3 -m http.server`, or hosted at any sub-path.

## Verified Park4Night IDs (36 unique)

```
#54915  #229737 #58708  #131827 #256696 #20458  #463732 #52703
#489470 #450004 #440800 #75291  #412332 #94083  #207134 #13538
#148911 #97721  #213799 #482487 #65608  #501526 #78757  #51913
#66585  #16209  #94646  #52568  #107622 #149187 #146303 #60083
#20460  #214786 #26306  #31051
```

## Remaining Google Maps Fallbacks (6)

These parking locations are genuinely not on Park4Night:

| Tour | Location | Reason |
|------|----------|--------|
| 7 | Thalgauegg (Fuschlsee) | No P4N entry within 1 km |
| 11 | Gmunden Seilbahn | Not on P4N; 2.10m height limit anyway |
| 14 | Stefaniebrücke + Gradau (Molln) | Neither on P4N |
| 17 | Krafthaus Kaprun | Not on P4N |

## Lessons Learned

- **P4N names vary**: Same location can have different names on P4N vs. local signage (e.g., "Mobiler Alpengenuss" = "Reisemobilstellplätze Allweglehen" on P4N #52568)
- **Coordinate searches find P4N entries**: When text search fails, use the P4N API with lat/lng radius search
- **Height restrictions are critical**: Tour 11 (Gmunden Seilbahn Parkhaus) has 2.10m limit — Elnagh with 3.20m doesn't fit. Always note height in restrictions.
- **Overnight bans need verification**: Postalm timeline shows rules changed from free → banned → 20€/night ticket over 2021–2023
- **Standalone HTML scales surprisingly well**: 25 tours, 36 P4N IDs, 33 route links, PIN auth — all in a single 80 KB file with no build tooling

## Open Tasks

From `projektwissen-wanderungen-1.md`:
- [ ] Tour 3 (Bürglstein): Replace Camping Berau with proper Stellplatz
- [ ] Tour 7 (Fuschlsee): Replace Camping Panorama Mondsee with Stellplatz
- [ ] Stellplatz-First expansion: Discover new base camps from P4N in 75 km radius around Bad Ischl
- [ ] Tour 23 (Traunsee-Westufer): Find a direct route track (promenade not published on OA/AV)

## Timeline

| Date | Milestone |
|------|-----------|
| 2026-03-31 | Initial commit — 21 tours, `wanderungen-v2.html` + `projektwissen-wanderungen-1.md` |
| 2026-03-31 | PR #1: Fix route link labels and Tour 22 URL language |
| 2026-04-04 | PR #2: Add Lago di Molveno and Jasna-See as new destinations (23 → 25 tours) |
| 2026-04-04 | PR #3: Add verified P4N links for Molveno/Jasna, multi-route tracks (all 25 tours covered), PIN lock screen |
| 2026-04-04 | PR #4: Add Womo rating (1–5 🚐), fix dog badge for "nein" tours |
| 2026-04-04 | PR #5: Replace 5 more Google Maps fallbacks with verified P4N links (42 P4N / 6 GM remaining) |
| 2026-04-11 | PR #6: Add visit tracking — mark tours as visited with count and date (still open at time of writing) |
| 2026-05-14 | PR #9: Add hiking-boot favicon + PWA manifest (installable as standalone PWA) |
