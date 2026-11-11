// Typography: the title mark, lyrics (horizontal and vertical), and small map labels.
// Lyrics are timed by data/lyrics.lrc only; animation timing never moves them.
import { W, H, clamp, range, E, rgba } from './core.js';
import { C, FONT, TYPE, TITLE, LYRIC_LAYOUT, sectionAt } from './design.js';

export async function loadFonts() {
    await Promise.all(FONT.files.map(([url, weight]) =>
        new FontFace('MV Serif', `url(${url})`, { weight }).load().then((f) => document.fonts.add(f)).catch(() => {})));
}

export function parseLRC(text) {
    const lines = text.split(/\r?\n/).map((l) => l.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/)).filter(Boolean)
        .map((m) => ({ t: +m[1] * 60 + +m[2], text: m[3].trim() }));
    lines.forEach((l, i) => {
        const next = lines[i + 1] ? lines[i + 1].t : l.t + 4.5;
        l.end = Math.min(next, l.t + 6);
        l.section = sectionAt(l.t + 0.01);
    });
    return lines;
}

const font = (s) => `${s.weight} ${s.size}px ${FONT.family}`;

// Width of a run of text with tracking (letter spacing as a fraction of the size).
function trackedWidth(ctx, text, s) {
    ctx.font = font(s);
    let w = 0;
    for (const ch of text) w += ch === ' ' ? s.size * 0.6 : ctx.measureText(ch).width + s.size * s.tracking;
    return w - s.size * s.tracking;
}
function drawTracked(ctx, text, x, y, s) {
    ctx.font = font(s);
    for (const ch of text) {
        if (ch === ' ') { x += s.size * 0.6; continue; }
        ctx.fillText(ch, x, y);
        x += ctx.measureText(ch).width + s.size * s.tracking;
    }
}

// Horizontal line revealed by a soft mask moving left to right.
export function lineH(ctx, text, x, y, s, reveal = 1, alpha = 1, align = 'left', color = s.color) {
    const w = trackedWidth(ctx, text, s);
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = color;
    if (reveal < 1) {
        const edge = x0 + (w + 60) * reveal;
        const g = ctx.createLinearGradient(edge - 60, 0, edge, 0);
        g.addColorStop(0, color);
        g.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.rect(x0 - 10, y - s.size * 1.2, edge - x0 + 10, s.size * 1.6);
        ctx.clip();
    }
    drawTracked(ctx, text, x0, y, s);
    ctx.restore();
    return w;
}

// Vertical line (top to bottom), revealed downward.
export function lineV(ctx, text, x, y, s, reveal = 1, alpha = 1, color = s.color) {
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.font = font(s);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const step = s.size * (1 + s.tracking);
    const chars = [...text];
    const total = chars.reduce((h, ch) => h + (ch === ' ' ? s.size * 0.7 : step), 0);
    const edge = y + (total + 60) * reveal;
    if (reveal < 1) {
        const g = ctx.createLinearGradient(0, edge - 60, 0, edge);
        g.addColorStop(0, color);
        g.addColorStop(1, rgba(color, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.rect(x - s.size, y - 10, s.size * 2, edge - y + 10);
        ctx.clip();
    } else ctx.fillStyle = color;
    let yy = y;
    for (const ch of chars) {
        if (ch === ' ') { yy += s.size * 0.7; continue; }
        ctx.fillText(ch, x, yy);
        yy += step;
    }
    ctx.restore();
}

// The title mark: same everywhere it appears. Chinese only. p: 0..1 build (rules draw out, then the title wipes in).
export function logo(ctx, x, y, p = 1, alpha = 1, color = C.ink) {
    if (p <= 0 || alpha <= 0) return;
    const s = TYPE.logo;
    const w = trackedWidth(ctx, TITLE, s);
    const ruleP = E.page(range(p, 0, 0.45)), textP = E.slide(range(p, 0.15, 0.8));
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    const gap = 48, len = 120 * ruleP;
    const cy = y - s.size * 0.36;
    ctx.beginPath();
    ctx.moveTo(x - w / 2 - gap, cy); ctx.lineTo(x - w / 2 - gap - len, cy);
    ctx.moveTo(x + w / 2 + gap, cy); ctx.lineTo(x + w / 2 + gap + len, cy);
    ctx.stroke();
    lineH(ctx, TITLE, x, y, { ...s, color }, textP, 1, 'center', color);
    ctx.restore();
}

export function label(ctx, text, x, y, alpha = 1, align = 'left', color = TYPE.label.color) {
    lineH(ctx, text, x, y, { ...TYPE.label, color }, 1, alpha, align, color);
}

// Draw whichever lyric is current. Logo lines become the title mark in its fixed place.
export function lyrics(ctx, T, LYRICS, opts = {}) {
    for (const l of LYRICS) {
        if (T < l.t - 0.05 || T > l.end + TYPE.exit) continue;
        const sec = l.section.name;
        const layout = LYRIC_LAYOUT[sec] || LYRIC_LAYOUT.verse;
        const reveal = E.slide(range(T, l.t, l.t + TYPE.reveal));
        const out = 1 - E.settle(range(T, l.end, l.end + TYPE.exit));
        const color = opts.color ? opts.color(l, T) : TYPE[layout.style].color;
        if (l.text === TITLE) {
            if (opts.logo !== false) logo(ctx, LYRIC_LAYOUT.logo.x, LYRIC_LAYOUT.logo.y, range(T, l.t, l.t + 1.4), out, opts.logoColor || C.ink);
            continue;
        }
        const s = { ...TYPE[layout.style], color };
        if (layout.mode === 'v') {
            lineV(ctx, l.text, layout.x, layout.y, s, reveal, out, color);
        } else {
            if (layout.rule) {
                // A short rule above the line, drawn as it appears: the editorial mark of a verse.
                ctx.save();
                ctx.globalAlpha *= out;
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(layout.x, layout.y - s.size * 1.6);
                ctx.lineTo(layout.x + 44 * reveal, layout.y - s.size * 1.6);
                ctx.stroke();
                ctx.restore();
            }
            lineH(ctx, l.text, layout.x, layout.y, s, reveal, out, layout.align, color);
        }
    }
}
