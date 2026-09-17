/* Keep the existing cellular/homeostasis research accessible behind Explore. */
(() => {
  'use strict';
  const openTarget = (hash, scroll) => {
    const target = document.getElementById(hash.slice(1));
    if (!target || !target.matches('.nss-detail')) return;
    target.open = true;
    if (scroll) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.querySelector('summary').focus({ preventScroll: true });
    }
  };
  document.querySelectorAll('[data-nss-explore]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const hash = link.getAttribute('href');
      if (location.hash !== hash) history.pushState(null, '', hash);
      openTarget(hash, true);
    });
  });
  window.addEventListener('hashchange', () => openTarget(location.hash, true));
  if (location.hash) openTarget(location.hash, true);
})();
