(() => {
  const body = document.body;
  if (!body || body.dataset.page !== "home") return;

  const revealAfter = 84;
  const directionThreshold = 5;
  let lastScrollY = Math.max(0, window.scrollY || 0);
  let frame = 0;

  const preserveLegacyHeroCopyAlignment = () => {
    const heroShell = document.querySelector(".hero .section-shell");

    if (!heroShell || window.innerWidth <= 760) {
      body.style.removeProperty("--home-hero-copy-offset");
      return;
    }

    // The original one-row header used a 1168px grid, a 118px logo column,
    // and a 22px gap before Customized for you. Keep that anchor stable so
    // rearranging the new menu never changes the legacy hero copy or dots.
    if (window.innerWidth <= 1060) {
      body.style.setProperty("--home-hero-copy-offset", "0px");
      return;
    }

    const layoutWidth = document.documentElement.clientWidth;
    const legacyHeaderWidth = Math.min(1168, Math.max(0, layoutWidth - 40));
    const legacyHeaderLeft = Math.max(0, (layoutWidth - legacyHeaderWidth) / 2);
    const legacyCustomizedLeft = legacyHeaderLeft + 118 + 22;
    const shellLeft = heroShell.getBoundingClientRect().left;
    const offset = Math.max(0, Math.round(legacyCustomizedLeft - shellLeft));
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
    preserveLegacyHeroCopyAlignment();
  };

  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("load", preserveLegacyHeroCopyAlignment, { once: true });
})();
