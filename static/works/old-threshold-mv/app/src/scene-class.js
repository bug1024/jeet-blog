// 后来放下针线 / 站到了黑板前: the hand that steered cloth now holds chalk. A close shot of the writing hand,
// then the camera steps back to the classroom: the father at the board, children at their desks.
import { W, H, clamp, lerp, range, E, mix, camera, noise, rng } from './core.js';
import { C, FONT } from './design.js';
import { paint, shape, block, wash, line, shadow, ellipsePts, rectPts } from './gouache.js';
import { CAST, drawFigure, stand, joints } from './figure.js';
import { makeShot, drawShot } from './shot.js';

const FLOOR = 900, FH = 600, KH = 340;
const BOARD = { x0: 1150, x1: 1880, y0: 250, y1: 600 };
// What he writes, in order: a maths lesson, three short sums, the last one left for the class to answer.
// Chalk handwriting, not printed: each character a little off its line. Spaces only advance the hand.
const W0 = 39.0;
const BOARD_ROWS = [
    { str: '3 + 2 = 5', x: 1236, y: 344, size: 58, step: 40, per: 0.24 },
    { str: '7 - 4 = 3', x: 1236, y: 434, size: 58, step: 40, per: 0.24 },
    { str: '6 + 3 =', x: 1236, y: 524, size: 58, step: 40, per: 0.24 },
];
const CHARS = (() => {
    const out = [];
    let t = W0;
    BOARD_ROWS.forEach((r, ri) => {
        const chs = [...r.str];
        chs.forEach((ch, i) => {
            if (ch === ' ') return;
            const k = ri * 11 + i;
            out.push({
                ch, size: r.size, t0: t, t1: t + r.per,
                x: r.x + i * r.step + (noise(k * 1.3, 3) - 0.5) * 6,
                y: r.y + (noise(k * 2.1, 4) - 0.5) * 7 + i * 0.8,
                rot: (noise(k * 0.7, 5) - 0.5) * 0.09,
                sc: 0.94 + noise(k * 1.9, 6) * 0.12,
            });
            t += r.per + (i === chs.length - 1 ? 0.26 : 0.04);
        });
    });
    return out;
})();
const WRITE_END = CHARS[CHARS.length - 1].t1;

// Chalk: the characters drawn into their own layer, then worn by a fixed speckle and a few dry breaks,
// so the board shows through the strokes. The wear is fixed to the board, so it never flickers.
let chalkC = null, wear = null;
function makeWear() {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const r = rng(77);
    for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(0,0,0,${0.25 + r() * 0.7})`; g.fillRect(r() * 256, r() * 256, 0.6 + r() * 1.6, 0.6 + r() * 1.4); }
    for (let i = 0; i < 70; i++) {
        g.strokeStyle = `rgba(0,0,0,${0.4 + r() * 0.5})`; g.lineWidth = 0.6 + r() * 1.2;
        const x = r() * 256, y = r() * 256, l = 6 + r() * 18;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + l, y + (r() - 0.5) * 3); g.stroke();
    }
    return c;
}
function chalk(ctx, T) {
    const bx = BOARD.x0, by = BOARD.y0, bw = BOARD.x1 - BOARD.x0, bh = BOARD.y1 - BOARD.y0;
    const m = ctx.getTransform(), k = Math.hypot(m.a, m.b);
    const cw = Math.ceil(bw * k), ch = Math.ceil(bh * k);
    if (!chalkC) chalkC = document.createElement('canvas');
    if (chalkC.width !== cw || chalkC.height !== ch) { chalkC.width = cw; chalkC.height = ch; }
    if (!wear) wear = makeWear();
    const g = chalkC.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, cw, ch);
    g.setTransform(k, 0, 0, k, -bx * k, -by * k);
    g.fillStyle = '#ECEAE1';
    g.textBaseline = 'alphabetic';
    for (const c of CHARS) {
        const vis = clamp((T - c.t0) / (c.t1 - c.t0));
        if (vis <= 0) continue;
        g.save();
        g.translate(c.x, c.y);
        g.rotate(c.rot);
        g.scale(c.sc * (c.ch === '-' ? 1.6 : 1), c.sc);
        // Revealed the way a hand writes it: top-left to bottom-right.
        if (vis < 1) { g.beginPath(); g.rect(-4, -c.size, (c.size + 8) * vis, c.size * 1.3); g.clip(); }
        g.font = `500 ${c.size}px ${FONT.hand}`;
        g.fillText(c.ch, 0, 0);
        g.restore();
    }
    g.globalCompositeOperation = 'destination-out';
    const pat = g.createPattern(wear, 'repeat');
    pat.setTransform(new DOMMatrix().scaleSelf(0.5, 0.5));
    g.fillStyle = pat;
    g.globalAlpha = 0.55;
    g.fillRect(bx, by, bw, bh);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
    ctx.save();
    ctx.globalAlpha = 0.86;
    ctx.drawImage(chalkC, bx, by, bw, bh);
    ctx.restore();
}
// Where the chalk is now: moving through the character being written.
function chalkHand(T) {
    const c = CHARS.find((q) => T < q.t1) || CHARS[CHARS.length - 1];
    const u = clamp((T - c.t0) / (c.t1 - c.t0));
    return [c.x + 6 + u * c.size * 0.8, c.y - c.size * 0.55 + Math.sin(u * Math.PI * 3) * c.size * 0.25];
}

// Classmates: the same rig, other clothes.
const KIDS = [
    { x: 300, cast: { ...CAST.brother, top: { ...CAST.brother.top, color: '#C9B48C' }, legs: { ...CAST.brother.legs, color: '#5D6170' } } },
    { x: 560, cast: { ...CAST.me, bag: null } },
    { x: 820, cast: { ...CAST.brother, hair: 'crop', top: { ...CAST.brother.top, color: '#9FB19A' } } },
];

function room(ctx) {
    wash(ctx, -40, -40, 2000, 700, [[0, '#E7E2D2'], [1, '#DDD7C4']], { tex: 0.25, seed: 4, angle: 1.57 });
    // The green dado of a schoolroom wall.
    paint(ctx, block([[-40, 640], [1960, 640], [1960, FLOOR], [-40, FLOOR]], 5, 0.8, 6), '#9DB09A', { seed: 5, angle: 0 });
    line(ctx, [[-40, 640], [1960, 640]], '#7E9280', 3, { seed: 6, amp: 0.6 });
    // Window with afternoon light.
    paint(ctx, block([[150, 220], [460, 220], [460, 560], [150, 560]], 7, 1, 4), '#CFDDDB', { seed: 7 });
    paint(ctx, shape(ellipsePts(260, 330, 110, 60, 12), 8, 6, 2), '#A9B996', { alpha: 0.8, seed: 8 });
    for (const x of [150, 305, 460]) paint(ctx, block(rectPts(x - 7, 216, 14, 348), 9 + x, 0.6, 3), '#7A6650', { seed: 9 });
    for (const y of [220, 390, 556]) paint(ctx, block(rectPts(144, y - 7, 322, 14), 12 + y, 0.6, 3), '#7A6650', { seed: 12 });
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const g = ctx.createLinearGradient(300, 560, 800, 1000);
    g.addColorStop(0, 'rgba(255,236,190,0.22)'); g.addColorStop(1, 'rgba(255,236,190,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(150, 560); ctx.lineTo(460, 560); ctx.lineTo(1000, 1010); ctx.lineTo(420, 1010); ctx.closePath(); ctx.fill();
    ctx.restore();
    // Floor.
    paint(ctx, block([[-40, FLOOR], [1960, FLOOR], [1960, 1120], [-40, 1120]], 15, 0.6, 4), '#A7A193', { seed: 15, mottle: 0.8 });
    // Blackboard, frame, chalk ledge.
    const { x0, x1, y0, y1 } = BOARD;
    paint(ctx, block([[x0 - 16, y0 - 16], [x1 + 16, y0 - 16], [x1 + 16, y1 + 16], [x0 - 16, y1 + 16]], 16, 0.6, 5), '#6E5A45', { seed: 16 });
    paint(ctx, block([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], 17, 0.6, 5), '#2F3B35', { seed: 17, mottle: 0.9 });
    // Old chalk, wiped but not gone.
    // Yesterday's chalk, wiped: a faint haze where the eraser went, no marks.
    ctx.save();
    for (let k = 0; k < 4; k++) shadow(ctx, x0 + 180 + k * 150, y0 + 230 + (k % 2) * 40, 150, 50, 0.07, '#E8E6DE');
    ctx.restore();
    paint(ctx, block([[x0 - 10, y1 + 16], [x1 + 10, y1 + 16], [x1 + 10, y1 + 28], [x0 - 10, y1 + 28]], 25, 0.5, 4), '#5A4A3A', { seed: 25 });
}

function desk(ctx, x, h) {
    const top = FLOOR - 0.46 * h, bench = FLOOR - 0.25 * h;
    paint(ctx, block([[x - 0.12 * h, bench], [x + 0.08 * h, bench], [x + 0.08 * h, bench + 12], [x - 0.12 * h, bench + 12]], 30 + x, 0.5, 3), C.wood, { seed: 30 });
    for (const lx of [x - 0.1 * h, x + 0.05 * h]) paint(ctx, block(rectPts(lx, bench + 12, 8, FLOOR - bench - 12), 31 + lx, 0.4, 2), C.woodDark, { seed: 31 });
    return { top, bench };
}
function deskTop(ctx, x, h) {
    const top = FLOOR - 0.46 * h;
    paint(ctx, block([[x + 0.14 * h, top], [x + 0.62 * h, top], [x + 0.62 * h, top + 16], [x + 0.14 * h, top + 16]], 40 + x, 0.5, 3), C.woodLight, { seed: 40 });
    paint(ctx, block([[x + 0.16 * h, top + 16], [x + 0.6 * h, top + 16], [x + 0.6 * h, top + 70], [x + 0.16 * h, top + 70]], 41 + x, 0.5, 3), C.wood, { seed: 41 });
    for (const lx of [x + 0.17 * h, x + 0.56 * h]) paint(ctx, block(rectPts(lx, top + 70, 9, FLOOR - top - 70), 42 + lx, 0.4, 2), C.woodDark, { seed: 42 });
}

function seated(cast, h, x, T, i) {
    const bench = FLOOR - 0.25 * h, top = FLOOR - 0.46 * h;
    const up = E.inOut(range(T, W0 + 0.3 + i * 0.2, W0 + 1.0 + i * 0.2));
    return {
        x, y: bench - 4, f: 1, lean: 0.12, neck: lerp(0.25, -0.12, up),
        legs: [{ ankle: [x + 0.24 * h, FLOOR - 0.04 * h], rot: 0 }, { ankle: [x + 0.2 * h, FLOOR - 0.04 * h], rot: 0 }],
        arms: [{ hand: [x + 0.3 * h, top - 2], grip: 0.5 }, { hand: [x + 0.26 * h, top - 2], grip: 0.5 }],
    };
}

function writing(ctx, T) {
    chalk(ctx, T);
    // The father at the board, facing it; the chalk hand moving through each character, then resting.
    const F = CAST.fatherTeacher;
    const [hx, hy] = chalkHand(T);
    const rest = E.inOut(range(T, WRITE_END, WRITE_END + 0.8));
    const pose = stand(F, FH, 1150, FLOOR, 1, { lean: 0.04, neck: -0.05, arms: [{ hand: [lerp(hx, 1170, rest), lerp(hy, 560, rest)], grip: 0.8 }, { a: 0.05, e: 0.3 }] });
    drawFigure(ctx, F, FH, pose, 17);
    KIDS.forEach(({ x, cast }, n) => drawFigure(ctx, cast, KH, seated(cast, KH, x, T, n), 60 + n * 7));
}
function still(ctx) {
    room(ctx);
    shadow(ctx, 1150, FLOOR + 4, 0.22 * FH, 0.03 * FH, 0.2);
    KIDS.forEach(({ x }) => { desk(ctx, x, KH); shadow(ctx, x + 60, FLOOR + 4, 120, 10, 0.18); });
}
function front(ctx) { KIDS.forEach(({ x }) => deskTop(ctx, x, KH)); }

// Close on the hand at the board (where the sewing hand was on screen), then step back to the room.
const shot = makeShot({
    from: 38.8, to: 44.6,
    cam: (T) => { const k = E.inOut(range(T, 40.3, 42.8)); return { cx: lerp(1290, 960, k), cy: lerp(380, 560, k), z: lerp(2.0, 1.0, k) }; },
    layers: [{ p: 1, draw: still }, { p: 1, live: true, draw: writing }, { p: 1, draw: front }],
});
export const SEGMENTS = [
    { from: 38.8, to: 44.6, fade: 1.0, shot, draw: (c, T) => drawShot(c, shot, T), grade: { warm: 0.08 }, lyric: () => ({ x: 150, y: 200, align: 'left' }) },
];
