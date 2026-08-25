# Technisches Anforderungsdokument
## Waldökosystem-Störungssimulation für iPads – Klasse 8, Gymnasium

**Status:** Entwurf zur Abstimmung – vor Weitergabe an Claude Code bitte Abschnitt 9 „Offene Punkte" prüfen.
**Inhaltliche Quelle:** *Mitteleuropäische Waldökosysteme: Didaktische Wissensbasis für eine Störungssimulation (Klasse 8)* – im Folgenden „Wissensbasis" genannt. Diese Datei ist die alleinige fachliche Grundlage für Arten, Zahlen, Beziehungen und Kaskadenlogik.

---

## 1. Kontext & Zielsetzung

Es soll eine interaktive Simulation mitteleuropäischer Waldökosysteme entstehen, mit der Schüler:innen der 8. Klasse eigenständig auf iPads „Netzwerkdenken" (Systemdenken) erfahren: Störungen breiten sich durch vernetzte Systeme aus und wirken nicht isoliert. Die Simulation setzt die in der Wissensbasis (Abschnitt 6) formulierten Umsetzungsempfehlungen um: gewichteter Graph, Waldtyp als Startparameter, Störungen als Kettenreaktionen, unterschiedliche Zeitkonstanten für Schädlings- vs. Walddynamik, eingebaute Reflexion, Schwelleneffekte.

**Lernziel:** Erkennen, dass ökologische Störungen kaskadenartig wirken, und dass Artenvielfalt/Strukturvielfalt Resilienz erzeugt (Kontrast Mischwald vs. Monokultur).

---

## 2. Pädagogischer Rahmen

| Parameter | Festlegung |
|---|---|
| Zeitrahmen | Einzelstunde, ca. 45 Minuten |
| Sozialform | Flexibel – Einzel- oder Partnerarbeit am selben iPad |
| Geräte | Schul-iPads, Zugriff über Safari |
| Zugangsmodell | Progressive Web App (PWA), „Zum Home-Bildschirm hinzufügen" |
| Datenschutz | Kein Login, keine Accounts, keine Serverübertragung |

**Didaktischer Ablauf (Vorschlag, außerhalb der App durch Lehrkraft gesteuert):**
1. Kurze Einführung durch die Lehrkraft (Plenum, ohne App)
2. **Phase 1 – Exploration (App, ca. 15–20 Min):** SuS wählen 1–2 Kombinationen aus Waldtyp × Störung, stellen Hypothesen auf, lassen die Simulation laufen, beobachten und reflektieren
3. **Phase 2 – Erklärung (App, ca. 10–15 Min):** SuS betrachten den Netzwerk-Graphen zur erlebten Kombination, verstehen die tatsächlichen Wirkzusammenhänge
4. **Plenum (ca. 10 Min, ohne App):** Da unterschiedliche SuS/Paare unterschiedliche der 12 möglichen Kombinationen (3 Waldtypen × 4 Störungen) getestet haben, tragen sie ihre Beobachtungen zusammen (Jigsaw-Prinzip)

Die App muss diesen Ablauf technisch unterstützen, aber die Durchführung des Plenums nicht selbst steuern.

---

## 3. Nutzer:innen & Geräte

- Zielgruppe: 13–14 Jahre, heterogene Technikaffinität, keine Vorkenntnisse in der App nötig
- Keine personalisierten Profile, keine Klassenverwaltung, keine Lehrkraft-Ansicht
- Gerät: iPad (Schulbestand, ggf. ältere Modelle), Safari als Zielbrowser

---

## 4. Funktionale Anforderungen

### 4.1 Startbildschirm / Auswahl
- Auswahl eines Waldtyps: **A) Buchen-Eichen-Mischwald**, **B) Fichtenmonokultur**, **C) Kiefernwald auf Sand** – mit kurzer, bebilderter Beschreibung (siehe Wissensbasis Abschnitt 1)
- Auswahl einer Störung: **Borkenkäferbefall, Trockenheit, höhere Temperaturen, Extremwetter (Sturm)** – kurze Beschreibung je Störung
- Vor Start: kurze Hypothesen-Abfrage („Was denkst du, wird passieren?") als freies Textfeld oder einfache Mehrfachauswahl

### 4.2 Phase 1 – Explorative Simulation (Dashboard)
- Zeitsteuerung: Play/Pause/Einzelschritt über eine Zeitachse in Jahren (z. B. 0–20 Jahre)
- **Wichtig:** unterschiedliche Zeitkonstanten abbilden – Borkenkäfer-Generationen (1–3/Jahr, schnell) vs. Baumverjüngung/Walderholung (Jahrzehnte, langsam) – siehe Wissensbasis Abschnitt 6.4
- Sichtbare, **vereinfachte** Indikatoren (skaliert niedrig/mittel/hoch, bewusst **keine** exakten Differentialgleichungen – siehe Wissensbasis Abschnitt 5):
  - Baumbestand nach Art (relativer Anteil)
  - Schädlingspopulation (bei relevantem Szenario)
  - Totholzmenge
  - Kronendach/Beschattung
  - Bodenfeuchte
  - Ein einfacher Biodiversitäts-Indikator
- Visuelles Feedback über Icons/einfache Illustrationen, die sich sichtbar verändern (z. B. Baumsymbole, die sich verfärben oder umfallen)
- Ergebniszusammenfassung am Ende des Durchlaufs + Abgleich mit der eigenen Hypothese
- Reflexionsfrage nach jedem Durchlauf (freies Textfeld), z. B. sinngemäß: „Welche Art war betroffen, obwohl du sie nicht direkt gestört hast?" (direkt aus Wissensbasis Abschnitt 6.5 übernommen)

### 4.3 Phase 2 – Netzwerk-Graph (Erklärung)
- Knoten-Kanten-Darstellung basierend auf der Beziehungstabelle der Wissensbasis (Abschnitt 3.2)
- Standardmäßig: die für den gespielten Waldtyp/die gespielte Störung relevante Teilmenge; Option „vollständiges Netzwerk anzeigen"
- Der in Phase 1 tatsächlich abgelaufene Kaskadenpfad wird hervorgehoben/animiert (Beispiel: Trockenheit → Fichte↓ → Borkenkäfer↑ → Totholz↑ → Sukzession↑)
- Antippen eines Knotens zeigt einen Kurzsteckbrief (Name, 1–2 Fakten aus Wissensbasis Abschnitt 2)
- Die vier Beziehungstypen (Fraß, Symbiose, Konkurrenz, Zersetzung) plus abiotische Kopplung sind farblich/symbolisch unterscheidbar
- Empfohlen: Vergleichsansicht zweier Waldtypen nebeneinander, um den Resilienz-Kontrast (Mono- vs. Mischwald) sichtbar zu machen

### 4.4 Digitales Forscherheft (lokaler Verlauf)
- Speichert je Durchlauf: Waldtyp, Störung, Hypothese, Ergebniszusammenfassung, Reflexionstext, Zeitpunkt
- Übersicht aller bisherigen Durchläufe auf dem Gerät, damit SuS im Plenum ihre eigenen Ergebnisse zeigen/vorlesen können
- Keine Pflicht, alle 12 Kombinationen zu erkunden; optionale Fortschrittsanzeige „X von 12 Kombinationen erkundet" (nice-to-have, siehe Abschnitt 9)

### 4.5 Inhaltliche Datenbasis
- Alle Arten, Steckbriefe, Beziehungen und Zahlen werden **1:1 aus der Wissensbasis übernommen**, nicht neu erfunden
- Modellierung als strukturierte Daten (Knoten = Arten/abiotische Faktoren, Kanten = Beziehungen), z. B.:

```json
{
  "nodes": [
    { "id": "fichte", "name": "Gemeine Fichte", "typ": "baum", "trophieebene": 1, "trockenresistenz": "gering" },
    { "id": "borkenkaefer", "name": "Buchdrucker", "typ": "herbivor", "trophieebene": 2, "vermehrungsrate": "sehr_hoch" }
  ],
  "edges": [
    { "quelle": "borkenkaefer", "ziel": "fichte", "typ": "fraess", "staerke": "stark", "beschreibung": "Bast/Rinde; tödlich bei Massenbefall" }
  ]
}
```
- Waldtyp = Startparameter mit initialem Artenbestand und globalem Resilienzfaktor
- Vier Störungsereignisse mit Kaskadenlogik gemäß Wissensbasis Abschnitt 4
- **Verbindliches Testkriterium** (Wissensbasis Abschnitt 6.2): Szenario „Borkenkäfer + Fichtenmonokultur" muss zu großflächigem Kollaps führen, dieselbe Störung im Mischwald nur zu lokalem Schaden. Bildet sich dieser Kontrast nicht ab, gilt das Modell als zu grob.

---

## 5. Nicht-funktionale Anforderungen

### 5.1 Plattform
- Progressive Web App: `manifest.json`, Icons, „Zum Home-Bildschirm hinzufügen" unter iPadOS/Safari
- Kein App-Store-Vertrieb erforderlich
- **Installation ist eine optionale Komfort-Verbesserung, keine Voraussetzung:** Offlinefähigkeit (5.2) und lokale Speicherung (5.3) müssen auch funktionieren, wenn die Seite ganz normal im Safari-Tab geöffnet wird, ohne dass „Zum Home-Bildschirm hinzufügen" genutzt wurde. Installiert wird nur Icon + Vollbildmodus ohne Adressleiste hinzugefügt

### 5.2 Offlinefähigkeit
- Service Worker cached alle Assets (HTML/CSS/JS, Bilder, Icons, Daten) beim ersten Laden
- Nach einmaligem Laden vollständig ohne Internetverbindung nutzbar
- Keine Laufzeit-Nachladen von externen Ressourcen (Fonts, CDN-Bibliotheken) – alles lokal einbinden
- **Versionierte Cache-Strategie mit zuverlässiger Aktualisierung:** Bei jeder neuen Version alte Caches automatisch löschen und die neue Version aktiv übernehmen (`skipWaiting()`/`clients.claim()` oder gleichwertiges Vorgehen), damit Korrekturen zuverlässig auf den Geräten ankommen, sobald wieder eine Internetverbindung besteht – sowohl während der Entwicklung als auch bei kurzfristigen inhaltlichen Korrekturen vor dem Unterricht

### 5.3 Datenschutz
- Keine Accounts, kein Login, keine Datenübertragung an einen Server
- Alle Daten (Forscherheft, Fortschritt) ausschließlich lokal auf dem Gerät (z. B. localStorage/IndexedDB)
- Kein Tracking, keine Analytics von Drittanbietern

### 5.4 Performance & Kompatibilität
- Muss auf schulüblichen iPads flüssig laufen (auch ältere Modelle)
- Leichte Grafiktechnik bevorzugt (SVG/Canvas 2D); kein schweres WebGL/3D nötig
- Kurze Ladezeit beim Erststart im Schul-WLAN

### 5.5 Barrierefreiheit & Bedienbarkeit
- Große Touch-Ziele, gut ablesbar auch bei Partnerarbeit (zwei Personen vor einem iPad)
- Farbcodierungen nie ausschließlich über Farbe – zusätzlich Icons/Muster (Farbfehlsichtigkeit)
- Altersgerechte, aber fachlich korrekte Sprache; wissenschaftliche Artnamen kursiv, wie in der Wissensbasis
- Kurze Texte, keine Textwüsten

### 5.6 Robustheit
- Kein Datenverlust bei Sperrbildschirm/App-Wechsel während der Stunde
- Möglichkeit, eine „neue Sitzung" zu starten (z. B. wenn dasselbe iPad später von einer anderen Klasse genutzt wird)

### 5.7 Bereitstellung auf den Geräten
- Die PWA benötigt eine feste HTTPS-URL (Voraussetzung für „Zum Home-Bildschirm hinzufügen" und den Service Worker). Reines Versenden der Projektdateien (z. B. per AirDrop) reicht **nicht** aus, um die App als installierbare, offlinefähige Web-App zu nutzen – es muss eine echte gehostete Adresse sein
- **Konkrete Hosting-Entscheidung: GitHub Pages** (vorhandener GitHub-Account wird genutzt). HTTPS ist automatisch inklusive, kostenlos für ein öffentliches Repository
  - Auf einem kostenlosen GitHub-Account funktioniert Pages nur mit einem **öffentlichen** Repository (kein Problem, da keine Schülerdaten serverseitig gespeichert werden)
  - Die resultierende URL hat die Form `https://<username>.github.io/<repo-name>/`, liegt also in einem **Unterordner, nicht im Root**. Claude Code muss deshalb im `manifest.json` (`start_url`, `scope`), im Service-Worker-Scope und bei allen Asset-Pfaden **relative statt absolute Pfade** verwenden, sonst funktionieren Installation und Offline-Caching auf GitHub Pages nicht korrekt
  - Nach dem Deployment: QR-Code für die finale URL erzeugen und im Unterricht per Beamer/Whiteboard anzeigen (siehe Verteilung unten)
- Empfohlene Verteilung der URL an die Klasse: **QR-Code** (schnellste und bei 25–30 Geräten gleichzeitig zuverlässigste Methode, per Beamer/Whiteboard anzeigen). Alternativen: kurze, gut vorlesbare URL, Link im Schul-LMS, oder AirDrop (funktioniert nur, wenn AirDrop schulseitig nicht per Geräteverwaltung deaktiviert ist, und ist bei vielen Geräten gleichzeitig weniger robust als ein QR-Code)
- Falls die Schule ein Mobile-Device-Management einsetzt (z. B. Apple School Manager/Jamf School), kann die IT-Administration die URL alternativ direkt als „Web-Clip" auf alle Schüler-iPads pushen – dann ist keine manuelle Installation durch die SuS nötig
- Damit in der 45-Minuten-Stunde keine Zeit fürs Laden/Cachen verloren geht, sollte die App idealerweise schon vor der Stunde einmal online geöffnet und zum Home-Bildschirm hinzugefügt werden (z. B. als kurze Hausaufgabe)

---

## 6. Technologievorschlag (für Claude Code)

- Reines Frontend, kein Backend/Server (passend zu Offline- und Datenschutz-Anforderung)
- HTML5, CSS, JavaScript – Framework optional, aber nicht zwingend nötig
- SVG oder Canvas für den Netzwerk-Graphen; falls eine Bibliothek genutzt wird, lokal einbinden statt über CDN (wegen Offlinefähigkeit)
- Web App Manifest + Service Worker für PWA/Offline-Betrieb
- localStorage oder IndexedDB für das Forscherheft
- Inhaltliche Daten (Knoten, Kanten, Waldtypen, Störungsszenarien) als separate, gut wartbare Datendateien (z. B. JSON), getrennt von der Anwendungslogik

---

## 7. Abgrenzung – was NICHT gebaut werden soll

- Kein Mehrspieler- oder Server-Sync zwischen Geräten
- Kein Lehrkraft-Dashboard, keine zentrale Auswertung
- Keine exakten Differentialgleichungen/Populationsmodelle – nur skalierte Parameter (niedrig/mittel/hoch) gemäß Wissensbasis
- Keine Nutzerkonten/Login
- Keine fachlichen Inhalte, die über die Wissensbasis hinausgehen, ohne vorherige Rücksprache

---

## 8. Akzeptanzkriterien (Definition of Done)

- [ ] Alle 3 Waldtypen und alle 4 Störungen sind auswählbar und funktionsfähig
- [ ] „Borkenkäfer + Fichtenmonokultur" führt sichtbar zu großflächigem Kollaps, im Mischwald nur zu lokalem Schaden
- [ ] App funktioniert nach einmaligem Laden vollständig offline
- [ ] App lässt sich unter iPadOS/Safari zum Home-Bildschirm hinzufügen und startet von dort im Vollbildmodus
- [ ] Keine Netzwerkzugriffe zur Laufzeit (außer beim allerersten Laden)
- [ ] Forscherheft-Einträge bleiben nach Schließen/Neustart der App erhalten
- [ ] Ein Durchlauf (Hypothese → Simulation → Ergebnis → Reflexion → Graph-Erklärung) ist in ca. 10–15 Minuten realistisch durchführbar
- [ ] Bedienung ist für Achtklässler:innen ohne Erklärung durch die Lehrkraft selbsterklärend

---

## 9. Offene Punkte – bitte vor Weitergabe an Claude Code klären

- Soll es eine Export-/Teilen-Funktion geben (z. B. Forscherheft als Text oder Bild, für ein Portfolio)?
- Soll es einen optionalen „Vorführ-Modus" für die Lehrkraft geben (z. B. Beamer-Demo vor der eigentlichen Arbeitsphase)?
- Bevorzugter visueller Stil: eher comichaft-illustrativ oder eher sachlich-schematisch?
- Sollen alle 28 Arten-Steckbriefe zusätzlich als durchsuchbares Lexikon unabhängig vom Graphen verfügbar sein?
- Wie wird die Zuteilung der Waldtyp-Störungs-Kombination im Jigsaw-Ansatz gesteuert – freie Wahl der SuS oder Vorgabe durch die Lehrkraft (außerhalb der App, z. B. per Zettel/Zufallsliste)?
- Gibt es eine Mindestanforderung an iPadOS-/Safari-Version, abhängig vom Gerätepark der Schule?

---

## 10. Referenz

Fachliche Wissensbasis: *„Mitteleuropäische Waldökosysteme: Didaktische Wissensbasis für eine Störungssimulation (Klasse 8)"*. Diese Datei ist die alleinige inhaltliche Quelle für Arten, Zahlen, Beziehungen und Kaskaden. Bei fachlichen Unklarheiten hat sie Vorrang vor eigenen Annahmen von Claude Code.
