(() => {
  'use strict';

  const page = document.querySelector('.sy-page');
  if (!page) return;

  const captureMode = new URLSearchParams(window.location.search).has('capture');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-progress]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const navLinks = [...document.querySelectorAll('.sy-nav a[href^="#"]')];
  const sections = [...document.querySelectorAll('[data-section][id]')];
  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  const parallaxTarget = document.querySelector('[data-parallax]');
  const particleCanvas = document.querySelector('[data-ni-particles]');

  if (captureMode) page.classList.add('ni-capture');

  const updateScrollState = () => {
    const scrollTop = Math.max(0, window.scrollY || 0);
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    header?.classList.toggle('is-scrolled', scrollTop > 18);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, scrollTop / scrollRange)})`;
  };

  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrollState();
    });
  }, { passive: true });
  updateScrollState();

  const setMenuState = (open) => {
    nav?.classList.toggle('is-open', open);
    menuToggle?.setAttribute('aria-expanded', String(open));
    menuToggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    if (menuToggle) menuToggle.textContent = open ? 'CLOSE' : 'MENU';
  };

  menuToggle?.addEventListener('click', () => setMenuState(!nav?.classList.contains('is-open')));
  navLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenuState(false);
  });
  document.addEventListener('pointerdown', (event) => {
    if (!nav?.classList.contains('is-open')) return;
    if (nav.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenuState(false);
  });

  revealItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${(index % 5) * 45}ms`);
  });

  if (captureMode || reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: .06 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if ('IntersectionObserver' in window) {
    const navMap = {
      overview: 'overview',
      'sensory-streams': 'overview',
      'core-mechanisms': 'core-mechanisms',
      'downstream-outcomes': 'downstream-outcomes',
      'mechanistic-link': 'mechanistic-link',
      'functional-outcomes': 'downstream-outcomes',
      'dementia-impact': 'dementia-impact',
      'sensory-interventions': 'dementia-impact',
      'integrative-model': 'dementia-impact'
    };
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const mappedId = navMap[visible.target.id] || visible.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${mappedId}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -62% 0px', threshold: [0, .08, .2] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (parallaxTarget && !reducedMotion && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const hero = parallaxTarget.closest('.sy-hero');
    hero?.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 7;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 5;
      parallaxTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    hero?.addEventListener('pointerleave', () => {
      parallaxTarget.style.transform = 'translate3d(0,0,0)';
    });
  }

  function setupMechanismNetwork() {
    const network = document.querySelector('.sy-network');
    const svg = network?.querySelector('[data-network-connectors]');
    const center = network?.querySelector('[data-network-center]');
    const lines = [...(svg?.querySelectorAll('line[data-target]') || [])];
    if (!network || !svg || !center || !lines.length) return;

    const observed = [network, center, ...network.querySelectorAll('[data-region]')];
    let frame = 0;

    const relativeRect = (element, rootRect) => {
      const rect = element.getBoundingClientRect();
      return {
        cx: rect.left - rootRect.left + rect.width / 2,
        cy: rect.top - rootRect.top + rect.height / 2,
        rx: rect.width / 2,
        ry: rect.height / 2
      };
    };

    const ellipseEdge = (ellipse, dx, dy, side) => {
      const scale = 1 / Math.sqrt(
        (dx * dx) / Math.max(1, ellipse.rx * ellipse.rx) +
        (dy * dy) / Math.max(1, ellipse.ry * ellipse.ry)
      );
      return {
        x: ellipse.cx + dx * scale * side,
        y: ellipse.cy + dy * scale * side
      };
    };

    const draw = () => {
      frame = 0;
      const rootRect = network.getBoundingClientRect();
      if (!rootRect.width || !rootRect.height) return;
      svg.setAttribute('viewBox', `0 0 ${rootRect.width} ${rootRect.height}`);

      const centerRect = relativeRect(center, rootRect);
      lines.forEach((line) => {
        const region = network.querySelector(`[data-region="${line.dataset.target}"]`);
        if (!region) return;
        const targetRect = relativeRect(region, rootRect);
        const dx = targetRect.cx - centerRect.cx;
        const dy = targetRect.cy - centerRect.cy;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const ux = dx / distance;
        const uy = dy / distance;
        const start = ellipseEdge(centerRect, dx, dy, 1);
        const end = ellipseEdge(targetRect, dx, dy, -1);
        line.setAttribute('x1', String(start.x + ux * 4));
        line.setAttribute('y1', String(start.y + uy * 4));
        line.setAttribute('x2', String(end.x - ux * 4));
        line.setAttribute('y2', String(end.y - uy * 4));
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(draw);
    };

    const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
    observed.forEach((element) => observer?.observe(element));
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('load', schedule, { once: true });
    document.fonts?.ready.then(schedule);
    schedule();
  }

  function setupNeuroplasticityConnectors() {
    const diagram = document.querySelector('[data-neuroplasticity-diagram]');
    const svg = diagram?.querySelector('[data-neuro-connectors]');
    const layer = svg?.querySelector('[data-connector-paths]');
    const headLayer = svg?.querySelector('[data-connector-heads]');
    const defs = svg?.querySelector('defs');
    if (!diagram || !svg || !layer || !headLayer || !defs) return;

    const namespace = 'http://www.w3.org/2000/svg';
    const cache = new Map();
    const observedNodes = [...diagram.querySelectorAll('[data-node]')];
    let frame = 0;

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(draw);
    };

    const rectFor = (name, svgRect) => {
      const element = diagram.querySelector(`[data-node="${name}"]`);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - svgRect.left,
        top: rect.top - svgRect.top,
        right: rect.right - svgRect.left,
        bottom: rect.bottom - svgRect.top,
        width: rect.width,
        height: rect.height,
        cx: rect.left - svgRect.left + rect.width / 2,
        cy: rect.top - svgRect.top + rect.height / 2
      };
    };

    const point = (rect, side, ratio = .5, dx = 0, dy = 0) => {
      if (!rect) return null;
      const positions = {
        top: { x: rect.left + rect.width * ratio, y: rect.top },
        bottom: { x: rect.left + rect.width * ratio, y: rect.bottom },
        left: { x: rect.left, y: rect.top + rect.height * ratio },
        right: { x: rect.right, y: rect.top + rect.height * ratio }
      };
      const selected = positions[side];
      return { x: selected.x + dx, y: selected.y + dy };
    };

    const ellipsePoint = (rect, degrees) => {
      const radians = degrees * Math.PI / 180;
      return {
        x: rect.cx + (rect.width / 2) * Math.cos(radians),
        y: rect.cy + (rect.height / 2) * Math.sin(radians)
      };
    };

    const outsetEllipsePoint = (rect, degrees, distance = 0) => {
      const radians = degrees * Math.PI / 180;
      const edge = ellipsePoint(rect, degrees);
      return {
        x: edge.x + Math.cos(radians) * distance,
        y: edge.y + Math.sin(radians) * distance
      };
    };

    const straight = (from, to) => `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

    const feedbackPath = (source, target, label, svgRect) => {
      const tailX = source.x + 24;
      const railX = Math.min(svgRect.width * .9, Math.max(source.x + 92, label.right + 20));
      const crownY = Math.max(12, Math.min(target.y - 20, label.top - 17));
      return [
        `M ${source.x} ${source.y}`,
        `H ${tailX}`,
        `C ${railX - 18} ${source.y}, ${railX} ${source.y - 28}, ${railX} ${source.y - 66}`,
        `C ${railX} ${crownY + 18}, ${railX - 36} ${crownY}, ${railX - 82} ${crownY}`,
        `H ${target.x + 116}`,
        `C ${target.x + 98} ${crownY}, ${target.x + 84} ${target.y}, ${target.x + 76} ${target.y}`,
        `H ${target.x}`
      ].join(' ');
    };

    const updatePath = (id, className, d, svgRect) => {
      let item = cache.get(id);
      if (!item) {
        const path = document.createElementNS(namespace, 'path');
        const headPath = document.createElementNS(namespace, 'path');
        const mask = document.createElementNS(namespace, 'mask');
        const maskPath = document.createElementNS(namespace, 'path');
        const maskId = `sy-connector-mask-${id}`;
        path.dataset.connector = id;
        path.setAttribute('mask', `url(#${maskId})`);
        mask.setAttribute('id', maskId);
        mask.setAttribute('maskUnits', 'userSpaceOnUse');
        maskPath.setAttribute('class', 'sy-connector-mask');
        maskPath.setAttribute('pathLength', '1');
        mask.append(maskPath);
        defs.append(mask);
        layer.append(path);
        headPath.dataset.connectorHead = id;
        headLayer.append(headPath);
        item = { path, headPath, mask, maskPath };
        cache.set(id, item);
      }
      item.path.setAttribute('class', className);
      item.path.setAttribute('d', d);
      item.path.removeAttribute('marker-start');
      item.path.removeAttribute('marker-end');
      item.headPath.setAttribute('class', `sy-connector-head-source ${className}`);
      item.headPath.setAttribute('d', d);
      item.headPath.removeAttribute('marker-start');
      item.headPath.removeAttribute('marker-end');
      if (className === 'is-reciprocal') {
        item.headPath.setAttribute('marker-start', 'url(#sy-arrow-neutral)');
        item.headPath.setAttribute('marker-end', 'url(#sy-arrow-neutral)');
      } else if (className === 'is-purple' || className === 'is-feedback') {
        item.headPath.setAttribute('marker-end', 'url(#sy-arrow-purple)');
      } else if (className === 'is-neutral') {
        item.headPath.setAttribute('marker-end', 'url(#sy-arrow-neutral)');
      }
      item.maskPath.setAttribute('d', d);
      item.mask.setAttribute('x', '0');
      item.mask.setAttribute('y', '0');
      item.mask.setAttribute('width', String(svgRect.width));
      item.mask.setAttribute('height', String(svgRect.height));
    };

    function draw() {
      frame = 0;
      const mode = getComputedStyle(diagram).getPropertyValue('--connector-mode').trim();
      if (mode === 'mobile') {
        cache.forEach((item) => {
          item.path.remove();
          item.headPath.remove();
          item.mask.remove();
        });
        cache.clear();
        return;
      }

      const svgRect = svg.getBoundingClientRect();
      if (!svgRect.width || !svgRect.height) return;
      svg.setAttribute('viewBox', `0 0 ${svgRect.width} ${svgRect.height}`);

      const rects = Object.fromEntries([
        'reg-genetic', 'reg-sensory', 'reg-adult',
        'core-anchor-left', 'core-anchor-center', 'core-anchor-right',
        'core-left', 'core-right', 'perception', 'feedback-label',
        'hebbian', 'adaptive', 'regions'
      ].map((name) => [name, rectFor(name, svgRect)]));

      if (Object.values(rects).some((rect) => !rect)) return;
      const spineX = rects.perception.cx;
      const active = new Set();
      const add = (id, className, d) => {
        active.add(id);
        updatePath(id, className, d, svgRect);
      };

      add('reg-left', 'is-purple', straight(
        point(rects['reg-genetic'], 'bottom', .61, 0, 4),
        point(rects['core-anchor-left'], 'top')
      ));
      add('reg-middle', 'is-purple', straight(
        point(rects['reg-sensory'], 'bottom', .5, 0, 4),
        point(rects['core-anchor-center'], 'top')
      ));
      add('reg-right', 'is-purple', straight(
        point(rects['reg-adult'], 'bottom', .33, 0, 4),
        point(rects['core-anchor-right'], 'top')
      ));

      add('core-reciprocal', 'is-reciprocal', straight(
        point(rects['core-left'], 'right', .48, 12),
        point(rects['core-right'], 'left', .48, -12)
      ));

      add('core-left-perception', 'is-neutral', straight(
        point(rects['core-left'], 'bottom', .55),
        outsetEllipsePoint(rects.perception, -145, 10)
      ));
      add('core-right-perception', 'is-neutral', straight(
        point(rects['core-right'], 'bottom', .4),
        outsetEllipsePoint(rects.perception, -35, 10)
      ));
      add('perception-hebbian', 'is-neutral', straight(
        { x: spineX, y: rects.perception.bottom },
        { x: spineX, y: rects.hebbian.top - 2 }
      ));
      add('hebbian-adaptive', 'is-neutral', straight(
        { x: spineX, y: rects.hebbian.bottom },
        { x: spineX, y: rects.adaptive.top - 2 }
      ));
      add('adaptive-regions', 'is-neutral', straight(
        { x: spineX, y: rects.adaptive.bottom },
        { x: spineX, y: rects.regions.top - 2 }
      ));
      add('feedback', 'is-feedback', feedbackPath(
        point(rects.hebbian, 'right', .14),
        ellipsePoint(rects.perception, -7),
        rects['feedback-label'],
        svgRect
      ));

      cache.forEach((item, id) => {
        if (!active.has(id)) {
          item.path.remove();
          item.headPath.remove();
          item.mask.remove();
          cache.delete(id);
        }
      });
    }

    const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
    resizeObserver?.observe(diagram);
    observedNodes.forEach((node) => resizeObserver?.observe(node));
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('load', schedule, { once: true });
    document.fonts?.ready.then(schedule);
    diagram.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', schedule, { once: true });
    });
    diagram.addEventListener('transitionend', schedule);

    if (reducedMotion || captureMode || !('IntersectionObserver' in window)) {
      svg.classList.add('is-drawn');
    } else {
      const drawObserver = new IntersectionObserver((entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        svg.classList.add('is-drawn');
        observer.disconnect();
      }, { rootMargin: '0px 0px -10% 0px', threshold: .08 });
      drawObserver.observe(diagram);
    }
    schedule();
  }

  function setupParticles() {
    if (!particleCanvas) return;
    const context = particleCanvas.getContext('2d', { alpha: true });
    if (!context) return;

    let particles = [];
    let animationFrame = 0;
    let width = 1;
    let height = 1;

    const seed = () => {
      const count = reducedMotion || captureMode
        ? 24
        : Math.min(62, Math.max(30, Math.round((width * height) / 32000)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: index % 10 === 0 ? 1.6 : .55 + Math.random(),
        vx: (Math.random() - .5) * .032,
        vy: (Math.random() - .5) * .022,
        alpha: .12 + Math.random() * .42,
        phase: Math.random() * Math.PI * 2
      }));
    };

    const draw = (time, staticFrame = false) => {
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        if (!staticFrame && !reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -8) particle.x = width + 8;
          if (particle.x > width + 8) particle.x = -8;
          if (particle.y < -8) particle.y = height + 8;
          if (particle.y > height + 8) particle.y = -8;
        }
        const shimmer = reducedMotion ? 1 : .72 + Math.sin(time * .00035 + particle.phase) * .28;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(53, 174, 255, ${particle.alpha * shimmer})`;
        context.shadowBlur = particle.radius > 1.4 ? 8 : 3;
        context.shadowColor = 'rgba(0, 217, 255, .65)';
        context.fill();

        if (index % 8 === 0) {
          const next = particles[(index + 3) % particles.length];
          const distance = Math.hypot(next.x - particle.x, next.y - particle.y);
          if (distance < 140) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = `rgba(42, 142, 223, ${(1 - distance / 140) * .1})`;
            context.lineWidth = .6;
            context.shadowBlur = 0;
            context.stroke();
          }
        }
      });
      if (!staticFrame && !reducedMotion && !captureMode) animationFrame = requestAnimationFrame(draw);
    };

    const resize = () => {
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      particleCanvas.width = Math.round(width * dpr);
      particleCanvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      cancelAnimationFrame(animationFrame);
      if (reducedMotion || captureMode) draw(performance.now(), true);
      else animationFrame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
  }

  setupMechanismNetwork();
  setupNeuroplasticityConnectors();
  setupParticles();

  window.addEventListener('resize', () => {
    if (window.innerWidth > 767) setMenuState(false);
  }, { passive: true });
})();
