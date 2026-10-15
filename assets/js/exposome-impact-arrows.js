/* Align the CSS arrows with the actual card/image positions after
   disclosure, font, language and viewport changes. */
(() => {
  'use strict';
  const section = document.querySelector('.exo-personal-impact');
  if (!section) return;
  const cards = [...section.querySelectorAll('.exo-impact-step')];
  let queued = false;
  function update() {
    queued = false;
    if (!section.getBoundingClientRect().width) return;
    cards.slice(0, -1).forEach((card, index) => {
      const arrow = card.querySelector('.exo-impact-reference-arrow');
      const a = card.getBoundingClientRect();
      const b = cards[index + 1].getBoundingClientRect();
      const photo = card.querySelector('img').getBoundingClientRect();
      const stacked = b.top >= a.bottom - 1;
      const x = stacked ? a.width / 2 : (a.right + b.left) / 2 - a.left;
      const y = stacked ? (a.bottom + b.top) / 2 - a.top : photo.top - a.top + photo.height * .455;
      arrow.style.setProperty('--exo-impact-arrow-x', `${x - 14 - card.clientLeft}px`);
      arrow.style.setProperty('--exo-impact-arrow-y', `${y - 14 - card.clientTop}px`);
    });
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    cards.forEach(card => observer.observe(card));
  }
  section.closest('details')?.addEventListener('toggle', schedule);
  section.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule));
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  document.addEventListener('arotec:languagechange', schedule);
  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener('loadingdone', schedule);
  schedule();
})();
