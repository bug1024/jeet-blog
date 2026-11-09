// Painted settings. Each draws the whole stage in world coordinates; shots place the camera and the people.
import { W, H, S, rng, lerp, mix, ramp, rgba, fbm, noise, wob, blob, dab, fill, rect, wpoly, ridge, sky, glow, mottle, grass, windLines, particles, vgrad, clamp } from './paint.js';
import { cloud, tree, moon, stars, lamp, flower, bouquet } from './props.js';

export const LIGHT = {
    dusk: { sky: [['#5c5a92', 0], ['#a385a6', 0.36], ['#e8a283', 0.66], ['#f6c792', 0.86], ['#fbe1b2', 1]], far: '#a38fa7', haze: '#f3c7a0', field: ['#8f8b62', '#566043'], sun: '#fff1cf', cloud: '#f6c3a6', track: ['#d58a6c', '#a8533f'] },
    gold: { sky: [['#8ea6c3', 0], ['#c8c0c6', 0.42], ['#f0cf9f', 0.86], ['#f8e3b8', 1]], far: '#a9a7a8', haze: '#f6dcb0', field: ['#9a9c66', '#62704a'], sun: '#fff5da', cloud: '#fbe7d0', track: ['#d9927a', '#b25f49'] },
    day: { sky: [['#93b3cb', 0], ['#bdd1da', 0.5], ['#eee7d2', 1]], far: '#9fb0ab', haze: '#e9e5d4', field: ['#9fae72', '#6c8050'], sun: '#fffaf0', cloud: '#fbf6ee', track: ['#d39a83', '#b86c55'] },
    blue: { sky: [['#2f3a62', 0], ['#5e638e', 0.5], ['#b88aa0', 0.85], ['#e6a98f', 1]], far: '#6e6886', haze: '#c49aa3', field: ['#5f6450', '#3c4436'], sun: '#ffe8c4', cloud: '#c9a2b5', track: ['#9c6a62', '#6e4442'] },
};

function skyAndSun(ctx, L, horizon, o = {}) {
    sky(ctx, L.sky, -200, horizon + 40, -2000, W + 2000);
    if (o.sun !== false) {
        const sx = o.sunX ?? 1460, sy = o.sunY ?? horizon - 70;
        glow(ctx, sx, sy, 620, L.sun, 0.55);
        glow(ctx, sx, sy, 180, '#fff7e4', 0.7);
        ctx.beginPath();
        ctx.arc(sx, sy, o.sunR ?? 46, 0, Math.PI * 2);
        fill(ctx, '#fff5dc', 0.95);
    }
    const drift = (o.T ?? S.T) * 7 + (o.scroll || 0) * 0.02;
    const clouds = o.clouds ?? [[300, 180, 520], [1100, 120, 680], [1650, 300, 420], [700, 330, 380]];
    clouds.forEach(([x, y, w], i) => cloud(ctx, ((x - drift + 3000) % 3000) - 500, y, w, L.cloud, 0.75, 20 + i));
}

function treeLine(ctx, L, y, scroll = 0, depth = 0.08, seed = 3, amp = 70, color = L.far, x0 = -2200, x1 = W + 2200) {
    ridge(ctx, x0, x1, (x) => y - fbm((x + scroll * depth) / 170, seed) * amp - wob(x, seed), y + 200, 14);
    fill(ctx, color);
}

// Side-on running track for tracking shots. o.scroll: how far the camera has travelled.
export function trackSide(ctx, o = {}) {
    const { scroll = 0, light = 'dusk', horizon = 600, T = S.T, wind = 1, sunX } = o;
    const L = LIGHT[light];
    skyAndSun(ctx, L, horizon, { sunX, scroll, T });
    treeLine(ctx, L, horizon + 6, scroll, 0.08, 3, 80, mix(L.far, L.sky[1][0], 0.25));
    // School building, far away, slides by slowly.
    const bx = 900 - ((scroll * 0.12) % 3600);
    for (const ox of [0, 3600]) {
        rect(ctx, bx + ox, horizon - 70, 420, 90, mix(L.far, '#8a7a90', 0.3), 1, 51, 1.5);
        for (let i = 0; i < 6; i++) rect(ctx, bx + ox + 24 + i * 66, horizon - 50, 30, 22, mix(L.far, L.haze, 0.5), 0.8, 52 + i, 1);
    }
    treeLine(ctx, L, horizon + 26, scroll, 0.2, 9, 46, mix(L.far, L.field[1], 0.35));
    const trackTop = horizon + 120;
    ctx.fillStyle = vgrad(ctx, horizon, trackTop, [[mix(L.field[0], L.haze, 0.35), 0], [L.field[0], 1]]);
    ctx.fillRect(-2000, horizon + 10, W + 4000, trackTop - horizon);
    // Fence along the far side of the track.
    const fs = scroll * 0.55, gap = 88;
    ctx.strokeStyle = rgba('#4f4a52', 0.55);
    ctx.lineWidth = 4;
    for (let i = Math.floor((fs - 2200) / gap); i < (fs + W + 2200) / gap; i++) {
        const x = i * gap - fs;
        ctx.beginPath(); ctx.moveTo(x, horizon + 64); ctx.lineTo(x, horizon + 108); ctx.stroke();
    }
    ctx.lineWidth = 2.5;
    for (const y of [horizon + 72, horizon + 92]) { ctx.beginPath(); ctx.moveTo(-2000, y); ctx.lineTo(W + 2000, y); ctx.stroke(); }
    // Track.
    const tb = trackTop + 200;
    ctx.fillStyle = vgrad(ctx, trackTop, tb, [[L.track[0], 0], [L.track[1], 1]]);
    wpoly(ctx, [[-2000, trackTop], [W + 2000, trackTop], [W + 2000, tb], [-2000, tb]], 70, 2, 120);
    ctx.fill();
    mottle(ctx, -200, trackTop, W + 400, 200, L.track[1], 71, 8, 0.12);
    ctx.strokeStyle = rgba('#fbecd9', 0.85);
    [0, 0.33, 0.66, 1].forEach((k, i) => {
        ctx.lineWidth = 3 + k * 4;
        const y = trackTop + 6 + k * (tb - trackTop - 12);
        ctx.beginPath(); ctx.moveTo(-2000, y + wob(i * 300, 80 + i, 1)); ctx.lineTo(W + 2000, y + wob(i * 300 + 50, 90 + i, 1)); ctx.stroke();
    });
    // Scuffs move at full speed so the run reads.
    const r = rng(5);
    const marks = Array.from({ length: 26 }, () => [r() * 2400, trackTop + 20 + r() * 160, 20 + r() * 50]);
    ctx.fillStyle = rgba(L.track[1], 0.35);
    marks.forEach(([mx, my, mw]) => {
        const x = ((mx - scroll) % 2400 + 2400) % 2400 - 240;
        ctx.fillRect(x, my, mw, 3);
    });
    // Foreground grass, darker, nearer, faster.
    ctx.fillStyle = vgrad(ctx, tb, H + 300, [[L.field[1], 0], [mix(L.field[1], '#2e3328', 0.4), 1]]);
    ctx.fillRect(-2000, tb, W + 4000, H + 400 - tb);
    return { trackTop, ground: trackTop + 120, tb, L, after: () => {
        grass(ctx, -300, W + 300, tb + 10, { scroll: scroll * 1.05, h: 70, w: 10, gap: 13, seed: 4, colors: [mix(L.field[1], '#2f3a2a', 0.2), L.field[1], mix(L.field[0], L.field[1], 0.5)], wind });
        grass(ctx, -300, W + 300, H + 30, { scroll: scroll * 1.5, h: 180, w: 18, gap: 30, seed: 7, colors: [mix(L.field[1], '#232a20', 0.45), mix(L.field[1], '#2f3a2a', 0.3)], wind: wind * 1.2 });
        windLines(ctx, T, { count: Math.round(5 * wind), y0: horizon - 300, y1: H - 100, alpha: 0.28 * wind });
    } };
}

// The running track seen from the stands: the opening and closing image.
export const TRACK_A = [[-260, 940], [250, 760], [900, 655], [1560, 622]];
export const TRACK_B = [[140, 1130], [640, 880], [1150, 712], [1640, 662]];
const bez = (P, t) => {
    if (t > 1) { const e = bez(P, 1), d = [P[3][0] - P[2][0], P[3][1] - P[2][1]]; return [e[0] + d[0] * (t - 1) * 1.6, e[1] + d[1] * (t - 1) * 1.6]; }
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
};
// t: along the track from near to far (0..1.6). k: across, 0 far edge, 1 near edge. Returns [x, y, scale].
export function trackPoint(t, k = 0.5) {
    const a = bez(TRACK_A, t), b = bez(TRACK_B, t);
    const width = Math.hypot(b[0] - a[0], b[1] - a[1]);
    return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), width / 150];
}

export function playgroundWide(ctx, o = {}) {
    const { light = 'dusk', T = S.T, wind = 1, horizon = 610 } = o;
    const L = LIGHT[light];
    skyAndSun(ctx, L, horizon, { sunX: 1500, sunY: horizon - 80, sunR: 54, T, clouds: [[260, 150, 560], [1000, 90, 720], [1600, 240, 460], [620, 330, 380], [1350, 400, 300]] });
    treeLine(ctx, L, horizon + 4, 0, 0, 3, 80, mix(L.far, L.sky[1][0], 0.2));
    rect(ctx, 760, horizon - 92, 380, 100, mix(L.far, '#8a7a90', 0.3), 1, 51, 1.5);
    ctx.beginPath(); ctx.moveTo(740, horizon - 90); ctx.lineTo(950, horizon - 140); ctx.lineTo(1160, horizon - 90); fill(ctx, mix(L.far, '#7e6e86', 0.35));
    for (let i = 0; i < 5; i++) rect(ctx, 790 + i * 70, horizon - 66, 32, 24, mix(L.far, L.haze, 0.55), 0.9, 52 + i, 1);
    treeLine(ctx, L, horizon + 20, 0, 0, 12, 40, mix(L.far, L.field[1], 0.3));
    ctx.fillStyle = vgrad(ctx, horizon, H, [[mix(L.field[0], L.haze, 0.45), 0], [L.field[0], 0.3], [L.field[1], 1]]);
    ctx.fillRect(-600, horizon + 8, W + 1200, H - horizon + 400);
    mottle(ctx, -200, horizon + 40, W + 400, H - horizon, L.field[1], 31, 12, 0.1);
    // Track band.
    const N = 48;
    const A = [], B = [];
    for (let i = 0; i <= N; i++) { const t = (i / N) * 1.6; A.push(bez(TRACK_A, t)); B.push(bez(TRACK_B, t)); }
    ctx.beginPath();
    A.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1] + wob(p[0], 61)) : ctx.moveTo(p[0], p[1])));
    for (let i = B.length - 1; i >= 0; i--) ctx.lineTo(B[i][0], B[i][1] + wob(B[i][0], 62));
    ctx.closePath();
    ctx.fillStyle = vgrad(ctx, 600, H, [[L.track[0], 0], [L.track[1], 1]]);
    ctx.fill();
    ctx.strokeStyle = rgba('#fbe9d6', 0.85);
    ctx.lineCap = 'round';
    for (let l = 0; l <= 4; l++) {
        const k = l / 4;
        ctx.lineWidth = l === 0 || l === 4 ? 6 : 4;
        ctx.beginPath();
        A.forEach((p, i) => { const q = B[i]; const x = lerp(p[0], q[0], k), y = lerp(p[1], q[1], k); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
        ctx.stroke();
    }
    // Low sun glancing down the track.
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = '#ffe6bf';
    ctx.beginPath();
    for (let i = 20; i <= N; i++) { const p = A[i], q = B[i], x = lerp(p[0], q[0], 0.35), y = lerp(p[1], q[1], 0.35); i === 20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    for (let i = N; i >= 20; i--) { const p = A[i], q = B[i]; ctx.lineTo(lerp(p[0], q[0], 0.55), lerp(p[1], q[1], 0.55)); }
    ctx.fill();
    ctx.globalAlpha = 1;
    return {
        L, after: () => {
            grass(ctx, -300, W + 300, H + 20, { h: 150, w: 16, gap: 26, seed: 11, colors: [mix(L.field[1], '#283022', 0.4), mix(L.field[1], '#2f3a2a', 0.2), L.field[1]], wind });
            grass(ctx, 1500, W + 300, H - 120, { h: 70, w: 9, gap: 16, seed: 14, colors: [L.field[1], mix(L.field[0], L.field[1], 0.6)], wind });
            windLines(ctx, T, { count: 5, y0: 300, y1: 1000, alpha: 0.3 * wind });
        },
    };
}

// Five peaks and the lake beyond them.
export function mountains(ctx, o = {}) {
    const { T = S.T } = o;
    const L = LIGHT.gold;
    sky(ctx, [['#9aa9c6', 0], ['#d3c2c4', 0.5], ['#f3d4a6', 0.9], ['#f7e2bc', 1]], -300, 640, -800, 3400);
    glow(ctx, 2050, 420, 700, '#fff3d6', 0.5);
    [[300, 160, 600], [1400, 110, 800], [2300, 240, 500]].forEach(([x, y, w], i) => cloud(ctx, x - T * 6, y, w, '#fbeedd', 0.7, 80 + i));
    ridge(ctx, -800, 3400, (x) => 470 - fbm(x / 260, 21) * 110 - wob(x, 21), 900);
    fill(ctx, '#b7a8bd');
    // The five peaks, one after another.
    const peaks = [[120, 300], [560, 230], [980, 280], [1420, 200], [1880, 290]];
    ridge(ctx, -800, 3400, (x) => {
        let y = 640;
        for (const [px, py] of peaks) y = Math.min(y, py + Math.pow(Math.abs(x - px) / 240, 1.25) * 160);
        return y + fbm(x / 60, 5) * 18 + wob(x, 22);
    }, 1000);
    fill(ctx, '#8f88a8');
    // Light catching the sunward faces, and haze pooling in the valleys.
    ridge(ctx, -800, 3400, (x) => {
        let y = 640;
        for (const [px, py] of peaks) y = Math.min(y, py + 12 + Math.max(0, x - px) * 0.9 + Math.max(0, px - x) * 9);
        return y;
    }, 1000);
    fill(ctx, '#f6dcc0', 0.3);
    ctx.fillStyle = vgrad(ctx, 560, 720, [['rgba(246,220,190,0)', 0], ['rgba(246,220,190,.6)', 1]]);
    ctx.fillRect(-800, 560, 4200, 180);
    // Lake in the valley on the right.
    ctx.save();
    blob(ctx, 2150, 720, 620, 92, 7, 0.05, 16);
    ctx.fillStyle = vgrad(ctx, 640, 810, [['#c7d9dc', 0], ['#7fa6b6', 1]]);
    ctx.fill();
    ctx.clip();
    for (let i = 0; i < 14; i++) {
        const y = 660 + i * 11, x = 1700 + ((i * 173 + T * 30) % 900);
        ctx.fillStyle = rgba('#fff8e4', 0.5);
        ctx.fillRect(x, y, 60 + (i % 3) * 40, 2.5);
    }
    ctx.restore();
    ridge(ctx, -800, 3400, (x) => 690 + fbm(x / 300, 31) * 70 - Math.max(0, 1400 - x) * 0.05 + wob(x, 31), 1300);
    fill(ctx, '#7f8a62');
    // The near ridge they are walking along.
    const crest = (x) => 820 - Math.max(0, 1100 - Math.abs(x - 300)) * 0.18 + fbm(x / 120, 41) * 22 + wob(x, 41);
    ridge(ctx, -800, 3400, crest, 1400);
    fill(ctx, '#5f6b49');
    grass(ctx, -400, 2400, 1160, { h: 120, w: 14, gap: 24, seed: 44, colors: ['#4b573c', '#55623f'], wind: 0.7 });
    return { crest };
}

// Height of the downhill path at screen x, for a given distance walked.
export const downhillPath = (scroll) => (x) => 760 + (x + scroll) * 0.16 + fbm((x + scroll) / 200, 54) * 14;

// Down the mountain at dusk: a slope running down to the right.
export function downhill(ctx, o = {}) {
    const { scroll = 0, T = S.T } = o;
    const L = LIGHT.blue;
    sky(ctx, L.sky, -300, 760, -800, 2800);
    glow(ctx, 300, 640, 600, '#f3c19d', 0.45);
    stars(ctx, T, -200, -100, 2400, 300, 24, 8, 0.6);
    // Lake far below, catching the last light.
    ridge(ctx, -800, 2800, (x) => 600 - fbm((x + scroll * 0.05) / 220, 52) * 90, 900);
    fill(ctx, '#6c6888');
    blob(ctx, 420 - scroll * 0.05, 700, 380, 34, 9, 0.05, 14);
    fill(ctx, '#c9a5a6');
    ctx.fillStyle = rgba('#fde3c6', 0.6);
    ctx.fillRect(250 - scroll * 0.05, 698, 240, 3);
    ridge(ctx, -800, 2800, (x) => 680 - fbm((x + scroll * 0.2) / 160, 53) * 80, 1100);
    fill(ctx, '#4f5266');
    // Pines in the middle distance.
    const r = rng(7);
    for (let i = 0; i < 18; i++) {
        const x = (((r() * 2600 - scroll * 0.45) % 2600) + 2600) % 2600 - 300, y = 700 + r() * 60, h = 90 + r() * 90;
        ctx.beginPath();
        ctx.moveTo(x - h * 0.22, y);
        ctx.lineTo(x, y - h);
        ctx.lineTo(x + h * 0.22, y);
        fill(ctx, '#3f4458');
    }
    const path = downhillPath(scroll);
    ridge(ctx, -800, 2800, (x) => path(x) - 10, 1600);
    fill(ctx, '#58584d');
    ridge(ctx, -800, 2800, (x) => path(x) + 22, 1600);
    fill(ctx, '#45463e');
    return { path, after: () => grass(ctx, -400, 2400, 1110, { scroll: scroll * 1.3, h: 140, w: 15, gap: 26, seed: 55, colors: ['#33352f', '#3b3d34'], wind: 0.5 }) };
}

// Low among the grass, beetle height.
export function macroGrass(ctx, o = {}) {
    const { T = S.T, light = 'gold' } = o;
    sky(ctx, light === 'gold' ? [['#d9d4a8', 0], ['#bfc68e', 0.5], ['#93a46a', 1]] : [['#e7d6b8', 0], ['#bdc59a', 1]], -300, 1300, -600, 2600);
    const r = rng(3);
    for (let i = 0; i < 22; i++) glow(ctx, r() * 2200 - 140, r() * 700, 60 + r() * 120, i % 3 ? '#fff4d0' : '#f8e3a4', 0.25 + r() * 0.2);
    // Soft, out-of-focus grass behind.
    ctx.globalAlpha = 0.45;
    grass(ctx, -300, 2300, 860, { h: 480, w: 34, gap: 46, seed: 61, colors: ['#8a9a5c', '#7a8c52', '#a3ac6a'], wind: 0.35 });
    ctx.globalAlpha = 1;
    grass(ctx, -300, 2300, 880, { h: 300, w: 18, gap: 34, seed: 62, colors: ['#6f8250', '#5f7246', '#829458'], wind: 0.4 });
    ctx.fillStyle = vgrad(ctx, 820, 1300, [['#7b6a4c', 0], ['#5a4c3a', 1]]);
    blob(ctx, 960, 1080, 1500, 260, 4, 0.03, 20);
    ctx.fill();
    mottle(ctx, -200, 840, 2400, 300, '#3e3428', 63, 10, 0.18);
    // Pebbles and a fallen leaf.
    [[300, 920, 30], [1400, 960, 22], [1680, 900, 16], [700, 990, 18]].forEach(([x, y, s], i) => dab(ctx, x, y, s * 1.4, s, '#a19077', 1, 64 + i));
    return { ground: 900, after: () => {
        grass(ctx, -300, 2300, 1180, { h: 520, w: 30, gap: 70, seed: 66, colors: ['#4e5e3a', '#5b6b42'], wind: 0.45 });
        // Dew.
        for (let i = 0; i < 6; i++) { const x = 200 + i * 300, y = 520 + (i % 3) * 90; glow(ctx, x, y, 16, '#ffffff', 0.7); }
    } };
}

// Open meadow for many shots. horizon, hill: a rise in the middle the figure can stand on.
export function meadow(ctx, o = {}) {
    const { light = 'gold', horizon = 640, T = S.T, scroll = 0, hill = null, flowers = 30, wind = 1, sunX = 1500, far = true } = o;
    const L = LIGHT[light];
    skyAndSun(ctx, L, horizon, { sunX, sunY: horizon - 90, T, scroll, sun: o.sun });
    if (far) {
        ridge(ctx, -2000, W + 2000, (x) => horizon - 40 - fbm((x + scroll * 0.03) / 300, 71) * 140 - wob(x, 71), horizon + 200);
        fill(ctx, mix(L.far, L.sky[1][0], 0.35));
        ridge(ctx, -2000, W + 2000, (x) => horizon - 10 - fbm((x + scroll * 0.1) / 200, 72) * 70, horizon + 200);
        fill(ctx, mix(L.far, L.field[0], 0.4));
    }
    ctx.fillStyle = vgrad(ctx, horizon, H, [[mix(L.field[0], L.haze, 0.4), 0], [L.field[0], 0.35], [L.field[1], 1]]);
    ridge(ctx, -2000, W + 2000, (x) => horizon + fbm((x + scroll * 0.4) / 400, 73) * 20, H + 600);
    ctx.fill();
    mottle(ctx, -300, horizon, W + 600, H - horizon, L.field[1], 74, 12, 0.1);
    let hillTop = null;
    if (hill) {
        const { x = 960, y = 640, w = 700 } = hill;
        const f = (xx) => y + Math.pow(Math.abs(xx - x) / w, 2) * 420 + fbm(xx / 100, 75) * 14 + wob(xx, 75);
        ridge(ctx, x - w * 2, x + w * 2, f, H + 600);
        ctx.fillStyle = vgrad(ctx, y, H, [[mix(L.field[0], L.haze, 0.15), 0], [L.field[1], 1]]);
        ctx.fill();
        hillTop = f;
    }
    // Scattered small flowers in the grass.
    const r = rng(76);
    const colors = ['#f4d7d0', '#f2c45a', '#e9a3ae', '#fbf3e6'];
    for (let i = 0; i < flowers; i++) {
        const fx = ((r() * 2600 - scroll * 0.8) % 2600 + 2600) % 2600 - 340, fy = lerp(horizon + 60, H, Math.pow(r(), 0.7));
        const s = lerp(0.3, 1.2, (fy - horizon) / (H - horizon));
        ctx.beginPath();
        ctx.arc(fx, fy, 6 * s, 0, Math.PI * 2);
        fill(ctx, colors[i % colors.length], 0.85);
    }
    grass(ctx, -300, W + 300, horizon + 110, { h: 30, w: 6, gap: 12, seed: 77, scroll: scroll * 0.5, colors: [L.field[0], mix(L.field[0], L.field[1], 0.5)], wind });
    return { L, hillTop, after: () => {
        grass(ctx, -300, W + 300, H + 20, { h: 140, w: 15, gap: 24, seed: 78, scroll: scroll * 1.2, colors: [mix(L.field[1], '#2b3326', 0.35), L.field[1]], wind });
        windLines(ctx, T, { count: Math.round(4 * wind), y0: horizon - 400, y1: H - 100, alpha: 0.25 * wind });
    } };
}

// Looking up into a branch against the sky.
export function branchSky(ctx, o = {}) {
    const { T = S.T } = o;
    sky(ctx, [['#88a8c6', 0], ['#bcc9d4', 0.55], ['#f3dcb6', 1]], -400, 1500, -600, 2600);
    glow(ctx, 1500, 1050, 700, '#fff0d0', 0.55);
    [[400, 260, 620], [1300, 160, 700], [1800, 520, 500], [700, 640, 560]].forEach(([x, y, w], i) => cloud(ctx, x - T * 10, y, w, '#fbf3ea', 0.8, 90 + i));
    // Branch from the upper left, with leaves.
    const sw = Math.sin(T * 1.3) * 4;
    ctx.strokeStyle = '#6b5246';
    ctx.lineCap = 'round';
    ctx.lineWidth = 34;
    ctx.beginPath(); ctx.moveTo(-160, 150); ctx.quadraticCurveTo(400, 300 + sw, 900, 470 + sw); ctx.stroke();
    ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(420, 300 + sw); ctx.quadraticCurveTo(520, 170, 640, 120 + sw); ctx.stroke();
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(700, 410 + sw); ctx.quadraticCurveTo(780, 360, 860, 380 + sw); ctx.stroke();
    const r = rng(5);
    for (let i = 0; i < 46; i++) {
        const t = r(), x = lerp(-150, 880, t) + (r() - 0.5) * 120, y = lerp(150, 470, t) + (r() - 0.5) * 140 - 30 + sw;
        dab(ctx, x, y, 30 + r() * 20, 14 + r() * 8, ['#7d9455', '#91a862', '#6a8049', '#a7b872'][i % 4], 0.95, 100 + i, 0.15, r() * Math.PI);
    }
    return { perch: [880, 452 + sw] };
}

// Bedroom at night: lamp on, moon in the window.
export function bedroom(ctx, o = {}) {
    const { T = S.T, lampOn = 1 } = o;
    ctx.fillStyle = vgrad(ctx, -200, 1300, [['#4a4566', 0], ['#5d5070', 0.6], ['#4a3e58', 1]]);
    ctx.fillRect(-600, -400, W + 1200, 1900);
    mottle(ctx, -200, -100, 2300, 1200, '#2f2a44', 81, 14, 0.12);
    // Window.
    rect(ctx, 1200, 170, 470, 420, '#2c3458', 1, 82, 2);
    ctx.save();
    wpoly(ctx, [[1215, 185], [1655, 185], [1655, 575], [1215, 575]], 83, 1.5);
    ctx.clip();
    sky(ctx, [['#1f2645', 0], ['#3a4570', 1]], 185, 575, 1200, 1700);
    stars(ctx, T, 1220, 190, 430, 360, 22, 6);
    moon(ctx, 1520, 300, 46);
    ctx.restore();
    ctx.strokeStyle = '#d9c8b0';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(1435, 180); ctx.lineTo(1435, 580); ctx.moveTo(1205, 380); ctx.lineTo(1665, 380); ctx.stroke();
    rect(ctx, 1180, 575, 510, 22, '#d9c8b0', 1, 84, 1.5);
    // Curtains.
    for (const [x, f] of [[1110, 1], [1700, -1]]) {
        ctx.beginPath();
        ctx.moveTo(x, 140);
        ctx.quadraticCurveTo(x + f * 90 + Math.sin(T * 0.8) * 6, 380, x + f * 30, 660);
        ctx.lineTo(x - f * 60, 660);
        ctx.lineTo(x - f * 60, 140);
        fill(ctx, '#c79aa6');
    }
    // Moonlight on the wall and floor.
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#c9d6f2';
    ctx.beginPath(); ctx.moveTo(1215, 575); ctx.lineTo(1655, 575); ctx.lineTo(1500, 1080); ctx.lineTo(900, 1080); ctx.fill();
    ctx.globalAlpha = 1;
    // Floor.
    ctx.fillStyle = vgrad(ctx, 880, 1300, [['#6a5260', 0], ['#4e3c4a', 1]]);
    ctx.fillRect(-600, 880, W + 1200, 600);
    // Nightstand and lamp on the left.
    rect(ctx, 150, 640, 220, 260, '#8b6a58', 1, 85, 1.5);
    rect(ctx, 170, 700, 180, 6, '#6f5446', 1, 86, 1);
    lamp(ctx, 255, 642, 1.5, lampOn);
    // Picture frames.
    rect(ctx, 520, 260, 150, 120, '#d8c2a4', 1, 87, 1.5);
    rect(ctx, 535, 275, 120, 90, '#a9c2c4', 1, 88, 1);
    rect(ctx, 700, 300, 100, 130, '#d8c2a4', 1, 89, 1.5);
    rect(ctx, 712, 312, 76, 106, '#e8b3b0', 1, 90, 1);
    // Bed.
    rect(ctx, 400, 520, 60, 420, '#9b765f', 1, 91, 2);
    ctx.fillStyle = '#f1e2d4';
    wpoly(ctx, [[440, 700], [1240, 700], [1260, 900], [430, 900]], 92, 2.5);
    ctx.fill();
    return {
        mattress: 700,
        quilt: (lift = 0) => {
            ctx.fillStyle = vgrad(ctx, 720, 980, [['#e7b7bd', 0], ['#cf939e', 1]]);
            ctx.beginPath();
            ctx.moveTo(560, 760 - lift);
            ctx.quadraticCurveTo(800, 700 - lift * 1.6, 1260, 770);
            ctx.lineTo(1290, 960);
            ctx.lineTo(430, 960);
            ctx.lineTo(430, 780);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#f6d8d6';
            for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(600 + i * 150, 850 + (i % 2) * 40, 14, 0, Math.PI * 2); ctx.fill(); }
            ctx.globalAlpha = 1;
            glow(ctx, 255, 520, 700, '#ffcf8c', 0.18 * lampOn);
        },
        pillow: () => dab(ctx, 560, 700, 120, 42, '#fbf3ea', 1, 93, 0.06),
    };
}

// Season by season along a long field. season: 0 spring, 1 summer, 2 autumn, 3 winter (float).
export function seasons(ctx, o = {}) {
    const { season = 0, scroll = 0, T = S.T, horizon = 600 } = o;
    const s = clamp(season, 0, 3);
    const skyTop = ramp(['#a9c3d6', '#d9a98e', '#b9a9a6', '#c4cbd3'], s);
    const skyMid = ramp(['#dcd8d8', '#f0c696', '#e7b98a', '#e2e2e0'], s);
    const skyLow = ramp(['#f3e4cf', '#fbe1b0', '#f6d6a6', '#f2efe8'], s);
    sky(ctx, [[skyTop, 0], [skyMid, 0.6], [skyLow, 1]], -300, horizon + 40, -800, W + 800);
    glow(ctx, 1400, horizon - 60, 640, ramp(['#fff6e2', '#ffe1ac', '#ffd9a0', '#ffffff'], s), 0.5);
    [[300, 150, 600], [1200, 110, 760], [1750, 280, 420]].forEach(([x, y, w], i) => cloud(ctx, ((x - T * 12 - scroll * 0.02) % 2600 + 2600) % 2600 - 300, y, w, ramp(['#fbf3ee', '#fbe0c8', '#f6dcc0', '#fbfbf8'], s), 0.8, 110 + i));
    const far = ramp(['#a8b6b0', '#a49aa6', '#b4a091', '#c9ccd2'], s);
    ridge(ctx, -800, W + 800, (x) => horizon - 30 - fbm((x + scroll * 0.06) / 260, 121) * 120 - wob(x, 121), horizon + 200);
    fill(ctx, far);
    const field = [ramp(['#a8bb7c', '#7f9a55', '#c9a15f', '#e9e6e0'], s), ramp(['#7c9a58', '#5a7a43', '#a7783f', '#cfd2d2'], s)];
    ctx.fillStyle = vgrad(ctx, horizon, H, [[mix(field[0], skyLow, 0.3), 0], [field[0], 0.3], [field[1], 1]]);
    ctx.fillRect(-800, horizon, W + 1600, H - horizon + 400);
    mottle(ctx, -200, horizon, W + 400, H - horizon, field[1], 122, 10, 0.12);
    // A row of trees whose canopy turns with the year.
    const canopy = ramp(['#f0c4cb', '#5f8248', '#d4793c', '#9a8f8a'], s);
    const gap = 420, ts = scroll * 0.5;
    for (let i = Math.floor((ts - 600) / gap); i < (ts + W + 600) / gap; i++) {
        const x = i * gap - ts + 120, r = rng(i * 7 + 3), h = 260 + r() * 120;
        tree(ctx, x, horizon + 90, h, canopy, { seed: i * 7 + 3, bare: clamp(s - 2.4) * 1.6, snow: clamp(s - 2.6) * 2, blossom: s < 0.8 ? '#fbe6ea' : null });
    }
    return { field, after: () => {
        grass(ctx, -300, W + 300, H + 20, { h: lerp(110, 170, clamp(1 - Math.abs(s - 1))) * (s > 2.6 ? 0.5 : 1), w: 15, gap: 22, seed: 123, scroll: scroll * 1.2, colors: [mix(field[1], '#2f3a2a', 0.25), field[1], mix(field[0], field[1], 0.5)], wind: 1.2 });
        const wgt = (c) => clamp(1 - Math.abs(s - c) * 1.6);
        if (wgt(0) > 0) particles(ctx, T, 'petal', { count: 40, alpha: wgt(0), seed: 3 });
        if (wgt(1) > 0) particles(ctx, T, 'seed', { count: 26, alpha: wgt(1) * 0.8, seed: 5 });
        if (wgt(2) > 0) particles(ctx, T, 'leaf', { count: 44, alpha: wgt(2), seed: 7 });
        if (wgt(3) > 0) particles(ctx, T, 'snow', { count: 90, alpha: wgt(3), seed: 9, wind: 0.4 });
        windLines(ctx, T, { count: 6, y0: 150, y1: 1000, alpha: 0.3 });
    } };
}

// Indoors by the window: wall, table, light from the left. o.evening for lamp light.
export function tableRoom(ctx, o = {}) {
    const { T = S.T, evening = 0, tableY = 700 } = o;
    const wall = mix('#f1e1cf', '#7a6a7e', evening * 0.75);
    ctx.fillStyle = vgrad(ctx, -200, tableY, [[mix(wall, '#e9c9bd', 0.2), 0], [wall, 1]]);
    ctx.fillRect(-600, -400, W + 1200, tableY + 400);
    mottle(ctx, -200, -100, 2300, tableY + 100, mix(wall, '#b79a90', 0.4), 131, 12, 0.12);
    // Window on the left with a soft curtain.
    rect(ctx, 120, 90, 520, 470, mix('#cfe0e3', '#3d4466', evening), 1, 132, 2);
    ctx.save();
    wpoly(ctx, [[140, 110], [620, 110], [620, 540], [140, 540]], 133, 1.4);
    ctx.clip();
    sky(ctx, evening > 0.5 ? [['#3d4466', 0], ['#a78497', 1]] : [['#bcd2dc', 0], ['#f1e8d6', 1]], 110, 540, 120, 640);
    ridge(ctx, 120, 640, (x) => 470 - fbm(x / 80, 134) * 60, 560);
    fill(ctx, mix('#9db08a', '#4c4e5e', evening));
    ctx.restore();
    ctx.strokeStyle = '#e9dccb';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(380, 100); ctx.lineTo(380, 550); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(620, 70);
    ctx.quadraticCurveTo(700 + Math.sin(T) * 8, 320, 650, 620);
    ctx.lineTo(760, 620);
    ctx.lineTo(760, 70);
    fill(ctx, mix('#f2c9c7', '#9d7387', evening), 0.9);
    // Sun patch on the wall.
    if (evening < 0.5) {
        ctx.globalAlpha = 0.22 * (1 - evening * 2);
        ctx.fillStyle = '#fff1cf';
        ctx.beginPath(); ctx.moveTo(780, 140); ctx.lineTo(1180, 160); ctx.lineTo(1260, 560); ctx.lineTo(860, 540); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // Pinned drawings.
    [[1250, 200, -0.06, 141], [1440, 240, 0.05, 142], [1600, 190, -0.02, 143]].forEach(([x, y, a, seed]) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(a);
        rect(ctx, -70, -55, 140, 110, '#fbf5e8', 1, seed, 1.2);
        dab(ctx, -20, -10, 28, 26, ['#f2b34a', '#e9a3ae', '#9fbf9a'][seed % 3], 0.8, seed + 5);
        ctx.restore();
    });
    return {
        tableY,
        // Drawn after anyone standing or sitting behind it.
        table: () => {
            // Table.
            ctx.fillStyle = vgrad(ctx, tableY, H + 200, [[mix('#c99a72', '#7a5a52', evening * 0.6), 0], [mix('#a87652', '#5a4040', evening * 0.6), 1]]);
            wpoly(ctx, [[-600, tableY], [W + 600, tableY], [W + 600, H + 400], [-600, H + 400]], 135, 2);
            ctx.fill();
            ctx.fillStyle = rgba('#ffffff', 0.08);
            ctx.fillRect(-600, tableY, W + 1200, 10);
            mottle(ctx, -200, tableY, 2300, 400, '#7a5038', 136, 8, 0.14);
            if (evening > 0) glow(ctx, 1500, tableY - 120, 900, '#ffcf8c', 0.35 * evening);
        },
    };
}

// Living room in the evening: sofa, floor lamp, window going blue.
export function livingRoom(ctx, o = {}) {
    const { T = S.T } = o;
    ctx.fillStyle = vgrad(ctx, -200, 1200, [['#5d5a7c', 0], ['#77667c', 1]]);
    ctx.fillRect(-600, -400, W + 1200, 1800);
    mottle(ctx, -200, -100, 2300, 1100, '#3d3a58', 151, 12, 0.12);
    rect(ctx, 1260, 150, 440, 400, '#3d4468', 1, 152, 2);
    ctx.save();
    wpoly(ctx, [[1278, 168], [1682, 168], [1682, 532], [1278, 532]], 153, 1.4);
    ctx.clip();
    sky(ctx, [['#36406c', 0], ['#8a7aa0', 0.7], ['#e2a58c', 1]], 168, 532, 1260, 1700);
    stars(ctx, T, 1280, 170, 400, 200, 10, 15, 0.7);
    ridge(ctx, 1260, 1700, (x) => 470 - (Math.floor(x / 60) % 3) * 30, 560);
    fill(ctx, '#2d3150');
    ctx.restore();
    ctx.strokeStyle = '#d9cbbb';
    ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(1480, 160); ctx.lineTo(1480, 540); ctx.stroke();
    // Floor lamp.
    ctx.strokeStyle = '#3a3036';
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(300, 960); ctx.lineTo(300, 330); ctx.stroke();
    glow(ctx, 300, 300, 900, '#ffd08f', 0.42);
    ctx.beginPath(); ctx.moveTo(220, 340); ctx.lineTo(380, 340); ctx.lineTo(340, 250); ctx.lineTo(260, 250); fill(ctx, '#f5dcae');
    // Plant.
    for (let i = 0; i < 9; i++) dab(ctx, 1840 + Math.sin(i) * 60, 640 - i * 30, 50, 20, '#6e8a58', 0.95, 160 + i, 0.2, i * 0.7);
    rect(ctx, 1790, 720, 100, 120, '#c6855f', 1, 170, 2);
    ctx.fillStyle = vgrad(ctx, 900, 1300, [['#6b5866', 0], ['#4f404c', 1]]);
    ctx.fillRect(-600, 900, W + 1200, 600);
    dab(ctx, 960, 1010, 760, 70, '#c99b8f', 0.6, 171, 0.05);
    // Sofa.
    rect(ctx, 480, 520, 980, 260, '#8ea392', 1, 172, 3);
    rect(ctx, 440, 700, 1060, 200, '#9fb3a0', 1, 173, 3);
    rect(ctx, 400, 640, 120, 260, '#869b89', 1, 174, 3);
    rect(ctx, 1420, 640, 120, 260, '#869b89', 1, 175, 3);
    dab(ctx, 620, 650, 90, 70, '#e7b9b6', 1, 176, 0.1, -0.2);
    return { seat: 720 };
}

// Hallway with the front door; open 0..1 swings the door and lets the evening in.
export function hallway(ctx, o = {}) {
    const { T = S.T, open = 0, clock = 0 } = o;
    ctx.fillStyle = vgrad(ctx, -200, 1200, [['#efe0cb', 0], ['#e1cbb1', 1]]);
    ctx.fillRect(-600, -400, W + 1200, 1800);
    mottle(ctx, -200, -100, 2300, 1100, '#c3a88e', 181, 12, 0.12);
    // Doorway into the kitchen on the right, warm.
    rect(ctx, 1500, 200, 360, 700, '#f6d6a0', 1, 182, 2);
    glow(ctx, 1680, 600, 500, '#ffd59a', 0.5);
    // Front door frame.
    const dx = 520, dy = 160, dw = 360, dh = 740;
    rect(ctx, dx - 24, dy - 24, dw + 48, dh + 24, '#b4906e', 1, 183, 2);
    // Outside, seen through the opening.
    ctx.save();
    wpoly(ctx, [[dx, dy], [dx + dw, dy], [dx + dw, dy + dh], [dx, dy + dh]], 184, 1);
    ctx.clip();
    sky(ctx, [['#5f6595', 0], ['#d9a08a', 0.7], ['#f3c58f', 1]], dy, dy + dh, dx, dx + dw);
    ridge(ctx, dx, dx + dw, (x) => dy + dh - 200 - fbm(x / 60, 185) * 60, dy + dh + 10);
    fill(ctx, '#5a5a6e');
    ctx.restore();
    if (open > 0) {
        ctx.globalAlpha = 0.35 * open;
        ctx.fillStyle = '#ffd8a8';
        ctx.beginPath(); ctx.moveTo(dx, dy + dh); ctx.lineTo(dx + dw * open, dy + dh); ctx.lineTo(dx + dw * open + 500 * open, H + 100); ctx.lineTo(dx - 200, H + 100); ctx.fill();
        ctx.globalAlpha = 1;
    }
    // Door panel, swinging inward toward us on its left hinge.
    const k = 1 - open;
    const pw = dw * Math.max(0.12, k);
    ctx.fillStyle = mix('#7d5a46', '#5a3e32', open * 0.4);
    wpoly(ctx, [[dx, dy - 10 * open], [dx + pw, dy + 20 * open], [dx + pw, dy + dh - 10 * open], [dx, dy + dh + 10 * open]], 186, 1.5);
    ctx.fill();
    if (k > 0.3) {
        rect(ctx, dx + pw * 0.2, dy + 60, pw * 0.6, 180, '#cfe0e3', 0.8, 187, 1);
        ctx.beginPath(); ctx.arc(dx + pw * 0.86, dy + dh * 0.55, 10, 0, Math.PI * 2); fill(ctx, '#e3c27a');
    }
    // Clock, its hands hurrying.
    ctx.beginPath(); ctx.arc(1180, 280, 70, 0, Math.PI * 2); fill(ctx, '#fbf3e6');
    ctx.lineWidth = 8; ctx.strokeStyle = '#8a6a52'; ctx.stroke();
    ctx.strokeStyle = '#3a2f38'; ctx.lineCap = 'round';
    for (const [len, a, w] of [[38, clock * 0.08, 7], [55, clock, 4]]) {
        ctx.lineWidth = w;
        ctx.beginPath(); ctx.moveTo(1180, 280); ctx.lineTo(1180 + Math.sin(a) * len, 280 - Math.cos(a) * len); ctx.stroke();
    }
    // Coat hooks and a small bench with shoes.
    ctx.fillStyle = '#6f7f94'; ctx.beginPath(); ctx.ellipse(1010, 420, 40, 110, 0.05, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = vgrad(ctx, 900, 1300, [['#c7a888', 0], ['#a78a70', 1]]);
    ctx.fillRect(-600, 900, W + 1200, 600);
    ctx.strokeStyle = rgba('#8a6e58', 0.4); ctx.lineWidth = 3;
    for (let i = -6; i < 14; i++) { ctx.beginPath(); ctx.moveTo(i * 180, 900); ctx.lineTo(i * 180 - 300, 1100); ctx.stroke(); }
    rect(ctx, 980, 740, 300, 40, '#9a7558', 1, 188, 2);
    rect(ctx, 1000, 780, 20, 120, '#8a6a4f', 1, 189, 1);
    rect(ctx, 1240, 780, 20, 120, '#8a6a4f', 1, 190, 1);
    [[960, 905, '#3b302d', 30], [1010, 910, '#3b302d', 30], [1090, 905, '#e5a1a7', 16], [1120, 908, '#e5a1a7', 16]].forEach(([x, y, c, w], i) => dab(ctx, x, y, w, w * 0.4, c, 1, 191 + i));
    return { floor: 900, door: [dx, dy, dw, dh], bench: 740 };
}

// Night outside a lit home window.
export function nightHouse(ctx, o = {}) {
    const { T = S.T } = o;
    sky(ctx, [['#1c2140', 0], ['#2f3760', 0.6], ['#55557a', 1]], -300, 900, -600, 2600);
    stars(ctx, T, -100, -100, 2200, 600, 60, 21);
    moon(ctx, 1560, 200, 52);
    ridge(ctx, -600, 2600, (x) => 820 - fbm(x / 200, 201) * 60, 1300);
    fill(ctx, '#272a40');
    // House.
    rect(ctx, 600, 380, 720, 560, '#3c3a54', 1, 202, 2);
    ctx.beginPath(); ctx.moveTo(560, 390); ctx.lineTo(960, 160); ctx.lineTo(1360, 390); fill(ctx, '#2c2a40');
    const win = [[700, 480, 240, 200], [1000, 480, 220, 200], [880, 740, 160, 200]];
    win.forEach(([x, y, w, h], i) => {
        glow(ctx, x + w / 2, y + h / 2, 300, '#ffcf8c', 0.25);
        rect(ctx, x, y, w, h, '#f4cf8f', 1, 203 + i, 1.5);
    });
    ctx.strokeStyle = '#3c3a54'; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(820, 480); ctx.lineTo(820, 680); ctx.moveTo(700, 580); ctx.lineTo(940, 580); ctx.stroke();
    // Tree and street lamp.
    tree(ctx, 330, 960, 520, '#2b3a3a', { seed: 210, trunk: '#1f2230' });
    ctx.strokeStyle = '#1f2230'; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(1560, 980); ctx.lineTo(1560, 560); ctx.lineTo(1610, 540); ctx.stroke();
    glow(ctx, 1620, 560, 260, '#ffd9a0', 0.5);
    ctx.fillStyle = vgrad(ctx, 930, 1300, [['#2e3046', 0], ['#22243a', 1]]);
    ctx.fillRect(-600, 930, W + 1200, 600);
    return { windows: win };
}

// Corner of the playground by a wall and the slide; the light is getting low.
export function corner(ctx, o = {}) {
    const { T = S.T } = o;
    sky(ctx, LIGHT.gold.sky, -300, 600, -600, 2600);
    treeLine(ctx, LIGHT.gold, 560, 0, 0, 41, 60, '#b3a6a6');
    // Wall across the back.
    rect(ctx, -200, 380, 1400, 520, '#e1c6a1', 1, 221, 2);
    mottle(ctx, -100, 400, 1200, 480, '#c9a882', 222, 8, 0.07);
    ctx.strokeStyle = rgba('#b8956f', 0.5); ctx.lineWidth = 3;
    for (let y = 440; y < 900; y += 70) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(1200, y + 4); ctx.stroke(); }
    // Ground.
    ctx.fillStyle = vgrad(ctx, 880, 1300, [['#d2b48d', 0], ['#b3926c', 1]]);
    ctx.fillRect(-600, 880, W + 1200, 600);
    // Wall's long shadow.
    ctx.globalAlpha = 0.3; ctx.fillStyle = '#6a5060';
    ctx.beginPath(); ctx.moveTo(-200, 900); ctx.lineTo(1200, 900); ctx.lineTo(1500, 1100); ctx.lineTo(-200, 1100); ctx.fill();
    ctx.globalAlpha = 1;
    // Slide on the right.
    ctx.strokeStyle = '#8b86a8'; ctx.lineWidth = 16;
    ctx.beginPath(); ctx.moveTo(1450, 900); ctx.lineTo(1450, 420); ctx.moveTo(1560, 900); ctx.lineTo(1560, 420); ctx.stroke();
    ctx.lineWidth = 8;
    for (let y = 480; y < 900; y += 70) { ctx.beginPath(); ctx.moveTo(1450, y); ctx.lineTo(1560, y); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(1560, 430); ctx.quadraticCurveTo(1760, 520, 1900, 880); ctx.lineTo(1980, 860); ctx.quadraticCurveTo(1820, 480, 1590, 400); fill(ctx, '#a99ac2');
    return { ground: 900 };
}
