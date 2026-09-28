/* Show one ingredient at a time while preserving native fragment navigation. */
(() => {
  'use strict';

  const panels = [...document.querySelectorAll('[data-ingredient-panel]')];
  const controls = [...document.querySelectorAll('#ingredient-systems a[aria-controls]')];
  if (!panels.length) return;

  const panelForHash = (hash) => {
    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // An invalid encoded fragment can still match a literal element ID.
    }
    return document.getElementById(id)?.closest('[data-ingredient-panel]') || null;
  };

  const showPanel = (selected) => {
    panels.forEach((panel) => {
      panel.hidden = panel !== selected;
    });
    controls.forEach((control) => {
      const expanded = control.getAttribute('aria-controls') === selected?.id;
      control.setAttribute('aria-expanded', String(expanded));
      control.closest('.bri-card')?.classList.toggle('is-active', expanded);
    });
  };

  // Reveal the destination before the browser performs its normal anchor scroll.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    const panel = panelForHash(url.hash);
    if (panel) showPanel(panel);
  }, true);

  const syncHash = () => showPanel(panelForHash(location.hash));
  addEventListener('hashchange', syncHash);
  syncHash();
})();
