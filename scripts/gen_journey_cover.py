#!/usr/bin/env python3
"""Generate static/works/journey/cover.svg from data/works/journey.json.

Same projection and visual language as static/js/journey.js, so the works
directory card previews the actual piece. Re-run after editing the data.
"""
import json
import math
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data/works/journey.json").read_text(encoding="utf-8"))
OUT = ROOT / "static/works/journey/cover.svg"

W, H = 1448, 1086
NIGHT = "#0d1418"
INK = (237, 242, 241)
STEEL = (142, 175, 186)
AMBER = (232, 192, 122)


def merc_y(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


chapters = DATA["chapters"]
pts = [c["coords"] for c in chapters]
for c in chapters:
    pts += [t["coords"] for t in c.get("trips", [])]

min_lon = min(p[0] for p in pts) - 1.1
max_lon = max(p[0] for p in pts) + 1.1
min_y = min(merc_y(p[1]) for p in pts) - 1.2
max_y = max(merc_y(p[1]) for p in pts) + 1.2
s = min(W / (max_lon - min_lon), H / (max_y - min_y))
ox = (W - (max_lon - min_lon) * s) / 2
oy = (H - (max_y - min_y) * s) / 2


def project(lon, lat):
    return ((lon - min_lon) * s + ox, H - ((merc_y(lat) - min_y) * s + oy))


def arc(p0, p1):
    mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    dist = math.hypot(dx, dy) or 1
    bend = min(dist * 0.2, 130)
    cx, cy = mx + (-dy / dist) * bend, my + (dx / dist) * bend
    return f"M {p0[0]:.1f} {p0[1]:.1f} Q {cx:.1f} {cy:.1f} {p1[0]:.1f} {p1[1]:.1f}"


def rgba(rgb, a):
    return f"rgba({rgb[0]},{rgb[1]},{rgb[2]},{a})"


parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
    f'<rect width="{W}" height="{H}" fill="{NIGHT}"/>',
]

# graticule
step = 2.5
lon = math.floor(min_lon / step) * step
while lon <= max_lon:
    x = project(lon, 0)[0]
    parts.append(f'<line x1="{x:.1f}" y1="0" x2="{x:.1f}" y2="{H}" stroke="{rgba(STEEL, 0.06)}" stroke-width="1"/>')
    lon += step
lat = math.floor(16 / step) * step
while lat <= 44:
    y = project(0, lat)[1]
    parts.append(f'<line x1="0" y1="{y:.1f}" x2="{W}" y2="{y:.1f}" stroke="{rgba(STEEL, 0.06)}" stroke-width="1"/>')
    lat += step

# stars
rng = random.Random(1990)
for _ in range(320):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    r = rng.uniform(0.4, 1.3)
    parts.append(f'<rect x="{x:.1f}" y="{y:.1f}" width="{r:.1f}" height="{r:.1f}" fill="{rgba(INK, round(rng.uniform(0.05, 0.25), 3))}"/>')

# trip arcs
for c in chapters:
    base = project(*c["coords"])
    for t in c.get("trips", []):
        parts.append(f'<path d="{arc(base, project(*t["coords"]))}" fill="none" stroke="{rgba(STEEL, 0.45)}" stroke-width="1.4"/>')

# main arcs
for i in range(1, len(chapters)):
    parts.append(f'<path d="{arc(project(*chapters[i-1]["coords"]), project(*chapters[i]["coords"]))}" fill="none" stroke="{rgba(INK, 0.9)}" stroke-width="2.4"/>')

# points
for c in chapters:
    for t in c.get("trips", []):
        x, y = project(*t["coords"])
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.6" fill="{rgba(STEEL, 0.85)}"/>')
seen_labels = set()
label_positions = []
for c in chapters:
    x, y = project(*c["coords"])
    if c.get("home"):
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="22" fill="{rgba(AMBER, 0.18)}"/>')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="{rgba(AMBER, 0.4)}"/>')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.6" fill="{rgba(AMBER, 1)}"/>')
    else:
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="13" fill="{rgba(INK, 0.16)}"/>')
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3" fill="{rgba(INK, 0.95)}"/>')
    crowded = any(math.hypot(x - lx, y - ly) < 60 for lx, ly in label_positions)
    if c["place"] not in seen_labels and not crowded:
        seen_labels.add(c["place"])
        label_positions.append((x, y))
        label_color = AMBER if c.get("home") else INK
        parts.append(
            f'<text x="{x + 16:.1f}" y="{y + 6:.1f}" fill="{rgba(label_color, 0.72)}" '
            f'font-family="PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif" font-size="21">{c["place"]}</text>'
        )

parts.append("</svg>")
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n".join(parts), encoding="utf-8")
print(f"wrote {OUT}")
