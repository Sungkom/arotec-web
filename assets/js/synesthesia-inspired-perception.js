/* Research disclosures and dialogs; the existing site scripts own navigation and footer. */
(function () {
  "use strict";
  const root = document.querySelector("main.sip-main");
  if (!root) return;
  const openers = new WeakMap();
  const disclosures = new Map(Array.from(root.querySelectorAll("details.sip-accordion[id]"), element => [element.id, {
    element,
    toggle: element.querySelector("summary"),
    explore: root.querySelector(`[data-sip-explore="${element.id}"]`)
  }]));
  const disclosureId = id => id === "sip-functional-context" ? "functional-outcomes" : id;

  function openDisclosure(id, updateHash = true) {
    id = disclosureId(id);
    const disclosure = disclosures.get(id);
    if (!disclosure?.toggle) return;
    const { element, toggle, explore } = disclosure;
    element.open = true;
    explore?.setAttribute("aria-expanded", "true");
    if (updateHash) history.replaceState(null, "", `${location.pathname}${location.search}#${id}`);
    toggle.focus({ preventScroll: true });
    requestAnimationFrame(() => element.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start"
    }));
  }

  disclosures.forEach(({ element, explore }, id) => element.addEventListener("toggle", function () {
    explore?.setAttribute("aria-expanded", String(element.open));
    if (!element.open && disclosureId(location.hash.slice(1)) === id) {
      history.replaceState(null, "", `${location.pathname}${location.search}`);
    }
  }));

  window.addEventListener("hashchange", function () {
    openDisclosure(location.hash.slice(1), false);
  });
  openDisclosure(location.hash.slice(1), false);

  window.addEventListener("load", async function () {
    await document.fonts?.ready;
    // Re-align deep links after preceding images and fonts have settled.
    disclosures.get(disclosureId(location.hash.slice(1)))?.element.scrollIntoView({ behavior: "instant", block: "start" });
  }, { once: true });

  root.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) return;
    const explore = event.target.closest("[data-sip-explore]");
    if (explore) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      if (!disclosures.has(disclosureId(explore.dataset.sipExplore))) return;
      event.preventDefault();
      openDisclosure(explore.dataset.sipExplore);
      return;
    }
    const opener = event.target.closest("[data-sip-dialog]");
    if (opener) {
      const dialog = document.getElementById(opener.dataset.sipDialog);
      if (dialog instanceof HTMLDialogElement && !dialog.open) {
        openers.set(dialog, opener);
        dialog.showModal();
      }
      return;
    }
    const closeButton = event.target.closest("[data-sip-close]");
    if (closeButton) {
      const dialog = closeButton.closest("dialog");
      if (dialog instanceof HTMLDialogElement) dialog.close();
    }
  });

  root.querySelectorAll("dialog.sip-dialog").forEach(function (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) {
        dialog.close();
      }
    });
    dialog.addEventListener("close", function () {
      const opener = openers.get(dialog);
      if (opener && opener.isConnected) opener.focus();
    });
  });
})();
