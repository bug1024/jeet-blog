// 送爷爷那天: one fixed shot of the courtyard outside grandfather's room. People keep moving; the father stops
// on the old threshold for a few seconds, is called, and goes. The camera only drifts closer.
import { W, H, clamp, lerp, range, E, mix, camera, noise } from './core.js';
import { C } from './design.js';
import { paint, shape, block, wash, line, shadow, ellipsePts, rectPts } from './gouache.js';
import { CAST, drawFigure, gait, stand, blend, walkPlan, walkStartX, stepBlend, standOn, joints, toHands } from './figure.js';
import { makeShot, drawShot } from './shot.js';

export const SHOT = { from: 156.54, to: 183.21 };

// Two-point view of the house front: low eye level (a child's height), wall receding to the right.
const HZ = 650, K = 2.4;
const sizeAt = (y) => (y - HZ) * K;
const baseY = (x) => 842 - (x - 420) * 0.0347;
const topY = (x) => 170 + (x - 420) * 0.0867;
const eaveY = (x) => topY(x) - 42;
const DOOR = [1000, 1290];
const thH = (x) => 70 - (x - DOOR[0]) * 0.02;
const thTop = (x) => baseY(x) - thH(x);
const pathY = (x) => baseY(x) + 30;      // where the father walks along the house front
const farY = 712;                          // far courtyard, past the corner

const F = CAST.fatherFuneral;
const FH = 480;

// ---------- the father's few seconds ----------
const walk1 = walkPlan(F, FH, -60, 640, 156.2, 380, { carry: true });
const set0 = walk1.t1, set1 = set0 + 1.05;                      // puts the cloth down on the bench
const stand1 = (() => {
    const g = walk1.pose(walk1.t1, pathY);
    const lead = g.legs[0].ankle[0] > g.legs[1].ankle[0] ? 0 : 1;
    return { g, lead, s: standOn(F, FH, g, lead, 1, { arms: [{ a: 0.12, e: 0.25 }, { a: -0.04, e: 0.2 }] }) };
})();
const walk2 = walkPlan(F, FH, walkStartX(F, FH, stand1.s), 1000, set1 + 0.15, 380);
const stand2 = (() => {
    const g = walk2.pose(walk2.t1, pathY);
    const lead = g.legs[0].ankle[0] > g.legs[1].ankle[0] ? 0 : 1;
    return { g, lead, s: standOn(F, FH, g, lead, 1) };
})();
const TURN = walk2.t1 + 0.42;                                      // hidden behind the passer with the bench
// Facing left now, on the same two feet.
const standL = (() => {
    const [a, b] = stand2.s.legs.map((l) => l.ankle);
    const near = a[0] < b[0] ? a : b, far = a[0] < b[0] ? b : a;
    const legLen = (F.p.thigh + F.p.shin) * FH;
    return {
        x: (near[0] + far[0]) / 2, y: Math.max(near[1], far[1]) - legLen * 0.97, f: -1, lean: 0.06, neck: 0.12,
        legs: [{ ankle: [...near], rot: 0 }, { ankle: [...far], rot: 0 }],
        arms: [{ a: 0.05, e: 0.15 }, { a: -0.02, e: 0.12 }],
    };
})();
const SIT = 162.77, DOWN = 166.65, TEAR = 169.99, CALL = 172.95;
const hipSeat = [Math.min(1240, standL.x + 0.4 * FH), 0];
hipSeat[1] = thTop(hipSeat[0]) - 3;
function seated(lean, neck, hands, eyes, extra = {}) {
    const p = { x: hipSeat[0], y: hipSeat[1], f: -1, lean, neck, legs: standL.legs, arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }], eyes, ...extra };
    const J = joints(F, FH, p);
    const knee = J.legs[0].knee, kneeF = J.legs[1].knee;
    p.arms = hands(J, knee, kneeF);
    return p;
}
const onKnees = (J, k, kf) => [{ hand: [k[0] - 8, k[1] + 10], grip: 0.8 }, { hand: [kf[0] - 4, kf[1] + 14], grip: 0.8 }];
const clasped = (J, k, kf) => [{ hand: [k[0] - 18, k[1] + 46], grip: 1 }, { hand: [k[0] - 6, k[1] + 50], grip: 1 }];
const SIT_UP = seated(0.24, 0.1, onKnees, 'open');
const SIT_LOW = seated(0.52, 0.62, clasped, 'down');
const SIT_LOOK = seated(0.3, -0.14, onKnees, 'open');
const standLH = toHands(F, FH, standL);
const SIT_MID = toHands(F, FH, { ...standL, x: lerp(standL.x, hipSeat[0], 0.55), y: lerp(standL.y, hipSeat[1], 0.7), lean: 0.55, neck: 0.15, arms: [{ a: 0.7, e: 0.5 }, { a: 0.6, e: 0.5 }] });
const RISE_MID = { ...blend(SIT_LOOK, standLH, 0.4), lean: 0.62, neck: 0.05, arms: SIT_LOOK.arms };
const RISE0 = 174.05, RISE1 = 175.45;
const walk3 = walkPlan(F, FH, walkStartX(F, FH, standL), -360, RISE1 + 0.05, 400);

// First shot: at the bench, setting the cloth down. Second shot (same camera, a little later): at the door.
const SET0 = 156.7, SET1 = SET0 + 1.1;
function benchPose(T) {
    if (T < SET0) return withCloth({ ...stand1.s }, T);
    if (T < SET1) {
        const bend = Math.sin(Math.PI * range(T, SET0, SET1));
        const p = { ...stand1.s, lean: lerp(stand1.s.lean, 0.72, bend), neck: lerp(0, 0.25, bend) };
        p.arms = [{ a: lerp(0.9, 1.1, bend), e: lerp(0.9, 0.1, bend) }, { a: lerp(0.8, 1.0, bend), e: lerp(0.9, 0.1, bend) }];
        return T < SET0 + 0.45 ? withCloth(p, T) : p;
    }
    // Straightens, and looks toward the door for a moment.
    const look = E.inOut(range(T, SET1, SET1 + 0.8));
    return { ...stand1.s, neck: -0.05 * look, lean: 0.02 };
}
const GONE = 176.3;                     // hidden behind the second passer with a bench, and gone
function doorPose(T) {
    if (T < SIT) return { ...standL, lean: 0.06 + 0.04 * range(T, 159.8, SIT), neck: 0.12 + 0.1 * range(T, 159.8, SIT) };
    if (T < SIT + 1.5) {
        const u = range(T, SIT, SIT + 1.5);
        return u < 0.5 ? blend(standLH, SIT_MID, E.inOut(u * 2)) : blend(SIT_MID, SIT_UP, E.inOut(u * 2 - 1));
    }
    if (T < DOWN) {
        const b = Math.sin((T - SIT) * 1.6) * 0.008;
        return { ...SIT_UP, lean: SIT_UP.lean + b };
    }
    if (T < CALL + 0.35) {
        let p = blend(SIT_UP, SIT_LOW, E.inOut(range(T, DOWN, DOWN + 1.4)));
        // Two small shudders through the shoulders, a hand pressed to the eyes, the tear.
        const sh = Math.max(0, Math.sin(Math.PI * range(T, TEAR + 0.15, TEAR + 0.75))) * Math.sin((T - TEAR) * 38) * 0.018
            + Math.max(0, Math.sin(Math.PI * range(T, TEAR + 1.1, TEAR + 1.6))) * Math.sin((T - TEAR) * 38) * 0.014;
        p = { ...p, lean: p.lean + sh + 0.04 * range(T, TEAR, TEAR + 0.6), neck: p.neck + 0.05 * range(T, TEAR, TEAR + 0.6) };
        const hu = E.inOut(range(T, TEAR + 0.6, TEAR + 1.3)) * (1 - E.inOut(range(T, TEAR + 2.0, TEAR + 2.7)));
        if (hu > 0) {
            const J = joints(F, FH, p);
            const eye = [J.head[0] - J.R * 0.5, J.head[1] + J.R * 0.12];
            p.arms = [{ hand: [lerp(p.arms[0].hand[0], eye[0], hu), lerp(p.arms[0].hand[1], eye[1], hu)], grip: 1 }, p.arms[1]];
        }
        p.tear = E.inOut(range(T, TEAR, TEAR + 0.8)) * (1 - range(T, CALL + 0.8, CALL + 1.8));
        return p;
    }
    if (T < RISE0) {
        const p = blend(SIT_LOW, SIT_LOOK, E.inOut(range(T, CALL + 0.35, CALL + 0.95)));
        p.tear = 1 - range(T, CALL + 0.8, CALL + 1.8);
        return p;
    }
    if (T < RISE1) {
        const u = range(T, RISE0, RISE1);
        return u < 0.45 ? blend(SIT_LOOK, RISE_MID, E.inOut(u / 0.45)) : blend(RISE_MID, standLH, E.inOut((u - 0.45) / 0.55));
    }
    return T < GONE ? standLH : null;
}

// The folded white cloth he carries in, held in front of him.
function withCloth(p, T) {
    const J = joints(F, FH, { ...p, arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }] });
    const c = [J.hip[0] + 0.15 * FH, J.hip[1] - 0.17 * FH];
    p = { ...p, arms: [{ hand: [c[0] - 0.02 * FH, c[1] + 0.02 * FH], grip: 1 }, { hand: [c[0] + 0.03 * FH, c[1] + 0.015 * FH], grip: 1 }] };
    p.cloth = c;
    return p;
}
function drawCloth(ctx, c, seed) {
    for (let k = 0; k < 3; k++) {
        const y = c[1] - k * 0.022 * FH;
        paint(ctx, block(rectPts(c[0] - 0.09 * FH, y - 0.02 * FH, 0.17 * FH, 0.022 * FH), seed + k, 0.8, 3), mix('#EEEBE3', C.grey, k * 0.08), { tex: 0.4, edge: 0.35 });
    }
}

// ---------- everyone else ----------
// Close to the camera, cut off at the knees and the head: a dark shape with a bench going past, not a walk to watch.
const benchAt = (t, x) => ({ cast: CAST.relA, y: 1075, x0: 2400, v: 820, bench: true, t0: t - (2400 - x) / 820 });
const PASSERS = [
    benchAt(158.9, 700),                                      // someone carries a bench past him at the bench
    benchAt(GONE, 1060),                                      // and another, past the door, when he goes
    { cast: CAST.relB, y: 1060, x0: 2400, v: 760, t0: 178.6 },  // a basin carried across the empty threshold
];
const FAR = [
    { cast: CAST.relC, x0: -60, x1: 520, t0: 155.6, v: 70, carry: true },
    { cast: CAST.relD, x0: 520, x1: -80, t0: 160.2, v: 85 },
    { cast: CAST.relB, x0: -60, x1: 520, t0: 164.4, v: 75, carry: true },
    { cast: CAST.relA, x0: 520, x1: -80, t0: 169.6, v: 80 },
    { cast: CAST.relD, x0: -60, x1: 520, t0: 175.4, v: 90 },
    { cast: CAST.relC, x0: 520, x1: -80, t0: 179.0, v: 65 },
].map((p) => ({ ...p, plan: walkPlan(p.cast, sizeAt(farY), p.x0, p.x1, p.t0, p.v, { carry: p.carry }) }));

function passerPose(p, T) {
    const h = sizeAt(p.y);
    const s = (T - p.t0) * p.v;
    return { h, pose: gait(p.cast, h, s, { x0: p.x0, f: -1, ground: () => p.y, carry: true, stride: 0.54 }) };
}

// ---------- the set ----------

function background(ctx) {
    wash(ctx, -40, -40, 2000, 760, [[0, '#C3CBCB'], [1, '#D9D6CC']], { tex: 0.25, seed: 3 });
    // A tree over the far courtyard wall.
    paint(ctx, block(rectPts(232, 250, 26, 200), 4, 1.5, 3), C.woodDark, { tex: 0.5 });
    [[150, 230, 120, 90], [260, 170, 140, 110], [350, 250, 110, 90], [90, 320, 100, 70], [240, 300, 150, 80]].forEach(([x, y, rx, ry], i) =>
        paint(ctx, shape(ellipsePts(x, y, rx, ry, 14), 40 + i, 14, 2), mix('#7D8A77', '#9AA493', i % 2 * 0.5), { tex: 0.8, angle: 0.4, seed: i }));
    // Far courtyard: floor, wall with a dark gateway.
    paint(ctx, block([[-40, 700], [1960, 640], [1960, 1100], [-40, 1100]], 6, 1, 3), '#B9B09F', { tex: 0.6, mottle: 0.7, seed: 5 });
    // Stone slab joints running with the house front, and a few across.
    for (let k = 1; k < 9; k++) {
        const y0 = 760 + k * k * 9;
        const yAt = (x) => y0 + (HZ - y0) * (x / 5960);
        line(ctx, [[-40, yAt(-40)], [1960, yAt(1960)]], '#8F877A', 1.4 + k * 0.15, { alpha: 0.5, seed: 100 + k, amp: 1.5 });
        const y1 = 760 + (k + 1) * (k + 1) * 9;
        for (let j = 0; j < 7; j++) {
            const x = ((j * 331 + k * 157) % 2000) - 40;
            line(ctx, [[x, yAt(x)], [x - 26 - k * 3, y1 + (HZ - y1) * ((x - 26 - k * 3) / 5960)]], '#8F877A', 1.2 + k * 0.12, { alpha: 0.4, seed: 200 + k * 9 + j, amp: 0.6 });
        }
    }
    paint(ctx, block([[-40, 436], [470, 430], [470, 712], [-40, 714]], 7, 1.2, 4), '#D2CABA', { angle: 1.5, seed: 6 });
    paint(ctx, block([[-40, 418], [480, 410], [482, 440], [-40, 444]], 8, 1.2, 4), '#55595A', { seed: 7 });
    paint(ctx, block([[135, 530], [255, 528], [255, 713], [135, 714]], 9, 1, 3), '#3B3732', { tex: 0.3, seed: 8 });
    paint(ctx, block([[124, 516], [266, 514], [266, 530], [124, 532]], 10, 1, 3), C.woodDark, { seed: 9 });

}

function farPeople(ctx, T) {
    // People crossing the far courtyard, small and soft.
    for (const p of FAR) {
        if (T < p.t0 - 0.1 || T > p.plan.t1 + 0.5) continue;
        const h = sizeAt(farY);
        const pose = p.plan.pose(T, () => farY);
        ctx.save();
        ctx.globalAlpha = 0.9;
        shadow(ctx, pose.x, farY + 2, 0.18 * h, 0.03 * h, 0.15);
        drawFigure(ctx, p.cast, h, carryPose(p.cast, h, pose, p.carry), 500 + p.t0 * 10);
        if (p.carry) drawBasket(ctx, p.cast, h, pose);
        ctx.restore();
    }
}

function carryPose(cast, h, pose, carry) {
    if (!carry) return pose;
    const J = joints(cast, h, { ...pose, arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }] });
    return { ...pose, arms: [{ hand: [J.hip[0] + pose.f * 0.12 * h, J.hip[1] - 0.1 * h], grip: 1 }, { hand: [J.hip[0] + pose.f * 0.16 * h, J.hip[1] - 0.1 * h], grip: 1 }] };
}
function drawBasket(ctx, cast, h, pose) {
    const J = joints(cast, h, { ...pose, arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }] });
    const x = J.hip[0] + pose.f * 0.15 * h, y = J.hip[1] - 0.1 * h;
    paint(ctx, shape([[x - 0.09 * h, y - 0.02 * h], [x + 0.09 * h, y - 0.02 * h], [x + 0.07 * h, y + 0.08 * h], [x - 0.07 * h, y + 0.08 * h]], 3, 0.8, 2), '#A88A5C', { tex: 0.7 });
}

function house(ctx) {
    // Wall, stone dado, timber, then the doorway and its threshold.
    const wall = [[420, topY(420)], [1960, topY(1960)], [1960, baseY(1960)], [420, baseY(420)]];
    paint(ctx, block(wall, 11, 1.2, 6), '#D3C8B1', { angle: 1.57, seed: 11, mottle: 0.8 });
    const dado = (x) => baseY(x) - (baseY(x) - topY(x)) * 0.17;
    paint(ctx, block([[420, dado(420)], [1960, dado(1960)], [1960, baseY(1960)], [420, baseY(420)]], 12, 1, 8), '#A8A295', { seed: 12, mottle: 0.8 });
    for (let k = 1; k < 3; k++) line(ctx, [[420, lerp(dado(420), baseY(420), k / 3)], [1960, lerp(dado(1960), baseY(1960), k / 3)]], '#86807A', 1.4, { alpha: 0.45, seed: 13 + k, amp: 1 });
    // Beam under the eave.
    paint(ctx, block([[420, topY(420)], [1960, topY(1960)], [1960, topY(1960) + 26], [420, topY(420) + 30]], 14, 1, 6), C.woodDark, { seed: 14 });
    // Doorway: the dark room, an open leaf, the far jamb's inner face, the frame.
    const lin = (x) => topY(x) + 120;
    const [d0, d1] = DOOR;
    paint(ctx, block([[d0, lin(d0)], [d1, lin(d1)], [d1, thTop(d1)], [d0, thTop(d0)]], 15, 0.8, 4), '#2A2521', { tex: 0.4, mottle: 0.9, seed: 15 });
    ctx.save();
    const g = ctx.createLinearGradient(d0, 0, d1, 0);
    g.addColorStop(0, 'rgba(70,64,56,0.0)'); g.addColorStop(0.7, 'rgba(70,64,56,0.35)'); g.addColorStop(1, 'rgba(70,64,56,0.1)');
    ctx.fillStyle = g;
    ctx.fillRect(d0, lin(d0), d1 - d0, thTop(d0) - lin(d0));
    ctx.restore();
    paint(ctx, block([[1165, 430], [1215, 428], [1215, 492], [1165, 494]], 16, 0.8, 3), '#504B44', { tex: 0.3, alpha: 0.7, seed: 16 });
    paint(ctx, block([[d0, lin(d0) + 8], [d0 + 46, lin(d0) + 26], [d0 + 46, thTop(d0) - 8], [d0, thTop(d0)]], 17, 0.8, 4), '#3A3029', { angle: 1.57, seed: 17 });
    paint(ctx, block([[d1 - 22, lin(d1) + 6], [d1, lin(d1)], [d1, thTop(d1)], [d1 - 22, thTop(d1) - 4]], 18, 0.6, 4), '#5B4838', { angle: 1.57, seed: 18 });
    paint(ctx, block([[d0 - 18, lin(d0) - 18], [d1 + 18, lin(d1) - 18], [d1 + 18, lin(d1)], [d0 - 18, lin(d0)]], 19, 0.8, 5), C.woodDark, { seed: 19 });
    paint(ctx, block([[d0 - 18, lin(d0) - 18], [d0, lin(d0)], [d0, baseY(d0)], [d0 - 18, baseY(d0 - 18)]], 20, 0.8, 5), C.woodDark, { angle: 1.57, seed: 20 });
    paint(ctx, block([[d1, lin(d1)], [d1 + 18, lin(d1) - 18], [d1 + 18, baseY(d1 + 18)], [d1, baseY(d1)]], 21, 0.8, 5), C.woodDark, { angle: 1.57, seed: 21 });
    // The threshold: a worn beam, its top polished pale in the middle where feet crossed it for years.
    const dip = (x) => Math.sin(Math.PI * clamp((x - d0 - 40) / (d1 - d0 - 80))) * 4;
    const front = [];
    for (let k = 0; k <= 10; k++) { const x = lerp(d0, d1, k / 10); front.push([x, thTop(x) + dip(x)]); }
    paint(ctx, block([...front, [d1, baseY(d1)], [d0, baseY(d0)]], 22, 0.6, 1), '#4C3B2E', { seed: 22, angle: 0 });
    const top = front.map(([x, y]) => [x - 16, y - 8]).reverse();
    paint(ctx, block([...front, ...top], 23, 0.4, 1), '#8A6E55', { seed: 23, tex: 0.6 });
    shadow(ctx, (d0 + d1) / 2 - 8, thTop((d0 + d1) / 2) - 2, 90, 5, 0.0);
    ctx.save();
    ctx.globalAlpha = 0.45;
    paint(ctx, shape(ellipsePts((d0 + d1) / 2 - 8, thTop((d0 + d1) / 2) - 2, 70, 3.5, 10), 24, 0.5, 2), '#B49778', { tex: 0.3, edge: 0 });
    ctx.restore();
    for (let k = 0; k < 4; k++) line(ctx, [[d0 + 10, thTop(d0) + 14 + k * 13], [d1 - 10, thTop(d1) + 12 + k * 12.5]], '#3A2D24', 1.3, { alpha: 0.4, seed: 30 + k, amp: 1.2 });
    // Posts.
    paint(ctx, block([[1495, eaveY(1495) + 40], [1527, eaveY(1527) + 42], [1527, baseY(1527)], [1495, baseY(1495)]], 25, 0.8, 5), C.woodDark, { angle: 1.57, seed: 25 });
    paint(ctx, block([[392, eaveY(392)], [448, eaveY(448)], [448, baseY(448) + 4], [392, baseY(392) + 4]], 26, 1, 6), '#4F3D30', { angle: 1.57, seed: 26 });
    paint(ctx, block([[382, baseY(382) - 30], [458, baseY(458) - 30], [462, baseY(462) + 8], [378, baseY(378) + 8]], 27, 1, 3), '#8E8A80', { seed: 27 });
    // A small lattice window between the door and the post.
    paint(ctx, block([[1342, topY(1342) + 210], [1462, topY(1462) + 210], [1462, topY(1462) + 330], [1342, topY(1342) + 330]], 31, 0.8, 4), '#3A332D', { seed: 31 });
    for (let k = 1; k < 4; k++) {
        const x = 1342 + k * 30;
        line(ctx, [[x, topY(x) + 212], [x, topY(x) + 328]], C.woodDark, 4, { amp: 0.4, seed: 32 + k });
    }
    for (let k = 1; k < 3; k++) line(ctx, [[1344, topY(1344) + 210 + k * 40], [1460, topY(1460) + 210 + k * 40]], C.woodDark, 4, { amp: 0.4, seed: 36 + k });
    paint(ctx, block([[1332, topY(1332) + 200], [1472, topY(1472) + 200], [1472, topY(1472) + 340], [1332, topY(1332) + 340]], 38, 0.8, 4), 'rgba(0,0,0,0)', { tex: 0, mottle: 0, edge: 0.9 });
    // Damp stains low on the plaster.
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    [[620, 700, 140], [880, 690, 90], [1600, 690, 120]].forEach(([x, y, r]) => shadow(ctx, x, y, r, r * 0.5, 0.08, '#8A7A60'));
    ctx.restore();
    // Shadow where wall meets ground.
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    for (let x = 420; x < 1960; x += 60) shadow(ctx, x + 30, baseY(x + 30) + 4, 60, 10, 0.18);
    ctx.restore();
    // Eave and roof tiles.
    paint(ctx, block([[300, -40], [1960, -40], [1960, eaveY(1960)], [300, eaveY(300)]], 28, 1, 6), '#4A4F50', { seed: 28, mottle: 0.8 });
    paint(ctx, block([[300, eaveY(300)], [1960, eaveY(1960)], [1960, topY(1960)], [420, topY(420)], [300, topY(300) - 6]], 29, 0.8, 6), '#3B3129', { seed: 29 });
    for (let x = 300; x < 1960;) {
        const step = 36 - (x - 300) * 0.006;
        paint(ctx, shape(ellipsePts(x + step / 2, eaveY(x) + 2, step * 0.42, step * 0.3, 8), 40 + x, 0.6, 1), '#3A3E3F', { tex: 0.4, edge: 0.3 });
        x += step;
    }
}

function props(ctx) {
    // A long bench under the eave with bowls on it; the cloth stays there once set down.
    const y = pathY(800) - 8, h = sizeAt(y), top = y - 0.27 * h;
    paint(ctx, block([[690, top], [960, top - 8], [960, top + 14], [690, top + 22]], 50, 0.6, 4), C.wood, { seed: 50 });
    for (const [x, d] of [[712, 0], [935, -8]]) {
        paint(ctx, block([[x - 6, top + 18 + d], [x + 6, top + 16 + d], [x + 10, y + d], [x - 2, y + d]], 51 + x, 0.4, 2), C.woodDark, { seed: 51 });
        paint(ctx, block([[x + 14, top + 16 + d], [x + 24, top + 15 + d], [x + 22, y - 10 + d], [x + 14, y - 10 + d]], 53 + x, 0.4, 2), shadeC(C.woodDark), { seed: 53 });
    }
    shadow(ctx, 825, y + 4, 160, 10, 0.18);
    for (let k = 0; k < 4; k++) paint(ctx, shape(ellipsePts(880, top - 6 - k * 9, 30, 9, 10), 60 + k, 0.5, 1), mix('#E6E1D6', '#9DA5A6', k * 0.1), { tex: 0.3, edge: 0.4 });
    // A bamboo basket by the door.
    paint(ctx, shape([[928, 790], [985, 788], [979, 838], [934, 840]], 80, 1, 2), '#A58C62', { tex: 0.8, angle: 1.57 });
}
const shadeC = (c) => mix(c, C.ink, 0.25);

// ---------- shot ----------

const benchTop = () => { const y = pathY(800) - 8; return y - 0.27 * sizeAt(y); };
function father(ctx, T, pose) {
    if (!pose) return;
    const seated = T >= SIT && T < RISE1;
    shadow(ctx, pose.x - (seated ? 40 : 0), pathY(pose.x) + 2, (seated ? 0.24 : 0.2) * FH, 0.03 * FH, 0.2);
    drawFigure(ctx, F, FH, pose, 7);
    if (pose.cloth) drawCloth(ctx, pose.cloth, 70);
}
function caller(ctx, T) {
    // Just outside the frame: only an arm reaching in to beckon, and a shadow.
    const call = E.inOut(range(T, CALL - 0.05, CALL + 0.5)) * (1 - E.inOut(range(T, CALL + 1.6, CALL + 2.2)));
    if (call <= 0) return;
    const h = sizeAt(930);
    const hip = [235 + 40 * call, 930 - 0.04 * h - 0.49 * h * 0.97];
    const wave = Math.max(0, Math.sin((T - CALL - 0.4) * 6.5)) * 0.05 * call;
    const pose = stand(CAST.relA, h, hip[0], 930, 1, { lean: 0.08, arms: [{ hand: [hip[0] + (0.2 + 0.06 * call) * h - wave * h * 0.6, hip[1] - 0.52 * h - wave * h * 0.3], grip: 0.6 }, { a: 0, e: 0.2 }] });
    shadow(ctx, hip[0] + 60, 934, 0.22 * h, 0.03 * h, 0.18);
    drawFigure(ctx, CAST.relA, h, pose, 900);
}
// Foreground passers are out of focus: painted small, darkened, then scaled up over the frame.
let blurC = null;
function passers(main, T) {
    const live = PASSERS.filter((p) => T >= p.t0 && T <= p.t0 + (p.x0 + 600) / p.v);
    if (!live.length) return;
    const W4 = Math.ceil(main.canvas.width / 5), H4 = Math.ceil(main.canvas.height / 5);
    if (!blurC || blurC.width !== W4) { blurC = document.createElement('canvas'); blurC.width = W4; blurC.height = H4; }
    const ctx = blurC.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W4, H4);
    const m = main.getTransform();
    ctx.setTransform(m.a / 5, m.b / 5, m.c / 5, m.d / 5, m.e / 5, m.f / 5);
    for (const p of live) {
        const { h, pose } = passerPose(p, T);
        const J = joints(p.cast, h, { ...pose, arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }] });
        if (p.bench) {
            const by = J.hip[1] - 0.2 * h;
            pose.arms = [{ hand: [J.hip[0] - 0.12 * h, by + 0.03 * h], grip: 1 }, { hand: [J.hip[0] - 0.2 * h, by + 0.03 * h], grip: 1 }];
            shadow(ctx, pose.x, p.y + 4, 0.3 * h, 0.04 * h, 0.2);
            drawFigure(ctx, p.cast, h, pose, 950);
            paint(ctx, block([[J.hip[0] - 0.55 * h, by], [J.hip[0] + 0.2 * h, by], [J.hip[0] + 0.2 * h, by + 0.035 * h], [J.hip[0] - 0.55 * h, by + 0.035 * h]], 951, 1, 4), C.wood, { seed: 951 });
            for (const lx of [-0.5, 0.14]) paint(ctx, block(rectPts(J.hip[0] + lx * h, by + 0.03 * h, 0.03 * h, 0.12 * h), 952 + lx, 0.6, 2), C.woodDark, { seed: 952 });
        } else {
            pose.arms = [{ hand: [J.hip[0] - 0.14 * h, J.hip[1] - 0.12 * h], grip: 1 }, { hand: [J.hip[0] - 0.2 * h, J.hip[1] - 0.12 * h], grip: 1 }];
            shadow(ctx, pose.x, p.y + 4, 0.25 * h, 0.04 * h, 0.2);
            drawFigure(ctx, p.cast, h, pose, 960);
            const x = J.hip[0] - 0.2 * h, y = J.hip[1] - 0.12 * h;
            paint(ctx, shape([[x - 0.13 * h, y - 0.03 * h], [x + 0.13 * h, y - 0.03 * h], [x + 0.1 * h, y + 0.05 * h], [x - 0.1 * h, y + 0.05 * h]], 961, 1, 2), '#8F9493', { tex: 0.5 });
        }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(38,34,30,0.5)';
    ctx.fillRect(0, 0, W4, H4);
    ctx.globalCompositeOperation = 'source-over';
    main.save();
    main.setTransform(1, 0, 0, 1, 0, 0);
    main.imageSmoothingQuality = 'high';
    main.globalAlpha = 0.95;
    main.drawImage(blurC, 0, 0, main.canvas.width, main.canvas.height);
    main.restore();
}
// Almost still; after he is gone, a slow move in on the empty threshold.
const cam = (T) => ({
    cx: lerp(lerp(1010, 1050, range(T, 156.5, 176)), 1120, E.inOut(range(T, 176.3, 184))),
    cy: lerp(600, 660, E.inOut(range(T, 176.3, 184))),
    z: 1.42 * lerp(1, 1.035, range(T, 156.5, 176)) * lerp(1, 1.1, E.inOut(range(T, 176.3, 184))),
});
const post = (ctx) => paint(ctx, block([[-40, -40], [40, -40], [46, 1120], [-40, 1120]], 990, 1.5, 6), '#3A2F27', { angle: 1.57, seed: 990 });
const layers = (pose, clothOn) => [
    { p: 1, draw: background },
    { p: 1, live: true, draw: farPeople },
    { p: 1, draw: (ctx) => { house(ctx); props(ctx); } },
    { p: 1, live: true, draw: (ctx, T) => { if (clothOn(T)) drawCloth(ctx, [760, benchTop() - 4], 70); father(ctx, T, pose(T)); caller(ctx, T); passers(ctx, T); } },
    { screen: true, draw: post },
];
const benchShot = makeShot({ from: 155.8, to: 160.3, cam, layers: layers(benchPose, (T) => T > SET0 + 0.45) });
export const DOOR_SHOT = makeShot({ from: 159.8, to: 184.0, cam, layers: layers(doorPose, () => true) });
export const draw = (ctx, T) => drawShot(ctx, DOOR_SHOT, T);

const grade = { sat: 0.55, warm: -0.15 }, lyric = () => ({ x: 360, y: 250, align: 'left' });
export const SEGMENTS = [
    { from: 155.8, to: 160.3, fade: 1.2, shot: benchShot, draw: (c, T) => drawShot(c, benchShot, T), grade, lyric },
    { from: 159.8, to: 184.0, fade: 0.5, shot: DOOR_SHOT, draw: (c, T) => drawShot(c, DOOR_SHOT, T), grade, lyric },
];
