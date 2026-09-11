# Fehlende Grafiken – laufend während der Implementierung zu ergänzen
## Anweisung für Claude Code

**Diese Datei ist bei Projektstart leer und wird von dir (Claude Code) während der Umsetzung befüllt.**

Du erzeugst selbst **keine** Pixelgrafiken – das übernimmt weiterhin die Lehrkraft extern (ChatGPT/DALL-E, Midjourney, Gemini o. ä.), genau wie bei den bereits vorhandenen Arten-Illustrationen und den Bildern aus `Fehlende_Grafiken_Bekannt_Waldsimulation_Klasse8.md`.

### Vorgehen, sobald du beim Programmieren ein visuelles Element brauchst, das weder im bestehenden Sprite-Satz noch in `Fehlende_Grafiken_Bekannt_Waldsimulation_Klasse8.md` enthalten ist:

1. **Baue zuerst einen klar erkennbaren Platzhalter**, damit die App funktions- und testfähig bleibt, z. B.:
   - eine flache Farbfläche in der Projekt-Palette mit sichtbarer Textbeschriftung „TEMP: <Beschreibung>“, oder
   - ein bereits vorhandenes, thematisch ähnliches Sprite, deutlich mit einem Hinweis-Overlay als vorläufig gekennzeichnet.
   Der Platzhalter darf niemals wie ein fertiges Asset aussehen – er muss beim Testen sofort als offen erkennbar sein.
2. **Trage unten eine neue Zeile in die Tabelle ein** (nicht überschreiben, ergänzen).
3. Formuliere den Prompt-Entwurf bereits fertig einsetzbar, im etablierten Stil (Bausteine unten kopiert – nicht selbst neu erfinden, aus den Vorlagen leicht anpassen).
4. Wenn dir keiner der beiden bestehenden Stil-Bausteine passt (z. B. für ein reines UI-Icon), vermerke das explizit im Feld „Bildtyp“ und schlage kurz einen passenden Rahmen vor, statt einfach den falschen Baustein zu verwenden.

---

## Referenz: bestehende Stil-Bausteine (zum Kopieren, nicht verändern)

**A) Einzel-Exemplar (quadratisch, isoliert)** – für einzelne Arten, Objekte, symbolische Icons:
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

**B) Wald-Szene (breit, mehrere Bäume)** – für Waldansichten:
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

Negativ-Liste (für beide Bausteine gültig):
```
avoid: cartoon style, flat vector illustration, glossy 3D render,
photorealistic photograph, neon or highly saturated colors, background
scenery or landscape (außer bei Baustein B gewünscht), visible text, labels,
watermark or signature, multiple unrelated species in one image
```

---

## Tabelle: während der Implementierung entdeckte fehlende Grafiken

| # | Status | Dateiname (Vorschlag) | Verwendungsort in der App | Bildtyp (A / B / Sonstiges) | Prompt-Entwurf (Zustandsteil) | Priorität |
|---|---|---|---|---|---|---|
| 1 | geliefert (2026-08-26) | stoerung_wildverbiss.png | Wildverbiss-Regler (Kategorie „Strukturelles Ungleichgewicht", 2.10.2/3.2 Umsetzungsauftrag) auf dem Störungs-/Reglerbildschirm | A | „A symbolic illustration of overabundant deer browsing pressure on forest regeneration: a small browsed young sapling with visibly bitten-off shoot tips standing next to a healthy intact twig for contrast, evoking chronic selective browsing damage rather than a single acute event." | mittel |
| 2 | offen (Platzhalter: Emoji-Fallback 🔥 über die bestehende `sprite-missing`-Logik) | stoerung_waldbrand.png | Arten-Lexikon, neuer „Ereignisse"-Block (`js/lexikon.js` `renderEreignisse()`, M37) – Waldbrand ist kein Auswahl-Häkchen, hat also keine Feldkarte im Wizard, nur diese eine Anzeigestelle | A | „A symbolic illustration of a recently burned forest patch: a few charred, blackened tree trunks with smoke-grey bark standing among ash-dusted ground and pale regrowth shoots just emerging at the base, evoking the aftermath of a forest fire rather than active flames." | niedrig |

<!--
Beispielzeile zur Orientierung (bitte löschen, sobald die erste echte Zeile eingetragen wird):
| 1 | offen | rachel_carson_brief_rahmen.png | Bildschirm vor dem Rachel-Carson-Brief | A | "An old folded paper letter with a wax seal, tied with twine, resting on a wooden surface..." | mittel |
-->

---

## Abschluss-Hinweis für die Lehrkraft

Sobald diese Tabelle Einträge enthält: Prompts wie gewohnt extern generieren, Dateien unter dem angegebenen Namen in `assets/sprites/` ablegen und an Claude Code zurückgeben. Bis dahin läuft die App vollständig mit den Platzhaltern weiter.
