// Hides the Shop/Cart nav-links on scroll-down, reveals them on scroll-up.
// The logo itself is unaffected — .site-header is position:fixed in
// styles.css, so it (and the logo) never scrolls out of view; this script
// only toggles the .nav-links-hidden class that fades the two links.
(function () {
  const header = document.querySelector(".site-header");
  if (!header) return;

  // Always show while near the very top of the page — 60px by default, or
  // a page-specific override via data-reveal-zone (index.html sets this to
  // its hero-logo animation's own SCROLL_RANGE, so the nav links stay put
  // until that animation finishes instead of hiding mid-way through it).
  const REVEAL_ZONE = Number(header.dataset.revealZone) || 60;
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
