(() => {
  'use strict';

  const section = document.querySelector('#input-pathway');
  if (!section) return;
  const routes = section.querySelector('.os-cortical-routes');
  const routeMap = section.querySelector('.os-route-map');
  const modulatory = section.querySelector('.os-modulatory-path');
  const nucleiSource = modulatory?.querySelector('.os-pathway-label');
  if (!routes || !routeMap || !nucleiSource) return;

  // Preserve the original text-node slots used by the site's language catalog.
  // Visual copies follow those localized nodes and are hidden from screen readers.
  const createLayer = (parent, className, names) => {
    const layer = document.createElement('div');
    layer.className = className;
    layer.setAttribute('aria-hidden', 'true');
    layer.setAttribute('data-arotec-i18n-ignore', '');
    const labels = names.map(name => {
      const label = document.createElement('span');
      if (name) label.className = name;
      layer.append(label);
      return label;
    });
    parent.append(layer);
    return labels;
  };
  const corticalLabels = createLayer(routeMap, 'os-cortical-labels', [
    'os-label-thalamus', 'os-label-orbitofrontal', 'os-label-entorhinal',
    'os-label-hippocampus', 'os-label-hypothalamus', 'os-label-brainstem',
    'os-label-amygdala'
  ]);
  const nucleiLabels = createLayer(modulatory, 'os-nuclei-labels', ['', '', '']);

  const routeText = (paragraph, afterArrow) => {
    if (!paragraph) return '';
    let passedArrow = false;
    return Array.from(paragraph.childNodes).map(node => {
      if (node.nodeType === Node.ELEMENT_NODE && node.matches('i')) {
        passedArrow = true;
        return '';
      }
      return passedArrow === afterArrow ? node.textContent : '';
    }).join('').trim();
  };
  const writeLabels = (labels, values) => labels.forEach((label, index) => {
    const value = values[index] || '';
    if (label.textContent !== value) label.textContent = value;
  });
  const syncLabels = () => {
    const paragraphs = routes.querySelectorAll(':scope > p');
    writeLabels(corticalLabels, [
      routeText(paragraphs[0], false), routeText(paragraphs[0], true),
      routeText(paragraphs[1], false), routeText(paragraphs[1], true),
      routeText(paragraphs[4], true), routeText(paragraphs[5], true),
      paragraphs[2]?.textContent.trim() || ''
    ]);
    writeLabels(nucleiLabels, nucleiSource.textContent.split(/[·・]/).map(text => text.trim()).reverse());
  };
  syncLabels();
  const observer = new MutationObserver(syncLabels);
  const options = { childList: true, subtree: true, characterData: true };
  observer.observe(routes, options);
  observer.observe(nucleiSource, options);
})();
