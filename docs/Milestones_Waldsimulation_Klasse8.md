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

**Alle bisherigen Milestones (M0–M24, ohne M17/M18/M21/M22 – siehe unten) sind abgeschlossen.** Am
2026-09-11 auf Nutzer-Wunsch geleert, um Platz für eine neue Runde Milestones aus dem Ideen-Backlog zu
schaffen (siehe `Ideen_Backlog_Waldsimulation_Klasse8.md` für die Kandidaten und die anstehende
Impact-Priorisierung). Volle Beschreibungen der abgeschlossenen Milestones stehen weiterhin per
`git log -- docs/Milestones_Waldsimulation_Klasse8.md` zur Verfügung; unten nur die Kurzübersicht.

<details>
<summary>Archiv: abgeschlossene Milestones M0–M24 (Kurzübersicht, Details per Git-Historie)</summary>

| # | Milestone | Datum |
|---|---|---|
| M0 | Content-Fundament (Sprites, Styleguide, Prompt-Dateien) | 2026-08-25 |
| M1 | Datenmodell (nodes/edges/waldtypen/stoerungen) | 2026-08-25 |
| M2 | Build-Time-Simulationsmodul | 2026-08-25 |
| M3 | PWA-Grundgerüst | 2026-08-26 |
| M4 | Start & Auswahl | 2026-08-26 |
| M5 | Live-Dashboard | 2026-08-26 |
| M6 | Analyse-Screen | 2026-08-26 |
| M7 | Forscherheft | 2026-08-26 |
| M8 | Netzwerk-Graph & Rachel Carson | 2026-08-26 |
| M9 | Arten-Lexikon | 2026-08-26 |
| M10 | Asset-Feinschliff | 2026-08-26 |
| M11 | Test & Deployment | 2026-08-26 |
| M12 | Dashboard-Kacheln für 20 neue Arten-Indikatoren | 2026-08-26 |
| M13 | Reihenfolge-Abfrage nur bei echtem Zeitversatz | 2026-08-26 |
| M14 | Einfachere Wald-Auswahl | 2026-08-26 |
| M15 | Netzwerk-Graph übersichtlicher | 2026-08-26 |
| M16 | Graphen-Snapshots im Forscherheft anzeigen | 2026-08-26 |
| M19 | Lehrkraft-Liste interessantester 2er-Kombinationen | 2026-08-26 |
| M20 | Feldbuch-Feeling | 2026-08-27 |
| M23 | Start-Bildschirm-Redesign „Erstkontakt" | 2026-08-28 |
| M24 | Kurven-Darstellung verbessert | 2026-08-28 |

**Nie umgesetzt/vergeben:** M17 (Instrumente als Tacho/Radialdiagramm) wurde am 2026-09-11 zurück in
den Ideen-Backlog verschoben. M18 (Drag & Drop), M21 (PDF-Export Forscherheft) und M22 (Vorführ-Modus
für Lehrkraft) wurden bereits am 2026-08-28 vom Nutzer selbst aus der Tabelle entfernt (M18 durch die
Tippen-statt-Ziehen-Entscheidung in M23 überholt; M21/M22 ohne dokumentierten Einzelgrund gestrichen) –
absichtliche frühere Entscheidungen, hier nicht erneut aufgegriffen.

</details>

**Neue Runde (Stand 2026-09-11):** Ideen-Backlog nach Impact/UX-Nutzen für Schüler:innen und Lehrkraft
durchgesehen; die folgenden vier Punkte hatten das beste Verhältnis aus Nutzen und Aufwand und wurden
direkt zu Milestones gemacht (weitere, größere Kandidaten wie „Vereinfachte Projektion für
Schüler:innen" bleiben bewusst im Ideen-Backlog, da sie eine eigene Scoping-Runde brauchen).

| # | Milestone | Status | Bezug |
|---|---|---|---|
| M25 | **Hypothese-vs-Ergebnis-Vergleich in der Reflexion**: Auf dem Reflexions-Screen (`js/forscherheft.js`), vor den Reflexionsfragen, je Wald die eingangs erfasste Hypothese (seit M4) dem tatsächlichen Endzustand/der größten Abweichung (seit M7 im Forscherheft-Eintrag vorhanden) gegenüberstellen – reine Anzeige-Erweiterung, kein neues Datenmodell nötig | ⬜ offen | Backlog „Hypothese-vs-Ergebnis-Vergleich in der Reflexion" |
| M26 | **Mehr Leitfragen für die Reflexion**: zusätzliche Reflexions-Leitfragen ergänzen – zuerst neue Kandidatenfragen in der Wissensbasis (Abschnitt 6, Punkt 5, neben den zwei bestehenden) ergänzen (konsistent mit der bisherigen Quelle-vor-Code-Regel), danach wörtlich in `js/forscherheft.js` übernehmen | ⬜ offen | Backlog „Mehr Leitfragen für die Reflexion" |
| M27 | **Lehrkraft-Übersicht als generierte Markdown-Datei statt In-App-Screen**: `scripts/simulation/build_lehrkraft_kombinationen.py` um eine Markdown-Ausgabe erweitern (z. B. `docs/Lehrkraft_Empfehlungen.md`), In-App-Screen entfernen (Post-it-Nav-Eintrag, `#screen-lehrkraft` in `index.html`, `js/lehrkraft.js`), Precache-Manifest neu bauen | ⬜ offen | Backlog „Lehrkraft-Übersicht (M19) als generierte Markdown-Datei statt In-App-Screen" |
| M28 | **Kritische Durchsicht der Top-Lehrkraft-Szenarien auf nicht-triviale Rückkopplungsschleifen**: die von `build_lehrkraft_kombinationen.py` aktuell empfohlenen Szenarien fachlich gegen die Wissensbasis-Kaskadenlogik prüfen, ob sie für Klasse 8 nachvollziehbare, aber nicht sofort offensichtliche Rückkopplungsschleifen zeigen; bei Bedarf Auswahlkriterium ergänzen statt nur nach Kontraststärke zu sortieren | ⬜ offen | Backlog „Kritische Durchsicht: nachvollziehbare, aber nicht triviale Rückkopplungsschleifen in den Top-10-Szenarien" |

Status-Legende: ⬜ offen · 🔶 in Arbeit · ✅ fertig

---

## Bekannte Lücken / offene Nachlieferungen

Nur echte offene Punkte bzw. Informationen mit Relevanz für künftige Milestones. Abgeschlossene Umsetzungsentscheidungen und Testprotokolle früherer Sessions wurden hier entfernt, sobald sie im Code/den Daten selbst (meist als `_meta`/`beschreibung`/`hinweis`-Feld, z. B. in `data/edges.json`, `data/indikatoren.json`, `data/stoerungen.json`, `scripts/pwa/sw.template.js`) oder in einem der anderen `docs/`-Dokumente nachlesbar sind. Bei Bedarf liefert `git log -- docs/Milestones_Waldsimulation_Klasse8.md` die volle Historie dieser Entscheidungen.

**Wirklich offen:**

- **Echter Geräte-Test steht aus:** PWA-Installation/Offline-Verhalten wurde nie auf einem echten iPad/Safari geprüft, nur strukturell über den Service-Worker-Cache-Mechanismus verifiziert – vor dem Unterrichtseinsatz nachholen.
- **Sprite-Assets ca. 51 MB unkomprimiert:** Die extern gelieferten Aquarell-Illustrationen sind deutlich größer als nötig. Falls sich der erste Service-Worker-Install auf langsamem WLAN als spürbar langsam erweist, ist eine verlustarme Verkleinerung/WebP-Konvertierung ein guter erster Ansatzpunkt.
- **Dokumentierte Abweichung vom Rang-1-Dokument, noch nicht nachgezogen:** Der Wildverbiss-Regler (Umsetzungsauftrag 2.10.2: 3 feste Stufen) wurde durch unabhängige Luchs-/Wolf-Schalter ersetzt, wodurch sich die Gesamtzahl vorab berechneter Kombinationen von 195 auf 261 erhöht hat (Details: `data/stoerungen.json` → `kombinatorik.kombinatorik_aenderung_hinweis`). Der Umsetzungsauftrag selbst wurde bewusst **nicht** angepasst (Rang-1-Quelldokument, laut eigenem Vermerk „nur nach expliziter Rücksprache zu ändern") – bei einem künftigen Abgleich gegen Abschnitt 6 (Akzeptanzkriterien 5 und 8) diese Abweichung berücksichtigen.
- **Offene Lehrkraft-Abgleiche (eigene UI-/Modell-Annahmen ohne Quelldokument-Bezug, zusätzlich zur Tabelle oben):** Sprite-Zustands-Schwellenwerte pro Art (`js/dashboard.js`), Endzustandsbild-Schwellen 34/67 für `gesamtvitalitaet` (`js/forscherheft.js` → `endzustandBild()`), Luchs/Wolf-Reduktionsfaktoren (`scripts/simulation/model.py`, Herleitung siehe `docs/Wissensbasis_Erweiterung_weitere_Arten.md` Nachrecherche Punkt 6) – plausibel hergeleitet, aber nicht mit einer echten Lehrkraft geprüft.
- **M24-Farbpalette überarbeitet (2026-09-10):** Erstprüfung im Analyse-Screen (Borkenkäfer-Kaskade, Playwright) fand zwei grenzwertig ähnliche Farbpaare, weil 6 Kategorien im selben schmalen Braun/Orange-Tonband lagen (Details siehe Git-Historie dieser Datei). Da eine punktuelle Hex-Korrektur mit `brandrisiko` kollidiert wäre, stattdessen alle 16 `INDIKATOR_STIL`-Grundfarben in `js/chart.js` per OKLCH neu über den Farbkreis verteilt und mit dem "dataviz"-Skill-Validator (`validate_palette.js`: Helligkeitsband, Chroma-Untergrenze, CVD-Abstand Protan/Deutan/Tritan, Kontrast gg. `#EFE9DC`) gegengeprüft – alle 16 bestehen jetzt Helligkeitsband + Chroma-Untergrenze (vorher 11 von 16 unter der Chroma-Untergrenze), schlechtester Nachbar-Abstand ΔE 4,5 statt vorher 0,3. Ein durchgängiges ΔE ≥ 8 über alle 16 gleichzeitig wählbaren Kategorien ist rechnerisch nicht erreichbar (Skill-Doku nennt das schon bei 8 Kategorien als Grenze) – abgefangen durch die ohnehin verbindliche zweite Kennung Linienmuster + Textlabel (Styleguide 5.5). Erneut per Playwright im Analyse-Screen gegengeprüft (u. a. dieselbe Borkenkäfer-Kaskade plus weitere Kategorien), Screenshot unter `.claude/screenshots/m24b-new-palette-desktop.png`. `scripts/pwa/build_precache_manifest.py` danach neu ausgeführt.
- **M24-Untergruppe Prädatoren:** Vögel-Familie (Buntspecht, Habicht, Sperber) vs. Boden-/Rinden-Familie (Ameisenbuntkäfer, Fuchs) wurde gegen die Wissensbasis (Nr. 23–26) hergeleitet, aber nicht mit einer echten Lehrkraft geprüft, ob diese Zweiteilung didaktisch die sinnvollste ist.

**Relevant für künftige Milestones:**

- **M20-Nachfolge – Hintergrundbilder für Dashboard/Analyse/Netzwerk-Graph:** bewusst nicht Teil von M20 (Backlog: „Bei der Simulation muss das nicht sein, bei der Auswertung auch nicht"), aber vom Nutzer für einen späteren Schritt gewünscht. Vorgeschlagene, noch nicht beauftragte Bildkonzepte (passend zum Feldbuch/Naturjournal-Stil, Styleguide Abschnitt 1) für passende Illustrationen analog zu `docs/eingang/Hintergrund.png`:
  - *Netzwerk-Graph:* Detektiv-Pinnwand mit Fäden (knüpft an die bestehende „Tinten-Spur"-Kaskadenanimation an, Styleguide Abschnitt 5) oder ein Naturforscher-Steckbrett mit angehefteten, gepressten Blättern am Rand.
  - *Live-Dashboard:* Feldausrüstungs-Tablett/Auskleidung am Rand (knüpft an die „Feldmessinstrumente"-Optik an, Styleguide Abschnitt 6) oder eine blasse Messprotokoll-Rasterseite.
  - *Analyse-Screen:* Klemmbrett-Motiv mit Konturlinien-Papier am Rand, oder eine Herbarium-Montage-Optik für die zwei Wald-Panels nebeneinander.
  - Umsetzung folgt dem gleichen Muster wie M20: Bild zuschneiden/komprimieren, in `assets/misc/` einbinden, über `--feldbuch-hintergrund` auf die jeweilige `.screen`-Sektion anwenden (siehe `css/styles.css`, Abschnitt „Feldbuch-Seite").
- **M23-Umsetzungsnotiz:** Der Design-Canvas-Prozess hat für den Start-Bildschirm bewusst gegen Drag & Drop
  entschieden („Schritt 1 · antippen, nicht ziehen") zugunsten von Antippen mit Washi-Tape-Etikett als
  Auswahl-Rückmeldung – relevant, falls M18 (Drag & Drop) je wieder aufgegriffen wird: die aktuelle
  Start-Bildschirm-Optik (Feldkarten-Wizard) ist nicht für Drag & Drop ausgelegt.
- **M20-Umsetzungsnotiz:** Die Post-it-Navigation wurde nach Prüfung der tatsächlichen Grafik (`docs/eingang/Bockmarks-3.png` zeigt seitlich ansetzende Register, keine von oben hängenden Lesezeichen) als **senkrechte Leiste am rechten Bildschirmrand** umgesetzt statt der ursprünglich angedachten waagerechten Leiste oben – Nutzer-Entscheidung während der Umsetzung.
- **M20-Nachbesserung (2026-08-29): Zwei Rendering-Bugs beim Vollbild-/Geräte-Check gefunden und behoben:**
  1. `#screen-start.wizard-screen` hatte `display:flex; position:fixed; inset:0` ohne `:not([hidden])`-Einschränkung – die ID-Selektor-Regel gewann gegen die `[hidden]`-Browser-Vorgabe, wodurch der Wizard nach dem Verlassen (z. B. per Post-it-Klick) weiterhin vollflächig über jedem anderen Screen lag, obwohl `js/ui.js` `hidden` korrekt setzte. Fix: Selektor um `:not([hidden])` ergänzt (`css/styles.css`).
  2. `.feldbuch-nav` hing per `right: 0.75rem` rein am Viewport-Rand, unabhängig von der tatsächlichen (zentrierten, max-width-begrenzten) Buchseite – auf breiten Desktop-Viewports (getestet 1440px/1920px) entstand dadurch eine große, viewport-breitenabhängige Lücke statt der beabsichtigten anklebenden Register-Optik. Fix: `js/navigation.js` misst jetzt bei jedem Screen-Wechsel und Resize die rechte Kante des aktiven Inhalts (`.wizard-buch` beim Start-Wizard, sonst der Screen selbst) und setzt `.feldbuch-nav`'s `left` dynamisch darauf.
  Geprüft auf iPad Pro 11 (Hoch-/Querformat), 1440×900 und 1920×1080 – Wizard-Screen bleibt in allen vier Fällen ohne Scroll (`scrollHeight === innerHeight`), Register-Leiste klebt in allen Screens (Wizard, Dashboard, Analyse, Forscherheft, Netzwerk-Sperre, Lehrkräfte, Lexikon) an der Buchkante. `scripts/pwa/build_precache_manifest.py` danach neu ausgeführt.
- **Wiederkehrendes Bug-Muster für künftige Indikator-Erweiterungen:** In `model.py` wurden mehrfach Bestandsanteil (statisches Gewicht) und Vitalität (0–100-Gesundheitswert, startet bei 100 wenn die Art vorkommt) verwechselt (u. a. Fichte, Buschwindröschen, Blattläuse – Details in der Git-Historie dieser Datei). Bei neuen Indikatoren einen Baseline-Drift-Test (alle Waldtypen ohne Störung über 20 Jahre, kein Indikator darf ohne Ursache driften) einplanen.
