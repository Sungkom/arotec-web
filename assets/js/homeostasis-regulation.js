(() => {
  "use strict";

  const A = "../assets/";
  const I = `${A}homeostasis/icons/`;

  const researchDomains = [
    { title: "EXPOSOME", subtitle: "Internal & External Stressors", image: `${I}domain-exposome.png`, alt: "Exposome, pollution and external stressor research illustration", tooltip: "Maps environmental and internal exposures across the lifespan." },
    { title: "OLFACTORY SCIENCE", subtitle: "Sensory & Neural Processing", image: `${I}domain-olfactory.png`, alt: "Olfactory pathway from the nose to the brain", tooltip: "Explores how odor information is encoded and interpreted by the brain." },
    { title: "NEURO-SCENTED<br>THERAPY", subtitle: "Neuromodulation", image: `${I}domain-neuro-scented-therapy.png`, alt: "Botanical aroma and neural modulation illustration", tooltip: "Studies aroma-driven modulation of neural and physiological state." },
    { title: "CROSS-MODAL<br>NEUROSENSORY<br>INTERACTION", subtitle: "Functional Synthesis", image: `${I}domain-cross-modal.png`, alt: "Cross-modal senses and brain integration illustration", tooltip: "Connects smell, vision, hearing and somatic perception." },
    { title: "NEURO-SKIN CARE", subtitle: "Brain–Skin Axis", image: `${I}domain-neuro-skin-care.png`, alt: "Brain and skin neurocutaneous axis illustration", tooltip: "Examines bidirectional signaling between the brain and skin." },
    { title: "NEUROPLASTICITY", subtitle: "Brain Adaptation & Resilience", image: `${I}domain-neuroplasticity.png`, alt: "Neuron and synaptic plasticity illustration", tooltip: "Investigates how neural networks adapt, recover and learn." },
    { title: "NEURO PATHWAY<br>WITH STRESS", subtitle: "Stress Response System", image: `${I}domain-stress-pathway.png`, alt: "Brain, body and stress response pathway illustration", tooltip: "Traces HPA, autonomic and immune responses to stress." },
    { title: "NEURO FOLLICLE<br>BIOLOGY", subtitle: "Hair Homeostasis", image: `${I}domain-follicle-biology.png`, alt: "Hair follicle and cellular signaling illustration", tooltip: "Studies follicle cycling, signaling and tissue homeostasis." }
  ];

  const systemNetwork = [
    { area: "neuroendocrine", title: "NEUROENDOCRINE SYSTEM", items: ["Hormones", "Neuropeptides"], image: `${I}system-neuroendocrine.png`, alt: "Hormone and neuropeptide molecular structure" },
    { area: "autonomic", title: "AUTONOMIC NERVOUS SYSTEM", items: ["Sympathetic", "Parasympathetic", "Balance"], image: `${I}system-autonomic.png`, alt: "Autonomic nervous system neuron" },
    { area: "skin", title: "SKIN & HAIR SENSING", items: ["Neurosensory input", "Barrier & microbiome", "Follicle signaling"], image: `${I}system-skin-hair-sensing.png`, alt: "Skin and hair sensory cross-section" },
    { area: "immune", title: "IMMUNE SYSTEM", items: ["Cytokines", "PRRs / Danger signals"], image: `${I}system-immune.png`, alt: "Immune cells and cytokine signaling" },
    { area: "cellular", title: "CELLULAR HOMEOSTASIS", items: ["ROS/RNS balance", "DNA repair", "Autophagy"], image: `${I}system-cellular-homeostasis.png`, alt: "Cells maintaining internal balance" },
    { area: "metabolic", title: "METABOLIC SYSTEM", items: ["Glucose", "Lipids", "Amino acids", "Energy"], image: `${I}system-metabolic.png`, alt: "Mitochondrion and cellular energy metabolism" },
    { area: "redox", title: "REDOX /<br>OXIDATIVE BALANCE", items: ["Detox systems", "Antioxidant defense"], image: `${I}system-redox.png`, alt: "Reactive oxygen species and antioxidant balance" }
  ];

  const modulators = [
    ["Bio-responsive aroma & natural compounds", "homeostasis/icons/mod-aroma.png"],
    ["Nutrition & micronutrients", "homeostasis/icons/mod-nutrition.png"],
    ["Sleep & circadian health", "homeostasis/icons/mod-sleep.png"],
    ["Physical activity & movement", "homeostasis/icons/mod-physical-activity.png"],
    ["Stress management & mindfulness", "homeostasis/icons/mod-mindfulness.png"],
    ["Functional nutrients & adaptogens", "homeostasis/icons/mod-adaptogens.png"],
    ["Hydration & electrolyte balance", "homeostasis/icons/mod-hydration.png"]
  ];

  const allostatic = [
    ["Repeated / chronic stress", "homeostasis/icons/load-chronic-stress.png"],
    ["Environmental toxins & pollutants", "homeostasis/icons/load-pollutants.png"],
    ["Poor diet & unhealthy lifestyle", "homeostasis/icons/load-poor-diet.png"],
    ["Sleep disruption & circadian misalignment", "homeostasis/icons/load-sleep-disruption.png"],
    ["Chronic inflammation", "homeostasis/icons/load-inflammation.png"],
    ["Psychological stress & social strain", "homeostasis/icons/load-psychological-stress.png"],
    ["Aging & epigenetic dysregulation", "homeostasis/icons/load-aging-epigenetic.png"],
    ["Alcohol & substance use", "homeostasis/icons/load-substance-use.png"]
  ];

  const maintainedOutcomes = [
    { title: "BRAIN HEALTH", points: ["Clear cognition", "Emotional balance", "Neuroprotection"], image: "homeostasis/icons/outcome-brain-health.png", alt: "Healthy brain" },
    { title: "SKIN HEALTH", points: ["Strong barrier", "Hydration & elasticity", "Radiant & resilient skin"], image: "homeostasis/icons/outcome-skin-health.png", alt: "Healthy skin barrier" },
    { title: "HAIR HEALTH", points: ["Normal growth cycle", "Strong follicles & density", "Healthy pigmentation"], image: "homeostasis/icons/outcome-hair-health.png", alt: "Healthy hair follicle" },
    { title: "METABOLIC HEALTH", points: ["Efficient energy use", "Stable glucose & lipids", "Healthy weight"], image: "homeostasis/icons/outcome-metabolic-health.png", alt: "Healthy metabolism" },
    { title: "IMMUNE RESILIENCE", points: ["Balanced inflammation", "Strong host defense", "Lower infection risk"], image: "homeostasis/icons/outcome-immune-resilience.png", alt: "Resilient immune system" },
    { title: "HEALTHY AGING & VITALITY", points: ["Adaptability to stress", "Longevity & vitality", "Better quality of life"], image: "homeostasis/icons/outcome-healthy-aging.png", alt: "Healthy aging and vitality" }
  ];

  const disruptedOutcomes = [
    { title: "NEUROINFLAMMATION &<br>COGNITIVE DECLINE", points: ["Poor focus & memory", "Mood disruption", "Increased stress & brain fog"], image: "homeostasis/icons/outcome-neuroinflammation.png", alt: "Neuroinflammation and cognitive decline" },
    { title: "SKIN DYSFUNCTION", points: ["Barrier breakdown", "Dryness & sensitivity", "Inflammation & premature aging"], image: "homeostasis/icons/outcome-skin-dysfunction.png", alt: "Disrupted skin barrier" },
    { title: "HAIR DISORDERS", points: ["Hair loss & thinning", "Weak follicles", "Brittle or aging hair"], image: "homeostasis/icons/outcome-hair-disorders.png", alt: "Hair follicle disorder" },
    { title: "METABOLIC DYSREGULATION", points: ["Fatigue & low energy", "Poor glucose control", "Weight gain / imbalance"], image: "homeostasis/icons/outcome-metabolic-dysregulation.png", alt: "Metabolic dysregulation" },
    { title: "CHRONIC INFLAMMATION &<br>IMMUNE IMBALANCE", points: ["Persistent inflammation", "Weakened immunity", "Higher infection risk"], image: "homeostasis/icons/outcome-immune-imbalance.png", alt: "Chronic inflammation and immune imbalance" },
    { title: "ACCELERATED AGING &<br>FUNCTIONAL DECLINE", points: ["Lower resilience", "Slower recovery", "Reduced quality of life"], image: "homeostasis/icons/outcome-accelerated-aging.png", alt: "Accelerated aging and functional decline" }
  ];

  const renderDomains = () => {
    const target = document.querySelector("[data-domain-grid]");
    if (!target) return;
    target.innerHTML = researchDomains.map((item, index) => `
      <article class="domain-card reveal-item" tabindex="0" style="--card-delay:${index * 55}ms">
        <span class="domain-card__number">${index + 1}</span>
        <div class="domain-card__copy"><h3>${item.title}</h3><p>${item.subtitle}</p></div>
        <div class="domain-card__visual"><img src="${item.image}" alt="${item.alt}" width="320" height="190" loading="lazy" decoding="async"></div>
        <span class="domain-card__tooltip" role="tooltip">${item.tooltip}</span>
      </article>`).join("");
  };

  const renderSystems = () => {
    const target = document.querySelector("[data-system-grid]");
    if (!target) return;
    target.innerHTML = systemNetwork.map((item) => `
      <article class="system-card reveal-item" tabindex="0" data-area="${item.area}" data-network-node="${item.area}">
        <img src="${item.image}" alt="${item.alt}" width="108" height="108" loading="lazy" decoding="async">
        <div><h3>${item.title}</h3><ul>${item.items.map((point) => `<li>${point}</li>`).join("")}</ul></div>
      </article>`).join("");
  };

  const renderInfluenceList = (selector, entries) => {
    const target = document.querySelector(selector);
    if (!target) return;
    target.innerHTML = entries.map(([label, image]) => `<li><img src="${A}${image}" alt="" width="48" height="48" loading="lazy" decoding="async"><span>${label}</span></li>`).join("");
  };

  const renderOutcomes = (selector, items) => {
    const target = document.querySelector(selector);
    if (!target) return;
    target.innerHTML = items.map((item, index) => `
      <article class="outcome-card" tabindex="0" data-outcome-index="${index}">
        <span class="outcome-card__number">${index + 1}</span>
        <img src="${A}${item.image}" alt="${item.alt}" width="72" height="72" loading="lazy" decoding="async">
        <div><h4>${item.title}</h4><ul>${item.points.map((point) => `<li>${point}</li>`).join("")}</ul></div>
      </article>`).join("");
  };

  const initReveal = () => {
    document.documentElement.classList.add("js-reveal");
    const items = [...document.querySelectorAll(".reveal-item")];
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4%" });
    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 8, 5) * 45}ms`;
      observer.observe(item);
    });
  };

  const initHeader = () => {
    const header = document.querySelector("[data-header]");
    const progress = document.querySelector("[data-page-progress]");
    const menuButton = document.querySelector("[data-menu-button]");
    const mobileNav = document.querySelector("[data-mobile-nav]");
    const update = () => {
      const y = window.scrollY;
      header?.classList.toggle("is-scrolled", y > 24);
      const range = document.documentElement.scrollHeight - innerHeight;
      if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(1, y / range) : 0})`;
    };
    addEventListener("scroll", update, { passive: true });
    update();

    menuButton?.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      mobileNav?.classList.toggle("is-open", open);
    });
    mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
      mobileNav.classList.remove("is-open");
    }));
  };

  const initActiveNavigation = () => {
    const links = [...document.querySelectorAll("[data-section-link]")];
    const sections = links.map((link) => document.getElementById(link.dataset.sectionLink)).filter(Boolean);
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => link.classList.toggle("is-active", link.dataset.sectionLink === entry.target.id));
      });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  };

  const drawNetworkConnectors = () => {
    const stage = document.querySelector("[data-network-stage]");
    const center = document.querySelector("[data-network-center]");
    const svg = document.querySelector("[data-network-connectors]");
    const cards = [...document.querySelectorAll("[data-network-node]")];
    if (!stage || !center || !svg || innerWidth < 1280) return;
    const stageBox = stage.getBoundingClientRect();
    const centerBox = center.getBoundingClientRect();
    const cx = centerBox.left + centerBox.width / 2 - stageBox.left;
    const cy = centerBox.top + centerBox.height / 2 - stageBox.top;
    const centerRadius = centerBox.width / 2 + 13;
    const endpointGap = 13;
    svg.setAttribute("viewBox", `0 0 ${stageBox.width} ${stageBox.height}`);
    const definitions = `
      <defs>
        <marker id="networkArrowCyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#79d2ff"></path></marker>
        <marker id="networkArrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#ff6368"></path></marker>
      </defs>`;
    const cardByArea = new Map(cards.map((card) => [card.dataset.networkNode, card]));
    const markerFor = (areas) => areas.includes("redox") ? "networkArrowRed" : "networkArrowCyan";
    const makePath = (startX, startY, endX, endY, areas) => {
      const marker = markerFor(areas);
      return `<path d="M${startX.toFixed(1)} ${startY.toFixed(1)} L${endX.toFixed(1)} ${endY.toFixed(1)}" marker-start="url(#${marker})" marker-end="url(#${marker})" data-line="${areas.join(" ")}"></path>`;
    };
    const topPairs = [
      ["neuroendocrine", "autonomic"],
      ["autonomic", "skin"]
    ].map(([leftArea, rightArea]) => {
      const leftBox = cardByArea.get(leftArea).getBoundingClientRect();
      const rightBox = cardByArea.get(rightArea).getBoundingClientRect();
      const y = ((leftBox.top + leftBox.height / 2) + (rightBox.top + rightBox.height / 2)) / 2 - stageBox.top;
      return makePath(
        leftBox.right - stageBox.left + endpointGap,
        y,
        rightBox.left - stageBox.left - endpointGap,
        y,
        [leftArea, rightArea]
      );
    });
    const radialAreas = ["neuroendocrine", "skin", "immune", "cellular", "metabolic", "redox"];
    const radialPaths = radialAreas.map((area) => {
      const card = cardByArea.get(area);
      const box = card.getBoundingClientRect();
      const x = box.left + box.width / 2 - stageBox.left;
      const y = box.top + box.height / 2 - stageBox.top;
      const dx = cx - x;
      const dy = cy - y;
      const distance = Math.max(Math.hypot(dx, dy), 1);
      const edgeScale = 1 / Math.max(
        Math.abs(dx) / Math.max(box.width / 2 - 7, 1),
        Math.abs(dy) / Math.max(box.height / 2 - 7, 1)
      );
      const startX = x + dx * edgeScale + (dx / distance) * endpointGap;
      const startY = y + dy * edgeScale + (dy / distance) * endpointGap;
      const endX = cx - (dx / distance) * centerRadius;
      const endY = cy - (dy / distance) * centerRadius;
      return makePath(startX, startY, endX, endY, [area]);
    });
    svg.innerHTML = definitions + topPairs.join("") + radialPaths.join("");
  };

  const initNetworkInteraction = () => {
    const cards = [...document.querySelectorAll("[data-network-node]")];
    const setActive = (area) => {
      cards.forEach((card) => {
        const active = card.dataset.networkNode === area;
        card.classList.toggle("is-active", active);
        card.classList.toggle("is-muted", Boolean(area) && !active);
      });
      document.querySelectorAll("[data-line]").forEach((line) => {
        const connectedAreas = line.dataset.line.split(" ");
        line.classList.toggle("is-active", connectedAreas.includes(area));
      });
    };
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => setActive(card.dataset.networkNode));
      card.addEventListener("mouseleave", () => setActive(""));
      card.addEventListener("focus", () => setActive(card.dataset.networkNode));
      card.addEventListener("blur", () => setActive(""));
    });
  };

  const drawOutcomeConnectors = () => {
    const comparison = document.querySelector("[data-health-comparison]");
    const human = document.querySelector("[data-human-core]");
    const badge = human?.querySelector(".human-core__badge");
    const svg = document.querySelector("[data-outcome-connectors]");
    const leftCards = [...document.querySelectorAll("[data-maintained-list] .outcome-card")];
    const rightCards = [...document.querySelectorAll("[data-disrupted-list] .outcome-card")];
    if (!comparison || !human || !badge || !svg || innerWidth < 1280 || leftCards.length !== 6 || rightCards.length !== 6) {
      if (svg) svg.replaceChildren();
      return;
    }

    const comparisonBox = comparison.getBoundingClientRect();
    const humanBox = human.getBoundingClientRect();
    const badgeBox = badge.getBoundingClientRect();
    const stageLeft = comparisonBox.left;
    const stageTop = comparisonBox.top;
    const humanLeft = humanBox.left - stageLeft;
    const humanRight = humanBox.right - stageLeft;
    const badgeCenterX = badgeBox.left + badgeBox.width / 2 - stageLeft;
    const badgeCenterY = badgeBox.top + badgeBox.height / 2 - stageTop;
    const badgeRadius = badgeBox.width / 2 + 3;
    const verticalOffsets = [20, 11, 7, -8, -22, -17];
    const curveBends = [12, 8, 5, 2, -7, -12];
    const anatomyTargets = [.34, .20, null, null, null, .35];

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const badgeEdgeX = (side, y) => {
      const dy = clamp(y - badgeCenterY, -badgeRadius * .9, badgeRadius * .9);
      const dx = Math.sqrt(Math.max(0, badgeRadius ** 2 - dy ** 2));
      return badgeCenterX + (side === "left" ? -dx : dx);
    };
    const routeTarget = (side, index, cardY) => {
      let y = cardY + verticalOffsets[index];
      if (index === 4) y = Math.min(y, badgeCenterY + badgeRadius * .82);
      if (anatomyTargets[index] == null) return { x: badgeEdgeX(side, y), y };
      const factor = anatomyTargets[index];
      return {
        x: side === "left" ? humanLeft + humanBox.width * factor : humanRight - humanBox.width * factor,
        y
      };
    };
    const connectorPath = (startX, startY, endX, endY, bend = 0) => {
      const direction = Math.sign(endX - startX) || 1;
      const distance = Math.abs(endX - startX);
      const lead = clamp(distance * .38, 28, 82);
      const settle = clamp(distance * .33, 24, 74);
      return `M${startX.toFixed(1)} ${startY.toFixed(1)} C${(startX + direction * lead).toFixed(1)} ${(startY + bend).toFixed(1)} ${(endX - direction * settle).toFixed(1)} ${(endY - bend * .45).toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
    };
    const connectionMarkup = ({ side, index, d, startX, startY, endX, endY, marker }) => `
      <g class="signal-connection" data-outcome-connection="${side}" data-outcome-index="${index}" style="--signal-index:${index}">
        <path class="signal-glow" d="${d}"></path>
        <path class="signal-flow" d="${d}" marker-end="url(#${marker})"></path>
        <path class="signal-current" d="${d}"></path>
        <circle class="signal-node signal-node--source" cx="${startX.toFixed(1)}" cy="${startY.toFixed(1)}" r="4.2"></circle>
        <circle class="signal-node signal-node--target" cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="3.1"></circle>
      </g>`;

    svg.setAttribute("viewBox", `0 0 ${comparisonBox.width} ${comparisonBox.height}`);
    svg.setAttribute("preserveAspectRatio", "none");

    const definitions = `
      <defs>
        <marker id="outcomeArrowGreen" viewBox="0 0 12 12" refX="10.2" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 11 6 1 11Z"></path></marker>
        <marker id="outcomeArrowRed" viewBox="0 0 12 12" refX="10.2" refY="6" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1 11 6 1 11Z"></path></marker>
      </defs>`;
    const greenPaths = leftCards.map((card, index) => {
      const cardBox = card.getBoundingClientRect();
      const startX = cardBox.right - stageLeft - 1;
      const startY = cardBox.top + cardBox.height / 2 - stageTop;
      const target = routeTarget("left", index, startY);
      const d = connectorPath(target.x, target.y, startX, startY, -curveBends[index]);
      return connectionMarkup({ side: "maintained", index, d, startX: target.x, startY: target.y, endX: startX, endY: startY, marker: "outcomeArrowGreen" });
    }).join("");
    const redPaths = rightCards.map((card, index) => {
      const cardBox = card.getBoundingClientRect();
      const endX = cardBox.left - stageLeft + 1;
      const endY = cardBox.top + cardBox.height / 2 - stageTop;
      const target = routeTarget("right", index, endY);
      const d = connectorPath(target.x, target.y, endX, endY, -curveBends[index]);
      return connectionMarkup({ side: "disrupted", index, d, startX: target.x, startY: target.y, endX, endY, marker: "outcomeArrowRed" });
    }).join("");
    svg.innerHTML = `${definitions}<g class="signal-green">${greenPaths}</g><g class="signal-red">${redPaths}</g>`;
  };

  const initOutcomeInteraction = () => {
    const core = document.querySelector("[data-human-core]");
    const signals = document.querySelector("[data-outcome-connectors]");
    const positive = document.querySelectorAll("[data-maintained-list] .outcome-card");
    const negative = document.querySelectorAll("[data-disrupted-list] .outcome-card");
    const bind = (cards, tone, side) => cards.forEach((card) => {
      const lineSelector = `[data-outcome-connection="${side}"][data-outcome-index="${card.dataset.outcomeIndex}"]`;
      const activate = () => {
        core?.setAttribute("data-highlight", tone);
        signals?.classList.add("has-active");
        document.querySelector(lineSelector)?.classList.add("is-active");
      };
      const clear = () => {
        core?.removeAttribute("data-highlight");
        signals?.classList.remove("has-active");
        document.querySelector(lineSelector)?.classList.remove("is-active");
      };
      card.addEventListener("mouseenter", activate); card.addEventListener("mouseleave", clear);
      card.addEventListener("focus", activate); card.addEventListener("blur", clear);
    });
    bind(positive, "positive", "maintained"); bind(negative, "negative", "disrupted");
  };

  const initModal = () => {
    const modal = document.querySelector("[data-explore-modal]");
    const openers = [...document.querySelectorAll("[data-open-modal]")];
    const closer = document.querySelector("[data-close-modal]");
    let lastFocus = null;
    const open = () => {
      lastFocus = document.activeElement;
      modal?.showModal();
      closer?.focus();
    };
    const close = () => modal?.close();
    openers.forEach((button) => button.addEventListener("click", open));
    closer?.addEventListener("click", close);
    modal?.addEventListener("click", (event) => { if (event.target === modal) close(); });
    modal?.addEventListener("close", () => lastFocus?.focus());
    modal?.addEventListener("cancel", (event) => {
      event.preventDefault();
      close();
    });
    modal?.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...modal.querySelectorAll("button, a[href]")];
      const first = focusable[0]; const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    modal?.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  };

  renderDomains();
  renderSystems();
  renderInfluenceList("[data-modulator-list]", modulators);
  renderInfluenceList("[data-allostatic-list]", allostatic);
  renderOutcomes("[data-maintained-list]", maintainedOutcomes);
  renderOutcomes("[data-disrupted-list]", disruptedOutcomes);
  initHeader();
  initActiveNavigation();
  initModal();
  initReveal();
  requestAnimationFrame(() => {
    drawNetworkConnectors();
    drawOutcomeConnectors();
    initNetworkInteraction();
    initOutcomeInteraction();
  });
  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      drawNetworkConnectors();
      drawOutcomeConnectors();
    }, 120);
  }, { passive: true });
})();
