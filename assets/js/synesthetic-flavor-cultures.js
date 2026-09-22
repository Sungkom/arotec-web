(() => {
  'use strict';
  const mount = () => {
    const shell = document.querySelector('#site-shell');
    const main = document.querySelector('.scc-main');
    if (!shell || !main) return;
    let header;
    // Reserve the shared home header's height without changing its behavior.
    const measure = () => {
      if (!header?.isConnected) return;
      const position = getComputedStyle(header).position;
      main.style.setProperty('--scc-header-space', /fixed|absolute/.test(position) ? `${header.offsetHeight}px` : '0px');
    };
    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    const syncHeader = () => {
      const current = shell.querySelector('.site-header');
      if (current !== header) {
        resizeObserver?.disconnect();
        header = current;
        if (header) resizeObserver?.observe(header);
      }
      measure();
      document.querySelectorAll('.site-header a[href^="#"], .site-footer a[href^="#"]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.length > 1) link.setAttribute('href', `../index.html${href}`);
      });
    };
    syncHeader();
    // Language changes replace the shared shell; follow the new header node.
    new MutationObserver(syncHeader).observe(shell, {childList:true});
    window.addEventListener('resize', measure, { passive:true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once:true });
  else mount();
})();
