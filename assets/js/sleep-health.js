/* Reuse the homepage navigation/footer while directing homepage anchors home. */
(() => {
  'use strict';
  const shell = document.getElementById('site-shell');
  const reserveHeaderSpace = () => {
    const header = shell?.querySelector('.site-header');
    if (header) shell.style.minHeight = `${header.offsetHeight}px`;
  };
  const observer = new ResizeObserver(reserveHeaderSpace);
  const normalizeShellLinks = () => {
    const home = `${document.body.dataset.root || ''}index.html`;
    document.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"], .mobile-panel a[href^="#"]').forEach(link => {
      const hash = link.getAttribute('href');
      if (hash.length > 1) link.setAttribute('href', home + hash);
    });
    observer.disconnect();
    const header = shell?.querySelector('.site-header');
    if (header) observer.observe(header);
    reserveHeaderSpace();
  };
  normalizeShellLinks();
  document.addEventListener('arotec:languagechange', normalizeShellLinks);
  document.addEventListener('click', event => {
    const link = event.target.closest('#searchResults a[href^="#"]');
    if (link) link.setAttribute('href', `${document.body.dataset.root || ''}index.html${link.getAttribute('href')}`);
  }, true);
})();
