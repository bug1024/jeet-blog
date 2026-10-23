/* W-007 不归位. A real correction loop: the grid drifts, every input corrects it, one module never returns. */
(function (global) {
    'use strict';

    // Pure rules, shared with tests: how far the module rests from its slot after k corrections.
    function createModel(data) {
        var module = data.module;
        var base = {x: module.x - module.homeX, y: module.y - module.homeY};
        var model = {
            corrections: data.corrections,
            count: 0,
            done: false,
            restOffset: function (k) {
                var grow = 1 + .06 * k;
                return {x: base.x * grow, y: base.y * grow};
            },
            correct: function () {
                if (model.done) return false;
                model.count += 1;
                if (model.count >= model.corrections) model.done = true;
                return true;
            },
            reset: function () {model.count = 0;model.done = false;}
        };
        return model;
    }
    function inkCells(data) {
        var cells = [];
        data.grid.forEach((row, gy) => {
            for (var gx = 0; gx < row.length; gx++) if (row[gx] === '#') cells.push({x: gx * data.cell, y: gy * data.cell});
        });
        return cells;
    }
    global.UnalignedModel = {createModel: createModel, inkCells: inkCells};

    var doc = global.document;
    var root = doc && doc.querySelector('[data-unaligned]');
    if (!root) return;
    var data = JSON.parse(doc.getElementById('unaligned-data').textContent);
    var stage = root.querySelector('[data-unaligned-stage]');
    var canvas = root.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var countText = root.querySelector('[data-unaligned-count]');
    var hint = root.querySelector('[data-unaligned-hint]');
    var ending = root.querySelector('[data-unaligned-ending]');
    var resetButton = root.querySelector('[data-unaligned-reset]');
    var reduceQuery = global.matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = reduceQuery.matches;

    var model = createModel(data);
    var cells = inkCells(data);
    var M = data.module, CELL = data.cell;
    var PAD = {x: 8, y: 6};
    var W = 0, H = 0, scale = 1;
    var colors = {};
    var start = performance.now();

    // Per-cell drift: amplitude grows with time since that cell was last corrected.
    var phase = cells.map((c, i) => [Math.sin(i * 12.9898) * 43758.5453 % 6.283, Math.cos(i * 78.233) * 12345.678 % 6.283,
        .0011 + (i * 7 % 13) / 13 * .0012, .0009 + (i * 11 % 17) / 17 * .0013]);
    var settledAt = cells.map(() => 0), resetAt = cells.map(() => -1), ampAtReset = cells.map(() => 0);
    var SNAP = 220, CALM = 1800;

    var modulePos = {x: M.x, y: M.y};
    var moduleAnim = null;
    var finale = null; // {t0}

    function ease(t) {t = Math.min(1, Math.max(0, t));return t * t * (3 - 2 * t);}
    function easeOut(t) {t = Math.min(1, Math.max(0, t));return 1 - Math.pow(1 - t, 3);}
    function orderliness() {return model.count / model.corrections;}
    function growth(elapsed) {
        // The system decays a little slower each time it has been corrected.
        var rate = .00045 * (1 - .55 * orderliness()), cap = 1.25 * (1 - .6 * orderliness());
        return Math.min(cap, Math.max(0, elapsed) * rate);
    }
    function amplitude(i, now) {
        if (finale) return 0;
        if (reduced) return 0;
        var r = resetAt[i];
        if (r >= 0 && now >= r) {
            if (now < r + SNAP) return ampAtReset[i] * (1 - easeOut((now - r) / SNAP));
            settledAt[i] = r + SNAP;resetAt[i] = -1;
        }
        return growth(now - settledAt[i]);
    }
    function readColors() {
        var style = getComputedStyle(doc.documentElement);
        var pick = (name, fallback) => (style.getPropertyValue(name) || '').trim() || fallback;
        colors = {ink: pick('--brand-ink', '#111a21'), paper: pick('--brand-paper', '#f8faf9'),
            steel: pick('--brand-steel', '#365b6d'), line: pick('--brand-slate', '#71838c')};
    }
    function toPx(x, y) {return [(x + PAD.x) * scale, (y + PAD.y) * scale];}

    function correct(originX, originY) {
        if (!model.correct()) return;
        var now = performance.now();
        if (hint) hint.hidden = true;
        countText.textContent = '校正 ' + model.count + ' / ' + model.corrections;
        // The correction travels outward from where it was asked for.
        var speed = .32 + .02 * model.count;
        cells.forEach((c, i) => {
            var delay = reduced ? 0 : Math.hypot(c.x + CELL / 2 - originX, c.y + CELL / 2 - originY) / speed;
            var at = now + delay;
            ampAtReset[i] = growth(at - settledAt[i]);
            resetAt[i] = at;
        });
        var previous = model.restOffset(model.count - 1), next = model.restOffset(model.count);
        var home = {x: M.homeX, y: M.homeY};
        var near = {x: home.x + previous.x * .12, y: home.y + previous.y * .12};
        var rest = {x: home.x + next.x, y: home.y + next.y};
        if (reduced) {
            modulePos = model.done ? {x: M.x, y: M.y} : rest;
            if (model.done) finish(now);
            requestDraw();
            return;
        }
        var delay = Math.hypot(modulePos.x + M.w / 2 - originX, modulePos.y + M.h / 2 - originY) / speed;
        moduleAnim = {t0: now + delay, from: {x: modulePos.x, y: modulePos.y}, near: near, rest: rest, last: model.done};
        requestDraw();
    }
    function animateModule(now) {
        var a = moduleAnim;
        if (!a || now < a.t0) return;
        var t = now - a.t0, PULL = 420, HOLD = 170, BACK = 950;
        var lerp = (p, q, k) => ({x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k});
        // Pulled almost into its slot, it stops short and drifts back a little further than before.
        if (t < PULL) modulePos = lerp(a.from, a.near, easeOut(t / PULL));
        else if (t < PULL + HOLD) modulePos = a.near;
        else if (t < PULL + HOLD + BACK) modulePos = lerp(a.near, a.rest, ease((t - PULL - HOLD) / BACK));
        else {
            modulePos = a.rest;moduleAnim = null;
            if (a.last) finish(now + 250);
        }
    }
    function finish(at) {
        finale = {t0: at, from: {x: modulePos.x, y: modulePos.y}};
        countText.textContent = '校正 ' + model.corrections + ' / ' + model.corrections + ' · 不再校正';
        global.setTimeout(() => {
            ending.hidden = false;
            resetButton.focus({preventScroll: true});
        }, reduced ? 0 : Math.max(0, at - performance.now()) + 1100);
    }
    function reset() {
        model.reset();
        finale = null;moduleAnim = null;
        modulePos = {x: M.x, y: M.y};
        var now = performance.now();
        settledAt = cells.map(() => now);resetAt = cells.map(() => -1);
        countText.textContent = '校正 0 / ' + model.corrections;
        ending.hidden = true;
        if (hint) hint.hidden = false;
        stage.focus({preventScroll: true});
        requestDraw();
    }

    // ---------- drawing ----------
    var pending = false;
    function requestDraw() {if (!pending) {pending = true;global.requestAnimationFrame(draw);}}
    function draw(now) {
        pending = false;
        animateModule(now);
        // In the end the grid moves half a cell to meet the module, and the gaps close.
        var f = finale ? (reduced ? 1 : ease((now - finale.t0) / 1400)) : 0;
        if (finale && !reduced && now >= finale.t0) {
            var g = ease((now - finale.t0) / 900);
            modulePos = {x: finale.from.x + (M.x - finale.from.x) * g, y: finale.from.y + (M.y - finale.from.y) * g};
        }
        var gridShiftY = (M.y % CELL) * f;
        ctx.clearRect(0, 0, W, H);
        var cellPx = CELL * scale;
        // Faint grid points: the system the letters are held to.
        var every = cellPx < 6 ? 2 : 1;
        ctx.globalAlpha = .22 * (1 - f);
        ctx.fillStyle = colors.line;
        var dot = Math.max(1, scale * .35);
        for (var gx = -2; (gx * CELL) < data.width + PAD.x; gx += every) {
            for (var gy = -2; (gy * CELL) < data.height + PAD.y; gy += every) {
                var q = toPx(gx * CELL, gy * CELL + gridShiftY);
                ctx.fillRect(q[0] - dot / 2, q[1] - dot / 2, dot, dot);
            }
        }
        ctx.globalAlpha = 1;
        // Closed gaps overlap and snap to whole pixels so no seams show between neighbouring squares.
        var gap = Math.max(.6, cellPx * .2) * (1 - f) - f;
        var size = cellPx - gap;
        var snap = f > .98 ? Math.round : v => v;
        ctx.fillStyle = colors.ink;
        cells.forEach((c, i) => {
            var a = amplitude(i, now), p = phase[i];
            var dx = a * Math.sin(now * p[2] + p[0]), dy = a * Math.cos(now * p[3] + p[1]);
            var q = toPx(c.x + dx, c.y + dy);
            ctx.fillRect(snap(q[0] + gap / 2), snap(q[1] + gap / 2), snap(size), snap(size));
        });
        var m = toPx(modulePos.x, modulePos.y);
        ctx.fillStyle = colors.steel;
        ctx.fillRect(m[0] + gap / 2, m[1] + gap / 2, M.w * scale - gap, M.h * scale - gap);
        var settling = finale && now < finale.t0 + 1500;
        if (!reduced && (!finale || settling) || moduleAnim) requestDraw();
    }
    function resize() {
        var bounds = canvas.getBoundingClientRect();
        W = Math.max(1, Math.round(bounds.width));
        scale = W / (data.width + PAD.x * 2);
        H = Math.round((data.height + PAD.y * 2) * scale);
        canvas.style.height = H + 'px';
        var dpr = Math.min(global.devicePixelRatio || 1, 2);
        canvas.width = Math.round(W * dpr);canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        requestDraw();
    }

    stage.addEventListener('click', event => {
        // Keyboard activation has no pointer position; the correction then starts from the module itself.
        if (event.detail === 0 || !event.clientX) {correct(modulePos.x + M.w / 2, modulePos.y + M.h / 2);return;}
        var b = canvas.getBoundingClientRect();
        correct((event.clientX - b.left) / scale - PAD.x, (event.clientY - b.top) / scale - PAD.y);
    });
    resetButton.addEventListener('click', reset);
    reduceQuery.addEventListener('change', event => {reduced = event.matches;requestDraw();});
    new MutationObserver(() => {readColors();requestDraw();}).observe(doc.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    var resizeTimer;
    global.addEventListener('resize', () => {clearTimeout(resizeTimer);resizeTimer = setTimeout(resize, 100);});
    readColors();
    // The wordmark starts perfectly in place; the drift only begins after a quiet moment.
    settledAt = cells.map(() => start + CALM);
    resize();
})(typeof window !== 'undefined' ? window : globalThis);
