#!/usr/bin/env python3
"""Generate the W-007 cover: the opening state of the work, before the wordmark is revealed.

Usage: python3 scripts/gen_unaligned_cover.py
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data/works/unaligned.json").read_text(encoding="utf-8"))
OUT = ROOT / "static/works/unaligned/cover.svg"

W, H = 1448, 1086
MIST, INK, STEEL, SLATE = "#F8FAF9", "#111A21", "#365B6D", "#71838C"
CELL = DATA["cell"]
# Framed close around the steel module so the squares still read at thumbnail size.
SCALE = W / 150
MODULE_CENTER = (DATA["module"]["x"] + DATA["module"]["w"] / 2, DATA["module"]["y"] + DATA["module"]["h"] / 2)
OX = W / 2 - MODULE_CENTER[0] * SCALE
OY = H / 2 - MODULE_CENTER[1] * SCALE
GAP = CELL * SCALE * .2
SIZE = CELL * SCALE - GAP


def px(x, y):
    return OX + x * SCALE, OY + y * SCALE


parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
    '<title>不归位：网格上零散落着一些墨色方块，一枚钢蓝色方块不在网格点上</title>',
    f'<rect width="{W}" height="{H}" fill="{MIST}"/>',
]

# Grid points: the system every ink module is held to.
step = CELL * SCALE
parts.append(f'<pattern id="grid" width="{step:.3f}" height="{step:.3f}" patternUnits="userSpaceOnUse" '
             f'x="{OX % step - 1.6:.3f}" y="{OY % step - 1.6:.3f}"><rect width="3.2" height="3.2" fill="{SLATE}" fill-opacity=".22"/></pattern>')
parts.append(f'<rect width="{W}" height="{H}" fill="url(#grid)"/>')

# The cover shows the opening, not the answer: a few batches laid down, nothing readable yet.
seed = 1024
def rand():
    global seed
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296


cols, rows = len(DATA["grid"][0]), len(DATA["grid"])
module = DATA["module"]
blocked = {(gx, gy) for gx in range(int(module["x"] // CELL) - 1, int((module["x"] + module["w"]) // CELL) + 2)
           for gy in range(int(module["y"] // CELL) - 1, int((module["y"] + module["h"]) // CELL) + 2)}
taken = set()
squares = []
for cx, cy in ((42, 7), (70, 20), (75, 5)):
    laid = 0
    while laid < 36:
        angle, radius = rand() * 6.2832, (-2 * math.log(rand() + 1e-9)) ** .5 * 7
        gx = round(cx + math.cos(angle) * radius)
        gy = round(cy + math.sin(angle) * radius * .7)
        if not (0 <= gx < cols and 0 <= gy < rows) or (gx, gy) in taken or (gx, gy) in blocked:
            continue
        taken.add((gx, gy))
        laid += 1
        x, y = px(gx * CELL, gy * CELL)
        squares.append(f"M{x + GAP / 2:.1f} {y + GAP / 2:.1f}h{SIZE:.1f}v{SIZE:.1f}h-{SIZE:.1f}z")
parts.append(f'<path d="{"".join(squares)}" fill="{INK}"/>')

mx, my = px(module["x"], module["y"])
parts.append(f'<rect x="{mx + GAP / 2:.1f}" y="{my + GAP / 2:.1f}" width="{module["w"] * SCALE - GAP:.1f}" '
             f'height="{module["h"] * SCALE - GAP:.1f}" fill="{STEEL}"/>')
parts.append("</svg>")

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("".join(parts), encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
