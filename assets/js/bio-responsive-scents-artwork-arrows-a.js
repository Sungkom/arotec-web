/* Source-space recoloring for arrows embedded in Olfactiva and Travion artwork. */
(function () {
  'use strict';
  if (!document.body.classList.contains('brs-page')) return;
  if (window.ArotecScentsArtworkArrowsA) {
    window.ArotecScentsArtworkArrowsA.refresh();
    return;
  }

  const NS = 'http://www.w3.org/2000/svg';
  const sources = [
    {
      "source": "olfactiva-20260928/properties.png",
      "selector": "#olfactiva .ols-activation-icons > li:nth-child(3) img",
      "size": [
        1448,
        1086
      ],
      "arrows": 3,
      "paths": [
        "M1072 277.333 C1112.667 221.333 1171.667 207 1228.333 238.333 L1239 224.667 Q1242.667 221 1245.333 226 L1263 276.667 Q1264.333 283 1258 282.333 L1205.667 271.333 Q1201.667 270 1204.333 266.333 L1215.667 255.333 C1172 232.333 1125 249.333 1097 285.333 C1092 292.667 1084.667 293.667 1078.667 290 C1072.333 287 1070 283 1072 277.333 Z",
        "M1266 300.333 C1274 292.333 1284 295.333 1288.333 303.667 C1302.667 349.333 1284 395.667 1251.667 421.667 L1259.333 434.333 Q1261.667 440.333 1255.667 440.333 L1203.667 438 Q1199 437.667 1201.333 431.667 L1226.667 388.667 Q1229.667 385 1232 389.667 L1238.667 401 C1263.667 378 1272 343.333 1264 311.667 Q1262 304.667 1266 300.333 Z",
        "M1067.667 307 Q1070.667 304 1074 308 L1102.333 348.667 Q1105.333 354 1099 355 L1084 355.333 C1090.333 399.333 1127.333 422.333 1169.667 423.667 C1179 424 1184 430 1184.333 437 C1184.667 443.667 1178.667 450 1170.333 450 C1114 449.667 1067.333 411.667 1059 355 L1042.667 355 Q1036.667 354 1039.333 349 Z"
      ]
    },
    {
      "source": "olfactiva-20260928/responses.png",
      "selector": "#olfactiva .ols-outcome-group--wellbeing .ols-outcomes > li:nth-child(9) img",
      "size": [
        1448,
        1086
      ],
      "arrows": 4,
      "paths": [
        "M1001 922 C1014.333 879.667 1059.333 867.333 1099.667 891.667 L1103.667 881.667 L1114.333 908 L1087 909.333 L1094.333 900.333 C1062.333 882.333 1026.667 891.333 1001 922 Z",
        "M1119.333 914.667 C1136 928.333 1139 949 1131 967 L1141.667 968 L1119 990.667 L1113.333 960 L1122.667 964.667 C1127 948.667 1125.667 931.333 1119.333 914.667 Z",
        "M1112 1000.333 C1105.333 1013.667 1096 1022 1081 1026 L1081.667 1035.333 L1059.667 1024.333 L1079.667 1010.333 L1080 1018.667 C1093.333 1016.333 1104.667 1010 1112 1000.333 Z",
        "M994.667 936.667 L1011 965 L1001.667 963.333 C1003.667 990.333 1024 1010.667 1049.667 1021 C1014.667 1021.333 994 997.667 990.667 964.333 L980.667 967.333 Z"
      ]
    },
    {
      "source": "travion-20260928/mechanism-citron.png",
      "size": [
        262,
        384
      ],
      "arrows": 2,
      "paths": [
        "M133.667 26.333 L151.667 58.333 L140.667 58.333 L140.667 194 L126.667 194 L126.667 58.333 L115.667 58.333 Z",
        "M126.667 194 L140.667 194 L140.667 333 L150.333 333 L133.667 361.667 L117 333 L126.667 333 Z"
      ]
    },
    {
      "source": "travion-20260928/mechanism-terpineol.png",
      "size": [
        282,
        361
      ],
      "arrows": 1,
      "paths": [
        "M188.667 210 L198.667 210 L198.667 225.333 L206.667 225.333 L194.667 246.667 L182.667 225.333 L188.667 225.333 Z"
      ]
    },
    {
      "source": "travion-20260928/mechanism-limonene.png",
      "size": [
        277,
        309
      ],
      "arrows": 1,
      "paths": [
        "M125 112.333 C152 115.333 175 128.667 181.667 158.333 L189.333 150 C190.667 173.333 178 194.667 159.333 209.667 C163.333 193.667 164 177.667 156.333 164 L161.333 164 C154 146.333 139.667 139.333 124.333 134.667 C126 126.667 125.667 119.333 125 112.333 Z"
      ]
    }
  ];
  const entries = new Map();
  let queued = false;

  // These filled contours follow the reviewed source pixels. Their small
  // antialiasing overlap covers colored fringes without touching nearby anatomy.
  function makeOverlay(img, definition) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + definition.size.join(' '));
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('data-arotec-arrow-owned', 'scents-artwork-a');
    svg.setAttribute('data-scents-artwork-arrows', String(definition.arrows));
    svg.setAttribute('data-scents-artwork-source', definition.source);
    svg.style.cssText = 'position:absolute;pointer-events:none;overflow:visible;display:block;z-index:2;max-width:none!important;max-height:none!important;';
    definition.paths.forEach(d => {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('data-scents-arrow-line', '');
      path.setAttribute('data-scents-arrow-fill', 'true');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-width', '0.55');
      path.style.setProperty('fill', 'var(--arotec-arrow-color, #113568)', 'important');
      path.style.setProperty('stroke', 'var(--arotec-arrow-color, #113568)', 'important');
      svg.appendChild(path);
    });
    const parent = img.parentElement;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    parent.appendChild(svg);
    const entry = { img, svg, parent };
    entries.set(img, entry);
    return entry;
  }

  function place(entry) {
    const { img, svg, parent } = entry;
    if (!img.isConnected || !parent.isConnected) {
      svg.remove();
      entries.delete(img);
      return;
    }
    const box = img.getBoundingClientRect();
    if (!box.width || !box.height) {
      svg.style.display = 'none';
      return;
    }
    const parentBox = parent.getBoundingClientRect();
    // Keep the image's object-fit:contain box. SVG meet preserves the same
    // centered source geometry when a mechanism has an explicit image height.
    const scaleX = parent.offsetWidth ? parentBox.width / parent.offsetWidth : 1;
    const scaleY = parent.offsetHeight ? parentBox.height / parent.offsetHeight : 1;
    const left = (box.left - parentBox.left) / scaleX - parent.clientLeft + parent.scrollLeft;
    const top = (box.top - parentBox.top) / scaleY - parent.clientTop + parent.scrollTop;
    svg.style.left = left + 'px';
    svg.style.top = top + 'px';
    svg.style.width = box.width / scaleX + 'px';
    svg.style.height = box.height / scaleY + 'px';
    svg.style.display = 'block';
    window.ArotecScentsArrowContrast?.paintArtwork(svg, img);
  }

  function refresh() {
    document.querySelectorAll('body.brs-page #olfactiva img, body.brs-page #trevion img').forEach(img => {
      const source = img.currentSrc || img.src;
      const definition = sources.find(item => source.includes('/bio-responsive-scents/' + item.source) &&
        (!item.selector || img.matches(item.selector)));
      if (!definition) return;
      place(entries.get(img) || makeOverlay(img, definition));
    });
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  }

  window.ArotecScentsArtworkArrowsA = { refresh };
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLImageElement &&
        event.target.closest('#olfactiva, #trevion')) schedule();
  }, true);
  const panels = ['olfactiva', 'trevion'].map(id => document.getElementById(id)).filter(Boolean);
  const observer = new MutationObserver(schedule);
  panels.forEach(panel => observer.observe(panel, { attributes: true, attributeFilter: ['hidden', 'class'] }));
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, { once: true });
  else schedule();
})();

