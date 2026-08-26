# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A German-language educational PWA: an interactive forest-ecosystem disturbance simulation for 8th-grade
biology (single 45-minute lesson). Students compare two forest types side by side under combinations of
disturbances (bark beetle, drought, higher temperatures, storm, deadwood removal) plus an independent
predator/browsing-pressure control, to experience that ecological disruptions cascade through networked
systems rather than acting in isolation. Pure static frontend (HTML/CSS/vanilla JS), no backend, no
accounts, offline-first via a Service Worker, deployed to GitHub Pages.

## Source-of-truth documents

This project is driven by a stack of German-language specs in `docs/`, with an explicit precedence order
(see `docs/Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` Abschnitt 0) — **always resolve
conflicts using this order**:

1. `Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` — the master doc: decision log, data
   model, acceptance criteria. Start here for "what should happen".
2. `Mitteleuropäische_Waldökosysteme_Wissensbasis_v2.md` — sole authority for species, numbers,
   relationships, cascade logic. Never invent ecological content beyond this file.
3. `Styleguide_Waldsimulation_Klasse8.md` — sole authority for colors, typography, illustration style,
   animation ("Feldbuch/Naturjournal" look). Performance on older iPads wins if it conflicts with style.
4. `Illustrations_Promptvorlage_Waldsimulation_Klasse8.md` — sprite filenames/state conventions.
5. `Technische_Anforderungen_Waldsimulation_Klasse8.md` + `User_Stories_Waldsimulation_Klasse8.md` —
   background context, superseded in several places by document 1.

Also read **first, always**: `docs/Milestones_Waldsimulation_Klasse8.md` — the living tracking doc.
Check current milestone status there before starting work, and update it (status column, checkboxes,
new findings) as part of finishing a milestone. It links out to
`Fehlende_Grafiken_Bekannt_...md` (known missing illustrations with ready prompts),
`Fehlende_Grafiken_Laufend_...md` (list Claude Code maintains of newly discovered asset needs), and
`Ideen_Backlog_Waldsimulation_Klasse8.md` (user-maintained backlog for future versions, out of current
scope unless promoted to a milestone).

## Architecture

**Key design decision — build-time pre-simulation, not a live engine** (Umsetzungsauftrag 2.11): the
ecological model runs once at build time, not in the browser. This keeps the runtime app trivial (data
lookup + playback) and makes every scenario outcome auditable ahead of time.

```
data/*.json (nodes, edges, forest types, disturbances)  — single source of truth, hand-authored
        │
        ▼
scripts/simulation/model.py         — the one ecological calculation module (cascades, thresholds,
scripts/simulation/build_simulationen.py   time constants from the Wissensbasis)
        │  enumerates all valid forestType × disturbance-config × browsing-pressure combinations
        ▼
data/generated/simulationen/*.json  — one static 0–20-year time series per combination
data/generated/simulationen_index.json
        │
        ▼
js/data.js (WaldsimData)            — fetches the static JSON at runtime; NO ecological computation
        │                              happens in the browser, ever
        ▼
js/*.js (screens/UI modules)        — pure playback/rendering of pre-computed series
```

If you change `model.py`, `data/*.json`, or the combination enumeration in `build_simulationen.py`, you
must rerun the build script (see Commands) and commit the regenerated files under
`data/generated/simulationen/` — the app never recomputes at runtime.

**JS module pattern**: every `js/*.js` file defines one global IIFE singleton named `Waldsim<Area>`
(`WaldsimData`, `WaldsimStorage`, `WaldsimDashboard`, `WaldsimGraph`, `WaldsimForscherheft`,
`WaldsimAnalyse`, `WaldsimLexikon`, `WaldsimStartScreen`, `WaldsimChart`, `WaldsimIcons`,
`WaldsimConfig`, `WaldsimUI`). No bundler, no ES modules — `index.html` loads plain `<script>` tags in
dependency order; `js/app.js` runs last and wires up service worker registration + calls each module's
`init()`. Keep new code in this same pattern rather than introducing imports/bundling.

**Domain areas, one file each**: `startScreen.js` (forest-pair + disturbance selection, hypothesis),
`dashboard.js` (live playback of the two forests, field-instrument indicators), `analyse.js` (fullscreen
curve-comparison screen after year 20), `forscherheft.js` (local "field journal" — persisted run
history), `graph.js` (network graph, locked behind the "Rachel Carson" easter-egg/unlock mechanic —
Umsetzungsauftrag 2.3), `lexikon.js` (species glossary, all nodes, no search), `chart.js` (shared curve
rendering), `storage.js` (localStorage wrapper, tolerant of private-mode failures).

**All content data is JSON under `data/`**, deliberately separated from logic: `nodes.json` /
`edges.json` (the ecological graph: 32 nodes, relationship types Fraß/Symbiose/Konkurrenz/Zersetzung +
abiotic coupling), `waldtypen.json` (3 forest types), `stoerungen.json` (5 event disturbances + the
3-level/4-combo predator-browsing control + timing-offset rules between combined disturbances),
`indikatoren.json`, `rachel_carson_brief.json`. Never hand-edit anything under `data/generated/` — it is
regenerated output.

**PWA/offline layer**: `sw.js` and `sw-precache-manifest.json` are **generated files — never edit them
directly**. Edit `scripts/pwa/sw.template.js` instead. The manifest hashes the content of the app shell
(`index.html`, `manifest.json`) plus every file under `assets/icons/`, `assets/sprites/`, `css/`, `js/`,
`data/` (excluding `assets/sprites/_reference/`); the hash becomes the cache name, which is how the
service worker knows to invalidate old caches on update (`skipWaiting`/`clients.claim`). All asset/script
paths throughout the app are relative (`./...`), never absolute — required because GitHub Pages serves
this from a subfolder, not the domain root.

## Commands

No package manager, no JS build step, no test framework — plain static files plus two standalone Python
build scripts (stdlib only, no requirements file).

```bash
# Regenerate all pre-computed simulation time series after touching model.py,
# build_simulationen.py, or any data/*.json input file:
python3 scripts/simulation/build_simulationen.py

# Regenerate sw.js + sw-precache-manifest.json after ANY change to a cached
# asset (js/, css/, data/, assets/icons/, assets/sprites/, index.html, manifest.json).
# Must be run — and the results committed — as the last step before considering
# a change to any cached file complete:
python3 scripts/pwa/build_precache_manifest.py

# Serve locally (any static file server works; must be http:// for service worker/fetch to work, not file://):
python3 -m http.server 8000
```

There is no automated test suite. Verification is manual against the acceptance criteria in
`Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` Abschnitt 6 (e.g. "bark beetle +
spruce monoculture" must show large-scale collapse while the same disturbance in a mixed forest causes
only local damage) — check these when touching simulation logic.

## Working conventions

- Code comments, commit messages, and doc content in this repo are in German; match that.
- `checks.json` is a local, gitignored file — not part of the tracked project state.
- Image assets: the user drops sourced images into `docs/eingang/`; integrate them into
  `assets/sprites/` or `assets/icons/` per the naming rules in
  `Illustrations_Promptvorlage_Waldsimulation_Klasse8.md`, then rerun the precache-manifest build.
- Any change to what's cached for offline use is incomplete until
  `scripts/pwa/build_precache_manifest.py` has been rerun and its output committed.
