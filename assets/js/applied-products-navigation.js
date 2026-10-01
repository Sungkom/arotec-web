(() => {
  const shell = document.body;
  if (!shell || document.documentElement.hasAttribute('data-ap-products-navigation')) return;
  document.documentElement.setAttribute('data-ap-products-navigation', 'ready');
  const productsUrl = new URL('../../pages/applied-products.html', document.currentScript.src).href;
  const countdownUrl = new URL('../../applied-products-countdown.html', document.currentScript.src).href;
  const bespokeUrl = new URL('../../pages/bespoke-services.html', document.currentScript.src).href;
  const countdownLabels = new Set(['Vagus spa', 'Vagus scent bulb', 'Neuro-cosmetic']);
  const directLinks = new WeakSet();

  // Keep the dedicated page destination, but leave the trigger, chevron and
  // submenu intact so shared navigation CSS owns hover, focus and transitions.
  // Mobile uses the same visible submenu list as the other navigation groups.
  const connect = () => {
    shell.querySelectorAll('.site-header nav a, .commerce-header nav a, .mobile-panel nav a').forEach(link => {
      if (link.closest('.nav-submenu, .mobile-nav-submenu')) {
        const label = link.textContent.trim();
        if (label === 'Bespoke Services') {
          link.href = bespokeUrl;
          const isCurrent = location.pathname === new URL(bespokeUrl).pathname;
          link.classList.toggle('active', isCurrent);
          if (isCurrent) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        }
        else if (countdownLabels.has(label)) link.href = countdownUrl;
        return;
      }
      const href = link.getAttribute('href') || '';
      const isProducts = link.textContent.trim() === 'Applied Products'
        || /(?:^|\/)(?:index\.html)?#products$/.test(href)
        || /(?:^|\/)(?:applied-)?products\.html(?:[?#].*)?$/.test(href);
      if (!isProducts) return;
      link.href = productsUrl;
      if (!directLinks.has(link)) {
        directLinks.add(link);
        link.addEventListener('click', event => {
          event.stopImmediatePropagation();
          if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          location.assign(link.href);
        }, true);
      }
    });
  };
  new MutationObserver(connect).observe(shell, { childList:true, subtree:true });
  connect();
})();
