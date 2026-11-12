// 熨斗里的炭 / 赶集买的衫 / 针脚密一点 / 再缝一道边: the tailor at his treadle machine by the window.
// Treadle, crank, belt, handwheel and needle are one linkage driven by a single angle, so they never disagree.
// The cloth moves under the needle and the new seam (in a thread that does not quite match) follows it out.
import { W, H, clamp, lerp, range, E, mix, camera, noise, resetT } from './core.js';
import { C } from './design.js';
import { paint, shape, block, wash, line, shadow, ellipsePts, rectPts } from './gouache.js';
import { CAST, drawFigure, joints, stand, walkPlan, stepBlend, standOn, gait } from './figure.js';
import { title } from './type.js';
import { makeShot, drawShot } from './shot.js';


const FH = 620, KH = 330;
const FLOOR = 900;
const TABLE = { x0: 760, x1: 1290, y: 627 };
const PIVOT = [1025, 862];
const WHEEL = { c: [1222, 724], r: 92 };
const HAND = { c: [1098, 548], r: 30 };
const NEEDLE_X = 916;
const THREAD = '#D08A3C';      // the seam colour: close to the cloth's, not quite
const CLOTH = '#34465E';

// The machine's single angle: the flywheel turns about once a second while he sews.
// The flywheel speeds up, runs, and coasts to a stop: angle(T) with velocity 2π·1.05 rad/s, easing to 0 by 36.2 s.
function run(T) {
    const t0 = 18.2, t1 = 34.2, t2 = 36.2, w = 2 * Math.PI * 1.05;
    if (T <= t0) return 0;
    const up = Math.min(T, t0 + 0.8) - t0;
    let a = w * up * up / 1.6;
    if (T > t0 + 0.8) a += w * (Math.min(T, t1) - t0 - 0.8);
    if (T > t1) { const d = Math.min(T, t2) - t1; a += w * (d - d * d / (2 * (t2 - t1))); }
    return a;
}

function treadleAngle(psi) { return 0.16 * Math.sin(psi); }
function plate(psi, dx) {
    const a = treadleAngle(psi);
    return [PIVOT[0] + Math.cos(a) * dx, PIVOT[1] + Math.sin(a) * dx];
}

function room(ctx, T, ironParts = 'all') {
    wash(ctx, -40, -40, 2000, FLOOR + 40, [[0, '#E4D5B4'], [1, '#D9C6A0']], { tex: 0.22, mottle: 0.6, seed: 2, angle: 1.57 });
    // Window on the left: afternoon light, a green branch outside.
    paint(ctx, block([[110, 170], [430, 170], [430, 530], [110, 530]], 3, 1, 4), '#C9DAD8', { seed: 3, tex: 0.4 });
    paint(ctx, shape(ellipsePts(200, 300, 120, 70, 12), 4, 8, 2), '#9DAF8E', { seed: 4, alpha: 0.85 });
    paint(ctx, shape(ellipsePts(330, 250, 90, 50, 12), 5, 6, 2), '#B1BF9C', { seed: 5, alpha: 0.8 });
    for (const x of [110, 265, 425]) paint(ctx, block(rectPts(x - 7, 166, 14, 368), 6 + x, 0.6, 3), C.woodDark, { seed: 6 });
    for (const y of [170, 350, 526]) paint(ctx, block(rectPts(104, y - 7, 334, 14), 9 + y, 0.6, 3), C.woodDark, { seed: 9 });
    // The light lands on the floor and the table edge.
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createLinearGradient(260, 520, 760, 980);
    g.addColorStop(0, 'rgba(255,236,190,0.28)'); g.addColorStop(1, 'rgba(255,236,190,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(110, 530); ctx.lineTo(430, 530); ctx.lineTo(980, 1000); ctx.lineTo(380, 1000); ctx.closePath(); ctx.fill();
    ctx.restore();
    // A tape measure on a nail, folded cloth on a shelf.
    paint(ctx, block([[1450, 300], [1820, 300], [1820, 318], [1450, 318]], 12, 0.6, 4), C.wood, { seed: 12 });
    [['#8D9A86', 0], ['#C8B48A', 1], ['#5E6E83', 2]].forEach(([c, k]) => paint(ctx, block(rectPts(1480 + k * 110, 300 - 34 - (k % 2) * 8, 96, 34 + (k % 2) * 8), 13 + k, 0.8, 3), c, { seed: 13 + k, tex: 0.6 }));
    line(ctx, [[1560, 380], [1556, 470], [1566, 560]], '#D6C27A', 9, { seed: 16, amp: 1 });
    line(ctx, [[1574, 380], [1580, 460], [1572, 530]], '#D6C27A', 9, { seed: 17, amp: 1 });
    // Floor.
    paint(ctx, block([[-40, FLOOR], [1960, FLOOR], [1960, 1120], [-40, 1120]], 18, 0.6, 4), '#A8916E', { seed: 18, mottle: 0.8 });
    for (let k = 0; k < 6; k++) line(ctx, [[-40, FLOOR + 14 + k * k * 6], [1960, FLOOR + 14 + k * k * 6]], '#8C7657', 1.4, { alpha: 0.4, seed: 19 + k, amp: 1.5 });
    // Side table under the window with the charcoal iron and the cassette recorder.
    paint(ctx, block([[150, 690], [585, 690], [585, 712], [150, 712]], 20, 0.8, 4), C.wood, { seed: 20 });
    for (const x of [170, 555]) paint(ctx, block(rectPts(x, 712, 18, FLOOR - 712), 21 + x, 0.6, 3), C.woodDark, { seed: 21 });
    shadow(ctx, 370, FLOOR + 4, 230, 12, 0.18);
    shadow(ctx, IRON_X, 692, 54, 4, 0.25);
    iron(ctx, IRON_X, 690, T, ironParts);
    recorder(ctx, REC.x, REC.y);
}

// The portable cassette recorder: silver body, a black band with the radio dial, piano keys on top, the cassette
// door with an orange label, a round speaker in a chrome ring, the telescopic aerial pulled out at a slant.
// No maker's name: just the object.
const IRON_X = 315;
const REC = { x: 410, y: 690, w: 160 };
function recorder(ctx, x, y) {
    const k = REC.w / 160, X = (u) => x + u * k, Y = (v) => y - v * k;
    shadow(ctx, X(80), y + 2, 86 * k, 5 * k, 0.25);
    // Aerial, behind the body.
    line(ctx, [[X(36), Y(76)], [X(96), Y(128)], [X(150), Y(176)]], '#C9CBC8', 2.2 * k, { amp: 0, seed: 201 });
    line(ctx, [[X(36), Y(76)], [X(70), Y(105)]], '#9EA19F', 3.2 * k, { amp: 0, seed: 202 });
    ctx.save(); ctx.fillStyle = '#D8D9D5'; ctx.beginPath(); ctx.arc(X(150), Y(176), 2.6 * k, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    // Keys and the volume knob on top.
    for (let i = 0; i < 6; i++) paint(ctx, block(rectPts(X(20 + i * 9), Y(82), 7.4 * k, 8 * k), 210 + i, 0.2, 2), i === 4 ? '#3A3A39' : '#2C2C2B', { seed: 210 + i, tex: 0.2, edge: 0 });
    paint(ctx, shape(ellipsePts(X(132), Y(80), 6 * k, 4.5 * k, 10), 217, 0.3, 2), '#252524', { seed: 217, tex: 0.2, edge: 0 });
    // Top deck, black band, lower body.
    paint(ctx, block(rectPts(X(2), Y(76), 156 * k, 8 * k), 220, 0.3, 3), '#C7C8C3', { seed: 220, tex: 0.3 });
    paint(ctx, block(rectPts(X(0), Y(68), 160 * k, 16 * k), 221, 0.3, 3), '#262626', { seed: 221, tex: 0.25 });
    paint(ctx, block(rectPts(X(2), Y(52), 156 * k, 52 * k), 222, 0.4, 3), '#B9BAB4', { seed: 222, tex: 0.35, mottle: 0.5 });
    line(ctx, [[X(3), Y(1)], [X(157), Y(1)]], '#86877F', 1.6 * k, { amp: 0.2, alpha: 0.7, seed: 223 });
    // Dial window with its scale, the red level light on the left, the little mic grille on the right.
    paint(ctx, block(rectPts(X(20), Y(65), 118 * k, 10 * k), 224, 0.2, 2), '#D9D9D1', { seed: 224, tex: 0.2, edge: 0 });
    ctx.save();
    ctx.strokeStyle = 'rgba(60,60,58,0.55)'; ctx.lineWidth = 0.7 * k;
    for (let i = 0; i < 15; i++) { ctx.beginPath(); ctx.moveTo(X(26 + i * 7.6), Y(64)); ctx.lineTo(X(26 + i * 7.6), Y(i % 2 ? 62.5 : 61.5)); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(X(22), Y(60)); ctx.lineTo(X(136), Y(60)); ctx.stroke();
    ctx.strokeStyle = 'rgba(190,60,50,0.8)'; ctx.lineWidth = 1 * k;
    ctx.beginPath(); ctx.moveTo(X(96), Y(65)); ctx.lineTo(X(96), Y(56)); ctx.stroke();
    ctx.fillStyle = '#D9483B'; ctx.beginPath(); ctx.ellipse(X(10), Y(60), 4 * k, 2.6 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#CFCFCA'; ctx.lineWidth = 1.2 * k; ctx.beginPath(); ctx.arc(X(149), Y(60), 4 * k, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    // Panels: counter on the left, cassette door in the middle, speaker on the right.
    line(ctx, [[X(24), Y(50)], [X(24), Y(3)]], '#8E8F88', 1 * k, { amp: 0.2, alpha: 0.6, seed: 225 });
    line(ctx, [[X(106), Y(50)], [X(106), Y(3)]], '#8E8F88', 1 * k, { amp: 0.2, alpha: 0.6, seed: 226 });
    paint(ctx, block(rectPts(X(7), Y(42), 11 * k, 6 * k), 227, 0.1, 2), '#3A3A38', { seed: 227, tex: 0.1, edge: 0 });
    paint(ctx, block(rectPts(X(28), Y(47), 74 * k, 41 * k), 228, 0.3, 2), '#C6C7C1', { seed: 228, tex: 0.3 });
    paint(ctx, block(rectPts(X(36), Y(30), 58 * k, 18 * k), 229, 0.2, 2), '#5E5E59', { seed: 229, tex: 0.25, edge: 0 });
    paint(ctx, block(rectPts(X(57), Y(28), 16 * k, 12 * k), 230, 0.15, 2), '#E07B3B', { seed: 230, tex: 0.2, edge: 0 });
    for (const u of [REC_REELS[0], REC_REELS[1]]) {
        paint(ctx, shape(ellipsePts(X(u), Y(21), 5.6 * k, 5.6 * k, 10), 231 + u, 0.2, 2), '#2A2A28', { seed: 231, tex: 0.1, edge: 0 });
    }
    ctx.save(); ctx.strokeStyle = 'rgba(40,40,38,0.5)'; ctx.lineWidth = 1 * k;
    ctx.beginPath(); ctx.moveTo(X(44), Y(41)); ctx.lineTo(X(36), Y(38)); ctx.lineTo(X(44), Y(35)); ctx.stroke();
    ctx.restore();
    // Speaker: chrome ring, black grille, a lighter perforated centre.
    paint(ctx, shape(ellipsePts(X(132), Y(27), 22 * k, 22 * k, 18), 240, 0.3, 2), '#E3E3DE', { seed: 240, tex: 0.2, edge: 0 });
    paint(ctx, shape(ellipsePts(X(132), Y(27), 19 * k, 19 * k, 18), 241, 0.3, 2), '#242424', { seed: 241, tex: 0.3, edge: 0 });
    ctx.save(); ctx.fillStyle = 'rgba(120,120,116,0.55)';
    for (let r = 4; r <= 16; r += 3) for (let i = 0; i < r * 2; i++) {
        const a = (i / (r * 2)) * Math.PI * 2;
        ctx.fillRect(X(132) + Math.cos(a) * r * k - 0.4 * k, Y(27) + Math.sin(a) * r * k - 0.4 * k, 0.8 * k, 0.8 * k);
    }
    ctx.fillStyle = '#8D8D88'; ctx.beginPath(); ctx.arc(X(132), Y(27), 4.5 * k, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    // The tuning wheel on the side.
    paint(ctx, block(rectPts(X(158), Y(66), 4 * k, 14 * k), 242, 0.1, 2), '#1F1F1F', { seed: 242, tex: 0.1, edge: 0 });
}
const REC_REELS = [46, 84];
// The reels turn while the song plays: the little spokes in each hub.
function reels(ctx, T) {
    const k = REC.w / 160, X = (u) => REC.x + u * k, Y = (v) => REC.y - v * k;
    ctx.save();
    ctx.strokeStyle = 'rgba(205,205,198,0.85)'; ctx.lineWidth = 1 * k; ctx.lineCap = 'round';
    for (const u of REC_REELS) {
        const a0 = T * 2.4;
        for (let i = 0; i < 3; i++) {
            const a = a0 + (i * Math.PI * 2) / 3;
            ctx.beginPath(); ctx.moveTo(X(u) + Math.cos(a) * 1.2 * k, Y(21) + Math.sin(a) * 1.2 * k);
            ctx.lineTo(X(u) + Math.cos(a) * 4.2 * k, Y(21) + Math.sin(a) * 4.2 * k); ctx.stroke();
        }
    }
    ctx.restore();
}

// The charcoal iron, about 20 cm long: a cast box on a flat sole, pointed at the front; a row of round vents low
// down and a band of saw-tooth vents under the lid; a little cockerel latch on the lid; two iron posts holding a
// worn wooden grip. The embers show only through the vents.
const IK = 0.95;
const IRON_HOLES = Array.from({ length: 9 }, (_, i) => -40 + i * 9.5);
const IRON_TEETH = Array.from({ length: 12 }, (_, i) => -45 + i * 7.4);
function iron(ctx, x, y, T, parts = 'all') {
    if (parts !== 'glow') ironBody(ctx, x, y);
    if (parts !== 'body') ironGlow(ctx, x, y, T);
}
function ironBody(ctx, x, y) {
    const k = IK, P = (u, v) => [x + u * k, y + v * k];
    const pts = (a) => a.map(([u, v]) => P(u, v));
    const flat = (a, seed, color, o = {}) => paint(ctx, shape(pts(a), seed, 0.12, 1), color, { seed, tex: 0.3, edge: 0, ...o });
    // Handle: rear post leaning back, front post rising from beside the latch, the wooden grip across them.
    line(ctx, pts([[-33, -44], [-39, -60], [-37, -76]]), '#252423', 4.6 * k, { amp: 0, seed: 301 });
    line(ctx, pts([[6, -44], [16, -49], [13, -62], [20, -76]]), '#252423', 4.6 * k, { amp: 0, seed: 302 });
    const gy = -82, gr = 6;
    ctx.save();
    const [gx0, gyy] = P(-46, gy), [gx1] = P(30, gy);
    const g = ctx.createLinearGradient(0, gyy - gr * k, 0, gyy + gr * k);
    g.addColorStop(0, '#9A6844'); g.addColorStop(0.35, '#83532F'); g.addColorStop(1, '#5C3820');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(gx0, gyy - gr * k); ctx.lineTo(gx1, gyy - gr * k);
    ctx.ellipse(gx1, gyy, 2.4 * k, gr * k, 0, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(gx0, gyy + gr * k);
    ctx.ellipse(gx0, gyy, 2.4 * k, gr * k, 0, Math.PI / 2, Math.PI * 1.5);
    ctx.fill();
    ctx.strokeStyle = 'rgba(70,40,22,0.6)'; ctx.lineWidth = 0.8 * k;
    for (const u of [-14, -9]) { ctx.beginPath(); ctx.moveTo(...P(u, gy - gr + 0.5)); ctx.lineTo(...P(u, gy + gr - 0.5)); ctx.stroke(); }
    ctx.restore();
    // Sole, box (its front coming to the point), lid overhanging a little all round.
    flat([[-50, 0], [41, 0], [56, -4], [43, -8], [-50, -8]], 306, '#1F1E1D');
    flat([[-47, -8], [42, -8], [53, -12], [45, -36], [-47, -36]], 307, '#2C2B29', { mottle: 0.5 });
    line(ctx, pts([[-46, -9], [42, -9]]), '#47443F', 1 * k, { amp: 0, alpha: 0.7, seed: 312 });
    flat([[-52, -35], [46, -35], [58, -38.5], [47, -43], [-52, -43]], 308, '#3E3C38');
    line(ctx, pts([[-51, -42.5], [46, -42.5], [57, -38.5]]), '#67635C', 1.1 * k, { amp: 0, alpha: 0.8, seed: 309 });
    // Vents: dark until the embers light them.
    ctx.save();
    ctx.fillStyle = '#121110';
    for (const u of IRON_TEETH) {
        ctx.beginPath(); ctx.moveTo(...P(u, -30.5)); ctx.lineTo(...P(u + 3.5, -34.5)); ctx.lineTo(...P(u + 7, -30.5)); ctx.closePath(); ctx.fill();
    }
    for (const u of IRON_HOLES) { ctx.beginPath(); ctx.arc(...P(u, -17), 2.3 * k, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    // The cockerel latch near the front of the lid: a small cast bird, tail up behind, comb on its head.
    flat([[22, -43], [33, -43], [34, -47], [37, -52], [37.5, -57], [35, -59], [32.5, -55], [29, -51], [25, -52], [23, -57], [21, -50]], 310, '#292826', { tex: 0.15 });
    flat([[34.5, -58.5], [36, -62], [37.2, -59.5], [38.4, -61.5], [38.6, -57.5]], 311, '#33312E', { tex: 0.1 });
}
function ironGlow(ctx, x, y, T) {
    const k = IK;
    ctx.save();
    IRON_HOLES.forEach((u, i) => {
        const glow = 0.35 + 0.55 * noise(T * 1.1 + i * 0.7, 33);
        ctx.fillStyle = `rgba(${Math.round(175 + 65 * glow)},${Math.round(70 + 50 * glow)},35,${0.5 + 0.4 * glow})`;
        ctx.beginPath(); ctx.arc(x + u * k, y - 17 * k, 1.6 * k, 0, Math.PI * 2); ctx.fill();
    });
    IRON_TEETH.forEach((u, i) => {
        const glow = 0.3 + 0.5 * noise(T * 0.9 + i * 1.3, 34);
        ctx.fillStyle = `rgba(${Math.round(160 + 60 * glow)},${Math.round(65 + 40 * glow)},35,${0.35 * glow + 0.2})`;
        ctx.beginPath(); ctx.moveTo(x + (u + 1.5) * k, y - 31.5 * k); ctx.lineTo(x + (u + 3.5) * k, y - 34.5 * k); ctx.lineTo(x + (u + 5.5) * k, y - 31.5 * k); ctx.closePath(); ctx.fill();
    });
    ctx.restore();
    // A thin wisp of warm air off the lid.
    for (let j = 0; j < 3; j++) {
        const t = (T * 0.25 + j / 3) % 1, wx = x + 20 * k, wy = y - 46 * k;
        line(ctx, [[wx, wy - t * 70], [wx + 5 + 6 * Math.sin(t * 6 + j), wy - 14 - t * 70], [wx, wy - 28 - t * 70]], '#F2EADB', 2, { alpha: 0.28 * (1 - t), seed: 35 + j, amp: 1 });
    }
}

// Cast-iron stand, treadle, flywheel and pitman: drawn over the father's legs.
function stand_(ctx, psi) {
    const ironC = '#262625';
    for (const x of [790, 1206]) {
        // Side frame: two splayed legs joined by a scrolled brace, open in the middle.
        const top = TABLE.y + 28;
        paint(ctx, block([[x, top], [x + 16, top], [x + 4, FLOOR], [x - 14, FLOOR]], 40 + x, 0.4, 3), ironC, { seed: 40, tex: 0.4 });
        paint(ctx, block([[x + 30, top], [x + 46, top], [x + 62, FLOOR], [x + 44, FLOOR]], 41 + x, 0.4, 3), ironC, { seed: 41, tex: 0.4 });
        paint(ctx, block([[x - 4, top], [x + 50, top], [x + 50, top + 14], [x - 4, top + 14]], 42 + x, 0.4, 3), ironC, { seed: 42 });
        line(ctx, [[x + 8, 700], [x + 24, 735], [x + 40, 700]], ironC, 6, { amp: 0 });
        line(ctx, [[x + 4, 800], [x + 24, 770], [x + 46, 800]], ironC, 6, { amp: 0 });
    }
    // Bars between the frames.
    paint(ctx, block([[812, FLOOR - 70], [1230, FLOOR - 70], [1230, FLOOR - 60], [812, FLOOR - 60]], 50, 0.4, 4), ironC, { seed: 50 });
    // Treadle plate, rocking on its pivot.
    const L = plate(psi, -150), R = plate(psi, 150), a = treadleAngle(psi);
    const n = [-Math.sin(a) * 9, Math.cos(a) * 9];
    paint(ctx, block([[L[0] - n[0], L[1] - n[1]], [R[0] - n[0], R[1] - n[1]], [R[0] + n[0], R[1] + n[1]], [L[0] + n[0], L[1] + n[1]]], 51, 0.3, 4), '#33322F', { seed: 51, angle: a });
    for (let k = -4; k <= 4; k++) { const p = plate(psi, k * 30); line(ctx, [[p[0] - n[0], p[1] - n[1]], [p[0] + n[0], p[1] + n[1]]], '#55534E', 1.4, { alpha: 0.6, amp: 0 }); }
    // Flywheel with spokes, crank pin, pitman rod to the treadle's end.
    const { c, r } = WHEEL;
    ctx.save();
    ctx.lineWidth = 10; ctx.strokeStyle = ironC;
    ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 4;
    for (let k = 0; k < 6; k++) { const ang = psi + (k * Math.PI) / 3; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + Math.cos(ang) * r, c[1] + Math.sin(ang) * r); ctx.stroke(); }
    ctx.fillStyle = ironC; ctx.beginPath(); ctx.arc(c[0], c[1], 14, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    const pin = [c[0] + Math.cos(psi) * 30, c[1] + Math.sin(psi) * 30];
    line(ctx, [R, pin], '#3A3936', 7, { amp: 0 });
    // The belt from the flywheel up through the table to the handwheel.
    line(ctx, [[c[0] + r - 2, c[1]], [HAND.c[0] + HAND.r * 0.7, HAND.c[1] + 10]], '#6B4A34', 4, { amp: 0 });
    line(ctx, [[c[0] - r * 0.15, c[1] - r + 2], [HAND.c[0] - HAND.r * 0.2, HAND.c[1] + 40]], '#6B4A34', 4, { amp: 0 });
}

function tableTop(ctx) {
    paint(ctx, block([[TABLE.x0, TABLE.y], [TABLE.x1, TABLE.y], [TABLE.x1, TABLE.y + 28], [TABLE.x0, TABLE.y + 28]], 60, 0.8, 5), C.wood, { seed: 60 });
    line(ctx, [[TABLE.x0 + 4, TABLE.y + 3], [TABLE.x1 - 4, TABLE.y + 3]], C.woodLight, 2, { alpha: 0.7, seed: 61 });
    paint(ctx, block(rectPts(1000, TABLE.y + 30, 150, 40), 62, 0.6, 3), mix(C.wood, C.ink, 0.1), { seed: 62 });
}

// The head: bed, pillar, arm, needle bar; handwheel on the right; a spool of the not-quite-matching thread.
function head(ctx, psi, T) {
    const ironC = '#232322', trim = '#B39A5E';
    const phi = psi * 3;
    const by = TABLE.y - 14;
    paint(ctx, block([[880, by], [1110, by], [1110, TABLE.y], [880, TABLE.y]], 70, 0.4, 4), ironC, { seed: 70 });
    paint(ctx, shape([[1046, by], [1084, by], [1084, by - 84], [1076, by - 100], [1048, by - 100]], 71, 0.4, 2), ironC, { seed: 71 });
    paint(ctx, shape([[1080, by - 100], [1080, by - 72], [944, by - 68], [938, by - 98], [952, by - 106]], 72, 0.4, 2), ironC, { seed: 72 });
    paint(ctx, block([[898, by - 102], [942, by - 102], [944, by - 34], [900, by - 32]], 73, 0.4, 3), ironC, { seed: 73 });
    line(ctx, [[950, by - 92], [1072, by - 94]], trim, 1.6, { alpha: 0.8, seed: 74, amp: 0.3 });
    line(ctx, [[1056, by - 80], [1056, by - 6]], trim, 1.6, { alpha: 0.7, seed: 75, amp: 0.3 });
    // Needle bar and needle.
    const ny = by - 34 + (1 - Math.cos(phi)) * 0.5 * 12;
    paint(ctx, block(rectPts(NEEDLE_X - 3, by - 36, 6, ny - by + 38), 76, 0.1, 2), '#4A4946', { seed: 76 });
    line(ctx, [[NEEDLE_X, ny], [NEEDLE_X, ny + 14]], '#D8D5CC', 1.6, { amp: 0 });
    paint(ctx, block(rectPts(NEEDLE_X - 11, by - 7, 18, 5), 77, 0.1, 2), '#5A5853', { seed: 77 });
    // Handwheel.
    const { c, r } = HAND;
    paint(ctx, shape(ellipsePts(c[0], c[1], r, r, 18), 78, 0.6, 2), '#2C2C2B', { seed: 78 });
    ctx.save();
    ctx.strokeStyle = '#6A6862'; ctx.lineWidth = 3;
    ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { const a = phi + (k * 2 * Math.PI) / 3; ctx.beginPath(); ctx.moveTo(c[0], c[1]); ctx.lineTo(c[0] + Math.cos(a) * r * 0.8, c[1] + Math.sin(a) * r * 0.8); ctx.stroke(); }
    ctx.restore();
    // Spool and thread to the needle.
    paint(ctx, block(rectPts(1000, by - 124, 14, 18), 79, 0.3, 2), THREAD, { seed: 79 });
    line(ctx, [[1007, by - 122], [960, by - 112], [928, by - 90], [NEEDLE_X + 1, ny + 4]], THREAD, 1.1, { alpha: 0.9, amp: 0 });
}

// The cloth: a trouser leg on the bed, fed toward the left; the new seam follows the needle out.
function cloth(ctx, T) {
    const fed = clamp(run(T) / (2 * Math.PI) * 3, 0, 9999) * 1.6;     // px per stitch * stitches
    const y = TABLE.y - 16;
    paint(ctx, shape([[1046, y - 4], [1042, y + 3], [900, y + 4], [800, y + 12], [770, y + 24], [758, y + 110], [734, y + 104], [744, y + 22], [784, y + 4], [880, y - 4]], 80, 1.2, 2), CLOTH, { seed: 80 });
    // Stitches: dashes along the seam, born at the needle and carried left by the feed.
    const start = Math.max(0, fed - 150);
    for (let d = Math.floor(start / 5) * 5; d < fed; d += 5) {
        const x = NEEDLE_X - (fed - d);
        if (x < 790) continue;
        line(ctx, [[x, y + 1], [x + 3, y + 1]], THREAD, 1.8, { amp: 0, alpha: 0.95 });
    }
}

// Everything that moves: the father, the machine's linkage, the cloth and its seam, the child, the embers.
function sewingLive(ctx, T) {
    ironGlow(ctx, IRON_X, 690, T);
    reels(ctx, T);
    const psi = run(T);
    const F = CAST.fatherYoung;
    const fl = plate(psi, -60), fr = plate(psi, 0), a = treadleAngle(psi);
    const ank = (p) => [p[0] - Math.sin(a) * 0.04 * FH * -1, p[1] - 0.04 * FH - 8];
    // Before he starts, his hands smooth the cloth flat; while sewing they only steer it.
    const guide = T < 18.2 ? Math.sin(T * 1.1) * 26 : Math.sin(T * 0.7) * 4;
    const pose = {
        x: 1240, y: FLOOR - 0.27 * FH, f: -1, lean: 0.34, neck: 0.3,
        legs: [{ ankle: ank(fl), rot: a }, { ankle: ank(fr), rot: a }],
        arms: [{ hand: [952 + guide, 606], grip: 0.3 }, { hand: [1000 + guide, 604], grip: 0.3 }],
        eyes: 'down',
    };
    drawFigure(ctx, F, FH, pose, 5);
    stand_(ctx, psi);
    tableTop(ctx);
    cloth(ctx, T);
    head(ctx, psi, T);
    // His hands again, on top of the cloth.
    ctx.save();
    ctx.beginPath(); ctx.rect(938, 578, 106, 34); ctx.clip();
    drawFigure(ctx, F, FH, pose, 5);
    ctx.restore();
    shadow(ctx, 665, FLOOR + 4, 70, 9, 0.2);
    drawFigure(ctx, { ...CAST.me, bag: null }, KH, kidPose(T), 9);
}
function sewingStill(ctx) {
    room(ctx, 0, 'body');
    paint(ctx, block([[1190, FLOOR - 0.27 * FH], [1330, FLOOR - 0.27 * FH], [1330, FLOOR - 0.27 * FH + 18], [1190, FLOOR - 0.27 * FH + 18]], 90, 0.6, 3), C.woodLight, { seed: 90 });
    for (const x of [1200, 1310]) paint(ctx, block(rectPts(x, FLOOR - 0.27 * FH + 18, 14, 0.27 * FH - 18), 91 + x, 0.4, 2), C.wood, { seed: 91 });
    shadow(ctx, 1020, FLOOR + 6, 330, 16, 0.22);
}

// The child watches; at 我嫌线太显眼 leans in to look at the seam, not pleased, not upset.
const KID0 = stand(CAST.me, KH, 660, FLOOR, 1, { lean: 0.04, neck: 0.1, arms: [{ a: -0.25, e: 0.6 }, { a: -0.3, e: 0.6 }] });
function kidPose(T) {
    const look = E.inOut(range(T, 30.45, 31.4)) * (1 - E.inOut(range(T, 34.0, 35.0)) * 0.6);
    return { ...KID0, lean: 0.04 + 0.14 * look, neck: 0.1 + 0.38 * look, eyes: look > 0.5 ? 'down' : 'open', y: KID0.y + look * 4 };
}

const cam = (cx0, cx1, cy, z0, z1, t0, t1, ease = E.inOut) => (T) => { const k = ease(range(T, t0, t1)); return { cx: lerp(cx0, cx1, k), cy, z: lerp(z0, z1, k) }; };
const room1 = cam(372, 392, 640, 3.3, 3.45, 0, 6.6, E.linear);
const room2 = cam(950, 980, 604, 2.5, 2.6, 5.8, 12.6, E.linear);
const room3 = (T) => { const k = E.inOut(range(T, 11.8, 27)); return { cx: lerp(820, 1000, k), cy: lerp(600, 610, k), z: lerp(1.12, 1.18, k) }; };
const room4 = cam(985, 975, 598, 2.1, 2.2, 35.6, 39.6, E.linear);
const lyricWall = () => ({ x: 1420, y: 230, align: 'left' });
const sewingShot = (from, to, c, extra = []) => makeShot({
    from, to, cam: c,
    layers: [{ p: 1, draw: sewingStill }, { p: 1, live: true, draw: sewingLive }, ...extra],
});

// Night, years later: trying on the trousers; he crouches and marks the hem with chalk under the lamp.
function fittingLive(ctx, T) {
    const stoolTop = FLOOR - 70, kh = KH * 1.12;
    const kp = stand(CAST.me, kh, 700, stoolTop, -1, { lean: 0.02, neck: 0.3 + Math.sin(T * 0.8) * 0.03, eyes: 'down', arms: [{ a: 0.15, e: 0.3 }, { a: 0.1, e: 0.2 }] });
    const F = CAST.fatherTeacher, fh = FH * 0.98;
    const hemY = stoolTop - 0.08 * kh;
    const mark = Math.sin((T - 127) * 1.6);
    const fp = {
        x: 470, y: FLOOR - 0.26 * fh, f: 1, lean: 0.62, neck: 0.25, eyes: 'down',
        legs: [{ ankle: [560, FLOOR - 0.04 * fh], rot: 0 }, { ankle: [520, FLOOR - 0.04 * fh], rot: 0.3 }],
        arms: [{ hand: [664 + mark * 10, hemY], grip: 0.9 }, { hand: [650, hemY + 14], grip: 0.4 }],
    };
    drawFigure(ctx, CAST.me, kh, kp, 9);
    drawFigure(ctx, F, fh, fp, 5);
    line(ctx, [[652, hemY + 2], [676, hemY + 1]], '#EDEBE4', 2, { amp: 0, alpha: 0.8 });
}
function fittingStill(ctx) {
    room(ctx, 0, 'body');
    stand_(ctx, 0);
    tableTop(ctx);
    head(ctx, 0, 0);
    const stoolTop = FLOOR - 70;
    paint(ctx, block([[640, stoolTop], [760, stoolTop], [760, stoolTop + 12], [640, stoolTop + 12]], 120, 0.4, 3), C.woodLight, { seed: 120 });
    for (const x of [650, 744]) paint(ctx, block(rectPts(x, stoolTop + 12, 8, 58), 121 + x, 0.3, 2), C.wood, { seed: 121 });
    shadow(ctx, 560, FLOOR + 6, 220, 14, 0.25);
}
function lamp(ctx, T) {
    // Lamplight: everything dim except a warm pool around the two of them; it breathes a little.
    ctx.globalCompositeOperation = 'multiply';
    const r = 1100 + Math.sin(T * 2.3) * 12;
    const g = ctx.createRadialGradient(560, 420, 120, 560, 520, r);
    g.addColorStop(0, 'rgba(255,240,215,1)'); g.addColorStop(1, 'rgba(70,62,70,1)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
const fittingShot = makeShot({
    from: 127.2, to: 134.8, cam: cam(720, 700, 660, 1.55, 1.62, 127, 134.8, E.linear),
    layers: [{ p: 1, draw: fittingStill }, { p: 1, live: true, draw: fittingLive }, { screen: true, live: true, draw: lamp }],
});
export const fitting = (c, T) => drawShot(c, fittingShot, T);

const titleLayer = { screen: true, live: true, draw: (c, T) => { const a = E.inOut(range(T, 12.4, 13.4)) * (1 - E.inOut(range(T, 15.6, 16.8))); if (a > 0) title(c, 960, 250, a); } };
const S = [sewingShot(0, 6.6, room1), sewingShot(5.8, 12.6, room2), sewingShot(11.8, 36.6, room3, [titleLayer]), sewingShot(35.6, 39.6, room4)];
export const SEGMENTS = [
    { from: 0, to: 6.6, shot: S[0], draw: (c, T) => drawShot(c, S[0], T), grade: { warm: 0.18 } },
    { from: 5.8, to: 12.6, fade: 0.8, shot: S[1], draw: (c, T) => drawShot(c, S[1], T), grade: { warm: 0.16 } },
    { from: 11.8, to: 36.6, fade: 0.8, shot: S[2], draw: (c, T) => drawShot(c, S[2], T), grade: { warm: 0.12 }, lyric: lyricWall },
    { from: 35.6, to: 39.6, fade: 1.0, shot: S[3], draw: (c, T) => drawShot(c, S[3], T), grade: { warm: 0.12 }, lyric: () => ({ x: 150, y: 200, align: 'left' }) },
];
export const FITTING = fittingShot;
