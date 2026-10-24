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
        // `from`, when given, is the pitch a note slides up from.
        var add = (t, voice, note, dur, vol, from) => notes.push({t: t, voice: voice, note: note, dur: dur, vol: vol, from: from});
        var SIX = .064;
        // Bar 0: a boot chime, twice, like a machine waking up.
        [[0, [81, 88]], [.512, [84, 93]]].forEach(c => c[1].forEach(n => add(c[0], 'pulse', n, .3, .14)));
        // Bars 1-6: Prelude-style arpeggios over a slow Am - F - G - Em - F - G. The run starts an octave low and
        // every doubling starts it one chord tone higher, and the line slowly gets louder; bar 6 pulls back to the bass alone.
        var chords = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59], [53, 57, 60], [55, 59, 62]];
        var roots = [45, 41, 43, 40, 41, 43];
        var tones = chord => {var out = [];for (var o = -12; o <= 36; o += 12) chord.forEach(n => out.push(n + o));return out.sort((a, b) => a - b);};
        for (var k = 0; k < SHIFTS; k++) {
            var t0 = SHIFT_START + k * SHIFT_EVERY, bar = Math.floor(t0 / BAR + 1e-9) - 1, ladder = tones(chords[bar]);
            var start = ladder.indexOf(chords[bar][0] - 12) + k;
            [0, 1, 2, 3, 2, 1, 2, 3].forEach((step, i) => add(t0 + i * SIX, 'pulse', ladder[start + step], .09, .09 + k * .011));
            add(t0, 'square', ladder[start + 4], .22, .1 + k * .008);
        }
        roots.forEach((root, b) => {
            var t0 = (b + 1) * BAR;
            add(t0, 'triangle', root, .48, .5);add(t0 + 2 * BEAT, 'triangle', b === 5 ? root : root + 12, .48, .42);
        });
        for (var kb = 3; kb <= 5; kb++) add(kb * BAR, 'kick', 0, .14, .3);
        // Bar 7: Metroid-style emptiness. One silent beat, then a low drone, a little noise and the bug, out of tune.
        add(BUG_ENTER, 'triangle', 40, LAND - BUG_ENTER - .02, .32);
        [0, 3, 6].forEach(i => add(BUG_ENTER + i * SIX, 'noise', 0, .05, .12));
        [84, 79, 91, 73, 88, 77, 95, 70, 86].forEach((n, i) => add(BUG_ENTER + i * SIX, 'pulse', n + (i % 3 === 1 ? .4 : 0), .05, .13));
        add(BUG_ENTER + 9 * SIX, 'bend', 90, .2, .12);
        // The last beat of bar 7 rises into the drop: a noise sweep and a pulse sliding up two octaves.
        add(LAND - BEAT, 'riser', 0, BEAT, .24);
        add(LAND - BEAT, 'pulse', 81, BEAT - .01, .12, 57);

        // Bars 8-9, Contra-style and original: a galloping triangle bass, a kick on every beat, a hard snare on
        // 2 and 4, hats on the off-sixteenths, power-chord stabs on each letter and a syncopated lead hook.
        var drive = [45, 45, 41, 43, 41, 43, 40, 40];
        drive.forEach((root, b) => {
            var t0 = LAND + b * BEAT;
            [root, root, root + 12, root].forEach((n, i) => add(t0 + i * SIX, 'triangle', n, .058, .62));
            add(t0, 'kick', 0, .14, .6);
            if (b % 2) add(t0, 'noise', 1800, .14, .45);
            [1, 3].forEach(i => add(t0 + i * SIX, 'noise', 9000, .025, .07));
        });
        add(LAND, 'noise', 6000, .5, .3);
        [[LAND, [57, 64, 69]], [G_AT, [64, 69, 76]], [U_AT, [65, 72, 77]], [B_AT, [67, 74, 79]]].forEach(stab => {
            stab[1].forEach(n => {add(stab[0], 'square', n, .09, .2);add(stab[0] + SIX + SIX, 'square', n, .05, .12);});
        });
        // The hook: answered in bar 9 a step higher, ending on the leading tone that pulls toward A.
        [[0, 69, 2], [2, 69, 1], [3, 72, 2], [5, 69, 1], [6, 74, 2], [8, 76, 3], [11, 79, 1], [12, 76, 2], [14, 74, 1], [15, 72, 1],
            [16, 77, 2], [18, 76, 1], [19, 74, 2], [21, 76, 1], [22, 79, 2], [24, 80, 4], [28, 81, 2], [30, 83, 1], [31, 85, 1]].forEach(m => {
            var t0 = LAND + m[0] * SIX;
            add(t0, 'lead', m[1], m[2] * SIX - .008, .2);
            if (m[0] >= 16) add(t0, 'pulse', m[1] - 4, m[2] * SIX - .008, .08);
        });
        for (var r = 0; r < 4; r++) add(FOLD + 3 * BEAT + r * SIX, 'noise', 1800, .05, .2 + r * .06);
        // 10.24 s: the minor key turns major. The lead slides up onto E, the chord is A major, the last note on time.
        add(END, 'lead', 88, 1.6, .2, 85);
        add(END, 'square', 81, 1.6, .14);
        [69, 73, 76].forEach(n => add(END, 'pulse', n, 1.6, .14));
        add(END, 'triangle', 45, 1.6, .55);add(END, 'kick', 0, .16, .55);add(END, 'noise', 6000, .9, .22);
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
    var stage = root.querySelector('[data-bug1024-stage]');
    var soundButton = root.querySelector('[data-bug1024-sound]');
    var clockText = root.querySelector('[data-bug1024-clock]');
    var progress = root.querySelector('[data-bug1024-progress]');
    var reduced = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var scene = buildScene(data);
    var module = data.module;
    var PAD = {x: 8, y: 6};
    var W = 0, H = 0, scale = 1, colors = {};
    var audio = null, master = null, soundOn = true, startedAt = 0, playing = false, finished = false, blinkTimer = 0;
    var VOLUME = .16;

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
            // Until the first shift a pixel cursor blinks after the 1, as if waiting for input.
            if (t < SHIFT_START && (t % .512) < .256) {
                var baseline = data.grid.map((row, gy) => row.includes('#') ? gy : 0).reduce((a, b) => Math.max(a, b));
                for (var cxi = 0; cxi < 4; cxi++) {
                    for (var cyi = 0; cyi < 2; cyi++) square((data.glyphs.one[1] + 3 + cxi) * data.cell, (baseline - 1 + cyi) * data.cell, data.cell, gap);
                }
            }
            // The number shrinks over a sixteenth after each new digit instead of jumping.
            var target = binaryLayout(scene, data, n), previous = binaryLayout(scene, data, Math.max(0, n - 1));
            var since = n ? t - (SHIFT_START + (n - 1) * SHIFT_EVERY) : 1;
            var s = previous.scale + (target.scale - previous.scale) * ease(since / .064);
            binaryLayout(scene, data, n, s).cells.forEach(c => {
                var size = c.size * scale - Math.min(gap, c.size * scale * .3);
                var q = toPx(c.x, c.y);
                ctx.fillRect(q[0], q[1], size, size);
            });
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
    // NES pulse waves: 12.5% duty for the thin arpeggios, 25% for the lead.
    var pulseWaves = {};
    function pulse(ac, d) {
        if (pulseWaves[d]) return pulseWaves[d];
        var n = 64, real = new Float32Array(n), imag = new Float32Array(n);
        for (var i = 1; i < n; i++) {
            var a = 2 / (i * Math.PI) * Math.sin(i * Math.PI * d);
            real[i] = a * Math.cos(i * Math.PI * d);imag[i] = a * Math.sin(i * Math.PI * d);
        }
        pulseWaves[d] = ac.createPeriodicWave(real, imag);
        return pulseWaves[d];
    }
    var noiseBuffer = null;
    function noise(ac) {
        if (noiseBuffer) return noiseBuffer;
        noiseBuffer = ac.createBuffer(1, Math.round(ac.sampleRate * .2), ac.sampleRate);
        var d = noiseBuffer.getChannelData(0), seed = 1024;
        for (var i = 0; i < d.length; i++) {seed = (seed * 1664525 + 1013904223) >>> 0;d[i] = seed / 2147483648 - 1;}
        return noiseBuffer;
    }
    function voice(ac, out, note) {
        var t = startedAt + note.t, gain = ac.createGain();
        gain.connect(out);
        gain.gain.setValueAtTime(.0001, t);
        gain.gain.exponentialRampToValueAtTime(note.vol, t + .006);
        gain.gain.exponentialRampToValueAtTime(.0001, t + note.dur);
        if (note.voice === 'noise' || note.voice === 'riser') {
            var src = ac.createBufferSource(), filter = ac.createBiquadFilter();
            src.buffer = noise(ac);src.loop = true;filter.type = 'bandpass';
            if (note.voice === 'riser') {
                // Swells instead of decaying, and the filter opens as it goes.
                filter.frequency.setValueAtTime(600, t);filter.frequency.exponentialRampToValueAtTime(8000, t + note.dur);
                gain.gain.cancelScheduledValues(t);
                gain.gain.setValueAtTime(.0001, t);gain.gain.exponentialRampToValueAtTime(note.vol, t + note.dur - .01);
                gain.gain.exponentialRampToValueAtTime(.0001, t + note.dur + .02);
            } else {
                filter.frequency.value = note.note || 2400;
            }
            src.connect(filter);filter.connect(gain);src.start(t);src.stop(t + note.dur + .03);
            return;
        }
        var osc = ac.createOscillator();
        if (note.voice === 'kick') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(120, t);osc.frequency.exponentialRampToValueAtTime(38, t + note.dur);
        } else {
            if (note.voice === 'triangle' || note.voice === 'square') osc.type = note.voice;
            else osc.setPeriodicWave(pulse(ac, note.voice === 'lead' ? .25 : .125));
            if (note.from) {
                osc.frequency.setValueAtTime(midi(note.from), t);osc.frequency.exponentialRampToValueAtTime(midi(note.note), t + Math.min(.06, note.dur));
            } else {
                osc.frequency.setValueAtTime(midi(note.note), t);
            }
            // Held lead notes get the delayed vibrato NES composers wrote by hand.
            if (note.voice === 'lead' && note.dur > .15) {
                var lfo = ac.createOscillator(), depth = ac.createGain();
                lfo.frequency.value = 6;
                depth.gain.setValueAtTime(0, t + .08);depth.gain.linearRampToValueAtTime(midi(note.note) * .007, t + .2);
                lfo.connect(depth);depth.connect(osc.frequency);lfo.start(t);lfo.stop(t + note.dur + .05);
            }
            if (note.voice === 'bend') osc.frequency.exponentialRampToValueAtTime(midi(note.note - 24), t + note.dur);
        }
        osc.connect(gain);osc.start(t);osc.stop(t + note.dur + .05);
    }

    // ---------- playback ----------
    function now() {return audio ? audio.currentTime : performance.now() / 1000;}
    function setClock(t, cue) {
        clockText.textContent = cue + ' ' + Math.min(END, Math.max(0, t)).toFixed(2).padStart(5, '0') + ' / 10.24';
        progress.style.transform = 'scaleX(' + Math.min(1, Math.max(0, t / END)) + ')';
    }
    // Before playing, the 1 waits like a cursor. It is the play button.
    function idle() {
        global.clearInterval(blinkTimer);
        if (finished || reduced) {draw(END);return;}
        var on = true;
        draw(0);
        blinkTimer = global.setInterval(() => {on = !on;draw(on ? 0 : .3);}, 512);
    }
    function play() {
        global.clearInterval(blinkTimer);
        finished = false;
        if (audio) {audio.close();audio = null;}
        var Context = global.AudioContext || global.webkitAudioContext;
        if (Context) {
            audio = new Context();
            master = audio.createGain();
            master.gain.value = soundOn ? VOLUME : 0;
            // A dotted-eighth echo keeps each note in the air a little longer.
            var delay = audio.createDelay(1), feedback = audio.createGain(), wet = audio.createGain();
            delay.delayTime.value = .384;feedback.gain.value = .32;wet.gain.value = .28;
            master.connect(audio.destination);master.connect(delay);
            delay.connect(feedback);feedback.connect(delay);delay.connect(wet);wet.connect(audio.destination);
            startedAt = audio.currentTime + .08;
            score().forEach(note => voice(audio, master, note));
        } else {
            startedAt = now() + .08;
        }
        playing = true;
        root.classList.add('is-playing');
        stage.setAttribute('aria-label', '从头播放 10.24 秒的动画');
        global.requestAnimationFrame(frame);
    }
    function frame() {
        if (!playing) return;
        var t = now() - startedAt;
        draw(Math.max(0, t));
        setClock(t, '■');
        if (t >= END + .5) {
            playing = false;finished = true;
            root.classList.remove('is-playing');
            setClock(END, '↻');
            return;
        }
        global.requestAnimationFrame(frame);
    }
    function toggleSound() {
        soundOn = !soundOn;
        soundButton.setAttribute('aria-pressed', String(soundOn));
        soundButton.textContent = soundOn ? '声音 开' : '声音 关';
        if (master) master.gain.setTargetAtTime(soundOn ? VOLUME : 0, audio.currentTime, .02);
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
        if (!playing) idle();
    }

    stage.addEventListener('click', play);
    soundButton.addEventListener('click', toggleSound);
    new MutationObserver(() => {readColors();if (!playing) idle();})
        .observe(doc.documentElement, {attributes: true, attributeFilter: ['data-theme']});
    var resizeTimer;
    global.addEventListener('resize', () => {clearTimeout(resizeTimer);resizeTimer = setTimeout(resize, 100);});
    readColors();
    setClock(reduced ? END : 0, '▶');
    resize();
})(typeof window !== 'undefined' ? window : globalThis);
