(() => {
  "use strict";
  const mount = () => {
    const shell = document.getElementById("site-shell");
    const main = document.querySelector("main[data-home-detail]");
    const footer = document.getElementById("site-footer-shell");
    if (!shell || !main || !footer) return;
    shell.append(main, footer);

    // Home navigation fragments must still lead to index.html on a detail page.
    shell.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"]').forEach((link) => {
      const hash = link.getAttribute("href");
      if (hash && hash.length > 1) link.setAttribute("href", "../index.html" + hash);
    });

    const header = shell.querySelector(".site-header");
    if (!header) return;
    const update = () => {
      const position = getComputedStyle(header).position;
      const overlay = position === "fixed" || position === "absolute";
      main.style.setProperty("--detail-header-space", overlay ? header.offsetHeight + "px" : "0px");
    };
    update();
    if ("ResizeObserver" in window) new ResizeObserver(update).observe(header);
    const observer = new MutationObserver(update);
    observer.observe(header, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", update, { passive: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
