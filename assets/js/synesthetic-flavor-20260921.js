/* Preserve the sensory explorer's pointer and keyboard interactions. */
(() => {
  // Reserve the actual shared header height for each desktop composition.
  const main = document.getElementById('main');
  const shell = document.getElementById('site-shell');
  const watchHeader = () => {
    const header = shell?.querySelector('.site-header');
    if (!header || !main) return false;
    const update = () => {
      const height = header.getBoundingClientRect().height;
      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      main.style.setProperty('--sfl-header-height', `${height}px`);
      main.style.setProperty('--sfl-anchor-margin', `${Math.max(0, height - scrollPadding)}px`);
    };
    update();
    new ResizeObserver(update).observe(header);
    return true;
  };
  if (!watchHeader() && shell) {
    const observer = new MutationObserver(() => { if (watchHeader()) observer.disconnect(); });
    observer.observe(shell, { childList:true, subtree:true });
  }
  // Preserve the reference line breaks in DM Sans. Fit the live text inside
  // its assigned box without changing the supplied background's size.
  const fitReferenceText = () => {
    const boxes = [...document.querySelectorAll('.sfl-source [data-sfl-fit]')]
      .filter(box => box.clientWidth > 0);
    boxes.forEach(box => box.style.setProperty('--sfl-fit', '1'));
    const sizes = boxes.map(box => {
      const widest = Math.max(...[...box.querySelectorAll('.sfl-line')].map(line => line.scrollWidth));
      return Math.min(1, box.clientWidth / Math.max(1, widest));
    });
    boxes.forEach((box, index) => box.style.setProperty('--sfl-fit', String(sizes[index])));
    // Keep each action attached to its copy as the reference text resizes.
    for (const id of ['science', 'applications']) {
      const scene = document.querySelector(`.sfl-source[data-reference="${id}"]`);
      if (!scene?.clientWidth) continue;
      const copy = [...scene.querySelectorAll('.sfl-editorial > .sfl-narrative-body')].at(-1);
      const action = scene.querySelector('.sfl-source-cta');
      if (copy && action) action.style.setProperty('--sfl-action-top', `${copy.offsetTop + copy.offsetHeight + 24}px`);
    }
    const partner = document.querySelector('.sfl-source[data-reference="partner"]');
    if (partner?.clientWidth) {
      const heading = partner.querySelector('.sfl-approach-heading');
      const copy = partner.querySelector('.sfl-approach-body');
      const action = partner.querySelector('.sfl-source-cta');
      if (heading && copy && action) {
        const gap = matchMedia('(min-width:1200px)').matches ? 16 : 10;
        const top = heading.offsetTop + heading.offsetHeight + gap;
        action.style.setProperty('--sfl-action-top', `${top}px`);
        copy.style.setProperty('--sfl-approach-body-top', `${top + action.offsetHeight + gap}px`);
      }
    }
  };
  let fitFrame;
  const scheduleFit = () => {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(fitReferenceText);
  };
  const compositions = document.querySelectorAll('.sfl-source');
  if (compositions.length) {
    const compositionObserver = new ResizeObserver(scheduleFit);
    compositions.forEach(composition => compositionObserver.observe(composition));
    document.fonts.ready.then(scheduleFit);
    window.addEventListener('resize', scheduleFit, { passive:true });
  }
  // Resolve section links after the shared header has established its height.
  const alignCurrentSection = () => {
    const id = window.location.hash.slice(1);
    const section = [...(main?.children || [])].find(item => item.id === id);
    if (section) requestAnimationFrame(() => section.scrollIntoView({ block:'start', behavior:'instant' }));
  };
  window.addEventListener('hashchange', alignCurrentSection);
  document.fonts.ready.then(alignCurrentSection);
  const sourceButtons = [...document.querySelectorAll('.sfl-source-sense')];
  const sourceStatus = document.getElementById('sfl-source-sense-status');
  const activateSource = button => {
    sourceButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    if (sourceStatus) {
      sourceStatus.querySelector('strong').textContent = button.dataset.senseName;
      sourceStatus.querySelector('span').textContent = button.dataset.sense;
    }
  };
  sourceButtons.forEach((button, index) => {
    button.addEventListener('click', () => activateSource(button));
    button.addEventListener('focus', () => activateSource(button));
    button.addEventListener('keydown', event => {
      const movement = {ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1}[event.key];
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? sourceButtons.length - 1 : movement ? (index + movement + sourceButtons.length) % sourceButtons.length : null;
      if (next === null) return;
      event.preventDefault();
      sourceButtons[next].focus();
      sourceButtons[next].click();
    });
  });
  const buttons = [...document.querySelectorAll('.sfl-sense')];
  const status = document.getElementById('sfl-sense-status');
  if (!buttons.length || !status) return;
  const activate = button => {
    buttons.forEach(item => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    status.querySelector('strong').textContent = button.querySelector('span:not(.sfl-original-icon)').textContent;
    status.querySelector('span').textContent = button.dataset.sense;
  };
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => activate(button));
    button.addEventListener('focus', () => activate(button));
    button.addEventListener('pointerenter', () => {
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) activate(button);
    });
    button.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (index + 1) % buttons.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      buttons[next].focus();
    });
  });
})();
