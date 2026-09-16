/* Home-shell mobile links must continue to reach the home page from this detail page. */
(() => {
  const initialize = () => {
    document.querySelectorAll('#mobilePanel a[href="#platform"], #mobilePanel a[href="#insights"]').forEach(link => {
      link.setAttribute('href', '../index.html' + link.getAttribute('href'));
    });
    const fragment = window.location.hash.slice(1);
    if (fragment) {
      const target = document.getElementById(fragment);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
