# User Stories & Interaktionsszenario: Waldökosystem-Simulation (Klasse 8)
## Ergänzung zu Wissensbasis, Technischem Anforderungsdokument und Styleguide

**Status:** Entwurf – aus gemeinsamer Diskussion entstanden, drei zentrale Design-Fragen bereits entschieden (siehe Abschnitt 3). Vor Weitergabe an Claude Code bitte Abschnitt 5 „Offene Punkte" und Abschnitt 4 „Auswirkungen auf bestehende Dokumente" prüfen.

**Verhältnis zu den anderen Dokumenten:** Dieses Dokument beschreibt den **konkreten Interaktionsablauf aus Sicht zweier Schüler:innen**, Szene für Szene – als Bindeglied zwischen den fachlichen/funktionalen Vorgaben (Wissensbasis, Technikdokument) und der visuellen Umsetzung (Styleguide). Es ersetzt keines der drei Dokumente, **präzisiert und korrigiert aber an einigen Stellen deren bisherige Annahmen** – siehe Abschnitt 4.

---

## 1. Leitprinzip: Partnerarbeit als Regelfall

Die App ist durchgängig auf **zwei Personen an einem iPad** ausgelegt, die gemeinsam diskutieren, vergleichen und Hypothesen abgleichen. Das ist keine reine UX-Nuance, sondern eine inhaltliche Entscheidung:

- **Der Vergleich zweier Wälder ist ab sofort Pflicht, nicht optional.** Jede Simulation läuft immer für zwei gleichzeitig belegte Wald-Plätze. Es gibt keinen Einzelwald-Modus mehr.
- Das ersetzt die bisherige Formulierung im Technikdokument (4.3), die die Vergleichsansicht nur als nachträgliche „Empfohlen"-Option vorsah.

Beispielpersonen für dieses Dokument: **Mia und Anton**, 8. Klasse.

---

## 2. Der Kern-Interaktionsablauf (Szene für Szene)

### Szene 1 – Start & Wald-Auswahl
Mia und Anton öffnen die App und sehen eine Feldbuch-Doppelseite mit **zwei leeren Wald-Plätzen**. Darunter liegen drei „Wald-Karten" (Mischwald, Fichtenmonokultur, Kiefernwald) mit Bild und Kurzbeschreibung, bereit zum Ziehen. Anton zieht den Mischwald auf Platz 1, Fichtenmonokultur auf Platz 2. Beide Plätze müssen belegt sein, bevor es weitergeht (Pflicht, siehe Abschnitt 1).

### Szene 2 – Störungsauswahl & Hypothese
Mia und Anton bekommen ihre Wald-Störungs-Kombination **auf einem Zettel** von der Lehrkraft (siehe Entscheidung 3.4) – die App selbst bietet dafür **immer alle Optionen frei zur Auswahl** an, genau wie im ursprünglichen Entwurf; es gibt keine vorausgefüllte oder eingeschränkte Ansicht. Es können **eine oder zwei Störungen** ausgewählt werden; bei zweien ist die **Reihenfolge relevant** (z. B. „erst Sturm, dann Borkenkäferbefall" laut Zettel der einen Gruppe, „erst Borkenkäferbefall, dann Sturm" laut Zettel einer anderen – so lässt sich im Plenum vergleichen, ob die Reihenfolge das Ergebnis verändert). Der zeitliche Abstand zwischen zwei Störungen ist **fest in der App hinterlegt**, nicht einstellbar (siehe Entscheidung 3.5). Die Auswahl-UI signalisiert klar, dass auch eine einzelne Störung ein vollständiger, gültiger Durchlauf ist. Laut ihrem Zettel wählen Mia und Anton „Borkenkäferbefall" (nur eine Störung). Für **jeden der beiden Wälder** wird separat eine kurze Hypothese eingegeben.

### Szene 3 – Simulation (live)
Für beide Wälder laufen die Zeitachsen parallel. Angezeigt werden **ausschließlich die Feldmessinstrumente** aus dem Styleguide (Zeiger/Balken/Symbol, keine Kurven) – siehe Entscheidung in Abschnitt 3.1. Mia und Anton beobachten, wie sich Baumsymbole verfärben/umfallen und die Instrumentenanzeigen ausschlagen.

### Szene 4 – Ergebnis & Kurven-Analyse
Nach 20 Jahren wechselt die App in ein **eigenes Analyse-Fenster** (eigener Vollbild-Screen, keine Einblendung im bestehenden Ergebnis-Bereich – siehe Entscheidung 3.8), das getrennt von der Live-Simulation ist. Hier werden die Verläufe nachträglich als **auswählbare Kurven** dargestellt (z. B. Reh, Fichte, Borkenkäfer, Totholz – der Kurven-Katalog geht damit über die sechs ursprünglichen Dashboard-Indikatoren hinaus, siehe Abschnitt 4). Mia und Anton schalten mehrere Kurven-Kombinationen durch, vergleichen beide Wälder nebeneinander und gleichen die Ergebnisse mit ihrer Hypothese ab. Bis zu **drei Kurven-Kombinationen** können als Snapshot ins Feldbuch übernommen werden; zusätzlich wird automatisch je Wald ein **Endzustandsbild** mit Kurzbeschreibung übernommen.

### Szene 5 – Reflexion
Die bekannte Reflexionsfrage („Welche Art war betroffen, obwohl du sie nicht direkt gestört hast?") wird beantwortet. Auch dieser Text landet auf der aktuellen Feldbuch-Seite.

### Szene 6 – Neue Seite, neuer Durchlauf
Mia und Anton legen eine neue Feldbuch-Seite an und beginnen wieder bei Szene 1 – mit einer anderen Wald-/Störungs-Kombination.

### Szene 7 – Netzwerk-Freischaltung
Durchgängig sichtbar gibt es einen Button „Eine Wissenschaftlerin/einen Wissenschaftler um Hilfe bitten". Tippt man ihn an, erscheint ein Eingabefeld für einen Namen. Zu einem selbst gewählten Zeitpunkt nennt die Lehrkraft der Klasse (oder einzelnen Gruppen) den Namen **Rachel Carson**. Wird der Name korrekt eingegeben, schaltet sich dauerhaft das Netzwerk-Feature (Phase 2) frei, und Mia und Anton erhalten einmalig einen kurzen **Brief**: Rachel Carson erklärt darin, wie das Beziehungsnetzwerk/der Graph zu lesen ist, und schreibt, dass sie nun wieder auf Forschungsreise geht – ein bewusster Abschied, der signalisiert, dass keine weiteren Nachrichten folgen. Ab jetzt kann für jede bereits erstellte Feldbuch-Seite der tatsächlich abgelaufene Kaskadenpfad im Netzwerk nachvollzogen werden.

### Szene 8 – Eigene Erklärung
Abschließend schreiben Mia und Anton in eigenen Worten eine Erklärung dessen, was sie in der Simulation beobachtet haben – gestützt auf das, was ihnen der Netzwerk-Graph in Szene 7 gezeigt hat.

---

## 3. Getroffene Design-Entscheidungen

### 3.1 Feldmessinstrumente vs. Kurven-Graphen
**Entscheidung:** Feldmessinstrumente sind die **einzige Live-Ansicht** während der Simulation (Styleguide Abschnitt 6 bleibt für Szene 3 unverändert gültig). Kurven-Graphen erscheinen **ausschließlich nachträglich** in der Analyse-Ansicht (Szene 4) und sind dort frei kombinierbar/umschaltbar. Damit bleibt die visuelle Leitidee „Feldbuch-Instrument" für die Live-Phase erhalten, ohne die für den Vergleich nötige Kurven-Detailtiefe zu verlieren.

### 3.2 Vergleichsmodus
**Entscheidung:** Zwei belegte Wald-Plätze sind **zwingend** für jeden Durchlauf (siehe Abschnitt 1). Es gibt keinen Einzelwald-Modus.

### 3.3 Rachel Carson
**Entscheidung:** Rachel Carson erscheint **nicht** als wiederkehrende Dialogfigur, sondern als Absenderin eines **einzigen, kurzen Briefs**, der ausschließlich das Lesen des Netzwerk-Graphen erklärt. Der Brief endet damit, dass sie wieder auf Forschungsreise geht – das begründet erzählerisch, warum keine weiteren Nachrichten folgen, und begrenzt die Figur bewusst auf einen einmaligen Impuls statt einer fortlaufenden Interaktion. Claude Code verfasst den Brieftext während der Umsetzung, hinterlegt ihn aber als **separaten, leicht editierbaren Content-Baustein** (eigene Text-/JSON-Datei statt fester Verdrahtung im Layout-Code), damit die Lehrkraft ihn später ohne Codeänderung anpassen kann. Die **fiktive Kennzeichnung** erfolgt am besten **außerhalb des eigentlichen Brieftexts** – z. B. als kurzer Rahmentext auf dem Bildschirm davor („Ein fiktiver Brief im Stil der Meeresbiologin Rachel Carson …") – damit der Brief selbst als zusammenhängender, gut lesbarer Text wirkt und nicht durch eingestreute Disclaimer unterbrochen wird.

### 3.6 Zugriffsmechanik auf das Netzwerk-Feature
**Entscheidung:** Ein durchgängig sichtbarer Button „Wissenschaftler:in um Hilfe bitten" öffnet ein Namens-Eingabefeld. Die **Lehrkraft entscheidet selbst, wann und wem** sie den Namen mitteilt – es gibt **keinen festen Schwellenwert** (z. B. „nach X Durchläufen") in der App. Praktische Hinweise für die Umsetzung: Die Eingabe sollte tolerant geprüft werden (Groß-/Kleinschreibung und Leerzeichen ignorieren), rein lokal ohne Serverabgleich (passend zur Datenschutz-Vorgabe des Technikdokuments, 5.3), und die Mechanik generisch genug gehalten, falls später weitere Wissenschaftler:innen/Namen ergänzt werden sollen.

### 3.7 Umfang des Kurven-Katalogs
**Entscheidung:** In der Analyse-Ansicht (Szene 4) sind **grundsätzlich alle Indikatoren wählbar**, nicht nur eine feste Teilmenge. Die Kurven, die zum tatsächlich abgelaufenen Kaskadenpfad des jeweiligen Durchlaufs gehören, werden dabei **optisch hervorgehoben** (z. B. vorausgewählt oder farblich/durch Kennzeichnung betont), damit SuS nicht in der vollen Optionsliste verloren gehen, aber trotzdem frei explorieren können.

### 3.4 Jigsaw-Zuteilung der Kombinationen (korrigiert)
**Entscheidung:** Die Zuteilung erfolgt **ausschließlich über einen Zettel** von der Lehrkraft (Papier, außerhalb der App) – die App selbst bietet **immer alle Wald- und Störungs-Optionen frei zur Auswahl** an, genau wie im ursprünglichen Entwurf. Es gibt **keine** Vorauswahl und **keine** Bestätigungs-Ansicht einer bereits zugeteilten Kombination. Mia und Anton lesen ihre Zuteilung vom Zettel ab und wählen sie anschließend selbst in der normalen, uneingeschränkten Auswahl-UI. Das beantwortet weiterhin den offenen Punkt aus dem Technikdokument (Abschnitt 9: „freie Wahl vs. Vorgabe durch die Lehrkraft?") – jetzt mit der Klarstellung, dass **keine Software-Einschränkung** nötig ist, weil die Steuerung rein organisatorisch über den Zettel läuft.

**Ergänzung – freies Weiterexperimentieren:** Gruppen, die ihre zugeteilte(n) Kombination(en) früh abgeschlossen haben, dürfen **ausdrücklich frei weiterexperimentieren**. Die Auswahl-UI bleibt dafür jederzeit vollständig offen; es gibt keine Sperre nach der Pflichtaufgabe. Diese zusätzlichen Durchläufe werden genauso behandelt wie reguläre Durchläufe (eigene Feldbuch-Seite, weiterhin verpflichtender Vergleichsmodus mit zwei Wäldern gemäß Abschnitt 1). Das ist eine bewusste Differenzierungsmaßnahme für heterogene Arbeitstempi.

### 3.8 Layout der Analyse-Ansicht
**Entscheidung:** Die Kurven-Analyse (Szene 4) bekommt ein **eigenes Fenster/einen eigenen Vollbild-Screen**, keinen eingebetteten Bereich im bestehenden Ergebnis-Screen. Damit sind die drei Zustände klar getrennt: Live-Simulation (Feldmessinstrumente) → eigenes Analyse-Fenster (Kurven) → Reflexion.

### 3.5 Zeitlicher Abstand bei zwei Störungen
**Entscheidung:** Wird eine Kombination aus zwei Störungen zugeteilt, ist der **Abstand in Jahren zwischen den beiden Ereignissen fest in der App hinterlegt**, nicht durch die SuS einstellbar – und zwar **je Störungspaar unterschiedlich**, passend zur Kaskadenlogik der Wissensbasis:

| Störungspaar | Jahresabstand | Grundlage |
|---|---|---|
| Sturm → Borkenkäfer | 1 Jahr | Explizit in der Wissensbasis: „Borkenkäfer-Massenvermehrung im Folgejahr" (Szenario 4) |
| Trockenheit → Borkenkäfer | 0 Jahre (gleichzeitig) | Wissensbasis beschreibt unmittelbares Zusammenwirken innerhalb derselben Vegetationsperiode, kein Jahresversatz genannt (Szenario 2) |
| Höhere Temperatur → Borkenkäfer | 0 Jahre (gleichzeitig) | Temperatur wirkt laut Wissensbasis direkt auf die Generationenzahl im selben Jahr (Szenario 3) |
| Trockenheit → Höhere Temperatur | 0 Jahre (gleichzeitig) | Beide treten in der Wissensbasis als gemeinsamer Hitze-/Trockensommer auf, kein Versatz beschrieben |
| Sturm → Trockenheit | 1 Jahr (**Annahme**) | Nicht explizit in der Wissensbasis behandelt; Platzhalterwert, fachlich mit der Lehrkraft zu bestätigen |
| Sturm → Höhere Temperatur | 1 Jahr (**Annahme**) | Nicht explizit in der Wissensbasis behandelt; siehe Hinweis unten |

Die Werte gelten unabhängig von der Reihenfolge (auch bei „umgekehrter Reihenfolge" bleibt der Abstand gleich, nur die Abfolge der Ereignisse dreht sich um).

**Wichtiger Hinweis:** „Höhere Temperaturen" wird in der Wissensbasis (Szenario 3) eher als **langfristiger, sich über Jahrzehnte verschiebender Trend** beschrieben als als abgrenzbares Einzeljahr-Ereignis wie Sturm. Die Modellierung als „Ereignis mit festem Jahresabstand" ist hier eine didaktische Vereinfachung, die vor der finalen Umsetzung noch einmal mit der Lehrkraft abgeglichen werden sollte.

---

## 4. Auswirkungen auf die bestehenden Dokumente

Diese Punkte sollten vor Weitergabe an Claude Code in die jeweiligen Dokumente eingearbeitet bzw. mit ihnen abgeglichen werden:

| Dokument | Betroffener Abschnitt | Änderung |
|---|---|---|
| Technikdokument | 4.1 Startbildschirm | Zwei Wald-Plätze statt einem, Drag-Interaktion; Störungsauswahl bleibt **vollständig frei** (1–2 Störungen, Reihenfolge wählbar) – Zuteilung erfolgt rein organisatorisch per Zettel, keine Einschränkung der App-UI; freies Weiterexperimentieren nach Pflichtaufgabe ausdrücklich vorgesehen |
| Technikdokument | 9 Offene Punkte | Frage „freie Wahl der SuS oder Vorgabe durch die Lehrkraft?" ist beantwortet: **Vorgabe durch die Lehrkraft**, siehe Entscheidung 3.4 – dieser Punkt kann aus Abschnitt 9 des Technikdokuments gestrichen werden |
| Technikdokument | 4.2 Phase 1 Dashboard | Bleibt bei Feldmessinstrumenten (keine Änderung) – aber **neuer Abschnitt** für die nachgelagerte Kurven-Analyseansicht (Szene 4) nötig |
| Technikdokument | 4.3 Netzwerk-Graph | Vergleichsansicht wird von „empfohlen" zu **verbindlich** hochgestuft; zusätzlich neue **Freischalt-Logik** nach Rachel-Carson-Trigger (bisher war Phase 2 uneingeschränkt verfügbar) |
| Technikdokument | 4.4 Forscherheft | Datenmodell erweitern: pro Seite jetzt 2× (Waldtyp, Störung(en), Hypothese, Endzustandsbild, Kurzbeschreibung) + bis zu 3 gespeicherte Kurven-Snapshots + ein gemeinsamer Reflexionstext; „X von 12 Kombinationen" muss zu „Wald-Paaren" umgerechnet werden |
| Styleguide | Abschnitt 6 Dashboard | Klarstellung ergänzen: Instrumente sind ausschließlich für die Live-Phase; neue Kurven-Ansicht braucht ein eigenes, kurzes Stil-Kapitel (Farblogik der Kurven sollte sich an der bestehenden Palette orientieren) |

---

## 5. Offene Punkte (bewusst noch nicht entschieden)

- ~~Zeitliche Kopplung zweier Störungen: einstellbar oder fest?~~ **Geklärt (3.5):** fest, je Störungspaar unterschiedlich (siehe Tabelle). **Neu offen:** Die beiden mit „Annahme" markierten Werte (Sturm+Trockenheit, Sturm+Temperatur) sowie die Modellierung von „höhere Temperaturen" als Einzelereignis mit Jahresabstand sollten fachlich mit der Lehrkraft abgeglichen werden, bevor sie final übernommen werden.
- ~~Zeitliche Kopplung zweier Störungen: einstellbar oder fest?~~ **Geklärt (3.5):** fest, je Störungspaar unterschiedlich (siehe Tabelle). **Weiterhin zu prüfen:** die beiden mit „Annahme" markierten Werte (Sturm+Trockenheit, Sturm+Temperatur) sowie die Modellierung von „höhere Temperaturen" als Einzelereignis mit Jahresabstand.
- ~~Freischalt-Schwelle für Rachel Carson/Netzwerk~~ **Geklärt (3.6):** kein fester Schwellenwert, Button + Namenseingabe, Zeitpunkt liegt bei der Lehrkraft.
- ~~Wortlaut der Carson-Hinweistexte~~ **Geklärt (3.3):** einmaliger, editierbarer Brief, von Claude Code verfasst, Inhalt auf Graph-Erklärung + Abschied („Forschungsreise") begrenzt.
- ~~Umfang des Kurven-Katalogs~~ **Geklärt (3.7):** alle Indikatoren wählbar, kaskadenrelevante hervorgehoben.
- ~~Layout der Analyse-Ansicht~~ **Geklärt (3.8):** eigenes Fenster/eigener Vollbild-Screen.

**Damit sind alle ursprünglich offenen Punkte geklärt.** Neue Fragen, die während der weiteren Abstimmung oder Umsetzung auftauchen, sollten hier ergänzt werden.

---

## 6. Kurzreferenz

| Frage | Entscheidung |
|---|---|
| Vergleichsmodus | Immer 2 Wälder, kein Einzelmodus |
| Live-Ansicht | Nur Feldmessinstrumente |
| Nachträgliche Analyse | Frei wählbare Kurven, bis zu 3 Snapshots ins Feldbuch |
| Störungen pro Durchlauf | 1–2, Reihenfolge relevant |
| Hypothese | Je Wald einzeln |
| Rachel Carson | Einmaliger, editierbarer Brief zur Graph-Erklärung; Abschied per „Forschungsreise" |
| Netzwerk-Zugriff | Button + Namenseingabe; Zeitpunkt/Namensvergabe liegt bei der Lehrkraft, kein fester Schwellenwert |
| Kombinations-Zuteilung | Per Zettel durch Lehrkraft (rein organisatorisch); App bietet immer alle Optionen frei an |
| Freies Weiterexperimentieren | Nach Pflicht-Kombination ausdrücklich erlaubt (Differenzierung für schnelle Gruppen) |
| Zeitabstand bei 2 Störungen | Fest in der App hinterlegt, je Störungspaar unterschiedlich (siehe Tabelle 3.5); 2 Werte noch als Annahme markiert |
| Kurven-Katalog | Alle Indikatoren wählbar, kaskadenrelevante optisch hervorgehoben |
| Analyse-Ansicht | Eigenes Fenster/eigener Vollbild-Screen |
