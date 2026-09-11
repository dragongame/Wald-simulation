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
data/generated/lehrkraft_kombinationen.json (Top 20 nach Kontrast-Score,
weiterhin als Rohdaten gepflegt) sowie - seit M27 - docs/Lehrkraft_Empfehlungen.md,
eine lesbare Markdown-Fassung für die Lehrkraft. M27 hat den früheren
In-App-Screen (js/lehrkraft.js) entfernt: die Übersicht ist bewusst kein Teil
der Schüler:innen-App mehr, sondern ein Dokument, das eine Lehrkraft vor der
Stunde außerhalb der App liest.

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
DOCS = ROOT / "docs"

TOP_N = 20
# M28: reservierte Plätze für den Wildverbiss/Prädatoren-Effekt, siehe Kommentar
# bei WILDVERBISS_INDIKATOR unten - ohne diese Reservierung taucht dieser
# Rückkopplungspfad in der Top-20-Liste nie auf.
WILDVERBISS_RESERVIERT = 3
WILDVERBISS_INDIKATOR = "verjuengung_mischbaumarten"

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


def markdown_eintrag(eintrag, waldtyp_namen):
    name_a = waldtyp_namen.get(eintrag["waldtyp_a"], eintrag["waldtyp_a"])
    name_b = waldtyp_namen.get(eintrag["waldtyp_b"], eintrag["waldtyp_b"])
    unterschiede = ", ".join(eintrag["staerkste_unterschiede"])
    za = eintrag["waldtyp_a_endzustand"]
    zb = eintrag["waldtyp_b_endzustand"]
    hervorhebung = f"- **Besonders empfohlen, weil:** {eintrag['hervorhebung']}\n" if eintrag.get("hervorhebung") else ""
    return (
        f"### #{eintrag['rang']} · {name_a} ⇄ {name_b}\n\n"
        f"- **Störung:** {eintrag['ereignis_label']}\n"
        f"- **Prädator-Regler:** {eintrag['regler_label']}\n"
        f"- **{name_a}:** {za['label']} (Baumbestand {za['gesamtvitalitaet']} von 100)\n"
        f"- **{name_b}:** {zb['label']} (Baumbestand {zb['gesamtvitalitaet']} von 100)\n"
        f"- **Größte Unterschiede:** {unterschiede}\n"
        f"{hervorhebung}"
    )


def schreibe_markdown(top, waldtyp_namen, bewertet_gesamt):
    kopf = (
        "# Lehrkraft-Empfehlungen: kontrastreichste Wald×Störung-Kombinationen\n\n"
        "Automatisch erzeugt von `scripts/simulation/build_lehrkraft_kombinationen.py` "
        "(M19/M27/M28, siehe Milestones-Dokument) - **nicht von Hand bearbeiten**, sondern "
        "das Build-Skript erneut ausführen. Dient der Lehrkraft zur gezielten Verteilung "
        "besonders unterschiedlich verlaufender Szenarien an Gruppen, außerhalb der "
        "Schüler:innen-App gedacht (kein In-App-Screen mehr seit M27).\n\n"
        f"Rangliste der {len(top)} kontrastreichsten von {bewertet_gesamt} geprüften "
        "Wald×Störung-Kombinationen, gemessen an der Differenz der 6 Dashboard-Anzeigen "
        f"bei Jahr 20. Die letzten {WILDVERBISS_RESERVIERT} Plätze sind für die "
        "kontrastreichsten Wildverbiss/Prädatoren-Kombinationen reserviert (siehe "
        "\"Besonders empfohlen, weil\" je Eintrag) - dieser Effekt würde sonst nie in der "
        "Liste auftauchen, weil sein zentraler Indikator (Verjüngung Mischbaumarten) kein "
        "Dashboard-Indikator ist und daher nicht in den Kontrast-Score einfließt (M28).\n\n"
        "---\n\n"
    )
    body = "\n".join(markdown_eintrag(e, waldtyp_namen) for e in top)
    (DOCS / "Lehrkraft_Empfehlungen.md").write_text(kopf + body, encoding="utf-8")


def main():
    stoerungen = lade(DATA / "stoerungen.json")
    indikatoren = lade(DATA / "indikatoren.json")["indikatoren"]
    waldtypen = lade(DATA / "waldtypen.json")["waldtypen"]
    index = lade(GEN / "simulationen_index.json")["eintraege"]

    ereignis_name = {e["id"]: e["name"] for e in stoerungen["ereignis_stoerungen"]}
    kern_indikatoren = [i["id"] for i in indikatoren if i.get("dashboard_sichtbar")]
    indikator_name = {i["id"]: i["name"] for i in indikatoren}
    waldtyp_namen = {w["id"]: w["kurzname"] for w in waldtypen}

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
                # M28: nicht Teil von kontrast_score (kein Dashboard-Indikator,
                # siehe WILDVERBISS_INDIKATOR-Kommentar unten), aber die Grundlage
                # für die separate Wildverbiss-Reservierung weiter unten.
                "verjuengung_a": round(jahr20_a[WILDVERBISS_INDIKATOR], 1),
                "verjuengung_b": round(jahr20_b[WILDVERBISS_INDIKATOR], 1),
                "verjuengung_diff": round(abs(jahr20_a[WILDVERBISS_INDIKATOR] - jahr20_b[WILDVERBISS_INDIKATOR]), 1),
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

    # M28 (siehe Milestones-Dokument): eine kritische Durchsicht der bisherigen
    # Top-20 zeigte, dass sie ausschließlich denselben Rückkopplungspfad zeigten
    # (Fichtenmonokultur kollabiert am stärksten sichtbaren Indikator
    # gesamtvitalitaet) - der Wildverbiss/Prädatoren-Regler kam praktisch nie
    # vor, weil sein zentraler Indikator (verjuengung_mischbaumarten, laut
    # data/indikatoren.json "zentraler Indikator für Szenario 6") bewusst NICHT
    # zu den 6 Dashboard-Indikatoren zählt (dashboard_sichtbar=false) und damit
    # für kontrast_score unsichtbar ist. Das ist genau der in der Wissensbasis/
    # den Akzeptanzkriterien hervorgehobene "erst in der 2. Hälfte sichtbare"
    # Effekt (siehe Milestones "Bekannte Annahmen") - ohne diese Reservierung
    # würde die Lehrkraft-Liste ihn nie empfehlen. Statt kontrast_score selbst
    # zu verändern (der bleibt bewusst "was Schüler:innen im Dashboard sehen"),
    # werden hier zusätzlich die WILDVERBISS_RESERVIERT kontrastreichsten
    # Wildverbiss-Kombinationen (Regler != "beide") separat ermittelt und der
    # Liste hinzugefügt, falls sie es nicht ohnehin schon per kontrast_score
    # geschafft haben.
    primaer = ergebnisse[: TOP_N - WILDVERBISS_RESERVIERT]
    bereits_dabei = {id(e) for e in primaer}
    wildverbiss_kandidaten = sorted(
        (e for e in ergebnisse if e["wildverbiss_regler"] != "beide" and id(e) not in bereits_dabei),
        key=lambda e: -e["verjuengung_diff"],
    )
    for e in wildverbiss_kandidaten[:WILDVERBISS_RESERVIERT]:
        e["hervorhebung"] = (
            f"Wildverbiss/Prädatoren-Effekt: Verjüngung Mischbaumarten unterscheidet sich um "
            f"{e['verjuengung_diff']} Punkte zwischen den Waldtypen ({e['verjuengung_a']} vs. "
            f"{e['verjuengung_b']}) - im normalen Kontrast-Score nicht sichtbar, da kein "
            "Dashboard-Indikator (siehe Kommentar im Build-Skript)."
        )
    top = primaer + wildverbiss_kandidaten[:WILDVERBISS_RESERVIERT]
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
                "Wildverbiss-Regler-Variante enthalten (siehe Kommentar im Build-Skript). "
                f"Seit M28: die letzten {WILDVERBISS_RESERVIERT} Plätze sind für die "
                "kontrastreichsten Wildverbiss/Prädatoren-Kombinationen reserviert (siehe "
                "'hervorhebung'-Feld), da dieser Effekt sonst nie in der Liste auftaucht."
            ),
            "bewertete_waldtyp_ereignis_kombinationen_gesamt": len(ergebnisse),
            "top_n": TOP_N,
            "wildverbiss_reserviert": WILDVERBISS_RESERVIERT,
        },
        "kombinationen": top,
    }
    (GEN / "lehrkraft_kombinationen.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    schreibe_markdown(top, waldtyp_namen, len(ergebnisse))
    print(f"{len(ergebnisse)} Waldtyp-Paar/Ereignis-Kombinationen bewertet, Top {TOP_N} gespeichert.")
    print("docs/Lehrkraft_Empfehlungen.md geschrieben.")


if __name__ == "__main__":
    main()
