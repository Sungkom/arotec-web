/* Keep the shared home-menu section links usable from this detail page. */
(() => {
  const connectHomeLinks = () => {
    document.querySelectorAll('#mobilePanel a[href^="#"]').forEach((link) => {
      const hash = link.getAttribute('href');
      if (hash && hash.length > 1) link.setAttribute('href', '../index.html' + hash);
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectHomeLinks, { once: true });
  else connectHomeLinks();
})();
