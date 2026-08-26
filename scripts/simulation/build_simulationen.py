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

from model import simuliere

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
OUT_DIR = DATA / "generated" / "simulationen"

EVENTS_NATUR_UND_BEWIRTSCHAFTUNG = ["borkenkaefer", "trockenheit", "sturm", "totholzentnahme"]


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


def main():
    waldtypen = lade("waldtypen.json")["waldtypen"]
    stoerungen = lade("stoerungen.json")
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

    ereignis_konfigs = baue_ereignis_konfigurationen(stoerungen)
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
        for konfig_id, events in ereignis_konfigs:
            for praedatoren_code, wolf_aktiv, luchs_aktiv in praedatoren_kombinationen:
                if konfig_id == "keine" and praedatoren_code == "beide":
                    continue  # ungültig: keine Abweichung vom Ausgangszustand (2.10.2/3.2)

                zeitreihe = simuliere(waldtyp, events, wolf_aktiv, luchs_aktiv)

                dateiname = f"{waldtyp['id']}__{konfig_id}__praedatoren-{praedatoren_code}.json"
                out_path = OUT_DIR / dateiname
                payload = {
                    "konfiguration": {
                        "waldtyp": waldtyp["id"],
                        "ereignisse": events,
                        "wildverbiss_regler": praedatoren_code,
                    },
                    "zeitreihe": zeitreihe,
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
