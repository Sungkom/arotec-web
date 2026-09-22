/* Keep feeling-page content outside the shell rebuilt by language selection. */
(() => {
  "use strict";

  const start = () => {
    const shell = document.getElementById("site-shell");
    const main = document.querySelector("main#main.sf-main[data-home-detail]");
    const footer = document.getElementById("site-footer-shell");
    if (!shell || !main || !footer) return;

    const home = `${document.body.dataset.root || "../"}index.html`;
    let header = null;
    let frame = 0;

    const updateSpace = () => {
      frame = 0;
      const position = header ? getComputedStyle(header).position : "static";
      const overlay = position === "fixed" || position === "absolute";
      const space = `${overlay ? header.offsetHeight : 0}px`;
      if (main.style.getPropertyValue("--detail-header-space") !== space) {
        main.style.setProperty("--detail-header-space", space);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateSpace);
    };

    const resizeObserver = new ResizeObserver(schedule);
    const headerObserver = new MutationObserver(schedule);

    const sync = () => {
      const nextHeader = shell.querySelector(".site-header");
      if (header !== nextHeader) {
        resizeObserver.disconnect();
        headerObserver.disconnect();
        header = nextHeader;
        if (header) {
          resizeObserver.observe(header);
          headerObserver.observe(header, {
            attributes: true,
            attributeFilter: ["class", "style"]
          });
        }
      }

      // Home-only fragments must open the homepage from this detail page.
      for (const container of [shell, footer]) {
        container.querySelectorAll('.site-header a[href^="#"], .mobile-nav a[href^="#"], .site-footer a[href^="#"]').forEach((link) => {
          const hash = link.getAttribute("href");
          if (hash && hash.length > 1) link.setAttribute("href", home + hash);
        });
      }
      schedule();
    };

    const shellObserver = new MutationObserver(sync);
    shellObserver.observe(shell, { childList: true, subtree: true });
    shellObserver.observe(footer, { childList: true, subtree: true });
    new MutationObserver(schedule).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("load", schedule, { once: true });
    document.fonts?.ready.then(schedule);
    sync();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
