#!/usr/bin/env python3
"""Generate the W-007 cover from the same 1023-cell grid the work draws.

Usage: python3 scripts/gen_unaligned_cover.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data/works/unaligned.json").read_text(encoding="utf-8"))
OUT = ROOT / "static/works/unaligned/cover.svg"

W, H = 1448, 1086
MIST, INK, STEEL, SLATE = "#F8FAF9", "#111A21", "#365B6D", "#71838C"
CELL = DATA["cell"]
SCALE = W * .84 / DATA["width"]
OX = (W - DATA["width"] * SCALE) / 2
OY = (H - DATA["height"] * SCALE) / 2
GAP = CELL * SCALE * .2
SIZE = CELL * SCALE - GAP


def px(x, y):
    return OX + x * SCALE, OY + y * SCALE


parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
    '<title>不归位：1023 个墨色方块拼成 BUG1024，一枚钢蓝色方块不在网格上</title>',
    f'<rect width="{W}" height="{H}" fill="{MIST}"/>',
]

# Grid points: the system every ink module is held to.
step = CELL * SCALE
parts.append(f'<pattern id="grid" width="{step:.3f}" height="{step:.3f}" patternUnits="userSpaceOnUse" '
             f'x="{OX % step - 1.6:.3f}" y="{OY % step - 1.6:.3f}"><rect width="3.2" height="3.2" fill="{SLATE}" fill-opacity=".22"/></pattern>')
parts.append(f'<rect width="{W}" height="{H}" fill="url(#grid)"/>')

squares = []
for gy, row in enumerate(DATA["grid"]):
    for gx, mark in enumerate(row):
        if mark == "#":
            x, y = px(gx * CELL, gy * CELL)
            squares.append(f"M{x + GAP / 2:.1f} {y + GAP / 2:.1f}h{SIZE:.1f}v{SIZE:.1f}h-{SIZE:.1f}z")
parts.append(f'<path d="{"".join(squares)}" fill="{INK}"/>')

module = DATA["module"]
mx, my = px(module["x"], module["y"])
parts.append(f'<rect x="{mx + GAP / 2:.1f}" y="{my + GAP / 2:.1f}" width="{module["w"] * SCALE - GAP:.1f}" '
             f'height="{module["h"] * SCALE - GAP:.1f}" fill="{STEEL}"/>')
parts.append("</svg>")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("".join(parts), encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
