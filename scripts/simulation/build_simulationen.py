#!/usr/bin/env python3
"""Build-Skript für die Build-Time-Vorabsimulation (Umsetzungsauftrag 2.11).

Läuft NUR beim Build, nie zur Laufzeit der App. Enumeriert alle gültigen
Waldtyp x Ereignis-Konfiguration x Wildverbiss-Regler-Kombinationen (siehe
data/stoerungen.json -> kombinatorik, erwartet 195), ruft für jede das
Berechnungsmodul (model.py) auf und schreibt je Kombination eine eigene
statische JSON-Datei nach data/generated/simulationen/.

Aufruf: python3 scripts/simulation/build_simulationen.py
"""
import itertools
import json
from pathlib import Path

from model import JAHRE, simuliere

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
OUT_DIR = DATA / "generated" / "simulationen"

EVENTS_NATUR_UND_BEWIRTSCHAFTUNG = ["borkenkaefer", "trockenheit", "sturm", "totholzentnahme"]

# Schwelle für die Beitragsanalyse (M29, Fundament der "vereinfachten Projektion
# für Schüler:innen"): ab welcher maximalen Abweichung vom Jahr-0-Wert (0-100-
# Skala, siehe Wissensbasis Abschnitt 5) eine Kurve als "wichtig" (eigenständig
# darstellbar) gilt statt in einer Kategorie-Sammelkurve unterzugehen. Rein
# technischer Sichtbarkeits-Schwellenwert für die Kurvenauswahl, keine
# ökologische Aussage. Kalibriert gegen data/generated/lehrkraft_kombinationen.json
# (M19/M28 Top-20-Liste, aus einer völlig anderen Metrik - Jahr-20-Kontrast der
# 6 Dashboard-Indikatoren - abgeleitet): 10.0 und alles ab 5.0 ließ jeden
# außerhalb der Top-20 als "wichtig" erkannten Indikator bereits irgendwo
# innerhalb der Top-20 mit auftreten (siehe M29-Gegenprobe unten) - kein Beleg,
# dass die automatische Ableitung eigene, nicht handkuratierte Signale findet.
# Bei 4.0 taucht erstmals ein aus der Top-20 nie "wichtiger" Indikator
# (kleinsaeuger_indikator) in einem Nicht-Top-20-Szenario auf.
SCHWELLE_WICHTIG = 4.0


def berechne_projektion(zeitreihe, indikatoren):
    """Beitragsanalyse für einen fertigen Simulationslauf (M29): pro Indikator
    die maximale Abweichung vom Jahr-0-Wert, daraus eine Zweiteilung in
    einzeln wichtige Kurven und Kategorie-Sammelkurven für den Rest. Rein
    numerische Nachverarbeitung der von model.py gelieferten Zeitreihe, keine
    eigene Kaskadenlogik.
    """
    ids = [i["id"] for i in indikatoren]
    kategorie_von = {i["id"]: i["kategorie"] for i in indikatoren}
    basis = zeitreihe["jahr_0"]

    max_abweichung = {}
    for iid in ids:
        werte = [zeitreihe[f"jahr_{jahr}"][iid] for jahr in range(JAHRE)]
        max_abweichung[iid] = max(abs(w - basis[iid]) for w in werte)

    # Absteigend nach Stärke sortiert (M30-Fundament): die UI kann die
    # Vereinigung zweier Wälder so auf die stärksten N begrenzen, ohne selbst
    # ökologisch zu rechnen - reines Sortieren nach bereits hier berechneten
    # Werten. `abweichungen` (alle 35 ids, nicht nur wichtig) macht diese
    # Werte auch für Ids verfügbar, die in EINEM Wald wichtig sind, im
    # anderen aber nicht, damit die Stärke dort trotzdem vergleichbar bleibt.
    wichtig = sorted(
        (iid for iid in ids if max_abweichung[iid] >= SCHWELLE_WICHTIG),
        key=lambda iid: -max_abweichung[iid],
    )
    wichtig_set = set(wichtig)
    abweichungen = {iid: round(max_abweichung[iid], 1) for iid in ids}

    rest_je_kategorie = {}
    for iid in ids:
        if iid in wichtig_set:
            continue
        rest_je_kategorie.setdefault(kategorie_von[iid], []).append(iid)

    gruppen = []
    for kategorie, mitglieder in rest_je_kategorie.items():
        kurve = {}
        for jahr in range(JAHRE):
            key = f"jahr_{jahr}"
            werte = [zeitreihe[key][m] for m in mitglieder]
            kurve[key] = round(sum(werte) / len(werte), 2)
        gruppen.append({"kategorie": kategorie, "mitglieder": mitglieder, "kurve": kurve})

    # Assertion (M29-Abnahmekriterium): jeder Indikator genau einmal, wichtig
    # oder in genau einer Gruppe.
    abgedeckt = list(wichtig)
    for g in gruppen:
        abgedeckt.extend(g["mitglieder"])
    assert sorted(abgedeckt) == sorted(ids), (
        "Beitragsanalyse deckt nicht jeden Indikator genau einmal ab: "
        f"{sorted(abgedeckt)} != {sorted(ids)}"
    )

    return {"wichtig": wichtig, "gruppen": gruppen, "abweichungen": abweichungen}


def lade(name):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def baue_ereignis_konfigurationen(stoerungen):
    """Liefert die 22 gültigen Ereignis-Auswahlzustände als Liste von
    (konfig_id, [{"typ", "trigger_jahr"}, ...]).
    """
    konfigs = []

    # 0 Ereignisse
    konfigs.append(("keine", []))

    # 5 einzelne Ereignisse
    for e in stoerungen["ereignis_stoerungen"]:
        typ = e["id"]
        if typ == "temperatur":
            konfigs.append(("temperatur", [{"typ": "temperatur", "trigger_jahr": 0}]))
        else:
            konfigs.append((typ, [{"typ": typ, "trigger_jahr": 0}]))

    # Zeitabstands-Lookup für Nicht-Temperatur-Paare
    paar_lookup = {}
    for p in stoerungen["paar_zeitabstaende"]:
        key = frozenset(p["paar"])
        paar_lookup[key] = p["abstand_jahre"]

    # 12 Nicht-Temperatur-Paare (6 Kombinationen x 2 Reihenfolgen)
    for a, b in itertools.combinations(EVENTS_NATUR_UND_BEWIRTSCHAFTUNG, 2):
        abstand = paar_lookup[frozenset((a, b))]
        for erst, zweit in [(a, b), (b, a)]:
            konfig_id = f"{erst}-dann-{zweit}"
            konfigs.append((konfig_id, [
                {"typ": erst, "trigger_jahr": 0},
                {"typ": zweit, "trigger_jahr": abstand},
            ]))

    # 4 Temperatur-Paare (ohne Reihenfolge)
    partner_trigger = stoerungen["temperatur_kombinationen"]["partner_trigger_jahr"]
    for partner in EVENTS_NATUR_UND_BEWIRTSCHAFTUNG:
        konfig_id = f"temperatur+{partner}"
        konfigs.append((konfig_id, [
            {"typ": "temperatur", "trigger_jahr": 0},
            {"typ": partner, "trigger_jahr": partner_trigger[partner]},
        ]))

    return konfigs


def erweitere_um_trockenheitsdauer(ereignis_konfigs, dauer_wahlmoeglichkeiten, standard_dauer):
    """M34: verdoppelt jeden Ereignis-Auswahlzustand, der Trockenheit enthält,
    um eine Variante je zusätzlicher Dauer-Stufe (data/stoerungen.json ->
    ereignis_stoerungen[trockenheit].dauer_wahlmoeglichkeiten). Die
    Standard-Dauer behält den unveränderten konfig_id/Dateinamen
    (Abwärtskompatibilität für bereits gespeicherte Forscherheft-Einträge -
    siehe M34-Abnahmekriterium), zusätzliche Stufen bekommen einen Suffix.
    Liefert (konfig_id, events, trockenheit_dauer)-Tripel statt der
    (konfig_id, events)-Paare aus baue_ereignis_konfigurationen().
    """
    erweitert = []
    for konfig_id, events in ereignis_konfigs:
        if not any(e["typ"] == "trockenheit" for e in events):
            erweitert.append((konfig_id, events, standard_dauer))
            continue
        for dauer in dauer_wahlmoeglichkeiten:
            suffix = "" if dauer == standard_dauer else f"-dauer{dauer}"
            erweitert.append((f"{konfig_id}{suffix}", events, dauer))
    return erweitert


def main():
    waldtypen = lade("waldtypen.json")["waldtypen"]
    stoerungen = lade("stoerungen.json")
    indikatoren = lade("indikatoren.json")["indikatoren"]
    # Ersetzt den früheren 3-Stufen-Wildverbiss-Regler durch 4 Kombinationen
    # aus Luchs an/aus × Wolf an/aus (Nutzer-Entscheidung 2026-08-26, siehe
    # Milestones-Dokument). "beide" ist der Ausgangszustand (kein deviation,
    # entspricht dem früheren "niedrig").
    praedatoren_kombinationen = [
        ("beide", True, True),
        ("luchs", False, True),
        ("wolf", True, False),
        ("keine", False, False),
    ]
    # Reduktionsfaktoren je Prädator (seit M41 Datenfeld statt Konstante in
    # model.py, siehe data/stoerungen.json -> wildverbiss_regler.praedatoren[].reduktion).
    praedatoren_reduktion = {p["id"]: p["reduktion"] for p in stoerungen["wildverbiss_regler"]["praedatoren"]}

    # Dauer akuter Effekte je Ereignis-Typ (seit M33 Datenfeld statt Konstante
    # in model.py, siehe data/stoerungen.json -> ereignis_stoerungen[].dauer_jahre).
    dauer_je_typ_basis = {e["id"]: e.get("dauer_jahre") for e in stoerungen["ereignis_stoerungen"]}
    trockenheit_eintrag = next(e for e in stoerungen["ereignis_stoerungen"] if e["id"] == "trockenheit")
    trockenheit_wahlmoeglichkeiten = trockenheit_eintrag["dauer_wahlmoeglichkeiten"]
    trockenheit_standard = trockenheit_eintrag["dauer_jahre"]

    ereignis_konfigs = erweitere_um_trockenheitsdauer(
        baue_ereignis_konfigurationen(stoerungen), trockenheit_wahlmoeglichkeiten, trockenheit_standard
    )
    erwartete_ereigniszustaende = stoerungen["kombinatorik"]["ereignis_auswahlzustaende"]
    assert len(ereignis_konfigs) == erwartete_ereigniszustaende, (
        f"Erwartet {erwartete_ereigniszustaende} Ereignis-Auswahlzustände, "
        f"erzeugt wurden {len(ereignis_konfigs)}"
    )

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for alte in OUT_DIR.glob("*.json"):
        alte.unlink()

    index = []
    anzahl = 0
    for waldtyp in waldtypen:
        for konfig_id, events, trockenheit_dauer in ereignis_konfigs:
            dauer_je_typ = {**dauer_je_typ_basis, "trockenheit": trockenheit_dauer}
            for praedatoren_code, wolf_aktiv, luchs_aktiv in praedatoren_kombinationen:
                if konfig_id == "keine" and praedatoren_code == "beide":
                    continue  # ungültig: keine Abweichung vom Ausgangszustand (2.10.2/3.2)

                zeitreihe, brand_jahr = simuliere(waldtyp, events, wolf_aktiv, luchs_aktiv, dauer_je_typ, praedatoren_reduktion)
                projektion = berechne_projektion(zeitreihe, indikatoren)

                dateiname = f"{waldtyp['id']}__{konfig_id}__praedatoren-{praedatoren_code}.json"
                out_path = OUT_DIR / dateiname
                payload = {
                    "konfiguration": {
                        "waldtyp": waldtyp["id"],
                        "konfig_id": konfig_id,
                        "ereignisse": events,
                        "wildverbiss_regler": praedatoren_code,
                        # M37: Jahr eines endogen ausgelösten Waldbrands (M36),
                        # None wenn keiner ausgelöst wurde - für die
                        # Ursachenangabe im Dashboard, da der Brand nicht vom
                        # Schüler gewählt wurde und sonst unerklärt bliebe.
                        "brand_jahr": brand_jahr,
                    },
                    "zeitreihe": zeitreihe,
                    "projektion": projektion,
                }
                out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                index.append({"datei": f"simulationen/{dateiname}", **payload["konfiguration"]})
                anzahl += 1

    (OUT_DIR.parent / "simulationen_index.json").write_text(
        json.dumps({
            "_meta": {
                "beschreibung": "Index aller vorab berechneten 20-Jahres-Verläufe (siehe "
                                 "Umsetzungsauftrag 2.11). Die Laufzeit-App nutzt diesen Index, um "
                                 "zu einer gewählten Waldtyp/Störungs/Regler-Kombination die passende "
                                 "Datei aufzulösen.",
                "anzahl": anzahl,
            },
            "eintraege": index,
        }, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    erwartet = stoerungen["kombinatorik"]["gesamt_zeitreihen"]
    print(f"Erzeugt: {anzahl} Zeitreihen (erwartet laut data/stoerungen.json: {erwartet})")
    assert anzahl == erwartet, "Anzahl weicht von der dokumentierten Kombinatorik ab!"


if __name__ == "__main__":
    main()
