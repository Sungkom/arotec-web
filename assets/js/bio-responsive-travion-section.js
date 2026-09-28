/* Keep the expanded Travion chapters aligned after the shared shell/fonts settle. */
(() => {
  'use strict';

  const instanceKey = Symbol.for('arotec.travion.deepLinks');
  window[instanceKey]?.();

  const events = ['pointerdown', 'wheel', 'touchstart', 'keydown'];
  let activeCleanup;

  const start = () => {
    activeCleanup?.();
    const hash = location.hash;
    if (!/^#(?:travion|trevion)(?:-[\w-]+)?$/.test(hash)) return;

    let observer, settleTimer, stopTimer;
    let cancelled = false;
    let aligning = false;

    const cleanup = () => {
      cancelled = true;
      observer?.disconnect();
      clearTimeout(settleTimer);
      clearTimeout(stopTimer);
      removeEventListener('load', align);
      events.forEach(event => removeEventListener(event, cleanup));
      if (activeCleanup === cleanup) activeCleanup = undefined;
    };

    const schedule = () => {
      if (cancelled || location.hash !== hash) return cleanup();
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        if (cancelled || location.hash !== hash) return cleanup();
        document.getElementById(hash.slice(1))?.scrollIntoView({
          block: 'start',
          behavior: 'instant'
        });
      }, 150);
    };

    const align = async () => {
      if (aligning || cancelled) return;
      aligning = true;
      stopTimer = setTimeout(cleanup, 3000);
      if (document.fonts) await document.fonts.ready;
      if (cancelled || location.hash !== hash) return cleanup();

      const main = document.getElementById('main');
      if (main && 'ResizeObserver' in window) {
        observer = new ResizeObserver(schedule);
        observer.observe(main);
      }
      schedule();
    };

    activeCleanup = cleanup;
    events.forEach(event => addEventListener(event, cleanup, { once: true, passive: true }));
    if (document.readyState === 'complete') align();
    else addEventListener('load', align, { once: true });
  };

  window[instanceKey] = () => {
    activeCleanup?.();
    removeEventListener('hashchange', start);
  };
  addEventListener('hashchange', start);
  start();
})();
