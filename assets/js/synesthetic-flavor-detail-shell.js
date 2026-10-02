(() => {
  "use strict";
  // Retain the original nodes: forms and their listeners/values survive a shell
  // render even while an asynchronous submission is in progress.
  let main = document.querySelector("main[data-home-detail]");
  let footer = document.getElementById("site-footer-shell");
  let resizeObserver, classObserver, resizeUpdate = () => {};
  window.addEventListener("resize", () => resizeUpdate(), { passive: true });
  const mount = () => {
    const shell = document.getElementById("site-shell");
    main ||= document.querySelector("main[data-home-detail]");
    footer ||= document.getElementById("site-footer-shell");
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
    resizeUpdate = update;
    resizeObserver?.disconnect();
    classObserver?.disconnect();
    update();
    if ("ResizeObserver" in window) { resizeObserver = new ResizeObserver(update); resizeObserver.observe(header); }
    classObserver = new MutationObserver(update);
    classObserver.observe(header, { attributes: true, attributeFilter: ["class"] });
    classObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  };
  document.addEventListener("arotec:languagechange", () => queueMicrotask(mount));
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
