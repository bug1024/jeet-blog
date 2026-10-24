// Redraws the about-page laptop and diary in the home Yaya's ink style and keeps the kitten pixels as they are.
// Writes <out>/yaya-mac-kitten.png (same 1536x1024 frame, so the blink coordinates stay valid) and <out>/about-diary.png.
// Safe to re-run on its own output: only the kitten (above the lid and its light chin and whiskers) is carried over.
//
// Usage: PW=$(npm root -g)/playwright node scripts/gen_about_scene.mjs static/images/illustrations \
//            static/images/illustrations/yaya-mac-kitten.png
import { createRequire } from 'node:module';
import { writeFileSync, readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PW);
const out = process.argv[2];
const oldKitten = 'data:image/png;base64,' + readFileSync(process.argv[3]).toString('base64');

const INK = '#18191a', PAPER = '#f6f2ea', SHELL = '#e3dfd7', SHELL_DARK = '#cfcac0', BEZEL = '#3b3e41', SCREEN = '#222528', SCREEN_LINE = '#4a4f53';
const lerp = (a, b, t) => a + (b - a) * t;

// Laptop: lid top edge and side extents match the old drawing so the kitten still rests on it.
function laptop() {
  const lid = { x0: 312, x1: 1225, y0: 316, y1: 792 };
  const top = { x0: 300, x1: 1238, y: 800 }, bottom = { x0: 200, x1: 1337, y: 978 }, lip = 985;
  const edgeX = (side, y) => {
    const t = (y - top.y) / (bottom.y - top.y);
    return side === 'l' ? lerp(top.x0, bottom.x0, t) : lerp(top.x1, bottom.x1, t);
  };
  const parts = [];
  // Lid: dark ink bezel, a quiet screen with a few text lines and one cursor block.
  parts.push(`<rect x="${lid.x0}" y="${lid.y0}" width="${lid.x1 - lid.x0}" height="${lid.y1 - lid.y0}" rx="24" fill="${BEZEL}" stroke="${INK}" stroke-width="6"/>`);
  parts.push(`<rect x="${lid.x0 + 34}" y="${lid.y0 + 44}" width="${lid.x1 - lid.x0 - 68}" height="${lid.y1 - lid.y0 - 78}" rx="6" fill="${SCREEN}"/>`);
  parts.push(`<circle cx="${(lid.x0 + lid.x1) / 2 + 160}" cy="${lid.y0 + 22}" r="5" fill="#3d4144"/>`);
  [[0, 250], [1, 170], [2, 470], [3, 360], [4, 560], [6, 90], [7, 210], [8, 380], [9, 300]].forEach(([row, w]) => {
    parts.push(`<rect x="${lid.x0 + 70}" y="${lid.y0 + 92 + row * 34}" width="${w}" height="12" rx="3" fill="${SCREEN_LINE}"/>`);
  });
  parts.push(`<rect x="${lid.x0 + 70}" y="${lid.y0 + 92 + 10 * 34}" width="12" height="22" fill="#8c9296"/>`);
  // Hinge.
  parts.push(`<path d="M${lid.x0 + 40} ${lid.y1} L${lid.x1 - 40} ${lid.y1} L${lid.x1 - 50} ${top.y + 2} L${lid.x0 + 50} ${top.y + 2} Z" fill="#3a3c3e" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
  // Base: a light shell seen from slightly above, outlined in ink like the cat.
  parts.push(`<path d="M${top.x0} ${top.y} L${top.x1} ${top.y} L${bottom.x1} ${bottom.y} Q${bottom.x1 + 4} ${lip} ${bottom.x1 - 14} ${lip} L${bottom.x0 + 14} ${lip} Q${bottom.x0 - 4} ${lip} ${bottom.x0} ${bottom.y} Z" fill="${SHELL}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`);
  parts.push(`<path d="M${bottom.x0 + 6} ${bottom.y} L${bottom.x1 - 6} ${bottom.y}" stroke="${INK}" stroke-width="3"/>`);
  parts.push(`<path d="M${(bottom.x0 + bottom.x1) / 2 - 90} ${lip - 3} L${(bottom.x0 + bottom.x1) / 2 + 90} ${lip - 3}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`);
  // Keyboard: rows of keys in perspective, outlined, no shading.
  const kTop = top.y + 16, kBottom = top.y + 104, rows = 5;
  for (let r = 0; r < rows; r++) {
    const y0 = lerp(kTop, kBottom, r / rows) + 2, y1 = lerp(kTop, kBottom, (r + 1) / rows) - 2;
    const lx0 = edgeX('l', y0) + 70, rx0 = edgeX('r', y0) - 70, lx1 = edgeX('l', y1) + 70, rx1 = edgeX('r', y1) - 70;
    const keys = r === rows - 1 ? [1, 1, 1, 1.4, 6, 1.4, 1, 1, 1] : r === 0 ? Array(14).fill(1) : [1.5].concat(Array(11).fill(1), [1.6]);
    const total = keys.reduce((a, b) => a + b, 0);
    let acc = 0;
    keys.forEach(k => {
      const a = acc / total, b = (acc + k) / total, g = .006;
      const p = [[lerp(lx0, rx0, a + g), y0], [lerp(lx0, rx0, b - g), y0], [lerp(lx1, rx1, b - g), y1], [lerp(lx1, rx1, a + g), y1]];
      parts.push(`<path d="M${p.map(q => q.map(v => v.toFixed(1)).join(' ')).join(' L')} Z" fill="${PAPER}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`);
      acc += k;
    });
  }
  // Trackpad.
  const tpY0 = top.y + 118, tpY1 = bottom.y - 14, cx = (top.x0 + top.x1) / 2;
  const w0 = 150, w1 = 168;
  parts.push(`<path d="M${cx - w0} ${tpY0} L${cx + w0} ${tpY0} L${cx + w1} ${tpY1} L${cx - w1} ${tpY1} Z" fill="${SHELL_DARK}" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`);
  // A few fine strokes on the front edge, the way the cat's fur is suggested rather than rendered.
  for (let i = 0; i < 7; i++) {
    const x = lerp(bottom.x0 + 60, bottom.x0 + 220, i / 6);
    parts.push(`<path d="M${x} ${bottom.y + 2} L${x + 18} ${lip - 2}" stroke="${INK}" stroke-opacity=".35" stroke-width="1.6"/>`);
  }
  return parts.join('');
}

// Diary: a closed notebook lying flat, seen from the same height as the laptop: cover boards, an inset page block,
// a rounded spine and an elastic band. No title, no ribbon.
function diary() {
  const W = 640, H = 214;
  const back = 58, top = 136, boardTop = 146, pagesBottom = 184, bottom = 196;
  const fl = 22, fr = 618, bl = 74, br = 598, band = 0.86;
  const p = [];
  const cover = '#2c2d2f';
  // Cover top, with the band crossing it in perspective.
  p.push(`<path d="M${bl} ${back} L${br} ${back} L${fr} ${top} L${fl} ${top} Z" fill="${cover}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`);
  const bx = (a, b) => [a + (b - a) * band];
  p.push(`<path d="M${bl + (br - bl) * band - 7} ${back} L${bl + (br - bl) * band + 7} ${back} L${fl + (fr - fl) * band + 9} ${top} L${fl + (fr - fl) * band - 9} ${top} Z" fill="#141516"/>`);
  // Front face: top board, inset pages, bottom board.
  p.push(`<path d="M${fl} ${top} L${fr} ${top} L${fr} ${boardTop} L${fl} ${boardTop} Z" fill="${cover}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
  p.push(`<rect x="${fl + 30}" y="${boardTop}" width="${fr - fl - 40}" height="${pagesBottom - boardTop}" fill="${PAPER}" stroke="${INK}" stroke-width="2.6"/>`);
  for (let i = 1; i < 6; i++) {
    const y = boardTop + (pagesBottom - boardTop) * i / 6;
    p.push(`<path d="M${fl + 36} ${y.toFixed(1)} L${fr - 14} ${y.toFixed(1)}" stroke="${INK}" stroke-opacity=".25" stroke-width="1.3"/>`);
  }
  p.push(`<path d="M${fl} ${pagesBottom} L${fr} ${pagesBottom} L${fr} ${bottom} L${fl} ${bottom} Z" fill="${cover}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
  // Rounded spine on the left, spanning both boards.
  p.push(`<path d="M${fl + 30} ${top} L${fl + 4} ${top} Q${fl - 14} ${(top + bottom) / 2} ${fl + 4} ${bottom} L${fl + 30} ${bottom} Z" fill="${cover}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
  // The band runs down the front face.
  p.push(`<rect x="${fl + (fr - fl) * band - 9}" y="${top - 1}" width="18" height="${bottom - top + 2}" fill="#141516"/>`);
  return { W, H, svg: p.join('') };
}

const browser = await chromium.launch();
const page = await browser.newPage();
const result = await page.evaluate(async ({ laptopSvg, diarySvg, oldKitten }) => {
  const toImage = async (svg, w, h) => {
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>`);
    await img.decode();
    return img;
  };
  // Kitten layer: everything above the lid, plus the light chin and whiskers that hang over its top edge.
  const old = new Image(); old.src = oldKitten; await old.decode();
  const W = old.naturalWidth, H = old.naturalHeight;
  const oc = document.createElement('canvas'); oc.width = W; oc.height = H;
  const ox = oc.getContext('2d'); ox.drawImage(old, 0, 0);
  const od = ox.getImageData(0, 0, W, H), d = od.data;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
    const keep = y < 312 || (y < 380 && x > 360 && x < 700 && lum > 150);
    if (!keep) d[i + 3] = 0;
  }
  ox.putImageData(od, 0, 0);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.drawImage(await toImage(laptopSvg, W, H), 0, 0);
  x.drawImage(oc, 0, 0);
  const dc = document.createElement('canvas'); dc.width = diarySvg.W; dc.height = diarySvg.H;
  dc.getContext('2d').drawImage(await toImage(diarySvg.svg, diarySvg.W, diarySvg.H), 0, 0);
  return { kitten: c.toDataURL('image/png'), diary: dc.toDataURL('image/png') };
}, { laptopSvg: laptop(), diarySvg: diary(), oldKitten });
writeFileSync(`${out}/yaya-mac-kitten.png`, Buffer.from(result.kitten.split(',')[1], 'base64'));
writeFileSync(`${out}/about-diary.png`, Buffer.from(result.diary.split(',')[1], 'base64'));
console.log('wrote', out);
await browser.close();
