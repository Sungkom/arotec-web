(() => {
  'use strict';
  const cascade = document.querySelector('#cascade.hla-cascade-reference');
  const broadArrow = cascade?.querySelector('.hla-cascade-burden-shape');
  const arrows = [...(cascade?.querySelectorAll('.hla-card > .hla-flow-arrow') || [])];
  if (!broadArrow || !arrows.length) return;

  const wideLayout = matchMedia('(min-width: 1400px)');
  let frame = 0;

  function alignArrows() {
    frame = 0;
    if (!wideLayout.matches) {
      for (const arrow of arrows) arrow.style.removeProperty('--hla-flow-top');
      return;
    }

    const broadBounds = broadArrow.getBoundingClientRect();
    const center = broadBounds.top + broadBounds.height / 2;
    // Use each arrow's own containing block so card borders and changing
    // photo/caption heights cannot move the connectors off the shared axis.
    const positions = arrows.map(arrow => {
      const parent = arrow.offsetParent;
      if (!parent) return null;
      const parentBounds = parent.getBoundingClientRect();
      const arrowBounds = arrow.getBoundingClientRect();
      return { arrow, top: center - parentBounds.top - parent.clientTop - arrowBounds.height / 2 };
    });
    for (const position of positions) {
      if (position) position.arrow.style.setProperty('--hla-flow-top', `${position.top.toFixed(2)}px`);
    }
  }

  function scheduleAlignment() {
    if (!frame) frame = requestAnimationFrame(alignArrows);
  }

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleAlignment);
    observer.observe(broadArrow);
    for (const arrow of arrows) observer.observe(arrow.parentElement);
  }
  window.addEventListener('resize', scheduleAlignment, { passive: true });
  wideLayout.addEventListener('change', scheduleAlignment);
  document.addEventListener('arotec:languagechange', scheduleAlignment);
  document.fonts?.ready.then(scheduleAlignment);
  scheduleAlignment();
})();
