// 周五放了学: the whole way home, mostly from far away. The land is still and the people are small;
// in the bridge only their heads pass the windows. I am always in front; my sister, the tallest of us children,
// just behind me, then my brother, then him.
import { lerp, range, E } from './core.js';
import { CAST, drawFigure, gait, groundShadow } from './figure.js';
import { landLayers, ground, BRIDGE } from './land.js';
import { makeShot, drawShot } from './shot.js';
import { paint, block, rectPts, shadow } from './gouache.js';

export const SIZE = { me: 88, brother: 98, sister: 108, father: 125 };
const CASTS = { me: CAST.me, brother: CAST.brother, sister: CAST.sister, father: CAST.fatherTeacher };
const SEED = { me: 11, sister: 29, brother: 23, father: 37 };

// The four of us from a lead position x (mine) and seconds walked dt: the others fall a little further behind.
export function walkers(x, dt, grow = 0) {
    const list = [['father', x - 178 - 4 * dt], ['brother', x - 120 - 3 * dt], ['sister', x - 62 - 2 * dt], ['me', x]];
    return (ctx) => {
        for (const [who, xx] of list) {
            const h = SIZE[who] * (who === 'father' ? 1 : 1 + grow);
            const pose = gait(CASTS[who], h, xx, { x0: 0, f: 1, ground, look: who === 'me' ? 0.02 : 0.08 });
            if (xx < BRIDGE.x0 - 20 || xx > BRIDGE.x1 + 20) groundShadow(ctx, pose, h, 0.16);
            drawFigure(ctx, CASTS[who], h, pose, SEED[who]);
        }
    };
}
const lead = (x0, t0, v) => (T) => x0 + v * (T - t0);

// Village windows coming on at dusk.
export function lamps(k) {
    return (ctx) => {
        if (k <= 0) return;
        for (const [x, s] of [[4880, 0.95], [5080, 1.1], [5300, 0.9]]) {
            const y = ground(x) + 6;
            paint(ctx, block(rectPts(x + 34 * s, y - 70 * s, 26 * s, 24 * s), 900 + x, 0.4, 2), '#F2C47C', { alpha: k, tex: 0.3, edge: 0 });
            ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, x + 47 * s, y - 58 * s, 60 * s, 40 * s, 0.3 * k, '#F2C47C'); ctx.restore();
        }
    };
}

const shots = [
    // The whole way at once: school on the left ridge, the bridge in the valley, home over the far ridge.
    makeShot({
        from: 43.6, to: 51.0,
        cam: (T) => ({ cx: lerp(2450, 2320, range(T, 43.6, 51)), cy: lerp(520, 540, range(T, 43.6, 51)), z: lerp(0.345, 0.38, E.inOut(range(T, 43.6, 51))) }),
        layers: landLayers({ warm: 0.1, people: (c, T) => walkers(lead(40, 44.05, 92)(T), T - 44.05)(c) }),
    }),
    // The bridge from the side, still. We go in at one end; heads pass along the windows.
    makeShot({
        from: 50.4, to: 58.2,
        cam: (T) => ({ cx: lerp(1960, 1985, range(T, 50.4, 58.2)), cy: 700, z: lerp(1.1, 1.14, range(T, 50.4, 58.2)) }),
        layers: landLayers({ warm: 0.2, people: (c, T) => walkers(lead(1360, 50.4, 140)(T), T - 50.4)(c) }),
    }),
    // Over the ridge as the light goes.
    makeShot({
        from: 57.6, to: 65.0,
        cam: (T) => ({ cx: lerp(3560, 3920, E.inOut(range(T, 57.6, 65))), cy: lerp(430, 470, range(T, 57.6, 65)), z: lerp(0.72, 0.62, E.inOut(range(T, 57.6, 65))) }),
        layers: landLayers({ warm: 0.45, people: (c, T) => walkers(lead(3330, 57.6, 82)(T), T - 57.6)(c) }),
    }),
    // The whole way again, small and far, the village windows lit.
    makeShot({
        from: 64.4, to: 72.4,
        cam: (T) => ({ cx: lerp(2600, 2720, range(T, 64.4, 72.4)), cy: 540, z: lerp(0.36, 0.38, E.inOut(range(T, 64.4, 72.4))) }),
        layers: landLayers({ warm: 0.65, people: (c, T) => walkers(lead(4330, 64.4, 70)(T), T - 64.4)(c), live: [{ p: 1, live: true, draw: (c, T) => lamps(range(T, 66, 69))(c) }] }),
    }),
];

const sky = () => ({ x: 150, y: 180, align: 'left' });
export const SEGMENTS = shots.map((s, i) => ({
    from: s.from, to: s.to, fade: i ? 0.9 : 1.0, shot: s,
    draw: (c, T) => drawShot(c, s, T),
    grade: [{ warm: 0.05, sat: 0.88 }, { warm: 0.1, sat: 0.88 }, { warm: 0.35, sat: 0.8 }, { warm: 0.5, sat: 0.75, light: -0.06 }][i],
    lyric: sky,
}));
