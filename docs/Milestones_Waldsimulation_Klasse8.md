# Milestones: Waldökosystem-Störungssimulation (Klasse 8)

**Zweck:** Lebendes Tracking-Dokument für den Umsetzungsfortschritt. Wird von Claude Code während der Umsetzung aktualisiert (Status-Spalte pflegen, Häkchen setzen, neue Erkenntnisse ergänzen). Dupliziert keine Inhalte aus den Quelldokumenten, sondern verlinkt darauf.

**Quellenlage (Rangfolge, siehe Umsetzungsauftrag Abschnitt 0):**
1. `Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` – Entscheidungsprotokoll, Datenmodell, Akzeptanzkriterien
2. `Mitteleuropäische_Waldökosysteme_Wissensbasis_v2.md` – fachliche Quelle (Arten, Zahlen, Kaskaden)
3. `Styleguide_Waldsimulation_Klasse8.md` – Farbe/Typografie/Illustration/Animation (**seit dieser Session vollständig vorhanden**, vorher fehlend)
4. `Illustrations_Promptvorlage_Waldsimulation_Klasse8.md` – Sprite-Dateinamen/-Zustände
5. `Technische_Anforderungen_Waldsimulation_Klasse8.md` + `User_Stories_Waldsimulation_Klasse8.md` – Hintergrund, an mehreren Stellen überschrieben

Ergänzend: `Fehlende_Grafiken_Bekannt_...md` (bekannte fehlende Bilder mit Prompts) und `Fehlende_Grafiken_Laufend_...md` (von Claude Code laufend zu pflegende Liste neu entdeckter Bedarfe).

---

## Bekannte Annahmen (nicht mit echter Lehrkraft geprüft)

Diese drei Werte sind in den Quelldokumenten explizit als „Annahme, mit Lehrkraft abzugleichen" markiert. Sie werden für die Umsetzung wie dokumentiert übernommen (Nutzer-Entscheidung vom 2026-08-25), sollten aber vor dem echten Unterrichtseinsatz noch mit einer Lehrkraft gegengeprüft werden.

| Annahme | Wert | Quelle |
|---|---|---|
| Zeitabstand Sturm → Trockenheit | 1 Jahr | Umsetzungsauftrag 2.6 |
| Zeitabstand Sturm → Temperatur (bei Kombination Temperatur+Sturm) | Sturm-Trigger bei Jahr 1 | Umsetzungsauftrag 2.6 / User Stories 3.5 |
| Zeitabstand Totholzentnahme + (Borkenkäfer/Trockenheit/Sturm) | 0 Jahre (gleichzeitig) | Umsetzungsauftrag 2.10.4 |

---

## Milestones

| # | Milestone | Status | Bezug (Akzeptanzkriterien/Abschnitte) |
|---|---|---|---|
| M0 | **Content-Fundament**: Sprites aus Atlas extrahiert (`assets/sprites/`, 38 Dateien, `hirsch`→`rothirsch` vereinheitlicht), Styleguide integriert, Prompt-Dateien für alle 17 bekannten fehlenden Bilder (`assets/prompts/`), Milestone-Doku angelegt | ✅ fertig (2026-08-25) | Vorbereitung für alle folgenden Milestones |
| M1 | **Datenmodell**: `data/nodes.json` (32 Knoten inkl. `mensch_bewirtschaftung` + 3 abiotische Sonderknoten Licht/Wasser/Temperatur), `data/edges.json` (59 Kanten, Beziehungstabelle inkl. Kanten-Transformationsregel für Habicht/Sperber, Luchs/Wolf, Raupen/Blattläuse), `data/waldtypen.json` (3 Waldtypen mit Resilienzfaktoren), `data/stoerungen.json` (5 Ereignis-Störungen, Wildverbiss-Regler, Zeitabstands-/Kombinationsregeln) als single source of truth, referentiell geprüft | ✅ fertig (2026-08-25) | Umsetzungsauftrag 4.1–4.4, Wissensbasis Abschnitt 2–3 |
| M2 | **Build-Time-Simulationsmodul**: geschlossenes Berechnungsmodul (`scripts/simulation/model.py`) + Build-Skript (`scripts/simulation/build_simulationen.py`), erzeugt alle 195 gültigen Waldtyp×Konfiguration-Kombinationen als statische Zeitreihen-JSONs unter `data/generated/simulationen/` (+ Index), Akzeptanzkriterium „Borkenkäfer+Fichtenmonokultur=Kollaps, Borkenkäfer+Mischwald=lokal" und „Wildverbiss erst in 2. Hälfte sichtbar" verifiziert | ✅ fertig (2026-08-25) | Umsetzungsauftrag 2.11, Akzeptanzkriterium „195 Kombinationen vorab berechnet" |
| M3 | **PWA-Grundgerüst**: `manifest.json`, `index.html`/`css/styles.css`/`js/app.js` als App-Shell, Service Worker (`sw.js`, inhaltshash-versioniert über `sw-precache-manifest.json`, `skipWaiting`/`clients.claim`), konsequent relative Pfade (GitHub-Pages-Unterordner), `js/storage.js` als localStorage-Grundlage fürs spätere Forscherheft | ✅ fertig (2026-08-26) | Technikdokument 5.1–5.2, 5.7 |
| M4 | **Start & Auswahl**: zwei Pflicht-Wald-Plätze (zwingend unterschiedliche Typen, gegenseitig deaktiviert), freie Störungsauswahl (0–2 von 5 Ereignis-Typen, Kategorie-Icons/-Rahmen Naturereignis/Bewirtschaftung, Reihenfolge-Auswahl nur wenn `reihenfolge_waehlbar`), Wildverbiss-Regler (3 Stufen), Hypothese je Wald, Play-Sperre bei „keine Abweichung vom Ausgangszustand", löst Auswahl live zur passenden vorab berechneten Zeitreihe auf (Vorschau-Screen mit Jahr-0/Jahr-20-Werten, Live-Dashboard folgt in M5) | ✅ fertig (2026-08-26) | Umsetzungsauftrag 2.1/2.2/2.10, 3.2 |
| M5 | **Live-Dashboard**: Feldmessinstrumente-Optik, Zeitsteuerung (Play/Pause/Einzelschritt, 0–20 Jahre), Sprite-Zustandswechsel mit Crossfade, Vergleichsansicht zweier Wälder nebeneinander | ⬜ offen | Umsetzungsauftrag 3.3, Styleguide Abschnitt 6 |
| M6 | **Analyse-Screen**: eigener Vollbild-Screen (getrennt vom Dashboard), frei kombinierbare Kurven für alle Indikatoren, kaskadenrelevante Kurven optisch hervorgehoben, bis zu 3 Snapshots ins Forscherheft | ⬜ offen | Umsetzungsauftrag 2.5, User Stories 3.7/3.8 |
| M7 | **Forscherheft**: Datenmodell v2 (2× Wald-Datensatz, Störung/Regler inkl. Reihenfolge, bis zu 3 Kurven-Snapshots, gemeinsamer Reflexionstext), Textexport, Fortschrittsanzeige ohne festen Zielwert, „neue Sitzung" möglich | ⬜ offen | Umsetzungsauftrag 2.4/2.9, Technikdokument 5.6 |
| M8 | **Netzwerk-Graph & Rachel Carson**: Graph zu Beginn gesperrt, Button „Wissenschaftler:in um Hilfe bitten", tolerante Namensprüfung, editierbare Brief-Content-Datei, Kaskadenpfad-Hervorhebung als „Tinten-Spur", Vergleichsansicht als Doppelseite | ⬜ offen | Umsetzungsauftrag 2.3, Styleguide Abschnitt 5 |
| M9 | **Arten-Lexikon**: alle 32 Knoten, nach Kategorie gruppiert, Bild + 1–2 Fakten, ohne Suche, unabhängig vom Graphen aufrufbar | ⬜ offen | Umsetzungsauftrag 2.8 |
| M10 | **Asset-Feinschliff**: restliche extern generierte Bilder einpflegen sobald geliefert (17 Prompt-Dateien aus M0 + laufend ergänzte Liste), Beobachtungs-Stempel, Animationen gemäß Styleguide Abschnitt 7 | ⬜ offen | Fehlende_Grafiken_Bekannt/_Laufend, Styleguide Abschnitt 4/6/7 |
| M11 | **Test & Deployment**: Abgleich gegen alle Akzeptanzkriterien (Umsetzungsauftrag Abschnitt 6), GitHub Pages Deployment, QR-Code für die Klasse | ⬜ offen | Umsetzungsauftrag Abschnitt 6, Technikdokument 5.7 |

Status-Legende: ⬜ offen · 🔶 in Arbeit · ✅ fertig

---

## Bekannte Lücken / offene Nachlieferungen

- **16 Bilder aus `Fehlende_Grafiken_Bekannt` sind weiterhin nicht vorhanden** (9× Liste A Wald-Zustandsbilder, 4× Liste B Störungs-Icons, 1× Liste D Mensch-Icon, 1× Liste E Wildverbiss-Waldbild, 1× App-Icon) – fertige Prompt-Dateien liegen in `assets/prompts/` bereit, müssen extern generiert und unter dem jeweiligen Dateinamen in `assets/sprites/` abgelegt werden.
- **1 zusätzliches, während dieser Session entdecktes Bild** (`stoerung_wildverbiss.png`, Icon für den Wildverbiss-Regler) wurde in `Fehlende_Grafiken_Laufend_Waldsimulation_Klasse8.md` nachgetragen; Prompt ebenfalls in `assets/prompts/`.
- Das Referenzbild `docs/ChatGPT Image ... 06_18_55 PM.png` (Wald-Szene mit Fichte) wurde **nicht** als `wald_mischwald_stabil.png` übernommen (enthält eine Fichte, widerspricht dem didaktisch zentralen „fichtenfreier Referenz-Mischwald"); liegt nur als Stilreferenz unter `assets/sprites/_reference/wald_szene_referenz.png`.
- **M1-Datenmodell, offene Modellierungsentscheidung für M8:** Für die beiden in Szenario 5/6 neuen Kantentypen (`bewirtschaftung`: Mensch entnimmt Totholz; `strukturell`: Verbiss verhindert/entwertet Verjüngung) definiert der Styleguide (vor Szenario 5/6 verfasst, nur 5 Grundtypen) noch keine Farbe/kein Symbol – siehe `data/edges.json` → `_meta.todo_m8`. Muss beim Netzwerk-Graph (M8) ergänzt werden.
- **M2-Tooling-Hinweis:** In dieser Entwicklungsumgebung war kein Node.js verfügbar. Das Berechnungsmodul + Build-Skript für die Vorabsimulation sind deshalb in Python geschrieben (`scripts/simulation/`) statt in der von Technikdokument Abschnitt 6 empfohlenen Sprache. Das läuft ausschließlich beim Build (nie im Browser) und ändert nichts an Datenmodell oder Ausgabeformat – reines, sprachunabhängiges JSON unter `data/generated/simulationen/`. Diese generierten Dateien werden mit committet (kein CI-Build-Schritt vorgesehen, GitHub Pages liefert nur statische Dateien aus).
- **M3-App-Icon ist ein Platzhalter:** `assets/icons/icon-192.png`, `icon-512.png`, `apple-touch-icon.png` sind mit `scripts/pwa/generate_placeholder_icon.py` (Pillow) generiert, nicht das extern zu erstellende Bild aus `assets/prompts/app_icon.txt`. Sobald dieses geliefert wird, muss es unter denselben Dateinamen abgelegt und `scripts/pwa/build_precache_manifest.py` neu ausgeführt werden (siehe M10).
- **M3-Tooling-Hinweis:** Anders als bei M2 dokumentiert war in dieser Session Node.js (v24, via nvm) doch verfügbar; die JS-Dateien der PWA (`sw.js`, `js/*.js`) wurden entsprechend mit `node --check` auf Syntaxfehler geprüft. Ein Browser mit Service-Worker-Unterstützung stand jedoch nicht zur Verfügung – Installation/Offline-Verhalten auf einem echten iPad/Safari vor dem Unterrichtseinsatz noch manuell verifizieren.
- **M3-Build-Schritt, bei jeder Content-/Asset-Änderung nötig:** `sw-precache-manifest.json` (Dateiliste + Inhalts-Hash für den Service-Worker-Cache-Namen) wird von `scripts/pwa/build_precache_manifest.py` erzeugt und mitcommittet. Nach jeder Änderung an `index.html`, `css/`, `js/`, `assets/icons/`, `assets/sprites/` oder `data/` muss das Skript erneut laufen, sonst bleibt der Service Worker auf einem veralteten Cache-Stand.
- **M4-Auswahlbildschirm nutzt großteils noch fehlende Bilder:** Alle 3 Wald-Kartenbilder (`wald_*_stabil.png`) und 3 der 5 Störungs-Icons (`stoerung_trockenheit/temperatur/sturm.png`) aus M0/`Fehlende_Grafiken_Bekannt` fehlen weiterhin (nur `borkenkaefer_massenvermehrung.png` existiert bereits). Damit die UI trotzdem sauber aussieht, hat jede `<img>` (Klasse `sprite-frame`) einen automatischen Fallback: schlägt das Laden fehl, erscheint ein Emoji + Textlabel statt eines kaputten Bild-Icons (siehe `js/startScreen.js`, `spriteFrameHtml`/globaler `error`-Listener). Sobald die echten Bilder unter den dokumentierten Dateinamen in `assets/sprites/` abgelegt werden, erscheinen sie automatisch, ohne Code-Änderung – dann `scripts/pwa/build_precache_manifest.py` erneut ausführen.
- **M4-Umsetzungsentscheidung, Vergleichsmodus:** Die gewählte(n) Störung(en) + der Wildverbiss-Regler gelten für **beide** Wald-Plätze gleichzeitig (ein gemeinsamer Auswahlschritt, nicht zwei getrennte) – nur der Waldtyp selbst und die Hypothese sind pro Platz individuell. Das ist im Umsetzungsauftrag nicht wortwörtlich festgelegt, ergibt sich aber zwingend aus dem Vergleichszweck (Kontrast Mono- vs. Mischwald unter identischer Störung, Akzeptanzkriterium Abschnitt 6).
- **M4-Umsetzungsentscheidung, Reihenfolge-Kanonisierung:** Bei den drei Ereignispaaren mit `reihenfolge_waehlbar: false` (alle Totholzentnahme-Kombinationen) fragt die UI die Reihenfolge nicht ab, sondern wählt intern eine feste Reihenfolge (nach `EVENT_ORDER` in `js/simulationConfig.js`, deckungsgleich mit `EVENTS_NATUR_UND_BEWIRTSCHAFTUNG` in `build_simulationen.py`) – geprüft, dass beide Reihenfolge-Richtungen identische Zeitreihen liefern (M2-Build erzeugt beide Dateien redundant).
- **M4-Test:** `js/simulationConfig.js`-Auflösung wurde gegen alle 195 generierten Dateien in `data/generated/simulationen_index.json` programmatisch geprüft (alle 285 gültigen Kombinationen aus 3 Waldtypen × 22 Ereigniszuständen × 3 Reglerstufen lösen auf die richtige Datei auf); zusätzlich Ende-zu-Ende mit jsdom durch die echte `index.html`/JS-Pipeline getestet (unter anderem das Akzeptanzkriterium „Borkenkäfer + Fichtenmonokultur" → Baumbestand 95→0, im Mischwald nahezu unverändert; Reihenfolge-Pflicht bei Sturm+Borkenkäfer; Temperatur-Kombination ohne Reihenfolge-Abfrage; isolierter Wildverbiss-Lauf ohne Ereignis; Play-Sperre bei leerer Auswahl).
- **M1-Datenmodell, dokumentierte Vereinfachungen:** Wo die Wissensbasis nur generische Ziele nennt („Kraut", „Vögel", „Kleinsäuger", „Bäume", „geschwächter Baum") statt konkreter Arten, wurden nachvollziehbare, im jeweiligen `hinweis`-Feld begründete Zuordnungen getroffen (z. B. Hallimasch-Befall generisch auf Fichte angewendet). Keine Erfindung neuer Fachinhalte, nur Konkretisierung bestehender Tabellenzeilen – im Zweifel in `data/edges.json` nachlesen.
