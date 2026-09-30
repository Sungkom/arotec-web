/* Fit the opening composition into the viewport below the shared site header. */
(() => {
  const hero = document.getElementById('what-defines-us');
  const shell = document.getElementById('site-shell');
  if (!hero || !shell) return;

  let frame = 0;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const offset = Math.max(0, hero.getBoundingClientRect().top + window.scrollY);
      hero.style.setProperty('--wwd-header-offset', `${offset}px`);
    });
  };
  new ResizeObserver(update).observe(shell);
  new MutationObserver(update).observe(shell, { childList: true, subtree: true });
  window.addEventListener('resize', update, { passive: true });
  document.fonts.ready.then(update);
  update();
})();
