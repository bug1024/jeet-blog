// Type: LRC parsing, lyrics placed by each shot, the title. Lyrics are timed by data/lyrics.lrc only.
import { clamp, range, E, rgba } from './core.js';
import { C, FONT, TYPE, TITLE } from './design.js';

export async function loadFonts() {
    await Promise.all(FONT.files.map(([family, url, weight]) =>
        new FontFace(family, `url(${url})`, { weight }).load().then((f) => document.fonts.add(f)).catch(() => {})));
}

// [mm:ss.xx] lines. A line ends when the next begins, or after its sung length for the last ones.
export function parseLRC(text, songEnd) {
    const lines = text.split(/\r?\n/).map((l) => l.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/)).filter(Boolean)
        .map((m) => ({ t: +m[1] * 60 + +m[2], text: m[3].trim() }));
    lines.forEach((l, i) => {
        const next = lines[i + 1] ? lines[i + 1].t : null;
        // A line has fully gone before the next one starts to appear, so two lines never sit on top of each other.
        // The last holds for its sung length, not to the end of the song.
        l.end = next != null ? Math.min(next - 0.4, l.t + 7) : Math.min(songEnd ?? l.t + 4.2, l.t + 4.2);
    });
    return lines;
}

const font = (s) => `${s.weight} ${s.size}px ${s.family ? FONT[s.family] : FONT.family}`;

function tracked(ctx, text, s) {
    ctx.font = font(s);
    let w = 0;
    for (const ch of text) w += ch === ' ' ? s.size * 0.5 : ctx.measureText(ch).width + s.size * s.tracking;
    return w - s.size * s.tracking;
}
function drawTracked(ctx, text, x, y, s, fill = true) {
    ctx.font = font(s);
    for (const ch of text) {
        if (ch === ' ') { x += s.size * 0.5; continue; }
        if (fill) ctx.fillText(ch, x, y); else ctx.strokeText(ch, x, y);
        x += ctx.measureText(ch).width + s.size * s.tracking;
    }
}

// One line of text. No outline: on a light picture it is dark warm grey; on a dark one, warm white. A faint soft
// shadow in the background tone keeps it readable over busy brushwork.
export function text(ctx, str, x, y, o = {}) {
    const s = { ...TYPE.lyric, ...(o.style || {}) };
    const color = o.color || TYPE.ink;
    const halo = o.halo || C.paper;
    const w = tracked(ctx, str, s);
    const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.textBaseline = 'alphabetic';
    if (o.shadow !== false) {
        ctx.shadowColor = rgba(halo, 0.55);
        ctx.shadowBlur = s.size * 0.35;
    }
    ctx.fillStyle = color;
    drawTracked(ctx, str, x0, y, s, true);
    ctx.restore();
    return w;
}

// The current lyric at the place the shot gives it. place(line, T) -> { x, y, align, color, halo } | null
export function lyrics(ctx, T, LYRICS, place) {
    for (const l of LYRICS) {
        if (T < l.t - 0.1 || T > l.end + TYPE.fadeOut) continue;
        const a = E.inOut(range(T, l.t - 0.05, l.t + TYPE.fadeIn)) * (1 - E.inOut(range(T, l.end, l.end + TYPE.fadeOut)));
        if (a <= 0) continue;
        const p = place(l, T) || { x: 960, y: 1000, align: 'center' };
        text(ctx, l.text, p.x, p.y, { align: p.align || 'left', alpha: a, color: p.color, halo: p.halo });
    }
}

export function title(ctx, x, y, alpha = 1, color = C.ink) {
    if (alpha <= 0) return;
    text(ctx, TITLE, x, y, { align: 'center', alpha, color, style: { ...TYPE.title, family: null } });
}

export function label(ctx, str, x, y, o = {}) {
    text(ctx, str, x, y, { ...o, style: { ...TYPE.label, family: null }, color: o.color || C.inkSoft });
}
