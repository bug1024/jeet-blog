// Outro: four short looks back (the seam, those nights, the bridge, the old threshold), then the road.
// 山路转过几道弯: I stand at the top of the slope in the wind. 回头你还在后面: I turn my head; he is still coming up
// behind, his head and shoulders over the long grass, my brother with him. We go on; the picture goes with the music.
// No closing caption.
import { W, H, clamp, lerp, range, E, mix, noise } from './core.js';
import { C } from './design.js';
import { paperBase, paint, shape, ellipsePts, line } from './gouache.js';
import { CAST, drawFigure, gait, groundShadow, stand, walkPlan, walkStartX, stepBlend } from './figure.js';
import { landLayers, ground } from './land.js';
import { makeShot, drawShot } from './shot.js';
import { hem, hemShot } from './scene-chorus.js';
import { flatOutside, FLAT } from './scene-county.js';
import { draw as thresholdDraw, DOOR_SHOT } from './scene-threshold.js';

const bridgeShot = makeShot({
    from: 229.4, to: 231.0,
    cam: (T) => ({ cx: lerp(1960, 1990, range(T, 229.4, 231)), cy: 700, z: 1.05 }),
    layers: landLayers({ warm: 0.25 }),
});

// ---------- the crest ----------
const CREST = 3640, LOOK = 236.95;
const meTop = stand(CAST.me, 88, CREST, ground(CREST), 1, { lean: 0.02, arms: [{ a: 0.05, e: 0.2 }, { a: -0.05, e: 0.2 }] });
meTop.legs.forEach((l) => { l.ankle[1] = ground(l.ankle[0]) - 0.04 * 88; });
const meOn = walkPlan(CAST.me, 88, walkStartX(CAST.me, 88, meTop), 4400, 240.4, 62);
function crestPeople(c, T) {
    // Father and brother coming up the slope, slowly; the long grass hides their legs.
    const fx = 3190 + 52 * (T - 233);
    for (const [cast, h, x, seed] of [[CAST.brother, 98, fx + 60, 23], [CAST.fatherTeacher, 125, fx, 37]]) {
        const p = gait(cast, h, x, { x0: 0, f: 1, ground, look: -0.05, stride: 0.56 });
        drawFigure(c, cast, h, p, seed);
    }
    let mp;
    const sway = Math.sin(T * 1.3) * 0.02;
    if (T < meOn.t0) mp = { ...meTop, lean: 0.02 + sway, neck: -0.04, headBack: E.inOut(range(T, LOOK, LOOK + 0.35)) * (1 - E.inOut(range(T, LOOK + 2.6, LOOK + 2.95))) };
    else if (T < meOn.t0 + 0.35) mp = stepBlend(meTop, meOn.pose(T, ground), range(T, meOn.t0, meOn.t0 + 0.35), 88, 0);
    else mp = meOn.pose(T, ground);
    groundShadow(c, mp, 88, 0.18);
    drawFigure(c, CAST.me, 88, mp, 11);
}
// Long grass along the last stretch of slope below the crest.
function longGrass(ctx) {
    // A few soft clumps, then many blades: tall enough to reach a man's waist.
    for (let x = 3090; x < 3570; x += 58) {
        const y = ground(x), r = noise(x * 0.13, 61);
        if (r < 0.35) continue;
        paint(ctx, shape(ellipsePts(x + r * 20, y - 18 - r * 10, 30 + r * 16, 26 + r * 12, 12), 600 + x, 4, 2), mix('#6E8460', '#93A274', r), { seed: x, angle: 1.4, tex: 0.8, edge: 0.1, alpha: 0.9 });
    }
    for (let x = 3070; x < 3590; x += 2.6) {
        const y = ground(x) + 4, h = 48 + noise(x * 0.37, 62) * 34, lean = (noise(x * 0.11, 64) - 0.5) * 16;
        line(ctx, [[x, y], [x + lean * 0.4, y - h * 0.55], [x + lean, y - h]], ['#6F845C', '#8E9E70', '#A9B285', '#7B8D63'][Math.floor(noise(x, 63) * 4)], 1.1, { amp: 0, alpha: 0.9 });
    }
}
function fadeOut(ctx, T) {
    const out = E.inOut(range(T, 253.5, 259.6));
    if (out > 0) { ctx.globalAlpha = out; paperBase(ctx, C.paper); }
}
const crestShot = makeShot({
    from: 233.0, to: 259.9,
    cam: (T) => {
        const k = E.inOut(range(T, 240.8, 252));
        const cx0 = lerp(3490, 3530, range(T, 233, 240.8));
        return { cx: lerp(cx0, 3900, k), cy: lerp(ground(cx0) - 58, 470, k), z: lerp(2.5, 0.6, k) };
    },
    layers: landLayers({ warm: 0.4, people: crestPeople, front: [{ p: 1, draw: longGrass }, { screen: true, live: true, draw: fadeOut }] }),
});

const low = () => ({ x: 960, y: 1000, align: 'center' });
export const SEGMENTS = [
    { from: 226.0, to: 228.1, fade: 0.8, shot: hemShot, draw: (c, T) => hem(c, 74.5 + (T - 226)), grade: { warm: 0.1 }, lyric: low },
    { from: 227.7, to: 229.8, fade: 0.4, shot: FLAT, draw: (c, T) => flatOutside(c, 113.5 + (T - 227.7)), grade: { warm: 0.05 }, lyric: () => ({ ...low(), color: '#F2EADB', halo: '#2E3A4C' }) },
    { from: 229.4, to: 231.0, fade: 0.4, shot: bridgeShot, draw: (c, T) => drawShot(c, bridgeShot, T), grade: { warm: 0.15, sat: 0.9 }, lyric: low },
    { from: 230.6, to: 233.6, fade: 0.4, shot: DOOR_SHOT, draw: (c, T) => thresholdDraw(c, 181.6 + (T - 230.6) * 0.4), grade: { sat: 0.55, warm: -0.15 }, lyric: low },
    { from: 233.0, to: 259.9, fade: 0.8, shot: crestShot, draw: (c, T) => drawShot(c, crestShot, T), grade: { warm: 0.3, sat: 0.85 }, lyric: () => ({ x: 150, y: 180, align: 'left' }) },
];
