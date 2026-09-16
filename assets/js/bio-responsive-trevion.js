/* Home sections in the shared mobile navigation belong to index.html. */
(() => {
  'use strict';
  const updateLinks = () => {
    document.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"], [aria-label="Mobile navigation"] a[href^="#"]').forEach(link => {
      const hash = link.getAttribute('href');
      if (hash && hash.length > 1) link.setAttribute('href', '../index.html' + hash);
    });
  };
  const start = () => {
    updateLinks();
    new MutationObserver(updateLinks).observe(document.getElementById('site-shell'), { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
