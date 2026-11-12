// Character sheet: the family at every age the film needs, side by side at true relative height,
// plus walk and sit studies. Drawn by the same rig as the film.
import { C } from './design.js';
import { paperBase, wash, line, paint, shape, rectPts } from './gouache.js';
import { CAST, drawFigure, stand, gait, groundShadow } from './figure.js';
import { text, label } from './type.js';

export function sheet(ctx) {
    paperBase(ctx, C.paper);
    wash(ctx, 0, 0, 1920, 1080, [[0, '#F3EDE0'], [1, '#EAE0CC']], { tex: 0.25, mottle: 0.4 });
    text(ctx, '那道旧门槛 · 角色设定', 96, 104, { style: { size: 34, weight: 600, tracking: 0.18 } });
    label(ctx, '原创角色，参考家庭照片的衣着与体态，不还原本人相貌', 96, 146);

    const gy = 800, H = 540;
    const row = [
        ['fatherYoung', 210, 1, '白衬衫卷袖|高腰深色长裤'],
        ['fatherTeacher', 420, 1, '胸袋插一支笔'],
        ['fatherFuneral', 630, 1, '鬓角见白|深灰外套 黑纱'],
        ['fatherOld', 840, 1, '头发花白|开衫 背微驼'],
        ['brother', 1060, 1, '浅蓝衬衫|卡其裤卷边'],
        ['me', 1240, 1, '米白毛衣 藏青裤|帆布书包'],
        ['meAdult', 1430, 1, '深蓝外套'],
    ];
    const heights = { brother: 0.8, me: 0.72, meAdult: 0.97, fatherOld: 0.98 };
    line(ctx, [[96, gy + 2], [1560, gy + 2]], C.inkSoft, 1.5, { alpha: 0.35, amp: 0.5 });
    row.forEach(([key, x, f, note], i) => {
        const cast = CAST[key], h = H * (heights[key] || 1);
        const pose = stand(cast, h, x, gy, f, { arms: [{ a: 0.08, e: 0.15 }, { a: -0.04, e: 0.12 }] });
        groundShadow(ctx, pose, h, 0.18);
        drawFigure(ctx, cast, h, pose, 3 + i * 17);
        text(ctx, cast.label, x, gy + 64, { align: 'center', style: { size: 26, weight: 600, tracking: 0.1 } });
        note.split('|').forEach((t, k) => label(ctx, t, x, gy + 104 + k * 30, { align: 'center' }));
    });

    // Studies on the right: a walk cycle (me), and the father sitting low on a threshold.
    const sx = 1640;
    label(ctx, '步态 · 距离驱动，脚不打滑', sx - 110, 200);
    const ground = () => 520;
    for (let k = 0; k < 4; k++) {
        const s = 40 + k * 0.25 * 0.82 * 300;
        const pose = gait(CAST.me, 300, s, { x0: sx - 90 + k * 68 - s, f: 1, ground });
        drawFigure(ctx, CAST.me, 300, pose, 200 + k);
    }
    line(ctx, [[sx - 120, 522], [1880, 522]], C.inkSoft, 1.2, { alpha: 0.3, amp: 0.4 });
    label(ctx, '门槛上坐下 · 低头', sx - 110, 610);
    const h = 380, th = 860 - 0.15 * h;
    paint(ctx, shape(rectPts(sx + 40, th, 200, 0.15 * h), 5, 1, 3), C.woodDark, { tex: 0.5 });
    const sit = {
        x: sx + 70, y: th - 6, f: -1, lean: 0.62, neck: 0.5,
        legs: [{ ankle: [sx - 30, 860 - 0.04 * h], rot: 0 }, { ankle: [sx - 12, 860 - 0.04 * h], rot: 0 }],
        arms: [{ hand: [sx - 30, 860 - 0.3 * h], grip: 1 }, { hand: [sx - 18, 860 - 0.31 * h], grip: 1 }],
        eyes: 'down',
    };
    drawFigure(ctx, CAST.fatherFuneral, h, sit, 300);
}

function wrap(ctx, str, x, y, per) {
    for (let i = 0, k = 0; i < str.length; i += per, k++) {
        label(ctx, str.slice(i, i + per), x, y + k * 30, { align: 'center' });
    }
}

// Walk test: the father, the brother and me walking large across paper, the camera keeping pace, so the
// cycle itself can be judged. Lower half: the same three on a slope.
export function walkTest(ctx, t) {
    paperBase(ctx, C.paper);
    wash(ctx, 0, 0, 1920, 1080, [[0, '#F3EDE0'], [1, '#EAE0CC']], { tex: 0.25, mottle: 0.4 });
    const rows = [
        { y: 480, ground: () => 480, v: 1 },
        { y: 1000, ground: (x) => 1000 - (x - 960) * 0.18, v: 0.8 },
    ];
    for (const r of rows) {
        line(ctx, [[0, r.ground(0)], [1920, r.ground(1920)]], C.inkSoft, 1.5, { alpha: 0.35, amp: 0.5 });
        [['fatherTeacher', 360, 300, 0.75], ['brother', 290, 900, 0.85], ['me', 260, 1460, 0.9]].forEach(([key, h, x, v], i) => {
            const cast = CAST[key];
            const s = t * h * v * r.v;
            // Keep each walker in place by moving its start back as it advances.
            const pose = gait(cast, h, s, { x0: x - s, f: 1, ground: r.ground });
            drawFigure(ctx, cast, h, pose, 3 + i * 17);
        });
    }
}
