# Wissensbasis-Ergänzung: Waldbrand als eigenständige Kaskaden-Dynamik

**Zweck:** Fachliche Recherche-Vorarbeit für den Backlog-Eintrag „Überlegen, ob Brände auch simuliert werden sollten" (`Ideen_Backlog_Waldsimulation_Klasse8.md`) sowie für Meilenstein M35 (`docs/Milestones_Waldsimulation_Klasse8.md`). Reine Wissensgrundlage – **keine Freigabe zur Umsetzung**. Endet mit einer Go/No-Go-Empfehlung, über die der Nutzer entscheidet; M36 (Modell) und M37 (UI) beginnen erst nach einem "Go".

**Verhältnis zum Original-Wissensbasis-Dokument:** Dieses Dokument **ergänzt** `Mitteleuropäische_Waldökosysteme_Wissensbasis_v2.md`, ersetzt oder editiert es nicht (Rang-2-Quelle, unverändert). Das Original kennt bislang **kein eigenständiges Brand-Szenario** – Feuer kommt dort nur an zwei Stellen vor: als Waldtyp-Eigenschaft (Abschnitt 1, `resilienzfaktoren.feuer`, bereits im Code als `res_feuer`/`brandrisiko` abgebildet) und als Risikofaktor in Szenario 5 (Totholzentnahme zur Waldbrandprävention, Abschnitt 4). Eine echte Brand-**Dynamik** (Auslösung, Verlauf, Nachfolge) wäre ohne diese Ergänzung erfundener ökologischer Inhalt und damit laut CLAUDE.md/Quellen-Rangfolge nicht zulässig.

**Quellenlage:** Institutionelle/Fach-Quellen (DWD, LWF Bayern, waldwissen.net/WSL, NABU, FNR/Waldklimafonds) haben wie im Original Vorrang vor populären Quellen; einzelne Presse-Fachartikel (taz, weather.com) werden nur dort herangezogen, wo sie Forst-Fachleute wörtlich zitieren, und entsprechend gekennzeichnet.

---

## 1. Zündursachen und Witterungsabhängigkeit (allgemeiner Mechanismus)

Rund 46 % der Waldbrände in Deutschland haben ungeklärte Ursachen, ca. 27 % entstehen durch Fahrlässigkeit (Camper, Waldbesucher), knapp jeder fünfte vermutlich vorsätzlich – **Blitzschlag spielt in Deutschland anders als z. B. in Nordamerika nur eine untergeordnete Rolle** ([Statista/BMEL-Waldbrandstatistik](https://de.statista.com/infografik/27651/ursachen-fuer-waldbraende-in-deutschland-nach-jahr); [BMLEH – Waldbrandstatistik](https://www.bmleh.de/DE/themen/wald/wald-in-deutschland/waldbrandstatistik.html)). Ob eine Zündquelle (menschlich oder natürlich) tatsächlich zu einem ausgedehnten Brand führt, hängt aber ganz überwiegend von der **Witterung** ab: „Das Auftreten und die Ausbreitung von Waldbränden sind maßgeblich von der Witterung abhängig […] Klima und Witterung beeinflussen zusammen mit den lokalen Gegebenheiten (wie dem Vorhandensein von brennbarem Material) die Disposition einer Waldfläche für die Entzündung." 2025 vernichteten 1.175 Brände rund 2.626 ha – ein Vielfaches des langjährigen Mittels (844 ha, 1991–2024), ausgelöst durch ein besonders niederschlagsarmes, sonnenreiches Frühjahr ([BMEL-Statistik](https://www.bmel-statistik.de/forst-holz/waldbrandstatistik)).

Der Deutsche Wetterdienst bildet genau diese Witterungsabhängigkeit bereits seit Jahrzehnten operativ als **Waldbrandgefahrenindex (WBI)** ab: ein aus Lufttemperatur, relativer Luftfeuchte, Windgeschwindigkeit, Niederschlag, Schneehöhe und Strahlung berechneter Tageswert in 5 Gefahrenstufen (1 = sehr geringe, 5 = sehr hohe Gefahr; ab Stufe 4 sind lokale Einschränkungen möglich, ab Stufe 5 gilt die Lage als „sehr kritisch") ([DWD – Waldbrandgefahrenindex](https://www.dwd.de/DE/leistungen/waldbrandgef/waldbrandgef.html)). **Fachliche Grundlage für den in Abschnitt 6 vorgeschlagenen Auslösemechanismus:** ein Schwellenwert-Modell (Brand löst aus, sobald ein aus Trockenheit+Temperatur gespeister Risikowert eine Schwelle überschreitet) ist damit keine erfundene Modell-Vereinfachung, sondern strukturell dasselbe Prinzip, das die reale Gefahrenvorhersage in Deutschland verwendet – nur mit den im Simulationsmodell bereits vorhandenen Indikatoren (`brandrisiko`, gespeist aus `trockenheit`/`temperatur`) statt den originalen Wetterparametern.

---

## 2. Waldtyp-Abhängigkeit der Brandgefahr

### Mischwald und Kiefernwald: bereits im Original dokumentiert
Für die beiden Waldtypen mit gesetztem `feuer`-Resilienzwert liefert das Original bereits eine belegte Einschätzung (Abschnitt 1: Mischwald „geringere Waldbrandgefahr … liegendes Totholz wirkt eher feuchtigkeitsspeichernd" / Kiefernwald „hohe Waldbrandgefahr durch harzhaltiges Holz und trockene Nadelstreu"). Der allgemeine Mechanismus dahinter wird durch die Nachrecherche bestätigt und geschärft: Nadelstreu entzündet sich deutlich leichter als der humose Laubwald-Oberboden und kann sich „über Jahre anreichern, das brennt dann wie Zunder", während Laubstreu hohe Wasserspeicherkapazität besitzt und sich schneller zersetzt; altersgemischte, vertikal strukturierte Bestände beschatten und feuchten dadurch zusätzlich ([NABU – Waldbrandgefahr](https://www.nabu.de/natur-und-landschaft/waelder/lebensraum-wald/26646.html)). Besonders **junge, dichte Nadelholzkulturen** mit „rostrotem Feinreisig" gelten als kritisch: „Ein Bodenfeuer springt dort schnell hoch in die Kronen, und die können brennen wie ein Weihnachtsbaum" (Forstexperte Selbert, zitiert in [taz – Feuer im Nadelwald](https://taz.de/Feuer-im-Nadelwald/!5880731/)).

### Fichtenmonokultur: die Lücke (`data/waldtypen.json:69`, `"feuer": null`)
Das Original äußert sich nicht explizit zur Brandgefahr der Fichte – die Lücke im Datenmodell spiegelt also tatsächlich eine Lücke im Rang-2-Quelldokument, keinen Bearbeitungsfehler. Die Nachrecherche liefert für eine begründete Einordnung zwei konvergente Befunde:

1. **Fichten-Nadelstreu ist selbst stark brennbar**, wenn auch etwas weniger als Kiefer: „Die Fichte liefert Nadelstreu mit hohem Gehalt an ätherischen Ölen und ist somit sehr leicht brennbar … ein grüner Fichtenzweig verbrennt über einer offenen Flamme explosionsartig" – die Fichte sei „zwar nicht ganz so brennbar wie die Kiefer, aber [es gebe] viel trockenes Reisig … das Brandmaterial bildet" ([Recherche-Zusammenfassung mit Bezug auf Forstfachquellen, siehe Suchergebnis „Kiefer und Fichte" LWF/waldwissen.net](https://www.lwf.bayern.de/waldbau-bergwald/waldbau/160409/index.php)).
2. **Borkenkäfer-Totholz erhöht die Brandlast zusätzlich, wirkt aber nicht per se als Brandbeschleuniger.** Im Harz gilt: „Vier von fünf Fichten wurden seit dem Borkenkäferbefall geschädigt oder sind abgestorben … die Brandlast auf den Waldflächen hat dadurch zugenommen"; die Nationalpark-Verwaltung selbst betont zugleich, Totholz wirke **nicht** als Brandbeschleuniger oder Zündquelle, sondern eher als Brandschutz (Feuchtigkeitsspeicherung) – die tatsächliche Gefahr hängt vom **Zersetzungsgrad und der Lagerung** des Totholzes ab, nicht von der reinen Menge (vgl. bereits Original Abschnitt 4, Szenario 5, sowie [taz – Feuer im Nadelwald](https://taz.de/Feuer-im-Nadelwald/!5880731/); Kontext: [Harz-Klimawandel-Bericht](https://www.wiwo.de/technologie/wirtschaft-von-oben/wirtschaft-von-oben-248-harz-diese-bilder-zeigen-den-harzinfarkt-deutschlands-/29641530.html)).

**Empfehlung für die Lücke:** `feuer: "gering"` für die Fichtenmonokultur – tendenziell auf demselben Niveau wie der Kiefernwald (nicht auf Mischwald-Niveau), mit der Begründung, dass (a) Fichten-Nadelstreu selbst laut Quelle 1 stark brennbar ist, wenn auch nicht ganz so stark wie Kiefer, und (b) der im Modell bereits vorhandene Borkenkäfer-Kollaps in der Fichtenmonokultur real dokumentiert zusätzliche Brandlast erzeugt (Quelle 2) – ein didaktisch instruktiver Kaskaden-Pfad („Borkenkäfer schwächt/tötet Bestand → mehr trockenes Kronenmaterial und Totholz → höheres Brandrisiko bei gleichzeitiger Trockenheit"), der in **keinem** der beiden bereits gesetzten Waldtypen in dieser Form vorkommt. **Unsicherheit: MITTEL** – die Einordnung ist aus zwei plausiblen, aber nicht Fichtenmonokultur-spezifisch gemessenen Quellen abgeleitet (keine Studie beziffert direkt „Fichtenmonokultur vs. Kiefernwald"-Brandrisiko) → **Annahme, mit Lehrkraft abzugleichen**, wie die übrigen `resilienzfaktoren`-Einordnungen im Original auch.

---

## 3. Zielkonflikt-Prüfung gegen Szenario 5 (Totholzentnahme)

Das Original hält für Szenario 5 explizit fest, dass die Annahme „weniger Totholz = weniger Waldbrandgefahr" **wissenschaftlich nicht pauschal korrekt** ist: Entscheidend ist die Art des Totholzes (feines, trockenes Material erhöht die Gefahr am stärksten; große, wasserspeichernde liegende Stämme können sie sogar senken), der eigentliche Haupttreiber bleibt die Witterung, und der Effekt auf `brandrisiko` soll deshalb im Modell bewusst **klein/unsicher** bleiben (Original Abschnitt 4/7, bereits als `- 4 * res_feuer` in `model.py:329` umgesetzt).

Die Nachrecherche **bestätigt** diese Position, statt sie zu widerlegen: Brandenburgs Waldbrandschutzbeauftragter warnt ausdrücklich „Es wäre eher gefährlich für den Wald, alles Totholz herauszuholen" (der Boden trockne aus, die Luftfeuchtigkeit sinke), während ein NABU-Vertreter naturnahe Wälder „mit Totholz, kühlem Binnenklima und vielfältiger grüner Vegetation" gerade als Brandprävention empfiehlt ([taz – Feuer im Nadelwald](https://taz.de/Feuer-im-Nadelwald/!5880731/)). Auch die PYROPHOB-Forschung zu Kiefern-Brandflächen empfiehlt, Flächen **nicht** zu beräumen, weil das den Hitzestress des Bodens erhöht und die Regeneration behindert ([FNR/Waldklimafonds – Waldbrandfolgen und Wiederbewaldung](https://wald.fnr.de/wissen/themendossiers/waldbrand/details/waldbrandfolgen-und-wiederbewaldung)).

**Konsequenz für einen künftigen Feuer-Mechanismus (M36):** Ein endogen ausgelöster Brand darf den Totholzentnahme-Effekt auf `brandrisiko` **nicht** verstärken oder die didaktische Kernbotschaft aus Szenario 5 umdrehen. Der Auslösemechanismus sollte deshalb ganz überwiegend aus `trockenheit`/`temperatur` gespeist werden (wie in Abschnitt 1 hergeleitet), nicht aus `totholzmenge` – Totholzentnahme bliebe damit weiterhin ein schwacher, unsicherer Hebel auf das Brandrisiko selbst, mit dem bereits heute klar sichtbaren starken Effekt auf `biodiversitaet`. Diese Prüfung war laut Milestones-Dokument explizit Teil des M35-Auftrags und fällt **unauffällig** aus: kein Zielkonflikt gefunden, sofern der Auslöser wie hier empfohlen konstruiert wird.

---

## 4. Nachfolge-Sukzession nach einem Brand

Die mehrjährige PYROPHOB-Studie (Waldklimafonds/FNR) zu Brandenburger Kiefern-Brandflächen liefert hierzu die konkretesten, direkt auf einen im Modell bereits vorhandenen Waldtyp (Kiefernwald) übertragbaren Befunde:

- **Pioniere:** „Zitterpappeln und Birken [zeigen] auf den Brandflächen ein enormes Verjüngungspotenzial und eine hohe Biomasseentwicklung", während **Kiefern selbst nur langsam und nur in unmittelbarer Nähe bestehender Bestände** keimen ([FNR/Waldklimafonds – Waldbrandfolgen und Wiederbewaldung](https://wald.fnr.de/wissen/themendossiers/waldbrand/details/waldbrandfolgen-und-wiederbewaldung); Primärquelle: [Vegetationsentwicklung nach Waldbrand, PYROPHOB-Projektbericht](https://forst.brandenburg.de/sixcms/media.php/9/5_SCHUELE.pdf)).
- **Boden/Nährstoffe:** Die Feuerwirkung blieb in der Studie auf die obersten ca. 5 cm des Bodens begrenzt; die dabei freigesetzten Nährstoffe normalisierten sich „innerhalb von 4–5 Jahren".
- Diese Pionierarten-Dynamik deckt sich mit der bereits im Modell vorhandenen Birke/Brombeere-Logik für Kronendachverlust nach Sturm (`model.py`, `birke_anteil`/`brombeere_anteil` wachsen mit `100 - kronendach`) – ein Brandereignis wäre damit strukturell derselbe Kronendach-Öffnungs-Mechanismus wie Sturm, nur zusätzlich mit einem abrupten Totholz-Sprung statt eines graduellen Vitalitätsverlusts.

**Unsicherheit: GERING** für die Pionierarten-Richtung (Birke/Zitterpappel vor Kiefer/Baumarten des Altbestands), die genaue Geschwindigkeit relativ zur bereits im Modell verwendeten Sturm-Formel ist nicht direkt vergleichbar gemessen worden → bei einer Umsetzung müsste die Wachstumsrate geschätzt und als **Annahme, mit Lehrkraft abzugleichen** gekennzeichnet werden.

---

## 5. Biodiversitäts-Verlauf nach einem Brand

Kurzfristig ist ein Waldbrand ein reiner Verlust: „Für die Tierwelt bedeuten Waldbrände zunächst eine massive Störung … kleinere und wenig mobile Arten wie Reptilien, Amphibien, Insekten und Jungtiere sind besonders gefährdet" – **Pilze zählen laut waldwissen.net „kurz nach dem Brandereignis zu den Verlierern"** ([waldwissen.net – Waldbrände schaffen Artenvielfalt](https://www.waldwissen.net/de/waldwirtschaft/schadensmanagement/waldbrand/waldbraende-fuer-artenvielfalt)).

Mittel- bis langfristig kehrt sich das Bild um: „Die Situation verbessert sich nach den ersten Auswirkungen deutlich. Arten kehren schnell zurück und ihre Vielfalt übertrifft innerhalb weniger Jahre die des ehemaligen Waldes" – die kurzzeitig hellere Waldstruktur, der vegetationsfreie Boden und das kurzfristig reiche Nährstoffangebot aus der Asche bieten „für viele Pflanzen gute Lebensbedingungen, was wiederum Tieren, insbesondere Insekten und Spinnen, zugutekommt" ([IKV – Auswirkungen von Waldbränden auf Flora und Fauna](https://ikv.green/blog/die-auswirkungen-von-waldbraenden-auf-flora-und-fauna/); Bestätigung der zeitlichen Abfolge „Höchstwerte der Artenzahlen" zu einem bestimmten Zeitpunkt nach dem Brand bei [waldwissen.net](https://www.waldwissen.net/de/waldwirtschaft/schadensmanagement/waldbrand/waldbraende-fuer-artenvielfalt)). Mittelfristig profitieren insbesondere totholzgebundene Pilze vom entstehenden Brand-Totholz. Ein vergleichbares Muster – Artenvielfalt-Gewinn nach Störung statt reinem Verlust – ist für Borkenkäfer-Kalamitätsflächen in Deutschland bereits dokumentiert (Gewinn über „fast 20 taxonomische Gruppen hinweg, nicht nur bei Totholzbewohnern").

**Konsequenz für `biodiversitaet`:** kurzfristiger Einbruch im Brandjahr (analog zum bestehenden Totholzentnahme-Effekt, nur mit umgekehrtem Vorzeichen zur Ursache), anschließend eine – im Modell bislang einzigartige – **Erholung über den Ausgangswert hinaus**, keine bloße Rückkehr zum Vorher-Zustand. **Unsicherheit: MITTEL** – die Richtung ist gut belegt, der genaue zeitliche Verlauf (wie schnell, wie hoch der Überschwinger) ist eine didaktische Schätzung → **Annahme, mit Lehrkraft abzugleichen**.

---

## 6. Welcher bestehende Indikator reagiert wie (kein neuer Indikator nötig)

| Indikator | Bereits vorhanden? | Vorgeschlagene Reaktion auf ein Brandereignis |
|---|---|---|
| `brandrisiko` | Ja (`model.py`, `BASIS_BRANDRISIKO`) | Wird zum **Auslöser** selbst: steigt bei aktiver Trockenheit+Temperatur (Abschnitt 1), Brand löst aus, sobald ein Schwellenwert überschritten ist; fällt nach dem Brand deutlich (abgebranntes Material steht nicht erneut zur Verfügung). |
| `res_feuer` | Ja (`resilienzfaktoren.feuer`, aktuell `null` bei Fichtenmonokultur) | Bestimmt Auslöseschwelle/-wahrscheinlichkeit je Waldtyp (Abschnitt 2); Lücke schließen wie in Abschnitt 2 empfohlen. |
| `kronendach` | Ja | Starker, abrupter Einbruch im Brandjahr (stärker als Sturm, da Kronenfeuer laut Abschnitt 2 möglich) – „Kronendach ↓↓" laut M36-Kriterium. |
| `totholzmenge` | Ja | Anstieg durch abgestorbene/verkohlte Bäume, dann laut Abschnitt 4 langsamer Abbau über die Folgejahre – „Totholz ↑". |
| `birke_anteil` / `brombeere_anteil` | Ja | Wachsen wie nach Sturm mit dem Kronendachverlust, laut Abschnitt 4 nach einem Brand ggf. noch ausgeprägter (Kiefer selbst verjüngt sich laut Quelle kaum) – „Birke/Brombeere über Sukzession ↑". |
| `biodiversitaet` | Ja | Kurzfristiger Einbruch, danach Erholung über den Ausgangswert hinaus (Abschnitt 5) – „Biodiversität kurzfristig ↓ dann ↑". |
| `hallimasch_indikator`/`zunderschwamm_indikator` | Ja (bereits an `totholzmenge` gekoppelt) | Profitieren mittelfristig vom Totholz-Anstieg, kein neuer Mechanismus nötig (Abschnitt 5, „Pilze profitieren mittelfristig"). |

**Kein einziger neuer Indikator wird für ein Brand-Szenario benötigt** – alle relevanten Größen existieren bereits im Datenmodell (`gesamtvitalitaet`-Kaskade eingeschlossen, da Kronendach-/Totholz-Änderungen bereits heute die Baumvitalität mitbestimmen). Das senkt den Implementierungsaufwand für M36 gegenüber einem „Szenario mit eigenen Indikatoren" erheblich.

---

## 7. Endogener Auslösemechanismus – Konzept-Skizze (keine Code-Umsetzung)

Die Nutzer-Entscheidung (Milestones-Dokument, Grundsatzentscheidungen-Tabelle) legt bereits fest: **endogen ausgelöst, kein Auswahl-Häkchen** – Brand entsteht als Folge einer Kaskade (hohes `brandrisiko` bei gleichzeitiger Trockenheit/Temperatur), nicht als vom Schüler gewählte Ursache. Das entspricht strukturell dem in Abschnitt 1 beschriebenen DWD-Prinzip (Schwellenwert aus Witterungsgrößen). Konzeptionell, **ohne konkrete Formel oder Schwellenwert** (das wäre Aufgabe von M36 und dort gegen die Zeitreihen zu kalibrieren, nicht hier vorab zu erfinden):

- Auslösebedingung: `brandrisiko` überschreitet eine noch zu kalibrierende Schwelle **während** `trockenheit` und/oder `temperatur` aktiv sind (nicht bei ohnehin hohem Basis-`brandrisiko` allein, sonst würde z. B. der Kiefernwald ohne jede Störung irgendwann zwangsläufig brennen – das widerspräche der Abschnitt-1-Quelle, wonach die **aktuelle** Witterung, nicht nur der Waldtyp, entscheidend ist).
- Betroffener Waldtyp: `res_feuer` bestimmt, ob/wie schnell die Schwelle erreicht wird (Fichtenmonokultur und Kiefernwald deutlich früher als Mischwald, siehe Abschnitt 2).
- Kombinatorik bleibt unverändert (261 bzw. 357 Zeitreihen, kein neuer Auswahl-Zustand) – der Brand ist ein möglicher **Verlauf innerhalb** bereits bestehender Trockenheit/Temperatur-Konfigurationen, keine zusätzliche Achse.

---

## 8. Zusammenfassung der Quellenlage

DWD (Waldbrandgefahrenindex WBI) · BMEL/BMLEH-Waldbrandstatistik · Statista (Waldbrandursachen-Statistik) · NABU (Waldbrandgefahr: Baumarten/Waldstruktur) · LWF Bayern (Kiefer/Fichte-Mischung) · taz (Feuer im Nadelwald, mit Fach-Zitaten Forstexperte Selbert, NABU, Brandenburger Waldbrandschutzbeauftragter) · FNR/Waldklimafonds, Projekt PYROPHOB (Vegetationsentwicklung/Wiederbewaldung nach Waldbrand, Brandenburg) · waldwissen.net/WSL (Waldbrände schaffen Artenvielfalt) · IKV (Auswirkungen von Waldbränden auf Flora und Fauna) · wiwo.de (Kontext Borkenkäfer/Trockenheit im Harz).

---

## 9. Go/No-Go-Empfehlung

**Fachlich: Go.** Die Recherche findet für alle in Abschnitt 6 benötigten Reaktionen (Auslöseschwelle, Kronendach/Totholz-Einbruch, Birke/Brombeere-Sukzession, Biodiversitäts-Erholung) eine belastbare Quellengrundlage, keinen Zielkonflikt mit Szenario 5, und **keinen Bedarf an neuen Indikatoren** – der Aufwand bleibt näher an M33 (Refactoring bestehender Größen) als an einer komplett neuen Ereignis-Störung.

**Zu bedenken, bevor der Nutzer entscheidet:**
- **Didaktische Dichte:** Die Simulation deckt bereits 5 Ereignis-Störungen + 1 strukturelles Szenario in einer 45-Minuten-Stunde ab. Ein Brand als *unsichtbarer, nicht wählbarer* sechster Kaskadenpfad erhöht die Komplexität, ohne dass Schüler:innen ihn gezielt herbeiführen können – er träte nur als überraschende Folge in ohnehin schon gewählten Trockenheit/Temperatur-Läufen auf. Das ist genau die gewünschte „Folge, keine Ursache"-Eigenschaft (siehe Grundsatzentscheidung), macht das Feature aber auch leicht **übersehbar**, wenn er selten auftritt, oder **dominant**, wenn er zu oft auftritt – die Kalibrierung der Schwelle (M36) trägt entsprechend viel Gewicht.
- **Bildmaterial (M37):** Ein Brand-Ereignismarker im Dashboard und ein Brand-Kaskadenpfad im Netzwerk-Graph brauchen mindestens ein neues Sprite/Icon (siehe `Fehlende_Grafiken_Laufend_Waldsimulation_Klasse8.md`, dort bei Go einzutragen) – zusätzlicher Aufwand über M36 hinaus, den M43 (Hintergrundbilder) nicht mit abdeckt.
- **Kalibrierungsrisiko:** Anders als M33/M41 (reines Verschieben bestehender Werte) muss M36 eine **neue** Schwelle/Formel einführen und gegen alle 357 Zeitreihen so kalibrieren, dass sie weder nie noch fast immer auslöst – das ist der aufwendigste Teil der drei Milestones und lässt sich vorab nicht exakt beziffern.

Die Entscheidung liegt beim Nutzer: **Go** (M36 startet mit der in Abschnitt 6/7 skizzierten Grundlage) oder **No-Go** (Idee bleibt im Ideen-Backlog, dieses Dokument bleibt als Recherchestand erhalten, falls das Thema später erneut aufgegriffen wird).
