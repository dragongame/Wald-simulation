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

WILD_ZIEL = {"niedrig": 15, "mittel": 45, "hoch": 80}
WILDVERBISS_WALDTYP_MULTIPLIKATOR = {"mischwald": 1.0, "fichtenmonokultur": 0.2, "kiefernwald": 0.3}

BAUMARTEN = ["fichte", "buche", "eiche", "kiefer", "birke"]

# Dauer akuter Effekte in Jahren (didaktisch vereinfachte Annahme, siehe Wissensbasis
# Abschnitt 5 "didaktische Reduktion" - kein exaktes Modell gefordert).
DAUER_TROCKENHEIT_JAHRE = 4
DAUER_BORKENKAEFER_MAX_JAHRE = 12  # danach i.d.R. Wirtserschöpfung


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

    def __init__(self, waldtyp, konfiguration, wildverbiss_stufe):
        self.waldtyp = waldtyp  # dict aus data/waldtypen.json
        self.wid = waldtyp["id"]
        self.konfiguration = konfiguration  # Liste von {"typ", "trigger_jahr", "dauerhaft"}
        self.wildverbiss_stufe = wildverbiss_stufe

        rf = waldtyp["resilienzfaktoren"]
        self.res_borkenkaefer = _resilienz_faktor(rf.get("borkenkaefer"))
        self.res_trockenheit = _resilienz_faktor(rf.get("trockenheit"))
        self.res_sturm = _resilienz_faktor(rf.get("sturm"))
        self.res_feuer = _resilienz_faktor(rf.get("feuer"))

        anteil = waldtyp["anfangsbestand_anteil_prozent"]
        self.state = {
            "fichte_vitalitaet": float(anteil.get("fichte", 0)),
            "buche_vitalitaet": float(anteil.get("buche", 0)),
            "eiche_vitalitaet": float(anteil.get("eiche", 0)),
            "kiefer_vitalitaet": float(anteil.get("kiefer", 0)),
            "birke_anteil": float(anteil.get("birke", 0)),
            "borkenkaefer_dichte": 0.0,
            "totholzmenge": float(BASIS_TOTHOLZ[self.wid]),
            "kronendach": 100.0,
            "bodenfeuchte": 100.0,
            "biodiversitaet": float(BASIS_BIODIVERSITAET[self.wid]),
            "verjuengung_mischbaumarten": 100.0,
            "wilddichte": self._wild_start(),
            "brandrisiko": float(BASIS_BRANDRISIKO[self.wid]),
        }
        self._anfangsfichte = self.state["fichte_vitalitaet"]
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
        if typ == "trockenheit":
            return jahr < e["trigger_jahr"] + DAUER_TROCKENHEIT_JAHRE
        return True  # borkenkaefer/sturm/totholzentnahme/temperatur: ab Trigger dauerhaft relevant

    def _jahre_seit_trigger(self, typ, jahr):
        e = self._ereignis(typ)
        if e is None:
            return None
        return jahr - e["trigger_jahr"]

    # -- Jahres-Schritt --------------------------------------------------
    def _schritt(self, jahr):
        s = self.state
        temperatur_aktiv = self._ist_aktiv("temperatur", jahr)

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
            s["fichte_vitalitaet"] = _clamp(
                s["fichte_vitalitaet"] - 6 * self.res_trockenheit * intensitaet * (s["fichte_vitalitaet"] / 100)
            )
            s["buche_vitalitaet"] = _clamp(s["buche_vitalitaet"] - 1.5 * (s["buche_vitalitaet"] / 100))
        else:
            # langsame Erholung der Bodenfeuchte, wenn keine Trockenheit aktiv ist
            s["bodenfeuchte"] = _clamp(s["bodenfeuchte"] + 3)

        # sekundäre Kopplung: weniger Kronendach -> mehr Verdunstung -> etwas trockener
        beschattungsverlust = 100 - s["kronendach"]
        if beschattungsverlust > 0:
            s["bodenfeuchte"] = _clamp(s["bodenfeuchte"] - 0.05 * beschattungsverlust)

        # --- Borkenkäfer: wirtsbestandslimitiertes Wachstum ---
        seit_kaefer = self._jahre_seit_trigger("borkenkaefer", jahr)
        if seit_kaefer is not None and seit_kaefer >= 0 and seit_kaefer <= DAUER_BORKENKAEFER_MAX_JAHRE:
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
            schaden = s["borkenkaefer_dichte"] * 0.12 * self.res_borkenkaefer
            s["fichte_vitalitaet"] = _clamp(s["fichte_vitalitaet"] - schaden)
            s["totholzmenge"] = _clamp(s["totholzmenge"] + schaden * 0.5, hi=100)
            s["kronendach"] = _clamp(s["kronendach"] - schaden * 0.2)
        elif seit_kaefer is not None and seit_kaefer > DAUER_BORKENKAEFER_MAX_JAHRE:
            s["borkenkaefer_dichte"] = _clamp(s["borkenkaefer_dichte"] * 0.7)

        # --- Totholzentnahme: permanenter Schritt-Effekt ab Trigger-Jahr ---
        seit_entnahme = self._jahre_seit_trigger("totholzentnahme", jahr)
        if seit_entnahme is not None and seit_entnahme >= 0:
            if not self._entnahme_ausgeloest:
                self._entnahme_ausgeloest = True
                s["totholzmenge"] = _clamp(s["totholzmenge"] * 0.4)
                s["brandrisiko"] = _clamp(s["brandrisiko"] - 4 * self.res_feuer)
            else:
                s["totholzmenge"] = _clamp(s["totholzmenge"] * 0.97)
            s["biodiversitaet"] = _clamp(s["biodiversitaet"] - 0.9)

        # --- Wildverbiss-Regler: unabhängig, gradueller Anstieg ---
        ziel = WILD_ZIEL[self.wildverbiss_stufe]
        s["wilddichte"] = _clamp(s["wilddichte"] + (ziel - s["wilddichte"]) * 0.3)
        wv_multiplikator = WILDVERBISS_WALDTYP_MULTIPLIKATOR[self.wid]
        basis_rate = {"niedrig": 0.05, "mittel": 1.1, "hoch": 2.3}[self.wildverbiss_stufe]
        ramp = 0.2 if jahr <= 10 else 1.0
        s["verjuengung_mischbaumarten"] = _clamp(
            s["verjuengung_mischbaumarten"] - basis_rate * wv_multiplikator * ramp
        )
        if self.wildverbiss_stufe != "niedrig":
            s["eiche_vitalitaet"] = _clamp(
                s["eiche_vitalitaet"] - basis_rate * wv_multiplikator * ramp * 0.15 * (s["eiche_vitalitaet"] / 100)
            )

        # --- Temperatur: dauerhafter Hintergrundfaktor ---
        if temperatur_aktiv:
            s["fichte_vitalitaet"] = _clamp(s["fichte_vitalitaet"] - 0.15 * (s["fichte_vitalitaet"] / 100))
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

    def _gesamtvitalitaet(self):
        anteil = self.waldtyp["anfangsbestand_anteil_prozent"]
        gewichte = {art: anteil.get(art, 0) for art in BAUMARTEN}
        summe_gewichte = sum(gewichte.values()) or 1.0
        s = self.state
        werte = {
            "fichte": s["fichte_vitalitaet"],
            "buche": s["buche_vitalitaet"],
            "eiche": s["eiche_vitalitaet"],
            "kiefer": s["kiefer_vitalitaet"],
            "birke": s["birke_anteil"],
        }
        gewichtet = sum(werte[art] * gewichte[art] for art in BAUMARTEN)
        basis = gewichtet / summe_gewichte
        # Birken-Sukzession (Zuwachs über den Ausgangswert 0 hinaus) leicht mitzählen,
        # damit erfolgreiche Wiederbewaldung den Gesamtwert nicht künstlich senkt.
        birken_bonus = max(0.0, werte["birke"] - gewichte.get("birke", 0)) * 0.02
        return _clamp(basis + birken_bonus)

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


def simuliere(waldtyp, konfiguration, wildverbiss_stufe):
    """Öffentliche Schnittstelle: liefert die 21-Jahre-Zeitreihe (jahr_0..jahr_20)
    aller Indikatoren für einen Waldtyp x Konfiguration x Regler-Stufe.
    """
    sim = Simulation(waldtyp, konfiguration, wildverbiss_stufe)
    return sim.run()
