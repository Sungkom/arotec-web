(() => {
  const body = document.body;
  const progressBar = document.querySelector("[data-scroll-progress]");
  const revealItems = document.querySelectorAll(".reveal");
  const languageSelect = document.getElementById("languageSelect");
  const languageChips = document.querySelectorAll("[data-lang-chip]");
  const searchResults = document.getElementById("searchResults");
  const searchInput = document.getElementById("searchInput");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const storySections = Array.from(document.querySelectorAll("main > section"));
  const storyMediaItems = Array.from(document.querySelectorAll([
    ".hero-visual",
    ".hero-media-panel",
    ".hero-nature-photo",
    ".image-moment-card",
    ".story-media-card",
    ".sticky-visual-panel",
    ".dimension-card",
    ".flow-card",
    ".effect-card",
    ".mechanism-card",
    ".pillar-card",
    ".comparison-panel",
    ".cascade-node",
    ".driver-card"
  ].join(",")));

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const searchItems = [
    { title: "Home", text: "Arotec science platform homepage", href: "../index.html" },
    { title: "Customized for you", text: "Personalized sensory science experience", href: "../index.html#customized" },
    { title: "Applied Solutions", text: "Sensory strategies and wellness applications", href: "../index.html#applied" },
    { title: "Applied Products", text: "Product platform and bioactive applications", href: "../index.html#products" },
    { title: "Science Platform", text: "Exposome, longevity, olfactory science and neuro-skin care", href: "../index.html#platform" },
    { title: "Exposome Science", text: "EBII and exposome biological impact", href: "exposome.html" },
    { title: "Human Longevity & Aging", text: "Skin-brain axis, SADI and ADI aging dynamics", href: "human-longevity-aging.html" },
    { title: "Get In touch", text: "Membership and enquiry form", href: "members.html" }
  ];

  const updateScrollProgress = () => {
    if (!progressBar) return;

    const scrollable =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${clamp(progress, 0, 1)})`;
  };

  const updateStoryMotion = () => {
    document.documentElement.classList.add("smooth-scroll-ready");
    body.classList.add("storytelling-ready", "story-motion-ready");
    if (reducedMotion) return;

    const viewportCenter = window.innerHeight * 0.52;
    const motionRange = window.innerHeight * 1.35;
    storySections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      section.classList.add("story-section-frame");
      section.dataset.storyIndex = String(index + 1).padStart(2, "0");
      section.classList.toggle("is-story-current", rect.top <= viewportCenter && rect.bottom >= viewportCenter);
      if (rect.bottom < -motionRange || rect.top > window.innerHeight + motionRange) return;

      const localProgress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      section.style.setProperty("--story-progress", localProgress.toFixed(4));
      section.style.setProperty("--story-shift", `${((localProgress - 0.5) * 38).toFixed(2)}px`);
      section.style.setProperty("--story-depth", (1 + localProgress * 0.016).toFixed(4));
    });

    storyMediaItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < -motionRange || rect.top > window.innerHeight + motionRange) return;

      const localProgress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
      item.classList.add("story-image-reveal");
      item.style.setProperty("--parallax-y", `${((localProgress - 0.5) * -28).toFixed(2)}px`);
      item.style.setProperty("--image-reveal-scale", (1.035 - localProgress * 0.024).toFixed(4));
    });
  };

  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const renderSearchResults = (query = "") => {
    if (!searchResults) return;

    const normalizedQuery = query.trim().toLowerCase();
    const matches = searchItems.filter((item) => {
      const haystack = `${item.title} ${item.text}`.toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });

    searchResults.innerHTML = matches.length
      ? matches
        .map((item) => `
          <a class="search-result" href="${item.href}">
            <strong>${item.title}</strong>
            <span>${item.text}</span>
          </a>
        `)
        .join("")
      : "<p>No results yet. Try science, EBII, exposome, or platform.</p>";
  };

  const setupHeaderControls = () => {
    const openMenu = () => body.classList.add("menu-open");
    const closeMenu = () => body.classList.remove("menu-open");
    const openSearch = () => {
      body.classList.add("search-open");
      renderSearchResults(searchInput?.value || "");
      window.setTimeout(() => searchInput?.focus(), 0);
    };
    const closeSearch = () => body.classList.remove("search-open");

    document.getElementById("menuToggle")?.addEventListener("click", openMenu);
    document.getElementById("menuClose")?.addEventListener("click", closeMenu);
    document.getElementById("mobileScrim")?.addEventListener("click", closeMenu);
    document.querySelectorAll(".mobile-nav .nav-link").forEach((link) => link.addEventListener("click", closeMenu));

    document.getElementById("searchButton")?.addEventListener("click", openSearch);
    document.getElementById("searchClose")?.addEventListener("click", closeSearch);
    searchInput?.addEventListener("input", (event) => renderSearchResults(event.target.value));
    document.getElementById("searchModal")?.addEventListener("click", (event) => {
      if (event.target.id === "searchModal") closeSearch();
    });

    const savedLanguage = localStorage.getItem("as-site-language");
    if (savedLanguage && languageSelect?.querySelector(`option[value="${savedLanguage}"]`)) {
      languageSelect.value = savedLanguage;
      languageChips.forEach((chip) => chip.classList.toggle("active", chip.dataset.langChip === savedLanguage));
    }

    const setLanguage = (lang) => {
      localStorage.setItem("as-site-language", lang);
      if (languageSelect) languageSelect.value = lang;
      languageChips.forEach((chip) => chip.classList.toggle("active", chip.dataset.langChip === lang));
    };

    languageSelect?.addEventListener("change", (event) => setLanguage(event.target.value));
    languageChips.forEach((chip) => chip.addEventListener("click", () => setLanguage(chip.dataset.langChip)));

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeMenu();
      closeSearch();
    });

    renderSearchResults();
  };

  setupHeaderControls();
  updateScrollProgress();
  updateStoryMotion();

  let scrollFrame = 0;
  const requestScrollUpdate = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrollProgress();
      if (!reducedMotion) updateStoryMotion();
    });
  };

  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate);
})();
