// Keep the header connected to the page until content scrolls underneath it.
const header = document.querySelector(".header-wrapper");

if (header) {
    const updateBoundary = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    updateBoundary();
    window.addEventListener("scroll", updateBoundary, { passive: true });
    window.addEventListener("pageshow", updateBoundary);
}
