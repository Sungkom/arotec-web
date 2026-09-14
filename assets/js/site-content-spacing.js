/* Align explicitly marked foreground copies without moving mixed-layout
   parents, photographs, gradients or menus. Compatible with file:// pages. */
(() => {
  'use strict';
  const desktop = matchMedia('(min-width: 1200px)');
  const shifts = new WeakMap();
  let targets = [], needsScan = true, frame = 0;
  const role = element => element ? getComputedStyle(element).getPropertyValue('--arotec-foreground-measure').trim() : '';
  const resize = new ResizeObserver(() => schedule());

  function scan() {
    targets.forEach(element => resize.unobserve(element));
    targets = [...document.querySelectorAll('main, main div, main section, main article, main header, main figure, main h1, main h2, main p, main blockquote, main ul, main ol, main aside, main nav, body > .loop-heading, body > .overlay-hint, .shb-closing > .shb-closing-inner')]
      .filter(element => role(element) === '1' && role(element.parentElement) !== '1');
    targets.forEach(element => resize.observe(element));
    needsScan = false;
  }
  function alignFramework(gutter) {
    const canvas = document.querySelector('#research-solutions .framework-canvas');
    if (!canvas?.querySelector('.framework-foreground')) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return;
    const right = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--arotec-content-right')) || 150;
    const available = Math.max(1, innerWidth - gutter - right);
    // Bounds of the clipped connected panels in the original 2067px artwork.
    const first = .199707, last = .799316;
    const scale = Math.min(1, available / (rect.width * (last - first)));
    const values = {
      '--framework-content-x': `${gutter - rect.left}px`,
      '--framework-content-width': `${available}px`,
      '--framework-foreground-x': `${gutter - rect.left - first * rect.width * scale}px`,
      '--framework-foreground-y': `${rect.height * .298408 * (1 - scale)}px`,
      '--framework-foreground-scale': `${scale}`
    };
    for (const [name, value] of Object.entries(values)) {
      if (canvas.style.getPropertyValue(name) !== value) canvas.style.setProperty(name, value);
    }
  }
  function align() {
    frame = 0;
    if (!desktop.matches) {
      targets.forEach(element => { element.style.removeProperty('--arotec-foreground-shift-x'); shifts.delete(element); });
      needsScan = true;
      return;
    }
    if (needsScan) scan();
    const gutter = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--arotec-content-left')) || 150;
    alignFramework(gutter);
    const updates = targets.filter(element => element.isConnected).map(element => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const scale = element.offsetWidth ? rect.width / element.offsetWidth : 1;
      const previous = shifts.get(element) || 0;
      const origin = rect.left - previous * scale;
      return {element, shift:(gutter - origin) / scale};
    });
    updates.forEach(update => {
      if (!update) return;
      const {element, shift} = update;
      if (Math.abs(shift - (shifts.get(element) || 0)) < 0.05) return;
      shifts.set(element, shift);
      element.style.setProperty('--arotec-foreground-shift-x', `${shift.toFixed(4)}px`);
    });
  }
  function schedule(rescan = false) {
    needsScan ||= rescan;
    if (!frame) frame = requestAnimationFrame(align);
  }
  new MutationObserver(() => schedule(true)).observe(document.documentElement, {childList:true, subtree:true});
  addEventListener('resize', () => schedule(true));
  addEventListener('load', () => schedule(true), {once:true});
  document.addEventListener('transitionend', () => schedule());
  document.fonts?.ready.then(() => schedule(true));
  document.fonts?.addEventListener('loadingdone', () => schedule(true));
  desktop.addEventListener('change', () => schedule(true));
  schedule(true);
})();
