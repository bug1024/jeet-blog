// Scenes. Each draws the whole frame for song time T in stage coordinates (1920 × 1080).
// Timings come from the LRC cue times (cue(i) of the section) and the beat grid, never from the lyric renderer.
import { W, H, view, resetT, lerp, clamp, range, move, E, beat, mix, rgba, rng, camera, mixPt, pulse } from './core.js';
import { C, SECTIONS, sectionAt } from './design.js';
import { pre1, pre2, verse2, bridge, turnAway } from './scenes2.js';
import { piece, ink, halftone, rule, road, rectPts, circlePts, scissor, torn, path, transform, spline, paperBase } from './paper.js';
import { windowMotif, house, cat, mountain, sea, pages, lines, mapSheet, mapPoint, footprints, figure, seasonStamp } from './motifs.js';
import { label } from './type.js';

let LYRICS = [];
export const setLyrics = (l) => { LYRICS = l; };
// Cue times of the lyric lines inside a section.
const cues = (sec) => LYRICS.filter((l) => l.t >= sec.from - 0.01 && l.t < sec.to - 0.01).map((l) => l.t);

// Stop-motion stepping for small animated pieces (12 steps a second).
const steps = (T) => Math.floor(T * 12) / 12;

// =====================================================================
// Intro + Verse 1: two shapes become a window; the cat arrives; the window is a home.
// =====================================================================
function windowCat(ctx, T) {
    const b = beat;
    // Camera: close on the window, pulling back to reveal the house, then easing back in.
    const pull = move(T, 26.63, 30.2, E.settle);
    const push = move(T, 33.21, 39.83, E.settle);
    const z = lerp(lerp(1, 0.38, pull), 0.56, push);
    const cy = lerp(lerp(540, 420, pull), 470, push);
    ctx.save();
    camera(ctx, 960, cy, z);

    // Outside the house: dusk sky, a far line of hills, the ground. Only seen once the camera pulls back.
    if (pull > 0) {
        const sky = ctx.createLinearGradient(0, -1200, 0, 1700);
        sky.addColorStop(0, mix(C.blueLight, C.blue, 0.4));
        sky.addColorStop(0.55, mix(C.paperLight, C.brickLight, 0.35));
        sky.addColorStop(1, C.sand);
        ctx.fillStyle = sky;
        ctx.fillRect(-3000, -2000, 8000, 3700);
        halftone(ctx, rectPts(-3000, -2000, 8000, 1500), 1, 0.12);
        ink(ctx, circlePts(1900, -380, 760, 96), C.orange, 0.55);
        mountain(ctx, -1300, 1700, 1500, 520, C.blue, 1, 3);
        mountain(ctx, 3300, 1700, 1700, 460, mix(C.blue, C.green, 0.4), 1, 4);
        piece(ctx, torn(rectPts(-3000, 1700, 8000, 1200), 5, 4), C.green, { fringe: 3, seed: 5 });
        halftone(ctx, rectPts(-3000, 1700, 8000, 1200), 2, 0.12);
    }
    // House: the wall is the page we started on, so pulling back simply finds its edges.
    const hx0 = -80, hx1 = 2000, hy0 = -60, hy1 = 1700;
    if (pull > 0) {
        // Saltbox roof: ridge to the right, long slope down to the left.
        const ridge = [1380, hy0 - 760];
        piece(ctx, scissor([[hx0 - 120, hy0 + 6], ridge, [hx1 + 120, hy0 - 160], [hx1 + 120, hy0 + 6]], 41), C.brick, { lift: 1 });
        const shade = [ridge, [hx1 + 120, hy0 - 160], [hx1 + 120, hy0 + 6], [ridge[0], hy0 + 6]];
        ink(ctx, shade, mix(C.brick, C.ink, 0.3), 0.5);
        halftone(ctx, shade, 2, 0.16);
    }
    piece(ctx, rectPts(hx0, hy0, hx1 - hx0, hy1 - hy0), C.paper, { shadow: pull > 0, tex: 0.25, lift: 1 });
    if (pull > 0) {
        // Door and the second window.
        piece(ctx, scissor(rectPts(1380, 1060, 300, 640), 42), C.blueDeep);
        piece(ctx, circlePts(1640, 1380, 10, 16), C.orange, { shadow: false });
        windowMotif(ctx, 1530, 470, 300, 360, { sky: dusk(T), lamp: move(T, 37.06, 38.69, E.settle), seed: 51, border: 22, sill: 1 });
    }
    // The first mark on the page is a single point on a map, 2018; the line grows out of it both ways.
    const dotIn = move(T, 1.6, 3.4), lineOut = move(T, b(-12), b(-10), E.page), lineGone = move(T, b(5), b(7));
    if (dotIn > 0 && lineGone < 1) {
        mapPoint(ctx, 960, 760, dotIn * (1 - lineGone), null);
        label(ctx, '2018', 960, 812, dotIn * (1 - move(T, 13.69, 15)), 'center');
        rule(ctx, [960, 760], [960 - 750, 760], lineOut, 2, C.ink, 1 - lineGone);
        rule(ctx, [960, 760], [960 + 750, 760], lineOut, 2, C.ink, 1 - lineGone);
    }

    // Two shapes arrive (one person each), then fit together into a window with the sun inside it.
    const merge = move(T, 13.69, b(2), E.page);
    const sqIn = move(T, b(-9), b(-3));
    const ciIn = move(T, b(-8), b(-2));
    const glassW = lerp(300, 468, merge), glassH = lerp(300, 508, merge);
    const gx = lerp(lerp(-500, 640, sqIn), 960, merge), gy = lerp(470, 470, merge);
    const sunPos = [lerp(lerp(2300, 1280, ciIn), 960 + 120, merge), lerp(470, 470 - 120 + move(T, 16.86, 27, E.settle) * 120, merge)];
    const sunR = lerp(64, 58, merge);
    if (T < b(2)) {
        const g = ctx.createLinearGradient(0, gy - glassH / 2, 0, gy + glassH / 2);
        g.addColorStop(0, C.blue);
        g.addColorStop(1, C.blueLight);
        piece(ctx, scissor(rectPts(gx - glassW / 2, gy - glassH / 2, glassW, glassH), 61), g, { lift: (1 - merge) * 0.5 + (sqIn < 1 ? 1 : 0) });
        piece(ctx, circlePts(sunPos[0], sunPos[1], sunR, 64), C.orange, { lift: ciIn < 1 ? 1 : 0.3 });
    } else {
        const frame = range(T, b(2), b(6));
        const lampOn = move(T, 36.24, 37.88, E.settle);
        const people = move(T, 35.91, 37.5);
        windowMotif(ctx, 960, 470, 520, 560, {
            sky: dusk(T), border: 26, seed: 71,
            sun: { x: sunPos[0] - 960, y: sunPos[1] - 470, r: sunR, color: mix(C.orange, C.brick, move(T, 23.03, 27, E.settle) * 0.6) },
            frame, mullion: range(T, b(5), b(7)), sill: range(T, b(6), b(7)), lamp: lampOn * 0.85,
            inside: (c, x, y, w, h) => {
                // Two people inside, seen as shapes against the light.
                if (people <= 0) return;
                const rise = (1 - E.slide(people)) * 120;
                [[x + w * 0.36, 1], [x + w * 0.63, 0.92]].forEach(([px, k], i) => {
                    piece(c, circlePts(px, y + h - 120 * k + rise, 30 * k, 32), C.blueDeep, { tex: 0.3 });
                    piece(c, [[px - 64 * k, y + h + 4], [px - 44 * k, y + h - 74 * k + rise], [px + 44 * k, y + h - 74 * k + rise], [px + 64 * k, y + h + 4]], C.blueDeep, { tex: 0.3 });
                });
            },
        });
        // Light falling through the window onto the wall.
        const patch = move(T, 16.86, 21, E.settle) * (1 - pull);
        if (patch > 0) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.globalAlpha = 0.22 * patch;
            ctx.fillStyle = mix('#FFF3D6', C.orange, move(T, 23.03, 27, E.settle) * 0.5);
            ctx.beginPath();
            const stretch = move(T, 23.03, 30, E.settle) * 260;
            ctx.moveTo(1220, 760); ctx.lineTo(1500 + stretch, 760); ctx.lineTo(1880 + stretch, 1080); ctx.lineTo(1500, 1080);
            ctx.fill();
            ctx.restore();
        }
    }
    // The cat walks in along the sill and curls up.
    const walkIn = move(T, 20.13, 22.7, E.linear);
    if (T >= 20.13) {
        const x = lerp(1820, 1080, E.settle(walkIn));
        cat(ctx, x, 746, 1.15, steps(T) * 10, move(T, 22.7, 24.0, E.settle));
    }
    // Under the eave: the four seasons laid down one by one, like stamps.
    if (pull > 0.5) [0, 1, 2, 3].forEach((i) => seasonStamp(ctx, i, 330 + i * 420, 150, move(T, beat(19 + i), beat(19 + i) + 0.45)));
    ctx.restore();
}
// Window sky through the afternoon into dusk.
function dusk(T) {
    const k = move(T, 23.03, 27.5, E.settle);
    return [mix(C.blue, mix(C.brick, C.blueDeep, 0.3), k), mix(C.blueLight, C.orange, k * 0.8)];
}

// =====================================================================
// Chorus: the double world. Same structure every time; n adds to it.
// =====================================================================
const CHORUS = {
    1: { years: ['2018', '2019', '2020'], kinds: ['dot', 'cat', 'house'], warm: 0, branches: 0, pageColors: [C.paperLight, '#E4E6D4', '#EED9C0', '#E9E4DA'] },
    2: { years: ['2018', '2019', '2020', '2021'], kinds: ['dot', 'cat', 'house', 'feet'], warm: 0.5, branches: 1, pageColors: [C.paperLight, '#E7E3C9', '#F0D5B6', '#EADFD2'] },
    3: { years: ['2018', '2019', '2020', '2021', '2026'], kinds: ['dot', 'cat', 'house', 'feet', 'dot'], warm: 0.8, branches: 3, pageColors: [C.paperLight, '#E7E3C9', '#F0D5B6', '#EADFD2'] },
};
function chorus(ctx, T, sec) {
    const v = CHORUS[sec.n || 1];
    const L = cues(sec);
    const t0 = sec.from;
    // Phases.
    const open = move(T, t0 + 0.2, t0 + 1.8, E.page);
    const seam = move(T, t0, t0 + 0.9, E.page);
    const flips = range(T, L[1] + 0.1, L[1] + 3.3) * 4;
    const roadP = move(T, L[1] + 0.4, L[2] + 2.4, E.settle);
    const far = range(T, L[2], L[3]);
    const study = range(T, L[3], L[4]);
    const meet = move(T, L[4], L[4] + 2.2, E.page);
    const fold = move(T, L[4] + 0.4, L[4] + 1.8, E.page);
    const pull = move(T, L[5], L[5] + 2.6, E.settle);
    const loop = move(T, L[6], L[6] + 2.6, E.settle);
    const home = move(T, L[7], L[7] + 3.6, E.settle);
    const warm = v.warm;

    paperBase(ctx, mix(C.paper, '#F0DFC6', warm * 0.5));
    const z = lerp(lerp(1, 0.62, pull), 1.35, home);
    const cy = lerp(lerp(540, 560, pull), 600, home);
    ctx.save();
    camera(ctx, 960, cy, z);

    // ---- Map world revealed by the pull-back (behind everything) ----
    if (pull > 0) {
        mapSheet(ctx, -300, -150, 2520, 1500, { seed: 13 + (sec.n || 1), torn: true, alpha: clamp(pull * 1.5), lift: 1 });
        ctx.save();
        ctx.globalAlpha *= clamp(pull * 1.5);
        // Coast on the left edge, a range of hills at the top, a compass and a scale bar: an old survey map.
        piece(ctx, torn([[-300, -150], [60, -150], [20, 200], [110, 520], [40, 900], [130, 1350], [-300, 1350]], 17, 5, 9), C.blueLight, { fringe: 2.5, seed: 17 });
        sea(ctx, -300, 300, 300, 600, 1, 18, T);
        [[260, 260, 110, 80], [360, 260, 150, 120], [470, 260, 90, 60], [1350, 250, 120, 90], [1470, 250, 160, 110]].forEach(([x, b0, w, h], i) => mountain(ctx, x, b0, w, h, i % 2 ? C.blue : C.greenLight, 1, 120 + i));
        ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(1720, 210); ctx.lineTo(1720, 110); ctx.moveTo(1706, 132); ctx.lineTo(1720, 110); ctx.lineTo(1734, 132); ctx.stroke();
        label(ctx, 'N', 1720, 96, 1, 'center');
        rule(ctx, [1560, 1220], [1760, 1220], 1, 2, C.ink, 0.8);
        [1560, 1660, 1760].forEach((x) => rule(ctx, [x, 1212], [x, 1228], 1, 1.5, C.ink, 0.8));
        label(ctx, '0', 1560, 1258, 0.8, 'center');
        label(ctx, '1 km', 1760, 1258, 0.8, 'center');
        ctx.restore();
        const pts = [[420, 330], [600, 860], [960, 700], [1460, 900], [1530, 300]];
        const roadPts = spline([pts[0], [480, 620], pts[1], [800, 820], [960, 760]], 16);
        road(ctx, roadPts, move(T, L[5] + 0.6, L[6], E.settle), 12, C.brick);
        // Later choruses: a new track branches off towards the next places.
        if (v.branches > 0) road(ctx, spline([[960, 760], [1200, 860], pts[3]], 16), move(T, L[5] + 1.6, L[6] + 0.5, E.settle), 9, C.brickLight);
        if (v.branches > 2) road(ctx, spline([[960, 760], [1250, 520], pts[4]], 16), move(T, L[5] + 2.2, L[6] + 1, E.settle), 9, C.brickLight);
        v.years.forEach((y, i) => {
            const at = i === 2 ? null : pts[i];
            if (!at) return;
            mapPoint(ctx, at[0], at[1], move(T, L[5] + 0.4 + i * 0.82, L[5] + 1.2 + i * 0.82), y, v.kinds[i]);
        });
        if (pull > 0.3) label(ctx, v.years[2], 1010, 830, clamp((pull - 0.3) * 3));
        // The loop: around the house and back to its door.
        const ring = [];
        for (let a = 0; a <= 72; a++) {
            const ang = Math.PI * 0.5 + (a / 72) * Math.PI * 2;
            ring.push([960 + Math.cos(ang) * 330, 640 + Math.sin(ang) * 190]);
        }
        road(ctx, ring, loop, 6, C.brick, { alpha: 0.9 });
    }

    // ---- The spread: two pages opening from the seam ----
    const pagesAlpha = 1 - fold;
    if (open > 0 && pagesAlpha > 0) {
        const lw = 820 * open * (1 - fold), top = 250, ph = 750;
        // Left page: the map and the road out.
        ctx.save();
        ctx.beginPath(); ctx.rect(960 - lw, top - 40, lw, ph + 80); ctx.clip();
        mapSheet(ctx, 960 - 820, top, 820, ph, { seed: 7, lift: 0.5 });
        const roadPts = spline([[960, 830], [780, 800], [660, 690], [520, 720], [400, 600], [310, 540]], 16);
        road(ctx, roadPts, roadP, 18, C.brick);
        mountain(ctx, 300, 600, 240, 260 + warm * 20, mix(C.blue, C.green, 0.3), range(T, L[2] + 0.2, L[2] + 1.2), 21);
        mountain(ctx, 430, 600, 180, 170, C.blue, range(T, L[2] + 0.8, L[2] + 1.8), 22);
        mountain(ctx, 200, 600, 150, 140, C.green, range(T, L[2] + 1.4, L[2] + 2.4), 23);
        sea(ctx, 180, 820, 420, 130, range(T, L[2] + 0.6, L[2] + 2.8), 31, T);
        mapPoint(ctx, 930, 830, open, null);
        for (let tx = 180; tx < 940; tx += 60) rule(ctx, [tx, top], [tx, top + (tx % 300 === 0 ? 16 : 8)], 1, 1, C.ink, 0.5);
        label(ctx, String(10 + (sec.n || 1) * 2), 170, top + ph - 24, 0.8);
        ctx.restore();
        // Right page: the window, the desk and its turning pages.
        ctx.save();
        ctx.beginPath(); ctx.rect(960, top - 40, lw, ph + 80); ctx.clip();
        piece(ctx, scissor(rectPts(960, top, 820, ph), 8), mix(C.paperLight, '#F6E6CC', warm * 0.4), { lift: 0.5 });
        windowMotif(ctx, 1470, 440, 300, 300, {
            sky: [mix(C.blue, C.blueDeep, study), mix(C.blueLight, C.brickLight, study * 0.6)], lamp: study * 0.9 + warm * 0.2 * study, border: 20, seed: 81,
            sun: { x: 60, y: -50, r: 26, color: mix(C.paperLight, '#F4E3B5', study) },
        });
        // Desk edge: the same red line as the road, continuing across the seam.
        piece(ctx, scissor(rectPts(960, 821, 820, 18), 9), C.brick);
        piece(ctx, scissor(rectPts(960, 839, 820, 160), 10), mix(C.kraft, C.kraftDark, 0.3), { shadow: false });
        pages(ctx, 1320, 650, 180, 160, flips, v.pageColors, 12);
        lines(ctx, 1120, 690, 150, 6, 0.35, study, 5);
        if (sec.n >= 2) piece(ctx, scissor(rectPts(1610, 760, 46, 60), 14), C.blueLight, { tex: 0.5 });
        label(ctx, String(11 + (sec.n || 1) * 2), 1750, top + ph - 24, 0.8, 'right');
        ctx.restore();
        rule(ctx, [960, 90 + 160], [960, 90 + 160 + 760 * seam], 1, 1.5, C.ink, 0.8);
    }

    // ---- The match: a mountain from the left and the window from the right become one house ----
    if (meet > 0) {
        const wallW = 300, wallH = 230, gy = 760;
        const fromWin = [1470, 440], fromMtn = [300, 600];
        const wx = lerp(fromWin[0], 960, meet), wy = lerp(fromWin[1] + 150, gy - wallH / 2, meet);
        const mx = lerp(fromMtn[0], 960, meet), my = lerp(fromMtn[1], gy - wallH + 6, meet);
        const ww = lerp(300, wallW, meet), wh = lerp(300, wallH, meet);
        const lit = Math.max(0.6, home) * (0.9 + 0.1 * pulse(T, 4));
        if (meet < 1) {
            piece(ctx, scissor(rectPts(wx - ww / 2, wy - wh / 2, ww, wh), 91), mix(C.paperLight, C.kraft, meet), { lift: 1 });
            const rh = lerp(260, wallW * 0.5, meet), rw = lerp(240, wallW * 1.16, meet);
            piece(ctx, scissor([[mx - rw / 2, my], [mx, my - rh], [mx + rw / 2, my]], 92), mix(mix(C.blue, C.green, 0.3), C.brick, meet), { lift: 1 });
        } else {
            house(ctx, 960, gy, wallW, wallH, { lit, seed: 93, windows: [[wallW * 0.14, wallH * 0.2, wallW * 0.34, wallH * 0.36]], sky: [C.blueDeep, C.blue] });
            if (sec.n >= 2) footprints(ctx, 1150, 790, 0.9, clamp(home * 2));
            if (sec.n >= 2) cat(ctx, 880, 762, 0.42, 0, 1);
        }
    }
    ctx.restore();
}

// =====================================================================
// Outro: one long take along the road to the house; the family under the eave; the title.
// =====================================================================
export function outro(ctx, T) {
    const s = 180.02;
    const go = move(T, s, 191.5, E.settle);
    const back = move(T, 193.2, 204.5, E.settle);
    const z = lerp(lerp(0.5, 1.15, go), 0.52, back);
    const cx = lerp(lerp(1150, 2000, go), 1900, back);
    const cy = lerp(lerp(1420, 990, go), 1060, back);
    const eve = move(T, 186, 205, E.settle);
    paperBase(ctx);
    ctx.save();
    camera(ctx, cx, cy, z);
    // Sky, deepening to evening.
    const sky = ctx.createLinearGradient(0, -400, 0, 1040);
    sky.addColorStop(0, mix(C.blueLight, C.blueDeep, eve * 0.8));
    sky.addColorStop(0.7, mix(C.paperLight, C.brickLight, 0.25 + eve * 0.3));
    sky.addColorStop(1, mix(C.sand, C.orange, eve * 0.4));
    ctx.fillStyle = sky;
    ctx.fillRect(-1500, -1200, 6500, 2260);
    // A large low sun behind the house, printed in orange.
    ink(ctx, circlePts(2330, 1000, 300, 96), mix(C.orange, C.brick, eve * 0.4), 0.7);
    halftone(ctx, circlePts(2330, 1000, 300, 96), 0, 0.15);
    // Sea far left, mountains on both sides of the horizon.
    sea(ctx, -600, 960, 1700, 110, 1, 41, T);
    [[200, 300, 200, C.blue], [520, 360, 280, mix(C.blue, C.green, 0.4)], [820, 260, 170, C.green], [2900, 380, 250, C.blue], [3250, 300, 200, mix(C.blue, C.green, 0.4)], [3560, 420, 300, C.green]]
        .forEach(([x, w, h, col], i) => mountain(ctx, x, 1040, w, h, col, 1, 50 + i));
    // Fields: a patchwork of torn paper, like a map.
    const r = rng(77);
    const fieldCols = [C.kraft, C.greenLight, C.sand, mix(C.green, C.greenLight, 0.5), C.paperDark];
    for (let row = 0; row < 5; row++) {
        let x = -1400;
        const y = 1040 + row * 230;
        while (x < 5000) {
            const w = 380 + r() * 520;
            const fpts = torn(rectPts(x, y, w + 30, 240), Math.floor(r() * 1000), 3);
            piece(ctx, fpts, fieldCols[Math.floor(r() * fieldCols.length)], { fringe: 1.5, seed: row * 50 + x, shadow: false });
            if (r() < 0.45) {
                // Furrows.
                ctx.save();
                path(ctx, fpts); ctx.clip();
                ctx.strokeStyle = rgba(C.ink, 0.1); ctx.lineWidth = 3;
                const ang = (r() - 0.5) * 0.6;
                for (let k = -20; k < 40; k++) { ctx.beginPath(); ctx.moveTo(x + k * 22, y - 20); ctx.lineTo(x + k * 22 + Math.tan(ang) * 300 + 120, y + 280); ctx.stroke(); }
                ctx.restore();
            }
            x += w;
        }
    }
    // Faint map grid over the land.
    ctx.save();
    ctx.strokeStyle = rgba(C.ink, 0.07);
    ctx.lineWidth = 2;
    for (let gx = -1400; gx < 5000; gx += 150) { ctx.beginPath(); ctx.moveTo(gx, 1040); ctx.lineTo(gx, 2300); ctx.stroke(); }
    ctx.restore();
    // The road from the bottom left to the door, with the years beside it.
    const roadPts = spline([[300, 2250], [700, 1900], [1100, 1820], [1400, 1560], [1700, 1450], [1850, 1250], [2050, 1150], [2045, 1092]], 22);
    road(ctx, roadPts, 1, 22, C.brick);
    [['2018', 760, 1880], ['2019', 1160, 1760], ['2020', 1460, 1530], ['2021', 1760, 1400], ['2026', 1920, 1215]].forEach(([y, x, yy], i) =>
        mapPoint(ctx, x + 60, yy - 10, move(T, s + 1.5 + i * 1.6, s + 2.3 + i * 1.6), y, 'dot'));
    // The house, its window lighting up.
    const lit = move(T, 183.33, 185.0, E.settle) * (0.92 + 0.08 * pulse(T, 3));
    const hs = house(ctx, 2000, 1095, 260, 200, { lit, seed: 61, windows: [[260 * 0.12, 200 * 0.22, 260 * 0.34, 200 * 0.34]], sky: [C.blueDeep, C.blue] });
    // Under the eave: two of us, the child and the cat.
    [[1840, 'tall'], [1890, 'adult'], [1932, 'child'], [1975, 'cat']].forEach(([x, kind], i) =>
        figure(ctx, x - 150, 1096, kind, move(T, 189.8 + i * 0.82, 189.8 + i * 0.82 + 0.8)));
    ctx.restore();
}

// =====================================================================

// The last frame of a section, kept as a picture so the next section can turn it over or push through it.
const snaps = new Map();
function snapshot(t) {
    const key = `${t.toFixed(3)}@${view.s}`;
    if (!snaps.has(key)) {
        const c = document.createElement('canvas');
        c.width = Math.round(W * view.s); c.height = Math.round(H * view.s);
        const o = c.getContext('2d');
        resetT(o);
        drawScene(o, t);
        snaps.set(key, c);
    }
    return snaps.get(key);
}
const find = (name, n) => SECTIONS.find((s) => s.name === name && (s.n || 1) === n);
// Pencil marks on the door frame: three in verse 2, two more and the last one in pre-chorus 2.
function markTimes() {
    const v = cues(find('verse', 2)), p = cues(find('pre', 2));
    return [v[6], v[6] + 0.45, v[6] + 0.9, p[0] + 0.35, p[0] + 0.95, p[1] + 0.1];
}

export function drawScene(ctx, T) {
    const sec = sectionAt(T);
    const n = sec.n || 1;
    const L = cues(sec);
    paperBase(ctx);
    if (T < 39.83) windowCat(ctx, T);
    else if (sec.name === 'pre' && n === 1) pre1(ctx, T, sec, L, snapshot);
    else if (sec.name === 'chorus') chorus(ctx, T, sec);
    else if (sec.name === 'verse') verse2(ctx, T, sec, L, { snapshot, marks: markTimes() });
    else if (sec.name === 'pre') pre2(ctx, T, sec, L, { verseL: cues(find('verse', 2)), marks: markTimes() });
    else if (sec.name === 'bridge') bridge(ctx, T, sec, L, { snapshot });
    else if (sec.name === 'outro') {
        outro(ctx, T);
        // In: the last chorus picture turns over like a page.
        const p = range(T, sec.from, sec.from + 0.8);
        if (p < 1) turnAway(ctx, snapshot(sec.from - 0.01), p);
    }
}

// The end: the picture gives way to a clean page, and only the title remains.
export function endCard(T) {
    return { fade: move(T, 204.2, 206.6, E.settle), title: range(T, 206.7, 208.5) };
}
