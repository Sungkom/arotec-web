(() => {
  'use strict';
  const shell = document.getElementById('site-shell');
  const reserveHeaderSpace = () => {
    const header = shell?.querySelector('.site-header');
    if (header) shell.style.minHeight = `${header.offsetHeight}px`;
  };
  const headerObserver = new ResizeObserver(reserveHeaderSpace);
  // Home navigation uses same-page anchors on index; detail pages point home.
  const normalizeShellLinks = () => {
    const home = `${document.body.dataset.root || ''}index.html`;
    document.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"], .mobile-panel a[href^="#"]').forEach(link => {
      const hash = link.getAttribute('href');
      if (hash.length > 1) link.setAttribute('href', home + hash);
    });
    headerObserver.disconnect();
    const header = shell?.querySelector('.site-header');
    if (header) headerObserver.observe(header);
    reserveHeaderSpace();
  };
  normalizeShellLinks();
  document.addEventListener('arotec:languagechange', normalizeShellLinks);
  // Search results are created on demand by the shared shell.
  document.addEventListener('click', event => {
    const link = event.target.closest('#searchResults a[href^="#"]');
    if (!link) return;
    link.setAttribute('href', `${document.body.dataset.root || ''}index.html${link.getAttribute('href')}`);
  }, true);
})();
