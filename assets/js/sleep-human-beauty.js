(() => {
  "use strict";

  const ART_BASE = "../assets/sleep-human-beauty/icons/";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const qaMode = new URLSearchParams(window.location.search).has("qa");

  if (qaMode) document.documentElement.classList.add("shb-qa");

  /**
   * @typedef {Readonly<{
   *   label: string,
   *   icon: string | readonly string[],
   *   meta?: string,
   *   image?: string,
   *   imageWidth?: number,
   *   imageHeight?: number
   * }>} IconDatum
   */

  /**
   * @typedef {Readonly<{
   *   number: number,
   *   title: string,
   *   image: string,
   *   imageWidth: number,
   *   imageHeight: number,
   *   alt: string,
   *   items: readonly string[]
   * }>} EffectDatum
   */

  /**
   * @typedef {Readonly<{
   *   title: string,
   *   image: string,
   *   imageWidth: number,
   *   imageHeight: number,
   *   alt: string,
   *   items: readonly string[]
   * }>} HubDatum
   */

  /**
   * @typedef {Readonly<{
   *   number: number,
   *   title: string,
   *   meta?: string,
   *   image: string,
   *   imageWidth: number,
   *   imageHeight: number,
   *   alt: string,
   *   items: readonly string[]
   * }>} AxisDatum
   */

  const freezeData = (items) => Object.freeze(items.map((item) => Object.freeze({
    ...item,
    ...(Array.isArray(item.icon) ? { icon: Object.freeze([...item.icon]) } : {}),
    ...(Array.isArray(item.items) ? { items: Object.freeze([...item.items]) } : {}),
  })));

  /** @type {readonly IconDatum[]} */
  const hairDrivers = freezeData([
    { label: "Melatonin rhythm", icon: ["ph-moon-stars", "ph-clock"], image: "section01/driver-melatonin.webp", imageWidth: 94, imageHeight: 77 },
    { label: "Neurotransmitter balance", icon: "ph-brain", image: "section01/driver-neurotransmitter.webp", imageWidth: 84, imageHeight: 77 },
    { label: "ANS balance", meta: "(PNS ↑)", icon: "ph-scales", image: "section01/driver-ans.webp", imageWidth: 101, imageHeight: 77 },
    { label: "Anti-inflammatory adaptation", icon: "ph-shield-plus", image: "section01/driver-anti-inflammatory.webp", imageWidth: 103, imageHeight: 77 },
    { label: "Antioxidant & mitochondrial support", icon: "ph-atom", image: "section01/driver-mitochondrial.webp", imageWidth: 102, imageHeight: 77 },
    { label: "Stress reduction", meta: "(cortisol ↓)", icon: ["ph-head-circuit", "ph-trend-down"], image: "section01/driver-stress-reduction.webp", imageWidth: 105, imageHeight: 77 },
    { label: "Growth & repair signaling", meta: "(BDNF, IGF-1)", icon: ["ph-brain", "ph-trend-up"], image: "section01/driver-growth-repair.webp", imageWidth: 139, imageHeight: 77 },
  ]);

  /** @type {readonly EffectDatum[]} */
  const hairEffects = freezeData([
    {
      number: 1,
      title: "Hair Follicle Cycling Regulation",
      image: "hair-follicle-cycle.webp",
      imageWidth: 264,
      imageHeight: 312,
      alt: "Skin cross-section showing a large hair follicle and its growth cycle",
      items: [
        "Anagen support",
        "Balanced catagen–telogen transition",
        "Matrix-cell activity",
        "Follicular energy metabolism",
      ],
    },
    {
      number: 2,
      title: "Dermal Papilla & Stem-Cell Support",
      image: "dermal-papilla.webp",
      imageWidth: 210,
      imageHeight: 309,
      alt: "Close-up cross-section of a hair follicle bulb and dermal papilla",
      items: [
        "IGF-1 / VEGF signaling",
        "Dermal papilla activation",
        "Stem-cell niche support",
        "Follicular regeneration readiness",
      ],
    },
    {
      number: 3,
      title: "Scalp Microenvironment Homeostasis",
      image: "scalp-microenvironment.webp",
      imageWidth: 243,
      imageHeight: 309,
      alt: "Scalp cross-section showing follicles, barrier, microbes, vessels, and sebaceous structures",
      items: [
        "Scalp barrier integrity",
        "Microbiome stability",
        "Reduced perifollicular inflammation",
        "Mild pH & sebum balance",
      ],
    },
    {
      number: 4,
      title: "Hair Fiber & Pigment Maintenance",
      image: "hair-fiber-pigment.webp",
      imageWidth: 246,
      imageHeight: 291,
      alt: "Hair-fiber cuticle cross-section with pigment and melanin structures",
      items: [
        "Hair fiber strength",
        "Cuticle integrity",
        "Oxidative damage ↓",
        "Melanocyte / melanin support",
        "Healthy hair aging",
      ],
    },
  ]);

  /** @type {readonly IconDatum[]} */
  const modulators = freezeData([
    { label: "Autonomic balance", icon: "ph-scales", image: "section01/mod-autonomic.webp", imageWidth: 48, imageHeight: 40 },
    { label: "Affective resilience", icon: "ph-heart", image: "section01/mod-affective.webp", imageWidth: 48, imageHeight: 40 },
    { label: "Central stress buffering", icon: "ph-brain", image: "section01/mod-stress.webp", imageWidth: 48, imageHeight: 42 },
    { label: "Sensory / recovery support", icon: "ph-ear", image: "section01/mod-sensory.webp", imageWidth: 48, imageHeight: 43 },
  ]);

  /** @type {readonly IconDatum[]} */
  const hairOutcomes = freezeData([
    { label: "Stable hair growth", icon: "ph-trend-up", image: "section01/outcome-stable-growth.webp", imageWidth: 71, imageHeight: 54 },
    { label: "Reduced shedding susceptibility", icon: "ph-shield-check", image: "section01/outcome-reduced-shedding.webp", imageWidth: 75, imageHeight: 54 },
    { label: "Improved hair density appearance", icon: "ph-waves", image: "section01/outcome-density.webp", imageWidth: 78, imageHeight: 53 },
    { label: "Stronger hair fiber quality & shine", icon: "ph-sparkle", image: "section01/outcome-fiber-shine.webp", imageWidth: 70, imageHeight: 54 },
    { label: "Healthy scalp", icon: "ph-shield-plus", image: "section01/outcome-healthy-scalp.webp", imageWidth: 68, imageHeight: 54 },
    { label: "Slower hair aging", meta: "(gray hair / thinning)", icon: "ph-clock", image: "section01/outcome-slower-aging.webp", imageWidth: 71, imageHeight: 54 },
  ]);

  /** @type {readonly IconDatum[]} */
  const recoverySupports = freezeData([
    { label: "Sleep quality stabilization", icon: "ph-moon-stars", image: "section01/support-sleep.webp", imageWidth: 58, imageHeight: 50 },
    { label: "Nutrition", icon: "ph-bowl-food", image: "section01/support-nutrition.webp", imageWidth: 53, imageHeight: 49 },
    { label: "Circadian alignment", icon: "ph-clock", image: "section01/support-circadian.webp", imageWidth: 62, imageHeight: 51 },
    { label: "Stress regulation", icon: "ph-person-simple-tai-chi", image: "section01/support-stress.webp", imageWidth: 58, imageHeight: 49 },
    { label: "Behavioral recovery", icon: "ph-person-simple-run", image: "section01/support-behavioral.webp", imageWidth: 57, imageHeight: 47 },
    { label: "Supportive environment", icon: "ph-house-line", image: "section01/support-environment.webp", imageWidth: 75, imageHeight: 47 },
  ]);

  /** @type {readonly IconDatum[]} */
  const sleepInputs = freezeData([
    { label: "Sleep duration", icon: "ph-clock" },
    { label: "Sleep continuity & efficiency", icon: "ph-shield-check" },
    { label: "NREM–REM balance", icon: "ph-brain" },
    { label: "Circadian alignment", icon: "ph-timer" },
    { label: "Sleep disorders & disturbances", icon: "ph-bed" },
  ]);

  const primarySignals = Object.freeze([
    "Melatonin rhythm",
    "Cortisol rhythmicity",
    "Autonomic balance",
    "Immune modulation",
    "Oxidative stress control",
    "Metabolic regulation",
    "Neurotransmitter modulation",
  ]);

  /** @type {readonly HubDatum[]} */
  const hubCards = freezeData([
    {
      title: "A. Neurotransmitters",
      image: "hub-neurotransmitters.webp",
      imageWidth: 177,
      imageHeight: 129,
      alt: "Purple brain representing central neurotransmitters",
      items: [
        "Serotonin (5-HT)",
        "Norepinephrine (NE)",
        "Acetylcholine (ACh)",
        "Dopamine (DA)",
        "GABA",
        "Glutamate balance",
        "Endocannabinoid-related calming pathways",
      ],
    },
    {
      title: "B. Neuroendocrine Axes",
      image: "hub-neuroendocrine.webp",
      imageWidth: 165,
      imageHeight: 135,
      alt: "Brain and pituitary illustration representing neuroendocrine axes",
      items: [
        "HPA axis",
        "Sympathetic–parasympathetic balance",
        "Melatonin rhythm",
        "HPT / HPG axes (optional)",
      ],
    },
    {
      title: "C. Neurotrophic Signals",
      image: "hub-neurotrophic.webp",
      imageWidth: 291,
      imageHeight: 195,
      alt: "Glowing neuron representing neurotrophic signals",
      items: ["BDNF", "IGF-1", "VEGF"],
    },
  ]);

  /** @type {readonly IconDatum[]} */
  const sensoryInputs = freezeData([
    { label: "Sensory context", icon: ["ph-eye", "ph-ear"] },
    { label: "Affective valence", icon: "ph-heart" },
    { label: "Autonomic modulation", icon: "ph-heartbeat" },
    { label: "Stress-buffering inputs", icon: "ph-shield" },
  ]);

  /** @type {readonly AxisDatum[]} */
  const beautyAxis = freezeData([
    {
      number: 1,
      title: "Skin",
      meta: "(Epidermis & Dermis)",
      image: "axis-skin.webp",
      imageWidth: 309,
      imageHeight: 264,
      alt: "Detailed cross-section of the epidermis and dermis",
      items: [
        "Barrier integrity",
        "Hydration & elasticity",
        "Repair & regeneration",
        "Microbiome balance",
        "Inflammation control",
      ],
    },
    {
      number: 2,
      title: "Scalp",
      meta: "(Microenvironment)",
      image: "axis-scalp.webp",
      imageWidth: 345,
      imageHeight: 279,
      alt: "Scalp cross-section with multiple hair follicles",
      items: [
        "Barrier & sebum balance",
        "Microcirculation",
        "Immune & inflammatory homeostasis",
        "Microbiome ecology",
        "Oxidative balance",
      ],
    },
    {
      number: 3,
      title: "Hair Follicle",
      image: "axis-hair-follicle.webp",
      imageWidth: 282,
      imageHeight: 279,
      alt: "Large detailed cross-section of a hair follicle",
      items: [
        "Follicle cycling balance (anagen support)",
        "Matrix cell activity",
        "Nutrient & oxygen supply",
        "Structural protein synthesis",
        "Oxidative protection",
      ],
    },
  ]);

  /** @type {readonly IconDatum[]} */
  const sharedOutcomes = freezeData([
    { label: "Reduced stress burden", icon: "ph-brain" },
    { label: "Improved repair readiness", icon: "ph-shield-plus" },
    { label: "Stronger skin barrier", icon: "ph-shield-check" },
    { label: "Healthier scalp environment", icon: "ph-sparkle" },
    { label: "Stable hair cycle / healthy hair growth", icon: "ph-arrows-clockwise" },
    { label: "Radiance & healthy appearance", icon: "ph-sun-horizon" },
  ]);

  /** @type {readonly IconDatum[]} */
  const skinDrivers = freezeData([
    { label: "Melatonin rhythm", icon: "ph-moon-stars" },
    { label: "Cortisol rhythm", icon: "ph-pulse" },
    { label: "Parasympathetic dominance", icon: "ph-heartbeat" },
    { label: "Serotonin & mood balance", icon: "ph-smiley" },
    { label: "GABAergic stability", icon: "ph-brain" },
    { label: "Anti-inflammatory signaling", icon: "ph-shield-plus" },
    { label: "Antioxidant capacity", icon: "ph-atom" },
  ]);

  /** @type {readonly EffectDatum[]} */
  const skinEffects = freezeData([
    {
      number: 1,
      title: "Barrier Homeostasis",
      image: "skin-barrier.webp",
      imageWidth: 180,
      imageHeight: 255,
      alt: "Skin barrier layers with hydration droplets",
      items: ["Lipid synthesis", "Tight-junction support", "TEWL regulation", "Hydration"],
    },
    {
      number: 2,
      title: "Cellular Renewal & Repair",
      image: "cellular-renewal.webp",
      imageWidth: 165,
      imageHeight: 249,
      alt: "Circular cellular renewal and repair process",
      items: ["Keratinocyte turnover", "DNA repair", "Mitochondrial quality"],
    },
    {
      number: 3,
      title: "Dermal Matrix Support",
      image: "dermal-matrix.webp",
      imageWidth: 213,
      imageHeight: 264,
      alt: "Fibroblasts, collagen, elastin, and extracellular matrix fibers",
      items: ["Collagen synthesis", "Elastin maintenance", "Fibroblast activity", "ECM remodeling balance"],
    },
    {
      number: 4,
      title: "Inflammation Control",
      image: "inflammation-control.webp",
      imageWidth: 126,
      imageHeight: 246,
      alt: "Immune cells and inflammatory signaling particles",
      items: ["Low-grade inflammation regulation", "Mast-cell stability", "Cytokine balance"],
    },
    {
      number: 5,
      title: "Pigment & Tone Regulation",
      image: "pigment-tone.webp",
      imageWidth: 198,
      imageHeight: 258,
      alt: "Melanocyte with melanin pigment particles",
      items: ["Oxidative stability in melanocytes", "Melanin balance", "Even tone", "Radiance / glow"],
    },
  ]);

  /** @type {readonly IconDatum[]} */
  const skinOutcomes = freezeData([
    { label: "Hydration & plumpness", icon: "ph-drop" },
    { label: "Stronger skin barrier", icon: "ph-shield-check" },
    { label: "Smoothness & softness", icon: "ph-waves" },
    { label: "Elasticity & firmness", icon: "ph-arrows-left-right" },
    { label: "Radiance & healthy glow", icon: "ph-sun-horizon" },
    { label: "Even tone & clarity", icon: "ph-sparkle" },
    { label: "Calm, less-reactive skin", icon: "ph-flower-lotus" },
    { label: "Healthy aging appearance", icon: "ph-clock" },
  ]);

  /** @type {readonly IconDatum[]} */
  const agingSupports = freezeData([
    { label: "Protects against photoaging & oxidative damage", icon: "ph-shield-check" },
    { label: "Preserves cellular & mitochondrial function", icon: "ph-atom" },
    { label: "Maintains collagen & ECM integrity", icon: "ph-stack" },
    { label: "Enhances repair capacity & resilience", icon: "ph-shield-plus" },
    { label: "Slows visible signs of aging", icon: "ph-clock" },
  ]);

  const element = (tagName, className, text) => {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const markReveal = (node, index) => {
    node.classList.add("shb-reveal");
    node.style.setProperty("--shb-reveal-order", String(index % 8));
    return node;
  };

  const createIcon = (icons, className = "shb-icon") => {
    const wrapper = element("span", className);
    wrapper.setAttribute("aria-hidden", "true");
    const names = Array.isArray(icons) ? icons : [icons];
    names.forEach((name) => {
      const icon = element("i", `ph ${name}`);
      icon.setAttribute("aria-hidden", "true");
      wrapper.append(icon);
    });
    return wrapper;
  };

  const createIconGraphic = (datum, className = "shb-icon") => {
    if (!datum.image) return createIcon(datum.icon, className);
    const image = document.createElement("img");
    image.className = `${className} shb-reference-icon`;
    image.src = `${ART_BASE}${datum.image}`;
    image.width = datum.imageWidth;
    image.height = datum.imageHeight;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.setAttribute("aria-hidden", "true");
    return image;
  };

  const createLabel = (datum, className) => {
    const copy = element("span", className);
    copy.append(element("span", `${className}__main`, datum.label));
    if (datum.meta) copy.append(element("small", `${className}__meta`, datum.meta));
    return copy;
  };

  const createArtwork = (datum, className) => {
    const image = document.createElement("img");
    image.className = className;
    image.src = `${ART_BASE}${datum.image}`;
    image.width = datum.imageWidth;
    image.height = datum.imageHeight;
    image.alt = datum.alt;
    image.loading = "lazy";
    image.decoding = "async";
    return image;
  };

  const createBulletList = (items, className = "shb-science-list") => {
    const list = element("ul", className);
    items.forEach((item) => list.append(element("li", "", item)));
    return list;
  };

  const appendOnce = (selector, renderer) => {
    const container = document.querySelector(selector);
    if (!container || container.dataset.shbReady === "true") return;
    renderer(container);
    container.dataset.shbReady = "true";
  };

  const renderIconGrid = (container, data, itemClass) => {
    container.setAttribute("role", "list");
    const fragment = document.createDocumentFragment();
    data.forEach((datum, index) => {
      const item = markReveal(element("div", itemClass), index);
      item.setAttribute("role", "listitem");
      item.append(createIconGraphic(datum), createLabel(datum, `${itemClass}__label`));
      fragment.append(item);
    });
    container.append(fragment);
  };

  const renderEffects = (container, data) => {
    const fragment = document.createDocumentFragment();
    data.forEach((datum, index) => {
      const card = markReveal(element("article", "shb-effect-card"), index);
      card.setAttribute("aria-labelledby", `shb-effect-${datum.number}-${datum.image}`);

      const heading = element("header", "shb-effect-card__heading");
      heading.append(element("span", "shb-effect-card__number", String(datum.number)));
      const title = element("h4", "", datum.title);
      title.id = `shb-effect-${datum.number}-${datum.image}`;
      heading.append(title);

      const body = element("div", "shb-effect-card__body");
      body.append(
        createArtwork(datum, "shb-art shb-effect-card__art"),
        createBulletList(datum.items),
      );
      card.append(heading, body);
      fragment.append(card);
    });
    container.append(fragment);
  };

  const renderModulators = (container) => {
    const title = element("h3", "shb-modulator-panel__title", "Neuroregulatory Modulators");
    title.append(document.createTextNode(" "), element("small", "", "(Adjunct Inputs)"));
    const list = element("ul", "shb-modulator-list");
    modulators.forEach((datum, index) => {
      const item = markReveal(element("li", "shb-modulator"), index);
      item.append(createIconGraphic(datum), element("span", "", datum.label));
      list.append(item);
    });
    container.append(title, list);
  };

  const renderSystemItems = (container, data) => {
    container.setAttribute("role", "list");
    data.forEach((datum, index) => {
      const item = markReveal(element("div", "shb-flow-item shb-system-item"), index);
      item.setAttribute("role", "listitem");
      item.append(createIcon(datum.icon), createLabel(datum, "shb-system-item__label"));
      container.append(item);
    });
  };

  const renderSignals = (container) => {
    primarySignals.forEach((signal, index) => {
      container.append(markReveal(element("li", "shb-compact-item", signal), index));
    });
  };

  const renderHub = (container) => {
    hubCards.forEach((datum, index) => {
      const card = markReveal(element("article", "shb-hub-card"), index);
      const title = element("h4", "", datum.title);
      card.append(
        title,
        createArtwork(datum, "shb-art shb-hub-card__art"),
        createBulletList(datum.items, "shb-hub-card__list"),
      );
      container.append(card);
    });
  };

  const renderAxis = (container) => {
    beautyAxis.forEach((datum, index) => {
      if (index > 0) {
        const connector = element("div", "shb-axis-link");
        connector.setAttribute("aria-hidden", "true");
        connector.append(createIcon("ph-arrows-left-right", "shb-axis-link__icon"));
        container.append(connector);
      }

      const card = markReveal(element("article", "shb-axis-card"), index);
      const heading = element("h4", "shb-axis-card__title", `${datum.number}. ${datum.title}`);
      if (datum.meta) heading.append(document.createTextNode(" "), element("small", "", datum.meta));
      card.append(
        heading,
        createArtwork(datum, "shb-art shb-axis-card__art"),
        createBulletList(datum.items, "shb-axis-card__list"),
      );
      container.append(card);
    });
  };

  const populatePage = () => {
    appendOnce('[data-shb-driver="hair"]', (container) => renderIconGrid(container, hairDrivers, "shb-driver"));
    appendOnce("[data-shb-hair-effects]", (container) => renderEffects(container, hairEffects));
    appendOnce('[data-shb-modulators="hair"]', renderModulators);
    appendOnce('[data-shb-outcomes="hair"]', (container) => renderIconGrid(container, hairOutcomes, "shb-outcome"));
    appendOnce("[data-shb-recovery]", (container) => renderIconGrid(container, recoverySupports.slice(0, 4), "shb-support"));
    appendOnce("[data-shb-recovery-tail]", (container) => renderIconGrid(container, recoverySupports.slice(4), "shb-support"));
    appendOnce("[data-shb-sleep-inputs]", (container) => renderSystemItems(container, sleepInputs));
    appendOnce("[data-shb-primary-signals]", renderSignals);
    appendOnce("[data-shb-hub]", renderHub);
    appendOnce("[data-shb-sensory]", (container) => renderSystemItems(container, sensoryInputs));
    appendOnce("[data-shb-beauty-axis]", renderAxis);
    appendOnce('[data-shb-outcomes="shared"]', (container) => renderIconGrid(container, sharedOutcomes, "shb-outcome"));
    appendOnce('[data-shb-driver="skin"]', (container) => renderIconGrid(container, skinDrivers, "shb-driver"));
    appendOnce("[data-shb-skin-effects]", (container) => renderEffects(container, skinEffects));
    appendOnce('[data-shb-modulators="skin"]', renderModulators);
    appendOnce('[data-shb-outcomes="skin"]', (container) => renderIconGrid(container, skinOutcomes, "shb-outcome"));
    appendOnce("[data-shb-aging]", (container) => renderIconGrid(container, agingSupports, "shb-support"));
  };

  const initNavigation = () => {
    const toggle = document.querySelector("[data-shb-nav-toggle]");
    const navigation = document.querySelector("[data-shb-nav]");
    if (!toggle || !navigation) return;

    const links = [...navigation.querySelectorAll('a[href^="#"]')];

    const setOpen = (open, restoreFocus = false) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      navigation.classList.toggle("is-open", open);
      document.body.classList.toggle("shb-nav-open", open);
      const icon = toggle.querySelector("i");
      icon?.classList.toggle("ph-list", !open);
      icon?.classList.toggle("ph-x", open);
      if (!open && restoreFocus) toggle.focus();
    };

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.hash === `#${id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    navigation.addEventListener("click", (event) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      if (link.hash) setActive(link.hash.slice(1));
      setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
    });

    document.addEventListener("pointerdown", (event) => {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!(event.target instanceof Node)) return;
      if (navigation.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 769) setOpen(false);
    }, { passive: true });

    const linkedSections = links
      .map((link) => document.getElementById(link.hash.slice(1)))
      .filter((section, index, list) => section && list.indexOf(section) === index);

    setActive(window.location.hash && links.some((link) => link.hash === window.location.hash)
      ? window.location.hash.slice(1)
      : "hair-scalp");

    if (!("IntersectionObserver" in window)) return;
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-18% 0px -68%", threshold: [0.01, 0.2, 0.5] });
    linkedSections.forEach((section) => sectionObserver.observe(section));
  };

  const initReveal = () => {
    const revealItems = [...document.querySelectorAll(".shb-reveal, [data-shb-reveal]")];
    revealItems.forEach((item, index) => {
      if (!item.style.getPropertyValue("--shb-reveal-order")) {
        item.style.setProperty("--shb-reveal-order", String(index % 8));
      }
    });

    if (qaMode || reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    document.body.classList.add("shb-reveal-ready");
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -4%", threshold: 0.04 });
    revealItems.forEach((item) => revealObserver.observe(item));
  };

  const initHeroParallax = () => {
    if (qaMode) return;
    const art = document.querySelector("[data-shb-hero-art]");
    if (!art) return;
    const interactionSurface = art.closest(".shb-hero") || art;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      art.style.setProperty("--shb-parallax-x", `${currentX.toFixed(2)}px`);
      art.style.setProperty("--shb-parallax-y", `${currentY.toFixed(2)}px`);
      if (Math.abs(targetX - currentX) > 0.02 || Math.abs(targetY - currentY) > 0.02) {
        animationFrame = window.requestAnimationFrame(render);
      } else {
        animationFrame = 0;
      }
    };

    const moveTo = (x, y) => {
      targetX = x;
      targetY = y;
      if (!animationFrame) animationFrame = window.requestAnimationFrame(render);
    };

    interactionSurface.addEventListener("pointermove", (event) => {
      if (reduceMotion.matches || event.pointerType === "touch") return;
      const bounds = interactionSurface.getBoundingClientRect();
      let x = ((event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5) * 10;
      let y = ((event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5) * 10;
      const magnitude = Math.hypot(x, y);
      if (magnitude > 5) {
        x = (x / magnitude) * 5;
        y = (y / magnitude) * 5;
      }
      moveTo(x, y);
    }, { passive: true });

    interactionSurface.addEventListener("pointerleave", () => moveTo(0, 0), { passive: true });
    reduceMotion.addEventListener?.("change", () => {
      if (!reduceMotion.matches) return;
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      art.style.removeProperty("--shb-parallax-x");
      art.style.removeProperty("--shb-parallax-y");
    });
  };

  const initParticles = () => {
    if (qaMode) return;
    const canvas = document.querySelector("[data-shb-particles]");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let width = 1;
    let height = 1;
    let particles = [];
    let animationFrame = 0;
    let resizeFrame = 0;
    let lastTime = 0;

    const createParticles = () => {
      const count = Math.min(32, Math.max(12, Math.round((width * height) / 76000)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.55 + Math.random() * 1.05,
        velocityX: (Math.random() - 0.5) * 0.055,
        velocityY: (Math.random() - 0.5) * 0.045,
        alpha: 0.12 + Math.random() * 0.3,
        violet: index % 6 === 0,
      }));
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(bounds.width || window.innerWidth));
      height = Math.max(1, Math.round(bounds.height || window.innerHeight));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      createParticles();
    };

    const draw = (advance = false, elapsed = 16.67) => {
      context.clearRect(0, 0, width, height);
      const speed = Math.min(elapsed, 40);

      particles.forEach((particle) => {
        if (advance) {
          particle.x += particle.velocityX * speed;
          particle.y += particle.velocityY * speed;
          if (particle.x < -4) particle.x = width + 4;
          if (particle.x > width + 4) particle.x = -4;
          if (particle.y < -4) particle.y = height + 4;
          if (particle.y > height + 4) particle.y = -4;
        }
        context.beginPath();
        context.fillStyle = particle.violet
          ? `rgba(142, 108, 255, ${particle.alpha})`
          : `rgba(48, 213, 255, ${particle.alpha})`;
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      for (let first = 0; first < particles.length; first += 1) {
        for (let second = first + 1; second < particles.length; second += 1) {
          const dx = particles[first].x - particles[second].x;
          const dy = particles[first].y - particles[second].y;
          const distance = Math.hypot(dx, dy);
          if (distance >= 86) continue;
          context.beginPath();
          context.strokeStyle = `rgba(48, 166, 255, ${(1 - distance / 86) * 0.09})`;
          context.lineWidth = 0.65;
          context.moveTo(particles[first].x, particles[first].y);
          context.lineTo(particles[second].x, particles[second].y);
          context.stroke();
        }
      }
    };

    const animate = (time) => {
      const elapsed = lastTime ? time - lastTime : 16.67;
      lastTime = time;
      draw(true, elapsed);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (animationFrame || reduceMotion.matches || document.hidden) {
        draw(false);
        return;
      }
      lastTime = 0;
      animationFrame = window.requestAnimationFrame(animate);
    };

    const stop = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      draw(false);
    };

    resize();
    start();

    window.addEventListener("resize", () => {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        resizeFrame = 0;
        resize();
        if (reduceMotion.matches) draw(false);
      });
    }, { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    reduceMotion.addEventListener?.("change", () => {
      if (reduceMotion.matches) stop();
      else start();
    });
  };

  const init = () => {
    populatePage();
    initNavigation();
    initReveal();
    initHeroParallax();
    initParticles();
    document.documentElement.classList.add("shb-enhanced");
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
