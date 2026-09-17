(() => {
  'use strict';
  const exploreButtons = [...document.querySelectorAll('[data-hla-explore]')];
  const disclosures = new Map();
  for (const disclosure of document.querySelectorAll('details.hla-accordion[id]')) {
    const summary = disclosure.querySelector('summary');
    if (!summary) continue;
    disclosures.set(disclosure.id, {
      disclosure,
      summary,
      explores: exploreButtons.filter(button => button.dataset.hlaExplore === disclosure.id)
    });
  }
  if (!disclosures.size) return;

  function syncExpanded({ disclosure, explores }) {
    for (const explore of explores) {
      explore.setAttribute('aria-expanded', String(disclosure.open));
    }
  }

  function openDisclosure(entry, updateHash = true, behavior) {
    const { disclosure, summary } = entry;
    disclosure.open = true;
    syncExpanded(entry);
    if (updateHash) history.replaceState(null, '', `${location.pathname}${location.search}#${disclosure.id}`);
    summary.focus({ preventScroll: true });
    requestAnimationFrame(() => disclosure.scrollIntoView({
      behavior: behavior || (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'),
      block: 'start'
    }));
  }

  for (const entry of disclosures.values()) {
    const { disclosure, explores } = entry;
    syncExpanded(entry);
    for (const explore of explores) {
      explore.addEventListener('click', () => openDisclosure(entry));
    }
    disclosure.addEventListener('toggle', () => {
      syncExpanded(entry);
      if (!disclosure.open && location.hash === `#${disclosure.id}`) {
        history.replaceState(null, '', `${location.pathname}${location.search}`);
      }
    });
  }

  window.addEventListener('hashchange', () => {
    const entry = disclosures.get(location.hash.slice(1));
    if (entry) openDisclosure(entry, false);
  });
  const initialEntry = disclosures.get(location.hash.slice(1));
  if (initialEntry) openDisclosure(initialEntry, false, 'instant');
  window.addEventListener('pageshow', async () => {
    await document.fonts?.ready;
    // Allow native hash/history restoration and responsive layout to settle.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const entry = disclosures.get(location.hash.slice(1));
      if (entry?.disclosure.open) {
        entry.disclosure.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    }));
  }, { once: true });
})();
