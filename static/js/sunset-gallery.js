(function () {
    "use strict";

    var root = document.querySelector("[data-sunset]");
    if (!root) return;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var photos = Array.prototype.slice.call(root.querySelectorAll("[data-sunset-open]"));
    var jumpButtons = Array.prototype.slice.call(root.querySelectorAll("[data-sunset-jump]"));
    var indexRail = root.querySelector("[data-sunset-index] ol");
    var status = root.querySelector("[data-sunset-index-status]");
    var lightbox = root.querySelector("[data-sunset-lightbox]");
    var lightboxImage = root.querySelector("[data-sunset-lightbox-image]");
    var lightboxNumber = root.querySelector("[data-sunset-lightbox-number]");
    var lightboxPlace = root.querySelector("[data-sunset-lightbox-place]");
    var lightboxDate = root.querySelector("[data-sunset-lightbox-date]");
    var previousButton = root.querySelector("[data-sunset-prev]");
    var nextButton = root.querySelector("[data-sunset-next]");
    var closeButton = root.querySelector("[data-sunset-close]");
    var current = 0;
    var lastFocus = null;
    var touchStart = null;

    function photoIndex(id) {
        return photos.findIndex(function (photo) { return photo.dataset.sunsetOpen === id; });
    }

    function setActive(id) {
        var moment = document.getElementById("sunset-" + id);
        if (!moment) return;
        var activeButton = null;
        jumpButtons.forEach(function (button) {
            var active = button.dataset.sunsetJump === id;
            button.classList.toggle("is-active", active);
            if (active) activeButton = button;
            if (active) button.setAttribute("aria-current", "true");
            else button.removeAttribute("aria-current");
        });
        status.textContent = moment.dataset.label + " · " + moment.dataset.place + " · " + moment.dataset.date;
        if (activeButton && indexRail.scrollWidth > indexRail.clientWidth) {
            var left = activeButton.offsetLeft - indexRail.clientWidth / 2 + activeButton.offsetWidth / 2;
            indexRail.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" });
        }
    }

    jumpButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var id = button.dataset.sunsetJump;
            var target = document.getElementById("sunset-" + id);
            if (!target) return;
            setActive(id);
            var distance = Math.abs(target.getBoundingClientRect().top);
            var behavior = reduced || distance > window.innerHeight * 4 ? "auto" : "smooth";
            target.scrollIntoView({ behavior: behavior, block: "start" });
        });
    });

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) setActive(entry.target.dataset.sunsetMoment);
            });
        }, { rootMargin: "-22% 0px -62% 0px", threshold: 0 });
        root.querySelectorAll("[data-sunset-moment]").forEach(function (moment) { observer.observe(moment); });
    }

    function preload(index) {
        if (index < 0 || index >= photos.length) return;
        var image = new Image();
        image.src = photos[index].dataset.large;
    }

    function render(index) {
        current = (index + photos.length) % photos.length;
        var photo = photos[current];
        var id = photo.dataset.sunsetOpen;
        lightboxImage.src = photo.dataset.large;
        lightboxImage.alt = photo.dataset.alt;
        lightboxNumber.textContent = "SUNSET " + id;
        lightboxPlace.textContent = photo.dataset.place;
        lightboxDate.textContent = photo.dataset.date + " · " + photo.dataset.time;
        lightboxDate.setAttribute("datetime", photo.dataset.date.replace(/\./g, "-") + "T" + photo.dataset.time + ":00+08:00");
        setActive(photo.closest("[data-sunset-moment]").dataset.sunsetMoment);
        preload(current - 1);
        preload(current + 1);
    }

    function open(index, opener) {
        lastFocus = opener;
        render(index);
        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("sunset-lightbox-open");
        closeButton.focus();
    }

    function close() {
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("sunset-lightbox-open");
        lightboxImage.src = "";
        if (lastFocus) lastFocus.focus();
    }

    photos.forEach(function (photo, index) {
        photo.addEventListener("click", function () { open(index, photo); });
    });
    closeButton.addEventListener("click", close);
    previousButton.addEventListener("click", function () { render(current - 1); });
    nextButton.addEventListener("click", function () { render(current + 1); });

    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox || event.target === root.querySelector("[data-sunset-lightbox-stage]")) close();
    });

    lightbox.addEventListener("touchstart", function (event) {
        touchStart = event.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", function (event) {
        if (touchStart === null) return;
        var delta = touchStart - event.changedTouches[0].clientX;
        touchStart = null;
        if (Math.abs(delta) > 48) render(current + (delta > 0 ? 1 : -1));
    }, { passive: true });

    window.addEventListener("keydown", function (event) {
        if (lightbox.hidden) return;
        if (event.key === "Escape") close();
        if (event.key === "ArrowLeft") render(current - 1);
        if (event.key === "ArrowRight") render(current + 1);
        if (event.key === "Tab") {
            var controls = [closeButton, previousButton, nextButton];
            var index = controls.indexOf(document.activeElement);
            if (event.shiftKey && index === 0) {
                event.preventDefault();
                controls[controls.length - 1].focus();
            } else if (!event.shiftKey && index === controls.length - 1) {
                event.preventDefault();
                controls[0].focus();
            }
        }
    });

    setActive("001");
})();
