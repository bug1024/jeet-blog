const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "../static/js/unaligned.js"), "utf8");
const template = fs.readFileSync(path.join(__dirname, "../layouts/works/unaligned.html"), "utf8");
const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/works/unaligned.json"), "utf8"));
const window = { document: { querySelector: () => null } };
vm.runInNewContext(source, { window, globalThis: window });
const { createModel, inkCells, batchSizes } = window.UnalignedModel;

// 1023 ink modules on the grid plus the one steel module make 1024.
const cells = inkCells(data);
assert.equal(cells.length, 1023);
assert.ok(cells.every(c => c.x % data.cell === 0 && c.y % data.cell === 0));
assert.notEqual(data.module.y % data.cell, 0, "the steel module must sit off the grid");

// The line the ending quotes really is in the source, with the same value as the data.
const line = "module.y = 37.5; // 不在网格上，是故意的。";
assert.ok(source.includes(line), "the quoted line must exist in unaligned.js");
assert.ok(template.includes(line), "the ending must quote the line exactly");
assert.equal(data.module.y, 37.5);

const sizes = batchSizes(1023, data.steps);
assert.equal(sizes.length, data.steps);
assert.equal(sizes.reduce((a, b) => a + b, 0), 1023);
assert.ok(Math.max(...sizes) - Math.min(...sizes) <= 1, "batches stay even");

const model = createModel(data);
assert.equal(model.total, 1024);
for (let k = 1; k <= data.steps; k++) {
    assert.ok(model.next() > 0);
    assert.equal(model.done, k === data.steps);
}
assert.equal(model.placed, 1023);
assert.equal(model.next(), 0, "nothing more is laid once the wordmark is complete");
model.reset();
assert.equal(model.placed, 0);
assert.equal(model.done, false);

vm.runInNewContext(source, { window: { document: { querySelector: () => null } } });
console.log("Unaligned: 1023 + 1 modules, quoted source line, 24 even batches, stop and reset passed.");
