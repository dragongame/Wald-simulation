# Wissensbasis-Ergänzung: Die im Simulationsmodell noch nicht dynamisch abgebildeten Arten

**Zweck:** Reine fachliche Recherche-Vorarbeit für den Backlog-Eintrag „Mehr Tiere und Pflanzen bei der Simulation anzeigen" (`Ideen_Backlog_Waldsimulation_Klasse8.md`). Keine Freigabe zur Umsetzung, kein Teil des aktuellen Umsetzungsauftrags – der Nutzer hat sich in der Session vom 2026-08-26 bewusst dagegen entschieden, dies jetzt im Code umzusetzen, aber die fachliche Grundlage dafür vorbereiten lassen.

**Verhältnis zum Original-Wissensbasis-Dokument:** Dieses Dokument **ergänzt** `Mitteleuropäische_Waldökosysteme_Wissensbasis_v2.md`, ersetzt oder editiert es nicht. Das Original ist unverändertes Lehrkraft-Liefermaterial (laut Git-Historie seit der Lieferung nie editiert) und bleibt die fachliche Quelle Rang 2 in der Dokumenten-Hierarchie. Für die 22 der 32 Lexikon-Arten, die hier behandelt werden, enthält das Original bereits ausführliche, gut zitierte Steckbriefe (Abschnitt 2) und eine Beziehungstabelle (Abschnitt 3.2) – diese werden hier bewusst **nicht** wiederholt, sondern nur um zwei Dinge ergänzt, die im Original fehlen, weil es nicht für eine numerische Zeitreihen-Simulation geschrieben wurde: (a) wie jede Art plausibel auf die 6 im Modell tatsächlich vorhandenen Störungs-Events reagiert, und (b) ein grob quantifizierbarer, didaktisch reduzierter Vorschlag für eine Reaktionsregel, angelehnt an die bestehende Modellierungslogik in `scripts/simulation/model.py` (Resilienz-Multiplikatoren, 0–100-Skala, „100 = Ausgangszustand").

**Warum nur 22 von 32 Knoten:** `fichte`, `buche`, `eiche`, `kiefer`, `birke` sind bereits simuliert (5 Baumarten). `borkenkaefer`, `reh`, `rothirsch` sind über `borkenkaefer_dichte` bzw. den aggregierten `wilddichte`-Regler bereits (grob) simuliert. `totholz` (→ `totholzmenge`) und `mensch_bewirtschaftung` (→ Ereignis-Trigger „Totholzentnahme") sind ebenfalls bereits Teil des Modells. Verbleiben 22 Arten ohne eigene Zeitreihe – 19 davon waren der explizite Auftrag dieser Recherche (Sträucher, Pilze, Kräuter, Eichhörnchen/Raupen/Blattläuse, Eichelhäher, alle 7 Prädatoren); für Reh/Rothirsch selbst (bereits simuliert) liefert Abschnitt „Reh und Rothirsch trennen?" unten eine ergänzende Einschätzung, wie im Auftrag verlangt.

**Quellenlage:** Für die meisten Arten liefert das Original-Wissensbasis-Dokument bereits den fachlichen Kern (Zitate siehe dort, hier nicht wiederholt). Wo das Original zu einer Art nichts zu Störungsreaktion/Populationsdynamik sagt, wurde gezielt nachrecherchiert; diese zusätzlichen Quellen sind unten pro Abschnitt benannt. Wie im Original gilt: Institutionelle/Fach-Quellen (LWF, waldwissen.net/WSL, NABU, Deutsche Wildtierstiftung) haben Vorrang vor populären Quellen.

---

## Sträucher

### Hasel (*Corylus avellana*)
- **Steckbrief:** siehe Original Abschnitt 2, Nr. 6 – Windblüher, Nüsse als Tiernahrung, Waldrandart.
- **Störungsreaktion:** Hasel gehört laut Sukzessionsliteratur zu den typischen Pionierarten des „Vorwalds", die sich innerhalb weniger Jahre auf Störflächen (Windwurf, Käferflächen) ansiedeln – gemeinsam mit Brombeere, Holunder, Weide/Espe/Birke ([wald-und-holz.nrw.de – Praxisleitfaden Walderneuerung nach Schadereignissen](https://www.wald-und-holz.nrw.de/fileadmin/Forstwirtschaft/Borkenkaefer/Praxisleitfaden_Walderneuerung_nach_Schadereignissen.pdf)). Reagiert damit ähnlich wie `birke_anteil` im Modell: **profitiert** von Kronendachverlust (Sturm, Borkenkäfer-Kollaps), unabhängig von Trockenheit/Temperatur selbst.
- **Kopplung an simulierte Größen:** analog zu `birke_anteil` an `kronendach`-Verlust koppelbar (dieselbe Lücke-öffnet-Pionierwachstum-Logik).
- **Reaktionsregel-Vorschlag:** eigener `hasel_anteil`-Indikator, der wie `birke_anteil` mit `0.06 * (100 - kronendach)` pro Jahr wächst, aber langsamer auf einen niedrigeren Deckel (z. B. max. 15–20 statt 40) begrenzt ist, da Hasel im Unterschied zur Birke ein Strauch bleibt und keine eigene Baumschicht bildet.
- **Unsicherheit:** GERING – Rolle als Störflächen-Pionier ist gut belegt, die genaue Wachstumsrate relativ zur Birke ist eine plausible Schätzung, keine gemessene Größe → **Annahme, mit Lehrkraft abzugleichen**.

### Schwarzer Holunder (*Sambucus nigra*)
- **Steckbrief:** siehe Original Nr. 7 – Beeren als Vogelnahrung, Störzeiger, nährstoffliebend.
- **Störungsreaktion:** Ebenfalls klassische Vorwald-/Pionierart auf Störflächen (gleiche Quelle wie Hasel oben) und zusätzlich explizit ein **Nährstoff-/Störungszeiger** – profitiert also sowohl vom Lichtgewinn (wie Hasel/Birke) als auch von der Nährstofffreisetzung nach Baumsterben (wie Brennnessel, siehe unten).
- **Kopplung an simulierte Größen:** `kronendach`-Verlust (Licht) UND `totholzmenge`-Anstieg (Nährstofffreisetzung durch absterbende Bäume) als doppelter, sich verstärkender Treiber.
- **Reaktionsregel-Vorschlag:** ähnlich Hasel, aber zusätzlich mit einem kleinen Bonus proportional zum Totholz-Zuwachs des laufenden Jahres.
- **Unsicherheit:** GERING (Doppelrolle Licht+Nährstoff ist in der Literatur unstrittig, die genaue Gewichtung beider Faktoren zueinander ist eine didaktische Schätzung).

### Brombeere (*Rubus fruticosus* agg.)
- **Steckbrief:** siehe Original Nr. 8 und bereits in `data/edges.json` als `brombeere -> gruppe:baumverjuengung_allgemein` (Konkurrenz) modelliert.
- **Störungsreaktion:** Stärkste und am schnellsten reagierende Pionierart der drei Sträucher – dominiert laut Recherche Störflächen oft so stark, dass Naturverjüngung dort „nur eingeschränkt oder gar nicht" möglich ist ([Praxisleitfaden Walderneuerung](https://www.wald-und-holz.nrw.de/fileadmin/Forstwirtschaft/Borkenkaefer/Praxisleitfaden_Walderneuerung_nach_Schadereignissen.pdf)), bis nachfolgende Pionierbäume (Birke u. a.) sie beschatten und zurückdrängen. Diese Konkurrenzbeziehung ist im Datenmodell bereits qualitativ erfasst, aber ohne Zeitreihe.
- **Kopplung an simulierte Größen:** `kronendach`-Verlust (Treiber, wie Hasel/Holunder) UND – neu – eine **negative** Rückkopplung auf `verjuengung_mischbaumarten`, weil dichte Brombeere die Baumverjüngung zusätzlich zum Wildverbiss behindern kann (im Modell aktuell nur der Wildverbiss-Regler abgebildet).
- **Reaktionsregel-Vorschlag:** wächst schneller als Hasel/Holunder auf Störflächen an (steilere Kurve, aber ebenfalls durch nachwachsenden Kronenschluss/Birke wieder zurückgedrängt – im Modell also ein Auf-und-Ab statt eines Deckel-Werts wie bei `birke_anteil`).
- **Unsicherheit:** MITTEL – der zusätzliche negative Effekt auf `verjuengung_mischbaumarten` (über den bereits modellierten Wildverbiss hinaus) ist plausibel, aber nicht quantifiziert → **Annahme, mit Lehrkraft abzugleichen**.

---

## Pilze

### Mykorrhizapilz (z. B. Steinpilz)
- **Steckbrief/Beziehungen:** ausführlich in Original Nr. 9 und `data/edges.json` (Symbiose mit allen 4 Baumarten) abgedeckt.
- **Störungsreaktion:** Erhöht laut Original explizit die Trockenheits- und Krankheitsresistenz der Wirtsbäume – ist also kein eigenständig „gestörtes" Element, sondern ein **Verstärker/Dämpfer** anderer Effekte.
- **Kopplung an simulierte Größen:** könnte als Multiplikator auf die Trockenheits-Vitalitätsverluste der Bäume wirken (z. B. Resilienzfaktor leicht abschwächen, wenn Mykorrhiza-Indikator hoch ist) – technisch ein Rückkopplungs-Kreis (Baum-Vitalität beeinflusst Pilz-Indikator, Pilz-Indikator beeinflusst Baum-Vitalität), der im aktuellen linearen Jahres-Schritt-Modell einen echten Neuentwurf bräuchte.
- **Reaktionsregel-Vorschlag:** am ehesten als einfacher, an `gesamtvitalitaet`/`bodenfeuchte` gekoppelter Begleit-Indikator ohne Rückwirkung auf die Bäume (sinkt mit sinkender Wirtsbaum-Vitalität, wirkt aber nicht zurück) – vermeidet die Rückkopplungs-Komplexität, bildet die reale Abhängigkeit aber nur einseitig ab.
- **Unsicherheit:** HOCH bei der Frage, ob/wie stark der Rückkopplungs-Effekt numerisch modelliert werden sollte – im Original selbst als „belegt, aber ökologische Bedeutung wird weiter erforscht, in Teilen umstritten" gekennzeichnet (Original, Abschnitt 7) → **explizit als unsicher übernehmen, nicht quantitativ überinterpretieren**.

### Hallimasch
- **Steckbrief/Beziehungen:** ausführlich in Original Nr. 10 und `data/edges.json` (Zersetzer + Schwächeparasit, an `totholz` gekoppelt).
- **Störungsreaktion:** Doppelrolle bereits im Original beschrieben: befällt geschwächte Bäume (Trockenheit/Borkenkäfer) UND zersetzt Totholz. Direkt von Totholzentnahme betroffen (Original, Nr. 10 und die Totholz→Hallimasch-Kante in `edges.json`).
- **Kopplung an simulierte Größen:** `totholzmenge` (positiv – mehr Substrat) UND `fichte_vitalitaet`/`buche_vitalitaet`-Rückgang durch Trockenheit (positiv – mehr geschwächte Wirtsbäume).
- **Reaktionsregel-Vorschlag:** Indikator steigt proportional zu `totholzmenge` UND zusätzlich mit einem Bonus bei aktiver Trockenheit; sinkt sofort und deutlich (×0.4, analog der bestehenden `totholzmenge`-Reaktion auf Totholzentnahme) wenn das Ereignis „Totholzentnahme" aktiv ist.
- **Unsicherheit:** GERING – beide Kopplungen sind im Original bereits qualitativ festgehalten, nur die Zeitreihen-Umsetzung fehlt.

### Zunderschwamm
- **Steckbrief/Beziehungen:** Original Nr. 11 – reiner Totholz-Zersetzer der Buche, kein Parasit lebender Bäume.
- **Störungsreaktion:** Einfachster Fall der vier Pilze – reagiert nur auf `totholzmenge` (v. a. Buchen-Totholz, im Modell nicht nach Baumart differenziert), nicht auf Trockenheit/Sturm/Temperatur direkt.
- **Kopplung an simulierte Größen:** `totholzmenge` (positiv), Totholzentnahme (negativ, wie Hallimasch).
- **Reaktionsregel-Vorschlag:** direkt proportional zu `totholzmenge`, kein zusätzlicher Treiber nötig.
- **Unsicherheit:** GERING.

### Bläuepilz
- **Steckbrief/Beziehungen:** Original Nr. 12 und `data/edges.json` – reiner Symbiose-Partner des Borkenkäfers, kein eigenständiges Vorkommen ohne Käfer.
- **Störungsreaktion:** Existiert im Modell praktisch nur als „Anhängsel" des Borkenkäfer-Szenarios, kein eigener Trigger.
- **Kopplung an simulierte Größen:** direkt an `borkenkaefer_dichte` gekoppelt (mit leichter Verzögerung von ca. 1 Jahr, da der Pilz erst nach Käferbefall in den Baum gelangt).
- **Reaktionsregel-Vorschlag:** `blaeuepilz_indikator = borkenkaefer_dichte` des Vorjahres, kein eigenständiger Mechanismus.
- **Unsicherheit:** GERING – im Original bereits vollständig beschrieben, nur keine eigene Zeitreihe.

---

## Krautschicht

### Buschwindröschen
- **Steckbrief:** Original Nr. 13. Neu recherchiert: nutzt exakt das Zeitfenster **vor** Laubaustrieb und zieht sich zurück, sobald sich das Kronendach schließt ([Lernhelfer/pflanzen-vielfalt.net](https://www.pflanzen-vielfalt.net/wildpflanzen-kraeuter-a-z/uebersicht-pflanzen-a-g/buschwindroeschen/)) – die Pflanze ist an sich **kein Jahres-Störungs-Reagierer**, sondern ein reiner Kronendach-/Lichtindikator.
- **Störungsreaktion:** Sturm/Borkenkäfer-bedingter Kronendachverlust würde ihr Lichtangebot ganzjährig erhöhen und könnte sie kurzfristig begünstigen (mehr Fläche, längere nutzbare Saison) – das ist allerdings eine Ableitung aus der allgemeinen Lichtabhängigkeit, keine explizit gefundene Quelle zu Buschwindröschen nach Störung speziell.
- **Kopplung an simulierte Größen:** `kronendach` (invers – sinkendes Kronendach = mehr Licht = potenziell mehr Buschwindröschen), gedeckelt durch `bodenfeuchte` (Frühblüher brauchen feuchte Böden im Frühjahr).
- **Reaktionsregel-Vorschlag:** einfacher Gegenläufer zu `kronendach`, z. B. `100 - kronendach`, aber mit sehr trägem Anstieg (Rhizom-Ausbreitung ist langsam, Jahrzehnte-Prozess laut allgemeiner Frühblüher-Literatur), sodass ein einzelnes Sturmjahr kaum etwas ändert.
- **Unsicherheit:** MITTEL-HOCH – die Grundmechanik (Lichtabhängigkeit) ist gut belegt, die konkrete Reaktion auf einen abrupten Störungs-Kronendachverlust (statt der natürlichen saisonalen Dynamik) wurde nicht direkt in der Literatur gefunden → **Annahme, mit Lehrkraft abzugleichen**.

### Waldmeister
- **Steckbrief:** Original Nr. 14. Neu recherchiert: löst die Frühblüher ab, **sobald** sich das Kronendach wieder verdichtet ([pflanzen-vielfalt.net](https://www.pflanzen-vielfalt.net/bestimmen-sammeln/sammelzugaenge/lebensraum-wald/)) – anders als das Buschwindröschen ist Waldmeister eine **Schattenpflanze** des geschlossenen, nährstoffreichen Buchenwalds.
- **Störungsreaktion:** Verhält sich damit **gegenläufig** zum Buschwindröschen: Kronendachverlust (Sturm, Borkenkäfer) würde Waldmeister eher schaden (zu viel Licht, Austrocknung), nicht nützen. Ein instruktiver Kontrast für den Unterricht („nicht alle Kräuter reagieren gleich auf mehr Licht").
- **Kopplung an simulierte Größen:** `kronendach` (positiv – braucht geschlossenes Kronendach), nur im Mischwald relevant (Waldmeister-Buchenwald ist typspezifisch, im Original an Waldtyp A gebunden).
- **Reaktionsregel-Vorschlag:** proportional zu `kronendach`, mit Waldtyp-Gewichtung (nur relevant für `mischwald`).
- **Unsicherheit:** MITTEL – Gegenläufigkeit zum Buschwindröschen ist durch die Quelle plausibel gestützt, aber ebenfalls keine direkte Störungs-Studie zu Waldmeister gefunden → **Annahme, mit Lehrkraft abzugleichen**.

### Brennnessel
- **Steckbrief:** Original Nr. 15, bereits explizit als Stickstoff-/Störungszeiger beschrieben, der von Nährstofffreisetzung nach Baumsterben profitiert.
- **Störungsreaktion:** Direkteste Kopplung aller vier Kräuter – jedes Szenario mit Baumsterben (Borkenkäfer, Sturm, Trockenheit) setzt über Totholz-Zersetzung Nährstoffe frei und begünstigt sie.
- **Kopplung an simulierte Größen:** `totholzmenge`-Zuwachs (positiv, mit Verzögerung, da Nährstoffe erst bei fortschreitender Zersetzung freiwerden).
- **Reaktionsregel-Vorschlag:** wächst mit einer Verzögerung von 1–2 Jahren proportional zum kumulierten Totholz-Zuwachs seit Störungsbeginn.
- **Unsicherheit:** GERING – Stickstoffzeiger-Rolle ist Standardwissen, die Verzögerung ist eine didaktische Schätzung.

### Heidelbeere
- **Steckbrief:** Original Nr. 16, Säure-/Lichtzeiger typischer Nadelwald-Standorte (Kiefer/Fichte).
- **Störungsreaktion:** Aus der Recherche ergibt sich ein gemischtes Bild: Heidelbeere ist als „Halbschattenpflanze" beschrieben ([wald-prinz.de](https://www.wald-prinz.de/waldboden-was-zeigerpflanzen-uber-die-bodengute-aussagen/710)), reagiert also vermutlich empfindlicher auf abrupten Kronendachverlust als die eher lichtliebenden Pionierarten (Hasel/Holunder/Brombeere), profitiert aber – anders als Waldmeister – nicht von einem geschlossenen Kronendach, sondern von saurem, nährstoffarmem Boden. Keine direkte Quelle zur Reaktion auf Sturm/Borkenkäfer-Störung gefunden.
- **Kopplung an simulierte Größen:** am ehesten waldtyp-gebunden (Kiefernwald/Fichtenmonokultur relevant, im Mischwald kaum vorhanden) und nur schwach an `kronendach` gekoppelt.
- **Reaktionsregel-Vorschlag:** über weite Strecken der Simulation nahezu konstant, nur bei sehr starkem, anhaltendem Kronendachverlust (z. B. nach Borkenkäfer-Kollaps in der Fichtenmonokultur) leicht rückläufig.
- **Unsicherheit:** HOCH – am unsichersten von den vier Kräutern, da keine Quelle explizit ihre Reaktion auf die im Modell vorhandenen Störungstypen behandelt → **Annahme, mit Lehrkraft abzugleichen**, ggf. bewusst ohne eigene Dynamik belassen (nahezu konstanter Indikator).

---

## Weitere Pflanzenfresser

### Eichhörnchen
- **Steckbrief:** Original Nr. 20, bereits mit Doppelrolle (Samenfresser + -verbreiter) beschrieben.
- **Störungsreaktion:** Neu recherchiert: Die Fortpflanzung ist direkt ans Nahrungsangebot gekoppelt, das wiederum stark von **Mastjahren** der Bäume abhängt (Rhythmus je nach Art ca. alle 6–10 Jahre; erst Bäume ab 10–50 Jahren Alter produzieren überhaupt Samen) ([Deutsche Wildtier Stiftung](https://www.deutschewildtierstiftung.de/aktuelles/artikel/das-eurasische-eichhoernchen); [waldwissen.net](https://www.waldwissen.net/de/lebensraum-wald/tiere-im-wald/saeugetiere/kobolde-im-wald)). Ein Borkenkäfer-Kollaps oder Sturmschaden reduziert das Samenangebot direkt (weniger/kranke Bäume) und damit mittelfristig den Bestand.
- **Kopplung an simulierte Größen:** `gesamtvitalitaet`/`fichte_vitalitaet`+`buche_vitalitaet`+`eiche_vitalitaet` (Nahrungsangebot), mit deutlicher zeitlicher Verzögerung (Mastjahr-Rhythmus ist ohnehin mehrjährig, im Modell könnte das als natürliches Rauschen um einen langsam der Baumvitalität folgenden Trend abgebildet werden).
- **Reaktionsregel-Vorschlag:** träge (Glättungsfaktor über mehrere Jahre) der mittleren Baumvitalität folgender Indikator, kein direkter 1:1-Sprung im Störungsjahr selbst.
- **Unsicherheit:** MITTEL – die Kopplung an Baumvitalität/Samenangebot ist gut belegt, die genaue Verzögerung (Mastjahr-Rhythmus ist real 6-10 Jahre, im 20-Jahre-Modell aber nur begrenzt sinnvoll 1:1 abbildbar) ist eine didaktische Vereinfachung.

### Schmetterlingsraupen / Blattläuse
- **Steckbrief:** Original Nr. 21, bereits mit Massenvermehrungs-Risiko beschrieben.
- **Störungsreaktion:** Neu recherchiert, mit Vorsicht: Massenvermehrungen von Waldschadinsekten entstehen laut Fachliteratur meist aus dem **Zusammenspiel mehrerer Faktoren** (Witterung, Fressfeinde/Parasitoide, Nahrungsangebot, Konkurrenz, Wirtspflanzen-Zustand) – es gibt **keinen** so klaren Einzelmechanismus wie beim Borkenkäfer ([iva.de](https://www.iva.de/iva-magazin/umwelt-verbraucher/forstschaedlinge-im-klimawandel); [openagrar.de](https://www.openagrar.de/servlets/MCRFileNodeServlet/openagrar_derivate_00008812/1954_heft_11_artikel_02.pdf)). Trockenheit erhöht plausibel (analog zum bereits im Original für den Borkenkäfer beschriebenen Mechanismus: gestresste Bäume sind attraktiver/nährstoffreicher für Schädlinge) auch die Anfälligkeit für Raupen-/Blattlausbefall, Wärme begünstigt schnellere Entwicklung – aber die Quellenlage zu einer klaren, borkenkäferähnlichen Kausalkette ist für Raupen/Blattläuse selbst deutlich dünner.
- **Kopplung an simulierte Größen:** am ehesten locker an Trockenheit+Temperatur gekoppelt (analog, aber schwächer/unsicherer als beim Borkenkäfer), ohne eigene Wirt-Erschöpfungs-Logik.
- **Reaktionsregel-Vorschlag:** einfacher additiver Bonus bei aktiver Trockenheit/Temperatur, deutlich schwächer skaliert als die Borkenkäfer-Reproduktionsformel, kein eigener Massenvermehrungs-Mechanismus (keine tragfähige Quelle für konkrete Zahlen gefunden).
- **Unsicherheit:** HOCH – im Unterschied zum gut dokumentierten Borkenkäfer-Mechanismus im Original ist dies für Raupen/Blattläuse eine plausible Analogie, keine belegte Kausalkette → **klar als Annahme kennzeichnen, mit Lehrkraft abzugleichen**, ggf. bewusst nur qualitativ („steigt bei Trockenheit/Wärme leicht") statt mit eigener Formel behandeln.

---

## Samenverbreiter

### Eichelhäher
- **Steckbrief/Beziehungen:** ausführlich in Original Nr. 22 und `data/edges.json` (Schlüssel-Mutualismus, plus `strukturell`-Kante zu Wildverbiss).
- **Störungsreaktion:** Im Original bereits vollständig für Szenario 6 durchdacht (Aussaatleistung wird durch Wildverbiss entwertet). Für die übrigen 5 Szenarien fehlt eine Aussage – plausibel unabhängig von Sturm/Borkenkäfer/Trockenheit/Temperatur/Totholzentnahme, da der Eichelhäher kein Totholz- oder Baumkronen-Spezialist ist, sondern an Eichen-/Buchen-Samenangebot hängt (ähnlich wie Eichhörnchen).
- **Kopplung an simulierte Größen:** `eiche_vitalitaet`/`buche_vitalitaet` (Nahrungs-/Samenangebot, wie Eichhörnchen), UND – bereits modelliert – `verjuengung_mischbaumarten` als Wirkungsziel (nicht als Treiber).
- **Reaktionsregel-Vorschlag:** wie Eichhörnchen an mittlere Eiche/Buche-Vitalität gekoppelt, aber ohne die Mastjahr-Trägheit (Vögel können im Gegensatz zu Baumsamen-Beständen schneller reagieren/wandern).
- **Unsicherheit:** GERING für die Kopplung an Baumvitalität, GERING für die bereits im Original ausgearbeitete Wildverbiss-Wechselwirkung.

### Reh und Rothirsch trennen? (ergänzende Einschätzung, wie im Auftrag verlangt)
Reh und Rothirsch sind aktuell zu einem gemeinsamen `wilddichte`-Regler zusammengefasst. Eine Auftrennung wäre fachlich möglich, aber nicht ohne Weiteres sinnvoll:
- Beide Arten wirken im Modell auf denselben Prozess (Verbiss der Baumverjüngung), mit unterschiedlicher Wirkungsweise laut Original (Reh: selektiver Verbiss junger Triebe; Rothirsch: zusätzlich Schälen der Rinde älterer Bäume) – eine Auftrennung würde vor allem eine zusätzliche Rinden-Schäl-Dynamik am Altbestand ermöglichen, die aktuell fehlt.
- Beide Arten reagieren im Modell auf denselben strukturellen Treiber (fehlende Prädation/Bejagung, Original Szenario 6) – eine Auftrennung würde den Regler nicht konzeptionell bereichern, nur zwei fast parallele Kurven erzeugen, solange keine unterschiedliche Prädator-Präferenz (Luchs bevorzugt Reh, siehe Original) mitmodelliert wird.
- **Einschätzung:** Eine Auftrennung lohnt sich am ehesten gemeinsam mit einer echten Luchs/Wolf-Simulation (siehe Prädatoren unten), weil erst dann der Unterschied „Luchs reguliert bevorzugt Reh, kaum Rothirsch" (Original, Nr. 27) sichtbar würde. Isoliert, ohne Prädatoren-Dynamik, ist der Zusatznutzen einer Trennung gering gegenüber dem Mehraufwand.

---

## Prädatoren

### Buntspecht
- **Steckbrief/Beziehungen:** ausführlich in Original Nr. 23 und `data/edges.json` – bereits die am besten dokumentierte der 7 Prädatoren-Arten.
- **Kopplung an simulierte Größen:** `totholzmenge` (Bruthöhlen) UND `borkenkaefer_dichte` (Nahrung), mit der im Original explizit genannten Einschränkung „wirkt nur bei niedriger Käferdichte regulierend, kann Massenvermehrung nicht stoppen".
- **Reaktionsregel-Vorschlag:** Indikator wächst mit `totholzmenge`, hat aber selbst nur einen kleinen, bei hoher `borkenkaefer_dichte` schnell in die Sättigung laufenden Rückkopplungs-Effekt auf `borkenkaefer_dichte` (keine Umkehrung des Borkenkäfer-Ergebnisses, nur eine leichte Dämpfung im Anfangsstadium – das war im Original bereits ausdrücklich als „nicht überzeichnen" markiert, Abschnitt 7).
- **Unsicherheit:** GERING.

### Ameisenbuntkäfer
- **Steckbrief/Beziehungen:** Original Nr. 24 – wirksamster Borkenkäfer-Gegenspieler (~20 % der natürlichen Käfer-Sterberate), selbst totholzgebunden.
- **Kopplung an simulierte Größen:** wie Buntspecht an `totholzmenge` gekoppelt, mit einem gegenüber dem Buntspecht laut Original stärker gewichteten (aber weiterhin nicht Massenvermehrung-stoppenden) Dämpfungseffekt auf `borkenkaefer_dichte`.
- **Reaktionsregel-Vorschlag:** analog Buntspecht, mit höherem Dämpfungs-Koeffizient.
- **Unsicherheit:** GERING.

### Fuchs
- **Steckbrief:** Original Nr. 25 – Generalist, reguliert „Kleinsäuger" (im Datenmodell nur als generischer Gruppen-Knoten `gruppe_kleinsaeuger` vorhanden, kein eigener simulierter Indikator).
- **Störungsreaktion:** Kaum eine der 6 Störungen wirkt plausibel direkt auf den Fuchs – er ist ein Generalist mit breitem Nahrungsspektrum und laut Recherche stärker von der Landschaftsstruktur (dichtere Bestände in reich strukturierten Kulturlandschaften als in geschlossenen Wäldern) als von einzelnen Waldstörungs-Events abhängig ([wildtierportal-bw.de](https://www.wildtierportal-bw.de/de/frontend/product/detail?productId=7)).
- **Kopplung an simulierte Größen:** **keine belastbare** – der einzige im Modell vorhandene Bezugspunkt (`gruppe_kleinsaeuger`) ist selbst nicht simuliert, sondern nur ein statischer Sammelknoten im Netzwerk-Graph.
- **Reaktionsregel-Vorschlag:** Von den 19 recherchierten Arten diejenige mit der **schwächsten Modellierbarkeit** im aktuellen Datenmodell. Ohne einen neuen, eigenständig simulierten Kleinsäuger-Indikator (der selbst nicht Teil dieses Auftrags war) lässt sich für den Fuchs keine sinnvolle Reaktionsregel ableiten – bloße Willkür wäre hier fachlich nicht vertretbar.
- **Unsicherheit:** Keine Modellierungs-Annahme möglich, sondern eine **strukturelle Lücke**: müsste zusammen mit einem neuen Kleinsäuger-Indikator angegangen werden, nicht isoliert.

### Habicht und Sperber
- **Steckbrief/Beziehungen:** Original Nr. 26 und `data/edges.json` (`habicht -> eichhoernchen`, `sperber -> eichhoernchen`).
- **Störungsreaktion:** Neu recherchiert: Greifvögel zeigen gegenüber schwankender Beutedichte eine „numerische Reaktion" (Bestand/Bruterfolg folgt der Beutedichte) typischerweise mit **1–3 Jahren Verzögerung** ([wildtiermanagement.com – Literaturstudie zur Prädation](https://www.wildtiermanagement.com/fileadmin/dateien/wildtiermanagement.de/pdfs/Literaturstudie_Praedation_NDS.pdf)) – ein konkreter, gut übertragbarer Zeitrahmen für eine didaktisch reduzierte Regel.
- **Kopplung an simulierte Größen:** an den oben vorgeschlagenen `eichhoernchen`-Indikator gekoppelt, mit 2 Jahren Verzögerung.
- **Reaktionsregel-Vorschlag:** `habicht_indikator(jahr) ≈ eichhoernchen_indikator(jahr − 2)`, geglättet. Sperber analog, aber schwächer/unabhängiger (jagt laut Original vor allem kleinere Vögel, die im Modell nicht simuliert sind – ähnliche strukturelle Einschränkung wie beim Fuchs, nur weniger vollständig, weil die Eichhörnchen-Kopplung wenigstens teilweise trägt).
- **Unsicherheit:** MITTEL – die 2-3-Jahres-Verzögerung ist eine reale, belegte Größenordnung aus der Prädationsforschung (nicht speziell für Habicht/Eichhörnchen im Wald gemessen, allgemeiner aus Prädator-Beute-Literatur übertragen) → **Annahme, mit Lehrkraft abzugleichen**.

### Luchs und Wolf
- **Steckbrief/Beziehungen:** im Original (Nr. 27) bereits am detailliertesten von allen 7 Prädatoren ausgearbeitet, inklusive konkreter Zahl (~55 Rehe/Jahr pro Luchs) und Verbreitungsstatus.
- **Störungsreaktion:** Im Original explizit als **Zustandsparameter, kein Trigger-Event** empfohlen (analog zu Szenario 6/Wildverbiss selbst) – „funktionierende Prädator-Beute-Regulation" wäre die Gegenposition zum aktuellen `wilddichte`-Regler, nicht eine zusätzliche Dynamik obendrauf.
- **Kopplung an simulierte Größen:** direkter Eingriffspunkt in die bestehende `WILD_ZIEL`-Logik in `model.py` – ein „Prädatoren vorhanden"-Schalter könnte den Zielwert `ziel = WILD_ZIEL[stufe]` senken bzw. die Angleichungsrate (`* 0.3`) verändern, statt einen eigenen Indikator zu benötigen.
- **Reaktionsregel-Vorschlag:** am ehesten **kein eigener Sprite/Indikator**, sondern eine vierte Regler-Stufe oder ein Zusatz-Schalter zum bestehenden Wildverbiss-Regler („mit wirksamer Prädation" senkt effektiv die Ziel-Wilddichte) – konzeptionell näher an Szenario 6 als an einer neuen Art-Kachel.
- **Unsicherheit:** GERING fachlich (im Original am besten belegt), aber **UI-konzeptionell die anspruchsvollste** der 19 Arten, weil sie eher eine Erweiterung des bestehenden Wildverbiss-Reglers als eine neue Baumart-artige Kachel wäre.

---

## Zusammenfassende Einschätzung (für die spätere Umsetzungs-Entscheidung)

**Gut modellierbar, hohe Sicherheit** (nächster sinnvoller Umsetzungsschritt, falls das Backlog-Item priorisiert wird): Hasel, Holunder, Brombeere, Zunderschwamm, Bläuepilz, Hallimasch, Brennnessel, Eichelhäher, Buntspecht, Ameisenbuntkäfer – für alle diese gibt es eine klare, aus bereits simulierten Indikatoren ableitbare Kopplung.

**Modellierbar, aber mit expliziten Annahmen** (sollten vor Umsetzung mit einer Lehrkraft abgeglichen werden): Buschwindröschen, Waldmeister, Heidelbeere, Eichhörnchen, Raupen/Blattläuse, Habicht/Sperber.

**Konzeptionell anders zu lösen, nicht als einfache neue Art-Kachel:** Luchs/Wolf (eher Erweiterung des bestehenden Wildverbiss-Reglers als neuer Indikator), Mykorrhizapilz (Rückkopplungs-Kreis, kein linearer Treiber).

**Strukturelle Lücke, hier nicht lösbar:** Fuchs – hängt an einem im Datenmodell nicht simulierten Kleinsäuger-Indikator; eine Umsetzung würde zunächst diesen (bislang nur als Sammelgruppen-Knoten im Netzwerk-Graph vorhandenen) Indikator erfordern.

**Nicht Teil dieser Recherche, aber als Randnotiz:** Eine Trennung von Reh/Rothirsch in zwei eigene Indikatoren lohnt sich nach dieser Einschätzung am ehesten zusammen mit, nicht unabhängig von, einer Luchs/Wolf-Umsetzung.

---

## Nachrecherche zur Unsicherheits-Reduktion (Schritt 0, 2026-08-26)

Gezielte Nachrecherche zu den unsichersten Formeln aus der Erstrecherche (siehe Umsetzungsplan „Einbau weiterer Arten + Wolf/Luchs-Prädation") und zu den neuen Wolf/Luchs-Reduktionsfaktoren für Teil B. Aktualisiert die Formel-Vorschläge oben nicht direkt (die bleiben als ursprünglicher Recherchestand stehen), sondern ergänzt sie hier um belastbarere Grundlagen; die tatsächlich zu verwendenden Formeln stehen im Umsetzungsplan.

### 1. Kleinsäuger — deutliche Verbesserung möglich
Die bisherige Formel (`0.6*biodiversitaet + 0.4*bodenfeuchte`) war komplett erfunden. Recherche zu Wald-Kleinsäugern (Rötelmaus, Wald-/Gelbhalsmaus) zeigt: Der reale Haupttreiber ist **Mastjahr-getriebenes Nahrungsangebot**, nicht Bodenfeuchte/Biodiversität. Nach einem starken Buchen-/Fichten-Mastjahr wurde ein Dichteanstieg um das 30- bis 40-Fache bis zum Folgefrühjahr dokumentiert (Rötelmaus bzw. Gelbhalsmaus) ([Springer/Journal of Pest Science, Zur Verbreitung, Ernährung und Populationsdynamik der Rötelmaus und der Gelbhalsmaus](https://link.springer.com/article/10.1007/BF01903035); Kontext-Bestätigung bei [waldwissen.net – Mäuse im Wald](https://www.waldwissen.net/de/lebensraum-wald/tiere-im-wald/saeugetiere/maeuse-im-wald)). Waldmaus-Dichten schwanken je nach Habitat/Jahreszeit zwischen ca. 5 Ind./ha (Frühjahr) und 20–50 Ind./ha (Herbst) ([kleinsaeuger.at – Waldmaus](https://kleinsaeuger.at/apodemus-sylvaticus/)).
**Empfehlung:** `kleinsaeuger_indikator` statt an `biodiversitaet`/`bodenfeuchte` an eine **Mastjahr-Ersatzgröße** koppeln, z. B. `(buche_vitalitaet + eiche_vitalitaet) / 2` (dieselbe Logik, die bereits für `eichhoernchen_indikator`/`eichelhaeher_indikator` vorgeschlagen wurde) — fachlich deutlich besser begründet, auch wenn die extremen Mastjahr-Sprünge (30-40-fach) im didaktisch geglätteten Modell bewusst nicht 1:1 nachgebildet werden. Bleibt weiterhin eine vereinfachende Annahme (kein echter, mehrjähriger Mastjahr-Zyklus im Modell), aber nicht mehr komplett ohne fachliche Grundlage.

### 2. Fuchs — kein direkter Störungs-Bezug gefunden, indirekt gestärkt
Bestätigt: Fuchs ist Nahrungsgeneralist, frisst u. a. Aas ([t-online – Fuchs: Nahrung und Fressfeinde](https://www.t-online.de/leben/familie/id_70563348/fuchs-nahrung-und-fressfeinde.html); [Deutsche Wildtier Stiftung – Fuchs](https://www.deutschewildtierstiftung.de/wildtiere/fuchs)). Eine **direkte** Kopplung an Sturm-/Käferstörungen (z. B. verstärkte Aas-/Totholznutzung nach Kalamitäten) ließ sich nicht belegen — die Suche fand nur allgemeine Fuchs-Ernährungsfakten, keine Studie zu Fuchsreaktion auf Waldstörungsereignisse.
**Ergebnis:** Keine neue direkte Formel. Die Kopplung bleibt wie geplant ausschließlich indirekt über `kleinsaeuger_indikator` (die durch Punkt 1 selbst deutlich besser fundiert ist) — weiterhin explizit als **Annahme, mit Lehrkraft abzugleichen** kennzeichnen.

### 3. Buschwindröschen/Waldmeister/Heidelbeere — Quelle zu abrupter Störung gefunden, aber ein wichtiger Zusatz-Befund
Eine einschlägige Studie existiert: „Buchenwald-Sukzession nach Windwurf auf Buntsandstein im südwestlichen Harzvorland" (vegetationsökologische Dauerflächen-Untersuchung 1998–2001 auf Windwurfflächen) ([karstwanderweg.de – Abstract](https://www.karstwanderweg.de/publika/abstract/abstract4.htm)) — bestätigt grundsätzlich, dass Windwurfflächen eine eigene Krautschicht-Sukzessionsdynamik auslösen, liefert aber keine granularen Art-für-Art-Zahlen für Buschwindröschen/Waldmeister/Heidelbeere im Rahmen dieser Recherche.
**Wichtiger fachlicher Zusatz-Befund:** Buschwindröschen braucht das Licht **speziell im zeitigen Frühjahr vor dem Laubaustrieb** ([NABU MV – Frühblüher](https://mecklenburg-vorpommern.nabu.de/natur-und-landschaft/wald/lebensraum-wald/13716.html)) — die Art ist also eng an den *saisonalen* Licht-Dunkel-Wechsel eines noch geschlossenen Kronendachs gebunden, nicht per se an dauerhaft *dauerhaft* offene Flächen. Ein permanenter Kronendachverlust (Sturm/Käferkahlfläche) verändert damit möglicherweise ein anderes Lichtregime als der saisonale Rhythmus, von dem die Art eigentlich profitiert — die bisherige Modell-Annahme „Kronendachverlust = mehr Buschwindröschen" ist dadurch nicht widerlegt, aber nuancierter als angenommen.
**Ergebnis:** Formel unverändert, aber Unsicherheit bleibt bei **mittel-hoch**; im Code-Kommentar zusätzlich auf diese saisonale Nuance hinweisen.

### 4. Eichhörnchen — nichts Neues gefunden
Keine Quelle zur spezifischen Reaktionsgeschwindigkeit nach Sturm-/Käferschäden gefunden (nur allgemeine Nahrungsangebot-Abhängigkeit, bereits in Runde 1 bekannt: [LWF Bayern – Eichhörnchen](https://www.lwf.bayern.de/waldschutz/kleinsaeuger/064070/index.php); [Deutsche Wildtier Stiftung – Eichhörnchen](https://www.deutschewildtierstiftung.de/wildtiere/eichhoernchen)).
**Ergebnis:** Formel unverändert, Unsicherheit bleibt **mittel**.

### 5. Raupen/Blattläuse — unterschiedlich gute Ergebnisse, Formeln sollten sich jetzt unterscheiden
- **Blattläuse (Fichtenröhrenlaus):** guter, spezifischer Treffer. Massenvermehrung wird durch milde Winter (>−14 °C) **plus mehrjährig anhaltend trockene Frühjahre** begünstigt; Trockenstress schwächt gezielt die Harzabwehr der Fichte ([waldwissen.net – Die Fichtenröhrenlaus](https://www.waldwissen.net/de/waldwirtschaft/schadensmanagement/insekten/die-fichtenroehrenlaus)) — strukturell fast identisch zum bereits im Modell vorhandenen Borkenkäfer-Mechanismus (Trockenheit schwächt Harzabwehr → mehr Befall).
  **Empfehlung:** `blattlaeuse_indikator` enger an `fichte_vitalitaet`/Trockenheit koppeln, analog zur Hallimasch-Formel (Trockenheits-Bonus + Kopplung an geschwächte Fichten), statt am reinen additiven Pauschal-Bonus festzuhalten. Unsicherheit sinkt auf **mittel**.
- **Raupen (Eichenwickler-artig):** Recherche (zu Eichenprozessionsspinner, einem nah verwandten, aber nicht identischen Eichenschädling) bestätigt „kein Einzelursache-Mechanismus", sondern Zusammenspiel aus warm-trockenen Frühjahren, Synchronität von Laubaustrieb und Larvenschlupf, und milden Wintern ([Forstpraxis – Massenvermehrung beim Eichenprozessionsspinner](https://www.forstpraxis.de/massenvermehrung-beim-eichenprozessionsspinner-ursachen-24719)). Die im Modell nicht abbildbare „Synchronität"-Komponente bleibt der entscheidende, nicht modellierbare Faktor.
  **Ergebnis:** Formel für `raupen_indikator` unverändert (einfacher additiver Trockenheit/Temperatur-Bonus), Unsicherheit bleibt **hoch** — jetzt aber mit klarerem Beleg, WARUM sie hoch bleibt (Artverwechslung Eichenprozessionsspinner/Eichenwickler zusätzlich vermerken).

### 6. Wolf vs. Luchs, Beutespektrum Reh/Rothirsch — deutliche Korrektur der Platzhalter-Zahlen
Beide Reduktionsfaktoren waren freie Schätzungen; die Recherche liefert jetzt echte Zahlen:
- **Luchs (Schweiz, KORA-Radiotelemetrie-Studien):** 51,3 % Reh, 28,5 % Gämse (in D nicht vorkommend) im Beutespektrum; **Rothirsch wird in den zitierten Studien nicht einmal als eigene Kategorie geführt** ([KORA – Portrait Luchs](https://www.kora.ch/de/arten/luchs/portrait)) — die Reh-Präferenz ist damit noch ausgeprägter als der bisherige Platzhalter annahm, die Rothirsch-Wirkung praktisch vernachlässigbar.
- **Wolf (Deutschland, Kotproben-Auswertung 2001–2019, Senckenberg/DBBW-Kontext sowie Lausitz-Regionalstudie):** bundesweit Reh 51 %, Rothirsch 13 %, Wildschwein 20 % (nicht modelliert); regional Lausitz Reh 52,2 %, Rothirsch 24,7 %, Wildschwein 16,3 % ([NABU – Das frisst der Wolf](https://www.nabu.de/tiere-und-pflanzen/saeugetiere/wolf/wissen/15572.html)). Der Wolf nimmt damit zwar deutlich mehr Rothirsch als der Luchs, aber klar weniger als Reh (Verhältnis grob 2:1 bis 4:1 zugunsten Reh) — die bisherige Annahme „Wolf wirkt auf beide Arten etwa gleich stark" (0.55/0.55) ist nicht haltbar.

**Empfohlene aktualisierte Reduktionsfaktoren** (ersetzen die Platzhalter im Umsetzungsplan):
```
LUCHS_REDUKTION = {"reh": 0.80, "rothirsch": 0.10}   # war 0.20 - KORA-Daten zeigen Rothirsch kommt im Luchs-Beutespektrum praktisch nicht vor
WOLF_REDUKTION  = {"reh": 0.55, "rothirsch": 0.30}   # war 0.55 - DBBW/Senckenberg-Kotprobenanalyse: Wolf nimmt Rothirsch klar seltener als Reh (Diätanteil-Verhältnis ~2:1 bis 4:1), aber deutlich häufiger als der Luchs
```
Wichtiger Caveat, unbedingt im Code-Kommentar festhalten: Diese Prozentzahlen sind **Anteile am tatsächlich gefressenen Beutespektrum**, nicht direkt gemessene "Regulationswirkung pro Kopf" auf die jeweilige Wild-Population (Diätanteile spiegeln auch die relative Verfügbarkeit/Häufigkeit von Reh vs. Rothirsch im jeweiligen Gebiet, nicht nur Präferenz). Die Übertragung von Diätanteilen auf Reduktionsfaktoren bleibt damit eine **plausible, aber weiterhin nicht 1:1 belegte Modellierungs-Annahme** — jetzt allerdings mit einer echten Zahlengrundlage statt freier Schätzung.

### 7. Reh-/Rothirschdichte-Bandbreiten — Größenordnung bestätigt, Basiswert unverändert
Reales Bild deutlich extremer als das Modell abbildet: Reh forstlich empfohlen ~8 Ind./100 ha, bei unzureichender Bejagung real bis 20 Ind./100 ha (Faktor ~2,5) ([lutzmoeller.net – Rehdichte in Deutschland](http://lutzmoeller.net/Wild/Rehdichte.php); [DJZ – Optimale Wilddichten](https://djz.de/optimale-wilddichten-749/)). Rothirsch forstlich empfohlen 2–4 Ind./100 ha, per Luftbildzählung tatsächlich gemessene Dichten 3,4–25,7 Ind./100 ha (Faktor bis ~8) ([PIRSCH – Rotwild-Zählung aus der Luft](https://www.pirsch.de/jagdwissen/wildbiologie/rotwild-zaehlung-aus-der-luft-das-sind-die-ergebnisse-39333)).
**Ergebnis:** Die reale Schwankungsbreite ist für Rothirsch tendenziell noch extremer als für Reh (nicht symmetrisch) — das würde für unterschiedliche `REH_ZIEL_BASIS`/`ROTHIRSCH_ZIEL_BASIS`-Werte sprechen. Angesichts der ohnehin sehr großen Quellen-Schwankungsbreite (3,4–25,7) und der bewusst didaktisch-qualitativen, nicht auf reale Individuenzahlen kalibrierten Modellskala (`_meta.skala`: „didaktisch skaliert, keine exakten Prozentzahlen") wird **keine** Änderung an `REH_ZIEL_BASIS = ROTHIRSCH_ZIEL_BASIS = 80` empfohlen — die Richtung (beide Arten können ohne Prädatoren/ausreichende Bejagung weit über das forstlich verträgliche Maß hinauswachsen) ist damit lediglich zusätzlich real belegt, ohne dass eine seriöse neue Kalibrierungszahl daraus ableitbar wäre.

### Zusammenfassung: was sich ändert
**Belastbar aktualisiert:** Kleinsäuger-Formel (Punkt 1), Blattläuse-Formel (Punkt 5), Luchs/Wolf-Reduktionsfaktoren (Punkt 6).
**Unverändert, aber besser begründet/mit Zusatz-Caveat:** Buschwindröschen (Punkt 3, saisonale Nuance ergänzt), Fuchs (Punkt 2, Annahme bestätigt bestehen), Raupen (Punkt 5, Artverwechslungs-Caveat ergänzt), Reh/Rothirsch-Basiswert (Punkt 7, Richtung bestätigt, Zahl unverändert).
**Unverändert, nichts gefunden:** Eichhörnchen (Punkt 4).
