(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const heroCards = [
    {
      number: "01",
      title: "External Exposome",
      items: [
        ["wave-sine", "Physical"],
        ["flask", "Chemical"],
        ["virus", "Biological"],
        ["buildings", "Built & Social"],
        ["atom", "Other Exposures"],
      ],
    },
    {
      number: "02",
      title: "Internal Exposome",
      items: [
        ["person-simple-run", "Lifestyle & Behavioral Factors"],
        ["dna", "Internal Biological State & Processes"],
      ],
    },
    {
      number: "03",
      title: "Exposure Dynamics",
      items: [
        ["chart-bar", "Intensity"],
        ["timer", "Duration"],
        ["wave-sine", "Frequency"],
        ["calendar-dots", "Timing"],
        ["atom", "Mixture"],
        ["stack", "Cumulative Exposure"],
      ],
    },
  ];

  const pathwaySteps = [
    ["person-simple-circle", "Personal Exposome"],
    ["pulse", "Biological Impact"],
    ["clock", "Aging Trajectory"],
    ["heart", "Health Outcomes"],
  ];

  const formulaTerms = [
    ["person-simple", "External Exposome"],
    ["dna", "Internal Exposome"],
    ["clock", "Exposure Dynamics"],
  ];

  const impactItems = [
    ["atom", "Oxidative Stress"],
    ["fire", "Inflammation"],
    ["shield-check", "Immune Response"],
    ["brain", "Neuroendocrine Changes"],
    ["arrows-clockwise", "Metabolic Dysregulation"],
    ["dna", "Epigenetic Alterations"],
  ];

  const outcomeItems = [
    ["person-simple-run", "Physical Function"],
    ["brain", "Cognitive Function"],
    ["smiley", "Emotional Wellbeing"],
    ["drop", "Metabolic Health"],
    ["sparkle", "Skin Health"],
    ["hourglass", "Longevity"],
  ];

  const frameworkRows = [
    {
      number: "01",
      title: "Exposure Sources",
      items: [["flask", "Chemical"], ["person-simple-run", "Physical"], ["virus", "Biological"], ["users-three", "Social"], ["heartbeat", "Lifestyle"]],
    },
    {
      number: "02",
      title: "Entry & Absorption",
      items: [["wind", "Inhalation"], ["fork-knife", "Ingestion"], ["hand", "Dermal"], ["eye", "Mucosal"], ["syringe", "Injection"]],
    },
    {
      number: "03",
      title: "Biological Effects",
      items: [
        ["brain", "Organ-Level Effects", ["brain", "wind", "heart", "fork-knife", "drop"]],
        ["atom", "Cellular & Molecular Effects", ["dna", "virus"]],
      ],
    },
    {
      number: "04",
      title: "Mechanistic Cascade",
      items: [["atom", "Molecular Perturbation"], ["pulse", "Cellular Stress & Damage"], ["fire", "Inflammatory Activation"], ["head-circuit", "Tissue Dysfunction & Adaptation"], ["buildings", "Organ System Dysfunction & Clinical Disease"]],
    },
    {
      number: "05",
      title: "Health Outcomes",
      items: [["heartbeat", "Acute Effects"], ["heart", "Chronic Disease"], ["person", "Developmental & Reproductive Effects"], ["virus", "Cancer"], ["users-three", "Reduced Quality of Life & Premature Mortality"]],
    },
    {
      number: "06",
      title: "Key Mechanisms",
      items: [["atom", "Oxidative Stress"], ["fire", "Inflammation"], ["dna", "DNA Damage"], ["head-circuit", "Endocrine Disruption"], ["shield", "Immune Dysregulation"], ["arrows-clockwise", "Metabolic Dysfunction"]],
    },
    {
      number: "07",
      title: "Prevention & Mitigation",
      items: [["arrow-down", "Reduce Exposure"], ["person-arms-spread", "Strengthen Resilience"], ["shield-check", "Protective Interventions"]],
    },
  ];

  const ebiiFactors = [
    {
      key: "E",
      title: "Exposome Load",
      color: "#27d8ff",
      icon: "factory",
      tooltip: "The total external and internal exposure burden accumulated across life.",
      description: "The totality of environmental exposures",
      items: ["Chemical", "Physical", "Biological", "Social", "Lifestyle", "Sensory"],
    },
    {
      key: "S",
      title: "Susceptibility",
      color: "#b47cff",
      icon: "dna",
      tooltip: "Intrinsic factors that influence how strongly an individual responds to exposure.",
      description: "Intrinsic factors that influence individual sensitivity",
      items: ["Genetics", "Epigenetics", "Age", "Biological Factors", "Health Status", "Comorbidities"],
    },
    {
      key: "R",
      title: "Resilience",
      color: "#66d96a",
      icon: "person-arms-spread",
      tooltip: "The body's capacity to adapt, repair, recover, and maintain biological stability.",
      description: "The capacity of the body to respond and adapt to exposures",
      items: ["Detoxification", "Immune Defense", "Repair Capacity", "Metabolic Health", "Recovery Capacity", "Psychosocial Buffer"],
    },
    {
      key: "T",
      title: "Time",
      color: "#ff7a32",
      icon: "clock",
      tooltip: "The temporal pattern, accumulation, and life-stage timing of exposure and response.",
      description: "The temporal dimension of exposure and biological response",
      items: ["Duration", "Frequency", "Timing", "Cumulative Burden", "Life Course Stage"],
    },
  ];

  const biologicalLevels = [
    ["atom", "Molecular Level"],
    ["virus", "Cellular Level"],
    ["wind", "Tissue / Organ Level"],
    ["person-simple", "Whole Body Level"],
    ["users-three", "Human Outcomes"],
  ];

  const higherDrivers = [
    ["timer", "Higher exposure intensity or duration"],
    ["stack", "Greater number and mixture of exposures"],
    ["dna", "Higher susceptibility / lower genetic & epigenetic protection"],
    ["shield", "Poorer detoxification and repair capacity"],
    ["heart", "Stress, poor sleep and unhealthy behaviors"],
  ];

  const lowerDrivers = [
    ["arrow-down", "Lower exposure and reduced toxicity"],
    ["shield-check", "Better detoxification and repair systems"],
    ["person-arms-spread", "Greater resilience and adaptive capacity"],
    ["leaf", "Healthy lifestyle and protective behaviors"],
    ["users-three", "Supportive social and built environments"],
  ];

  const icon = (name) => `<img class="ex-bio-icon" src="../assets/images/exposome-2026/icons-custom/${name}.png?v=20260818-custom-v2" width="512" height="512" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
  const query = (selector) => document.querySelector(selector);

  const heroCardsRoot = query("[data-hero-cards]");
  if (heroCardsRoot) {
    heroCardsRoot.innerHTML = heroCards.map((card) => `
      <article class="ex-hero-card ex-glass-panel">
        <header class="ex-card-heading">
          <span class="ex-card-number">${card.number}</span>
          <h3>${card.title}</h3>
        </header>
        <ul class="ex-card-list">
          ${card.items.map(([name, label]) => `<li>${icon(name)}<span>${label}</span></li>`).join("")}
        </ul>
      </article>
    `).join("");
  }

  const stepRail = query("[data-step-rail]");
  if (stepRail) {
    stepRail.innerHTML = pathwaySteps.map(([name, label]) => `<li>${icon(name)}<span>${label}</span></li>`).join("");
  }

  const flowFormula = query("[data-flow-formula]");
  if (flowFormula) {
    flowFormula.innerHTML = formulaTerms.map(([name, label], index) => {
      const term = `<div class="ex-formula-term">${icon(name)}<span>${label}</span></div>`;
      return index < formulaTerms.length - 1 ? `${term}<b class="ex-formula-times">&times;</b>` : term;
    }).join("");
  }

  const renderIconGrid = (items) => items.map(([name, label]) => `<div class="ex-flow-icon">${icon(name)}<span>${label}</span></div>`).join("");
  const flowImpact = query("[data-flow-impact]");
  const flowOutcomes = query("[data-flow-outcomes]");
  if (flowImpact) flowImpact.innerHTML = renderIconGrid(impactItems);
  if (flowOutcomes) flowOutcomes.innerHTML = renderIconGrid(outcomeItems);

  const frameworkRoot = query("[data-framework-list]");
  if (frameworkRoot) {
    frameworkRoot.innerHTML = frameworkRows.map((row) => `
      <article class="ex-framework-row">
        <div class="ex-framework-label"><b>${row.number}</b><span>${row.title}</span></div>
        <div class="ex-framework-items" style="--cols:${row.items.length}">
          ${row.items.map(([name, label, cluster]) => cluster
            ? `<div class="ex-framework-item ex-framework-group"><span>${label}</span><span class="ex-framework-icon-cluster">${cluster.map(icon).join("")}</span></div>`
            : `<div class="ex-framework-item">${icon(name)}<span>${label}</span></div>`
          ).join("")}
        </div>
      </article>
    `).join("");
  }

  const factorRoot = query("[data-factor-grid]");
  if (factorRoot) {
    factorRoot.innerHTML = ebiiFactors.map((factor) => `
      <article class="ex-factor-card" style="--factor:${factor.color}" tabindex="0" data-tooltip="${factor.tooltip}">
        <div class="ex-factor-title"><b>${factor.key}</b>&mdash; ${factor.title}</div>
        <p class="ex-factor-description">${factor.description}</p>
        <div class="ex-factor-icon">${icon(factor.icon)}</div>
        <ul>${factor.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        ${factor.key !== "T" ? `<span class="ex-factor-times" aria-hidden="true">&times;</span>` : ""}
        ${factor.key === "E" || factor.key === "T" ? `<span class="ex-factor-to-formula" aria-hidden="true">${icon("arrow-down")}</span>` : ""}
      </article>
    `).join("");
  }

  const levelsRoot = query("[data-levels]");
  if (levelsRoot) {
    levelsRoot.innerHTML = biologicalLevels.map(([name, label], index) => {
      const level = `<div class="ex-level-item">${icon(name)}<span>${label}</span></div>`;
      return index < biologicalLevels.length - 1 ? `${level}<span class="ex-level-arrow" aria-hidden="true">&rarr;</span>` : level;
    }).join("");
  }

  const renderDrivers = (items) => items.map(([name, label]) => `<li>${icon(name)}<span>${label}</span></li>`).join("");
  const higherRoot = query("[data-higher-drivers]");
  const lowerRoot = query("[data-lower-drivers]");
  if (higherRoot) higherRoot.innerHTML = renderDrivers(higherDrivers);
  if (lowerRoot) lowerRoot.innerHTML = renderDrivers(lowerDrivers);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = Array.from(document.querySelectorAll("[data-ex-section]"));
  const nav = query("[data-nav]");
  const navLinks = Array.from(nav?.querySelectorAll("a") || []);
  const header = query("[data-header]");
  const progress = query("[data-scroll-progress]");
  const backTop = query("[data-back-top]");
  const siteFooter = query(".aging-main-footer");
  const parallax = query("[data-parallax]");

  if (parallax) {
    for (let index = 0; index < 18; index += 1) {
      const node = document.createElement("span");
      node.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      node.style.setProperty("--y", `${8 + Math.random() * 82}%`);
      node.style.setProperty("--delay", `${Math.random() * -6}s`);
      node.style.setProperty("--size", `${2 + Math.random() * 3}px`);
      parallax.append(node);
    }
  }

  let ticking = false;
  const updateScrollState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, scrollTop / maxScroll));
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    header?.classList.toggle("is-scrolled", scrollTop > 24);
    backTop?.classList.toggle("is-visible", scrollTop > 720);
    if (backTop) {
      const footerTop = siteFooter?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      const footerVisible = footerTop < window.innerHeight;
      backTop.classList.toggle("is-above-footer", footerVisible);
      if (footerVisible) backTop.style.setProperty("--ex-back-bottom", `${Math.max(24, window.innerHeight - footerTop + 16)}px`);
      else backTop.style.removeProperty("--ex-back-bottom");
    }
    if (parallax && !reducedMotion) parallax.style.transform = `translate3d(0, ${Math.min(36, scrollTop * 0.025)}px, 0)`;

    const marker = scrollTop + window.innerHeight * 0.35;
    let active = "overview";
    sections.forEach((section) => {
      if (section.id && section.offsetTop <= marker) active = section.id;
    });
    navLinks.forEach((link) => {
      const isActive = link.hash === `#${active}` || (active === "comparison" && link.hash === "#ebii");
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollState);
  }, { passive: true });
  window.addEventListener("resize", updateScrollState);

  if (reducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    sections.forEach((section) => revealObserver.observe(section));
  }

  const menuToggle = query("[data-menu-toggle]");
  const closeMenu = (restoreFocus = false) => {
    if (!nav || !menuToggle) return;
    nav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.innerHTML = icon("list");
    if (restoreFocus) menuToggle.focus();
  };

  menuToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!nav) return;
    const opening = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", opening);
    menuToggle.setAttribute("aria-expanded", String(opening));
    menuToggle.setAttribute("aria-label", opening ? "Close navigation menu" : "Open navigation menu");
    menuToggle.innerHTML = icon(opening ? "x" : "list");
    if (opening) navLinks[0]?.focus();
  });

  navLinks.forEach((link) => link.addEventListener("click", () => closeMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav?.classList.contains("is-open")) closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!nav?.classList.contains("is-open")) return;
    if (nav.contains(event.target) || menuToggle?.contains(event.target)) return;
    closeMenu(false);
  });

  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));

  const chart = query("[data-ebii-chart]");
  let chartPlayed = false;
  const drawChart = (progressValue = 1) => {
    if (!chart) return;
    const rect = chart.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const width = Math.max(320, Math.round(rect.width));
    const height = Math.max(130, Math.round(rect.height));
    if (chart.width !== width * dpr || chart.height !== height * dpr) {
      chart.width = width * dpr;
      chart.height = height * dpr;
    }
    const context = chart.getContext("2d");
    if (!context) return;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const left = 49;
    const right = width - 104;
    const top = 13;
    const bottom = height - 27;
    context.strokeStyle = "rgba(126, 202, 255, 0.22)";
    context.lineWidth = 1;
    for (let index = 0; index <= 4; index += 1) {
      const y = top + ((bottom - top) / 4) * index;
      context.beginPath();
      context.moveTo(left, y);
      context.lineTo(right, y);
      context.stroke();
    }
    context.strokeStyle = "rgba(126, 202, 255, 0.7)";
    context.beginPath();
    context.moveTo(left, top);
    context.lineTo(left, bottom);
    context.lineTo(right, bottom);
    context.stroke();

    context.fillStyle = "#9eb2ca";
    context.font = "10px Inter, Segoe UI, sans-serif";
    context.fillText("High", 7, top + 4);
    context.fillText("Low", 13, bottom + 3);
    context.fillText("Time / Life Course", left + (right - left) * 0.32, height - 7);
    context.save();
    context.translate(12, top + (bottom - top) * 0.75);
    context.rotate(-Math.PI / 2);
    context.fillText("Biological Impact", 0, 0);
    context.restore();

    const curves = [
      { color: "#ff4338", height: 0.93, rate: 3.5 },
      { color: "#ffc13d", height: 0.64, rate: 2.8 },
      { color: "#66d96a", height: 0.36, rate: 2.1 },
    ];
    curves.forEach((curve) => {
      context.beginPath();
      context.setLineDash([7, 5]);
      context.lineWidth = 2;
      context.strokeStyle = curve.color;
      const steps = Math.max(2, Math.floor(90 * progressValue));
      for (let index = 0; index <= steps; index += 1) {
        const t = index / 90;
        const x = left + (right - left) * t;
        const normalized = (1 - Math.exp(-curve.rate * t)) / (1 - Math.exp(-curve.rate));
        const y = bottom - (bottom - top) * curve.height * normalized;
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      context.setLineDash([]);
    });
  };

  const playChart = () => {
    if (chartPlayed) return;
    chartPlayed = true;
    if (reducedMotion) {
      drawChart(1);
      return;
    }
    const start = performance.now();
    const duration = 1300;
    const frame = (now) => {
      const elapsed = Math.min(1, (now - start) / duration);
      drawChart(1 - Math.pow(1 - elapsed, 3));
      if (elapsed < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if (chart && "IntersectionObserver" in window) {
    const chartObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      playChart();
      observer.disconnect();
    }, { threshold: 0.3 });
    chartObserver.observe(chart);
  } else {
    playChart();
  }

  window.addEventListener("resize", () => {
    if (chartPlayed) drawChart(1);
  });

  updateScrollState();
})();
