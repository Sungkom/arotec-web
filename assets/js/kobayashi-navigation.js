(() => {
  "use strict";
  if (window.__arotecKobayashiNavigation) return;
  window.__arotecKobayashiNavigation = true;
  const source = document.currentScript;
  if (!source || !source.src) return;
  const destination = new URL("../../pages/kobayashi.html", source.src);
  const sync = () => {
    document.querySelectorAll(".site-header nav, .commerce-header nav, .mobile-panel nav, #site-shell header nav").forEach((nav) => {
      nav.querySelectorAll("a, button").forEach((item) => {
        if (item.dataset.kobayashiRoute === "true") return;
        const label = item.cloneNode(true);
        label.querySelectorAll("svg, i, [aria-hidden='true'], .sr-only").forEach((node) => node.remove());
        if (!/^kobayashi(?:\s|$)/i.test(label.textContent.replace(/\s+/g, " ").trim())) return;
        let link = item;
        if (item.tagName !== "A") {
          link = document.createElement("a");
          Array.from(item.attributes).forEach(({ name, value }) => {
            if (name !== "type" && name !== "role") link.setAttribute(name, value);
          });
          while (item.firstChild) link.append(item.firstChild);
          item.replaceWith(link);
        }
        link.href = destination.href;
        link.dataset.kobayashiRoute = "true";
        if (window.location.pathname === destination.pathname) link.setAttribute("aria-current", "page");
      });
    });
  };
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("a[data-kobayashi-route='true']")) event.stopImmediatePropagation();
  }, true);
  const start = () => {
    sync();
    new MutationObserver(sync).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
