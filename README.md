# Wanderungen für euch 🥾

[![Link Health](https://github.com/tbuchboeck/WomoHiking/actions/workflows/link-check.yml/badge.svg?branch=main)](https://github.com/tbuchboeck/WomoHiking/actions/workflows/link-check.yml)

A standalone HTML app for planning motorhome-based hiking trips in the Salzkammergut, Salzburger Land & Berchtesgaden region — starting from Bad Ischl, Austria.

## What is this?

A personal trip planner built as a single HTML file. No frameworks, no dependencies, no backend — just open the file in any browser.

**27 curated hiking routes** around lakes, rivers, gorges and alpine meadows, each with:

- 🐕 Dog-friendliness ratings (1–5 paws) & dog swimming filter
- 🚐 Verified motorhome parking (Park4Night links, Google Maps fallback)
- 🏰 Castle & historic site tips
- 🥗 Vegetarian/vegan restaurant suggestions
- 🗺️ Route links (Alpenvereinaktiv / Outdooractive)

## Features

- **Dark mode** design, mobile-first
- **Triple filter** — combine distance, water type & dog swimming
- **Sortable comparison table** with 8 keyboard-accessible columns (aria-sort)
- **Expandable tour cards** with full details (keyboard-focusable, aria-expanded)
- **35+ verified Park4Night IDs** + Google Maps fallbacks for the rest
- **Stellplatz-First approach** — parking viability drives tour selection
- **Passkey authentication** via the shared `auth.apps.buchboeck.at` service
- **Weekly link-health CI** — broken P4N / Outdooractive URLs surface within 7 days

## Vehicle specs

Built around an **Elnagh Baron 531** motorhome:
- Length: 5.99m | Width: 2.35m | Height: 3.20m (incl. roof AC)
- GVW: 3,500 kg

Height restrictions and parking warnings are noted per tour.

## Tour overview

| Distance group | Range | Tours |
|---|---|---|
| 📍 Nahbereich | 0–30 km | ~9 tours |
| 🗺️ Entdeckungen | 30–60 km | ~10 tours |
| 🌍 Abenteuer | 60+ km | ~8 tours |

Water types: Lake loops, mountain lakes, river gorges, lake+river combos, alpine meadows.

## Files

| File | Description |
|---|---|
| `wanderungen-v3-1.html` | The app — open in any browser |
| `auth.js` + `auth.css` | Passkey auth flow against `auth.apps.buchboeck.at` |
| `projektwissen-wanderungen-1.md` | Project knowledge document (German) — context for AI-assisted development |
| `DOCUMENTATION.md` | Architecture, data schema, technical patterns |
| `route-url-replacements-needed.md` | Open TODOs from link-health CI |
| `README.md` | This file |

## Usage

1. Visit [womohiking.apps.buchboeck.at](https://womohiking.apps.buchboeck.at) (or open `wanderungen-v3-1.html` locally)
2. Authenticate via Passkey
3. Filter, browse, plan trips

## Tech

- Vanilla HTML / CSS / JS (~88 KB single file)
- Google Fonts (DM Sans + Playfair Display)
- Passkey auth via `auth.apps.buchboeck.at`
- PWA installable
- No build step, no application dependencies; deployed via Vercel
- Weekly GitHub Actions link-health check

## Credits

Built with ❤️ in Bad Ischl, Salzkammergut.

Park4Night links verified manually — never guessed. Unverified locations use Google Maps coordinate links as fallback.

---

*Alle Angaben ohne Gewähr · Stand März 2026*
