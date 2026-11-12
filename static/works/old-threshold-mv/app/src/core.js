// Shared math: deterministic random, noise, easing, colour, camera.
export const W = 1920;
export const H = 1080;
// Output scale: the stage is always 1920 x 1080 units; the canvas may be smaller (1280 wide on phones).
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
// Smooth 1D value noise in 0..1.
export function noise(x, seed = 0) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return hash(i, seed) + (hash(i + 1, seed) - hash(i, seed)) * u;
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const range = (v, a, b) => clamp((v - a) / (b - a));
export const mixPt = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const frac = (x) => x - Math.floor(x);

// Motion curves. Everything human eases in and out; nothing snaps.
export const E = {
    inOut: (t) => { t = clamp(t); return t * t * (3 - 2 * t); },
    soft: (t) => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); },
    out: (t) => { t = clamp(t); return 1 - Math.pow(1 - t, 3); },
    in: (t) => { t = clamp(t); return t * t * t; },
    linear: (t) => clamp(t),
};
export const move = (T, a, b, curve = E.inOut) => curve(range(T, a, b));

const cache = new Map();
export function rgb(c) {
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

// Stage camera: world point (cx, cy) at the centre of the frame, zoom z.
export function camera(ctx, cx = W / 2, cy = H / 2, z = 1) {
    ctx.translate(W / 2, H / 2);
    ctx.scale(z, z);
    ctx.translate(-cx, -cy);
}
