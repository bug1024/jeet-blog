// People: one rig for everyone, painted in gouache. Side view, facing f = +1 (right) or -1 (left).
// A pose is a hip point, a torso lean, a head tilt, and targets for the hands and feet; knees and elbows come from IK,
// so feet stay exactly where they are put and nothing slides.
import { clamp, lerp, mix, E, range } from './core.js';
import { C } from './design.js';
import { paint, shape, block, limbPts, smoothPath, wobble, ellipsePts, line, shadow, model } from './gouache.js';

// Proportions as fractions of standing height.
export const ADULT = { head: 0.136, neck: 0.024, torso: 0.3, upper: 0.185, fore: 0.16, hand: 0.05, thigh: 0.245, shin: 0.245, ankle: 0.04, foot: 0.14, depth: 0.13, kid: false };
export const CHILD = { head: 0.165, neck: 0.028, torso: 0.285, upper: 0.17, fore: 0.145, hand: 0.05, thigh: 0.225, shin: 0.225, ankle: 0.04, foot: 0.15, depth: 0.145, kid: true };

const WHITE_SHIRT = '#F0ECE2';
// The family, after the photograph: a lean father in a white shirt with rolled sleeves and dark, high-waisted trousers;
// the elder brother in a pale blue shirt and khaki trousers; the younger son (me) in cream and navy.
export const CAST = {
    fatherYoung: { label: '父亲 · 裁缝', p: ADULT, build: 1.26, belly: 0.4, age: 32, hair: 'swept', grey: 0, top: { kind: 'shirt', color: WHITE_SHIRT, sleeve: 'rolled' }, legs: { color: C.navy, w: 1.15, belt: '#24211F' }, shoe: { kind: 'sandal', color: '#26241F', strap: '#DCD6C8' } },
    fatherTeacher: { label: '父亲 · 教师', p: ADULT, build: 1.3, belly: 0.5, age: 38, hair: 'swept', grey: 0.05, top: { kind: 'shirt', color: WHITE_SHIRT, sleeve: 'rolled', pen: true }, legs: { color: C.navy, w: 1.15, belt: '#24211F' }, shoe: { kind: 'sandal', color: '#26241F', strap: '#DCD6C8' } },
    fatherFuneral: { label: '父亲 · 送别', p: ADULT, build: 1.38, belly: 0.75, age: 50, hair: 'swept', grey: 0.35, top: { kind: 'jacket', color: '#5E6A72', sleeve: 'long', armband: true }, legs: { color: '#33383F', w: 1.05 }, shoe: { kind: 'shoe', color: '#3B342D' } },
    fatherOld: { label: '父亲 · 退休', p: ADULT, build: 1.32, belly: 0.75, age: 65, hair: 'swept', grey: 0.85, stoop: 0.07, top: { kind: 'cardigan', color: '#8E8A7C', under: WHITE_SHIRT, sleeve: 'long' }, legs: { color: '#3B4048', w: 1.05 }, shoe: { kind: 'shoe', color: '#2F2B27' } },
    brother: { label: '哥哥', p: CHILD, build: 1, hair: 'fringe', grey: 0, top: { kind: 'shirt', color: '#B6CCD3', sleeve: 'long', collar: true }, legs: { color: '#A3967A', w: 1, cuff: true }, shoe: { kind: 'sandal', color: '#B79A70', strap: '#B79A70' } },
    sister: { label: '姐姐', p: CHILD, build: 0.96, hair: 'long', grey: 0, top: { kind: 'shirt', color: '#C9907A', sleeve: 'long', collar: true }, legs: { color: '#5C6C55', w: 0.95, cuff: true }, shoe: { kind: 'sandal', color: '#B79A70', strap: '#B79A70' } },
    me: { label: '我', p: CHILD, build: 1, hair: 'crop', grey: 0, top: { kind: 'sweater', color: '#EFE5CF', sleeve: 'long' }, legs: { color: '#3E5072', w: 1, cuff: true, seam: '#D08A3C' }, shoe: { kind: 'sandal', color: '#B79A70', strap: '#B79A70' }, bag: '#7A8358' },
    relA: { label: '亲戚', p: ADULT, build: 1.15, belly: 0.3, age: 45, hair: 'crop', grey: 0.2, top: { kind: 'jacket', color: '#6B6559', sleeve: 'long' }, legs: { color: '#3A3833', w: 1 }, shoe: { kind: 'shoe', color: '#2A2724' } },
    relB: { label: '亲戚', p: ADULT, build: 0.95, hair: 'bun', grey: 0, top: { kind: 'jacket', color: '#3F4E63', sleeve: 'long' }, legs: { color: '#2E3238', w: 1.05 }, shoe: { kind: 'shoe', color: '#2A2724' } },
    relC: { label: '亲戚', p: ADULT, build: 1.1, belly: 0.3, age: 60, hair: 'bun', grey: 0.7, stoop: 0.05, top: { kind: 'jacket', color: '#2F2E2C', sleeve: 'long' }, legs: { color: '#2B2B2B', w: 1.05 }, shoe: { kind: 'shoe', color: '#222' } },
    relD: { label: '亲戚', p: ADULT, build: 1, hair: 'fringe', grey: 0, top: { kind: 'shirt', color: '#E8E4DA', sleeve: 'rolled' }, legs: { color: '#4A4A48', w: 1 }, shoe: { kind: 'shoe', color: '#2A2724' } },
    meAdult: { label: '我 · 成年', p: ADULT, build: 1.05, belly: 0.05, age: 30, hair: 'crop', grey: 0, top: { kind: 'jacket', color: '#46566A', sleeve: 'long', under: '#EFE5CF' }, legs: { color: '#3A3D44', w: 1 }, shoe: { kind: 'shoe', color: '#2B2826' } },
};

// ---------- geometry ----------

export function ik(a, b, l1, l2, bend) {
    let dx = b[0] - a[0], dy = b[1] - a[1];
    let d = Math.hypot(dx, dy);
    const maxD = (l1 + l2) * 0.999, minD = Math.abs(l1 - l2) + 0.001;
    const dd = clamp(d, minD, maxD);
    const base = Math.atan2(dy, dx);
    const A = Math.acos(clamp((l1 * l1 + dd * dd - l2 * l2) / (2 * l1 * dd), -1, 1));
    const ang = base + bend * A;
    const j = [a[0] + Math.cos(ang) * l1, a[1] + Math.sin(ang) * l1];
    // End point: the target if reachable, otherwise as far along as the limb allows.
    const k = dd / (d || 1);
    const end = [a[0] + dx * k, a[1] + dy * k];
    return [j, end];
}

const add = (p, v, s = 1) => [p[0] + v[0] * s, p[1] + v[1] * s];

// Frame vectors for a body part leaning by `ang` (positive = toward facing direction).
function frame(f, ang) {
    return { up: [f * Math.sin(ang), -Math.cos(ang)], fw: [f * Math.cos(ang), Math.sin(ang)] };
}

// Resolve all joints of a pose. Pose fields:
//   x, y (hip), f, lean, neck, legs: [{ankle, rot}, {ankle, rot}] near/far,
//   arms: [{hand:[x,y]} | {a, e}] near/far, eyes, tear, mouth
export function joints(cast, h, pose) {
    const P = cast.p, f = pose.f;
    const lean = (pose.lean || 0) + (cast.stoop || 0) * 0.6;
    const hip = [pose.x, pose.y];
    const tf = frame(f, lean);
    const shoulder = add(add(hip, tf.up, P.torso * h * 0.94), tf.fw, -P.depth * h * 0.08);
    const neckBase = add(hip, tf.up, P.torso * h * 1.0);
    const headAng = lean + (pose.neck || 0) + (cast.stoop || 0) * 0.5;
    const hf = frame(f, headAng);
    const neckTop = add(neckBase, hf.up, P.neck * h);
    const R = (P.head * h) / 2;
    const head = add(add(neckTop, hf.up, R * 0.86), hf.fw, R * 0.02);

    const legs = pose.legs.map((l) => {
        const [knee, ankle] = ik(hip, l.ankle, P.thigh * h, P.shin * h, -f);
        return { hip, knee, ankle, rot: l.rot || 0 };
    });
    const arms = pose.arms.map((a) => {
        let hand = a.hand;
        if (!hand) {
            const d = [-tf.up[0], -tf.up[1]];
            const dir = (t) => [d[0] * Math.cos(t) + tf.fw[0] * Math.sin(t), d[1] * Math.cos(t) + tf.fw[1] * Math.sin(t)];
            const el = add(shoulder, dir(a.a || 0), P.upper * h);
            hand = add(el, dir((a.a || 0) + (a.e || 0)), P.fore * h);
        }
        const [elbow, wrist] = ik(shoulder, hand, P.upper * h, P.fore * h, f);
        return { shoulder, elbow, wrist, grip: a.grip || 0, palm: a.palm };
    });
    return { hip, shoulder, neckBase, neckTop, head, R, lean, headAng, legs, arms, f };
}

// ---------- parts ----------

const shade = (c, k = 0.18) => mix(c, C.ink, k);

function drawFoot(ctx, cast, h, leg, far, seed) {
    const s = cast.shoe, kid = cast.p.kid;
    const L = cast.p.foot / 0.14;
    ctx.save();
    ctx.translate(leg.ankle[0], leg.ankle[1]);
    ctx.rotate(leg.rot);
    ctx.scale(cast.f * h, h);
    const sc = 1 / h;
    const pts = [[-0.022, -0.012], [-0.042, 0.012], [-0.038, 0.04], [0.095 * L, 0.041], [0.112 * L, 0.03], [0.1 * L, 0.016], [0.05 * L, 0.004], [0.022, -0.016]];
    const col = far ? shade(s.color, 0.2) : s.color;
    if (s.kind === 'sandal') {
        // Skin foot, a sole and two straps.
        paint(ctx, shape(pts, seed, 0.002, 2), far ? shade(C.skin, 0.2) : C.skin, { scale: sc, tex: 0.3, edge: 0.18 });
        paint(ctx, shape([[-0.042, 0.03], [0.112 * L, 0.03], [0.11 * L, 0.044], [-0.04, 0.046]], seed + 1, 0.0015, 2), col, { scale: sc, tex: 0.3, edge: 0.1 });
        const strap = far ? shade(s.strap, 0.2) : s.strap;
        line(ctx, [[0.02 * L, 0.03], [0.04 * L, 0.006], [0.06 * L, 0.03]], strap, 0.012, { amp: 0 });
        line(ctx, [[0.07 * L, 0.03], [0.085 * L, 0.014], [0.1 * L, 0.03]], strap, 0.011, { amp: 0 });
        if (!kid) line(ctx, [[-0.03, 0.028], [-0.015, 0.0], [0.0, 0.03]], strap, 0.01, { amp: 0 });
    } else {
        paint(ctx, shape(pts, seed, 0.002, 2), col, { scale: sc, tex: 0.35, edge: 0.15 });
        paint(ctx, shape([[-0.042, 0.034], [0.112 * L, 0.034], [0.11 * L, 0.045], [-0.04, 0.047]], seed + 1, 0.0015, 2), shade(col, 0.3), { scale: sc, tex: 0.2, edge: 0 });
    }
    ctx.restore();
}

function drawLeg(ctx, cast, h, leg, far, seed) {
    const g = cast.legs, kid = cast.p.kid, b = cast.build || 1;
    const col = far ? shade(g.color) : g.color;
    const hem = kid ? 0.92 : 1;
    const ankleUp = add(leg.ankle, [leg.knee[0] - leg.ankle[0], leg.knee[1] - leg.ankle[1]], kid ? 0.16 : 0.02);
    if (kid) {
        // A bare shin between rolled hem and sandal.
        paint(ctx, shape(limbPts([ankleUp, leg.ankle], [0.04 * h, 0.034 * h]), seed + 7, 0.6), far ? shade(C.skin, 0.2) : C.skin, { tex: 0.3, edge: 0.15 });
    }
    const w = [0.082 * h * g.w * b, 0.062 * h * g.w * b, 0.056 * h * g.w * hem];
    const lp = shape(limbPts([leg.hip, leg.knee, kid ? ankleUp : leg.ankle], w, 4), seed, 1.2, 2);
    paint(ctx, lp, col, { angle: Math.atan2(leg.knee[1] - leg.hip[1], leg.knee[0] - leg.hip[0]), edge: 0.2 });
    model(ctx, lp, leg.hip, leg.knee, w[0]);
    model(ctx, lp, leg.knee, leg.ankle, w[1]);
    if (g.cuff) {
        const dir = [leg.knee[0] - ankleUp[0], leg.knee[1] - ankleUp[1]], len = Math.hypot(...dir);
        const top = add(ankleUp, dir, (0.035 * h) / len);
        paint(ctx, shape(limbPts([ankleUp, top], [0.062 * h, 0.062 * h], 2), seed + 3, 0.6), shade(col, -0.05 + 0.1), { tex: 0.4, edge: 0.25 });
    }
    if (g.seam) {
        // The extra seam he ran above the hem, in a thread that does not quite match.
        const dir = [leg.knee[0] - ankleUp[0], leg.knee[1] - ankleUp[1]], len = Math.hypot(...dir), u = [dir[0] / len, dir[1] / len], n = [-u[1], u[0]];
        const c = add(ankleUp, u, 0.055 * h), wv = 0.03 * h;
        const a = add(c, n, wv), b = add(c, n, -wv);
        ctx.save();
        ctx.setLineDash([0.009 * h, 0.006 * h]);
        line(ctx, [a, b], far ? mix(g.seam, C.ink, 0.25) : g.seam, Math.max(0.8, 0.0045 * h), { amp: 0, alpha: 1 });
        ctx.restore();
    }
    // A crease behind the knee.
    if (!far) {
        const k = leg.knee;
        line(ctx, [add(k, [-cast.f * 0.012 * h, -0.02 * h]), add(k, [-cast.f * 0.02 * h, 0.006 * h])], shade(col, 0.3), 1.6, { alpha: 0.35, amp: 0 });
    }
}

function sleeveEnd(cast) {
    return cast.top.sleeve;
}

function drawArm(ctx, cast, h, arm, far, seed) {
    const t = cast.top, b = cast.build || 1;
    const col = far ? shade(t.color) : t.color;
    const skin = far ? shade(C.skin, 0.2) : C.skin;
    const { shoulder: s, elbow: e, wrist: w } = arm;
    const fdir = [w[0] - e[0], w[1] - e[1]], flen = Math.hypot(...fdir) || 1;
    const fu = [fdir[0] / flen, fdir[1] / flen];
    const kid = cast.p.kid;
    // Hand: a soft mitten with a thumb, pointing along the forearm.
    const hand = add(w, fu, 0.022 * h);
    const ang = Math.atan2(fu[1], fu[0]);
    const hs = kid ? 0.9 : 1;
    const handPts = arm.grip > 0.5
        ? ellipsePts(hand[0], hand[1], 0.026 * h * hs, 0.021 * h * hs, 10, ang)
        : ellipsePts(hand[0], hand[1], 0.034 * h * hs, 0.019 * h * hs, 10, ang);
    // Forearm (skin) for rolled sleeves.
    const sleeve = sleeveEnd(cast);
    if (sleeve === 'rolled') {
        paint(ctx, shape(limbPts([e, w], [0.038 * h * b, 0.03 * h]), seed + 2, 0.7), skin, { angle: ang, tex: 0.35, edge: 0.18 });
    }
    paint(ctx, shape(handPts, seed + 4, 0.5, 2), skin, { angle: ang, tex: 0.3, edge: 0.2 });
    const sleeveTo = sleeve === 'rolled' ? add(e, fu, 0.03 * h) : add(w, fu, -0.006 * h);
    const sw = [0.058 * h * b, 0.048 * h * b, sleeve === 'rolled' ? 0.05 * h * b : 0.038 * h * b];
    const ap = shape(limbPts([s, e, sleeveTo], sw, 4), seed, 1.0, 2);
    paint(ctx, ap, col, { angle: Math.atan2(e[1] - s[1], e[0] - s[0]), edge: 0.2 });
    model(ctx, ap, s, e, sw[0], 0.22);
    if (sleeve === 'rolled') {
        // The rolled cuff: a soft fold line just past the elbow.
        line(ctx, [add(add(e, fu, 0.004 * h), [-fu[1], fu[0]], 0.024 * h), add(add(e, fu, 0.008 * h), [fu[1], -fu[0]], 0.024 * h)], shade(col, 0.22), 1.6, { alpha: 0.7, amp: 0.4 });
    } else if (cast.top.kind === 'sweater') {
        paint(ctx, shape(limbPts([add(sleeveTo, fu, -0.022 * h), sleeveTo], [0.04 * h, 0.04 * h], 2), seed + 6, 0.5), shade(col, 0.08), { tex: 0.5, edge: 0.25 });
    }
    if (cast.top.armband && !far) {
        // Black mourning band round the upper arm: a quad across the sleeve.
        const d = [e[0] - s[0], e[1] - s[1]], L = Math.hypot(...d), u = [d[0] / L, d[1] / L], n = [-u[1], u[0]];
        const c0 = add(s, u, L * 0.42), c1 = add(s, u, L * 0.42 + 0.038 * h), r = 0.03 * h * b;
        paint(ctx, block([add(c0, n, r), add(c1, n, r * 0.95), add(c1, n, -r * 0.95), add(c0, n, -r)], seed + 8, 0.5, 2), '#22211F', { tex: 0.4, edge: 0 });
    }
}

// Torso in its own frame: origin at the hip, x forward, y down, units of height.
function torsoPts(cast) {
    const T = cast.p.torso, D = cast.p.depth * (cast.build || 1), kid = cast.p.kid;
    // Middle age: a rounder back, a fuller belly carried low.
    const b = cast.belly || 0;
    const belly = kid ? 0.48 : 0.4 + 0.24 * b;
    return [
        [-0.5 * D, 0.03], [-0.44 * D, -0.3 * T], [-(0.52 + 0.05 * b) * D, -0.66 * T], [-(0.44 + 0.06 * b) * D, -0.9 * T], [-0.2 * D, -1.0 * T],
        [0.16 * D, -1.0 * T], [0.38 * D, -0.92 * T], [0.5 * D, -0.72 * T], [(0.44 + 0.12 * b) * D, -0.55 * T], [belly * D, -0.3 * T], [(0.42 + 0.14 * b) * D, -0.08 * T], [0.2 * D, 0.07], [-0.2 * D, 0.075],
    ];
}

function drawTorso(ctx, cast, h, J, seed) {
    const t = cast.top, T = cast.p.torso, D = cast.p.depth * (cast.build || 1);
    ctx.save();
    ctx.translate(J.hip[0], J.hip[1]);
    ctx.rotate(J.f * J.lean);
    ctx.scale(J.f * h, h);
    const sc = 1 / h;
    const path = shape(torsoPts(cast), seed, 0.005, 2);
    paint(ctx, path, t.color, { scale: sc, angle: 1.45, edge: 0.2 });
    ctx.save();
    ctx.clip(path);
    const fill = (pts, col, o = {}) => paint(ctx, shape(pts, seed + (o.s || 9), o.amp ?? 0.003, 2), col, { scale: sc, tex: 0.4, edge: o.edge ?? 0.15, angle: 0 });
    if (t.kind === 'shirt' && !cast.p.kid) {
        // Tucked into high-waisted trousers with a belt.
        fill([[-0.8 * D, -0.12 * T], [0.8 * D, -0.12 * T], [0.8 * D, 0.12], [-0.8 * D, 0.12]], cast.legs.color, { edge: 0 });
        if (cast.legs.belt) fill([[-0.8 * D, -0.13 * T], [0.8 * D, -0.13 * T], [0.8 * D, -0.085 * T], [-0.8 * D, -0.085 * T]], cast.legs.belt, { s: 11, edge: 0 });
        // Placket and open collar.
        line(ctx, [[0.44 * D, -0.86 * T], [0.47 * D, -0.5 * T], [0.43 * D, -0.15 * T]], shade(t.color, 0.15), 0.003, { amp: 0, alpha: 0.6 });
        fill([[0.1 * D, -1.02 * T], [0.42 * D, -0.95 * T], [0.32 * D, -0.84 * T], [0.12 * D, -0.92 * T]], C.skin, { s: 13, edge: 0.1 });
        if (t.pen) {
            fill([[0.12 * D, -0.76 * T], [0.4 * D, -0.76 * T], [0.4 * D, -0.6 * T], [0.13 * D, -0.6 * T]], shade(t.color, 0.06), { s: 15, edge: 0.25 });
            line(ctx, [[0.3 * D, -0.84 * T], [0.3 * D, -0.7 * T]], '#2E4A6B', 0.006, { amp: 0 });
        }
    } else if (t.kind === 'shirt') {
        fill([[-0.8 * D, -0.02 * T], [0.8 * D, -0.02 * T], [0.8 * D, 0.12], [-0.8 * D, 0.12]], cast.legs.color, { edge: 0 });
        if (t.collar) fill([[0.0 * D, -1.04 * T], [0.42 * D, -0.97 * T], [0.3 * D, -0.86 * T], [0.02 * D, -0.92 * T]], shade(t.color, 0.08), { s: 13, edge: 0.3 });
        line(ctx, [[0.46 * D, -0.86 * T], [0.48 * D, -0.5 * T], [0.44 * D, -0.06 * T]], shade(t.color, 0.2), 0.003, { amp: 0, alpha: 0.6 });
    } else if (t.kind === 'sweater') {
        fill([[-0.8 * D, 0.0], [0.8 * D, 0.0], [0.8 * D, 0.12], [-0.8 * D, 0.12]], cast.legs.color, { edge: 0 });
        fill([[-0.8 * D, -0.07 * T], [0.8 * D, -0.07 * T], [0.8 * D, 0.0], [-0.8 * D, 0.0]], shade(t.color, 0.08), { s: 12, edge: 0.2 });
        fill([[-0.1 * D, -1.04 * T], [0.3 * D, -1.02 * T], [0.32 * D, -0.94 * T], [-0.1 * D, -0.95 * T]], shade(t.color, 0.08), { s: 13, edge: 0.2 });
    } else if (t.kind === 'jacket') {
        fill([[-0.8 * D, 0.02], [0.8 * D, 0.02], [0.8 * D, 0.12], [-0.8 * D, 0.12]], cast.legs.color, { edge: 0 });
        if (t.under) fill([[0.12 * D, -1.02 * T], [0.42 * D, -0.95 * T], [0.4 * D, -0.78 * T], [0.15 * D, -0.88 * T]], t.under, { s: 13, edge: 0.2 });
        fill([[0.0, -1.06 * T], [0.4 * D, -0.98 * T], [0.36 * D, -0.8 * T], [0.1 * D, -0.92 * T]], shade(t.color, 0.1), { s: 14, edge: 0.3 });
        line(ctx, [[0.42 * D, -0.8 * T], [0.48 * D, -0.45 * T], [0.42 * D, 0.0]], shade(t.color, 0.3), 0.003, { amp: 0, alpha: 0.6 });
        fill([[0.05 * D, -0.36 * T], [0.4 * D, -0.36 * T], [0.4 * D, -0.33 * T], [0.05 * D, -0.33 * T]], shade(t.color, 0.25), { s: 16, edge: 0 });
    } else if (t.kind === 'cardigan') {
        fill([[-0.8 * D, 0.02], [0.8 * D, 0.02], [0.8 * D, 0.12], [-0.8 * D, 0.12]], cast.legs.color, { edge: 0 });
        fill([[0.2 * D, -1.02 * T], [0.5 * D, -0.95 * T], [0.5 * D, -0.6 * T], [0.38 * D, -0.6 * T]], t.under, { s: 13, edge: 0.2 });
        for (let k = 0; k < 4; k++) {
            const y = -0.55 * T + k * 0.14 * T;
            ctx.beginPath();
            ctx.arc(0.43 * D, y, 0.006, 0, Math.PI * 2);
            ctx.fillStyle = shade(t.color, 0.4);
            ctx.fill();
        }
    }
    // Shade along the back so the body turns.
    ctx.globalCompositeOperation = 'multiply';
    const g = ctx.createLinearGradient(-0.6 * D, 0, 0.1 * D, 0);
    g.addColorStop(0, 'rgba(120,105,90,0.35)');
    g.addColorStop(1, 'rgba(120,105,90,0)');
    ctx.fillStyle = g;
    ctx.fillRect(-D, -1.2 * T, 2 * D, 1.5 * T);
    ctx.restore();
    ctx.restore();
}

function drawBag(ctx, cast, h, J, seed, part) {
    if (!cast.bag) return;
    const T = cast.p.torso, D = cast.p.depth;
    ctx.save();
    ctx.translate(J.hip[0], J.hip[1]);
    ctx.rotate(J.f * J.lean);
    ctx.scale(J.f * h, h);
    const sc = 1 / h;
    if (part === 'strap') {
        line(ctx, [[0.3 * D, -0.95 * T], [0.15 * D, -0.5 * T], [-0.2 * D, -0.12 * T]], shade(cast.bag, 0.1), 0.012, { amp: 0 });
    } else {
        const pts = [[-0.62 * D, -0.2 * T], [0.05 * D, -0.2 * T], [0.08 * D, 0.06], [-0.6 * D, 0.065]];
        paint(ctx, shape(pts, seed, 0.003, 3), cast.bag, { scale: sc, tex: 0.5, edge: 0.3 });
        paint(ctx, shape([[-0.64 * D, -0.21 * T], [0.07 * D, -0.21 * T], [0.06 * D, -0.06 * T], [-0.6 * D, -0.06 * T]], seed + 1, 0.003, 2), shade(cast.bag, 0.12), { scale: sc, tex: 0.4, edge: 0.25 });
    }
    ctx.restore();
}

// Head shapes in head units: origin at the centre, x forward, y down, 1 = half the head height.
const FACE = {
    adult: [[-0.86, -0.05], [-0.74, -0.6], [-0.28, -0.96], [0.3, -0.95], [0.64, -0.64], [0.74, -0.3], [0.72, -0.15], [0.92, 0.13], [0.79, 0.24], [0.8, 0.38], [0.76, 0.47], [0.78, 0.56], [0.66, 0.76], [0.38, 0.9], [0.02, 0.84], [-0.2, 0.62], [-0.52, 0.42]],
    man: [[-0.74, -0.05], [-0.66, -0.58], [-0.26, -0.93], [0.3, -0.93], [0.62, -0.66], [0.72, -0.32], [0.7, -0.16], [0.94, 0.14], [0.8, 0.26], [0.81, 0.4], [0.77, 0.5], [0.79, 0.6], [0.72, 0.84], [0.44, 1.0], [0.04, 0.96], [-0.22, 0.74], [-0.5, 0.44]],
    kid: [[-0.92, -0.05], [-0.8, -0.66], [-0.28, -1.0], [0.34, -0.96], [0.7, -0.6], [0.8, -0.22], [0.78, -0.08], [0.88, 0.1], [0.78, 0.2], [0.78, 0.32], [0.74, 0.42], [0.62, 0.6], [0.3, 0.72], [-0.05, 0.68], [-0.32, 0.5], [-0.62, 0.34]],
};
const HAIR = {
    swept: [[0.58, -0.62], [0.64, -0.82], [0.42, -1.04], [-0.1, -1.07], [-0.62, -0.93], [-0.92, -0.5], [-0.93, -0.05], [-0.78, 0.28], [-0.52, 0.12], [-0.32, -0.2], [-0.02, -0.3], [0.06, -0.05], [0.16, -0.08], [0.2, -0.42], [0.42, -0.56]],
    fringe: [[0.7, -0.38], [0.76, -0.7], [0.46, -1.1], [-0.15, -1.16], [-0.72, -0.96], [-1.0, -0.45], [-0.97, 0.05], [-0.76, 0.33], [-0.5, 0.18], [-0.32, -0.2], [0.02, -0.3], [0.08, -0.1], [0.2, -0.12], [0.3, -0.38], [0.5, -0.34]],
    bun: [[0.55, -0.6], [0.62, -0.85], [0.35, -1.08], [-0.2, -1.1], [-0.7, -0.9], [-0.95, -0.5], [-1.22, -0.42], [-1.28, -0.1], [-1.0, 0.06], [-0.82, 0.26], [-0.5, 0.12], [-0.3, -0.2], [0.0, -0.3], [0.1, -0.12], [0.2, -0.14], [0.28, -0.44], [0.45, -0.5]],
    // Medium-long, to the shoulders: a soft fringe in front, the back falling past the neck.
    long: [[0.7, -0.4], [0.76, -0.72], [0.46, -1.1], [-0.15, -1.17], [-0.76, -0.98], [-1.05, -0.45], [-1.08, 0.3], [-1.0, 0.95], [-0.84, 1.38], [-0.5, 1.42], [-0.3, 1.05], [-0.28, 0.5], [-0.36, 0.12], [-0.3, -0.2], [0.02, -0.3], [0.08, -0.1], [0.2, -0.12], [0.3, -0.38], [0.5, -0.34]],
    crop: [[0.62, -0.52], [0.66, -0.8], [0.36, -1.08], [-0.2, -1.11], [-0.72, -0.9], [-0.97, -0.4], [-0.92, 0.05], [-0.72, 0.26], [-0.5, 0.12], [-0.3, -0.2], [0.0, -0.3], [0.1, -0.12], [0.2, -0.14], [0.28, -0.44], [0.46, -0.48]],
};

function drawHead(ctx, cast, h, J, pose, seed) {
    const kid = cast.p.kid, R = J.R;
    // Neck from the collar to under the jaw.
    const hf = frame(J.f, J.headAng);
    const jaw = add(add(J.head, hf.up, -R * 0.5), hf.fw, -R * 0.12);
    paint(ctx, shape(limbPts([J.neckBase, jaw], [R * (kid ? 0.62 : 0.9 + 0.2 * (cast.belly || 0)), R * (kid ? 0.6 : 0.82 + 0.16 * (cast.belly || 0))]), seed + 1, 0.6), C.skinShade, { tex: 0.3, edge: 0.1 });

    ctx.save();
    // Looking back over the shoulder: the head turns to face the other way; its tilt stays with the body.
    const back = pose.headBack || 0;
    const hfx = back > 0.5 ? -J.f : J.f;
    ctx.translate(J.head[0] - J.f * R * 0.12 * (back > 0.5 ? 1 : 0), J.head[1]);
    ctx.rotate(back > 0.5 ? J.f * J.lean - J.f * 0.05 : J.f * J.headAng);
    const sq = back > 0 && back < 1 ? Math.max(0.3, Math.abs(2 * back - 1)) : 1;   // turning passes through a narrow, front-on moment
    ctx.scale(hfx * R * (kid ? 1 : 1.06) * sq, R);
    const sc = 1 / R;
    const skin = C.skin;
    const face = kid ? FACE.kid : (cast.age || 0) >= 30 ? FACE.man : FACE.adult;
    paint(ctx, shape(face, seed, 0.012, 2), skin, { scale: sc, angle: 1.2, tex: 0.35, mottle: 0.35, edge: 0.2 });
    // Soft shade at the back of the face, warmth on the cheek.
    ctx.save();
    ctx.clip(smoothPath(face));
    ctx.globalCompositeOperation = 'multiply';
    const g = ctx.createLinearGradient(-0.9, 0, 0.3, 0);
    g.addColorStop(0, 'rgba(170,120,90,0.35)'); g.addColorStop(1, 'rgba(170,120,90,0)');
    ctx.fillStyle = g; ctx.fillRect(-1.2, -1.2, 2.4, 2.4);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = kid ? 0.32 : 0.05;
    ctx.fillStyle = C.blush;
    ctx.beginPath(); ctx.ellipse(0.45, 0.24, 0.17, 0.12, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // Ear.
    paint(ctx, shape(ellipsePts(-0.14, 0.06, 0.13, 0.2, 8), seed + 2, 0.01, 2), C.skinShade, { scale: sc, tex: 0.2, edge: 0.25 });
    // Hair.
    const hairCol = mix(C.hair, '#A8A39A', cast.grey || 0);
    const recede = clamp(((cast.age || 0) - 40) / 30, 0, 1) * 0.16;
    const man = face === FACE.man;
    const hairPts = HAIR[cast.hair].map(([x, y]) => [x > 0.25 && y < -0.3 ? x - recede * (x - 0.25) * 2 : x < 0 && man ? x * 0.86 : x, x > 0.25 && y < -0.3 ? y - recede * 0.4 : y]);
    paint(ctx, shape(hairPts, seed + 3, 0.02, 2), hairCol, { scale: sc, angle: cast.hair === 'swept' ? 0.25 : 1.0, tex: 0.6, edge: 0.15 });
    if (cast.grey > 0.1 && cast.grey < 0.7) {
        // Grey at the temple.
        paint(ctx, shape([[0.0, -0.32], [0.2, -0.42], [0.18, -0.12], [0.06, -0.06]], seed + 4, 0.01, 2), mix(hairCol, '#C8C3B8', 0.6), { scale: sc, tex: 0.5, edge: 0 });
    }
    const strand = mix(hairCol, cast.grey > 0.5 ? '#FFFFFF' : C.ink, 0.25);
    if (cast.hair === 'swept') {
        line(ctx, [[0.5, -0.8], [0.1, -1.0], [-0.4, -0.95], [-0.75, -0.6]], strand, 0.03, { alpha: 0.5, amp: 0 });
        line(ctx, [[0.45, -0.66], [0.0, -0.84], [-0.5, -0.7]], strand, 0.025, { alpha: 0.4, amp: 0 });
    }
    // Eyebrow, eye, mouth.
    const eyes = pose.eyes || 'open';
    const ink = '#2A2420';
    line(ctx, [[0.36, eyes === 'down' ? -0.28 : -0.33], [0.52, -0.37], [0.68, eyes === 'down' ? -0.3 : -0.33]], mix(hairCol, ink, 0.3), kid ? 0.055 : 0.06, { amp: 0 });
    const age = cast.age || 0;
    if (eyes === 'open') {
        ctx.fillStyle = ink;
        if (kid) { ctx.beginPath(); ctx.ellipse(0.52, -0.1, 0.07, 0.085, 0, 0, Math.PI * 2); ctx.fill(); }
        else {
            // A grown man's eye: narrower, with a lid line over it.
            ctx.beginPath(); ctx.ellipse(0.53, -0.1, 0.055, 0.045, 0, 0, Math.PI * 2); ctx.fill();
            line(ctx, [[0.44, -0.15], [0.53, -0.18], [0.62, -0.15]], mix(C.skinShade, ink, 0.4), 0.025, { amp: 0, alpha: 0.8 });
        }
    } else {
        // Lowered or closed: the lid as a short arc.
        line(ctx, [[0.42, -0.1], [0.52, -0.05], [0.62, -0.09]], ink, 0.045, { amp: 0 });
    }
    line(ctx, [[0.66, 0.47], [0.77, pose.mouth === 'tight' ? 0.47 : 0.46]], mix(C.skinShade, ink, 0.35), 0.035, { amp: 0 });
    if (!kid && age >= 30) {
        // Lines of age: from the nose to the mouth, under the eye, across the brow, a heavier jaw.
        const crease = mix(C.skinShade, ink, 0.25);
        line(ctx, [[0.74, 0.2], [0.66, 0.32], [0.64, 0.44]], crease, 0.03, { amp: 0, alpha: clamp((age - 25) / 25, 0.35, 0.8) });
        if (age >= 45) {
            line(ctx, [[0.45, -0.01], [0.53, 0.03], [0.6, 0.0]], crease, 0.022, { amp: 0, alpha: 0.6 });
            line(ctx, [[0.45, -0.5], [0.6, -0.52]], crease, 0.02, { amp: 0, alpha: 0.45 });
            line(ctx, [[0.2, 0.72], [0.45, 0.86]], crease, 0.025, { amp: 0, alpha: 0.4 });
        }
        if (age >= 60) line(ctx, [[0.44, -0.6], [0.58, -0.62]], crease, 0.018, { amp: 0, alpha: 0.4 });
    }
    if (pose.tear > 0) {
        ctx.save();
        ctx.globalAlpha = pose.tear * 0.75;
        line(ctx, [[0.56, 0.0], [0.58, 0.16], [0.55, 0.3]], '#F4F1EA', 0.05, { amp: 0 });
        ctx.restore();
    }
    ctx.restore();
}

// Paint a figure. Order: far arm, far leg, torso, near leg, head, near arm.
export function drawFigure(ctx, cast, h, pose, seed = 1) {
    const J = joints(cast, h, pose);
    const c = { ...cast, f: pose.f };
    drawArm(ctx, c, h, J.arms[1], true, seed + 20);
    drawFoot(ctx, c, h, J.legs[1], true, seed + 30);
    drawLeg(ctx, c, h, J.legs[1], true, seed + 40);
    drawTorso(ctx, c, h, J, seed + 50);
    drawBag(ctx, c, h, J, seed + 55, 'strap');
    drawFoot(ctx, c, h, J.legs[0], false, seed + 60);
    drawLeg(ctx, c, h, J.legs[0], false, seed + 70);
    drawHead(ctx, c, h, J, pose, seed + 80);
    drawBag(ctx, c, h, J, seed + 85, 'bag');
    drawArm(ctx, c, h, J.arms[0], false, seed + 90);
    return J;
}

export function groundShadow(ctx, pose, h, a = 0.2) {
    const [l0, l1] = pose.legs;
    const x = (l0.ankle[0] + l1.ankle[0]) / 2, y = Math.max(l0.ankle[1], l1.ankle[1]) + 0.04 * h;
    shadow(ctx, x, y, 0.2 * h, 0.035 * h, a);
}

// ---------- motion ----------

// Walking, driven by distance (not time), so feet plant and stay planted.
// o: { x0, f, ground(x) -> y, stride, lift, look, carry }
export function gait(cast, h, s, o) {
    const P = cast.p, f = o.f;
    // Shorter steps than a march: a relaxed walk is about 0.6 of standing height per stride (two steps).
    const stride = (o.stride ?? (P.kid ? 0.6 : 0.58)) * h;
    const legLen = (P.thigh + P.shin) * h;
    const ankleH = P.ankle * h;
    const hipX = o.x0 + f * s;
    const p0 = o.p0 || 0;
    const phase = s / stride + p0;
    const g = o.ground;
    const slopeAt = (x) => (g(x + 4) - g(x - 4)) / 8;
    const plantX = (k, off) => o.x0 + f * (k + 0.3 - off - p0) * stride;
    // Roll over the real contact point: the heel at strike, the ball of the foot at push-off.
    const ball = 0.085 * (P.foot / 0.14) * h;
    const pivot = (x, gamma) => {
        const sl = Math.atan(slopeAt(x));
        const contact = gamma < 0 ? -0.035 * h : ball;
        const rotate = (px, py, angle) => [px * Math.cos(angle) - py * Math.sin(angle), px * Math.sin(angle) + py * Math.cos(angle)];
        const base = rotate(f * contact, ankleH, sl);
        const turned = rotate(f * contact, ankleH, sl + f * gamma);
        return { ankle: [x + base[0] - turned[0], g(x) - ankleH + base[1] - turned[1]], rot: sl + f * gamma };
    };
    const STANCE = 0.6;
    const legs = [0, 0.5].map((off) => {
        const q = phase + off, k = Math.floor(q), p = q - k;
        if (p < STANCE) {
            // Heel strike with the toes up, foot flat by a tenth of the cycle, heel rising from the middle of stance.
            const x = plantX(k, off);
            const strike = p < 0.1 ? -0.16 * (1 - E.inOut(p / 0.1)) : 0;
            const gamma = strike + 0.5 * E.in(range(p, 0.3, STANCE));
            return pivot(x, gamma);
        }
        // Swing: the foot leaves heel-first and rises behind, travels fastest under the body, reaches forward
        // and comes down heel first. The height peaks early, which is what bends the knee the way a real one bends.
        const u = (p - STANCE) / (1 - STANCE);
        const e = u * u * (3 - 2 * u);
        const a = pivot(plantX(k, off), 0.5), b = pivot(plantX(k + 1, off), -0.16);
        const H = (o.lift ?? (P.kid ? 0.07 : 0.06)) * h;
        // Highest a quarter of the way through, while the foot is still behind: the heel comes up, not the knee.
        const lift = H * Math.sin(Math.PI * Math.sqrt(u));
        const rot = u < 0.55 ? lerp(a.rot, b.rot - f * 0.05, E.out(u / 0.55)) : lerp(b.rot - f * 0.05, b.rot, E.inOut((u - 0.55) / 0.45));
        return { ankle: [lerp(a.ankle[0], b.ankle[0], e), lerp(a.ankle[1], b.ankle[1], e) - lift], rot };
    });
    // The body rides highest over the standing leg and dips a little as weight passes from foot to foot;
    // the knees never lock straight.
    const sl = slopeAt(hipX);
    let hipY = g(hipX) - ankleH - legLen * 0.965 - Math.cos(4 * Math.PI * (phase - 0.3)) * 0.01 * h;
    for (const l of legs) {
        const dx = l.ankle[0] - hipX, L = legLen * 0.988;
        if (Math.abs(dx) < L) hipY = Math.max(hipY, l.ankle[1] - Math.sqrt(L * L - dx * dx));
    }
    const uphill = -f * sl;
    // A slight forward lean that eases with each push; children lean and swing a bit more.
    const lean = (P.kid ? 0.07 : 0.05) + clamp(uphill, -0.5, 0.5) * 0.35 + Math.sin(4 * Math.PI * (phase - 0.15)) * 0.012 + (o.leanAdd || 0);
    const swing = o.carry ? 0 : (P.kid ? 0.36 : 0.28);
    const arms = [0, 0.5].map((off) => {
        // Arms swing opposite their own leg and a touch behind it; the forward swing bends the elbow, the back swing opens it.
        const a = -swing * Math.cos(2 * Math.PI * (phase + off - 0.06));
        return { a, e: 0.22 + Math.max(0, a) * 0.75 + Math.max(0, -a) * 0.1 };
    });
    return {
        x: hipX, y: hipY, f, lean,
        // The head stays level while the body bobs: it counters the lean and part of the bounce.
        neck: (o.look || 0) - lean * 0.75 - Math.sin(4 * Math.PI * (phase - 0.15)) * 0.01,
        legs, arms, eyes: o.eyes,
    };
}

// Standing still on ground y. o: { spread, weight, arms, lean, neck }
export function stand(cast, h, x, gy, f, o = {}) {
    const P = cast.p;
    const spread = (o.spread ?? 0.07) * h;
    const legLen = (P.thigh + P.shin) * h;
    const ankleY = gy - P.ankle * h;
    const legs = [
        { ankle: [x + f * spread * 0.6, ankleY], rot: 0 },
        { ankle: [x - f * spread * 0.4, ankleY], rot: 0 },
    ];
    return {
        x: x + (o.weight || 0) * h, y: ankleY - legLen * (o.knee ?? (P.kid ? 0.975 : 0.99)), f,
        lean: o.lean ?? 0.0, neck: o.neck ?? 0,
        legs, arms: o.arms || [{ a: 0.12, e: 0.18 }, { a: -0.05, e: 0.15 }],
        eyes: o.eyes,
    };
}

// Linear blend of two poses (points, angles, arm specs resolved to hands by the caller when mixing kinds).
export function blend(a, b, t) {
    if (t <= 0) return a;
    if (t >= 1) return b;
    const L = (x, y) => lerp(x, y, t);
    const P = (p, q) => [L(p[0], q[0]), L(p[1], q[1])];
    const arm = (p, q) => {
        if (p.hand && q.hand) return { hand: P(p.hand, q.hand), grip: L(p.grip || 0, q.grip || 0) };
        if (!p.hand && !q.hand) return { a: L(p.a || 0, q.a || 0), e: L(p.e || 0, q.e || 0) };
        return t < 0.5 ? p : q;   // mixed kinds: convert with toHands() first
    };
    return {
        ...b,
        x: L(a.x, b.x), y: L(a.y, b.y), f: t < 0.5 ? a.f : b.f,
        lean: L(a.lean || 0, b.lean || 0), neck: L(a.neck || 0, b.neck || 0),
        legs: a.legs.map((l, i) => ({ ankle: P(l.ankle, b.legs[i].ankle), rot: L(l.rot || 0, b.legs[i].rot || 0) })),
        arms: a.arms.map((m, i) => arm(m, b.arms[i])),
        eyes: t < 0.5 ? a.eyes : b.eyes,
        tear: L(a.tear || 0, b.tear || 0),
    };
}

// The same pose with every arm given as a hand target (so it can blend with target-driven poses).
export function toHands(cast, h, pose) {
    const J = joints(cast, h, pose);
    return { ...pose, arms: J.arms.map((a, i) => ({ hand: a.wrist, grip: pose.arms[i].grip || 0 })) };
}

// A walk from x0 toward x1 starting at time t0 at speed v (px/s): eases in, cruises, and comes to rest
// on a frame where both feet are down, so the walker can stand still without a foot hanging in the air.
export function walkPlan(cast, h, x0, x1, t0, v, o = {}) {
    const stride = (o.stride ?? (cast.p.kid ? 0.6 : 0.58)) * h;
    const p0 = o.p0 || 0;
    const f = Math.sign(x1 - x0) || 1;
    const ph = Math.abs(x1 - x0) / stride;
    const end = Math.max(p0 + 0.5, Math.round((p0 + ph - 0.06) * 2) / 2 + 0.06);
    const D = (end - p0) * stride;
    const ta = Math.min(o.ta ?? 0.4, D / v);
    const Ttot = D / v + ta;
    const s = (T) => {
        const t = T - t0;
        if (t <= 0) return 0;
        if (t >= Ttot) return D;
        if (t < ta) return (v * t * t) / (2 * ta);
        if (t < Ttot - ta) return (v * ta) / 2 + v * (t - ta);
        return D - (v * (Ttot - t) ** 2) / (2 * ta);
    };
    return {
        f, D, x0, x1: x0 + f * D, t0, t1: t0 + Ttot, s, endPhase: end - Math.floor(end), stride,
        pose: (T, ground, extra = {}) => gait(cast, h, s(T), { x0, f, ground, ...o, stride: stride / h, p0, ...extra }),
    };
}

// Start a walk from a standing pose: the back foot stays, the front foot takes the first step.
// Returns x0 for walkPlan so the gait's planted back foot lands exactly where the standing back foot is.
export function walkStartX(cast, h, standPose, o = {}) {
    const stride = (o.stride ?? (cast.p.kid ? 0.6 : 0.58)) * h;
    const f = standPose.f;
    const back = standPose.legs.reduce((a, l) => (f * l.ankle[0] < f * a.ankle[0] ? l : a)).ankle[0];
    return back + f * 0.2 * stride;
}

// Move one foot (index `mover`) to its new place in a small arc while the body blends across.
export function stepBlend(a, b, u, h, mover = 0) {
    const e = E.inOut(u);
    const p = blend(a, b, e);
    p.legs = a.legs.map((l, i) => {
        const m = b.legs[i];
        if (i !== mover) return { ankle: [...m.ankle], rot: m.rot || 0 };
        return {
            ankle: [lerp(l.ankle[0], m.ankle[0], e), lerp(l.ankle[1], m.ankle[1], e) - Math.sin(Math.PI * clamp(u)) * 0.05 * h],
            rot: lerp(l.rot || 0, m.rot || 0, e),
        };
    });
    return p;
}

// A standing pose that keeps foot `keep` exactly where it is and brings the other beside it.
export function standOn(cast, h, pose, keep, f = pose.f, o = {}) {
    const P = cast.p;
    const k = pose.legs[keep].ankle;
    const spread = (o.spread ?? 0.08) * h;
    const other = [k[0] - f * spread * (keep === 0 ? 1 : -1), k[1]];
    const legs = keep === 0 ? [{ ankle: [...k], rot: 0 }, { ankle: other, rot: 0 }] : [{ ankle: other, rot: 0 }, { ankle: [...k], rot: 0 }];
    const legLen = (P.thigh + P.shin) * h;
    return {
        x: (k[0] + other[0]) / 2, y: Math.max(k[1], other[1]) - legLen * 0.975, f,
        lean: o.lean ?? 0.02, neck: o.neck ?? 0, legs,
        arms: o.arms || [{ a: 0.1, e: 0.2 }, { a: -0.04, e: 0.15 }], eyes: o.eyes,
    };
}
