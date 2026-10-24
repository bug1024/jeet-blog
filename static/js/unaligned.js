/* W-007 不归位. Every input lays down a few modules; only at the end does the system show what they were for. */
(function (global) {
    'use strict';

    // Pure rules, shared with tests.
    function inkCells(data) {
        var cells = [];
        data.grid.forEach((row, gy) => {
            for (var gx = 0; gx < row.length; gx++) if (row[gx] === '#') cells.push({x: gx * data.cell, y: gy * data.cell});
        });
        return cells;
    }
    function batchSizes(total, steps) {
        var base = Math.floor(total / steps), extra = total % steps;
        return Array.from({length: steps}, (_, i) => base + (i < extra ? 1 : 0));
    }
    function createModel(data) {
        var sizes = batchSizes(inkCells(data).length, data.steps);
        var model = {
            steps: data.steps,
            total: inkCells(data).length + 1,
            step: 0,
            placed: 0,
            done: false,
            // Lays down the next batch and returns how many modules it holds; 0 once everything is placed.
            next: function () {
                if (model.done) return 0;
                var n = sizes[model.step];
                model.step += 1;model.placed += n;
                model.done = model.step >= model.steps;
                return n;
            },
            reset: function () {model.step = 0;model.placed = 0;model.done = false;}
        };
        return model;
    }
    function random(seed) {
        return function () {seed = (seed * 1664525 + 1013904223) >>> 0;return seed / 4294967296;};
    }
    global.UnalignedModel = {createModel: createModel, inkCells: inkCells, batchSizes: batchSizes};

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

    var CELL = data.cell, COLS = data.grid[0].length, ROWS = data.grid.length;
    var module = {x: data.module.x, w: data.module.w, h: data.module.h};
    module.y = 37.5; // 不在网格上，是故意的。
    var targets = inkCells(data);
    var model = createModel(data);
    var PAD = {x: 8, y: 6};
    var W = 0, H = 0, scale = 1;
    var colors = {};
    var rand = random(1024);
    var placed = [], taken = new Set();
    var finale = null, animateUntil = 0, endingTimer = 0;
    var bornAt = performance.now();

    // The cells the steel module covers, plus a margin, stay free while modules are laid down.
    var moduleCells = {x0: Math.floor(module.x / CELL) - 1, x1: Math.ceil((module.x + module.w) / CELL),
        y0: Math.floor(module.y / CELL) - 1, y1: Math.ceil((module.y + module.h) / CELL)};
    function free(gx, gy) {
        if (gx < 0 || gy < 0 || gx >= COLS || gy >= ROWS) return false;
        if (gx >= moduleCells.x0 && gx <= moduleCells.x1 && gy >= moduleCells.y0 && gy <= moduleCells.y1) return false;
        return !taken.has(gx + ',' + gy);
    }

    function ease(t) {t = Math.min(1, Math.max(0, t));return t * t * (3 - 2 * t);}
    function easeOut(t) {t = Math.min(1, Math.max(0, t));return 1 - Math.pow(1 - t, 3);}
    function readColors() {
        var style = getComputedStyle(doc.documentElement);
        var pick = (name, fallback) => (style.getPropertyValue(name) || '').trim() || fallback;
        colors = {ink: pick('--brand-ink', '#111a21'), steel: pick('--brand-steel', '#365b6d'), line: pick('--brand-slate', '#71838c')};
    }
    function toPx(x, y) {return [(x + PAD.x) * scale, (y + PAD.y) * scale];}
    function keepAnimating(ms) {animateUntil = Math.max(animateUntil, performance.now() + ms);requestDraw();}
    function updateCount() {countText.textContent = (model.placed + 1) + ' / ' + model.total;}

    // Each input lays a batch on free grid cells around where it was asked for. Nothing hints at the shape yet.
    function lay(originX, originY) {
        var n = model.next();
        if (!n) return;
        if (hint) hint.hidden = true;
        var now = performance.now(), cx = originX / CELL, cy = originY / CELL, spread = 7;
        for (var i = 0, tries = 0; i < n && tries < 20000; tries++) {
            var angle = rand() * Math.PI * 2, radius = Math.sqrt(-2 * Math.log(rand() + 1e-9)) * spread;
            var gx = Math.round(cx + Math.cos(angle) * radius), gy = Math.round(cy + Math.sin(angle) * radius * .7);
            if (tries % 300 === 299) spread *= 1.4;
            if (!free(gx, gy)) continue;
            taken.add(gx + ',' + gy);
            placed.push({x: gx * CELL, y: gy * CELL, born: reduced ? 0 : now + i * 14});
            i += 1;
        }
        updateCount();
        keepAnimating(n * 14 + 400);
        if (model.done) reveal(now + (reduced ? 0 : 700));
    }

    // Only now are the modules given their places. The steel one was already in its own.
    function reveal(at) {
        var order = (a, b) => a.x - b.x || a.y - b.y;
        var from = placed.slice().sort(order), to = targets.slice().sort(order);
        from.forEach((p, i) => {p.tx = to[i].x;p.ty = to[i].y;p.delay = to[i].x / data.width * 650;});
        finale = {t0: at};
        var FLY = 1000, CLOSE = 900;
        var total = reduced ? 0 : 700 + 650 + FLY + CLOSE + 600;
        keepAnimating(total + 200);
        endingTimer = global.setTimeout(() => {
            ending.hidden = false;
            resetButton.focus({preventScroll: true});
        }, total);
    }
    function reset() {
        global.clearTimeout(endingTimer);
        model.reset();
        placed = [];taken = new Set();finale = null;rand = random(1024);
        updateCount();
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
        var FLY = 1000;
        var settle = finale ? (reduced ? 1 : ease((now - finale.t0 - 650 - FLY) / 900)) : 0;
        ctx.clearRect(0, 0, W, H);
        var cellPx = CELL * scale;
        // Faint grid points: the order every ink module is held to. The steel module sits between them.
        ctx.globalAlpha = .24 * (1 - settle);
        ctx.fillStyle = colors.line;
        var every = cellPx < 6 ? 2 : 1, dot = Math.max(1, scale * .35);
        for (var gx = -2; gx * CELL < data.width + PAD.x; gx += every) {
            for (var gy = -2; gy * CELL < data.height + PAD.y; gy += every) {
                var d = toPx(gx * CELL, gy * CELL);
                ctx.fillRect(d[0] - dot / 2, d[1] - dot / 2, dot, dot);
            }
        }
        ctx.globalAlpha = 1;
        // Closed gaps overlap and snap to whole pixels so no seams show in the finished wordmark.
        var gap = Math.max(.6, cellPx * .2) * (1 - settle) - settle;
        var snap = settle > .98 ? Math.round : v => v;
        ctx.fillStyle = colors.ink;
        placed.forEach(p => {
            var grow = reduced ? 1 : easeOut((now - p.born) / 260);
            if (grow <= 0) return;
            var x = p.x, y = p.y;
            if (finale && p.tx !== undefined) {
                var t = reduced ? 1 : ease((now - finale.t0 - p.delay) / FLY);
                x = p.x + (p.tx - p.x) * t;
                y = p.y + (p.ty - p.y) * t - Math.sin(Math.PI * t) * 4;
            }
            var size = (cellPx - gap) * grow, q = toPx(x, y);
            var offset = (cellPx - size) / 2;
            ctx.fillRect(snap(q[0] + offset), snap(q[1] + offset), snap(size), snap(size));
        });
        // The steel module was the first one here, and it never moves.
        var arrive = reduced ? 1 : ease((now - bornAt) / 900);
        var m = toPx(module.x, module.y), g = Math.max(.6, cellPx * .2) * (1 - settle);
        ctx.globalAlpha = arrive;
        ctx.fillStyle = colors.steel;
        ctx.fillRect(m[0] + g / 2, m[1] + g / 2, module.w * scale - g, module.h * scale - g);
        ctx.globalAlpha = 1;
        if (now < animateUntil) requestDraw();
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
        // Keyboard activation has no pointer position, so the batch lands somewhere along the line.
        if (event.detail === 0 || !event.clientX) {lay(rand() * data.width, data.height * (.25 + rand() * .5));return;}
        var b = canvas.getBoundingClientRect();
        lay((event.clientX - b.left) / scale - PAD.x, (event.clientY - b.top) / scale - PAD.y);
    });
    resetButton.addEventListener('click', reset);
    reduceQuery.addEventListener('change', event => {reduced = event.matches;requestDraw();});
    new MutationObserver(() => {readColors();requestDraw();}).observe(doc.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    var resizeTimer;
    global.addEventListener('resize', () => {clearTimeout(resizeTimer);resizeTimer = setTimeout(resize, 100);});
    readColors();
    updateCount();
    resize();
    keepAnimating(1000);
})(typeof window !== 'undefined' ? window : globalThis);
