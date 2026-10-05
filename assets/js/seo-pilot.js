/* Additive static-pilot interactions. Rendered localized content and URL locale
   stay authoritative; this script never rebuilds the shell or sends form data. */
(() => {
  'use strict';
  if (window.ArotecSeoPilot) return;
  const body = document.body;
  if (!body) return;
  const language = document.documentElement.lang;
  const locale = /^zh-(?:Hans|CN)$/i.test(language) ? 'zh-Hans' :
    /^zh(?:-Hant)?$/i.test(language) ? 'zh-Hant' : /^(?:th|ja)$/.test(language) ? language : 'en';
  const defaults = {
    en: { pause: 'Pause slideshow', resume: 'Resume slideshow', pauseEffects: 'Pause effects', resumeEffects: 'Resume effects', empty: 'No matching pages. Try another search.', unavailable: 'Online submissions are unavailable on this static preview. Please use the email links on the contact page.', newsletterUnavailable: 'Newsletter signup is unavailable on this static preview. Please contact our team by email.' },
    th: { pause: 'หยุดสไลด์ชั่วคราว', resume: 'เล่นสไลด์ต่อ', pauseEffects: 'หยุดเอฟเฟกต์ชั่วคราว', resumeEffects: 'เล่นเอฟเฟกต์ต่อ', empty: 'ไม่พบหน้าที่ตรงกับคำค้น ลองใช้คำค้นอื่น', unavailable: 'ตัวอย่างเว็บไซต์แบบสแตติกนี้ยังส่งแบบฟอร์มออนไลน์ไม่ได้ กรุณาใช้อีเมลในหน้าติดต่อเรา', newsletterUnavailable: 'ตัวอย่างเว็บไซต์แบบสแตติกนี้ยังสมัครรับข่าวสารไม่ได้ กรุณาติดต่อทีมงานทางอีเมล' },
    ja: { pause: 'スライドショーを一時停止', resume: 'スライドショーを再開', pauseEffects: 'エフェクトを一時停止', resumeEffects: 'エフェクトを再開', empty: '一致するページがありません。別の語句で検索してください。', unavailable: 'この静的サイトのプレビューではオンライン送信を利用できません。お問い合わせページのメールリンクをご利用ください。', newsletterUnavailable: 'この静的サイトのプレビューではニュースレター登録を利用できません。メールでお問い合わせください。' },
    'zh-Hans': { pause: '暂停幻灯片', resume: '继续播放幻灯片', pauseEffects: '暂停动态效果', resumeEffects: '继续动态效果', empty: '未找到匹配的页面，请尝试其他关键词。', unavailable: '此静态网站预览暂不支持在线提交，请使用联系页面上的电子邮件链接。', newsletterUnavailable: '此静态网站预览暂不支持订阅新闻，请通过电子邮件联系我们。' },
    'zh-Hant': { pause: '暫停投影片', resume: '繼續播放投影片', pauseEffects: '暫停動態效果', resumeEffects: '繼續動態效果', empty: '找不到符合的頁面，請嘗試其他關鍵字。', unavailable: '此靜態網站預覽暫不支援線上提交，請使用聯絡頁面上的電子郵件連結。', newsletterUnavailable: '此靜態網站預覽暫不支援訂閱新聞，請透過電子郵件聯絡我們。' }
  };
  let config = {};
  try { config = JSON.parse(document.getElementById('seo-pilot-config')?.textContent || '{}'); } catch (_) {}
  const strings = { ...defaults[locale], ...(config.strings || {}) };
  const cleanups = [];
  const listen = (target, event, handler, options) => {
    if (!target) return;
    target.addEventListener(event, handler, options);
    cleanups.push(() => target.removeEventListener(event, handler, options));
  };
  const focus = target => target?.focus({ preventScroll: true });
  const focusable = container => Array.from(container?.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])') || [])
    .filter(node => !node.closest('[inert]') && node.getClientRects().length && getComputedStyle(node).visibility !== 'hidden');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function wireResponsiveHeader() {
    // Mirror the source site-navigation.css breakpoints. A frozen shell has no
    // native renderer to refresh it, so enforce the same compact navigation on
    // resize without shrinking labels or concealing document overflow.
    const shell = document.getElementById('site-shell');
    const header = shell?.querySelector('.site-header');
    if (!header) return;
    const desktop = header.querySelector('.desktop-nav');
    const utility = header.querySelector('.header-utility');
    const inner = header.querySelector('.header-inner');
    const toggle = document.getElementById('menuToggle');
    const original = new Map();
    const set = (node, property, value) => {
      if (!node) return;
      let properties = original.get(node);
      if (!properties) { properties = new Map(); original.set(node, properties); }
      if (!properties.has(property)) properties.set(property, [node.style.getPropertyValue(property), node.style.getPropertyPriority(property)]);
      node.style.setProperty(property, value, 'important');
    };
    const restore = () => original.forEach((properties, node) => properties.forEach(([value, priority], property) => value ? node.style.setProperty(property, value, priority) : node.style.removeProperty(property)));
    const update = () => {
      restore();
      if (innerWidth > 1060) return;
      set(desktop, 'display', 'none'); set(utility, 'display', 'none'); set(toggle, 'display', 'inline-grid');
      // These are the original narrow header frames, not a fit-to-content width.
      if (innerWidth <= 420) { set(inner, 'width', 'calc(100% - 20px)'); set(inner, 'gap', '8px'); }
      else if (innerWidth <= 760) set(inner, 'width', 'min(calc(100% - 28px), var(--arotec-nav-container))');
      else if (body.dataset.page === 'home') set(inner, 'width', 'min(1180px, calc(100vw - 48px))');
    };
    listen(window, 'resize', update, { passive: true });
    cleanups.push(restore); update();
  }

  function wireSourceMobileHeading() {
    // Preserve the published 60%-of-desktop rule from mobile-main-headings.css
    // for this authored display heading; do not calculate a new font fit.
    const heading = document.querySelector('body[data-main-heading-page="pages--neuro-skin-science"] #neurocosmetics-title');
    if (!heading) return;
    const properties = {
      '--main-heading-desktop-size': '70.68px',
      '--main-heading-mobile-size': 'calc(var(--main-heading-desktop-size) * 0.6)',
      'font-size': 'var(--main-heading-mobile-size)',
      'line-height': 'calc(70.68px * 0.6)',
      'letter-spacing': 'calc(-2.736px * 0.6)',
      'white-space': 'normal',
      'overflow-wrap': 'anywhere',
      'max-width': '100%'
    };
    const original = Object.keys(properties).map(name => [name, heading.style.getPropertyValue(name), heading.style.getPropertyPriority(name)]);
    const restore = () => original.forEach(([name, value, priority]) => value ? heading.style.setProperty(name, value, priority) : heading.style.removeProperty(name));
    const media = matchMedia('(max-width: 767px)');
    const update = () => { restore(); if (media.matches) Object.entries(properties).forEach(([name, value]) => heading.style.setProperty(name, value, 'important')); };
    listen(media, 'change', update);
    listen(window, 'resize', update, { passive: true });
    cleanups.push(restore); update();
  }

  function wireNavigation() {
    const toggle = document.getElementById('menuToggle');
    const close = document.getElementById('menuClose');
    const panel = document.getElementById('mobilePanel');
    const modal = document.getElementById('searchModal');
    const searchButton = document.getElementById('searchButton');
    const input = document.getElementById('searchInput');
    let menuRestore, searchRestore;
    const closeMenu = (restore = false) => {
      const wasOpen = body.classList.contains('menu-open');
      body.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
      panel?.setAttribute('aria-hidden', 'true');
      panel?.setAttribute('inert', '');
      if (restore && wasOpen) focus(menuRestore || toggle);
    };
    const closeSearch = (restore = false) => {
      const wasOpen = body.classList.contains('search-open');
      body.classList.remove('search-open');
      modal?.setAttribute('aria-hidden', 'true');
      modal?.setAttribute('inert', '');
      searchButton?.setAttribute('aria-expanded', 'false');
      if (restore && wasOpen) focus(searchRestore || searchButton);
    };
    const openMenu = () => {
      if (!panel) return;
      closeSearch(false);
      menuRestore = document.activeElement;
      body.classList.add('menu-open');
      toggle?.setAttribute('aria-expanded', 'true');
      panel.setAttribute('aria-hidden', 'false');
      panel.removeAttribute('inert');
      requestAnimationFrame(() => focus(close || focusable(panel)[0]));
    };
    const items = searchItems();
    const renderSearch = () => {
      const results = document.getElementById('searchResults');
      if (!results) return;
      const query = (input?.value || '').trim().toLocaleLowerCase(locale);
      const matches = items.filter(item => !query || `${item.title} ${item.description}`.toLocaleLowerCase(locale).includes(query));
      const nodes = matches.map(item => {
        const link = document.createElement('a');
        link.className = 'search-result';
        link.href = item.href;
        const title = document.createElement('strong'); title.textContent = item.title;
        const description = document.createElement('span'); description.textContent = item.description;
        link.append(title, description);
        return link;
      });
      if (!nodes.length) { const message = document.createElement('p'); message.textContent = strings.empty; nodes.push(message); }
      results.replaceChildren(...nodes);
    };
    const openSearch = () => {
      if (!modal) return;
      closeMenu(false);
      searchRestore = document.activeElement;
      renderSearch();
      body.classList.add('search-open');
      modal.setAttribute('aria-hidden', 'false');
      modal.removeAttribute('inert');
      searchButton?.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => focus(input || focusable(modal)[0]));
    };
    closeMenu(); closeSearch();
    listen(toggle, 'click', () => body.classList.contains('menu-open') ? closeMenu(true) : openMenu());
    listen(close, 'click', () => closeMenu(true));
    listen(document.getElementById('mobileScrim'), 'click', () => closeMenu(true));
    panel?.querySelectorAll('a[href]').forEach(link => listen(link, 'click', () => closeMenu(false)));
    listen(searchButton, 'click', openSearch);
    listen(document.getElementById('searchClose'), 'click', () => closeSearch(true));
    listen(input, 'input', renderSearch);
    listen(modal, 'click', event => { if (event.target === modal) closeSearch(true); });
    listen(document, 'keydown', event => {
      if (event.key === 'Escape') { closeMenu(true); closeSearch(true); }
      const activePanel = body.classList.contains('search-open') ? modal : body.classList.contains('menu-open') ? panel : null;
      if (event.key !== 'Tab' || !activePanel) return;
      const nodes = focusable(activePanel);
      if (!nodes.length) { event.preventDefault(); return; }
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && (document.activeElement === first || !activePanel.contains(document.activeElement))) { event.preventDefault(); focus(last); }
      else if (!event.shiftKey && (document.activeElement === last || !activePanel.contains(document.activeElement))) { event.preventDefault(); focus(first); }
    });
    // Button-only dropdown triggers have no destination; anchors keep normal
    // navigation and desktop CSS hover/focus-within behavior unchanged.
    document.querySelectorAll('button.nav-dropdown-trigger').forEach(button => {
      listen(button, 'click', () => {
        button.setAttribute('aria-expanded', String(button.getAttribute('aria-expanded') !== 'true'));
      });
    });
  }

  function searchItems() {
    const seen = new Set();
    const candidates = Array.isArray(config.search) ? config.search :
      Array.from(document.querySelectorAll('.site-header a[href], .mobile-nav a[href]')).map(link => ({ href: link.getAttribute('href'), title: link.textContent.replace(/\s+/g, ' ').trim(), description: '' }));
    return candidates.filter(item => item && typeof item.href === 'string' && typeof item.title === 'string').filter(item => {
      let url; try { url = new URL(item.href, location.href); } catch (_) { return false; }
      const key = url.href;
      if (!/^https?:$/.test(url.protocol) || url.origin !== location.origin || !item.title.trim() || seen.has(key)) return false;
      seen.add(key); return true;
    }).map(item => ({ title: item.title, description: typeof item.description === 'string' ? item.description : '', href: item.href }));
  }

  function wireHero() {
    const hero = document.querySelector('[data-hero-scene]');
    if (!hero) return;
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const copies = Array.from(hero.querySelectorAll('[data-hero-copy]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const pause = hero.querySelector('[data-hero-pause]');
    if (slides.length <= 1) return;
    let current = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
    let timer = 0, paused = false, pageActive = true;
    let hovered = Boolean(matchMedia('(hover: hover)').matches && hero.matches(':hover'));
    let focused = hero.contains(document.activeElement);
    const bounds = hero.getBoundingClientRect();
    let onScreen = bounds.bottom > 0 && bounds.top < innerHeight;
    const show = next => {
      current = (next % slides.length + slides.length) % slides.length;
      hero.dataset.activeSlide = String(current);
      slides.forEach((slide, index) => slide.classList.toggle('is-active', index === current));
      copies.forEach((copy, index) => { const active = index === current; copy.classList.toggle('is-active', active); copy.setAttribute('aria-hidden', String(!active)); copy.inert = !active; });
      dots.forEach((dot, index) => { dot.classList.toggle('is-active', index === current); if (index === current) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current'); });
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    const canRotate = () => !paused && !hovered && !focused && onScreen && pageActive && !document.hidden && !reducedMotion.matches && hero.isConnected;
    const sync = () => {
      stop();
      if (pause) {
        const label = paused ? strings.resume : strings.pause;
        pause.setAttribute('aria-label', label); pause.setAttribute('title', label); pause.setAttribute('aria-pressed', String(paused));
        const caption = pause.querySelector('.sr-only'); if (caption) caption.textContent = label;
        const icon = pause.querySelector('i.ph'); icon?.classList.toggle('ph-play', paused); icon?.classList.toggle('ph-pause', !paused);
      }
      if (canRotate()) timer = setInterval(() => { if (canRotate()) show(current + 1); else stop(); }, 10000);
    };
    listen(hero, 'click', event => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('[data-hero-pause]')) { event.preventDefault(); paused = !paused; sync(); return; }
      const control = target?.closest('[data-hero-control]');
      if (control) { event.preventDefault(); show(current + (control.dataset.heroControl === 'prev' ? -1 : 1)); sync(); return; }
      const dot = target?.closest('[data-hero-dot]');
      if (dot) { const index = Number(dot.dataset.heroDot); if (Number.isInteger(index)) { event.preventDefault(); show(index); sync(); } }
    });
    listen(hero, 'pointerenter', event => { if (event.pointerType !== 'touch') { hovered = true; sync(); } });
    listen(hero, 'pointerleave', event => { if (event.pointerType !== 'touch') { hovered = false; sync(); } });
    listen(hero, 'focusin', () => { focused = true; sync(); });
    listen(hero, 'focusout', event => { focused = event.relatedTarget instanceof Node && hero.contains(event.relatedTarget); sync(); });
    listen(document, 'visibilitychange', sync);
    listen(reducedMotion, 'change', sync);
    listen(window, 'pagehide', () => { pageActive = false; stop(); });
    listen(window, 'pageshow', () => { pageActive = true; const rect = hero.getBoundingClientRect(); onScreen = rect.bottom > 0 && rect.top < innerHeight; sync(); });
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }, { threshold: 0 });
      observer.observe(hero); cleanups.push(() => observer.disconnect());
    }
    cleanups.push(stop); show(current); sync();
  }

  function wirePlatformSliders() {
    document.querySelectorAll('[data-platform-slider]').forEach(slider => {
      const track = slider.querySelector('[data-platform-track]');
      const cards = Array.from(slider.querySelectorAll('[data-platform-card]'));
      if (!track || !cards.length) return;
      const center = (card, behavior = reducedMotion.matches ? 'auto' : 'smooth') => track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.clientWidth) / 2, behavior });
      const update = () => {
        const rect = track.getBoundingClientRect(), centerX = rect.left + rect.width / 2;
        let closest = cards[0], distance = Infinity;
        cards.forEach(card => { const box = card.getBoundingClientRect(), next = Math.abs(box.left + box.width / 2 - centerX); if (next < distance) { closest = card; distance = next; } });
        cards.forEach(card => card.classList.toggle('is-active', card === closest));
      };
      slider.querySelectorAll('[data-platform-control]').forEach(button => listen(button, 'click', () => {
        const index = Math.max(0, cards.findIndex(card => card.classList.contains('is-active')));
        const next = Math.min(cards.length - 1, Math.max(0, index + (button.dataset.platformControl === 'prev' ? -1 : 1)));
        center(cards[next]);
      }));
      cards.forEach(card => listen(card, 'click', () => center(card)));
      let frame = 0;
      const queue = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; update(); }); };
      listen(track, 'scroll', queue, { passive: true }); listen(window, 'resize', queue, { passive: true });
      cleanups.push(() => cancelAnimationFrame(frame));
      requestAnimationFrame(() => { center(cards.find(card => card.classList.contains('is-active')) || cards[0], 'auto'); update(); });
    });
  }

  function wireFramework() {
    const section = document.getElementById('research-solutions');
    const canvas = section?.querySelector('.fw-tree-canvas');
    const toggle = section?.querySelector('.fw-motion-toggle');
    if (!section || !canvas) return;
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    let paused = false, inView = !('IntersectionObserver' in window), pointerFrame = 0;
    let pointerX = 0, pointerY = 0;
    const clearPointer = () => { cancelAnimationFrame(pointerFrame); pointerFrame = 0; section.classList.remove('fw-pointer-active'); };
    const sync = () => {
      const running = inView && !document.hidden && !reducedMotion.matches && !paused;
      section.classList.toggle('fw-motion-running', running);
      section.classList.toggle('fw-motion-paused', paused);
      if (toggle) {
        const label = paused ? strings.resumeEffects : strings.pauseEffects;
        toggle.setAttribute('aria-pressed', String(paused)); toggle.setAttribute('aria-label', label);
        const caption = toggle.querySelector('.fw-motion-label'); if (caption) caption.textContent = label;
      }
      if (!running || !finePointer.matches) clearPointer();
    };
    if (toggle) { section.classList.add('fw-motion-ready'); listen(toggle, 'click', () => { paused = !paused; sync(); }); }
    listen(canvas, 'pointermove', event => {
      if (!finePointer.matches || !section.classList.contains('fw-motion-running')) return;
      const rect = canvas.getBoundingClientRect(); pointerX = event.clientX - rect.left; pointerY = event.clientY - rect.top;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(() => { pointerFrame = 0; canvas.style.setProperty('--fw-pointer-x', pointerX + 'px'); canvas.style.setProperty('--fw-pointer-y', pointerY + 'px'); section.classList.add('fw-pointer-active'); });
    }, { passive: true });
    listen(canvas, 'pointerleave', clearPointer); listen(document, 'visibilitychange', sync); listen(reducedMotion, 'change', sync); listen(finePointer, 'change', sync);
    if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: 0 }); observer.observe(section); cleanups.push(() => observer.disconnect()); }
    cleanups.push(clearPointer);
    const clearHighlight = () => section.querySelectorAll('.research-connector-path.is-highlighted').forEach(path => path.classList.remove('is-highlighted'));
    section.querySelectorAll('.research-topic').forEach(topic => {
      const highlight = () => { clearHighlight(); section.querySelectorAll('[data-line-key]').forEach(path => { if (path.dataset.lineKey === `topic-${topic.dataset.topic}` || path.dataset.lineKey === topic.dataset.targetCard) path.classList.add('is-highlighted'); }); };
      listen(topic, 'mouseenter', highlight); listen(topic, 'mouseleave', clearHighlight); listen(topic, 'focus', highlight); listen(topic, 'blur', clearHighlight);
    });
    sync();
  }

  function secureStaticForms() {
    document.querySelectorAll('#ci-form,#newsletterForm,#contactForm').forEach(form => {
      listen(form, 'submit', event => event.preventDefault());
      form.querySelectorAll('button[type="submit"],input[type="submit"]').forEach(button => { button.disabled = true; button.setAttribute('title', form.id === 'newsletterForm' ? strings.newsletterUnavailable : strings.unavailable); });
      if (form.id === 'newsletterForm' && !document.getElementById('seo-newsletter-notice')) {
        const notice = document.createElement('p'); notice.id = 'seo-newsletter-notice'; notice.className = 'seo-pilot-form-notice'; notice.textContent = strings.newsletterUnavailable;
        form.insertAdjacentElement('afterend', notice); form.setAttribute('aria-describedby', notice.id);
      }
    });
  }

  const main = document.getElementById('main');
  if (main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
  document.querySelectorAll('a.skip-link[href="#main"]').forEach(link => listen(link, 'click', () => requestAnimationFrame(() => focus(main))));
  wireResponsiveHeader(); wireSourceMobileHeading(); wireNavigation(); wireHero(); wirePlatformSliders(); wireFramework(); secureStaticForms();
  window.ArotecSeoPilot = Object.freeze({ locale, dispose() { cleanups.splice(0).forEach(cleanup => cleanup()); } });
})();
