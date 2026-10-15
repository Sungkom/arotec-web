/* Keep decorative arrows between the actual image bounds, including localized
   headings that wrap to different heights. Images and text retain their layout. */
(function () {
  'use strict';
  if (window.__arotecIngredientArrowLayout) return;
  window.__arotecIngredientArrowLayout = true;

  function start() {
    var rows = Array.from(document.querySelectorAll('.bri-journey, .bri-pathway--response, .bri-pathway--how'));
    if (!rows.length) return;
    var queued = false;

    function position() {
      queued = false;
      rows.forEach(function (row) {
        var items = Array.from(row.children);
        items.slice(0, -1).forEach(function (item, index) {
          var arrow = item.querySelector('.bri-journey-arrow, .bri-step-arrow');
          var current = item.querySelector('.bri-journey-image, .bri-step-image');
          var next = items[index + 1].querySelector('.bri-journey-image, .bri-step-image');
          if (!arrow || !current || !next || getComputedStyle(arrow).display === 'none') return;
          var a = current.getBoundingClientRect();
          var b = next.getBoundingClientRect();
          var origin = arrow.parentElement.getBoundingClientRect();
          if (!a.width || !b.width || !origin.width) return;
          var x = (a.right + b.left) / 2 - origin.left;
          var y = (a.top + a.height / 2 + b.top + b.height / 2) / 2 - origin.top;
          arrow.style.setProperty('--bri-arrow-x', x.toFixed(3) + 'px');
          arrow.style.setProperty('--bri-arrow-y', y.toFixed(3) + 'px');
        });
      });
    }

    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(position);
    }

    if (window.ResizeObserver) {
      var observer = new ResizeObserver(schedule);
      rows.forEach(function (row) {
        observer.observe(row);
        row.querySelectorAll('li, h3, h4, img').forEach(function (element) { observer.observe(element); });
      });
    }
    window.addEventListener('resize', schedule);
    window.addEventListener('pageshow', schedule);
    if (document.fonts) {
      document.fonts.ready.then(schedule);
      document.fonts.addEventListener('loadingdone', schedule);
    }
    schedule();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
