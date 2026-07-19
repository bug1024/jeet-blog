/* W-002 向北，再向南 — a self-contained personal geography viewer. */
(function () {
    var root = document.querySelector('[data-journey]');
    var canvas = document.querySelector('[data-journey-canvas]');
    var flow = document.querySelector('[data-journey-flow]');
    var dataNode = document.getElementById('journey-data');
    if (!root || !canvas || !flow || !dataNode) return;

    var data = JSON.parse(dataNode.textContent);
    var chapters = data.chapters;
    var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-journey-scene]'));
    var timeline = Array.prototype.slice.call(document.querySelectorAll('[data-journey-go]'));
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = canvas.getContext('2d');

    var PAPER = '#f5f7f6';
    var INK = [17, 26, 33];
    var STEEL = [54, 91, 109];
    var SLATE = [113, 131, 140];
    var AMBER = [177, 133, 65];
    var W = 0;
    var H = 0;
    var dpr = 1;

    /* A deliberately simplified outline: enough geography to locate the
       journey without turning this work into a conventional map product. */
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
        var rad = (lat * Math.PI) / 180;
        return (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
    }

    var cam = { x: 113, y: 31, s: 28, ox: 0, oy: 0 };
    var camFrom = null;
    var camTo = null;
    var camStart = 0;
    var camDuration = 920;
    var framePending = false;

    function project(lon, lat) {
        return [
            (lon - cam.x) * cam.s + W / 2 + cam.ox,
            -(mercY(lat) - cam.y) * cam.s + H / 2 + cam.oy
        ];
    }

    function ease(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function isMobile() {
        return W <= 760;
    }

    function fitView(points, pads, fill) {
        var minX = Infinity;
        var maxX = -Infinity;
        var minY = Infinity;
        var maxY = -Infinity;
        points.forEach(function (point) {
            var y = mercY(point[1]);
            minX = Math.min(minX, point[0]);
            maxX = Math.max(maxX, point[0]);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });
        var spanX = Math.max(maxX - minX, 0.7);
        var spanY = Math.max(maxY - minY, 0.55);
        var usableW = Math.max(120, W - pads.l - pads.r);
        var usableH = Math.max(120, H - pads.t - pads.b);
        return {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
            s: Math.min(usableW / spanX, usableH / spanY) * fill,
            ox: pads.l + usableW / 2 - W / 2,
            oy: pads.t + usableH / 2 - H / 2
        };
    }

    var LEVEL_SPAN = { '村': 0.3, '乡': 0.55, '县': 0.85, '市': 1.45, '省会': 1.45, '首都': 1.8 };

    function chapterView(chapter) {
        var points = [chapter.coords].concat((chapter.trips || []).map(function (trip) { return trip.coords; }));
        var pads = isMobile()
            ? { l: 24, r: 24, t: 58, b: H * 0.57 }
            : { l: 172, r: Math.min(520, W * 0.41), t: 62, b: 62 };
        if (points.length > 1) return fitView(points, pads, 0.82);

        var span = LEVEL_SPAN[chapter.level] || 1.2;
        var usableW = W - pads.l - pads.r;
        var usableH = H - pads.t - pads.b;
        return {
            x: chapter.coords[0],
            y: mercY(chapter.coords[1]),
            s: Math.min(usableW / span, usableH / span),
            ox: pads.l + usableW / 2 - W / 2,
            oy: pads.t + usableH / 2 - H / 2
        };
    }

    function overviewView() {
        var pads = isMobile()
            ? { l: 24, r: 24, t: 56, b: H * 0.56 }
            : { l: 172, r: Math.min(500, W * 0.4), t: 56, b: 56 };
        var country = [];
        LAND.forEach(function (ring) {
            ring.forEach(function (point) { country.push(point); });
        });
        return fitView(country, pads, 0.94);
    }

    var order = [-1];
    chapters.forEach(function (_, index) { order.push(index); });
    order.push(99);
    var active = -1;
    var selectedTrip = null;
    var tripTimer = null;

    function currentView() {
        if (active >= 0 && active !== 99) return chapterView(chapters[active]);
        return overviewView();
    }

    function requestDraw() {
        if (framePending) return;
        framePending = true;
        requestAnimationFrame(draw);
    }

    function flyTo(view, instant) {
        camFrom = { x: cam.x, y: cam.y, s: cam.s, ox: cam.ox, oy: cam.oy };
        camTo = view;
        camStart = performance.now();
        if (instant || reduced) {
            cam = { x: view.x, y: view.y, s: view.s, ox: view.ox, oy: view.oy };
            camStart = 0;
        }
        requestDraw();
    }

    function setScene(value) {
        if (order.indexOf(value) === -1 || value === active) return;
        active = value;
        selectedTrip = null;
        clearTimeout(tripTimer);
        root.setAttribute('data-journey-active', String(value));

        scenes.forEach(function (scene) {
            var on = Number(scene.getAttribute('data-journey-scene')) === value;
            scene.classList.toggle('is-active', on);
            scene.setAttribute('aria-hidden', on ? 'false' : 'true');
            scene.inert = !on;
        });
        timeline.forEach(function (button) {
            var on = Number(button.getAttribute('data-journey-go')) === value;
            button.classList.toggle('is-active', on);
            if (on) button.setAttribute('aria-current', 'step');
            else button.removeAttribute('aria-current');
        });

        var period = document.querySelector('[data-journey-mobile-period]');
        var count = document.querySelector('[data-journey-mobile-count]');
        if (value === -1) {
            period.textContent = data.span;
            count.textContent = '地图介绍';
        } else if (value === 99) {
            period.textContent = data.span;
            count.textContent = '完整轨迹';
        } else {
            period.textContent = chapters[value].period;
            count.textContent = ('0' + (value + 1)).slice(-2) + ' / ' + ('0' + chapters.length).slice(-2);
        }
        flyTo(currentView());
    }

    function move(delta) {
        var index = order.indexOf(active);
        setScene(order[Math.max(0, Math.min(order.length - 1, index + delta))]);
    }

    timeline.forEach(function (button) {
        button.addEventListener('click', function () {
            setScene(Number(button.getAttribute('data-journey-go')));
        });
    });
    document.querySelectorAll('[data-journey-next]').forEach(function (button) {
        button.addEventListener('click', function () { move(1); });
    });
    document.querySelectorAll('[data-journey-prev]').forEach(function (button) {
        button.addEventListener('click', function () { move(-1); });
    });

    var wheelLocked = false;
    root.addEventListener('wheel', function (event) {
        if (event.ctrlKey || Math.abs(event.deltaY) < 14) return;
        var card = event.target.closest('.journey-card');
        if (card && card.scrollHeight > card.clientHeight) {
            var canContinueDown = event.deltaY > 0 && card.scrollTop + card.clientHeight < card.scrollHeight - 2;
            var canContinueUp = event.deltaY < 0 && card.scrollTop > 2;
            if (canContinueDown || canContinueUp) return;
        }
        event.preventDefault();
        if (wheelLocked) return;
        wheelLocked = true;
        move(event.deltaY > 0 ? 1 : -1);
        window.setTimeout(function () { wheelLocked = false; }, reduced ? 180 : 720);
    }, { passive: false });

    flow.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown' || event.key === 'PageDown' || event.key === ' ') {
            event.preventDefault();
            move(1);
        } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
            event.preventDefault();
            move(-1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            setScene(-1);
        } else if (event.key === 'End') {
            event.preventDefault();
            setScene(99);
        }
    });

    var touchStart = null;
    root.addEventListener('touchstart', function (event) {
        if (event.target.closest('.journey-card, .journey-finale-inner, .journey-hero-copy')) return;
        touchStart = event.touches[0].clientY;
    }, { passive: true });
    root.addEventListener('touchend', function (event) {
        if (touchStart === null) return;
        var delta = touchStart - event.changedTouches[0].clientY;
        touchStart = null;
        if (Math.abs(delta) > 46) move(delta > 0 ? 1 : -1);
    }, { passive: true });

    document.querySelectorAll('[data-journey-trip]').forEach(function (button) {
        var section = button.closest('[data-journey-chapter]');
        var chapterIndex = Number(section.getAttribute('data-journey-chapter'));
        var tripIndex = Number(button.getAttribute('data-journey-trip'));
        function selectTrip() {
            selectedTrip = { chapter: chapterIndex, trip: tripIndex };
            document.querySelectorAll('[data-journey-trip]').forEach(function (item) { item.classList.remove('is-selected'); });
            button.classList.add('is-selected');
            clearTimeout(tripTimer);
            tripTimer = window.setTimeout(function () {
                selectedTrip = null;
                button.classList.remove('is-selected');
                requestDraw();
            }, 2800);
            requestDraw();
        }
        button.addEventListener('click', selectTrip);
        button.addEventListener('mouseenter', selectTrip);
    });

    function rgba(rgb, alpha) {
        return 'rgba(' + rgb.join(',') + ',' + alpha + ')';
    }

    function drawLand() {
        if (cam.s > 72) return;
        LAND.forEach(function (ring) {
            ctx.beginPath();
            ring.forEach(function (point, index) {
                var p = project(point[0], point[1]);
                if (index === 0) ctx.moveTo(p[0], p[1]);
                else ctx.lineTo(p[0], p[1]);
            });
            ctx.closePath();
            ctx.fillStyle = rgba(STEEL, 0.025);
            ctx.fill();
            ctx.strokeStyle = rgba(STEEL, 0.18);
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    }

    function drawGraticule() {
        var span = W / cam.s;
        var steps = [10, 5, 2.5, 1, 0.5, 0.25, 0.1, 0.05];
        var step = steps[steps.length - 1];
        for (var i = 0; i < steps.length; i++) {
            if (span / steps[i] >= 5) { step = steps[i]; break; }
        }
        var minLon = cam.x - (W / 2 + cam.ox) / cam.s;
        var maxLon = cam.x + (W / 2 - cam.ox) / cam.s;
        var lon = Math.floor(minLon / step) * step;
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(STEEL, 0.055);
        for (; lon <= maxLon + step; lon += step) {
            var x = project(lon, 0)[0];
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, H);
            ctx.stroke();
        }
        var maxLat = 55;
        var minLat = 15;
        var lat = Math.floor(maxLat / step) * step;
        for (; lat >= minLat; lat -= step) {
            var y = project(0, lat)[1];
            if (y < -40 || y > H + 40) continue;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(W, y);
            ctx.stroke();
        }
    }

    function arcPoints(from, to) {
        var p0 = project(from[0], from[1]);
        var p1 = project(to[0], to[1]);
        var mx = (p0[0] + p1[0]) / 2;
        var my = (p0[1] + p1[1]) / 2;
        var dx = p1[0] - p0[0];
        var dy = p1[1] - p0[1];
        var distance = Math.sqrt(dx * dx + dy * dy) || 1;
        var bend = Math.min(distance * 0.16, 90);
        return [p0, [mx - dy / distance * bend, my + dx / distance * bend], p1];
    }

    function strokeArc(from, to, color, width, alpha) {
        var points = arcPoints(from, to);
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        ctx.quadraticCurveTo(points[1][0], points[1][1], points[2][0], points[2][1]);
        ctx.strokeStyle = rgba(color, alpha);
        ctx.lineWidth = width;
        ctx.stroke();
    }

    function drawPoint(coords, color, activePoint, home) {
        var p = project(coords[0], coords[1]);
        if (activePoint || home) {
            ctx.fillStyle = rgba(color, 0.12);
            ctx.beginPath();
            ctx.arc(p[0], p[1], activePoint ? 13 : 10, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = rgba(color, activePoint ? 1 : 0.75);
        ctx.beginPath();
        ctx.arc(p[0], p[1], activePoint ? 3.4 : 2.2, 0, Math.PI * 2);
        ctx.fill();
        if (activePoint) {
            ctx.strokeStyle = rgba(color, 0.42);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p[0], p[1], 7, 0, Math.PI * 2);
            ctx.stroke();
        }
        return p;
    }

    function label(text, point, color, alpha, offsetY) {
        ctx.font = '12px "PingFang SC", "Hiragino Sans GB", sans-serif';
        ctx.fillStyle = rgba(color, alpha);
        ctx.fillText(text, point[0] + 10, point[1] + (offsetY || 4));
    }

    function backboneLabel(index) {
        return index === 0 || index === 4 || index === 7 || index === 8;
    }

    function drawJourney() {
        var upto = active === -1 || active === 99 ? chapters.length - 1 : active;
        var overview = active === -1 || active === 99;

        for (var i = 1; i < chapters.length; i++) {
            var visible = overview || i <= upto;
            if (!visible) continue;
            strokeArc(chapters[i - 1].coords, chapters[i].coords, STEEL, i === upto && !overview ? 2.1 : 1.15, overview ? 0.44 : 0.3);
        }

        if (active >= 0 && active !== 99) {
            var current = chapters[active];
            (current.trips || []).forEach(function (trip, tripIndex) {
                var selected = selectedTrip && selectedTrip.chapter === active && selectedTrip.trip === tripIndex;
                strokeArc(current.coords, trip.coords, SLATE, selected ? 1.9 : 1, selected ? 0.85 : 0.34);
                var tripPoint = drawPoint(trip.coords, SLATE, selected, false);
                if (selected) label(trip.place, tripPoint, INK, 0.9, 4);
            });
        }

        chapters.forEach(function (chapter, index) {
            var isCurrent = active === index;
            var isVisible = overview || index <= upto;
            if (!isVisible) return;
            var color = chapter.home ? AMBER : (isCurrent ? STEEL : INK);
            var point = drawPoint(chapter.coords, color, isCurrent, chapter.home);
            if (isCurrent || (overview && backboneLabel(index))) {
                label(chapter.place, point, color, isCurrent ? 0.95 : 0.72, 4);
            }
        });
    }

    function draw(now) {
        framePending = false;
        var animating = false;
        if (camStart && camTo) {
            var t = Math.min(1, (now - camStart) / camDuration);
            var e = ease(t);
            cam.x = camFrom.x + (camTo.x - camFrom.x) * e;
            cam.y = camFrom.y + (camTo.y - camFrom.y) * e;
            cam.s = camFrom.s + (camTo.s - camFrom.s) * e;
            cam.ox = camFrom.ox + (camTo.ox - camFrom.ox) * e;
            cam.oy = camFrom.oy + (camTo.oy - camFrom.oy) * e;
            animating = t < 1;
            if (!animating) camStart = 0;
        }

        ctx.fillStyle = PAPER;
        ctx.fillRect(0, 0, W, H);
        drawGraticule();
        drawLand();
        drawJourney();
        if (animating) requestDraw();
    }

    function resize() {
        var rect = root.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.round(rect.width);
        H = Math.round(rect.height);
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        flyTo(currentView(), true);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resize, 120);
    });
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) requestDraw();
    });

    resize();
    active = 999;
    setScene(-1);
})();
