(() => {
  'use strict';
  const disclosure = document.getElementById('transition-details');
  const summary = disclosure?.querySelector('summary');
  const explore = document.querySelector('[data-stress-explore]');
  const scrollBehavior = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
  const syncExpanded = () => explore?.setAttribute('aria-expanded', String(disclosure?.open || false));
  const hashTarget = () => document.getElementById(location.hash.slice(1));

  function openDetails(target = disclosure, behavior = scrollBehavior()) {
    if (!disclosure || !summary) return;
    disclosure.open = true;
    syncExpanded();
    summary.focus({ preventScroll:true });
    requestAnimationFrame(() => target.scrollIntoView({ block:'start', behavior }));
  }
  explore?.addEventListener('click', event => {
    if (!disclosure || !summary) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.replaceState(null, '', `${location.pathname}${location.search}#${disclosure.id}`);
    openDetails();
  });
  disclosure?.addEventListener('toggle', () => {
    syncExpanded();
    const target = hashTarget();
    if (!disclosure.open && target && disclosure.contains(target)) {
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    }
  });
  function revealHash(behavior) {
    const target = hashTarget();
    if (target && disclosure?.contains(target)) openDetails(target, behavior);
    else if (target?.closest('.sn-neurodegeneration')) {
      requestAnimationFrame(() => target.scrollIntoView({ block:'start', behavior }));
    }
  }
  window.addEventListener('hashchange', () => revealHash(scrollBehavior()));
  syncExpanded();
  revealHash('instant');
  window.addEventListener('pageshow', async () => {
    await document.fonts?.ready;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = hashTarget();
      if (target && ((disclosure?.open && disclosure.contains(target)) || target.closest('.sn-neurodegeneration'))) {
        target.scrollIntoView({ block:'start', behavior:'instant' });
      }
    }));
  }, { once:true });

  // Preserve the existing recurrence link independently of the research disclosure.
  const targets = new Set(['recovery-pathway', 'stress-exposure']);
  document.querySelectorAll('.sn-recurrence').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.hash.slice(1);
      const target = targets.has(id) && document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', `#${id}`);
      target.focus({preventScroll:true});
      target.scrollIntoView({block:'start',behavior:scrollBehavior()});
    });
  });
})();
