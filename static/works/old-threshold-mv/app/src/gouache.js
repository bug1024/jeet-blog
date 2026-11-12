// Gouache on paper: textures, wobbly hand-cut shapes, brushy opaque fills, and the final paper pass.
// Every texture is made once and anchored to the shape's own coordinates, so nothing shimmers frame to frame.
import { W, H, rng, noise, clamp, lerp, mix, rgba, resetT } from './core.js';
import { C } from './design.js';

let TEX = null;
const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

// One brush stroke made of bristle lines, drawn wrapped so the tile repeats seamlessly.
function stroke(g, size, x, y, len, wid, ang, light, a, r) {
    const n = 4 + Math.floor(r() * 6);
    for (let k = 0; k < n; k++) {
        const off = (k / (n - 1) - 0.5) * wid;
        const aa = a * (0.4 + r() * 0.8);
        g.strokeStyle = light ? `rgba(255,255,255,${aa})` : `rgba(0,0,0,${aa})`;
        g.lineWidth = 0.8 + r() * 1.8;
        const l = len * (0.6 + r() * 0.4), s = r() * len * 0.2;
        const c = Math.cos(ang), si = Math.sin(ang);
        for (const dx of [-size, 0, size]) for (const dy of [-size, 0, size]) {
            const x0 = x + dx - si * off + c * s, y0 = y + dy + c * off + si * s;
            g.beginPath();
            g.moveTo(x0, y0);
            g.quadraticCurveTo(x0 + c * l * 0.5 - si * wid * 0.15, y0 + si * l * 0.5 + c * wid * 0.15, x0 + c * l, y0 + si * l);
            g.stroke();
        }
    }
}

export function makeTextures() {
    // Brush tile: mid grey with light and dark bristle streaks, used in soft-light over a flat colour.
    const S = 512;
    const brush = cv(S, S), b = brush.getContext('2d');
    b.fillStyle = '#808080'; b.fillRect(0, 0, S, S);
    const r = rng(7);
    for (let i = 0; i < 900; i++) {
        stroke(b, S, r() * S, r() * S, 50 + r() * 190, 6 + r() * 18, (r() - 0.5) * 0.3, r() < 0.5, 0.07 + r() * 0.1, r);
    }
    // Mottle tile: soft pigment unevenness, larger than any stroke.
    const M = 768;
    const mottle = cv(M, M), m = mottle.getContext('2d');
    m.fillStyle = '#808080'; m.fillRect(0, 0, M, M);
    const r2 = rng(19);
    for (let i = 0; i < 140; i++) {
        const x = r2() * M, y = r2() * M, rad = 40 + r2() * 170, light = r2() < 0.5, a = 0.05 + r2() * 0.09;
        for (const dx of [-M, 0, M]) for (const dy of [-M, 0, M]) {
            const gr = m.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, rad);
            gr.addColorStop(0, light ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a})`);
            gr.addColorStop(1, 'rgba(128,128,128,0)');
            m.fillStyle = gr;
            m.fillRect(x + dx - rad, y + dy - rad, rad * 2, rad * 2);
        }
    }
    // Dry brush: broken streaks with transparent gaps, for scumbled light over dark.
    const dry = cv(S, S), d = dry.getContext('2d');
    const r3 = rng(31);
    for (let i = 0; i < 420; i++) stroke(d, S, r3() * S, r3() * S, 40 + r3() * 160, 4 + r3() * 12, (r3() - 0.5) * 0.2, true, 0.25 + r3() * 0.4, r3);

    // Paper: fibres, pulp blooms and a fine tooth. Static for the whole film.
    const paper = cv(W, H), p = paper.getContext('2d');
    p.fillStyle = '#ffffff'; p.fillRect(0, 0, W, H);
    const r4 = rng(11);
    for (let i = 0; i < 70; i++) {
        const x = r4() * W, y = r4() * H, rad = 160 + r4() * 420;
        const gr = p.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, `rgba(140,115,85,${0.02 + r4() * 0.035})`);
        gr.addColorStop(1, 'rgba(140,115,85,0)');
        p.fillStyle = gr; p.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    for (let i = 0; i < 1800; i++) {
        p.strokeStyle = `rgba(110,90,70,${0.025 + r4() * 0.05})`;
        p.lineWidth = 0.5 + r4() * 0.8;
        const x = r4() * W, y = r4() * H, a = r4() * Math.PI, l = 5 + r4() * 22;
        p.beginPath(); p.moveTo(x, y); p.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 2, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); p.stroke();
    }
    const img = p.getImageData(0, 0, W, H), dd = img.data;
    let s = 99;
    for (let i = 0; i < dd.length; i += 4) {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        const v = ((s >>> 24) % 14) - 7;
        dd[i] += v; dd[i + 1] += v; dd[i + 2] += v - 1;
    }
    p.putImageData(img, 0, 0);

    const g = cv(1, 1).getContext('2d');
    TEX = {
        paper,
        brush: g.createPattern(brush, 'repeat'),
        mottle: g.createPattern(mottle, 'repeat'),
        dry: g.createPattern(dry, 'repeat'),
    };
}

function patTransform(pat, angle, seed, scale) {
    const m = new DOMMatrix();
    m.rotateSelf((angle * 180) / Math.PI);
    m.translateSelf((seed * 137) % 512, (seed * 71) % 512);
    m.scaleSelf(scale, scale);
    pat.setTransform(m);
    return pat;
}

// ---------- shapes ----------

// Closed Catmull-Rom spline through points: soft, hand-made outlines.
export function smoothPath(pts, closed = true, path = new Path2D()) {
    const n = pts.length;
    if (n < 3) return path;
    const P = (i) => (closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
    path.moveTo(P(0)[0], P(0)[1]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
        const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
        path.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    if (closed) path.closePath();
    return path;
}

// Subdivide each edge a fixed number of times and push the new points in or out by stable noise.
// Fixed counts keep the wobble glued to the shape as it moves and bends.
export function wobble(pts, seed = 0, amp = 2, sub = 3, closed = true) {
    const out = [];
    const n = pts.length, edges = closed ? n : n - 1;
    let k = 0;
    for (let i = 0; i < edges; i++) {
        const a = pts[i], b = pts[(i + 1) % n];
        const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        for (let j = 0; j < sub; j++, k++) {
            const t = j / sub;
            const o = j === 0 ? (noise(k * 0.9, seed) - 0.5) * amp * 0.6 : (noise(k * 0.9, seed) - 0.5) * amp * 2;
            out.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]);
        }
    }
    if (!closed) out.push(pts[n - 1]);
    return out;
}

export const shape = (pts, seed = 0, amp = 2, sub = 3) => smoothPath(wobble(pts, seed, amp, sub));

// Straight-edged shape (buildings, furniture): corners stay corners, edges waver a little.
export function block(pts, seed = 0, amp = 1.2, sub = 4) {
    const w = wobble(pts, seed, amp, sub);
    const path = new Path2D();
    path.moveTo(w[0][0], w[0][1]);
    for (let i = 1; i < w.length; i++) path.lineTo(w[i][0], w[i][1]);
    path.closePath();
    return path;
}

export function ellipsePts(cx, cy, rx, ry, n = 12, rot = 0) {
    const out = [];
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
        out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
    }
    return out;
}
export const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];

// A limb or any tube through joints, with a width at each joint and round ends.
export function limbPts(joints, widths, capN = 3) {
    const L = [], R = [];
    const n = joints.length;
    for (let i = 0; i < n; i++) {
        const p = joints[i];
        const a = joints[Math.max(0, i - 1)], b = joints[Math.min(n - 1, i + 1)];
        let dx = b[0] - a[0], dy = b[1] - a[1];
        const len = Math.hypot(dx, dy) || 1;
        dx /= len; dy /= len;
        const w = widths[i] / 2;
        L.push([p[0] - dy * w, p[1] + dx * w]);
        R.push([p[0] + dy * w, p[1] - dx * w]);
    }
    const cap = (p, q, dir, w) => {
        const pts = [];
        const ang = Math.atan2(dir[1], dir[0]);
        for (let k = 1; k < capN; k++) {
            const a = ang - Math.PI / 2 + (k / capN) * Math.PI;
            pts.push([p[0] + Math.cos(a) * w, p[1] + Math.sin(a) * w]);
        }
        return pts;
    };
    const e = joints[n - 1], e0 = joints[n - 2], s = joints[0], s1 = joints[1];
    const de = [e[0] - e0[0], e[1] - e0[1]], le = Math.hypot(...de) || 1;
    const ds = [s[0] - s1[0], s[1] - s1[1]], ls = Math.hypot(...ds) || 1;
    return [
        ...L,
        ...cap(e, null, [de[0] / le, de[1] / le], widths[n - 1] / 2).reverse(),
        ...R.reverse(),
        ...cap(s, null, [ds[0] / ls, ds[1] / ls], widths[0] / 2).reverse(),
    ];
}

// ---------- paint ----------

// Opaque gouache fill: flat colour, bristle streaks along `angle`, pigment mottle, a faint pooled edge.
// The textures follow the current transform, so a moving shape carries its brushwork with it.
export function paint(ctx, path, color, o = {}) {
    const { seed = 0, angle = 0, tex = 0.8, mottle = 0.6, edge = 0.22, alpha = 1, scale = 1, dry = 0 } = o;
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = color;
    ctx.fill(path);
    ctx.clip(path);
    const a0 = ctx.globalAlpha;
    ctx.globalCompositeOperation = 'soft-light';
    if (tex > 0) { ctx.globalAlpha = a0 * tex; ctx.fillStyle = patTransform(TEX.brush, angle, seed, scale); ctx.fill(path); }
    if (mottle > 0) { ctx.globalAlpha = a0 * mottle; ctx.fillStyle = patTransform(TEX.mottle, angle * 0.3, seed + 3, scale); ctx.fill(path); }
    ctx.globalCompositeOperation = 'source-over';
    if (dry > 0) { ctx.globalAlpha = a0 * dry * 0.5; ctx.fillStyle = patTransform(TEX.dry, angle, seed + 5, scale); ctx.fill(path); }
    if (edge > 0) {
        ctx.globalAlpha = a0 * edge;
        ctx.strokeStyle = mix(color, C.ink, 0.45);
        ctx.lineWidth = 2.6 * scale;
        ctx.stroke(path);
    }
    ctx.restore();
}

// Model a tube: shade the side away from the light (light comes from the upper left), clipped to the shape.
export function model(ctx, path, a, b, w, k = 0.28) {
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    let nx = -dy / len, ny = dx / len;
    if (nx * 0.7 + ny * 0.7 < 0) { nx = -nx; ny = -ny; }
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const g = ctx.createLinearGradient(m[0] - nx * w * 0.1, m[1] - ny * w * 0.1, m[0] + nx * w * 0.55, m[1] + ny * w * 0.55);
    g.addColorStop(0, 'rgba(90,70,60,0)');
    g.addColorStop(1, `rgba(90,70,60,${k})`);
    ctx.save();
    ctx.clip(path);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = g;
    ctx.fill(path);
    ctx.restore();
}

// Loose brush line (thread, chalk, cracks, hair strands).
export function line(ctx, pts, color, width = 2, o = {}) {
    const { alpha = 1, seed = 0, amp = 0.8, closed = false } = o;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const w = amp > 0 ? wobble(pts, seed, amp, 2, closed) : pts;
    if (w.length < 3) {
        // Two points: a plain stroke (the spline needs three).
        const p = new Path2D();
        p.moveTo(w[0][0], w[0][1]);
        p.lineTo(w[w.length - 1][0], w[w.length - 1][1]);
        ctx.stroke(p);
    } else ctx.stroke(smoothPath(w, closed));
    ctx.restore();
}

// Soft shadow pooled on the ground or under an overhang.
export function shadow(ctx, x, y, rx, ry, a = 0.22, color = C.ink) {
    ctx.save();
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
    g.addColorStop(0, rgba(color, a));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    ctx.translate(-x, -y);
    ctx.beginPath();
    ctx.arc(x, y, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

// Horizontal wash: a gradient laid with broad strokes (skies, walls in light).
export function wash(ctx, x, y, w, h, stops, o = {}) {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    stops.forEach(([t, c]) => g.addColorStop(t, c));
    const path = new Path2D();
    path.rect(x, y, w, h);
    ctx.save();
    ctx.fillStyle = g;
    ctx.fill(path);
    ctx.clip(path);
    ctx.globalCompositeOperation = 'soft-light';
    ctx.globalAlpha = o.tex ?? 0.5;
    ctx.fillStyle = patTransform(TEX.brush, o.angle || 0, o.seed || 1, o.scale || 1.6);
    ctx.fill(path);
    ctx.globalAlpha = o.mottle ?? 0.5;
    ctx.fillStyle = patTransform(TEX.mottle, 0, (o.seed || 1) + 2, o.scale || 1.6);
    ctx.fill(path);
    ctx.restore();
}

// ---------- finish ----------

// Final pass in screen space: colour grade, paper multiplied in, a gentle vignette. Fully static.
// grade: { sat 0..1, warm -1..1, light -1..1 }
// Colour grade of one shot: saturation, warmth, light.
export function grade(ctx, w, h, g = {}) {
    const { sat = 1, warm = 0, light = 0 } = g;
    ctx.save();
    resetT(ctx);
    if (sat < 1) {
        ctx.globalCompositeOperation = 'saturation';
        ctx.globalAlpha = clamp(1 - sat);
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, w, h);
    }
    if (warm !== 0) {
        ctx.globalCompositeOperation = 'soft-light';
        ctx.globalAlpha = Math.abs(warm) * 0.5;
        ctx.fillStyle = warm > 0 ? '#E0A050' : '#5A7A9A';
        ctx.fillRect(0, 0, w, h);
    }
    if (light !== 0) {
        ctx.globalCompositeOperation = light > 0 ? 'screen' : 'multiply';
        ctx.globalAlpha = Math.abs(light);
        ctx.fillStyle = light > 0 ? '#3a3530' : '#b8b0a4';
        ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
}

export function finish(ctx, w, h, gr) {
    if (gr) grade(ctx, w, h, gr);
    ctx.save();
    resetT(ctx);
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 1;
    ctx.drawImage(TEX.paper, 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.45, w / 2, h / 2, h * 1.05);
    g.addColorStop(0, 'rgba(40,30,20,0)');
    g.addColorStop(1, 'rgba(40,30,20,0.16)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}

export function paperBase(ctx, color = C.paper) {
    ctx.save();
    resetT(ctx);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
}

export const tex = () => TEX;
export { lerp };
