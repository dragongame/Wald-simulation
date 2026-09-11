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
| M25 | **Hypothese-vs-Ergebnis-Vergleich in der Reflexion**: Auf dem Reflexions-Screen (`js/forscherheft.js`), vor den Reflexionsfragen, zeigt eine neue "Vorhersage vs. Ergebnis"-Sektion (`index.html`, `#reflexion-vergleich`) je Wald die eingangs erfasste Hypothese (seit M4) neben dem tatsächlichen Endzustand (per neuer `zr20Fuer()`/`vergleichHtml()`-Helfer, reine Anzeige-Erweiterung, kein neues Datenmodell); per Playwright mit realistischen Wizard-Daten verifiziert | ✅ fertig (2026-09-11) | Backlog „Hypothese-vs-Ergebnis-Vergleich in der Reflexion" |
| M26 | **Mehr Leitfragen für die Reflexion**: zwei neue, allgemein einsetzbare Leitfragen zuerst in der Wissensbasis (Abschnitt 6, Punkt 5) ergänzt, dann wörtlich in `js/forscherheft.js` übernommen (jetzt 3 allgemeine + 1 Totholzentnahme-spezifische Frage statt vorher 1+1); eine der neuen Fragen knüpft bewusst an M25s Vorhersage-Vergleich an | ✅ fertig (2026-09-11) | Backlog „Mehr Leitfragen für die Reflexion" |
| M27 | **Lehrkraft-Übersicht als generierte Markdown-Datei statt In-App-Screen**: `scripts/simulation/build_lehrkraft_kombinationen.py` um eine Markdown-Ausgabe erweitert (`docs/Lehrkraft_Empfehlungen.md`), In-App-Screen entfernt (Post-it-Nav-Eintrag, `#screen-lehrkraft` in `index.html`, `js/lehrkraft.js` gelöscht, `js/app.js`/`js/navigation.js`/`css/styles.css` bereinigt, verwaistes `assets/icons/post-it_lehrkraft.webp` gelöscht), Precache-Manifest neu gebaut | ✅ fertig (2026-09-11) | Backlog „Lehrkraft-Übersicht (M19) als generierte Markdown-Datei statt In-App-Screen" |
| M28 | **Kritische Durchsicht der Top-Lehrkraft-Szenarien auf nicht-triviale Rückkopplungsschleifen**: Befund - alle bisherigen Top 20 zeigten ausschließlich denselben Pfad (Fichtenmonokultur-Kollaps via `gesamtvitalitaet`), weil `verjuengung_mischbaumarten` (laut `data/indikatoren.json` "zentraler Indikator für Szenario 6"/Wildverbiss) kein Dashboard-Indikator ist und damit für `kontrast_score` unsichtbar war - der Wildverbiss/Prädatoren-Effekt kam praktisch nie vor. Fix in `build_lehrkraft_kombinationen.py`: 3 der 20 Plätze sind jetzt für die kontrastreichsten Wildverbiss-Kombinationen reserviert (neues `hervorhebung`-Feld/"Besonders empfohlen, weil"-Zeile in `docs/Lehrkraft_Empfehlungen.md`), `kontrast_score` selbst bewusst unverändert gelassen | ✅ fertig (2026-09-11) | Backlog „Kritische Durchsicht: nachvollziehbare, aber nicht triviale Rückkopplungsschleifen in den Top-10-Szenarien" |

**Zweite Runde – die drei großen Backlog-Punkte (Stand 2026-09-11):** Nach der schnellen Runde M25–M28
wurden die drei verbliebenen großen Ideen („Vereinfachte Projektion für Schüler:innen", „Mehrjährige
Störungsdauer", „Feuer/Brandgefahr-Störung") gemeinsam mit dem Nutzer zugeschnitten. Sie sind bewusst
**keine** schnellen Durchgänge: jede wurde in mehrere Milestones aufgeteilt, bei denen jeweils ein
prüfbares Zwischenergebnis herauskommt. Drei Grundsatzentscheidungen wurden dabei vom Nutzer getroffen
(2026-09-11) und gelten für die Umsetzung als gesetzt:

| Entscheidung | Gewählt | Begründung |
|---|---|---|
| Feuer-Mechanik | **endogen ausgelöst**, kein Auswahl-Häkchen | Brand entsteht aus dem Lauf selbst, wenn `brandrisiko` eine Schwelle überschreitet – kostet keine zusätzlichen Kombinationen (bleibt bei 261 bzw. 357 statt 381) und zeigt Feuer als *Folge* einer Kaskade statt als vom Schüler gesetzte Ursache. Verworfen: Feuer als 6. wählbare Ereignis-Störung. |
| Trockenheits-Dauerstufen | **4 Jahre (Status quo) + 8 Jahre** | Die heutige Stufe bleibt Standard, dadurch bleiben alle 261 bestehenden Zeitreihen unverändert und es kommen nur 96 neue dazu (kleiner, prüfbarer Diff). Verworfen: 2+4 Jahre sowie ein allgemeines Dauer-Feld für alle Störungen (~900 Zeitreihen, zu viel UI für 45 Minuten). |
| Reduktionsgrad der vereinfachten Ansicht | **max. 6 Einzelkurven + Sammelkurven** | Harte, szenario-unabhängige Obergrenze – prüfbar und auf dem iPad sicher lesbar. Verworfen: 8–10 Kurven sowie eine rein schwellenwertbasierte Auswahl ohne Obergrenze. |

Empfohlene Reihenfolge über alle drei Gruppen: **M38 → M33 → M29/M30 → M35 → M40 → M39 → Rest**
(M38 ist ein Einzeiler und betrifft genau den Screen, den M30 umbaut; M33 ist billig und entschärft M34;
M29/M30 haben den größten Verständnis-Hebel; M35 ist reine Doku-Abwägung und blockiert nichts; M40 vor
M39, damit der Geräte-Test die endgültigen Ladezeiten misst). Feste Abhängigkeiten: M29 vor M30/M31/M32,
M33 vor M34, M35 (Go) vor M36 vor M37.

| # | Milestone | Status | Bezug |
|---|---|---|---|
| M29 | **Beitragsanalyse im Build-Schritt** (Fundament der vereinfachten Projektion, ohne sichtbare UI-Änderung): `scripts/simulation/build_simulationen.py` schreibt je Szenario einen zusätzlichen `projektion`-Block direkt in die bestehende Datei unter `data/generated/simulationen/` (kein zweiter Fetch zur Laufzeit) – pro Indikator die maximale Abweichung vom Jahr-0-Wert, daraus `wichtig: [ids]` + `gruppen: [{kategorie, mitglieder, kurve}]`; die Sammelkurven werden **build-seitig** gemittelt, damit im Browser weiterhin nichts gerechnet wird. Gruppierungsachse ist die bestehende `kategorie` aus `data/indikatoren.json`, nicht eine neue Handpflege. **Fertig, wenn:** alle 261 Dateien einen `projektion`-Block haben · eine Assertion im Build prüft „jeder Indikator genau einmal, `wichtig` **oder** in genau einer Gruppe" · Stichprobe Borkenkäfer+Fichtenmonokultur hat `fichte_vitalitaet`/`borkenkaefer_dichte`/`totholzmenge` in `wichtig` · **Gegenprobe zur Backlog-Leitplanke:** mindestens ein Szenario außerhalb der Lehrkraft-Top-20 hat einen Indikator als `wichtig`, der in allen Top-20 nie wichtig ist (belegt, dass die automatische Ableitung nicht einer Handkuratierung entspricht) | ⬜ offen | Backlog „Vereinfachte Projektion für Schüler:innen" |
| M30 | **Analyse-Screen nutzt die Projektion** (erste sichtbare Wirkung – dort ist die Kurvenflut am größten): Standardansicht zeigt die **max. 6** stärksten Einzelkurven plus Kategorie-Sammelkurven, optisch abgesetzt; die Auswahlmenge ist die **Vereinigung** der `wichtig`-Mengen beider Wälder (reine Mengen-Vereinigung im Browser, keine ökologische Rechnung), damit beide Panels dieselben Kurven zeigen; Umschalter auf die vollständige Indikatorenliste (`js/analyse.js`). **Fertig, wenn:** Playwright-Beleg (iPad + Desktop) für 3 benannte Szenarien · Kurvenzahl im Standard ≤ 6 Einzelkurven · Snapshots funktionieren in vereinfachter *und* vollständiger Ansicht | ⬜ offen | Backlog „Vereinfachte Projektion", Teil 1 (Analyse-Kurven) |
| M31 | **Dashboard-Kacheln nutzen die Projektion**: dieselbe Datenquelle wie M30 – die 20 „weitere Arten"-Kacheln (`js/dashboard.js`, `WEITERE_ARTEN`) klappen zu Kategorie-Kacheln zusammen, außer die Art steht im `wichtig`-Set des Szenarios. **Fertig, wenn:** Playwright-Beleg auf iPad, dass bei einem Borkenkäfer-Lauf die Borkenkäfer-Kaskadenarten einzeln stehen bleiben, unbeteiligte Arten dagegen als Kategorie-Kachel erscheinen | ⬜ offen | Backlog „Vereinfachte Projektion", Teil 2 (Dashboard-Kacheln) |
| M32 | **Netzwerk-Graph: Sammelknoten + expliziter Umschalter**: ersetzt die bisher **handgepflegte** Kontext-Teilmenge (`relevante_knoten` aus `data/stoerungen.json`, genutzt in `js/graph.js` → `relevanteKnotenFuerKontext()`) durch die in M29 generierte, szenario-genaue Menge; Sammelknoten als eigene Darstellung (Stapel-Karte mit Anzahl, antippbar zum Aufklappen); der bereits existierende `aktuellVollstaendig`-Umschalter (`js/graph.js:145/643/719`) wird zum bewussten „vereinfacht ↔ vollständig". **Fertig, wenn:** Kaskaden-Animation („Tinten-Spur") läuft in beiden Ansichten weiter · Playwright-Beleg iPad + Desktop · kein handgepflegtes `relevante_knoten` mehr im Anzeigepfad | ⬜ offen | Backlog „Vereinfachte Projektion", Teil 3 + „Umschalten zwischen vereinfachter und vollständiger Netzwerk-Ansicht" |
| M33 | **Störungs-Dauer als Datenfeld statt Konstante** (reines Refactoring, keine fachliche Änderung): `DAUER_TROCKENHEIT_JAHRE` und `DAUER_BORKENKAEFER_MAX_JAHRE` wandern aus `scripts/simulation/model.py` nach `data/stoerungen.json` (`dauer_jahre` je Störung in `ereignis_stoerungen[]`, `null` = ab Trigger dauerhaft, plus `dauer_jahre_hinweis` je Eintrag); `build_simulationen.py` liest sie ein (`dauer_je_typ`-Dict) und reicht sie als neuer Parameter an `simuliere()`/`Simulation.__init__` durch, `model.py` nutzt sie in `_ist_aktiv()` (jetzt generisch statt trockenheit-Spezialfall) und bei der Borkenkäfer-Wirtserschöpfung. **Fertig, wenn:** nach erneutem `python3 scripts/simulation/build_simulationen.py` **`git diff data/generated` leer** ist (Null-Diff-Nachweis) ✓ verifiziert | ✅ fertig (2026-09-11) | Backlog „Mehrjährige Störungsdauer" (Voraussetzung) + zahlt auf „Review der Lehrkraft-Annahmen" ein |
| M34 | **Wählbare Trockenheitsdauer (4 oder 8 Jahre)**: neue Auswahlachse nur für Trockenheit; 8 der 22 Ereigniszustände enthalten Trockenheit ⇒ **261 → 357 Zeitreihen** (~7,2 → ~9,8 MB, gegenüber 51 MB Sprites unkritisch). Umfasst: `kombinatorik` in `data/stoerungen.json` nachziehen, Dauer-Auswahl im Wizard (`js/startScreen.js`) nur sichtbar wenn Trockenheit gewählt, Auflösung in `js/simulationConfig.js`, **abwärtskompatibles Dateinamen-Schema** (Suffix nur für die Nicht-Standard-Stufe, damit bestehende Forscherheft-Einträge weiter auflösbar bleiben), `build_lehrkraft_kombinationen.py` + `build_precache_manifest.py` neu gebaut. **Fertig, wenn:** 357 Zeitreihen erzeugt und die Prüfsumme in `stoerungen.json` passt · ein bestehender Forscherheft-Eintrag aus der Zeit vor M34 lädt weiterhin fehlerfrei · **fachliches Kriterium:** die Fichtenmonokultur zeigt zwischen 4 und 8 Jahren einen deutlich größeren Endzustands-Unterschied (`gesamtvitalitaet`, Jahr 20) als der Mischwald | ⬜ offen | Backlog „Mehrjährige Störungsdauer" |
| M35 | **Wissensbasis-Erweiterung „Waldbrand" + didaktische Abwägung** (nur Dokument, kein Code – Muster wie `docs/Wissensbasis_Erweiterung_weitere_Arten.md`): Die Wissensbasis kennt bislang **kein** Brand-Szenario – Feuer kommt nur als Risiko-Eigenschaft in Szenario 5 und als Waldtyp-Merkmal vor; ohne diese Erweiterung wäre jede Brand-Modellierung erfundener ökologischer Inhalt (verboten laut CLAUDE.md/Rangfolge). Inhalt: belegte Mechanik (Zündursachen, Waldtyp-Abhängigkeit, Nachfolge-Sukzession), Tabelle „welcher **bestehende** Indikator reagiert wie" (`brandrisiko` und `res_feuer` existieren bereits), Entscheidung zur Lücke `"feuer": null` bei der Fichtenmonokultur (`data/waldtypen.json:69`) und explizit die **Zielkonflikt-Prüfung gegen Szenario 5**: die Wissensbasis sagt bewusst „Totholzentnahme senkt das Brandrisiko kaum" – eine Brand-Dynamik darf diese Botschaft nicht versehentlich umdrehen. **Fertig, wenn:** jede Aussage eine Quelle hat und das Dokument mit einer Go/No-Go-Empfehlung endet, über die der Nutzer entscheidet (M36/M37 starten erst nach Go) | ⬜ offen | Backlog „Überlegen, ob Brände auch simuliert werden sollten" |
| M36 | **Feuer im Modell + Build** (erst nach Go aus M35): Brand als **endogen ausgelöstes** Ereignis in `scripts/simulation/model.py` – kein Auswahl-Häkchen, sondern Auslösung, sobald `brandrisiko` im Lauf eine Schwelle überschreitet; Kombinatorik bleibt dadurch unverändert. **Fertig, wenn:** Kiefernwald + Trockenheit + Temperatur löst einen Brand aus, derselbe Konfigurationsfall im Mischwald nicht (bzw. deutlich schwächer) · nach einem Brand: Kronendach ↓↓, Totholz ↑, Birke/Brombeere über Sukzession ↑, Biodiversität kurzfristig ↓ dann ↑ · Baseline-Drift-Gegenprobe (alle Waldtypen ohne Störung, kein Indikator driftet ohne Ursache) · Zeitreihen + Lehrkraft-Empfehlungen neu gebaut | ⬜ offen | Backlog „Überlegen, ob Brände auch simuliert werden sollten" |
| M37 | **Feuer in der UI** (erst nach M36): Brand-Ereignismarker im Live-Dashboard mit Ursachenangabe („Jahr 7: Waldbrand – ausgelöst durch …", da das Ereignis nicht vom Schüler gewählt wurde und sonst unerklärt bliebe), Brand-Kaskadenpfad im Netzwerk-Graph, Lexikon-Eintrag, Sprite/Icon (neuer Bildbedarf → in `Fehlende_Grafiken_Laufend_...md` eintragen), `build_precache_manifest.py` neu gebaut. **Fertig, wenn:** Playwright-Beleg iPad + Desktop für einen Lauf mit und einen ohne Brand | ⬜ offen | Backlog „Überlegen, ob Brände auch simuliert werden sollten" |

**Dritte Gruppe – bisher nur als „offene Punkte" notierte Aufgaben (2026-09-11):** Die Punkte unter
„Bekannte Lücken / offene Nachlieferungen" waren teils echte, benannte Aufgaben ohne Milestone-Nummer und
damit ohne Status und ohne Abnahmekriterium. Die Punkte, bei denen es tatsächlich etwas zu *tun* gibt,
sind jetzt Milestones (M38–M43); die Lücken-Liste unten verweist nur noch darauf, statt es zu
wiederholen. Reine Befunde/Protokolle (z. B. der behobene Service-Worker-Bug, die M24-Farbpalette)
bleiben dort stehen, weil sie nichts Offenes mehr enthalten.

| # | Milestone | Status | Bezug |
|---|---|---|---|
| M38 | **Veralteten Regler-Vergleich in `js/analyse.js` korrigieren** (Nebenbefund vom 2026-09-11): `ermittleKaskadenrelevant()` prüfte `regler !== "niedrig"` (`js/analyse.js:72`), die Regler-Werte heißen seit der Umstellung auf den Wolf/Luchs-Schalter aber `beide/luchs/wolf/keine`. Dadurch wurden die Wildverbiss-Kurven im Analyse-Screen **immer** vorausgewählt und mit dem ★-Kaskaden-Badge als „Teil des tatsächlich abgelaufenen Kaskadenpfads" markiert – auch im Ausgangszustand `beide`, in dem die Regulation funktioniert und gar kein Wildverbiss-Effekt auftritt. `js/graph.js` macht denselben Vergleich an zwei Stellen korrekt (`!== "beide"`, `js/graph.js:228/275`). Fix: Vergleich auf `regler !== "beide"` umgestellt (analog zu `js/graph.js`), `scripts/pwa/build_precache_manifest.py` danach neu ausgeführt. **Fertig, wenn:** der Vergleich auf `"beide"` umgestellt ist und ein Lauf ohne Prädatoren-Abweichung im Analyse-Screen keine Wildverbiss-Kurve mehr vorauswählt (Playwright-Beleg) | ✅ fertig (2026-09-11) | Nebenbefund beim Zuschnitt von M29–M37 |
| M39 | **Echter Geräte-Test auf iPad/Safari**: PWA-Installation, Offline-Betrieb und Update-Verhalten wurden nie auf echter Hardware geprüft, nur strukturell über den Service-Worker-Cache-Mechanismus. Besonders zu prüfen ist das **wiederholte** Aufrufen nach einem Deploy – genau dort hätte der am 2026-09-11 behobene `cache.addAll()`-Bug zugeschlagen (siehe Lücken-Liste unten). **Fertig, wenn:** App auf einem echten iPad zum Home-Bildschirm hinzugefügt, im Flugmodus vollständig bedienbar (Start → Simulation → Analyse → Forscherheft → Lexikon), und nach einem neuen Deploy beim zweiten Start die neuen Inhalte zeigt · vor dem echten Unterrichtseinsatz zwingend | ⬜ offen | Lücken-Liste „Echter Geräte-Test steht aus" |
| M40 | **Sprite-Assets verkleinern**: die extern gelieferten Aquarell-Illustrationen liegen mit ca. 51 MB deutlich über dem Nötigen und bestimmen die Dauer des ersten Service-Worker-Installs auf langsamem Schul-WLAN. Verlustarme Verkleinerung/WebP-Konvertierung, danach `build_precache_manifest.py` neu. **Fertig, wenn:** Gesamtgröße unter `assets/sprites/` mindestens halbiert ist · Stichprobenvergleich alt/neu auf dem iPad zeigt keinen sichtbaren Qualitätsverlust (Playwright-Screenshots) · sinnvollerweise **vor** M39, damit der Geräte-Test die endgültigen Ladezeiten misst | ⬜ offen | Lücken-Liste „Sprite-Assets ca. 51 MB unkomprimiert" |
| M41 | **Hartkodierte Lehrkraft-Annahmen in Konfigurationsdateien verschieben** (Fortsetzung von M33, das dasselbe für die Dauer-Konstanten tut): Sprite-Zustands-Schwellenwerte (`js/dashboard.js`), Endzustandsbild-Schwellen 34/67 (`js/forscherheft.js` → `endzustandBild()`), Luchs-/Wolf-Reduktionsfaktoren (`scripts/simulation/model.py`). Reines Refactoring – die Werte selbst ändern sich nicht, nur ihr Ort, damit eine Lehrkraft sie nach Rücksprache ohne Code-Änderung anpassen kann. **Fertig, wenn:** kein Wert aus dieser Liste mehr in JS/Python steht · Null-Diff-Nachweis wie in M33 (`git diff data/generated` leer nach erneutem Build) · die Lücken-Liste unten nennt danach nur noch die *fachliche* Abgleich-Frage, nicht mehr den Fundort im Code | ⬜ offen | Lücken-Liste „Offene Lehrkraft-Abgleiche" + Backlog „Review der Lehrkraft-Annahmen" |
| M42 | **Abweichung vom Rang-1-Dokument nachziehen** (nur nach expliziter Rücksprache mit dem Nutzer): Der Umsetzungsauftrag nennt in Abschnitt 6 (Akzeptanzkriterien 5 und 8) noch **195** Kombinationen und einen 3-Stufen-Wildverbiss-Regler; tatsächlich sind es seit dem Wolf/Luchs-Schalter **261**, nach M34 **357**. Das Rang-1-Dokument wurde bewusst nicht angepasst („nur nach expliziter Rücksprache zu ändern"), die Abweichung ist nur in `data/stoerungen.json` → `kombinatorik_aenderung_hinweis` dokumentiert. **Wird mit M34 dringlicher**, weil die Zahl dann ein zweites Mal auseinanderläuft. **Fertig, wenn:** entweder der Umsetzungsauftrag nach Freigabe nachgezogen ist oder die Abweichung dort ausdrücklich als bewusst und dauerhaft vermerkt wurde | ⬜ offen | Lücken-Liste „Dokumentierte Abweichung vom Rang-1-Dokument" |
| M43 | **Hintergrundbilder für Dashboard, Analyse-Screen und Netzwerk-Graph** (M20-Nachfolge, vom Nutzer für einen späteren Schritt gewünscht): Umsetzung nach demselben Muster wie M20 – Bild zuschneiden/komprimieren, in `assets/misc/` einbinden, über `--feldbuch-hintergrund` auf die jeweilige `.screen`-Sektion anwenden. Die drei vorgeschlagenen, noch nicht beauftragten Bildkonzepte stehen weiterhin unten in der Lücken-Liste. **Fertig, wenn:** Bilder vorhanden und eingebunden · Lesbarkeit der Kurven/Instrumente/Knoten auf iPad und Desktop per Playwright gegengeprüft (Kontrast darf nicht leiden) · `build_precache_manifest.py` neu gebaut | ⬜ offen | Lücken-Liste „M20-Nachfolge – Hintergrundbilder" |

Status-Legende: ⬜ offen · 🔶 in Arbeit · ✅ fertig

---

## Bekannte Lücken / offene Nachlieferungen

Nur echte offene Punkte bzw. Informationen mit Relevanz für künftige Milestones. Abgeschlossene Umsetzungsentscheidungen und Testprotokolle früherer Sessions wurden hier entfernt, sobald sie im Code/den Daten selbst (meist als `_meta`/`beschreibung`/`hinweis`-Feld, z. B. in `data/edges.json`, `data/indikatoren.json`, `data/stoerungen.json`, `scripts/pwa/sw.template.js`) oder in einem der anderen `docs/`-Dokumente nachlesbar sind. Bei Bedarf liefert `git log -- docs/Milestones_Waldsimulation_Klasse8.md` die volle Historie dieser Entscheidungen.

**Wirklich offen:** Die Punkte mit konkretem Arbeitsauftrag sind seit 2026-09-11 Milestones (M38–M43,
siehe Tabelle oben) und stehen hier nur noch als Verweis; ausführlich bleiben nur die Befunde, aus denen
sich keine eigene Aufgabe mehr ergibt.

- **Echter Geräte-Test steht aus** (→ **M39**): PWA-Installation/Offline-Verhalten wurde nie auf einem echten iPad/Safari geprüft, nur strukturell über den Service-Worker-Cache-Mechanismus verifiziert – vor dem Unterrichtseinsatz nachholen.
- **Service-Worker-Bug gefunden und behoben (2026-09-11, beim Browser-Test von M27 entdeckt):** `scripts/pwa/sw.template.js` nutzte bislang `cache.addAll(manifest.files)` beim Install-Event - dessen interne `fetch()`-Aufrufe respektieren den normalen HTTP-Cache des Browsers, wodurch ein neuer Cache-Name (Hash-Wechsel) **nicht garantiert** frische Bytes bekam: ein noch "frischer" HTTP-Cache-Eintrag einer Datei (z. B. `index.html`) aus einem früheren Besuch konnte unverändert in den neuen Cache-Bucket übernommen werden. Reproduziert beim Playwright-Test von M27 (ein alter "Lehrkräfte"-Tab blieb trotz neuem Cache-Namen sichtbar). Fix: neue `precacheAlle()`-Funktion lädt jede Manifest-Datei einzeln mit `{cache: "reload"}` (erzwingt echten Netzwerk-Request) und schreibt sie manuell per `cache.put()` - Standard-Fix für dieses bekannte `Cache.addAll()`-Verhalten. Relevant für den noch ausstehenden echten Geräte-Test oben: dieser Bug hätte auf einem wiederholt besuchten iPad zu genau der Art "zeigt trotz Update noch alte Inhalte"-Problem führen können, die dort geprüft werden soll.
- **Veralteter Regler-Vergleich in `js/analyse.js`** (gefunden 2026-09-11 beim Zuschnitt von M29–M37) → **M38**.
- **Sprite-Assets ca. 51 MB unkomprimiert** (→ **M40**): Die extern gelieferten Aquarell-Illustrationen sind deutlich größer als nötig; der erste Service-Worker-Install auf langsamem WLAN ist der spürbare Effekt.
- **Dokumentierte Abweichung vom Rang-1-Dokument, noch nicht nachgezogen** (→ **M42**): Der Wildverbiss-Regler (Umsetzungsauftrag 2.10.2: 3 feste Stufen) wurde durch unabhängige Luchs-/Wolf-Schalter ersetzt, wodurch sich die Gesamtzahl vorab berechneter Kombinationen von 195 auf 261 erhöht hat (Details: `data/stoerungen.json` → `kombinatorik.kombinatorik_aenderung_hinweis`). Der Umsetzungsauftrag selbst wurde bewusst **nicht** angepasst (Rang-1-Quelldokument, laut eigenem Vermerk „nur nach expliziter Rücksprache zu ändern") – bei einem künftigen Abgleich gegen Abschnitt 6 (Akzeptanzkriterien 5 und 8) diese Abweichung berücksichtigen.
- **Offene Lehrkraft-Abgleiche (eigene UI-/Modell-Annahmen ohne Quelldokument-Bezug, zusätzlich zur Tabelle oben):** Sprite-Zustands-Schwellenwerte pro Art (`js/dashboard.js`), Endzustandsbild-Schwellen 34/67 für `gesamtvitalitaet` (`js/forscherheft.js` → `endzustandBild()`), Luchs/Wolf-Reduktionsfaktoren (`scripts/simulation/model.py`, Herleitung siehe `docs/Wissensbasis_Erweiterung_weitere_Arten.md` Nachrecherche Punkt 6) – plausibel hergeleitet, aber nicht mit einer echten Lehrkraft geprüft. Der *Fundort* dieser Werte wird durch **M33/M41** in Konfigurationsdateien verschoben; die fachliche Abgleich-Frage selbst bleibt davon unberührt offen.
- **M24-Farbpalette überarbeitet (2026-09-10):** Erstprüfung im Analyse-Screen (Borkenkäfer-Kaskade, Playwright) fand zwei grenzwertig ähnliche Farbpaare, weil 6 Kategorien im selben schmalen Braun/Orange-Tonband lagen (Details siehe Git-Historie dieser Datei). Da eine punktuelle Hex-Korrektur mit `brandrisiko` kollidiert wäre, stattdessen alle 16 `INDIKATOR_STIL`-Grundfarben in `js/chart.js` per OKLCH neu über den Farbkreis verteilt und mit dem "dataviz"-Skill-Validator (`validate_palette.js`: Helligkeitsband, Chroma-Untergrenze, CVD-Abstand Protan/Deutan/Tritan, Kontrast gg. `#EFE9DC`) gegengeprüft – alle 16 bestehen jetzt Helligkeitsband + Chroma-Untergrenze (vorher 11 von 16 unter der Chroma-Untergrenze), schlechtester Nachbar-Abstand ΔE 4,5 statt vorher 0,3. Ein durchgängiges ΔE ≥ 8 über alle 16 gleichzeitig wählbaren Kategorien ist rechnerisch nicht erreichbar (Skill-Doku nennt das schon bei 8 Kategorien als Grenze) – abgefangen durch die ohnehin verbindliche zweite Kennung Linienmuster + Textlabel (Styleguide 5.5). Erneut per Playwright im Analyse-Screen gegengeprüft (u. a. dieselbe Borkenkäfer-Kaskade plus weitere Kategorien), Screenshot unter `.claude/screenshots/m24b-new-palette-desktop.png`. `scripts/pwa/build_precache_manifest.py` danach neu ausgeführt.
- **M24-Untergruppe Prädatoren:** Vögel-Familie (Buntspecht, Habicht, Sperber) vs. Boden-/Rinden-Familie (Ameisenbuntkäfer, Fuchs) wurde gegen die Wissensbasis (Nr. 23–26) hergeleitet, aber nicht mit einer echten Lehrkraft geprüft, ob diese Zweiteilung didaktisch die sinnvollste ist.

**Relevant für künftige Milestones:**

- **M20-Nachfolge – Hintergrundbilder für Dashboard/Analyse/Netzwerk-Graph** (→ **M43**): bewusst nicht Teil von M20 (Backlog: „Bei der Simulation muss das nicht sein, bei der Auswertung auch nicht"), aber vom Nutzer für einen späteren Schritt gewünscht. Vorgeschlagene, noch nicht beauftragte Bildkonzepte (passend zum Feldbuch/Naturjournal-Stil, Styleguide Abschnitt 1) für passende Illustrationen analog zu `docs/eingang/Hintergrund.png`:
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
