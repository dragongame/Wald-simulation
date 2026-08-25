# Umsetzungsauftrag: Waldökosystem-Störungssimulation (Klasse 8)
## Konsolidiertes Master-Dokument für Claude Code — Version 2

**Änderungshinweis gegenüber Version 1:** Die Wissensbasis wurde um zwei neue Störungsszenarien erweitert (Szenario 5: Totholzentnahme; Szenario 6: Wildverbiss). Dieses Dokument integriert beide vollständig als spielbare Bestandteile. Neu bzw. überarbeitet: Abschnitt 2.10/2.11, 3.2, 4, 6. Alle übrigen Abschnitte aus Version 1 bleiben unverändert gültig.

**Zweck dieses Dokuments:** Dies ist der Einstiegspunkt für die Umsetzung. Es fasst alle in mehreren Abstimmungsrunden getroffenen Entscheidungen zusammen, löst Widersprüche zwischen den bisherigen Projektdokumenten auf und ergänzt die Punkte, die dort noch offen waren. Es ersetzt **keines** der vier Ursprungsdokumente inhaltlich, sondern regelt die **Rangfolge** und trägt die **Änderungen** nach.

---

## 0. Rangfolge der Dokumente

Bei Widersprüchen gilt folgende Reihenfolge:

1. **Dieses Dokument** – für alles, was hier explizit geregelt wird (Rangfolge, Entscheidungsprotokoll, aktualisierte Anforderungen, Datenmodell)
2. **Wissensbasis** (*Mitteleuropäische Waldökosysteme: Didaktische Wissensbasis*, aktuelle Fassung mit 6 Störungsszenarien) – alleinige fachliche Quelle für Arten, Zahlen, Steckbriefe, Beziehungen, Kaskadenlogik (unverändert gültig, außer wo unten explizit korrigiert)
3. **Styleguide** (*Visuelle Gestaltung*) – alleinige Quelle für Farben, Typografie, Illustrationsstil, Animation (unverändert gültig)
4. **Illustrations-Promptvorlage** – Quelle für Sprite-Dateinamen und -Zustände (unverändert gültig)
5. **Technisches Anforderungsdokument** und **User Stories** – weiterhin als Hintergrund/Kontext lesenswert, aber an mehreren Stellen durch dieses Dokument überschrieben (siehe Abschnitt 2)

---

## 1. Kurzüberblick

Interaktive PWA für iPads (Safari, Klasse 8, Einzelstunde ~45 Min.), mit der Schüler:innen paarweise „Netzwerkdenken" erfahren: Ökologische Störungen wirken kaskadenartig, nicht isoliert; Artenvielfalt erzeugt Resilienz (Kontrast Mischwald vs. Monokultur). Die Simulation deckt jetzt sechs Störungsszenarien in drei Kategorien ab: Naturereignisse, eine gezielte Bewirtschaftungsmaßnahme, ein strukturelles Ungleichgewicht (siehe 2.10). Reines Frontend, offlinefähig nach erstem Laden, keine Accounts, kein Server, Hosting via GitHub Pages. Details unverändert: siehe Technikdokument Abschnitte 1–3, 5–8.

---

## 2. Entscheidungsprotokoll

### 2.1 Vergleichsmodus ist Pflicht
Jeder Durchlauf nutzt **zwei Wald-Plätze gleichzeitig**, nicht einen. Die beiden Plätze müssen **zwei unterschiedliche Waldtypen** sein (derselbe Typ ist auf beiden Plätzen nicht wählbar). Ersetzt Technikdokument 4.1/4.3.

### 2.2 Störungsauswahl: frei, ohne App-seitige Einschränkung
Die App bietet immer **alle** Waldtyp- und Störungsoptionen frei zur Auswahl an; Zuteilung im Jigsaw-Verfahren läuft rein organisatorisch über einen Zettel der Lehrkraft. Freies Weiterexperimentieren nach der Pflichtaufgabe ist ausdrücklich erlaubt.

### 2.3 Netzwerk-Graph ist gesperrt (Rachel-Carson-Mechanik)
Phase 2 (Netzwerk-Graph) ist zu Beginn **nicht** verfügbar. Ein durchgängig sichtbarer Button „Wissenschaftler:in um Hilfe bitten" öffnet ein Namens-Eingabefeld (tolerant geprüft). Bei korrekter Eingabe von „Rachel Carson" wird das Feature dauerhaft freigeschaltet, inkl. eines kurzen, editierbaren, klar als fiktiv gekennzeichneten Briefs (separate Content-Datei). Ab Freischaltung auch rückwirkend für alle bereits erstellten Forscherheft-Seiten nutzbar.

### 2.4 Digitales Forscherheft, Datenmodell v2
Pro Seite: zwei Wald-Datensätze, die gewählte(n) Störung(en)/Regler-Einstellung inkl. Reihenfolge/Zeitpunkt, bis zu drei Kurven-Snapshots, ein gemeinsamer Reflexionstext. Keine feste Zielzahl bei der Fortschrittsanzeige (siehe 2.9).

### 2.5 Neuer Analyse-Screen (getrennt vom Live-Dashboard)
Live-Simulation mit Feldmessinstrumenten → nach 20 Jahren eigener Vollbild-Screen „Analyse" mit frei kombinierbaren Kurven für alle Indikatoren → Reflexionsfrage.

### 2.6 „Höhere Temperaturen" als dauerhafter Trend
„Höhere Temperaturen" ist ab Jahr 0 durchgehend als erhöhter Hintergrundfaktor aktiv (kein Trigger-Jahr). Wird sie mit einer zweiten Störung kombiniert, entfällt die Reihenfolge-Auswahl in der UI (gilt jetzt für alle 4 möglichen Partner-Störungen, siehe 2.10.4 für den neuen fünften Fall Totholzentnahme).

| Kombination | Verhalten |
|---|---|
| Sturm → Borkenkäfer | 1 Jahr nach Sturm |
| Trockenheit → Borkenkäfer | gleichzeitig (0 Jahre) |
| Sturm → Trockenheit | 1 Jahr Abstand (Annahme, mit Lehrkraft abzugleichen) |
| Temperatur + Borkenkäfer | Temperatur ab Jahr 0 aktiv; Borkenkäfer-Trigger bei Jahr 0 |
| Temperatur + Trockenheit | Temperatur ab Jahr 0 aktiv; Trockenheit-Trigger bei Jahr 0 |
| Temperatur + Sturm | Temperatur ab Jahr 0 aktiv; Sturm-Trigger bei Jahr 1 |

Wird Temperatur allein gewählt, läuft sie als durchgehender Hintergrundfaktor über die vollen 20 Jahre.

### 2.7 Knotenmodell: 31 Knoten (Basis), plus 1 durch Szenario 5 (siehe 2.10.5)
Habicht und Sperber, Luchs und Wolf, Raupen und Blattläuse sind eigenständige Knoten (28 → 31). Mit dem neuen Knoten aus Szenario 5 ergeben sich insgesamt **32 Knoten** (siehe 4.1).

**Kanten-Transformationsregel:** Jede Zeile der Beziehungstabelle, die einen aufgeteilten Knoten referenziert, wird verdoppelt (identischer Typ/Stärke/Beschreibung), außer die Luchs-spezifische Zahl „~55 Rehe/Jahr", die ausschließlich bei `luchs` bleibt, nicht bei `wolf`.

### 2.8 Arten-Lexikon: einfache Liste, keine Suche
Nach Kategorie gruppierte Liste aller Knoten (jetzt 32, siehe 4.1), Bild + 1–2 Fakten, unabhängig vom Graphen aufrufbar.

### 2.9 Kleinere Punkte
- Export/Teilen-Funktion: einfache Textexport-Funktion je Forscherheft-Seite, kein PDF in Version 1.
- Kein Vorführ-Modus in Version 1.
- Keine harte iPadOS/Safari-Versionsgrenze im Lastenheft.
- Fortschrittsanzeige: „bisher X Durchläufe dokumentiert" ohne festen Zielwert (durch 2.10 endgültig bestätigt, da die Kombinationszahl weiter gewachsen ist).
- Asset-Abdeckung: Eiche und Birke bleiben bei einem Zustandsbild (siehe Version 1, unverändert).

### 2.10 Integration von Szenario 5 (Totholzentnahme) und Szenario 6 (Wildverbiss) — NEU

Beide werden vollständig spielbar integriert.

**2.10.1 Drei Kategorien statt einer, visuell unterschieden (je eigenes Icon/Farbe):**
- *Naturereignis:* Borkenkäferbefall, Trockenheit, Höhere Temperaturen, Extremwetter/Sturm (wie bisher)
- *Bewirtschaftungsmaßnahme:* Totholzentnahme (NEU)
- *Strukturelles Ungleichgewicht:* Wildverbiss (NEU, technisch grundlegend anders, siehe 2.10.2)

**2.10.2 Wildverbiss als unabhängiger Regler, kein Trigger-Ereignis:**
- Kein Teil der „Störungen mit Reihenfolge"-Auswahl. Eigener, unabhängiger Einstellungsschritt: Schieberegler „Prädator-Beute-Regulation / Wilddichte", 3 feste Stufen (niedrig/mittel/hoch), Standard = niedrig (kein/kaum Effekt). Bewusst nur 3 diskrete Stufen (nicht stufenlos) — Begründung siehe 2.11.
- Frei kombinierbar mit 0, 1 oder 2 Ereignis-Störungen. Einzige Regel: mindestens eine Abweichung vom Ausgangszustand muss gewählt sein (≥1 Ereignis-Störung ODER Regler ≠ niedrig), sonst bleibt „Play" deaktiviert (mit Hinweistext).
- Damit ist Szenario 6 auch **isoliert** durchführbar (0 Ereignis-Störungen, nur Regler) — zeigt die rein schleichende Verarmung des Mischwaldes über 20 Jahre ohne akutes Ereignis; pädagogisch explizit gewollt (Wissensbasis, Szenario 6).
- Zeitliches Verhalten (reine Encoding-Logik im Berechnungsmodul, keine gesonderte UI): Effekt auf Verjüngung/Baumartenvielfalt ist in der ersten Hälfte der 20 Jahre kaum sichtbar, nimmt danach zu.
- Regler ist für alle drei Waldtypen einstellbar (Vergleichbarkeit), wirkt laut Wissensbasis aber vor allem auf Waldtyp A spürbar.

**2.10.3 Ereignis-Störungsauswahl: 5 Typen statt 4, 0–2 statt 1–2 wählbar:**
- Totholzentnahme als 5. auswählbare Ereignis-Störung (Kategorie „Bewirtschaftungsmaßnahme"), kombinierbar mit den anderen 4 nach denselben Regeln wie bisher (siehe 2.10.4).
- 0 Ereignis-Störungen ist jetzt zulässig (Voraussetzung für den isolierten Wildverbiss-Lauf aus 2.10.2).

**2.10.4 Neue Zeitabstands-Annahme (ergänzt die Tabelle aus 2.6):**

| Kombination | Verhalten |
|---|---|
| Totholzentnahme + Borkenkäfer/Trockenheit/Sturm | gleichzeitig (0 Jahre) — Totholzentnahme reduziert ab ihrem Zeitpunkt dauerhaft die Regulationskapazität (Habitat für Buntspecht/Ameisenbuntkäfer); **neue Annahme, mit Lehrkraft abzugleichen** |
| Totholzentnahme + Temperatur | wie alle Temperatur-Kombinationen: keine Reihenfolge, Totholzentnahme-Trigger bei Jahr 0 |

**2.10.5 Neuer Graph-Knoten „Mensch/Bewirtschaftung":**
Notwendig für die Kante „entnimmt" (Mensch → Totholz). Kategorie „anthropogen", eigenes Icon (siehe Grafik-Liste, wird ergänzt). Erhöht die Gesamtknotenzahl auf **32**.

**2.10.6 „Fehlende Prädator-Regulation" wird NICHT als Kante dargestellt:**
Die Beziehungstabellen-Zeile „Luchs/Wolf (fehlend/selten) → Reh/Rothirsch: reguliert nicht" beschreibt eine Abwesenheit — eine gezeichnete Kante für „passiert nicht" wäre im Graphen missverständlich. Stattdessen: Kontexttext im Luchs- und Wolf-Steckbrief ("Ohne diese Art bzw. bei geringer Bejagung steigt der Verbissdruck..."). Die beiden dadurch tatsächlich ausgelösten Kanten werden reduce gezeichnet, Stärke skaliert mit der Regler-Stufe: `reh`/`rothirsch` → Eiche/weitere Verjüngungsarten ("verhindert") und `reh`/`rothirsch` → Eichelhäher-/Eichhörnchen-Aussaat ("entwertet").

### 2.11 Architektur-Entscheidung: Build-Time-Vorabsimulation statt Live-Berechnung — NEU

- Die ökologische Berechnungslogik (Kaskaden, Schwellenwerte, Zeitkonstanten aus Wissensbasis Abschnitt 4 und 6) wird als ein einziges, in sich geschlossenes Berechnungsmodul implementiert (single source of truth).
- Ein Build-Skript lässt dieses Modul einmalig für **alle** gültigen Kombinationen aus Waldtyp × Ereignis-Störung(en) × Regler-Stufe durchlaufen und schreibt je Kombination eine statische JSON-Datei mit den Jahreswerten (0–20) aller Indikatoren.
- Die Laufzeit-App liest zur Wiedergabe (Play/Pause/Einzelschritt) ausschließlich diese vorab erzeugten Zeitreihen; **keine** ökologische Berechnung zur Laufzeit.
- **Kombinationszahl:** 22 mögliche Ereignis-Auswahlzustände (0 Ereignisse + 5 einzelne + 16 Zweierkombinationen, wobei Temperatur-Paare ohne Reihenfolge zählen) × 3 Regler-Stufen − 1 ungültige „nichts gewählt"-Kombination = 65 Konfigurationen, × 3 Waldtypen = **195 vorab zu berechnende 20-Jahres-Verläufe**. Bei ca. 15 Indikatoren ergibt das eine Gesamtdatenmenge im niedrigen einstelligen MB-Bereich — vollständig offline cachebar.
- Vorteile: einmalige fachliche Prüfbarkeit aller Verläufe statt Vertrauen in eine Live-Engine, geringe Rechenlast auf älteren iPads, klare Trennung von Berechnung und Wiedergabe im Code.
- Bedingung: alle Parameter bleiben diskret/endlich — deshalb ist der Wildverbiss-Regler bewusst auf 3 Stufen begrenzt (2.10.2) statt stufenlos.

---

## 3. Aktualisierte funktionale Anforderungen

### 3.1 Start & Wald-Auswahl
Unverändert aus Version 1: zwei Pflicht-Plätze, zwingend unterschiedliche Waldtypen.

### 3.2 Störungsauswahl & Hypothese (ersetzt Version 1)
Auswahl aus **5 Ereignis-Störungen** in 2 sichtbar unterschiedenen Kategorien (Naturereignis: Borkenkäferbefall, Trockenheit, Höhere Temperaturen, Sturm; Bewirtschaftungsmaßnahme: Totholzentnahme) — **0, 1 oder 2** wählbar. Reihenfolge/Zeitversatz wie in 2.6/2.10.4, nicht durch SuS einstellbar.

Zusätzlich, unabhängig davon: Regler „Prädator-Beute-Regulation / Wilddichte" (3 Stufen, Kategorie „Strukturelles Ungleichgewicht", eigenes Icon), Standard niedrig.

„Play" ist erst aktivierbar, wenn mindestens eine Abweichung vom Ausgangszustand gewählt ist; sonst erscheint ein Hinweistext.

Für jeden der beiden Wälder weiterhin separat eine kurze Hypothese.

### 3.3 Phase 1 – Live-Simulation
Unverändert aus Version 1, mit einer Ergänzung: Bei aktivem Wildverbiss-Regler baut sich der Effekt auf Verjüngung/Baumartenvielfalt laut Modell erst in der zweiten Hälfte der 20 Jahre sichtbar auf (reine Logik im Vorabsimulations-Modul, siehe 2.11 — keine gesonderte UI nötig).

### 3.4–3.8
Unverändert aus Version 1 (Analyse-Screen, Reflexion, Netzwerk-Graph, Forscherheft, Arten-Lexikon).

---

## 4. Datenmodell

### 4.1 Vollständige Knoten-Liste (32 Knoten)

Alle 31 Knoten aus Version 1 bleiben unverändert (siehe dortige Tabelle: Bäume, Sträucher, Pilze, Kräuter, Herbivoren, Verbreiter, Prädatoren, Totholz). Neu hinzu:

| Kategorie | Knoten-ID | Name | Sprite | Zustandsvarianten |
|---|---|---|---|---|
| Anthropogen | `mensch_bewirtschaftung` | Mensch (Bewirtschaftung) | mensch_bewirtschaftung_portrait | nein |

### 4.2 Kanten-Transformationsregel
Unverändert aus Version 1 (siehe dort für Habicht/Sperber, Luchs/Wolf, Raupen/Blattläuse).

### 4.3 Neue Kantentypen (Szenario 5 & 6)

| Quelle | Ziel | Typ | Hinweis |
|---|---|---|---|
| `mensch_bewirtschaftung` | `totholz` | entnimmt | Szenario 5; SCHWACH-MITTEL auf Brandrisiko, STARK auf Habitatverlust |
| `totholz` | `hallimasch`, `zunderschwamm`, `buntspecht`, `ameisenbuntkaefer` | ist Habitat für | Entnahme reduziert diese Bestände |
| `reh`, `rothirsch` (Stärke skaliert mit Regler-Stufe) | `eiche` + weitere Verjüngungsarten (Tanne/Ahorn/Esche, sofern als Knoten geführt) | verhindert (Verbiss) | Szenario 6 |
| `reh`, `rothirsch` (Stärke skaliert mit Regler-Stufe) | Eichelhäher-/Eichhörnchen-Aussaaterfolg | entwertet | Szenario 6 |

„Luchs/Wolf fehlend → reguliert nicht" wird **nicht** als Kante geführt, sondern als Steckbrief-Kontext bei `luchs`/`wolf` (siehe 2.10.6).

### 4.4 Beispiel-Konfiguration im JSON-Schema

```
{
  "konfiguration": {
    "waldtyp": "mischwald",
    "ereignisse": [
      { "typ": "totholzentnahme", "trigger_jahr": 0 }
    ],
    "wildverbiss_regler": "hoch"
  },
  "zeitreihe": {
    "jahr_0": { "baumbestand": 100, "verjuengung_mischbaumarten": 100 },
    "jahr_20": { "baumbestand": 96, "verjuengung_mischbaumarten": 34 }
  }
}
```

Für die vollständige Berechnungslogik gilt Wissensbasis Abschnitt 4 (alle 6 Szenarien) und Abschnitt 6, ergänzt um die Temperatur-Korrektur (2.6) und die Architektur-Entscheidung (2.11).

---

## 5. Nicht-funktionale Anforderungen

Unverändert: Technikdokument Abschnitt 5. Die Build-Time-Vorabsimulation (2.11) ist die primäre Umsetzungsstrategie zur Erfüllung der Performance- und Offline-Anforderungen — keine neuen NFRs, aber eine konkretisierte technische Strategie.

---

## 6. Akzeptanzkriterien

Aus Version 1 unverändert gültig, ergänzt um:

- [ ] Alle 3 Waldtypen und alle 5 Ereignis-Störungen sind auswählbar (0–2 kombinierbar); Naturereignis und Bewirtschaftungsmaßnahme sind visuell unterscheidbar
- [ ] Zwei Wald-Plätze sind für jeden Durchlauf zwingend, immer unterschiedliche Typen
- [ ] „Borkenkäfer + Fichtenmonokultur" führt sichtbar zu großflächigem Kollaps, im Mischwald nur zu lokalem Schaden
- [ ] „Höhere Temperaturen" wirkt als durchgehender Hintergrundfaktor ab Jahr 0; bei Kombination entfällt die Reihenfolge-Auswahl
- [ ] Wildverbiss-Regler (3 Stufen) ist unabhängig von der Ereignis-Auswahl einstellbar, als „Strukturelles Ungleichgewicht" gekennzeichnet
- [ ] Ein Durchlauf mit Regler = hoch und 0 Ereignis-Störungen ist möglich und zeigt im Mischwald eine erst in der zweiten Hälfte der 20 Jahre spürbare Verarmung der Mischbaumarten-Verjüngung
- [ ] „Play" ist gesperrt, solange weder eine Ereignis-Störung noch der Regler von seinem Standardwert abweicht
- [ ] Alle 195 gültigen Waldtyp×Konfiguration-Kombinationen liegen als vorab berechnete Zeitreihen vor; zur Laufzeit findet keine ökologische Neuberechnung statt
- [ ] Netzwerk-Graph ist zu Beginn gesperrt, schaltet sich erst nach „Rachel Carson" frei
- [ ] Analyse-Screen mit frei kombinierbaren Kurven ist vom Live-Dashboard getrennt
- [ ] Arten-Lexikon (32 Knoten, einfache Liste, keine Suche) ist unabhängig vom Graphen erreichbar
- [ ] App funktioniert nach einmaligem Laden vollständig offline
- [ ] Bedienung ist für Achtklässler:innen ohne Erklärung durch die Lehrkraft selbsterklärend

---

## 7. Referenzdokumente (weiterhin im Original zu verwenden)

- **Wissensbasis** – aktuelle Fassung mit 6 Störungsszenarien; vollständige Artenliste, Steckbriefe, Beziehungstabelle, Kaskadenbeschreibungen, Caveats
- **Styleguide** – Farbpalette, Typografie, Illustrationsstil, Graph-/Dashboard-Gestaltung, Animation
- **Illustrations-Promptvorlage** – Sprite-Dateinamen, Zustände, technische Export-Vorgaben
- **Fehlende_Grafiken_Bekannt_Waldsimulation_Klasse8.md** – bekannte fehlende Illustrationen mit fertigen Prompt-Entwürfen (wird um die Szenario-5/6-Bedarfe ergänzt)
- **Fehlende_Grafiken_Laufend_Waldsimulation_Klasse8.md** – von Claude Code während der Umsetzung selbst zu pflegende Liste

Bei fachlichen Unklarheiten während der Umsetzung hat die Wissensbasis Vorrang vor eigenen Annahmen.
