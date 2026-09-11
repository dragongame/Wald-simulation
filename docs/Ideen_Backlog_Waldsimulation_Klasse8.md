# Ideen & Verbesserungswünsche (Backlog für spätere Versionen)

**Zweck:** Sammelstelle für Ideen, Verbesserungswünsche und Kritik, die *nicht* in die aktuelle Umsetzung (Meilensteine M0–M11, siehe `Milestones_Waldsimulation_Klasse8.md`) einfließen, sondern für eine spätere Version vorgemerkt werden. Frei befüllbar, keine feste Struktur nötig – einfach unten ergänzen.

**Verhältnis zu den anderen Dokumenten:** Ändert nichts an den in `Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` getroffenen Entscheidungen für Version 1. Ein Eintrag hier ist ein Vorschlag, keine Freigabe – wird erst nach Rücksprache umgesetzt.

**Format-Vorschlag je Eintrag:** kurzer Titel, 1–2 Sätze Kontext/Warum, Datum. Muss nicht eingehalten werden.

**Hinweis (2026-08-26):** Alle bisherigen Einträge wurden zu Milestones M12–M22 gemacht (siehe Milestones-Dokument, Abschnitt „Bekannte Lücken") – Ausnahme ist der folgende Punkt, der bewusst noch keine Milestone-Nummer bekommen hat.

**Hinweis (2026-08-28):** Der Eintrag „Kurven-Darstellung verbessern – Analyse-Screen und Forscherheft-Snapshots" wurde zu Milestone **M24** gemacht (siehe Milestones-Dokument).

**Hinweis (2026-09-11):** Nach einer Impact/UX-Priorisierung wurden vier Einträge zu Milestones **M25–M28** gemacht (siehe Milestones-Dokument): „Hypothese-vs-Ergebnis-Vergleich in der Reflexion", „Mehr Leitfragen für die Reflexion", „Lehrkraft-Übersicht (M19) als generierte Markdown-Datei statt In-App-Screen" und „Kritische Durchsicht: nachvollziehbare, aber nicht triviale Rückkopplungsschleifen in den Top-10-Szenarien". Die übrigen Einträge bleiben bewusst hier stehen, da sie größer sind und eine eigene Scoping-Runde brauchen.

**Hinweis (2026-09-11, zweite Runde):** Die drei großen verbliebenen Punkte wurden gemeinsam mit dem Nutzer zugeschnitten und zu den Milestones **M29–M37** gemacht (siehe Milestones-Dokument, inkl. der drei dort protokollierten Grundsatzentscheidungen zu Feuer-Mechanik, Trockenheits-Dauerstufen und Reduktionsgrad):
- „Vereinfachte Projektion für Schüler:innen" + „Umschalten zwischen vereinfachter und vollständiger Netzwerk-Ansicht" → **M29–M32**
- „Mehrjährige Störungsdauer" → **M33–M34**
- „Überlegen, ob Brände auch simuliert werden sollten" → **M35–M37** (M35 ist reine Doku-Abwägung und endet mit einer Go/No-Go-Entscheidung; M36/M37 starten erst danach)

Die Beschreibungen bleiben unten als Herkunftsnachweis stehen.

---

## Offene Diskussion (noch kein Milestone)

### Überlegen, ob Brände auch simuliert werden sollten, also ein Ereignis von Trockenheit/Brandgefahr

- Das muss aber noch diskutiert und abgewogen werden.
- Neue Störungsart mit eigener fachlicher/didaktischer Abwägung (kein kleiner Fix wie z. B. eine reine UI-Änderung) – erst nach Rücksprache in einen Milestone überführen.
- **Erledigt durch M35–M37 (2026-09-11):** genau diese Abwägung ist jetzt als eigener, reiner Doku-Milestone M35 vorgeschaltet; entschieden wurde außerdem, den Brand **endogen** (aus dem Lauf heraus, wenn `brandrisiko` eine Schwelle überschreitet) statt als sechste wählbare Störung zu modellieren.

### Vereinfachte Projektion für Schüler:innen – Komplexität wächst schneller als die Verständlichkeit (2026-08-28)

- **Ausgangslage:** Die Simulation selbst (32 Knoten, volle Kaskadenlogik) bleibt unangetastet – Vorschlag betrifft nur eine zusätzliche, reduzierte Darstellung obendrauf, für die Zielgruppe (Klasse 8, 45 Minuten). Betrifft **Analyse-Screen (M6), Live-Dashboard (M5) und Netzwerk-Graph (M8/M15)** – explizit **nicht** das Arten-Lexikon (M9), das bewusst vollständig/als Nachschlagewerk bleiben soll.
- **Besonders dringend beim Graphen:** zu viele Knoten gleichzeitig lassen den Graphen schnell unübersichtlich werden – unerwartete Rückkopplungsschleifen (gerade die didaktisch wichtigsten!) gehen darin leicht unter, statt hervorzustechen.
- **Kerngedanke:** Knoten mit geringem/ähnlichem Beitrag zu einem Szenario zu einem Sammelknoten zusammenfassen (z. B. mehrere Kleinpflanzen ohne nennenswerten Einzeleinfluss).
- **Wichtige Leitplanke für die Umsetzung:** Die Gruppierung darf nicht von Hand anhand der Top-20-Szenarien (siehe M19) festgelegt werden – ein Knoten, der in diesen 20 Kombinationen unauffällig ist, kann in einer der übrigen ~175 Kombinationen der eigentliche Kaskadentreiber sein, und eine fest verdrahtete Gruppierung würde das verschleiern. Ebenso würde eine Brand-Störung (siehe Eintrag oben) oder jede künftige Erweiterung eine von Hand gepflegte Gruppierung veralten lassen. Stattdessen: Beitrag/Gruppierung **je generiertem Szenario automatisch im Build-Schritt** ableiten (z. B. über Stärke/Varianz der Abweichung vom Ausgangszustand), als zusätzlicher Output neben `model.py`/`build_simulationen.py` – dann ist die Projektion immer für das gezeigte Szenario gültig und bleibt nach jedem `build_simulationen.py`-Lauf automatisch korrekt, genau wie der Rest der Pipeline.
- **Umfang:** Sollte in mehrere Milestones aufgeteilt werden (Analyse-Kurven, Dashboard-Kacheln, Graph-Knoten haben unterschiedliche Anforderungen an die Darstellung von Sammelknoten) statt als ein großer Schritt. Kandidat für den ersten Teil-Milestone: Analyse-Screen-Kurven, da dort die Kurvenflut aktuell am größten ist.
- Noch keine Milestone-Nummer – braucht erst weitere Diskussion (u. a. wie Sammelknoten im Graphen visuell dargestellt werden).
- **Erledigt durch M29–M32 (2026-09-11):** aufgeteilt in Build-Fundament (M29), Analyse-Kurven (M30), Dashboard-Kacheln (M31) und Graph (M32). Die Leitplanke „nicht von Hand anhand der Top-20 gruppieren" ist als ausdrückliches Abnahmekriterium in M29 verankert (Gegenprobe gegen die Lehrkraft-Top-20). Offene Frage zur Sammelknoten-Darstellung im Graphen beantwortet: Stapel-Karte mit Anzahl, antippbar zum Aufklappen (M32). Reduktionsgrad festgelegt auf max. 6 Einzelkurven.

### Offener Design-Workshop: drei radikal unterschiedliche Darstellungen der Simulation (2026-09-11)

- **Idee:** bewusst ergebnisoffene Design-Session mit drei grundverschiedenen Ansätzen, wie die Simulation dargestellt werden könnte – losgelöst vom aktuellen Feldbuch/Naturjournal-Konzept (Styleguide) – als Gegenprobe, ob das aktuelle Konzept die Kaskadenlogik wirklich am besten vermittelt oder ob eine ganz andere Darstellung besser wäre.
- Bietet sich für einen eigenen Claude-Design-Canvas-Durchlauf an (wie bei M23), diesmal explizit mit mehreren parallelen Entwürfen statt einem.
- Ergebnis wäre zunächst Diskussionsgrundlage, keine Festlegung – erst nach Rücksprache ggf. in einen Milestone überführen (analog zur Brand-Störung oben).

### Review der Lehrkraft-Annahmen: sicherstellen, dass sie in Config-Dateien statt hartkodiert stehen (2026-09-11)

- **Hintergrund:** Die Milestones-Doku führt unter „Offene Lehrkraft-Abgleiche" bereits mehrere plausibel hergeleitete, aber nie mit einer echten Lehrkraft geprüfte Annahmen auf: Sprite-Zustands-Schwellenwerte in `js/dashboard.js`, Endzustandsbild-Schwellen 34/67 in `js/forscherheft.js` → `endzustandBild()`, Luchs/Wolf-Reduktionsfaktoren in `scripts/simulation/model.py`. Dazu kommt `DAUER_TROCKENHEIT_JAHRE` in `model.py` (siehe „Mehrjährige Störungsdauer" unten) – ein weiterer Wert dieser Art, der bislang gefunden wurde.
- **Idee:** gezielt durchgehen, welche dieser mit-einer-Lehrkraft-abzugleichenden Werte aktuell in JS-/Python-Code statt in `data/*.json` stehen, und die hartkodierten in Konfigurationsdateien verschieben – damit eine Lehrkraft sie nach Rücksprache anpassen kann, ohne Code anzufassen.
- Reine Refactoring-Idee ohne fachliche Änderung der Werte selbst – nur der Ort, an dem sie stehen, ändert sich.

---

## Verbesserungen

### Instrumente als Tacho/Radialdiagramm (2026-09-11, zurückgestuft von M17)

- War als Milestone M17 eingeplant, auf Nutzer-Wunsch zurück in den Backlog verschoben: rein
  kosmetische Verbesserung ohne Abhängigkeiten, aber auch ohne dringenden Bedarf.
- **Idee:** Live-Dashboard-Instrumente (M5) optional/zusätzlich als Radialdiagramm/Tacho mit
  Art/Baum in der Mitte darstellen statt nur Symbol+Skala+Text.
- Bei erneuter Aufnahme als Milestone: Styleguide Abschnitt 6 (Feldmessinstrumente-Optik,
  „nie Farbe allein") bleibt maßgeblich, auch für die Radialdiagramm-Variante.

### Mehrjährige Störungsdauer (z. B. mehrjährige Trockenheit) (2026-09-11)

- **Ist-Zustand:** Nur Trockenheit hat überhaupt ein Dauer-Konzept – `DAUER_TROCKENHEIT_JAHRE = 4` in `scripts/simulation/model.py`, fest einprogrammiert (nicht in `data/stoerungen.json`). Borkenkäfer/Sturm/Temperatur/Totholzentnahme sind ab Trigger-Jahr dauerhaft aktiv (kein definiertes Ende); Trockenheit ist die einzige Störung mit einem festen Ende.
- **Idee:** Dauer als wählbare/parametrisierbare Größe statt fixer Konstante anbieten – z. B. kurze/lange Trockenheit als Auswahloption, oder allgemeiner ein Dauer-Feld je Störung in `data/stoerungen.json` statt im Python-Code.
- Offene Fragen: nur bei Trockenheit wählbar machen oder als allgemeines Konzept für mehrere Störungstypen einführen? Wirkt sich auf die Kombinatorik in `build_simulationen.py` aus (mehr Varianten je Störung = mehr generierte Zeitreihen) – Umfang vorab abschätzen.
- Hängt mit dem Backlog-Punkt „Review der Lehrkraft-Annahmen" oben zusammen – `DAUER_TROCKENHEIT_JAHRE` ist ein konkretes Beispiel für eine Annahme, die aktuell nur im Code, nicht in den Daten steht.
- **Erledigt durch M33–M34 (2026-09-11):** die offene Frage „nur Trockenheit oder allgemeines Konzept?" ist entschieden – Dauer wird in M33 für **alle** Störungen zum Datenfeld (reines Refactoring mit Null-Diff-Nachweis), aber in M34 nur bei der **Trockenheit** zur wählbaren Größe, und dort mit genau zwei Stufen (4 Jahre = heutiger Status quo, 8 Jahre = lang). Vorab abgeschätzter Umfang: 8 der 22 Ereigniszustände enthalten Trockenheit ⇒ 261 → 357 Zeitreihen.

### Umschalten zwischen vereinfachter und vollständiger Netzwerk-Ansicht (2026-09-11)

- Ergänzt den Backlog-Punkt „Vereinfachte Projektion für Schüler:innen" oben um eine konkrete Interaktionsidee: statt (oder zusätzlich zu) einer automatisch reduzierten Ansicht ein explizites Umschalten zwischen „vereinfacht" und „vollständig" anbieten, damit Schüler:innen bei Bedarf selbst in die volle Komplexität wechseln können.
- Betrifft in erster Linie den Netzwerk-Graphen (M8/M15), wo Unübersichtlichkeit laut dem Punkt oben am dringendsten ist.
- Sollte zusammen mit „Vereinfachte Projektion" oben diskutiert, nicht separat umgesetzt werden (gleiche Leitplanke: Gruppierung automatisch aus den generierten Szenariodaten ableiten, nicht von Hand pflegen).

### README für das Projekt (2026-09-11)

- Bisher gibt es keine `README.md` im Projekt-Root – Einstieg für neue Mitwirkende/Lehrkräfte läuft aktuell nur über `CLAUDE.md` und die `docs/`-Quelldokumente.
- **Idee:** kurze `README.md` mit Projektbeschreibung, Zielgruppe, lokalem Start (`python3 -m http.server`), Verweis auf `docs/` als Quelldokumente und auf `CLAUDE.md` für die Entwicklungs-Konventionen.

### Automatisierter Baseline-Drift-Test für `model.py` (2026-09-11, Claude-Vorschlag)

- **Hintergrund:** Die Milestones-Doku dokumentiert unter „Wiederkehrendes Bug-Muster" bereits einen mehrfach aufgetretenen Fehlertyp in `scripts/simulation/model.py` – Bestandsanteil (statisches Gewicht) und Vitalität (0–100-Gesundheitswert) wurden wiederholt verwechselt (Fichte, Buschwindröschen, Blattläuse laut Git-Historie). Die dort empfohlene Gegenprobe („alle Waldtypen ohne Störung über 20 Jahre, kein Indikator darf ohne Ursache driften") ist bisher nur eine Erinnerung für künftige Änderungen, kein tatsächlich existierendes Skript.
- **Idee:** diese Gegenprobe als kleines eigenständiges Skript umsetzen (z. B. `scripts/simulation/test_baseline_drift.py`, stdlib-only wie die übrigen Build-Skripte) – simuliert alle Waldtypen ohne jede Störung über 20 Jahre und schlägt fehl, sobald ein Indikator sich ohne Ursache von seinem Jahr-0-Wert entfernt. Kein volles Testframework nötig (bewusste Entscheidung gegen automatisierte Tests laut CLAUDE.md bleibt unangetastet), nur ein gezielter Regressionstest für genau dieses wiederkehrende Bug-Muster.
- Günstig, weil klein und gezielt: fängt genau die Fehlerklasse ab, die schon mehrfach aufgetreten ist, ohne den „kein Testframework"-Ansatz des Projekts grundsätzlich zu ändern.