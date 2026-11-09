// Small things from the lyrics: the stag beetle, the butterfly, the little white bird, flowers on the table, the moon.
import { S, lerp, mix, blob, dab, fill, glow, rng, clamp, rect } from './paint.js';

function line(ctx, pts, w, color, alpha = 1) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.stroke();
    ctx.globalAlpha = 1;
}

// Stag beetle in three-quarter view from above, walking toward +x. step: walk phase.
export function beetle(ctx, x, y, s, step = 0, flip = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * flip, s);
    ctx.beginPath();
    ctx.ellipse(0, 26, 70, 10, 0, 0, Math.PI * 2);
    fill(ctx, '#2a1f18', 0.22);
    const leg = '#20171a';
    // Six legs, alternating tripods.
    for (let i = 0; i < 3; i++) {
        for (const side of [-1, 1]) {
            const ph = step + (i % 2 === 0 ? 0 : Math.PI) + (side < 0 ? Math.PI : 0);
            const sw = Math.sin(ph) * 9, lift = Math.max(0, Math.cos(ph)) * 4;
            const bx = -18 + i * 20, by = side * 6;
            line(ctx, [[bx, by], [bx + sw * 0.5 + side * 4, by + side * 14 - lift + 6], [bx + sw + side * 2 + (i - 1) * 14, by + side * 20 - lift + 16]], 3.4, side > 0 ? leg : '#3a2c2c');
        }
    }
    // Abdomen with wing cases.
    ctx.beginPath();
    ctx.ellipse(-26, 0, 38, 21, 0, 0, Math.PI * 2);
    fill(ctx, '#2c1c17');
    ctx.beginPath();
    ctx.ellipse(-30, -6, 26, 7, -0.08, 0, Math.PI * 2);
    fill(ctx, '#7a5a4a', 0.35);
    line(ctx, [[8, 0], [-62, 1]], 1.6, '#120c0b', 0.7);
    // Thorax and head.
    ctx.beginPath();
    ctx.ellipse(18, 0, 17, 17, 0, 0, Math.PI * 2);
    fill(ctx, '#271915');
    ctx.beginPath();
    ctx.ellipse(16, -6, 9, 4, 0, 0, Math.PI * 2);
    fill(ctx, '#8a6a58', 0.3);
    ctx.beginPath();
    ctx.ellipse(38, 0, 12, 13, 0, 0, Math.PI * 2);
    fill(ctx, '#2b1b16');
    // Mandibles, the stag's antlers.
    const open = 0.15 + Math.sin(step * 0.5) * 0.05;
    for (const side of [-1, 1]) {
        ctx.save();
        ctx.translate(46, side * 6);
        ctx.rotate(side * open);
        ctx.beginPath();
        ctx.moveTo(0, -side * 3);
        ctx.quadraticCurveTo(26, side * 14, 38, -side * 2);
        ctx.quadraticCurveTo(30, side * 4, 24, side * 3);
        ctx.lineTo(22, side * 9);
        ctx.quadraticCurveTo(10, side * 8, 0, side * 4);
        fill(ctx, '#3a2420');
        ctx.restore();
    }
    for (const side of [-1, 1]) line(ctx, [[44, side * 9], [54, side * 22], [60, side * 20]], 1.6, '#3a2c2c');
    ctx.restore();
}

// Butterfly seen from the side-ish; flap 0..1 phase.
export function butterfly(ctx, x, y, s, T, color = '#f3e3b8', edge = '#9a8fb0') {
    const f = Math.sin(T * 16);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.rotate(Math.sin(T * 3) * 0.15);
    for (const k of [0.62, 1]) {
        const sy = (0.25 + 0.75 * Math.abs(f)) * (f > 0 ? 1 : -1) * k;
        ctx.save();
        ctx.scale(1, sy);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-34, -46, 14, -64, 22, -16);
        ctx.bezierCurveTo(28, 2, 8, 2, 0, 0);
        fill(ctx, k < 1 ? mix(color, edge, 0.3) : color);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-24, -10, -30, -34, -10, -30);
        ctx.bezierCurveTo(-2, -24, 2, -8, 0, 0);
        fill(ctx, edge, 0.5);
        ctx.restore();
    }
    line(ctx, [[-10, 2], [14, -2]], 4, '#4a3a40');
    line(ctx, [[13, -3], [24, -15]], 1.2, '#4a3a40');
    ctx.restore();
}

// Little white bird. fly 0 perched, 1 flying.
export function bird(ctx, x, y, s, T, fly = 0, flip = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * flip, s);
    const body = '#f7f2ea', wingC = '#e2dbd2';
    if (fly < 0.5) {
        line(ctx, [[-2, 14], [-4, 22]], 2, '#8a6a5a');
        line(ctx, [[5, 14], [5, 22]], 2, '#8a6a5a');
    }
    ctx.beginPath();
    ctx.moveTo(-18, 2);
    ctx.lineTo(-34, -2 + (fly > 0.5 ? 0 : 6));
    ctx.lineTo(-30, 8);
    fill(ctx, wingC);
    ctx.beginPath();
    ctx.ellipse(0, 4, 19, 13, -0.15, 0, Math.PI * 2);
    fill(ctx, body);
    ctx.beginPath();
    ctx.arc(15, -7, 9.5, 0, Math.PI * 2);
    fill(ctx, body);
    ctx.beginPath();
    ctx.moveTo(23, -8);
    ctx.lineTo(31, -5);
    ctx.lineTo(23, -3);
    fill(ctx, '#e9a35c');
    ctx.beginPath();
    ctx.arc(17.5, -9, 1.8, 0, Math.PI * 2);
    fill(ctx, '#2a2026');
    const w = fly > 0.5 ? Math.sin(T * 22) : 0.1;
    ctx.save();
    ctx.translate(-2, 0);
    ctx.scale(1, fly > 0.5 ? w : 1);
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.quadraticCurveTo(-6, fly > 0.5 ? -38 : -8, -22, fly > 0.5 ? -30 : 2);
    ctx.quadraticCurveTo(-4, fly > 0.5 ? -12 : 8, 8, 2);
    fill(ctx, wingC);
    ctx.restore();
    ctx.restore();
}

// A flower: bloom 0 = closed bud, 1 = open. tilt sways the stem top.
export function flower(ctx, x, y, h, bloom, color, o = {}) {
    const { tilt = 0, petals = 6, size = 1, leaf = true, center = '#f2c45a', stem = '#6f8754' } = o;
    const tx = x + tilt * h * 0.3, ty = y - h;
    ctx.strokeStyle = stem;
    ctx.lineWidth = 3.5 * size;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + tilt * h * 0.05, y - h * 0.5, tx, ty);
    ctx.stroke();
    if (leaf) {
        ctx.save();
        ctx.translate(lerp(x, tx, 0.45), lerp(y, ty, 0.45));
        ctx.rotate(-0.8 + tilt * 0.2);
        ctx.beginPath();
        ctx.ellipse(10 * size, 0, 13 * size, 5 * size, 0, 0, Math.PI * 2);
        fill(ctx, mix(stem, '#9db27a', 0.3));
        ctx.restore();
    }
    const b = clamp(bloom);
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(tilt * 0.4);
    if (b < 0.15) {
        ctx.beginPath();
        ctx.ellipse(0, -7 * size, 6 * size, 10 * size, 0, 0, Math.PI * 2);
        fill(ctx, mix(stem, color, 0.5));
    } else {
        const r = lerp(6, 17, b) * size;
        for (let i = 0; i < petals; i++) {
            const a = (i / petals) * Math.PI * 2 + 0.3;
            ctx.save();
            ctx.rotate(a);
            ctx.scale(1, lerp(0.5, 1, b));
            ctx.beginPath();
            ctx.ellipse(r * 0.7, 0, r * 0.75, r * 0.45, 0, 0, Math.PI * 2);
            fill(ctx, i % 2 ? color : mix(color, '#ffffff', 0.15));
            ctx.restore();
        }
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
        fill(ctx, center);
    }
    ctx.restore();
}

// Vase of flowers on the table. blooms(i) gives each flower's bloom amount.
export function bouquet(ctx, x, y, s, T, blooms = () => 1, o = {}) {
    const colors = o.colors || ['#eaa3ae', '#f4d3d3', '#f1c56d', '#e88f98', '#f7e8e0', '#c9a8d4', '#eaa3ae'];
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    const stems = [[-38, 150, -0.5], [-18, 175, -0.2], [2, 190, 0.05], [22, 170, 0.3], [40, 145, 0.55], [-6, 150, -0.05], [12, 132, 0.2]];
    stems.forEach(([dx, h, t], i) => {
        const sway = Math.sin(T * 1.2 + i) * 0.04;
        flower(ctx, dx * 0.3, -50, h - 50, blooms(i), colors[i % colors.length], { tilt: t + sway, size: 1.1, petals: i % 3 === 0 ? 5 : 6 });
    });
    // Glass jar.
    ctx.beginPath();
    ctx.moveTo(-30, -62);
    ctx.quadraticCurveTo(-38, -20, -32, 0);
    ctx.lineTo(32, 0);
    ctx.quadraticCurveTo(38, -20, 30, -62);
    ctx.closePath();
    fill(ctx, o.vase || '#a9c3c6', 0.75);
    ctx.beginPath();
    ctx.ellipse(-16, -30, 5, 20, 0.05, 0, Math.PI * 2);
    fill(ctx, '#ffffff', 0.35);
    ctx.beginPath();
    ctx.ellipse(0, -62, 30, 5, 0, 0, Math.PI * 2);
    fill(ctx, '#d9e6e2', 0.7);
    ctx.restore();
}

export function moon(ctx, x, y, r, alpha = 1) {
    glow(ctx, x, y, r * 4, '#f6ecc8', 0.35 * alpha);
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = '#fbf3d6';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#ebdfba';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + r * 0.3, y + r * 0.3, r * 0.14, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
}

export function stars(ctx, T, x0, y0, w, h, n = 40, seed = 5, alpha = 1) {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
        const x = x0 + r() * w, y = y0 + r() * h, s = 1.2 + r() * 2.2;
        ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin(T * (1 + r() * 2) + i));
        ctx.fillStyle = '#fff6d8';
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

export function lamp(ctx, x, y, s, on = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    if (on > 0) glow(ctx, 0, -70, 340, '#ffd79a', 0.55 * on);
    rect(ctx, -26, -6, 52, 8, '#8a6a52', 1, 41, 1);
    line(ctx, [[0, -4], [0, -62]], 6, '#8a6a52');
    ctx.beginPath();
    ctx.moveTo(-34, -60);
    ctx.lineTo(34, -60);
    ctx.lineTo(22, -108);
    ctx.lineTo(-22, -108);
    ctx.closePath();
    fill(ctx, '#f6dcae');
    ctx.beginPath();
    ctx.moveTo(-34, -60);
    ctx.lineTo(34, -60);
    ctx.lineTo(30, -66);
    ctx.lineTo(-30, -66);
    fill(ctx, '#f9e9c6');
    ctx.restore();
}

// Straw sun hat with a pink ribbon. Drawn with its brim centred on (x, y).
export function hat(ctx, x, y, s, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.ellipse(0, 0, 34, 9, 0, 0, Math.PI * 2);
    fill(ctx, '#e8cf94');
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.quadraticCurveTo(-18, -24, 0, -25);
    ctx.quadraticCurveTo(18, -24, 18, 0);
    fill(ctx, '#efd9a2');
    ctx.beginPath();
    ctx.moveTo(-18, -4);
    ctx.lineTo(18, -4);
    ctx.lineTo(18, -10);
    ctx.lineTo(-18, -10);
    fill(ctx, '#e59aa5');
    ctx.restore();
}

// Toy firefighter helmet, for the shoulder game.
export function helmet(ctx, x, y, s, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.ellipse(-2, 2, 26, 6, 0, 0, Math.PI * 2);
    fill(ctx, '#b8433b');
    ctx.beginPath();
    ctx.moveTo(-19, 2);
    ctx.quadraticCurveTo(-20, -22, 0, -23);
    ctx.quadraticCurveTo(20, -22, 18, 2);
    fill(ctx, '#d0553f');
    ctx.beginPath();
    ctx.moveTo(-3, -22);
    ctx.lineTo(3, -22);
    ctx.lineTo(3, 0);
    ctx.lineTo(-3, 0);
    fill(ctx, '#b8433b');
    ctx.beginPath();
    ctx.arc(10, -9, 5, 0, Math.PI * 2);
    fill(ctx, '#f2c45a');
    ctx.restore();
}

// Crayon drawing on paper: a stick-figure family and a sun, drawn up to progress p.
export function drawing(ctx, x, y, w, h, p = 1, seed = 3, rot = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    rect(ctx, -w / 2, -h / 2, w, h, '#fbf6ea', 1, seed, 1.5);
    const strokes = [
        ['#f2b34a', [[w * 0.28, -h * 0.28], [w * 0.28 + 1, -h * 0.28]], 26],
        ['#7aa36a', [[-w * 0.45, h * 0.3], [-w * 0.1, h * 0.26], [w * 0.2, h * 0.31], [w * 0.45, h * 0.27]], 5],
        ['#4f5f80', [[-w * 0.2, h * 0.27], [-w * 0.2, -h * 0.05]], 4],
        ['#4f5f80', [[-w * 0.2, -h * 0.12], [-w * 0.2, -h * 0.13]], 18],
        ['#e3829a', [[0, h * 0.27], [0, h * 0.08]], 4],
        ['#e3829a', [[0, h * 0.02], [0, h * 0.01]], 14],
        ['#4f5f80', [[-w * 0.2, h * 0.02], [0, h * 0.12]], 3],
    ];
    const n = Math.floor(clamp(p) * strokes.length + 0.999);
    strokes.slice(0, n).forEach(([c, pts, wd]) => line(ctx, pts, wd, c, 0.9));
    ctx.restore();
}

// Small cardboard house with crayon flames: the fire 75 is going to put out.
export function boxFire(ctx, x, y, s, T) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    rect(ctx, -60, -80, 120, 80, '#c99b6a', 1, 61, 2);
    ctx.beginPath();
    ctx.moveTo(-70, -78);
    ctx.lineTo(0, -132);
    ctx.lineTo(70, -78);
    fill(ctx, '#b4835a');
    rect(ctx, -16, -48, 32, 48, '#8e6544', 1, 62, 1.5);
    rect(ctx, 26, -62, 22, 20, '#f3e2bf', 1, 63, 1);
    for (let i = 0; i < 4; i++) {
        const fx = -36 + i * 22, fh = 46 + Math.sin(T * 9 + i * 1.7) * 10;
        ctx.beginPath();
        ctx.moveTo(fx - 12, -118 + i * 8);
        ctx.quadraticCurveTo(fx - 10, -118 - fh * 0.6 + i * 8, fx + Math.sin(T * 7 + i) * 6, -118 - fh + i * 8);
        ctx.quadraticCurveTo(fx + 12, -118 - fh * 0.5 + i * 8, fx + 12, -118 + i * 8);
        fill(ctx, i % 2 ? '#e9744c' : '#f0b04c', 0.9);
    }
    ctx.restore();
}

export function cloud(ctx, x, y, w, color = '#fbe9d8', alpha = 0.8, seed = 1) {
    const r = rng(seed);
    for (let i = 0; i < 6; i++) {
        dab(ctx, x + (r() - 0.5) * w * 0.8, y + (r() - 0.5) * w * 0.08, w * (0.18 + r() * 0.18), w * (0.06 + r() * 0.05), color, alpha * 0.55, seed + i, 0.12);
    }
}

export function tree(ctx, x, y, h, canopy, o = {}) {
    const { trunk = '#6a5048', seed = 1, bare = 0, snow = 0, blossom = null } = o;
    ctx.strokeStyle = trunk;
    ctx.lineCap = 'round';
    ctx.lineWidth = h * 0.06;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + h * 0.03, y - h * 0.4, x - h * 0.02, y - h * 0.7);
    ctx.stroke();
    ctx.lineWidth = h * 0.025;
    const r = rng(seed);
    for (let i = 0; i < 4; i++) {
        const by = y - h * (0.45 + i * 0.1), side = i % 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x, by);
        ctx.quadraticCurveTo(x + side * h * 0.12, by - h * 0.08, x + side * h * (0.2 + r() * 0.08), by - h * 0.22);
        ctx.stroke();
    }
    if (bare < 1) {
        for (let i = 0; i < 5; i++) {
            const cx = x + (r() - 0.5) * h * 0.5, cy = y - h * (0.68 + r() * 0.22);
            dab(ctx, cx, cy, h * (0.2 + r() * 0.1), h * (0.15 + r() * 0.07), canopy, 1 - bare, seed * 13 + i, 0.14);
        }
        if (blossom) {
            for (let i = 0; i < 14; i++) {
                ctx.beginPath();
                ctx.arc(x + (r() - 0.5) * h * 0.6, y - h * (0.6 + r() * 0.35), h * 0.025, 0, Math.PI * 2);
                fill(ctx, blossom, 1 - bare);
            }
        }
    }
    if (snow > 0) {
        for (let i = 0; i < 4; i++) {
            const by = y - h * (0.5 + i * 0.1), side = i % 2 ? 1 : -1;
            dab(ctx, x + side * h * 0.13, by - h * 0.12, h * 0.07, h * 0.02, '#f6f3ee', snow, seed + 40 + i, 0.2);
        }
    }
}
