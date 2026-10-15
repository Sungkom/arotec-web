(() => {
  const main = document.querySelector('.ap-main');
  const shell = document.getElementById('site-shell');
  if (!main || !shell) return;

  const menus = [...main.querySelectorAll('.ap-menu')];
  menus.forEach(menu => {
    menu.addEventListener('toggle', () => {
      if (menu.open) menus.forEach(other => { if (other !== menu) other.open = false; });
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) menu.open = false;
    });
  });
  document.addEventListener('pointerdown', event => {
    menus.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const openMenu = menus.find(menu => menu.open);
    if (openMenu) {
      openMenu.open = false;
      openMenu.querySelector('summary').focus();
    }
  });
  const updateSelection = () => {
    main.querySelectorAll('.ap-menu-items a').forEach(link => {
      const isCurrentPanel = link.pathname === location.pathname && link.hash && link.hash === location.hash;
      if (isCurrentPanel) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const panel = document.getElementById(location.hash.slice(1));
    if (panel && panel.classList.contains('ap-panel')) {
      const title = panel.querySelector('h2');
      title.setAttribute('tabindex', '-1');
      title.focus({ preventScroll: true });
    }
  };
  window.addEventListener('hashchange', updateSelection);
  updateSelection();

  const stage = main.querySelector('.ap-stage');
  let header, spacingFrame;
  const setSpacing = (name, value) => {
    if (main.style.getPropertyValue(name) !== value) main.style.setProperty(name, value);
  };
  const syncSpacing = () => {
    if (header) {
      const height = header.getBoundingClientRect().height + 'px';
      setSpacing('--ap-header-height', height);
      if (main.style.getPropertyValue('padding-top') !== height) main.style.setProperty('padding-top', height, 'important');
    }
    // Include the breadcrumb inserted asynchronously by page-navigation.js.
    if (stage) setSpacing('--ap-stage-top', (stage.getBoundingClientRect().top + window.scrollY).toFixed(3) + 'px');
  };
  const scheduleSpacing = () => {
    cancelAnimationFrame(spacingFrame);
    spacingFrame = requestAnimationFrame(syncSpacing);
  };
  const resize = new ResizeObserver(scheduleSpacing);
  resize.observe(main);
  const connectHeader = () => {
    const next = shell.querySelector('.site-header');
    if (!next || next === header) return;
    if (header) resize.unobserve(header);
    header = next;
    resize.observe(header);
    syncSpacing();
  };
  new MutationObserver(connectHeader).observe(shell, { childList: true, subtree: true });
  new MutationObserver(scheduleSpacing).observe(main, { childList: true });
  window.addEventListener('resize', scheduleSpacing);
  window.addEventListener('load', scheduleSpacing, { once: true });
  document.fonts?.ready.then(scheduleSpacing);
  connectHeader();
  scheduleSpacing();
})();
