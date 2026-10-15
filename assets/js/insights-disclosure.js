/* The Insights label is a disclosure, not a page destination. */
(() => {
  'use strict';
  if (window.ArotecInsightsDisclosure) return;
  const selector = 'button[data-arotec-nav-key="insights"], button[data-insights-disclosure]';
  const bound = new Map();
  let sequence = 0, frame = 0;

  function bind(button) {
    const group = button.closest('.nav-dropdown, .mobile-nav-group');
    const menu = group?.querySelector(':scope > .nav-submenu, :scope > .mobile-nav-submenu');
    if (!group || !menu) return;
    const mobile = group.classList.contains('mobile-nav-group');
    const controller = new AbortController();
    const listen = (target, event, handler, options = {}) => target.addEventListener(event, handler, { ...options, signal: controller.signal });
    const originalDisplay = menu.style.display;
    let expanded = mobile, openedByHover = false;
    if (!menu.id) menu.id = `arotec-insights-submenu-${++sequence}`;
    button.type = 'button';
    button.removeAttribute('href');
    button.removeAttribute('aria-haspopup');
    button.setAttribute('aria-controls', menu.id);
    // Frozen headers can live outside #site-shell's native-button reset.
    Object.assign(button.style, { appearance: 'none', margin: '0', border: '0', background: 'transparent', fontFamily: 'inherit', textAlign: 'inherit', cursor: 'pointer' });
    // A visibility transition postpones keyboard focus even after inert clears.
    // Keep the existing opacity/movement timing while making focusability immediate.
    menu.style.transitionProperty = 'opacity, transform';

    function setExpanded(next, source = '') {
      expanded = Boolean(next);
      openedByHover = expanded && source === 'hover';
      button.setAttribute('aria-expanded', String(expanded));
      menu.setAttribute('aria-hidden', String(!expanded));
      menu.inert = !expanded;
      if (mobile) menu.style.display = expanded ? originalDisplay : 'none';
      menu.style.visibility = expanded ? 'visible' : 'hidden';
      menu.style.opacity = expanded ? '1' : '0';
      menu.style.pointerEvents = expanded ? 'auto' : 'none';
      menu.style.transform = expanded ? (mobile ? 'none' : 'translate(-50%, 0)') : '';
    }
    const links = () => Array.from(menu.querySelectorAll('a[href], button:not([disabled])')).filter(link => link.getClientRects().length);
    listen(button, 'click', () => setExpanded(!expanded || openedByHover));
    listen(group, 'pointerenter', event => {
      if (!mobile && event.pointerType !== 'touch' && !expanded) setExpanded(true, 'hover');
    });
    listen(group, 'pointerleave', event => {
      if (!mobile && event.pointerType !== 'touch' && !menu.contains(document.activeElement)) setExpanded(false);
    });
    listen(group, 'focusout', event => {
      // During pointer focus transfer, activeElement can briefly be BODY.
      // relatedTarget already identifies an intended move into this submenu.
      if (event.relatedTarget && group.contains(event.relatedTarget)) return;
      queueMicrotask(() => {
        if (!mobile && !group.contains(document.activeElement)) setExpanded(false);
      });
    });
    listen(group, 'keydown', event => {
      if (event.target === button && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        event.preventDefault();
        setExpanded(true);
        const items = links();
        (event.key === 'ArrowUp' ? items.at(-1) : items[0])?.focus();
      } else if (event.key === 'Escape' && expanded) {
        event.preventDefault();
        event.stopPropagation();
        setExpanded(false);
        button.focus();
      }
    });
    listen(document, 'pointerdown', event => {
      if (!mobile && !group.contains(event.target)) setExpanded(false);
    }, { capture: true });
    listen(window, 'resize', () => { if (!mobile) setExpanded(false); }, { passive: true });
    listen(window, 'pageshow', () => { if (!mobile) setExpanded(false); });
    setExpanded(expanded);
    bound.set(button, { controller, menu });
  }

  function refresh() {
    frame = 0;
    for (const [button, state] of bound) {
      if (!button.isConnected || !state.menu.isConnected) {
        state.controller.abort();
        bound.delete(button);
      }
    }
    document.querySelectorAll(selector).forEach(button => { if (!bound.has(button)) bind(button); });
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(refresh); }
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('arotec:languagechange', schedule);
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
  window.ArotecInsightsDisclosure = { refresh: schedule };
  schedule();
})();
