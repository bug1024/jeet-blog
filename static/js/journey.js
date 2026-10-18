/* W-002 向北，再向南. Native page scrolling drives a persistent time/map record. */
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
    var scenes = Array.from(root.querySelectorAll('[data-journey-scene]'));
    var links = Array.from(root.querySelectorAll('[data-journey-go]'));
    var reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = reduceQuery.matches;
    var active = -1;
    var selectedTrip = null;
    var W = 0, H = 0;
    var pending = false, scrollPending = false;
    var camera = {x: 119, y: 36, s: 25, ox: 0, oy: 0};
    var fromCamera, toCamera, fromPalette, toPalette, animationStart = 0;
    // One paper-map palette throughout; only the geographical view changes.
    var palette = {paper: [244, 240, 230], land: [210, 200, 181], sea: [224, 231, 225], ink: [37, 43, 41]};
    var themes = {warm: palette, neutral: palette, cool: palette};
    var STEEL = [102, 122, 121], ROUTE = [163, 65, 50];
    var labelBoxes = [];
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

    function mercY(lat) {
        return Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * 180 / Math.PI;
    }
    function rgba(rgb, alpha) {return 'rgba(' + rgb.join(',') + ',' + alpha + ')';}
    function mix(a, b, t) {return a + (b - a) * t;}
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
        var pads = mobile() ? {l: 45, r: 48, t: 35, b: 45} : {l: 90, r: 110, t: 80, b: 110};
        var usableW = Math.max(W - pads.l - pads.r, 90);
        var usableH = Math.max(H - pads.t - pads.b, 85);
        return {x: (minX + maxX) / 2, y: (minY + maxY) / 2,
            s: Math.min(usableW / dx, usableH / dy) * .80,
            ox: (pads.l - pads.r) / 2, oy: (pads.t - pads.b) / 2};
    }
    function currentView() {
        if (active < 0 || active === 99) return fit(chapters.map(c => c.coords), 6);
        // Previously lived places stay in the map, even after a move to another city.
        var points = chapters.slice(0, active + 1).map(c => c.coords);
        if (selectedTrip) points.push(chapters[active].trips[selectedTrip.trip].coords);
        return fit(points, active < 4 ? .09 : 2.0);
    }
    function requestDraw() {
        if (!pending) {pending = true;requestAnimationFrame(draw);}
    }
    function flyTo(instant) {
        fromCamera = Object.assign({}, camera);toCamera = currentView();
        fromPalette = JSON.parse(JSON.stringify(palette));
        toPalette = themes[active >= 0 && active !== 99 ? chapters[active].theme : active === 99 ? 'neutral' : 'warm'];
        animationStart = instant || reduced ? 0 : performance.now();
        if (!animationStart) {camera = Object.assign({}, toCamera);palette = JSON.parse(JSON.stringify(toPalette));}
        requestDraw();
    }
    function setScene(value, instant) {
        if (value === active && !instant) return;
        active = value;
        selectedTrip = null;
        root.querySelectorAll('[data-journey-trip]').forEach(button => button.setAttribute('aria-pressed', 'false'));
        root.dataset.journeyActive = String(value);
        var chapter = value >= 0 && value !== 99 ? chapters[value] : null;
        root.dataset.tone = chapter ? chapter.theme : value === 99 ? 'neutral' : 'warm';
        root.querySelector('[data-journey-map-place]').textContent = chapter ? chapter.place : '闽东 · 福州 · 北京 · 南京';
        links.forEach(link => {
            var n = Number(link.dataset.journeyGo);
            link.parentNode.classList.toggle('is-read', value === 99 || n < value);
            link.parentNode.classList.toggle('is-active', n === value);
            if (n === value) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
        });
        scenes.forEach(scene => scene.classList.toggle('is-active', Number(scene.dataset.journeyScene) === value));
        flyTo(instant);
    }
    function updateFromScroll() {
        scrollPending = false;
        var threshold = mobile() ? atlas.getBoundingClientRect().bottom + 94 : 58 + Math.min(240, (innerHeight - 58) * .35);
        var next = -1;
        scenes.forEach(scene => {if (scene.getBoundingClientRect().top <= threshold) next = Number(scene.dataset.journeyScene);});
        if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) next = 99;
        setScene(next);
    }
    addEventListener('scroll', function () {
        if (!scrollPending) {scrollPending = true;requestAnimationFrame(updateFromScroll);}
    }, {passive: true});
    root.querySelectorAll('[data-journey-trip]').forEach(button => {
        button.addEventListener('click', function () {
            var section = button.closest('[data-journey-chapter]');
            var index = Number(section.dataset.journeyChapter), trip = Number(button.dataset.journeyTrip);
            var deselect = selectedTrip && selectedTrip.chapter === index && selectedTrip.trip === trip;
            if (active !== index) setScene(index);
            selectedTrip = deselect ? null : {chapter: index, trip};
            root.querySelectorAll('[data-journey-trip]').forEach(item => item.setAttribute('aria-pressed', String(item === button && !deselect)));
            flyTo(false);
        });
    });
    root.querySelectorAll('.journey-trips').forEach(details => {
        details.addEventListener('toggle', () => {
            if (!details.open && selectedTrip && Number(details.closest('[data-journey-chapter]').dataset.journeyChapter) === selectedTrip.chapter) {
                selectedTrip = null;
                details.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', 'false'));
                flyTo(false);
            }
        });
    });

    function pathRing(ring) {
        ctx.beginPath();ring.forEach((p, i) => {var q = project(p);if (i) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);});ctx.closePath();
    }
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
    function drawGeography() {
        var local = camera.s > 220;
        ctx.fillStyle = rgba(local ? palette.land : palette.sea, 1);ctx.fillRect(0, 0, W, H);
        if (!local) LAND.forEach(ring => {
            pathRing(ring);ctx.fillStyle = rgba(palette.land, 1);ctx.fill();
            ctx.strokeStyle = rgba(palette.ink, .12);ctx.lineWidth = 1;ctx.stroke();
        });
    }
    function curve(from, to, color, width, alpha, dashed) {
        var a = project(from), b = project(to), dx = b[0] - a[0], dy = b[1] - a[1];
        var length = Math.hypot(dx, dy) || 1, bend = Math.min(length * .13, 55);
        ctx.beginPath();ctx.moveTo(a[0], a[1]);
        ctx.quadraticCurveTo((a[0] + b[0]) / 2 - dy / length * bend, (a[1] + b[1]) / 2 + dx / length * bend, b[0], b[1]);
        ctx.lineWidth = width;ctx.strokeStyle = rgba(color, alpha);ctx.setLineDash(dashed ? [3, 5] : []);ctx.stroke();ctx.setLineDash([]);
    }
    function point(chapter, current, overview, index) {
        var p = project(chapter.coords);
        if (p[0] < -50 || p[0] > W + 50 || p[1] < -50 || p[1] > H + 50) return;
        var color = current ? ROUTE : STEEL;
        ctx.beginPath();ctx.arc(p[0], p[1], current ? 5 : overview && [0, 4, 7, 8].includes(index) ? 4 : 2.4, 0, Math.PI * 2);
        ctx.fillStyle = rgba(color, current || active === 99 ? .95 : .63);ctx.fill();
        var shouldLabel = current || (overview && [0, 4, 7, 8].includes(index)) || (!overview && active < 4);
        if (shouldLabel) {
            var text = chapter.place;
            if (overview && index === 0) text = '寿宁';
            var offset = index === 0 ? 16 : index === 2 ? 16 : -13;
            if (overview && index === 4) offset = 15;
            label(text, p[0] + 10, p[1] + offset, {size: current ? 13 : 11, color: rgba(color, .97), avoid: true});
        }
    }
    function drawJourney() {
        var overview = active === -1 || active === 99, upto = overview ? chapters.length - 1 : active;
        for (var i = 1; i <= upto; i++) {
            curve(chapters[i - 1].coords, chapters[i].coords, ROUTE, 2, i === active || overview ? .95 : .72);
        }
        chapters.forEach((chapter, index) => {if (index <= upto) point(chapter, index === active, overview, index);});
        if (selectedTrip && active >= 0 && active !== 99) {
            var trip = chapters[active].trips[selectedTrip.trip];
            curve(chapters[active].coords, trip.coords, palette.ink, 1, .65, true);
            var p = project(trip.coords);ctx.beginPath();ctx.arc(p[0], p[1], 3, 0, Math.PI * 2);ctx.fillStyle = rgba(palette.ink, .8);ctx.fill();
            label(trip.year + ' · ' + trip.place, p[0] + 9, p[1] - 10, {size: 11, avoid: true});
        }
    }
    function drawScale() {
        var kmUnit = camera.s / (111.32 * Math.cos((active >= 0 && active !== 99 ? chapters[active].coords[1] : 30) * Math.PI / 180));
        var choices = [.5, 1, 2, 5, 10, 20, 50, 100, 200, 500], km = .5;
        choices.forEach(v => {if (v * kmUnit <= (mobile() ? 60 : 92)) km = v;});
        var length = km * kmUnit, x = W - (mobile() ? 85 : 128), y = mobile() ? H - 24 : H - 42;
        ctx.beginPath();ctx.moveTo(x, y - 3);ctx.lineTo(x, y);ctx.lineTo(x + length, y);ctx.lineTo(x + length, y - 3);
        ctx.strokeStyle = rgba(palette.ink, .55);ctx.lineWidth = 1;ctx.stroke();
        label('约 ' + km + ' km', x, y - 12, {size: 9, color: rgba(palette.ink, .63)});
    }
    function draw(now) {
        pending = false;
        if (animationStart) {
            var t = Math.min(1, (now - animationStart) / 1050), ease = t * t * (3 - 2 * t);
            Object.keys(camera).forEach(k => {camera[k] = mix(fromCamera[k], toCamera[k], ease);});
            Object.keys(palette).forEach(k => {palette[k] = fromPalette[k].map((v, i) => mix(v, toPalette[k][i], ease));});
            if (t < 1) requestDraw();else animationStart = 0;
        }
        labelBoxes = [];drawGeography();drawJourney();drawScale();
    }
    function resize() {
        var bounds = atlas.getBoundingClientRect();W = Math.max(1, Math.round(bounds.width));H = Math.max(1, Math.round(bounds.height));
        var dpr = Math.min(devicePixelRatio || 1, 2);canvas.width = Math.round(W * dpr);canvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);flyTo(true);updateFromScroll();
    }
    var resizeTimer;
    addEventListener('resize', () => {clearTimeout(resizeTimer);resizeTimer = setTimeout(resize, 120);});
    addEventListener('pageshow', updateFromScroll);
    reduceQuery.addEventListener('change', event => {reduced = event.matches;flyTo(true);});
    document.addEventListener('visibilitychange', () => {if (!document.hidden) updateFromScroll();});
    setScene(-1, true);resize();
})();
