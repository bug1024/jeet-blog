const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

let now = 0;
let id = 0;
const frames = new Map();
const timers = new Map();
const context = {
  document: { hidden: false, querySelectorAll: () => [] },
  performance: { now: () => now },
  requestAnimationFrame: fn => { frames.set(++id, fn); return id; },
  cancelAnimationFrame: key => frames.delete(key),
  setTimeout: fn => { timers.set(++id, fn); return id; },
  clearTimeout: key => timers.delete(key),
  Math,
};
vm.createContext(context);
const code = fs.readFileSync('static/js/yaya-portrait.js', 'utf8');
vm.runInContext(`${code}\nglobalThis.Portrait = YayaPortrait;`, context);
const cat = Object.create(context.Portrait.prototype);
Object.assign(cat, {
  ready: true, visible: true, motion: { matches: false }, near: false,
  amplitude: 0, phase: 0, blinkStart: null, frame: null, timer: null,
  last: null, draw: closure => { cat.lastClosure = closure; },
});
function advance(ms) {
  const end = now + ms;
  while (now < end) {
    now += 1000 / 60;
    const queued = [...frames.values()];
    frames.clear();
    queued.forEach(fn => fn(now));
  }
}

cat.setNear(true);
advance(350);
assert(cat.amplitude > 0.7, 'pointer approach smoothly starts tail motion');
cat.setNear(false);
advance(1600);
assert.equal(cat.amplitude, 0, 'tail settles to its exact original position');
assert.equal(cat.frame, null, 'idle portrait does not keep rendering');

cat.blink();
advance(125);
assert(cat.lastClosure > 0.95, 'both eyes reach the closed phase');
advance(200);
assert.equal(cat.blinkStart, null, 'blink completes');
assert.equal(cat.lastClosure, 0, 'eyes return to original frame');
assert(timers.has(cat.timer), 'next blink is scheduled after completing this one');

cat.setNear(true);
advance(50);
cat.motion.matches = true;
cat.sync();
assert.equal(cat.frame, null, 'reduced motion cancels animation');
assert.equal(cat.timer, null, 'reduced motion cancels blink timer');
assert.equal(cat.lastClosure, 0, 'reduced motion displays the original image');
cat.motion.matches = false;
cat.visible = false;
cat.sync();
assert.equal(cat.enabled, false, 'offscreen portrait stays inactive');
cat.visible = true;
context.document.hidden = true;
cat.sync();
assert.equal(cat.enabled, false, 'background tab stays inactive');
console.log('OK: tail approach/settle, blink, idle, reduced motion and visibility');
