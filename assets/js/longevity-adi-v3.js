(() => {
  const body = document.body;
  const sections = Array.from(document.querySelectorAll(".adi-scene"));
  const navLinks = Array.from(document.querySelectorAll("[data-adi-progress-nav] a"));
  const progressBar = document.querySelector("[data-adi-progress]");
  const backToTop = document.querySelector("[data-adi-back-top]");
  const header = document.querySelector(".adi-site-header");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  body.classList.add("adi-motion-ready");

  document.querySelectorAll(".adi-animate").forEach((item) => {
    item.style.setProperty("--adi-delay", item.dataset.delay || "0");
  });

  function revealAll() {
    document.querySelectorAll(".adi-animate").forEach((item) => item.classList.add("is-visible"));
  }

  function setupRevealMotion() {
    if (reducedMotion) {
      revealAll();
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      sections.forEach((section) => {
        const items = Array.from(section.querySelectorAll(".adi-animate"));
        if (!items.length) return;
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 22, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.82,
            stagger: 0.09,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              once: true
            },
            onStart: () => items.forEach((item) => item.classList.add("is-visible"))
          }
        );
      });
      return;
    }

    if (!("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll(".adi-animate").forEach((item) => item.classList.add("is-visible"));
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    sections.forEach((section) => revealObserver.observe(section));
  }

  function setupSceneObserver() {
    if (!("IntersectionObserver" in window)) {
      sections[0]?.classList.add("is-active");
      return;
    }

    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-active", entry.isIntersecting);
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "step");
          else link.removeAttribute("aria-current");
        });
      });
    }, { threshold: 0.48 });

    sections.forEach((section) => sceneObserver.observe(section));
  }

  function updatePageMotion() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? clamp(scrollTop / scrollable, 0, 1) : 0;

    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle("is-scrolled", scrollTop > 24);
    backToTop?.classList.toggle("is-visible", scrollTop > window.innerHeight * 0.7);

    if (reducedMotion || window.innerWidth <= 1180) return;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const local = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      section.style.setProperty("--parallax-y", `${((local - 0.5) * 24).toFixed(2)}px`);
    });
  }

  let ticking = false;
  function requestPageMotion() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updatePageMotion();
      ticking = false;
    });
  }

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      target.classList.add("is-active");
    });
  });

  setupRevealMotion();
  setupSceneObserver();
  updatePageMotion();

  window.addEventListener("scroll", requestPageMotion, { passive: true });
  window.addEventListener("resize", requestPageMotion);
})();
