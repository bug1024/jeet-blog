/* W-002 向北，再向南. Scroll is time: reading distance, the year, the camera and the route all follow it. */
(function () {
    'use strict';
    var root = document.querySelector('[data-journey]');
    if (!root) return;
    var atlas = root.querySelector('.journey-atlas');
    var canvas = root.querySelector('[data-journey-canvas]');
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var data = JSON.parse(document.getElementById('journey-data').textContent);
    var chapters = data.chapters;
    var birthYear = data.birthYear, endYear = data.endYear;
    var scenes = Array.from(root.querySelectorAll('[data-journey-scene]'));
    var links = Array.from(root.querySelectorAll('[data-journey-go]'));
    var yearText = root.querySelector('[data-journey-year]');
    var ageText = root.querySelector('[data-journey-age]');
    var placeText = root.querySelector('[data-journey-map-place]');
    var lived = root.querySelector('[data-journey-lived]');
    var mark = root.querySelector('[data-journey-mark]');
    var reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = reduceQuery.matches;
    var active = -1;
    var selectedTrip = null, tripBlend = 0, tripFrom = 0, tripTo = 0, tripStart = 0;
    var W = 0, H = 0;
    var pending = false, scrollPending = false;
    var sceneTops = [];
    var views = {};
    var camera = {x: 119, y: 36, s: 25, ox: 0, oy: 0};
    var state = {year: birthYear, scene: -1, growth: 0};
    var geo = null;
    var labelBoxes = [];

    // Ink on paper. The paper yellows and the ink browns with distance from the present.
    // Vermilion is the only colour: it marks the lived route and turns to ink as the years pass.
    var OLD = {paper: [246, 243, 235], ink: [56, 50, 42]};
    var NOW = {paper: [250, 249, 246], ink: [29, 28, 26]};
    var palette = JSON.parse(JSON.stringify(NOW));
    var ROUTE = [163, 65, 50];
    // Rough outline used only until the baked geography arrives.
    var LAND = [
        [[73.6, 39.5], [75.4, 36.8], [78.1, 35.4], [79.5, 32.2], [81.2, 30.2],
         [85.0, 28.3], [89.0, 27.2], [92.2, 28.0], [96.2, 28.2], [98.5, 25.8],
         [101.8, 23.1], [105.2, 21.3], [108.6, 21.5], [110.4, 20.1], [111.4, 21.2],
         [113.0, 22.0], [116.0, 22.9], [118.6, 24.4], [120.2, 27.2], [121.7, 30.2],
         [121.2, 32.4], [122.8, 35.0], [121.3, 37.5], [122.1, 39.0], [124.0, 40.1],
         [128.0, 42.2], [131.1, 44.8], [134.5, 48.3], [130.2, 48.8], [127.4, 50.2],
         [125.0, 53.0], [121.4, 49.2], [118.4, 46.8], [115.2, 45.5], [111.0, 44.6],
         [108.0, 42.6], [104.0, 41.8], [100.0, 42.7], [96.0, 42.6], [92.0, 45.4],
         [87.8, 49.0], [83.4, 47.2], [80.0, 45.0], [78.0, 42.0], [73.6, 39.5]],
        [[108.7, 19.2], [110.1, 18.1], [111.0, 19.3], [110.4, 20.0], [109.2, 20.1], [108.7, 19.2]],
        [[120.0, 25.4], [121.0, 22.0], [121.8, 23.8], [121.5, 25.3], [120.0, 25.4]]
    ];
    // Map detail switches by scale (pixels per degree): national < 90 <= regional < 1100 <= local.
    var REGIONAL_BOX = [114.5, 123.5, 22.5, 31], NATIONAL_BOX = [55, 170, -5, 60];

    function mercY(lat) {
        return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI;
    }
    function rgba(rgb, alpha) {return 'rgba(' + rgb.map(Math.round).join(',') + ',' + alpha + ')';}
    function mix(a, b, t) {return a + (b - a) * t;}
    function mixRgb(a, b, t) {return a.map((v, i) => mix(v, b[i], t));}
    function clamp(v, lo, hi) {return Math.max(lo, Math.min(hi, v));}
    function smooth(t) {t = clamp(t, 0, 1);return t * t * (3 - 2 * t);}
    function project(point, cam) {
        cam = cam || camera;
        return [(point[0] - cam.x) * cam.s + W / 2 + cam.ox,
            -(mercY(point[1]) - cam.y) * cam.s + H / 2 + cam.oy];
    }
    function mobile() {return window.innerWidth <= 760;}
    function fit(points, minimumSpan) {
        var xs = points.map(p => p[0]), ys = points.map(p => mercY(p[1]));
        var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
        var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
        var dx = Math.max(maxX - minX, minimumSpan), dy = Math.max(maxY - minY, minimumSpan * .72);
        // Room is kept for the year readout at the top and the time ruler at the bottom.
        var pads = mobile() ? {l: 45, r: 48, t: 70, b: 70} : {l: 90, r: 110, t: 150, b: 150};
        var usableW = Math.max(W - pads.l - pads.r, 90);
        var usableH = Math.max(H - pads.t - pads.b, 85);
        // Never zoom out past the extent of the baked coastline (about 115° of longitude).
        return {x: (minX + maxX) / 2, y: (minY + maxY) / 2,
            s: Math.max(Math.min(usableW / dx, usableH / dy) * .80, W / 90),
            ox: (pads.l - pads.r) / 2, oy: (pads.t - pads.b) / 2};
    }
    function lerpCamera(a, b, t) {
        return {x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), s: Math.exp(mix(Math.log(a.s), Math.log(b.s), t)),
            ox: mix(a.ox, b.ox, t), oy: mix(a.oy, b.oy, t)};
    }
    function buildViews() {
        views.overview = fit(chapters.map(c => c.coords), 6);
        // Previously lived places stay in the map, even after a move to another city.
        chapters.forEach((c, i) => {views[i] = fit(chapters.slice(0, i + 1).map(x => x.coords), i < 4 ? .09 : 2.0);});
    }
    function tripView() {
        var points = chapters.slice(0, selectedTrip.chapter + 1).map(c => c.coords);
        points.push(chapters[selectedTrip.chapter].trips[selectedTrip.trip].coords);
        return fit(points, selectedTrip.chapter < 4 ? .09 : 2.0);
    }
    function yearOf(index) {return index < chapters.length ? chapters[index].startYear : endYear;}

    // ---------- scroll → time ----------
    function measure() {
        sceneTops = scenes.map(scene => scene.getBoundingClientRect().top + scrollY);
    }
    function readingLine() {
        return mobile() ? atlas.getBoundingClientRect().bottom + 94 : 58 + Math.min(240, (innerHeight - 58) * .35);
    }
    function updateFromScroll() {
        scrollPending = false;
        var line = scrollY + readingLine(), k = -1;
        sceneTops.forEach((top, i) => {if (top <= line) k = i;});
        var atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 2;
        if (atEnd) k = scenes.length - 1;
        var value = k < 0 ? -1 : Number(scenes[k].dataset.journeyScene);
        var nextTop = k + 1 < sceneTops.length ? sceneTops[k + 1] : sceneTops[k] + innerHeight * .6;
        var p = k < 0 ? 0 : atEnd ? 1 : clamp((line - sceneTops[k]) / Math.max(1, nextTop - sceneTops[k]), 0, 1);
        state.scene = value;
        if (value >= 0 && value !== 99) {
            state.year = mix(yearOf(value), yearOf(value + 1), p);
            state.growth = smooth(p / .3);
        } else {
            state.year = value === 99 ? endYear : birthYear;
            state.growth = value === 99 ? smooth(p / .5) : 0;
        }
        setScene(value);
        renderTime();
        requestDraw();
    }
    function renderTime() {
        var year = Math.min(endYear, Math.floor(state.year + 1e-6));
        var age = year - birthYear;
        if (yearText.textContent !== String(year)) yearText.textContent = year;
        var ageLabel = age === 0 ? '出生' : age + ' 岁';
        if (ageText.textContent !== ageLabel) ageText.textContent = ageLabel;
        var share = clamp((state.year - birthYear) / (endYear - birthYear), 0, 1) * 100;
        lived.style.width = share + '%';
        mark.style.left = share + '%';
        var t = clamp((endYear - state.year) / (endYear - birthYear), 0, 1);
        Object.keys(NOW).forEach(k => {palette[k] = mixRgb(NOW[k], OLD[k], t);});
        root.style.setProperty('--journey-paper', rgba(palette.paper, 1));
    }
    function setScene(value) {
        if (value === active) return;
        active = value;
        if (selectedTrip) {
            selectedTrip = null;tripBlend = 0;
            root.querySelectorAll('[data-journey-trip]').forEach(button => button.setAttribute('aria-pressed', 'false'));
        }
        root.dataset.journeyActive = String(value);
        var chapter = value >= 0 && value !== 99 ? chapters[value] : null;
        root.dataset.tone = chapter ? chapter.theme : value === 99 ? 'neutral' : 'warm';
        placeText.textContent = chapter ? chapter.place : '宁德 · 福州 · 北京 · 南京';
        links.forEach(link => {
            var n = Number(link.dataset.journeyGo);
            link.parentNode.classList.toggle('is-read', value === 99 || n < value);
            link.parentNode.classList.toggle('is-active', n === value);
            if (n === value) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
        });
        scenes.forEach(scene => scene.classList.toggle('is-active', Number(scene.dataset.journeyScene) === value));
    }
    function sceneCamera() {
        var v = state.scene;
        if (v === -1) return views.overview;
        if (v === 99) return lerpCamera(views[chapters.length - 1], views.overview, state.growth);
        return lerpCamera(v === 0 ? views.overview : views[v - 1], views[v], state.growth);
    }
    addEventListener('scroll', function () {
        if (!scrollPending) {scrollPending = true;requestAnimationFrame(updateFromScroll);}
    }, {passive: true});

    // ---------- short trips ----------
    function animateTrip(target) {
        tripFrom = tripBlend;tripTo = target;
        tripStart = reduced ? 0 : performance.now();
        if (!tripStart) tripBlend = target;
        requestDraw();
    }
    root.querySelectorAll('[data-journey-trip]').forEach(button => {
        button.addEventListener('click', function () {
            var section = button.closest('[data-journey-chapter]');
            var index = Number(section.dataset.journeyChapter), trip = Number(button.dataset.journeyTrip);
            var deselect = selectedTrip && selectedTrip.chapter === index && selectedTrip.trip === trip;
            if (deselect) {
                animateTrip(0);
            } else {
                selectedTrip = {chapter: index, trip: trip};
                tripBlend = 0;animateTrip(1);
            }
            root.querySelectorAll('[data-journey-trip]').forEach(item => item.setAttribute('aria-pressed', String(item === button && !deselect)));
        });
    });
    root.querySelectorAll('.journey-trips').forEach(details => {
        details.addEventListener('toggle', () => {
            measure();
            if (!details.open && selectedTrip && Number(details.closest('[data-journey-chapter]').dataset.journeyChapter) === selectedTrip.chapter) {
                details.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', 'false'));
                animateTrip(0);
            }
        });
    });

    // ---------- geography ----------
    function decode(flat, unit) {
        var points = [], x = 0, y = 0;
        for (var i = 0; i < flat.length; i += 2) {
            x += flat[i];y += flat[i + 1];
            points.push([x / unit, y / unit]);
        }
        return points;
    }
    function loadGeography() {
        var url = canvas.dataset.journeyGeo;
        if (!url || !window.fetch) return;
        fetch(url).then(response => response.ok ? response.json() : null).then(raw => {
            if (!raw) return;
            var unit = raw.units;
            var decodeSet = (set, scale) => set.map(item => Array.isArray(item) ? decode(item, scale)
                : Object.assign({}, item, {p: decode(item.p, scale)}));
            geo = {land: {}, lakes: {}, rivers: {}, terrain: {}};
            ['national', 'regional'].forEach(lod => {
                geo.land[lod] = decodeSet(raw.land[lod], unit[lod]);
                geo.lakes[lod] = decodeSet(raw.lakes[lod], unit[lod]);
                geo.rivers[lod] = decodeSet(raw.rivers[lod], unit[lod]);
            });
            ['national', 'regional', 'local'].forEach(lod => {geo.terrain[lod] = decodeSet(raw.terrain[lod], unit[lod]);});
            requestDraw();
        }).catch(() => {});
    }
    function trace(points, close) {
        ctx.beginPath();
        points.forEach((p, i) => {var q = project(p);if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);});
        if (close) ctx.closePath();
    }
    // Open lines are drawn through segment midpoints, so simplified contours and rivers stay soft.
    function traceSmooth(points) {
        ctx.beginPath();
        var q = points.map(p => project(p));
        ctx.moveTo(q[0][0], q[0][1]);
        for (var i = 1; i < q.length - 1; i++) {
            ctx.quadraticCurveTo(q[i][0], q[i][1], (q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2);
        }
        ctx.lineTo(q[q.length - 1][0], q[q.length - 1][1]);
    }
    function fillRings(rings, color) {
        ctx.fillStyle = color;
        rings.forEach(ring => {trace(ring, true);ctx.fill();});
    }
    // Coastlines are stroked without the straight edges left by clipping to the data box.
    function strokeCoast(rings, box, alpha, width) {
        var eps = 1e-6;
        var onEdge = (a, b) => (Math.abs(a[0] - box[0]) < eps && Math.abs(b[0] - box[0]) < eps) ||
            (Math.abs(a[0] - box[1]) < eps && Math.abs(b[0] - box[1]) < eps) ||
            (Math.abs(a[1] - box[2]) < eps && Math.abs(b[1] - box[2]) < eps) ||
            (Math.abs(a[1] - box[3]) < eps && Math.abs(b[1] - box[3]) < eps);
        ctx.beginPath();
        rings.forEach(ring => {
            for (var i = 0; i < ring.length; i++) {
                var a = ring[i], b = ring[(i + 1) % ring.length], p = project(a), q = project(b);
                if (onEdge(a, b)) continue;
                ctx.moveTo(p[0], p[1]);ctx.lineTo(q[0], q[1]);
            }
        });
        ctx.lineWidth = width;ctx.strokeStyle = rgba(palette.ink, alpha);ctx.lineCap = 'round';ctx.stroke();
    }
    function boxRect(box) {
        var a = project([box[0], box[3]]), b = project([box[1], box[2]]);
        return [a[0], a[1], b[0] - a[0], b[1] - a[1]];
    }
    function drawGeography() {
        // Land is bare paper; water carries a faint wash of the same ink.
        var landColor = rgba(palette.paper, 1), lakeColor = rgba(mixRgb(palette.paper, palette.ink, .05), 1);
        ctx.fillStyle = lakeColor;ctx.fillRect(0, 0, W, H);
        if (!geo) {
            fillRings(LAND, landColor);
            return;
        }
        var detailed = camera.s >= 90;
        ctx.save();
        if (detailed) {
            // Coarse coast outside the regional box, fine coast inside, so the two never overlap.
            var r = boxRect(REGIONAL_BOX);
            ctx.beginPath();ctx.rect(0, 0, W, H);ctx.rect(r[0], r[1], r[2], r[3]);ctx.clip('evenodd');
        }
        fillRings(geo.land.national, landColor);
        fillRings(geo.lakes.national, lakeColor);
        strokeCoast(geo.land.national, NATIONAL_BOX, .5, .8);
        strokeCoast(geo.lakes.national, NATIONAL_BOX, .3, .6);
        ctx.restore();
        if (detailed) {
            ctx.save();
            var box = boxRect(REGIONAL_BOX);
            ctx.beginPath();ctx.rect(box[0], box[1], box[2], box[3]);ctx.clip();
            fillRings(geo.land.regional, landColor);
            fillRings(geo.lakes.regional, lakeColor);
            strokeCoast(geo.land.regional, REGIONAL_BOX, .5, .8);
            strokeCoast(geo.lakes.regional, REGIONAL_BOX, .3, .6);
            ctx.restore();
        }
        drawTerrain();
        drawRivers(detailed ? geo.rivers.regional : geo.rivers.national, detailed);
    }
    function drawTerrain() {
        var logS = Math.log(camera.s);
        var weights = {
            national: 1 - smooth((logS - Math.log(60)) / Math.log(2)),
            local: smooth((logS - Math.log(700)) / Math.log(2.2))
        };
        weights.regional = Math.max(0, 1 - weights.national - weights.local);
        ctx.lineJoin = 'round';
        Object.keys(weights).forEach(lod => {
            var w = weights[lod];
            if (w < .02) return;
            geo.terrain[lod].forEach(line => {
                var strong = lod === 'local' ? line.e % 500 === 0 : lod === 'regional' ? line.e % 800 === 0 : line.e >= 1500;
                traceSmooth(line.p);
                ctx.lineWidth = strong ? .9 : .6;
                ctx.strokeStyle = rgba(palette.ink, (strong ? .2 : .11) * w);
                ctx.stroke();
            });
        });
    }
    function drawRivers(rivers, detailed) {
        var named = {};
        rivers.forEach(river => {
            traceSmooth(river.p);
            ctx.lineWidth = river.r <= 3 ? 1.4 : river.r <= 6 ? 1 : .8;
            ctx.strokeStyle = rgba(palette.ink, .38);ctx.stroke();
            if (river.n && (!named[river.n] || river.p.length > named[river.n].p.length)) named[river.n] = river;
        });
        var wanted = detailed ? ['闽江', '九龙江', '瓯江', '富春江'] : ['长江', '黄河'];
        wanted.forEach(name => {
            var river = named[name];
            if (!river) return;
            var q = project(river.p[Math.floor(river.p.length / 2)]);
            if (q[0] < 20 || q[0] > W - 60 || q[1] < 120 || q[1] > H - 120) return;
            label(name, q[0] + 6, q[1] - 8, {size: 10, color: rgba(palette.ink, .62), avoid: true});
        });
    }

    // ---------- route ----------
    function label(text, x, y, options) {
        options = options || {};
        ctx.font = (options.size || 11) + 'px "PingFang SC","Hiragino Sans GB",sans-serif';
        ctx.textAlign = options.align || 'left';ctx.textBaseline = 'middle';
        if (options.avoid) {
            var width = ctx.measureText(text).width;
            x = Math.max(10, Math.min(x, W - width - 12));
            var offsets = [0, -17, 17, -34, 34], chosen = y;
            for (var j = 0; j < offsets.length; j++) {
                var candidate = Math.max(mobile() ? 42 : 78, Math.min(y + offsets[j], H - (mobile() ? 45 : 80)));
                if (!labelBoxes.some(box => x < box.x + box.w + 7 && x + width + 7 > box.x && Math.abs(candidate - box.y) < 17)) {
                    chosen = candidate;break;
                }
            }
            y = chosen;labelBoxes.push({x: x, y: y, w: width});
        }
        ctx.strokeStyle = rgba(palette.paper, .94);ctx.lineWidth = 4;ctx.lineJoin = 'round';ctx.strokeText(text, x, y);
        ctx.fillStyle = options.color || rgba(palette.ink, .88);ctx.fillText(text, x, y);
        ctx.textAlign = 'left';
    }
    function curve(from, to, color, width, alpha, dashed, amount) {
        var a = project(from), b = project(to), dx = b[0] - a[0], dy = b[1] - a[1];
        var length = Math.hypot(dx, dy) || 1, bend = Math.min(length * .13, 55);
        var c = [(a[0] + b[0]) / 2 - dy / length * bend, (a[1] + b[1]) / 2 + dx / length * bend];
        var end = amount === undefined ? 1 : amount, steps = 40;
        ctx.beginPath();ctx.moveTo(a[0], a[1]);
        for (var i = 1; i <= steps; i++) {
            var t = end * i / steps, u = 1 - t;
            ctx.lineTo(u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]);
        }
        ctx.lineWidth = width;ctx.strokeStyle = rgba(color, alpha);ctx.setLineDash(dashed ? [3, 5] : []);ctx.stroke();ctx.setLineDash([]);
    }
    function point(chapter, current, overview, index) {
        var p = project(chapter.coords);
        if (p[0] < -50 || p[0] > W + 50 || p[1] < -50 || p[1] > H + 50) return;
        var color = current ? ROUTE : palette.ink;
        ctx.beginPath();ctx.arc(p[0], p[1], current ? 5 : overview && [0, 4, 7, 8].includes(index) ? 4 : 2.4, 0, Math.PI * 2);
        ctx.fillStyle = rgba(color, current || active === 99 ? .95 : .63);ctx.fill();
        var shouldLabel = current || (overview && [0, 4, 7, 8].includes(index)) || (!overview && camera.s > 1100);
        if (shouldLabel) {
            var text = chapter.place;
            if (overview && index === 0) text = '寿宁';
            var offset = index === 0 ? 16 : index === 2 ? 16 : -13;
            if (overview && index === 4) offset = 15;
            label(text, p[0] + 10, p[1] + offset, {size: current ? 13 : 11, color: rgba(color, .97), avoid: true});
        }
    }
    function drawJourney() {
        var scene = state.scene, overview = scene === -1 || scene === 99;
        var last = scene === -1 ? -1 : scene === 99 ? chapters.length - 1 : scene;
        // The whole road ahead is pencilled in; the lived part is inked, and older ink has faded.
        for (var i = 1; i < chapters.length; i++) {
            curve(chapters[i - 1].coords, chapters[i].coords, palette.ink, 1, scene === -1 ? .4 : .2, true);
        }
        for (var j = 1; j <= last; j++) {
            var amount = j === scene ? state.growth : 1;
            if (amount <= 0) continue;
            var age = clamp((state.year - chapters[j].startYear) / 20, 0, 1);
            curve(chapters[j - 1].coords, chapters[j].coords, mixRgb(ROUTE, palette.ink, age * .85), 2, mix(.95, .55, age), false, amount);
        }
        chapters.forEach((chapter, index) => {
            // Before reading starts, only the four places that frame the journey are marked.
            if (scene === -1 ? ![0, 4, 7, 8].includes(index) : index > last || (index === scene && index > 0 && state.growth < .98)) return;
            point(chapter, index === scene, overview, index);
        });
        if (selectedTrip && tripBlend > 0) {
            var trip = chapters[selectedTrip.chapter].trips[selectedTrip.trip];
            curve(chapters[selectedTrip.chapter].coords, trip.coords, palette.ink, 1, .65 * tripBlend, true);
            var p = project(trip.coords);ctx.beginPath();ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);ctx.fillStyle = rgba(palette.ink, .8 * tripBlend);ctx.fill();
            label(trip.year + ' · ' + trip.place, p[0] + 9, p[1] - 10, {size: 11, avoid: true});
        }
    }
    function drawScale() {
        var kmUnit = camera.s / (111.32 * Math.cos(30 * Math.PI / 180));
        var choices = [.5, 1, 2, 5, 10, 20, 50, 100, 200, 500], km = .5;
        choices.forEach(v => {if (v * kmUnit <= (mobile() ? 60 : 92)) km = v;});
        var length = km * kmUnit, x = W - (mobile() ? 20 : 34) - length, y = mobile() ? 34 : 52;
        ctx.beginPath();ctx.moveTo(x, y - 3);ctx.lineTo(x, y);ctx.lineTo(x + length, y);ctx.lineTo(x + length, y - 3);
        ctx.strokeStyle = rgba(palette.ink, .55);ctx.lineWidth = 1;ctx.stroke();
        label('约 ' + km + ' km', x, y - 12, {size: 9, color: rgba(palette.ink, .63)});
    }

    // ---------- frame ----------
    function requestDraw() {
        if (!pending) {pending = true;requestAnimationFrame(draw);}
    }
    function draw(now) {
        pending = false;
        if (tripStart) {
            var t = Math.min(1, (now - tripStart) / 900);
            tripBlend = mix(tripFrom, tripTo, smooth(t));
            if (t < 1) requestDraw();else tripStart = 0;
        }
        if (selectedTrip && tripBlend <= 0 && !tripStart) selectedTrip = null;
        var base = sceneCamera();
        camera = selectedTrip ? lerpCamera(base, tripView(), tripBlend) : base;
        labelBoxes = [];drawGeography();drawJourney();drawScale();
    }
    function resize() {
        var bounds = atlas.getBoundingClientRect();W = Math.max(1, Math.round(bounds.width));H = Math.max(1, Math.round(bounds.height));
        var dpr = Math.min(devicePixelRatio || 1, 2);canvas.width = Math.round(W * dpr);canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        buildViews();measure();updateFromScroll();requestDraw();
    }
    var resizeTimer;
    addEventListener('resize', () => {clearTimeout(resizeTimer);resizeTimer = setTimeout(resize, 120);});
    addEventListener('load', () => {measure();updateFromScroll();});
    addEventListener('pageshow', updateFromScroll);
    reduceQuery.addEventListener('change', event => {reduced = event.matches;});
    document.addEventListener('visibilitychange', () => {if (!document.hidden) updateFromScroll();});
    if (window.ResizeObserver) new ResizeObserver(() => {measure();updateFromScroll();}).observe(root.querySelector('[data-journey-flow]'));
    loadGeography();
    resize();
})();
