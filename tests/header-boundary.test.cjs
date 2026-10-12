const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "../static/js/header-boundary.js"), "utf8");
const listeners = new Map();
let visible;
const window = {
    scrollY: 0,
    addEventListener(type, callback, options) {
        listeners.set(type, callback);
        if (type === "scroll") assert.equal(options.passive, true);
    },
};
const header = {
    classList: { toggle(name, state) {
        assert.equal(name, "is-scrolled");
        visible = state;
    } },
};
vm.runInNewContext(source, { window, document: { querySelector: () => header } });
assert.equal(visible, false);
window.scrollY = 16;
listeners.get("scroll")();
assert.equal(visible, false);
window.scrollY = 100;
listeners.get("scroll")();
assert.equal(visible, true);
window.scrollY = 0;
listeners.get("scroll")();
assert.equal(visible, false);
window.scrollY = 400;
listeners.get("pageshow")();
assert.equal(visible, true);
vm.runInNewContext(source, { document: { querySelector: () => null } });
console.log("Header boundary: top, scroll, restored position and missing header passed.");
