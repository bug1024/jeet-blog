const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "../static/js/unaligned.js"), "utf8");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/works/unaligned.json"), "utf8"));
const window = { document: { querySelector: () => null } };
vm.runInNewContext(source, { window, globalThis: window });
const { createModel, inkCells } = window.UnalignedModel;

// 1023 ink modules on the grid plus the one steel module make 1024.
const cells = inkCells(data);
assert.equal(cells.length, 1023);
assert.ok(cells.every(c => c.x % data.cell === 0 && c.y % data.cell === 0));
assert.notEqual(data.module.y % data.cell, 0, "the steel module must sit off the grid");

const model = createModel(data);
let previous = 0;
for (let k = 0; k <= data.corrections; k++) {
    const offset = model.restOffset(k);
    const distance = Math.hypot(offset.x, offset.y);
    assert.ok(distance > previous, "each correction leaves the module a little further from its slot");
    previous = distance;
}
const first = model.restOffset(0);
assert.equal(data.module.homeX + first.x, data.module.x);
assert.equal(data.module.homeY + first.y, data.module.y);

for (let k = 1; k < data.corrections; k++) {
    assert.equal(model.correct(), true);
    assert.equal(model.done, false);
}
assert.equal(model.correct(), true);
assert.equal(model.done, true);
assert.equal(model.count, data.corrections);
assert.equal(model.correct(), false, "once accepted, the system stops correcting");
model.reset();
assert.equal(model.count, 0);
assert.equal(model.done, false);

vm.runInNewContext(source, { window: { document: { querySelector: () => null } } });
console.log("Unaligned: 1023 + 1 modules, growing offset, 24 corrections, stop and reset passed.");
