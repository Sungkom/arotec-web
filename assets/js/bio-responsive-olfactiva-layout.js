/* Keep Olfactiva's desktop backdrops viewport-wide without scrollbar overflow. */
(() => {
  "use strict";
  const main = document.getElementById("main");
  if (!main || !main.classList.contains("olf-main")) return;

  const desktop = window.matchMedia("(min-width: 1024px)");
  let frame = 0;
  function updateLayout() {
    frame = 0;
    if (!desktop.matches) {
      main.style.removeProperty("--olf-viewport-width");
      main.style.removeProperty("--olf-viewport-offset");
      return;
    }
    const width = document.documentElement.clientWidth;
    const left = main.getBoundingClientRect().left;
    main.style.setProperty("--olf-viewport-width", width + "px");
    main.style.setProperty("--olf-viewport-offset", (-left).toFixed(3) + "px");
  }
  function scheduleLayout() {
    if (!frame) frame = window.requestAnimationFrame(updateLayout);
  }

  updateLayout();
  window.addEventListener("resize", scheduleLayout, { passive: true });
  window.addEventListener("load", scheduleLayout, { once: true });
  if (document.fonts) document.fonts.ready.then(scheduleLayout);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleLayout);
    observer.observe(main);
  }
})();
