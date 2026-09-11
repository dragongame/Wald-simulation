"""Ökologisches Berechnungsmodul (single source of truth) für die
Build-Time-Vorabsimulation, siehe Umsetzungsauftrag Abschnitt 2.11.

Dieses Modul enthält ausschließlich die Kaskaden-/Schwellenwert-Logik.
Es wird nur zur Build-Zeit ausgeführt (siehe build_simulationen.py) - die
Laufzeit-App liest ausschließlich die erzeugten JSON-Zeitreihen und
berechnet zur Laufzeit nichts mehr.

Werkzeug-Hinweis: In dieser Entwicklungsumgebung stand kein Node.js zur
Verfügung, daher ist der Build-Schritt in Python statt JavaScript
implementiert (Technikdokument Abschnitt 6 empfiehlt JS, schreibt es aber
nicht zwingend vor - das Modul läuft ausschließlich beim Build und wird nie
an den Browser ausgeliefert). Die Ausgabe ist reines, sprachunabhängiges
JSON; eine spätere Portierung nach JavaScript ist jederzeit möglich, ohne
dass sich am Datenmodell oder den Ausgabedateien etwas ändert.

Fachliche Grundlage: Wissensbasis Abschnitt 4 (sechs Störungsszenarien) und
Abschnitt 6 (Empfehlungen für die Umsetzung), quantifiziert als didaktisch
skalierte 0-100-Werte (Wissensbasis Abschnitt 5: keine exakten
Differentialgleichungen, siehe auch Technikdokument 4.2/7).
"""

from __future__ import annotations

JAHRE = 21  # Jahr 0 bis Jahr 20 (Umsetzungsauftrag 3.3 / Technikdokument 4.2)

BASIS_TOTHOLZ = {"mischwald": 15, "fichtenmonokultur": 5, "kiefernwald": 10}
BASIS_BIODIVERSITAET = {"mischwald": 80, "fichtenmonokultur": 30, "kiefernwald": 40}
BASIS_BRANDRISIKO = {"mischwald": 15, "fichtenmonokultur": 40, "kiefernwald": 70}

# Reh/Rothirsch-Zieldichte ohne Prädatoren (Ausgangswert 80 = reale
# Überpopulations-Situation, wie sie heute in weiten Teilen Deutschlands
# ohne Luchs/Wolf vorherrscht - siehe Wissensbasis-Ergänzung, Abschnitt
# "Nachrecherche" Punkt 7: reale Dichte-Spannen bestätigen die Richtung,
# der 0-100-Wert selbst bleibt eine didaktische Skala). LUCHS_REDUKTION/
# WOLF_REDUKTION sind mit echten Beutespektrum-Zahlen unterlegt (KORA-
# Radiotelemetrie bzw. DBBW/Senckenberg-Kotprobenanalyse, siehe dort Punkt
# 6): der Luchs ist ein Reh-Spezialist (Rothirsch taucht in den Studien
# praktisch nicht als Beute auf), der Wolf nimmt deutlich mehr Rothirsch,
# aber laut Diätanteilen klar seltener als Reh. Diätanteile sind kein
# direktes Maß für Regulationswirkung pro Kopf - die Übertragung auf
# Reduktionsfaktoren bleibt eine Modellierungs-Annahme, jetzt aber mit
# echter Zahlengrundlage statt freier Schätzung.
REH_ZIEL_BASIS = 80.0
ROTHIRSCH_ZIEL_BASIS = 80.0
LUCHS_REDUKTION = {"reh": 0.80, "rothirsch": 0.10}
WOLF_REDUKTION = {"reh": 0.55, "rothirsch": 0.30}
WILDVERBISS_WALDTYP_MULTIPLIKATOR = {"mischwald": 1.0, "fichtenmonokultur": 0.2, "kiefernwald": 0.3}

BAUMARTEN = ["fichte", "buche", "eiche", "kiefer", "birke"]

# Dauer akuter Effekte in Jahren: seit M33 Datenfeld statt Konstante, siehe
# data/stoerungen.json -> ereignis_stoerungen[].dauer_jahre (null = ab Trigger
# dauerhaft). Wird von build_simulationen.py eingelesen und als dauer_je_typ
# an simuliere()/Simulation durchgereicht.


def _resilienz_faktor(text):
    """Bildet die qualitativen Resilienzangaben aus data/waldtypen.json auf einen
    numerischen Schweregrad-Multiplikator ab (hoch=hohe Resilienz=schwacher Effekt).
    """
    if text is None:
        return 1.0
    t = str(text).lower()
    if "kaum betroffen" in t:
        return 0.1
    if "mittel-hoch" in t:
        return 0.7
    if "mittel-gering" in t:
        return 1.3
    if "gering" in t:
        return 1.7
    if "hoch" in t:
        return 0.4
    if "mittel" in t:
        return 1.0
    return 1.0


def _clamp(x, lo=0.0, hi=100.0):
    return max(lo, min(hi, x))


class Simulation:
    """Führt eine einzelne Waldtyp x Konfiguration-Simulation über 21 Jahre aus."""

    def __init__(self, waldtyp, konfiguration, wolf_aktiv, luchs_aktiv, dauer_je_typ):
        self.waldtyp = waldtyp  # dict aus data/waldtypen.json
        self.wid = waldtyp["id"]
        self.konfiguration = konfiguration  # Liste von {"typ", "trigger_jahr", "dauerhaft"}
        self.dauer_je_typ = dauer_je_typ  # {typ: jahre|None}, aus data/stoerungen.json (M33)
        # Ersetzt den früheren 3-Stufen-Wildverbiss-Regler (niedrig/mittel/
        # hoch) durch die tatsächliche Ursache: Anwesenheit von Wolf/Luchs.
        # Ausgangszustand (kein deviation) = beide Prädatoren aktiv, siehe
        # Milestones-Dokument.
        self.wolf_aktiv = wolf_aktiv
        self.luchs_aktiv = luchs_aktiv

        rf = waldtyp["resilienzfaktoren"]
        self.res_borkenkaefer = _resilienz_faktor(rf.get("borkenkaefer"))
        self.res_trockenheit = _resilienz_faktor(rf.get("trockenheit"))
        self.res_sturm = _resilienz_faktor(rf.get("sturm"))
        self.res_feuer = _resilienz_faktor(rf.get("feuer"))

        # Bestandsanteil (wie stark eine Art im Waldtyp vertreten ist, z. B. Fichte nur
        # 5% Beimischung im Mischwald) und Vitalität (0-100-Gesundheitszustand dieser
        # Art, 100 = Ausgangszustand "gesund") sind zwei verschiedene Größen, die vorher
        # beide aus derselben Zahl (anfangsbestand_anteil_prozent) gebildet wurden. Das
        # ließ z. B. die Fichte im Mischwald (Anteil 5) von Jahr 0 an als "abgestorben"
        # erscheinen, obwohl sie völlig ungestört war (Fix nach Nutzer-Feedback, siehe
        # Milestones-Dokument). self._bestandsanteil bleibt für die vier Nicht-Birke-Arten
        # über den Lauf fix (kein Umbau-Mechanismus im Modell) und dient nur als Gewicht
        # in _gesamtvitalitaet(); Vitalität startet unabhängig davon bei 100, wenn die
        # Art überhaupt vorkommt, sonst bei 0 (Art nicht vorhanden, siehe M5: eine
        # Art-Kachel erscheint nur, wenn ihr Indikator irgendwann > 0 ist).
        anteil = waldtyp["anfangsbestand_anteil_prozent"]
        self._bestandsanteil = {art: float(anteil.get(art, 0)) for art in BAUMARTEN}
        self.state = {
            "fichte_vitalitaet": 100.0 if self._bestandsanteil["fichte"] > 0 else 0.0,
            "buche_vitalitaet": 100.0 if self._bestandsanteil["buche"] > 0 else 0.0,
            "eiche_vitalitaet": 100.0 if self._bestandsanteil["eiche"] > 0 else 0.0,
            "kiefer_vitalitaet": 100.0 if self._bestandsanteil["kiefer"] > 0 else 0.0,
            "birke_anteil": self._bestandsanteil["birke"],
            "borkenkaefer_dichte": 0.0,
            "totholzmenge": float(BASIS_TOTHOLZ[self.wid]),
            "kronendach": 100.0,
            "bodenfeuchte": 100.0,
            "biodiversitaet": float(BASIS_BIODIVERSITAET[self.wid]),
            "verjuengung_mischbaumarten": 100.0,
            "reh_dichte": self._wild_start(),
            "rothirsch_dichte": self._wild_start(),
            "brandrisiko": float(BASIS_BRANDRISIKO[self.wid]),
        }
        self._anfangsfichte = self.state["fichte_vitalitaet"]

        # --- Neue Arten-Indikatoren (Analyse-Screen-Erweiterung, siehe
        # docs/Wissensbasis_Erweiterung_weitere_Arten.md): Startwerte konsistent
        # zu den Formeln in _schritt() berechnet, damit es beim Übergang von
        # jahr_0 zu jahr_1 keinen künstlichen Sprung gibt. Mehrere Formeln sind
        # als "Annahme, mit Lehrkraft abzugleichen" markiert (siehe Kommentare
        # in _schritt()) - fachlich plausibel, aber nicht 1:1 aus einer Quelle
        # abgeleitet.
        eiche_init = self.state["eiche_vitalitaet"]
        buche_init = self.state["buche_vitalitaet"]
        eichhoernchen_init = (self.state["fichte_vitalitaet"] + buche_init + eiche_init) / 3
        kleinsaeuger_init = (buche_init + eiche_init) / 2
        waldmeister_gewicht_init = 1.0 if self.wid == "mischwald" else 0.2
        heidelbeere_gewicht_init = 1.0 if self.wid in ("fichtenmonokultur", "kiefernwald") else 0.3
        self.state.update({
            "hasel_anteil": 0.0,
            "holunder_anteil": 0.0,
            "brombeere_anteil": 0.0,
            "zunderschwamm_indikator": 0.9 * BASIS_TOTHOLZ[self.wid],
            "blaeuepilz_indikator": 0.0,
            "hallimasch_indikator": 0.7 * BASIS_TOTHOLZ[self.wid],
            "brennnessel_indikator": 0.0,
            "eichelhaeher_indikator": (eiche_init + buche_init) / 2,
            "buntspecht_indikator": 0.8 * BASIS_TOTHOLZ[self.wid],
            "ameisenbuntkaefer_indikator": 0.8 * BASIS_TOTHOLZ[self.wid],
            # Annahme, mit Lehrkraft abzugleichen: Buschwindröschen ist real an
            # den saisonalen Licht-Dunkel-Wechsel vor Laubaustrieb gebunden,
            # nicht per se an dauerhaften Kronendachverlust (Schritt-0-Caveat,
            # siehe Wissensbasis-Ergänzung) - hier trotzdem als didaktische
            # Näherung an den Kronendach-Verlust gekoppelt.
            "buschwindroeschen_indikator": 40.0,
            "waldmeister_indikator": 100.0 * waldmeister_gewicht_init,
            # Annahme, mit Lehrkraft abzugleichen: Heidelbeere-Reaktion auf
            # akute Störung ist in der Recherche nicht belegt, bewusst nahezu
            # konstant gehalten.
            "heidelbeere_indikator": 60.0 * heidelbeere_gewicht_init,
            # Annahme, mit Lehrkraft abzugleichen: didaktisch verkürzter
            # Mastjahr-Rhythmus (real 6-10 Jahre).
            "eichhoernchen_indikator": eichhoernchen_init,
            # Annahme, mit Lehrkraft abzugleichen: kein belegter
            # Einzelursache-Mechanismus wie beim Borkenkäfer, nur additive
            # Näherung.
            "raupen_indikator": 20.0,
            "blattlaeuse_indikator": 0.0,
            # Annahme, mit Lehrkraft abzugleichen: 2-Jahres-Verzögerung ist eine
            # allgemeine Prädations-Größenordnung, nicht Habicht/Eichhörnchen-
            # spezifisch belegt.
            "habicht_indikator": eichhoernchen_init,
            "sperber_indikator": 0.6 * eichhoernchen_init,
            # Strukturelle Lücke, keine Recherche-Grundlage im engeren Sinn:
            # "Kleinsäuger" ist im Datenmodell nur ein generischer, nie
            # simulierter Gruppenknoten. Kopplung an Mastjahr-Nahrungsangebot
            # (Buche/Eiche) ist Schritt-0-recherchiert (siehe Wissensbasis-
            # Ergänzung), aber die Existenz dieses Indikators selbst wurde für
            # den Fuchs erfunden.
            "kleinsaeuger_indikator": kleinsaeuger_init,
            # Strukturelle Lücke: kein direkter Waldstörungsbezug belegbar
            # (Schritt-0-Recherche), Kopplung bleibt schwach/indirekt.
            "fuchs_indikator": 0.7 * kleinsaeuger_init,
        })
        self._eichhoernchen_historie = [eichhoernchen_init]
        self._totholz_vorjahr = float(BASIS_TOTHOLZ[self.wid])
        self._borkenkaefer_vorjahr = 0.0

        # Einmal-Effekte (Sturm-Schlag, Käfer-Erstbefall, Entnahme-Schritt) müssen exakt
        # beim ersten aktiven _schritt()-Aufruf feuern, unabhängig davon, ob trigger_jahr
        # 0 oder 1 ist (die Jahresschleife selbst beginnt immer erst bei Jahr 1, siehe
        # run()) - daher explizite "bereits ausgelöst"-Flags statt eines Jahresvergleichs.
        self._sturm_ausgeloest = False
        self._kaefer_gestartet = False
        self._entnahme_ausgeloest = False

    def _wild_start(self):
        # Startet niedrig und wächst über ~5 Jahre auf die Zielstufe zu (2.10.2: kein
        # einzelnes Trigger-Jahr, graduelle Zunahme).
        return 10.0

    # -- Aktivitäts-Abfragen -------------------------------------------------
    def _ereignis(self, typ):
        for e in self.konfiguration:
            if e["typ"] == typ:
                return e
        return None

    def _ist_aktiv(self, typ, jahr):
        e = self._ereignis(typ)
        if e is None:
            return False
        if jahr < e["trigger_jahr"]:
            return False
        dauer = self.dauer_je_typ.get(typ)
        if dauer is None:
            return True  # dauerhaft ab Trigger relevant (siehe data/stoerungen.json dauer_jahre)
        return jahr < e["trigger_jahr"] + dauer

    def _jahre_seit_trigger(self, typ, jahr):
        e = self._ereignis(typ)
        if e is None:
            return None
        return jahr - e["trigger_jahr"]

    # -- Jahres-Schritt --------------------------------------------------
    def _schritt(self, jahr):
        s = self.state
        temperatur_aktiv = self._ist_aktiv("temperatur", jahr)

        # Bläuepilz: 1 Jahr Verzögerung zur Borkenkäferdichte (Symbiose-
        # Partner, gelangt erst nach Befall in den Baum) - muss vor dem
        # Borkenkäfer-Block dieses Jahres stehen, damit hier noch der
        # Vorjahreswert verwendet wird.
        s["blaeuepilz_indikator"] = self._borkenkaefer_vorjahr

        # --- Sturm: einmaliger Schlag im Trigger-Jahr ---
        seit_sturm = self._jahre_seit_trigger("sturm", jahr)
        if seit_sturm is not None and seit_sturm >= 0 and not self._sturm_ausgeloest:
            self._sturm_ausgeloest = True
            schaden = 25 * self.res_sturm
            s["fichte_vitalitaet"] = _clamp(s["fichte_vitalitaet"] - schaden * (s["fichte_vitalitaet"] / 100))
            s["kronendach"] = _clamp(s["kronendach"] - 20 * self.res_sturm)
            s["totholzmenge"] = _clamp(s["totholzmenge"] + 30 * self.res_sturm, hi=100)
            s["birke_anteil"] = _clamp(s["birke_anteil"] + 5)

        # --- Trockenheit: mehrjähriger Puls ---
        if self._ist_aktiv("trockenheit", jahr):
            intensitaet = 1.0 + (0.3 if temperatur_aktiv else 0.0)
            s["bodenfeuchte"] = _clamp(s["bodenfeuchte"] - 12 * intensitaet)

            fichte_vor = s["fichte_vitalitaet"]
            s["fichte_vitalitaet"] = _clamp(
                fichte_vor - 6 * self.res_trockenheit * intensitaet * (fichte_vor / 100)
            )
            buche_vor = s["buche_vitalitaet"]
            s["buche_vitalitaet"] = _clamp(buche_vor - 1.5 * (buche_vor / 100))

            # Trockengestresst absterbende Bäume werden zu Totholz - dieselbe
            # Kopplung (Faktor 0.5 des tatsächlichen Vitalitätsverlusts) wie
            # weiter unten beim Borkenkäfer. Vorher verschwand durch
            # Trockenheit verlorene Vitalität spurlos, ohne jede
            # Totholz-Wirkung (Fix nach Nutzer-Feedback, siehe Milestones-
            # Dokument M8-Abschnitt).
            fichte_verlust = fichte_vor - s["fichte_vitalitaet"]
            buche_verlust = buche_vor - s["buche_vitalitaet"]
            s["totholzmenge"] = _clamp(s["totholzmenge"] + (fichte_verlust + buche_verlust) * 0.5, hi=100)
        else:
            # langsame Erholung der Bodenfeuchte, wenn keine Trockenheit aktiv ist
            s["bodenfeuchte"] = _clamp(s["bodenfeuchte"] + 3)

        # sekundäre Kopplung: weniger Kronendach -> mehr Verdunstung -> etwas trockener
        beschattungsverlust = 100 - s["kronendach"]
        if beschattungsverlust > 0:
            s["bodenfeuchte"] = _clamp(s["bodenfeuchte"] - 0.05 * beschattungsverlust)

        # --- Borkenkäfer: wirtsbestandslimitiertes Wachstum ---
        seit_kaefer = self._jahre_seit_trigger("borkenkaefer", jahr)
        dauer_kaefer = self.dauer_je_typ.get("borkenkaefer")
        if seit_kaefer is not None and seit_kaefer >= 0 and seit_kaefer <= dauer_kaefer:
            # res_borkenkaefer ist ein Schweregrad-Multiplikator (gering Resilienz -> hoher
            # Wert -> schnelles Wachstum); siehe _resilienz_faktor(). Muss MULTIPLIKATIV
            # eingehen, nicht dividierend, sonst kehrt sich die Wirkung um.
            reproduktionsfaktor = 1.0 + 0.55 * self.res_borkenkaefer
            if temperatur_aktiv:
                reproduktionsfaktor *= 1.25
            if self._ist_aktiv("trockenheit", jahr):
                reproduktionsfaktor *= 1.2
            wirt_verfuegbar = s["fichte_vitalitaet"] / max(self._anfangsfichte, 1e-6)
            if not self._kaefer_gestartet:
                self._kaefer_gestartet = True
                s["borkenkaefer_dichte"] = _clamp(8 * wirt_verfuegbar, lo=0)
            else:
                s["borkenkaefer_dichte"] = _clamp(s["borkenkaefer_dichte"] * reproduktionsfaktor * (0.3 + 0.7 * wirt_verfuegbar))
            # Buntspecht/Ameisenbuntkäfer: leichte, sättigende Dämpfung nur bei
            # niedriger Käferdichte - wirken laut Wissensbasis-Ergänzung nicht
            # gegen eine Massenvermehrung, bewusst klein gehalten (nicht
            # überzeichnen). Nutzen den Bestand des Vorjahres, da dieser
            # Schritt vor der eigenen Neuberechnung von buntspecht_indikator/
            # ameisenbuntkaefer_indikator (am Ende von _schritt) läuft.
            if s["borkenkaefer_dichte"] < 30:
                s["borkenkaefer_dichte"] = _clamp(
                    s["borkenkaefer_dichte"]
                    - 0.02 * s["buntspecht_indikator"]
                    - 0.035 * s["ameisenbuntkaefer_indikator"]
                )
            schaden = s["borkenkaefer_dichte"] * 0.12 * self.res_borkenkaefer
            s["fichte_vitalitaet"] = _clamp(s["fichte_vitalitaet"] - schaden)
            s["totholzmenge"] = _clamp(s["totholzmenge"] + schaden * 0.5, hi=100)
            s["kronendach"] = _clamp(s["kronendach"] - schaden * 0.2)
        elif seit_kaefer is not None and seit_kaefer > dauer_kaefer:
            s["borkenkaefer_dichte"] = _clamp(s["borkenkaefer_dichte"] * 0.7)

        # --- Totholzentnahme: permanenter Schritt-Effekt ab Trigger-Jahr ---
        seit_entnahme = self._jahre_seit_trigger("totholzentnahme", jahr)
        if seit_entnahme is not None and seit_entnahme >= 0:
            if not self._entnahme_ausgeloest:
                self._entnahme_ausgeloest = True
                s["totholzmenge"] = _clamp(s["totholzmenge"] * 0.4)
                # Hallimasch reagiert sonst (Glättung) zu träge auf den
                # abrupten Totholz-Einbruch - Zunderschwamm/Buntspecht/
                # Ameisenbuntkäfer brauchen keinen Extra-Schritt, da sie
                # direkt proportional zu totholzmenge berechnet werden.
                s["hallimasch_indikator"] = _clamp(s["hallimasch_indikator"] * 0.4)
                s["brandrisiko"] = _clamp(s["brandrisiko"] - 4 * self.res_feuer)
            else:
                s["totholzmenge"] = _clamp(s["totholzmenge"] * 0.97)
            s["biodiversitaet"] = _clamp(s["biodiversitaet"] - 0.9)

        # --- Wolf/Luchs: unabhängig, gradueller Anstieg der Reh-/Rothirsch-
        # dichte in Richtung des durch die aktiven Prädatoren gesenkten
        # Zielwerts (siehe Konstanten oben). Ersetzt den früheren 3-Stufen-
        # Wildverbiss-Regler 1:1 an dieser Stelle im Modell.
        ziel_reh = REH_ZIEL_BASIS
        ziel_rothirsch = ROTHIRSCH_ZIEL_BASIS
        if self.luchs_aktiv:
            ziel_reh *= 1 - LUCHS_REDUKTION["reh"]
            ziel_rothirsch *= 1 - LUCHS_REDUKTION["rothirsch"]
        if self.wolf_aktiv:
            ziel_reh *= 1 - WOLF_REDUKTION["reh"]
            ziel_rothirsch *= 1 - WOLF_REDUKTION["rothirsch"]
        s["reh_dichte"] = _clamp(s["reh_dichte"] + (ziel_reh - s["reh_dichte"]) * 0.3)
        s["rothirsch_dichte"] = _clamp(s["rothirsch_dichte"] + (ziel_rothirsch - s["rothirsch_dichte"]) * 0.3)

        wv_multiplikator = WILDVERBISS_WALDTYP_MULTIPLIKATOR[self.wid]
        mittlere_wilddichte = (s["reh_dichte"] + s["rothirsch_dichte"]) / 2
        # Linear an die drei früheren Regler-Referenzpunkte angenähert
        # (niedrig=15->0.05, mittel=45->1.1, hoch=80->2.3), jetzt aber aus der
        # kontinuierlichen Dichte abgeleitet statt aus einer Stufen-Tabelle.
        basis_rate = max(0.0, (mittlere_wilddichte - 15) * 0.033)
        ramp = 0.2 if jahr <= 10 else 1.0
        s["verjuengung_mischbaumarten"] = _clamp(
            s["verjuengung_mischbaumarten"] - basis_rate * wv_multiplikator * ramp
        )
        # Zusatzeffekt auf Eiche entfällt nur im Ausgangszustand (beide
        # Prädatoren aktiv = funktionierende Regulation, entspricht dem
        # früheren "niedrig").
        if not (self.wolf_aktiv and self.luchs_aktiv):
            s["eiche_vitalitaet"] = _clamp(
                s["eiche_vitalitaet"] - basis_rate * wv_multiplikator * ramp * 0.15 * (s["eiche_vitalitaet"] / 100)
            )

        # --- Temperatur: dauerhafter Hintergrundfaktor ---
        if temperatur_aktiv:
            fichte_vor = s["fichte_vitalitaet"]
            s["fichte_vitalitaet"] = _clamp(fichte_vor - 0.15 * (fichte_vor / 100))
            # Gleiche Totholz-Kopplung wie bei Trockenheit oben - klein, aber
            # aus demselben Grund konsistent ergänzt.
            s["totholzmenge"] = _clamp(s["totholzmenge"] + (fichte_vor - s["fichte_vitalitaet"]) * 0.5, hi=100)
            s["bodenfeuchte"] = _clamp(s["bodenfeuchte"] - 0.3)
            s["brandrisiko"] = _clamp(s["brandrisiko"] + 0.4)

        # --- Nachwirkende Dynamik: Kronendach-Regeneration, Sukzession, Biodiversität ---
        # leichte Kronendach-Erholung, wenn keine akuten Schäden mehr auftreten
        s["kronendach"] = _clamp(s["kronendach"] + 0.4)
        # Sukzession: offene Flächen (Kronendachverlust) begünstigen Birke als Pionier
        luecke = 100 - s["kronendach"]
        if luecke > 5:
            s["birke_anteil"] = _clamp(s["birke_anteil"] + 0.06 * luecke, hi=40)

        # Biodiversität: kurzfristiger Rückgang bei akutem Schaden, mittelfristiger
        # Anstieg durch Totholz/Sukzession (Wissensbasis Szenario 1), begrenzt durch
        # den waldtyp-eigenen Basiswert als Decke.
        akuter_schaden = max(0.0, (100 - s["kronendach"]))
        totholz_bonus = max(0.0, s["totholzmenge"] - BASIS_TOTHOLZ[self.wid]) * 0.05
        verjuengung_malus = max(0.0, (100 - s["verjuengung_mischbaumarten"])) * 0.03
        ziel_biodiv = _clamp(
            BASIS_BIODIVERSITAET[self.wid] - akuter_schaden * 0.15 + totholz_bonus - verjuengung_malus
        )
        s["biodiversitaet"] = _clamp(s["biodiversitaet"] + (ziel_biodiv - s["biodiversitaet"]) * 0.25)

        # --- Neue Arten-Indikatoren (Analyse-Screen-Erweiterung, siehe
        # docs/Wissensbasis_Erweiterung_weitere_Arten.md): reine additive
        # Ergänzungen für den Analyse-Screen, fließen NICHT in
        # _gesamtvitalitaet() ein. Bewusst am Ende von _schritt() platziert,
        # damit sie die für dieses Jahr bereits fertig berechneten Werte
        # (kronendach, totholzmenge, bodenfeuchte, Baum-Vitalitäten)
        # verwenden. Ausnahme von "rein additiv": Brombeere dämpft
        # verjuengung_mischbaumarten zusätzlich leicht (siehe dort).

        # Sträucher: Pionierwachstum auf Kronendach-Lücken, analog birke_anteil.
        s["hasel_anteil"] = _clamp(s["hasel_anteil"] + 0.045 * luecke, hi=18)
        totholz_zuwachs = max(0.0, s["totholzmenge"] - self._totholz_vorjahr)
        s["holunder_anteil"] = _clamp(
            s["holunder_anteil"] + 0.045 * luecke + 0.15 * totholz_zuwachs, hi=18
        )
        s["brombeere_anteil"] = _clamp(
            s["brombeere_anteil"] + 0.09 * luecke - 0.02 * (s["kronendach"] / 100) * s["brombeere_anteil"],
            hi=35,
        )
        # Annahme, mit Lehrkraft abzugleichen: zusätzlicher Verjüngungs-Malus
        # durch dichte Brombeere, über den bereits modellierten Wildverbiss
        # hinaus (siehe Wissensbasis-Ergänzung, Abschnitt Sträucher).
        s["verjuengung_mischbaumarten"] = _clamp(s["verjuengung_mischbaumarten"] - 0.01 * s["brombeere_anteil"])

        # Pilze: Zunderschwamm/Hallimasch folgen der Totholzmenge (Hallimasch
        # zusätzlich mit Trockenheits-Bonus), Brennnessel dem Totholz-Zuwachs
        # über den Waldtyp-Basiswert hinaus.
        s["zunderschwamm_indikator"] = _clamp(s["totholzmenge"] * 0.9)
        trockenheit_aktiv_jetzt = self._ist_aktiv("trockenheit", jahr)
        ziel_hallimasch = _clamp(s["totholzmenge"] * 0.7 + (15 if trockenheit_aktiv_jetzt else 0))
        s["hallimasch_indikator"] = _clamp(
            s["hallimasch_indikator"] + (ziel_hallimasch - s["hallimasch_indikator"]) * 0.3
        )
        ziel_brennnessel = _clamp((s["totholzmenge"] - BASIS_TOTHOLZ[self.wid]) * 1.2)
        s["brennnessel_indikator"] = _clamp(
            s["brennnessel_indikator"] + (ziel_brennnessel - s["brennnessel_indikator"]) * 0.2
        )

        # Eichelhäher: direkt an mittlere Eiche-/Buche-Vitalität gekoppelt
        # (Nahrungs-/Samenangebot), ohne Trägheit.
        s["eichelhaeher_indikator"] = _clamp((s["eiche_vitalitaet"] + s["buche_vitalitaet"]) / 2)

        # Buntspecht/Ameisenbuntkäfer: direkt proportional zur Totholzmenge
        # (Bruthöhlen/Habitat); die Dämpfung auf borkenkaefer_dichte steht
        # oben im Borkenkäfer-Block.
        s["buntspecht_indikator"] = _clamp(s["totholzmenge"] * 0.8)
        s["ameisenbuntkaefer_indikator"] = _clamp(s["totholzmenge"] * 0.8)

        # Kräuter: Buschwindröschen (Annahme, s. o.) reagiert sehr träge
        # gegenläufig zum Kronendach, gedeckelt durch Bodenfeuchte. Waldmeister
        # reagiert gegenläufig dazu proportional zum Kronendach, nur im
        # Mischwald voll gewichtet (Waldmeister-Buchenwald-Bindung). Heidelbeere
        # (Annahme, s. o.) bleibt nahezu konstant, nur bei starkem, anhaltendem
        # Kronendachverlust in Nadelwald-Typen leicht rückläufig.
        ziel_buschwindroeschen = _clamp((40 + (100 - s["kronendach"]) * 0.6) * (s["bodenfeuchte"] / 100))
        s["buschwindroeschen_indikator"] = _clamp(
            s["buschwindroeschen_indikator"] + (ziel_buschwindroeschen - s["buschwindroeschen_indikator"]) * 0.08
        )
        waldmeister_gewicht = 1.0 if self.wid == "mischwald" else 0.2
        s["waldmeister_indikator"] = _clamp(s["kronendach"] * waldmeister_gewicht)
        heidelbeere_gewicht = 1.0 if self.wid in ("fichtenmonokultur", "kiefernwald") else 0.3
        ziel_heidelbeere = _clamp(60 * heidelbeere_gewicht - max(0.0, 60 - s["kronendach"]) * 0.15)
        s["heidelbeere_indikator"] = _clamp(
            s["heidelbeere_indikator"] + (ziel_heidelbeere - s["heidelbeere_indikator"]) * 0.05
        )

        # Eichhörnchen (Annahme, didaktisch verkürzter Mastjahr-Rhythmus, s. o.):
        # träge Glättung Richtung mittlerer Baum-Vitalität.
        ziel_eichhoernchen = (s["fichte_vitalitaet"] + s["buche_vitalitaet"] + s["eiche_vitalitaet"]) / 3
        s["eichhoernchen_indikator"] = _clamp(
            s["eichhoernchen_indikator"] + (ziel_eichhoernchen - s["eichhoernchen_indikator"]) * 0.15
        )

        # Raupen (Annahme, kein Einzelursache-Mechanismus belegt, s. o.):
        # einfacher additiver Bonus bei Trockenheit/Wärme. Blattläuse enger an
        # geschwächte Fichte gekoppelt (Fichtenröhrenlaus-Mechanismus, laut
        # Schritt-0-Recherche fast identisch zum Borkenkäfer: Trockenstress
        # schwächt die Harzabwehr).
        raupen_bonus = (12 if trockenheit_aktiv_jetzt else 0) + (8 if temperatur_aktiv else 0)
        ziel_raupen = _clamp(20 + raupen_bonus)
        s["raupen_indikator"] = _clamp(s["raupen_indikator"] + (ziel_raupen - s["raupen_indikator"]) * 0.3)
        # Verlust relativ zum Ausgangswert (self._anfangsfichte), nicht relativ
        # zu 100 - sonst würde "keine Fichte im Waldtyp vorhanden"
        # (fichte_vitalitaet dauerhaft 0) fälschlich als "Fichte komplett
        # geschwächt" interpretiert (derselbe Fehlertyp wie der Fichte-Sprite-
        # Bug aus der vorherigen Session, siehe Milestones-Dokument).
        ziel_blattlaeuse = _clamp(
            (self._anfangsfichte - s["fichte_vitalitaet"]) * 0.3 + (15 if trockenheit_aktiv_jetzt else 0)
        )
        s["blattlaeuse_indikator"] = _clamp(
            s["blattlaeuse_indikator"] + (ziel_blattlaeuse - s["blattlaeuse_indikator"]) * 0.3
        )

        # Habicht/Sperber (Annahme, allgemeine Prädations-Verzögerung nicht
        # art-spezifisch belegt, s. o.): folgen dem Eichhörnchen-Bestand von
        # vor 2 Jahren, Sperber zusätzlich gedämpft (schwächere/unsicherere
        # Kopplung, jagt laut Wissensbasis vor allem nicht simulierte
        # Kleinvögel).
        self._eichhoernchen_historie.append(s["eichhoernchen_indikator"])
        verzoegert = self._eichhoernchen_historie[jahr - 2] if jahr >= 2 else self._eichhoernchen_historie[0]
        s["habicht_indikator"] = _clamp(s["habicht_indikator"] + (verzoegert - s["habicht_indikator"]) * 0.4)
        s["sperber_indikator"] = _clamp(s["sperber_indikator"] + (verzoegert * 0.6 - s["sperber_indikator"]) * 0.4)

        # Kleinsäuger (strukturelle Lücke: als Voraussetzung für den Fuchs
        # erfunden, s. o.) folgen dem Mastjahr-Nahrungsangebot (Buche/Eiche).
        # Fuchs (strukturelle Lücke, kein direkter Störungsbezug belegbar)
        # folgt schwach/gedämpft dem Kleinsäuger-Bestand.
        ziel_kleinsaeuger = _clamp((s["buche_vitalitaet"] + s["eiche_vitalitaet"]) / 2)
        s["kleinsaeuger_indikator"] = _clamp(
            s["kleinsaeuger_indikator"] + (ziel_kleinsaeuger - s["kleinsaeuger_indikator"]) * 0.25
        )
        s["fuchs_indikator"] = _clamp(
            s["fuchs_indikator"] + (s["kleinsaeuger_indikator"] * 0.7 - s["fuchs_indikator"]) * 0.15
        )

        # Vorjahreswerte für die Verzögerungs-Kopplungen oben (nächstes Jahr).
        self._totholz_vorjahr = s["totholzmenge"]
        self._borkenkaefer_vorjahr = s["borkenkaefer_dichte"]

    def _gesamtvitalitaet(self):
        s = self.state
        # Gewichte = wie stark jede Art aktuell im Bestand vertreten ist. Bei den vier
        # Nicht-Birke-Arten bleibt das der fixe Ausgangsanteil (kein Umbau-Mechanismus im
        # Modell); bei der Birke dagegen der tatsächliche, durch Sukzession wachsende
        # Anteil (state["birke_anteil"]) - sonst zählt eine erfolgreich nachwachsende
        # Birkenpopulation kaum zum Baumbestand, weil ihr Ausgangsgewicht in Mischwald/
        # Fichtenmonokultur bei 0 startet (Fix nach Nutzer-Feedback, siehe
        # Milestones-Dokument).
        gewichte = dict(self._bestandsanteil)
        gewichte["birke"] = s["birke_anteil"]
        summe_gewichte = sum(gewichte.values()) or 1.0
        werte = {
            "fichte": s["fichte_vitalitaet"],
            "buche": s["buche_vitalitaet"],
            "eiche": s["eiche_vitalitaet"],
            "kiefer": s["kiefer_vitalitaet"],
            # Birke hat keinen eigenen Vitalitäts-Zerfall im Modell (nur einen
            # Anteil/Sukzessions-Wert) - solange sie vorkommt, geht sie als "gesund" (100)
            # gewichtet in den Durchschnitt ein.
            "birke": 100.0 if s["birke_anteil"] > 0 else 0.0,
        }
        gewichtet = sum(werte[art] * gewichte[art] for art in BAUMARTEN)
        return _clamp(gewichtet / summe_gewichte)

    def run(self):
        zeitreihe = {}
        zeitreihe["jahr_0"] = self._snapshot()
        for jahr in range(1, JAHRE):
            self._schritt(jahr)
            zeitreihe[f"jahr_{jahr}"] = self._snapshot()
        return zeitreihe

    def _snapshot(self):
        s = self.state
        out = {k: round(v, 1) for k, v in s.items()}
        out["gesamtvitalitaet"] = round(self._gesamtvitalitaet(), 1)
        return out


def simuliere(waldtyp, konfiguration, wolf_aktiv, luchs_aktiv, dauer_je_typ):
    """Öffentliche Schnittstelle: liefert die 21-Jahre-Zeitreihe (jahr_0..jahr_20)
    aller Indikatoren für einen Waldtyp x Konfiguration x Wolf/Luchs-Anwesenheit.

    dauer_je_typ: {ereignis_typ: dauer_jahre|None}, aus data/stoerungen.json
    (ereignis_stoerungen[].dauer_jahre, null = ab Trigger dauerhaft).
    """
    sim = Simulation(waldtyp, konfiguration, wolf_aktiv, luchs_aktiv, dauer_je_typ)
    return sim.run()
