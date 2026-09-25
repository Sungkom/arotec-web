/* Reuse the homepage shell without moving the article into its render mount. */
(() => {
  'use strict';
  const start = () => {
    const shell = document.getElementById('site-shell');
    const footer = document.getElementById('site-footer-shell');
    const main = document.querySelector('main.exb-main');
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

/* Match the Exposome page's native disclosure and Explore interaction. */
(() => {
  'use strict';
  const start = () => {
    const main = document.querySelector('main.exb-main');
    if (!main) return;
    const disclosures = new Map();
    const validId = /^[A-Za-z][A-Za-z0-9_-]*$/;
    main.querySelectorAll('button[data-exb-explore]').forEach(explore => {
      const id = explore.dataset.exbExplore;
      const contentId = explore.getAttribute('aria-controls');
      if (!id || !contentId || !validId.test(id) || !validId.test(contentId)) return;
      const element = document.getElementById(id);
      const content = document.getElementById(contentId);
      if (!element?.matches('details.exb-disclosure') || !main.contains(element) || content?.parentElement !== element) return;
      const summary = Array.from(element.children).find(child => child.matches('summary'));
      if (!summary) return;
      if (!disclosures.has(id)) disclosures.set(id, { element, summary, explores: [] });
      disclosures.get(id).explores.push(explore);
      explore.setAttribute('aria-expanded', String(element.open));
      explore.addEventListener('click', () => openDisclosure(id));
    });
    if (!disclosures.size) return;
    let scrollFrame = 0;

    const alignDisclosure = (disclosure, instant = false) => {
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        if (!disclosure.open) return;
        disclosure.scrollIntoView({
          behavior: instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start'
        });
      });
    };
    const openDisclosure = (id, updateHash = true) => {
      const disclosure = disclosures.get(id);
      if (!disclosure) return;
      const { element, summary, explores } = disclosure;
      element.open = true;
      explores.forEach(explore => explore.setAttribute('aria-expanded', 'true'));
      if (updateHash) history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
      summary.focus({ preventScroll: true });
      alignDisclosure(element);
    };

    disclosures.forEach(({ element, explores }, id) => {
      element.addEventListener('toggle', () => {
        explores.forEach(explore => explore.setAttribute('aria-expanded', String(element.open)));
        if (!element.open && location.hash === `#${id}`) {
          history.replaceState(null, '', `${location.pathname}${location.search}`);
        }
      });
    });
    window.addEventListener('hashchange', () => {
      openDisclosure(location.hash.slice(1), false);
    });
    openDisclosure(location.hash.slice(1), false);

    const alignAfterLoad = async () => {
      await document.fonts?.ready;
      // Allow the shared header's queued measurement to settle first.
      requestAnimationFrame(() => {
        const disclosure = disclosures.get(location.hash.slice(1));
        if (disclosure?.element.open) alignDisclosure(disclosure.element, true);
      });
    };
    if (document.readyState === 'complete') alignAfterLoad();
    else window.addEventListener('load', alignAfterLoad, { once: true });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
