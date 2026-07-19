(function () {
    "use strict";

    var root = document.querySelector("[data-storybook]");
    var dataNode = document.getElementById("storybook-data");
    if (!root || !dataNode) return;

    var book = JSON.parse(dataNode.textContent);
    if (typeof book === "string") book = JSON.parse(book);
    var reader = root.querySelector("[data-storybook-reader]");
    var pages = root.querySelector("[data-storybook-pages]");
    var title = root.querySelector("[data-storybook-title]");
    var position = root.querySelector("[data-storybook-position]");
    var previous = root.querySelector("[data-storybook-prev]");
    var next = root.querySelector("[data-storybook-next]");
    var current = 0;
    var openingCount = book.opening.length;
    var frames = book.opening.concat(book.chapters.map(function (chapter, index) {
        return {
            title: chapter.title,
            position: String(index + 1).padStart(2, "0") + " / " + String(book.chapters.length).padStart(2, "0"),
            pages: chapter.pages.map(chapterPath),
            alts: chapter.pages.map(function (_, pageIndex) {
                return chapter.title + (chapter.pages.length > 1 ? (pageIndex === 0 ? "（上）" : "（下）") : "");
            })
        };
    })).concat([book.ending]);
    var storageKey = "bug1024-jiujiu-page-v2";

    function chapterPath(file) {
        return "/works/jiujiu/images/" + file;
    }

    function renderFrame(index) {
        current = Math.max(0, Math.min(frames.length - 1, index));
        var frame = frames[current];
        pages.replaceChildren();

        frame.pages.forEach(function (file, pageIndex) {
            var image = document.createElement("img");
            image.src = file;
            image.alt = frame.alts[pageIndex];
            image.decoding = "async";
            pages.appendChild(image);
        });

        title.textContent = frame.title;
        position.textContent = frame.position;
        previous.disabled = current === 0;
        next.disabled = current === frames.length - 1;
        try { localStorage.setItem(storageKey, String(current)); } catch (error) {}
        reader.scrollTop = 0;
    }

    function openReader(index) {
        renderFrame(index);
        reader.hidden = false;
        reader.setAttribute("aria-hidden", "false");
        document.body.classList.add("storybook-reader-open");
        reader.querySelector("[data-storybook-close]").focus();
    }

    function closeReader(showDirectory) {
        reader.hidden = true;
        reader.setAttribute("aria-hidden", "true");
        document.body.classList.remove("storybook-reader-open");
        if (showDirectory) document.getElementById("chapters").scrollIntoView({ behavior: "smooth" });
    }

    root.querySelector("[data-storybook-start]").addEventListener("click", function () {
        var saved = 0;
        try { saved = Number(localStorage.getItem(storageKey)) || 0; } catch (error) {}
        openReader(saved);
    });

    root.querySelectorAll("[data-storybook-chapter]").forEach(function (button) {
        button.addEventListener("click", function () { openReader(openingCount + Number(button.dataset.storybookChapter)); });
    });

    root.querySelector("[data-storybook-close]").addEventListener("click", function () { closeReader(false); });
    root.querySelector("[data-storybook-directory]").addEventListener("click", function () { closeReader(true); });
    previous.addEventListener("click", function () { if (current > 0) renderFrame(current - 1); });
    next.addEventListener("click", function () { if (current < frames.length - 1) renderFrame(current + 1); });

    window.addEventListener("keydown", function (event) {
        if (reader.hidden) return;
        if (event.key === "Escape") closeReader(false);
        if (event.key === "ArrowLeft" && current > 0) renderFrame(current - 1);
        if (event.key === "ArrowRight" && current < frames.length - 1) renderFrame(current + 1);
    });
})();
