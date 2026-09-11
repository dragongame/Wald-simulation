# Fachliche Wissensbasis: Mitteleuropäische Waldökosysteme als didaktisch reduziertes Interaktionsnetzwerk
## Für die Entwicklung einer Waldökosystem-Simulation (8. Klasse Gymnasium, Sek I)

**Version 3** – erweitert um Szenario 5 (Totholzentnahme zur Waldbrandprävention, menschliche Bewirtschaftungsmaßnahme) und Szenario 6 (Wildverbiss durch Schalenwild-Überpopulation, strukturelles Ungleichgewicht).

Dieses Dokument liefert eine fachlich fundierte, didaktisch reduzierte Wissensbasis über mitteleuropäische Waldökosysteme als strukturierten Input für die Programmierung einer interaktiven Störungssimulation. Alle ökologischen Beziehungen sind so aufbereitet, dass sie leicht in eine Graph-/JSON-Struktur (Knoten = Arten bzw. abiotische Faktoren, Kanten = Beziehungen) überführt werden können.

---

## TL;DR (Kernaussagen)
- **Drei kontrastierende Waldtypen** – naturnaher Buchen-Eichen-Mischwald (hohe Resilienz), Fichtenmonokultur (geringe Resilienz, Käfer-/Trockenstress-anfällig) und Kiefernwald auf Sand (trockentolerant, aber feueranfällig) – bilden das Rückgrat des Modells und machen das abstrakte Konzept „Resilienz durch Vielfalt" erfahrbar. Nach der Bundeswaldinventur 2021/2022 ist die Kiefer mit 22 % inzwischen häufigste Baumart, gefolgt von Fichte (21 %), Buche (17 %) und Eiche (12 %); die Fichte hat erstmals ihren Rang als häufigste Art verloren und rund 17 % ihrer Fläche eingebüßt.
- **Das reduzierte Netzwerk umfasst ~28 Knoten** (Bäume, Sträucher, Pilze, Kräuter, Herbivoren, Prädatoren, abiotische Faktoren, Totholz) und deckt exemplarisch alle vier zentralen Beziehungstypen ab: Fraß (trophisch), Symbiose (Mykorrhiza, Käfer–Bläuepilz), Konkurrenz (Beschattung) und Zersetzung (Nährstoffkreislauf) – plus die abiotische Kopplung an Licht, Wasser und Temperatur.
- **Vier der sechs Störungsszenarien wirken als vernetzte Naturkaskaden:** Trockenheit und Sturm schwächen die Fichte → der Borkenkäfer vermehrt sich explosionsartig (bei Wärme bis 3 Generationen/Jahr, >100.000 Nachkommen pro Weibchen) → Baumsterben → Totholz und Sukzession. Genau diese Verkettung ist der didaktische Kern („Netzwerkdenken"/Systemdenken).
- **Ein fünftes Szenario ergänzt die Naturereignisse um eine menschliche Bewirtschaftungsentscheidung:** Die Entnahme von Totholz zur Waldbrandprävention erzeugt einen echten Zielkonflikt zwischen Sicherheit und Biodiversität – und zeigt zugleich, dass auch plausibel klingende Eingriffe („weniger Totholz = weniger Brandgefahr") wissenschaftlich differenziert zu betrachten sind, nicht pauschal richtig.
- **Ein sechstes Szenario (Wildverbiss durch Schalenwild-Überpopulation) macht sichtbar, dass Resilienz aktiv erhalten werden muss:** Fehlen große Beutegreifer (in Deutschland rund 150 Jahre lang ausgerottet, erst seit rund zwei Jahrzehnten regional zurückgekehrt) oder wird zu wenig gejagt, verbeißt Reh-/Rothirschwild bevorzugt die selteneren Mischbaumarten (Eiche, Tanne, Ahorn, Esche) aus der Verjüngung. So kann selbst der als „stabil" eingeführte Referenz-Mischwald A über Jahrzehnte schleichend zu einem Buchen-Reinbestand verarmen – ein wichtiger Gegenpol zum Bild „Mischwald ist automatisch dauerhaft resilient".

---

## 1. Einleitender fachlicher Überblick: Die gewählten Waldtypen

Nördlich der Alpen wäre Mitteleuropa von Natur aus fast vollständig bewaldet, dominiert von Buchen- und Eichenwäldern (Weltwald Freising; Wikipedia „Waldgesellschaften Mitteleuropas"). Die tatsächliche Zusammensetzung ist stark forstwirtschaftlich überprägt. Laut vierter Bundeswaldinventur 2021/2022 (BMEL/Thünen-Institut, bundeswaldinventur.de) ist die **Kiefer mit 22 % nun die häufigste Baumart Deutschlands**, gefolgt von **Fichte (21 %), Buche (17 %) und Eiche (12 %)**; die Fichte verlor erstmals ihren Spitzenplatz und rund 17 % ihrer Fläche – überwiegend durch Dürre und Borkenkäfer. Für die Simulation wurden drei kontrastierende Waldtypen gewählt, weil sie sich in Störungsverhalten, Stabilität und Artenzusammensetzung maximal unterscheiden.

### Waldtyp A: Naturnaher Buchen-Eichen-Mischwald (Referenz / „stabiles System")
- **Baumarten:** Rotbuche (dominant), Stiel-/Traubeneiche, beigemischt Hainbuche, Bergahorn, Esche; entspricht weitgehend der potenziellen natürlichen Vegetation (pnV).
- **Boden/Wasser:** meist tiefgründige, nährstoffreiche Braun-/Parabraunerden; ausgeglichener Wasserhaushalt durch tiefe und unterschiedlich strukturierte Wurzelsysteme (Herzwurzler Buche, Pfahlwurzler Eiche).
- **Krautschicht:** artenreich (Buschwindröschen, Waldmeister u.a.), vor allem im Frühjahr vor dem Laubaustrieb (Deutschlands Natur; NABU).
- **Stabilität/Resilienz:** HOCH. Arten- und Strukturvielfalt puffern Störungen ab; Schädlinge und Pilze breiten sich langsamer aus, weil nicht alle Bäume gleich sind; natürliche Feinde (z.B. Spechte) finden bessere Bedingungen. Mischwälder gelten laut KIT/ITAS-Studie (Rösch) als anpassungsfähiger und stabiler gegenüber Extremereignissen als Monokulturen.
- **Verjüngungsrisiko (relevant für Szenario 6):** Diese hohe Resilienz beruht auf der Vielfalt der *Verjüngungsschicht* (Eiche, Tanne, Ahorn, Esche neben Buche) – nicht nur der Altbäume. Genau diese Vielfalt ist durch selektiven Wildverbiss gefährdet: Ohne ausreichende Regulation durch Prädatoren oder Jagd kann die Mischbaumarten-Verjüngung über Jahrzehnte ausfallen, während die Buche als weniger verbissanfällige/konkurrenzstärkere Art nachrückt.
- **Brandverhalten (relevant für Szenario 5):** Durch Beschattung und höhere Luftfeuchtigkeit im Bestandsinneren generell geringere Waldbrandgefahr als in Nadelwäldern; liegendes Totholz wirkt hier eher feuchtigkeitsspeichernd als brandfördernd (siehe Szenario 5).

### Waldtyp B: Fichtenmonokultur / Forstplantage (wirtschaftlich, „anfälliges System")
- **Baumarten:** nahezu reine Gemeine Fichte (*Picea abies*), gleichaltrig, gleichförmig.
- **Boden/Wasser:** Fichte ist Flachwurzler („Tellerwurzel"). Nach LWF Bayern (LWF Wissen 80) bildet sie auf gut durchlüfteten Böden Senkerwurzeln bis ~2 m, auf feuchten/schlecht durchlüfteten Böden aber nur 20–40 cm tief. Das macht sie gleichzeitig **windwurf- UND trockenstressanfällig**. Fichtennadelstreu versauert den Boden.
- **Stabilität/Resilienz:** GERING. Fichtenmonokulturen bieten dem Buchdrucker optimale Vermehrungsbedingungen; fällt die eine Baumart aus, bricht das System großflächig zusammen. Die Fichte gilt als der „Problembaum" des Klimawandels in Deutschland und weist laut FVA Baden-Württemberg (Warlo & Moritzi 2026, waldwissen.net) unter allen wichtigen Baumarten das höchste biotische Risiko auf.

### Waldtyp C (Kontrast): Kiefernwald auf sandigem Boden („Trocken-Spezialist")
- **Baumarten:** Waldkiefer (*Pinus sylvestris*), oft Monokultur (z.B. Brandenburg, Lausitz), teils mit Birke (Pionierbaumart) durchsetzt.
- **Boden/Wasser:** anspruchslos, tiefwurzelnder Pfahlwurzler; übersteht Trockenheit und sandige, nährstoffarme Böden gut („Stresstoleranz-Stratege", LWF Wissen 57). Natürlicherweise nur auf Extremstandorten dominant, sonst durch Buchenkonkurrenz verdrängt (waldwissen.net „Rolle der Kiefern im Klimawandel").
- **Anfälligkeiten:** hohe Waldbrandgefahr durch harzhaltiges Holz und trockene Nadelstreu (an einem Hitzetag wurden bis zu 45 °C am Boden einer Kiefernmonokultur bei Rheinsberg gemessen, Tagesspiegel); artenarm.
- **Stabilität/Resilienz:** MITTEL gegenüber Trockenheit (besser als Fichte), aber GERING gegenüber Feuer. **Damit ist dies der für Szenario 5 (Totholzentnahme/Brandprävention) relevanteste Waldtyp** – reale forstliche Brandpräventionsdebatten in Deutschland drehen sich überwiegend um genau solche sandigen Kiefernreviere.

---

## 2. Artenliste mit Steckbriefen

Jeder Steckbrief enthält Simulationsparameter (Trophieebene, Trockenheitsresistenz, Vermehrungsrate, Rolle). Diese sind didaktisch skaliert (niedrig/mittel/hoch), wo keine exakten Zahlen sinnvoll sind.

### BÄUME (Produzenten, Trophieebene 1)

**1. Rotbuche (*Fagus sylvatica*)** – *Auswahl: Schlüsselart der pnV, zeigt Konkurrenz & Schattendominanz.*
Nach Prof. G. Aas (LWF Wissen 86) „in Mitteleuropa die häufigste und von Natur aus konkurrenzstärkste Baumart". Herzwurzler; extrem schattentolerant (Jungpflanzen wachsen bei nur ~20 % Licht) und beschattet mit dichter Krone alle Konkurrenten. Trockenheitsresistenz: MITTEL-GERING (reagiert empfindlich auf jüngste Dürren). Rolle: Klimaxbaumart, „Mutter des Waldes".

**2. Stiel-/Traubeneiche (*Quercus robur / Q. petraea*)** – *Auswahl: zeigt Licht-Nische & Trockentoleranz.*
Lichtbaumart (konkurrenzschwach im Schatten), tiefe Pfahlwurzel (>1 m selbst auf Tonböden) → gute Trockenheitsresistenz (MITTEL-HOCH) und Standfestigkeit. Laut LWF (LWF aktuell 88) unterliegt sie ohne menschliches/tierisches Zutun der „übermächtigen Buchenkonkurrenz" und behauptet sich natürlich nur auf trocken-warmen, staunassen oder bodensauren Extremstandorten. Verjüngung stark abhängig von Eichelhäher/Eichhörnchen.

**3. Gemeine Fichte (*Picea abies*)** – *Auswahl: zentrale Art für Borkenkäfer-/Trockenszenario.*
Flachwurzler → windwurf- und trockenstressanfällig. Trockenheitsresistenz: GERING (nach LWF aktuell 126 unter den Nadelbäumen am geringsten). Hauptwirt des Buchdruckers. Wirtschaftlich wichtigste, aber ökologisch riskanteste Art.

**4. Waldkiefer (*Pinus sylvestris*)** – *Auswahl: Trocken-Spezialist, Feuer-Szenario.*
Pfahlwurzler, Pionier- und Stresstoleranz-Stratege; hohe Trockenheitsresistenz (HOCH). Hohe Waldbrandgefahr. Geht mit vielen Mykorrhizapilzen Symbiosen ein.

**5. Hänge-Birke (*Betula pendula*)** – *Auswahl: Pionierbaumart, Sukzession/Wiederbesiedlung.*
Lichtbedürftig, schnellwüchsig, windverbreitete leichte Samen; besiedelt Störflächen (Windwurf, Käferflächen) als erste. Trockenheitsresistenz: MITTEL. Rolle: Pionier, leitet Wiederbewaldung ein.

### STRÄUCHER (Produzenten, Trophieebene 1)

**6. Hasel (*Corylus avellana*)** – Windblüher, Nüsse als wichtige Tiernahrung (Eichhörnchen, Eichelhäher); Strauch- und Waldrandart.

**7. Schwarzer Holunder (*Sambucus nigra*)** – Beeren als Vogelnahrung; Samenverbreitung durch Vögel (Endozoochorie, waldwissen.net); nährstoff-/lichtliebend, Störzeiger.

**8. Brombeere (*Rubus fruticosus* agg.)** – dominiert schnell lichte/gestörte Flächen (Windwurf, Kahlflächen); konkurriert mit Baumverjüngung um Licht; Deckung/Nahrung für Kleintiere.

### PILZE (Destruenten / Symbionten / Pathogen)

**9. Mykorrhizapilze (z.B. Steinpilz *Boletus edulis*)** – *Auswahl: Symbiose-Konzept.*
Ektomykorrhiza mit Buche, Eiche, Fichte, Kiefer. Liefert Wasser + Nährstoffe (Phosphor, Stickstoff), erhält Zucker aus der Photosynthese (NABU; WSL/waldwissen.net). Vernetzt Bäume („Wood Wide Web"). Erhöht Trockenheits- und Krankheitsresistenz der Bäume.

**10. Hallimasch (*Armillaria* spp.)** – *Auswahl: Doppelrolle Zersetzer + Schwächeparasit.*
Saprophyt (zersetzt Totholz, Nährstoffkreislauf) UND Parasit: befällt durch Trockenheit/Schädlinge geschwächte Bäume über Wurzeln, zerstört das Kambium → Baum stirbt (Waldbesitzer-Portal Bayern; Baumpflegeportal). Einer der größten Organismen der Erde. *Relevant auch für Szenario 5: als Totholzbewohner direkt vom Habitatverlust bei Totholzentnahme betroffen.*

**11. Zunderschwamm (*Fomes fomentarius*)** – *Auswahl: Totholz-Zersetzer der Buche.*
Weißfäule-Erreger, Charakterpilz des Buchen-Totholzes (LWF Wissen 86); recycelt Holz; Lebensraum für Insekten. *Relevant auch für Szenario 5.*

**12. Bläuepilz (*Ophiostoma/Ceratocystis* spp.)** – *Auswahl: Symbiont des Borkenkäfers, verstärkt Baumtod.*
Wird vom Buchdrucker übertragen (BFW Österreich); blockiert die Wasserleitung im Splintholz der Fichte → beschleunigt das Absterben. Enge Symbiose Käfer–Pilz.

### KRAUTSCHICHT (Produzenten, Trophieebene 1)

**13. Buschwindröschen (*Anemone nemorosa*)** – Frühblüher/Geophyt; nutzt Lichtfenster im Frühjahr vor Laubaustrieb; Indikator für Lichtverhältnisse (NABU; Lernhelfer).

**14. Waldmeister (*Galium odoratum*)** – Schattenpflanze nährstoffreicher Buchenwälder; namensgebend für den Waldmeister-Buchenwald (Deutschlands Natur).

**15. Brennnessel (*Urtica dioica*)** – Stickstoffzeiger; profitiert von Störung/Nährstofffreisetzung (z.B. nach Baumsterben); Raupenfutterpflanze.

**16. Heidelbeere (*Vaccinium myrtillus*)** – Säure-/Lichtzeiger saurer Kiefern-/Fichtenwälder; Nahrung für Tiere.

### PFLANZENFRESSER (Herbivoren / Konsumenten 1. Ordnung, Trophieebene 2)

**17. Buchdrucker / Borkenkäfer (*Ips typographus*)** – *ZENTRALE ART. Auswahl: Störungstreiber.*
Rindenbrüter an Fichte. Sekundärschädling: befällt normalerweise geschwächte Bäume, bei Massenvermehrung auch gesunde. Vermehrungsrate SEHR HOCH: bei 3 Generationen/Jahr können aus einem Weibchen (inkl. Geschwisterbruten) über 100.000 Nachkommen entstehen (LWF Bayern). Nach LWF genügt der gleichzeitige Angriff **einiger hundert Käfer** (eine Fichte kann mit 200–400 Weibchen/m² besiedelt werden), um die Harzabwehr auch einer vitalen Fichte zu überwinden. Aus einer befallenen Altfichte fliegen **mindestens 20.000 Käfer** aus; die davon ~10.000 Männchen können **rund 20 weitere Nachbarbäume** erfolgreich befallen (LWF Borkenkäfer-Infoportal). Braucht warm-trockene Witterung (optimal: trocken, heiß, windstill). Überträgt den Bläuepilz.

**18. Reh (*Capreolus capreolus*)** – *Zentrale Art für Szenario 6.* Verbiss an Jungbäumen/Knospen; selektiv (frisst bevorzugt Tanne, Ahorn, Eiche, Esche → „Entmischung"); wichtigster Verbisser; reguliert Waldverjüngung (WSL; wald.de). Verbreitung und Verbissdruck sind laut Verbissgutachten der Bundesländer in den letzten Jahren bundesweit angestiegen (FVA Baden-Württemberg).

**19. Rothirsch (*Cervus elaphus*)** – *Ebenfalls relevant für Szenario 6.* Verbiss + Schälen der Rinde; größerer Raumbedarf; verstärkt den Wilddruck auf die Verjüngung.

**20. Eichhörnchen (*Sciurus vulgaris*)** – frisst Samen (Bucheckern, Eicheln, Fichtensamen), verbreitet aber gleichzeitig schwere Samen (vergräbt Vorräte, findet nur ~50 % wieder) → Verjüngungshelfer. Beute von Habicht/Baummarder. *Bezug zu Szenario 6:* Seine Verjüngungsarbeit kann durch übermäßigen Wildverbiss zunichtegemacht werden, wenn die gekeimten Jungpflanzen abgefressen werden, bevor sie der Verbisshöhe entwachsen.

**21. Schmetterlingsraupen / Blattläuse (z.B. Eichenwickler, Grüne Fichtenröhrenlaus)** – Blatt-/Nadelfresser; Nahrung für insektenfressende Vögel; bei Massenvermehrung Entlaubung.

### PFLANZENVERBREITER / OMNIVORE (Trophieebene 2–3)

**22. Eichelhäher (*Garrulus glandarius*)** – *Auswahl: Schlüssel-Mutualismus Samenverbreitung.*
Kann bis zu 10 Eicheln pro Flug im Kropf transportieren und legt laut Wildtierportal Bayern (LWF) im Herbst **mehrere Tausend Verstecke pro Vogel** an (bis zu ~5.000 Eicheln pro Saison), von denen nur rund ein Fünftel wiedergenutzt wird → „Gärtner des Waldes"; unersetzlich für die Eichen-/Buchenverjüngung und den klimatoleranten Waldumbau. *Bezug zu Szenario 6:* Seine Aussaatleistung entfaltet nur dann Wirkung, wenn die daraus entstehenden Keimlinge nicht durch Wildverbiss abgefressen werden – Samenverbreitung und Verbissdruck wirken im Modell gegenläufig auf denselben Prozess (Verjüngungserfolg).

### JÄGER / PRÄDATOREN (Konsumenten höherer Ordnung, Trophieebene 3–4)

**23. Buntspecht (*Dendrocopos major*)** – *Auswahl: Borkenkäfer-Regulator (didaktisch zentral).*
Frisst Borkenkäfer und deren Larven unter der Rinde. Wirkt regulierend v.a. bei niedriger Käferdichte (verzögert den Ausbruchsbeginn), kann aber eine Massenvermehrung nicht stoppen – seine eigene Vermehrungsrate ist zu gering und die Reviere sind territorial begrenzt (WSL-Merkblatt 67, Wermelinger & Schneider Mathis 2021). Im naturnahen Mischwald spürbarer Einfluss, in der Fichtenmonokultur kaum (helpster.de). *Relevant auch für Szenario 5: Bruthöhlen entstehen bevorzugt in totem/geschwächtem Holz – Totholzentnahme reduziert daher indirekt auch das Bruthabitat.*

**24. Ameisenbuntkäfer (*Thanasimus formicarius*)** – *Auswahl: wichtigster Insekten-Gegenspieler.*
Räuber: der adulte Käfer frisst Borkenkäfer auf der Rinde, seine Larve die Brut darunter. Der Buchdrucker wird laut WSL-Merkblatt 67 „von gegen 300 verschiedenen Arten natürlicher Feinde, vor allem von räuberischen Käfern und parasitischen Wespen, in Schach gehalten"; der Ameisenbuntkäfer allein kann für rund 20 % der natürlichen Buchdrucker-Sterberate verantwortlich sein (waldwissen.net). Die Wirkung räuberischer Insekten wird höher eingeschätzt als die der Spechte. Selbst ebenfalls ein xylobiontes (holzgebundenes) Insekt – *auch er ist von Totholzstrukturen abhängig (Szenario 5).*

**25. Fuchs (*Vulpes vulpes*)** – Generalist; frisst Mäuse, Jungtiere, Aas; reguliert Kleinsäuger.

**26. Habicht/Sperber (*Accipiter gentilis / A. nisus*)** – Greifvögel; jagen Vögel und Eichhörnchen; Top-Prädator der Baumschicht.

**27. Luchs / Wolf (*Lynx lynx / Canis lupus*)** – *Auswahl: Trophic-Cascade-Konzept; zentrale Art für Szenario 6.*
Große Beutegreifer; regulieren Reh und Rothirsch. Nach KORA (Schweiz) erbeutet ein adulter Luchs rund **55 Rehe oder Gämsen pro Jahr**, ein Weibchen mit zwei Jungtieren ca. 70; er bevorzugt Rehe. Große Beutegreifer können den Verbissdruck auf die Waldverjüngung senken (indirekter Effekt = trophische Kaskade; nach Kupferschmid 2016/WSL signifikant geringerer Weißtannen-Verbiss nach Luchs-Ansiedlung), teils auch nur über Verhaltensänderung der Beute. **Historischer Kontext (Szenario 6):** Wolf und Luchs galten in Deutschland rund 150 Jahre lang als ausgerottet. Der Wolf ist erst seit den ersten frei geborenen Welpen im Jahr 2000 zurückgekehrt und erreichte laut Dokumentations- und Beratungsstelle des Bundes (DBBW) bis November 2025 bundesweit 219 Rudel, 43 Paare und 14 sesshafte Einzeltiere (rund 1.600 Individuen) – regional stark konzentriert auf den Nordosten Deutschlands (v.a. Brandenburg, Niedersachsen, Sachsen). Der Luchs wurde nur punktuell wiederangesiedelt (u.a. Harz, Bayerischer Wald, Pfälzerwald). Beide Arten decken also weiterhin nicht das gesamte Bundesgebiet ab; ihr regulierender Effekt auf Reh-/Rothirschbestände bleibt räumlich sehr ungleich verteilt. Im Modell repräsentiert diese Art die Option „funktionierende Prädator-Beute-Regulation" als Kontrastfall zu Szenario 6.

### DESTRUENTEN-EBENE (abiotisch-biotische Schnittstelle)

**28. Totholz (Ressource, kein Organismus)** – *Auswahl: Nährstoffkreislauf, Habitat – zentraler Knoten für Szenario 5.*
Substrat für Zersetzerpilze, Totholzkäfer, Wildbienen; Grundlage der Sukzession nach Störung. Käferflächen im Nationalpark Bayerischer Wald erwiesen sich als Biodiversitäts-Hotspots (Beudert et al. 2015; Nationalpark Bayerischer Wald). Rund 34 % aller in mitteleuropäischen Wäldern vorkommenden Arten gelten als xylobiont (holzgebunden), bei Käfern sogar über 50 % (Müller et al. 2008); rund 25 % der europäischen Käfer- und Pilzarten sind auf Totholz angewiesen. Die Artenzahl variiert stark nach Baumart: die Eiche beherbergt rund 650 holzbewohnende Käferarten, die Buche rund 240, die Fichte nur rund 60 (waldwissen.net) – ein direkter Anknüpfungspunkt an den Mischwald-vs.-Monokultur-Kontrast. Die Hälfte der xylobionten Käferarten steht auf der Roten Liste Deutschlands.

---

## 3. Das Interaktionsnetzwerk

### 3.1 Fließtext-Beschreibung der Beziehungstypen

**Trophische Beziehungen (frisst / wird gefressen):** Die Basis bilden die Produzenten (Bäume, Sträucher, Kräuter), die über Photosynthese Biomasse aufbauen. Herbivoren wie Reh, Rothirsch und Raupen fressen Blätter/Knospen; der Borkenkäfer frisst die Bastschicht der Fichte; das Eichhörnchen frisst Samen. Auf der nächsten Ebene fressen Prädatoren die Herbivoren: Buntspecht und Ameisenbuntkäfer fressen Borkenkäfer, Habicht frisst Eichhörnchen, Luchs/Wolf fressen Reh/Rothirsch.

**Symbiosen (beide profitieren):** Die wichtigste ist die Mykorrhiza – Pilze umhüllen die Feinwurzeln, liefern Wasser und Nährstoffe (Phosphor, Stickstoff) und erhalten im Gegenzug Zucker. Über das Pilz-Myzel sind Bäume sogar miteinander vernetzt. Eine zweite, für das Störungsszenario zentrale Symbiose ist Borkenkäfer–Bläuepilz: Der Käfer transportiert den Pilz, der Pilz hilft, die Baumabwehr zu überwinden.

**Zersetzung / Nährstoffkreislauf:** Zersetzerpilze (Hallimasch, Zunderschwamm) und der Borkenkäfer selbst bauen Totholz ab und führen Nährstoffe in den Boden zurück. Totholz ist Lebensraum und Startpunkt neuer Sukzession – und damit auch der zentrale Knoten für Szenario 5 (Totholzentnahme).

**Konkurrenz:** Die Buche beschattet und verdrängt lichtbedürftige Arten (Eiche, Fichte, Kraut). Brombeere konkurriert mit der Baumverjüngung. Bäume konkurrieren um Licht, Wasser und Nährstoffe.

**Mutualistische Samenverbreitung:** Eichelhäher und Eichhörnchen verbreiten schwere Samen (Eicheln, Bucheckern), Vögel die Beeren von Holunder/Brombeere.

**Abhängigkeit von abiotischen Faktoren:** Alle Produzenten hängen von Licht, Wasser, Temperatur und Boden ab. Die Fichte reagiert empfindlich auf Wassermangel; die Kiefer erträgt Trockenheit; das Buschwindröschen braucht das Frühjahrslichtfenster. Temperatur steuert direkt die Zahl der Borkenkäfer-Generationen.

**Prädator-Beute-Regulation:** Bei niedriger Käferdichte bremsen Buntspecht und Ameisenbuntkäfer den Käfer. Fehlen im Monokultur-System natürliche Feinde bzw. reicht ihre Vermehrungsrate nicht aus, kommt es zur Massenvermehrung. Große Beutegreifer regulieren Huftiere und damit indirekt den Verbiss (trophische Kaskade).

**Menschliche Bewirtschaftungseingriffe (neu, Szenario 5):** Anders als die übrigen Beziehungstypen ist dies keine rein ökologische, sondern eine sozio-ökologische Beziehung: Der Mensch entnimmt gezielt eine Ressource (Totholz) aus dem System, mit einem beabsichtigten Effekt (Sicherheit) und einem unbeabsichtigten Nebeneffekt (Habitatverlust). Diese Beziehung sollte im Graphen als eigener, visuell unterscheidbarer Kantentyp geführt werden (siehe Styleguide-Anpassung unten).

**Fehlende/unzureichende Prädator-Beute-Regulation (neu, Szenario 6):** Eine dritte Beziehungs-Kategorie neben Naturereignis und gezielter Maßnahme: ein *struktureller Mangel*. Historisch ausgerottete oder nur regional zurückgekehrte Großprädatoren (Luchs, Wolf) und/oder eine zu geringe Bejagung führen dazu, dass die Reh-/Rothirschdichte nicht mehr auf ein für die Verjüngung tragbares Maß begrenzt wird. Die Population wächst über die „Tragfähigkeit" der Verjüngungsfläche hinaus, ohne dass ein einzelnes, klar abgrenzbares Ereignis dies auslöst – die Störung ist chronisch/graduell statt punktuell.

### 3.2 Beziehungstabelle (für Graph-/JSON-Überführung)

| Quelle-Art | Ziel-Art | Beziehungstyp | Beschreibung / Richtung / Stärke |
|---|---|---|---|
| Borkenkäfer | Fichte | frisst/parasitiert | Bast/Rinde; tödlich bei Massenbefall; STARK |
| Bläuepilz | Fichte | schädigt | blockiert Wasserleitung; verstärkt Baumtod |
| Borkenkäfer | Bläuepilz | Symbiose | Käfer transportiert Pilz; Pilz schwächt Baumabwehr |
| Buntspecht | Borkenkäfer | frisst | reguliert v.a. bei geringer Dichte; SCHWACH-MITTEL |
| Ameisenbuntkäfer | Borkenkäfer | frisst | Räuber (adult+Larve); ~20 % der Käfer-Sterberate; MITTEL-STARK |
| Reh | Buche/Eiche/Kraut | frisst (Verbiss) | selektiv; hemmt Verjüngung; STARK |
| Rothirsch | Bäume | frisst/schält | Verbiss+Schälen; STARK |
| Eichhörnchen | Samen (Eiche/Buche/Fichte) | frisst | Konsument |
| Eichhörnchen | Eiche/Buche | verbreitet Samen | Mutualismus (vergräbt Vorräte) |
| Eichelhäher | Eiche/Buche | verbreitet Samen | STARK; Schlüssel für Verjüngung |
| Habicht/Sperber | Eichhörnchen/Vögel | frisst | Prädator |
| Fuchs | Kleinsäuger | frisst | Prädator |
| Luchs/Wolf | Reh/Rothirsch | frisst | reduziert Verbiss (Kaskade); Luchs ~55 Rehe/Jahr |
| Mykorrhizapilz | Buche/Eiche/Fichte/Kiefer | Symbiose | Wasser/Nährstoffe ↔ Zucker; STARK |
| Hallimasch | geschwächter Baum | parasitiert | Schwächeparasit; tötet Kambium |
| Hallimasch | Totholz | zersetzt | Nährstoffkreislauf |
| Zunderschwamm | Buchen-Totholz | zersetzt | Weißfäule |
| Buche | Eiche/Fichte/Kraut | konkurriert (Schatten) | verdrängt Lichtarten; STARK |
| Brombeere | Baumverjüngung | konkurriert | auf Störflächen; MITTEL |
| Raupen/Blattläuse | Blätter/Nadeln | frisst | Herbivorie |
| Buntspecht | Raupen | frisst | Prädator |
| Holunder/Brombeere | Vögel | Nahrung (Beeren) | Mutualismus (Verbreitung) |
| Licht (abiotisch) | Buschwindröschen/Eiche/Kiefer | ermöglicht | Lichtbedarf |
| Wasser (abiotisch) | Fichte | limitiert | Trockenstress bei Mangel |
| Temperatur (abiotisch) | Borkenkäfer | steuert | mehr Generationen bei Wärme |
| Totholz | Zersetzer/Käfer/Bienen | Habitat/Ressource | Biodiversitäts-Hotspot |
| **Mensch (Bewirtschaftung)** | **Totholz** | **entnimmt** | **Neu (Szenario 5): reduziert Totholzmenge zur Brandprävention; SCHWACH-MITTEL auf Brandrisiko, STARK auf Habitatverlust** |
| **Totholz** | **Hallimasch/Zunderschwamm/Buntspecht/Ameisenbuntkäfer** | **ist Habitat für** | **Neu (Szenario 5): Entnahme reduziert Bestände dieser Arten** |
| **Luchs/Wolf (fehlend/selten)** | **Reh/Rothirsch** | **reguliert nicht (Abwesenheit)** | **Neu (Szenario 6): ohne Prädationsdruck wächst die Population über die Verjüngungskapazität hinaus; STARK bei fehlender Regulation** |
| **Reh/Rothirsch (überhöhte Dichte)** | **Eiche/Tanne/Ahorn/Esche-Verjüngung** | **verhindert (Verbiss)** | **Neu (Szenario 6): selektiv, verstärkt „Entmischung"; STARK bei hoher Wilddichte, schwach bei niedriger** |
| **Reh/Rothirsch (überhöhte Dichte)** | **Eichelhäher-/Eichhörnchen-Aussaat** | **entwertet** | **Neu (Szenario 6): frisst gekeimte Jungpflanzen, bevor Samenverbreitung wirksam wird** |

---

## 4. Die sechs Störungsszenarien und ihre Kaskadeneffekte

Die sechs Szenarien lassen sich drei grundverschiedenen Kategorien zuordnen – diese Dreiteilung ist selbst ein Lerninhalt und sollte in der Simulation sichtbar gemacht werden (siehe Abschnitt 5 und 6):

1. **Naturereignisse** (Szenarien 1–4): abiotisch ausgelöst oder biotisch als Sekundäreffekt, wirken von außen auf das System ein, meist zeitlich klar abgrenzbar (Event).
2. **Gezielte menschliche Bewirtschaftungsentscheidung** (Szenario 5): eine bewusste Einzelmaßnahme mit einem eingebauten Zielkonflikt zwischen zwei Schutzgütern.
3. **Strukturelles/chronisches Ungleichgewicht** (Szenario 6): kein einzelnes Ereignis, sondern ein dauerhaft fehlender Regulationsmechanismus (fehlende Prädatoren, unzureichende Bejagung), der graduell über Jahrzehnte wirkt.

### Szenario 1: Borkenkäferbefall (*Ips typographus*)
**Mechanismus:** Der Buchdrucker befällt bevorzugt geschwächte Fichten (Sekundärschädling). Er bohrt sich in die Rinde, legt Brutgänge im Bast an und unterbricht so den Saftstrom; zusätzlich überträgt er den Bläuepilz, der die Wasserleitung blockiert. Der gleichzeitige Angriff einiger hundert Käfer durchbricht auch die Harzabwehr eines vitalen Baumes. Bei warm-trockener Witterung bis zu 3 Generationen/Jahr → exponentielle Massenvermehrung (>100.000 Nachkommen/Weibchen).
**Kaskade:** Fichte stirbt → Bläuepilz breitet sich aus → benachbarte Fichten werden befallen (aus einer Altfichte ~20.000 Käfer → ~20 Folgebäume) → in der Monokultur großflächiger Zusammenbruch. Buntspecht und Ameisenbuntkäfer können die Masse nicht regulieren → Totholz entsteht → kurzfristig Verlust der Baumschicht, MITTELFRISTIG aber steigt die Biodiversität (Totholzkäfer, Wildbienen, Pionierpflanzen); Sukzession beginnt (Birke, Brombeere). **Wichtig für SuS:** Im Mischwald bleibt der Schaden lokal, weil die Käfer keine durchgehende Fichtennahrung finden.

### Szenario 2: Trockenheit / Dürre
**Mechanismus:** Wassermangel senkt die Harzproduktion und damit die Abwehrkraft der Bäume. Trockengestresste Fichten sind für den Buchdrucker sogar attraktiver (Duftstoffe; Netherer et al. 2021, BOKU/*Journal of Pest Science*). Die Trockenheitsresistenz nimmt zu von Fichte (gering) < Buche < Eiche/Kiefer < Douglasie (LWF aktuell 126).
**Kaskade:** Dürre → Fichte geschwächt → Borkenkäfer- UND Hallimasch-Befall steigen → Baumsterben → weniger Beschattung → Bodenaustrocknung verstärkt sich → Krautschicht verändert sich (Trockenzeiger). Buche leidet ebenfalls, Eiche/Kiefer halten stand → langfristige Artverschiebung. Verbindet die Szenarien 1 und 2 (Trockenheit ist Auslöser für Käfer).

### Szenario 3: Höhere Temperaturen (Klimawandel)
**Mechanismus:** Wärme beschleunigt die Käferentwicklung → mehr Generationen pro Jahr (in Tieflagen von 2 auf 3; in Hochlagen von 1 auf 2), früherer Schwärmbeginn, mildere Winter erhöhen die Überlebensrate. Gleichzeitig verschieben sich die Klima-Nischen („Klimahüllen") der Baumarten; die Fichte fällt in tieferen Lagen zunehmend aus (Bildungsserver Wiki Klimawandel; sg.ch).
**Kaskade:** Temperatur ↑ → Käfer-Generationen ↑ + Baumabwehr ↓ → verstärkter Befall; Phänologie-Verschiebung (früherer Austrieb, Frostrisiko); mögliche Entkopplung von Räuber und Beute (Synchronisation Specht/Käfer verschlechtert sich). Langfristig Verschiebung von Fichte hin zu wärme-/trockentoleranten Arten (Eiche, evtl. Douglasie).
*Hinweis: Zukunftsprojektionen (mehr Generationen, Artverschiebung) sind in den Quellen als Prognose/Modellierung formuliert – im Modell entsprechend als „mögliche Entwicklung" kennzeichnen.*

### Szenario 4: Extremwetter (Sturm/Windwurf, Starkregen)
**Mechanismus:** Sturm wirft v.a. flachwurzelnde Fichten auf durchnässten Böden um (Windwurf) oder bricht Stämme (Windbruch). Große Stürme (Wiebke 1990, Lothar 1999, Kyrill 2007, Friederike 2018) hinterlassen riesige Mengen Sturmholz (Wikipedia „Sturmholz"; NW-FVA).
**Kaskade:** Sturm → liegendes, abwehrloses Holz = ideales Brutmaterial → Borkenkäfer-Massenvermehrung im Folgejahr („Nach dem Sturm kommt der Käfer", IVA-Magazin) → Befall auch der stehenden, durch Wurzelschäden geschwächten Bäume → weitere Auflichtung → Windwurf-Lücken werden von Pionieren (Birke, Brombeere) und via Eichelhäher besiedelt. Starkregen/Erosion auf offenen Flächen verstärkt Bodenschäden. Zeigt eindrücklich die Verkettung: ein abiotisches Ereignis löst eine biotische Kettenreaktion aus.

### Szenario 5: Totholzentnahme zur Waldbrandprävention (menschliche Bewirtschaftungsmaßnahme)

**Sonderstatus:** Anders als die Szenarien 1–4 ist dies keine Naturstörung, sondern eine bewusste menschliche Entscheidung. Sie erzeugt einen echten **Zielkonflikt** zwischen zwei legitimen Schutzgütern: Brandschutz/Sicherheit einerseits, Biodiversität/Naturschutz andererseits.

**Mechanismus – fachlich differenziert, nicht linear:** Die naheliegende Annahme „weniger Totholz im Wald = weniger Waldbrandgefahr" ist wissenschaftlich **nicht pauschal korrekt** und sollte im Modell bewusst nicht als starker, eindeutiger Hebel dargestellt werden:
- Eine aktuelle Studie der Forstlichen Versuchs- und Forschungsanstalt Baden-Württemberg zum Spannungsfeld Brandschutz–Biodiversität–Forstpraxis betont, dass eine differenzierte Betrachtung und enge Abstimmung zwischen Forst und Feuerwehr nötig ist, statt einer pauschalen Regel (Vöhringer, Hengst & Hartebrodt 2025, AFZ-DerWald 10/2025).
- Waldwissen.net weist darauf hin, dass Totholz bei richtiger Bewertung und Steuerung im Rahmen eines aktiven Waldbrandmanagements sogar einen **positiven** Beitrag leisten kann.
- Entscheidend ist die Art des Totholzes: **Feines, trockenes Material** (Reisig, Nadelstreu, dünne Äste) erhöht die Brandgefahr am stärksten, während **große, wasserspeichernde liegende Stämme** – besonders im schattigen, feuchten Mischwald – die Brandausbreitung eher **verlangsamen** können (WWF Österreich, unter Berufung auf Carstens 2022; European Wilderness Society 2020). Ein Gutachten zu den Waldbränden in der Sächsischen Schweiz 2022 fand, dass Totholz dort nicht zur stärkeren Brandausbreitung beitrug (Müller/Schimke 2023).
- Der eigentliche Haupttreiber der Waldbrandgefahr bleibt in allen Quellen die **Witterung** (Trockenheit, Hitze, Wind) – nicht die Totholzmenge an sich.

**Kaskade (Vorschlag für die Simulation):**
```
Totholz-Entnahme (menschliche Aktion, Waldtyp C am relevantesten)
  → Waldbrand-Risiko: NUR leicht ↓ (v.a. bei Entfernung von feinem
     Material); Trockenheit/Witterung bleibt Hauptrisikofaktor
     und wird durch die Maßnahme NICHT beseitigt
  → Habitatverlust für Zersetzer: Hallimasch ↓, Zunderschwamm ↓
     (weniger Substrat verfügbar)
  → Weniger Nahrung/Bruthöhlen für Buntspecht ↓ und
     Ameisenbuntkäfer ↓ (beide direkt oder indirekt totholzgebunden)
  → Falls anschließend Szenario 1 (Borkenkäfer) ausgelöst wird:
     schwächere Regulation durch natürliche Feinde, da deren
     Habitatgrundlage reduziert wurde (Szenario-Verknüpfung möglich)
  → Biodiversitäts-Indikator ↓ deutlich, Waldbrand-Indikator
     nur geringfügig verändert
```

**Relevanter Waldtyp:** Vor allem **Waldtyp C (Kiefernwald auf Sand)** – dort ist die Ausgangs-Brandgefahr laut Abschnitt 1 real hoch, und Totholzmanagement-Debatten in der deutschen Forstpraxis drehen sich überwiegend um genau solche sandigen Nadelholzreviere. Im Mischwald (Waldtyp A) ist die Maßnahme weniger plausibel, weil dort ohnehin geringere Brandgefahr besteht und Totholz eher feuchtigkeitsspeichernd wirkt – dieser Kontrast lässt sich im Unterricht explizit nutzen.

**Didaktischer Mehrwert:** Das Szenario spricht gezielt die **Bewertungskompetenz** der KMK-Bildungsstandards Biologie an (neben Fachwissen, Erkenntnisgewinnung, Kommunikation) und erweitert das Konzept „Netzwerkdenken" um eine wichtige Facette: Der Mensch ist selbst Teil des Systems, und auch gut gemeinte Eingriffe können Kaskadenwirkungen auslösen, die nicht der ursprünglichen Absicht entsprechen bzw. schwächer wirken als intuitiv angenommen. Das Szenario eignet sich damit auch, um SuS für die Unterscheidung zwischen „plausibel klingender Alltagsvermutung" und „wissenschaftlich differenziertem Befund" zu sensibilisieren.

**Empfehlung für die Umsetzung:** Den Brandschutz-Effekt bewusst klein/unsicher modellieren (kein starker linearer Balken-Effekt), damit das Modell keine wissenschaftlich zu einfache Botschaft vermittelt. Der Kontrast zwischen erwartetem und tatsächlichem Effekt kann aktiv zur Reflexionsfrage werden (siehe Abschnitt 6).

### Szenario 6: Wildverbiss durch Schalenwild-Überpopulation (strukturelles Ungleichgewicht)

**Sonderstatus:** Anders als Szenario 5 ist dies keine einzelne bewusste Handlung, sondern ein **struktureller, chronischer Zustand**: das dauerhafte Fehlen bzw. die räumliche Seltenheit großer Beutegreifer (Luchs, Wolf) in Kombination mit unzureichender Bejagung. Es gibt kein einzelnes „Auslöse-Ereignis" – die Störung baut sich über Jahre bis Jahrzehnte auf.

**Mechanismus:** Reh und Rothirsch sind selektive Verbisser: Sie bevorzugen schmackhaftere, nährstoffreichere Baumarten wie Tanne, Ahorn, Eiche und Esche gegenüber der Buche (die u.a. durch Gerbstoffe weniger attraktiv ist). Ohne ausreichenden Regulationsdruck – historisch durch Luchs und Wolf, heute überwiegend durch die Jagd – steigt die Wilddichte über das Maß hinaus, das die Verjüngungsfläche verkraften kann. Verbissgutachten der Bundesländer zeigen, dass Wildbestände und die davon verursachten Verbissschäden in den letzten Jahren bundesweit angestiegen sind (FVA Baden-Württemberg), und Forstpraxis-Fachportale betonen, dass die Höhe der Schalenwildbestände der „Schlüsselfaktor für das Gelingen der Waldverjüngung" ist – wo der Verbiss zu hoch ist, verschwinden die für den klimaresilienten Waldumbau wichtigen „Zukunftsbaumarten" aus der Verjüngungsschicht. Besonders schwer wiegt dabei der Verbiss der Terminalknospe/des Leittriebs, weil er das Höhenwachstum des jungen Baumes dauerhaft hemmt (SDW).

**Kaskade (Vorschlag für die Simulation):**
```
Fehlende/seltene Großprädatoren + geringe Bejagung (struktureller
Ausgangszustand, über die Zeitachse konstant oder langsam
veränderlich)
  → Reh-/Rothirschdichte ↑ (kein einzelnes Trigger-Jahr, sondern
     graduelle Zunahme über mehrere Simulationsjahre)
  → Selektiver Verbiss an Eiche/Tanne/Ahorn/Esche-Keimlingen ↑
     (STARK), Buchen-Keimlinge vergleichsweise weniger betroffen
  → Eichelhäher-/Eichhörnchen-Aussaat wird entwertet: Keimlinge
     entstehen, wachsen aber nicht über die Verbisshöhe hinaus
  → Über Jahrzehnte: Verjüngungsschicht vereinheitlicht sich
     Richtung Buche („Entmischung") → Baumartenvielfalt der
     Altbestandsschicht bleibt zunächst unverändert, ABER die
     nächste Waldgeneration ist bereits verarmt
  → Resilienz-Indikator des Mischwaldes sinkt schleichend, obwohl
     im Dashboard kurzfristig kaum sichtbare Veränderung auftritt
     (wichtiger Kontrast zu den „schnellen" Szenarien 1 und 4)
```

**Relevanter Waldtyp:** Vor allem **Waldtyp A (Buchen-Eichen-Mischwald)** – hier steht die namensgebende Vielfalt (Eiche neben Buche) und damit der zentrale Resilienz-Vorteil des Referenzwaldtyps auf dem Spiel. In der Fichtenmonokultur (Typ B) ist das Szenario weniger aussagekräftig, da dort ohnehin kaum Mischbaumarten-Verjüngung vorhanden ist, die verloren gehen könnte.

**Didaktischer Mehrwert:** Dieses Szenario liefert einen wichtigen Kontrapunkt zum bisherigen Modell: Es zeigt, dass Resilienz durch Vielfalt kein statischer, einmal erreichter Zustand ist, sondern aktiv erhalten werden muss – der als „stabil" eingeführte Referenzwaldtyp A ist nicht automatisch dauerhaft resilient. Zudem eignet sich das Szenario, um den Unterschied zwischen **schneller** (Borkenkäfer: Wochen bis Monate) und **extrem langsamer** Kaskadendynamik (Verbiss: Jahrzehnte, oft erst an der übernächsten Waldgeneration sichtbar) besonders eindrücklich zu zeigen – noch langsamer als die bereits im Technikdokument geforderte „Baumverjüngung über Jahrzehnte". Wie Szenario 5 spricht auch dies die Bewertungskompetenz an (Interessenkonflikt Jagd/Forstwirtschaft/Naturschutz), diesmal jedoch ohne eine einzelne handelnde Person – ein Beispiel für einen strukturellen statt eines Entscheidungs-Zielkonflikts.

**Empfehlung für die Umsetzung:** Anders als die Szenarien 1–5 eignet sich Wildverbiss weniger als punktuelles Trigger-Event, sondern eher als **Zustandsparameter**, der zu Beginn eines Durchlaufs eingestellt wird (z.B. „niedrige/mittlere/hohe Wilddichte" oder „mit/ohne wirksame Prädator-Beute-Regulation") und dann über die gesamte Zeitachse konstant auf die Verjüngungsrate wirkt. Das unterscheidet es technisch von den bisherigen Ereignis-Szenarien und sollte in der UI entsprechend anders dargestellt werden (z.B. als Regler statt als Auslöse-Knopf).

---

## 5. Didaktische Reduktion – Begründung

**Ziel:** Das Modell soll „Netzwerkdenken" (Systemdenken) fördern – SuS sollen erkennen, dass Störungen sich durch vernetzte Systeme ausbreiten und nicht isoliert wirken. Es knüpft an das Basiskonzept „System" der KMK-Bildungsstandards Biologie an, das Wechselwirkungen zwischen belebter und unbelebter Natur, Stoffkreisläufe und Energiefluss als Kern-Eigenschaften von Ökosystemen benennt und ausdrücklich eine „Reduktion der Inhalte auf den Kern von biologischem Wissen" sowie ein „exemplarisches Vorgehen" fordert (KMK 2004; weiterentwickelte Standards 2024). Mit Szenario 5 wird zusätzlich die **Bewertungskompetenz** angesprochen, ein eigener Kompetenzbereich der KMK-Standards.

**Was bewusst WEGGELASSEN wurde (und warum es fachlich vertretbar ist):**
- **Artenzahl drastisch reduziert (~28 statt tausende):** Ein realer Buchenstamm beherbergt allein >250 Totholzpilzarten (LWF Wissen 86), der Borkenkäfer hat gegen 300 natürliche Feinde (WSL-Merkblatt 67). Für das Verständnis von Kaskaden genügen exemplarische Vertreter jeder Funktionsgruppe – die Systemlogik bleibt erhalten, weil pro ökologischer Rolle mindestens ein Vertreter vorhanden ist.
- **Bodenlebewesen/Mikroorganismen/Bakterien** weitgehend zu „Destruenten/Totholz" zusammengefasst – die Zersetzer-Funktion bleibt sichtbar, die unüberschaubare Artenvielfalt wird gebündelt.
- **Quantitative Populationsdynamik vereinfacht:** Statt exakter Differentialgleichungen genügen skalierte Parameter (niedrig/mittel/hoch) und wenige Ankerzahlen (z.B. >100.000 Nachkommen, 3 Generationen, ~20 Folgebäume), die die exponentielle Dynamik anschaulich machen.
- **Parasitoide Wespen, Milben, Nematoden** auf den Ameisenbuntkäfer als „Stellvertreter der Insekten-Gegenspieler" reduziert.
- **Die komplexe forstliche Debatte um Waldbrand-Löschtaktik, Fernerkundung und Zonierung (Szenario 5)** wurde auf den didaktischen Kern reduziert: Zielkonflikt Sicherheit vs. Biodiversität, ohne operative Feuerwehr-/Forstpraxis-Details.
- **Die jagd- und forstrechtliche Debatte um Abschusspläne, Bundesjagdgesetz-Novellen und Entschädigungsfragen (Szenario 6)** wurde auf den ökologischen Kern reduziert: der Zusammenhang zwischen Prädationsdruck/Bejagung, Wilddichte und Verjüngungserfolg – ohne die aktuelle politische Kontroverse um das Jagdrecht abzubilden, die für 13-14-Jährige nicht der Lernfokus sein sollte.

**Was bewusst ERHALTEN wurde (Netzwerk-Komplexität):**
- **Alle vier Beziehungstypen** (Fraß, Symbiose, Konkurrenz, Zersetzung) plus abiotische Kopplung – damit SuS erkennen, dass ein Ökosystem mehr ist als eine lineare Nahrungskette.
- **Mindestens eine echte Rückkopplung/Kaskade pro Szenario** (z.B. Trockenheit → Käfer → Totholz → Sukzession) – das ist der Kern des Systemdenkens.
- **Der Kontrast Monokultur vs. Mischwald** – er macht das abstrakte Konzept „Resilienz durch Vielfalt" erfahrbar.
- **Die Doppelrolle mancher Arten** (Borkenkäfer = Schädling UND Totholz-Recycler; Hallimasch = Zersetzer UND Parasit; Eichhörnchen = Samenfresser UND Samenverbreiter) – zeigt, dass „gut/böse" in Ökosystemen unpassende Kategorien sind.
- **Die wissenschaftliche Unsicherheit/Kontroverse bei Szenario 5** wurde bewusst NICHT geglättet, sondern als Lerninhalt genutzt – SuS sollen erleben, dass nicht jede plausible Alltagsannahme über Ökosysteme wissenschaftlich eindeutig belegt ist.
- **Die Dreiteilung der Szenario-Typen (Naturereignis / gezielte Maßnahme / strukturelles Ungleichgewicht)** wurde bewusst als eigener Lerninhalt beibehalten statt alle sechs Szenarien gleich zu behandeln – SuS sollen erkennen, dass Störungen ökologischer Systeme unterschiedliche „Herkunft" und Zeitdynamik haben können.

**Didaktisch relevante Konzepte, die das Modell abdeckt:** Produzent/Konsument/Destruent, Trophieebenen, Nahrungsnetz, Symbiose/Mykorrhiza, Konkurrenz, Räuber-Beute-Regulation, trophische Kaskade, Sukzession, abiotische Faktoren, Resilienz/Biodiversität, Klimawandel-Folgen, Zielkonflikte in der Waldbewirtschaftung, Bewertungskompetenz/Nachhaltigkeit.

---

## 6. Empfehlungen für die Simulations-Umsetzung (Schritt 2)

1. **Netzwerk als gewichteten, gerichteten Graphen implementieren:** Knoten = die 28 Arten/Faktoren, Kanten = Beziehungstabelle (3.2) mit Attributen `typ`, `richtung`, `staerke` (schwach/mittel/stark). So bleiben Kaskaden nachvollziehbar visualisierbar.
2. **Waldtyp als Startparameter (A/B/C):** Er bestimmt die Anfangs-Artenzusammensetzung und einen globalen Resilienz-Faktor. Benchmark für die Modellgüte: Szenario „Borkenkäfer + Fichtenmonokultur" muss zum großflächigen Kollaps führen, dasselbe Szenario im Mischwald nur zu lokalem Schaden – bildet dieser Kontrast sich nicht ab, ist das Modell zu grob.
3. **Störungen als auslösbare Events mit Kettenlogik:** Die Szenarien 1–4 setzen zunächst einen abiotischen Knoten (Wasser↓, Temperatur↑, Sturm) und propagieren dann über die Kanten. **Szenario 5 unterscheidet sich strukturell:** Es setzt direkt einen anthropogenen Aktions-Knoten („Mensch entnimmt Totholz"), nicht einen abiotischen. Empfehlung: die beiden Event-Typen auch in der UI unterscheidbar machen (z.B. Icon „Naturereignis" vs. „Bewirtschaftungsentscheidung"), damit SuS den kategorialen Unterschied auch visuell erfassen. Wichtiger Kopplungspfad, der zwingend enthalten sein sollte: *Trockenheit/Sturm → Fichtenvitalität↓ → Borkenkäfer↑ → Totholz↑ → Sukzession (Birke/Brombeere)↑*.
4. **Zeitachse in Jahren:** Borkenkäfer-Generationen (temperaturabhängig 1–3/Jahr) und Baum-Verjüngung (Jahrzehnte) sollten unterschiedliche Zeitkonstanten haben, damit SuS „schnelle Schädlingsdynamik vs. langsame Walderholung" erleben.
5. **Reflexions-Layer einbauen:** Nach jeder Simulation eine Rückfrage („Welche Art war betroffen, obwohl du sie nicht direkt gestört hast?"). Für Szenario 5 zusätzlich empfohlen: „Hat die Maßnahme das Brandrisiko wirklich stark gesenkt? Was hat sich stattdessen sicher verändert?" – das operationalisiert gezielt die Bewertungskompetenz. Zwei weitere, allgemein einsetzbare Leitfragen (Ergänzung 2026-09-11, aus einer Nutzer-Idee im Ideen-Backlog): „Was hat dich am stärksten überrascht, wenn du deine Vorhersage mit dem tatsächlichen Ergebnis vergleichst?" (knüpft direkt an die eingangs erfasste Hypothese an und macht den Vorhersage-Realität-Abgleich selbst zum Reflexionsgegenstand) sowie „Was würde vermutlich passieren, wenn die Störung noch stärker wäre oder deutlich länger anhalten würde?" (regt dazu an, die Kaskadenlogik über den gezeigten Fall hinaus gedanklich weiterzuführen, statt sie nur für die eine gesehene Ausprägung zu verstehen).
6. **Schwellen, die den Ausgang kippen (für Balancing):** natürliche Feinde bremsen nur bei *niedriger* Käferdichte; ab einer kritischen Dichte (z.B. nach Sturm) versagt die Regulation. Dieser Schwelleneffekt sollte modelliert werden, weil er der zentrale ökologische Kipppunkt ist.
7. **Szenario 5 nicht als starken Hebel auf den Brandrisiko-Indikator modellieren:** Der Effekt sollte klein/unsicher bleiben (siehe Abschnitt 4), um keine wissenschaftlich zu einfache Botschaft zu vermitteln; der klar sichtbare, starke Effekt sollte auf dem Biodiversitäts-Indikator liegen.
8. **Drei Szenario-Typen technisch unterscheidbar halten:** Szenarien 1–4 als punktuelle Trigger-Events auf der Zeitachse, Szenario 5 ebenfalls als Trigger-Event (aber mit anderem Icon/Kategorie: „Bewirtschaftungsmaßnahme"), Szenario 6 dagegen als **Zustandsparameter/Regler**, der zu Simulationsbeginn eingestellt wird und kontinuierlich auf die Verjüngungsrate wirkt statt als einzelnes Ereignis auszulösen. Diese UI-Unterscheidung macht den kategorialen Unterschied für SuS auch visuell erfahrbar.
9. **Szenario 6 bewusst mit verzögerter Sichtbarkeit modellieren:** Der Effekt auf den Baumbestands-Indikator sollte in den ersten Simulationsjahren kaum sichtbar sein und erst nach vielen Jahren spürbar werden (die Altbäume stehen ja zunächst unverändert weiter) – das unterstreicht den Unterschied zwischen einer bereits geschädigten Altbestandsschicht und einer erst zukünftig ausbleibenden nächsten Waldgeneration.

---

## 7. Caveats (Einordnung der Quellen und Unsicherheiten)

- **Zukunftsaussagen sind Prognosen:** Aussagen zu mehr Käfer-Generationen, Artverschiebungen und verschlechterter Räuber-Beute-Synchronisation im Klimawandel stammen aus Modellierungen/Szenarien (RCP-Läufe, Klimahüllen) und sind keine gemessenen Fakten. Im Unterricht als „wahrscheinliche Entwicklung" kennzeichnen.
- **Wirkung der Spechte umstritten/begrenzt:** Spechte sind auffällige, aber laut WSL nicht entscheidende Regulatoren; ihre Rolle ist didaktisch wertvoll (sichtbar, greifbar), sollte aber nicht als „Käfer-Stopper" überzeichnet werden. Räuberische Insekten (Ameisenbuntkäfer) und Parasitoide sind wirksamer.
- **Mykorrhiza-„Baum-zu-Baum-Transfer":** Der Nährstofftransfer über Pilznetze zwischen Bäumen ist belegt, aber seine ökologische Bedeutung wird weiter erforscht und ist in Teilen umstritten (waldwissen.net). Für das Schulmodell als „Vernetzung/Unterstützung" darstellbar, ohne Überinterpretation.
- **Zahlen mit Spannbreiten:** Borkenkäfer-Nachkommenzahlen (bis >100.000) und Folgebaum-Zahlen (~20) sind Richtwerte aus günstigen Jahren, keine Konstanten – sie hängen stark von Temperatur und Generationenzahl ab.
- **Totholz–Waldbrand-Zusammenhang ist wissenschaftlich uneindeutig und aktuell kontrovers diskutiert** (verstärkt seit den Bränden im Nationalpark Harz): Die Wirkung hängt stark von Totholzart (stehend/liegend), Zersetzungsgrad, Waldtyp und vor allem der Witterung ab; teils wirkt Totholz sogar risikomindernd. Diese Uneindeutigkeit ist im Modell explizit darzustellen, nicht zu glätten (siehe Abschnitt 4, Szenario 5).
- **„Entmischung" durch Wildverbiss ist ökologisch gut belegt, im forstrechtlichen Einzelfall aber schwer exakt zu quantifizieren:** Der Bundesgerichtshof konnte 2010 in einem konkreten Streitfall den ursächlichen Eintritt eines Entmischungsschadens rechtssicher nicht feststellen, obwohl der Wirkmechanismus (selektiver Verbiss bevorzugter Baumarten) fachlich unstrittig ist. Für das Schulmodell ist das kein Hindernis (der Mechanismus selbst ist gut belegt), sollte aber nicht als „exakt bezifferbarer" Effekt dargestellt werden.
- **Wolf und Luchs sind in Deutschland regional sehr ungleich verteilt** (Stand DBBW-Monitoring 2025: Wolfsschwerpunkt Nordost-Deutschland, Luchs nur in wenigen Mittelgebirgsregionen) – die im Modell unterstellte „funktionierende Prädator-Beute-Regulation" ist daher aktuell eher der Ausnahme- als der Regelfall in deutschen Wäldern. Dies sollte im Unterrichtsgespräch nicht als „so ist es überall" missverstanden werden.
- **Quellenqualität:** Erstklassig und primär sind LWF Bayern, WSL/waldwissen.net, NW-FVA, FVA BW, BFW, KMK, Thünen-Institut/Bundeswaldinventur, Nationalpark Bayerischer Wald sowie peer-reviewte Arbeiten (Netherer et al. 2021; Kupferschmid 2016; Müller et al. 2008). Populär- und Kommerzquellen (z.B. baumdestages.de, staufenwald.de, gartenjournal.net) wurden nur für unstrittige Basisfakten herangezogen und, wo möglich, durch Fachquellen abgesichert; sie sollten in der finalen Wissensbasis der Simulation nicht als Primärbeleg dienen.
- **Regionalität:** Die Waldtypen und Artengarnituren sind für Deutschland/Mitteleuropa typisiert; reale Bestände variieren mit Höhenlage, Boden und Bewirtschaftung. Das Modell ist bewusst ein Typ-Modell, kein Standort-Abbild.

---

### Kurz-Quellenverzeichnis (Institutionen bevorzugt)
KMK-Bildungsstandards Biologie (2004; Weiterentwicklung 2024, kmk.org) · Bundeswaldinventur 2021/2022 (BMEL/Thünen-Institut, bundeswaldinventur.de) · LWF Bayern (LWF Wissen 80 „Wurzelwerk der Fichte"; LWF Wissen 86 „Rotbuche"/Aas & „Pilzwelt der Buche"; LWF aktuell 88 „Muss es immer Eiche sein?"; LWF aktuell 126 „Nadelbäume im Trockenstress"; LWF Wissen 57 „Waldkiefer"; LWF aktuell 135 „Artenvielfalt in Mulmhöhlen"; „Generationsabfolgen des Buchdruckers"; Borkenkäfer-Infoportal; Wildtierportal Bayern) · WSL/waldwissen.net (Merkblatt 67 „Natürliche Feinde von Borkenkäfern", Wermelinger & Schneider Mathis 2021; Mykorrhiza; Verbiss durch Schalenwild; Eichelhäher; „Sturm/Witterung und Borkenkäfer"; „Rolle der Kiefern im Klimawandel"; Baumartenportrait Rotbuche; Kupferschmid 2016 „Effekte von Wölfen auf die Waldverjüngung"; „Licht und Totholz – das Paradies für holzbewohnende Käfer") · FVA Baden-Württemberg (Warlo & Moritzi 2026, „Klimawandel und biotische Risiken"; Vöhringer, Hengst & Hartebrodt 2025, „Umgang mit Totholz im Rahmen des Waldbrandmanagements", AFZ-DerWald 10/2025; „Totholzmanagement zur Waldbrandprävention", waldwissen.net) · NW-FVA (Wachstum von Eiche/Buche/Fichte/Kiefer im Klimawandel; Waldschutzinfo Windwurf) · BFW Österreich („Symbiose Borkenkäfer–Bläuepilze") · BOKU/Netherer et al. 2021 (*Journal of Pest Science*, forstpraxis.de) · Kanton St. Gallen (sg.ch, „Der Borkenkäfer") · KORA (Luchs-Prädationsdaten) · Nationalpark Bayerischer Wald/Beudert et al. 2015 (Totholz & Biodiversität) · KIT/ITAS (Rösch, „Mischwälder anpassungsfähiger als Monokulturen") · NABU (Pilze und Bäume; Frühblüher) · Waldbesitzer-Portal Bayern & Baumpflegeportal (Hallimasch) · Deutschlands Natur (Waldmeister-Buchenwald) · Weltwald Freising; Wikipedia „Waldgesellschaften Mitteleuropas"/„Sturmholz" (Übersichtszwecke) · WWF Österreich („Steigert Totholz die Brandgefahr im Wald?", inkl. Gutachten Müller/Schimke 2023 zur Sächsischen Schweiz) · FNR Themenportal Wald („Totholz – Für Biodiversität und Klimaschutz") · Müller et al. 2008 (Anteil xylobionter Arten in mitteleuropäischen Wäldern) · HSWT/FVA Abschlussbericht „Hochstümpfe als Lebensraum für xylobionte Artengemeinschaften" · Schutzgemeinschaft Deutscher Wald SDW („Wildverbiss") · FVA Baden-Württemberg (Broschüre „Große Pflanzenfresser – Wildverbiss") · AELF Bayern („Wildverbiss erfassen und beurteilen") · Forstpraxis.de/AFZ-DerWald („Wichtige Frist: Wildverbiss im Fokus"; „Methoden zur Beurteilung von Wildverbiss") · top agrar („Wildverbiss: Neues Bundesjagdgesetz polarisiert") · Landesforsten Rheinland-Pfalz (Wildschäden im Wald) · Konvention zur Bewertung von Wildschäden im Wald / KWF (inkl. BGH-Urteil 2010 zu Entmischungsschäden) · NABU („Wölfe in Deutschland") · Bundesamt für Naturschutz (BfN)/Dokumentations- und Beratungsstelle des Bundes zum Wolf (DBBW), Wolfsmonitoring Stand November 2025.
