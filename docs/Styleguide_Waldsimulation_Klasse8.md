# Styleguide: Visuelle Gestaltung der Waldökosystem-Simulation
## Ergänzung zu „Technische Anforderungen Waldsimulation Klasse 8" – für Claude Code

**Status:** Abgestimmt mit der Lehrkraft (Stilentscheidungen final).
**Verhältnis zu den anderen Projektdokumenten:** Dieses Dokument regelt ausschließlich die **visuelle Umsetzung** (Farbe, Typografie, Illustration, Layout, Animation). Fachliche Inhalte, Zahlen und Kaskadenlogik bleiben allein in der *Wissensbasis* geregelt; funktionale/technische Vorgaben (PWA, Offline, Datenschutz) bleiben allein im *Technischen Anforderungsdokument* geregelt. Bei Widersprüchen zwischen diesem Styleguide und den Performance-/Offline-Vorgaben (Abschnitt 5.4/6 des Technikdokuments) hat **Performance auf älteren iPads Vorrang** – siehe Abschnitt 8 unten.

---

## 1. Leitidee: Feldbuch / Naturjournal

Die App wirkt durchgängig wie das **persönliche Feldbuch einer Waldforscherin/eines Waldforschers** – skizzenhaft, mit Beobachtungs-Etiketten, Stempeln und handschriftlich wirkenden Notizen, aber sauber genug, um auf einem iPad-Bildschirm gut bedienbar zu bleiben (kein „Kritzel-Chaos"). Diese Leitidee greift bewusst die ohnehin geplante Funktion **„Digitales Forscherheft"** auf und macht sie zum Herzstück der gesamten Optik statt zu einem isolierten Feature.

**Warum diese Wahl fachlich/didaktisch sinnvoll ist:** Sie normalisiert die Haltung „ich beobachte und dokumentiere ein System", die für Systemdenken zentral ist, und grenzt sich bewusst von generischen Lern-App-Optiken ab (weder kindlich-comichaft, noch trocken-korporates Dashboard).

**Abgrenzung (was es NICHT werden soll):** Nicht verspielt-albern (Zielgruppe ist 13–14 Jahre, Inhalt ist fachlich ernst zu nehmen). Keine Papiertextur, die Kontrast/Lesbarkeit mindert. Keine handschriftliche Zierschrift für Fließtext oder Zahlenwerte – Verspieltheit nur in Rahmen, Etiketten und Icons, nie auf Kosten der Lesbarkeit.

---

## 2. Farbpalette

Erdig, waldnah, gedeckt – keine grellen „App-Farben". Alle sechs Werte sind Startpunkte; Feintuning durch Claude Code beim Bauen ist erwartet, die **Rollen** sind aber verbindlich.

| Rolle | Hex (Richtwert) | Verwendung |
|---|---|---|
| Papier/Hintergrund | `#EFE9DC` | Seitenhintergrund, Karten-Hintergrund |
| Tinte/Text | `#2B2A26` | Fließtext, Beschriftungen |
| Moosgrün | `#4C6E4A` | Vitalität, gesunder Baumbestand, Symbiose-Kante |
| Rindenbraun | `#6B4A34` | Konkurrenz-Kante, Stämme/Totholz-Icons |
| Bernstein/Rost | `#B5651D` | Warnung, Störung, Fraß-Kante, kritische Werte |
| Gedecktes Himmelblau | `#5C7A8A` | Wasser/Abiotik, Bodenfeuchte-Indikator |
| Signalrot (sparsam!) | `#9A3324` | NUR für „Kollaps"-Zustand (Fichtenmonokultur), nicht für normale Störungswerte |

**Verbindliche Regel (Barrierefreiheit, siehe Technikdokument 5.5):** Farbe ist **nie** der einzige Träger von Information. Jede farbcodierte Fläche/Linie bekommt zusätzlich ein Symbol, Muster oder eine Beschriftung (konkret in Abschnitt 5).

---

## 3. Typografie

Drei Rollen, maximal zwei Schriftfamilien (Offline-Vorgabe beachten – siehe Abschnitt 8):

1. **UI/Fließtext:** robuste, gut lesbare humanistische Sans-Serif (System-Font-Stack, z. B. `-apple-system, "SF Pro", "Segoe UI", sans-serif` – lädt garantiert offline, kein Font-Download nötig). Für alle Bedienelemente, Fließtexte, Reflexionsfragen.
2. **Etiketten/Feldnotiz-Akzent:** eine zweite, charaktervollere Schrift **nur** für Artennamen-Überschriften auf Steckbriefen und für „gestempelte" Elemente (siehe Signatur-Element, Abschnitt 6) – z. B. eine schlichte Slab-Serif oder leicht handschriftlich wirkende Display-Schrift, sparsam eingesetzt, niemals für Fließtext oder Zahlenwerte.
3. **Daten/Zahlen:** wissenschaftliche Artnamen grundsätzlich *kursiv* (Vorgabe aus der Wissensbasis), Zahlenwerte in der UI-Schrift, nicht im Etiketten-Font (Lesbarkeit von Zahlen hat Vorrang vor Stimmung).

---

## 4. Illustrationsstil (Bäume, Tiere, Pilze)

**Stilentscheidung:** Detailreiche, texturierte Illustrationen im Stil botanischer Feldskizzen/Herbarium-Tafeln – erkennbare Artmerkmale, leichte Ink-/Aquarell-Anmutung, kein Comic-Stil, keine Foto-Realistik.

**Zustände statt Live-Animation:** Jede zentrale Art (mind. Fichte, Buche, Eiche, Kiefer, Birke, Borkenkäfer) bekommt **vorgerenderte Zustandsvarianten** als eigene Grafik-Assets, zwischen denen die App umschaltet:

| Zustand | Beispiel Fichte |
|---|---|
| Gesund/vital | volle Krone, sattes Grün |
| Gestresst | leicht verfärbte Nadeln, hängende Zweige |
| Befallen/geschädigt | braune Flecken, Bohrlöcher/Bläueverfärbung sichtbar |
| Abgestorben/umgestürzt | kahl bzw. liegend |
| Totholz/Sukzession | verwittert, mit Pilzfruchtkörpern, ggf. Pionierbewuchs |

Der Wechsel zwischen Zuständen erfolgt als **Sprite-Tausch mit sanftem Überblenden**, nicht als prozedural neu berechnete Textur – siehe technische Begründung in Abschnitt 8.

---

## 5. Netzwerk-Graph (Phase 2)

- **Knoten** = kleine „Karteikarten"/Etiketten-Optik (Papierfarbe, dünner Rahmen, Art-Icon + Name), keine reinen Kreise/Kästen ohne Illustration.
- **Kanten** werden **farbig UND mit einem kleinen Symbol direkt auf der Linie** gekennzeichnet (Nutzer-Entscheidung). Vorschlag für die fünf Beziehungstypen:

| Beziehungstyp | Farbe | Symbol auf der Kante |
|---|---|---|
| Fraß (trophisch) | Bernstein/Rost | kleiner „Biss"/Zahn-Icon |
| Symbiose | Moosgrün | verschlungene Ringe/Wurzel-Icon |
| Konkurrenz | Rindenbraun | zwei sich überlappende Kronen-Silhouetten |
| Zersetzung | gedämpftes Violett-Braun (neu, z. B. `#6E5A63`) | Spiral-/Pilzhut-Icon |
| Abiotische Kopplung | Himmelblau | Tropfen-/Sonnen-/Thermometer-Icon je nach Faktor |

- **Kantenstärke** (schwach/mittel/stark aus der Beziehungstabelle) = Linienstärke, zusätzlich als Tooltip/Steckbrief-Text beim Antippen – nicht nur über die Dicke erkennbar.
- **Hervorhebung des tatsächlich abgelaufenen Kaskadenpfads:** wirkt wie eine nachgezogene Tinten-/Textmarker-Spur, die sich Schritt für Schritt entlang der aktivierten Kanten „einzeichnet" – ein einzelner, bewusst gesetzter Animationsmoment (siehe Abschnitt 7), nicht mehrere gleichzeitige Effekte.
- **Vergleichsansicht zweier Waldtypen:** zwei Feldbuch-Seiten nebeneinander („aufgeschlagenes Doppelblatt"), keine geteilte Standard-UI-Ansicht.

---

## 6. Dashboard (Phase 1) – Instrumenten-Motiv

Die sechs Indikatoren (Baumbestand, Schädlingspopulation, Totholz, Kronendach, Bodenfeuchte, Biodiversität) werden als **Feldmessinstrumente** dargestellt statt als generische Fortschrittsbalken:

- Bodenfeuchte → stilisierter Regenmesser/Bodenprobe-Symbol
- Temperatur-Bezug/Schädlingsdruck → stilisiertes Thermometer
- Biodiversität → kleines Symbol-Set (z. B. Anzahl sichtbarer Arten-Icons statt reiner Zahl)

Jede Anzeige kombiniert: **Symbol + Skala (niedrig/mittel/hoch als Balken oder Zeiger) + kurzes Textlabel** – nie Farbe allein (Bernstein/Rost = Warnstufe, aber immer mit Zeigerstellung/Symbolveränderung gekoppelt).

Baum-/Tier-Symbole auf dem Dashboard nutzen dieselben Zustands-Sprites aus Abschnitt 4.

---

## 7. Signatur-Element & Animation

**Signatur-Element (das eine wiedererkennbare Detail der App):** Jeder abgeschlossene Simulations-Durchlauf im Forscherheft erhält einen **gestempelten Beobachtungs-Vermerk** (Datum + Waldtyp + Störung, optisch wie ein Feldbuch-Stempel/Siegel). Dieses Element taucht konsistent überall dort auf, wo etwas „abgeschlossen/dokumentiert" wird, und wird nicht für andere Zwecke wiederverwendet.

**Animationsgrundsatz:** Sparsam und zweckgebunden, maximal ein deutlicher Bewegungsmoment pro Interaktion:
1. Zustandswechsel eines Art-Sprites (Sanftes Überblenden, siehe Abschnitt 4)
2. Das schrittweise „Einzeichnen" des Kaskadenpfads im Graphen (Abschnitt 5)
3. Der Stempel-Effekt beim Abschließen eines Durchlaufs (Abschnitt 6/7)

Keine Dauerbewegung, kein dekoratives Partikel-/Hintergrund-Rauschen (Performance + lenkt vom Lerninhalt ab).

---

## 8. Technische Umsetzungshinweise für Claude Code (Performance hat Vorrang)

- **Format bevorzugt SVG** für Icons, Etiketten, UI-Elemente (skalierbar, klein, offline-freundlich, kein Texturaufwand). Für die „detailreichen, texturierten" Art-Illustrationen (Abschnitt 4) ist **handgezeichnetes SVG mit begrenztem Detailgrad** die erste Wahl; nur falls eine Textur/Aquarell-Anmutung damit nicht überzeugend umsetzbar ist, ersatzweise wenige, lokal gebündelte **WebP-Sprites** (keine Live-Filter wie `feTurbulence` in Echtzeit-Animation, das kostet auf älteren iPads spürbar Leistung).
- **Zustände als fertige Assets, nicht live berechnet:** pro Art 3–5 Zustandsvarianten (siehe Tabelle Abschnitt 4) als separate, vorbereitete Grafiken; Wechsel per CSS-Crossfade oder einfachem Sprite-Tausch.
- **Alles lokal einbinden**, keine CDN-Schriften/-Icons (Offline-Pflicht aus dem Technikdokument, Abschnitt 5.2).
- **Große Touch-Ziele bleiben Pflicht** trotz illustrativem Stil – Etiketten/Karten im Graph und Dashboard-Instrumente müssen für Partnerarbeit an einem iPad gut antippbar bleiben (Technikdokument 5.5).
- Bei Zielkonflikt zwischen „möglichst detailreiche Textur" und „flüssig auf älteren iPads": **Performance gewinnt**, Detailgrad wird reduziert, nicht die Bildsprache aufgegeben – d. h. lieber ein einfacheres, aber sauberes Feldskizzen-SVG als eine schwere Textur-Grafik.

---

## 9. Kurzreferenz für Claude Code

| Element | Entscheidung |
|---|---|
| Gesamtstil | Feldbuch/Naturjournal |
| Farbpalette | siehe Tabelle Abschnitt 2 (waldnah, gedeckt, Signalrot nur für Kollaps) |
| Typografie | System-Sans für UI/Zahlen, eine Akzentschrift nur für Artennamen/Etiketten |
| Art-Illustrationen | detailreich, texturiert, als vorgerenderte Zustands-Sprites (SVG bevorzugt) |
| Graph-Kanten | Farbe + Symbol pro Beziehungstyp, Linienstärke = Kantenstärke |
| Dashboard | Feldmessinstrumente-Optik, Symbol + Skala + Text, nie Farbe allein |
| Signatur-Element | Beobachtungs-Stempel im Forscherheft |
| Animation | max. 1 Moment pro Interaktion, keine Dauerbewegung |
| Technische Priorität bei Konflikt | Performance auf älteren iPads > Detailgrad der Illustration |
