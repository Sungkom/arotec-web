(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-progress]");
  const menuButton = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const backTop = document.querySelector("[data-back-top]");
  const sections = [...document.querySelectorAll("[data-section]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const qaStatic = new URLSearchParams(window.location.search).has("qa");

  const tiltTargets = [...document.querySelectorAll(".glass-card, .pathway-card, .domain-card, .impact-card, .dementia-card, .factor-panel, .homeostasis-card")];
  tiltTargets.forEach((target) => target.setAttribute("data-tilt", ""));

  if (qaStatic) body.classList.add("qa-static");

  const closeNavigation = () => {
    nav?.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
  });

  navLinks.forEach((link) => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeNavigation();
    menuButton?.focus();
  });

  const updatePageState = () => {
    const scrollTop = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    header?.classList.toggle("is-scrolled", scrollTop > 16);
    backTop?.classList.toggle("is-visible", scrollTop > 680);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, scrollTop / maxScroll)})`;

    const probe = scrollTop + (header?.offsetHeight || 68) + 110;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= probe) current = section;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
    });
  };

  updatePageState();
  window.addEventListener("scroll", updatePageState, { passive: true });

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  });

  const revealTargets = [...document.querySelectorAll(".reveal, .connector-overlay")];
  revealTargets.forEach((target, index) => {
    target.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 0.06}s`);
  });
  if ("IntersectionObserver" in window && !reducedMotion.matches && !qaStatic) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  if (!reducedMotion.matches && !qaStatic) {
    const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
    let ticking = false;
    const updateParallax = () => {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const centerOffset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        const offset = Math.max(-1, Math.min(1, centerOffset));
        item.style.setProperty("--parallax-y", `${(offset * -7).toFixed(2)}px`);
      });
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (ticking) return;
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }, { passive: true });
    updateParallax();
  }
})();
