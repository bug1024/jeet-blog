// The film's recurring things: window, road, map, house, the calico cat, mountains, sea, desk and pages, silhouettes.
import { lerp, clamp, range, rng, noise, mix, rgba, E, mixPt } from './core.js';
import { C } from './design.js';
import { piece, ink, halftone, rule, road, rectPts, circlePts, scissor, torn, path, transform, spline } from './paper.js';
import { label } from './type.js';

// ---------- Window ----------
// cx, cy: centre; w, h: outer size. o.sky: [top, bottom]; o.sun: {x, y, r, color} relative to the glass centre;
// o.lamp: 0..1 warm light inside; o.frame: 0..1 frame strips laid; o.mullion: 0..1 cross laid; o.sill: 0..1.
export function windowMotif(ctx, cx, cy, w, h, o = {}) {
    const { sky = [C.blueLight, C.paperLight], sun = null, lamp = 0, frame = 1, mullion = 1, sill = 1, seed = 1, border = 26 } = o;
    const gx = cx - w / 2 + border, gy = cy - h / 2 + border, gw = w - border * 2, gh = h - border * 2;
    const glass = rectPts(gx, gy, gw, gh);
    // Glass: printed sky.
    ctx.save();
    path(ctx, glass);
    const g = ctx.createLinearGradient(0, gy, 0, gy + gh);
    g.addColorStop(0, sky[0]);
    g.addColorStop(1, sky[1]);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.clip();
    if (sun) piece(ctx, circlePts(cx + sun.x, cy + sun.y, sun.r, 56), sun.color || C.orange, { shadow: false, tex: 0.6 });
    if (o.inside) o.inside(ctx, gx, gy, gw, gh);
    if (lamp > 0) {
        const lg = ctx.createRadialGradient(cx, cy + gh * 0.15, 0, cx, cy + gh * 0.15, Math.max(gw, gh) * 0.8);
        lg.addColorStop(0, rgba('#F2B45E', 0.95 * lamp));
        lg.addColorStop(0.6, rgba(C.orange, 0.75 * lamp));
        lg.addColorStop(1, rgba(C.brick, 0.6 * lamp));
        ctx.fillStyle = lg;
        ctx.fillRect(gx, gy, gw, gh);
    }
    halftone(ctx, glass, 0, 0.12);
    ctx.restore();
    // Frame strips laid one by one: top, right, bottom, left.
    const strips = [
        rectPts(cx - w / 2, cy - h / 2, w, border), rectPts(cx + w / 2 - border, cy - h / 2, border, h),
        rectPts(cx - w / 2, cy + h / 2 - border, w, border), rectPts(cx - w / 2, cy - h / 2, border, h),
    ];
    strips.forEach((pts, i) => {
        const k = clamp(frame * 4 - i);
        if (k <= 0) return;
        const drop = 1 + (1 - E.slide(k)) * 0.04;
        piece(ctx, transform(scissor(pts, seed + i), { s: drop, ox: cx, oy: cy }), C.paperLight, { lift: (1 - k) * 1.5, alpha: clamp(k * 3) });
    });
    // Mullion cross.
    const mw = border * 0.55;
    [rectPts(cx - mw / 2, gy, mw, gh), rectPts(gx, cy - mw / 2, gw, mw)].forEach((pts, i) => {
        const k = clamp(mullion * 2 - i);
        if (k <= 0) return;
        piece(ctx, transform(scissor(pts, seed + 10 + i), { s: 1 + (1 - E.slide(k)) * 0.05, ox: cx, oy: cy }), C.paperLight, { lift: (1 - k) * 1.5, alpha: clamp(k * 3) });
    });
    if (sill > 0) {
        const sw = (w + 60) * E.slide(sill);
        piece(ctx, scissor(rectPts(cx - sw / 2, cy + h / 2 - 4, sw, 18), seed + 20), C.brick);
    }
    return { glass: [gx, gy, gw, gh], sillY: cy + h / 2 - 4 };
}

// ---------- House ----------
// A plain modernist house: a block with an asymmetric (saltbox) roof. cx: centre, gy: ground line.
// o.lit: window light 0..1; o.windows: [[dx, dy, w, h]] relative to the wall's top-left.
export function house(ctx, cx, gy, w, h, o = {}) {
    const { lit = 0, roof = C.brick, wall = C.kraft, seed = 31, windows = null, sky = [C.blueLight, C.paperLight] } = o;
    const x = cx - w / 2, y = gy - h;
    piece(ctx, scissor(rectPts(x, y, w, h), seed), wall, { lift: o.lift || 0 });
    halftone(ctx, rectPts(x + w * 0.64, y, w * 0.36, h), 1, 0.16);
    // Roof: ridge set to the right, long slope to the left.
    const ridgeX = x + w * 0.66, roofH = w * 0.36, over = w * 0.06;
    const roofPts = [[x - over, y + 3], [ridgeX, y - roofH], [x + w + over, y + 3 - roofH * 0.25], [x + w + over, y + 3]];
    piece(ctx, scissor(roofPts, seed + 1), roof, { lift: o.lift || 0 });
    const shade = [[ridgeX, y - roofH], [x + w + over, y + 3 - roofH * 0.25], [x + w + over, y + 3], [ridgeX, y + 3]];
    ink(ctx, shade, mix(roof, C.ink, 0.3), 0.5);
    halftone(ctx, shade, 2, 0.16);
    const wins = windows || [[w * 0.12, h * 0.24, w * 0.3, h * 0.34]];
    wins.forEach(([dx, dy, ww, hh], i) => windowMotif(ctx, x + dx + ww / 2, y + dy + hh / 2, ww, hh, { sky, lamp: lit, seed: seed + 5 + i * 7, border: Math.max(5, ww * 0.1), sill: 0 }));
    piece(ctx, scissor(rectPts(x + w * 0.66, gy - h * 0.6, w * 0.14, h * 0.6), seed + 3), C.blueDeep);
    rule(ctx, [x - w * 0.3, gy + 1], [x + w * 1.3, gy + 1], 1, 2, C.ink, 0.7);
    return { roofTop: [ridgeX, y - roofH], eaveY: y + 4, door: [x + w * 0.73, gy] };
}

// ---------- The calico cat ----------
// x, y: ground point under the cat. walk: stride phase in radians. curl: 0 walking, 1 curled up asleep. Faces left.
export function cat(ctx, x, y, s = 1, walk = 0, curl = 0, flip = 1) {
    const c = E.settle(curl);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * flip, s);
    const body = { x: lerp(0, 2, c), y: lerp(-40, -27, c), rx: lerp(58, 47, c), ry: lerp(21, 27, c) };
    const head = { x: lerp(-64, -38, c), y: lerp(-60, -33, c), r: 17 };
    const white = C.paperLight, orange = '#C9813F', black = '#2E2A28';
    // Legs (behind the body), retracting as she curls.
    const legLen = lerp(26, 0, c);
    if (legLen > 1) {
        [[-40, 0], [-28, Math.PI], [30, Math.PI], [42, 0]].forEach(([lx, ph], i) => {
            const sw = Math.sin(walk + ph) * 7 * (1 - c);
            const near = i % 2 === 1;
            piece(ctx, rectPts(lx + sw - 4.5, body.y + 10, 9, legLen + (body.ry - 10) * (1 - c)), near ? white : mix(white, C.kraft, 0.35), { shadow: false, tex: 0.5 });
        });
    }
    // Tail: up and curving when walking; wrapped round the front when curled.
    const tail = c < 0.5
        ? spline([[48, -46], [78, -66], [92, -96], [80, -112]].map((p, i) => mixPt(p, [[44, -22], [50, 2], [0, 6], [-46, 0]][i], c * 2)), 10)
        : spline([[44, -22], [50, 2], [0, 6], [-46, 0]], 10);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = orange;
    ctx.lineWidth = 11;
    ctx.shadowColor = 'rgba(45,30,18,.22)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
    ctx.beginPath();
    tail.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = black;
    ctx.beginPath();
    tail.slice(-6).forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();
    ctx.restore();
    // Body and head, then the calico patches clipped inside them.
    const bodyPts = circlePts(body.x, body.y, body.rx, 48, body.ry);
    const headPts = circlePts(head.x, head.y, head.r, 36);
    const ears = [[[head.x - 15, head.y - 8], [head.x - 9, head.y - 30], [head.x - 1, head.y - 13]], [[head.x + 1, head.y - 14], [head.x + 10, head.y - 31], [head.x + 15, head.y - 7]]];
    piece(ctx, bodyPts, white, { tex: 0.7 });
    ears.forEach((e, i) => piece(ctx, e, i ? orange : black, { shadow: false, tex: 0.6 }));
    piece(ctx, headPts, white, { tex: 0.7 });
    ctx.save();
    ctx.beginPath();
    path(ctx, bodyPts); ctx.clip();
    piece(ctx, circlePts(body.x + 16, body.y - 12, 30, 32, 17), orange, { shadow: false, tex: 0.6 });
    piece(ctx, circlePts(body.x - 14, body.y - 8, 16, 28, 13), black, { shadow: false, tex: 0.5 });
    ctx.restore();
    ctx.save();
    path(ctx, headPts); ctx.clip();
    piece(ctx, circlePts(head.x - 8, head.y - 9, 11, 24), black, { shadow: false, tex: 0.5 });
    piece(ctx, circlePts(head.x + 10, head.y - 10, 9, 24), orange, { shadow: false, tex: 0.5 });
    ctx.restore();
    if (c > 0.6) {
        // Closed eye: a single small stroke.
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(head.x - 6, head.y + 1, 4, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    }
    ctx.restore();
}

// ---------- Season stamps ----------
// One season on a small square of paper, laid down like a stamp. i: 0 spring, 1 summer, 2 autumn, 3 winter. k: 0..1 arrival.
export function seasonStamp(ctx, i, x, y, k = 1, s = 1) {
    if (k <= 0) return;
    ctx.save();
    ctx.translate(x, y - (1 - k) * 40 * s);
    ctx.scale(s, s);
    ctx.globalAlpha *= clamp(k * 2);
    piece(ctx, scissor(rectPts(-80, -80, 160, 160), 200 + i), C.paperLight, { lift: (1 - k) * 2 });
    ctx.beginPath(); ctx.rect(-64, -64, 128, 128); ctx.clip();
    if (i === 0) piece(ctx, transform(circlePts(0, 0, 44, 32, 20), { rot: -0.6 }), C.greenLight, { tex: 0.6, shadow: false });
    else if (i === 1) piece(ctx, circlePts(0, 0, 38, 40), C.orange, { tex: 0.6, shadow: false });
    else if (i === 2) piece(ctx, transform(circlePts(0, 0, 44, 32, 20), { rot: 0.7 }), C.brick, { tex: 0.6, shadow: false });
    else {
        piece(ctx, rectPts(-56, -56, 112, 112), C.blueLight, { tex: 0.5, shadow: false });
        piece(ctx, scissor(transform(rectPts(-26, -26, 52, 52), { rot: 0.785 }), 9), C.paperLight, { tex: 0.6, shadow: false });
    }
    ctx.restore();
}

// ---------- Landscape ----------
// A torn-paper mountain with a shadowed facet, mid-century poster style. grow 0..1 rises from the base line.
export function mountain(ctx, x, base, w, h, color, grow = 1, seed = 1) {
    if (grow <= 0) return;
    const hh = h * E.slide(grow);
    const peak = [x - w * 0.06, base - hh];
    piece(ctx, torn([[x - w / 2, base], peak, [x + w / 2, base]], seed, 3, 8), color, { fringe: 2, seed });
    // Shadow side: a darker overprint from the peak down to the right, with halftone.
    const facet = [peak, [x + w / 2, base], [x + w * 0.08, base]];
    ink(ctx, facet, mix(color, C.ink, 0.28), 0.55);
    halftone(ctx, facet, 2, 0.18);
}
// Sea: stacked torn strips with thin wave lines. reveal 0..1 slides strips in.
export function sea(ctx, x, y, w, h, reveal = 1, seed = 1, T = 0) {
    const n = 4;
    for (let i = 0; i < n; i++) {
        const k = E.slide(clamp(reveal * n - i));
        if (k <= 0) continue;
        const sy = y + (h / n) * i, sw = w * k;
        piece(ctx, torn(rectPts(x, sy, sw, h / n + 6), seed + i, 2.5), mix(C.blueLight, C.blueDeep, i / (n - 1) * 0.8), { fringe: i === 0 ? 2 : 0, seed: seed + i, shadow: i === 0 });
        ctx.save();
        ctx.strokeStyle = rgba(C.paperLight, 0.55);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let xx = x + 20; xx < x + sw - 20; xx += 4) {
            const yy = sy + h / n * 0.5 + Math.sin(xx * 0.05 + T * 1.2 + i) * 3;
            xx === x + 20 ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy);
        }
        ctx.stroke();
        ctx.restore();
    }
}

// ---------- Desk and pages ----------
// A stack of paper with sheets turning over from right to left. flips: number of sheets turned so far (float).
export function pages(ctx, x, y, w, h, flips, colors, seed = 1) {
    const n = colors.length;
    // Pages already turned lie on the left, the rest on the right; one is mid-turn.
    for (let i = n - 1; i >= 0; i--) {
        const k = clamp(flips - i);
        if (k > 0 && k < 1) continue;
        const left = k >= 1;
        const off = (left ? -1 : 1) * (2 + (left ? n - i : i) * 1.2);
        piece(ctx, scissor(rectPts(left ? x - w : x, y + off, w, h), seed + i), colors[i], { tex: 0.7 });
        if (!left) lines(ctx, x + 30, y + off + 40, w - 60, 6, 0.25);
    }
    for (let i = 0; i < n; i++) {
        const k = clamp(flips - i);
        if (k <= 0 || k >= 1) continue;
        const e = E.page(k);
        const sx = Math.cos(e * Math.PI);
        const lift = Math.sin(e * Math.PI);
        const pts = [[x, y], [x + w * sx, y - lift * 18], [x + w * sx, y + h - lift * 6], [x, y + h]];
        piece(ctx, pts, sx > 0 ? colors[i] : mix(colors[i], C.paperDark, 0.25), { lift: lift * 1.5, tex: 0.7 });
    }
}
// Rows of text, as thin grey rules.
export function lines(ctx, x, y, w, rows, alpha = 0.3, p = 1, seed = 4) {
    const r = rng(seed);
    for (let i = 0; i < rows; i++) {
        const k = clamp(p * rows - i);
        if (k <= 0) break;
        const lw = w * (i === rows - 1 ? 0.55 : 0.82 + r() * 0.18) * k;
        rule(ctx, [x, y + i * 18], [x + lw, y + i * 18], 1, 3, C.inkSoft, alpha);
    }
}

// ---------- Map ----------
// A kraft map sheet with a fine grid and contour lines.
export function mapSheet(ctx, x, y, w, h, o = {}) {
    const { seed = 3, color = C.kraft, alpha = 1, grid = 1, torn: isTorn = false } = o;
    const pts = isTorn ? torn(rectPts(x, y, w, h), seed, 3) : scissor(rectPts(x, y, w, h), seed);
    piece(ctx, pts, color, { fringe: isTorn ? 2 : 0, seed, alpha, lift: o.lift || 0 });
    ctx.save();
    path(ctx, pts);
    ctx.clip();
    ctx.globalAlpha *= alpha * grid;
    ctx.strokeStyle = rgba(C.ink, 0.12);
    ctx.lineWidth = 1;
    const step = 60;
    for (let gx = x - (x % step); gx < x + w; gx += step) { ctx.beginPath(); ctx.moveTo(gx, y); ctx.lineTo(gx, y + h); ctx.stroke(); }
    for (let gy = y - (y % step); gy < y + h; gy += step) { ctx.beginPath(); ctx.moveTo(x, gy); ctx.lineTo(x + w, gy); ctx.stroke(); }
    // Contours.
    ctx.strokeStyle = rgba(C.kraftDark, 0.5);
    ctx.lineWidth = 1.2;
    const r = rng(seed);
    for (let k = 0; k < 5; k++) {
        const cx = x + w * (0.2 + r() * 0.6), cy = y + h * (0.2 + r() * 0.6);
        for (let ring = 1; ring < 5; ring++) {
            ctx.beginPath();
            for (let a = 0; a <= 64; a++) {
                const ang = (a / 64) * Math.PI * 2;
                const rr = ring * 22 * (0.8 + noise(ang * 1.3 + k * 10, seed + ring) * 0.5);
                const px = cx + Math.cos(ang) * rr * 1.4, py = cy + Math.sin(ang) * rr;
                a ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
            }
            ctx.stroke();
        }
    }
    ctx.restore();
}
// A place on the map: dot, ring, small icon and the year.
export function mapPoint(ctx, x, y, p, text, kind = 'dot', color = C.ink) {
    if (p <= 0) return;
    const k = E.slide(p);
    ctx.save();
    ctx.globalAlpha *= clamp(p * 3);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(x, y, 14 * k, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    if (kind === 'cat') { ctx.translate(x + 22, y - 30); cat(ctx, 0, 0, 0.32, 0, 1); }
    else if (kind === 'house') { piece(ctx, rectPts(x + 18, y - 34, 26, 20), C.kraft, { tex: 0.5 }); piece(ctx, [[x + 14, y - 33], [x + 31, y - 48], [x + 48, y - 33]], C.brick, { tex: 0.5 }); }
    else if (kind === 'feet') footprints(ctx, x + 22, y - 32, 0.5, 1);
    ctx.restore();
    if (text) label(ctx, text, x + 22, y + 34, clamp(p * 2 - 0.5));
}

// Small bare footprints, a pair.
export function footprints(ctx, x, y, s = 1, p = 1, color = C.inkSoft) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha *= p;
    [[-9, 6, -0.15], [9, -6, 0.15]].forEach(([fx, fy, a]) => {
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(a);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.ellipse(0, 4, 6, 10, 0, 0, Math.PI * 2); ctx.fill();
        for (let t = 0; t < 4; t++) { ctx.beginPath(); ctx.arc(-5 + t * 3.4, -9 - (t === 0 ? 1 : 0), 1.8, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
    });
    ctx.restore();
}

// ---------- Family silhouettes (outro only) ----------
// Minimal ink figures standing on a ground line. kind: 'tall', 'adult', 'child', 'cat'.
export function figure(ctx, x, gy, kind, p = 1, color = C.blueDeep) {
    if (p <= 0) return;
    const k = E.slide(p);
    ctx.save();
    ctx.globalAlpha *= clamp(p * 2);
    const rise = (1 - k) * 18;
    const dims = { tall: [30, 118, 15], adult: [27, 106, 14], child: [20, 62, 11] }[kind];
    if (kind === 'cat') { ctx.restore(); ctx.save(); ctx.globalAlpha *= clamp(p * 2); cat(ctx, x, gy, 0.36, 0, 1); ctx.restore(); return; }
    const [w, h, r] = dims;
    const top = gy - h + rise;
    piece(ctx, roundRect(x - w / 2, top + r * 2 + 4, w, h - r * 2 - 4, w * 0.45), color, { tex: 0.4 });
    piece(ctx, circlePts(x, top + r, r, 32), color, { tex: 0.4 });
    ctx.restore();
}
function roundRect(x, y, w, h, r) {
    const pts = [];
    const corner = (cx, cy, a0) => { for (let i = 0; i <= 6; i++) { const a = a0 + (i / 6) * (Math.PI / 2); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    corner(x + w - r, y + r, -Math.PI / 2);
    pts.push([x + w, y + h], [x, y + h]);
    corner(x + r, y + r, Math.PI);
    return pts;
}
