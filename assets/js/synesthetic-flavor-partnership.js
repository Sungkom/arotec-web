/* Keep the shared navigation clear of the Partnership content. */
(() => {
  "use strict";

  const start = () => {
    const shell = document.getElementById("site-shell");
    const main = document.querySelector("main#main");
    if (!shell || !main) return;

    let header = null;

    const updateHeaderSpace = () => {
      if (!header?.isConnected) return;
      const position = getComputedStyle(header).position;
      const overlaysContent = position === "absolute" || position === "fixed";
      // Static, relative and sticky headers already occupy the shell's height.
      // When a header becomes fixed, this padding replaces its lost flow space.
      // Measure height rather than its top edge so hide/reveal transforms do
      // not change the document layout while the user scrolls.
      const height = overlaysContent ? header.getBoundingClientRect().height : 0;
      const value = `${Math.max(0, height).toFixed(3)}px`;
      if (main.style.getPropertyValue("--detail-header-space") !== value) {
        main.style.setProperty("--detail-header-space", value);
      }
    };

    const resizeObserver = "ResizeObserver" in window
      ? new ResizeObserver(updateHeaderSpace)
      : null;
    const headerObserver = new MutationObserver(updateHeaderSpace);

    const connectHeader = () => {
      const nextHeader = shell.querySelector(":scope > .site-header");
      if (nextHeader !== header) {
        resizeObserver?.disconnect();
        headerObserver.disconnect();
        header = nextHeader;
        if (header) {
          resizeObserver?.observe(header);
          headerObserver.observe(header, {
            attributes: true,
            attributeFilter: ["class", "style", "hidden"]
          });
        }
      }
      updateHeaderSpace();
    };

    // Language changes replace the header. The content and footer stay outside
    // this replaceable shell, and each new header gets its own observations.
    new MutationObserver(connectHeader).observe(shell, { childList: true });
    new MutationObserver(updateHeaderSpace).observe(document.body, {
      attributes: true,
      attributeFilter: ["class"]
    });
    window.addEventListener("resize", updateHeaderSpace, { passive: true });
    window.addEventListener("load", updateHeaderSpace, { once: true });
    document.fonts?.ready.then(updateHeaderSpace);
    connectHeader();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
