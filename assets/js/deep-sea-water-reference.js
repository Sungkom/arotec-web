/* Match the rendered shared header without assuming a desktop-only height. */
(() => {
  const main = document.getElementById('main');
  const shell = document.getElementById('site-shell');
  if (!main || !shell) return;
  let header;
  const sync = () => {
    if (header) main.style.setProperty('--dsw-header-height', `${header.getBoundingClientRect().height}px`);
  };
  const sizeObserver = new ResizeObserver(sync);
  const connect = () => {
    // The home header's search uses home-section anchors. Detail pages need
    // their actual destination pages because those sections are not present.
    const root = document.body.dataset.root || '';
    const destinations = {
      '#applied': 'index.html#applied',
      '#products': 'pages/applied-products.html',
      '#platform': 'pages/platform.html',
      '#insights': 'pages/insights.html'
    };
    for (const link of shell.querySelectorAll('#searchResults a[href^="#"], a[href="#insights"]')) {
      const destination = destinations[link.getAttribute('href')];
      if (destination) link.setAttribute('href', root + destination);
    }
    const next = shell.querySelector('.site-header');
    if (!next || next === header) return;
    sizeObserver.disconnect();
    header = next;
    sizeObserver.observe(header);
    sync();
  };
  new MutationObserver(connect).observe(shell, { childList: true, subtree: true });
  connect();
})();
