/* W-002 向北，再向南 — canvas engine: a night flight over one life.
   No dependencies: mercator projection, tweened camera, growing arcs, HUD. */
(function () {
    var root = document.querySelector('[data-journey]');
    var canvas = document.querySelector('[data-journey-canvas]');
    var dataNode = document.getElementById('journey-data');
    if (!root || !canvas || !dataNode) return;

    var data = JSON.parse(dataNode.textContent);
    var chapters = data.chapters;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ctx = canvas.getContext('2d');

    var INK = [237, 242, 241];
    var STEEL = [142, 175, 186];
    var AMBER = [232, 192, 122];
    var NIGHT = '#0d1418';

    var W = 0;
    var H = 0;
    var dpr = 1;

    /* ---------- projection ---------- */
    function mercY(lat) {
        var rad = (lat * Math.PI) / 180;
        return (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
    }

    function invMercY(wy) {
        return ((Math.atan(Math.exp((wy * Math.PI) / 180)) * 2 - Math.PI / 2) * 180) / Math.PI;
    }

    /* camera: center in world coords (lon, merc-deg), s = px per degree, ox/oy = screen offset */
    var cam = { x: 113, y: 30, s: 40, ox: 0, oy: 0 };
    var camFrom = null;
    var camTo = null;
    var camT = 1;
    var CAM_DUR = 1600;

    function project(lon, lat) {
        return [
            (lon - cam.x) * cam.s + W / 2 + cam.ox,
            -(mercY(lat) - cam.y) * cam.s + H / 2 + cam.oy
        ];
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function flyTo(view, instant) {
        camFrom = { x: cam.x, y: cam.y, s: cam.s, ox: cam.ox, oy: cam.oy };
        camTo = view;
        camT = instant || reduced ? 1 : 0;
        if (camT === 1) {
            cam = { x: view.x, y: view.y, s: view.s, ox: view.ox, oy: view.oy };
        }
    }

    /* ---------- views ---------- */
    var LEVEL_SPAN = { '村': 0.32, '乡': 0.55, '县': 0.85, '市': 1.5, '省会': 1.5, '首都': 1.9 };

    function isMobile() {
        return W <= 720;
    }

    function chapterView(chapter) {
        var pts = [[chapter.coords[0], chapter.coords[1]]];
        (chapter.trips || []).forEach(function (t) { pts.push(t.coords); });
        var padR = isMobile() ? 30 : Math.min(500, W * 0.42);
        var padL = isMobile() ? 30 : 70;
        var padT = isMobile() ? 50 : 90;
        var padB = isMobile() ? H * 0.62 : 90;
        if (pts.length === 1) {
            var span = LEVEL_SPAN[chapter.level] || 1.2;
            var s = Math.min((W - padL - padR) / span, (H - padT - padB) / span);
            return {
                x: chapter.coords[0],
                y: mercY(chapter.coords[1]),
                s: s,
                ox: (padL + (W - padL - padR) / 2) - W / 2,
                oy: (padT + (H - padT - padB) / 2) - H / 2
            };
        }
        return fitView(pts, { l: padL, r: padR, t: padT, b: padB }, 0.9);
    }

    function fitView(pts, pads, fill) {
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        pts.forEach(function (p) {
            var y = mercY(p[1]);
            minX = Math.min(minX, p[0]);
            maxX = Math.max(maxX, p[0]);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });
        var spanX = Math.max(maxX - minX, 0.8);
        var spanY = Math.max(maxY - minY, 0.6);
        var usableW = W - pads.l - pads.r;
        var usableH = H - pads.t - pads.b;
        var s = Math.min(usableW / spanX, usableH / spanY) * fill;
        return {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
            s: s,
            ox: (pads.l + usableW / 2) - W / 2,
            oy: (pads.t + usableH / 2) - H / 2
        };
    }

    function allPoints() {
        var pts = [];
        chapters.forEach(function (c) {
            pts.push(c.coords);
            (c.trips || []).forEach(function (t) { pts.push(t.coords); });
        });
        return pts;
    }

    function heroView() {
        var pad = isMobile() ? 30 : 70;
        return fitView(allPoints(), { l: pad, r: pad, t: pad + 40, b: pad }, 0.96);
    }

    function finaleView() {
        var pad = isMobile() ? 26 : 60;
        return fitView(allPoints(), { l: pad, r: pad, t: pad, b: isMobile() ? H * 0.42 : pad }, isMobile() ? 0.98 : 0.94);
    }

    /* ---------- state ---------- */
    var visited = chapters.map(function () { return false; });
    var legs = [];          /* main arcs between chapter i-1 and i */
    var tripArcs = [];      /* per chapter: arcs base -> trip */
    var activeChapter = -1; /* -1 hero, 0..n chapter, 99 finale */
    var flashes = [];       /* {c, t, start} chip-triggered arc replays */
    var statsPlayed = false;

    chapters.forEach(function (c, i) {
        if (i > 0) legs.push({ from: i - 1, to: i, progress: 0, anim: -1 });
        tripArcs.push((c.trips || []).map(function () { return { progress: 0, anim: -1 }; }));
    });

    /* ---------- sprites ---------- */
    function makeGlow(rgb) {
        var c = document.createElement('canvas');
        c.width = c.height = 64;
        var g = c.getContext('2d');
        var grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(' + rgb.join(',') + ',0.85)');
        grad.addColorStop(0.28, 'rgba(' + rgb.join(',') + ',0.28)');
        grad.addColorStop(1, 'rgba(' + rgb.join(',') + ',0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        return c;
    }
    var glowInk = makeGlow(INK);
    var glowAmber = makeGlow(AMBER);
    var glowSteel = makeGlow(STEEL);

    /* ---------- stars (screen space, slight parallax) ---------- */
    var stars = [];
    function seedStars() {
        stars = [];
        var n = Math.round((W * H) / 5200);
        for (var i = 0; i < n; i++) {
            stars.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: 0.4 + Math.random() * 0.9,
                a: 0.05 + Math.random() * 0.2,
                p: Math.random() * Math.PI * 2,
                sp: 0.4 + Math.random() * 1.2
            });
        }
    }

    /* ---------- resize ---------- */
    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seedStars();
        /* re-apply current view without animation */
        flyTo(currentView(), true);
        camT = 1;
    }

    function currentView() {
        if (activeChapter === 99) return finaleView();
        if (activeChapter >= 0) return chapterView(chapters[activeChapter]);
        return heroView();
    }

    /* ---------- scroll driver ---------- */
    function activate(idx) {
        if (idx === activeChapter) return;
        activeChapter = idx;
        if (idx !== -1) {
            /* a life is continuous: light everything up to the current point,
               even if the reader scrolled past some chapters quickly */
            var upto = idx === 99 ? chapters.length - 1 : idx;
            for (var k = 0; k <= upto; k++) {
                visited[k] = true;
                if (k > 0 && legs[k - 1].anim < 0) legs[k - 1].anim = 0;
                var arcs = tripArcs[k];
                for (var t = 0; t < arcs.length; t++) {
                    if (arcs[t].anim < 0) arcs[t].anim = idx === 99 ? 0 : -0.14 * (t + 1); /* stagger */
                }
            }
        }
        root.setAttribute('data-journey-active', String(idx));
        flyTo(currentView());
        document.querySelectorAll('[data-journey-chapter]').forEach(function (el) {
            el.classList.toggle('is-active', Number(el.getAttribute('data-journey-chapter')) === idx);
        });
        if (idx === 99 && !statsPlayed) {
            statsPlayed = true;
            playStats();
        }
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var el = entry.target;
            if (el.hasAttribute('data-journey-hero')) activate(-1);
            else if (el.hasAttribute('data-journey-finale')) activate(99);
            else activate(Number(el.getAttribute('data-journey-chapter')));
        });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });

    document.querySelectorAll('[data-journey-hero], [data-journey-chapter], [data-journey-finale]').forEach(function (el) {
        observer.observe(el);
    });

    /* trip chips flash the matching arc */
    document.querySelectorAll('[data-journey-trip]').forEach(function (btn) {
        var section = btn.closest('[data-journey-chapter]');
        var cIdx = Number(section.getAttribute('data-journey-chapter'));
        var tIdx = Number(btn.getAttribute('data-journey-trip'));
        function flash() {
            flashes.push({ c: cIdx, t: tIdx, start: performance.now() });
        }
        btn.addEventListener('click', flash);
        btn.addEventListener('mouseenter', flash);
    });

    /* ---------- stats ---------- */
    function haversine(a, b) {
        var R = 6371;
        var dLa = ((b[1] - a[1]) * Math.PI) / 180;
        var dLo = ((b[0] - a[0]) * Math.PI) / 180;
        var la1 = (a[1] * Math.PI) / 180;
        var la2 = (b[1] * Math.PI) / 180;
        var h = Math.sin(dLa / 2) * Math.sin(dLa / 2) + Math.cos(la1) * Math.cos(la2) * Math.sin(dLo / 2) * Math.sin(dLo / 2);
        return 2 * R * Math.asin(Math.sqrt(h));
    }

    function computeStats() {
        var names = {};
        var km = 0;
        var tripCount = 0;
        var minYear = chapters[0].year;
        var maxYear = minYear;
        chapters.forEach(function (c, i) {
            names[c.place] = true;
            if (i > 0) km += haversine(chapters[i - 1].coords, c.coords);
            (c.trips || []).forEach(function (t) {
                names[t.place] = true;
                tripCount++;
                km += 2 * haversine(c.coords, t.coords);
                maxYear = Math.max(maxYear, t.year);
            });
        });
        return {
            places: Object.keys(names).length,
            legs: chapters.length - 1 + tripCount,
            km: Math.round(km / 100) * 100,
            years: maxYear - minYear
        };
    }

    var stats = computeStats();
    var statStart = -1;

    function playStats() {
        statStart = performance.now();
        if (reduced) {
            renderStats(1);
        }
    }

    function renderStats(p) {
        var e = 1 - Math.pow(1 - p, 3);
        setStat('places', Math.round(stats.places * e));
        setStat('legs', Math.round(stats.legs * e));
        setStat('km', String(Math.round((stats.km * e) / 100) * 100).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
        setStat('years', Math.round(stats.years * e));
    }

    function setStat(key, value) {
        var el = document.querySelector('[data-stat-' + key + ']');
        if (el) el.textContent = value;
    }

    /* ---------- HUD ---------- */
    var hudCoord = document.querySelector('[data-hud-coord]');
    var hudAlt = document.querySelector('[data-hud-alt]');
    var hudChapter = document.querySelector('[data-hud-chapter]');
    var lastHud = '';

    function updateHud() {
        var lat = invMercY(cam.y);
        var spanKm = Math.round(((W / cam.s) * 111.32 * Math.cos((lat * Math.PI) / 180)) / 10) * 10;
        var label;
        if (activeChapter === 99) label = 'FULL TRAJECTORY';
        else if (activeChapter >= 0) label = 'CH ' + ('0' + (activeChapter + 1)).slice(-2) + '/' + ('0' + chapters.length).slice(-2) + ' · ' + chapters[activeChapter].period;
        else label = data.span;
        var text = lat.toFixed(2) + '|' + cam.x.toFixed(2) + '|' + spanKm + '|' + label;
        if (text === lastHud) return;
        lastHud = text;
        if (hudCoord) hudCoord.textContent = Math.abs(lat).toFixed(2) + '°N ' + Math.abs(cam.x).toFixed(2) + '°E';
        if (hudAlt) hudAlt.textContent = 'ALT ' + spanKm + 'KM';
        if (hudChapter) hudChapter.textContent = label;
    }

    /* ---------- drawing ---------- */
    function quadPoints(p0, p1) {
        var mx = (p0[0] + p1[0]) / 2;
        var my = (p0[1] + p1[1]) / 2;
        var dx = p1[0] - p0[0];
        var dy = p1[1] - p0[1];
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var bend = Math.min(dist * 0.2, 130);
        var cx = mx + (-dy / dist) * bend;
        var cy = my + (dx / dist) * bend;
        var pts = [];
        var N = 56;
        for (var i = 0; i <= N; i++) {
            var t = i / N;
            var u = 1 - t;
            pts.push([u * u * p0[0] + 2 * u * t * cx + t * t * p1[0], u * u * p0[1] + 2 * u * t * cy + t * t * p1[1]]);
        }
        return pts;
    }

    function strokeArc(pts, progress, rgb, width, alpha) {
        if (progress <= 0) return;
        var upto = Math.max(2, Math.floor(pts.length * Math.min(progress, 1)));
        ctx.strokeStyle = 'rgba(' + rgb.join(',') + ',' + alpha * 0.22 + ')';
        ctx.lineWidth = width * 3;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (var i = 1; i < upto; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(' + rgb.join(',') + ',' + alpha + ')';
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (var j = 1; j < upto; j++) ctx.lineTo(pts[j][0], pts[j][1]);
        ctx.stroke();
    }

    function drawPoint(lon, lat, sprite, size, coreR, rgb, alpha) {
        var p = project(lon, lat);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, p[0] - size / 2, p[1] - size / 2, size, size);
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'rgba(' + rgb.join(',') + ',' + Math.min(1, alpha + 0.2) + ')';
        ctx.beginPath();
        ctx.arc(p[0], p[1], coreR, 0, Math.PI * 2);
        ctx.fill();
        return p;
    }

    function drawLabel(text, p, alpha, size) {
        ctx.font = size + 'px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
        ctx.fillStyle = 'rgba(237,242,241,' + alpha + ')';
        ctx.fillText(text, p[0] + 12, p[1] + 4);
    }

    function drawGraticule() {
        var showLabels = W > 720;
        var spanDeg = W / cam.s;
        var steps = [10, 5, 2.5, 1, 0.5, 0.25, 0.1, 0.05];
        var step = steps[0];
        for (var i = 0; i < steps.length; i++) {
            if (spanDeg / steps[i] >= 4) { step = steps[i]; break; }
            step = steps[i];
        }
        var topLeftLon = cam.x - (W / 2 + cam.ox) / cam.s;
        var bottomRightLon = cam.x + (W - W / 2 - cam.ox) / cam.s;
        ctx.lineWidth = 1;
        ctx.font = '10px "SFMono-Regular", Consolas, monospace';
        var lon = Math.floor(topLeftLon / step) * step;
        for (; lon <= bottomRightLon + step; lon += step) {
            var sx = (lon - cam.x) * cam.s + W / 2 + cam.ox;
            if (sx < -50 || sx > W + 50) continue;
            ctx.strokeStyle = 'rgba(142,175,186,0.055)';
            ctx.beginPath();
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, H);
            ctx.stroke();
            if (showLabels) {
                ctx.fillStyle = 'rgba(142,175,186,0.32)';
                ctx.fillText(lon.toFixed(step < 1 ? 1 : 0) + '°E', sx + 5, H - 10);
            }
        }
        /* latitude lines: unproject screen top, walk downward */
        var latTop = invMercY(cam.y + (H / 2 + cam.oy) / cam.s);
        var lat = Math.ceil(latTop / step) * step;
        for (; lat > -60; lat -= step) {
            var sy = -(mercY(lat) - cam.y) * cam.s + H / 2 + cam.oy;
            if (sy > H + 50) break;
            if (sy < -50) continue;
            ctx.strokeStyle = 'rgba(142,175,186,0.055)';
            ctx.beginPath();
            ctx.moveTo(0, sy);
            ctx.lineTo(W, sy);
            ctx.stroke();
            if (showLabels) {
                ctx.fillStyle = 'rgba(142,175,186,0.32)';
                ctx.fillText(Math.abs(lat).toFixed(step < 1 ? 1 : 0) + '°N', 10, sy - 5);
            }
        }
    }

    /* ---------- main loop ---------- */
    var lastFrame = performance.now();

    function frame(now) {
        var dt = Math.min(now - lastFrame, 50);
        lastFrame = now;

        /* camera tween */
        if (camT < 1 && camTo) {
            camT = Math.min(1, camT + dt / CAM_DUR);
            var e = easeInOutCubic(camT);
            cam.x = camFrom.x + (camTo.x - camFrom.x) * e;
            cam.y = camFrom.y + (camTo.y - camFrom.y) * e;
            cam.s = camFrom.s + (camTo.s - camFrom.s) * e;
            cam.ox = camFrom.ox + (camTo.ox - camFrom.ox) * e;
            cam.oy = camFrom.oy + (camTo.oy - camFrom.oy) * e;
        }

        ctx.fillStyle = NIGHT;
        ctx.fillRect(0, 0, W, H);

        /* stars */
        var driftX = reduced ? 0 : (cam.x - 113) * 1.2;
        var driftY = reduced ? 0 : (cam.y - 30) * 1.2;
        stars.forEach(function (s) {
            var tw = reduced ? 1 : 0.75 + 0.25 * Math.sin(now / 1000 * s.sp + s.p);
            var sx = ((s.x - driftX) % W + W) % W;
            var sy = ((s.y - driftY) % H + H) % H;
            ctx.fillStyle = 'rgba(237,242,241,' + (s.a * tw).toFixed(3) + ')';
            ctx.fillRect(sx, sy, s.r, s.r);
        });

        drawGraticule();

        var i, j, c, p;

        /* trip arcs (under main arcs) */
        for (i = 0; i < chapters.length; i++) {
            c = chapters[i];
            if (!c.trips) continue;
            for (j = 0; j < c.trips.length; j++) {
                var arc = tripArcs[i][j];
                if (arc.anim >= 0 && arc.anim < 1) {
                    arc.anim = Math.min(1, arc.anim + dt / 1200);
                    arc.progress = 1 - Math.pow(1 - arc.anim, 3);
                } else if (arc.anim > -1 && arc.anim < 0) {
                    arc.anim = Math.min(0, arc.anim + dt / 1200);
                    if (arc.anim === 0) arc.anim = 0.0001;
                }
                if (arc.progress <= 0) continue;
                var alpha = 0.5;
                for (var f = 0; f < flashes.length; f++) {
                    if (flashes[f].c === i && flashes[f].t === j) {
                        var age = (now - flashes[f].start) / 1200;
                        if (age < 1) alpha = 0.5 + 0.5 * Math.sin(age * Math.PI);
                    }
                }
                var pts = quadPoints(project(c.coords[0], c.coords[1]), project(c.trips[j].coords[0], c.trips[j].coords[1]));
                strokeArc(pts, arc.progress, STEEL, 1, alpha);
                if (arc.progress > 0.6) {
                    var tp = project(c.trips[j].coords[0], c.trips[j].coords[1]);
                    ctx.drawImage(glowSteel, tp[0] - 7, tp[1] - 7, 14, 14);
                    ctx.fillStyle = 'rgba(142,175,186,0.9)';
                    ctx.beginPath();
                    ctx.arc(tp[0], tp[1], 1.4, 0, Math.PI * 2);
                    ctx.fill();
                    var showTripLabel = activeChapter === i || activeChapter === 99;
                    if (showTripLabel) {
                        ctx.font = '10px "PingFang SC", sans-serif';
                        ctx.fillStyle = 'rgba(142,175,186,0.55)';
                        ctx.fillText(c.trips[j].place, tp[0] + 7, tp[1] + 3);
                    }
                }
            }
        }

        /* main arcs */
        for (i = 0; i < legs.length; i++) {
            var leg = legs[i];
            if (leg.anim >= 0 && leg.anim < 1) {
                leg.anim = Math.min(1, leg.anim + dt / 1500);
                leg.progress = 1 - Math.pow(1 - leg.anim, 3);
            }
            if (leg.progress <= 0) continue;
            var a = chapters[leg.from];
            var b = chapters[leg.to];
            strokeArc(quadPoints(project(a.coords[0], a.coords[1]), project(b.coords[0], b.coords[1])), leg.progress, INK, 1.4, 0.85);
        }

        /* chapter points + labels */
        for (i = 0; i < chapters.length; i++) {
            c = chapters[i];
            var isActive = activeChapter === i;
            var isVisited = visited[i];
            if (c.home) {
                p = drawPoint(c.coords[0], c.coords[1], glowAmber, 30, 2.4, AMBER, 1);
                if (isActive || activeChapter === -1) drawLabel(c.place, p, 0.95, 12);
                else if (!isMobile()) drawLabel(c.place, p, 0.6, 12);
                continue;
            }
            if (!isVisited) continue;
            var size = isActive ? 30 : 22;
            var alphaP = isActive ? 1 : 0.7;
            p = drawPoint(c.coords[0], c.coords[1], glowInk, size, 2.1, INK, alphaP);
            if (isActive) drawLabel(c.place, p, 0.95, 12);
            else if (!isMobile()) drawLabel(c.place, p, 0.55, 12);
            if (c.current && !reduced) {
                var pulse = ((now / 2000) % 1);
                ctx.strokeStyle = 'rgba(237,242,241,' + (0.5 * (1 - pulse)).toFixed(3) + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(p[0], p[1], 5 + pulse * 15, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        /* expired flashes */
        flashes = flashes.filter(function (f) { return now - f.start < 1200; });

        /* stats count-up */
        if (statStart > 0) {
            var sp = Math.min(1, (now - statStart) / 1400);
            if (!reduced) renderStats(sp);
            if (sp >= 1) statStart = 0;
        }

        updateHud();
        requestAnimationFrame(frame);
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 120);
    });

    resize();
    activate(-1);
    visited[0] = true;
    requestAnimationFrame(frame);
})();
