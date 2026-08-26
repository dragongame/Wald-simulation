#!/usr/bin/env python3
"""Erzeugt einen einfachen Platzhalter-App-Icon (Forscherheft + Sprig-Motiv)
in den fuer manifest.json / apple-touch-icon benoetigten Aufloesungen.

Platzhalter bis das extern generierte Icon aus assets/prompts/app_icon.txt
vorliegt (siehe Milestones-Dokument, Abschnitt "Bekannte Luecken").
"""
import pathlib

from PIL import Image, ImageDraw

PARCHMENT = "#EFE9DC"
INK = "#2B2A26"
MOSS = "#4C6E4A"
BARK = "#6B4A34"
AMBER = "#B5651D"

OUT_DIR = pathlib.Path(__file__).resolve().parent.parent.parent / "assets" / "icons"

SIZES = {
    "icon-192.png": 192,
    "icon-512.png": 512,
    "apple-touch-icon.png": 180,
}


def draw_icon(size: int) -> Image.Image:
    scale = size / 512
    img = Image.new("RGB", (size, size), PARCHMENT)
    draw = ImageDraw.Draw(img)

    def s(v: float) -> float:
        return v * scale

    # Rahmen (dezent, damit das Icon auch ohne OS-Maskierung gut aussieht)
    draw.rounded_rectangle(
        [s(8), s(8), size - s(8), size - s(8)],
        radius=s(64),
        outline=BARK,
        width=max(1, round(s(6))),
    )

    # Notizbuch (Forscherheft)
    book_left, book_top, book_right, book_bottom = s(120), s(210), s(392), s(430)
    draw.rounded_rectangle(
        [book_left, book_top, book_right, book_bottom],
        radius=s(14),
        fill="#FFFDF7",
        outline=BARK,
        width=max(1, round(s(8))),
    )
    # Buchruecken/Falz
    spine_x = (book_left + book_right) / 2
    draw.line([spine_x, book_top + s(6), spine_x, book_bottom - s(6)], fill=BARK, width=max(1, round(s(5))))
    # angedeutete Zeilen
    for i in range(3):
        y = book_top + s(60) + i * s(30)
        draw.line([book_left + s(24), y, spine_x - s(20), y], fill=INK, width=max(1, round(s(4))))
        draw.line([spine_x + s(20), y, book_right - s(24), y], fill=INK, width=max(1, round(s(4))))

    # Sprossender Zweig/Blatt oberhalb des Buchs
    stem_x = spine_x
    stem_top = s(150)
    draw.line([stem_x, book_top, stem_x, stem_top], fill=BARK, width=max(1, round(s(7))))

    leaf_w, leaf_h = s(70), s(46)
    for dx, angle in ((-1, 1), (1, -1)):
        cx = stem_x + dx * s(6)
        cy = stem_top - s(6)
        leaf = [
            (cx, cy),
            (cx + dx * leaf_w * 0.75, cy - leaf_h * 0.9),
            (cx + dx * leaf_w * 1.3, cy - leaf_h * 0.1),
            (cx + dx * leaf_w * 0.6, cy + leaf_h * 0.35),
        ]
        draw.polygon(leaf, fill=MOSS, outline=BARK)
        draw.line([cx, cy, cx + dx * leaf_w * 1.1, cy - leaf_h * 0.15], fill=AMBER, width=max(1, round(s(3))))

    draw.ellipse(
        [stem_x - s(9), stem_top - s(15), stem_x + s(9), stem_top + s(3)],
        fill=MOSS,
        outline=BARK,
    )

    return img


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for filename, size in SIZES.items():
        img = draw_icon(size)
        out_path = OUT_DIR / filename
        img.save(out_path, format="PNG")
        print(f"geschrieben: {out_path} ({size}x{size})")


if __name__ == "__main__":
    main()
