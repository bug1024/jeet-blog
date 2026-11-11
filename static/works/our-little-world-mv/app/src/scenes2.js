// Scenes, part two: the pre-choruses, verse 2 and the bridge, and the transitions that join the sections.
// Same rules as scenes.js: every move is timed from the LRC cue times (L) and the beat grid.
import { W, H, view, resetT, lerp, clamp, range, move, E, beat, snap, mix, rgba, rng, camera, mixPt, pulse, noise } from './core.js';
import { C, BEAT, FONT, TYPE } from './design.js';
import { piece, ink, halftone, rule, road, rectPts, circlePts, scissor, torn, path, transform, spline, paperBase } from './paper.js';
import { windowMotif, house, cat, mountain, sea, pages, lines, mapSheet, mapPoint, footprints, seasonStamp } from './motifs.js';
import { label, lineH } from './type.js';

const steps = (T) => Math.floor(T * 12) / 12;

// ---------- Polyline helpers ----------
const lenCache = new WeakMap();
function lengths(pts) {
    let L = lenCache.get(pts);
    if (!L) {
        L = [0];
        for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        lenCache.set(pts, L);
    }
    return L;
}
function pointAt(pts, d) {
    const L = lengths(pts);
    let i = 1;
    while (i < L.length - 1 && L[i] < d) i++;
    const t = clamp((d - L[i - 1]) / ((L[i] - L[i - 1]) || 1));
    return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)];
}
// The point at fraction f of the polyline's length.
export const along = (pts, f) => pointAt(pts, lengths(pts)[pts.length - 1] * clamp(f));
// Unit normal at fraction f.
function normalAt(pts, f) {
    const a = along(pts, f - 0.003), b = along(pts, f + 0.003);
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / d, (b[0] - a[0]) / d];
}
// The part of a polyline between fractions a and b, drawn as a paper strip.
function strip(ctx, pts, a, b, width, color, alpha = 1) {
    const L = lengths(pts), total = L[L.length - 1];
    const A = total * clamp(a), B = total * clamp(b);
    if (B - A < 2) return;
    const out = [pointAt(pts, A)];
    for (let i = 0; i < pts.length; i++) if (L[i] > A && L[i] < B) out.push(pts[i]);
    out.push(pointAt(pts, B));
    road(ctx, out, 1, width, color, { alpha, cap: 'round' });
}

// ---------- Transitions ----------
const offs = new Map();
export function offscreen(key) {
    let c = offs.get(key);
    const cw = Math.round(W * view.s);
    if (!c || c.width !== cw) { c = document.createElement('canvas'); c.width = cw; c.height = Math.round(H * view.s); offs.set(key, c); }
    const o = c.getContext('2d');
    resetT(o);
    return [c, o];
}
// The previous picture turns away like a page (spine on the left edge), uncovering the new one.
export function turnAway(ctx, src, p) {
    if (p >= 1) return;
    const e = E.page(p);
    const w = Math.max(1, W * Math.cos(e * Math.PI / 2));
    ctx.save();
    resetT(ctx);
    const sh = ctx.createLinearGradient(w, 0, w + 220, 0);
    sh.addColorStop(0, `rgba(40,30,20,${0.32 * (1 - e)})`);
    sh.addColorStop(1, 'rgba(40,30,20,0)');
    ctx.fillStyle = sh;
    ctx.fillRect(w, 0, 220, H);
    ctx.drawImage(src, 0, 0, src.width, src.height, 0, 0, w, H);
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, 'rgba(40,30,20,0)');
    g.addColorStop(1, `rgba(40,30,20,${0.3 * e})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, H);
    ctx.restore();
}
// Push through a point of the previous picture (a lit window) into the next one.
export function pushInto(ctx, src, p, fx, fy) {
    if (p >= 1) return;
    const z = Math.pow(8, E.page(p));
    ctx.save();
    resetT(ctx);
    ctx.globalAlpha = 1 - range(p, 0.45, 0.95);
    ctx.translate(fx, fy);
    ctx.scale(z, z);
    ctx.translate(-fx, -fy);
    ctx.drawImage(src, 0, 0, W, H);
    ctx.restore();
}
// The page wiped clean, for the start of a chorus.
export function fadeToPaper(ctx, a) {
    if (a <= 0) return;
    ctx.save();
    resetT(ctx);
    ctx.globalAlpha = clamp(a);
    paperBase(ctx);
    ctx.restore();
}

// A soft clearing of paper behind the lyric line, like the cleared space round a label on a map.
function lyricVeil(ctx, a) {
    if (a <= 0) return;
    ctx.save();
    resetT(ctx);
    ctx.translate(380, 922);
    ctx.scale(1, 0.26);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 680);
    g.addColorStop(0, rgba(C.paper, 0.9 * a));
    g.addColorStop(0.5, rgba(C.paper, 0.72 * a));
    g.addColorStop(1, rgba(C.paper, 0));
    ctx.fillStyle = g;
    ctx.fillRect(-700, -700, 1400, 1400);
    ctx.restore();
}

// ---------- Small shared pieces ----------
// A figure seen against the window light (as in verse 1).
function silhouette(ctx, x, base, s, color = C.blueDeep) {
    piece(ctx, circlePts(x, base - 120 * s, 30 * s, 24), color, { tex: 0.3, shadow: false });
    piece(ctx, [[x - 64 * s, base], [x - 44 * s, base - 74 * s], [x + 44 * s, base - 74 * s], [x + 64 * s, base]], color, { tex: 0.3, shadow: false });
}
// A pot plant on a sill; g 0..1 how far it has grown.
function plant(ctx, x, y, g) {
    const hgt = 8 + g * 34;
    rule(ctx, [x, y - 10], [x, y - 10 - hgt], 1, 2, C.green);
    const n = 1 + Math.round(g * 5);
    for (let k = 0; k < n; k++) {
        const side = k % 2 ? 1 : -1;
        piece(ctx, transform(circlePts(0, 0, 9, 16, 4), { x: x + side * 8, y: y - 14 - ((k + 0.5) / n) * hgt, rot: side * 0.5 }), k % 2 ? C.green : C.greenLight, { shadow: false, tex: 0.5 });
    }
    piece(ctx, [[x - 9, y - 13], [x + 9, y - 13], [x + 7, y + 1], [x - 7, y + 1]], C.brick, { tex: 0.5 });
}
// A grease-pencil ring, the editor's mark: drawn round once and a little past the start.
function pencilRing(ctx, x, y, rx, ry, p, seed, alpha = 1) {
    if (p <= 0 || alpha <= 0) return;
    const n = Math.max(2, Math.floor(64 * clamp(p)));
    const a0 = -0.8 + noise(seed, 3) * 0.6;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = C.brick;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let k = 0; k <= n; k++) {
        const a = a0 + (Math.PI * 2.25 * k) / 64;
        const rr = 1 + (noise(k * 0.18, seed) - 0.5) * 0.16 + (k / 64) * 0.1;
        const px = x + Math.cos(a) * rx * rr, py = y + Math.sin(a) * ry * rr;
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
}
// Expanding rings round "here" on a map, one per beat.
function hereRings(ctx, x, y, T, from, count, r0, r1, color = C.brick) {
    for (let j = 0; j < count; j++) {
        const p = range(T, from + j * BEAT, from + j * BEAT + BEAT * 1.8);
        if (p <= 0 || p >= 1) continue;
        ctx.save();
        ctx.strokeStyle = rgba(color, 0.55 * (1 - p));
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(x, y, lerp(r0, r1, E.slide(p)), lerp(r0, r1, E.slide(p)) * 0.62, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}

// =====================================================================
// Pre-chorus 1: the verse becomes the first photograph on a line of years.
// Nine years of the same window, each a little different; they gather into a contact sheet,
// the changes get ringed, and the photos are stacked into one thin edge: the seam the chorus opens from.
// =====================================================================
const YEARS = ['2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const SEASON_SKY = [[C.blueLight, '#DCE3CC'], [C.blue, C.paperLight], [mix(C.blue, C.brick, 0.45), C.brickLight], [C.blueDeep, C.blueLight]];
const SEASON_WALL = [C.greenLight, C.sand, C.brickLight, C.blueLight];
const PHOTO = { w: 456, h: 256, m: 13 };
const GRID_S = 0.76;
const R41 = rng(41);
const ROW_ROT = YEARS.map(() => (R41() - 0.5) * 0.06);
const PILE = YEARS.map(() => [(R41() - 0.5) * 26, (R41() - 0.5) * 18, (R41() - 0.5) * 0.09]);

// One year of the window, in a photo's own coordinates (w × h).
function yearScene(ctx, i, w, h) {
    const season = i % 4;
    ctx.fillStyle = mix(C.paper, SEASON_WALL[season], 0.2);
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2 - 8, ww = h * 0.62, wh = h * 0.66;
    const r = windowMotif(ctx, cx, cy, ww, wh, {
        sky: SEASON_SKY[season], border: 9, seed: 300 + i * 3, lamp: season === 3 ? 0.7 : 0,
        sun: season === 1 ? { x: ww * 0.18, y: -wh * 0.16, r: 14, color: C.orange } : null,
        inside: i >= 3 ? (c, gx, gy, gw, gh) => {
            // The two of us and, from 2021, a child who is a little taller every year.
            const base = gy + gh + 2;
            silhouette(c, gx + gw * 0.28, base, 0.5);
            silhouette(c, gx + gw * 0.72, base, 0.47);
            silhouette(c, gx + gw * 0.5, base, lerp(0.22, 0.4, (i - 3) / 5));
        } : null,
    });
    if (i >= 1) cat(ctx, cx + ww * 0.3, r.sillY, 0.26, 0, 1);
    if (i >= 2) plant(ctx, cx - ww * 0.32, r.sillY, (i - 1) / 7);
}
// A mounted photograph. sx squeezes it horizontally (turning edge-on).
function photo(ctx, x, y, s, rot, lift, content, sx = 1) {
    const { w, h, m } = PHOTO;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s * sx, s);
    piece(ctx, rectPts(-w / 2 - m, -h / 2 - m, w + 2 * m, h + 2 * m), C.paperLight, { lift, tex: 0.5 });
    ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
    ctx.translate(-w / 2, -h / 2);
    content(ctx, w, h);
    ctx.restore();
}
export function pre1(ctx, T, sec, L, snapshot) {
    const [l0, l1, l2, l3] = L;
    const end = sec.to;
    paperBase(ctx);
    const first = snap(l0 + 1.0);
    const arrive = (i) => first + (i - 1) * BEAT;
    // The line of years pans past; the newest photo always lands near the right of the frame.
    const u = (Math.min(T, l2) - (first - BEAT)) / BEAT;
    const x0 = u * 520 - 960, pan = (x0 + Math.sqrt(x0 * x0 + 300 * 300)) / 2;
    const rowY = 400, rowX = (i) => 560 + i * 520 - pan;
    const grid = (i) => [960 + ((i % 3) - 1) * 390, 247 + Math.floor(i / 3) * 230];
    const stackFrom = snap(l3 + 0.3);
    const flip = move(T, end - 0.8, end - 0.05, E.page);
    const sx = 1 - flip;

    // The timeline under the photos.
    const tl = move(T, l0 + 0.6, l0 + 1.5) * (1 - move(T, l2, l2 + 0.6));
    if (tl > 0) {
        const ty = rowY + PHOTO.h / 2 + 44;
        rule(ctx, [rowX(0) - 230, ty], [2100, ty], 1, 2, C.ink, tl * 0.85);
        YEARS.forEach((y, i) => {
            const k = i === 0 ? 1 : move(T, arrive(i) - 0.05, arrive(i) + 0.45);
            if (k <= 0) return;
            const x = rowX(i);
            rule(ctx, [x, ty - 9], [x, ty + 9], 1, 2, C.ink, tl * k);
            label(ctx, y, x, ty + 38, tl * k, 'center');
        });
    }

    // Each photo's place: row → contact sheet → pile.
    const cards = YEARS.map((_, i) => {
        const k = i === 0 ? 1 : move(T, arrive(i) - 0.05, arrive(i) + 0.45);
        let x = rowX(i), y = rowY - (1 - k) * 70, s = 1, rot = ROW_ROT[i], lift = (1 - k) * 2;
        if (i === 0) {
            // The verse frame itself shrinks into the first photograph.
            const m = move(T, l0, l0 + 1.3, E.page);
            x = lerp(960, rowX(0), m); y = lerp(540, rowY, m);
            s = lerp(1920 / PHOTO.w, 1, m); rot = lerp(0, ROW_ROT[0], m);
            lift = 1.5 * Math.sin(m * Math.PI);
        }
        const g = move(T, l2 + i * 0.06, l2 + 0.9 + i * 0.06, E.page);
        [x, y] = mixPt([x, y], grid(i), g);
        s = lerp(s, GRID_S, g); rot = lerp(rot, ROW_ROT[i] * 0.3, g);
        lift += Math.sin(g * Math.PI) * 1.5;
        const order = 8 - i;   // 2026 goes on the pile first, 2018 ends on top
        const pk = move(T, stackFrom + order * BEAT / 3, stackFrom + order * BEAT / 3 + 0.45);
        [x, y] = mixPt([x, y], [960 + PILE[i][0], 470 + PILE[i][1] - order * 1.5], pk);
        s = lerp(s, 1.02, pk); rot = lerp(rot, PILE[i][2], pk);
        lift += Math.sin(pk * Math.PI) * 2;
        return { i, k, x: 960 + (x - 960) * sx, y, s, rot, lift, z: pk > 0 ? 100 + order : i };
    }).filter((c) => c.k > 0).sort((a, b) => a.z - b.z);
    const snapImg = snapshot(l0 - 0.01);
    cards.forEach((c) => photo(ctx, c.x, c.y, c.s, c.rot, c.lift, c.i === 0
        ? (o, w, h) => o.drawImage(snapImg, 0, 0, w, h)
        : (o, w, h) => yearScene(o, c.i, w, h), sx));
    if (flip > 0.55) rule(ctx, [960, 470 - 145], [960, 470 + 145], 1, 2, C.ink, range(flip, 0.55, 1));

    // "很多话 还没说完": notes tucked against some photos, their lines never quite finished.
    const noteOut = 1 - move(T, l2, l2 + 0.5);
    [[2, -0.07], [4, 0.05], [6, -0.04], [7, 0.08]].forEach(([c, rot], j) => {
        const tn = Math.max(l1 + j * BEAT, arrive(c) + 0.3);
        const a = move(T, tn, tn + 0.4) * noteOut;
        if (a <= 0) return;
        ctx.save();
        ctx.translate(rowX(c) + 170, rowY - 140 + (1 - a) * 20);
        ctx.rotate(rot);
        ctx.globalAlpha *= clamp(a * 2);
        piece(ctx, scissor(rectPts(-92, -52, 184, 104), 400 + j), mix(C.kraft, C.paperLight, 0.35), { lift: 0.6 });
        lines(ctx, -68, -26, 136, 4, 0.45, move(T, tn + 0.15, tn + 1.6, E.linear) * 0.8, 410 + j);
        ctx.restore();
    });

    // "那些悄悄的改变": on the contact sheet, ring what changed: the cat, the child, the plant.
    const ringFrom = snap(l2 + 0.95);
    const ringOut = 1 - move(T, l3, l3 + 0.4);
    // Offsets from the photo centre, in photo heights.
    [[1, 0.171, 0.231, 0.17, 0.12], [3, 0, 0.17, 0.12, 0.16], [6, -0.199, 0.18, 0.11, 0.18]].forEach(([i, ox, oy, rx, ry], j) => {
        const [gx, gy] = grid(i), u = PHOTO.h * GRID_S;
        const t = ringFrom + j * BEAT / 2;
        pencilRing(ctx, gx + ox * u, gy + oy * u, rx * u, ry * u, move(T, t, t + 0.35, E.linear), 420 + j, ringOut);
    });
}

// =====================================================================
// Verse 2: quicker, like turning the pages of a family magazine. Two spreads of panels,
// one panel per line, the first spread turning over halfway.
// =====================================================================
const PA = { p1: [96, 96, 700, 744], p2: [820, 96, 1004, 360], p3: [820, 480, 1004, 360] };
const PB = { p5: [96, 96, 1004, 360], p6: [96, 480, 490, 360], p8: [610, 480, 490, 360], p7: [1124, 96, 700, 744] };

function panel(ctx, r, k, bg, seed, draw) {
    if (k <= 0) return;
    const [x, y, w, h] = r;
    const e = E.slide(k), dy = (1 - e) * 50;
    ctx.save();
    ctx.globalAlpha *= clamp(k * 2.5);
    piece(ctx, scissor(rectPts(x, y + dy, w, h), seed), C.paperLight, { lift: (1 - e) * 2 });
    ctx.beginPath(); ctx.rect(x + 14, y + dy + 14, w - 28, h - 28); ctx.clip();
    ctx.fillStyle = bg;
    ctx.fillRect(x + 14, y + dy + 14, w - 28, h - 28);
    ctx.translate(x + 14, y + dy + 14);
    draw(w - 28, h - 28);
    ctx.restore();
}
const arriveK = (T, t) => range(T, t - 0.35, t + 0.25);

// 后来又多了一个她 / 从怀里慢慢长大: the two shapes from the opening, and a small one between them that grows, ring by ring.
function panelBorn(ctx, w, h, T, L) {
    const lean = move(T, L[1], L[1] + 1.2, E.settle);
    const sy = 250, sqx = 200 + lean * 24, cix = 472 - lean * 24;
    const g = ctx.createLinearGradient(0, sy - 100, 0, sy + 100);
    g.addColorStop(0, C.blue); g.addColorStop(1, C.blueLight);
    piece(ctx, transform(scissor(rectPts(-100, -100, 200, 200), 511), { x: sqx, y: sy, rot: lean * 0.05 }), g, { lift: 0.5 });
    piece(ctx, circlePts(cix, sy, 100, 64), C.orange, { lift: 0.5 });
    const drop = move(T, L[0] + 0.05, L[0] + 0.75);
    if (drop <= 0) return;
    const growTo = L[2] - 0.1;
    const R = (t) => lerp(34, 96, move(t, L[1], growTo, E.settle));
    const cy = lerp(-80, 500, drop);
    piece(ctx, circlePts(336, cy, R(T), 64), mix(C.orange, C.paperLight, 0.5), { lift: (1 - drop) * 1.5 });
    // A ring left at every half beat of growing, like the rings of a tree.
    for (let j = 1; j <= 6; j++) {
        const tj = L[1] + (j * BEAT) / 2;
        const k = move(T, tj, tj + 0.3, E.linear);
        if (k <= 0) continue;
        ctx.save();
        ctx.strokeStyle = rgba(C.brick, 0.45);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(336, cy, R(tj) - 2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * k);
        ctx.stroke();
        ctx.restore();
    }
    rule(ctx, [60, 640], [w - 60, 640], drop, 1.5, C.ink, 0.6);
    label(ctx, '2021', 60, 680, drop);
}
// 你牵她去看山看海: a road from the coast to the mountains, a large and a small pair of footprints side by side.
function panelRoad(ctx, w, h, T, t0) {
    const sky = ctx.createLinearGradient(0, 0, 0, 200);
    sky.addColorStop(0, C.blueLight); sky.addColorStop(1, C.paperLight);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, 200);
    halftone(ctx, rectPts(0, 0, w, 200), 1, 0.1);
    sea(ctx, 0, 196, 400, 136, move(T, t0, t0 + 1.2), 521, T);
    piece(ctx, torn(rectPts(370, 196, w - 340, 150), 522, 3), C.sand, { fringe: 2, seed: 522, shadow: false });
    mountain(ctx, 560, 200, 170, 80, C.green, move(T, t0 + 0.5, t0 + 1.3), 525);
    mountain(ctx, 700, 200, 280, 160, C.blue, move(T, t0 + 0.1, t0 + 0.9), 523);
    mountain(ctx, 870, 200, 220, 110, mix(C.blue, C.green, 0.4), move(T, t0 + 0.3, t0 + 1.1), 524);
    const rp = spline([[390, 340], [470, 290], [600, 256], [720, 224], [790, 204]], 14);
    const p = move(T, t0 + 0.1, t0 + 1.5, E.settle);
    road(ctx, rp, p, 10, C.brick);
    for (let j = 0; j < 7; j++) {
        const f = (j + 0.5) / 7;
        if (p < f) break;
        const [x, y] = along(rp, f), [nx, ny] = normalAt(rp, f), sc = 1 - f * 0.55;
        footprints(ctx, x + nx * 16 * sc, y + ny * 16 * sc, 0.42 * sc, 1);
        footprints(ctx, x - nx * 13 * sc, y - ny * 13 * sc, 0.27 * sc, 1);
    }
}
// 把一路的风带回家: ribbons of wind blow in and disappear into the window, which lights up.
function panelWind(ctx, w, h, T, t0) {
    rule(ctx, [0, 291], [w, 291], 1, 1.5, C.ink, 0.4);
    const ribbons = [C.blueLight, C.cream, C.blue, C.kraft];
    ribbons.forEach((col, j) => {
        const pts = spline([[-30, 50 + j * 60], [200, 20 + j * 66], [440, 110 + j * 30], [640, 160 + j * 12], [786, 222]], 14);
        const q = move(T, t0 + j * 0.16, t0 + 1.3 + j * 0.16, E.linear) * 1.5;
        strip(ctx, pts, q - 0.5, q, 9, col);
    });
    house(ctx, 820, 290, 150, 115, { lit: move(T, t0 + 0.9, t0 + 1.5, E.settle), seed: 531, sky: [C.blueDeep, C.blue] });
}
// A small handprint in orange ink.
function handprint(ctx, x, y, rot, s, k) {
    if (k <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s * lerp(1.15, 1, k), s * lerp(1.15, 1, k));
    ink(ctx, (c) => {
        c.beginPath();
        c.ellipse(0, 0, 23, 27, 0, 0, Math.PI * 2);
        [[-17, -44, -0.16, 6.5, 21], [-5.5, -52, -0.05, 6.8, 25], [6.5, -51, 0.05, 6.8, 24], [18, -42, 0.18, 6.2, 19], [-29, -4, -1.0, 6.5, 18]].forEach(([fx, fy, a, rx, ry]) => {
            c.moveTo(fx + rx * Math.cos(a), fy + rx * Math.sin(a));
            c.ellipse(fx, fy, rx, ry, a, 0, Math.PI * 2);
        });
    }, C.orange, 0.85 * k, { halftone: 2, halftoneAlpha: 0.2 });
    ctx.restore();
}
// 一只猫 一双小手
function panelCatHands(ctx, w, h, T, t0) {
    rule(ctx, [0, 284], [w, 284], 1, 1.5, C.ink, 0.4);
    const walk = move(T, t0, t0 + 1.0, E.settle);
    cat(ctx, lerp(1060, 300, walk), 284, 1.0, steps(T) * 10, move(T, t0 + 1.0, t0 + 1.4, E.settle));
    handprint(ctx, 610, 160, -0.25, 1.25, move(T, t0 + 0.35, t0 + 0.5));
    handprint(ctx, 780, 186, 0.2, 1.15, move(T, t0 + 0.8, t0 + 0.95));
}
// 屋里多了好多问答: question marks set in type, each answered by a dot a moment later.
function panelQA(ctx, w, h, T, t0) {
    [[110, 150, 130, -0.1], [300, 118, 96, 0.12], [210, 268, 78, 0.05], [380, 255, 110, -0.08]].forEach(([x, y, size, rot], j) => {
        const tq = t0 + (j * BEAT) / 2;
        const k = move(T, tq, tq + 0.2);
        if (k <= 0) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.scale(lerp(1.2, 1, k), lerp(1.2, 1, k));
        ctx.globalAlpha *= k;
        ctx.font = `600 ${size}px ${FONT.family}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = j % 2 ? C.brick : C.ink;
        ctx.fillText('?', 0, 0);
        ctx.restore();
        const ka = move(T, tq + 0.22, tq + 0.42);
        if (ka > 0) piece(ctx, circlePts(x + size * 0.42, y + size * 0.3, size * 0.09 * E.slide(ka), 20), C.blueDeep, { shadow: false, tex: 0.4 });
    });
}
// 她一天一天长高 (and, in pre-chorus 2, 她又长高了一点): pencil marks on the door frame.
const MARK_YEARS = ['2021', '2022', '2023', '2024', '2025', '2026'];
export const markY = (j) => 610 - j * 62 - (j === 5 ? 18 : 0);
function panelMarks(ctx, w, h, T, times) {
    piece(ctx, scissor(rectPts(110, -20, 46, h + 40), 571), C.kraftDark, { tex: 0.7 });
    piece(ctx, scissor(rectPts(156, -20, 10, h + 40), 572), mix(C.kraftDark, C.ink, 0.25), { shadow: false });
    halftone(ctx, rectPts(166, 0, w - 166, h), 0, 0.06);
    let active = -1;
    MARK_YEARS.forEach((y, j) => {
        const k = move(T, times[j], times[j] + 0.35);
        if (k <= 0) return;
        if (T < times[j] + 0.9) active = j;
        const yy = markY(j), col = j === 5 ? C.brick : C.ink;
        rule(ctx, [166, yy], [166 + 170, yy], k, j === 5 ? 3.5 : 2.5, col, 0.9);
        lineH(ctx, y, 356, yy + 9, { ...TYPE.label, size: 26, color: col }, 1, clamp(k * 2 - 0.6));
    });
    if (active >= 0) {
        // The pencil that made the newest mark, drawn along it and lifting away.
        const t = times[active], k = move(T, t, t + 0.35), off = move(T, t + 0.4, t + 0.9);
        ctx.save();
        ctx.translate(166 + 170 * k + 8 + off * 60, markY(active) - 4 - off * 50);
        ctx.rotate(-0.45);
        ctx.globalAlpha *= 1 - off;
        piece(ctx, rectPts(0, -6, 110, 12), C.orange, { lift: 1, tex: 0.5 });
        piece(ctx, [[0, -6], [-16, 0], [0, 6]], C.kraft, { shadow: false });
        piece(ctx, [[-10, -2.4], [-16, 0], [-10, 2.4]], C.ink, { shadow: false });
        ctx.restore();
    }
}
// 你陪她走过春秋冬夏: the four season stamps, and two pairs of footprints walking past them.
function panelSeasons(ctx, w, h, T, t0) {
    [0, 1, 2, 3].forEach((i) => seasonStamp(ctx, i, 72 + i * 106, 120, move(T, t0 + i * 0.28, t0 + i * 0.28 + 0.35), 0.6));
    for (let j = 0; j < 6; j++) {
        const k = move(T, t0 + 0.1 + j * 0.24, t0 + 0.3 + j * 0.24);
        if (k <= 0) continue;
        ctx.save();
        ctx.translate(40 + j * 76, 248);
        ctx.rotate(Math.PI / 2);
        footprints(ctx, 0, 0, 0.5, k);
        footprints(ctx, 34, 12, 0.32, k);
        ctx.restore();
    }
}

function pageA(ctx, T, L) {
    paperBase(ctx);
    panel(ctx, PA.p1, arriveK(T, L[0]), mix(C.paper, C.blueLight, 0.18), 501, (w, h) => panelBorn(ctx, w, h, T, L));
    panel(ctx, PA.p2, arriveK(T, L[0] + BEAT / 2), C.paperLight, 502, (w, h) => panelRoad(ctx, w, h, T, L[2]));
    panel(ctx, PA.p3, arriveK(T, L[0] + BEAT), C.paper, 503, (w, h) => panelWind(ctx, w, h, T, L[3]));
    label(ctx, '20', 120, 1000, 0.7);
}
export function pageB(ctx, T, L, marks, others = 1) {
    paperBase(ctx);
    ctx.save();
    ctx.globalAlpha *= others;
    panel(ctx, PB.p5, arriveK(T, L[4]), mix(C.paper, C.kraft, 0.3), 505, (w, h) => panelCatHands(ctx, w, h, T, L[4]));
    panel(ctx, PB.p6, arriveK(T, L[4] + BEAT / 2), mix(C.kraft, C.paperLight, 0.2), 506, (w, h) => panelQA(ctx, w, h, T, L[5]));
    panel(ctx, PB.p8, arriveK(T, L[4] + BEAT * 1.5), C.paper, 508, (w, h) => panelSeasons(ctx, w, h, T, L[7]));
    label(ctx, '21', 1800, 1000, 0.7, 'right');
    ctx.restore();
    panel(ctx, PB.p7, arriveK(T, L[4] + BEAT), C.paperLight, 507, (w, h) => panelMarks(ctx, w, h, T, marks));
}
export function verse2(ctx, T, sec, L, { snapshot, marks }) {
    const tp = range(T, L[4] - 0.15, L[4] + 0.55);
    if (T < L[4] - 0.15) pageA(ctx, T, L);
    else {
        pageB(ctx, T, L, marks);
        if (tp < 1) {
            const [c, o] = offscreen('pageA');
            pageA(o, T, L);
            turnAway(ctx, c, tp);
        }
    }
    // In: the chorus's last picture turns over like a page.
    const tin = range(T, sec.from, sec.from + 0.75);
    if (tin < 1) turnAway(ctx, snapshot(sec.from - 0.01), tin);
}

// =====================================================================
// Pre-chorus 2: into the door frame for one more mark, then the map spreads to the edges of the world
// while home stays where it was.
// =====================================================================
const TILE = 360;
const TILES = (() => {
    const r = rng(611), out = [];
    for (let gx = -5; gx <= 5; gx++) for (let gy = -3; gy <= 3; gy++) {
        out.push({ gx, gy, d: Math.hypot(gx, gy * 1.25) + r() * 0.5, rot: (r() - 0.5) * 0.05, col: [C.kraft, mix(C.kraft, C.paperLight, 0.3), C.sand, mix(C.kraft, C.greenLight, 0.3)][Math.floor(r() * 4)], f: r(), seed: 620 + out.length });
    }
    return out.sort((a, b) => a.d - b.d);
})();
const RAYS = (() => {
    const r = rng(633);
    return [0.3, 1.5, 2.6, 3.7, 5.0].map((a) => {
        const pts = [[0, 0]];
        for (let k = 1; k <= 6; k++) { const ang = a + (r() - 0.5) * 0.5; pts.push([Math.cos(ang) * k * 380, Math.sin(ang) * k * 300]); }
        return spline(pts, 10);
    });
})();
function mapTile(ctx, x, y, t, k) {
    const e = E.slide(k);
    ctx.save();
    ctx.globalAlpha *= clamp(k * 2);
    ctx.translate(x, y);
    ctx.rotate(t.rot);
    ctx.scale(lerp(1.12, 1, e), lerp(1.12, 1, e));
    const pts = scissor(rectPts(-TILE / 2, -TILE / 2, TILE, TILE), t.seed);
    piece(ctx, pts, t.col, { lift: (1 - e) * 1.5, tex: 0.6 });
    ctx.save();
    path(ctx, pts); ctx.clip();
    ctx.strokeStyle = rgba(C.ink, 0.1);
    ctx.lineWidth = 1.2;
    for (let g = -TILE / 2 + 60; g < TILE / 2; g += 60) {
        ctx.beginPath(); ctx.moveTo(g, -TILE / 2); ctx.lineTo(g, TILE / 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-TILE / 2, g); ctx.lineTo(TILE / 2, g); ctx.stroke();
    }
    if (t.f < 0.3) { const k = 0.7 + t.f * 2; mountain(ctx, -30 + t.f * 100, 60, 160 * k, 110 * k, C.blue, 1, t.seed); mountain(ctx, 60, 60, 110, 70 * k, C.green, 1, t.seed + 1); }
    else if (t.f < 0.5) { piece(ctx, torn(circlePts(20, 10, 120, 24, 70), t.seed, 3), C.blueLight, { fringe: 2, seed: t.seed, shadow: false }); halftone(ctx, circlePts(20, 10, 120, 24, 70), 1, 0.15); }
    else if (t.f < 0.75) {
        ctx.strokeStyle = rgba(C.kraftDark, 0.6);
        for (let ring = 1; ring < 5; ring++) { ctx.beginPath(); ctx.ellipse(10, 0, ring * 30, ring * 20, t.f * 3, 0, Math.PI * 2); ctx.stroke(); }
    }
    ctx.restore();
    ctx.restore();
}
export function pre2(ctx, T, sec, L, { verseL, marks }) {
    paperBase(ctx);
    const P7 = PB.p7;
    const markWorld = [P7[0] + 14 + 251, P7[1] + 14 + markY(5)];
    const H0 = [markWorld[0], markWorld[1] + 60];
    const zin = move(T, L[0] - 0.3, L[0] + 1.3, E.settle);
    const tilt = move(T, L[1], L[1] + 1.0, E.settle) * 70;
    const out = move(T, L[2], L[2] + 2.8, E.settle);
    const inC = [lerp(960, P7[0] + 350, zin), lerp(540, 470, zin) - tilt];
    const cx = lerp(inC[0], H0[0], out), cy = lerp(inC[1], H0[1], out);
    const z = lerp(lerp(1, 1.42, zin), 0.5, out);
    ctx.save();
    camera(ctx, cx, cy, z);
    const pageAlpha = 1 - move(T, L[2] + 0.3, L[2] + 1.4);
    if (pageAlpha > 0) {
        ctx.save();
        ctx.globalAlpha *= pageAlpha;
        pageB(ctx, T, verseL, marks, 1 - zin);
        ctx.restore();
    }
    // The map is laid down tile by tile, outwards from the door frame, past the edges of the frame.
    TILES.forEach((t) => {
        const tl = L[2] + 0.2 + t.d * 0.3;
        const k = move(T, tl, tl + 0.5);
        if (k > 0) mapTile(ctx, H0[0] + t.gx * TILE, H0[1] + t.gy * TILE, t, k);
    });
    RAYS.forEach((pts, i) => road(ctx, pts.map(([x, y]) => [x + H0[0], y + H0[1]]), move(T, L[2] + 0.5 + i * 0.12, L[2] + 2.6 + i * 0.12, E.settle), 12, C.brick));
    // 家还留在原点: home is set down at the origin, and "here" rings out from it.
    const drop = move(T, L[3], L[3] + 0.6);
    if (drop > 0) {
        piece(ctx, circlePts(H0[0], H0[1] - 40, 230, 48, 170), C.paperLight, { alpha: clamp(drop * 2), tex: 0.5 });
        ctx.save();
        ctx.globalAlpha *= clamp(drop * 2);
        house(ctx, H0[0], H0[1] + 60 - (1 - drop) * 220, 240, 180, { lit: move(T, L[3] + 0.5, L[3] + 1.2, E.settle), seed: 641, lift: (1 - drop) * 2, sky: [C.blueDeep, C.blue] });
        ctx.restore();
        hereRings(ctx, H0[0], H0[1], T, snap(L[3] + 0.6), 3, 200, 520);
    }
    ctx.restore();
    lyricVeil(ctx, move(T, L[2] + 0.4, L[2] + 1.4));
    fadeToPaper(ctx, move(T, sec.to - 0.85, sec.to - 0.05, E.settle));
}

// =====================================================================
// Bridge: through the window into the far world; the far world is a picture in a window of the room;
// out along the road into the sky; postcards come back; on the map the road out turns out to be a loop,
// and riding it all the way round brings us home.
// =====================================================================
const FULL = [-40, -40, 2000, 1160], SMALL = [1010, 150, 660, 470];
const LAND_ROAD = spline([[100, 1320], [700, 1010], [1300, 900], [1900, 790], [2600, 705], [3250, 655], [3500, 640]], 16);
const SKY_ROAD = spline([[3500, 640], [3560, 300], [3500, -200], [3620, -800], [3600, -1500]], 16);
const CARDS = [
    { x0: 760, r0: -0.4, land: [1000, 752, -0.16], kind: 0 },
    { x0: 1300, r0: 0.5, land: [1150, 744, 0.06], kind: 1 },
    { x0: 980, r0: -0.2, land: [1300, 756, -0.04], kind: 2 },
    { x0: 1560, r0: 0.3, land: [1450, 746, 0.12], kind: 3 },
    { x0: 1200, r0: -0.5, land: [1600, 752, -0.08], kind: 4 },
];
function postcard(ctx, x, y, rot, s, kind, alpha = 1) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);
    ctx.globalAlpha *= alpha;
    piece(ctx, rectPts(-75, -50, 150, 100), C.paperLight, { lift: 0.8, tex: 0.5 });
    ctx.save();
    ctx.beginPath(); ctx.rect(-66, -41, 132, 82); ctx.clip();
    const bg = [C.blueLight, C.paperLight, C.sand, C.kraft, C.paperLight][kind];
    ctx.fillStyle = bg; ctx.fillRect(-66, -41, 132, 82);
    if (kind === 0) { mountain(ctx, -16, 41, 110, 62, C.blue, 1, 701); mountain(ctx, 34, 41, 80, 38, C.green, 1, 702); }
    else if (kind === 1) { ink(ctx, circlePts(30, -14, 14, 24), C.orange, 0.8); sea(ctx, -66, 4, 132, 38, 1, 703, 0); }
    else if (kind === 2) { piece(ctx, torn(rectPts(-70, 6, 140, 40), 704, 2), C.greenLight, { shadow: false }); ink(ctx, circlePts(-24, -10, 16, 24), C.orange, 0.85); }
    else if (kind === 3) road(ctx, spline([[-70, 40], [-20, 10], [20, 0], [70, -30]], 8), 1, 7, C.brick);
    else { const r = rng(705); ctx.fillStyle = C.inkSoft; for (let k = 0; k < 90; k++) { ctx.beginPath(); ctx.arc(-60 + r() * 120, -20 + r() * 56, 1.6 + r() * 1.6, 0, Math.PI * 2); ctx.fill(); } }
    ctx.restore();
    piece(ctx, rectPts(42, -42, 20, 24), C.brick, { shadow: false, tex: 0.6 });
    ctx.restore();
}
function landscape(ctx, T, L) {
    // Camera through A (walking along), B (out along the road and up into the sky), C (in the sky).
    const a = move(T, L[0], L[2] + 0.4, E.linear);
    const b = move(T, L[2], L[3] + 0.4, E.settle);
    const cx = lerp(lerp(500, 1800, a), 3500, b) + move(T, L[3], L[4], E.linear) * 80;
    const cy = lerp(660, -760, b);
    const z = lerp(1, 0.82, b);
    paperBase(ctx);
    ctx.save();
    camera(ctx, cx, cy, z);
    const sky = ctx.createLinearGradient(0, -2600, 0, 640);
    sky.addColorStop(0, C.blueDeep);
    sky.addColorStop(0.55, C.blueLight);
    sky.addColorStop(1, C.paperLight);
    ctx.fillStyle = sky;
    ctx.fillRect(-1500, -2800, 8000, 3440);
    halftone(ctx, rectPts(-1500, -2800, 8000, 2400), 1, 0.12);
    ink(ctx, circlePts(2650, 470, 250, 96), C.orange, 0.6);
    halftone(ctx, circlePts(2650, 470, 250, 96), 0, 0.15);
    sea(ctx, 1850, 640, 1100, 100, 1, 711, T);
    [[200, 360, 220, C.blue], [560, 300, 160, C.green], [900, 420, 260, mix(C.blue, C.green, 0.4)], [1350, 300, 170, C.blue], [3150, 380, 230, C.green], [3800, 420, 280, C.blue], [4300, 320, 190, mix(C.blue, C.green, 0.4)]]
        .forEach(([x, w, h, col], i) => mountain(ctx, x, 645, w, h, col, 1, 720 + i));
    // Fields: a patchwork of torn paper, rows getting deeper towards us.
    const fields = [C.kraft, C.greenLight, C.sand, mix(C.green, C.greenLight, 0.5), C.paperDark];
    const fr = rng(730);
    let fy = 640;
    for (let row = 0; row < 7; row++) {
        const rh = 50 + row * 45;
        for (let x = -1500; x < 6000;) {
            const w = 260 + fr() * 520 + row * 60;
            piece(ctx, torn(rectPts(x, fy, w + 24, rh + 30), 731 + row * 40 + Math.floor(x), 3), fields[Math.floor(fr() * fields.length)], { fringe: 1.5, seed: row * 40 + x, shadow: false });
            x += w;
        }
        fy += rh;
    }
    // A few paper clouds high up, where the road leaves the ground.
    [[3200, -500, 260], [3900, -900, 200], [3000, -1200, 170], [4100, -300, 230], [3550, -1500, 190]].forEach(([x, y, w], i) => {
        const pts = torn(circlePts(x, y, w, 40, w * 0.32), 760 + i, 4);
        piece(ctx, pts, C.cream, { fringe: 2, seed: 760 + i, lift: 0.5 });
        halftone(ctx, pts, 0, 0.1);
    });
    road(ctx, LAND_ROAD, 1, 22, C.brick);
    // One pair of feet walking ahead, out of the frame.
    const walked = move(T, L[0], L[2] + 1.0, E.linear) * 0.92;
    for (let j = 0; j < 22; j++) {
        const f = 0.04 + j * 0.042;
        if (f > walked) break;
        const [x, y] = along(LAND_ROAD, f), [nx, ny] = normalAt(LAND_ROAD, f);
        const sc = lerp(1.1, 0.45, f);
        footprints(ctx, x + nx * 26 * sc, y + ny * 26 * sc, 0.9 * sc, 1, C.ink);
    }
    // The road goes on past the horizon, as a dotted line up into the sky.
    const up = move(T, L[2] + 0.4, L[3] + 0.2, E.settle);
    if (up > 0) {
        ctx.save();
        ctx.setLineDash([26, 18]);
        road(ctx, SKY_ROAD, up, 8, C.brick, { shadow: false });
        ctx.restore();
    }
    // Wind: ribbons running along the road and up.
    if (T > L[2]) {
        [C.cream, C.blueLight, C.paperLight].forEach((col, j) => {
            const pts = spline([[1900 + j * 80, 760 - j * 30], [2700, 640 - j * 60], [3300 - j * 60, 300 - j * 40], [3420 + j * 80, -500], [3500 + j * 40, -1400]], 14);
            const q = range(T, L[2] + 0.2 + j * 0.3, L[2] + 3.4 + j * 0.3) * 1.6;
            strip(ctx, pts, q - 0.55, q, 10, col, 0.95);
        });
    }
    ctx.restore();
}
function room(ctx, T, R, L) {
    paperBase(ctx, mix(C.paper, C.kraft, 0.22));
    halftone(ctx, rectPts(0, 0, W, H), 0, 0.07);
    // On the wall, a small framed map; a mountain is being sketched on it: the far world kept in the head.
    piece(ctx, scissor(rectPts(220, 210, 320, 250), 641), C.kraftDark, { lift: 0.6 });
    mapSheet(ctx, 238, 228, 284, 214, { seed: 642, color: C.paperLight });
    const sk = move(T, L[1] + 0.5, L[1] + 2.4, E.linear);
    if (sk > 0) {
        const outline = [[270, 410], [330, 330], [365, 360], [420, 280], [490, 410]];
        ctx.save();
        ctx.strokeStyle = C.inkSoft; ctx.lineWidth = 2; ctx.lineJoin = 'round';
        ctx.beginPath();
        const n = Math.floor(sk * 40);
        for (let k = 0; k <= n; k++) {
            const t = (k / 40) * (outline.length - 1), i = Math.min(outline.length - 2, Math.floor(t));
            const p = mixPt(outline[i], outline[i + 1], t - i);
            k ? ctx.lineTo(p[0], p[1] + (noise(k * 0.7, 9) - 0.5) * 2) : ctx.moveTo(p[0], p[1]);
        }
        ctx.stroke();
        ctx.restore();
    }
    // The desk under the window, with a stack of pages.
    piece(ctx, scissor(rectPts(-20, 790, 1960, 22), 643), C.brick);
    piece(ctx, rectPts(-20, 812, 1960, 300), mix(C.kraft, C.kraftDark, 0.4), { shadow: false });
    pages(ctx, 640, 690, 170, 100, range(T, L[1] + 0.3, L[1] + 2.5) * 3, [C.paperLight, '#E7E3C9', '#EED9C0'], 644);
}
function windowFrame(ctx, R, alpha) {
    const [x, y, w, h] = R, b = 24;
    ctx.save();
    ctx.globalAlpha *= alpha;
    [rectPts(x - b, y - b, w + 2 * b, b), rectPts(x + w, y - b, b, h + 2 * b), rectPts(x - b, y + h, w + 2 * b, b), rectPts(x - b, y - b, b, h + 2 * b)]
        .forEach((pts, i) => piece(ctx, scissor(pts, 650 + i), C.paperLight, { lift: 0.5 }));
    piece(ctx, scissor(rectPts(x + w / 2 - 7, y, 14, h), 655), C.paperLight);
    piece(ctx, scissor(rectPts(x, y + h / 2 - 7, w, 14), 656), C.paperLight);
    piece(ctx, scissor(rectPts(x - 60, y + h + b - 4, w + 120, 18), 657), C.brick);
    ctx.restore();
}
const windowShrink = (T, L) => Math.max(
    move(T, L[1], L[1] + 2.0, E.settle) * (1 - move(T, L[2], L[2] + 1.2, E.page)),
    move(T, L[3] + 1.3, L[3] + 2.8, E.settle));
function skyAndRoom(ctx, T, L) {
    const sh = windowShrink(T, L);
    const R = FULL.map((v, i) => lerp(v, SMALL[i], sh));
    if (sh <= 0) { landscape(ctx, T, L); return; }
    room(ctx, T, R, L);
    // The landscape, seen through the window: same picture, scaled to fill the glass.
    const [c, o] = offscreen('land');
    landscape(o, T, L);
    const s = Math.max(R[2] / W, R[3] / H);
    ctx.save();
    ctx.beginPath(); ctx.rect(R[0], R[1], R[2], R[3]); ctx.clip();
    ctx.drawImage(c, R[0] + R[2] / 2 - (W * s) / 2, R[1] + R[3] / 2 - (H * s) / 2, W * s, H * s);
    ctx.restore();
    windowFrame(ctx, R, clamp((sh - 0.15) * 2.5));
}

// The map: a road that runs out to the far east and comes back round to the door.
const LOOP = spline([[0, 0], [500, -300], [1300, -700], [2300, -650], [2900, -100], [2600, 600], [1600, 800], [700, 500], [0, 0]], 20);
const PLACES = [0.16, 0.32, 0.5, 0.66, 0.82];
const FEATS = (() => {
    const r = rng(808), out = [];
    for (let i = 0; i < 120; i++) {
        const f = 0.05 + r() * 0.9, side = r() < 0.5 ? -1 : 1, off = 80 + r() * 420, kr = r();
        const [x, y] = along(LOOP, f), [nx, ny] = normalAt(LOOP, f);
        const it = { f, x: x + nx * off * side, y: y + ny * off * side, kind: kr < 0.55 ? 'mtn' : kr < 0.72 ? 'sea' : 'crowd', w: 90 + r() * 170, h: 60 + r() * 120, seed: 900 + i, col: [C.blue, C.green, mix(C.blue, C.green, 0.5), C.greenLight][Math.floor(r() * 4)] };
        if (it.kind === 'crowd') { it.dots = []; for (let k = 0; k < 70; k++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 110; it.dots.push([Math.cos(a) * d * 1.3, Math.sin(a) * d * 0.8, 2.2 + r() * 2.6]); } }
        out.push(it);
    }
    return out.sort((a, b) => a.y - b.y);
})();
function mapCamera(T, L) {
    const d = move(T, L[4], L[5] + 1.8, E.settle);
    let cx = lerp(0, 1400, d), cy = 0, z = lerp(1.1, 0.5, d);
    const ride = move(T, L[6], L[7] + 2.2, E.settle);
    if (ride > 0) {
        const p = along(LOOP, lerp(0.1, 1, ride)), blend = move(T, L[6], L[6] + 0.9, E.settle);
        cx = lerp(cx, p[0], blend); cy = lerp(cy, p[1] + 40, blend);
        z = lerp(z, lerp(0.95, 1.3, move(T, L[7], L[7] + 2.2, E.settle)), blend);
    }
    return { cx, cy, z };
}
const toScreen = (cam, [x, y]) => [(x - cam.cx) * cam.z + W / 2, (y - cam.cy) * cam.z + H / 2];
function mapLoop(ctx, T, L, sec) {
    const cam = mapCamera(T, L);
    paperBase(ctx, mix(C.paper, C.kraft, 0.3));
    ctx.save();
    camera(ctx, cam.cx, cam.cy, cam.z);
    const vx0 = cam.cx - W / 2 / cam.z - 400, vx1 = cam.cx + W / 2 / cam.z + 400, vy0 = cam.cy - H / 2 / cam.z - 400, vy1 = cam.cy + H / 2 / cam.z + 400;
    ctx.strokeStyle = rgba(C.ink, 0.08);
    ctx.lineWidth = 2;
    for (let gx = Math.floor(vx0 / 150) * 150; gx < vx1; gx += 150) { ctx.beginPath(); ctx.moveTo(gx, vy0); ctx.lineTo(gx, vy1); ctx.stroke(); }
    for (let gy = Math.floor(vy0 / 150) * 150; gy < vy1; gy += 150) { ctx.beginPath(); ctx.moveTo(vx0, gy); ctx.lineTo(vx1, gy); ctx.stroke(); }
    const rl = move(T, L[4] + 0.3, L[5] + 1.5, E.settle);
    // 看过多少山川人海: mountains, waters and crowds all along the way. They fade back once home is in sight.
    const fade = 1 - 0.8 * move(T, L[7] + 0.4, L[7] + 2.2);
    FEATS.forEach((it) => {
        if (it.x < vx0 || it.x > vx1 || it.y < vy0 || it.y > vy1) return;
        const k = clamp((rl - it.f) * 10) * fade;
        if (k <= 0) return;
        ctx.save();
        ctx.globalAlpha *= k;
        if (it.kind === 'mtn') mountain(ctx, it.x, it.y, it.w, it.h, it.col, clamp((rl - it.f) * 10), it.seed);
        else if (it.kind === 'sea') { const pts = torn(circlePts(it.x, it.y, it.w * 0.8, 24, it.h * 0.5), it.seed, 3); piece(ctx, pts, C.blueLight, { fringe: 2, seed: it.seed, shadow: false }); halftone(ctx, pts, 1, 0.16); }
        else { ctx.fillStyle = C.inkSoft; it.dots.forEach(([dx, dy, rr]) => { ctx.beginPath(); ctx.arc(it.x + dx, it.y + dy, rr, 0, Math.PI * 2); ctx.fill(); }); }
        ctx.restore();
    });
    road(ctx, LOOP, rl, 16, C.brick);
    PLACES.forEach((f, j) => {
        const t = L[4] + 0.5 + j * 0.55;
        mapPoint(ctx, ...along(LOOP, f), move(T, t + 0.75, t + 1.3) * (0.4 + 0.6 * fade), null);
    });
    // Home, at the start and the end of the loop.
    house(ctx, 0, 70, 220, 170, { lit: 0.45 + 0.55 * move(T, L[7], L[7] + 1.5, E.settle), seed: 661, sky: [C.blueDeep, C.blue] });
    hereRings(ctx, 0, 30, T, snap(L[7] + 0.8), 3, 160, 460);
    ctx.restore();
    lyricVeil(ctx, move(T, L[4] + 0.5, L[4] + 1.5));
    return cam;
}
export function bridge(ctx, T, sec, L, { snapshot }) {
    const toMap = range(T, L[4], L[4] + 0.9);
    let cam = null;
    if (T < L[4]) skyAndRoom(ctx, T, L);
    else {
        cam = mapLoop(ctx, T, L, sec);
        if (toMap < 1) {
            const [c, o] = offscreen('room');
            skyAndRoom(o, T, L);
            ctx.save();
            resetT(ctx);
            ctx.globalAlpha = 1 - E.settle(toMap);
            ctx.drawImage(c, 0, 0, W, H);
            ctx.restore();
        }
    }
    // 我等故事 从远方回来: postcards drift down and land on the desk; later each flies to its place on the map.
    ctx.save();
    resetT(ctx);
    CARDS.forEach((cd, j) => {
        const t = L[3] + (j * BEAT) / 2;
        const p = range(T, t, t + 1.6);
        if (p <= 0) return;
        const e = E.settle(p);
        let x = lerp(cd.x0, cd.land[0], e) + Math.sin(p * Math.PI * 2 + j) * 60 * (1 - p);
        let y = lerp(-160, cd.land[1], e);
        let rot = lerp(cd.r0, cd.land[2], p) + Math.sin(p * 7 + j) * 0.3 * (1 - p);
        let s = 1, a = 1;
        if (cam) {
            const tf = L[4] + 0.5 + j * 0.55, q = range(T, tf, tf + 0.9);
            const [tx, ty] = toScreen(cam, along(LOOP, PLACES[j]));
            const eq = E.page(q);
            x = lerp(x, tx, eq); y = lerp(y, ty, eq); rot = lerp(rot, 0, eq); s = lerp(1, 0.2, eq); a = 1 - range(q, 0.75, 1);
        }
        postcard(ctx, x, y, rot, s, cd.kind, a);
    });
    ctx.restore();
    fadeToPaper(ctx, move(T, sec.to - 0.9, sec.to - 0.05, E.settle));
    // In: push through the lit window of the chorus's house.
    const pin = range(T, sec.from, sec.from + 1.0);
    if (pin < 1) pushInto(ctx, snapshot(sec.from - 0.01), pin, 883, 563);
}
