(() => {
  "use strict";
  const shell = document.getElementById("site-shell");
  const main = document.querySelector("main[data-viewport-hero]");
  if (!shell || !main) return;

  // The translated shell replaces its contents on language changes. Keep the
  // static hero outside it and measure the current header after each render.
  let header;
  const measure = () => {
    if (!header) return;
    const overlay = ["fixed", "absolute"].includes(getComputedStyle(header).position);
    main.style.setProperty("--detail-header-space", overlay ? `${header.offsetHeight}px` : "0px");
  };
  const resize = new ResizeObserver(measure);
  const bindHeader = () => {
    const next = shell.querySelector(".site-header");
    if (next === header) return;
    resize.disconnect();
    header = next;
    if (header) resize.observe(header);
    measure();
  };
  new MutationObserver(bindHeader).observe(shell, { childList: true });
  window.addEventListener("resize", measure, { passive: true });
  bindHeader();
})();
