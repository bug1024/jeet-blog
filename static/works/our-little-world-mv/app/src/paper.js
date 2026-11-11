// Paper, print and collage: textures, cut and torn pieces, printed (multiplied) ink layers.
import { W, H, rng, noise, rgba, mix, clamp, lerp } from './core.js';
import { C } from './design.js';

let TEX = null;
const patterns = new WeakMap();

function canvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}

export function makeTextures(w = W, h = H) {
    // Paper: soft blooms of darker pulp and short fibres. Static for the whole film.
    const paper = canvas(w, h);
    const g = paper.getContext('2d');
    g.fillStyle = '#ffffff';
    g.fillRect(0, 0, w, h);
    const r = rng(11);
    for (let i = 0; i < 90; i++) {
        const x = r() * w, y = r() * h, rad = 120 + r() * 420;
        const gr = g.createRadialGradient(x, y, 0, x, y, rad);
        const a = 0.025 + r() * 0.05;
        gr.addColorStop(0, `rgba(150,120,85,${a})`);
        gr.addColorStop(1, 'rgba(150,120,85,0)');
        g.fillStyle = gr;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    for (let i = 0; i < 2600; i++) {
        g.strokeStyle = `rgba(120,95,70,${0.03 + r() * 0.06})`;
        g.lineWidth = 0.5 + r() * 0.9;
        const x = r() * w, y = r() * h, a = r() * Math.PI, l = 6 + r() * 26;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 3, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l);
        g.stroke();
    }
    const img = g.getImageData(0, 0, w, h), d = img.data;
    let s = 99;
    for (let i = 0; i < d.length; i += 4) {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        const v = ((s >>> 24) % 16) - 8;
        d[i] += v; d[i + 1] += v; d[i + 2] += v - 1;
    }
    g.putImageData(img, 0, 0);

    // Film grain: four frames, cycled.
    const grains = [0, 1, 2, 3].map((k) => {
        const c = canvas(w, h), gc = c.getContext('2d'), im = gc.createImageData(w, h), dd = im.data;
        let q = 1000 + k * 7919;
        for (let i = 0; i < dd.length; i += 4) {
            q = (Math.imul(q, 1664525) + 1013904223) >>> 0;
            const v = 128 + (((q >>> 24) % 70) - 35);
            dd[i] = dd[i + 1] = dd[i + 2] = v;
            dd[i + 3] = 255;
        }
        gc.putImageData(im, 0, 0);
        return c;
    });

    // Fibre tile laid into every paper piece.
    const fibre = canvas(384, 384);
    const f = fibre.getContext('2d');
    const fr = rng(23);
    for (let i = 0; i < 900; i++) {
        f.fillStyle = `rgba(90,70,50,${0.04 + fr() * 0.08})`;
        f.fillRect(fr() * 384, fr() * 384, 1 + fr() * 2, 1 + fr() * 2);
    }
    for (let i = 0; i < 160; i++) {
        f.strokeStyle = `rgba(255,255,255,${0.08 + fr() * 0.12})`;
        f.lineWidth = 0.6 + fr();
        const x = fr() * 384, y = fr() * 384, a = fr() * Math.PI, l = 8 + fr() * 20;
        f.beginPath(); f.moveTo(x, y); f.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); f.stroke();
    }
    // Halftone tiles at a few densities, for printed shading.
    const halftone = [0.18, 0.3, 0.42, 0.56].map((k) => {
        const c = canvas(10, 10), hc = c.getContext('2d');
        hc.fillStyle = '#000';
        hc.beginPath(); hc.arc(5, 5, 5 * k * 1.15, 0, Math.PI * 2); hc.fill();
        return c;
    });
    // Uneven ink: tiny pale specks where the pigment did not take.
    const speckle = canvas(256, 256);
    const sp = speckle.getContext('2d');
    const srr = rng(31);
    for (let i = 0; i < 520; i++) {
        sp.fillStyle = `rgba(255,250,240,${0.15 + srr() * 0.35})`;
        const sz = 0.6 + srr() * 1.8;
        sp.fillRect(srr() * 256, srr() * 256, sz, sz * (0.6 + srr()));
    }
    for (let i = 0; i < 260; i++) {
        sp.fillStyle = `rgba(40,30,20,${0.05 + srr() * 0.1})`;
        sp.fillRect(srr() * 256, srr() * 256, 1, 1);
    }
    TEX = { paper, grains, fibre, halftone, speckle };
    return TEX;
}

function pattern(ctx, key, source) {
    let m = patterns.get(ctx);
    if (!m) { m = {}; patterns.set(ctx, m); }
    if (!m[key]) m[key] = ctx.createPattern(source, 'repeat');
    return m[key];
}

// ---------- Outlines ----------

export const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
export function circlePts(cx, cy, r, n = 64, ry = r) {
    return Array.from({ length: n }, (_, i) => [cx + Math.cos((i / n) * Math.PI * 2) * r, cy + Math.sin((i / n) * Math.PI * 2) * ry]);
}
// Scissor cut: straight edges with the faintest waver.
export function scissor(pts, seed = 1, amp = 0.6, seg = 46) {
    const r = rng(seed), out = [];
    pts.forEach((a, i) => {
        const b = pts[(i + 1) % pts.length];
        const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
        const n = Math.max(1, Math.round(len / seg)), nx = -dy / len, ny = dx / len;
        for (let j = 0; j < n; j++) {
            const t = j / n, o = j === 0 ? 0 : (r() - 0.5) * 2 * amp;
            out.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]);
        }
    });
    return out;
}
// Torn edge: rough, fibrous.
export function torn(pts, seed = 1, amp = 4, seg = 7) {
    const out = [];
    let k = 0;
    pts.forEach((a, i) => {
        const b = pts[(i + 1) % pts.length];
        const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
        const n = Math.max(1, Math.round(len / seg)), nx = -dy / len, ny = dx / len;
        for (let j = 0; j < n; j++) {
            const t = j / n;
            const o = (noise(k * 0.35, seed) - 0.5) * 2 * amp + (noise(k * 1.7, seed + 9) - 0.5) * amp * 0.8;
            out.push([a[0] + dx * t + nx * o, a[1] + dy * t + ny * o]);
            k++;
        }
    });
    return out;
}
export function path(ctx, pts) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
}
export function transform(pts, { x = 0, y = 0, s = 1, sx = s, sy = s, rot = 0, ox = 0, oy = 0 } = {}) {
    const c = Math.cos(rot), sn = Math.sin(rot);
    return pts.map(([px, py]) => {
        const qx = (px - ox) * sx, qy = (py - oy) * sy;
        return [ox + x + qx * c - qy * sn, oy + y + qx * sn + qy * c];
    });
}

// ---------- Pieces ----------

function texture(ctx, alpha) {
    if (!TEX || alpha <= 0) return;
    ctx.save();
    ctx.clip();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = pattern(ctx, 'fibre', TEX.fibre);
    ctx.fillRect(-4000, -4000, 12000, 12000);
    ctx.fillStyle = pattern(ctx, 'speckle', TEX.speckle);
    ctx.fillRect(-4000, -4000, 12000, 12000);
    // A faint darker rim, as on real cut paper.
    ctx.restore();
}

// A cut paper piece lying on the page, with a soft shadow beneath.
// o.lift raises it (bigger, softer shadow), o.fringe shows a white torn core around it.
export function piece(ctx, pts, color, o = {}) {
    const { shadow = true, lift = 0, tex = 0.9, fringe = 0, alpha = 1 } = o;
    ctx.save();
    ctx.globalAlpha *= alpha;
    if (fringe) {
        path(ctx, torn(pts, (o.seed || 1) + 77, fringe, 6));
        ctx.fillStyle = C.paperLight;
        if (shadow) setShadow(ctx, lift);
        ctx.fill();
        clearShadow(ctx);
    }
    path(ctx, pts);
    ctx.fillStyle = color;
    if (shadow && !fringe) setShadow(ctx, lift);
    ctx.fill();
    clearShadow(ctx);
    texture(ctx, tex);
    ctx.restore();
}
function setShadow(ctx, lift) {
    ctx.shadowColor = `rgba(45,30,18,${0.24 + lift * 0.06})`;
    ctx.shadowBlur = 5 + lift * 10;
    ctx.shadowOffsetX = 1.5 + lift * 3;
    ctx.shadowOffsetY = 2.5 + lift * 6;
}
function clearShadow(ctx) {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
}

// Printed ink: multiplies with what is beneath, like overprinted colour.
export function ink(ctx, pts, color, alpha = 1, o = {}) {
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha *= alpha;
    if (typeof pts === 'function') pts(ctx); else path(ctx, pts);
    ctx.fillStyle = color;
    ctx.fill();
    if (o.halftone != null && TEX) {
        ctx.clip();
        ctx.globalAlpha *= o.halftoneAlpha ?? 0.25;
        ctx.fillStyle = pattern(ctx, `ht${o.halftone}`, TEX.halftone[o.halftone]);
        ctx.fillRect(-4000, -4000, 12000, 12000);
    }
    ctx.restore();
}

// Halftone shading inside a region: density 0..3.
export function halftone(ctx, pts, density = 1, alpha = 0.2, color = null) {
    if (!TEX) return;
    ctx.save();
    path(ctx, pts);
    ctx.clip();
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = pattern(ctx, `ht${density}`, TEX.halftone[density]);
    ctx.fillRect(-4000, -4000, 12000, 12000);
    ctx.restore();
}

// A thin printed rule, drawn from a to b up to progress p.
export function rule(ctx, a, b, p = 1, width = 2, color = C.ink, alpha = 1) {
    if (p <= 0) return;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(lerp(a[0], b[0], p), lerp(a[1], b[1], p));
    ctx.stroke();
    ctx.restore();
}

// A thick road: a polyline drawn up to progress p (0..1 of its length), as a strip of cut paper.
export function road(ctx, pts, p = 1, width = 18, color = C.brick, o = {}) {
    if (p <= 0 || pts.length < 2) return null;
    const lens = [0];
    for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = lens[lens.length - 1], target = total * clamp(p);
    const out = [pts[0]];
    let tip = pts[0];
    for (let i = 1; i < pts.length; i++) {
        if (lens[i] <= target) { out.push(pts[i]); tip = pts[i]; continue; }
        const t = (target - lens[i - 1]) / (lens[i] - lens[i - 1]);
        tip = [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)];
        out.push(tip);
        break;
    }
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.lineJoin = 'round';
    ctx.lineCap = o.cap || 'butt';
    if (o.shadow !== false) {
        ctx.shadowColor = 'rgba(45,30,18,.22)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    out.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])));
    ctx.stroke();
    ctx.restore();
    return tip;
}

// Smooth a few control points into a dense polyline (Catmull-Rom).
export function spline(ctrl, steps = 18) {
    const out = [];
    for (let i = 0; i < ctrl.length - 1; i++) {
        const p0 = ctrl[Math.max(0, i - 1)], p1 = ctrl[i], p2 = ctrl[i + 1], p3 = ctrl[Math.min(ctrl.length - 1, i + 2)];
        for (let s = 0; s < steps; s++) {
            const t = s / steps, t2 = t * t, t3 = t2 * t;
            out.push([0, 1].map((k) => 0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)));
        }
    }
    out.push(ctrl[ctrl.length - 1]);
    return out;
}

// The page itself, then (at the end of the frame) grain and a soft vignette.
export function paperBase(ctx, color = C.paper) {
    ctx.fillStyle = color;
    ctx.fillRect(-4000, -4000, 12000, 12000);
}
export function finish(ctx, frame, w, h) {
    if (!TEX) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = 0.9;
    ctx.drawImage(TEX.paper, 0, 0, w, h);
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.13;
    ctx.drawImage(TEX.grains[frame % 4], 0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    const v = ctx.createRadialGradient(w / 2, h / 2, w * 0.36, w / 2, h / 2, w * 0.75);
    v.addColorStop(0, 'rgba(40,30,20,0)');
    v.addColorStop(1, 'rgba(40,30,20,.22)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
}

export { mix, rgba };
