(() => {
  "use strict";
  const shell = document.getElementById("site-shell");
  const main = document.querySelector(".sws-main");
  if (!shell || !main) return;

  // Keep the static page outside the translated shell: language changes
  // replace the shell contents. Re-measure whichever header is current.
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
