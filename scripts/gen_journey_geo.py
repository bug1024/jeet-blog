#!/usr/bin/env python3
"""Bake the W-002 map geography: clipped coastline, rivers, lakes and terrain contours.

Usage: python3 scripts/gen_journey_geo.py <raw-dir> static/works/journey/geo.json
<raw-dir> holds Natural Earth 10m land, rivers_lake_centerlines and lakes GeoJSON, plus
tiles/<z>-<x>-<y>.png from AWS Terrain Tiles (terrarium). See TERRAIN for the tile ranges.
"""
import json, math, struct, sys, zlib, os
from collections import defaultdict

RAW, OUT = sys.argv[1], sys.argv[2]

# ---------- geometry helpers ----------
def dp(points, tol):
    """Douglas-Peucker on a list of (x, y)."""
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        ax, ay = points[a]; bx, by = points[b]
        dx, dy = bx - ax, by - ay
        norm = math.hypot(dx, dy) or 1e-12
        best, idx = -1, -1
        for i in range(a + 1, b):
            px, py = points[i]
            d = abs(dy * px - dx * py + bx * ay - by * ax) / norm if (dx or dy) else math.hypot(px - ax, py - ay)
            if d > best:
                best, idx = d, i
        if best > tol:
            keep[idx] = True
            stack += [(a, idx), (idx, b)]
    return [p for p, k in zip(points, keep) if k]

def clip_ring(ring, w, e, s, n):
    """Sutherland-Hodgman against an axis-aligned box; fine for filled polygons."""
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
    def xcross(x):
        return lambda p, q: (x, p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0]))
    def ycross(y):
        return lambda p, q: (p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1]), y)
    pts = ring
    for inside, cross in ((lambda p: p[0] >= w, xcross(w)), (lambda p: p[0] <= e, xcross(e)),
                          (lambda p: p[1] >= s, ycross(s)), (lambda p: p[1] <= n, ycross(n))):
        if not pts:
            break
        pts = clip(pts, inside, cross)
    return pts

def split_line(line, w, e, s, n):
    """Keep only the runs of a polyline that fall inside the box."""
    runs, cur = [], []
    for p in line:
        if w <= p[0] <= e and s <= p[1] <= n:
            cur.append(p)
        elif cur:
            runs.append(cur); cur = []
    if cur:
        runs.append(cur)
    return [r for r in runs if len(r) > 1]

def flat(points, digits):
    """Integer deltas in units of 10^-digits degrees: [x0, y0, dx1, dy1, ...]."""
    unit = 10 ** digits
    out, px, py = [], 0, 0
    for x, y in points:
        ix, iy = round(x * unit), round(y * unit)
        out += [ix - px, iy - py]
        px, py = ix, iy
    return out

def lines_of(geom):
    if geom['type'] == 'LineString':
        return [geom['coordinates']]
    if geom['type'] == 'MultiLineString':
        return geom['coordinates']
    return []

def rings_of(geom):
    if geom['type'] == 'Polygon':
        return [geom['coordinates'][0]]
    if geom['type'] == 'MultiPolygon':
        return [poly[0] for poly in geom['coordinates']]
    return []

# ---------- Natural Earth ----------
def load(name):
    return json.load(open(os.path.join(RAW, name + '.geojson')))['features']

LOD = {
    'national': {'box': (55, 170, -5, 60), 'tol': .06, 'digits': 2},
    'regional': {'box': (114.5, 123.5, 22.5, 31), 'tol': .01, 'digits': 3},
}

def bbox_hit(points, box):
    w, e, s, n = box
    return any(w <= p[0] <= e and s <= p[1] <= n for p in points)

land = {}
for name, lod in LOD.items():
    out = []
    for f in load('ne_10m_land'):
        for ring in rings_of(f['geometry']):
            if not bbox_hit(ring, lod['box']):
                continue
            ring = clip_ring([tuple(p) for p in ring], *lod['box'])
            ring = dp(ring, lod['tol'])
            if len(ring) >= 4:
                out.append(flat(ring, lod['digits']))
    land[name] = out

RIVER_NAMES = {'Yangtze': '长江', 'Huang': '黄河', 'Min': '闽江', 'Jiulong': '九龙江', 'Ou': '瓯江',
               'Fuchun': '富春江', 'Gan': '赣江', 'Huai': '淮河', 'Xi': '西江', 'Han': '汉江'}
rivers = {}
for name, lod in LOD.items():
    out = []
    limit = 5 if name == 'national' else 9
    for f in load('ne_10m_rivers_lake_centerlines'):
        p = f['properties']
        if p['scalerank'] > limit:
            continue
        for line in lines_of(f['geometry']):
            for run in split_line([tuple(q) for q in line], *lod['box']):
                run = dp(run, lod['tol'])
                if len(run) > 1:
                    out.append({'r': int(p['scalerank']), 'n': RIVER_NAMES.get(p['name'] or '', ''),
                                'p': flat(run, lod['digits'])})
    rivers[name] = out

lakes = {}
for name, lod in LOD.items():
    out = []
    for f in load('ne_10m_lakes'):
        if f['properties']['scalerank'] > (4 if name == 'national' else 8):
            continue
        for ring in rings_of(f['geometry']):
            if not bbox_hit(ring, lod['box']):
                continue
            ring = dp(clip_ring([tuple(q) for q in ring], *lod['box']), lod['tol'])
            if len(ring) >= 4:
                out.append(flat(ring, lod['digits']))
    lakes[name] = out

# ---------- terrain ----------
def read_png(path):
    data = open(path, 'rb').read()
    assert data[:8] == b'\x89PNG\r\n\x1a\n'
    pos, idat, width = 8, b'', 0
    while pos < len(data):
        length, kind = struct.unpack('>I4s', data[pos:pos + 8])
        body = data[pos + 8:pos + 8 + length]
        if kind == b'IHDR':
            width, height, depth, ctype = struct.unpack('>IIBB', body[:10])
            assert depth == 8 and ctype in (2, 6), (depth, ctype)
            bpp = 3 if ctype == 2 else 4
        elif kind == b'IDAT':
            idat += body
        pos += 12 + length
    raw = zlib.decompress(idat)
    stride = width * bpp
    rows, prev = [], bytearray(stride)
    i = 0
    for _ in range(height):
        ftype = raw[i]; line = bytearray(raw[i + 1:i + 1 + stride]); i += 1 + stride
        for x in range(stride):
            a = line[x - bpp] if x >= bpp else 0
            b = prev[x]
            c = prev[x - bpp] if x >= bpp else 0
            if ftype == 1:
                line[x] = (line[x] + a) & 255
            elif ftype == 2:
                line[x] = (line[x] + b) & 255
            elif ftype == 3:
                line[x] = (line[x] + (a + b) // 2) & 255
            elif ftype == 4:
                pa, pb, pc = abs(b - c), abs(a - c), abs(a + b - 2 * c)
                line[x] = (line[x] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(line); prev = line
    return width, height, bpp, rows

def tile_xy(lon, lat, z):
    r = math.radians(lat)
    return (lon + 180) / 360 * 2 ** z, (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * 2 ** z

def pixel_lonlat(px, py, z):
    n = 2 ** z
    lon = px / (256 * n) * 360 - 180
    lat = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * py / (256 * n)))))
    return lon, lat

TERRAIN = {
    'national': {'z': 5, 'box': (101.3, 134.9, 16, 48.5), 'levels': [500, 1500, 3000],
                 'tol': .06, 'digits': 2, 'span': .8, 'blur': 1},
    'regional': {'z': 6, 'box': (115, 123, 23, 30.5), 'levels': [400, 800, 1200, 1600],
                 'tol': .008, 'digits': 3, 'span': .2, 'blur': 2},
    'local': {'z': 11, 'box': (119.2, 119.56, 27.24, 27.54), 'levels': list(range(400, 1601, 100)),
              'tol': .0004, 'digits': 4, 'span': .012, 'blur': 3},
}

def mosaic(z, box):
    w, e, s, n = box
    x0, y0 = (int(v) for v in tile_xy(w, n, z))
    x1, y1 = (int(v) for v in tile_xy(e, s, z))
    cols, rowsN = (x1 - x0 + 1) * 256, (y1 - y0 + 1) * 256
    grid = [[0.0] * cols for _ in range(rowsN)]
    for tx in range(x0, x1 + 1):
        for ty in range(y0, y1 + 1):
            width, height, bpp, rows = read_png(os.path.join(RAW, 'tiles', f'{z}-{tx}-{ty}.png'))
            for yy in range(256):
                row = rows[yy]; gy = (ty - y0) * 256 + yy
                for xx in range(256):
                    r, g, b = row[xx * bpp], row[xx * bpp + 1], row[xx * bpp + 2]
                    grid[gy][(tx - x0) * 256 + xx] = max(0.0, r * 256 + g + b / 256 - 32768)
    return grid, x0 * 256, y0 * 256

def blur(grid, passes):
    """3x3 box blur; removes the pixel staircase so contours read as hand-drawn lines."""
    for _ in range(passes):
        H, W = len(grid), len(grid[0])
        out = [row[:] for row in grid]
        for y in range(1, H - 1):
            a, b, c = grid[y - 1], grid[y], grid[y + 1]
            o = out[y]
            for x in range(1, W - 1):
                o[x] = (a[x - 1] + a[x] + a[x + 1] + b[x - 1] + b[x] + b[x + 1] + c[x - 1] + c[x] + c[x + 1]) / 9
        grid = out
    return grid

def contours(grid, level):
    """Marching squares; returns polylines in grid coordinates."""
    H, W = len(grid), len(grid[0])
    segs = []
    def interp(p, q, vp, vq):
        t = (level - vp) / (vq - vp) if vq != vp else .5
        return (p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t)
    for y in range(H - 1):
        r0, r1 = grid[y], grid[y + 1]
        for x in range(W - 1):
            a, b, c, d = r0[x], r0[x + 1], r1[x + 1], r1[x]
            idx = (a >= level) << 3 | (b >= level) << 2 | (c >= level) << 1 | (d >= level)
            if idx in (0, 15):
                continue
            top = interp((x, y), (x + 1, y), a, b)
            right = interp((x + 1, y), (x + 1, y + 1), b, c)
            bottom = interp((x, y + 1), (x + 1, y + 1), d, c)
            left = interp((x, y), (x, y + 1), a, d)
            table = {1: [(left, bottom)], 2: [(bottom, right)], 3: [(left, right)], 4: [(top, right)],
                     5: [(left, top), (bottom, right)], 6: [(top, bottom)], 7: [(left, top)], 8: [(left, top)],
                     9: [(top, bottom)], 10: [(left, bottom), (top, right)], 11: [(top, right)],
                     12: [(left, right)], 13: [(bottom, right)], 14: [(left, bottom)]}
            segs += table[idx]
    # Link segments into polylines through shared endpoints.
    key = lambda p: (round(p[0], 5), round(p[1], 5))
    ends = defaultdict(list)
    for i, (p, q) in enumerate(segs):
        ends[key(p)].append(i); ends[key(q)].append(i)
    used, lines = [False] * len(segs), []
    for i in range(len(segs)):
        if used[i]:
            continue
        used[i] = True
        line = [segs[i][0], segs[i][1]]
        for forward in (True, False):
            while True:
                tip = line[-1] if forward else line[0]
                nxt = next((j for j in ends[key(tip)] if not used[j]), None)
                if nxt is None:
                    break
                used[nxt] = True
                p, q = segs[nxt]
                other = q if key(p) == key(tip) else p
                if forward:
                    line.append(other)
                else:
                    line.insert(0, other)
        lines.append(line)
    return lines

terrain = {}
for name, cfg in TERRAIN.items():
    grid, ox, oy = mosaic(cfg['z'], cfg['box'])
    grid = blur(grid, cfg['blur'])
    out = []
    for level in cfg['levels']:
        for line in contours(grid, level):
            pts = [pixel_lonlat(ox + x + .5, oy + y + .5, cfg['z']) for x, y in line]
            for run in split_line(pts, *cfg['box']):
                run = dp(run, cfg['tol'])
                extent = max(max(q[0] for q in run) - min(q[0] for q in run), max(q[1] for q in run) - min(q[1] for q in run))
                if len(run) >= 4 and extent >= cfg['span']:
                    out.append({'e': level, 'p': flat(run, cfg['digits'])})
    terrain[name] = out
    print(name, 'contour lines', len(out), len(json.dumps(out, separators=(',', ':'))) // 1024, 'KB', file=sys.stderr)

result = {
    'source': 'Natural Earth 10m; AWS Terrain Tiles (Mapzen terrarium)',
    'units': {'national': 100, 'regional': 1000, 'local': 10000},
    'land': land, 'lakes': lakes, 'rivers': rivers, 'terrain': terrain,
}
json.dump(result, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
for k in ('land', 'lakes', 'rivers', 'terrain'):
    print(k, len(json.dumps(result[k], ensure_ascii=False, separators=(',', ':'))) // 1024, 'KB', file=sys.stderr)
print('total', os.path.getsize(OUT) // 1024, 'KB', file=sys.stderr)
