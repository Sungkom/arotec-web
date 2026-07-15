(() => {
  const body = document.body;
  if (!body || body.dataset.page !== "home") return;

  const revealAfter = 84;
  const directionThreshold = 5;
  let lastScrollY = Math.max(0, window.scrollY || 0);
  let frame = 0;

  const alignHeroCopyToCustomizedMenu = () => {
    const heroShell = document.querySelector(".hero .section-shell");
    const customizedLink = document.querySelector('.desktop-nav .nav-link[href*="customized"]');

    if (!heroShell || !customizedLink || window.innerWidth <= 760) {
      body.style.removeProperty("--home-hero-copy-offset");
      return;
    }

    const shellLeft = heroShell.getBoundingClientRect().left;
    const linkLeft = customizedLink.getBoundingClientRect().left;
    const offset = Math.max(0, Math.round(linkLeft - shellLeft));
    body.style.setProperty("--home-hero-copy-offset", `${offset}px`);
  };

  const updateHeader = () => {
    frame = 0;
    const currentScrollY = Math.max(0, window.scrollY || 0);
    const delta = currentScrollY - lastScrollY;
    const hasScrolled = currentScrollY > revealAfter;

    body.classList.toggle("home-header-scroll-active", hasScrolled);

    if (!hasScrolled) {
      body.classList.remove("home-header-scroll-hidden");
    } else if (Math.abs(delta) >= directionThreshold) {
      body.classList.toggle("home-header-scroll-hidden", delta < 0);
    }

    lastScrollY = currentScrollY;
    alignHeroCopyToCustomizedMenu();
  };

  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("load", alignHeroCopyToCustomizedMenu, { once: true });

  const shell = document.getElementById("site-shell");
  if (shell) {
    new MutationObserver(() => window.requestAnimationFrame(alignHeroCopyToCustomizedMenu))
      .observe(shell, { childList: true, subtree: true });
  }
})();
