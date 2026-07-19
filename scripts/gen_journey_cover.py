#!/usr/bin/env python3
"""Generate the W-002 cover from its journey data."""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data/works/journey.json").read_text(encoding="utf-8"))
OUT = ROOT / "static/works/journey/cover.svg"

W, H = 1448, 1086
PAPER = "#f5f7f6"
INK = (17, 26, 33)
STEEL = (54, 91, 109)
SLATE = (113, 131, 140)
AMBER = (177, 133, 65)

LAND = [
    [(73.6, 39.5), (75.4, 36.8), (78.1, 35.4), (79.5, 32.2), (81.2, 30.2),
     (85.0, 28.3), (89.0, 27.2), (92.2, 28.0), (96.2, 28.2), (98.5, 25.8),
     (101.8, 23.1), (105.2, 21.3), (108.6, 21.5), (110.4, 20.1), (111.4, 21.2),
     (113.0, 22.0), (116.0, 22.9), (118.6, 24.4), (120.2, 27.2), (121.7, 30.2),
     (121.2, 32.4), (122.8, 35.0), (121.3, 37.5), (122.1, 39.0), (124.0, 40.1),
     (128.0, 42.2), (131.1, 44.8), (134.5, 48.3), (130.2, 48.8), (127.4, 50.2),
     (125.0, 53.0), (121.4, 49.2), (118.4, 46.8), (115.2, 45.5), (111.0, 44.6),
     (108.0, 42.6), (104.0, 41.8), (100.0, 42.7), (96.0, 42.6), (92.0, 45.4),
     (87.8, 49.0), (83.4, 47.2), (80.0, 45.0), (78.0, 42.0), (73.6, 39.5)],
    [(108.7, 19.2), (110.1, 18.1), (111.0, 19.3), (110.4, 20.0), (109.2, 20.1), (108.7, 19.2)],
    [(120.0, 25.4), (121.0, 22.0), (121.8, 23.8), (121.5, 25.3), (120.0, 25.4)],
]


def merc_y(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


def rgba(rgb, alpha):
    return f"rgba({rgb[0]},{rgb[1]},{rgb[2]},{alpha})"


def project(lon, lat):
    min_lon, max_lon = 72, 136
    min_y, max_y = merc_y(16), merc_y(55)
    scale = min((W - 130) / (max_lon - min_lon), (H - 110) / (max_y - min_y))
    ox = (W - (max_lon - min_lon) * scale) / 2
    oy = (H - (max_y - min_y) * scale) / 2
    return ((lon - min_lon) * scale + ox, H - ((merc_y(lat) - min_y) * scale + oy))


def arc(start, end):
    p0, p1 = project(*start), project(*end)
    mx, my = (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    distance = math.hypot(dx, dy) or 1
    bend = min(distance * 0.16, 90)
    cx, cy = mx - dy / distance * bend, my + dx / distance * bend
    return f"M {p0[0]:.1f} {p0[1]:.1f} Q {cx:.1f} {cy:.1f} {p1[0]:.1f} {p1[1]:.1f}"


chapters = DATA["chapters"]
parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
    f'<rect width="{W}" height="{H}" fill="{PAPER}"/>',
]

for lon in range(75, 136, 5):
    x = project(lon, 30)[0]
    parts.append(f'<line x1="{x:.1f}" y1="0" x2="{x:.1f}" y2="{H}" stroke="{rgba(STEEL, 0.055)}"/>')
for lat in range(20, 56, 5):
    y = project(110, lat)[1]
    parts.append(f'<line x1="0" y1="{y:.1f}" x2="{W}" y2="{y:.1f}" stroke="{rgba(STEEL, 0.055)}"/>')

for ring in LAND:
    d = " ".join(("M" if index == 0 else "L") + f" {project(*point)[0]:.1f} {project(*point)[1]:.1f}" for index, point in enumerate(ring))
    parts.append(f'<path d="{d} Z" fill="{rgba(STEEL, 0.025)}" stroke="{rgba(STEEL, 0.2)}" stroke-width="1.5"/>')

for chapter in chapters:
    for trip in chapter.get("trips", []):
        parts.append(f'<path d="{arc(chapter["coords"], trip["coords"])}" fill="none" stroke="{rgba(SLATE, 0.25)}" stroke-width="1.2"/>')
for index in range(1, len(chapters)):
    parts.append(f'<path d="{arc(chapters[index - 1]["coords"], chapters[index]["coords"])}" fill="none" stroke="{rgba(STEEL, 0.62)}" stroke-width="2"/>')

for chapter in chapters:
    for trip in chapter.get("trips", []):
        x, y = project(*trip["coords"])
        parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2" fill="{rgba(SLATE, 0.7)}"/>')

for index, chapter in enumerate(chapters):
    x, y = project(*chapter["coords"])
    color = AMBER if chapter.get("home") else INK
    parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{10 if chapter.get("home") else 7}" fill="{rgba(color, 0.12)}"/>')
    parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3" fill="{rgba(color, 0.9)}"/>')
    if index in (0, 4, 7, 8):
        parts.append(
            f'<text x="{x + 14:.1f}" y="{y + 5:.1f}" fill="{rgba(color, 0.78)}" '
            f'font-family="PingFang SC, Hiragino Sans GB, sans-serif" font-size="20">{chapter["place"]}</text>'
        )

parts.append('</svg>')
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text("\n".join(parts), encoding="utf-8")
print(f"wrote {OUT}")
