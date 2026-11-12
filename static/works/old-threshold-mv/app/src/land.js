// The way home on Fridays, as one continuous piece of land: the school on the left ridge, down to the river,
// the covered bridge (after the real one: dark tile roof, weathered board walls, a row of small windows,
// a timber arch underneath on stone footings), up over the next ridge, and down to the village.
// World units: the father is 125 tall here.
import { clamp, lerp, mix, noise, camera, rgba, resetT } from './core.js';
import { C } from './design.js';
import { paint, shape, block, wash, line, shadow, ellipsePts, rectPts, smoothPath } from './gouache.js';

// Monotone cubic through points: smooth, never overshoots.
export function curve(pts) {
    const n = pts.length, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const d = [], m = [];
    for (let i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
    m[0] = d[0];
    for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    m[n - 1] = d[n - 2];
    for (let i = 0; i < n - 1; i++) {
        if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
        const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
        if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
    }
    return (x) => {
        if (x <= xs[0]) return ys[0];
        if (x >= xs[n - 1]) return ys[n - 1];
        let i = 0;
        while (x > xs[i + 1]) i++;
        const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
        return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
    };
}

export const BRIDGE = { x0: 1460, x1: 2480, deck: 808 };
const deckY = (x) => BRIDGE.deck - 9 * Math.sin(Math.PI * clamp((x - BRIDGE.x0) / (BRIDGE.x1 - BRIDGE.x0)));
const hills = curve([[-1400, 470], [0, 470], [300, 482], [750, 612], [1150, 752], [1460, 812], [2480, 812], [2850, 722], [3250, 560], [3560, 470], [3720, 466], [4100, 562], [4600, 672], [5000, 702], [6600, 708]]);
// Where feet go: the path, and the deck across the bridge.
export const ground = (x) => (x > BRIDGE.x0 && x < BRIDGE.x1 ? deckY(x) : hills(x));
// The land surface as drawn: the ravine falls away under the bridge.
const ravine = curve([[1300, 0], [1430, 40], [1560, 210], [1800, 330], [1960, 345], [2150, 320], [2380, 200], [2520, 40], [2640, 0]]);
const surface = (x) => hills(x) + (x > 1300 && x < 2640 ? ravine(x) : 0) + (noise(x * 0.015, 3) - 0.5) * 6;
export const SCHOOL = 0, HOME = 5000;

// Seasons: 0 summer, 1 autumn, 2 winter, 3 spring (4 = summer again). Colours of the land move through them.
let SEASON = 0;
const SEASONS = {
    base: ['#7A8869', '#9A8D60', '#A9A99F', '#869868'],
    turf: ['#A3AC84', '#C4AB70', '#DEDDD6', '#B3BF8A'],
    under: ['#64735A', '#7C6A46', '#8F8F88', '#687A57'],
    fir: ['#56684F', '#5D6449', '#606B62', '#577050'],
    mid: ['#909C86', '#A99B73', '#B8B9B1', '#97A584'],
    bush: ['#6F8460', '#9A7F48', '#A3A39A', '#7C9562'],
};
export function sc(key) {
    const s = ((SEASON % 4) + 4) % 4, i = Math.floor(s), t = s - i;
    const list = SEASONS[key];
    return mix(list[i], list[(i + 1) % 4], t);
}

// ---------- far layers (parallax) ----------
function layer(ctx, view, p, fn) {
    ctx.save();
    const z = 1 + (view.z - 1) * p * 0.9;
    camera(ctx, 2500 + (view.cx - 2500) * p, 560 + (view.cy - 560) * p, z);
    fn(ctx);
    ctx.restore();
}
function ridge(ctx, y0, amp, freq, seed, color, o = {}) {
    const pts = [[-4000, 2600]];
    for (let x = -4000; x <= 9000; x += 60) pts.push([x, y0 - noise(x * freq, seed) * amp - noise(x * freq * 3.1, seed + 1) * amp * 0.25]);
    pts.push([9000, 2600]);
    paint(ctx, block(pts, seed, 0, 1), color, { angle: 0.1, seed, mottle: 0.7, tex: 0.6, ...o });
}
function firs(ctx, xs0, xs1, yAt, seed, color, scale = 1, step = 46) {
    for (let x = xs0; x < xs1; x += step) {
        const r = noise(x * 0.37, seed);
        if (r < 0.3) continue;
        const h = (60 + r * 70) * scale, w = h * 0.36, y = yAt(x) + 6;
        const xx = x + (noise(x * 0.91, seed + 2) - 0.5) * step;
        paint(ctx, shape([[xx, y - h], [xx + w * 0.55, y - h * 0.45], [xx + w, y], [xx - w, y], [xx - w * 0.55, y - h * 0.45]], seed + x, 2 * scale, 2), mix(color, C.ink, r * 0.15), { angle: 1.57, tex: 0.7, edge: 0.1, seed: x });
    }
}

export function sky(ctx, warm = 0) {
    ctx.save();
    resetT(ctx);
    // Day: pale blue over rice white. Dusk: the blue goes grey-violet and the low sky warms to apricot.
    const d = clamp((warm - 0.25) / 0.5);
    wash(ctx, 0, 0, 1920, 1080, [[0, mix(mix('#AFC6CF', '#C7C3B4', warm * 0.5), '#8E8FA3', d * 0.7)], [0.5, mix(mix('#D7E0DD', '#EBD9B9', warm), '#E9C39A', d * 0.8)], [1, mix('#E6E2D3', '#F2CC96', Math.max(warm, d))]], { tex: 0.3, mottle: 0.5, seed: 2, scale: 1.8 });
    if (d > 0) {
        // The sun low behind the far ridges, a soft glow rather than a disc.
        ctx.globalCompositeOperation = 'screen';
        const g = ctx.createRadialGradient(1500, 560, 20, 1500, 560, 760);
        g.addColorStop(0, `rgba(255,214,150,${0.55 * d})`); g.addColorStop(1, 'rgba(255,214,150,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
    }
    ctx.restore();
}

export function cloudShapes(c, T) {
    [[300, 120, 260, 46], [1300, 70, 340, 52], [2600, 140, 300, 44], [3900, 90, 360, 50], [5200, 130, 280, 40]].forEach(([x, y, rx, ry], i) => {
        const xx = x + T * 4;
        paint(c, shape(ellipsePts(xx, y, rx, ry, 16), 70 + i, 10, 2), '#F3F0E8', { alpha: 0.75, tex: 0.5, edge: 0, seed: i });
        paint(c, shape(ellipsePts(xx + rx * 0.3, y - ry * 0.5, rx * 0.5, ry * 0.8, 12), 80 + i, 8, 2), '#F7F5EF', { alpha: 0.7, tex: 0.4, edge: 0, seed: i + 5 });
    });
}
function clouds(ctx, view, T) {
    layer(ctx, view, 0.12, (c) => {
        [[300, 120, 260, 46], [1300, 70, 340, 52], [2600, 140, 300, 44], [3900, 90, 360, 50], [5200, 130, 280, 40]].forEach(([x, y, rx, ry], i) => {
            const xx = x + T * 4;
            paint(c, shape(ellipsePts(xx, y, rx, ry, 16), 70 + i, 10, 2), '#F3F0E8', { alpha: 0.75, tex: 0.5, edge: 0, seed: i });
            paint(c, shape(ellipsePts(xx + rx * 0.3, y - ry * 0.5, rx * 0.5, ry * 0.8, 12), 80 + i, 8, 2), '#F7F5EF', { alpha: 0.7, tex: 0.4, edge: 0, seed: i + 5 });
        });
    });
}

// ---------- the near land ----------
function land(ctx, x0, x1) {
    // Greens of the slopes, the stream in the ravine, the stone path along the top.
    const pts = [];
    const a = Math.floor(x0 / 20) * 20, b = Math.ceil(x1 / 20) * 20;
    for (let x = a; x <= b; x += 20) pts.push([x, surface(x)]);
    paint(ctx, block([[a, 2400], ...pts, [b, 2400]], 1, 0, 1), sc('base'), { seed: 1, angle: 0.3, mottle: 0.9 });
    // Lighter turf right at the surface, then a darker band of undergrowth below.
    const band = (off, w, color, seed, alpha = 1) => {
        const top = pts.map(([x, y]) => [x, y + off]);
        const bot = pts.map(([x, y]) => [x, y + off + w + (noise(x * 0.02, seed) - 0.5) * w * 0.6]).reverse();
        paint(ctx, block([...top, ...bot], seed, 0, 1), color, { seed, angle: 0.2, alpha });
    };
    band(-2, 26, sc('turf'), 2);
    band(40, 70, sc('under'), 3, 0.6);
    // The stream far below the bridge, light on the water.
    if (x0 < 2300 && x1 > 1600) {
        paint(ctx, shape([[1700, 1150], [1880, 1138], [2060, 1136], [2230, 1148], [2200, 1180], [1730, 1182]], 4, 3, 2), '#9DB5B8', { tex: 0.5, angle: 0, seed: 4 });
        for (let k = 0; k < 5; k++) line(ctx, [[1760 + k * 80, 1150 + (k % 2) * 8], [1800 + k * 80, 1149 + (k % 2) * 8]], '#E4ECE8', 2, { alpha: 0.6, seed: 5 + k });
        [[1690, 1120, 40, 22], [2240, 1124, 46, 24], [1960, 1160, 26, 12]].forEach(([x, y, rx, ry], i) => paint(ctx, shape(ellipsePts(x, y, rx, ry, 10), 6 + i, 3, 2), '#8C8A7E', { seed: 6 + i }));
    }
    // Stone path: flat stones set along the walking line (not over the bridge).
    for (let x = Math.max(a, -200); x <= b; x += 17) {
        if (x > BRIDGE.x0 - 10 && x < BRIDGE.x1 + 10) continue;
        const y = ground(x) + 1.5, r = noise(x * 0.7, 9);
        paint(ctx, shape(ellipsePts(x, y, 7 + r * 3, 2.6, 8), x, 0.6, 1), mix('#BDB6A4', '#9E978A', r), { tex: 0.3, edge: 0.35, seed: x });
    }
}

// Bushes and ferns along the path; some in front of the walkers, kept low so feet stay visible.
function growth(ctx, x0, x1, front) {
    const a = Math.floor(x0 / 37) * 37;
    for (let x = a; x < x1; x += 37) {
        if (x > BRIDGE.x0 - 40 && x < BRIDGE.x1 + 40) continue;
        const r = noise(x * 0.53, front ? 21 : 22);
        if (r < (front ? 0.62 : 0.45)) continue;
        const y = surface(x) + (front ? 22 : -2);
        const h = front ? 14 + r * 14 : 18 + r * 26, w = h * 1.4;
        const col = mix(front ? mix(sc('bush'), C.ink, 0.25) : sc('bush'), sc('turf'), noise(x, 23) * 0.5);
        paint(ctx, shape(ellipsePts(x, y - h * 0.5, w, h * 0.6, 10), x + (front ? 1 : 0), 2.5, 2), col, { seed: x, angle: 0.5, tex: 0.8, edge: 0.15 });
    }
}

function school(ctx) {
    const x = -260, y = ground(-260);
    paint(ctx, block([[x - 160, y - 120], [x + 170, y - 120], [x + 170, y + 4], [x - 160, y + 4]], 31, 1, 4), '#E3DCCB', { seed: 31, angle: 1.57 });
    paint(ctx, block([[x - 185, y - 120], [x + 195, y - 120], [x + 160, y - 175], [x - 150, y - 175]], 32, 1, 4), C.tile, { seed: 32 });
    for (let k = 0; k < 4; k++) paint(ctx, block(rectPts(x - 130 + k * 80, y - 92, 40, 46), 33 + k, 0.6, 2), '#5C6A6E', { seed: 33 + k });
    paint(ctx, block(rectPts(x + 210, y - 230, 4, 232), 40, 0.3, 2), '#6D6A64', { seed: 40 });
    paint(ctx, block([[x + 214, y - 230], [x + 262, y - 222], [x + 258, y - 196], [x + 214, y - 200]], 41, 1, 2), '#B9493A', { seed: 41 });
}

export function smoke(ctx, T, x = 5110, y = ground(5080) - 190, alpha = 0.5) {
    for (let k = 0; k < 4; k++) {
        const t = (T * 0.08 + k / 4) % 1;
        paint(ctx, shape(ellipsePts(x + t * 60, y - t * 160, 20 + t * 40, 12 + t * 18, 10), 300 + k, 3, 2), '#ECE9E2', { alpha: alpha * (1 - t), tex: 0.3, edge: 0 });
    }
}
function village(ctx, T, withSmoke = true) {
    const houses = [[4880, 0.95], [5080, 1.1], [5300, 0.9]];
    // Smoke from one chimney, slow.
    for (let k = 0; k < (withSmoke ? 4 : 0); k++) {
        const t = (T * 0.08 + k / 4) % 1;
        paint(ctx, shape(ellipsePts(5110 + t * 60, ground(5080) - 190 - t * 160, 20 + t * 40, 12 + t * 18, 10), 300 + k, 3, 2), '#ECE9E2', { alpha: 0.5 * (1 - t), tex: 0.3, edge: 0 });
    }
    houses.forEach(([x, s], i) => {
        const y = ground(x) + 6, w = 170 * s, h = 100 * s;
        paint(ctx, block([[x - w / 2, y - h], [x + w / 2, y - h], [x + w / 2, y], [x - w / 2, y]], 50 + i, 1, 4), mix('#C9AE80', '#D8C9A9', i * 0.4), { seed: 50 + i, angle: 1.57 });
        paint(ctx, block([[x - w / 2 - 22, y - h], [x + w / 2 + 22, y - h], [x + w / 2 - 6, y - h - 58 * s], [x - w / 2 + 6, y - h - 58 * s]], 60 + i, 1, 4), C.tile, { seed: 60 + i });
        paint(ctx, block(rectPts(x - 18 * s, y - 62 * s, 36 * s, 62 * s), 70 + i, 0.6, 2), '#4A3F35', { seed: 70 + i });
        paint(ctx, block(rectPts(x + 34 * s, y - 70 * s, 26 * s, 24 * s), 80 + i, 0.6, 2), '#58534C', { seed: 80 + i });
    });
    paint(ctx, shape(ellipsePts(4720, ground(4720) - 110, 70, 90, 14), 90, 8, 2), '#6E8260', { seed: 90 });
    paint(ctx, block(rectPts(4714, ground(4720) - 40, 12, 46), 91, 0.5, 2), C.woodDark, { seed: 91 });
}

// ---------- the covered bridge ----------
const B = BRIDGE;
const EAVE = 150, RIDGE = 206, SKIRT = 30;
const WIN = { top: 118, bot: 72, w: 40, step: 64 };

function bridgeUnder(ctx) {
    const L = B.x0 + 10, R = B.x1 - 10, by = B.deck + SKIRT;
    // Timber arch, mostly in the shadow of the deck; boarded slopes cover its ends.
    const beams = [
        [[L + 30, by + 150], [L + 260, by + 10]], [[R - 30, by + 150], [R - 260, by + 10]],
        [[L + 260, by + 10], [R - 260, by + 10]],
        [[L + 60, by + 120], [L + 380, by + 30]], [[R - 60, by + 120], [R - 380, by + 30]], [[L + 380, by + 30], [R - 380, by + 30]],
    ];
    beams.forEach(([a, b], i) => {
        const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy), n = [-dy / l * 6.5, dx / l * 6.5];
        paint(ctx, block([[a[0] + n[0], a[1] + n[1]], [b[0] + n[0], b[1] + n[1]], [b[0] - n[0], b[1] - n[1]], [a[0] - n[0], a[1] - n[1]]], 120 + i, 0.5, 3), mix('#3E342C', '#2E2823', i % 2 * 0.5), { seed: 120 + i, angle: Math.atan2(dy, dx) });
    });
    for (const d of [1, -1]) {
        const e = d > 0 ? L : R;
        paint(ctx, block([[e, by - 4], [e + d * 130, by - 4], [e + d * 20, by + 70], [e, by + 70]], 128 + d, 0.8, 4), '#6A5C4F', { seed: 128 + d, angle: 1.57 });
    }
    shadow(ctx, (L + R) / 2, by + 6, (R - L) * 0.5, 14, 0.3);
}

function footings(ctx) {
    // Stone footings on both banks, and the timber arch: two systems of straight beams woven into one curve.
    for (const [x, d] of [[B.x0 - 30, 1], [B.x1 + 30, -1]]) {
        const pts = [[x - 70 * d, B.deck + SKIRT - 4], [x + 34 * d, B.deck + SKIRT - 4], [x + 44 * d, B.deck + 96], [x - 86 * d, B.deck + 112]];
        paint(ctx, block(pts, 100 + d, 1.4, 4), '#8F8B7F', { seed: 100 + d });
        for (let k = 1; k < 3; k++) line(ctx, [[x - 76 * d, B.deck + SKIRT + k * 26], [x + 38 * d, B.deck + SKIRT + k * 26]], '#6E6B62', 1.6, { alpha: 0.5, seed: 110 + k + d * 10 });
    }
}

export function bridgeInside(ctx) {
    paint(ctx, block([[B.x0, deckY(B.x0) - EAVE], [B.x1, deckY(B.x1) - EAVE], [B.x1, deckY(B.x1) + 4], [B.x0, deckY(B.x0) + 4]], 130, 0.6, 6), '#3B3129', { seed: 130, angle: 1.57 });
    // Light falls through the far windows onto the deck.
    for (let x = B.x0 + 40; x < B.x1 - 30; x += WIN.step) {
        paint(ctx, block(rectPts(x + 6, deckY(x) - WIN.top + 4, WIN.w - 12, WIN.top - WIN.bot - 8), 131 + x, 0.4, 2), '#6E655A', { alpha: 0.6, tex: 0.2, edge: 0 });
    }
}

export function bridgeWall(ctx) {
    const path = new Path2D();
    const top = (x) => deckY(x) - EAVE;
    // Weathered boards with a row of small windows (evenodd holes).
    const outline = [];
    for (let k = 0; k <= 16; k++) { const x = lerp(B.x0, B.x1, k / 16); outline.push([x, top(x)]); }
    for (let k = 16; k >= 0; k--) { const x = lerp(B.x0, B.x1, k / 16); outline.push([x, deckY(x) + SKIRT]); }
    path.moveTo(outline[0][0], outline[0][1]);
    outline.forEach(([x, y]) => path.lineTo(x, y));
    path.closePath();
    for (let x = B.x0 + 40; x < B.x1 - 30; x += WIN.step) {
        const y0 = deckY(x) - WIN.top, y1 = deckY(x) - WIN.bot;
        path.moveTo(x, y0); path.lineTo(x, y1); path.lineTo(x + WIN.w, y1); path.lineTo(x + WIN.w, y0); path.closePath();
    }
    ctx.save();
    ctx.fillStyle = '#7D6E5E';
    ctx.fill(path, 'evenodd');
    ctx.clip(path, 'evenodd');
    paint(ctx, block([[B.x0 - 10, top(B.x0) - 10], [B.x1 + 10, top(B.x1) - 10], [B.x1 + 10, B.deck + SKIRT + 10], [B.x0 - 10, B.deck + SKIRT + 10]], 140, 0, 1), '#7D6E5E', { seed: 140, angle: 1.57, mottle: 0.9, edge: 0 });
    // Vertical board joints, weathering darker toward the bottom.
    for (let x = B.x0 + 8; x < B.x1; x += 13) line(ctx, [[x, top(x) + 2], [x + (noise(x, 5) - 0.5) * 2, deckY(x) + SKIRT]], '#5E5246', 1.1, { alpha: 0.35 + noise(x * 0.3, 6) * 0.3, seed: x, amp: 0.5 });
    const g = ctx.createLinearGradient(0, B.deck - 80, 0, B.deck + SKIRT);
    g.addColorStop(0, 'rgba(50,40,30,0)'); g.addColorStop(1, 'rgba(50,40,30,0.35)');
    ctx.fillStyle = g;
    ctx.fillRect(B.x0, B.deck - 80, B.x1 - B.x0, 120);
    ctx.restore();
    // Window frames and a rail under them.
    for (let x = B.x0 + 40; x < B.x1 - 30; x += WIN.step) {
        const y0 = deckY(x) - WIN.top, y1 = deckY(x) - WIN.bot;
        ctx.save(); ctx.strokeStyle = '#4A3E33'; ctx.lineWidth = 3; ctx.strokeRect(x - 1.5, y0 - 1.5, WIN.w + 3, y1 - y0 + 3); ctx.restore();
    }
    line(ctx, Array.from({ length: 17 }, (_, k) => { const x = lerp(B.x0, B.x1, k / 16); return [x, deckY(x) - WIN.bot + 10]; }), '#4E4237', 4, { amp: 0.6, seed: 150 });
    line(ctx, Array.from({ length: 17 }, (_, k) => { const x = lerp(B.x0, B.x1, k / 16); return [x, deckY(x) + 2]; }), '#4E4237', 4, { amp: 0.6, seed: 151 });
}

export function bridgeRoof(ctx) {
    // Dark tiles, the long ridge, eaves lifting a little at both ends.
    const lift = (x, k) => Math.pow(clamp(Math.abs((x - (B.x0 + B.x1) / 2) / ((B.x1 - B.x0) / 2 + 50))), 6) * k;
    const pts = [];
    for (let k = 0; k <= 24; k++) { const x = lerp(B.x0 - 50, B.x1 + 50, k / 24); pts.push([x, deckY(clamp(x, B.x0, B.x1)) - EAVE + 10 - lift(x, 18)]); }
    const ridgePts = pts.map(([x]) => [x + (x < (B.x0 + B.x1) / 2 ? 30 : -30), deckY(clamp(x, B.x0, B.x1)) - RIDGE - lift(x, 10)]).reverse();
    paint(ctx, block([...pts, ...ridgePts], 160, 0.6, 1), '#4A4F51', { seed: 160, mottle: 0.8 });
    for (let r = 1; r < 4; r++) line(ctx, pts.map(([x, y], i) => [x + (x < (B.x0 + B.x1) / 2 ? 8 * r : -8 * r), lerp(y, ridgePts[ridgePts.length - 1 - i][1], r / 4)]), '#3A3E40', 1.6, { alpha: 0.6, seed: 161 + r, amp: 0.6 });
    line(ctx, ridgePts, '#2F3335', 7, { amp: 0.6, seed: 165 });
    line(ctx, pts, '#33373A', 5, { amp: 0.5, seed: 166 });
    for (let x = B.x0 - 40; x < B.x1 + 50; x += 15) {
        const y = deckY(clamp(x, B.x0, B.x1)) - EAVE + 12 - lift(x, 18);
        paint(ctx, shape(ellipsePts(x, y, 6.5, 4, 6), 170 + x, 0.3, 1), '#3A3F41', { tex: 0.2, edge: 0.3 });
    }
}

// ---------- assembly ----------
// view: { cx, cy, z }, warm 0..1. people(ctx) draws the walkers between the bridge interior and its near wall.
export function drawLand(ctx, T, view, people, warm = 0, season = 0) {
    SEASON = season;
    sky(ctx, warm);
    clouds(ctx, view, T);
    layer(ctx, view, 0.18, (c) => ridge(c, 330, 170, 0.0016, 11, mix('#A9BAC0', '#C7B9A2', warm * 0.4)));
    layer(ctx, view, 0.32, (c) => ridge(c, 420, 150, 0.0024, 12, mix('#93A6A6', '#B3A88F', warm * 0.3)));
    layer(ctx, view, 0.55, (c) => {
        ridge(c, 520, 130, 0.003, 13, sc('mid'));
        firs(c, -2500, 8000, (x) => 520 - noise(x * 0.003, 13) * 130 - noise(x * 0.0093, 14) * 32, 14, mix(sc('fir'), sc('mid'), 0.4), 0.55, 40);
    });
    ctx.save();
    camera(ctx, view.cx, view.cy, view.z);
    const x0 = view.cx - 960 / view.z - 200, x1 = view.cx + 960 / view.z + 200;
    // Firs on the slopes behind the path.
    firs(ctx, Math.max(-1600, x0), x1, (x) => hills(x) - 40 - (x > 1300 && x < 2640 ? -ravine(x) * 0.2 : 0), 15, sc('fir'), 0.9, 54);
    school(ctx);
    village(ctx, T);
    bridgeUnder(ctx);
    land(ctx, x0, x1);
    footings(ctx);
    growth(ctx, x0, x1, false);
    bridgeInside(ctx);
    people(ctx);
    bridgeWall(ctx);
    bridgeRoof(ctx);
    growth(ctx, x0, x1, true);
    ctx.restore();
}

// ---------- inside the bridge (a cutaway: the near wall taken away) ----------
// Back wall lit from its windows, the long bench along it, rafters overhead, near posts passing in front.
function interiorOutside(ctx, T, rain, lines = true) {
    ctx.save();
    resetT(ctx);
    wash(ctx, 0, 0, 1920, 1080, [[0, mix('#8EA084', '#8E9A94', rain)], [1, mix('#B4BE9C', '#A9B2A6', rain)]], { tex: 0.4, seed: 21 });
    if (rain > 0 && lines) rainLines(ctx, T, rain);
    ctx.restore();
}
// Rain outside, seen only through the windows.
function rainLines(ctx, T, rain) {
    ctx.save();
    resetT(ctx);
    {
        ctx.strokeStyle = `rgba(235,240,240,${0.45 * rain})`;
        ctx.lineWidth = 1.4;
        for (let k = 0; k < 260; k++) {
            const x = (k * 97.3) % 1960, y = ((k * 53.7 + T * 900) % 1180) - 100;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 6, y + 34); ctx.stroke();
        }
    }
    ctx.restore();
}
function interiorBack(ctx, warm) {
    const top = (x) => deckY(x) - EAVE;
    const xs = [B.x0 - 200, B.x1 + 200];
    // Back wall with its windows open to the green outside.
    const wall = new Path2D();
    wall.moveTo(xs[0], top(B.x0) - 90); wall.lineTo(xs[1], top(B.x1) - 90); wall.lineTo(xs[1], B.deck + 2); wall.lineTo(xs[0], B.deck + 2); wall.closePath();
    for (let x = B.x0 + 40; x < B.x1 - 30; x += WIN.step) {
        const y0 = deckY(x) - WIN.top, y1 = deckY(x) - WIN.bot;
        wall.moveTo(x, y0); wall.lineTo(x, y1); wall.lineTo(x + WIN.w, y1); wall.lineTo(x + WIN.w, y0); wall.closePath();
    }
    ctx.save();
    ctx.clip(wall, 'evenodd');
    paint(ctx, block([[xs[0], top(B.x0) - 100], [xs[1], top(B.x1) - 100], [xs[1], B.deck + 10], [xs[0], B.deck + 10]], 200, 0, 1), mix('#8F7D69', '#A88D6A', warm), { seed: 200, angle: 1.57, mottle: 0.9, edge: 0 });
    for (let x = xs[0]; x < xs[1]; x += 13) line(ctx, [[x, top(x) - 90], [x, deckY(x)]], '#6E5E4E', 1.1, { alpha: 0.3 + noise(x * 0.3, 7) * 0.3, seed: x, amp: 0.5 });
    ctx.restore();
    for (let x = B.x0 + 40; x < B.x1 - 30; x += WIN.step) {
        const y0 = deckY(x) - WIN.top, y1 = deckY(x) - WIN.bot;
        ctx.save(); ctx.strokeStyle = '#5A4B3D'; ctx.lineWidth = 3; ctx.strokeRect(x - 1.5, y0 - 1.5, WIN.w + 3, y1 - y0 + 3); ctx.restore();
    }
    // The long bench along the back wall.
    const seat = (x) => deckY(x) - 38;
    paint(ctx, block([[xs[0], seat(B.x0)], [xs[1], seat(B.x1)], [xs[1], seat(B.x1) + 9], [xs[0], seat(B.x0) + 9]], 201, 0.5, 8), '#6B5643', { seed: 201 });
    for (let x = B.x0 + 20; x < B.x1; x += 96) paint(ctx, block(rectPts(x, seat(x) + 9, 7, 30), 202 + x, 0.3, 2), '#4E3F33', { seed: 202 });
    // Rafters and the purlin overhead.
    paint(ctx, block([[xs[0], top(B.x0) - 100], [xs[1], top(B.x1) - 100], [xs[1], top(B.x1) - 70], [xs[0], top(B.x0) - 70]], 203, 0.6, 8), '#3E3229', { seed: 203 });
    for (let x = B.x0; x < B.x1; x += 48) line(ctx, [[x, top(x) - 70], [x + 30, top(x) - 10]], '#4A3C31', 6, { amp: 0.4, seed: 204 + x });
    // Deck boards, seen edge on, worn pale where everyone walks.
    paint(ctx, block([[xs[0], B.deck - 6], [xs[1], B.deck - 6], [xs[1], B.deck + 34], [xs[0], B.deck + 34]], 205, 0.5, 8), '#8C7A64', { seed: 205 });
    line(ctx, [[xs[0], B.deck - 4], [xs[1], B.deck - 4]], '#B19D80', 2, { alpha: 0.7, seed: 206 });
    // Window light falling on the deck.
    for (let x = B.x0 + 40; x < B.x1 - 30; x += WIN.step) {
        shadow(ctx, x + WIN.w / 2 + 16, B.deck - 2, 34, 4, 0.25, '#F5E7C8');
    }
}
function interiorFront(ctx) {
    const top = (x) => deckY(x) - EAVE;
    // Between the windows, the walkers pass through shade.
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    for (let x = B.x0 + 40 - WIN.step; x < B.x1; x += WIN.step) {
        const g = ctx.createLinearGradient(x + WIN.w + 10, 0, x + WIN.step + 10, 0);
        g.addColorStop(0, 'rgba(120,100,80,0)'); g.addColorStop(0.5, 'rgba(120,100,80,0.28)'); g.addColorStop(1, 'rgba(120,100,80,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x + WIN.w + 10, top(x) - 100, WIN.step - WIN.w, EAVE + 140);
    }
    ctx.restore();
    // Near posts, dark and close, sliding past.
    for (let x = B.x0 + 8; x < B.x1; x += 256) {
        paint(ctx, block([[x, top(x) - 120], [x + 15, top(x) - 120], [x + 16, B.deck + 60], [x - 1, B.deck + 60]], 207 + x, 0.4, 4), '#2F2620', { seed: 207, angle: 1.57, alpha: 0.92 });
    }
}
export function drawInterior(ctx, T, view, people, warm = 0, rain = 0) {
    interiorOutside(ctx, T, rain);
    ctx.save();
    camera(ctx, view.cx, view.cy, view.z);
    interiorBack(ctx, warm);
    people(ctx);
    interiorFront(ctx);
    ctx.restore();
}

// The bridge inside, as cached layers. o: { warm, rain, people(ctx, T) }
export function interiorLayers(o = {}) {
    return [
        { screen: true, draw: (ctx) => interiorOutside(ctx, 0, o.rain || 0, false) },
        ...(o.rain ? [{ screen: true, live: true, draw: (ctx, T) => rainLines(ctx, T, o.rain) }] : []),
        { p: 1, draw: (ctx) => interiorBack(ctx, o.warm || 0) },
        { p: 1, live: true, draw: (ctx, T, c) => o.people && o.people(ctx, T, c) },
        { p: 1, draw: (ctx) => interiorFront(ctx) },
    ];
}


// ---------- the same land as cached layers (for the real-time shot engine) ----------
// o: { warm, season, people(ctx, T) live in the world, live: [{ p, draw }] extra live layers, glints }
export function landLayers(o = {}) {
    const warm = o.warm || 0, season = o.season || 0;
    const set = (fn) => (ctx, T) => { SEASON = season; fn(ctx, T); };
    const X0 = -1700, X1 = 6700;
    return [
        { screen: true, draw: set((ctx) => sky(ctx, warm)) },
        { p: 0.12, live: true, draw: (ctx, T) => cloudShapes(ctx, T) },
        { p: 0.18, draw: set((c) => { ridge(c, 330, 170, 0.0016, 11, mix('#A9BAC0', '#C7B9A2', warm * 0.4)); mist(c, 300, 460, warm, 0.55); }) },
        { p: 0.32, draw: set((c) => { ridge(c, 420, 150, 0.0024, 12, mix('#93A6A6', '#B3A88F', warm * 0.3)); mist(c, 400, 560, warm, 0.5); }) },
        { p: 0.55, draw: set((c) => { ridge(c, 520, 130, 0.003, 13, sc('mid')); firs(c, -2500, 8000, (x) => 520 - noise(x * 0.003, 13) * 130 - noise(x * 0.0093, 14) * 32, 14, mix(sc('fir'), sc('mid'), 0.4), 0.55, 40); mist(c, 470, 640, warm, 0.42); }) },
        {
            p: 1, draw: set((ctx) => {
                firs(ctx, X0, X1, (x) => hills(x) - 40 - (x > 1300 && x < 2640 ? -ravine(x) * 0.2 : 0), 15, sc('fir'), 0.9, 54);
                school(ctx);
                village(ctx, 0, false);
                bridgeUnder(ctx);
                land(ctx, X0, X1);
                footings(ctx);
                growth(ctx, X0, X1, false);
                bridgeInside(ctx);
            }),
        },
        { p: 1, live: true, draw: (ctx, T) => { smoke(ctx, T); if (o.glints !== false) glints(ctx, T); } },
        ...(o.live || []),
        { p: 1, live: true, draw: (ctx, T, c) => o.people && o.people(ctx, T, c) },
        { p: 1, draw: set((ctx) => { bridgeWall(ctx); bridgeRoof(ctx); growth(ctx, X0, X1, true); }) },
        ...(o.front || []),
    ];
}

// A band of valley mist lying at the foot of a ridge layer: what makes the distance look far.
function mist(ctx, y0, y1, warm, a) {
    const col = mix('#EEF0EA', '#F3D9B4', clamp(warm * 1.3));
    const [r, g, b] = [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
    const gr = ctx.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, `rgba(${r},${g},${b},0)`); gr.addColorStop(0.6, `rgba(${r},${g},${b},${a})`); gr.addColorStop(1, `rgba(${r},${g},${b},${a * 0.6})`);
    ctx.fillStyle = gr;
    ctx.fillRect(-4000, y0, 13000, y1 - y0 + 400);
}

// Light moving on the stream under the bridge.
function glints(ctx, T) {
    for (let k = 0; k < 6; k++) {
        const ph = (T * 0.35 + k * 0.37) % 1;
        const x = 1760 + k * 70 + ph * 30, y = 1148 + (k % 2) * 8;
        line(ctx, [[x, y], [x + 26, y - 1]], '#EEF3F0', 2, { alpha: 0.7 * Math.sin(Math.PI * ph), amp: 0 });
    }
}
