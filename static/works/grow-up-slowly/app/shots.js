// Shot list for 慢一点长大, cut to the LRC timings. Each shot is drawn from (ctx, lt, u, T):
// lt = seconds since the shot began, u = 0..1 through the shot, T = song time.
// "in" is the dissolve into the shot in seconds (0 = a straight cut on the line).
import { W, H, S, lerp, mix, clamp, range, smooth, ease, easeOut, camera, sway, rng, fill, dab, rect, glow, vgrad, particles, mottle, grass, sky, rgba } from './paint.js';
import { GIRL, DAD, MUM, BOY, FRIEND, pose, blend, run, walk, POSES, figure, place, girlBack, dadBack, hand } from './figures.js';
import { beetle, butterfly, bird, flower, bouquet, hat, helmet, drawing, boxFire, lamp } from './props.js';
import { LIGHT, trackSide, playgroundWide, trackPoint, mountains, downhill, macroGrass, meadow, branchSky, bedroom, seasons, tableRoom, livingRoom, hallway, nightHouse, corner, downhillPath } from './sets.js';

// Characters move on twos, like hand-drawn animation; the camera and the wind stay smooth.
const q = (T) => Math.floor(T * 12) / 12;
const girlRun = (T, amt = 1, extra = {}) => run(q(T) * 10.5, amt, extra);
const dadRun = (T, amt = 0.85, extra = {}) => run(q(T) * 7.6, amt, { mouth: 'smile', ...extra });
const blink = (T, eyes = 'open') => (T % 3.7 < 0.12 ? 'closed' : eyes);

// ---------- The playground ----------

function playgroundOpen(ctx, lt, u, T, o = {}) {
    const z = lerp(o.z0 ?? 1.0, o.z1 ?? 1.14, ease(u));
    const [sx, sy] = sway(T, 4);
    camera(ctx, lerp(960, 1010, ease(u)) + sx, lerp(540, 560, ease(u)) + sy, z);
    const set = playgroundWide(ctx, { light: o.light || 'dusk', T });
    const [gx, gy, gs] = trackPoint(0.6, 0.5);
    const gp = pose({ back: true, shF: 0.25, elF: 0.4, shB: -0.25, elB: 0.3, wind: 0.9, eyes: blink(T, 'open'), mouth: 'smile' });
    figure(ctx, GIRL, o.girl ? o.girl(lt) : gp, gx, gy, gs, 1);
    const [dx, dy, ds] = trackPoint(0.07 + u * 0.06, 0.62);
    figure(ctx, DAD, walk(q(T) * 5, 0.7), dx, dy, ds, 1);
    set.after();
}

function trackRun(ctx, lt, u, T, o = {}) {
    const speed = o.speed ?? 330;
    const scroll = T * speed;
    const [sx, sy] = sway(T, 7);
    camera(ctx, (o.cx ?? 960) + sx, (o.cy ?? 560) + sy, o.z ?? 1.04);
    const set = trackSide(ctx, { scroll, light: o.light || 'dusk', horizon: 600, T });
    const g = set.ground;
    const dadX = o.dadX ? o.dadX(lt) : 620 + Math.sin(T * 0.6) * 40;
    figure(ctx, DAD, dadRun(T, 0.85, o.dadPose || {}), dadX, g + 34, 2.3, 1);
    const gx = o.girlX ? o.girlX(lt) : 1160 + Math.sin(T * 0.8) * 30;
    figure(ctx, GIRL, o.girlPose ? o.girlPose(lt) : girlRun(T, 1, { mouth: 'open', eyes: 'happy' }), gx, g, 2.4, 1);
    set.after();
}

function waveBack(ctx, lt, u, T, o = {}) {
    const k = smooth(range(lt, 0.3, 1.1));
    const scroll = 15.23 * 330 + lt * lerp(300, 30, k);
    camera(ctx, 1120, 640, lerp(1.6, 1.72, u));
    const set = trackSide(ctx, { scroll, light: 'dusk', horizon: 600, T });
    const g = set.ground;
    const dadX = lerp(380, 760, easeOut(range(lt, 0.4, 4)));
    figure(ctx, DAD, dadRun(T, 0.8, { mouth: 'open' }), dadX, g + 34, 2.3, 1);
    const end = o.cup ? { ...POSES.cup, wind: 0.9, mouth: lt % 1.2 < 0.8 ? 'open' : 'smile' } : { ...POSES.wave(T), back: true, wind: 0.9, eyes: 'happy' };
    figure(ctx, GIRL, blend(girlRun(T, 1 - k * 0.8), end, k), 1170, g, 2.4, 1);
    set.after();
}

// Running together around the track, receding: the closing image.
function playgroundRecede(ctx, lt, u, T) {
    const z = lerp(1.32, 1.0, ease(range(u, 0, 0.85)));
    camera(ctx, lerp(1100, 960, ease(u)), lerp(620, 540, ease(u)), z);
    const set = playgroundWide(ctx, { light: 'dusk', T });
    const t = lerp(0.32, 0.92, easeOut(u));
    const [dx, dy, ds] = trackPoint(t - 0.02, 0.62);
    const [gx, gy, gs] = trackPoint(t + 0.015, 0.36);
    figure(ctx, DAD, dadRun(T, 0.7), dx, dy, ds, 1);
    figure(ctx, GIRL, girlRun(T, 0.9, { eyes: 'happy', mouth: 'open' }), gx, gy, gs, 1);
    set.after();
}

// ---------- Mountains ----------

function ridgeWalk(ctx, lt, u, T) {
    const e = ease(u);
    camera(ctx, lerp(620, 1500, e), lerp(640, 540, e), lerp(1.5, 1.0, e));
    const set = mountains(ctx, { T });
    const x = 230 + lt * 26;
    figure(ctx, DAD, walk(q(T) * 5.5, 0.8), x, set.crest(x) + 4, 0.95, 1, { shadowAlpha: 0.1 });
    const gxp = x + 70 + Math.sin(T * 2) * 4;
    figure(ctx, GIRL, walk(q(T) * 8, 1, { shF: 2.6, elF: 0.4 }), gxp, set.crest(gxp) + 4, 0.95, 1, { shadowAlpha: 0.1 });
}

function carryHome(ctx, lt, u, T) {
    const scroll = lt * 70;
    // Piggyback: Dad's hands reach back under her legs; she lies against his back, head on his shoulder.
    const dadP = walk(q(T) * 4.4, 0.6, { lean: 0.12, shF: -0.6, elF: 0.27, shB: -0.7, elB: 0.35 });
    const dx = 900;
    const zk = ease(range(u, 0.45, 1));
    const pre = downhillPath(scroll);
    const dPlace = place(DAD, dadP, dx, pre(dx), 2.0, 1);
    const hipAt = dPlace.toStage([-30, -20]);
    const girlP = pose({ lean: 0.35, tilt: 0.55, hipF: 1.3, kneeF: 1.5, hipB: 1.1, kneeB: 1.4, shF: 1.4, elF: 0.6, shB: 0.9, elB: 0.8, eyes: 'closed', mouth: 'smile', wind: 0.1 });
    const gPlace = place(GIRL, girlP, hipAt[0], hipAt[1], 2.0, 1, { anchor: 'hip' });
    const headAt = gPlace.toStage(gPlace.J.head);
    camera(ctx, lerp(940, headAt[0], zk), lerp(600, headAt[1] + 10, zk), lerp(1.12, 2.7, zk));
    const set = downhill(ctx, { scroll, T });
    const ground = set.path(dx);
    // Back to front: Dad's far arm, 75's body behind him, Dad, then her near leg and the arm over his shoulder, then his near arm.
    figure(ctx, DAD, dadP, dx, ground, 2.0, 1, { parts: ['armB'] });
    figure(ctx, GIRL, girlP, hipAt[0], hipAt[1], 2.0, 1, { anchor: 'hip', parts: ['armB', 'legB', 'torso', 'head'] });
    figure(ctx, DAD, dadP, dx, ground, 2.0, 1, { parts: ['legB', 'legF', 'torso', 'head'], shadow: false });
    figure(ctx, GIRL, girlP, hipAt[0], hipAt[1], 2.0, 1, { anchor: 'hip', parts: ['legF', 'armF'] });
    figure(ctx, DAD, dadP, dx, ground, 2.0, 1, { parts: ['armF'], shadow: false });
    particles(ctx, T, 'firefly', { count: 14, y0: 500, y1: 1000, alpha: 0.9 });
    set.after();
}

// ---------- Small creatures ----------

function beetleMacro(ctx, lt, u, T, o = {}) {
    camera(ctx, 960 + lt * 14, 560, 1.06);
    const set = macroGrass(ctx, { T });
    const bx = lerp(o.x0 ?? 480, o.x1 ?? 1220, u);
    beetle(ctx, bx, set.ground + 10, 2.7, q(T) * 11);
    set.after();
}

function crouchWatch(ctx, lt, u, T) {
    camera(ctx, 1000, 770, lerp(1.22, 1.32, u));
    const set = meadow(ctx, { light: 'gold', horizon: 560, T, flowers: 50, wind: 0.6, sunX: 1700 });
    const reach = smooth(range(lt, 1.3, 2.1)) * (1 - smooth(range(lt, 2.9, 3.5)));
    const base = { ...POSES.crouch, eyes: blink(T), mouth: reach > 0.3 ? 'o' : 'smile', wind: 0.4 };
    const p = blend(base, { ...base, shF: 1.25, elF: 0.15, lean: 0.75, tilt: 0.3 }, reach);
    p.eyes = blink(T); p.mouth = reach > 0.3 ? 'o' : lt > 3.6 ? 'smile' : 'flat';
    beetle(ctx, lerp(700, 760, u), 975, 0.62, q(T) * 8);
    figure(ctx, GIRL, p, 1150, 975, 4.2, -1);
    set.after();
}

function branchBirds(ctx, lt, u, T, o = {}) {
    camera(ctx, 960, lerp(o.cy0 ?? 650, o.cy1 ?? 470, ease(u)), 1.08);
    const set = branchSky(ctx, { T });
    const fly = o.flyAt ?? 2.2;
    const f = range(lt, fly, fly + 2.2);
    const [px, py] = set.perch;
    const bx = lerp(px, 2100, easeOut(f) * f), by = lerp(py - 22, 80, f) + Math.sin(f * 7) * 20 * f;
    bird(ctx, bx, by, 1.7, T, lt > fly ? 1 : 0);
    const bu = o.butterflyFrom ?? 0;
    const bt = range(lt, bu, bu + 4.2);
    butterfly(ctx, lerp(300, 1500, bt), lerp(1100, 260, bt) + Math.sin(T * 2.4) * 60, 2.8, T);
}

function smileUp(ctx, lt, u, T) {
    camera(ctx, 980, lerp(560, 520, u), 1.0);
    const set = meadow(ctx, { light: 'gold', horizon: 860, T, flowers: 0, wind: 0.7, sunX: 1650, far: true });
    particles(ctx, T, 'petal', { count: 26, alpha: 0.9, wind: 0.5 });
    const p = pose({ tilt: -0.42, eyes: 'happy', mouth: lt > 0.6 ? 'open' : 'smile', wind: 0.8, shF: 0.1, shB: 0 });
    figure(ctx, GIRL, p, 1240, 1640, 9.5, -1, { shadow: false });
    // Flowers close to the lens.
    const r = rng(9);
    for (let i = 0; i < 9; i++) {
        const x = 80 + i * 230 + r() * 60, b = smooth(range(lt, 0.2 + i * 0.25, 1.4 + i * 0.25));
        flower(ctx, x, 1180, 320 + r() * 200, b, ['#f2c3c9', '#fbe9dc', '#f2c45a'][i % 3], { tilt: Math.sin(T * 1.4 + i) * 0.2, size: 3.2 });
    }
}

// ---------- Wanting to win ----------

function race(ctx, lt, u, T) {
    const scroll = T * 380;
    camera(ctx, 1000, 600, 1.12);
    const set = trackSide(ctx, { scroll, light: 'day', horizon: 600, T });
    const g = set.ground;
    // Finish posts arrive near the end.
    const fx = 2300 - range(lt, 2.0, 4.7) * 1400;
    for (const dy of [-110, 120]) rect(ctx, fx - 6, g + dy - 160, 12, 160, '#f6efe4', 1, 300, 1);
    ctx.strokeStyle = '#e9727e'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(fx, g - 230); ctx.lineTo(fx, g - 10); ctx.stroke();
    const slow = smooth(range(lt, 3.6, 4.6));
    figure(ctx, FRIEND, run(q(T) * 10, 0.9), 820 - lt * 20, g - 40, 2.1, 1);
    figure(ctx, BOY, run(q(T) * 11, 1, { mouth: 'open' }), 1250 + lt * 50, g + 10, 2.3, 1);
    figure(ctx, GIRL, blend(girlRun(T, 1.15, { lean: 0.32, mouth: 'flat', eyes: 'cross' }), { ...walk(q(T) * 6, 0.6), mouth: 'pout', tilt: 0.25 }, slow), 1130 - slow * 140, g + 40, 2.4, 1);
    set.after();
}

function cornerAlone(ctx, lt, u, T) {
    camera(ctx, lerp(900, 820, u), lerp(600, 650, u), lerp(1.0, 1.22, ease(u)));
    corner(ctx, { T });
    const p = { ...POSES.down, shF: -0.3, elF: 0.6, shB: -0.38, elB: 0.6, eyes: T % 2.8 < 0.15 ? 'closed' : 'down', mouth: 'flat' };
    figure(ctx, GIRL, p, 760, 905, 2.7, 1, { shadowAlpha: 0.25 });
    figure(ctx, BOY, run(q(T) * 10, 0.7), 1500 - lt * 30, 980, 1.1, -1, { shadowAlpha: 0.1 });
    figure(ctx, FRIEND, run(q(T) * 10 + 1, 0.7), 1640 - lt * 30, 990, 1.1, -1, { shadowAlpha: 0.1 });
}

// ---------- Night ----------

function bedAlone(ctx, lt, u, T) {
    camera(ctx, lerp(960, 900, u), lerp(540, 590, u), lerp(1.0, 1.16, ease(u)));
    const set = bedroom(ctx, { T });
    set.pillow();
    figure(ctx, GIRL, { ...POSES.hugKnees, tilt: -0.15, eyes: blink(T + 1), mouth: 'flat', wind: 0 }, 820, 735, 2.6, 1, { anchor: 'hip' });
    set.quilt(30);
}

function bedTalk(ctx, lt, u, T) {
    camera(ctx, 880, 600, lerp(1.55, 1.68, u));
    const set = bedroom(ctx, { T });
    set.pillow();
    figure(ctx, DAD, { ...POSES.sit, lean: 0.12, tilt: lerp(0.1, 0.4, smooth(range(lt, 0.5, 1.5))), shF: 0.4, elF: 0.9, eyes: blink(T), mouth: 'smile' }, 1040, 745, 2.3, -1, { anchor: 'hip' });
    const talk = lt > 0.3 && lt < 3.2 ? 1 : 0;
    figure(ctx, GIRL, { ...POSES.hugKnees, lean: 0.55, tilt: -0.35, shF: 1.3, elF: 1.0, eyes: blink(T), mouth: talk ? 'smile' : 'flat', talk, wind: 0 }, 830, 745, 2.3, 1, { anchor: 'hip' });
    set.quilt(26);
}

// ---------- Seasons ----------

function seasonsRun(ctx, lt, u, T, o = {}) {
    const d = o.d ?? 9.32;
    const season = clamp((lt / d) * 3.25, 0, 3);
    const open = ease(range(lt, 0, 2.2));
    const scroll = T * 300;
    camera(ctx, 960, lerp(720, 540, open), lerp(o.z0 ?? 1.4, 1.0, open));
    const set = seasons(ctx, { season, scroll, T });
    figure(ctx, DAD, dadRun(T, 0.85), 780 + Math.sin(T * 0.7) * 30, 935, 1.75, 1);
    figure(ctx, GIRL, girlRun(T, 1, { eyes: 'happy', mouth: 'open' }), 1080 + Math.sin(T * 0.9) * 40, 920, 1.8, 1);
    set.after();
}

// ---------- Growing up ----------

function stubbornLaugh(ctx, lt, u, T) {
    const laugh = lt > 2.33;
    camera(ctx, 930, 690, laugh ? 1.45 : 1.32);
    const set = meadow(ctx, { light: 'gold', horizon: 600, T, flowers: 40, wind: 0.7 });
    figure(ctx, DAD, { ...POSES.kneel, shF: 1.1, elF: 0.7, shB: 0.9, elB: 0.8, tilt: 0.15, mouth: laugh ? 'open' : 'smile', eyes: laugh ? 'happy' : 'open' }, 720, 930, 2.4, 1);
    if (!laugh) figure(ctx, GIRL, { ...POSES.armsCrossed, wind: 0.6 }, 1060, 930, 2.6, 1);
    else {
        const hop = Math.abs(Math.sin(q(T) * 7)) * 12;
        figure(ctx, GIRL, { ...POSES.laugh, bob: hop, wind: 0.8 }, 1020, 930, 2.6, -1);
    }
    set.after();
}

function hugRun(ctx, lt, u, T) {
    camera(ctx, 1000, 640, lerp(1.05, 1.18, u));
    const set = meadow(ctx, { light: 'dusk', horizon: 620, T, flowers: 40, wind: 0.8, sunX: 1200 });
    const reachAt = 2.1;
    const dadX = 760, g = 930, s = 2.3;
    if (lt < reachAt) {
        figure(ctx, DAD, { ...POSES.kneel, ...{ shF: 1.6, elF: 0.4, shB: 1.4, elB: 0.5 }, mouth: 'open' }, dadX, g, s, 1);
        const gx = lerp(1550, dadX + 120, easeOut(lt / reachAt));
        figure(ctx, GIRL, girlRun(T, 1, { eyes: 'happy', mouth: 'open' }), gx, g, s, -1);
    } else {
        const k = lt - reachAt;
        ctx.save();
        ctx.translate(dadX + 40, g);
        ctx.rotate(Math.sin(k * 2.2) * 0.04);
        ctx.translate(-(dadX + 40), -g);
        figure(ctx, GIRL, pose({ lean: -0.35, hipF: -0.3, kneeF: 0.9, hipB: -0.5, kneeB: 1.2, shF: 2.1, elF: 1.0, shB: 1.9, elB: 1.1, eyes: 'happy', mouth: 'open', bob: 26, wind: 0.6 }), dadX + 92, g, s, -1, { parts: ['armB', 'legB', 'legF', 'torso', 'head'] });
        figure(ctx, DAD, { ...POSES.kneel, shF: 1.75, elF: 1.5, shB: 1.6, elB: 1.4, eyes: 'happy', mouth: 'smile', tilt: 0.2 }, dadX, g, s, 1);
        figure(ctx, GIRL, pose({ lean: -0.35, hipF: -0.3, kneeF: 0.9, hipB: -0.5, kneeB: 1.2, shF: 2.1, elF: 1.0, shB: 1.9, elB: 1.1, eyes: 'happy', mouth: 'open', bob: 26, wind: 0.6 }), dadX + 92, g, s, -1, { parts: ['armF'], shadow: false });
        ctx.restore();
    }
    set.after();
}

function onShoulders(ctx, dadP, girlP, x, y, s, flip = 1, o = {}) {
    const dPlace = place(DAD, dadP, x, y, s, flip);
    const hipAt = dPlace.toStage([2, -DAD.torso - 6]);
    figure(ctx, GIRL, girlP, hipAt[0], hipAt[1], s, flip, { anchor: 'hip', parts: ['armB', 'legB', 'torso', 'head', 'armF'] });
    figure(ctx, DAD, dadP, x, y, s, flip, o);
    const g = figure(ctx, GIRL, girlP, hipAt[0], hipAt[1], s, flip, { anchor: 'hip', parts: ['legF'] });
    return g;
}
const SHOULDER_SIT = { hipF: 1.45, kneeF: 1.55, hipB: 1.35, kneeB: 1.5, lean: -0.05 };

function shouldersHill(ctx, lt, u, T, o = {}) {
    const e = ease(u);
    camera(ctx, lerp(980, 960, e), lerp(o.cy0 ?? 560, o.cy1 ?? 400, e), lerp(o.z0 ?? 1.45, o.z1 ?? 1.0, e));
    const set = meadow(ctx, { light: 'gold', horizon: 700, T, hill: { x: 960, y: 700, w: 760 }, flowers: 20, wind: 1.2, sunX: 1500 });
    const y = set.hillTop(960) + 4;
    const dadP = pose({ shF: 2.1, elF: 1.1, shB: 2.0, elB: 1.15, tilt: -0.2, wind: 1, mouth: 'smile' });
    const girlP = pose({ ...SHOULDER_SIT, shF: 2.6 + Math.sin(T * 3) * 0.1, elF: 0.1, shB: 2.3, elB: 0.15, tilt: -0.2, wind: 1.3, mouth: 'open', eyes: 'happy' });
    onShoulders(ctx, dadP, girlP, 960, y, 1.7, 1);
    set.after();
}

function budsOpen(ctx, lt, u, T) {
    camera(ctx, 960, lerp(560, 520, u), lerp(1.85, 1.95, u));
    const set = tableRoom(ctx, { T });
    set.table();
    bouquet(ctx, 960, 735, 1.7, T, (i) => smooth(range(lt, 0.3 + i * 0.5, 1.3 + i * 0.5)));
    particles(ctx, T, 'seed', { count: 10, alpha: 0.5, wind: 0.1, x0: 500, x1: 1400, y0: 200, y1: 800 });
}

function arranging(ctx, lt, u, T) {
    camera(ctx, 1020, 560, lerp(1.4, 1.5, u));
    const set = tableRoom(ctx, { T });
    const reach = smooth(range(lt, 0.8, 1.8)) * (1 - smooth(range(lt, 3.0, 3.9)));
    const p = pose({ lean: 0.1 + reach * 0.15, shF: lerp(0.7, 1.45, reach), elF: lerp(1.2, 0.3, reach), shB: 0.5, elB: 1.3, tilt: 0.28 - reach * 0.1, eyes: lt > 4.0 ? 'happy' : blink(T), mouth: lt > 4.0 ? 'smile' : 'flat' });
    const g = figure(ctx, GIRL, p, 1220, 860, 3.0, -1, { shadow: false });
    set.table();
    bouquet(ctx, 900, 735, 1.25, T, () => 1, { colors: ['#eaa3ae', '#f4d3d3', '#f7e8e0', '#e88f98', '#f1c56d', '#eaa3ae', '#f4d3d3'] });
    // Shells and a stone she has lined up.
    [[1060, 742, '#f2ddd0'], [1110, 746, '#d8c2b3'], [1160, 744, '#efc9c8']].forEach(([x, y, c], i) => dab(ctx, x, y, 18, 11, c, 1, 400 + i));
    rect(ctx, 700, 700, 70, 44, '#f0b4bd', 1, 410, 1.5);
    // The pink flower in her hand, until it goes into the jar.
    const h = g.toStage(g.J.handF);
    if (lt < 3.2) flower(ctx, h[0], h[1] + 10, 120, 1, '#e88f98', { tilt: -0.5, size: 1.4, leaf: false });
}

function hilltop(ctx, lt, u, T) {
    const e = ease(u);
    camera(ctx, lerp(1120, 980, e), lerp(560, 450, e), lerp(1.65, 1.0, e));
    const set = meadow(ctx, { light: 'gold', horizon: 720, T, hill: { x: 1060, y: 650, w: 650 }, flowers: 10, wind: 1.3, sunX: 1650 });
    const y = set.hillTop(1060);
    dab(ctx, 1060, y + 8, 70, 26, '#9d9189', 1, 500);
    figure(ctx, DAD, pose({ eyes: blink(T), wind: 1, shF: 0, shB: -0.05 }), 880, set.hillTop(880) + 6, 1.35, 1);
    figure(ctx, GIRL, pose({ wind: 1.4, tilt: -0.1, shF: 0.15, shB: -0.25, eyes: blink(T) }), 1070, y - 10, 1.5, 1);
    set.after();
}

// ---------- Verse two: her own things ----------

function deskStill(ctx, lt, u, T) {
    camera(ctx, lerp(820, 1120, ease(u)), 560, 1.6);
    const set = tableRoom(ctx, { T });
    set.table();
    bouquet(ctx, 820, 740, 1.3, T, () => 1, { colors: ['#eaa3ae', '#f4d3d3', '#e88f98', '#f7e8e0', '#eaa3ae', '#f1c56d', '#e88f98'], vase: '#f0c4c8' });
    lamp(ctx, 1340, 742, 1.4, 0);
    rect(ctx, 1000, 690, 64, 52, '#f2b7c0', 1, 600, 1.5);
    dab(ctx, 1032, 690, 32, 8, '#f6d0d5', 1, 601);
    drawing(ctx, 1160, 790, 170, 120, 1, 7, 0.08);
    [[1060, 742, '#f2ddd0'], [1100, 744, '#d8c2b3']].forEach(([x, y, c], i) => dab(ctx, x, y, 16, 10, c, 1, 610 + i));
    // A ribbon and a hairclip.
    ctx.strokeStyle = '#e07e8e'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(620, 780); ctx.quadraticCurveTo(680, 740, 720, 790); ctx.quadraticCurveTo(760, 830, 800, 790); ctx.stroke();
}

function deskTop(ctx, T) {
    ctx.fillStyle = vgrad(ctx, -200, 1300, [['#c99d76', 0], ['#ab7c56', 1]]);
    ctx.fillRect(-600, -400, W + 1200, 1900);
    ctx.strokeStyle = rgba('#8a5e3e', 0.25); ctx.lineWidth = 3;
    for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.moveTo(-200, i * 64 + 10); ctx.bezierCurveTo(500, i * 64 + 30, 1300, i * 64 - 10, 2200, i * 64 + 20); ctx.stroke(); }
    mottle(ctx, -100, -100, 2200, 1300, '#7a5038', 700, 10, 0.12);
    glow(ctx, 300, 100, 900, '#fff0d0', 0.35);
}

function littleHands(ctx, lt, u, T) {
    camera(ctx, 960, 540, lerp(1.0, 1.06, u));
    deskTop(ctx, T);
    // Paper and the crayon drawing.
    drawing(ctx, 820, 470, 620, 440, range(lt, 2.4, 4.4), 11, -0.04);
    [[1380, 260, '#e5737e'], [1430, 300, '#f2b34a'], [1350, 340, '#6f9a6a'], [1460, 380, '#5f78a8']].forEach(([x, y, c], i) => { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.4 + i * 0.3); rect(ctx, -50, -9, 100, 18, c, 1, 710 + i, 1); ctx.restore(); });
    // A row of shells; the last one is being set down.
    const slots = [[1240, 640], [1320, 650], [1400, 640], [1480, 655]];
    const k = ease(range(lt, 0.3, 1.8));
    slots.forEach(([x, y], i) => {
        const [sx, sy] = i === 3 ? [lerp(1650, x, k), lerp(880, y, k)] : [x, y];
        dab(ctx, sx, sy, 30, 22, ['#f3dccf', '#e9c6c3', '#f6e7d6', '#efc0c6'][i], 1, 720 + i);
    });
    // Right hand places the shell, then picks up a crayon and draws.
    const draw = range(lt, 2.4, 4.4);
    const rx = lt < 2.1 ? lerp(1700, 1490, k) : lerp(1490, 880 + Math.sin(T * 9) * 50 * (draw > 0 && draw < 1 ? 1 : 0), smooth(range(lt, 2.0, 2.5)));
    const ry = lt < 2.1 ? lerp(900, 680, k) : lerp(680, 520 + Math.cos(T * 7) * 30 * (draw > 0 && draw < 1 ? 1 : 0), smooth(range(lt, 2.0, 2.5)));
    if (lt > 2.4) { ctx.save(); ctx.translate(rx - 20, ry - 20); ctx.rotate(-0.7); rect(ctx, -46, -8, 92, 16, '#e5737e', 1, 730, 1); ctx.restore(); }
    hand(ctx, rx, ry, 1.6, -0.35, lt < 1.6 ? 0.2 : 0.6);
    hand(ctx, 460, 760, 1.6, 0.5, 0.8);
}

function rescue(ctx, lt, u, T) {
    const scroll = lt * 120;
    camera(ctx, 1000 + sway(T, 6)[0], 560, 1.1);
    const set = meadow(ctx, { light: 'day', horizon: 620, T, flowers: 30, wind: 0.8, scroll, sunX: 1700 });
    boxFire(ctx, 1640 - scroll * 0.6, 930, 1.8, T);
    const dadP = run(q(T) * 7, 0.6, { shF: 2.1, elF: 1.1, shB: 2.0, elB: 1.15, mouth: 'open', eyes: 'happy', lean: 0.12 });
    const girlP = pose({ ...SHOULDER_SIT, shF: 1.75, elF: 0.05, shB: 0.9, elB: 1.2, mouth: lt % 1.4 < 1 ? 'open' : 'smile', wind: 0.9, tilt: -0.05 });
    const g = onShoulders(ctx, dadP, girlP, 820, 950, 2.0, 1);
    const head = g.toStage(g.J.head);
    helmet(ctx, head[0] + 2, head[1] - 22, 1.75, 0.08);
    // Pretend water from her pointing hand.
    const h = g.toStage(g.J.handF);
    ctx.strokeStyle = rgba('#a8cfe0', 0.8); ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
        const t0 = ((T * 1.6 + i / 7) % 1);
        const x = h[0] + 30 + t0 * 460, y = h[1] - 10 + t0 * t0 * 220 - t0 * 120;
        ctx.globalAlpha = 0.8 * (1 - t0);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 26, y + 6); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    set.after();
}

function sofaAsk(ctx, lt, u, T) {
    camera(ctx, lerp(940, 900, u), 600, lerp(1.45, 1.55, u));
    const set = livingRoom(ctx, { T });
    const dadP = { ...POSES.sit, lean: -0.15, tilt: 0.35, shF: 0.8, elF: 1.4, shB: 0.5, elB: 1.4, eyes: blink(T), mouth: 'smile' };
    figure(ctx, DAD, dadP, 1000, 770, 2.1, 1, { anchor: 'hip' });
    const talk = lt > 0.6 && lt < 3.6 ? 1 : 0;
    figure(ctx, GIRL, pose({ hipF: 1.35, kneeF: 1.3, hipB: 1.2, kneeB: 1.5, lean: -0.3, back: true, tilt: -0.35, shF: 0.9, elF: 1.4, shB: 0.6, elB: 1.2, talk, mouth: talk ? 'smile' : 'smile', eyes: blink(T + 0.5), wind: 0 }), 1080, 730, 2.1, 1, { anchor: 'hip' });
}

function waitDoor(ctx, lt, u, T) {
    camera(ctx, lerp(1000, 1060, u), 580, lerp(1.25, 1.3, u));
    const set = hallway(ctx, { T, open: 0, clock: T * 1.6 });
    const ask = lt > 1.7 && lt < 3.6;
    const kick = Math.sin(q(T) * 6) * 0.35;
    figure(ctx, GIRL, pose({ hipF: 1.5, kneeF: 1.3 + kick, hipB: 1.45, kneeB: 1.3 - kick, lean: 0.3, shF: 1.25, elF: 2.1, shB: 1.1, elB: 2.1, tilt: ask ? -0.15 : 0.12, back: ask, talk: ask ? 1 : 0, eyes: blink(T), mouth: ask ? 'smile' : 'flat', wind: 0 }), 1120, 732, 2.5, -1, { anchor: 'hip' });
    figure(ctx, MUM, pose({ tilt: 0.15, shF: 0.4, elF: 1.4, shB: 0.3, elB: 1.4, eyes: blink(T + 1), mouth: 'smile' }), 1680, 905, 2.3, -1);
}

function dadHome(ctx, lt, u, T, o = {}) {
    const t = lt + (o.offset || 0);
    const open = smooth(range(t, 0, 1.1));
    const [dx0, dy0, dw] = [520, 160, 360];
    const walkOut = range(t, 2.4, 4.7);
    camera(ctx, lerp(900, 1100, smooth(walkOut)), 580, 1.18);
    const set = hallway(ctx, { T, open, clock: 3 });
    const floor = set.floor + 2;
    if (t < 2.2) {
        const dadX = lerp(700, 780, smooth(range(t, 0.6, 2.2)));
        figure(ctx, DAD, t < 0.6 ? POSES.stand : walk(q(T) * 4.5, 0.6, { mouth: 'smile', eyes: 'happy' }), dadX, floor, 2.4, 1, { alpha: smooth(range(t, 0.2, 0.7)) });
        const run = range(t, 0.9, 2.2);
        const gx = lerp(1130, 900, easeOut(run));
        figure(ctx, GIRL, t < 0.9 ? pose({ ...POSES.stand, mouth: 'o', shF: 0.6 }) : girlRun(T, 1, { mouth: 'open', eyes: 'happy' }), gx, floor, 2.5, -1);
    } else {
        const k = smooth(range(t, 2.2, 2.7));
        const dadX = 780 + walkOut * 420;
        const dadP = walk(q(T) * 4.5, 0.5 * k, { shF: 0.45, elF: 0.1, mouth: 'smile', eyes: 'happy', tilt: 0.25 });
        const dP = place(DAD, dadP, dadX, floor, 2.4, 1);
        const dHand = dP.toStage(dP.J.handF);
        const girlP = walk(q(T) * 7, 0.8 * k, { lean: 0.22, shB: -1.25, elB: 0.05, shF: 2.2 + Math.sin(T * 8) * 0.3, elF: 0.5, back: true, talk: 1, mouth: 'open', eyes: 'happy' });
        const gP = place(GIRL, girlP, 0, floor, 2.5, 1);
        const gHand = gP.toStage(gP.J.handB);
        const gx = dHand[0] - gHand[0];
        figure(ctx, DAD, dadP, dadX, floor, 2.4, 1);
        figure(ctx, GIRL, girlP, gx, floor, 2.5, 1);
    }
}

function dadFace(ctx, lt, u, T) {
    camera(ctx, lerp(1060, 1020, u), 520, lerp(1.0, 1.06, u));
    const set = tableRoom(ctx, { T, evening: 0.85 });
    set.table();
    glow(ctx, 600, 400, 900, '#ffcf8c', 0.25);
    const blinkNow = lt > 2.0 && lt < 2.14;
    figure(ctx, DAD, pose({ tilt: 0.28, eyes: blinkNow ? 'closed' : 'open', mouth: 'smile', shF: 0.05, elF: 0.2, shB: 0, elB: 0.2 }), 1160, 1710, 7.2, -1, { shadow: false });
}

function drawTogether(ctx, lt, u, T) {
    camera(ctx, 940, 650, lerp(1.6, 1.68, u));
    const set = tableRoom(ctx, { T, evening: 0.9 });
    lamp(ctx, 1460, 742, 1.5, 1);
    const scribble = Math.sin(q(T) * 9) * 0.12;
    figure(ctx, DAD, { ...POSES.sit, lean: 0.25, shF: 1.15 + scribble * 0.3, elF: 1.0, shB: 0.9, elB: 1.2, tilt: 0.45, eyes: blink(T), mouth: 'smile' }, 1060, 712, 2.1, -1, { anchor: 'hip' });
    const kick = Math.sin(q(T) * 5) * 0.3;
    figure(ctx, GIRL, pose({ hipF: 1.5, kneeF: 1.3 + kick, hipB: 1.4, kneeB: 1.4 - kick, lean: 0.3, shF: 1.25 + scribble, elF: 0.9, shB: 1.0, elB: 1.0, tilt: 0.4, eyes: blink(T + 0.7), mouth: lt % 2 < 1.2 ? 'smile' : 'o', talk: lt > 2.6 ? 1 : 0 }), 800, 690, 2.1, 1, { anchor: 'hip' });
    set.table();
    drawing(ctx, 840, 760, 240, 70, 1, 5, 0);
    drawing(ctx, 1010, 762, 240, 70, range(lt, 0, 4), 6, 0.02);
}

// ---------- Bridge ----------

function friendsAhead(ctx, lt, u, T) {
    camera(ctx, lerp(900, 980, u), lerp(560, 540, u), lerp(1.12, 1.0, ease(u)));
    const set = playgroundWide(ctx, { light: 'gold', T, wind: 0.7 });
    const t = lerp(0.3, 0.95, easeOut(u * 0.9));
    [[FRIEND, -0.035, 0.3, 0.4], [GIRL, 0, 0.5, 0], [BOY, 0.03, 0.68, 0.9]].forEach(([R, dt, k, ph]) => {
        const [x, y, s] = trackPoint(t + dt, k);
        figure(ctx, R, run(q(T) * 10 + ph, 0.9, { eyes: 'happy', mouth: 'open' }), x, y, s, 1);
    });
    const [dx, dy, ds] = trackPoint(0.08, 0.55);
    figure(ctx, DAD, pose({ eyes: blink(T), tilt: -0.05, shF: 0.05, elF: 0.2 }), dx - 60, dy, ds, 1);
    set.after();
}

function dadWatches(ctx, lt, u, T) {
    camera(ctx, lerp(920, 980, u), 560, lerp(1.0, 1.08, u));
    const set = meadow(ctx, { light: 'gold', horizon: 640, T, flowers: 30, wind: 0.6, sunX: 1450 });
    // Far off, the children play chase in a ring.
    for (let i = 0; i < 3; i++) {
        const a = T * 1.6 + (i * Math.PI * 2) / 3;
        const R = [GIRL, BOY, FRIEND][i];
        figure(ctx, R, run(q(T) * 10 + i, 0.8, { mouth: 'open', eyes: 'happy' }), 1450 + Math.cos(a) * 140, 760 + Math.sin(a) * 26, 0.85, Math.sin(a) > 0 ? -1 : 1, { shadowAlpha: 0.12 });
    }
    figure(ctx, DAD, pose({ shF: -0.1, elF: 0.4, shB: -0.12, elB: 0.4, eyes: blink(T), tilt: 0.05, mouth: 'smile' }), 520, 1260, 3.6, 1, { shadow: false });
    set.after();
}

function memoryNight(ctx, lt, u, T) {
    camera(ctx, lerp(960, 820, ease(u)), lerp(560, 580, ease(u)), lerp(1.0, 1.7, ease(u)));
    const set = nightHouse(ctx, { T });
    // Inside the window, Dad reads to her.
    const [x, y, w, h] = set.windows[0];
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    glow(ctx, x + 40, y + 60, 200, '#ffe2a8', 0.6);
    const dark = { ...DAD, c: { ...DAD.c, skin: '#a4775c', top: '#5c4d50', bottom: '#4a3d42', hair: '#3a2c30' } };
    const darkGirl = { ...GIRL, c: { ...GIRL.c, skin: '#b68468', top: '#9a6a70', bottom: '#5a4552', hair: '#3a2c30' } };
    figure(ctx, dark, { ...POSES.sit, shF: 1.1, elF: 1.0, tilt: 0.3 }, x + 140, y + 160, 0.95, -1, { anchor: 'hip' });
    figure(ctx, darkGirl, { ...POSES.sit, lean: -0.2, tilt: -0.1, shF: 1.0, elF: 1.2, talk: 1 }, x + 80, y + 170, 0.95, 1, { anchor: 'hip' });
    rect(ctx, x + 96, y + 120, 34, 26, '#f7ecd2', 1, 800, 1);
    ctx.restore();
}

function lapsGhosts(ctx, lt, u, T) {
    camera(ctx, 980, lerp(600, 540, u), lerp(1.15, 1.04, u));
    const set = playgroundWide(ctx, { light: 'dusk', T, wind: 0.6 });
    for (let i = 0; i < 4; i++) {
        const t = ((lt * 0.12 + i * 0.27) % 1.1) + 0.12;
        const a = 0.18 + 0.14 * Math.sin((t / 1.2) * Math.PI);
        const [dx, dy, ds] = trackPoint(t - 0.02, 0.62);
        const [gx, gy, gs] = trackPoint(t + 0.02, 0.38);
        figure(ctx, DAD, dadRun(T + i), dx, dy, ds, 1, { alpha: a, shadow: false });
        figure(ctx, GIRL, girlRun(T + i, 1, { eyes: 'happy', mouth: 'open' }), gx, gy, gs, 1, { alpha: a, shadow: false });
    }
    set.after();
}

// ---------- Final chorus ----------

function fallUp(ctx, lt, u, T) {
    // Integrate the camera speed: running, slowing for the fall, stopped, then off again.
    const speed = (t) => (t < 1.0 ? 300 : t < 1.4 ? 300 * (1 - (t - 1.0) / 0.4) : t < 3.2 ? 0 : Math.min(300, (t - 3.2) * 500));
    let scroll = 0;
    for (let t = 0; t < lt; t += 0.02) scroll += speed(t) * 0.02;
    camera(ctx, 1000, 600, 1.2);
    const set = meadow(ctx, { light: 'gold', horizon: 600, T, flowers: 40, wind: 0.8, scroll: scroll + 2000, sunX: 1600 });
    const g = 940;
    let gp, dadX, dp;
    if (lt < 1.0) gp = girlRun(T, 1, { eyes: 'happy', mouth: 'open' });
    else if (lt < 1.45) gp = blend(girlRun(T, 1), pose({ lean: 1.2, hipF: 1.5, kneeF: 2.3, hipB: 0.9, kneeB: 2.1, shF: 1.9, elF: 0.1, shB: 1.7, elB: 0.2, eyes: 'closed', mouth: 'o' }), smooth(range(lt, 1.0, 1.4)));
    else if (lt < 2.5) gp = pose({ ...POSES.sit, lean: -0.1, shF: 0.4, elF: 0.6, shB: -0.4, elB: 0.2, eyes: lt < 2.0 ? 'down' : 'open', mouth: lt < 2.0 ? 'pout' : 'flat', tilt: lt < 2.0 ? 0.3 : -0.2 });
    else if (lt < 3.2) gp = blend(pose({ ...POSES.sit, shF: 1.6, elF: 0.2, tilt: -0.2 }), pose({ shF: 1.6, elF: 0.2, eyes: 'happy', mouth: 'smile' }), smooth(range(lt, 2.5, 3.1)));
    else gp = girlRun(T, smooth(range(lt, 3.2, 3.8)), { eyes: 'happy', mouth: 'open' });
    const sitting = lt >= 1.45 && lt < 3.1;
    dadX = lt < 3.2 ? lerp(300, 820, easeOut(range(lt, 1.2, 2.5))) : 820 + Math.sin(T) * 20;
    if (lt < 2.5) dp = dadRun(T, 0.8);
    else if (lt < 3.2) dp = pose({ lean: 0.45, shF: 1.25, elF: 0.15, tilt: 0.3, mouth: 'smile', eyes: 'happy' });
    else dp = dadRun(T, smooth(range(lt, 3.2, 3.8)) * 0.85);
    figure(ctx, DAD, dp, dadX, g + 10, 2.2, 1);
    if (sitting) figure(ctx, GIRL, gp, 1060, g - 16, 2.3, 1, { anchor: 'hip' });
    else figure(ctx, GIRL, gp, 1060, g, 2.3, 1);
    set.after();
}

function runToDistance(ctx, lt, u, T) {
    const look = smooth(range(lt, 2.6, 3.1));
    camera(ctx, lerp(900, 1100, u), lerp(540, 500, u), 1.0);
    const set = meadow(ctx, { light: 'gold', horizon: 720, T, flowers: 30, wind: 1, scroll: T * 240, sunX: 1650 });
    const p = blend(girlRun(T, 1, { eyes: 'happy', mouth: 'open' }), { ...girlRun(T, 0.6), back: true, shB: 2.6, elB: 0.4, eyes: 'happy', mouth: 'open' }, look);
    figure(ctx, GIRL, p, lerp(900, 1240, u), 960, 1.9, 1);
    set.after();
}

function hatWind(ctx, lt, u, T) {
    const scroll = T * 300;
    camera(ctx, 1000, 640, 1.3);
    const set = meadow(ctx, { light: 'gold', horizon: 600, T, flowers: 40, wind: 1.6, scroll, sunX: 1500 });
    const g = 960;
    const gp = girlRun(T, 1, { eyes: lt > 1.7 && lt < 2.6 ? 'open' : 'happy', mouth: 'open', wind: 1.2, back: lt > 1.8 && lt < 2.8 });
    const G = figure(ctx, GIRL, gp, 1180, g, 2.4, 1);
    const head = G.toStage(G.J.head);
    const fly = range(lt, 1.5, 3.3);
    const dadX = lerp(300, 720, easeOut(range(lt, 1.0, 3.0)));
    const caught = lt > 3.3;
    const dadP = dadRun(T, 0.8, caught ? { shF: 2.8, elF: 0.2, mouth: 'open', eyes: 'happy' } : { mouth: 'open' });
    const D = figure(ctx, DAD, dadP, dadX, g + 30, 2.3, 1);
    if (fly <= 0) hat(ctx, head[0] + 4, head[1] - 26, 2.1, -0.1);
    else if (!caught) {
        const hx = lerp(head[0], dadX + 60, fly), hy = lerp(head[1] - 26, head[1] - 140, Math.sin(fly * Math.PI)) + fly * 60;
        hat(ctx, hx, hy, 2.1, fly * 9);
    } else {
        const h = D.toStage(D.J.handF);
        hat(ctx, h[0], h[1] - 12, 2.1, 0.3);
    }
    set.after();
}

function backToLight(ctx, lt, u, T) {
    const e = ease(u);
    camera(ctx, 980, lerp(640, 520, e), lerp(1.3, 1.0, e));
    const set = meadow(ctx, { light: 'gold', horizon: 760, T, flowers: 60, wind: 1.1, sunX: 1120 });
    glow(ctx, 1120, 670, 900, '#fff3d6', 0.35 + e * 0.2);
    girlBack(ctx, 1000, 930, 2.3, T, { wind: 0.8 });
    set.after();
}

// ---------- Timeline ----------

const shot = (t, draw, dissolve = 0) => ({ t, draw, in: dissolve });

export const SHOTS = [
    shot(0, (c, lt, u, T) => playgroundOpen(c, lt, u, T)),
    shot(10.64, (c, lt, u, T) => trackRun(c, lt, u, T), 0.5),
    shot(15.23, (c, lt, u, T) => waveBack(c, lt, u, T)),
    shot(19.56, ridgeWalk, 0.6),
    shot(23.93, carryHome, 0.7),
    shot(28.89, (c, lt, u, T) => beetleMacro(c, lt, u, T), 0.6),
    shot(33.32, crouchWatch),
    shot(38.2, (c, lt, u, T) => branchBirds(c, lt, u, T), 0.5),
    shot(42.6, smileUp, 0.4),
    shot(47.24, race, 0.5),
    shot(51.93, cornerAlone, 0.4),
    shot(55.93, bedAlone, 0.9),
    shot(61.25, bedTalk, 0.4),
    shot(65.9, (c, lt, u, T) => seasonsRun(c, lt, u, T)),
    shot(75.22, stubbornLaugh),
    shot(79.88, hugRun, 0.3),
    shot(84.54, (c, lt, u, T) => shouldersHill(c, lt, u, T)),
    shot(89.1, budsOpen, 0.5),
    shot(93.76, arranging, 0.4),
    shot(98.82, hilltop, 0.6),
    shot(104.04, deskStill, 0.8),
    shot(108.09, littleHands, 0.4),
    shot(112.78, rescue),
    shot(117.11, sofaAsk, 0.5),
    shot(121.85, waitDoor, 0.5),
    shot(126.48, (c, lt, u, T) => dadHome(c, lt, u, T)),
    shot(131.16, dadFace, 0.6),
    shot(135.76, drawTogether, 0.6),
    shot(140.46, friendsAhead, 0.9),
    shot(145.13, dadWatches, 0.8),
    shot(149.78, memoryNight, 1.0),
    shot(154.75, lapsGhosts, 1.0),
    shot(159.11, (c, lt, u, T) => trackRun(c, lt, u, T, { light: 'gold', z: 1.0, cy: 540, dadX: () => 760 + Math.sin(T * 0.6) * 30 }), 0.4),
    shot(163.73, (c, lt, u, T) => seasonsRun(c, lt, u, T, { d: 4.69, z0: 1.15 })),
    shot(168.42, (c, lt, u, T) => beetleMacro(c, lt, u, T, { x0: 700, x1: 1000 })),
    shot(169.97, (c, lt, u, T) => branchBirds(c, lt, u, T, { flyAt: 9, butterflyFrom: -1.2, cy0: 600, cy1: 520 })),
    shot(171.53, (c, lt, u, T) => branchBirds(c, lt, u, T, { flyAt: 0.1, butterflyFrom: 9, cy0: 520, cy1: 420 })),
    shot(173.09, fallUp, 0.3),
    shot(177.76, (c, lt, u, T) => shouldersHill(c, lt, u, T, { z0: 1.3, z1: 1.15, cy0: 520, cy1: 470 })),
    shot(180.1, (c, lt, u, T) => dadHome(c, lt, u, T, { offset: 2.4 })),
    shot(182.45, runToDistance, 0.4),
    shot(187.02, hatWind),
    shot(191.66, backToLight, 0.6),
    shot(196.95, (c, lt, u, T) => playgroundOpen(c, lt, u, T, { z0: 1.05, z1: 1.16 }), 1.2),
    shot(201.63, (c, lt, u, T) => waveBack(c, lt, u, T, { cup: true })),
    shot(206.28, (c, lt, u, T) => trackRun(c, lt, u, T, { dadX: (lt) => lerp(380, 950, easeOut(range(lt, 0, 3))), dadPose: { mouth: 'open', eyes: 'happy' } })),
    shot(210.35, playgroundRecede, 0.8),
];
export const DURATION = 219.17;
