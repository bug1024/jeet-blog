// Page curl for the site's picture books.
//
// A turning page folds along a straight line that follows the page corner. The part of the page beyond the fold is
// mirrored back over the page as the paper's reverse side (faintly showing the print through it), and the page
// underneath is revealed with a soft shadow. Everything is drawn in a "stage" of cloned pages laid over the real
// page, so a book only changes its own DOM once a turn is committed. See docs/picture-book-page-curl.md.
(() => {
    const easeInOut = (t) => (t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    const easeOut = (t) => 1 - (1 - t) ** 3;

    // Keep the part of a polygon on one side of the line through m perpendicular to d.
    function clip(points, m, d, sign) {
        const side = (p) => ((p[0] - m[0]) * d[0] + (p[1] - m[1]) * d[1]) * sign;
        const out = [];
        points.forEach((a, i) => {
            const b = points[(i + 1) % points.length];
            const sa = side(a), sb = side(b);
            if (sa >= 0) out.push(a);
            if ((sa >= 0) !== (sb >= 0)) {
                const t = sa / (sa - sb);
                out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
            }
        });
        return out;
    }
    const polygon = (points) => (points.length > 2
        ? `polygon(${points.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(",")})`
        : "polygon(0 0, 0 0, 0 0)");

    function div(className, parent) {
        const item = document.createElement("div");
        item.className = className;
        parent.append(item);
        return item;
    }

    // Lay a strip along the fold: its left edge sits on the fold line and it points along `angle`.
    function alongFold(item, m, angle, size) {
        item.style.width = item.style.height = `${size}px`;
        item.style.transform = `translate(${m[0]}px, ${m[1]}px) rotate(${angle}rad) translateY(${-size / 2}px)`;
    }

    // options.host: positioned element the stage is added to.
    // options.rect: { left, top, width, height } of the page, relative to the host's content.
    // options.turning: element (usually a clone) for the page that turns; options.under: the page revealed below it.
    // options.corner: "bottom" or "top", which corner of the outer edge lifts.
    // Progress 0 = the turning page lies flat; 1 = it has turned over into the spine.
    function start({ host, rect, turning, under, corner = "bottom", paper = "#faf4e6" }) {
        const W = rect.width, H = rect.height, diagonal = Math.hypot(W, H), size = diagonal * 2.2;
        const cornerY = corner === "top" ? 0 : H;
        const C = [W, cornerY];
        const stage = div("page-curl", host);
        Object.assign(stage.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${W}px`, height: `${H}px` });
        stage.style.setProperty("--page-curl-paper", paper);

        const underLayer = div("page-curl-under", stage);
        underLayer.append(under);
        const cast = div("page-curl-cast", underLayer);
        const front = div("page-curl-front", stage);
        front.append(turning);
        const bend = div("page-curl-bend", front);
        const flapShadow = div("page-curl-flap-shadow", stage);
        const flap = div("page-curl-flap", flapShadow);
        const back = div("page-curl-back", flap);
        const seeThrough = turning.cloneNode(true);
        back.append(seeThrough);
        const sheen = div("page-curl-sheen", flap);
        [under, turning, seeThrough].forEach((page) => {
            page.inert = true;
            page.setAttribute("aria-hidden", "true");
            Object.assign(page.style, { width: `${W}px`, height: `${H}px`, margin: 0 });
        });

        const rectangle = [[0, 0], [W, 0], [W, H], [0, H]];
        let P = C.slice();

        // The paper cannot stretch: the corner stays within reach of both ends of the spine.
        function constrain([x, y]) {
            const near = [0, cornerY], far = [0, H - cornerY];
            let p = [x, y];
            for (const [pivot, radius] of [[near, W], [far, diagonal]]) {
                const dx = p[0] - pivot[0], dy = p[1] - pivot[1], length = Math.hypot(dx, dy);
                if (length > radius) p = [pivot[0] + dx / length * radius, pivot[1] + dy / length * radius];
            }
            return p;
        }

        function draw(point) {
            P = constrain(point);
            const dx = P[0] - C[0], dy = P[1] - C[1], length = Math.hypot(dx, dy);
            if (length < .5) {
                front.style.clipPath = "none";
                flapShadow.style.visibility = cast.style.visibility = bend.style.visibility = "hidden";
                return;
            }
            const d = [dx / length, dy / length], m = [(C[0] + P[0]) / 2, (C[1] + P[1]) / 2];
            const angle = Math.atan2(d[1], d[0]);
            // How far through the turn we are: drives shadow strength.
            const progress = Math.min(1, length / (2 * W));
            const depth = Math.sin(Math.PI * Math.min(1, progress * 1.15));
            front.style.clipPath = polygon(clip(rectangle, m, d, 1));
            flap.style.clipPath = polygon(clip(rectangle, m, d, -1));
            const md = m[0] * d[0] + m[1] * d[1];
            flap.style.transform = `matrix(${1 - 2 * d[0] * d[0]}, ${-2 * d[0] * d[1]}, ${-2 * d[0] * d[1]}, ${1 - 2 * d[1] * d[1]}, ${2 * md * d[0]}, ${2 * md * d[1]})`;
            flapShadow.style.visibility = cast.style.visibility = bend.style.visibility = "visible";
            alongFold(bend, m, angle, size);
            alongFold(sheen, m, angle + Math.PI, size);
            alongFold(cast, m, angle + Math.PI, size);
            bend.style.opacity = .35 + depth * .65;
            cast.style.opacity = .25 + depth * .75;
            flapShadow.style.setProperty("--page-curl-shadow", (.12 + depth * .22).toFixed(3));
        }

        const pointAt = (progress) => [
            W - 2 * W * progress,
            cornerY + (corner === "top" ? 1 : -1) * Math.sin(Math.PI * progress) * H * .16,
        ];

        let frame = 0;
        function tween(to, duration, ease) {
            cancelAnimationFrame(frame);
            const from = P.slice(), begin = performance.now();
            // A page lifts a little as it travels, then settles.
            const lift = Math.abs(to[0] - from[0]) / (2 * W) * H * .12 * (corner === "top" ? 1 : -1);
            return new Promise((resolve) => {
                const step = (now) => {
                    const t = Math.min(1, (now - begin) / duration), k = ease(t);
                    draw([from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k + Math.sin(Math.PI * k) * lift]);
                    if (t < 1) frame = requestAnimationFrame(step);
                    else resolve();
                };
                frame = requestAnimationFrame(step);
            });
        }

        draw(C);
        return {
            width: W,
            height: H,
            // Corner position in page coordinates, for dragging.
            point: (x, y) => draw([x, y]),
            progress: (value) => draw(pointAt(value)),
            current: () => Math.min(1, Math.max(0, (C[0] - P[0]) / (2 * W))),
            // Auto-play the full turn between two progress values along the natural arc.
            play(from, to, duration = 900) {
                cancelAnimationFrame(frame);
                const begin = performance.now();
                return new Promise((resolve) => {
                    const step = (now) => {
                        const t = Math.min(1, (now - begin) / duration);
                        draw(pointAt(from + (to - from) * easeInOut(t)));
                        if (t < 1) frame = requestAnimationFrame(step);
                        else resolve();
                    };
                    frame = requestAnimationFrame(step);
                });
            },
            // Let go of a drag: fall the rest of the way over, or back flat.
            settle(turned, duration = 420) {
                return tween(turned ? [-W, cornerY] : C, duration, easeOut);
            },
            destroy() {
                cancelAnimationFrame(frame);
                stage.remove();
            },
        };
    }

    // Drag a page by its outer edge (forward) or its spine side (back).
    // options.start(direction, corner) returns a controller from start() or null if there is no page that way.
    // options.end(direction, turned, controller) commits or discards; it must destroy the controller.
    function drag(surface, { start: begin, end }) {
        let gesture = null;
        // Otherwise the browser starts dragging the illustration itself and cancels the gesture.
        surface.addEventListener("dragstart", (event) => event.preventDefault());
        surface.addEventListener("pointerdown", (event) => {
            if (event.button !== 0 || event.target.closest("a, button, input, select, textarea")) return;
            const box = surface.getBoundingClientRect();
            const x = event.clientX - box.left;
            const direction = x > box.width * .55 ? "forward" : x < box.width * .45 ? "back" : null;
            if (!direction) return;
            gesture = { id: event.pointerId, x0: event.clientX, y0: event.clientY, box, direction, controller: null, history: [] };
        });
        surface.addEventListener("pointermove", (event) => {
            if (!gesture || event.pointerId !== gesture.id) return;
            const dx = event.clientX - gesture.x0, dy = event.clientY - gesture.y0;
            if (!gesture.controller) {
                if (Math.abs(dx) < 10 || Math.abs(dx) < Math.abs(dy)) {
                    if (Math.abs(dy) > 12) gesture = null;
                    return;
                }
                if ((gesture.direction === "forward") !== (dx < 0)) {
                    gesture = null;
                    return;
                }
                const corner = gesture.y0 - gesture.box.top < gesture.box.height / 2 ? "top" : "bottom";
                gesture.controller = begin(gesture.direction, corner);
                if (!gesture.controller) {
                    gesture = null;
                    return;
                }
                gesture.corner = corner;
                surface.setPointerCapture(event.pointerId);
                surface.classList.add("page-curl-dragging");
            }
            const { controller, box } = gesture;
            const scale = controller.width / box.width;
            const cornerY = gesture.corner === "top" ? 0 : controller.height;
            const y = cornerY + dy * scale * .6;
            // The fold sits halfway between the corner and where it started, so moving the corner twice as far as
            // the finger keeps the fold right under the finger. Back turns come over from the spine.
            const x = (gesture.direction === "forward" ? controller.width : -controller.width) + dx * scale * 2;
            controller.point(x, y);
            gesture.history.push([performance.now(), event.clientX]);
            if (gesture.history.length > 5) gesture.history.shift();
        });
        const release = async (event) => {
            if (!gesture || event.pointerId !== gesture.id) return;
            const { controller, direction, history } = gesture;
            gesture = null;
            surface.classList.remove("page-curl-dragging");
            if (!controller) return;
            // Speed over the last moments before release; a pause before letting go is not a flick.
            const now = performance.now();
            const recent = history.filter(([t]) => now - t < 120);
            const velocity = recent.length > 1
                ? (recent[recent.length - 1][1] - recent[0][1]) / Math.max(16, now - recent[0][0])
                : 0;
            const turnedOver = controller.current() > .5;
            // A quick flick counts even if the page has not crossed the middle.
            const flick = direction === "forward" ? velocity < -.5 : velocity > .5;
            const turned = direction === "forward" ? turnedOver || flick : !turnedOver || flick;
            await controller.settle(direction === "forward" ? turned : !turned);
            end(direction, event.type === "pointercancel" ? false : turned, controller);
        };
        surface.addEventListener("pointerup", release);
        surface.addEventListener("pointercancel", release);
    }

    window.PageCurl = { start, drag };
})();
