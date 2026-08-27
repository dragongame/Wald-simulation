#!/usr/bin/env python3
"""Erzeugt sw-precache-manifest.json (Dateiliste + Versions-Hash) UND sw.js
(aus scripts/pwa/sw.template.js, mit eingesetzter Versionsnummer).

Der Service Worker cached beim Install-Event alle in der Manifest-Datei
gelisteten Dateien und benennt den Cache nach dem Hash. Aendert sich auch nur
eine Datei, aendert sich der Hash automatisch -> neuer Cache-Name -> der
Service Worker loescht beim naechsten Update den alten Cache (siehe
Technikdokument 5.2, "versionierte Cache-Strategie").

WICHTIG: Damit der Browser dieses Update ueberhaupt bemerkt, muss sich sw.js
selbst (Byte-fuer-Byte) aendern - das ist die einzige Grundlage, auf der
Browser ein Service-Worker-Update erkennen, unabhaengig vom Inhalt der
Manifest-Datei. Deshalb wird sw.js hier aus einem Template MIT eingesetzter
Versionsnummer neu geschrieben statt als statische Datei gepflegt (sw.js
NIE direkt editieren, siehe scripts/pwa/sw.template.js).

Aufruf: python3 scripts/pwa/build_precache_manifest.py
Muss nach jeder Aenderung an gecachten Dateien erneut ausgefuehrt und
mitcommittet werden (analog zu den vorab berechneten Simulationen aus M2,
siehe Milestones-Dokument).
"""
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
OUT_FILE = ROOT / "sw-precache-manifest.json"
SW_TEMPLATE_FILE = ROOT / "scripts" / "pwa" / "sw.template.js"
SW_OUT_FILE = ROOT / "sw.js"

# Einzeldateien direkt im Projekt-Root, die die App-Shell bilden.
SHELL_FILES = [
    "index.html",
    "manifest.json",
]

# Verzeichnisse, deren Inhalt vollstaendig fuer den Offline-Betrieb benoetigt
# wird (Bilder, Icons, Inhaltsdaten, vorab berechnete Simulationen, CSS/JS).
# Bewusst verzeichnisbasiert statt einzelne Dateien aufzulisten, damit eine
# neu hinzugefuegte JS-/CSS-Datei nicht manuell nachgetragen werden muss -
# genau das wurde vorher vergessen und fehlte dadurch im Offline-Cache.
ASSET_DIRS = [
    "assets/icons",
    "assets/sprites",
    "assets/misc",
    "css",
    "js",
    "data",
]

# Unterpfade, die trotz Lage in einem der ASSET_DIRS NICHT zur Laufzeit
# gebraucht werden (reine Entwicklungs-/Referenzdateien).
EXCLUDE_PREFIXES = [
    "assets/sprites/_reference/",
]


def collect_files() -> list[str]:
    rel_paths: set[str] = set(SHELL_FILES)

    for asset_dir in ASSET_DIRS:
        for path in (ROOT / asset_dir).rglob("*"):
            if not path.is_file():
                continue
            rel = path.relative_to(ROOT).as_posix()
            if any(rel.startswith(prefix) for prefix in EXCLUDE_PREFIXES):
                continue
            rel_paths.add(rel)

    return sorted(rel_paths)


def compute_version(files: list[str]) -> str:
    digest = hashlib.sha256()
    for rel in files:
        digest.update(rel.encode("utf-8"))
        digest.update((ROOT / rel).read_bytes())
    return digest.hexdigest()[:16]


def main() -> None:
    files = collect_files()
    version = compute_version(files)
    manifest = {
        "version": version,
        "cacheName": f"waldsim-precache-{version}",
        # "./" zusaetzlich zu "./index.html", damit Navigationsanfragen auf
        # die Domain-Wurzel (z. B. bei "Zum Home-Bildschirm hinzufuegen")
        # ebenfalls direkt aus dem Cache bedient werden koennen.
        "files": ["./"] + [f"./{rel}" for rel in files],
    }
    OUT_FILE.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"geschrieben: {OUT_FILE} ({len(manifest['files'])} Dateien, Version {version})")

    sw_template = SW_TEMPLATE_FILE.read_text(encoding="utf-8")
    if "__SW_VERSION__" not in sw_template:
        raise RuntimeError(f"{SW_TEMPLATE_FILE} enthaelt keinen __SW_VERSION__-Platzhalter mehr")
    SW_OUT_FILE.write_text(sw_template.replace("__SW_VERSION__", version), encoding="utf-8")
    print(f"geschrieben: {SW_OUT_FILE} (Version {version})")


if __name__ == "__main__":
    main()
