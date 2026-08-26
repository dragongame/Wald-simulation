#!/usr/bin/env python3
"""Erzeugt sw-precache-manifest.json: Liste aller zur Laufzeit benoetigten
Dateien + ein aus deren Inhalt abgeleiteter Versions-Hash.

Der Service Worker (sw.js) laedt diese Datei beim Install-Event, cached alle
gelisteten Dateien und benennt den Cache nach dem Hash. Aendert sich auch nur
eine Datei, aendert sich der Hash automatisch -> neuer Cache-Name -> der
Service Worker erkennt beim naechsten Laden zuverlaessig eine neue Version
und loescht den alten Cache (siehe Technikdokument 5.2, "versionierte
Cache-Strategie"). Manuelles Versions-Hochzaehlen, das leicht vergessen
werden kann, entfaellt dadurch.

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

# Einzeldateien direkt im Projekt-Root, die die App-Shell bilden.
SHELL_FILES = [
    "index.html",
    "manifest.json",
    "css/styles.css",
    "js/app.js",
    "js/storage.js",
]

# Verzeichnisse, deren Inhalt vollstaendig fuer den Offline-Betrieb benoetigt
# wird (Bilder, Icons, Inhaltsdaten, vorab berechnete Simulationen).
ASSET_DIRS = [
    "assets/icons",
    "assets/sprites",
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


if __name__ == "__main__":
    main()
