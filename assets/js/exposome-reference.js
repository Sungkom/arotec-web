(() => {
  'use strict';
  const disclosures = new Map(Array.from(document.querySelectorAll('details.exo-accordion[id]'), element => [element.id, {
    element,
    toggle: element.querySelector('summary'),
    explore: document.querySelector(`[data-explore="${element.id}"]`)
  }]));
  function openDisclosure(id, updateHash = true) {
    const disclosure = disclosures.get(id);
    if (!disclosure?.toggle) return;
    const { element, toggle, explore } = disclosure;
    element.open = true;
    explore?.setAttribute('aria-expanded', 'true');
    if (updateHash) history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
    toggle.focus({ preventScroll: true });
    requestAnimationFrame(() => element.scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start'
    }));
  }
  disclosures.forEach(({ element, explore }, id) => element.addEventListener('toggle', () => {
    explore?.setAttribute('aria-expanded', String(element.open));
    if (!element.open && location.hash === `#${id}`) history.replaceState(null, '', `${location.pathname}${location.search}`);
  }));
  document.querySelectorAll('[data-explore]').forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.explore;
    if (disclosures.has(id)) openDisclosure(id);
  }));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (disclosures.has(id)) openDisclosure(id, false);
  });
  if (disclosures.has(location.hash.slice(1))) openDisclosure(location.hash.slice(1), false);

  window.addEventListener('load', async () => {
    await document.fonts?.ready;
    const target = location.hash.slice(1);
    // Re-align deep links after images and fonts have settled above the disclosure.
    if (target === 'ebii' || disclosures.has(target)) document.getElementById(target)?.scrollIntoView({ behavior: 'instant', block: 'start' });
  }, { once: true });
})();

/* Reference diagrams: draw only in the measured gaps, without moving content. */
(() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const health = document.querySelector('.exo-personal-health');
  const ebii = document.querySelector('.exo-ebii-framework');
  const levels = document.querySelector('.exo-impact-level-grid');
  if (!health && !ebii && !levels) return;
  const layers = new Map();
  let queued = false;
  const number = value => Math.round(value * 1000) / 1000;
  const set = (element, name, value) => {
    value = String(value);
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  };
  const box = (element, origin) => {
    const r = element.getBoundingClientRect();
    return { x: r.left - origin.left, y: r.top - origin.top, width: r.width, height: r.height,
      right: r.right - origin.left, bottom: r.bottom - origin.top,
      cx: r.left - origin.left + r.width / 2, cy: r.top - origin.top + r.height / 2 };
  };
  function photoBox(element, origin) {
    const image = element.querySelector('.exo-ebii-factor-body > img'), r = box(image, origin);
    const style = getComputedStyle(image);
    if (style.objectFit !== 'contain' || !image.naturalWidth || !image.naturalHeight) return r;
    // Measure the visible photograph, excluding object-fit's empty side bands.
    const scale = Math.min(r.width / image.naturalWidth, r.height / image.naturalHeight);
    const width = image.naturalWidth * scale, height = image.naturalHeight * scale;
    const position = style.objectPosition.split(/\s+/);
    const fraction = value => /%$/.test(value) ? parseFloat(value) / 100 : .5;
    const x = r.x + (r.width - width) * fraction(position[0]);
    const y = r.y + (r.height - height) * fraction(position[1]);
    return { x, y, width, height, right: x + width, bottom: y + height, cx: x + width / 2, cy: y + height / 2 };
  }
  function layer(parent, name) {
    let svg = layers.get(name);
    if (!svg) {
      svg = document.createElementNS(NS, 'svg');
      svg.classList.add('exo-reference-connectors', name);
      set(svg, 'aria-hidden', 'true'); set(svg, 'focusable', 'false');
      parent.append(svg); layers.set(name, svg);
    }
    const rect = parent.getBoundingClientRect();
    set(svg, 'viewBox', `0 0 ${number(rect.width)} ${number(rect.height)}`);
    set(svg, 'width', number(rect.width)); set(svg, 'height', number(rect.height));
    return svg;
  }
  function path(svg, id, d, metadata) {
    let p = svg.querySelector(`[data-exo-connector="${id}"]`);
    if (!p) {
      p = document.createElementNS(NS, 'path');
      set(p, 'data-exo-connector', id);
      set(p, 'vector-effect', 'non-scaling-stroke');
      svg.append(p);
    }
    set(p, 'd', d);
    if (metadata) set(p, 'data-exo-geometry', JSON.stringify(metadata));
    return p;
  }
  function trim(svg, ids) {
    for (const p of svg.querySelectorAll('[data-exo-connector]')) {
      if (!ids.includes(p.getAttribute('data-exo-connector'))) p.remove();
    }
  }
  function arrow(svg, id, cx, cy, ux, uy, length, metadata) {
    const half = length / 2, head = Math.min(7, length * .45), spread = Math.min(6, length * .4);
    const start = [cx - ux * half, cy - uy * half];
    const tip = [cx + ux * half, cy + uy * half];
    const a = [tip[0] - ux * head - uy * spread, tip[1] - uy * head + ux * spread];
    const b = [tip[0] - ux * head + uy * spread, tip[1] - uy * head - ux * spread];
    const point = p => p.map(number).join(' ');
    path(svg, id, `M${point(start)}L${point(tip)}M${point(a)}L${point(tip)}L${point(b)}`,
      { cx: number(cx), cy: number(cy), ux: number(ux), uy: number(uy), length: number(length), ...metadata });
  }
  function sequence(parent, itemSelector, name) {
    if (!parent?.getClientRects().length) return;
    const origin = parent.getBoundingClientRect();
    if (!origin.width || !origin.height) return;
    const items = [...parent.querySelectorAll(itemSelector)];
    const svg = layer(parent, name), ids = [];
    for (let i = 0; i < items.length - 1; i++) {
      const a = box(items[i].querySelector('img'), origin), b = box(items[i + 1].querySelector('img'), origin);
      const stacked = b.y >= a.bottom - 1;
      const ca = box(items[i], origin), cb = box(items[i + 1], origin);
      const gap = stacked ? cb.y - ca.bottom : b.x - a.right;
      if (gap < 12) continue;
      const cx = stacked ? (a.cx + b.cx) / 2 : (a.right + b.x) / 2;
      const cy = stacked ? (ca.bottom + cb.y) / 2 : (a.cy + b.cy) / 2;
      const id = `step-${i}`; ids.push(id);
      arrow(svg, id, cx, cy, stacked ? 0 : 1, stacked ? 1 : 0, Math.min(32, gap - 12),
        { gap: number(gap), mode: stacked ? 'stacked-card-gap' : 'image-gap' });
    }
    trim(svg, ids); parent.classList.add('exo-measured-arrows');
  }
  function feedback() {
    if (!health?.getClientRects().length) return;
    const origin = health.getBoundingClientRect();
    if (!origin.width || !origin.height) return;
    const items = [...health.querySelectorAll('.exo-health-step')];
    const note = health.querySelector('.exo-personal-feedback'), sequence = health.querySelector('.exo-health-sequence');
    if (items.length !== 4 || !note || !sequence) return;
    const a = box(items[0], origin), b = box(items[3], origin), n = box(note, origin), s = box(sequence, origin);
    const svg = layer(health, 'exo-health-feedback-arrows');
    const stacked = b.y > a.bottom;
    const ids = ['return', 'return-head', 'return-chevron-0', 'return-chevron-1', 'return-chevron-2'];
    let d, endX, endY;
    if (stacked) {
      const left = -10, bottom = b.bottom + 16, top = a.bottom + 22;
      endX = a.x + 12; endY = a.bottom + 6;
      d = `M${number(b.right - 16)} ${number(b.bottom + 5)}V${number(bottom - 6)}Q${number(b.right - 16)} ${number(bottom)} ${number(b.right - 22)} ${number(bottom)}H${left + 6}Q${left} ${number(bottom)} ${left} ${number(bottom - 6)}V${number(top + 6)}Q${left} ${number(top)} ${left + 6} ${number(top)}H${number(endX - 4)}Q${number(endX)} ${number(top)} ${number(endX)} ${number(top - 4)}V${number(endY)}`;
      for (let i = 0; i < 3; i++) {
        const y = top + (bottom - top) * (i + 1) / 4;
        path(svg, `return-chevron-${i}`, `M${left - 5} ${number(y + 5)}L${left} ${number(y)}L${left + 5} ${number(y + 5)}M${left - 5} ${number(y + 12)}L${left} ${number(y + 7)}L${left + 5} ${number(y + 12)}`);
      }
    } else {
      const left = Math.min(a.cx, n.x - 10), right = Math.max(b.cx, n.right + 10);
      const top = n.y - 13, bottom = (n.bottom + s.y) / 2, radius = Math.min(12, (bottom - top) / 3);
      endX = a.cx; endY = a.bottom + 6;
      d = `M${number(b.cx)} ${number(b.bottom + 5)}V${number(top)}H${number(right)}V${number(bottom - radius)}Q${number(right)} ${number(bottom)} ${number(right - radius)} ${number(bottom)}H${number(left + radius)}Q${number(left)} ${number(bottom)} ${number(left)} ${number(bottom - radius)}V${number(top)}H${number(endX)}V${number(endY)}`;
      for (let i = 0; i < 3; i++) {
        const x = left + (right - left) * (i + 1) / 4;
        path(svg, `return-chevron-${i}`, `M${number(x + 5)} ${number(bottom - 5)}L${number(x)} ${number(bottom)}L${number(x + 5)} ${number(bottom + 5)}M${number(x + 12)} ${number(bottom - 5)}L${number(x + 7)} ${number(bottom)}L${number(x + 12)} ${number(bottom + 5)}`);
      }
    }
    path(svg, 'return', d, { mode: stacked ? 'stacked-return' : 'horizontal-return', direction: 'outcomes-to-exposome' });
    path(svg, 'return-head', `M${number(endX - 6)} ${number(endY + 8)}L${number(endX)} ${number(endY)}L${number(endX + 6)} ${number(endY + 8)}`);
    trim(svg, ids);
  }
  function convergence() {
    if (!ebii?.getClientRects().length) return;
    const origin = ebii.getBoundingClientRect();
    if (!origin.width || !origin.height) return;
    const svg = layer(ebii, 'exo-ebii-gap-arrow'), orb = box(ebii.querySelector('.exo-ebii-result > img'), origin);
    const ids = [];
    // The four connectors overlay the photographic source and globe glow.
    // Only S/T tails have fully opaque localized CSS backings, as measured with
    // the current compound masks. E/R retain visible image pixels throughout.
    const imagePaint = (index, start, tip, card) => {
      if (document.documentElement.matches(':lang(en)') || (index !== 1 && index !== 3)) return { paint: '#ffffff', surface: 'image' };
      const rect = box(card, origin), style = getComputedStyle(card, '::before');
      const circles = [...style.maskImage.matchAll(/radial-gradient\(([\d.]+)px at (-?[\d.]+)px (-?[\d.]+)px,/g)]
        .slice(0, 2).map(match => ({ r: +match[1], x: rect.x + +match[2], y: rect.y + +match[3] }));
      const dx = tip[0] - start[0], dy = tip[1] - start[1], length = Math.hypot(dx, dy), ux = dx / length, uy = dy / length;
      const fullyOpaque = (x, y) => x >= rect.x && x <= rect.right && y >= rect.y && y <= rect.bottom &&
        x - rect.x < rect.width * .37 && circles.length === 2 && circles.every(c => Math.hypot(x - c.x, y - c.y) >= c.r);
      // Keep all of the physical 3px stroke inside the opaque backing before
      // allowing navy; the radial fade and antialiased edge remain white.
      const opaqueStroke = t => {
        const x = start[0] + dx * t, y = start[1] + dy * t;
        return [-1.5, 0, 1.5].every(w => [-.5, .5].every(a => fullyOpaque(x - uy * w + ux * a, y + ux * w + uy * a)));
      };
      if (!opaqueStroke(0)) return { paint: '#ffffff', surface: 'image' };
      let low = 0, high = 1;
      for (let step = 0; step < 24; step++) { const t = (low + high) / 2; if (opaqueStroke(t)) low = t; else high = t; }
      let defs = svg.querySelector('defs[data-exo-paint]');
      if (!defs) { defs = document.createElementNS(NS, 'defs'); set(defs, 'data-exo-paint', 'opaque-backing'); svg.prepend(defs); }
      const id = `exo-ebii-surface-paint-${index}`;
      let gradient = defs.querySelector(`#${id}`);
      if (!gradient) { gradient = document.createElementNS(NS, 'linearGradient'); set(gradient, 'id', id); set(gradient, 'gradientUnits', 'userSpaceOnUse'); for (let i = 0; i < 2; i++) gradient.append(document.createElementNS(NS, 'stop')); defs.append(gradient); }
      set(gradient, 'x1', number(start[0])); set(gradient, 'y1', number(start[1])); set(gradient, 'x2', number(tip[0])); set(gradient, 'y2', number(tip[1]));
      gradient.children[0].setAttribute('stop-color', '#113568'); gradient.children[1].setAttribute('stop-color', '#ffffff');
      [...gradient.children].forEach(stop => set(stop, 'offset', `${low * 100}%`));
      return { paint: `url(#${id})`, surface: 'opaque-localized-backing-to-image', transition: [number(start[0] + dx * low), number(start[1] + dy * low)], backingMask: style.maskImage };
    };

    const filled = (id,ax,ay,bx,by,head,spread,metadata,paint = '#113568',surface = 'plain-light') => {
      const length=Math.hypot(bx-ax,by-ay),ux=(bx-ax)/length,uy=(by-ay)/length;
      const base=[bx-ux*head,by-uy*head],p=a=>a.map(number).join(' ');
      ids.push(id,`${id}-head`);
      const shaft=path(svg,id,`M${p([ax,ay])}L${p(base)}`,metadata);
      const tip=path(svg,`${id}-head`,`M${p([bx,by])}L${p([base[0]-uy*spread,base[1]+ux*spread])}L${p([base[0]+uy*spread,base[1]-ux*spread])}Z`,metadata);
      set(tip,'data-exo-part','head');
      [shaft,tip].forEach(node=>{node.style.setProperty('--exo-ebii-arrow-paint',paint);set(node,'data-exo-surface',surface);});
    };
    if (matchMedia('(max-width: 599px)').matches) {
      const cards = [...ebii.querySelectorAll('.exo-ebii-factor')];
      const boxes=cards.map(card=>box(card,origin)), rail=origin.width-12;
      boxes.forEach((card,i)=>{ const id=`collect-${i}`;ids.push(id);path(svg,id,`M${number(card.right+3)} ${number(card.cy)}H${number(rail)}`,{mode:'factor-to-collective-input'}); });
      const join=boxes[boxes.length-1].bottom+12, tip=orb.y-4;
      ids.push('collective-rail');
      path(svg,'collective-rail',`M${number(rail)} ${number(boxes[0].cy)}V${number(join)}H${number(orb.cx)}`,{mode:'four-factor-collector'});
      filled('converge-mobile',orb.cx,join,orb.cx,tip,8,5,{mode:'all-four-factors-to-orb'});
    } else {
      let frames=ebii.querySelector('.exo-ebii-frame-surface');
      if(!frames){
        frames=document.createElement('span');frames.className='exo-ebii-frame-surface';set(frames,'aria-hidden','true');
        [[40.5,53,672.5,518],[748.5,50,1428.5,518],[40.5,761,672.5,1259],[748.5,755,1428.5,1259]].forEach(([x,y,r,b])=>{
          const frame=document.createElement('span');frame.className='exo-ebii-frame';
          const cw=r-x-12,ch=b-y-12;
          frame.style.cssText=`left:calc(${x/1472*100}% - .5px);top:calc(${y/1330*100}% - .5px);width:calc(${(r-x)/1472*100}% + 1px);height:calc(${(b-y)/1330*100}% + 1px);--source-size:${1472/cw*100}% ${1330/ch*100}%;--source-position:${(x+6)/(1472-cw)*100}% ${(y+6)/(1330-ch)*100}%`;frames.append(frame);
        });ebii.append(frames);
        const timeTitle=document.createElement('span');timeTitle.className='exo-ebii-title-sample';set(timeTitle,'aria-hidden','true');ebii.append(timeTitle);
        // Flattened source labels have no matching clean full-card layer.
        // Feathered label backings preserve original photographs and anatomy.
        const backings=[[40,157,292,281,"linear-gradient(180deg,rgb(232 244 252) 0%,rgb(230 241 250) 12.5%,rgb(235 243 250) 25%,rgb(233 239 244) 37.5%,rgb(228 232 239) 50%,rgb(216 223 231) 62.5%,rgb(193 204 218) 75%,rgb(154 169 191) 87.5%,rgb(139 157 182) 100%)"],[751,157,310,281,"linear-gradient(180deg,rgb(228 241 252) 0%,rgb(226 240 251) 12.5%,rgb(227 241 251) 25%,rgb(226 240 250) 37.5%,rgb(225 240 251) 50%,rgb(222 237 249) 62.5%,rgb(221 236 249) 75%,rgb(225 240 252) 87.5%,rgb(224 243 252) 100%)"],[40,866,330,286,"linear-gradient(180deg,rgb(224 240 250) 0%,rgb(215 233 247) 12.5%,rgb(215 233 246) 25%,rgb(212 232 246) 37.5%,rgb(216 234 247) 50%,rgb(220 236 248) 62.5%,rgb(219 235 248) 75%,rgb(203 224 241) 87.5%,rgb(188 214 236) 100%)"],[751,867,325,257,"linear-gradient(180deg,rgb(248 253 253) 0%,rgb(219 238 251) 12.5%,rgb(214 230 245) 25%,rgb(218 231 244) 37.5%,rgb(223 233 242) 50%,rgb(229 235 240) 62.5%,rgb(235 236 237) 75%,rgb(241 237 231) 87.5%,rgb(241 229 217) 100%)"]];
        backings.forEach(([, , , , background],i)=>ebii.querySelectorAll('.exo-ebii-factor')[i].style.setProperty('--localized-photo-wash',background));
      }
      // Narrow transparent restorations erase the old raster ink and four
      // explicitly reviewed frame strips. The original infographic is unchanged.
      const repairs = [{"source":"assets/images/exposome-20260914/ebii-e-arrow-clean-20261012.png","x":427,"y":473,"width":80,"height":73,"clip":"M427 473h80v73h-80Z","frame":[457,514,507,522],"visible":[[457,507]],"frameY":518},{"source":"assets/images/exposome-20260914/ebii-s-arrow-clean-20261012.png","x":872,"y":474,"width":84,"height":72,"clip":"M872 474h84v72h-84Z","frame":[872,514,923,522],"visible":[[872,923]],"frameY":518},{"source":"assets/images/exposome-20260914/ebii-r-arrow-clean-20261012.png","x":406,"y":737,"width":79,"height":69,"clip":"M406 737h79v69h-79Z","frame":[440,757,487,765],"visible":[[440,485]],"frameY":761},{"source":"assets/images/exposome-20260914/ebii-t-arrow-clean-20261012.png","x":884,"y":737,"width":58,"height":52,"clip":"M884 737h58v52h-58Z","frame":[881,751,922,759],"visible":[[886,922]],"frameY":755}];
      const positions = [[431,477,499,540,92],[950,478,880,539,92],[413,800,478,744,Math.hypot(65,56)],[936,784,891,744,78]];
      const sx = origin.width / 1472, sy = origin.height / 1330;
      const frameMask = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1472 1330"><defs><mask id="g" maskUnits="userSpaceOnUse"><rect width="1472" height="1330" fill="white"/>${repairs.map(r => `<rect x="${r.frame[0]}" y="${r.frameY - 20}" width="${r.frame[2] - r.frame[0]}" height="40" fill="black"/>`).join('')}</mask></defs><rect width="1472" height="1330" fill="white" mask="url(#g)"/></svg>`;
      // Exclude only the local crossing strip from the old frame resampling,
      // which otherwise copies fragments of the baked arrow back over repairs.
      frames.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(frameMask)}")`;
      frames.style.maskSize = '100% 100%';
      const segmentCrossing = (a, b, y, radius) => {
        const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy), nx = -dy / length * radius, ny = dx / length * radius;
        const polygon = [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]], xs = [];
        polygon.forEach((p, i) => { const q = polygon[(i + 1) % 4]; if ((p[1] <= y && q[1] >= y) || (q[1] <= y && p[1] >= y)) { if (Math.abs(q[1] - p[1]) < .0001) xs.push(p[0], q[0]); else xs.push(p[0] + (q[0] - p[0]) * (y - p[1]) / (q[1] - p[1])); } });
        [a, b].forEach(p => { if (Math.abs(y - p[1]) <= radius) { const w = Math.sqrt(radius * radius - (y - p[1]) ** 2); xs.push(p[0] - w, p[0] + w); } });
        return xs;
      };
      positions.forEach(([oldX,oldY,bx,by,sourceLength],i) => {
        const repair = repairs[i], oldLength = Math.hypot(bx - oldX, by - oldY), ux = (bx - oldX) / oldLength, uy = (by - oldY) / oldLength;
        // The existing Thai R label reaches the old tail. A physical 3px inset
        // clears that glyph at the narrowest desktop scale without moving text.
        const tailInset = i === 2 ? 3 : 0, length = sourceLength - tailInset / sx;
        const ax = bx - ux * length, ay = by - uy * length;
        let patch = ebii.querySelector(`[data-exo-source-patch="${i}"]`);
        if (!patch) { patch = document.createElement('span'); patch.className = 'exo-ebii-source-patch'; set(patch, 'data-exo-source-patch', i); set(patch, 'aria-hidden', 'true'); ebii.append(patch); }
        patch.style.cssText = `inset:auto;left:${repair.x / 1472 * 100}%;top:${repair.y / 1330 * 100}%;width:${repair.width / 1472 * 100}%;height:${repair.height / 1330 * 100}%;background-image:url("../${repair.source}");background-position:0 0;background-size:100% 100%;clip-path:none`;
        set(patch, 'data-exo-restoration', repair.source); set(patch, 'data-exo-restoration-box', JSON.stringify([repair.x, repair.y, repair.width, repair.height]));
        const start = [ax * sx, ay * sy], tip = [bx * sx, by * sy];
        const directionLength = Math.hypot(tip[0] - start[0], tip[1] - start[1]), vx = (tip[0] - start[0]) / directionLength, vy = (tip[1] - start[1]) / directionLength;
        const head = Math.max(6, 12 * sx), spread = Math.max(4.5, 8 * sx);
        const a = [tip[0] - vx * head - vy * spread, tip[1] - vy * head + vx * spread], b = [tip[0] - vx * head + vy * spread, tip[1] - vy * head - vx * spread];
        const point = p => p.map(number).join(' '), id = `converge-${i}`, color = { paint: '#113568', surface: 'user-ebii-navy' };
        const line = path(svg, id, `M${point(start)}L${point(tip)}M${point(a)}L${point(tip)}L${point(b)}`, { mode: 'clean-reference-orb-rim', source: [ax,ay,bx,by], length, tailInset, shaft: 3, head, spread, ...color });
        ids.push(id); line.removeAttribute('data-exo-part'); line.style.setProperty('--exo-ebii-arrow-paint', color.paint); set(line, 'data-exo-surface', color.surface); set(line, 'data-exo-head', 'open');
        const frameY = repair.frameY * sy;
        // 1.5px arrow radius + 2px visible clearance + 0.5px frame radius.
        const xs = [[start,tip],[a,tip],[tip,b]].flatMap(([p,q]) => segmentCrossing(p,q,frameY,4));
        const min = Math.min(...xs), max = Math.max(...xs);
        // These intervals contain original visible divider, excluding the globe
        // rim at R/T; never introduce a line merely to fill the bounding strip.
        const frameD = repair.visible.map(([x1,x2]) => {
          const left = x1 * sx, right = x2 * sx;
          return `${left < min ? `M${point([left,frameY])}H${number(Math.min(min,right))}` : ''}${right > max ? `M${point([Math.max(max,left),frameY])}H${number(right)}` : ''}`;
        }).join('');
        const frameId = `frame-crossing-${i}`, replay = path(svg, frameId, frameD, { mode: 'one-pixel-frame-replay', sourceStrip: repair.frame, visible: repair.visible, gap: [number(min),number(max)], clearance: 2 });
        ids.push(frameId); set(replay, 'data-exo-frame-replay', 'true');
      });


    }
    trim(svg, ids); ebii.classList.add('exo-measured-arrows');
  }

  function update() {
    queued = false;
    sequence(health?.querySelector('.exo-health-flow'), ':scope > .exo-health-step', 'exo-health-gap-arrow');
    feedback(); convergence();
    sequence(levels, ':scope > .exo-impact-level', 'exo-impact-gap-arrow');
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(update); } }
  const observed = [health, ebii, levels].filter(Boolean);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observed.forEach(element => { observer.observe(element); element.querySelectorAll('img,li,article').forEach(node => observer.observe(node)); });
  }
  document.querySelectorAll('details.exo-accordion').forEach(element => element.addEventListener('toggle', schedule));
  observed.forEach(element => element.querySelectorAll('img').forEach(img => img.addEventListener('load', schedule)));
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('load', schedule, { once: true });
  window.addEventListener('pageshow', schedule);
  document.addEventListener('arotec:languagechange', schedule);
  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener('loadingdone', schedule);
  schedule();
})();
