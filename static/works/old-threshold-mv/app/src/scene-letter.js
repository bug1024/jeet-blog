// 中秋一封来信: three pictures in fourteen seconds. My father, retired, typing slowly on his phone by the window
// with the moon up; me at my desk late, the phone lighting; the message itself, of which only 见字如面 is read.
// It came by a chat app: no postman, no envelope. The screen is generic and every word on it is typeset here.
import { W, H, clamp, lerp, range, E, mix, noise, resetT } from './core.js';
import { C, FONT } from './design.js';
import { paint, shape, block, wash, line, shadow, ellipsePts, rectPts } from './gouache.js';
import { CAST, drawFigure, joints } from './figure.js';
import { makeShot, drawShot } from './shot.js';

const FL = 900;

function chair(ctx, x, seat, h, seed) {
    paint(ctx, block([[x - 0.12 * h, seat], [x + 0.08 * h, seat], [x + 0.08 * h, seat + 12], [x - 0.12 * h, seat + 12]], seed, 0.4, 3), C.wood, { seed });
    paint(ctx, block([[x - 0.13 * h, seat - 0.3 * h], [x - 0.1 * h, seat - 0.3 * h], [x - 0.1 * h, seat], [x - 0.13 * h, seat]], seed + 1, 0.3, 3), C.woodDark, { seed: seed + 1 });
    for (const lx of [x - 0.12 * h, x + 0.06 * h]) paint(ctx, block(rectPts(lx, seat + 12, 8, FL - seat - 12), seed + 2 + lx, 0.3, 2), C.woodDark, { seed: seed + 2 });
}
function seatedPose(cast, h, x, seat, hands, o = {}) {
    const p = { x, y: seat - 3, f: 1, lean: o.lean ?? 0.12, neck: o.neck ?? 0.3, eyes: o.eyes,
        legs: [{ ankle: [x + 0.24 * h, FL - 0.04 * h], rot: 0 }, { ankle: [x + 0.2 * h, FL - 0.04 * h], rot: 0 }], arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }] };
    const J = joints(cast, h, p);
    p.arms = hands(J);
    return p;
}
function phone(ctx, x, y, s, lit, ang = 0) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang);
    paint(ctx, block(rectPts(-11 * s, -18 * s, 22 * s, 36 * s), 700, 0.2, 2), '#222326', { seed: 700, tex: 0.2 });
    ctx.fillStyle = mix('#3A3D44', '#E8ECEA', lit);
    ctx.fillRect(-9 * s, -16 * s, 18 * s, 32 * s);
    ctx.restore();
    if (lit > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, x, y, 60 * s, 50 * s, 0.25 * lit, '#CFE0EA'); ctx.restore(); }
}

// 1. Him, at home, Mid-Autumn evening: the moon in the window, mooncakes and tea on the table.
const OLD = CAST.fatherOld, OH = 560, OX = 760, OSEAT = FL - 0.27 * OH;
function fatherStill(ctx) {
    paint(ctx, block([[1180, 200], [1560, 200], [1560, 560], [1180, 560]], 61, 1, 4), '#33415A', { seed: 61 });
    ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, 1440, 300, 110, 110, 0.35, '#F3E6C4'); ctx.restore();
    paint(ctx, shape(ellipsePts(1440, 300, 38, 38, 16), 62, 0.6, 2), '#F2E7C9', { seed: 62, tex: 0.3, edge: 0 });
    for (const x of [1180, 1370, 1560]) paint(ctx, block(rectPts(x - 7, 196, 14, 368), 63 + x, 0.5, 3), C.woodDark, { seed: 63 });
    for (const y of [200, 380, 556]) paint(ctx, block(rectPts(1174, y - 7, 392, 14), 66 + y, 0.5, 3), C.woodDark, { seed: 66 });
    paint(ctx, block([[-40, FL], [1960, FL], [1960, 1120], [-40, 1120]], 69, 0.6, 4), '#8E7E66', { seed: 69 });
    const top = 640;
    paint(ctx, block([[900, top], [1380, top], [1380, top + 22], [900, top + 22]], 70, 0.6, 4), C.wood, { seed: 70 });
    for (const lx of [920, 1350]) paint(ctx, block(rectPts(lx, top + 22, 14, FL - top - 22), 71 + lx, 0.4, 2), C.woodDark, { seed: 71 });
    paint(ctx, shape(ellipsePts(1180, top - 4, 70, 9, 12), 72, 0.6, 2), '#E8E3D6', { seed: 72 });
    for (const [mx, k] of [[1150, 0], [1205, 1], [1178, 2]]) paint(ctx, shape(ellipsePts(mx, top - 16 - (k === 2 ? 14 : 0), 24, 13, 12), 73 + k, 0.8, 2), '#C08A4E', { seed: 73 + k });
    paint(ctx, shape([[1290, top], [1350, top], [1356, top - 40], [1330, top - 62], [1308, top - 62], [1284, top - 40]], 76, 1, 2), '#7F8B82', { seed: 76 });
    chair(ctx, OX, OSEAT, OH, 80);
    shadow(ctx, OX + 60, FL + 4, 150, 14, 0.2);
}
// Typing with one thumb, slowly; steam from the teapot.
function fatherLive(ctx, T) {
    const tap = Math.max(0, Math.sin(T * 9)) * 4;
    const p = seatedPose(OLD, OH, OX, OSEAT, (J) => {
        const ph = [J.hip[0] + 0.24 * OH, J.hip[1] - 0.17 * OH];
        return [{ hand: [ph[0] + 6, ph[1] + tap], grip: 0.7 }, { hand: [ph[0] - 6, ph[1] + 4], grip: 0.9 }];
    }, { neck: 0.42, lean: 0.16, eyes: 'down' });
    drawFigure(ctx, OLD, OH, p, 41);
    const J = joints(OLD, OH, p);
    phone(ctx, J.hip[0] + 0.25 * OH, J.hip[1] - 0.2 * OH, 1.4, 0.9, -0.4);
    for (let k = 0; k < 3; k++) {
        const t = (T * 0.4 + k / 3) % 1;
        line(ctx, [[1352, 578 - t * 80], [1360 + 6 * Math.sin(t * 6 + k), 560 - t * 80], [1354, 540 - t * 80]], '#F2EADB', 3, { alpha: 0.35 * (1 - t), amp: 0 });
    }
}
const fatherShot = makeShot({
    from: 183.0, to: 185.6,
    cam: (T) => ({ cx: 900, cy: 580, z: lerp(1.2, 1.24, range(T, 183, 186)) }),
    layers: [
        { screen: true, draw: (ctx) => wash(ctx, 0, 0, 1920, 1080, [[0, '#D9CCB0'], [1, '#C8B898']], { tex: 0.3, seed: 60, angle: 1.57 }) },
        { p: 1, draw: fatherStill },
        { p: 1, live: true, draw: fatherLive },
    ],
});

// 2. Me, late at my desk; the phone on the desk lights up and I pick it up.
const ME = CAST.meAdult, MH = 580, MX = 880, MSEAT = FL - 0.27 * MH, DTOP = 650;
function meStill(ctx) {
    paint(ctx, block([[260, 180], [820, 180], [820, 560], [260, 560]], 82, 1, 4), '#28303E', { seed: 82 });
    for (let k = 0; k < 40; k++) {
        const bx = 280 + (k * 71) % 520, by = 210 + Math.floor(k / 7) * 54;
        if (noise(k, 83) > 0.55) paint(ctx, block(rectPts(bx, by, 22, 28), 84 + k, 0.3, 2), '#D9B97A', { seed: k, tex: 0.3, alpha: 0.8 });
    }
    paint(ctx, block([[-40, FL], [1960, FL], [1960, 1120], [-40, 1120]], 85, 0.6, 4), '#4F4A47', { seed: 85 });
    paint(ctx, block([[960, DTOP], [1600, DTOP], [1600, DTOP + 22], [960, DTOP + 22]], 86, 0.6, 4), '#7A6552', { seed: 86 });
    for (const lx of [980, 1570]) paint(ctx, block(rectPts(lx, DTOP + 22, 14, FL - DTOP - 22), 87 + lx, 0.4, 2), '#5C4B3D', { seed: 87 });
    paint(ctx, block([[1080, DTOP - 6], [1260, DTOP - 6], [1270, DTOP], [1070, DTOP]], 88, 0.3, 2), '#4A4C52', { seed: 88 });
    paint(ctx, block([[1250, DTOP - 6], [1270, DTOP - 130], [1262, DTOP - 132], [1240, DTOP - 8]], 89, 0.3, 2), '#5A5D64', { seed: 89 });
    ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, 1200, DTOP - 80, 260, 200, 0.22, '#AFC6D8'); ctx.restore();
    chair(ctx, MX, MSEAT, MH, 90);
    shadow(ctx, MX + 60, FL + 4, 150, 14, 0.25);
}
function meLive(ctx, T) {
    const ring = E.inOut(range(T, 186.2, 186.5));
    const pick = E.inOut(range(T, 186.8, 187.7));
    const p = seatedPose(ME, MH, MX, MSEAT, (J) => {
        const kb = [1150, DTOP - 10];
        const held = [J.shoulder[0] + 0.2 * MH, J.shoulder[1] + 0.12 * MH];
        const near = pick > 0 ? [lerp(kb[0] + 20, held[0], pick), lerp(kb[1], held[1], pick)] : [kb[0] + 20 + Math.sin(T * 11) * 3, kb[1]];
        return [{ hand: near, grip: 0.8 }, { hand: [kb[0] - 20, kb[1] + 2], grip: 0.5 }];
    }, { neck: lerp(0.15, 0.4, pick), lean: lerp(0.12, 0.2, pick), eyes: pick > 0.5 ? 'down' : 'open' });
    drawFigure(ctx, ME, MH, p, 13);
    const J = joints(ME, MH, p);
    if (pick <= 0.05) phone(ctx, 1340, DTOP - 8, 1.2, ring, Math.PI / 2);
    else phone(ctx, J.arms[0].wrist[0] + 8, J.arms[0].wrist[1] - 14, 1.3, 1, -0.3);
}
const meShot = makeShot({
    from: 185.0, to: 188.4,
    cam: (T) => ({ cx: 960, cy: 580, z: lerp(1.2, 1.24, range(T, 185, 188.6)) }),
    layers: [
        { screen: true, draw: (ctx) => wash(ctx, 0, 0, 1920, 1080, [[0, '#4C5564'], [1, '#3C4250']], { tex: 0.3, seed: 81, angle: 1.57 }) },
        { p: 1, draw: meStill },
        { p: 1, live: true, draw: meLive },
    ],
});

// 3. The message, close: only the greeting reads; the rest stays soft grey lines.
function screenBack(ctx) {
    wash(ctx, 0, 0, 1920, 1080, [[0, '#5A5752'], [1, '#46423E']], { tex: 0.4, seed: 91 });
    ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, 960, 540, 700, 520, 0.25, '#C9D6DE'); ctx.restore();
}
function screenLive(ctx, T) {
    const bob = Math.sin(T * 1.1) * 4, s = lerp(1, 1.05, range(T, 187.6, 198.2));
    ctx.translate(960, 560 + bob); ctx.scale(s, s); ctx.rotate(-0.04);
    paint(ctx, shape([[-260, 260], [-120, 140], [150, 140], [280, 300], [300, 600], [-300, 600]], 92, 6, 3), C.skin, { seed: 92 });
    paint(ctx, shape([[-250, 120], [-200, 60], [-170, 80], [-190, 200]], 93, 3, 2), C.skin, { seed: 93 });
    paint(ctx, block(rectPts(-230, -430, 460, 820), 94, 0.4, 4), '#1E1F22', { seed: 94, tex: 0.2 });
    // A plain chat screen: the device's own sans-serif at chat sizes, nothing styled to look old.
    ctx.fillStyle = '#EDEFEE'; ctx.fillRect(-206, -400, 412, 760);
    ctx.fillStyle = '#F7F7F7'; ctx.fillRect(-206, -400, 412, 64);
    ctx.fillStyle = '#DADDDC'; ctx.fillRect(-206, -337, 412, 1);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1F1F1F'; ctx.font = `500 25px ${FONT.ui}`;
    ctx.fillText('爸爸', 0, -358);
    ctx.fillStyle = '#9A9D9C'; ctx.font = `400 16px ${FONT.ui}`;
    ctx.fillText('中秋 20:41', 0, -300);
    ctx.globalAlpha = E.inOut(range(T, 187.9, 188.5));
    // His message: a grey avatar square and a white bubble; the greeting reads, the rest is the shape of text.
    ctx.fillStyle = '#B9B4AA';
    ctx.beginPath(); ctx.roundRect(-190, -270, 40, 40, 6); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.roundRect(-140, -270, 300, 252, 10); ctx.fill();
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1F1F1F'; ctx.font = `400 26px ${FONT.ui}`;
    ctx.fillText('见字如面', -120, -230);
    ctx.fillStyle = '#D3D5D4';
    [236, 252, 214, 244, 168, 226].forEach((w, k) => { ctx.beginPath(); ctx.roundRect(-120, -206 + k * 31, w, 12, 6); ctx.fill(); });
}
const screenShot = makeShot({
    from: 187.6, to: 198.2,
    cam: () => ({ cx: 960, cy: 540, z: 1 }),
    layers: [{ screen: true, draw: screenBack }, { screen: true, live: true, draw: screenLive }],
});

const seg = (shot, o) => ({ from: shot.from, to: shot.to, shot, draw: (c, T) => drawShot(c, shot, T), ...o });
export const SEGMENTS = [
    seg(fatherShot, { fade: 1.0, grade: { warm: 0.12 }, lyric: () => ({ x: 150, y: 190, align: 'left' }) }),
    seg(meShot, { fade: 0.6, grade: { warm: 0.0 }, lyric: () => ({ x: 1100, y: 190, align: 'left', color: '#F2EADB', halo: '#3C4250' }) }),
    seg(screenShot, { fade: 0.5, grade: {}, lyric: () => ({ x: 150, y: 1000, align: 'left', color: '#F2EADB', halo: '#46423E' }) }),
];
