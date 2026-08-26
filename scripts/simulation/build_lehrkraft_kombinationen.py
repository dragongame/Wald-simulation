#!/usr/bin/env python3
"""Build-Skript für M19 (Lehrkraft-Liste kontrastreichster 2er-Kombinationen,
siehe Milestones-Dokument, Backlog "Erstelle eine Liste den Interessantesten
2er Kombinationen").

Läuft NUR beim Build, nie zur Laufzeit der App - konsistent mit dem
Grundprinzip der Build-Time-Vorabsimulation (Umsetzungsauftrag 2.11): die
App liest hier nur eine fertige Rangliste, berechnet nichts selbst.

Liest die bereits von build_simulationen.py erzeugten Zeitreihen
(data/generated/simulationen/*.json über den Index) und bewertet für jede
der 87 Ereignis/Wildverbiss-Konfigurationen alle drei möglichen
Waldtyp-Paarungen (Mischwald/Fichtenmonokultur/Kiefernwald) danach, wie
kontrastreich ihr Jahr-20-Endzustand ist - gemessen als mittlere absolute
Differenz über die 6 Dashboard-Indikatoren (data/indikatoren.json,
dashboard_sichtbar=true), also genau die Werte, die Schüler:innen im
Live-Dashboard (M5) tatsächlich als Feldmessinstrumente sehen. Ergebnis:
data/generated/lehrkraft_kombinationen.json, Top 20 nach Kontrast-Score,
für eine neue Lehrkraft-Übersicht in der App gedacht (gezielte Verteilung
besonders unterschiedlich verlaufender Szenarios an Gruppen).

Aufruf: python3 scripts/simulation/build_lehrkraft_kombinationen.py
(nach jedem Lauf von build_simulationen.py erneut ausführen, falls sich
die zugrundeliegenden Zeitreihen geändert haben könnten.)
"""
import itertools
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "data"
GEN = DATA / "generated"

TOP_N = 20

REGLER_LABELS = {
    "beide": "Luchs & Wolf (Standard, kaum Effekt)",
    "luchs": "nur Luchs (Wolf fehlt)",
    "wolf": "nur Wolf (Luchs fehlt)",
    "keine": "beide fehlen (starker Wildverbiss)",
}


def lade(pfad):
    return json.loads(pfad.read_text(encoding="utf-8"))


def ereignisse_key(ereignisse):
    return tuple((e["typ"], e["trigger_jahr"]) for e in ereignisse)


def ereignis_label(ereignisse, ereignis_name):
    if not ereignisse:
        return "Keine Ereignis-Störung (nur Wildverbiss-Regler)"
    sortiert = sorted(ereignisse, key=lambda e: e["trigger_jahr"])
    if len(sortiert) == 1:
        return ereignis_name[sortiert[0]["typ"]]
    if sortiert[0]["trigger_jahr"] == sortiert[1]["trigger_jahr"]:
        return " + ".join(ereignis_name[e["typ"]] for e in sortiert) + " (gleichzeitig)"
    return (
        f"{ereignis_name[sortiert[0]['typ']]} → {ereignis_name[sortiert[1]['typ']]} "
        f"({sortiert[1]['trigger_jahr']} Jahr(e) später)"
    )


def endzustand_label(vitalitaet):
    if vitalitaet >= 70:
        return "kaum Schaden"
    if vitalitaet >= 30:
        return "deutlicher Schaden"
    return "Kollaps"


def main():
    stoerungen = lade(DATA / "stoerungen.json")
    indikatoren = lade(DATA / "indikatoren.json")["indikatoren"]
    index = lade(GEN / "simulationen_index.json")["eintraege"]

    ereignis_name = {e["id"]: e["name"] for e in stoerungen["ereignis_stoerungen"]}
    kern_indikatoren = [i["id"] for i in indikatoren if i.get("dashboard_sichtbar")]
    indikator_name = {i["id"]: i["name"] for i in indikatoren}

    gruppen = {}
    for eintrag in index:
        key = (ereignisse_key(eintrag["ereignisse"]), eintrag["wildverbiss_regler"])
        gruppen.setdefault(key, {})[eintrag["waldtyp"]] = eintrag

    zeitreihe_cache = {}

    def lade_jahr_20(datei):
        if datei not in zeitreihe_cache:
            zeitreihe_cache[datei] = lade(GEN / datei)["zeitreihe"]["jahr_20"]
        return zeitreihe_cache[datei]

    # Pro Waldtyp-Paar x Ereignis-Konfiguration wird nur die kontrastreichste
    # Wildverbiss-Regler-Variante behalten (der Regler ändert den Score kaum,
    # siehe Vorab-Auswertung - ohne diese Bündelung wären die Top-Plätze fast
    # nur Regler-Varianten derselben Störung, statt eine Bandbreite
    # unterschiedlicher Störungs-Kombinationen zu zeigen).
    beste_pro_gruppe = {}
    for (ekey, regler), waldtyp_eintraege in gruppen.items():
        for a, b in itertools.combinations(sorted(waldtyp_eintraege), 2):
            jahr20_a = lade_jahr_20(waldtyp_eintraege[a]["datei"])
            jahr20_b = lade_jahr_20(waldtyp_eintraege[b]["datei"])

            diffs = {ind: abs(jahr20_a[ind] - jahr20_b[ind]) for ind in kern_indikatoren}
            score = sum(diffs.values()) / len(diffs)
            staerkste = sorted(diffs.items(), key=lambda kv: -kv[1])[:3]

            kandidat = {
                "waldtyp_a": a,
                "waldtyp_b": b,
                "ereignisse": waldtyp_eintraege[a]["ereignisse"],
                "wildverbiss_regler": regler,
                "kontrast_score": round(score, 1),
                "ereignis_label": ereignis_label(waldtyp_eintraege[a]["ereignisse"], ereignis_name),
                "regler_label": REGLER_LABELS[regler],
                "waldtyp_a_endzustand": {
                    "gesamtvitalitaet": round(jahr20_a["gesamtvitalitaet"], 1),
                    "label": endzustand_label(jahr20_a["gesamtvitalitaet"]),
                },
                "waldtyp_b_endzustand": {
                    "gesamtvitalitaet": round(jahr20_b["gesamtvitalitaet"], 1),
                    "label": endzustand_label(jahr20_b["gesamtvitalitaet"]),
                },
                "staerkste_unterschiede": [indikator_name[ind] for ind, _ in staerkste],
            }

            # Bündelt zusätzlich über die Trigger-Reihenfolge (bei Paaren mit
            # wählbarer Reihenfolge sonst zwei fast identische Top-Platzierungen
            # für dieselbe inhaltliche Störungs-Kombination, siehe M13).
            ereignis_typen = frozenset(typ for typ, _ in ekey)
            gruppen_schluessel = (a, b, ereignis_typen)
            bisher = beste_pro_gruppe.get(gruppen_schluessel)
            if bisher is None or kandidat["kontrast_score"] > bisher["kontrast_score"]:
                beste_pro_gruppe[gruppen_schluessel] = kandidat

    ergebnisse = list(beste_pro_gruppe.values())
    ergebnisse.sort(key=lambda e: -e["kontrast_score"])
    top = ergebnisse[:TOP_N]
    for rang, e in enumerate(top, start=1):
        e["rang"] = rang

    out = {
        "_meta": {
            "beschreibung": (
                "Rangliste der kontrastreichsten Waldtyp-Paar/Störungs/Wildverbiss-"
                "Kombinationen (M19, siehe Milestones-Dokument), für eine Lehrkraft-"
                "Übersicht zur gezielten Verteilung an Gruppen. Kontrast-Score = "
                "mittlere absolute Differenz der 6 Dashboard-Indikatoren "
                "(data/indikatoren.json, dashboard_sichtbar=true) zwischen beiden "
                "Waldtypen bei Jahr 20, auf 0-100 skaliert wie die Indikatoren selbst. "
                "Pro Waldtyp-Paar x Ereignis-Konfiguration ist nur die kontrastreichste "
                "Wildverbiss-Regler-Variante enthalten (siehe Kommentar im Build-Skript)."
            ),
            "bewertete_waldtyp_ereignis_kombinationen_gesamt": len(ergebnisse),
            "top_n": TOP_N,
        },
        "kombinationen": top,
    }
    (GEN / "lehrkraft_kombinationen.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"{len(ergebnisse)} Waldtyp-Paar/Ereignis-Kombinationen bewertet, Top {TOP_N} gespeichert.")


if __name__ == "__main__":
    main()
