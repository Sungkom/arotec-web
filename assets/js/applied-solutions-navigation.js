(() => {
  "use strict";
  if (window.__arotecAppliedSolutionsNavigation) return;
  window.__arotecAppliedSolutionsNavigation = true;
  const source = document.currentScript;
  if (!source || !source.src) return;
  const destination = new URL("../../pages/applied-solutions-overview.html", source.src).href;
  const surfaces = ".site-header nav, .commerce-header nav, .mobile-panel nav, #site-shell header nav";
  const sync = () => {
    document.querySelectorAll(surfaces).forEach((nav) => {
      nav.querySelectorAll("a, button").forEach((item) => {
        if (item.dataset.asOverviewLink === "true") return;
        const label = item.cloneNode(true);
        label.querySelectorAll("svg, i, [aria-hidden='true'], .sr-only").forEach((node) => node.remove());
        if (label.textContent.replace(/\s+/g, " ").trim().toLowerCase() !== "applied solutions") return;
        let link = item;
        if (item.tagName !== "A") {
          link = document.createElement("a");
          Array.from(item.attributes).forEach(({ name, value }) => {
            if (name !== "type" && name !== "role") link.setAttribute(name, value);
          });
          while (item.firstChild) link.append(item.firstChild);
          item.replaceWith(link);
        }
        link.setAttribute("href", destination);
        link.dataset.asOverviewLink = "true";
        if (window.location.pathname === new URL(destination).pathname) link.setAttribute("aria-current", "page");
      });
    });
  };
  // Keep the main heading a normal link; leave existing submenu content intact.
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest("a[data-as-overview-link='true']");
    if (link) event.stopImmediatePropagation();
  }, true);
  const start = () => {
    sync();
    new MutationObserver(sync).observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
