(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("[data-sf-header]");
  const menuButton = document.querySelector(".sf-menu-toggle");
  const navigation = document.querySelector(".sf-nav");
  const navLinks = [...document.querySelectorAll(".sf-nav a[href^=\"#\"]")];
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  const parallaxItem = document.querySelector("[data-parallax]");
  const sensoryMap = document.querySelector("[data-sensory-map]");
  const sensoryCenter = document.querySelector("[data-sensory-center]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  let scrollFrame = 0;

  root.classList.remove("sf-no-js");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    if (window.innerWidth <= 1060) {
      navigation.setAttribute("aria-hidden", "true");
      navigation.inert = true;
    }
    main?.removeAttribute("inert");
    footer?.removeAttribute("inert");
    document.body.classList.remove("sf-menu-open");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(willOpen));
      menuButton.setAttribute("aria-label", willOpen ? "Close navigation menu" : "Open navigation menu");
      navigation.classList.toggle("is-open", willOpen);
      navigation.setAttribute("aria-hidden", String(!willOpen));
      navigation.inert = !willOpen;
      if (willOpen) {
        main?.setAttribute("inert", "");
        footer?.setAttribute("inert", "");
      } else {
        main?.removeAttribute("inert");
        footer?.removeAttribute("inert");
      }
      document.body.classList.toggle("sf-menu-open", willOpen);
      if (willOpen) navigation.querySelector("a")?.focus();
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (event) => {
      if (menuButton.getAttribute("aria-expanded") !== "true") return;
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [menuButton, ...navigation.querySelectorAll("a[href]")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1060) {
        closeMenu();
        navigation.removeAttribute("aria-hidden");
        navigation.inert = false;
      } else if (menuButton.getAttribute("aria-expanded") !== "true") {
        navigation.setAttribute("aria-hidden", "true");
        navigation.inert = true;
      }
    });

    if (window.innerWidth <= 1060) {
      navigation.setAttribute("aria-hidden", "true");
      navigation.inert = true;
    }
  }

  const reveal = () => {
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = String(Math.min(index % 4, 3) * 55) + "ms";
      observer.observe(item);
    });
  };

  const navTargets = new Set(navLinks.map((link) => link.getAttribute("href")?.slice(1)).filter(Boolean));
  const sections = [...document.querySelectorAll("main section[id]")].filter((section) => navTargets.has(section.id));

  const setActiveNavigation = () => {
    if (!sections.length) return;
    const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 270);
    let current = "";
    sections.forEach((section) => {
      if (section.offsetTop <= marker) current = section.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      current = "contact";
    }
    navLinks.forEach((link) => {
      const active = Boolean(current) && link.getAttribute("href") === "#" + current;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };

  const renderScrollState = () => {
    scrollFrame = 0;
    const y = window.scrollY;
    header?.classList.toggle("is-scrolled", y > 20);
    const showBackToTop = y > Math.max(620, window.innerHeight * 0.9);
    backToTop?.classList.toggle("is-visible", showBackToTop);
    if (backToTop) {
      backToTop.tabIndex = showBackToTop ? 0 : -1;
      backToTop.setAttribute("aria-hidden", String(!showBackToTop));
    }
    setActiveNavigation();

    if (parallaxItem && !reduceMotion.matches && window.innerWidth > 800) {
      const rect = parallaxItem.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (window.innerHeight * 0.5 - rect.top) / window.innerHeight));
      parallaxItem.style.setProperty("--sf-parallax-y", String((progress * 12).toFixed(2)) + "px");
    }
  };

  const requestScrollRender = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(renderScrollState);
  };

  window.addEventListener("scroll", requestScrollRender, { passive: true });
  window.addEventListener("resize", requestScrollRender, { passive: true });
  reduceMotion.addEventListener?.("change", requestScrollRender);

  if (sensoryMap && sensoryCenter) {
    const nodes = [...sensoryMap.querySelectorAll("[data-sense]")];
    nodes.forEach((node) => {
      node.setAttribute("aria-pressed", String(node.classList.contains("is-active")));
      node.setAttribute("aria-controls", sensoryCenter.id);
      const activate = () => {
        nodes.forEach((item) => {
          const active = item === node;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        sensoryCenter.textContent = node.dataset.sense || "A multisensory journey";
      };
      node.addEventListener("click", activate);
      node.addEventListener("focus", activate);
      node.addEventListener("pointerenter", activate);
    });
  }

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    main?.focus({ preventScroll: true });
  });

  reveal();
  renderScrollState();
})();
