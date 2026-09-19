(() => {
  "use strict";

  const shell = document.getElementById("site-shell");
  const main = document.querySelector("main.pni-main[data-home-detail]");
  const footer = document.getElementById("site-footer-shell");
  if (!shell || !main || !footer) return;

  // Retain the original nodes: the shared language renderer replaces the shell,
  // then updates this same footer node before emitting arotec:languagechange.
  let header = null;
  const updateSpacing = () => {
    if (!header?.isConnected) return;
    const position = getComputedStyle(header).position;
    const overlay = position === "fixed" || position === "absolute";
    main.style.setProperty("--detail-header-space", overlay ? header.offsetHeight + "px" : "0px");
  };
  const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(updateSpacing) : null;
  const classObserver = new MutationObserver(updateSpacing);

  const mount = () => {
    shell.append(main, footer);

    shell.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"], .mobile-panel a[href^="#"]').forEach((link) => {
      const hash = link.getAttribute("href");
      if (hash && hash.length > 1) link.setAttribute("href", "../index.html" + hash);
    });

    resizeObserver?.disconnect();
    classObserver.disconnect();
    header = shell.querySelector(".site-header");
    if (!header) return;
    resizeObserver?.observe(header);
    classObserver.observe(header, { attributes: true, attributeFilter: ["class"] });
    classObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    updateSpacing();
  };

  document.addEventListener("arotec:languagechange", () => {
    mount();
    // The replacement footer was detached when site.js wired document controls.
    // Preserve its existing newsletter behavior after returning it to the shell.
    footer.querySelector("#newsletterForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      event.currentTarget.reset();
    });
  });
  window.addEventListener("resize", updateSpacing, { passive: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
