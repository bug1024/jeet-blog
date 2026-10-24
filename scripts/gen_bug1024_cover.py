#!/usr/bin/env python3
"""Generate the W-007 cover: the frame at 7.17 s, BUC and 10000000000, just before the steel module arrives.

Uses the same cell grid and binary layout as static/js/bug1024.js.
Usage: python3 scripts/gen_bug1024_cover.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data/works/bug1024.json").read_text(encoding="utf-8"))
OUT = ROOT / "static/works/bug1024/cover.svg"

W, H = 1448, 1086
MIST, INK = "#F8FAF9", "#111A21"
C = DATA["cell"]
GLYPHS, DONE = DATA["glyphs"], DATA["completion"]
SCALE = W * .86 / DATA["width"]
OX = (W - DATA["width"] * SCALE) / 2
OY = (H - DATA["height"] * SCALE) / 2


def inside(gx, name):
    return GLYPHS[name][0] <= gx <= GLYPHS[name][1]


letters, one, zero = [], [], []
for gy, row in enumerate(DATA["grid"]):
    for gx, mark in enumerate(row):
        if mark != "#":
            continue
        if inside(gx, "B") or inside(gx, "U"):
            letters.append((gx, gy))
        elif inside(gx, "G"):
            if not (gx >= DONE["cols"][0] and DONE["rows"][0] <= gy <= DONE["rows"][1]):
                letters.append((gx, gy))
        elif inside(gx, "one"):
            one.append((gx, gy))
        elif inside(gx, "zero"):
            zero.append((gx, gy))

# Binary 1 + ten zeros, same rule as binaryLayout() in the script.
GAP, N = 4, 10
one_w = GLYPHS["one"][1] - GLYPHS["one"][0] + 1
zero_w = GLYPHS["zero"][1] - GLYPHS["zero"][0] + 1
s = min(1, (GLYPHS["four"][1] - GLYPHS["one"][0] + 1) / (one_w + N * (zero_w + GAP)))
center_y, x0 = (2 + 25) / 2 * C, GLYPHS["one"][0] * C
binary = [(x0 + (gx - GLYPHS["one"][0]) * C * s, center_y + (gy * C - center_y) * s) for gx, gy in one]
for i in range(N):
    offset = one_w + GAP + i * (zero_w + GAP)
    binary += [(x0 + (offset + gx - GLYPHS["zero"][0]) * C * s, center_y + (gy * C - center_y) * s) for gx, gy in zero]

gap = C * SCALE * .2
squares = []
for gx, gy in letters:
    x, y = OX + gx * C * SCALE, OY + gy * C * SCALE
    size = C * SCALE - gap
    squares.append(f"M{x + gap / 2:.1f} {y + gap / 2:.1f}h{size:.1f}v{size:.1f}h-{size:.1f}z")
small = C * s * SCALE - min(gap, C * s * SCALE * .3)
for x, y in binary:
    px, py = OX + x * SCALE, OY + y * SCALE
    squares.append(f"M{px:.1f} {py:.1f}h{small:.1f}v{small:.1f}h-{small:.1f}z")

svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
       '<title>10.24 秒：方块拼成的 BUC 和二进制 10000000000</title>'
       f'<rect width="{W}" height="{H}" fill="{MIST}"/>'
       f'<path d="{"".join(squares)}" fill="{INK}"/></svg>')
OUT.write_text(svg, encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
