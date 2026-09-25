/* Reuse the homepage shell without moving the article into its render mount. */
(() => {
  'use strict';
  const start = () => {
    const shell = document.getElementById('site-shell');
    const footer = document.getElementById('site-footer-shell');
    const main = document.querySelector('main.esh-main');
    if (!shell || !footer || !main) return;
    let header = null;
    let frame = 0;
    const updateSpace = () => {
      frame = 0;
      const floating = header && ['fixed', 'absolute'].includes(getComputedStyle(header).position);
      main.style.setProperty('--detail-header-space', `${floating ? header.offsetHeight : 0}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(updateSpace); };
    const resize = new ResizeObserver(schedule);
    const sync = () => {
      const next = shell.querySelector('.site-header');
      if (header !== next) {
        resize.disconnect();
        header = next;
        if (header) resize.observe(header);
      }
      for (const mount of [shell, footer]) {
        mount.querySelectorAll('.site-header a[href^="#"], .mobile-nav a[href^="#"], .site-footer a[href^="#"], #searchModal a[href^="#"]').forEach(link => {
          const hash = link.getAttribute('href');
          if (hash && hash.length > 1) link.setAttribute('href', `index.html${hash}`);
        });
      }
      schedule();
    };
    const observer = new MutationObserver(sync);
    observer.observe(shell, { childList:true, subtree:true });
    observer.observe(footer, { childList:true, subtree:true });
    window.addEventListener('resize', schedule, { passive:true });
    window.addEventListener('load', schedule, { once:true });
    document.fonts?.ready.then(schedule);
    sync();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();

