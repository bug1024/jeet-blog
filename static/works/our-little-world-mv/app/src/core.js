// Shared math: deterministic random, noise, easing, colour, and the song's beat grid.
import { BEAT, BEAT0 } from './design.js';

export const W = 1920;
export const H = 1080;
// Stage → canvas scale: 1 draws at 1920 × 1080; the player uses 2/3 (1280 × 720) on phones and small windows.
// Code that needs a clean transform calls resetT(ctx) instead of setTransform(1, 0, 0, 1, 0, 0).
export const view = { s: 1 };
export const resetT = (ctx) => ctx.setTransform(view.s, 0, 0, view.s, 0, 0);

export function rng(seed) {
    let a = (seed * 2654435761) >>> 0 || 1;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
function hash(i, seed) {
    let h = (Math.imul(i, 374761393) + Math.imul(seed, 668265263)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
export function noise(x, seed = 0) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return hash(i, seed) + (hash(i + 1, seed) - hash(i, seed)) * u;
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const range = (v, a, b) => clamp((v - a) / (b - a));
export const mixPt = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

// Motion curves from the design system.
export const E = {
    // A paper piece pushed by hand: quick start, long soft landing.
    slide: (t) => { t = clamp(t); return 1 - Math.pow(1 - t, 3.6); },
    settle: (t) => { t = clamp(t); return 0.5 - Math.cos(Math.PI * t) / 2; },
    page: (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    linear: (t) => clamp(t),
};
// Progress of a move between two song times with a curve.
export const move = (T, a, b, curve = E.slide) => curve(range(T, a, b));

// Beat grid: beat(n) is the time of beat n; snap(t) the nearest beat at or after t.
export const beat = (n) => BEAT0 + n * BEAT;
export const beatIndex = (t) => Math.round((t - BEAT0) / BEAT);
export const snap = (t) => beat(Math.ceil((t - BEAT0) / BEAT - 0.02));
// 0..1 pulse that peaks on every beat; used sparingly for breathing light.
export function pulse(T, sharp = 6) {
    const phase = ((((T - BEAT0) / BEAT) % 1) + 1) % 1;
    return Math.exp(-sharp * phase);
}

const cache = new Map();
function rgb(c) {
    let v = cache.get(c);
    if (!v) { const n = parseInt(c.slice(1), 16); v = [n >> 16, (n >> 8) & 255, n & 255]; cache.set(c, v); }
    return v;
}
export function mix(a, b, t) {
    const x = rgb(a), y = rgb(b);
    const c = x.map((v, i) => Math.round(lerp(v, y[i], clamp(t))));
    return `#${((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1)}`;
}
export const rgba = (c, a) => { const [r, g, b] = rgb(c); return `rgba(${r},${g},${b},${a})`; };

// Stage camera: centre (cx, cy) of the world shown at zoom z.
export function camera(ctx, cx = W / 2, cy = H / 2, z = 1) {
    ctx.translate(W / 2, H / 2);
    ctx.scale(z, z);
    ctx.translate(-cx, -cy);
}
