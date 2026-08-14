(() => {
  "use strict";

  const NST = "../assets/neuro-scented-therapy/";
  const ICONS = `${NST}icons/`;
  const icon = (name) => `${ICONS}${name}?v=20260814-icons-v2`;

  const icons = {
    aroma: icon("aroma.png"),
    molecule: icon("molecule.png"),
    olfactory: icon("olfactory.png"),
    brain: icon("brain.png"),
    endocrine: icon("endocrine.png"),
    autonomic: icon("autonomic.png"),
    neuron: icon("neuron.png"),
    immune: icon("immune.png"),
    immuneDysregulation: icon("immune-dysregulation.png"),
    psychological: icon("psychological.png"),
    metabolic: icon("metabolic.png"),
    sympathetic: icon("sympathetic.png"),
    parasympathetic: icon("parasympathetic.png"),
    skinCells: icon("skin-cells.png"),
    sensory: icon("sensory.png"),
    inflammation: icon("inflammation.png"),
    hair: icon("hair.png"),
    pigmentation: icon("pigmentation.png"),
    acne: icon("acne.png"),
    thermo: icon("thermo.png"),
    sleep: icon("sleep.png"),
    gut: icon("gut.png"),
    heart: icon("heart.png"),
    digestive: icon("digestive.png"),
    hormone: icon("hormone.png"),
    skin: icon("skin.png"),
    neuro: icon("neuro.png"),
  };

  const heroInputs = [
    { title: "Aroma Molecules", text: "Volatile compounds interact with sensory receptors", image: icons.molecule, alt: "Molecular interaction illustration" },
    { title: "Olfactory System", text: "Olfactory epithelium detects odorants and transmits signals", image: `${NST}olfactory-head.webp`, alt: "Olfactory pathway in a translucent head" },
    { title: "Dermal Entry", text: "Aroma compounds enter through skin and influence local pathways", image: `${NST}dermal-scanner.webp`, alt: "Skin cross-section with dermal activity" },
  ];

  const inputFlow = [
    { title: "Bio-Responsive Aroma Ingredients", text: "Natural aroma compounds", image: icons.aroma, alt: "Botanical aroma ingredients" },
    { title: "Odor Molecules", text: "Volatile molecules", image: icons.molecule, alt: "Odor molecule illustration" },
    { title: "Olfactory System", text: "Olfactory epithelium and bulb", image: icons.olfactory, alt: "Olfactory system illustration" },
    { title: "Olfactory–Brain Regulatory System", text: "Neural integration and regulation", image: icons.brain, alt: "Brain regulatory system" },
  ];

  const olfactoryAxes = [
    {
      color: "#35a8ff", title: "Neuroendocrine Axis", icon: icons.endocrine, alt: "Neuroendocrine pathway",
      steps: ["Hypothalamus (CRH)", "Pituitary gland", "Adrenal / gonadal gland", "Hormones & cytokines"],
      tooltip: "Olfactory input can engage hypothalamic and pituitary signaling that coordinates hormonal and cytokine responses."
    },
    {
      color: "#4ee6ac", title: "Autonomic Regulatory Axis (ANS Balance)", icon: icons.autonomic, alt: "Autonomic nervous system",
      steps: ["Hypothalamus / brainstem", "Autonomic nervous system", "SNS / PSNS balance"],
      tooltip: "Central integration influences sympathetic and parasympathetic tone, supporting balanced autonomic regulation."
    },
    {
      color: "#ffad45", title: "Neuromodulatory Axis (Neurotransmission)", icon: icons.neuron, alt: "Neural signaling",
      steps: ["Neuromodulatory brain nuclei", "5-HT, DA, NE, GABA, glutamate, ACh", "Neural & synaptic transmission"],
      tooltip: "Scent processing intersects with neurotransmitter networks involved in arousal, reward, mood and synaptic communication."
    },
    {
      color: "#aa75ff", title: "Neuroimmune Axis", icon: icons.immune, alt: "Immune cells",
      steps: ["Hypothalamic / autonomic pathways", "Cytokines: IL-1β, IL-6, TNF-α, IL-10", "T cell / B cell activity"],
      tooltip: "Neural and autonomic pathways communicate bidirectionally with cytokines and adaptive immune cells."
    },
    {
      color: "#ff6578", title: "Neurocognitive–Behavioral Axis", icon: icons.psychological, alt: "Cognitive and emotional regulation",
      steps: ["Limbic system", "Prefrontal cortex & related networks", "Cognition & emotional regulation"],
      tooltip: "Limbic and prefrontal circuits link odor perception to memory, attention, emotion and behavioral state."
    },
    {
      color: "#39e6ee", title: "Metabolic / Homeostatic Axis", icon: icons.metabolic, alt: "Metabolic regulation",
      steps: ["Hypothalamus / brainstem", "Metabolic & homeostatic regulation", "Energy, glucose, lipid & temperature balance"],
      tooltip: "Hypothalamic integration helps coordinate energy balance, glucose and lipid metabolism, and body temperature."
    },
  ];

  const olfactoryOutcomes = [
    { label: "Cognitive strength & memory", icon: icons.brain, alt: "Cognition", trend: "up" },
    { label: "Emotional stability & well-being", icon: icons.psychological, alt: "Emotional wellbeing", trend: "up" },
    { label: "Endocrine regulation", icon: icons.endocrine, alt: "Endocrine balance", trend: "up" },
    { label: "Stress & depression reduction", icon: icon("stress.png"), alt: "Stress response", trend: "down" },
    { label: "Autonomic balance", icon: icons.parasympathetic, alt: "Autonomic balance", trend: "up" },
    { label: "Immune homeostasis & inflammation control", icon: icons.immuneDysregulation, alt: "Immune homeostasis", trend: "up" },
    { label: "Metabolic efficiency & energy balance", icon: icons.metabolic, alt: "Metabolic efficiency", trend: "up" },
  ];

  const dermalEntry = [
    { title: "Bio-Responsive Aroma Ingredients", text: "Natural aroma compounds", icon: icons.aroma, alt: "Botanical aroma ingredients" },
    { title: "Skin Local Interface", text: "Cutaneous sensory nerves, keratinocytes, immune cells and local mediators", icon: icons.skinCells, alt: "Skin cells and local mediators" },
    { title: "Systemic Regulation", text: "ANS, vagus nerve, neuroendocrine and immune systems", icon: icons.autonomic, alt: "Systemic neural regulation" },
  ];

  const dermalAxes = [
    {
      color: "#35a8ff", title: "Brain / Hypothalamic–Metabolic Axis",
      steps: ["Hypothalamic–metabolic pathways", "HPA–cortisol / HPT / HPG axes", "Endocrine"],
      tooltip: "Cutaneous sensory afferents can connect dermal signaling to hypothalamic, metabolic and endocrine pathways."
    },
    {
      color: "#ff6578", title: "Local Cutaneous Mediator Axis",
      steps: ["Cytokines, chemokines & neuropeptides", "ACh and CRH–ACTH–cortisol", "Spinal nerve / local therapeutic action", "Cutaneous HPA axis"],
      tooltip: "Local skin mediators coordinate keratinocyte, nerve and immune activity before signals spread systemically."
    },
    {
      color: "#4ee6ac", title: "Systemic Neuro–Endocrine–Immune–Metabolic Axis",
      steps: ["Circulating hormones & immune mediators", "Microbiota metabolites & tryptophan signaling", "Systemic circulation", "Hepatic biotransformation"],
      tooltip: "Circulating endocrine, immune, microbial and metabolic mediators extend local dermal effects across organs."
    },
    {
      color: "#ffad45", title: "Autonomic / Thermoregulatory Axis",
      steps: ["Autonomic nervous system", "SNS", "PSNS", "PSNS (vagus)"],
      tooltip: "Autonomic pathways influence vascular tone, heat dissipation, thermoregulation and vagal balance."
    },
    {
      color: "#b073ff", title: "Enteric / Metabolic Axis",
      steps: ["Enteric nervous system", "Glucose transporters (GLUTs)", "Monocarboxylate transporters (MCTs)"],
      tooltip: "Enteric neural and transporter pathways link skin signaling with metabolic and gut-derived regulation."
    },
  ];

  const dermalOutcomes = [
    { label: "Acne", icon: icons.acne, alt: "Acne", trend: "down" },
    { label: "Hair growth & texture", icon: icons.hair, alt: "Hair growth", trend: "up" },
    { label: "Pigmentation", icon: icons.pigmentation, alt: "Pigmentation", trend: "down" },
    { label: "Stress", icon: icons.psychological, alt: "Stress", trend: "down" },
    { label: "Inflammation", icon: icons.inflammation, alt: "Inflammation", trend: "down" },
    { label: "Immune balance", icon: icons.immune, alt: "Immune balance", trend: "up" },
    { label: "Thermoregulation", icon: icons.thermo, alt: "Thermoregulation", trend: "up" },
    { label: "Metabolism", icon: icons.metabolic, alt: "Metabolism", trend: "up" },
  ];

  const olfactoryStages = [
    "Olfactory epithelium (odor detection)",
    "Olfactory bulb (signal processing)",
    "Olfactory tract",
    "Primary olfactory cortex (direct access to limbic and hypothalamic regions)",
  ];

  const systems = [
    { title: "Neuroendocrine System", icon: icons.endocrine, alt: "Neuroendocrine system", color: "#ef7a96", points: ["HPA axis", "Cortisol", "Hormonal balance"] },
    { title: "Autonomic Nervous System", icon: icons.autonomic, alt: "Autonomic nervous system", color: "#47b8ff", points: ["Sympathetic / parasympathetic", "HRV", "GI motility"] },
    { title: "Neurotransmitter System", icon: icons.neuron, alt: "Neurotransmitter network", color: "#7fa5ff", points: ["Serotonin", "GABA", "Dopamine", "Glutamate", "Acetylcholine"] },
    { title: "Immune–Inflammatory System", icon: icons.immune, alt: "Immune inflammatory system", color: "#a66bff", points: ["Cytokines", "Inflammation", "Immune balance"] },
    { title: "Metabolic System", icon: icons.metabolic, alt: "Metabolic system", color: "#9ee776", points: ["Glucose homeostasis", "Lipid metabolism", "Insulin sensitivity", "Energy balance"] },
    { title: "Circadian & Sleep Regulation", icon: icons.sleep, alt: "Circadian and sleep regulation", color: "#6687ff", points: ["Circadian rhythm", "Sleep quality", "Melatonin signaling", "Neuroendocrine timing"] },
    { title: "Gut–Brain Regulation", icon: icons.gut, alt: "Gut brain regulation", color: "#94b6d9", points: ["Vagal signaling", "Enteric balance", "Microbiota signaling", "Gut–brain axis"] },
  ];

  const diseases = [
    { title: "Metabolic Disorders", icon: icons.metabolic, alt: "Metabolic disorders", text: "e.g., obesity, diabetes, metabolic syndrome" },
    { title: "Hormonal Disorders", icon: icons.hormone, alt: "Hormonal disorders", text: "e.g., thyroid dysfunction, PCOS, menopause" },
    { title: "Neurocognitive Disorders", icon: icons.neuro, alt: "Neurocognitive disorders", text: "e.g., Alzheimer’s disease, dementia" },
    { title: "Cognitive Dysfunction", icon: icons.psychological, alt: "Cognitive dysfunction", text: "e.g., poor memory, executive dysfunction" },
    { title: "Sleep Disorders", icon: icons.sleep, alt: "Sleep disorders", text: "e.g., insomnia, poor sleep quality, circadian disruption" },
    { title: "Stress-Related Disorders", icon: icons.psychological, alt: "Stress-related disorders", text: "e.g., anxiety, depression, PTSD, burnout" },
    { title: "Cardiovascular Disorders", icon: icons.heart, alt: "Cardiovascular disorders", text: "e.g., hypertension, atherosclerosis, arrhythmia" },
    { title: "Inflammatory Disorders", icon: icons.inflammation, alt: "Inflammatory disorders", text: "e.g., arthritis, IBD, asthma, chronic inflammation" },
    { title: "Digestive Disorders", icon: icons.digestive, alt: "Digestive disorders", text: "e.g., IBS, dyspepsia, gastritis" },
    { title: "Immune Disorders", icon: icons.immuneDysregulation, alt: "Immune disorders", text: "e.g., autoimmunity, immunodeficiency, allergic disease" },
    { title: "Skin Disorders", icon: icons.skin, alt: "Skin disorders", text: "e.g., atopic dermatitis, acne, rosacea" },
  ];

  const connector = () => `
    <svg class="nst-step-link" viewBox="0 0 16 12" aria-hidden="true" focusable="false">
      <path d="M1 6H12"></path><polygon points="11,2 16,6 11,10"></polygon>
    </svg>`;

  const flowArrow = () => `
    <svg class="nst-flow-arrow" viewBox="0 0 28 16" aria-hidden="true" focusable="false">
      <path d="M1 8H22"></path><polygon points="20,3 28,8 20,13"></polygon>
    </svg>`;

  const trendArrow = (trend) => trend === "up"
    ? `<svg class="nst-trend-svg nst-trend-up" viewBox="0 0 18 32" aria-hidden="true"><path d="M9 29V7"></path><polygon points="3,9 9,1 15,9"></polygon></svg>`
    : `<svg class="nst-trend-svg nst-trend-down" viewBox="0 0 18 32" aria-hidden="true"><path d="M9 3V25"></path><polygon points="3,23 9,31 15,23"></polygon></svg>`;

  const renderMiniCards = () => heroInputs.map((item) => `
    <article class="nst-mini-card">
      <h3>${item.title}</h3><p>${item.text}</p>
      <img src="${item.image}" alt="${item.alt}" decoding="async">
    </article>`).join("");

  const renderInputFlow = () => inputFlow.map((item) => `
    <article class="nst-flow-card">
      <img src="${item.image}" alt="${item.alt}" loading="lazy" decoding="async">
      <div><h3>${item.title}</h3><p>${item.text}</p></div>
      ${flowArrow()}
    </article>`).join("");

  const renderOlfactoryAxes = () => olfactoryAxes.map((axis, index) => {
    const tooltipId = `olfactory-axis-tooltip-${index + 1}`;
    return `
      <article class="nst-axis-card" style="--axis-color:${axis.color}" tabindex="0" aria-describedby="${tooltipId}">
        <div class="nst-axis-intro"><span class="nst-axis-number">${index + 1}</span><img class="nst-axis-icon" src="${axis.icon}" alt="${axis.alt}" loading="lazy"></div>
        <h3 class="nst-axis-title">${axis.title}</h3>
        <div class="nst-axis-steps">${axis.steps.map((step, stepIndex) => `<span class="nst-step">${step}</span>${stepIndex < axis.steps.length - 1 ? connector() : ""}`).join("")}</div>
        <span class="nst-tooltip" id="${tooltipId}" role="tooltip">${axis.tooltip}</span>
      </article>`;
  }).join("");

  const renderOutcomes = (items) => items.map((item) => `
    <article class="nst-outcome-item">
      <img src="${item.icon}" alt="${item.alt}" loading="lazy" decoding="async">
      <p>${item.label}</p>
      <span aria-label="${item.trend === "up" ? "Increases" : "Decreases"}">${trendArrow(item.trend)}</span>
    </article>`).join("");

  const renderDermalEntry = () => dermalEntry.map((item) => `
    <article class="nst-entry-card">
      <h3>${item.title}</h3><p>${item.text}</p>
      <img src="${item.icon}" alt="${item.alt}" loading="lazy" decoding="async">
    </article>`).join("");

  const renderDermalAxes = () => dermalAxes.map((axis, index) => {
    const tooltipId = `dermal-axis-tooltip-${index + 1}`;
    return `
      <article class="nst-dermal-axis" style="--axis-color:${axis.color}" tabindex="0" aria-describedby="${tooltipId}">
        <span class="nst-axis-number">${index + 1}</span>
        <h3>${axis.title}</h3>
        <div class="nst-dermal-flow">${axis.steps.map((step, stepIndex) => `<span class="nst-step">${step}</span>${stepIndex < axis.steps.length - 1 ? connector() : ""}`).join("")}</div>
        <span class="nst-tooltip" id="${tooltipId}" role="tooltip">${axis.tooltip}</span>
      </article>`;
  }).join("");

  const renderOlfactoryStages = () => olfactoryStages.map((stage) => `<div class="nst-stage-flow">${stage}</div>`).join("");

  const renderSystems = () => systems.map((system, index) => {
    const tooltipId = `system-tooltip-${index + 1}`;
    return `
      <article class="nst-system-card" style="--axis-color:${system.color}" tabindex="0" aria-describedby="${tooltipId}">
        <h4>${system.title}</h4>
        <img src="${system.icon}" alt="${system.alt}" loading="lazy" decoding="async">
        <ul>${system.points.map((point) => `<li>${point}</li>`).join("")}</ul>
        <span class="nst-tooltip" id="${tooltipId}" role="tooltip">${system.points.join(" · ")}</span>
      </article>`;
  }).join("");

  const renderDiseases = () => diseases.map((disease) => `
    <article class="nst-disease-card" tabindex="0">
      <h3>${disease.title}</h3>
      <img src="${disease.icon}" alt="${disease.alt}" loading="lazy" decoding="async">
      <p>${disease.text}</p>
    </article>`).join("");

  const render = (selector, html) => {
    const target = document.querySelector(selector);
    if (target) target.innerHTML = html;
  };

  render("[data-hero-inputs]", renderMiniCards());
  render("[data-input-flow]", renderInputFlow());
  render("[data-olfactory-axes]", renderOlfactoryAxes());
  render("[data-olfactory-outcomes]", renderOutcomes(olfactoryOutcomes));
  render("[data-dermal-entry-flow]", renderDermalEntry());
  render("[data-dermal-axes]", renderDermalAxes());
  render("[data-dermal-outcomes]", renderOutcomes(dermalOutcomes));
  render("[data-olfactory-stages]", renderOlfactoryStages());
  render("[data-system-grid]", renderSystems());
  render("[data-disease-grid]", renderDiseases());

  const header = document.querySelector("[data-header]");
  const progress = document.querySelector("[data-scroll-progress]");
  const backTop = document.querySelector("[data-back-top]");
  const updateScrollState = () => {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (progress) progress.style.transform = `scaleX(${Math.min(1, y / max)})`;
    if (backTop) backTop.classList.toggle("is-visible", y > 700);
  };
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  const menuButton = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    nav?.classList.toggle("is-open", open);
  });

  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const dialog = document.querySelector("[data-pathway-dialog]");
  document.querySelector("[data-open-pathways]")?.addEventListener("click", () => {
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
      dialog.querySelector("button")?.focus();
    }
  });
  dialog?.querySelectorAll("[data-dialog-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.dialogTarget || "");
      dialog.close();
      target?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog?.open) {
      event.preventDefault();
      dialog.close();
    }
  });

  backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));

  const shellFooter = document.querySelector(".aging-main-footer");
  if (backTop && shellFooter && "IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver((entries) => {
      backTop.classList.toggle("is-footer-near", entries.some((entry) => entry.isIntersecting));
    }, { threshold: 0.01 });
    footerObserver.observe(shellFooter);
  }

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion && matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll([
      ".nst-mini-card",
      ".nst-flow-card",
      ".nst-axis-card",
      ".nst-entry-card",
      ".nst-dermal-axis",
      ".nst-stage-card",
      ".nst-system-card",
      ".nst-disease-card",
    ].join(",")).forEach((card) => {
      card.classList.add("nst-tilt-card");
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty("--rx", `${(-y * 2.2).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${(x * 2.8).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  const revealItems = document.querySelectorAll(".nst-reveal");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4%" });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const navLinks = [...document.querySelectorAll("[data-nav-link]")];
  const linkById = new Map(navLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.remove("is-active"));
    linkById.get(visible.target.id)?.classList.add("is-active");
  }, { threshold: [0.2, 0.45, 0.7], rootMargin: "-18% 0px -60%" });
  document.querySelectorAll("[data-section]").forEach((section) => sectionObserver.observe(section));
})();
