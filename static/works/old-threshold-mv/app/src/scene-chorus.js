// The three choruses. Each looks back at the seam and the road differently; never a replay.
//   1: the hem with its seam, standing on the stone path; at a bridge window; the same road through four seasons.
//   2: the hem fitting at night; sitting out the rain in the bridge; waiting on the ridge at dusk.
//   3: now, the two of us grown and grey: on the road, on the bench in the bridge, and far away on the ridge.
import { lerp, range, E, clamp, noise } from './core.js';
import { CAST, drawFigure, gait, groundShadow, walkPlan, walkStartX, stepBlend, standOn, stand, joints } from './figure.js';
import { landLayers, interiorLayers, ground, BRIDGE } from './land.js';
import { makeShot, drawShot } from './shot.js';
import { line } from './gouache.js';
import { FITTING } from './scene-sewing.js';
import { walkers } from './scene-path.js';

const deck = BRIDGE.deck, seatY = deck - 38;
const sitPose = (cast, h, x, swing, neck = 0.05, lean = 0.12) => {
    const p = {
        x, y: seatY - 3, f: 1, lean, neck,
        legs: [{ ankle: [x + 0.2 * h + swing, deck - 0.04 * h - (cast.p.kid ? 4 : 0)], rot: 0 }, { ankle: [x + 0.17 * h - swing * 0.6, deck - 0.04 * h], rot: 0 }],
        arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }],
    };
    const J = joints(cast, h, p);
    p.arms = [{ hand: [J.legs[0].knee[0] - 4, J.legs[0].knee[1] + 4], grip: 0.7 }, { hand: [J.legs[1].knee[0], J.legs[1].knee[1] + 6], grip: 0.7 }];
    return p;
};

// ---------- 1 ----------
// 1a. Close and low: me standing on the stone path, the seam on my hem; grass moving.
const HEM_X = 600;
function grass(ctx, T) {
    for (let k = 0; k < 60; k++) {
        const x = HEM_X - 60 + k * 2.1 + noise(k * 1.7, 4) * 2, y = ground(x) + 3, h = 4 + noise(k * 3.1, 5) * 9;
        const sway = Math.sin(T * 1.6 + k * 0.45) * 1.4;
        line(ctx, [[x, y], [x + sway * 0.4, y - h * 0.5], [x + sway, y - h]], ['#6F845C', '#8E9E70', '#A9B285'][k % 3], 0.4, { amp: 0, alpha: 0.9 });
    }
}
export const hemShot = makeShot({
    from: 71.2, to: 78.5,
    cam: (T) => ({ cx: lerp(HEM_X + 3, HEM_X - 2, range(T, 71.2, 78.5)), cy: ground(HEM_X) - 14, z: lerp(18, 18.8, range(T, 71.2, 78.5)) }),
    layers: landLayers({
        warm: 0.15,
        people: (c, T) => {
            const p = stand(CAST.me, 88, HEM_X, ground(HEM_X), 1, { lean: 0.02, arms: [{ a: 0.05, e: 0.2 }, { a: -0.05, e: 0.2 }] });
            p.legs.forEach((l) => { l.ankle[1] = ground(l.ankle[0]) - 0.04 * 88; });
            groundShadow(c, p, 88, 0.2);
            drawFigure(c, CAST.me, 88, p, 11);
        },
        live: [{ p: 1, live: true, draw: grass }],
    }),
});
export const hem = (c, T) => drawShot(c, hemShot, clamp(T, 71.2, 78.5));

// 1b. A summer day in the bridge: resting on the long bench, father fanning himself, us swinging our legs.
const windowShot = makeShot({
    from: 77.9, to: 85.9,
    cam: (T) => ({ cx: lerp(2000, 2012, range(T, 77.9, 85.9)), cy: deck - 80, z: 3.1 }),
    layers: interiorLayers({
        warm: 0.1,
        people: (c, T) => {
            const fp = sitPose(CAST.fatherTeacher, 125, 1815, 0, -0.05, 0.08);
            const J = joints(CAST.fatherTeacher, 125, fp);
            const fan = Math.sin(T * 5) * 10;
            fp.arms[0] = { hand: [J.head[0] + 22, J.head[1] + 30 + fan], grip: 0.2 };
            drawFigure(c, CAST.fatherTeacher, 125, fp, 37);
            drawFigure(c, CAST.sister, 108, sitPose(CAST.sister, 108, 1918, Math.sin(T * 1.7 + 2) * 4, 0.08), 29);
            drawFigure(c, CAST.brother, 98, sitPose(CAST.brother, 98, 2055, Math.sin(T * 2.1) * 6, 0.05), 23);
            drawFigure(c, CAST.me, 88, sitPose(CAST.me, 88, 2125, Math.sin(T * 3.2 + 1) * 10, -0.1), 11);
        },
    }),
});

// 1c. Year after year: the same stretch of road through summer, autumn, winter, spring; the children a little taller
// each time. Then far away.
const SEASON_T = [86.0, 88.4, 90.8, 93.2];
const yearShots = SEASON_T.map((t0, i) => makeShot({
    from: t0, to: t0 + 2.8,
    cam: (T) => ({ cx: 2860 + (T - t0) * 20, cy: ground(2860) - 120, z: 0.86 }),
    layers: landLayers({ warm: 0.12, season: i, people: (c, T) => walkers(2700 + 88 * (T - t0) + i * 50, T - t0, i * 0.04)(c) }),
}));
const farShot = makeShot({
    from: 95.6, to: 101.8,
    cam: (T) => { const k = E.inOut(range(T, 95.6, 101)); return { cx: lerp(3100, 2700, k), cy: lerp(ground(3100) - 120, 540, k), z: lerp(0.86, 0.36, k) }; },
    layers: landLayers({ warm: 0.15, people: (c, T) => walkers(3060 + 80 * (T - 95.6), T - 95.6, 0.16)(c) }),
});

// ---------- 2 ----------
// 2b. A rainy day, from outside: the bridge in the rain, and four heads in its windows, waiting it out.
function rainAll(ctx, T) {
    ctx.strokeStyle = 'rgba(236,240,240,0.4)';
    ctx.lineWidth = 1.3;
    for (let k = 0; k < 320; k++) {
        const x = (k * 97.3) % 1980 - 30, y = ((k * 53.7 + T * 1100) % 1200) - 120;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 7, y + 38); ctx.stroke();
    }
    // Rings where drops hit the stream.
}
const shelterShot = makeShot({
    from: 134.2, to: 141.6,
    cam: (T) => ({ cx: 1975 + (T - 134.2) * 2, cy: 710, z: lerp(1.12, 1.15, range(T, 134.2, 141.6)) }),
    layers: landLayers({
        warm: 0, glints: false,
        people: (c, T) => {
            drawFigure(c, CAST.fatherTeacher, 125, sitPose(CAST.fatherTeacher, 125, 1870, 0, 0.0), 37);
            drawFigure(c, CAST.sister, 108, sitPose(CAST.sister, 108, 1975, Math.sin(T * 1.1 + 1) * 3, 0.1), 29);
            drawFigure(c, CAST.brother, 98, sitPose(CAST.brother, 98, 2050, Math.sin(T * 1.3) * 3, 0.12), 23);
            drawFigure(c, CAST.me, 88, sitPose(CAST.me, 88, 2120, Math.sin(T * 3.4) * 9, -0.05), 11);
        },
        front: [{ screen: true, live: true, draw: rainAll }],
    }),
});

// 2c. Dusk on the ridge: I get to the top first and wait, and look back; when he reaches me we go on together.
const meUp = walkPlan(CAST.me, 88, 3150, 3610, 141.0, 90);
const meUpEnd = meUp.pose(meUp.t1, ground);
const meStand = standOn(CAST.me, 88, meUpEnd, meUpEnd.legs[0].ankle[0] > meUpEnd.legs[1].ankle[0] ? 0 : 1);
const meOn = walkPlan(CAST.me, 88, walkStartX(CAST.me, 88, meStand), 4300, 149.4, 78);
function duskPeople(c, T) {
    const fx = 2985 + 80 * (T - 141), bx = fx + 46;
    let mp;
    if (T < meUp.t1) mp = meUp.pose(T, ground);
    else if (T < meUp.t1 + 0.35) mp = stepBlend(meUpEnd, meStand, range(T, meUp.t1, meUp.t1 + 0.35), 88, 1);
    else if (T < meOn.t0) mp = { ...meStand, headBack: E.inOut(range(T, 147.7, 148.2)) * (1 - E.inOut(range(T, 149.0, 149.4))) };
    else if (T < meOn.t0 + 0.35) mp = stepBlend(meStand, meOn.pose(T, ground), range(T, meOn.t0, meOn.t0 + 0.35), 88, 0);
    else mp = meOn.pose(T, ground);
    for (const [cast, h, x, seed] of [[CAST.fatherTeacher, 125, fx, 37], [CAST.brother, 98, bx - 110, 23], [CAST.sister, 108, fx - 130, 29]]) {
        const p = gait(cast, h, x, { x0: 0, f: 1, ground, look: 0.06 });
        groundShadow(c, p, h, 0.18);
        drawFigure(c, cast, h, p, seed);
    }
    groundShadow(c, mp, 88, 0.18);
    drawFigure(c, CAST.me, 88, mp, 11);
}
const duskShot = makeShot({
    from: 141.0, to: 156.6,
    cam: (T) => { const k = E.inOut(range(T, 151.5, 156)); const fx = 3200 + 40 * clamp(T - 141, 0, 10); return { cx: lerp(fx + 260, 4200, k), cy: lerp(ground(fx + 260) - 110, 520, k), z: lerp(1.05, 0.5, k) }; },
    layers: landLayers({ warm: 0.65, season: 0.9, people: duskPeople }),
});

// ---------- 3: now ----------
const ADULT = { me: CAST.meAdult, dad: CAST.fatherOld };
function pair(x, dt) {
    return (c) => {
        for (const [cast, h, xx, seed, look] of [[ADULT.dad, 118, x - 70 - 2 * dt, 41, 0.1], [ADULT.me, 124, x, 13, 0.03]]) {
            const p = gait(cast, h, xx, { x0: 0, f: 1, ground, look, stride: 0.56 });
            if (xx < BRIDGE.x0 - 20 || xx > BRIDGE.x1 + 20) groundShadow(c, p, h, 0.18);
            drawFigure(c, cast, h, p, seed);
        }
    };
}
const nowPathShot = makeShot({
    from: 197.1, to: 205.3,
    cam: (T) => ({ cx: lerp(1150, 1220, range(T, 197.1, 205.3)), cy: ground(1150) - 150, z: 0.8 }),
    layers: landLayers({ warm: 0.2, season: 1.1, people: (c, T) => pair(940 + 56 * (T - 197.1), T - 197.1)(c) }),
});
// The bench again, years on: the two of us sitting where the three of us sat out the rain.
const nowBenchShot = makeShot({
    from: 204.7, to: 212.0,
    cam: (T) => ({ cx: 2100 + (T - 204.7) * 2, cy: deck - 80, z: 3.0 }),
    layers: interiorLayers({
        warm: 0.25,
        people: (c, T) => {
            drawFigure(c, ADULT.dad, 118, sitPose(ADULT.dad, 118, 2030, 0, 0.05 + Math.sin(T * 0.5) * 0.02, 0.18), 41);
            drawFigure(c, ADULT.me, 124, sitPose(ADULT.me, 124, 2140, 0, -0.04), 13);
        },
    }),
});
const nowRidgeShot = makeShot({
    from: 211.4, to: 226.8,
    cam: (T) => { const k = E.inOut(range(T, 214, 226)); const x = 3330 + 50 * (T - 211.4); return { cx: lerp(x + 60, 2900, k), cy: lerp(ground(x) - 130, 470, k), z: lerp(0.9, 0.3, k) }; },
    layers: landLayers({ warm: 0.3, season: 3.3, people: (c, T) => pair(3330 + 50 * (T - 211.4), T - 211.4)(c) }),
});

const sky = () => ({ x: 150, y: 180, align: 'left' });
const inside = () => ({ x: 150, y: 140, align: 'left' });
const seg = (shot, o) => ({ from: shot.from, to: shot.to, shot, draw: (c, T) => drawShot(c, shot, T), fade: 0.9, lyric: sky, ...o });
export const SEGMENTS = [
    seg(hemShot, { fade: 1.0, grade: { warm: 0.1 } }),
    seg(windowShot, { grade: { warm: 0.12 }, lyric: inside }),
    ...yearShots.map((s, i) => seg(s, { fade: i ? 0.5 : 0.9, grade: { warm: 0.08, sat: 0.9 } })),
    seg(farShot, { fade: 0.5, grade: { warm: 0.1, sat: 0.9 } }),
    seg(FITTING, { fade: 1.0, grade: { warm: 0.15 }, lyric: () => ({ x: 1200, y: 200, align: 'left', color: '#F2EADB', halo: '#3C3530' }) }),
    seg(shelterShot, { grade: { sat: 0.6, warm: -0.15, light: -0.08 } }),
    seg(duskShot, { grade: { warm: 0.45, sat: 0.8, light: -0.06 } }),
    seg(nowPathShot, { fade: 1.2, grade: { warm: 0.1, sat: 0.9 } }),
    seg(nowBenchShot, { grade: { warm: 0.12 }, lyric: inside }),
    seg(nowRidgeShot, { grade: { warm: 0.15, sat: 0.9 } }),
];
