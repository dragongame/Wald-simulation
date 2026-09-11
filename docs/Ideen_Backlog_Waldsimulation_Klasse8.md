# Ideen & Verbesserungswünsche (Backlog für spätere Versionen)

**Zweck:** Sammelstelle für Ideen, Verbesserungswünsche und Kritik, die *nicht* in die aktuelle Umsetzung (Meilensteine M0–M11, siehe `Milestones_Waldsimulation_Klasse8.md`) einfließen, sondern für eine spätere Version vorgemerkt werden. Frei befüllbar, keine feste Struktur nötig – einfach unten ergänzen.

**Verhältnis zu den anderen Dokumenten:** Ändert nichts an den in `Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` getroffenen Entscheidungen für Version 1. Ein Eintrag hier ist ein Vorschlag, keine Freigabe – wird erst nach Rücksprache umgesetzt.

**Format-Vorschlag je Eintrag:** kurzer Titel, 1–2 Sätze Kontext/Warum, Datum. Muss nicht eingehalten werden.

**Hinweis (2026-08-26):** Alle bisherigen Einträge wurden zu Milestones M12–M22 gemacht (siehe Milestones-Dokument, Abschnitt „Bekannte Lücken") – Ausnahme ist der folgende Punkt, der bewusst noch keine Milestone-Nummer bekommen hat.

**Hinweis (2026-08-28):** Der Eintrag „Kurven-Darstellung verbessern – Analyse-Screen und Forscherheft-Snapshots" wurde zu Milestone **M24** gemacht (siehe Milestones-Dokument).

---

## Offene Diskussion (noch kein Milestone)

### Überlegen, ob Brände auch simuliert werden sollten, also ein Ereignis von Trockenheit/Brandgefahr

- Das muss aber noch diskutiert und abgewogen werden.
- Neue Störungsart mit eigener fachlicher/didaktischer Abwägung (kein kleiner Fix wie z. B. eine reine UI-Änderung) – erst nach Rücksprache in einen Milestone überführen.

### Vereinfachte Projektion für Schüler:innen – Komplexität wächst schneller als die Verständlichkeit (2026-08-28)

- **Ausgangslage:** Die Simulation selbst (32 Knoten, volle Kaskadenlogik) bleibt unangetastet – Vorschlag betrifft nur eine zusätzliche, reduzierte Darstellung obendrauf, für die Zielgruppe (Klasse 8, 45 Minuten). Betrifft **Analyse-Screen (M6), Live-Dashboard (M5) und Netzwerk-Graph (M8/M15)** – explizit **nicht** das Arten-Lexikon (M9), das bewusst vollständig/als Nachschlagewerk bleiben soll.
- **Besonders dringend beim Graphen:** zu viele Knoten gleichzeitig lassen den Graphen schnell unübersichtlich werden – unerwartete Rückkopplungsschleifen (gerade die didaktisch wichtigsten!) gehen darin leicht unter, statt hervorzustechen.
- **Kerngedanke:** Knoten mit geringem/ähnlichem Beitrag zu einem Szenario zu einem Sammelknoten zusammenfassen (z. B. mehrere Kleinpflanzen ohne nennenswerten Einzeleinfluss).
- **Wichtige Leitplanke für die Umsetzung:** Die Gruppierung darf nicht von Hand anhand der Top-20-Szenarien (siehe M19) festgelegt werden – ein Knoten, der in diesen 20 Kombinationen unauffällig ist, kann in einer der übrigen ~175 Kombinationen der eigentliche Kaskadentreiber sein, und eine fest verdrahtete Gruppierung würde das verschleiern. Ebenso würde eine Brand-Störung (siehe Eintrag oben) oder jede künftige Erweiterung eine von Hand gepflegte Gruppierung veralten lassen. Stattdessen: Beitrag/Gruppierung **je generiertem Szenario automatisch im Build-Schritt** ableiten (z. B. über Stärke/Varianz der Abweichung vom Ausgangszustand), als zusätzlicher Output neben `model.py`/`build_simulationen.py` – dann ist die Projektion immer für das gezeigte Szenario gültig und bleibt nach jedem `build_simulationen.py`-Lauf automatisch korrekt, genau wie der Rest der Pipeline.
- **Umfang:** Sollte in mehrere Milestones aufgeteilt werden (Analyse-Kurven, Dashboard-Kacheln, Graph-Knoten haben unterschiedliche Anforderungen an die Darstellung von Sammelknoten) statt als ein großer Schritt. Kandidat für den ersten Teil-Milestone: Analyse-Screen-Kurven, da dort die Kurvenflut aktuell am größten ist.
- Noch keine Milestone-Nummer – braucht erst weitere Diskussion (u. a. wie Sammelknoten im Graphen visuell dargestellt werden).

### Kritische Durchsicht: nachvollziehbare, aber nicht triviale Rückkopplungsschleifen in den Top-10-Szenarien (2026-09-11)

- **Hintergrund:** M19 wählt die kontrastreichsten Wald×Störung-Kombinationen für die Lehrkraft-Empfehlung aus (`scripts/simulation/build_lehrkraft_kombinationen.py`), aber „größter Kontrast" ist nicht automatisch dasselbe wie „lehrreichste Rückkopplungsschleife".
- **Idee:** gezielt durchgehen, ob die aktuell empfohlenen Top-Szenarien Rückkopplungsschleifen zeigen, die für Klasse 8 verständlich, aber nicht sofort offensichtlich sind – das eigentliche didaktische Ziel der Simulation (siehe Umsetzungsauftrag). Falls nicht: Auswahlkriterium in `build_lehrkraft_kombinationen.py` ergänzen statt nur nach Kontraststärke zu sortieren.
- Zunächst reine Analyse-/Review-Aufgabe, kein Code-Vorgriff nötig, bevor das Ergebnis vorliegt.

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

### Umschalten zwischen vereinfachter und vollständiger Netzwerk-Ansicht (2026-09-11)

- Ergänzt den Backlog-Punkt „Vereinfachte Projektion für Schüler:innen" oben um eine konkrete Interaktionsidee: statt (oder zusätzlich zu) einer automatisch reduzierten Ansicht ein explizites Umschalten zwischen „vereinfacht" und „vollständig" anbieten, damit Schüler:innen bei Bedarf selbst in die volle Komplexität wechseln können.
- Betrifft in erster Linie den Netzwerk-Graphen (M8/M15), wo Unübersichtlichkeit laut dem Punkt oben am dringendsten ist.
- Sollte zusammen mit „Vereinfachte Projektion" oben diskutiert, nicht separat umgesetzt werden (gleiche Leitplanke: Gruppierung automatisch aus den generierten Szenariodaten ableiten, nicht von Hand pflegen).

### Lehrkraft-Übersicht (M19) als generierte Markdown-Datei statt In-App-Screen (2026-09-11)

- **Ist-Zustand:** `data/generated/lehrkraft_kombinationen.json` wird bereits build-time von `scripts/simulation/build_lehrkraft_kombinationen.py` erzeugt, aktuell aber live in der App gerendert (`js/lehrkraft.js`, Post-it-Tab „Für Lehrkräfte", `#screen-lehrkraft` in `index.html`).
- **Idee:** In-App-Screen entfernen, stattdessen die vorhandenen Build-Time-Daten direkt als lesbare Markdown-Datei ausgeben (z. B. `docs/Lehrkraft_Empfehlungen.md`, aus demselben Build-Skript generiert) – Lehrkräfte lesen das außerhalb der Schüler-App, kein zusätzlicher Navigationspunkt nötig.
- Aufräumarbeit bei Umsetzung: Post-it-Nav-Eintrag, `#screen-lehrkraft`, `js/lehrkraft.js` und der zugehörige Precache-Eintrag müssten entfernt werden.

### README für das Projekt (2026-09-11)

- Bisher gibt es keine `README.md` im Projekt-Root – Einstieg für neue Mitwirkende/Lehrkräfte läuft aktuell nur über `CLAUDE.md` und die `docs/`-Quelldokumente.
- **Idee:** kurze `README.md` mit Projektbeschreibung, Zielgruppe, lokalem Start (`python3 -m http.server`), Verweis auf `docs/` als Quelldokumente und auf `CLAUDE.md` für die Entwicklungs-Konventionen.

### Mehr Leitfragen für die Reflexion (2026-09-11)

- Die aktuellen Reflexionsfragen in `js/forscherheft.js` sind wörtlich aus der Wissensbasis Abschnitt 6.5 übernommen (bewusste Entscheidung, siehe M7).
- **Idee:** zusätzliche Leitfragen ergänzen, um die Reflexion zu vertiefen.
- Offene Frage: neue Fragen in die Wissensbasis (Abschnitt 6.5) aufnehmen und von dort wörtlich übernehmen (konsistent mit der bisherigen Quelle-vor-Code-Regel), oder als app-eigene Ergänzung ohne Wissensbasis-Bezug behandeln?

### Hypothese-vs-Ergebnis-Vergleich in der Reflexion (2026-09-11, Claude-Vorschlag)

- **Ausgangslage:** Die Hypothese wird bereits vor dem Durchlauf je Wald erfasst (M4) und landet unverändert im Forscherheft-Eintrag (M7), aber es gibt aktuell keine explizite Gegenüberstellung „das hast du vorhergesagt" vs. „das ist tatsächlich passiert" – die Reflexionsfragen (siehe Punkt oben) sind offen formuliert, ohne direkten Rückbezug auf den eigenen Vorab-Text.
- **Idee:** auf dem Reflexions-Screen (oder im Forscherheft-Eintrag) Hypothesentext und Endzustand/größte Abweichung nebeneinander anzeigen, bevor die Reflexionsfragen beantwortet werden – macht den Vorhersage-Realität-Abgleich zum Teil der Reflexion selbst statt ihn dem Zufall zu überlassen.
- Ergänzt sich mit „Mehr Leitfragen für die Reflexion" oben (z. B. eine neue Leitfrage könnte direkt auf diese Gegenüberstellung Bezug nehmen).

### Automatisierter Baseline-Drift-Test für `model.py` (2026-09-11, Claude-Vorschlag)

- **Hintergrund:** Die Milestones-Doku dokumentiert unter „Wiederkehrendes Bug-Muster" bereits einen mehrfach aufgetretenen Fehlertyp in `scripts/simulation/model.py` – Bestandsanteil (statisches Gewicht) und Vitalität (0–100-Gesundheitswert) wurden wiederholt verwechselt (Fichte, Buschwindröschen, Blattläuse laut Git-Historie). Die dort empfohlene Gegenprobe („alle Waldtypen ohne Störung über 20 Jahre, kein Indikator darf ohne Ursache driften") ist bisher nur eine Erinnerung für künftige Änderungen, kein tatsächlich existierendes Skript.
- **Idee:** diese Gegenprobe als kleines eigenständiges Skript umsetzen (z. B. `scripts/simulation/test_baseline_drift.py`, stdlib-only wie die übrigen Build-Skripte) – simuliert alle Waldtypen ohne jede Störung über 20 Jahre und schlägt fehl, sobald ein Indikator sich ohne Ursache von seinem Jahr-0-Wert entfernt. Kein volles Testframework nötig (bewusste Entscheidung gegen automatisierte Tests laut CLAUDE.md bleibt unangetastet), nur ein gezielter Regressionstest für genau dieses wiederkehrende Bug-Muster.
- Günstig, weil klein und gezielt: fängt genau die Fehlerklasse ab, die schon mehrfach aufgetreten ist, ohne den „kein Testframework"-Ansatz des Projekts grundsätzlich zu ändern.