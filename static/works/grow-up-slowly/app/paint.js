// Painting toolkit for 慢一点长大: gouache-like shapes on a fixed 1920 × 1080 stage.
// Every shape is deterministic for a given time, so the same frame can be drawn live in the player or captured for video.
// Shapes "boil" slightly eight times a second, the way hand-painted animation drawn on twos does.

export const W = 1920;
export const H = 1080;
export const S = { T: 0, boil: 0 };

export function rng(seed) {
    let a = (seed * 2654435761) >>> 0 || 1;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const range = (v, a, b) => clamp((v - a) / (b - a));
export const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const ease = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3);

const hexCache = new Map();
function rgb(c) {
    let v = hexCache.get(c);
    if (!v) {
        const n = parseInt(c.slice(1), 16);
        v = [n >> 16, (n >> 8) & 255, n & 255];
        hexCache.set(c, v);
    }
    return v;
}
export function mix(a, b, t) {
    const x = rgb(a), y = rgb(b);
    const c = x.map((v, i) => Math.round(lerp(v, y[i], clamp(t))));
    return `#${((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1)}`;
}
// Pick a colour from evenly spaced stops by a float index (used for seasons and light changes).
export function ramp(stops, v) {
    const i = clamp(Math.floor(v), 0, stops.length - 2);
    return mix(stops[i], stops[i + 1], v - i);
}
export const rgba = (c, a) => { const [r, g, b] = rgb(c); return `rgba(${r},${g},${b},${a})`; };

function hash(i, seed) {
    let h = (Math.imul(i, 374761393) + Math.imul(seed, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
export function noise(x, seed = 0) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return lerp(hash(i, seed), hash(i + 1, seed), u);
}
export const fbm = (x, seed = 0) => noise(x, seed) * 0.6 + noise(x * 2.1, seed + 7) * 0.28 + noise(x * 4.3, seed + 13) * 0.12;
// Small per-boil wobble used by silhouettes.
export const wob = (x, seed = 0, amp = 1.4) => (noise(x * 0.06, seed + S.boil * 31) - 0.5) * 2 * amp;

export function camera(ctx, cx = W / 2, cy = H / 2, z = 1, rot = 0) {
    ctx.translate(W / 2, H / 2);
    ctx.scale(z, z);
    if (rot) ctx.rotate(rot);
    ctx.translate(-cx, -cy);
}
// A slow, breathing hand-held sway.
export const sway = (T, amp = 6) => [Math.sin(T * 0.7) * amp + Math.sin(T * 1.9) * amp * 0.3, Math.cos(T * 0.53) * amp * 0.6];

// Fill the current path; alpha multiplies whatever transparency is already set (ghosts, fades).
export function fill(ctx, color, alpha = 1) {
    const prev = ctx.globalAlpha;
    ctx.globalAlpha = prev * alpha;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = prev;
}

// Smooth closed outline through points.
export function closed(ctx, pts) {
    const n = pts.length;
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    ctx.beginPath();
    const s = mid(pts[n - 1], pts[0]);
    ctx.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) {
        const p = pts[i], q = mid(p, pts[(i + 1) % n]);
        ctx.quadraticCurveTo(p[0], p[1], q[0], q[1]);
    }
    ctx.closePath();
}

// Organic ellipse with a hand-cut edge.
export function blob(ctx, cx, cy, rx, ry, seed = 1, amp = 0.07, n = 12, rot = 0) {
    const base = rng(seed), boil = rng(seed + S.boil * 9973 + 1);
    const pts = [];
    const c = Math.cos(rot), s = Math.sin(rot);
    for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const k = 1 + (base() - 0.5) * 2 * amp + (boil() - 0.5) * 0.024;
        const x = Math.cos(a) * rx * k, y = Math.sin(a) * ry * k;
        pts.push([cx + x * c - y * s, cy + x * s + y * c]);
    }
    closed(ctx, pts);
}
export function dab(ctx, cx, cy, rx, ry, color, alpha = 1, seed = 1, amp = 0.07, rot = 0) {
    blob(ctx, cx, cy, rx, ry, seed, amp, 12, rot);
    fill(ctx, color, alpha);
}

// Polygon with slightly wavering straight edges, like a painted rectangle.
export function wpoly(ctx, pts, seed = 1, amp = 1.6, seg = 60) {
    const base = rng(seed), boil = rng(seed + S.boil * 9973 + 3);
    ctx.beginPath();
    pts.forEach((a, i) => {
        const b = pts[(i + 1) % pts.length];
        const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len, ny = dx / len;
        const n = Math.max(1, Math.round(len / seg));
        for (let j = 0; j < n; j++) {
            const t = j / n;
            const off = j === 0 ? 0 : (base() - 0.5) * 2 * amp + (boil() - 0.5) * amp * 0.5;
            const x = a[0] + dx * t + nx * off, y = a[1] + dy * t + ny * off;
            if (i === 0 && j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
    });
    ctx.closePath();
}
export const wrect = (ctx, x, y, w, h, seed, amp) => wpoly(ctx, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], seed, amp);
export function rect(ctx, x, y, w, h, color, alpha = 1, seed = 1, amp = 1.6) {
    wrect(ctx, x, y, w, h, seed, amp);
    fill(ctx, color, alpha);
}

// Silhouette from x0 to x1 whose top edge is fn(x).
export function ridge(ctx, x0, x1, fn, bottom = H + 40, step = 12) {
    ctx.beginPath();
    ctx.moveTo(x0, bottom);
    for (let x = x0; x <= x1 + step; x += step) ctx.lineTo(x, fn(x));
    ctx.lineTo(x1 + step, bottom);
    ctx.closePath();
}

export function vgrad(ctx, y0, y1, stops) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    stops.forEach(([c, p]) => g.addColorStop(p, c));
    return g;
}
export function sky(ctx, stops, y0 = 0, y1 = H, x0 = -400, x1 = W + 400) {
    ctx.fillStyle = vgrad(ctx, y0, y1, stops);
    ctx.fillRect(x0, y0 - 600, x1 - x0, y1 - y0 + 1200);
}
export function glow(ctx, x, y, r, color, alpha = 1) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(0.4, rgba(color, alpha * 0.45));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// Pigment mottling: a few broad, faint dabs that keep big flat areas from looking digital.
export function mottle(ctx, x, y, w, h, color, seed = 1, count = 10, alpha = 0.08) {
    const r = rng(seed);
    for (let i = 0; i < count; i++) {
        dab(ctx, x + r() * w, y + r() * h, 60 + r() * w * 0.18, 30 + r() * h * 0.2, color, alpha * (0.5 + r()), seed + i * 17, 0.18);
    }
}

// A single tapered grass blade.
export function blade(ctx, x, y, h, bend, w, color) {
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.quadraticCurveTo(x - w * 0.25 + bend * 0.35, y - h * 0.55, x + bend, y - h);
    ctx.quadraticCurveTo(x + w * 0.25 + bend * 0.45, y - h * 0.5, x + w / 2, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

// Wind strength over time: a steady breeze with gusts.
export const gust = (T, x = 0) => 0.55 + 0.3 * Math.sin(T * 0.9 + x * 0.002) + 0.25 * Math.sin(T * 2.3 + x * 0.004 + 1.3);

// A run of grass tufts along y between x0 and x1. scroll moves the field sideways for tracking shots.
export function grass(ctx, x0, x1, y, o = {}) {
    const { seed = 1, gap = 14, h = 40, w = 7, colors = ['#6f7f4f', '#87955d', '#5c6c45'], wind = 1, scroll = 0, T = S.T, jitterY = 12, lean = 0 } = o;
    const start = Math.floor((x0 + scroll) / gap) - 1, end = Math.ceil((x1 + scroll) / gap) + 1;
    for (let i = start; i <= end; i++) {
        const r = rng(i * 131 + seed * 7);
        const x = i * gap - scroll + (r() - 0.5) * gap;
        const by = y + (r() - 0.5) * jitterY;
        const bh = h * (0.55 + r() * 0.75);
        const bend = (Math.sin(T * 2.1 + x * 0.013) * 0.5 + gust(T, x)) * bh * 0.32 * wind + lean * bh + (r() - 0.5) * bh * 0.3;
        blade(ctx, x, by, bh, bend, w * (0.7 + r() * 0.6), colors[Math.floor(r() * colors.length)]);
    }
}

// Thin wind streaks drifting across the frame.
export function windLines(ctx, T, o = {}) {
    const { count = 6, y0 = 300, y1 = 900, color = '#fff4e2', alpha = 0.35, speed = 900, seed = 4 } = o;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    for (let i = 0; i < count; i++) {
        const r = rng(seed + i * 19);
        const len = 120 + r() * 220, period = (W + len * 2) / speed * (0.7 + r() * 0.6);
        const ph = ((T + r() * period) % period) / period;
        const x = W + len - ph * (W + len * 2), y = lerp(y0, y1, r()) + Math.sin(T * 1.3 + i) * 10;
        ctx.globalAlpha = alpha * Math.sin(ph * Math.PI);
        ctx.lineWidth = 2 + r() * 2.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(x + len * 0.5, y - 14 - r() * 10, x + len, y + 2);
        ctx.stroke();
    }
    ctx.restore();
}

// Floating particles: petals, leaves, snow, fireflies. kind picks the look.
export function particles(ctx, T, kind, o = {}) {
    const { count = 30, seed = 9, alpha = 1, wind = 1, x0 = -100, x1 = W + 100, y0 = -60, y1 = H + 60 } = o;
    ctx.save();
    for (let i = 0; i < count; i++) {
        const r = rng(seed + i * 23);
        const fall = kind === 'snow' ? 60 + r() * 50 : kind === 'firefly' ? 0 : 70 + r() * 70;
        const drift = (kind === 'firefly' ? 10 : 90 + r() * 120) * wind;
        const span = y1 - y0, wspan = x1 - x0;
        const t = T + r() * 100;
        let y = kind === 'firefly' ? lerp(y0, y1, r()) + Math.sin(t * 0.8 + i) * 30 : y0 + ((t * fall) % span + span) % span;
        let x = x0 + (((r() * wspan - t * drift) % wspan) + wspan) % wspan + Math.sin(t * 1.7 + i) * 24;
        ctx.globalAlpha = alpha;
        if (kind === 'snow') {
            ctx.fillStyle = '#fbf8f2';
            ctx.beginPath(); ctx.arc(x, y, 3 + r() * 5, 0, Math.PI * 2); ctx.fill();
        } else if (kind === 'firefly') {
            const a = 0.5 + 0.5 * Math.sin(t * 3 + i * 2);
            glow(ctx, x, y, 22, '#ffe9a6', alpha * a * 0.8);
        } else {
            const colors = kind === 'petal' ? ['#f4c3c8', '#f7d9da', '#eaa7b1'] : kind === 'leaf' ? ['#d88a43', '#c4632f', '#e6aa4f', '#a9542f'] : ['#fff6e0'];
            ctx.fillStyle = colors[Math.floor(r() * colors.length)];
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(t * (1 + r() * 2) + i);
            ctx.scale(1, 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + i)));
            const sz = kind === 'leaf' ? 11 + r() * 8 : 7 + r() * 5;
            ctx.beginPath();
            ctx.ellipse(0, 0, sz, sz * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    ctx.restore();
}

// Paper grain and brush texture laid over every frame.
export function makeTextures(w, h) {
    const make = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const grain = make();
    const g = grain.getContext('2d');
    const img = g.createImageData(w, h);
    const d = img.data;
    let s = 1234567;
    for (let i = 0; i < d.length; i += 4) {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        const v = 255 - ((s >>> 24) % 30);
        d[i] = v; d[i + 1] = v - 3; d[i + 2] = v - 9; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // Paper fibres and soft blooms where pigment pooled.
    const r = rng(77);
    const k = w / W;
    for (let i = 0; i < 900; i++) {
        g.strokeStyle = `rgba(150,120,90,${0.04 + r() * 0.05})`;
        g.lineWidth = (0.6 + r()) * k;
        const x = r() * w, y = r() * h, a = r() * Math.PI, l = (10 + r() * 30) * k;
        g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 4 * k, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    for (let i = 0; i < 70; i++) {
        const x = r() * w, y = r() * h, rad = (80 + r() * 260) * k;
        const gr = g.createRadialGradient(x, y, 0, x, y, rad);
        gr.addColorStop(0, `rgba(170,135,105,${0.05 + r() * 0.05})`);
        gr.addColorStop(0.7, `rgba(170,135,105,${0.03})`);
        gr.addColorStop(1, 'rgba(170,135,105,0)');
        g.fillStyle = gr;
        g.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // Brush strokes: mid grey with light and dark strokes, applied in overlay mode so it only modulates value.
    const brushes = [0, 1, 2].map((variant) => {
        const c = make();
        const b = c.getContext('2d');
        b.fillStyle = '#808080';
        b.fillRect(0, 0, w, h);
        const rr = rng(300 + variant);
        b.lineCap = 'round';
        for (let i = 0; i < 5200; i++) {
            const v = 92 + Math.floor(rr() * 72);
            b.strokeStyle = `rgba(${v},${v},${v},${0.18 + rr() * 0.22})`;
            b.lineWidth = (3 + rr() * 9) * k;
            const x = rr() * w, y = rr() * h, a = (rr() - 0.5) * 0.9 + (rr() < 0.25 ? Math.PI / 2 : 0), l = (16 + rr() * 60) * k;
            b.beginPath();
            b.moveTo(x, y);
            b.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + (rr() - 0.5) * 8 * k, y + Math.sin(a) * l * 0.5 + (rr() - 0.5) * 8 * k, x + Math.cos(a) * l, y + Math.sin(a) * l);
            b.stroke();
        }
        return c;
    });
    return { grain, brushes };
}
