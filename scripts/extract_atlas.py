#!/usr/bin/env python3
"""Extract the 38 individual species/state sprites from the labelled contact-sheet
atlas (docs/ChatGPT Image Aug 25, 2026, 02_41_08 PM.png) into assets/sprites/.

The atlas is a loosely arranged grid (not perfectly uniform cell sizes) on a pure
white canvas, with each cell's cream-paper (#EFE9DC) artwork followed by a small
black filename caption underneath. Row/column boundaries below were located by
scanning per-row and per-column "ink density" (fraction of pixels darker than a
near-white threshold) to find the true whitespace gutters between cells, and to
separate each image from its caption text (which must NOT end up in the sprite,
per the "no text/labels" rule in the illustration style guide). See git history /
project chat for the derivation; values are hardcoded here because the sheet is
hand-arranged and not on a strict pixel grid.

One filename in the atlas ("hirsch_portrait") is renamed to "rothirsch_portrait"
to match the canonical node id used throughout the project docs.
"""

from pathlib import Path

from PIL import Image

ATLAS_PATH = Path("docs/ChatGPT Image Aug 25, 2026, 02_41_08 PM.png")
OUT_DIR = Path("assets/sprites")

# (top, bottom) per row - image content only, caption text excluded.
ROW_BANDS = [
    (0, 213),
    (236, 428),
    (458, 643),
    (667, 838),
    (867, 1030),
    (1064, 1215),
]

# (left, right) per column, per row (rows aren't perfectly aligned column-to-column).
COL_BANDS = [
    [(14, 182), (182, 355), (355, 520), (520, 705), (705, 909), (909, 1045), (1045, 1250)],
    [(7, 179), (179, 348), (348, 532), (532, 706), (706, 895), (895, 1042), (1042, 1250)],
    [(12, 165), (165, 349), (349, 528), (528, 706), (706, 889), (889, 1049), (1049, 1248)],
    [(12, 177), (177, 343), (343, 526), (526, 709), (709, 894), (894, 1046), (1046, 1234)],
    [(9, 175), (175, 347), (347, 517), (517, 709), (709, 889), (889, 1048), (1048, 1235)],
    [(7, 169), (169, 351), (351, 527)],
]

ROW_NAMES = [
    [
        "fichte_gesund", "fichte_gestresst", "fichte_befallen", "fichte_abgestorben",
        "fichte_totholz", "borkenkaefer_einzeln", "borkenkaefer_massenvermehrung",
    ],
    [
        "buche_gesund", "buche_gestresst", "eiche_gesund", "kiefer_gesund",
        "kiefer_gestresst", "birke_pionier", "totholz_generisch",
    ],
    [
        "reh_portrait", "rothirsch_portrait", "eichelhaeher_portrait",
        "eichhoernchen_portrait", "buntspecht_portrait", "ameisenbuntkaefer_portrait",
        "fuchs_portrait",
    ],
    [
        "habicht_portrait", "sperber_portrait", "luchs_portrait", "wolf_portrait",
        "mykorrhizapilz_portrait", "hallimasch_portrait", "zunderschwamm_portrait",
    ],
    [
        "blaeuepilz_portrait", "hasel_portrait", "holunder_portrait",
        "brombeere_portrait", "buschwindroeschen_portrait", "waldmeister_portrait",
        "brennnessel_portrait",
    ],
    ["heidelbeere_portrait", "raupen_portrait", "blattlaeuse_portrait"],
]


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(ATLAS_PATH).convert("RGB")

    count = 0
    for row_idx, (top, bottom) in enumerate(ROW_BANDS):
        cols = COL_BANDS[row_idx]
        names = ROW_NAMES[row_idx]
        assert len(cols) == len(names), f"row {row_idx}: {len(cols)} cols vs {len(names)} names"
        for (left, right), name in zip(cols, names):
            cell = im.crop((left, top, right, bottom))
            out_path = OUT_DIR / f"{name}.png"
            cell.save(out_path)
            count += 1
            print(f"saved {out_path} ({cell.size[0]}x{cell.size[1]})")

    print(f"\nTotal sprites extracted: {count}")


if __name__ == "__main__":
    main()
