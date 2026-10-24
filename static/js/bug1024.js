/* W-007 10.24 秒. One clock drives picture and sound: a beat is 2^8 ms, a bar 2^10 ms, the piece ten bars. */
(function (global) {
    'use strict';

    var BEAT = .256, BAR = 1.024, END = 10.24;
    var SHIFT_START = BAR, SHIFT_EVERY = .512, SHIFTS = 10;
    var BUILD_START = 2 * BAR, BUILD_END = 7 * BAR;
    var BUG_ENTER = 7 * BAR + BEAT, LAND = 8 * BAR;
    // After the module lands, one letter changes per beat, then the number folds over the whole last bar.
    var G_AT = LAND + BEAT, U_AT = LAND + 2 * BEAT, B_AT = LAND + 3 * BEAT, FOLD = 9 * BAR, MORPH = BEAT;

    // ---------- scene: everything is cut from the wordmark's own 1023-cell grid ----------
    function buildScene(data) {
        var C = data.cell, g = data.glyphs, done = data.completion;
        var inGlyph = (gx, range) => gx >= range[0] && gx <= range[1];
        var cells = {B: [], U: [], C: [], completion: [], one: [], zero: [], number: [], eight: [], zeroLetter: []};
        data.grid.forEach((row, gy) => {
            for (var gx = 0; gx < row.length; gx++) {
                if (row[gx] !== '#') continue;
                var cell = {gx: gx, gy: gy, x: gx * C, y: gy * C};
                if (inGlyph(gx, g.B)) cells.B.push(cell);
                else if (inGlyph(gx, g.U)) cells.U.push(cell);
                else if (inGlyph(gx, g.G)) {
                    // G without its crossbar and inner stem reads as C; those cells arrive with the module.
                    var missing = gx >= done.cols[0] && gy >= done.rows[0] && gy <= done.rows[1];
                    (missing ? cells.completion : cells.C).push(cell);
                } else {
                    cells.number.push(cell);
                    if (inGlyph(gx, g.one)) cells.one.push(cell);
                    if (inGlyph(gx, g.zero)) cells.zero.push(cell);
                }
            }
        });
        // Before the bug arrives the letters read as numbers: 8 is B with its right half mirrored onto the left,
        // 0 is U with its bottom curve mirrored to the top.
        var has = (gx, gy) => gy >= 0 && gy < data.grid.length && data.grid[gy][gx] === '#';
        var rows = data.grid.map((row, gy) => row.includes('#') ? gy : -1).filter(gy => gy >= 0);
        var top = rows[0], bottom = rows[rows.length - 1], middle = (top + bottom) / 2;
        var bMid = Math.ceil((g.B[0] + g.B[1]) / 2);
        data.grid.forEach((row, gy) => {
            for (var gx = g.B[0]; gx <= g.B[1]; gx++) {
                if (gx >= bMid ? has(gx, gy) : has(g.B[0] + g.B[1] - gx, gy)) cells.eight.push({gx: gx, gy: gy, x: gx * C, y: gy * C});
            }
            for (var ux = g.U[0]; ux <= g.U[1]; ux++) {
                if (gy < middle ? has(ux, top + bottom - gy) : has(ux, gy)) cells.zeroLetter.push({gx: ux, gy: gy, x: ux * C, y: gy * C});
            }
        });
        return cells;
    }

    // Binary 1 followed by n zeros, drawn with the wordmark's own 1 and 0, shrinking to stay in the number's place.
    function binaryLayout(scene, data, n, scaleOverride) {
        var g = data.glyphs, C = data.cell, GAP = 4;
        var oneW = g.one[1] - g.one[0] + 1, zeroW = g.zero[1] - g.zero[0] + 1;
        var widthCols = oneW + n * (zeroW + GAP);
        var available = g.four[1] - g.one[0] + 1;
        var s = scaleOverride || Math.min(1, available / widthCols);
        var centerY = (2 + 25) / 2 * C, x0 = g.one[0] * C;
        var place = (cell, glyphStart, offsetCols) => ({
            x: x0 + (offsetCols + cell.gx - glyphStart) * C * s,
            y: centerY + (cell.y - centerY) * s,
            size: C * s
        });
        var out = scene.one.map(c => place(c, g.one[0], 0));
        for (var i = 0; i < n; i++) {
            var offset = oneW + GAP + i * (zeroW + GAP);
            scene.zero.forEach(c => out.push(place(c, g.zero[0], offset)));
        }
        return {cells: out, scale: s};
    }
    function binaryText(n) {return '1' + '0'.repeat(n);}
    function zerosAt(t) {return t < SHIFT_START ? 0 : Math.min(SHIFTS, Math.floor((t - SHIFT_START) / SHIFT_EVERY) + 1);}

    // ---------- score: 8-bit voices on the same 2^n grid ----------
    function midi(n) {return 440 * Math.pow(2, (n - 69) / 12);}
    function score() {
        var notes = [];
        var add = (t, voice, note, dur, vol) => notes.push({t: t, voice: voice, note: note, dur: dur, vol: vol});
        // Bar 0: the cursor.
        add(0, 'square', 72, .06, .5);add(.512, 'square', 72, .06, .5);
        // One step up for every doubling, with an echo half a beat later.
        [60, 62, 64, 67, 69, 72, 74, 76, 79, 81].forEach((n, k) => {
            var t = SHIFT_START + k * SHIFT_EVERY;
            add(t, 'square', n, .18, .5);add(t + .128, 'square', n + 12, .08, .22);
        });
        // Bass: octave bounce on eighths, bars 1-6.
        [45, 41, 48, 43, 45, 41].forEach((root, b) => {
            for (var e = 0; e < 8; e++) add((b + 1) * BAR + e * .128, 'triangle', root + (e % 2 ? 12 : 0), .11, .55);
        });
        // Drums, bars 2-6: kick on 1 and 3, hats off the beat, snare joins in bar 4.
        for (var b = 2; b <= 6; b++) {
            var t0 = b * BAR;
            add(t0, 'kick', 0, .12, .7);add(t0 + .512, 'kick', 0, .12, .7);
            for (var h = 0; h < 4; h++) add(t0 + .128 + h * BEAT, 'hat', 0, .03, .25);
            if (b >= 4) {add(t0 + BEAT, 'snare', 0, .1, .35);add(t0 + 3 * BEAT, 'snare', 0, .1, .35);}
        }
        // Bar 7: one beat of silence, then the bug arrives slightly out of tune.
        [84, 79, 91, 73, 88, 77, 95, 70, 86].forEach((n, i) => add(BUG_ENTER + i * .064, 'square', n + (i % 3 === 1 ? .4 : 0), .05, .3));
        add(BUG_ENTER + 9 * .064, 'bend', 90, .2, .3);
        // Bar 8: it lands; then C, 0 and 8 turn into G, U and B, one note each.
        add(LAND, 'kick', 0, .12, .7);
        add(LAND, 'triangle', 43, 2, .45);
        [[G_AT, 72], [U_AT, 76], [B_AT, 79]].forEach(hit => {
            add(hit[0], 'square', hit[1], .2, .45);add(hit[0] + .128, 'square', hit[1] + 12, .08, .2);add(hit[0], 'kick', 0, .1, .5);
        });
        // Bar 9: the number folds into 1024 on a rising run of sixteenths, with a snare roll into the last beat.
        [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84].forEach((n, i) => add(FOLD + i * .064, 'square', n, .05, .22));
        for (var r = 0; r < 4; r++) add(FOLD + 3 * BEAT + r * .064, 'snare', 0, .05, .2 + r * .06);
        // The last note lands exactly on 10.24 s.
        [72, 76, 79].forEach(n => add(END, 'square', n, .7, .2));
        add(END, 'square', 84, .5, .3);add(END, 'triangle', 36, .7, .6);add(END, 'kick', 0, .14, .8);
        return notes.sort((a, b) => a.t - b.t);
    }

    global.Bug1024 = {buildScene: buildScene, binaryLayout: binaryLayout, binaryText: binaryText, zerosAt: zerosAt, score: score,
        timing: {BEAT: BEAT, BAR: BAR, END: END, SHIFT_START: SHIFT_START, SHIFT_EVERY: SHIFT_EVERY, SHIFTS: SHIFTS,
            LAND: LAND, G_AT: G_AT, U_AT: U_AT, B_AT: B_AT, FOLD: FOLD}};

    var doc = global.document;
    var root = doc && doc.querySelector('[data-bug1024]');
    if (!root) return;
    var data = JSON.parse(doc.getElementById('bug1024-data').textContent);
    var canvas = root.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var playButton = root.querySelector('[data-bug1024-play]');
    var muteButton = root.querySelector('[data-bug1024-mute]');
    var clockText = root.querySelector('[data-bug1024-clock]');
    var ending = root.querySelector('[data-bug1024-ending]');
    var reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var scene = buildScene(data);
    var module = data.module;
    var PAD = {x: 8, y: 6};
    var W = 0, H = 0, scale = 1, colors = {};
    var audio = null, startedAt = 0, playing = false, finished = false;

    // Where every binary cell goes when the eleven digits fold into 1024: proportional by position.
    var finalBinary = binaryLayout(scene, data, SHIFTS).cells;
    var byX = (a, b) => a.x - b.x || a.y - b.y;
    var numberTargets = scene.number.slice().sort(byX);
    var fold = finalBinary.map((c, i) => ({from: c, to: numberTargets[Math.floor(i * numberTargets.length / finalBinary.length)]}))
        .sort((a, b) => byX(a.from, b.from));
    // 8, 0 and C print column by column, an eighth note at a time.
    var steps = Math.round((BUILD_END - BUILD_START) / .128);
    var leftCols = [data.glyphs.B[0], data.glyphs.G[1]];
    var printAt = c => BUILD_START + Math.floor((c.gx - leftCols[0]) / (leftCols[1] - leftCols[0] + 1) * steps) * .128;
    // Each letter then changes cell by cell over one beat: cells leave, cells arrive, shared cells stay.
    var seed = 1024;
    function rand() {seed = (seed * 1664525 + 1013904223) >>> 0;return seed / 4294967296;}
    function change(from, to, at) {
        var key = c => c.gx + ',' + c.gy, map = new Map();
        from.forEach(c => map.set(key(c), {cell: c, from: true, to: false}));
        to.forEach(c => {var k = key(c);if (map.has(k)) map.get(k).to = true;else map.set(k, {cell: c, from: false, to: true});});
        return Array.from(map.values()).map(m => Object.assign(m, {print: printAt(m.cell), at: at + rand() * MORPH}));
    }
    var letters = [].concat(change(scene.eight, scene.B, B_AT), change(scene.zeroLetter, scene.U, U_AT),
        change(scene.C, scene.C.concat(scene.completion), G_AT));
    function shown(m, t) {
        if (m.from && m.to) return t >= m.print;
        if (m.from) return t >= m.print && t < m.at;
        return t >= m.at;
    }
    // The bug's way in: jumps on sixteenths, never quite straight.
    var path = [[400, -12], [352, 8], [330, -4], [300, 20], [276, 6], [252, 26], [236, 14], [214, 30], [200, 22], [190, 40], [184, 30], [176, 42]];

    function ease(t) {t = Math.min(1, Math.max(0, t));return t * t * (3 - 2 * t);}
    function readColors() {
        var style = getComputedStyle(doc.documentElement);
        var pick = (name, fallback) => (style.getPropertyValue(name) || '').trim() || fallback;
        colors = {ink: pick('--brand-ink', '#111a21'), steel: pick('--brand-steel', '#365b6d')};
    }
    function toPx(x, y) {return [(x + PAD.x) * scale, (y + PAD.y) * scale];}
    // On the last note squares overlap and snap to whole pixels, so the finished wordmark has no seams.
    var snap = v => v;
    function rect(x, y, w, h) {ctx.fillRect(snap(x), snap(y), snap(w), snap(h));}
    function square(x, y, size, gap) {
        var q = toPx(x, y), s = size * scale - gap;
        rect(q[0] + gap / 2, q[1] + gap / 2, s, s);
    }
    function modulePosition(t) {
        if (t < BUG_ENTER) return null;
        if (t < LAND) {
            var i = Math.min(path.length - 1, Math.floor((t - BUG_ENTER) / .064));
            return {x: path[i][0], y: path[i][1]};
        }
        var p = ease((t - LAND) / .256), last = path[path.length - 1];
        return {x: last[0] + (module.x - last[0]) * p, y: last[1] + (module.y - last[1]) * p};
    }

    function draw(t) {
        ctx.clearRect(0, 0, W, H);
        var cellPx = data.cell * scale;
        // Gaps close on the last note, when the wordmark is finally whole.
        var gap = t >= END ? -.6 : Math.max(.6, cellPx * .2);
        snap = t >= END ? Math.round : v => v;
        ctx.fillStyle = colors.ink;
        // Left: 8, 0 and C, becoming B, U and G.
        letters.forEach(m => {if (shown(m, t)) square(m.cell.x, m.cell.y, data.cell, gap);});
        // Right: the binary number, then 1024.
        if (t < FOLD) {
            var n = zerosAt(t);
            var blinkOff = t < SHIFT_START && (t % .512) >= .256 && t > 0;
            if (!blinkOff) {
                // The number shrinks over a sixteenth after each new digit instead of jumping.
                var target = binaryLayout(scene, data, n), previous = binaryLayout(scene, data, Math.max(0, n - 1));
                var since = n ? t - (SHIFT_START + (n - 1) * SHIFT_EVERY) : 1;
                var s = previous.scale + (target.scale - previous.scale) * ease(since / .064);
                binaryLayout(scene, data, n, s).cells.forEach(c => {
                    var size = c.size * scale - Math.min(gap, c.size * scale * .3);
                    var q = toPx(c.x, c.y);
                    ctx.fillRect(q[0], q[1], size, size);
                });
            }
        } else {
            fold.forEach((pair, i) => {
                var p = ease((t - FOLD - i / fold.length * .45) / .5);
                var x = pair.from.x + (pair.to.x - pair.from.x) * p, y = pair.from.y + (pair.to.y - pair.from.y) * p;
                var size = pair.from.size + (data.cell - pair.from.size) * p;
                var px = size * scale - gap * p - Math.min(gap, size * scale * .3) * (1 - p), q = toPx(x, y);
                rect(q[0] + gap * p / 2, q[1] + gap * p / 2, px, px);
            });
        }
        var m = modulePosition(t);
        if (m) {
            ctx.fillStyle = colors.steel;
            var q = toPx(m.x, m.y);
            rect(q[0] + gap / 2, q[1] + gap / 2, module.w * scale - gap, module.h * scale - gap);
        }
    }

    // ---------- sound ----------
    function voice(ac, out, note) {
        var t = startedAt + note.t, gain = ac.createGain();
        gain.connect(out);
        if (note.voice === 'square' || note.voice === 'triangle' || note.voice === 'bend') {
            var osc = ac.createOscillator();
            osc.type = note.voice === 'triangle' ? 'triangle' : 'square';
            osc.frequency.setValueAtTime(midi(note.note), t);
            if (note.voice === 'bend') osc.frequency.exponentialRampToValueAtTime(midi(note.note - 24), t + note.dur);
            gain.gain.setValueAtTime(note.vol, t);
            gain.gain.exponentialRampToValueAtTime(.001, t + note.dur);
            osc.connect(gain);osc.start(t);osc.stop(t + note.dur + .02);
        } else if (note.voice === 'kick') {
            var k = ac.createOscillator();
            k.type = 'triangle';
            k.frequency.setValueAtTime(150, t);k.frequency.exponentialRampToValueAtTime(40, t + note.dur);
            gain.gain.setValueAtTime(note.vol, t);gain.gain.exponentialRampToValueAtTime(.001, t + note.dur);
            k.connect(gain);k.start(t);k.stop(t + note.dur + .02);
        } else {
            var src = ac.createBufferSource(), filter = ac.createBiquadFilter();
            src.buffer = noise(ac);
            filter.type = note.voice === 'hat' ? 'highpass' : 'bandpass';
            filter.frequency.value = note.voice === 'hat' ? 7000 : 1800;
            gain.gain.setValueAtTime(note.vol, t);gain.gain.exponentialRampToValueAtTime(.001, t + note.dur);
            src.connect(filter);filter.connect(gain);src.start(t);src.stop(t + note.dur + .02);
        }
    }
    var noiseBuffer = null;
    function noise(ac) {
        if (noiseBuffer) return noiseBuffer;
        noiseBuffer = ac.createBuffer(1, ac.sampleRate * .2, ac.sampleRate);
        var d = noiseBuffer.getChannelData(0), seed = 1024;
        for (var i = 0; i < d.length; i++) {seed = (seed * 1664525 + 1013904223) >>> 0;d[i] = seed / 2147483648 - 1;}
        return noiseBuffer;
    }

    // ---------- playback ----------
    function now() {return audio ? audio.currentTime : performance.now() / 1000;}
    function play(withSound) {
        ending.hidden = true;finished = false;
        if (audio) {audio.close();audio = null;}
        if (withSound && (global.AudioContext || global.webkitAudioContext)) {
            audio = new (global.AudioContext || global.webkitAudioContext)();
            var master = audio.createGain();
            master.gain.value = .14;master.connect(audio.destination);
            startedAt = audio.currentTime + .08;
            score().forEach(note => voice(audio, master, note));
        } else {
            startedAt = now() + .08;
        }
        playing = true;
        root.classList.add('is-playing');
        global.requestAnimationFrame(frame);
    }
    function frame() {
        if (!playing) return;
        var t = now() - startedAt;
        draw(Math.max(0, t));
        clockText.textContent = Math.min(END, Math.max(0, t)).toFixed(2).padStart(5, '0') + ' / 10.24';
        if (t >= END + .5) {
            playing = false;finished = true;
            root.classList.remove('is-playing');
            ending.hidden = false;
            playButton.textContent = '▶ 再播放一次';
            return;
        }
        global.requestAnimationFrame(frame);
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
        if (!playing) draw(finished || reduced ? END : 0);
    }

    playButton.addEventListener('click', () => play(true));
    muteButton.addEventListener('click', () => play(false));
    new MutationObserver(() => {readColors();if (!playing) draw(finished || reduced ? END : 0);})
        .observe(doc.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    var resizeTimer;
    global.addEventListener('resize', () => {clearTimeout(resizeTimer);resizeTimer = setTimeout(resize, 100);});
    readColors();
    resize();
})(typeof window !== 'undefined' ? window : globalThis);
