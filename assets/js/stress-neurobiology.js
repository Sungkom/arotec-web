(function () {
  "use strict";

  const sections = Array.from(document.querySelectorAll("[data-stress-section]"));
  const progressBar = document.querySelector("[data-stress-progress]");
  const backToTop = document.querySelector("[data-stress-top]");
  const navLinks = Array.from(document.querySelectorAll("[data-stress-nav] a"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealSection = (section) => section.classList.add("is-visible");

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealSection(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.08 }
    );
    sections.forEach((section) => revealObserver.observe(section));
  } else {
    sections.forEach(revealSection);
  }

  const updatePageState = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, scrollTop / scrollRange));

    if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 750);

    const marker = scrollTop + Math.min(window.innerHeight * 0.42, 360);
    let activeId = sections[0] ? sections[0].id : "";
    sections.forEach((section) => {
      if (section.offsetTop <= marker) activeId = section.id;
    });
    navLinks.forEach((link) => {
      const isActive = link.hash === `#${activeId}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updatePageState();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  updatePageState();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  const nativeStages = Array.from(document.querySelectorAll("[data-native-stage]"));
  const query = new URLSearchParams(window.location.search);
  const captureSection = query.get("capture");
  const captureMode = Boolean(captureSection);

  const fitNativeStagesToViewport = () => {
    nativeStages.forEach((stage) => {
      const scroller = stage.closest(".stress-stage-scroll");
      if (!scroller) return;

      if (captureMode) {
        stage.style.removeProperty("transform");
        stage.style.removeProperty("margin-left");
        stage.style.removeProperty("margin-right");
        scroller.style.removeProperty("height");
        delete stage.dataset.viewportScale;
        return;
      }

      const nativeWidth = Number.parseFloat(getComputedStyle(stage).width) || stage.offsetWidth;
      const nativeHeight = Number.parseFloat(getComputedStyle(stage).height) || stage.offsetHeight;
      const availableWidth = scroller.clientWidth;
      if (!nativeWidth || !nativeHeight || !availableWidth) return;

      const scale = Math.min(1, availableWidth / nativeWidth);
      const visualWidth = nativeWidth * scale;
      stage.style.transform = `scale(${scale})`;
      stage.style.marginLeft = `${Math.max(0, (availableWidth - visualWidth) / 2)}px`;
      stage.style.marginRight = "0";
      scroller.style.height = `${Math.ceil(nativeHeight * scale)}px`;
      stage.dataset.viewportScale = scale.toFixed(4);
    });
  };

  fitNativeStagesToViewport();
  window.addEventListener("resize", fitNativeStagesToViewport, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNativeStagesToViewport);

  const revealNativeStage = (stage) => stage.classList.add("is-in-view");

  nativeStages.forEach((stage) => {
    if (captureMode || reduceMotion || !("IntersectionObserver" in window)) {
      revealNativeStage(stage);
      return;
    }

    const nativeObserver = new IntersectionObserver(
      (entries, observer) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        revealNativeStage(stage);
        observer.disconnect();
      },
      { threshold: 0.16 }
    );
    nativeObserver.observe(stage);
  });

  const getCapturedStage = () => {
    if (captureSection === "01") return document.querySelector(".stress-stage-01");
    if (captureSection === "02") return document.querySelector(".stress-stage-02");
    if (captureSection === "03") return document.querySelector(".stress-stage-03");
    if (captureSection === "04") return document.querySelector(".stress-stage-04");
    if (captureSection === "05") return document.querySelector(".stress-stage-05");
    if (captureSection === "06") return document.querySelector(".stress-stage-06");
    return null;
  };

  const getNearestStage = () => nativeStages.reduce((nearest, stage) => {
    const rect = stage.getBoundingClientRect();
    const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
    if (!nearest || distance < nearest.distance) return { stage, distance };
    return nearest;
  }, null)?.stage || null;

  if (query.get("overlay") === "1") {
    const overlayStage = getCapturedStage() || getNearestStage();
    if (overlayStage) overlayStage.classList.add("is-reference-visible");
  }

  if (nativeStages.length) {
    window.addEventListener("keydown", (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key.toLowerCase() !== "r") return;
      const stage = getCapturedStage() || getNearestStage();
      if (stage) stage.classList.toggle("is-reference-visible");
    });
  }

  const stressStagesPanel = document.querySelector(".stress-stage-01");
  const nativePanels = Array.from(document.querySelectorAll(".stress-stage-01 [data-native-panel]"));

  if (stressStagesPanel) {
    const setActiveStage = (panel) => {
      stressStagesPanel.dataset.activeStage = panel.dataset.nativePanel || "";
    };
    const clearActiveStage = () => delete stressStagesPanel.dataset.activeStage;

    nativePanels.forEach((panel) => {
      panel.addEventListener("pointerenter", () => setActiveStage(panel));
      panel.addEventListener("pointerleave", clearActiveStage);
      panel.addEventListener("focusin", () => setActiveStage(panel));
      panel.addEventListener("focusout", clearActiveStage);
    });
  }

  const transitionStage = document.querySelector(".stress-stage-02");

  const updateTransitionConnectors = () => {
    if (!transitionStage) return;
    const stageRect = transitionStage.getBoundingClientRect();

    transitionStage.querySelectorAll("[data-anchor-from][data-anchor-to]").forEach((path) => {
      const from = transitionStage.querySelector(`[data-node="${path.dataset.anchorFrom}"]`);
      const to = transitionStage.querySelector(`[data-node="${path.dataset.anchorTo}"]`);
      if (!from || !to) return;

      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const fromCenter = {
        x: fromRect.left - stageRect.left + fromRect.width / 2,
        y: fromRect.top - stageRect.top + fromRect.height / 2,
      };
      const toCenter = {
        x: toRect.left - stageRect.left + toRect.width / 2,
        y: toRect.top - stageRect.top + toRect.height / 2,
      };
      const crossAxis = Number.parseFloat(path.dataset.crossAxis || "");

      if (path.dataset.axis === "horizontal") {
        const pointsRight = toCenter.x >= fromCenter.x;
        const y = Number.isFinite(crossAxis) ? crossAxis : (fromCenter.y + toCenter.y) / 2;
        const startX = (pointsRight ? fromRect.right : fromRect.left) - stageRect.left;
        const endX = (pointsRight ? toRect.left : toRect.right) - stageRect.left;
        path.setAttribute("d", `M${startX.toFixed(1)} ${y.toFixed(1)}H${endX.toFixed(1)}`);
      } else {
        const pointsDown = toCenter.y >= fromCenter.y;
        const x = Number.isFinite(crossAxis) ? crossAxis : (fromCenter.x + toCenter.x) / 2;
        const startY = (pointsDown ? fromRect.bottom : fromRect.top) - stageRect.top;
        const endY = (pointsDown ? toRect.top : toRect.bottom) - stageRect.top;
        path.setAttribute("d", `M${x.toFixed(1)} ${startY.toFixed(1)}V${endY.toFixed(1)}`);
      }
    });
  };

  if (transitionStage) {
    const routeControls = Array.from(transitionStage.querySelectorAll("[data-route-control]"));
    const setRouteFocus = (control) => {
      transitionStage.dataset.routeFocus = control.dataset.routeControl || "";
    };
    const clearRouteFocus = () => delete transitionStage.dataset.routeFocus;

    routeControls.forEach((control) => {
      control.addEventListener("pointerenter", () => setRouteFocus(control));
      control.addEventListener("pointerleave", clearRouteFocus);
      control.addEventListener("focusin", () => setRouteFocus(control));
      control.addEventListener("focusout", clearRouteFocus);
    });

    window.addEventListener("resize", updateTransitionConnectors, { passive: true });
    window.requestAnimationFrame(updateTransitionConnectors);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateTransitionConnectors);
  }

  const systemsStage = document.querySelector(".stress-stage-03");

  if (systemsStage) {
    const systemCards = Array.from(systemsStage.querySelectorAll("[data-system-node]"));
    const amplifierCard = systemsStage.querySelector("[data-amplifier-control]");
    const setActiveSystem = (card) => {
      systemsStage.dataset.activeSystem = card.dataset.systemNode || "";
    };
    const clearActiveSystem = () => delete systemsStage.dataset.activeSystem;

    systemCards.forEach((card) => {
      card.addEventListener("pointerenter", () => setActiveSystem(card));
      card.addEventListener("pointerleave", clearActiveSystem);
      card.addEventListener("focusin", () => setActiveSystem(card));
      card.addEventListener("focusout", clearActiveSystem);
    });

    if (amplifierCard) {
      const setAmplifierActive = () => { systemsStage.dataset.amplifierActive = "true"; };
      const clearAmplifierActive = () => delete systemsStage.dataset.amplifierActive;
      amplifierCard.addEventListener("pointerenter", setAmplifierActive);
      amplifierCard.addEventListener("pointerleave", clearAmplifierActive);
      amplifierCard.addEventListener("focusin", setAmplifierActive);
      amplifierCard.addEventListener("focusout", clearAmplifierActive);
    }
  }

  const outcomesStage = document.querySelector(".stress-stage-04");

  if (outcomesStage) {
    const clinicalCards = Array.from(outcomesStage.querySelectorAll("[data-clinical-card]"));
    const setOutcomeActive = (card) => {
      outcomesStage.dataset.outcomeActive = card.dataset.outcomeSide || "";
    };
    const clearOutcomeActive = () => delete outcomesStage.dataset.outcomeActive;

    clinicalCards.forEach((card) => {
      card.addEventListener("pointerenter", () => setOutcomeActive(card));
      card.addEventListener("pointerleave", clearOutcomeActive);
      card.addEventListener("focusin", () => setOutcomeActive(card));
      card.addEventListener("focusout", clearOutcomeActive);
    });
  }

  const cognitiveStage = document.querySelector(".stress-stage-05");

  if (cognitiveStage) {
    const cognitiveCards = Array.from(cognitiveStage.querySelectorAll("[data-cognitive-card]"));
    const setCognitiveActive = (card) => {
      cognitiveStage.dataset.cognitiveActive = card.dataset.cognitiveIndex || "0";
    };
    const clearCognitiveActive = () => delete cognitiveStage.dataset.cognitiveActive;

    cognitiveCards.forEach((card) => {
      card.addEventListener("pointerenter", () => setCognitiveActive(card));
      card.addEventListener("pointerleave", clearCognitiveActive);
      card.addEventListener("focusin", () => setCognitiveActive(card));
      card.addEventListener("focusout", clearCognitiveActive);
    });
  }

  const neuroStage = document.querySelector(".stress-stage-06");

  if (neuroStage) {
    const legendControls = Array.from(neuroStage.querySelectorAll("[data-neuro-legend]"));
    const setLegendActive = (control) => {
      neuroStage.dataset.neuroLegendActive = control.dataset.neuroLegend || "";
    };
    const clearLegendActive = () => delete neuroStage.dataset.neuroLegendActive;

    legendControls.forEach((control) => {
      control.addEventListener("pointerenter", () => setLegendActive(control));
      control.addEventListener("pointerleave", clearLegendActive);
      control.addEventListener("focusin", () => setLegendActive(control));
      control.addEventListener("focusout", clearLegendActive);
    });
  }

  const runFitChecks = () => {
    nativeStages.forEach((stage) => {
      stage.querySelectorAll("[data-fit-check]").forEach((element) => {
        const fits = element.scrollWidth <= element.clientWidth + 1 && element.scrollHeight <= element.clientHeight + 1;
        element.dataset.fitStatus = fits ? "pass" : "overflow";
      });
    });
  };

  if (nativeStages.length) {
    window.addEventListener("resize", runFitChecks, { passive: true });
    window.requestAnimationFrame(runFitChecks);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(runFitChecks);
  }
})();
