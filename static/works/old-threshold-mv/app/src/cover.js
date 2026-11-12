// Cover and poster: the four of us coming out of the covered bridge, me in front, my sister just behind me,
// then my brother, then him, just clear of the bridge's mouth; with the title.
// Drawn at 1920 x 1080, then cropped to the shape asked for.
import { W, H } from './core.js';
import { CAST, drawFigure, gait, groundShadow } from './figure.js';
import { drawLand, ground } from './land.js';
import { finish, grade } from './gouache.js';
import { title } from './type.js';

function picture(c, shift = 0) {
    const x = 2700;
    drawLand(c, 61, { cx: 2560 - shift, cy: ground(2560) - 120, z: 1.6 }, (cc) => {
        for (const [cast, h, xx, seed, look] of [[CAST.fatherTeacher, 125, x - 200, 37, 0.08], [CAST.brother, 98, x - 134, 23, 0.06], [CAST.sister, 108, x - 68, 29, 0.04], [CAST.me, 88, x, 11, 0.0]]) {
            const p = gait(cast, h, xx, { x0: 0, f: 1, ground, look });
            groundShadow(cc, p, h, 0.18);
            drawFigure(cc, cast, h, p, seed);
        }
    }, 0.3);
    grade(c, W, H, { warm: 0.12 });
}

// shift (world px) moves the walkers right of centre, so a player's play button does not land on them.
export function cover(w, h, withTitle = true, shift = 0) {
    const full = document.createElement('canvas');
    full.width = W; full.height = H;
    const f = full.getContext('2d');
    picture(f, shift);
    finish(f, W, H);
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const o = out.getContext('2d');
    // Crop the 1920 x 1080 picture to w:h around the walkers and the bridge's end.
    const ar = w / h, ch = H, cw = Math.min(W, ch * ar);
    const cx = Math.min(W - cw, Math.max(0, 1060 - cw / 2));
    o.drawImage(full, cx, 0, cw, ch, 0, 0, w, h);
    if (withTitle) {
        const s = h / H;
        o.save();
        o.scale(s, s);
        title(o, (w / s) / 2, 190, 1);
        o.restore();
    }
    return out.toDataURL('image/png');
}
