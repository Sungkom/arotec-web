(() => {
  "use strict";

  const body = document.body;
  const qaStatic = new URLSearchParams(window.location.search).has("qa");
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-progress]");
  const backTop = document.querySelector("[data-back-top]");
  const menuButton = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  body.classList.add("is-ready");
  if (qaStatic) {
    body.classList.add("qa-static");
    document.documentElement.classList.add("qa-static-root");
  }

  const updateScroll = () => {
    const scrollTop = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    header?.classList.toggle("is-scrolled", scrollTop > 18);
    backTop?.classList.toggle("is-visible", scrollTop > 620);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, scrollTop / maxScroll)})`;
  };

  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      nav?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.focus();
    }
  });

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
  });

  const revealTargets = document.querySelectorAll(".reveal");
  const connectorTargets = document.querySelectorAll(".connector-overlay");
  if ("IntersectionObserver" in window && !reducedMotion.matches && !qaStatic) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -7%", threshold: .08 });

    revealTargets.forEach((target) => revealObserver.observe(target));
    connectorTargets.forEach((target) => revealObserver.observe(target));
  } else {
    [...revealTargets, ...connectorTargets].forEach((target) => target.classList.add("is-visible"));
  }

  const sections = [...document.querySelectorAll("[data-section]")];
  const updateActiveNavigation = () => {
    const probe = window.scrollY + (header?.offsetHeight || 48) + 92;
    let current = sections[0];
    sections.forEach((section) => {
      if (section.offsetTop <= probe) current = section;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
    });
  };
  updateActiveNavigation();
  window.addEventListener("scroll", updateActiveNavigation, { passive: true });

  if (!reducedMotion.matches && !qaStatic) {
    const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
    const heroVisual = document.querySelector(".hero-visual");
    let ticking = false;
    const updateParallax = () => {
      const viewportCenter = window.innerHeight / 2;
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const offset = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewportCenter) / window.innerHeight));
        item.style.setProperty("--parallax-y", `${offset * -7}px`);
      });
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
    updateParallax();

    if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
      heroVisual.addEventListener("pointermove", (event) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
        heroVisual.style.setProperty("--hero-x", `${(x * 5).toFixed(2)}px`);
        heroVisual.style.setProperty("--hero-y", `${(y * 3).toFixed(2)}px`);
        heroVisual.style.setProperty("--effect-x", `${(x * -7).toFixed(2)}px`);
        heroVisual.style.setProperty("--effect-y", `${(y * -5).toFixed(2)}px`);
      }, { passive: true });
      heroVisual.addEventListener("pointerleave", () => {
        ["--hero-x", "--hero-y", "--effect-x", "--effect-y"].forEach((property) => heroVisual.style.setProperty(property, "0px"));
      });
    }
  }
})();
