(() => {
    const book = document.querySelector(".magic-day");
    if (!book) return;

    // Keep ordinary anchor navigation and every page readable without JavaScript.
    const chapters = Array.from(book.querySelectorAll(".magic-chapter"));
    const pages = Array.from(book.querySelectorAll("[data-magic-page]"));
    const ending = book.querySelector("#magic-end");
    const resume = book.querySelector("[data-magic-resume]");
    const progressKey = "bug1024:75-magic-day:page";
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
        for (const page of pages) page.hidden = page !== active;
        for (const chapter of chapters) chapter.hidden = finished || chapter !== activeChapter;
        ending.hidden = !finished;

        if (finished) {
            saveProgress(null);
            ending.scrollIntoView({ behavior: "instant" });
            ending.focus({ preventScroll: true });
        } else if (target) {
            saveProgress(active.id);
            activeChapter.scrollIntoView({ behavior: "instant" });
            active.focus({ preventScroll: true });
            const nextImage = pages[pages.indexOf(active) + 1]?.querySelector("img");
            if (nextImage) nextImage.loading = "eager";
        }
        const saved = readProgress();
        const savedPage = pages.find((page) => page.id === saved);
        resume.hidden = !savedPage || savedPage === pages[0];
        if (!resume.hidden) resume.href = "#" + savedPage.id;
    }

    showPage();
    window.addEventListener("hashchange", showPage);

    let effectTimer;
    let effectSpread;

    function clearEffect() {
        if (!effectSpread) return;
        window.clearTimeout(effectTimer);
        effectSpread.removeAttribute("data-magic-effect-active");
        effectSpread.querySelector("[data-magic-effect-status]").textContent = "";
        effectSpread = null;
    }

    book.querySelectorAll("[data-magic-effect]").forEach((button) => {
        button.hidden = false;
        button.addEventListener("click", () => {
            const spread = button.closest("[data-magic-spread]");
            if (effectSpread === spread) return;
            clearEffect();
            effectSpread = spread;
            spread.setAttribute("data-magic-effect-active", "");
            spread.querySelector("[data-magic-effect-status]").textContent = button.dataset.magicEffect;
            effectTimer = window.setTimeout(clearEffect, 1200);
        });
    });

    window.addEventListener("hashchange", clearEffect);
    window.addEventListener("pagehide", clearEffect);

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
