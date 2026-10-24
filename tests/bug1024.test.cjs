const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "../static/js/bug1024.js"), "utf8");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/works/bug1024.json"), "utf8"));
const window = { document: { querySelector: () => null } };
vm.runInNewContext(source, { window, globalThis: window });
const { buildScene, binaryLayout, binaryText, zerosAt, score, timing } = window.Bug1024;

// Everything is cut from the wordmark's 1023 cells; the steel module makes 1024.
const scene = buildScene(data);
const total = scene.B.length + scene.U.length + scene.C.length + scene.completion.length + scene.number.length;
assert.equal(total, 1023);
assert.ok(scene.completion.length > 0 && scene.C.length > 0, "G splits into a C and the cells that complete it");
assert.ok(scene.one.length > 0 && scene.zero.length > 0);
// Before the bug: 8 and 0 share cells with B and U but are different shapes.
assert.ok(scene.eight.length > 0 && scene.zeroLetter.length > 0);
const keys = list => new Set(list.map(c => c.gx + "," + c.gy));
assert.notDeepEqual(keys(scene.eight), keys(scene.B));
assert.notDeepEqual(keys(scene.zeroLetter), keys(scene.U));

// A beat is 2^8 ms, a bar 2^10 ms, the piece ten bars.
assert.equal(timing.BEAT * 1000, 2 ** 8);
assert.equal(timing.BAR * 1000, 2 ** 10);
assert.equal(timing.END, 10.24);
assert.equal(Math.round(timing.END / timing.BAR), 10);

// Ten left shifts of binary 1 give 2^10, and the last shift happens before the bug lands.
assert.equal(zerosAt(0), 0);
assert.equal(zerosAt(timing.SHIFT_START), 1);
assert.equal(zerosAt(timing.LAND - 0.001), timing.SHIFTS);
assert.equal(parseInt(binaryText(timing.SHIFTS), 2), 1024);
assert.ok(timing.SHIFT_START + (timing.SHIFTS - 1) * timing.SHIFT_EVERY < timing.LAND);

// The eleven-digit number always fits in the space 1024 will take.
const full = binaryLayout(scene, data, timing.SHIFTS);
const right = Math.max(...full.cells.map(c => c.x + c.size));
assert.ok(right <= (data.glyphs.four[1] + 1) * data.cell + 1e-6);
assert.ok(full.scale < 1);
assert.equal(binaryLayout(scene, data, 0).scale, 1);

// After landing, G, U and B change one beat apart, then the number folds over the last bar.
assert.ok(timing.LAND < timing.G_AT && timing.G_AT < timing.U_AT && timing.U_AT < timing.B_AT && timing.B_AT < timing.FOLD);
[timing.G_AT, timing.U_AT, timing.B_AT, timing.FOLD].forEach(t => assert.equal(Math.round(t * 1000) % 256, 0, "changes land on beats"));
assert.equal(Math.round((timing.END - timing.FOLD) * 1000), 2 ** 10);

// Every note sits inside the piece, and the last one starts exactly on 10.24 s.
const notes = score();
assert.ok(notes.every(n => n.t >= 0 && n.t <= timing.END));
assert.equal(Math.max(...notes.map(n => n.t)), timing.END);
assert.equal(notes.filter(n => n.t === timing.END).length >= 1, true);

vm.runInNewContext(source, { window: { document: { querySelector: () => null } } });
console.log("Bug1024: 1023 + 1 cells, 2^8/2^10 timing, ten shifts to 1024, fits, last note on 10.24 s passed.");
