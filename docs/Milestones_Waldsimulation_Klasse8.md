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
| M1 | **Datenmodell**: `data/nodes.json` (32 Knoten inkl. `mensch_bewirtschaftung`), `data/edges.json` (Beziehungstabelle inkl. Kanten-Transformationsregel für Habicht/Sperber, Luchs/Wolf, Raupen/Blattläuse), `data/waldtypen.json`, `data/stoerungen.json` als single source of truth | ⬜ offen | Umsetzungsauftrag 4.1–4.4, Wissensbasis Abschnitt 2–3 |
| M2 | **Build-Time-Simulationsmodul**: ein geschlossenes Berechnungsmodul (Kaskaden/Schwellenwerte/Zeitkonstanten je Szenario 1–6) + Build-Skript, erzeugt alle 195 gültigen Waldtyp×Konfiguration-Kombinationen als statische Zeitreihen-JSONs | ⬜ offen | Umsetzungsauftrag 2.11, Akzeptanzkriterium „195 Kombinationen vorab berechnet" |
| M3 | **PWA-Grundgerüst**: `manifest.json`, Service Worker (versioniert, `skipWaiting`/`clients.claim`), konsequent relative Pfade (GitHub-Pages-Unterordner), localStorage/IndexedDB-Grundlage | ⬜ offen | Technikdokument 5.1–5.2, 5.7 |
| M4 | **Start & Auswahl**: zwei Pflicht-Wald-Plätze (zwingend unterschiedliche Typen), freie Störungsauswahl (0–2 von 5 Ereignis-Typen, Kategorie-Icons Naturereignis/Bewirtschaftung), Wildverbiss-Regler (3 Stufen), Hypothese je Wald, Play-Sperre bei „keine Abweichung vom Ausgangszustand" | ⬜ offen | Umsetzungsauftrag 2.1/2.2/2.10, 3.2 |
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
