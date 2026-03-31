# Projektwissen: Wanderungs-App — 21 Touren Salzkammergut

## Thomas' Profil

- **Wohnort:** Bad Ischl, Salzkammergut, Österreich
- **Wohnmobil:** Elnagh Baron 531 — 5,99m Länge, 2,35m Breite, 3,20m Höhe (inkl. Truma Aventa Comfort Dach-AC), 3.500 kg zGG, ~2,75m Spiegelbreite
- **Reist mit Hund** — Hundeschwimmen ist Priorität! Hunde-Baden-Filter in der App eingebaut
- **Partnerin:** vegetarisch/vegan, liebt Burgen & historische Stätten
- **Thomas:** Klettersteige (B/C), separat von dieser App gehalten
- **Stellplatz-Präferenz:** Womo-Stellplätze > freie Parkplätze (mit Übernachtungsmöglichkeit) > Campingplätze (nur als letzte Alternative). Thomas bevorzugt eigenständiges Stehen.

---

## Aktuelle Version der App

**Datei:** `wanderungen-v2.html` — Standalone HTML, Dark Mode, 21 Touren, ~62 KB
**Technologie:** Vanilla HTML/CSS/JS, kein Framework, keine externen Abhängigkeiten außer Google Fonts (DM Sans + Playfair Display)

### Features

1. **Triple-Filter (kombinierbar):**
   - 📍 Entfernung: Alle / Nah (0–30 km) / Mittel (30–60 km) / Weit (60+ km)
   - 💧 Gewässer: See / Bergsee / Fluss & Klamm / See + Fluss / Alm & Panorama
   - 🐕 Hund baden: ✅ Hund darf baden / ⚠️ Eingeschränkt / ❌ Kein Baden

2. **Sortierbare Schnellvergleich-Tabelle:**
   - 6 Spalten klickbar: Tour, km, 🐾, Typ, Fahrzeit, Stellplatz
   - Parse-Logik für "9 km", "1:10 h", "Kostenlos", "17–22 €/Nacht"

3. **Pro Tour-Karte (aufklappbar):**
   - Distanz/Dauer/Höhe/Anfahrt Pills
   - Route-Beschreibung
   - Hund & Wasser (Pfotenrating 1–5 + Schwimm-Badge)
   - Parken & Stellplätze (P4N/Google Maps Buttons)
   - Einschränkungen (gelbe Warnbox)
   - Gut zu wissen
   - "Für euch" (Burgen + Veggie-Tipps)
   - 🗺️ Route auf Alpenvereinaktiv Button (orange, volle Breite)
   - Highlight-Box

4. **Design:** Dark Mode (#0A0A12), Playfair Display Header, DM Sans Body, Sticky Filter-Leiste, NEU-Badges

---

## Die 21 Touren im Detail

### Nahbereich (0–30 km)

| ID | Name | km | Hund baden | Typ | P4N Stellplatz | Alpenvereinaktiv |
|----|------|-----|-----------|-----|----------------|-----------------|
| 1 | Nussensee-Runde | 9 | ✅ ja | see-fluss | #54915 Kaiservilla | #7850475 |
| 2 | Altausseer Seerundweg | 7,5 | ✅ ja | see | #229737 Caravanpark | #107668990 (OA) |
| 3 | Bürglstein Runde | 9 | ✅ ja | see | #58708 P7 Schafbergbahn / #131827 Camping Berau | #33304774 (OA, Teilstrecke) |
| 4 | Langbathseen | 7,5 | ⚠️ teils | bergsee | #256696 Langbathsee / #20458 Trauneck | ❌ nicht gefunden |
| 5 | Offensee Rundweg | 5 | ⚠️ teils | bergsee | #463732 Offensee / #52703 Rindbach | #8816026 |
| 20 | Postalm Almrunde | 5–9 | ❌ nein | alm | #107622 Postalm P1 | #1358920 (OA) |

### Mittel (30–60 km)

| ID | Name | km | Hund baden | Typ | P4N Stellplatz | Alpenvereinaktiv |
|----|------|-----|-----------|-----|----------------|-----------------|
| 6 | Gosausee Rundweg | 5 | ⚠️ teils | bergsee | #489470 P5 / #450004 Steinermühle | #35874289 (OA) |
| 7 | Fuschlsee Rundweg | 11,5 | ✅ ja | see | Thalgauegg (Google Maps) / Camping Panorama Mondsee (GM) | #109173527 (OA) |
| 8 | Hintersee Rundweg | 5 | ⚠️ teils | see | Hintersee Faistenau (Google Maps) / Camping Panorama Mondsee (GM) | #109173525 (OA) |
| 9 | Grundlsee Nordufer | 8 | ✅ ja | see | #94083 Gößl / #207134 See-Camping Grundlsee | #24777331 (Gesamtumrundung) |
| 10 | Gößl → Toplitzsee | 6 | ✅ ja | see-fluss | #94083 Gößl / #207134 See-Camping Grundlsee | ❌ nicht gefunden |
| 11 | Laudachsee/Grünberg | 5 | ⚠️ teils | bergsee | Gmunden Seilbahn (GM, ⚠️ 2,10m!) / #13538 Toscanapark | #120789153 |
| 12 | Almsee Rundweg | 6,5 | ✅ ja | see | Almsee (GM, ⚠️ Womo VERBOTEN!) / #97721 Almcamp Schatzlmühle | #202358443 (OA) |
| 18 | Bluntautal | 8 | ❌ nein | fluss-klamm | #66585 Bluntautal P1 / #16209 Aqua Salza Golling | #23040799 (OA) |
| 21 | Gollinger Wasserfall | 2,5 | ❌ nein | fluss-klamm | #149187 Wasserfall P2 / #16209 Aqua Salza Golling | #23184843 |

### Weit (60+ km)

| ID | Name | km | Hund baden | Typ | P4N Stellplatz | Alpenvereinaktiv |
|----|------|-----|-----------|-----|----------------|-----------------|
| 13 | Schiederweiher | 7 | ✅ ja | fluss-klamm | #213799 Schiederweiher / #482487 Hinterstoder | #802279569 |
| 14 | Rinnende Mauer | 8,7 | ✅ ja | fluss-klamm | Molln Stefaniebrücke (GM, Kostenlos) / Gradau (GM, Kostenlos) | #55526269 (OA) |
| 15 | Leopoldsteiner See | 4 | ❌ nein | bergsee | #65608 Seestüberl / #501526 Eisenerz | #805110987 (OA) |
| 16 | Zeller See | 12 | ⚠️ teils | see | #78757 Erlberg / #51913 Seecamp | #7750068 (OA) |
| 17 | Sigmund-Thun-Klamm | 2,8 | ❌ nein | fluss-klamm | Kaprun Krafthaus (GM) / #51913 Seecamp | #1362539 (OA) |
| 19 | Malerwinkel Königssee | 4 | ❌ nein | bergsee | Königssee P2 (GM) / Mobiler Alpengenuss (GM) | #800513173 (OA) |

---

## Verifizierte Park4Night-Links (24 IDs)

Alle diese P4N-IDs wurden manuell verifiziert und existieren:

```
#54915   Kaiservilla Bad Ischl
#229737  Caravanpark Ausseerland Bad Aussee
#207134  See-Camping Grundlsee Stellplatz Gößl
#131827  Camping Berau St. Wolfgang
#20458   Stellplatz Trauneck Ebensee
#52703   Stellplatz Rindbach Ebensee
#450004  Womo-Stellplatz Gosau Steinermühle
#13538   Stellplatz Toscanapark Gmunden
#97721   Almcamp Schatzlmühle Scharnstein
#482487  Womo-Stellplatz Hinterstoder Hössbahn
#501526  Camping Stellplatz Eisenerz
#51913   Seecamp Zell am See
#58708   P7 Schafbergbahn St. Wolfgang
#256696  Tagesparkplatz Langbathsee
#463732  Tagesparkplatz Offensee
#489470  P5 Gosausee Camper
#94083   Parkplatz Gößl Grundlsee
#213799  Parkplatz Schiederweiher
#65608   Parkplatz Seestüberl Leopoldsteiner See
#78757   Parkplatz Erlberg Zell am See
#66585   Bluntautal P1 Golling
#16209   Wohnmobilpark Aqua Salza Golling
#149187  Parkplatz P2 Gollinger Wasserfall
#107622  Postalm P1
```

**Nicht auf P4N (Google Maps Koordinaten-Links):**
- Altaussee Kurhausparkplatz P1 (47.6362, 13.7628)
- Thalgauegg Fuschlsee (47.8060, 13.2830)
- Hintersee Faistenau (47.7537, 13.2408)
- Camping Panorama Mondsee (47.8320, 13.3790) — Campingplatz, sollte ersetzt werden!
- Molln Stefaniebrücke (47.8836, 14.2526)
- Molln Gradau (47.8780, 14.2680)
- Kaprun Krafthaus (47.2650, 12.7550)
- Gmunden Seilbahn Parkhaus (47.9135, 13.7975) — ⚠️ 2,10m Höhenbeschränkung!
- Königssee P2 (47.5910, 12.9870)
- Berchtesgaden Mobiler Alpengenuss (47.6310, 13.0020)

---

## Alpenvereinaktiv/Outdooractive URLs (19 von 21)

```javascript
const routeUrls={
  1:'https://www.alpenvereinaktiv.com/de/tour/nussenseerunde-ruine-wildenstein-nussensee-/7850475/',
  2:'https://www.outdooractive.com/de/route/wanderung/ausseerland-salzkammergut/altausseer-seeweg/107668990/',
  3:'https://www.outdooractive.com/de/route/wanderung/wolfgangsee/buergl-panoramaweg/33304774/',
  4:null, // Langbathseen: nicht gefunden
  5:'https://www.alpenvereinaktiv.com/de/tour/familienwanderung-rund-um-den-offensee/8816026/',
  6:'https://www.outdooractive.com/de/route/wanderung/dachstein-salzkammergut/rund-um-den-gosausee/35874289/',
  7:'https://www.outdooractive.com/de/route/wanderung/fuschlseeregion/fuschlsee-rundwanderweg/109173527/',
  8:'https://www.outdooractive.com/de/route/wanderung/fuschlseeregion/hintersee-rundwanderweg/109173525/',
  9:'https://www.alpenvereinaktiv.com/de/tour/grundlsee-umrundung-mit-toplitzsee/24777331/',
  10:null, // Gößl→Toplitzsee: nicht gefunden
  11:'https://www.alpenvereinaktiv.com/de/tour/gruenberg-rund-um-laudachsee/120789153/',
  12:'https://www.outdooractive.com/de/route/wanderung/traunsee-almtal/almsee-rundwanderweg/202358443/',
  13:'https://www.alpenvereinaktiv.com/de/tour/zu-schiederweiher-und-polsterlucke/802279569/',
  14:'https://www.outdooractive.com/de/route/wanderweg/molln/rinnende-mauer-schluchtweg/55526269/',
  15:'https://www.outdooractive.com/de/route/wanderung/erzberg-leoben/leopoldsteinerseerunde/805110987/',
  16:'https://www.outdooractive.com/de/route/wanderung/zell-am-see-kaprun/rundwanderweg-zeller-see/7750068/',
  17:'https://www.outdooractive.com/de/route/wanderung/zell-am-see-kaprun/rundweg-klammsee/1362539/',
  18:'https://www.outdooractive.com/de/route/wanderung/tennengau/wanderung-druch-das-bluntautal/23040799/',
  19:'https://www.outdooractive.com/de/route/wanderung/nationalpark-berchtesgaden/malerwinkel-rundweg-wandern-im-nationalpark-berchtesgaden/800513173/',
  20:'https://www.outdooractive.com/de/route/wanderung/abtenau/abtenau-ivv-rundwanderweg-postalm-rundweg-2-8-punkte-/1358920/',
  21:'https://www.alpenvereinaktiv.com/de/tour/gollinger-wasserfall-ein-naturschauspiel/23184843/'
};
```

---

## Hunde-Baden-Bewertung

```javascript
const dogSwimMap={
  1:'ja',    // Nussensee: frei ins Wasser
  2:'ja',    // Altaussee: Buchten zum Baden
  3:'ja',    // Wolfgangsee: Hundebadestellen
  4:'teils', // Langbathseen: kleine Buchten, Hinterer See Verbot
  5:'teils', // Offensee: Europaschutzgebiet, Südufer eingeschränkt
  6:'teils', // Gosausee: kleine Pfade, sehr kalt
  7:'ja',    // Fuschlsee: fast überall, Hundestrand!
  8:'teils', // Hintersee: NUR Westufer erlaubt
  9:'ja',    // Grundlsee: Schotterstränden Gößl
  10:'ja',   // Toplitzsee: Toplitzbach plantschen
  11:'teils',// Laudachsee: Moorsee, naturbelassen
  12:'ja',   // Almsee: Kiesbuchten, Almfluss
  13:'ja',   // Schiederweiher: Krumme Steyr viele Stellen
  14:'ja',   // Rinnende Mauer: Steyr Schotterbänke
  15:'nein', // Leopoldsteiner See: offiziell verboten!
  16:'teils',// Zeller See: Nord/West ja, Strandbäder nein
  17:'nein', // Sigmund-Thun-Klamm: kein Schwimmen
  18:'nein', // Bluntautal: Seen verboten, nur Pfoten in Ache
  19:'nein', // Königssee: komplett verboten (Trinkwasser)
  20:'nein', // Postalm: kein Gewässer
  21:'nein'  // Gollinger Wasserfall: kein Badesee
};
```

---

## Postalm Übernachtungs-Timeline (aus P4N-Bewertungen)

- **Bis 2021:** Übernachtung gratis, geduldet, keine Tickets
- **März 2022:** Übernachtungsverbot eingeführt (G.Redelsteiner, 23.03.2022)
- **Juni 2022:** Noch Verbot gemeldet (roadrunner667, 30.06.2022)
- **Juli 2022:** Nachtparkticket 20€ am Automaten erstmals erwähnt (regu, 15.07.2022)
- **Aug 2022:** 25€/Nacht (J.Pesendorfer, 08.08.2022)
- **2023–2025:** Stabil 20€/Nacht, Automat auf P1 bestätigt
- **Maut Strobl→Postalm:** 18€ (Womo bis 3,5t), bis 27€ je nach Kassierung

---

## Wichtige Regeln & Learnings

### Park4Night-Links
- **Nur verifizierte P4N-IDs verwenden** — niemals raten!
- Format: `https://park4night.com/en/place/NUMMER`
- Wenn nicht auf P4N: Google Maps Koordinaten-Link `https://www.google.com/maps?q=LAT,LNG`

### Google Maps Links
- Immer `?q=LAT,LNG` Format verwenden (öffnet zuverlässig an der richtigen Stelle)

### Standalone HTML
- Bevorzugt gegenüber React-Artifacts, weil `target="_blank"` Links in Claude's Artifact-Sandbox blockiert werden
- Alle externen Links brauchen `target="_blank" rel="noopener"`

### Stellplatz-Hierarchie
1. Wohnmobil-Stellplätze (beste Option)
2. Freie Parkplätze mit Übernachtungsmöglichkeit
3. Campingplätze (nur letzte Alternative)

### Hundegesetze
- **OÖ:** Ortsgebiet = Leinen- oder Maulkorbpflicht
- **Steiermark:** Überall Leinen- oder Maulkorbpflicht!
- **Salzburger Land:** Leinenpflicht im Ortsgebiet
- **Bayern/Deutschland:** Leinenpflicht im Nationalpark, Bootsfahrt nur mit Maulkorb
- Fließgewässer meist erlaubt

### Wohnmobil-Warnungen
- **Gmunden Seilbahn-Parkhaus:** NUR 2,10m Höhe — Elnagh mit 3,20m passt NICHT!
- **Almsee-Parkplatz:** Womo-Übernachtung VERBOTEN — aggressiv kontrolliert!
- **Leopoldsteiner See:** Hundebaden offiziell verboten (Schilder)
- **EasyPark-App:** Vor Fahrt installieren — Gosausee, Offensee, Langbathsee kein Mobilfunk!

---

## Nächstes Projekt: Stellplatz-First-Ansatz

### Idee
Park4Night systematisch im 75-km-Radius um Bad Ischl durchsuchen:
- **Nur** Womo-Stellplätze + Nachtparkplätze (keine Campingplätze!)
- Für jeden gefundenen Stellplatz die besten **Wanderungen in der Nähe** recherchieren
- Nach Thomas' Kriterien bewerten:
  - 🐕 Hundeschwimmen möglich?
  - ⛰️ Schwierigkeit (leicht/mittel/schwer)
  - 🏰 Burgen/historische Stätten in der Nähe?
  - 🥗 Vegetarische/vegane Einkehr?
  - 🧗 Klettersteige in der Nähe? (als Info, nicht in der App)
  - 🚐 Elnagh-tauglich? (Höhe 3,20m, Länge 5,99m)

### Offene Aufgaben
- [ ] Tour 3 (Bürglstein): Camping Berau durch Stellplatz ersetzen
- [ ] Tour 7 (Fuschlsee): Camping Panorama Mondsee durch Stellplatz ersetzen
- [ ] Tour 8 (Hintersee): Camping Panorama Mondsee durch Stellplatz ersetzen
- [ ] Tour 4 (Langbathseen): Alpenvereinaktiv-URL finden
- [ ] Tour 10 (Gößl→Toplitzsee): Alpenvereinaktiv-URL finden
- [ ] Neue Touren aus Stellplatz-First-Recherche einbauen
- [ ] Stellplätze die NICHT in der aktuellen App sind als neue Basis-Camps identifizieren

---

## Gewässer-Kategorien

```javascript
const typeLabels={
  'see':'🏊 See-Runde',
  'bergsee':'⛰️ Bergsee',
  'fluss-klamm':'🏞️ Fluss & Klamm',
  'see-fluss':'🌊 See + Fluss',
  'alm':'🏔️ Alm & Panorama'
};
```

---

## Entfernungs-Gruppen

```javascript
const distGroups={
  nah:  {label:'📍 Nahbereich · 0–30 km',  order:0},
  mittel:{label:'🗺️ Entdeckungen · 30–60 km',order:1},
  weit:  {label:'🌍 Abenteuer · 60+ km',    order:2}
};
```
