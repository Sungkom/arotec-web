(() => {
  const body = document.body;
  const progressBar = document.querySelector("[data-scroll-progress]");
  const revealItems = document.querySelectorAll(".reveal");
  const feedbackStage = document.querySelector("[data-feedback-stage]");
  const feedbackButtons = document.querySelectorAll("[data-feedback-mode]");
  const sadiInputs = document.querySelectorAll("[data-sadi-input]");
  const sadiOutput = document.querySelector("[data-sadi-output]");
  const scenarioButtons = document.querySelectorAll("[data-scenario]");
  const trajectoryVisual = document.querySelector("[data-trajectory-visual]");
  const languageSelect = document.getElementById("languageSelect");
  const languageChips = document.querySelectorAll("[data-lang-chip]");
  const searchResults = document.getElementById("searchResults");
  const searchInput = document.getElementById("searchInput");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  function updateScrollProgress() {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${clamp(progress, 0, 1)})`;
  }

  function revealImmediately() {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  function setupRevealObserver() {
    if (!revealItems.length) return;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealImmediately();
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
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 55}ms`;
      observer.observe(item);
    });
  }

  function setFeedbackMode(mode) {
    if (feedbackStage) {
      feedbackStage.dataset.feedbackStage = mode;
    }

    feedbackButtons.forEach((button) => {
      const isActive = button.dataset.feedbackMode === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setupFeedbackToggle() {
    if (!feedbackButtons.length) return;
    feedbackButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", () => setFeedbackMode(button.dataset.feedbackMode || "stress"));
    });
    setFeedbackMode(document.querySelector("[data-feedback-mode].is-active")?.dataset.feedbackMode || "stress");
  }

  function updateSadiMeter() {
    if (!sadiOutput || sadiInputs.length < 3) return;
    const values = Array.from(sadiInputs).map((input) => Number(input.value));
    const [exposureLoad, skinResilience, agingAmplification] = values;
    const score = clamp(((exposureLoad * agingAmplification) / Math.max(skinResilience, 1)) * 10, 8, 100);
    const bar = sadiOutput.querySelector("span");
    const label = sadiOutput.querySelector("strong");

    if (bar) {
      bar.style.width = `${score}%`;
      bar.style.background =
        score < 34
          ? "linear-gradient(90deg, #2f8a43, #0faaa7)"
          : score < 66
            ? "linear-gradient(90deg, #0faaa7, #e6a11a)"
            : "linear-gradient(90deg, #e67818, #d83a3a)";
    }

    if (label) {
      label.textContent = score < 34 ? "Resilient" : score < 66 ? "Adaptive" : "High Load";
    }
  }

  function setupSadiControls() {
    if (!sadiInputs.length) return;
    sadiInputs.forEach((input) => input.addEventListener("input", updateSadiMeter));
    updateSadiMeter();
  }

  function setTrajectoryScenario(scenario) {
    if (trajectoryVisual) {
      trajectoryVisual.dataset.scenario = scenario;
    }

    scenarioButtons.forEach((button) => {
      const isActive = button.dataset.scenario === scenario;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setupTrajectoryControls() {
    if (!scenarioButtons.length) return;
    scenarioButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
      button.addEventListener("click", () => setTrajectoryScenario(button.dataset.scenario || "healthy"));
    });
    setTrajectoryScenario(document.querySelector("[data-scenario].is-active")?.dataset.scenario || "healthy");
  }

  function renderSearchResults(query = "") {
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
      : "<p>No results yet. Try science, skin, SADI, ADI, or platform.</p>";
  }

  function setupHeaderControls() {
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
  }

  let ticking = false;
  function requestProgressUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      ticking = false;
    });
  }

  setupRevealObserver();
  setupFeedbackToggle();
  setupSadiControls();
  setupTrajectoryControls();
  setupHeaderControls();
  updateScrollProgress();

  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
})();
