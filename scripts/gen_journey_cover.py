#!/usr/bin/env python3
"""Generate the W-002 cover from its journey data and the baked map geography.

The cover follows the work itself: ink on near-white paper, one vermilion route
that fades to ink with age, and the 1991—2026 stages along the bottom.
Usage: python3 scripts/gen_journey_cover.py
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / "data/works/journey.json").read_text(encoding="utf-8"))
GEO = json.loads((ROOT / "static/works/journey/geo.json").read_text(encoding="utf-8"))
OUT = ROOT / "static/works/journey/cover-route.svg"

W, H = 1448, 1086
PAPER = (250, 249, 246)
INK = (29, 28, 26)
MUTED = (119, 116, 110)
ROUTE = (163, 65, 50)
SANS = "PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
MONO = "SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
NATIONAL_BOX = (55, 170, -5, 60)

# The map sits above the time ruler; the route runs down its middle.
MAP_BOTTOM = 860
VIEW_LAT = (22.3, 42.6)
CENTER_LON = 117.6


def merc_y(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))


SCALE = (MAP_BOTTOM - 40) / (merc_y(VIEW_LAT[1]) - merc_y(VIEW_LAT[0]))
TOP_Y = merc_y(VIEW_LAT[1])


def project(lon, lat):
    return (W / 2 + (lon - CENTER_LON) * SCALE, 40 + (TOP_Y - merc_y(lat)) * SCALE)


def rgba(rgb, alpha=1):
    return f"rgba({','.join(str(round(v)) for v in rgb)},{alpha})"


def mix(a, b, t):
    return tuple(x + (y - x) * t for x, y in zip(a, b))


def decode(flat, unit):
    points, x, y = [], 0, 0
    for i in range(0, len(flat), 2):
        x += flat[i]
        y += flat[i + 1]
        points.append((x / unit, y / unit))
    return points


def unproject(x, y):
    lat = math.degrees(2 * math.atan(math.exp(math.radians(TOP_Y - (y - 40) / SCALE))) - math.pi / 2)
    return CENTER_LON + (x - W / 2) / SCALE, lat


# Geography outside the frame is clipped away before it is written out.
VIEW_W, VIEW_N = unproject(-40, -40)
VIEW_E, VIEW_S = unproject(W + 40, MAP_BOTTOM + 40)


def clip_ring(ring):
    """Sutherland-Hodgman against the frame; the cut edges are never stroked."""
    def clip(pts, inside, cross):
        out = []
        for i, cur in enumerate(pts):
            prev = pts[i - 1]
            if inside(cur):
                if not inside(prev):
                    out.append(cross(prev, cur))
                out.append(cur)
            elif inside(prev):
                out.append(cross(prev, cur))
        return out
    xc = lambda x: lambda p, q: (x, p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0]))
    yc = lambda y: lambda p, q: (p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1]), y)
    for inside, cross in ((lambda p: p[0] >= VIEW_W, xc(VIEW_W)), (lambda p: p[0] <= VIEW_E, xc(VIEW_E)),
                          (lambda p: p[1] >= VIEW_S, yc(VIEW_S)), (lambda p: p[1] <= VIEW_N, yc(VIEW_N))):
        if not ring:
            break
        ring = clip(ring, inside, cross)
    return ring


def inside_runs(line):
    runs, run = [], []
    for p in line:
        if VIEW_W <= p[0] <= VIEW_E and VIEW_S <= p[1] <= VIEW_N:
            run.append(p)
        elif run:
            runs.append(run)
            run = []
    if run:
        runs.append(run)
    return [r for r in runs if len(r) > 1]


def path(points, close=False):
    d = " ".join(("M" if i == 0 else "L") + "{:.1f} {:.1f}".format(*project(*p)) for i, p in enumerate(points))
    return d + (" Z" if close else "")


def coast(points):
    """Coastline without the straight edges left by clipping the data to its box."""
    edges = NATIONAL_BOX + (VIEW_W, VIEW_E, VIEW_S, VIEW_N)
    on_edge = lambda a, b: (abs(a[0] - b[0]) < 1e-9 and a[0] in edges) or (abs(a[1] - b[1]) < 1e-9 and a[1] in edges)
    runs, run = [], []
    for a, b in zip(points, points[1:] + points[:1]):
        if on_edge(a, b):
            if len(run) > 1:
                runs.append(run)
            run = []
            continue
        if not run:
            run.append(a)
        run.append(b)
    if len(run) > 1:
        runs.append(run)
    return " ".join(path(r) for r in runs)


def arc(start, end):
    p0, p1 = project(*start), project(*end)
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    distance = math.hypot(dx, dy) or 1
    bend = min(distance * 0.13, 55 * SCALE / 40)
    cx, cy = (p0[0] + p1[0]) / 2 - dy / distance * bend, (p0[1] + p1[1]) / 2 + dx / distance * bend
    return f"M{p0[0]:.1f} {p0[1]:.1f} Q{cx:.1f} {cy:.1f} {p1[0]:.1f} {p1[1]:.1f}"


unit = GEO["units"]["national"]
land = [r for r in (clip_ring(decode(f, unit)) for f in GEO["land"]["national"]) if len(r) > 2]
lakes = [r for r in (clip_ring(decode(f, unit)) for f in GEO["lakes"]["national"]) if len(r) > 2]
rivers = [run for r in GEO["rivers"]["national"] if r["r"] <= 4 for run in inside_runs(decode(r["p"], unit))]
contours = [(c["e"], run) for c in GEO["terrain"]["national"] for run in inside_runs(decode(c["p"], unit))]

chapters = DATA["chapters"]
birth, end = DATA["birthYear"], DATA["endYear"]
water = mix(PAPER, INK, 0.09)

parts = [
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
    f'<title>{DATA["title"]}：从宁德向北，再到南京的 {end - birth} 年</title>',
    f'<rect width="{W}" height="{H}" fill="{rgba(PAPER)}"/>',
    f'<clipPath id="map"><rect width="{W}" height="{MAP_BOTTOM}"/></clipPath>',
    '<g clip-path="url(#map)">',
    f'<rect width="{W}" height="{MAP_BOTTOM}" fill="{rgba(water)}"/>',
    f'<path d="{" ".join(path(r, True) for r in land)}" fill="{rgba(PAPER)}"/>',
    f'<path d="{" ".join(path(r, True) for r in lakes)}" fill="{rgba(water)}"/>',
    f'<path d="{" ".join(path(p) for e, p in contours)}" fill="none" stroke="{rgba(INK, .09)}" stroke-width="1.6" stroke-linejoin="round"/>',
    f'<path d="{" ".join(path(p) for p in rivers)}" fill="none" stroke="{rgba(INK, .22)}" stroke-width="2" stroke-linejoin="round"/>',
    f'<path d="{" ".join(coast(r) for r in land)}" fill="none" stroke="{rgba(INK, .62)}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>',
]

# The route as it stands in the present: older stretches have faded towards ink.
for i in range(1, len(chapters)):
    age = min(max((end - chapters[i]["startYear"]) / 20, 0), 1)
    color = mix(ROUTE, INK, age * 0.85)
    alpha = round(0.95 + (0.55 - 0.95) * age, 3)
    parts.append(f'<path d="{arc(chapters[i - 1]["coords"], chapters[i]["coords"])}" fill="none" '
                 f'stroke="{rgba(color, alpha)}" stroke-width="15" stroke-linecap="round"/>')

labels = {0: "宁德", 7: "北京", 8: "南京"}
for index, chapter in enumerate(chapters):
    if index not in (0, 4, 7, 8):
        continue
    x, y = project(*chapter["coords"])
    now = index == len(chapters) - 1
    parts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{20 if now else 12}" fill="{rgba(ROUTE if now else INK, .95 if now else .8)}"/>')
    if index in labels:
        parts.append(f'<text x="{x + 32:.1f}" y="{y + 16:.1f}" fill="{rgba(ROUTE if now else INK, .9)}" '
                     f'stroke="{rgba(PAPER, .9)}" stroke-width="8" paint-order="stroke" '
                     f'font-family="{SANS}" font-size="46">{labels[index]}</text>')
parts.append('</g>')

# Time ruler: one tick a year, the four stages as bands that darken towards the present.
left, right, base = 96, W - 96, 990
span = end - birth
x_of = lambda year: left + (right - left) * (year - birth) / span
for year in range(birth, end + 1):
    parts.append(f'<line x1="{x_of(year):.1f}" y1="{base - 12}" x2="{x_of(year):.1f}" y2="{base}" stroke="{rgba(MUTED, .55)}" stroke-width="2"/>')
shades = [.32, .5, .72]
for index, stage in enumerate(DATA["stages"]):
    x0, x1 = x_of(stage["from"]), x_of(stage["to"])
    last = index == len(DATA["stages"]) - 1
    fill = rgba(ROUTE) if last else rgba(INK, shades[min(index, len(shades) - 1)])
    parts.append(f'<rect x="{x0 + (4 if index else 0):.1f}" y="{base + 6}" width="{x1 - x0 - (4 if index else 0):.1f}" height="22" fill="{fill}"/>')
    parts.append(f'<line x1="{x0:.1f}" y1="{base - 46}" x2="{x0:.1f}" y2="{base}" stroke="{rgba(MUTED, .7)}" stroke-width="2"/>')
    parts.append(f'<text x="{x0 + 12:.1f}" y="{base - 22}" fill="{rgba(INK, .8)}" font-family="{SANS}" font-size="34">{stage["place"]}</text>')
parts.append(f'<text x="{left}" y="{base + 70}" fill="{rgba(MUTED)}" font-family="{MONO}" font-size="30">{birth}</text>')
parts.append(f'<text x="{right}" y="{base + 70}" fill="{rgba(MUTED)}" font-family="{MONO}" font-size="30" text-anchor="end">{end}</text>')
parts.append('</svg>')

OUT.write_text("".join(parts), encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")
