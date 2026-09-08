// Hides the Shop/Cart nav-links on scroll-down, reveals them on scroll-up.
// The logo itself is unaffected — .site-header is position:fixed in
// styles.css, so it (and the logo) never scrolls out of view; this script
// only toggles the .nav-links-hidden class that fades the two links.
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const REVEAL_ZONE = 60; // always show while near the very top of the page
  const THRESHOLD = 4; // ignore sub-pixel/trackpad jitter

  let lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= REVEAL_ZONE) {
        header.classList.remove("nav-links-hidden");
      } else if (delta > THRESHOLD) {
        header.classList.add("nav-links-hidden");
      } else if (delta < -THRESHOLD) {
        header.classList.remove("nav-links-hidden");
      }

      lastY = y;
    },
    { passive: true }
  );
})();
