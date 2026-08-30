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

---

## Verbesserungen