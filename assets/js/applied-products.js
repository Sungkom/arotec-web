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

  let header;
  const syncSpacing = () => {
    if (header) {
      const height = header.getBoundingClientRect().height + 'px';
      main.style.setProperty('--ap-header-height', height);
      main.style.setProperty('padding-top', height, 'important');
    }
  };
  const resize = new ResizeObserver(syncSpacing);
  const connectHeader = () => {
    const next = shell.querySelector('.site-header');
    if (!next || next === header) return;
    resize.disconnect();
    header = next;
    resize.observe(header);
    syncSpacing();
  };
  new MutationObserver(connectHeader).observe(shell, { childList: true, subtree: true });
  connectHeader();
})();
