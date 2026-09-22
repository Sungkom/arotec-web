(() => {
  "use strict";

  const start = () => {
    const shell = document.getElementById("site-shell");
    const main = document.querySelector("body.sm-page main#main.sm-main[data-home-detail]");
    const footer = document.getElementById("site-footer-shell");
    if (!shell || !main || !footer) return;

    let header = null;

    const updateHeaderSpace = () => {
      if (!header?.isConnected) return;
      const position = getComputedStyle(header).position;
      const overlaysContent = position === "fixed" || position === "absolute";
      const space = overlaysContent ? `${header.offsetHeight}px` : "0px";
      if (main.style.getPropertyValue("--detail-header-space") !== space) {
        main.style.setProperty("--detail-header-space", space);
      }
    };

    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(updateHeaderSpace) : null;
    const headerObserver = new MutationObserver(updateHeaderSpace);
    const stateObserver = new MutationObserver(updateHeaderSpace);
    stateObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    const mountHomeShell = () => {
      // Keep the same ancestry that the index header and footer styles use.
      shell.append(main, footer);

      shell.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"]').forEach((link) => {
        const hash = link.getAttribute("href");
        if (hash && hash.length > 1) link.setAttribute("href", `../index.html${hash}`);
      });

      const nextHeader = shell.querySelector(".site-header");
      if (nextHeader !== header) {
        resizeObserver?.disconnect();
        headerObserver.disconnect();
        header = nextHeader;
        if (header) {
          resizeObserver?.observe(header);
          headerObserver.observe(header, { attributes: true, attributeFilter: ["class", "style"] });
        }
      }
      updateHeaderSpace();
    };

    const preserveBeforeLanguageChange = (event) => {
      if (!(event.target instanceof Element)) return;
      const languageControl = event.type === "change"
        ? event.target.closest("#languageSelect")
        : event.target.closest("[data-lang-chip]");
      if (!languageControl) return;
      // site.js replaces shell.innerHTML synchronously. Preserve the original
      // content and keep the footer connected for newsletter event binding.
      if (main.parentElement === shell) shell.after(main, footer);
    };

    document.addEventListener("change", preserveBeforeLanguageChange, true);
    document.addEventListener("click", preserveBeforeLanguageChange, true);
    document.addEventListener("arotec:languagechange", mountHomeShell);
    window.addEventListener("resize", updateHeaderSpace, { passive: true });
    window.addEventListener("load", updateHeaderSpace, { once: true });
    document.fonts?.ready.then(updateHeaderSpace);
    mountHomeShell();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
