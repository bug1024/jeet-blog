// A shot is a stack of layers seen through one camera. Still layers are painted once into their own bitmap and
// afterwards only moved; live layers (people, smoke, light) are painted every frame. This is what lets the film
// play in a browser in real time: the heavy brushwork happens once per shot, not thirty times a second.
//
// spec: {
//   from, to,                     song time the shot is on screen
//   cam(T) -> { cx, cy, z },      the camera on the world (z = zoom)
//   ref: { cx, cy },              the point parallax layers turn around (default: the camera at `from`)
//   layers: [{ p, screen, live, draw(ctx, T) }]  bottom to top. p = parallax (1 = the world itself, 0 = fixed),
//                                 screen = painted in frame coordinates, live = repainted every frame
// }
import { W, H, view, resetT, camera } from './core.js';

const MAX_SIDE = 4096, MAX_PIXELS = 12e6;   // at full resolution; scaled down with the canvas

function layerView(spec, c, p) {
    const ref = spec.ref || spec._ref;
    return { cx: ref.cx + (c.cx - ref.cx) * p, cy: ref.cy + (c.cy - ref.cy) * p, z: 1 + (c.z - 1) * p };
}

export function makeShot(spec) {
    spec._ref = spec.cam(spec.from);
    spec._cache = new Map();
    return spec;
}

// The world rectangle a layer shows over the whole shot, and the resolution it needs at its closest.
function extent(spec, p) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, zMax = 0;
    for (let T = spec.from; T <= spec.to + 0.001; T += 0.2) {
        const v = layerView(spec, spec.cam(Math.min(T, spec.to)), p);
        const hw = W / 2 / v.z, hh = H / 2 / v.z;
        x0 = Math.min(x0, v.cx - hw); x1 = Math.max(x1, v.cx + hw);
        y0 = Math.min(y0, v.cy - hh); y1 = Math.max(y1, v.cy + hh);
        zMax = Math.max(zMax, v.z);
    }
    const m = 24 / zMax;
    return { x: x0 - m, y: y0 - m, w: x1 - x0 + 2 * m, h: y1 - y0 + 2 * m, z: zMax };
}

function build(spec, i) {
    const L = spec.layers[i];
    const c = document.createElement('canvas');
    const g = c.getContext('2d');
    if (L.screen) {
        c.width = Math.round(W * view.s); c.height = Math.round(H * view.s);
        resetT(g);
        L.draw(g, spec.from);
        return { c, screen: true, s: view.s };
    }
    const r = extent(spec, L.p ?? 1);
    let k = r.z * view.s;
    const side = Math.min(16384, MAX_SIDE * Math.max(1, view.s));
    k = Math.min(k, side / r.w, side / r.h, Math.sqrt((MAX_PIXELS * view.s * view.s) / (r.w * r.h)));
    c.width = Math.ceil(r.w * k); c.height = Math.ceil(r.h * k);
    g.setTransform(k, 0, 0, k, -r.x * k, -r.y * k);
    L.draw(g, spec.from);
    return { c, r, s: view.s };
}

// Paint any still layer not yet cached. budget: how many to paint now (the player spreads them over idle frames).
export function prepare(spec, budget = Infinity) {
    let n = 0;
    spec.layers.forEach((L, i) => {
        if (L.live || n >= budget) return;
        const have = spec._cache.get(i);
        if (have && have.s === view.s) return;
        spec._cache.set(i, build(spec, i));
        n++;
    });
    return spec.layers.every((L, i) => L.live || (spec._cache.get(i) && spec._cache.get(i).s === view.s));
}
export function release(spec) { spec._cache.clear(); }

export function drawShot(ctx, spec, T) {
    prepare(spec);
    const c = spec.cam(T);
    spec.layers.forEach((L, i) => {
        resetT(ctx);
        if (L.live) {
            if (!L.screen) { const v = layerView(spec, c, L.p ?? 1); camera(ctx, v.cx, v.cy, v.z); }
            ctx.save();
            L.draw(ctx, T, c);
            ctx.restore();
            return;
        }
        const k = spec._cache.get(i);
        if (k.screen) { ctx.drawImage(k.c, 0, 0, W, H); return; }
        const v = layerView(spec, c, L.p ?? 1);
        camera(ctx, v.cx, v.cy, v.z);
        ctx.drawImage(k.c, k.r.x, k.r.y, k.r.w, k.r.h);
    });
    resetT(ctx);
}
