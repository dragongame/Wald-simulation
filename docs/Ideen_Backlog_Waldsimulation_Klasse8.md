# Ideen & Verbesserungswünsche (Backlog für spätere Versionen)

**Zweck:** Sammelstelle für Ideen, Verbesserungswünsche und Kritik, die *nicht* in die aktuelle Umsetzung (Meilensteine M0–M11, siehe `Milestones_Waldsimulation_Klasse8.md`) einfließen, sondern für eine spätere Version vorgemerkt werden. Frei befüllbar, keine feste Struktur nötig – einfach unten ergänzen.

**Verhältnis zu den anderen Dokumenten:** Ändert nichts an den in `Umsetzungsauftrag_Waldsimulation_Klasse8_fuer_Claude_Code.md` getroffenen Entscheidungen für Version 1. Ein Eintrag hier ist ein Vorschlag, keine Freigabe – wird erst nach Rücksprache umgesetzt.

**Format-Vorschlag je Eintrag:** kurzer Titel, 1–2 Sätze Kontext/Warum, Datum. Muss nicht eingehalten werden.

---

## Bereits aus den Planungsdokumenten bekannt (explizit auf „nicht Version 1" vertagt)

- **PDF-Export des Forscherhefts** – Version 1 hat bewusst nur einfachen Textexport (Umsetzungsauftrag 2.9). PDF mit Layout/Bildern wäre ein Ausbauschritt.
- **Vorführ-Modus für die Lehrkraft** (z. B. Beamer-Demo vor der eigentlichen Arbeitsphase) – für Version 1 explizit ausgeschlossen (Umsetzungsauftrag 2.9).

---

## Eigene Einträge

### Mehr Tiere und Pflanzen bei der Simulation anzeigen

- So ist es klarer wer/was im Wald lebt und ggf. mehr oder weniger wird.
- **Ergänzung (2026-08-26):** Gilt auch für die Kurven-Analyse (M6) – aktuell sind dort nur die 14 tatsächlich simulierten Indikatoren (5 Baumarten + Borkenkäfer-Dichte + Wilddichte + ein paar Ökosystem-Werte) als Kurve wählbar, nicht die übrigen ca. 25 Arten aus Netzwerk-Graph/Lexikon (die haben nur einen statischen Steckbrief, keine Zeitreihe). Erfordert eigene Dynamik-Regeln pro Art im Simulationsmodell (`scripts/simulation/model.py`) – eine fachliche Modellierungsentscheidung wie beim ursprünglichen Datenmodell (M1), kein kleiner Fix.
- **Recherche-Vorarbeit (2026-08-26):** `docs/Wissensbasis_Erweiterung_weitere_Arten.md` enthält jetzt eine fachliche Vorrecherche für 19 der ca. 22 noch nicht simulierten Arten (Sträucher, Pilze, Kräuter, Eichhörnchen/Raupen/Blattläuse, Eichelhäher, alle 7 Prädatoren) inkl. Störungsreaktion, Kopplungsvorschlag an bestehende Indikatoren und Einschätzung der Umsetzungssicherheit – reine Recherche, noch keine Umsetzung.
- **Teilweise umgesetzt (2026-08-26):** Kurven-Analyse-Aspekt ist jetzt erledigt – 20 neue Indikatoren (die o.g. Arten + Fuchs + ein neuer, erfundener Kleinsäuger-Hilfsindikator) sind in `scripts/simulation/model.py`/`data/indikatoren.json` simuliert und im Analyse-Screen frei wählbar (siehe Milestones-Dokument). Ebenfalls erledigt: Luchs/Wolf sind jetzt echte, bedienbare Prädatoren-Schalter (ersetzen den alten Wildverbiss-Regler), Reh/Rothirsch getrennt simuliert. **Weiterhin offen:** eigene Dashboard-Kacheln/Sprites für die 20 neuen Arten im Live-Dashboard (war explizit nicht Teil dieser Runde).

### Instrument Verbesserung

- Die Anzahl oder relative Anzahl könnte in Form eines Radialdiagrams/Tachos angezeigt werden. Mit dem Tier/Baum in der Mitte.

### Drag & Drop

- Anstelle zum Beispiel die Wälder per Klick auszuählen, könnten diese in das Buch gezogen werden.

### Mehr Feldbuch feeling

- Es sollte sich mehr wie ein Feldbuch anfühlen, also mehr so wie offene Seiten.
- Bei der Simulation muss das nicht sein, bei der Auswertung auch nicht, aber bei den Szenario zusammen stellen (siehe Drag & Drop) und auch bei der Reflexion
- Navigieren könnte mit kleinen schmalen Post-It Notizen sein, so wie man es auch in einem echten Buch machen würde
- Im Netzwerk ansehen solle erst sichtar sein, wenn auch die Wissenschaftlering freigeschaltet ist
- Nutze 'docs/eingang/Hintergrund.png' als hintergrund Bild für das Journal und passe die UI an
- Nutze 'docs/eingang/Bockmarks-3.png' um Bookmarks als navigation zu verwenden

### Szenarios wo die Reihfolge egal ist

- Die Reihenfolge selection sollte nur entscheiden sein, wenn die ereignisse nicht im gleichen Jahr passieren.

### Erstelle eine Liste den Interesantesten 2er Kombinationen

- Diese soll der Lehrkraft dienen gute Scenarios zu verteilen, wo deutliche Unterschide sichtbar sind.

### Die Graphen sollen im Forscherheft angezeigt werden

- Die bis zu drei gespeicherten Vergleichsgrahen sollent im Forscherheft darstellt werden.

### Einfachere Auswahl
- Anstelle von Wald 1 und Wald 2, einfach die drei Wälder zeigen und zwei davon auswählen. Einfach von links nach rechts für Wald 1 und 2 weil die Reihenfolge ja egal ist.

### Überlegen, ob Brände auch simuliert werden sollten also ereigniss von Trokenheiten / Brandgefahr
- Das muss aber noch diskutiert und abgewogen werden.

### Netzwerk übersichtlicher gestalten
- An der Seite sind icons von allen Tieren, pflanzen und co. Diese können an und abgewählt werden und es werden nur die angewählten im Graphen gezeigt
- Die Linien müssen sich auch noch deutlicher Unterscheiden
