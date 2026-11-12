// 那年去县城: the county town street, the three of us stopped at a shop window; the small flat at dusk;
// the counter where he counts the money twice; the two of us in front of the television with the game console.
// Period objects: a CRT set, a cartridge console with corded pads, bicycles. Signs stay blank; the screen shows
// only soft blocks of colour, never a real game.
import { W, H, clamp, lerp, range, E, mix, noise, resetT } from './core.js';
import { C } from './design.js';
import { paint, shape, block, wash, line, shadow, ellipsePts, rectPts } from './gouache.js';
import { CAST, drawFigure, stand, joints } from './figure.js';
import { makeShot, drawShot } from './shot.js';

const F = CAST.fatherTeacher, ME = CAST.me, BRO = CAST.brother;
const meTown = { ...ME, bag: null }, broTown = { ...BRO };

// ---------- street ----------
const STREET_Y = 880;
function building(ctx, x, w, floors, col, seed, shop = false) {
    const fh = 150, top = STREET_Y - floors * fh - 20;
    paint(ctx, block([[x, top], [x + w, top], [x + w, STREET_Y], [x, STREET_Y]], seed, 1, 4), col, { seed, angle: 1.57 });
    paint(ctx, block([[x - 10, top - 14], [x + w + 10, top - 14], [x + w + 10, top + 6], [x - 10, top + 6]], seed + 1, 0.8, 4), mix(col, C.ink, 0.35), { seed: seed + 1 });
    for (let f = 1; f < floors; f++) for (let k = 0; k < Math.floor(w / 110); k++) {
        const wx = x + 30 + k * 110, wy = STREET_Y - (f + 1) * fh + 30;
        paint(ctx, block(rectPts(wx, wy, 56, 76), seed + 10 + f * 7 + k, 0.6, 2), '#5D6870', { seed: seed + f + k });
        line(ctx, [[wx + 28, wy], [wx + 28, wy + 76]], '#E9E3D6', 2.5, { amp: 0 });
    }
    paint(ctx, block(rectPts(x + 16, STREET_Y - 200, w - 32, 34), seed + 3, 0.6, 3), mix('#C9B994', col, 0.3), { seed: seed + 3 });
    paint(ctx, block(rectPts(x + 30, STREET_Y - 150, w - 60, 150), seed + 4, 0.6, 3), shop ? '#5B6A6E' : '#4C4A45', { seed: seed + 4 });
    if (shop) {
        // A shop window with television sets on a shelf (screens dark grey-blue, nothing on them).
        paint(ctx, block(rectPts(x + 40, STREET_Y - 140, w - 80, 112), seed + 5, 0.5, 3), '#9DB0B3', { seed: seed + 5, alpha: 0.85 });
        for (let k = 0; k < 3; k++) {
            const tx = x + 60 + k * ((w - 120) / 3);
            paint(ctx, block(rectPts(tx, STREET_Y - 118, 70, 56), seed + 6 + k, 0.5, 2), '#3E3D3B', { seed: seed + 6 + k });
            paint(ctx, block(rectPts(tx + 8, STREET_Y - 112, 44, 40), seed + 9 + k, 0.4, 2), '#55707D', { seed: seed + 9 + k });
        }
        paint(ctx, block(rectPts(x + 40, STREET_Y - 58, w - 80, 10), seed + 12, 0.4, 3), C.woodDark, { seed: seed + 12 });
    }
    for (let k = 0; k < Math.floor((w - 20) / 40); k++) {
        paint(ctx, block([[x + 10 + k * 40, STREET_Y - 168], [x + 50 + k * 40, STREET_Y - 168], [x + 54 + k * 40, STREET_Y - 136], [x + 14 + k * 40, STREET_Y - 136]], seed + 20 + k, 0.4, 2), k % 2 ? '#E8E1D0' : '#7D9AA3', { seed: seed + k, tex: 0.4 });
    }
}
function bicycle(ctx, x, y, s, seed, spin = 0, crankA = 0.6) {
    const r = 34 * s, ink = '#2E2E2D';
    for (const cx of [x, x + 92 * s]) {
        ctx.save(); ctx.strokeStyle = ink;
        ctx.lineWidth = 2.6 * s; ctx.beginPath(); ctx.arc(cx, y - r, r, 0, Math.PI * 2); ctx.stroke();
        ctx.lineWidth = 0.5 * s; ctx.globalAlpha = 0.7;
        for (let k = 0; k < 8; k++) { const a = spin + (k * Math.PI) / 8; ctx.beginPath(); ctx.moveTo(cx - Math.cos(a) * r, y - r - Math.sin(a) * r); ctx.lineTo(cx + Math.cos(a) * r, y - r + Math.sin(a) * r); ctx.stroke(); }
        ctx.restore();
    }
    // Frame: rear axle, saddle post, head tube, bottom bracket; a rack over the back wheel, as these bikes had.
    const bb = [x + 46 * s, y - r];
    line(ctx, [[x, y - r], [x + 32 * s, y - r - 46 * s], [x + 80 * s, y - r - 46 * s], [x + 92 * s, y - r]], ink, 2.2 * s, { amp: 0 });
    line(ctx, [[x, y - r], bb, [x + 32 * s, y - r - 46 * s]], ink, 2.2 * s, { amp: 0 });
    line(ctx, [bb, [x + 80 * s, y - r - 46 * s]], ink, 2.2 * s, { amp: 0 });
    line(ctx, [[x + 80 * s, y - r - 46 * s], [x + 84 * s, y - r - 62 * s], [x + 98 * s, y - r - 64 * s]], ink, 2 * s, { amp: 0 });
    line(ctx, [[x + 32 * s, y - r - 46 * s], [x + 31 * s, y - r - 54 * s]], ink, 2 * s, { amp: 0 });
    line(ctx, [[x - 18 * s, y - r - 34 * s], [x + 30 * s, y - r - 34 * s]], ink, 1.6 * s, { amp: 0 });
    paint(ctx, block(rectPts(x + 20 * s, y - r - 58 * s, 22 * s, 6 * s), seed, 0.3, 2), '#3A2E26', { seed });
    // Crank and pedals.
    const cr = 7 * s;
    for (const k of [0, 1]) {
        const a = crankA + k * Math.PI, px = bb[0] + Math.cos(a) * cr, py = bb[1] + Math.sin(a) * cr;
        line(ctx, [bb, [px, py]], ink, 1.6 * s, { amp: 0 });
        line(ctx, [[px - 4 * s, py], [px + 4 * s, py]], ink, 2 * s, { amp: 0 });
    }
    ctx.save(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(bb[0], bb[1], 5 * s, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
// Someone cycling past: the wheels turn and the feet go round the pedals; no walking involved.
// True size for a 430-tall adult: a 26-inch wheel is about 0.38 of standing height.
const BIKE = 2.4;
function cyclist(ctx, cast, x, T, seed, k = 1, yBase = STREET_Y + 34) {
    const s = BIKE * k, r = 34 * s, y = yBase;
    const spin = x / r;                       // wheel angle from distance rolled
    const crankA = spin / 2.6;                // the cranks turn slower than the wheels (the gearing)
    bicycle(ctx, x, y, s, seed, spin, crankA);
    const h = 430 * k, crank = [x + 46 * s, y - r], cr = 7 * s;
    const ped = (k) => [crank[0] + Math.cos(crankA + k * Math.PI) * cr, crank[1] + Math.sin(crankA + k * Math.PI) * cr];
    const hip = [x + 32 * s, y - r - 58 * s];
    const pose = {
        x: hip[0], y: hip[1], f: 1, lean: 0.38, neck: -0.28,
        legs: [{ ankle: [ped(0)[0] - 4, ped(0)[1] - 0.04 * h], rot: 0.15 }, { ankle: [ped(1)[0] - 4, ped(1)[1] - 0.04 * h], rot: 0.15 }],
        arms: [{ hand: [x + 96 * s, y - r - 66 * s], grip: 1 }, { hand: [x + 93 * s, y - r - 64 * s], grip: 1 }],
    };
    drawFigure(ctx, cast, h, pose, seed);
}
function streetStill(ctx) {
    const cols = ['#D8CDB4', '#CDBFA5', '#E1D8C4', '#C5B49A', '#D6CAB0'];
    for (let k = -2; k < 9; k++) building(ctx, k * 330, 320, 2 + (k * 7 % 3 === 0 ? 1 : 0), cols[(k + 10) % 5], 100 + k * 31, k === 3);
    paint(ctx, block([[-800, STREET_Y], [3200, STREET_Y], [3200, 1200], [-800, 1200]], 50, 0.6, 6), '#A9A396', { seed: 50 });
    line(ctx, [[-800, STREET_Y + 60], [3200, STREET_Y + 60]], '#8E897D', 2, { alpha: 0.6, seed: 51 });
    for (let px = -900; px < 3200; px += 900) {
        paint(ctx, block(rectPts(px + 200, 180, 16, STREET_Y + 50 - 180), 52 + px, 0.4, 3), '#7A766E', { seed: 52 });
        line(ctx, [[px + 208, 200], [px + 650, 236], [px + 1108, 200]], '#4A4744', 1.6, { amp: 0.4, alpha: 0.6, seed: 53 + px });
    }
    bicycle(ctx, 1720, STREET_Y + 34, BIKE, 1780);
    for (const x of [1120, 1210, 1290]) shadow(ctx, x, STREET_Y + 64, 70, 9, 0.18);
}
// The three of us stopped in front of the shop with the televisions: him behind with his hands behind his back,
// my brother looking, me with a hand on the glass.
function streetLive(ctx, T) {
    // A cyclist goes by on the far side of the pavement, behind us.
    // Further back, by the shopfronts, so a little smaller and paler.
    ctx.save(); ctx.globalAlpha = 0.9;
    cyclist(ctx, CAST.relD, -200 + 300 * (T - 101), T, 70, 0.8, STREET_Y + 8);
    ctx.restore();
    const g = STREET_Y + 60;
    const fp = stand(F, 470, 1120, g, 1, { lean: 0.02, neck: -0.04, arms: [{ a: -0.35, e: 0.9 }, { a: -0.4, e: 0.9 }] });
    drawFigure(ctx, F, 470, fp, 37);
    drawFigure(ctx, broTown, 368, stand(broTown, 368, 1210, g, 1, { lean: 0.05, neck: -0.08 + Math.sin(T * 0.7) * 0.03, arms: [{ a: 0.2, e: 0.4 }, { a: 0.0, e: 0.3 }] }), 23);
    const reach = E.inOut(range(T, 103.2, 104.2));
    drawFigure(ctx, meTown, 330, stand(meTown, 330, 1290, g, 1, { lean: 0.08 * reach, neck: -0.15, arms: [{ hand: [lerp(1310, 1352, reach), lerp(g - 150, g - 196, reach)], grip: 0.2 }, { a: 0.1, e: 0.3 }] }), 11);
}
const streetShot = makeShot({
    from: 101.0, to: 108.4,
    cam: (T) => ({ cx: lerp(1180, 1215, range(T, 101, 108.4)), cy: 600, z: lerp(1.25, 1.3, range(T, 101, 108.4)) }),
    layers: [
        { screen: true, draw: (ctx) => wash(ctx, 0, 0, 1920, 1080, [[0, '#BFD0D4'], [1, '#E7E0CC']], { tex: 0.3, seed: 40 }) },
        { p: 1, draw: streetStill },
        { p: 1, live: true, draw: streetLive },
    ],
});

// ---------- the small flat, from outside, at dusk ----------
const FX = 560, FW = 800, FFH = 170, FLOORS = 4, FTOP = 960 - FLOORS * FFH;
function flatStill(ctx) {
    paint(ctx, block([[FX, FTOP], [FX + FW, FTOP], [FX + FW, 980], [FX, 980]], 300, 1, 5), '#9E978A', { seed: 300, angle: 1.57 });
    paint(ctx, block([[FX - 14, FTOP - 16], [FX + FW + 14, FTOP - 16], [FX + FW + 14, FTOP + 4], [FX - 14, FTOP + 4]], 301, 0.6, 4), '#55524E', { seed: 301 });
    for (let f = 0; f < FLOORS; f++) for (let c = 0; c < 4; c++) {
        const wx = FX + 60 + c * 185, wy = FTOP + 40 + f * FFH;
        const glow = f === 2 && c === 1 ? 0 : (noise(f * 4 + c, 9) > 0.7 ? 0.5 : 0);
        paint(ctx, block(rectPts(wx, wy, 110, 100), 310 + f * 9 + c, 0.6, 3), mix('#3F4652', '#F0C987', glow), { seed: 310 + f + c, tex: 0.4 });
        line(ctx, [[wx + 55, wy], [wx + 55, wy + 100]], '#2F2F33', 3, { amp: 0 });
        paint(ctx, block(rectPts(wx - 8, wy + 100, 126, 10), 330 + f * 9 + c, 0.4, 2), '#7E786E', { seed: 330 });
    }
    paint(ctx, block([[-40, 980], [1960, 980], [1960, 1120], [-40, 1120]], 340, 0.6, 4), '#5E5B57', { seed: 340 });
    paint(ctx, block(rectPts(1500, 560, 10, 420), 341, 0.3, 3), '#3A3936', { seed: 341 });
}
// The one window that matters lights up, with three small shapes in it; the street lamp comes on.
function flatLive(ctx, T) {
    const wx = FX + 60 + 185, wy = FTOP + 40 + 2 * FFH;
    const glow = E.inOut(range(T, 108.4, 109.6));
    paint(ctx, block(rectPts(wx, wy, 110, 100), 328, 0.6, 3), mix('#3F4652', '#F0C987', glow), { seed: 328, tex: 0.4 });
    line(ctx, [[wx + 55, wy], [wx + 55, wy + 100]], '#2F2F33', 3, { amp: 0 });
    if (glow > 0) {
        ctx.save();
        ctx.globalAlpha = 0.55 * glow;
        ctx.fillStyle = '#5A4632';
        for (const [sx, sh] of [[wx + 22, 62], [wx + 66, 44], [wx + 86, 40]]) {
            ctx.beginPath(); ctx.ellipse(sx, wy + 100 - sh + 8, 7, 8, 0, 0, Math.PI * 2); ctx.fill();
            ctx.fillRect(sx - 9, wy + 100 - sh + 16, 18, sh - 16);
        }
        ctx.restore();
        ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, wx + 55, wy + 50, 150, 110, 0.25 * glow, '#F3C27A'); ctx.restore();
    }
    const lamp = E.inOut(range(T, 109.0, 110.0));
    ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, 1505, 560, 120, 120, 0.5 * lamp, '#F6D9A0'); ctx.restore();
    paint(ctx, shape(ellipsePts(1505, 556, 22, 10, 10), 342, 0.5, 2), mix('#4A4844', '#FBE7BC', lamp), { seed: 342 });
}
// Dusk going to night: a night sky, with the last of the dusk laid over it and fading.
function duskOverlay(ctx, T) {
    const a = 1 - range(T, 107.6, 115);
    if (a <= 0) return;
    const g = ctx.createLinearGradient(0, 0, 0, 1080);
    g.addColorStop(0, `rgba(92,111,134,${a * 0.8})`); g.addColorStop(0.7, `rgba(201,169,138,${a * 0.85})`); g.addColorStop(1, 'rgba(110,106,102,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080);
}
export const FLAT = makeShot({
    from: 107.6, to: 115.2,
    cam: (T) => ({ cx: 960, cy: 540, z: lerp(1.0, 1.08, E.inOut(range(T, 107.6, 115))) }),
    layers: [
        { screen: true, draw: (ctx) => wash(ctx, 0, 0, 1920, 1080, [[0, '#2E3A4C'], [0.7, '#55607A'], [1, '#6E6A66']], { tex: 0.35, seed: 41 }) },
        { screen: true, live: true, draw: duskOverlay },
        { p: 1, draw: flatStill },
        { p: 1, live: true, draw: flatLive },
    ],
});
export const flatOutside = (c, T) => drawShot(c, FLAT, T);

// ---------- the counter ----------
const FL = 900;
function counterStill(ctx) {
    for (let r = 0; r < 3; r++) {
        paint(ctx, block(rectPts(1180, 240 + r * 150, 640, 12), 400 + r, 0.5, 4), C.wood, { seed: 400 + r });
        for (let k = 0; k < 6; k++) paint(ctx, block(rectPts(1200 + k * 104, 240 + r * 150 - 70 - (k % 3) * 8, 88, 70 + (k % 3) * 8), 410 + r * 9 + k, 0.6, 2), ['#B9A27A', '#8FA0A6', '#C7B48E', '#A39385'][(k + r) % 4], { seed: 410 + k + r });
    }
    paint(ctx, block([[-40, FL], [1960, FL], [1960, 1120], [-40, 1120]], 420, 0.6, 4), '#9F927C', { seed: 420 });
    const sk = stand(CAST.relB, 520, 1260, FL, -1, { lean: 0.02, arms: [{ hand: [1150, 640], grip: 0.5 }, { a: 0.1, e: 0.5 }] });
    drawFigure(ctx, CAST.relB, 520, sk, 430);
    paint(ctx, block([[760, 640], [1240, 640], [1240, FL], [760, FL]], 431, 0.6, 4), '#8C7356', { seed: 431 });
    paint(ctx, block([[780, 660], [1220, 660], [1220, 780], [780, 780]], 432, 0.4, 3), '#B9C6C3', { seed: 432, alpha: 0.7 });
    paint(ctx, block([[748, 628], [1252, 628], [1252, 644], [748, 644]], 433, 0.5, 4), '#6E5A44', { seed: 433 });
    paint(ctx, block([[1010, 548], [1150, 548], [1150, 628], [1010, 628]], 434, 0.5, 3), '#D9D1BD', { seed: 434 });
    paint(ctx, shape([[1040, 572], [1120, 572], [1126, 604], [1034, 604]], 435, 0.8, 2), '#5D6A78', { seed: 435 });
    for (const bx of [1100, 1112]) { ctx.save(); ctx.fillStyle = '#B8564A'; ctx.beginPath(); ctx.arc(bx, 588, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    line(ctx, [[1052, 588], [1068, 588]], '#2B2D30', 4, { amp: 0 }); line(ctx, [[1060, 580], [1060, 596]], '#2B2D30', 4, { amp: 0 });
    shadow(ctx, 690, FL + 4, 120, 14, 0.2);
    for (const [cast, h, x, seed] of [[broTown, 380, 530, 23], [meTown, 340, 440, 11]]) {
        const p = stand(cast, h, x, FL, 1, { lean: 0.08, neck: -0.08, arms: [{ a: 0.4, e: 0.6 }, { a: 0.2, e: 0.4 }] });
        shadow(ctx, x, FL + 4, 70, 9, 0.18);
        drawFigure(ctx, cast, h, p, seed);
    }
    paint(ctx, block(rectPts(800, 598, 52, 12), 447, 0.3, 2), '#BDBAA3', { seed: 447, tex: 0.3, edge: 0.4 });
}
// He counts the notes one at a time from his left hand onto the counter, then again.
function counterLive(ctx, T) {
    const tc = T - 114.8;
    const cycle = (tc % 1.1 + 1.1) % 1.1 / 1.1;
    const counting = T > 114.8 && T < 120.6;
    const pick = counting ? Math.sin(Math.PI * cycle) : 0;
    const handN = [lerp(830, 880, pick), lerp(612, 596, pick)];
    const pose = stand(F, 560, 690, FL, 1, { lean: 0.12, neck: 0.38, eyes: 'down', arms: [{ hand: handN, grip: 0.6 }, { hand: [828, 606], grip: 0.8 }] });
    drawFigure(ctx, F, 560, pose, 37);
    const laid = counting ? Math.floor(tc / 1.1) % 5 : 4;
    for (let k = 0; k < laid; k++) paint(ctx, block(rectPts(880 + k * 6, 618 - k * 1.5, 58, 10), 440 + k, 0.3, 2), '#B9B6A0', { seed: 440, tex: 0.3, edge: 0.4 });
    if (pick > 0.2) paint(ctx, block(rectPts(handN[0] - 30, handN[1] - 6, 56, 9), 446, 0.3, 2), '#C3C0AA', { seed: 446, tex: 0.3, edge: 0.4 });
}
const counterShot = makeShot({
    from: 114.4, to: 121.8,
    cam: (T) => ({ cx: 960, cy: 560, z: lerp(1.25, 1.32, range(T, 114, 121.8)) }),
    layers: [
        { screen: true, draw: (ctx) => wash(ctx, 0, 0, 1920, 1080, [[0, '#DCD2BA'], [1, '#CDBFA2']], { tex: 0.3, seed: 42, angle: 1.57 }) },
        { p: 1, draw: counterStill },
        { p: 1, live: true, draw: counterLive },
    ],
});

// ---------- the television ----------
function screenImage(ctx, x, y, w, h, T) {
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.fillStyle = '#5E86A8'; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#7FA36C'; ctx.fillRect(x, y + h * 0.72, w, h * 0.28);
    for (let k = 0; k < 5; k++) {
        const bx = x + ((k * 53 - T * 60) % (w + 60) + w + 60) % (w + 60) - 30;
        ctx.fillStyle = k % 2 ? '#D9B66A' : '#C9705A';
        ctx.fillRect(bx, y + h * (0.5 + 0.08 * (k % 3)), 22, 14);
    }
    ctx.fillStyle = '#F2EEE2';
    ctx.fillRect(x + w * 0.3, y + h * 0.6 - Math.abs(Math.sin(T * 3.1)) * h * 0.18, 14, 16);
    ctx.restore();
}
const BOYS = [[broTown, 380, 1060, 23, 0], [meTown, 340, 1220, 11, 1.7]];
function tvStill(ctx) {
    paint(ctx, block([[120, 690], [720, 690], [720, 760], [120, 760]], 500, 0.6, 4), '#8E8A7E', { seed: 500 });
    paint(ctx, block([[110, 760], [730, 760], [730, FL], [110, FL]], 501, 0.6, 4), '#5D4B3D', { seed: 501 });
    paint(ctx, block([[80, 520], [130, 520], [130, FL], [80, FL]], 502, 0.6, 4), '#4E3F33', { seed: 502 });
    ctx.save(); ctx.globalCompositeOperation = 'screen'; shadow(ctx, 330, 420, 300, 220, 0.18, '#E6B36E'); ctx.restore();
    paint(ctx, block([[-40, FL], [1960, FL], [1960, 1120], [-40, 1120]], 503, 0.6, 4), '#6B6157', { seed: 503 });
    paint(ctx, block([[1420, 700], [1820, 700], [1820, FL], [1420, FL]], 510, 0.6, 4), '#6E5642', { seed: 510 });
    paint(ctx, block([[1470, 440], [1780, 440], [1790, 700], [1460, 700]], 511, 0.8, 4), '#3B3A38', { seed: 511 });
    paint(ctx, block([[1490, 470], [1690, 470], [1700, 660], [1480, 660]], 512, 0.6, 3), '#22252A', { seed: 512 });
    for (let k = 0; k < 2; k++) { ctx.save(); ctx.fillStyle = '#6E6A62'; ctx.beginPath(); ctx.arc(1735, 520 + k * 50, 12, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    paint(ctx, block([[1440, 676], [1560, 676], [1560, 700], [1440, 700]], 513, 0.4, 3), '#2F2F30', { seed: 513 });
    paint(ctx, block(rectPts(1470, 656, 44, 22), 514, 0.3, 2), '#B04B3E', { seed: 514 });
    for (const [, h, x, seed] of BOYS) {
        const stool = FL - 0.2 * h;
        paint(ctx, block([[x - 0.08 * h, stool], [x + 0.08 * h, stool], [x + 0.08 * h, stool + 10], [x - 0.08 * h, stool + 10]], seed + 600, 0.4, 2), C.wood, { seed: 600 });
        for (const lx of [x - 0.07 * h, x + 0.05 * h]) paint(ctx, block(rectPts(lx, stool + 10, 6, FL - stool - 10), seed + 601 + lx, 0.3, 2), C.woodDark, { seed: 601 });
    }
}
function tvLive(ctx, T) {
    const fp = {
        x: 560, y: 690, f: 1, lean: 0.1, neck: 0.05 + Math.sin(T * 0.5) * 0.03,
        legs: [{ ankle: [700, FL - 0.04 * 560], rot: 0 }, { ankle: [680, FL - 0.04 * 560], rot: 0 }],
        arms: [{ hand: [655, 660], grip: 0.6 }, { hand: [640, 668], grip: 0.6 }],
    };
    drawFigure(ctx, F, 560, fp, 37);
    screenImage(ctx, 1500, 484, 186, 162, T);
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(1560, 520, 50, 22, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    for (const [cast, h, x, seed, ph] of BOYS) {
        const lean = 0.42 + 0.05 * Math.sin(T * 2.2 + ph);
        const stool = FL - 0.2 * h;
        const p0 = { x, y: stool - 2, f: 1, lean, neck: -0.25, legs: [{ ankle: [x + 0.2 * h, FL - 0.04 * h], rot: 0 }, { ankle: [x + 0.17 * h, FL - 0.04 * h], rot: 0 }], arms: [{ a: 0, e: 0 }, { a: 0, e: 0 }] };
        const J = joints(cast, h, p0);
        const pad = [J.shoulder[0] + 0.2 * h, J.shoulder[1] + 0.18 * h + Math.sin(T * 9 + ph) * 2];
        p0.arms = [{ hand: [pad[0] + 10, pad[1]], grip: 1 }, { hand: [pad[0] - 6, pad[1] + 2], grip: 1 }];
        drawFigure(ctx, cast, h, p0, seed);
        paint(ctx, block(rectPts(pad[0] - 22, pad[1] - 8, 44, 16), seed + 610, 0.3, 2), '#3E3C3A', { seed: 610 });
        line(ctx, [[pad[0] + 22, pad[1]], [pad[0] + 120, FL - 10], [1480, 690]], '#2C2B2A', 2, { amp: 0, alpha: 0.8 });
    }
    const flick = 0.85 + 0.15 * noise(T * 6, 77);
    ctx.globalCompositeOperation = 'screen';
    shadow(ctx, 1500, 560, 760, 420, 0.22 * flick, '#9FC0DA');
}
const tvShot = makeShot({
    from: 121.0, to: 128.0,
    cam: (T) => ({ cx: 960, cy: 560, z: lerp(1.08, 1.14, range(T, 121, 127.8)) }),
    layers: [
        { screen: true, draw: (ctx) => wash(ctx, 0, 0, 1920, 1080, [[0, '#4D4A47'], [1, '#3A3734']], { tex: 0.35, seed: 43, angle: 1.57 }) },
        { p: 1, draw: tvStill },
        { p: 1, live: true, draw: tvLive },
    ],
});

const seg = (shot, o) => ({ from: shot.from, to: shot.to, shot, draw: (c, T) => drawShot(c, shot, T), fade: 0.9, ...o });
export const SEGMENTS = [
    seg(streetShot, { fade: 1.0, grade: { warm: 0.12, sat: 0.9 }, lyric: () => ({ x: 150, y: 160, align: 'left' }) }),
    seg(FLAT, { grade: { warm: 0.05 }, lyric: () => ({ x: 150, y: 200, align: 'left', color: '#F2EADB', halo: '#2E3A4C' }) }),
    seg(counterShot, { grade: { warm: 0.1, sat: 0.9 }, lyric: () => ({ x: 150, y: 200, align: 'left' }) }),
    seg(tvShot, { grade: { sat: 0.9 }, lyric: () => ({ x: 150, y: 200, align: 'left', color: '#F2EADB', halo: '#2E2B28' }) }),
];
