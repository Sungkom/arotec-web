(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const mobileNavigation = document.querySelector("[data-mobile-navigation]");
  const appearanceButton = document.querySelector("[data-appearance]");
  const integratedScroll = document.querySelector(".integrated-scroll");
  const navLinks = [...document.querySelectorAll('.eb-nav a[href^="#"], .mobile-navigation a[href^="#"]')];
  const sections = [...document.querySelectorAll("main > section[id]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeSectionId = "science";

  const setMenu = (open) => {
    if (!menuButton || !mobileNavigation) return;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mobileNavigation.hidden = !open;
    const icon = menuButton.querySelector("i");
    icon?.classList.toggle("ph-list", !open);
    icon?.classList.toggle("ph-x", open);
  };

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenu(false);
      setActiveLink(link.hash.slice(1));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || menuButton?.getAttribute("aria-expanded") !== "true") return;
    setMenu(false);
    menuButton.focus();
  });

  document.addEventListener("click", (event) => {
    if (!mobileNavigation || mobileNavigation.hidden) return;
    if (mobileNavigation.contains(event.target) || menuButton?.contains(event.target)) return;
    setMenu(false);
  });

  appearanceButton?.addEventListener("click", () => {
    const active = body.classList.toggle("ambient-bright");
    appearanceButton.setAttribute("aria-pressed", String(active));
  });

  integratedScroll?.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    integratedScroll.scrollBy({
      left: direction * Math.max(120, integratedScroll.clientWidth * 0.42),
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  });

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const setActiveLink = (id) => {
    activeSectionId = id;
    navLinks.forEach((link) => {
      const active = link.hash === `#${id}`;
      link.classList.toggle("active", active);
      const isMobileLink = Boolean(link.closest(".mobile-navigation"));
      const isCurrentNavigation = window.innerWidth <= 899 ? isMobileLink : !isMobileLink;
      if (active && isCurrentNavigation) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const hashId = window.location.hash.slice(1);
        const heroSubsection = visible.target.id === "science" && ["about", "research"].includes(hashId);
        setActiveLink(heroSubsection ? hashId : visible.target.id);
      }
    }, { rootMargin: "-15% 0px -62%", threshold: [0.08, 0.2, 0.45] });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    setActiveLink("science");
  }

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-order", String(index % 7));
  });

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    body.classList.add("js-reveal-ready");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px", threshold: 0.03 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const parallaxArt = document.querySelector("[data-parallax]");
  let frame = 0;
  const renderParallax = () => {
    frame = 0;
    if (!parallaxArt || reducedMotion.matches || window.innerWidth < 900) return;
    const offset = Math.max(-7, Math.min(10, window.scrollY * 0.018));
    parallaxArt.style.transform = `translate3d(0, ${offset}px, 0)`;
  };

  window.addEventListener("scroll", () => {
    if (frame) return;
    frame = window.requestAnimationFrame(renderParallax);
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 899) setMenu(false);
    setActiveLink(activeSectionId);
    renderParallax();
  });

  reducedMotion.addEventListener?.("change", renderParallax);
})();
