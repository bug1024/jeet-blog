// Characters: one articulated puppet drawn in flat gouache shapes, used for 75, Dad, Mum and the friends.
// Local units: the hip is at (0, 0), y points down, the figure faces +x. Limb angles are measured from straight down
// and grow toward the facing direction; knees bend backward, elbows bend forward.
import { S, lerp, mix, blob, fill, rng } from './paint.js';

const INK = '#2a2030';
const shade = (c, t = 0.2) => mix(c, INK, t);

export const GIRL = {
    kind: 'girl', head: 17, torso: 31, thigh: 20, shin: 21, upper: 14, fore: 14, arm: 8.5, leg: 9.5,
    c: { skin: '#f2cfb5', cheek: '#ea9389', hair: '#33262f', top: '#e5a1a7', bottom: '#5f4d6a', shoe: '#f6efe4', tie: '#d9606f', eye: '#2b2028' },
};
export const DAD = {
    kind: 'dad', head: 15.5, torso: 62, thigh: 43, shin: 43, upper: 30, fore: 28, arm: 15, leg: 17.5,
    c: { skin: '#e7bd9c', cheek: '#d9947f', hair: '#2a2228', top: '#6d7d92', bottom: '#3e404e', shoe: '#3b302d', eye: '#231c22' },
};
export const MUM = {
    kind: 'mum', head: 15, torso: 56, thigh: 39, shin: 39, upper: 27, fore: 25, arm: 12, leg: 13,
    c: { skin: '#f0c8aa', cheek: '#e0978a', hair: '#3a2a2a', top: '#d9b98f', bottom: '#8f6f63', shoe: '#5a4440', eye: '#2b2028', apron: '#efe3cc' },
};
export const BOY = {
    ...GIRL, kind: 'boy', head: 17.5, torso: 32, thigh: 21, shin: 22,
    c: { skin: '#eac2a2', cheek: '#e0907f', hair: '#2b2224', top: '#e9c463', bottom: '#4f6a8a', shoe: '#e9e2d6', eye: '#2b2028' },
};
export const FRIEND = {
    ...GIRL, kind: 'friend',
    c: { skin: '#f3d2b9', cheek: '#e8988c', hair: '#4a3328', top: '#9fbf9a', bottom: '#6b5a48', shoe: '#efe6d8', tie: '#f2d36b', eye: '#2b2028' },
};

const P0 = {
    lean: 0, hipF: 0, kneeF: 0, hipB: 0, kneeB: 0, shF: 0.08, elF: 0.15, shB: -0.06, elB: 0.15,
    tilt: 0, bob: 0, wind: 0.3, talk: 0,
    back: false, eyes: 'open', mouth: 'smile',
};
export const pose = (o = {}) => ({ ...P0, ...o });
export function blend(a, b, t) {
    const o = { ...(t < 0.5 ? a : b) };
    for (const k of Object.keys(P0)) if (typeof P0[k] === 'number') o[k] = lerp(a[k] ?? P0[k], b[k] ?? P0[k], t);
    return o;
}

// Gaits. p is the cycle phase in radians.
export function run(p, amt = 1, extra = {}) {
    const s = Math.sin(p);
    const knee = (q) => 0.15 + 1.35 * Math.pow(Math.max(0, Math.cos(q)), 1.4) * amt;
    return pose({
        lean: 0.2 * amt, hipF: 0.8 * s * amt, kneeF: knee(p), hipB: -0.8 * s * amt, kneeB: knee(p + Math.PI),
        shF: -0.85 * s * amt, elF: 1.35, shB: 0.85 * s * amt, elB: 1.35,
        bob: Math.abs(Math.cos(p)) * 7 * amt, wind: 0.8, ...extra,
    });
}
export function walk(p, amt = 1, extra = {}) {
    const s = Math.sin(p);
    const knee = (q) => 0.08 + 0.55 * Math.max(0, Math.cos(q)) * amt;
    return pose({
        lean: 0.05, hipF: 0.38 * s * amt, kneeF: knee(p), hipB: -0.38 * s * amt, kneeB: knee(p + Math.PI),
        shF: -0.34 * s * amt, elF: 0.3, shB: 0.34 * s * amt, elB: 0.3, bob: Math.abs(Math.sin(p)) * 2.5 * amt, ...extra,
    });
}
// Poses drawn from the storyboard.
export const POSES = {
    stand: pose(),
    wave: (T) => pose({ shF: 2.75 + Math.sin(T * 9) * 0.25, elF: 0.5 + Math.sin(T * 9) * 0.35, mouth: 'open' }),
    crouch: pose({ lean: 0.55, hipF: 2.0, kneeF: 2.55, hipB: 1.75, kneeB: 2.6, shF: 0.9, elF: 0.7, shB: 0.6, elB: 0.9, tilt: 0.45 }),
    sit: pose({ hipF: 1.55, kneeF: 1.5, hipB: 1.45, kneeB: 1.45, shF: 0.6, elF: 0.6, shB: 0.4, elB: 0.6 }),
    hugKnees: pose({ lean: 0.35, hipF: 2.3, kneeF: 2.75, hipB: 2.2, kneeB: 2.75, shF: 1.1, elF: 1.2, shB: 1.0, elB: 1.3, tilt: 0.2 }),
    armsCrossed: pose({ shF: 0.35, elF: 2.35, shB: 0.3, elB: 2.4, mouth: 'pout', eyes: 'cross', tilt: -0.08 }),
    laugh: pose({ lean: -0.12, shF: 2.2, elF: 0.4, shB: -2.3, elB: -0.3, tilt: -0.25, eyes: 'happy', mouth: 'open' }),
    down: pose({ lean: 0.08, shF: -0.25, elF: 0.4, shB: -0.3, elB: 0.5, tilt: 0.5, eyes: 'down', mouth: 'flat' }),
    point: pose({ shF: 1.85, elF: 0.1, shB: -0.1, elB: 0.4, mouth: 'open', tilt: -0.1 }),
    cup: pose({ lean: -0.05, shF: 1.35, elF: 2.25, shB: 1.2, elB: 2.3, tilt: -0.15, mouth: 'open', back: true }),
    reach: pose({ shF: 1.5, elF: 0.15 }),
    open: pose({ shF: 1.7, elF: 0.3, shB: 1.5, elB: 0.4 }),
    kneel: pose({ hipF: 1.6, kneeF: 1.6, hipB: -0.05, kneeB: 1.62, lean: 0.05 }),
};

const at = (p, a, L) => [p[0] + Math.sin(a) * L, p[1] + Math.cos(a) * L];

export function joints(R, p) {
    const hip = [0, 0];
    const up = Math.PI - p.lean;
    const neck = at(hip, up, R.torso);
    const sh = at(hip, up, R.torso * 0.86);
    const head = at(neck, Math.PI - (p.lean + p.tilt * 0.4), R.head * 0.95 + 3);
    const kneeF = at(hip, p.hipF, R.thigh), footF = at(kneeF, p.hipF - p.kneeF, R.shin);
    const kneeB = at(hip, p.hipB, R.thigh), footB = at(kneeB, p.hipB - p.kneeB, R.shin);
    const elF = at(sh, p.shF, R.upper), handF = at(elF, p.shF + p.elF, R.fore);
    const elB = at(sh, p.shB, R.upper), handB = at(elB, p.shB + p.elB, R.fore);
    return { hip, neck, sh, head, kneeF, footF, kneeB, footB, elF, handF, elB, handB };
}

function line(ctx, pts, w, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
}

function drawArm(ctx, R, sh, el, hand, back) {
    const c = R.c;
    const sleeve = back ? shade(c.top, 0.16) : c.top;
    // Forearm ends a little before the hand so the hand reads as its own shape.
    const wrist = [lerp(el[0], hand[0], 0.78), lerp(el[1], hand[1], 0.78)];
    line(ctx, [sh, el, wrist], R.arm, sleeve);
    ctx.beginPath();
    ctx.arc(hand[0], hand[1], R.arm * 0.56, 0, Math.PI * 2);
    fill(ctx, back ? shade(c.skin, 0.1) : c.skin);
}

function drawLeg(ctx, R, hip, knee, foot, back, p) {
    const c = R.c;
    const k = back ? 0.18 : 0;
    if (R.kind === 'boy') {
        line(ctx, [hip, knee], R.leg * 1.12, shade(c.bottom, k));
        line(ctx, [knee, foot], R.leg * 0.8, shade(c.skin, k * 0.6));
    } else {
        line(ctx, [hip, knee, foot], R.leg, shade(c.bottom, k));
    }
    // Shoe points along the foot, roughly level.
    const dir = Math.atan2(foot[1] - knee[1], foot[0] - knee[0]) - Math.PI / 2;
    ctx.save();
    ctx.translate(foot[0], foot[1]);
    ctx.rotate(Math.max(-0.7, Math.min(0.7, dir * 0.5)));
    ctx.beginPath();
    ctx.ellipse(R.leg * 0.35, R.leg * 0.12, R.leg * 0.88, R.leg * 0.5, 0, 0, Math.PI * 2);
    fill(ctx, shade(c.shoe, k + 0.04));
    ctx.restore();
}

function drawTorso(ctx, R, J, p) {
    const c = R.c;
    ctx.save();
    ctx.rotate(p.lean);
    const t = R.torso;
    if (R.kind === 'girl' || R.kind === 'friend') {
        // A short A-line top that flares at the hem.
        const flare = 15 + Math.sin(S.T * 6) * 0.6 * p.wind;
        ctx.beginPath();
        ctx.moveTo(-8, -t + 1);
        ctx.quadraticCurveTo(-11, -t * 0.4, -flare - p.wind * 3, 7);
        ctx.quadraticCurveTo(0, 10, flare - p.wind * 2, 6);
        ctx.quadraticCurveTo(11, -t * 0.4, 8, -t + 1);
        ctx.quadraticCurveTo(0, -t - 3, -8, -t + 1);
        fill(ctx, c.top);
        // Collar and a fold of shade along the back.
        ctx.beginPath();
        ctx.moveTo(-9, -t * 0.6);
        ctx.quadraticCurveTo(-12, -t * 0.1, -flare + 2, 6);
        ctx.lineTo(-flare + 7, 7);
        ctx.quadraticCurveTo(-7, -t * 0.2, -6, -t * 0.62);
        fill(ctx, shade(c.top, 0.12), 0.8);
        ctx.beginPath();
        ctx.ellipse(1, -t + 2, 6.5, 3, 0, 0, Math.PI * 2);
        fill(ctx, '#fbf3e8', 0.9);
    } else if (R.kind === 'boy') {
        ctx.beginPath();
        ctx.moveTo(-10, -t + 1);
        ctx.quadraticCurveTo(-13, -t * 0.4, -12, 5);
        ctx.lineTo(12, 5);
        ctx.quadraticCurveTo(13, -t * 0.4, 10, -t + 1);
        ctx.quadraticCurveTo(0, -t - 3, -10, -t + 1);
        fill(ctx, c.top);
    } else {
        const sw = R.kind === 'mum' ? 17 : 21, hw = R.kind === 'mum' ? 17 : 16;
        ctx.beginPath();
        ctx.moveTo(-sw, -t + 6);
        ctx.quadraticCurveTo(-sw - 2, -t * 0.5, -hw, 8);
        ctx.quadraticCurveTo(0, 12, hw, 8);
        ctx.quadraticCurveTo(sw + 2, -t * 0.5, sw, -t + 6);
        ctx.quadraticCurveTo(0, -t - 6, -sw, -t + 6);
        fill(ctx, c.top);
        ctx.beginPath();
        ctx.moveTo(-sw + 2, -t * 0.7);
        ctx.quadraticCurveTo(-sw - 1, -t * 0.2, -hw + 1, 7);
        ctx.lineTo(-hw + 9, 9);
        ctx.quadraticCurveTo(-sw + 8, -t * 0.3, -sw + 9, -t * 0.72);
        fill(ctx, shade(c.top, 0.12), 0.75);
        if (R.kind === 'mum') {
            ctx.beginPath();
            ctx.moveTo(-4, -t * 0.55);
            ctx.lineTo(15, -t * 0.55);
            ctx.quadraticCurveTo(20, -t * 0.1, 19, 30);
            ctx.lineTo(-2, 32);
            ctx.closePath();
            fill(ctx, c.apron);
        }
    }
    ctx.restore();
}

function eye(ctx, x, y, r, kind, far) {
    const s = far ? 0.85 : 1;
    ctx.fillStyle = '#2b2028';
    ctx.strokeStyle = '#2b2028';
    ctx.lineCap = 'round';
    ctx.lineWidth = r * 0.075;
    if (kind === 'closed' || kind === 'down') {
        ctx.beginPath();
        ctx.arc(x, y - r * 0.02, r * 0.11 * s, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
    } else if (kind === 'happy') {
        ctx.beginPath();
        ctx.arc(x, y + r * 0.06, r * 0.11 * s, 1.15 * Math.PI, 1.85 * Math.PI);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.075 * s, r * 0.112 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + r * 0.025, y - r * 0.04, r * 0.026, 0, Math.PI * 2);
        ctx.fillStyle = '#fff8ee';
        ctx.fill();
        if (kind === 'cross') {
            // A low brow: stubborn.
            ctx.lineWidth = r * 0.07;
            ctx.beginPath();
            ctx.moveTo(x - r * 0.12, y - r * 0.24);
            ctx.lineTo(x + r * 0.12, y - r * 0.15);
            ctx.stroke();
        }
    }
}

function mouth(ctx, x, y, r, kind, talk) {
    if (talk > 0 && Math.floor(S.T * 7) % 2 === 0) kind = kind === 'open' ? 'smile' : 'o';
    ctx.strokeStyle = '#7a3a3e';
    ctx.lineWidth = r * 0.07;
    ctx.lineCap = 'round';
    ctx.beginPath();
    if (kind === 'open') {
        ctx.ellipse(x, y + r * 0.02, r * 0.14, r * 0.12, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#9b4049';
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x, y + r * 0.08, r * 0.08, r * 0.045, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#e4838a';
        ctx.fill();
    } else if (kind === 'o') {
        ctx.ellipse(x, y + r * 0.02, r * 0.07, r * 0.085, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#9b4049';
        ctx.fill();
    } else if (kind === 'flat') {
        ctx.moveTo(x - r * 0.1, y + r * 0.03);
        ctx.lineTo(x + r * 0.08, y + r * 0.02);
        ctx.stroke();
    } else if (kind === 'pout') {
        ctx.arc(x, y + r * 0.13, r * 0.1, 1.2 * Math.PI, 1.8 * Math.PI);
        ctx.stroke();
    } else {
        ctx.arc(x, y - r * 0.05, r * 0.13, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
    }
}

function drawHead(ctx, R, J, p) {
    const c = R.c, r = R.head;
    ctx.save();
    ctx.translate(J.head[0], J.head[1]);
    ctx.rotate(p.lean + p.tilt);
    // Neck.
    ctx.beginPath();
    ctx.ellipse(-r * 0.05, r * 0.85, r * 0.26, r * 0.4, 0, 0, Math.PI * 2);
    fill(ctx, shade(c.skin, 0.12));
    if (p.back) ctx.scale(-1, 1);
    const wind = p.wind * (p.back ? -1 : 1);
    if (R.kind === 'girl' || R.kind === 'friend') {
        // Pigtails stream behind the head in the wind (75), or a short bob (friend).
        if (R.kind === 'girl') {
            for (const [ox, oy, k] of [[-0.62, 0.42, 0.85], [-0.2, 0.62, 1]]) {
                const a = 0.5 + wind * 0.9 + Math.sin(S.T * 8 + ox * 9) * 0.14 * Math.abs(p.wind) + 0.2;
                ctx.save();
                ctx.translate(ox * r, oy * r);
                ctx.rotate(a);
                ctx.beginPath();
                ctx.moveTo(0, -r * 0.16);
                ctx.quadraticCurveTo(-r * 0.3, r * 0.3 * k, -r * 0.08, r * 0.86 * k);
                ctx.quadraticCurveTo(r * 0.16, r * 0.4, r * 0.15, -r * 0.05);
                ctx.closePath();
                fill(ctx, k < 1 ? shade(c.hair, 0.15) : c.hair);
                ctx.beginPath();
                ctx.arc(0, -r * 0.02, r * 0.13, 0, Math.PI * 2);
                fill(ctx, c.tie);
                ctx.restore();
            }
        }
        ctx.beginPath();
        ctx.ellipse(-r * 0.1, -r * 0.08, r * 1.02, r * 1.0, 0, 0, Math.PI * 2);
        fill(ctx, c.hair);
        if (R.kind === 'friend') {
            ctx.beginPath();
            ctx.moveTo(-r * 1.1, -r * 0.2);
            ctx.quadraticCurveTo(-r * 1.2, r * 0.7, -r * 0.6, r * 0.82);
            ctx.lineTo(r * 0.1, r * 0.5);
            ctx.lineTo(-r * 0.2, -r * 0.4);
            fill(ctx, c.hair);
        }
        ctx.beginPath();
        ctx.ellipse(r * 0.2, r * 0.13, r * 0.8, r * 0.82, 0, 0, Math.PI * 2);
        fill(ctx, c.skin);
        // Bangs, lifted a little by the wind.
        const lift = Math.sin(S.T * 9) * r * 0.03 * Math.abs(p.wind);
        ctx.beginPath();
        ctx.moveTo(-r * 0.5, -r * 0.8);
        ctx.quadraticCurveTo(r * 0.45, -r * 1.22, r * 1.02, -r * 0.3 + lift);
        ctx.quadraticCurveTo(r * 0.72, -r * 0.42, r * 0.5, -r * 0.3 + lift);
        ctx.quadraticCurveTo(r * 0.3, -r * 0.5, r * 0.05, -r * 0.34);
        ctx.quadraticCurveTo(-r * 0.15, -r * 0.4, -r * 0.3, -r * 0.2);
        ctx.closePath();
        fill(ctx, c.hair);
        ctx.beginPath();
        ctx.ellipse(-r * 0.12, r * 0.18, r * 0.14, r * 0.2, 0, 0, Math.PI * 2);
        fill(ctx, shade(c.skin, 0.06));
    } else if (R.kind === 'boy') {
        ctx.beginPath();
        ctx.ellipse(r * 0.12, r * 0.1, r * 0.92, r * 0.92, 0, 0, Math.PI * 2);
        fill(ctx, c.skin);
        ctx.beginPath();
        ctx.moveTo(-r * 0.85, r * 0.3);
        ctx.quadraticCurveTo(-r * 1.0, -r * 0.9, r * 0.2, -r * 0.95);
        ctx.quadraticCurveTo(r * 1.0, -r * 0.85, r * 0.95, -r * 0.3);
        ctx.quadraticCurveTo(r * 0.4, -r * 0.5, -r * 0.3, -r * 0.3);
        ctx.quadraticCurveTo(-r * 0.4, 0, -r * 0.55, r * 0.35);
        fill(ctx, c.hair);
    } else {
        // Adults: Dad's short hair, Mum's long hair falling behind.
        if (R.kind === 'mum') {
            ctx.beginPath();
            ctx.moveTo(-r * 0.9, -r * 0.4);
            ctx.quadraticCurveTo(-r * 1.25, r * 1.2, -r * 0.7, r * 2.1);
            ctx.lineTo(r * 0.05, r * 1.4);
            ctx.lineTo(r * 0.1, -r * 0.6);
            fill(ctx, c.hair);
        }
        ctx.beginPath();
        ctx.ellipse(r * 0.12, r * 0.08, r * 0.86, r * 0.98, 0, 0, Math.PI * 2);
        fill(ctx, c.skin);
        ctx.beginPath();
        ctx.moveTo(-r * 0.78, r * 0.25);
        ctx.quadraticCurveTo(-r * 1.0, -r * 0.95, r * 0.2, -r * 1.02);
        ctx.quadraticCurveTo(r * 0.95, -r * 0.95, r * 0.95, -r * 0.35);
        ctx.quadraticCurveTo(r * 0.45, -r * 0.62, -r * 0.2, -r * 0.45);
        ctx.quadraticCurveTo(-r * 0.35, -r * 0.05, -r * 0.45, r * 0.3);
        fill(ctx, c.hair);
        ctx.beginPath();
        ctx.ellipse(-r * 0.08, r * 0.15, r * 0.13, r * 0.2, 0, 0, Math.PI * 2);
        fill(ctx, shade(c.skin, 0.08));
        // Nose.
        ctx.beginPath();
        ctx.moveTo(r * 0.92, -r * 0.05);
        ctx.quadraticCurveTo(r * 1.1, r * 0.22, r * 0.9, r * 0.28);
        fill(ctx, c.skin);
    }
    const adult = R.kind === 'dad' || R.kind === 'mum';
    const ey = adult ? -r * 0.05 : r * 0.05;
    if (!adult) eye(ctx, r * 0.78, ey - r * 0.01, r, p.eyes, true);
    eye(ctx, adult ? r * 0.6 : r * 0.33, ey, r * (adult ? 0.9 : 1), p.eyes, false);
    ctx.beginPath();
    ctx.ellipse(adult ? r * 0.5 : r * 0.42, r * 0.36, r * 0.17, r * 0.1, 0, 0, Math.PI * 2);
    fill(ctx, c.cheek, adult ? 0.35 : 0.6);
    mouth(ctx, adult ? r * 0.66 : r * 0.6, adult ? r * 0.52 : r * 0.47, r * (adult ? 0.9 : 1), p.mouth, p.talk);
    ctx.restore();
}

const PARTS = ['armB', 'legB', 'legF', 'torso', 'head', 'armF'];

// Where a figure's joints land on stage, without drawing it.
export function place(R, p, x, y, s = 1, flip = 1, o = {}) {
    const J = joints(R, p);
    let oy = -(p.bob || 0);
    if (o.anchor !== 'hip') oy += -Math.max(J.footF[1], J.footB[1]) - R.leg * 0.55;
    return { J, toStage: (pt) => [x + pt[0] * s * flip, y + (pt[1] + oy) * s] };
}

// Draw a figure. x, y: where the feet touch the ground (or the hip with o.anchor = 'hip'). flip = -1 faces left.
// Returns a mapper from local joint coordinates to stage coordinates, for props and other figures to attach to.
export function figure(ctx, R, p, x, y, s = 1, flip = 1, o = {}) {
    const J = joints(R, p);
    let oy = -(p.bob || 0);
    if (o.anchor !== 'hip') oy += -Math.max(J.footF[1], J.footB[1]) - R.leg * 0.55;
    const toStage = (pt) => [x + pt[0] * s * flip, y + (pt[1] + oy) * s];
    if (o.shadow !== false && o.anchor !== 'hip') {
        ctx.beginPath();
        ctx.ellipse(x + (o.shadowX || 0), y + 2 * s, R.torso * 0.75 * s, R.torso * 0.13 * s, 0, 0, Math.PI * 2);
        fill(ctx, '#3a2530', o.shadowAlpha ?? 0.18);
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * flip, s);
    ctx.translate(0, oy);
    if (o.alpha != null) ctx.globalAlpha = o.alpha;
    const parts = o.parts || PARTS;
    const draw = {
        armB: () => drawArm(ctx, R, J.sh, J.elB, J.handB, true),
        legB: () => drawLeg(ctx, R, J.hip, J.kneeB, J.footB, true, p),
        legF: () => drawLeg(ctx, R, J.hip, J.kneeF, J.footF, false, p),
        torso: () => drawTorso(ctx, R, J, p),
        head: () => drawHead(ctx, R, J, p),
        armF: () => drawArm(ctx, R, J.sh, J.elF, J.handF, false),
    };
    for (const part of PARTS) if (parts.includes(part)) draw[part]();
    ctx.restore();
    return { J, toStage };
}

// 75 seen from behind: for the shots where she looks out at the world, or runs off into it.
export function girlBack(ctx, x, y, s, T, o = {}) {
    const { run = 0, phase = T * 9, wind = 0.6, alpha = 1 } = o;
    const c = GIRL.c;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.ellipse(0, 2, 26, 5, 0, 0, Math.PI * 2);
    fill(ctx, '#3a2530', 0.18);
    const lift = (k) => Math.max(0, Math.sin(phase + k)) * 16 * run;
    const bob = Math.abs(Math.sin(phase)) * 5 * run;
    ctx.translate(0, -bob);
    for (const [side, k] of [[-1, 0], [1, Math.PI]]) {
        const l = lift(k);
        line(ctx, [[side * 5, -43], [side * 6, -8 - l]], 10, c.bottom);
        ctx.beginPath();
        ctx.ellipse(side * 6, -4 - l, 6, 5, 0, 0, Math.PI * 2);
        fill(ctx, c.shoe);
    }
    for (const [side, k] of [[-1, Math.PI], [1, 0]]) {
        const swing = Math.sin(phase + k) * 0.5 * run;
        line(ctx, [[side * 9, -70], [side * (14 + swing * 4), -54 + swing * 6], [side * (15 + swing * 6), -42 + swing * 10]], 8.5, c.top);
        ctx.beginPath();
        ctx.arc(side * (15 + swing * 6), -40 + swing * 10, 4.6, 0, Math.PI * 2);
        fill(ctx, c.skin);
    }
    ctx.beginPath();
    ctx.moveTo(-8, -74);
    ctx.quadraticCurveTo(-12, -55, -16, -38);
    ctx.quadraticCurveTo(0, -35, 16, -38);
    ctx.quadraticCurveTo(12, -55, 8, -74);
    ctx.quadraticCurveTo(0, -77, -8, -74);
    fill(ctx, c.top);
    // Head from behind: hair all round, a pigtail each side lifted by the wind.
    for (const side of [-1, 1]) {
        const a = side * (0.5 + Math.sin(T * 7 + side) * 0.08) + wind * 0.6;
        ctx.save();
        ctx.translate(side * 13, -92);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.quadraticCurveTo(side * 9, 8, side * 3, 17);
        ctx.quadraticCurveTo(-side * 3, 8, -side * 2, -2);
        fill(ctx, c.hair);
        ctx.beginPath();
        ctx.arc(0, -1, 2.4, 0, Math.PI * 2);
        fill(ctx, c.tie);
        ctx.restore();
    }
    ctx.beginPath();
    ctx.ellipse(0, -96, 17, 17.5, 0, 0, Math.PI * 2);
    fill(ctx, c.hair);
    ctx.strokeStyle = mix(c.hair, '#ffffff', 0.3);
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = alpha * 0.4;
    ctx.beginPath();
    ctx.moveTo(0, -112);
    ctx.lineTo(0, -84);
    ctx.stroke();
    ctx.restore();
}

// Dad from behind, standing: for watching her go.
export function dadBack(ctx, x, y, s, o = {}) {
    const c = DAD.c;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.ellipse(0, 2, 40, 7, 0, 0, Math.PI * 2);
    fill(ctx, '#3a2530', 0.18);
    for (const side of [-1, 1]) {
        line(ctx, [[side * 9, -88], [side * 11, -8]], 18, c.bottom);
        ctx.beginPath();
        ctx.ellipse(side * 12, -4, 10, 7, 0, 0, Math.PI * 2);
        fill(ctx, c.shoe);
    }
    for (const side of [-1, 1]) {
        line(ctx, [[side * 21, -146], [side * 25, -112], [side * 22, -86]], 15, shade(c.top, 0.06));
        ctx.beginPath();
        ctx.arc(side * 22, -83, 7.5, 0, Math.PI * 2);
        fill(ctx, c.skin);
    }
    ctx.beginPath();
    ctx.moveTo(-23, -150);
    ctx.quadraticCurveTo(-25, -110, -17, -84);
    ctx.quadraticCurveTo(0, -80, 17, -84);
    ctx.quadraticCurveTo(25, -110, 23, -150);
    ctx.quadraticCurveTo(0, -158, -23, -150);
    fill(ctx, c.top);
    ctx.beginPath();
    ctx.ellipse(0, -156, 7, 8, 0, 0, Math.PI * 2);
    fill(ctx, shade(c.skin, 0.1));
    ctx.beginPath();
    ctx.ellipse(0, -172, 15, 16.5, 0, 0, Math.PI * 2);
    fill(ctx, c.hair);
    for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(side * 14.5, -170, 3, 5, 0, 0, Math.PI * 2);
        fill(ctx, c.skin);
    }
    ctx.restore();
}

// Hands seen from above, for the desk close-up. a: rotation; open: 0 closed pinch to 1 open.
export function hand(ctx, x, y, s, a, open = 0.5, sleeve = GIRL.c.top) {
    const c = GIRL.c;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.scale(s, s);
    line(ctx, [[0, 140], [0, 34]], 46, sleeve);
    ctx.beginPath();
    ctx.ellipse(0, 18, 21, 25, 0, 0, Math.PI * 2);
    fill(ctx, c.skin);
    const spread = 0.12 + open * 0.2;
    for (let i = 0; i < 4; i++) {
        const fa = (i - 1.5) * spread;
        const len = [17, 21, 20, 15][i];
        ctx.save();
        ctx.translate(Math.sin(fa) * 8 + (i - 1.5) * 8, 2);
        ctx.rotate(fa);
        line(ctx, [[0, 0], [0, -len]], 9.5, c.skin);
        ctx.restore();
    }
    ctx.save();
    ctx.translate(-19, 18);
    ctx.rotate(-0.9 - open * 0.3);
    line(ctx, [[0, 0], [0, -15]], 10, c.skin);
    ctx.restore();
    ctx.beginPath();
    ctx.ellipse(-6, 16, 9, 6, -0.3, 0, Math.PI * 2);
    fill(ctx, c.cheek, 0.18);
    ctx.restore();
}

export { rng };
