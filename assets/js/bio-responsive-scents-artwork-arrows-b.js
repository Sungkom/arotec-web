/* Reviewed raster-arrow footprints in the Meraxyl and Cortiva ingredient panels.
   Source illustrations, their crop windows, labels and inhibition bars stay intact. */
(() => {
  'use strict';
  if (!document.body.matches('.brs-page')) return;
  if (window.ArotecScentsArtworkArrowsB) {
    window.ArotecScentsArtworkArrowsB.refresh();
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const recipes = [
    {
      selector: '#meraxyl .mxs-pathway[aria-labelledby="meraxyl-thymol-pathway"] .mxs-channel > img',
      source: 'meraxyl-20260928/illustrations.png',
      size: [1448, 1086],
      arrows: [
        {
          id: 'meraxyl-trpv1-red',
          d: 'M698.5 592.5L703 596C701.5 631 689 671 676 690.5L683.5 693.5L657.5 708.5L666 680L669 684C684 658 692 627 698.5 592.5Z',
        },
        {
          id: 'meraxyl-trpv1-upper-blue',
          d: 'M674 454.5C687.5 456 699 470 706.5 487L713.5 482L714.7 514C716 543 709.5 573 701 597.5L699.5 597C704 567 707.5 537 703.2 516C701 506 696.5 498 690 492L698.2 489C691.5 473 681.5 462 674 458.5Q671.5 456.5 674 454.5Z',
        },
        {
          id: 'meraxyl-trpv1-lower-blue',
          d: 'M699.5 596.5L710.7 599.8C703.5 630 705.5 663 714.5 682.5L721.8 677.5L720.7 708L696.2 689L704.7 685.7C695.5 666 694 632 699.5 596.5Z',
        },
      ],
    },
    {
      selector: '#meraxyl .mxs-pathway[aria-labelledby="meraxyl-rosmarinic-pathway"] .mxs-channel > img',
      source: 'meraxyl-20260928/illustrations.png',
      size: [1448, 1086],
      arrows: [
        {
          id: 'meraxyl-mrgprx2-left',
          d: 'M1156.8 665H1167.4V675Q1167.4 684.7 1155 685.1H1146Q1133 686 1124.7 703.5L1133.5 707L1111.4 721L1111.3 695L1119.8 700Q1133.5 674.5 1146 674.5H1156.8Z',
        },
        {
          id: 'meraxyl-mrgprx2-middle',
          d: 'M1181 666H1193V690C1193 703 1218.7 707 1219.7 730.6H1226.8L1213.1 750.8L1198.3 731.6H1206.7C1206.2 716 1181 711.5 1181 692Z',
        },
        {
          id: 'meraxyl-mrgprx2-right',
          d: 'M1214 665H1225.5V675H1230Q1243.7 675 1243.7 689V693H1331Q1353.7 693 1353.7 715V717.5H1361.5L1344.8 736L1329.2 717.5H1339.7V715Q1339.7 705.5 1331 705.5H1244Q1230.4 705.5 1230.4 692.5V690H1227Q1214 690 1214 677Z',
        },
      ],
    },
    {
      selector: '#cortiva .cv-pathway:not(.cv-pathway--stress) .cv-pathway-art > img',
      source: 'cortiva-20260928/reference-modulation.png',
      size: [1536, 1024],
      arrows: [
        {
          id: 'cortiva-receptor-tail',
          d: 'M605 420.5H612.8C612 434 616 445.5 621 451.3L613.8 455C608 445 604.2 434 605 420.5Z',
        },
        {
          id: 'cortiva-receptor-down',
          d: 'M626 447H635V467.2H642L630.8 482.6L618.5 467.2H626Z',
        },
      ],
    },
    {
      selector: '#cortiva .cv-pathway--stress .cv-pathway-art > img',
      source: 'cortiva-20260928/reference-modulation.png',
      size: [1536, 1024],
      arrows: [
        {
          id: 'cortiva-gr-down',
          d: 'M897.1 411H904.9V438.8H911.6L900.9 453.8L891 438.8H897.1Z',
        },
        {
          id: 'cortiva-gr-diagonal',
          d: 'M933.2 390.5H939.5C941.2 405.5 951.2 414.5 967.2 423.5L969.3 417.5L976.2 432.1L960.3 436L963.4 428C946.5 421 936.5 412 933.2 398Z',
        },
        {
          id: 'cortiva-dna-right',
          d: 'M914 460.2H949.2V453L965 463.8L949.2 474.2V467.8H914Z',
          preserveBlueHelix: true,
        },
      ],
    },
  ];

  let serial = 0;
  let frame;
  const records = new Map();
  const create = (tag, attributes = {}) => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  };
  const style = (element, key, value) => {
    if (element.style.getPropertyValue(key) !== value) element.style.setProperty(key, value, 'important');
  };

  function build(img, recipe) {
    const prefix = `scents-artwork-b-${++serial}`;
    const svg = create('svg', {
      viewBox: `0 0 ${recipe.size.join(' ')}`,
      preserveAspectRatio: 'none',
      'aria-hidden': 'true',
      focusable: 'false',
      'data-arotec-arrow-owned': 'scents-artwork-b',
      'data-scents-artwork-arrows': 'b',
    });
    const defs = create('defs');
    svg.append(defs);
    const edgeFilter = create('filter', {
      id: `${prefix}-edge`, x: '-10%', y: '-10%', width: '120%', height: '120%',
      'color-interpolation-filters': 'sRGB',
    });
    // Cover the antialiased source edge by less than one source pixel.
    edgeFilter.append(create('feMorphology', { in: 'SourceGraphic', operator: 'dilate', radius: '.55' }));
    defs.append(edgeFilter);
    recipe.arrows.forEach((arrow, index) => {
      const id = `${prefix}-${index}`;
      let mask;
      if (arrow.preserveBlueHelix) {
        mask = create('mask', {
          id: `${id}-mask`, maskUnits: 'userSpaceOnUse',
          x: 0, y: 0, width: recipe.size[0], height: recipe.size[1],
          'mask-type': 'alpha',
        });
        defs.append(mask);
      }
      if (arrow.preserveBlueHelix) {
        // The navy DNA arrow crosses the bright blue double helix at its tail.
        // A source-derived alpha mask leaves those foreground blue pixels intact.
        const filter = create('filter', {
          id: `${id}-source-alpha`, 'color-interpolation-filters': 'sRGB',
          filterUnits: 'userSpaceOnUse', x: 0, y: 0,
          width: recipe.size[0], height: recipe.size[1],
        });
        filter.append(create('feColorMatrix', {
          type: 'matrix',
          values: '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  12 -12 0 0 2.2',
        }));
        defs.append(filter);
        const sourceMask = create('mask', {
          id: `${id}-source-mask`, maskUnits: 'userSpaceOnUse',
          x: 0, y: 0, width: recipe.size[0], height: recipe.size[1], 'mask-type': 'alpha',
        });
        sourceMask.append(create('image', {
          href: img.currentSrc || img.src, x: 0, y: 0,
          width: recipe.size[0], height: recipe.size[1],
          filter: `url(#${id}-source-alpha)`,
        }));
        defs.append(sourceMask);
        mask.append(create('path', { d: arrow.d, fill: '#fff', mask: `url(#${id}-source-mask)` }));
      }
      const path = create('path', {
        d: arrow.d, fill: 'currentColor', stroke: 'none',
        filter: `url(#${prefix}-edge)`,
        'data-scents-arrow-line': arrow.id,
        'data-scents-arrow-fill': 'true',
      });
      if (mask) path.setAttribute('mask', `url(#${id}-mask)`);
      svg.append(path);
    });
    Object.entries({
      position: 'absolute', display: 'block', margin: '0px', padding: '0px',
      border: '0px', 'border-radius': '0px', 'max-width': 'none', 'max-height': 'none',
      'min-width': '0px', 'min-height': '0px', overflow: 'visible',
      'pointer-events': 'none', 'user-select': 'none', 'z-index': '2',
      transform: 'none', transition: 'none', 'mix-blend-mode': 'normal',
    }).forEach(([key, value]) => style(svg, key, value));
    const crop = img.parentElement;
    // Cortiva's original art deliberately multiplies into the glass panel.
    // Paint in a sibling crop so white remains white without changing that art.
    const host = document.createElement('span');
    host.setAttribute('aria-hidden', 'true');
    host.setAttribute('data-scents-artwork-host', 'b');
    Object.entries({
      position: 'absolute', display: 'block', margin: '0px', padding: '0px',
      border: '0px', 'max-width': 'none', 'max-height': 'none', overflow: 'hidden',
      'pointer-events': 'none', 'user-select': 'none', 'z-index': '2',
      transform: 'none', transition: 'none', 'mix-blend-mode': 'normal',
    }).forEach(([key, value]) => style(host, key, value));
    host.append(svg);
    crop.parentElement.append(host);
    const record = { img, svg, crop, host, recipe };
    records.set(img, record);
    observer?.observe(img.parentElement);
    return record;
  }

  function refresh() {
    frame = null;
    recipes.forEach(recipe => {
      document.querySelectorAll(recipe.selector).forEach(img => {
        // Localized text overlays may keep this source; unrelated art is never matched.
        if (!(img instanceof HTMLImageElement) || !img.src.includes(recipe.source) || !img.naturalWidth) return;
        const record = records.get(img) || build(img, recipe);
        const computed = getComputedStyle(img);
        const cropStyle = getComputedStyle(record.crop);
        const visible = img.getClientRects().length && cropStyle.display !== 'none' && cropStyle.visibility !== 'hidden';
        style(record.host, 'display', visible ? 'block' : 'none');
        if (!visible) return;
        const cropBox = record.crop.getBoundingClientRect();
        const parent = record.host.offsetParent || document.documentElement;
        const parentBox = parent.getBoundingClientRect();
        const parentStyle = getComputedStyle(parent);
        const sx = parent.offsetWidth ? parentBox.width / parent.offsetWidth : 1;
        const sy = parent.offsetHeight ? parentBox.height / parent.offsetHeight : 1;
        const initialBlock = parent === document.body && parentStyle.position === 'static';
        const left = initialBlock ? cropBox.left + window.scrollX : (cropBox.left - parentBox.left) / sx - parseFloat(parentStyle.borderLeftWidth) + parent.scrollLeft;
        const top = initialBlock ? cropBox.top + window.scrollY : (cropBox.top - parentBox.top) / sy - parseFloat(parentStyle.borderTopWidth) + parent.scrollTop;
        style(record.host, 'left', `${left}px`);
        style(record.host, 'top', `${top}px`);
        style(record.host, 'width', cropStyle.width);
        style(record.host, 'height', cropStyle.height);
        style(record.host, 'clip-path', cropStyle.clipPath);
        ['left', 'top', 'width', 'height'].forEach(key => style(record.svg, key, computed[key]));
        const paint = window.ArotecScentsArrowContrast;
        if (paint?.paintArtwork) paint.paintArtwork(record.svg, img);
        else record.svg.querySelectorAll('[data-scents-arrow-line]').forEach(path => {
          style(path, 'fill', paint?.color(path) || '#113568');
          style(path, 'stroke', 'none');
        });
      });
    });
    for (const [img, record] of records) {
      if (!img.isConnected) { record.host.remove(); records.delete(img); }
    }
  }
  function schedule() {
    if (frame == null) frame = requestAnimationFrame(refresh);
  }
  const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null;
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLImageElement && recipes.some(recipe => event.target.matches(recipe.selector))) schedule();
  }, true);
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('hashchange', schedule);
  document.addEventListener('arotec:languagechange', schedule);
  window.ArotecScentsArtworkArrowsB = Object.freeze({ refresh, recipes: recipes.map(({ selector, arrows }) => ({ selector, arrows: arrows.map(({ id }) => id) })) });
  schedule();
})();
