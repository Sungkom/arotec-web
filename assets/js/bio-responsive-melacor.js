/* Preserve this static detail page when the shared navigation changes language. */
(() => {
  "use strict";

  const start = () => {
    if (!document.body.classList.contains("ml-page")) return;

    const shell = document.getElementById("site-shell");
    const main = document.querySelector("main[data-home-detail]");
    const footer = document.getElementById("site-footer-shell");
    if (!shell || !main || !footer) return;

    // The scientific copy remains English while the shared shell is localized.
    main.lang = "en";
    let header = null;
    let spacingFrame = 0;

    const updateSpacing = () => {
      spacingFrame = 0;
      if (!header || !header.isConnected) return;
      const position = getComputedStyle(header).position;
      const overlay = position === "fixed" || position === "absolute";
      main.style.setProperty("--detail-header-space", overlay ? `${header.offsetHeight}px` : "0px");
    };
    const scheduleSpacing = () => {
      if (!spacingFrame) spacingFrame = window.requestAnimationFrame(updateSpacing);
    };
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(scheduleSpacing) : null;
    const headerObserver = new MutationObserver(scheduleSpacing);

    const restore = () => {
      // site.min.js replaces the shell's children, but its retained footer
      // reference receives the newly localized footer before we reattach it.
      shellObserver.disconnect();
      if (main.parentElement !== shell) shell.append(main);
      if (footer.parentElement !== shell) shell.append(footer);

      shell.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"]').forEach((link) => {
        const hash = link.getAttribute("href");
        if (hash && hash.length > 1) link.setAttribute("href", `../index.html${hash}`);
      });

      const currentHeader = shell.querySelector(".site-header");
      if (currentHeader !== header) {
        header = currentHeader;
        resizeObserver?.disconnect();
        headerObserver.disconnect();
        headerObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
        if (header) {
          resizeObserver?.observe(header);
          headerObserver.observe(header, { attributes: true, attributeFilter: ["class"] });
        }
      }
      scheduleSpacing();
      shellObserver.observe(shell, { childList: true });
    };
    const shellObserver = new MutationObserver(restore);

    restore();
    document.addEventListener("arotec:languagechange", restore);
    window.addEventListener("resize", scheduleSpacing, { passive: true });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
