# Prompt-Vorlage für die Art-Illustrationen (externe Bildgenerierung)
## Ergänzung zu „Styleguide: Visuelle Gestaltung der Waldökosystem-Simulation"

**Zweck:** Diese Vorlage dient dazu, die im Styleguide (Abschnitt 4) festgelegten „detailreichen, texturierten" Art-Illustrationen mit einem externen Bildgenerator (z. B. ChatGPT/DALL-E, Midjourney, Gemini-Bildgenerierung) zu erzeugen, **bevor** die Dateien an Claude Code übergeben werden. Claude Code selbst generiert keine Pixelgrafiken – siehe Diskussion oben. Ziel dieser Vorlage ist, dass alle Sprites trotz unterschiedlicher Generierungs-Durchläufe wie aus **einem Skizzenbuch** wirken.

**Sprache der Prompts:** Der eigentliche Prompt-Text ist bewusst auf Englisch gehalten, weil Bildgeneratoren damit erfahrungsgemäß zuverlässiger arbeiten. Die Erklärungen drumherum bleiben Deutsch.

---

## 1. Stil-Baustein (Master-Prompt) – in JEDEN Prompt einfügen

Dieser Block bleibt **wortgleich** in jedem einzelnen Prompt enthalten. Er ist der eigentliche Garant für den einheitlichen „Feldbuch"-Look über alle ~15 Sprites hinweg:

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

## 2. Vorlagen-Struktur pro Einzelbild

```
[SPEZIES-BESCHREIBUNG], [ZUSTANDS-BESCHREIBUNG MIT KONKRETEN SICHTBAREN MERKMALEN].

[STIL-BAUSTEIN AUS ABSCHNITT 1]
```

Die Zustandsbeschreibung sollte **konkrete, aus der Wissensbasis ableitbare Merkmale** nennen (z. B. „Bohrlöcher in der Rinde", nicht nur „krank aussehend") – das macht die Illustration didaktisch stimmig und für die Bildgeneratoren eindeutiger.

---

## 3. Konkrete Prompt-Beispiele (empfohlener Kern-Satz an Sprites)

Diese Auswahl deckt genau die **vier offiziellen Störungsszenarien** und die **drei Waldtypen** ab – bewusst kein vollständiger 28-Arten-Satz (das wäre Abschnitt 6 vorbehalten, falls das Lexikon-Feature kommt).

### Fichte (*Picea abies*) – zentrale Art, braucht den vollen Zustandssatz

| Datei-Name | Zustand | Prompt (Zustandsteil, vor den Stil-Baustein setzen) |
|---|---|---|
| `fichte_gesund.png` | gesund | „A single Norway spruce (Picea abies), young to medium-sized, healthy condition: dense dark-green needle crown, straight trunk, intact reddish-brown bark." |
| `fichte_gestresst.png` | Trockenstress | „...drought-stressed condition: slightly drooping branches, needle color dulling from green to yellowish at the tips, otherwise intact silhouette." |
| `fichte_befallen.png` | Borkenkäfer-Befall | „...bark-beetle infested condition: small round entry holes scattered across the bark, faint blue-grey staining visible where bark has flaked away, reddish-brown dying needles at the crown, small resin tears near the holes." |
| `fichte_abgestorben.png` | abgestorben/umgestürzt | „...dead and toppled condition: trunk fallen at an angle with an exposed shallow root plate, bare branches, greyish weathered bark." |
| `fichte_totholz.png` | Totholz/Sukzession | „...decaying deadwood log lying on the ground, peeling bark, small bracket fungi growing on the surface, patches of moss." |

### Buche (*Fagus sylvatica*) – Referenzart, zeigt Resilienz

| Datei-Name | Zustand | Prompt (Zustandsteil) |
|---|---|---|
| `buche_gesund.png` | gesund | „A mature European beech (Fagus sylvatica), healthy condition: dense rounded crown, smooth grey bark, vivid green leaves." |
| `buche_gestresst.png` | leichter Trockenstress | „...mild drought stress: crown slightly thinner than normal, a few yellowing leaves at the margins, bark otherwise smooth and healthy." |

### Eiche (*Quercus robur/petraea*) – zeigt Trockentoleranz

| Datei-Name | Zustand | Prompt (Zustandsteil) |
|---|---|---|
| `eiche_gesund.png` | gesund/stabil | „A mature oak (Quercus robur), healthy and stable condition: irregular open crown, deeply furrowed bark, lobed green leaves." |

### Kiefer (*Pinus sylvestris*) – Trocken-Spezialist

| Datei-Name | Zustand | Prompt (Zustandsteil) |
|---|---|---|
| `kiefer_gesund.png` | gesund/stabil | „A Scots pine (Pinus sylvestris), healthy condition: tall straight reddish-brown trunk, umbrella-like crown, long blue-green needle clusters." |
| `kiefer_gestresst.png` | leichter Trockenstress (optional) | „...very mild drought stress: slightly shortened needles with a few browning tips, otherwise upright and intact." |

### Birke (*Betula pendula*) – Pionierbaumart

| Datei-Name | Zustand | Prompt (Zustandsteil) |
|---|---|---|
| `birke_pionier.png` | junger Pionier (Sukzession) | „A young silver birch (Betula pendula) sapling, pioneer condition: slender white bark with black diamond markings, light airy crown of small green leaves, upright young growth." |

### Borkenkäfer (*Ips typographus*) – Störungstreiber

| Datei-Name | Zustand | Prompt (Zustandsteil) |
|---|---|---|
| `borkenkaefer_einzeln.png` | geringe Dichte | „A single European spruce bark beetle (Ips typographus), macro specimen view: small reddish-brown cylindrical beetle with a ridged wing case, resting on a plain background." |
| `borkenkaefer_massenvermehrung.png` | Massenvermehrung | „A small cluster of several European spruce bark beetles (Ips typographus) together on a fragment of bark, indicating a population outbreak." |

### Totholz (generische Ressource, unabhängig von Baumart)

| Datei-Name | Zustand | Prompt (Zustandsteil) |
|---|---|---|
| `totholz_generisch.png` | Ressource/Habitat | „A fallen, decaying log fragment: weathered grey-brown wood, peeling bark, small bracket fungi and moss patches, one or two visible insect boreholes." |

**Summe Kern-Satz: 14 Sprites.** Das ist bewusst schlank gehalten (Prinzip „didaktische Reduktion" aus der Wissensbasis) – ausreichend, um alle vier Störungsszenarien in allen drei Waldtypen visuell glaubwürdig darzustellen, ohne unnötigen Illustrationsaufwand.

---

## 4. Negativ-Liste (in Tools mit Negativ-Prompt-Feld eintragen, sonst im Prompt selbst ergänzen: „avoid: …")

```
avoid: cartoon style, flat vector illustration, glossy 3D render,
photorealistic photograph, neon or highly saturated colors, background
scenery or landscape, visible text, labels, watermark or signature,
multiple unrelated species in one image
```

---

## 5. Technische Export-Vorgaben

- **Canvas:** einheitlich quadratisch (1:1), Referenzgröße 1024×1024 px für den gesamten Satz – reicht für Retina-Darstellung als kleines Sprite, bleibt aber klein genug fürs Offline-Caching (siehe Technikdokument 5.2).
- **Hintergrund:** direkt auf dem Papierton `#EFE9DC` generieren (siehe Prompt), **nicht** transparent freistellen – dann lassen sich die Sprites ohne zusätzlichen Freistell-Schritt direkt auf den Feldbuch-Seitenhintergrund setzen, weil beide denselben Ton haben.
- **Format:** WebP (kleinere Dateigröße) oder PNG, je nachdem was der Bildgenerator anbietet – Claude Code kann beim Einbinden bei Bedarf noch konvertieren.
- **Dateibenennung:** an die Node-IDs aus dem Technikdokument (Abschnitt 4.5, JSON-Beispiel) angelehnt: `sprites/<art-id>_<zustand>.png`, z. B. `sprites/fichte_gestresst.png`. So kann Claude Code die Dateien ohne Rückfrage den passenden Knoten zuordnen.

---

## 6. Optional: Erweiterung fürs durchsuchbare Lexikon (nur falls Offener Punkt aus dem Technikdokument, Abschnitt 9, mit „ja" beantwortet wird)

Für die übrigen ~20 Arten (Reh, Rothirsch, Eichelhäher, Eichhörnchen, Buntspecht, Ameisenbuntkäfer, Fuchs, Habicht/Sperber, Luchs/Wolf, Mykorrhizapilz, Hallimasch, Zunderschwamm, Bläuepilz, Hasel, Holunder, Brombeere, Buschwindröschen, Waldmeister, Brennnessel, Heidelbeere, Raupen/Blattläuse) genügt jeweils **ein** Zustand (Normal-Erscheinungsbild) im selben Stil-Baustein, ohne Mehrfach-Zustände – das hält den zusätzlichen Aufwand überschaubar, falls das Lexikon umgesetzt wird. Gleiche Vorlagen-Struktur, gleicher Stil-Baustein, gleiche Namenskonvention (`sprites/<art-id>_portrait.png`).

---

## 7. Übergabe an Claude Code

1. Alle Bilder mit den obigen Prompts generieren, unter den vorgegebenen Dateinamen exportieren.
2. Dateien in einen Ordner (z. B. `assets/sprites/`) legen.
3. Diesen Ordner zusammen mit Wissensbasis, Technikdokument und Styleguide an Claude Code übergeben.
4. Claude Code übernimmt ab hier ausschließlich den Code-Teil: Einbinden, Zustands-Umschaltung per Sprite-Tausch/Crossfade (siehe Styleguide Abschnitt 4 und 8) – **keine** eigene Bildgenerierung.
