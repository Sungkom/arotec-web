(() => {
  'use strict';
  const root = document.querySelector('#adi-model');
  const model = root?.querySelector('.hla-adi-model');
  const factors = model?.querySelectorAll('.hla-adi-factors > article');
  const equation = model?.querySelector('.hla-adi-equation');
  const resilience = model?.querySelector('.hla-adi-factor--resilience');
  if (!model || factors.length !== 2 || !equation || !resilience) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('hla-adi-relationships');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  model.append(svg);
  let queued = false;
  const num = n => Math.round(n * 100) / 100;
  function draw() {
    queued = false;
    // The shared typography cascade intentionally forces English title case.
    // This reference's exact three factor headings and editorial title are uppercase.
    // A scoped inline paint override outranks that layered important rule without
    // changing text nodes, font family, font size or any neighboring heading.
    root.querySelectorAll('.hla-adi-intro h2, .hla-adi-factor h3').forEach(heading => {
      if (heading.style.getPropertyValue('text-transform') !== 'uppercase' || heading.style.getPropertyPriority('text-transform') !== 'important') {
        heading.style.setProperty('text-transform', 'uppercase', 'important');
      }
    });
    const outer = model.getBoundingClientRect();
    if (outer.width <= 0 || outer.height <= 0) return;
    const rect = node => {
      const b = node.getBoundingClientRect();
      return {left:b.left-outer.left,right:b.right-outer.left,top:b.top-outer.top,bottom:b.bottom-outer.top,width:b.width,height:b.height};
    };
    svg.setAttribute('viewBox', `0 0 ${outer.width} ${outer.height}`);
    const mi = [...equation.querySelectorAll('mi')];
    const ebii = rect(mi.find(n => n.textContent.trim() === 'EBII'));
    const ip = rect(mi.find(n => n.textContent.trim() === 'IP'));
    const ar = rect(mi.find(n => n.textContent.trim() === 'AR'));
    const text = rect(equation.querySelector('p'));
    const cards = [...factors].map(rect);
    const lower = rect(resilience);
    const fragments = [];
    const path = (id, points) => {
      const el = document.createElementNS(ns, 'path');
      el.setAttribute('data-adi-relationship', id);
      el.setAttribute('d', points.map((p,i) => `${i?'L':'M'}${num(p[0])} ${num(p[1])}`).join(' '));
      el.setAttribute('stroke-width', '3');
      el.setAttribute('vector-effect', 'non-scaling-stroke');
      fragments.push(el);
    };
    const dot = (id, x, y) => {
      const el = document.createElementNS(ns, 'circle');
      el.setAttribute('data-adi-endpoint',id); el.setAttribute('cx',num(x)); el.setAttribute('cy',num(y)); el.setAttribute('r','5'); fragments.push(el);
    };
    const sideBySide = Math.abs(cards[0].top-cards[1].top)<4;
    if (sideBySide) {
      for (const [i,target] of [[0,ebii],[1,ip]]) {
        const startX = cards[i].left + cards[i].width*(i===0?.85:.25);
        const targetX = target.left + target.width/2;
        const endY = target.top-12;
        const startY = cards[i].bottom;
        const elbowY = startY + Math.max(10,(endY-startY)*.48);
        path(i===0?'ebii':'ip',[[startX,startY],[startX,elbowY],[targetX,elbowY],[targetX,endY]]);
        dot(i===0?'ebii':'ip',targetX,endY);
      }
    }
    const x = ar.left+ar.width/2;
    const startY = ar.bottom+10;
    const stopY = text.top-7;
    if (stopY>startY) path('ar-above-copy',[[x,startY],[x,stopY]]);
    dot('ar',x,startY);
    if (lower.top>text.bottom+8) path('ar-below-copy',[[x,text.bottom+8],[x,lower.top]]);
    svg.replaceChildren(...fragments);
    svg.dataset.adiReady = 'true';
    svg.dataset.adiUpper = sideBySide?'paired':'stacked';
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  const ro = new ResizeObserver(schedule);
  ro.observe(model); ro.observe(equation); factors.forEach(el => ro.observe(el));
  root.closest('details')?.addEventListener('toggle',schedule);
  document.addEventListener('arotec:languagechange',schedule);
  document.fonts?.ready.then(schedule);
  document.fonts?.addEventListener('loadingdone',schedule);
  new MutationObserver(schedule).observe(root.querySelector('.hla-adi-intro'),{childList:true,subtree:true,characterData:true});
  new MutationObserver(schedule).observe(equation,{childList:true,subtree:true,characterData:true});
  schedule();
})();
