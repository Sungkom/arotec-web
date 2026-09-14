(() => {
  "use strict";

  let shell = null;
  let shellObserver = null;
  let activeSection = null;
  let disposeSection = null;

  function enhanceSection(section) {
    const sourceButtons = Array.from(section.querySelectorAll("ol.biology-stages button[data-biology-stage]"));
    const stages = new Map();

    sourceButtons.forEach((button) => {
      const stage = Number(button.dataset.biologyStage);
      if (Number.isInteger(stage) && !stages.has(stage)) stages.set(stage, button);
    });

    if (!stages.size) {
      section.classList.add("biology-is-visible");
      return () => {};
    }

    const stageOrder = Array.from(stages.keys()).sort((a, b) => a - b);
    const buttons = Array.from(section.querySelectorAll("button[data-biology-stage]"))
      .filter((button) => stages.has(Number(button.dataset.biologyStage)));
    const zoomButton = section.querySelector("button[data-biology-zoom]");
    const zoomLabel = zoomButton?.querySelector("[data-biology-zoom-label]");
    const zoomIcon = zoomButton?.querySelector("i");
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listeners = new AbortController();
    const initialStage = stages.has(Number(section.dataset.activeStage))
      ? Number(section.dataset.activeStage)
      : stageOrder[0];
    let visibilityObserver = null;

    function setZoomed(value) {
      section.classList.toggle("biology-is-zoomed", value);
      if (zoomButton) zoomButton.setAttribute("aria-pressed", String(value));
      if (zoomLabel) zoomLabel.textContent = value ? "Fit to screen" : "Enlarge diagram";
      if (zoomIcon) {
        zoomIcon.classList.toggle("ph-magnifying-glass-plus", !value);
        zoomIcon.classList.toggle("ph-magnifying-glass-minus", value);
      }
    }

    function selectStage(stage, manual = false) {
      if (!stages.has(stage)) return;
      if (manual) {
        section.classList.add("biology-has-interacted");
      }
      section.dataset.activeStage = String(stage);
      buttons.forEach((button) => {
        const selected = Number(button.dataset.biologyStage) === stage;
        button.setAttribute("aria-pressed", String(selected));
        button.classList.toggle("biology-is-active", selected);
      });

    }

    buttons.forEach((button) => {
      const stage = Number(button.dataset.biologyStage);
      const activate = () => selectStage(stage, true);
      button.addEventListener("pointerenter", (event) => {
        if (event.pointerType !== "touch") activate();
      }, { signal: listeners.signal });
      button.addEventListener("focus", activate, { signal: listeners.signal });
      button.addEventListener("click", activate, { signal: listeners.signal });
      button.addEventListener("keydown", (event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const currentIndex = stageOrder.indexOf(stage);
        let nextIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % stageOrder.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (currentIndex - 1 + stageOrder.length) % stageOrder.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = stageOrder.length - 1;
        } else {
          return;
        }
        event.preventDefault();
        const nextStage = stageOrder[nextIndex];
        const matchingButton = buttons.find((candidate) =>
          Number(candidate.dataset.biologyStage) === nextStage &&
          candidate.classList.contains("biology-node") === button.classList.contains("biology-node"));
        (matchingButton || stages.get(nextStage)).focus();
        selectStage(nextStage, true);
      }, { signal: listeners.signal });
    });

    zoomButton?.addEventListener("click", () => {
      setZoomed(!section.classList.contains("biology-is-zoomed"));
    }, { signal: listeners.signal });

    motionPreference.addEventListener("change", () => {
      section.classList.add("biology-is-visible");
    }, { signal: listeners.signal });

    if ("IntersectionObserver" in window) {
      visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.12) {
            section.classList.add("biology-is-visible");
            visibilityObserver.unobserve(section);
          }
        });
      }, { threshold: [0, 0.12] });
      visibilityObserver.observe(section);
    } else {
      section.classList.add("biology-is-visible");
    }

    if (motionPreference.matches) section.classList.add("biology-is-visible");
    selectStage(initialStage);
    setZoomed(false);
    section.classList.add("biology-enhanced");
    if (zoomButton) zoomButton.hidden = false;

    return () => {
      listeners.abort();
      visibilityObserver?.disconnect();
    };
  }

  function syncSection() {
    const nextSection = shell?.querySelector("#biology-experience") || null;
    if (nextSection === activeSection) return;
    disposeSection?.();
    activeSection = nextSection;
    disposeSection = nextSection ? enhanceSection(nextSection) : null;
  }

  function disconnect() {
    shellObserver?.disconnect();
    shellObserver = null;
    disposeSection?.();
    disposeSection = null;
    activeSection = null;
    shell = null;
  }

  function connect() {
    const nextShell = document.getElementById("site-shell");
    if (nextShell !== shell) disconnect();
    shell = nextShell;
    if (!shell) return;
    if (!shellObserver) {
      shellObserver = new MutationObserver(syncSection);
      // Language changes replace the shell's direct children. Internal stage
      // updates must not retrigger mounting or create duplicate listeners.
      shellObserver.observe(shell, { childList: true });
    }
    syncSection();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", connect, { once: true });
  } else {
    connect();
  }
  window.addEventListener("pagehide", disconnect);
  window.addEventListener("pageshow", connect);
})();
