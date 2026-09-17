(() => {
  'use strict';

  const panel = document.getElementById('neuromodulatory-systems');
  const toggle = panel?.querySelector('summary');
  const explore = document.querySelector('[data-np26-explore="neuromodulatory-systems"]');
  if (!panel || !toggle || !explore) return;

  const isPanelHash = () => location.hash === `#${panel.id}`;
  const syncExpanded = () => explore.setAttribute('aria-expanded', String(panel.open));
  const scrollToPanel = (animate = true) => {
    // Use the actual shared header height without adding the site's root scroll padding twice.
    const header = document.querySelector('.site-header');
    const headerHeight = header?.offsetHeight || 0;
    window.scrollTo({
      top: window.scrollY + panel.getBoundingClientRect().top - headerHeight - 24,
      behavior: animate && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant'
    });
  };

  function openPanel(updateHash = true, animate = true) {
    panel.open = true;
    syncExpanded();
    if (updateHash) history.replaceState(null, '', `${location.pathname}${location.search}#${panel.id}`);
    toggle.focus({ preventScroll: true });
    requestAnimationFrame(() => scrollToPanel(animate));
  }

  explore.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openPanel();
  });

  panel.addEventListener('toggle', () => {
    syncExpanded();
    if (!panel.open && isPanelHash()) history.replaceState(null, '', `${location.pathname}${location.search}`);
  });

  window.addEventListener('hashchange', () => {
    if (isPanelHash()) openPanel(false);
  });

  if (isPanelHash()) openPanel(false, false);
  window.addEventListener('pageshow', async () => {
    await document.fonts?.ready;
    // Align after native fragment navigation and the shared shell's first layout.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (isPanelHash() && panel.open) scrollToPanel(false);
    }));
  });
})();
