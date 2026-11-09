(() => {
    const book = document.querySelector(".magic-day");
    if (!book) return;

    // Keep ordinary anchor navigation and every page readable without JavaScript.
    const chapters = Array.from(book.querySelectorAll(".magic-chapter"));
    const pages = Array.from(book.querySelectorAll("[data-magic-page]"));
    const ending = book.querySelector("#magic-end");
    const resume = book.querySelector("[data-magic-resume]");
    const progressKey = "bug1024:75-magic-day:page";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = pages[0];
    if (!active) return;

    function readProgress() {
        try { return localStorage.getItem(progressKey); } catch { return null; }
    }

    function saveProgress(id) {
        try {
            if (id) localStorage.setItem(progressKey, id);
            else localStorage.removeItem(progressKey);
        } catch {}
    }

    function showPage() {
        const id = location.hash.slice(1);
        const finished = id === ending.id;
        const requestedChapter = chapters.find((chapter) => chapter.id === id);
        const target = pages.find((page) => page.id === id) || requestedChapter?.querySelector("[data-magic-page]");
        if (target) active = target;
        const activeChapter = active.closest(".magic-chapter");
        for (const page of pages) {
            page.hidden = page !== active;
            page.style.viewTransitionName = page === active && !finished ? "magic-page" : "";
        }
        for (const chapter of chapters) chapter.hidden = finished || chapter !== activeChapter;
        ending.hidden = !finished;

        if (finished) {
            saveProgress(null);
            if (!immersive()) ending.scrollIntoView({ behavior: "instant" });
            ending.focus({ preventScroll: true });
        } else if (target) {
            saveProgress(active.id);
            if (!immersive()) activeChapter.scrollIntoView({ behavior: "instant" });
            active.focus({ preventScroll: true });
            const nextImage = pages[pages.indexOf(active) + 1]?.querySelector("img");
            if (nextImage) nextImage.loading = "eager";
        }
        const saved = readProgress();
        const savedPage = pages.find((page) => page.id === saved);
        resume.hidden = !savedPage || savedPage === pages[0];
        if (!resume.hidden) resume.href = "#" + savedPage.id;
    }

    // Page turns slide in the reading direction where the browser supports view transitions.
    function position(id) {
        if (id === ending.id) return pages.length;
        const index = pages.findIndex((page) => page.id === id);
        if (index >= 0) return index;
        const chapter = chapters.find((item) => item.id === id);
        return chapter ? pages.indexOf(chapter.querySelector("[data-magic-page]")) : -1;
    }

    // Full-screen reading: native fullscreen where the browser allows it, and a full-window book everywhere
    // (iPhone Safari only lets video go truly full screen).
    const exitButton = book.querySelector("[data-magic-fullscreen-exit]");
    const fullscreenButtons = book.querySelectorAll("[data-magic-fullscreen]");
    const immersive = () => book.hasAttribute("data-magic-immersive");

    function setImmersive(on) {
        if (on === immersive()) return;
        book.toggleAttribute("data-magic-immersive", on);
        document.documentElement.classList.toggle("magic-immersive", on);
        exitButton.hidden = !on;
        if (on) {
            if (position(location.hash.slice(1)) < 0) location.hash = active.id;
            book.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
            (ending.hidden ? active : ending).focus({ preventScroll: true });
        } else {
            if (document.fullscreenElement === book) document.exitFullscreen().catch(() => {});
            (ending.hidden ? active.closest(".magic-chapter") : ending).scrollIntoView({ behavior: "instant" });
        }
    }

    fullscreenButtons.forEach((button) => {
        button.hidden = false;
        button.addEventListener("click", () => setImmersive(true));
    });
    exitButton.addEventListener("click", () => setImmersive(false));
    // Leaving native fullscreen with the browser's own Esc also leaves the reading mode.
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement && immersive()) setImmersive(false);
    });

    let shownAt = position(location.hash.slice(1));
    function turnPage() {
        const next = position(location.hash.slice(1));
        // Links that leave the pages, such as "Back to cover", also leave full screen.
        if (next < 0 && immersive()) setImmersive(false);
        const turning = shownAt >= 0 && next >= 0 && next !== shownAt;
        document.documentElement.dataset.magicTurn = next < shownAt ? "back" : "forward";
        shownAt = next;
        if (turning && document.startViewTransition && !reduced.matches) document.startViewTransition(showPage);
        else showPage();
    }

    showPage();
    window.addEventListener("hashchange", turnPage);

    function follow(link) {
        if (link) location.hash = link.getAttribute("href");
    }
    function pageLinks() {
        if (!ending.hidden) return [ending.querySelector(".magic-ending-links a"), null];
        const nav = active.querySelector(".magic-page-nav");
        return [nav.firstElementChild, nav.querySelector(".magic-next")];
    }

    document.addEventListener("keydown", (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.target.closest("input, textarea, select, [contenteditable]")) return;
        if (event.key === "Escape" && immersive()) {
            setImmersive(false);
            return;
        }
        if ((event.key === "f" || event.key === "F") && position(location.hash.slice(1)) >= 0) {
            setImmersive(!immersive());
            return;
        }
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        if (position(location.hash.slice(1)) < 0) return;
        const [previous, next] = pageLinks();
        follow(event.key === "ArrowLeft" ? previous : next);
        event.preventDefault();
    });

    book.querySelectorAll("[data-magic-spread]").forEach((spread) => {
        let start = null;
        spread.addEventListener("touchstart", (event) => {
            start = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
        }, { passive: true });
        spread.addEventListener("touchend", (event) => {
            if (!start) return;
            const dx = event.changedTouches[0].clientX - start.x;
            const dy = event.changedTouches[0].clientY - start.y;
            start = null;
            if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
            const [previous, next] = pageLinks();
            follow(dx > 0 ? previous : next);
        }, { passive: true });
    });

    // Illustration effects. Coordinates are in the 1440 × 1080 artwork.
    const svgNS = "http://www.w3.org/2000/svg";
    const sparklePath = (r) => `M0 ${-r}Q${r * .2} ${-r * .2} ${r} 0 ${r * .2} ${r * .2} 0 ${r} ${-r * .2} ${r * .2} ${-r} 0 ${-r * .2} ${-r * .2} 0 ${-r}Z`;
    const random = (min, max) => min + Math.random() * (max - min);
    const at = (x, y, rest = "") => `translate(${x}px, ${y}px) ${rest}`;

    function shape(tag, attributes, parent) {
        const item = document.createElementNS(svgNS, tag);
        for (const [key, value] of Object.entries(attributes)) item.setAttribute(key, value);
        parent.append(item);
        return item;
    }

    // With reduced motion every element simply appears at its brightest moment and fades away.
    function play(item, keyframes, options) {
        if (reduced.matches) {
            const peak = keyframes.reduce((best, frame) => ((frame.opacity ?? 1) > (best.opacity ?? 1) ? frame : best), keyframes[0]);
            const still = { ...peak };
            delete still.offset;
            const last = keyframes[keyframes.length - 1];
            keyframes = [{ ...still, opacity: 0 }, { ...still, offset: .08 }, { ...still, offset: .85 }, { ...still, opacity: last.opacity ?? 1 }];
            options = { ...options, delay: 0, duration: Math.max(1800, options.duration), easing: "linear" };
        }
        return item.animate(keyframes, { fill: "both", ...options });
    }

    function layer(spread) {
        const artwork = spread.querySelector(".magic-artwork");
        let svg = artwork.querySelector(".magic-fx");
        if (!svg) {
            svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("class", "magic-fx");
            svg.setAttribute("viewBox", "0 0 1440 1080");
            svg.setAttribute("aria-hidden", "true");
            artwork.querySelector("img").after(svg);
        }
        return { artwork, svg };
    }

    // A soft-edged copy of part of the painting that can hop or wiggle above the original.
    function puppet(artwork, [x, y, w, h], origin = "50% 100%") {
        const piece = document.createElement("div");
        piece.className = "magic-puppet";
        Object.assign(piece.style, { left: `${x / 14.4}%`, top: `${y / 10.8}%`, width: `${w / 14.4}%`, height: `${h / 10.8}%`, transformOrigin: origin });
        const image = artwork.querySelector("img").cloneNode();
        image.removeAttribute("loading");
        image.alt = "";
        Object.assign(image.style, { width: `${1440 / w * 100}%`, left: `${-x / w * 100}%`, top: `${-y / h * 100}%` });
        piece.append(image);
        artwork.querySelector(".magic-fx").before(piece);
        return piece;
    }

    function sparkle(svg, x, y, { size = 18, color = "#fff1a8", delay = 0, duration = 900, drift = [0, -30], spin = 90 } = {}) {
        const item = shape("path", { d: sparklePath(size), fill: color, class: "magic-fx-glow" }, svg);
        play(item, [
            { transform: at(x, y, "scale(0) rotate(0deg)"), opacity: 0 },
            { transform: at(x, y, "scale(1.25) rotate(25deg)"), opacity: 1, offset: .25 },
            { transform: at(x + drift[0], y + drift[1], `scale(.2) rotate(${spin}deg)`), opacity: 0 },
        ], { duration, delay, easing: "cubic-bezier(.2,.8,.3,1)" });
        return item;
    }

    function ripple(svg, x, y, { rx = 120, ry = 30, delay = 0, color = "#fff6d0" } = {}) {
        const item = shape("ellipse", { cx: 0, cy: 0, rx, ry, fill: "none", stroke: color, "stroke-width": 9, class: "magic-fx-glow" }, svg);
        play(item, [
            { transform: at(x, y, "scale(.3)"), opacity: 0 },
            { transform: at(x, y, "scale(.7)"), opacity: .9, offset: .2 },
            { transform: at(x, y, "scale(1.35)"), opacity: 0 },
        ], { duration: 820, delay, easing: "ease-out" });
    }

    function note(svg, x, y, { delay = 0, color = "#5d3b7d", sway = 30 } = {}) {
        const group = shape("g", {}, svg);
        shape("ellipse", { cx: -10, cy: 16, rx: 13, ry: 9.5, fill: color, transform: "rotate(-22 -10 16)" }, group);
        shape("path", { d: "M1 14V-30q16 6 22 22", fill: "none", stroke: color, "stroke-width": 6, "stroke-linecap": "round" }, group);
        play(group, [
            { transform: at(x, y, "scale(.5) rotate(-10deg)"), opacity: 0 },
            { transform: at(x + sway * .4, y - 50, "scale(1.5) rotate(8deg)"), opacity: 1, offset: .25 },
            { transform: at(x - sway * .3, y - 120, "scale(1.5) rotate(-8deg)"), opacity: .9, offset: .65 },
            { transform: at(x + sway, y - 190, "scale(1.3) rotate(10deg)"), opacity: 0 },
        ], { duration: 1500, delay, easing: "ease-out" });
    }

    const effects = {
        hello({ artwork, svg }) {
            // Zhizhi gives a little wiggle, then says hi.
            const zhizhi = puppet(artwork, [700, 440, 400, 540]);
            play(zhizhi, [
                { transform: "none" },
                { transform: "scale(1.03, .95)", offset: .14 },
                { transform: "translateY(-2.5%) scale(.98, 1.04) rotate(-3deg)", offset: .32 },
                { transform: "rotate(2.5deg)", offset: .52 },
                { transform: "rotate(-1.2deg)", offset: .72 },
                { transform: "none" },
            ], { duration: 900, easing: "ease-in-out" });
            const bubble = document.createElement("span");
            bubble.className = "magic-bubble";
            bubble.textContent = "Hi!";
            bubble.lang = "en";
            Object.assign(bubble.style, { left: `${1150 / 14.4}%`, top: `${470 / 10.8}%` });
            artwork.append(bubble);
            play(bubble, [
                { transform: "translate(-30%, 40%) scale(.2) rotate(-12deg)", opacity: 0 },
                { transform: "translate(0, 0) scale(1.12) rotate(3deg)", opacity: 1, offset: .14 },
                { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1, offset: .24 },
                { transform: "translate(0, -6%) scale(1) rotate(-1deg)", opacity: 1, offset: .82 },
                { transform: "translate(0, -14%) scale(.94)", opacity: 0 },
            ], { duration: 2000, delay: 220, easing: "ease-out" });
            [[1062, 640, 1100, 606], [1084, 676, 1150, 634], [1108, 712, 1196, 662]].forEach(([x1, y1, x2, y2], i) => {
                const line = shape("path", { d: `M${x1} ${y1}Q${(x1 + x2) / 2 + 10} ${y1 + 4} ${x2} ${y2}`, fill: "none", stroke: "#674285", "stroke-width": 13, "stroke-linecap": "round", pathLength: 1, "stroke-dasharray": 1 }, svg);
                play(line, [
                    { strokeDashoffset: 1, opacity: 1 },
                    { strokeDashoffset: 0, opacity: 1, offset: .3 },
                    { strokeDashoffset: 0, opacity: 1, offset: .75 },
                    { strokeDashoffset: 0, opacity: 0 },
                ], { duration: 1500, delay: 120 + i * 110, easing: "ease-out" });
            });
            [[1000, 470], [1050, 520], [960, 430]].forEach(([x, y], i) => sparkle(svg, x, y, { size: 16 + i * 4, delay: 380 + i * 140 }));
            return 2300;
        },

        door({ artwork, svg, spread }) {
            const star = [872, 212];
            const door = "M964 866V262C964 138 1060 38 1176 38s212 100 212 224v646Z";
            // The wand star swells and flashes...
            const wand = puppet(artwork, [790, 130, 165, 165], "50% 50%");
            play(wand, [{ transform: "none" }, { transform: "scale(1.3) rotate(-10deg)", offset: .3 }, { transform: "scale(.95) rotate(4deg)", offset: .6 }, { transform: "none" }], { duration: 650, easing: "ease-out" });
            for (let i = 0; i < 10; i++) {
                const angle = i / 10 * Math.PI * 2;
                const ray = shape("path", { d: "M0-50V-105", stroke: "#ffe27a", "stroke-width": 11, "stroke-linecap": "round" }, svg);
                play(ray, [
                    { transform: at(...star, `rotate(${angle}rad) scale(.4)`), opacity: 0 },
                    { transform: at(...star, `rotate(${angle}rad) scale(1)`), opacity: 1, offset: .3 },
                    { transform: at(...star, `rotate(${angle}rad) scale(1.6)`), opacity: 0 },
                ], { duration: 650, easing: "ease-out" });
            }
            const flash = shape("circle", { r: 110, fill: "url(#magic-door-light)", class: "magic-fx-glow" }, svg);
            play(flash, [
                { transform: at(...star, "scale(.3)"), opacity: 0 },
                { transform: at(...star, "scale(1.2)"), opacity: 1, offset: .25 },
                { transform: at(...star, "scale(1.6)"), opacity: 0 },
            ], { duration: 700, easing: "ease-out" });
            // ...a trail of sparkles arcs over to the door...
            const target = [1176, 430];
            for (let i = 0; i < 12; i++) {
                const item = shape("path", { d: sparklePath(random(16, 30)), fill: i % 3 ? "#fff1a8" : "#ffd36e", class: "magic-fx-glow" }, svg);
                const lift = random(130, 210);
                const frames = [];
                for (let step = 0; step <= 8; step++) {
                    const t = step / 8;
                    const x = star[0] + (target[0] - star[0]) * t + random(-6, 6);
                    const y = star[1] + (target[1] - star[1]) * t - Math.sin(t * Math.PI) * lift;
                    frames.push({ transform: at(x, y, `scale(${t < .15 ? t / .15 : 1 - t * .5}) rotate(${t * 220}deg)`), opacity: t < .9 ? 1 : 0, offset: t });
                }
                play(item, frames, { duration: 820, delay: 160 + i * 50, easing: "cubic-bezier(.45,0,.4,1)" });
            }
            // ...and the doorway fills with warm light that stays while you read the page.
            if (!spread.querySelector(".magic-door-lit")) {
                const glow = shape("path", { d: door, fill: "url(#magic-door-light)", class: "magic-door-lit" }, svg);
                const edge = shape("path", { d: door, fill: "none", stroke: "#fff4b8", "stroke-width": 14, "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": 1, class: "magic-fx-glow" }, svg);
                play(edge, [{ strokeDashoffset: 1, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: .55 }, { strokeDashoffset: 0, opacity: .55 }], { duration: 1100, delay: 760, easing: "ease-in-out" });
                play(glow, [{ opacity: 0 }, { opacity: 1, offset: .4 }, { opacity: .7 }], { duration: 1400, delay: 900, easing: "ease-out" });
            }
            for (let i = 0; i < 12; i++) {
                const x = random(990, 1360), y = random(560, 840);
                sparkle(svg, x, y, { size: random(10, 18), delay: 1100 + i * 90, duration: 1300, drift: [random(-20, 20), -random(90, 160)] });
            }
            return 2600;
        },

        dance({ artwork, svg }) {
            // Rabbit and Zhizhi bounce on two beats; notes float up and the stepping stones ripple.
            const rabbit = puppet(artwork, [910, 320, 340, 450]);
            const zhizhi = puppet(artwork, [50, 540, 390, 390]);
            const hop = (lift, tilt) => [
                { transform: "none" },
                { transform: "scale(1.04, .94)", offset: .12 },
                { transform: `translateY(${-lift}%) scale(.97, 1.04) rotate(${tilt}deg)`, offset: .3 },
                { transform: "scale(1.03, .96)", offset: .46 },
                { transform: "none", offset: .5 },
                { transform: "scale(1.04, .94)", offset: .62 },
                { transform: `translateY(${-lift}%) scale(.97, 1.04) rotate(${-tilt}deg)`, offset: .8 },
                { transform: "scale(1.03, .96)", offset: .95 },
                { transform: "none" },
            ];
            play(rabbit, hop(7, 4), { duration: 1100, easing: "ease-in-out" });
            play(zhizhi, hop(5, -5), { duration: 1100, delay: 120, easing: "ease-in-out" });
            [0, 550].forEach((delay, beat) => {
                ripple(svg, 615, 900, { rx: 150, ry: 34, delay });
                ripple(svg, 1080, 760, { rx: 90, ry: 22, delay: delay + 60 });
                ripple(svg, 240, 915, { rx: 110, ry: 26, delay: delay + 120 });
                note(svg, beat ? 1200 : 980, 330, { delay: delay + 80, sway: beat ? -30 : 30 });
                note(svg, beat ? 330 : 200, beat ? 560 : 520, { delay: delay + 160, color: "#b04f6f" });
                note(svg, beat ? 700 : 560, 180, { delay: delay + 240, sway: -24, color: "#38608a" });
            });
            return 2200;
        },

        stars({ svg }) {
            // Stars come out one by one in the window, then one shoots across.
            const sky = shape("g", { "clip-path": "url(#magic-night-window)" }, svg);
            const spots = [[1292, 64, 30], [1330, 152, 22], [1414, 70, 26], [1276, 176, 18], [1336, 30, 16], [1420, 168, 20], [1302, 246, 14]];
            spots.forEach(([x, y, size], i) => {
                const item = shape("path", { d: sparklePath(size), fill: "#fff3ba", class: "magic-fx-glow" }, sky);
                play(item, [
                    { transform: at(x, y, "scale(0) rotate(0deg)"), opacity: 0 },
                    { transform: at(x, y, "scale(1.35) rotate(30deg)"), opacity: 1, offset: .12 },
                    { transform: at(x, y, "scale(.85) rotate(40deg)"), opacity: .75, offset: .3 },
                    { transform: at(x, y, "scale(1.1) rotate(45deg)"), opacity: 1, offset: .5 },
                    { transform: at(x, y, "scale(.9) rotate(50deg)"), opacity: .8, offset: .72 },
                    { transform: at(x, y, "scale(.6) rotate(60deg)"), opacity: 0 },
                ], { duration: 3000, delay: 300 + i * 190, easing: "ease-in-out" });
            });
            const streak = shape("path", { d: "M0 0L-150 -64", stroke: "#fff8d6", "stroke-width": 7, "stroke-linecap": "round", class: "magic-fx-glow" }, sky);
            play(streak, [
                { transform: at(1470, 0, "scale(.2)"), opacity: 0 },
                { transform: at(1400, 40, "scale(1)"), opacity: 1, offset: .2 },
                { transform: at(1215, 128, "scale(.6)"), opacity: 0 },
            ], { duration: 820, delay: 1500, easing: "cubic-bezier(.3,0,.7,1)" });
            // The wand on the bed glints first, then the stars answer.
            sparkle(svg, 1352, 876, { size: 34, duration: 900, drift: [0, -10], spin: 120 });
            sparkle(svg, 1352, 876, { size: 22, delay: 1900, duration: 1000, drift: [0, -10], spin: 120 });
            sparkle(svg, 1172, 756, { size: 18, delay: 1900, duration: 900, drift: [0, -8] });
            return 3400;
        },
    };

    // Shared gradient and window clip, defined once for the whole book in a rendered (not display: none) SVG.
    function prepare() {
        if (book.querySelector(".magic-fx-defs")) return;
        book.insertAdjacentHTML("beforeend", `<svg class="magic-fx-defs" width="0" height="0" aria-hidden="true"><defs>
            <radialGradient id="magic-door-light" cx="50%" cy="62%" r="60%"><stop offset="0" stop-color="#fff9dc"/><stop offset=".55" stop-color="#ffe08a" stop-opacity=".75"/><stop offset="1" stop-color="#ffc85a" stop-opacity="0"/></radialGradient>
            <clipPath id="magic-night-window" clipPathUnits="userSpaceOnUse"><path d="M1254 0H1354V204H1254ZM1384 0H1440V198H1384ZM1254 228H1354V264H1254Z"/></clipPath>
        </defs></svg>`);
    }

    let playing = null;

    function clearEffect(spread) {
        spread.querySelectorAll(".magic-puppet, .magic-bubble").forEach((item) => item.remove());
        spread.querySelectorAll(".magic-fx > *").forEach((item) => {
            if (!item.classList.contains("magic-door-lit") || !spread.isConnected || spread.closest("[hidden]")) item.remove();
        });
    }

    function run(button) {
        const spread = button.closest("[data-magic-spread]");
        if (playing === spread) return;
        const name = button.dataset.magicEffect;
        prepare();
        const parts = layer(spread);
        clearEffect(spread);
        playing = spread;
        spread.setAttribute("data-magic-effect-active", "");
        spread.setAttribute("data-magic-played", "");
        const status = spread.querySelector("[data-magic-effect-status]");
        status.textContent = status.dataset.announcement;
        const duration = effects[name]({ ...parts, spread });
        window.setTimeout(() => {
            if (playing !== spread) return;
            playing = null;
            spread.removeAttribute("data-magic-effect-active");
            status.textContent = "";
            clearEffect(spread);
        }, reduced.matches ? Math.max(duration, 1900) : duration);
    }

    book.querySelectorAll("[data-magic-effect]").forEach((button) => {
        button.hidden = false;
        button.addEventListener("click", () => run(button));
    });

    window.addEventListener("hashchange", () => {
        for (const spread of book.querySelectorAll("[data-magic-played]")) {
            spread.removeAttribute("data-magic-effect-active");
            spread.querySelectorAll(".magic-puppet, .magic-bubble, .magic-fx > *").forEach((item) => item.remove());
        }
        playing = null;
    });

    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

    const speech = window.speechSynthesis;
    let current = null;
    let currentButton = null;

    function stop() {
        if (!current) return;
        current = null;
        currentButton.removeAttribute("aria-pressed");
        currentButton = null;
        speech.cancel();
    }

    book.querySelectorAll("[data-magic-speak]").forEach((button) => {
        button.hidden = false;
        button.addEventListener("click", () => {
            const wasPlaying = button === currentButton;
            stop();
            if (wasPlaying) return;

            const status = button.closest("[data-magic-spread]").querySelector("[data-magic-speech-status]");
            status.hidden = true;
            status.textContent = "";
            const line = new SpeechSynthesisUtterance(button.dataset.magicSpeak);
            const voices = speech.getVoices();
            const voice = voices.find((item) => item.localService && /^en-US$/i.test(item.lang))
                || voices.find((item) => item.localService && /^en\b/i.test(item.lang));
            if (voice) line.voice = voice;
            line.lang = voice ? voice.lang : "en-US";
            line.rate = 0.82;
            current = line;
            currentButton = button;
            button.setAttribute("aria-pressed", "true");
            const reset = () => {
                if (current !== line) return false;
                current = null;
                currentButton = null;
                button.removeAttribute("aria-pressed");
                return true;
            };
            line.onend = reset;
            line.onerror = () => {
                if (!reset()) return;
                status.hidden = false;
                status.textContent = "Read-aloud is unavailable. Check that your device has an English voice installed.";
            };
            speech.speak(line);
        });
    });

    window.addEventListener("hashchange", stop);
    window.addEventListener("pagehide", stop);
})();
