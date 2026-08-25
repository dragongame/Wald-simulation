# Fehlende Grafiken (bereits jetzt bekannt) – Waldsimulation Klasse 8
## Ergänzung zur „Illustrations-Promptvorlage" – zusätzlich zu den bereits generierten 38 Arten-/Zustandsbildern

**Zweck:** Beim Durchgehen aller Projektdokumente wurden Visuals identifiziert, die im bisherigen Illustrationssatz (Arten-Steckbilder) nicht abgedeckt sind, aber laut Technikdokument/User Stories gebraucht werden. Gleiches Vorgehen wie bisher: extern generieren (ChatGPT/DALL-E, Midjourney, Gemini o. ä.), unter dem angegebenen Dateinamen exportieren, in `assets/sprites/` ablegen und zusammen mit den übrigen Dateien an Claude Code übergeben.

**Wichtige Vereinfachung:** Die „stabil"-Variante jedes Wald-Endzustandsbilds (Liste A) dient **gleichzeitig** als Wald-Karte auf dem Startbildschirm – dafür müssen keine separaten Bilder erzeugt werden.

---

## 1. Bestehender Stil-Baustein (Einzel-Exemplar) – zur Erinnerung, unverändert

Gilt weiterhin für alles, was ein einzelnes Exemplar zeigt (bereits generierte Arten + neue Störungs-Icons, siehe Liste B):

```
Botanical field-journal illustration, ink-and-watercolor sketch style,
as if drawn in a naturalist's observation notebook. Moderate hand-drawn
detail with visible watercolor texture and fine ink linework — not
photorealistic, not a glossy 3D render, not flat cartoon/vector style.
Muted, earthy color palette: moss green, bark brown, warm amber/rust,
soft parchment tones. Single specimen, centered, side profile, isolated
on a plain warm off-white paper-colored background (#EFE9DC), no
scenery, no ground, no additional plants. No text, no labels, no
watermark, no signature. Square canvas, consistent lighting and framing.
```

## 2. Neuer Stil-Baustein (Wald-Szene) – für Liste A

Für die Wald-Zustandsbilder braucht es eine Mehrbaum-Ansicht statt eines Einzel-Exemplars. Gleiche Farbpalette/Tinte-Aquarell-Anmutung, aber andere Komposition:

```
Botanical field-journal illustration, ink-and-watercolor sketch style, as if
drawn in a naturalist's observation notebook. Moderate hand-drawn detail with
visible watercolor texture and fine ink linework — not photorealistic, not a
glossy 3D render, not flat cartoon/vector style. Muted, earthy color palette:
moss green, bark brown, warm amber/rust, soft parchment tones. A small forest
stand viewed from a slight distance, several trees with visible ground and
understory, on a plain warm off-white paper-colored background (#EFE9DC),
softly vignetted at the edges, no sky detail, no distant horizon. No text, no
labels, no watermark, no signature. Wide landscape canvas (roughly 16:9),
consistent lighting and framing across the whole set.
```

---

## 3. Liste A – Wald-Zustandsbilder (9 Bilder, dienen auch als Wald-Karten)

Drei Schweregrade × drei Waldtypen. Die `_stabil`-Bilder werden zusätzlich auf dem Startbildschirm als Wald-Karte verwendet (Technikdokument 4.1 / User Stories Szene 1).

| Datei-Name | Zustand | Prompt (Zustandsteil, vor Szenen-Stil-Baustein setzen) |
|---|---|---|
| `wald_mischwald_stabil.png` | gesund, **= Wald-Karte Mischwald** | „A small stand of a mixed European beech and oak forest, healthy and vigorous: dense layered green canopy of beech and oak crowns at different heights, a few young saplings and a species-rich herb layer at the base, indicating high structural diversity. No spruce trees present." |
| `wald_mischwald_geschaedigt.png` | lokal geschädigt | „...moderately damaged mixed beech-oak stand: most trees still green and upright, but one or two trees with thinning or yellowing crowns and a single fallen branch or small gap in the canopy, damage clearly localized rather than widespread." |
| `wald_mischwald_kollabiert.png` | schwerster vorgesehener Fall (weiterhin nur lokal!) | „...a mixed beech-oak stand with visible but still limited dieback: a small cluster of dead or fallen trees in one corner of the scene with a patch of deadwood and pioneer birch saplings starting to regrow there, while the majority of the stand remains green and intact — illustrating that damage stays localized even in a severe scenario." |
| `wald_fichtenmonokultur_stabil.png` | gesund, **= Wald-Karte Fichtenmonokultur** | „A dense, uniform stand of same-aged Norway spruce trees planted in even rows, healthy dark-green needle crowns, straight trunks, dark and sparse forest floor typical of a spruce plantation." |
| `wald_fichtenmonokultur_geschaedigt.png` | Trockenstress/Käferbefall früh | „...a spruce monoculture stand with visible drought and early bark-beetle stress: several trees with dulling, yellowing needle crowns and a few with reddish-brown patches, one or two trees with visible bark-beetle entry holes, but most trunks still standing." |
| `wald_fichtenmonokultur_kollabiert.png` | großflächiger Kollaps | „...a collapsed spruce monoculture stand: most trees dead, bare, or toppled with exposed shallow root plates, extensive bare ground and fallen deadwood logs, a few surviving spruce at the margins, small bracket fungi and moss beginning to appear on the fallen wood, illustrating large-scale dieback." |
| `wald_kiefernwald_stabil.png` | gesund, **= Wald-Karte Kiefernwald** | „An open, light-filled Scots pine forest on sandy soil, healthy tall reddish-brown trunks with umbrella-like crowns, sparse dry-adapted ground vegetation, a few birch trees mixed in." |
| `wald_kiefernwald_geschaedigt.png` | mittlerer Trockenstress | „...a Scots pine stand under moderate drought stress: several trees with slightly shortened, browning needle tips and a thinner crown, ground vegetation visibly dried out, but trunks still upright and stand structure intact." |
| `wald_kiefernwald_kollabiert.png` | starker Trockenstress | „...a heavily drought-stressed Scots pine stand: multiple trees with significant crown dieback, browned needle clusters, one or two dead standing trunks, dry cracked sandy soil visible at the base, but overall stand still more intact than a comparable collapsed spruce stand, reflecting the pine's higher drought tolerance." |

**Hinweis zur Verwendung:** Claude Code ordnet einen numerischen Simulations-Endwert (z. B. Baumbestand-Prozentsatz) einer der drei Stufen zu und zeigt das passende Bild im Analyse-Screen (Szene 4). Für Mischwald ist die `_kollabiert`-Stufe im Modell absichtlich schwer/selten erreichbar (Akzeptanzkriterium: nur lokaler Schaden) – das Bild liegt trotzdem bereit, falls eine seltene Extremkombination sie doch auslöst.

---

## 4. Liste B – Störungs-Auswahl-Icons (jetzt 4 Bilder, durch Szenario 5 ergänzt)

Für die Störungsauswahl auf dem Startbildschirm (Technikdokument 4.1: „kurze Beschreibung je Störung"). Borkenkäferbefall braucht **kein** neues Bild – dafür wird das bereits vorhandene `borkenkaefer_massenvermehrung.png` verwendet. Alle vier nutzen den **bestehenden Einzel-Exemplar-Stil-Baustein** (Abschnitt 1, quadratisch).

| Datei-Name | Kategorie | Prompt (Zustandsteil) |
|---|---|---|
| `stoerung_trockenheit.png` | Naturereignis | „A symbolic illustration of drought: a patch of cracked, dry earth with a single wilting plant, sparse and pale, evoking water scarcity." |
| `stoerung_temperatur.png` | Naturereignis | „A symbolic illustration of rising temperature: a simple thermometer with a high mercury level, surrounded by a few small radiating heat-shimmer lines." |
| `stoerung_sturm.png` | Naturereignis | „A symbolic illustration of a storm: a single bent tree silhouette leaning sharply in the wind, with a few curved wind-swirl lines around it." |
| `stoerung_totholzentnahme.png` | **Bewirtschaftungsmaßnahme (NEU, Szenario 5)** | „A symbolic illustration of deadwood removal: a pile of cut logs and branches stacked beside a single tree stump, evoking a deliberate forestry action rather than a natural event." |

**Hinweis:** Da Totholzentnahme kategorial anders ist (Bewirtschaftungsmaßnahme statt Naturereignis), sollte sich ihr Icon in der App zusätzlich durch einen anderen Rahmen/eine andere Randfarbe von den drei Naturereignis-Icons abheben (UI-seitig, kein separates Bild nötig).

---

## 4a. Liste D – Neuer Graph-Knoten (Szenario 5)

| Datei-Name | Prompt (Zustandsteil, Einzel-Exemplar-Stil-Baustein) |
|---|---|
| `mensch_bewirtschaftung_portrait.png` | „A symbolic illustration representing forest management by humans: a simple wooden-handled hand saw or bowsaw resting against a small stack of cut branches, no visible person, evoking a deliberate silvicultural action." |

**Hinweis zur Darstellung:** Bewusst **kein** Personen-/Menschenporträt (passt nicht zum übrigen Illustrationssatz und ist als Symbol für „Bewirtschaftung" ohnehin klarer). Falls im Lexikon/Graphen ein Name gebraucht wird: „Mensch (Bewirtschaftung)".

---

## 4b. Liste E – Zusätzliches Wald-Zustandsbild (Szenario 6, ergänzt Liste A)

Der Wildverbiss-Effekt sieht anders aus als akuter Schaden: keine toten Bäume, sondern ein äußerlich gesund wirkender, aber artenärmerer Bestand (Buchen-Reinbestand statt Buchen-Eichen-Mischung). Ergänzt die 9 Bilder aus Liste A um ein 10. Bild, gleicher Szenen-Stil-Baustein (Abschnitt 2):

| Datei-Name | Prompt (Zustandsteil) |
|---|---|
| `wald_mischwald_verarmt_reinbestand.png` | „A mixed forest stand that looks outwardly healthy and green, but has become dominated almost entirely by beech trees, with only a single small, struggling oak sapling visible at the edge — illustrating a gradual loss of tree species diversity rather than acute damage; the canopy remains full and intact." |

**Verwendung:** Im Analyse-Screen für Läufe mit hohem Wildverbiss-Regler und Waldtyp Mischwald, alternativ oder ergänzend zu den bestehenden drei Schweregrad-Bildern (die zeigen akuten Schaden, dieses zeigt chronische Verarmung).

---

## 5. App-Icon / PWA-Logo (1 Motiv)

Für `manifest.json` und das Home-Bildschirm-Symbol (Technikdokument 5.1) wird **ein** Motiv gebraucht, das anschließend in mehreren Auflösungen exportiert wird (typischerweise 192×192 und 512×512 px; die genauen von Claude Code benötigten Größen ergeben sich aus dem finalen `manifest.json`).

**Wichtig – anderer Ansatz als bei den übrigen Bildern:** Feine Aquarelltextur liest sich bei 48–192 px kaum noch. Für dieses eine Motiv daher **reduzierte, klare Formen** statt des vollen Detailgrads:

> „A simplified, iconic emblem combining an open field-journal notebook with a small leaf or sprig growing from its pages, minimal ink-linework, bold and simple enough to remain legible at very small sizes, same muted earthy color palette (moss green, bark brown, parchment) as the rest of the app, on a plain solid background, square canvas, no text, no watermark."

---

## 6. Technische Vorgaben (unverändert aus der Illustrations-Promptvorlage)

- Negativ-Liste (Abschnitt 4 der Illustrations-Promptvorlage) gilt unverändert für alle Bilder in diesem Dokument.
- Canvas: Liste A **breit/Landscape** (ca. 16:9) statt quadratisch; Liste B und das App-Icon **quadratisch** wie die bisherigen Arten-Sprites.
- Format: WebP oder PNG, Hintergrundfarbe `#EFE9DC` direkt mitgeneriert (außer beim App-Icon, dort reicht ein einheitlicher, plain Hintergrund).
- Dateibenennung wie oben angegeben, Ablage in `assets/sprites/`.

---

## 7. Zur Klarstellung: Was NICHT extern illustriert werden muss

Diese Elemente sind laut Styleguide (Abschnitt 8) ausdrücklich als einfache SVGs/CSS direkt im Code vorgesehen, keine externe Bildgenerierung nötig:

- Kanten-Symbole im Netzwerk-Graph (Biss-/Zahn-Icon, Wurzel-Ringe, Kronen-Silhouetten, Spiral-/Pilzhut-Icon, Tropfen-/Sonnen-/Thermometer-Icon)
- Feldmessinstrumente-Rahmen/Zeiger auf dem Dashboard
- Der Beobachtungs-Stempel (Signatur-Element) – nur bei Bedarf für einen aufwendigeren Look später extern nachreichen
- Allgemeine UI-Icons (Play/Pause/Zurück usw.)
