(() => {
  "use strict";

  const mountHomeShell = () => {
    const shell = document.getElementById("site-shell");
    const main = document.querySelector("main.he-main");
    const footer = document.getElementById("site-footer-shell");
    if (!shell || !main || !footer) return;

    // Match index.html so navigation tokens and footer rules inherit identically.
    shell.append(main, footer);

    const header = shell.querySelector(".site-header");
    if (!header) return;

    const updateHeaderSpace = () => {
      const position = getComputedStyle(header).position;
      const overlaysContent = position === "fixed" || position === "absolute";
      main.style.setProperty("--he-header-space", overlaysContent ? header.offsetHeight + "px" : "0px");
    };

    updateHeaderSpace();
    if ("ResizeObserver" in window) {
      new ResizeObserver(updateHeaderSpace).observe(header);
    }
    const stateObserver = new MutationObserver(updateHeaderSpace);
    stateObserver.observe(header, { attributes: true, attributeFilter: ["class"] });
    stateObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", updateHeaderSpace, { passive: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHomeShell, { once: true });
  } else {
    mountHomeShell();
  }
})();
