(() => {
  'use strict';
  const disclosures = new Map(Array.from(document.querySelectorAll('details.exo-accordion[id]'), element => [element.id, {
    element,
    toggle: element.querySelector('summary'),
    explore: document.querySelector(`[data-explore="${element.id}"]`)
  }]));
  function openDisclosure(id, updateHash = true) {
    const disclosure = disclosures.get(id);
    if (!disclosure?.toggle) return;
    const { element, toggle, explore } = disclosure;
    element.open = true;
    explore?.setAttribute('aria-expanded', 'true');
    if (updateHash) history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
    toggle.focus({ preventScroll: true });
    requestAnimationFrame(() => element.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start'
    }));
  }
  disclosures.forEach(({ element, explore }, id) => element.addEventListener('toggle', () => {
    explore?.setAttribute('aria-expanded', String(element.open));
    if (!element.open && location.hash === `#${id}`) history.replaceState(null, '', `${location.pathname}${location.search}`);
  }));
  document.querySelectorAll('[data-explore]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.explore;
    if (disclosures.has(id)) openDisclosure(id);
  }));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (disclosures.has(id)) openDisclosure(id, false);
  });
  if (disclosures.has(location.hash.slice(1))) openDisclosure(location.hash.slice(1), false);

  window.addEventListener('load', async () => {
    await document.fonts?.ready;
    const target = location.hash.slice(1);
    // Re-align deep links after images and fonts have settled above the disclosure.
    if (target === 'ebii' || disclosures.has(target)) document.getElementById(target)?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, { once: true });
})();
