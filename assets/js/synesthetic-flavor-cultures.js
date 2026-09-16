(() => {
  "use strict";

  const ready = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  ready(() => {
    const root = document.documentElement;
    root.classList.remove("sfc-no-js");
    root.classList.add("sfc-js");

    document.querySelectorAll('#site-footer-shell a[href="#"]').forEach((link) => {
      link.remove();
    });

    const header = document.querySelector("[data-sfc-header], .sfc-header, .site-header");
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const desktopMotion = window.matchMedia?.("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const revealItems = [...document.querySelectorAll("[data-reveal]")];
    const mapVisuals = [...document.querySelectorAll("[data-country-map], .country-map")];

    const setMotionPreference = () => {
      const reduced = Boolean(reduceMotion?.matches);
      root.classList.toggle("has-reduced-motion", reduced);
      root.toggleAttribute("data-reduced-motion", reduced);
      if (reduced) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
      }
    };

    setMotionPreference();
    reduceMotion?.addEventListener?.("change", setMotionPreference);

    const setStagger = (items, step) => {
      items.forEach((item, index) => {
        item.style.setProperty("--sfc-stagger-index", String(index));
        item.style.setProperty("--sfc-reveal-delay", `${index * step}ms`);
      });
    };

    const staggerGroups = (containerSelector, itemSelector, step) => {
      const containers = [...document.querySelectorAll(containerSelector)];
      if (containers.length) {
        containers.forEach((container) => setStagger([...container.querySelectorAll(itemSelector)], step));
        return;
      }

      const groups = new Map();
      document.querySelectorAll(itemSelector).forEach((item) => {
        const parent = item.parentElement;
        if (!parent) return;
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent).push(item);
      });
      groups.forEach((items) => setStagger(items, step));
    };

    staggerGroups(
      "[data-ingredient-list], .sfc-ingredient-row, .ingredient-row",
      "[data-ingredient], .sfc-ingredient, .ingredient-item",
      55
    );
    staggerGroups(
      "[data-comparison-grid], .sfc-comparison-grid, .culture-grid",
      "[data-culture-card], .sfc-culture-card, .culture-card",
      90
    );

    let headerFrame = 0;
    const updateHeader = () => {
      headerFrame = 0;
      if (!header) return;
      const compact = window.scrollY > 24;
      header.classList.toggle("is-scrolled", compact);
      header.classList.toggle("is-compact", compact);
    };
    const requestHeaderUpdate = () => {
      if (!headerFrame) headerFrame = window.requestAnimationFrame(updateHeader);
    };

    updateHeader();
    window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
    window.addEventListener("pageshow", requestHeaderUpdate);

    if (revealItems.length) {
      if (!("IntersectionObserver" in window) || reduceMotion?.matches) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
      } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
        revealItems.forEach((item) => revealObserver.observe(item));
      }
    }

    if (mapVisuals.length) {
      if (!("IntersectionObserver" in window)) {
        mapVisuals.forEach((map) => map.classList.add("is-active"));
      } else {
        const mapObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const active = entry.isIntersecting && entry.intersectionRatio >= 0.22;
            entry.target.classList.toggle("is-active", active);
            entry.target.closest("[data-country-section], .sfc-country, .country-section")
              ?.classList.toggle("is-visual-active", active);
          });
        }, { threshold: [0, 0.22, 0.5], rootMargin: "-8% 0px -12% 0px" });
        mapVisuals.forEach((map) => mapObserver.observe(map));
      }
    }

    const navLinks = [
      ...document.querySelectorAll(
        "[data-sfc-nav] a[href*='#'], .sfc-nav a[href*='#'], [data-culture-nav] a[href*='#']"
      )
    ];
    const sectionLinks = navLinks.map((link) => {
      let target = null;
      try {
        const url = new URL(link.href, window.location.href);
        if (url.pathname === window.location.pathname && url.hash.length > 1) {
          target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        }
      } catch (_) {
        target = null;
      }
      return target ? { link, target } : null;
    }).filter(Boolean);

    const setActiveLink = (activeTarget) => {
      sectionLinks.forEach(({ link, target }) => {
        const active = target === activeTarget;
        link.classList.toggle("is-active", active);
        link.parentElement?.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else if (link.getAttribute("aria-current") === "location") link.removeAttribute("aria-current");
      });
    };

    if (sectionLinks.length) {
      const initial = sectionLinks.find(({ target }) => `#${target.id}` === window.location.hash)
        || sectionLinks[0];
      setActiveLink(initial.target);

      if ("IntersectionObserver" in window) {
        const visibleSections = new Map();
        const navObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visibleSections.set(entry.target, entry.intersectionRatio);
            else visibleSections.delete(entry.target);
          });

          const active = [...visibleSections.entries()].sort((a, b) => {
            const ratioDifference = b[1] - a[1];
            if (Math.abs(ratioDifference) > 0.05) return ratioDifference;
            return Math.abs(a[0].getBoundingClientRect().top) - Math.abs(b[0].getBoundingClientRect().top);
          })[0]?.[0];
          if (active) setActiveLink(active);
        }, { threshold: [0.01, 0.25, 0.55], rootMargin: "-24% 0px -58% 0px" });

        [...new Set(sectionLinks.map(({ target }) => target))].forEach((section) => navObserver.observe(section));
      }
    }

    const hero = document.querySelector("[data-sfc-hero], .sfc-hero");
    const heroLayers = hero
      ? [...hero.querySelectorAll("[data-parallax], [data-hero-parallax]")]
      : [];
    const countryLayers = [...document.querySelectorAll(
      "[data-country-parallax], [data-country-section] [data-parallax], .sfc-country [data-parallax], .country-section [data-parallax]"
    )].filter((layer) => !hero?.contains(layer));
    let parallaxFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const motionEnabled = () => Boolean(desktopMotion?.matches && !reduceMotion?.matches);
    const resetParallax = () => {
      heroLayers.forEach((layer) => {
        layer.style.setProperty("--sfc-parallax-x", "0px");
        layer.style.setProperty("--sfc-parallax-y", "0px");
      });
      countryLayers.forEach((layer) => layer.style.setProperty("--sfc-parallax-y", "0px"));
      root.classList.remove("has-sfc-parallax");
    };
    const renderParallax = () => {
      parallaxFrame = 0;
      if (!motionEnabled()) {
        resetParallax();
        return;
      }

      root.classList.add("has-sfc-parallax");
      heroLayers.forEach((layer) => {
        const strength = Math.min(1.7, Math.max(0.35, Number(layer.dataset.parallaxStrength) || 1));
        layer.style.setProperty("--sfc-parallax-x", `${(pointerX * strength).toFixed(2)}px`);
        layer.style.setProperty("--sfc-parallax-y", `${(pointerY * strength).toFixed(2)}px`);
      });

      const viewportCenter = window.innerHeight / 2;
      countryLayers.forEach((layer) => {
        const bounds = layer.getBoundingClientRect();
        if (bounds.bottom < -80 || bounds.top > window.innerHeight + 80) return;
        const progress = Math.max(-1, Math.min(1, (bounds.top + bounds.height / 2 - viewportCenter) / window.innerHeight));
        const strength = Math.min(8, Math.max(2, Number(layer.dataset.parallaxStrength) || 6));
        layer.style.setProperty("--sfc-parallax-y", `${(-progress * strength).toFixed(2)}px`);
      });
    };
    const requestParallax = () => {
      if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(renderParallax);
    };

    hero?.addEventListener("pointermove", (event) => {
      if (!motionEnabled()) return;
      const bounds = hero.getBoundingClientRect();
      pointerX = Math.max(-6, Math.min(6, ((event.clientX - bounds.left) / bounds.width - 0.5) * 12));
      pointerY = Math.max(-6, Math.min(6, ((event.clientY - bounds.top) / bounds.height - 0.5) * 12));
      requestParallax();
    }, { passive: true });
    hero?.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      requestParallax();
    });

    window.addEventListener("scroll", requestParallax, { passive: true });
    window.addEventListener("resize", requestParallax, { passive: true });
    reduceMotion?.addEventListener?.("change", requestParallax);
    desktopMotion?.addEventListener?.("change", requestParallax);
    requestParallax();
  });
})();
