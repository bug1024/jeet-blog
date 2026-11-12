// Shot list: segments of the film in time order. Each segment draws itself and carries its own colour grade;
// where two overlap, the later one fades in over the earlier (a slow dissolve, never a flash).
import { W, H, range, E, resetT } from './core.js';
import { C, sectionAt } from './design.js';
import { paperBase, grade } from './gouache.js';
import { label } from './type.js';
import { prepare, release } from './shot.js';
import * as sewing from './scene-sewing.js';
import * as classroom from './scene-class.js';
import * as path from './scene-path.js';
import * as threshold from './scene-threshold.js';
import * as chorus from './scene-chorus.js';
import * as county from './scene-county.js';
import * as letter from './scene-letter.js';
import * as outro from './scene-outro.js';

const SEGS = [
    ...sewing.SEGMENTS, ...classroom.SEGMENTS, ...path.SEGMENTS, ...chorus.SEGMENTS, ...county.SEGMENTS, ...threshold.SEGMENTS, ...letter.SEGMENTS, ...outro.SEGMENTS,
].sort((a, b) => a.from - b.from);

let off = null;
function render(c, s, T) {
    resetT(c);
    c.globalAlpha = 1;
    c.globalCompositeOperation = 'source-over';
    s.draw(c, T);
    resetT(c);
    grade(c, W, H, typeof s.grade === 'function' ? s.grade(T) : s.grade || {});
}

export function drawScene(ctx, T) {
    const live = SEGS.filter((s) => T >= s.from && T < s.to);
    if (!live.length) {
        paperBase(ctx, C.paper);
        const sec = sectionAt(T);
        label(ctx, `${sec.name}${sec.n ? ' ' + sec.n : ''} · 未制作`, 96, 96);
        return;
    }
    render(ctx, live[0], T);
    for (let i = 1; i < live.length; i++) {
        const a = live[i - 1], b = live[i];
        if (!off) { off = document.createElement('canvas'); off.width = ctx.canvas.width; off.height = ctx.canvas.height; }
        const o = off.getContext('2d');
        render(o, b, T);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = E.inOut(range(T, b.from, Math.min(a.to, b.from + (b.fade || 1))));
        ctx.drawImage(off, 0, 0);
        ctx.restore();
    }
}

// A lyric keeps the place of the segment it started in, so it never jumps mid-line.
export function lyricPlace(l, T) {
    const t = l.t + 0.2;
    const live = SEGS.filter((s) => t >= s.from && t < s.to);
    const s = live[live.length - 1];
    return s && s.lyric ? s.lyric(l, T) : { x: 960, y: 1000, align: 'center' };
}

// Paint the cached layers of shots starting in the next few seconds, one layer per call, and let go of shots
// that are over, so memory stays small. Called once per frame by the players.
export function prefetch(T) {
    for (const s of SEGS) {
        if (!s.shot) continue;
        if (s.to < T - 1.5 && s.from < T) { if (!SEGS.some((o) => o.shot === s.shot && o.to >= T - 1.5 && o.from <= T + 6)) release(s.shot); continue; }
        if (s.from > T - 0.5 && s.from < T + 6) { if (!prepare(s.shot, 1)) return; }
    }
}
