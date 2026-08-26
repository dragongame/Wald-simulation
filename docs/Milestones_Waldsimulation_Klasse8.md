# Milestones: Waldökosystem-Störungssimulation (Klasse 8)

**Zweck:** Lebendes Tracking-Dokument für den Umsetzungsfortschritt. Wird von Claude Code während der Umsetzung aktualisiert (Status-Spalte pflegen, Häkchen setzen, neue Erkenntnisse ergänzen). Dupliziert keine Inhalte aus den Quelldokumenten, sondern verlinkt darauf.

**Quellenlage (Rangfolge, siehe Umsetzungsauftrag Abschnitt 0):**
1. `Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` – Entscheidungsprotokoll, Datenmodell, Akzeptanzkriterien
2. `Mitteleuropäische_Waldökosysteme_Wissensbasis_v2.md` – fachliche Quelle (Arten, Zahlen, Kaskaden)
3. `Styleguide_Waldsimulation_Klasse8.md` – Farbe/Typografie/Illustration/Animation (**seit dieser Session vollständig vorhanden**, vorher fehlend)
4. `Illustrations_Promptvorlage_Waldsimulation_Klasse8.md` – Sprite-Dateinamen/-Zustände
5. `Technische_Anforderungen_Waldsimulation_Klasse8.md` + `User_Stories_Waldsimulation_Klasse8.md` – Hintergrund, an mehreren Stellen überschrieben

Ergänzend: `Fehlende_Grafiken_Bekannt_...md` (bekannte fehlende Bilder mit Prompts), `Fehlende_Grafiken_Laufend_...md` (von Claude Code laufend zu pflegende Liste neu entdeckter Bedarfe) und `Ideen_Backlog_Waldsimulation_Klasse8.md` (vom Nutzer gepflegte Sammelstelle für Ideen/Verbesserungswünsche für spätere Versionen, außerhalb des aktuellen Umsetzungsauftrags).

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
| M5 | **Live-Dashboard**: Feldmessinstrumente-Optik (6 Indikatoren, Symbol+Skala+Text, nie Farbe allein), Zeitsteuerung (Play/Pause/Einzelschritt + Zeitachsen-Regler, Jahr 0–20), Art-Sprite-Zustandswechsel mit Crossfade (inkl. Sukzession, z. B. Birke erscheint erst im Verlauf), Vergleichsansicht zweier Wälder nebeneinander, kurzer Abschluss-Hinweis am Ende des Durchlaufs | ✅ fertig (2026-08-26) | Umsetzungsauftrag 3.3, Styleguide Abschnitt 6 |
| M6 | **Analyse-Screen**: eigener Vollbild-Screen (getrennt vom Dashboard, erreichbar über Button im Abschluss-Hinweis bei Jahr 20), frei kombinierbare Kurven für alle 14 Indikatoren (nicht nur die 6 Dashboard-Instrumente), kaskadenrelevante Kurven vorausgewählt/mit ★ hervorgehoben, bis zu 3 Kurven-Kombinationen als Snapshot merkbar (Übernahme ins Forscherheft folgt mit M7) | ✅ fertig (2026-08-26) | Umsetzungsauftrag 2.5, User Stories 3.7/3.8 |
| M7 | **Forscherheft**: eigener Reflexions-Screen nach der Analyse (Reflexionsfragen wörtlich aus Wissensbasis 6.5, inkl. Zusatzfrage bei Totholzentnahme), dauerhafte lokale Speicherung als Datenmodell v2 (2× Wald-Datensatz inkl. automatischem Endzustandsbild/Kurzbeschreibung, Störung(en) inkl. Reihenfolge/Zeitpunkt, Regler, bis zu 3 Kurven-Snapshots, gemeinsamer Reflexionstext, Feldbuch-Stempel als Signatur-Element), Übersichts-Screen mit Fortschrittsanzeige ohne festen Zielwert, Textexport je Seite (Kopieren/Teilen), „neue Sitzung" (alle Einträge löschen, mit Bestätigung), von überall über Button auf dem Startbildschirm erreichbar | ✅ fertig (2026-08-26) | Umsetzungsauftrag 2.4/2.9, Technikdokument 5.6 |
| M8 | **Netzwerk-Graph & Rachel Carson**: Graph zu Beginn gesperrt, Button „Wissenschaftler:in um Hilfe bitten", tolerante Namensprüfung, editierbare Brief-Content-Datei, Kaskadenpfad-Hervorhebung als „Tinten-Spur", Vergleichsansicht als Doppelseite | ✅ fertig (2026-08-26) | Umsetzungsauftrag 2.3, Styleguide Abschnitt 5 |
| M9 | **Arten-Lexikon**: alle 32 Knoten, nach Kategorie gruppiert, Bild + 1–2 Fakten, ohne Suche, unabhängig vom Graphen aufrufbar | ✅ fertig (2026-08-26) | Umsetzungsauftrag 2.8 |
| M10 | **Asset-Feinschliff**: restliche extern generierte Bilder einpflegen sobald geliefert (17 Prompt-Dateien aus M0 + laufend ergänzte Liste), Beobachtungs-Stempel, Animationen gemäß Styleguide Abschnitt 7 | ✅ fertig (2026-08-26) | Fehlende_Grafiken_Bekannt/_Laufend, Styleguide Abschnitt 4/6/7 |
| M11 | **Test & Deployment**: Abgleich gegen alle Akzeptanzkriterien (Umsetzungsauftrag Abschnitt 6), GitHub Pages Deployment, QR-Code für die Klasse | ✅ fertig (2026-08-26) | Umsetzungsauftrag Abschnitt 6, Technikdokument 5.7 |
| M12 | **Dashboard-Kacheln für die 20 neuen Arten-Indikatoren**: eigene Live-Dashboard-Kacheln/Sprites für die in der Analyse-Erweiterung (siehe „Erweiterung (2026-08-26), 20 neue Arten-Indikatoren" unten) simulierten Arten, die bisher nur als Kurve wählbar sind | ✅ fertig (2026-08-26) | Backlog „Mehr Tiere und Pflanzen bei der Simulation anzeigen" (Teil-Erledigung) |
| M13 | **Reihenfolge-Abfrage nur bei echtem Zeitversatz**: Reihenfolge-Auswahl in der UI nur noch anbieten, wenn `abstand_jahre > 0` (z. B. Sturm+Borkenkäfer, Sturm+Trockenheit); bei `abstand_jahre = 0` (aktuell nur Trockenheit+Borkenkäfer betroffen) entfällt die Frage, nachdem verifiziert ist, dass beide Reihenfolgen bei echter Gleichzeitigkeit identische Zeitreihen liefern | ✅ fertig (2026-08-26) | Backlog „Szenarios wo die Reihenfolge egal ist" |
| M14 | **Einfachere Wald-Auswahl**: statt fester Plätze „Wald 1"/„Wald 2" alle drei Waldtypen nebeneinander zeigen, zwei davon anwählen, Reihenfolge der Anwahl (links→rechts) bestimmt automatisch Wald 1/Wald 2 | ⬜ offen | Backlog „Einfachere Auswahl" |
| M15 | **Netzwerk-Graph übersichtlicher**: Sidebar mit an-/abwählbaren Art-Icons zum Filtern der im Graphen gezeigten Knoten, deutlicher unterscheidbare Kanten-/Linienarten | ⬜ offen | Backlog „Netzwerk übersichtlicher gestalten" |
| M16 | **Graphen-Snapshots im Forscherheft anzeigen**: die bis zu 3 gespeicherten Kurven-Snapshots (seit M6/M7 als Daten im Forscherheft-Eintrag vorhanden) als tatsächliche Kurvengrafik auf der Forscherheft-Seite rendern, nicht nur referenzieren | ✅ fertig (2026-08-26) | Backlog „Die Graphen sollen im Forscherheft angezeigt werden" |
| M17 | **Instrumente als Tacho/Radialdiagramm**: Live-Dashboard-Instrumente (M5) optional/zusätzlich als Radialdiagramm/Tacho mit Art/Baum in der Mitte statt nur Symbol+Skala+Text | ⬜ offen | Backlog „Instrument Verbesserung" |
| M18 | **Drag & Drop für Szenario-Zusammenstellung**: Wälder/Störungen per Drag & Drop ins Forscherheft/die Auswahl ziehen statt nur anzuklicken | ⬜ offen | Backlog „Drag & Drop" |
| M19 | **Lehrkraft-Liste interessantester 2er-Kombinationen**: Übersicht/Empfehlung besonders kontrastreicher Wald×Störung-Kombinationen zur gezielten Verteilung an Gruppen | ✅ fertig (2026-08-26) | Backlog „Erstelle eine Liste den Interessantesten 2er Kombinationen" |
| M20 | **Feldbuch-Feeling**: offene Buchseiten-Optik bei Szenario-Zusammenstellung (siehe M18/M14) und Reflexion (M7), Post-it-Navigation, `docs/eingang/Hintergrund.png` als Journal-Hintergrund, `docs/eingang/Bockmarks-3.png` als Bookmark-Navigation, Prüfung/Anpassung der Regel „Netzwerk erst nach Wissenschaftler:in-Freischaltung sichtbar" (M8) | ⬜ offen | Backlog „Mehr Feldbuch feeling" |
| M21 | **PDF-Export des Forscherhefts**: Layout-/Bild-Export statt des bisherigen einfachen Textexports (M7) | ⬜ offen | Umsetzungsauftrag 2.9 (explizit auf „nicht Version 1" vertagt) |
| M22 | **Vorführ-Modus für die Lehrkraft**: z. B. Beamer-Demo-Ablauf vor der eigentlichen Arbeitsphase | ⬜ offen | Umsetzungsauftrag 2.9 (explizit auf „nicht Version 1" vertagt) |

**Priorisierung (Stand 2026-08-26):** M11, M13, M12, M16 und M19 sind abgeschlossen. Nächster noch offener Schritt laut Reihenfolge: **M14**. Reihenfolge für M14–M22 festgelegt (Claude-Entscheidung; Kriterien: Struktur vor Optik, unabhängige Punkte davor, ursprünglich auf „nicht Version 1" vertagte Punkte zuletzt – Begründung je Punkt siehe Liste unten):

1. **M14** – vereinfacht die Auswahl-Struktur, bevor M20 sie optisch neu einkleidet.
2. **M15** – eigenständige Graph-Verbesserung, kein Bezug zu den übrigen Punkten.
3. **M20** – große Baustelle (Feldbuch-Feeling); bewusst nach den kleineren Punkten, damit sie nicht zweimal angefasst werden.
4. **M18** – Drag & Drop zielt laut Backlog-Idee explizit auf „das Buch" – ergibt erst nach M20 Sinn.
5. **M17** – rein dekorative Dashboard-Verbesserung, keine Abhängigkeiten, aber auch kein dringender Bedarf.
6. **M21** – ursprünglich für „nicht Version 1" vertagt, größerer Aufwand (PDF-Bibliothek lokal einbinden).
7. **M22** – ursprünglich für „nicht Version 1" vertagt, betrifft nur den optionalen Lehrkraft-Vorführmodus.

Status-Legende: ⬜ offen · 🔶 in Arbeit · ✅ fertig

---

## Bekannte Lücken / offene Nachlieferungen

Nur echte offene Punkte bzw. Informationen mit Relevanz für künftige Milestones. Abgeschlossene Umsetzungsentscheidungen und Testprotokolle früherer Sessions wurden hier entfernt, sobald sie im Code/den Daten selbst (meist als `_meta`/`beschreibung`/`hinweis`-Feld, z. B. in `data/edges.json`, `data/indikatoren.json`, `data/stoerungen.json`, `scripts/pwa/sw.template.js`) oder in einem der anderen `docs/`-Dokumente nachlesbar sind. Bei Bedarf liefert `git log -- docs/Milestones_Waldsimulation_Klasse8.md` die volle Historie dieser Entscheidungen.

**Wirklich offen:**

- **Echter Geräte-Test steht aus:** PWA-Installation/Offline-Verhalten wurde nie auf einem echten iPad/Safari geprüft, nur strukturell über den Service-Worker-Cache-Mechanismus verifiziert – vor dem Unterrichtseinsatz nachholen.
- **Sprite-Assets ca. 51 MB unkomprimiert:** Die extern gelieferten Aquarell-Illustrationen sind deutlich größer als nötig. Falls sich der erste Service-Worker-Install auf langsamem WLAN als spürbar langsam erweist, ist eine verlustarme Verkleinerung/WebP-Konvertierung ein guter erster Ansatzpunkt.
- **Dokumentierte Abweichung vom Rang-1-Dokument, noch nicht nachgezogen:** Der Wildverbiss-Regler (Umsetzungsauftrag 2.10.2: 3 feste Stufen) wurde durch unabhängige Luchs-/Wolf-Schalter ersetzt, wodurch sich die Gesamtzahl vorab berechneter Kombinationen von 195 auf 261 erhöht hat (Details: `data/stoerungen.json` → `kombinatorik.kombinatorik_aenderung_hinweis`). Der Umsetzungsauftrag selbst wurde bewusst **nicht** angepasst (Rang-1-Quelldokument, laut eigenem Vermerk „nur nach expliziter Rücksprache zu ändern") – bei einem künftigen Abgleich gegen Abschnitt 6 (Akzeptanzkriterien 5 und 8) diese Abweichung berücksichtigen.
- **Drei Kräuter ohne Netzwerk-Graph-Kante:** Waldmeister, Heidelbeere und Brennnessel sind seit der Arten-Erweiterung simuliert (`scripts/simulation/model.py`), haben aber keine Kante in `data/edges.json` – ihre Kopplung existiert nur im Simulationscode, nicht im Graphen (relevant für M15).
- **Offene Lehrkraft-Abgleiche (eigene UI-/Modell-Annahmen ohne Quelldokument-Bezug, zusätzlich zur Tabelle oben):** Sprite-Zustands-Schwellenwerte pro Art (`js/dashboard.js`), Endzustandsbild-Schwellen 34/67 für `gesamtvitalitaet` (`js/forscherheft.js` → `endzustandBild()`), Luchs/Wolf-Reduktionsfaktoren (`scripts/simulation/model.py`, Herleitung siehe `docs/Wissensbasis_Erweiterung_weitere_Arten.md` Nachrecherche Punkt 6) – plausibel hergeleitet, aber nicht mit einer echten Lehrkraft geprüft.

**Relevant für künftige Milestones:**

- **M14 (Wald-Auswahl vereinfachen):** Störungsauswahl + Prädatoren-Schalter gelten aktuell bewusst gemeinsam für beide Wald-Plätze (ein Auswahlschritt, nicht zwei) – nötig für den Vergleichszweck (Umsetzungsauftrag Akzeptanzkriterium Abschnitt 6), bei der Neugestaltung beibehalten.
- **M15 (Netzwerk-Graph übersichtlicher):** Der Graph enthält 4 gestrichelt gerahmte „Sammelgruppen"-Pseudoknoten ohne Sprite/Steckbrief (`js/graph.js` → `GRUPPEN_KNOTEN`, für Kanten mit nur genereller Zielgruppe wie „Kraut"/„Kleinsäuger"). Beim geplanten Icon-Sidebar-Filter mitbedenken, wie diese Knoten dort dargestellt/gefiltert werden.
- **M20 (Feldbuch-Feeling):** Bleibt auf Nutzerentscheidung bewusst **ein** großer Milestone statt in mehrere kleinere aufgeteilt; Teilschritte beim Umsetzen weiterhin hier dokumentieren statt vorab in der Tabelle zu granularisieren.
- **Wiederkehrendes Bug-Muster für künftige Indikator-Erweiterungen:** In `model.py` wurden mehrfach Bestandsanteil (statisches Gewicht) und Vitalität (0–100-Gesundheitswert, startet bei 100 wenn die Art vorkommt) verwechselt (u. a. Fichte, Buschwindröschen, Blattläuse – Details in der Git-Historie dieser Datei). Bei neuen Indikatoren einen Baseline-Drift-Test (alle Waldtypen ohne Störung über 20 Jahre, kein Indikator darf ohne Ursache driften) einplanen.
