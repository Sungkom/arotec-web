(() => {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const connectorManifest = [
    { stage: ".section-02-stage", from: "s02-formula", to: "s02-impact", fromSide: "bottom", toSide: "top", color: "blue" },
    { stage: ".section-02-stage", from: "s02-impact", to: "s02-aging", fromSide: "bottom", toSide: "top", color: "blue" },
    { stage: ".section-02-stage", from: "s02-aging", to: "s02-health", fromSide: "bottom", toSide: "top", color: "blue" },
    { stage: ".section-03-stage", from: "s03-sources", to: "s03-entry", fromSide: "right", toSide: "left", color: "blue" },
    { stage: ".section-03-stage", from: "s03-entry", to: "s03-effects", fromSide: "right", toSide: "left", color: "green" },
    { stage: ".section-03-stage", from: "s03-effects", to: "s03-cascade", fromSide: "right", toSide: "left", color: "purple" },
    { stage: ".section-03-stage", from: "s03-cascade", to: "s03-outcomes", fromSide: "right", toSide: "left", color: "orange" },
    { stage: ".section-03-stage", from: "s03-mechanisms", to: "s03-prevention", fromSide: "right", toSide: "left", color: "blue" },
    { stage: ".section-05-stage", from: "s05-level-1", to: "s05-level-2", fromSide: "right", toSide: "left", color: "blue" },
    { stage: ".section-05-stage", from: "s05-level-2", to: "s05-level-3", fromSide: "right", toSide: "left", color: "blue" },
    { stage: ".section-05-stage", from: "s05-level-3", to: "s05-level-4", fromSide: "right", toSide: "left", color: "blue" },
    { stage: ".section-05-stage", from: "s05-level-4", to: "s05-level-5", fromSide: "right", toSide: "left", color: "black" }
  ];

  const rafThrottle = (fn) => {
    let token = 0;
    return (...args) => {
      cancelAnimationFrame(token);
      token = requestAnimationFrame(() => fn(...args));
    };
  };

  const localRect = (element, stage) => {
    const box = element.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    const scale = Number(stage.dataset.fitScale) || 1;
    return {
      left: (box.left - stageBox.left) / scale,
      right: (box.right - stageBox.left) / scale,
      top: (box.top - stageBox.top) / scale,
      bottom: (box.bottom - stageBox.top) / scale,
      width: box.width / scale,
      height: box.height / scale
    };
  };

  const fitStagesToViewport = () => {
    const captureMode = document.body.classList.contains("capture-mode");

    document.querySelectorAll(".stage-scroll").forEach((scroller) => {
      const stage = scroller.querySelector(".infographic-stage");
      if (!stage) return;

      const naturalWidth = stage.offsetWidth;
      const naturalHeight = stage.offsetHeight;
      const availableWidth = scroller.clientWidth;
      const scale = captureMode || !naturalWidth
        ? 1
        : Math.min(1, availableWidth / naturalWidth);
      const fittedWidth = naturalWidth * scale;

      stage.dataset.fitScale = scale.toFixed(6);
      stage.style.transform = scale < 1 ? `scale(${scale})` : "none";
      stage.style.marginLeft = captureMode
        ? "0px"
        : `${Math.max(0, (availableWidth - fittedWidth) / 2)}px`;

      if (captureMode) {
        scroller.style.removeProperty("--stage-fit-height");
      } else {
        scroller.style.setProperty("--stage-fit-height", `${Math.ceil(naturalHeight * scale)}px`);
      }
    });
  };

  const anchor = (rect, side, slot = 0.5) => {
    if (side === "top") return { x: rect.left + rect.width * slot, y: rect.top };
    if (side === "bottom") return { x: rect.left + rect.width * slot, y: rect.bottom };
    if (side === "left") return { x: rect.left, y: rect.top + rect.height * slot };
    return { x: rect.right, y: rect.top + rect.height * slot };
  };

  const orthogonalPath = (start, end, startSide) => {
    const horizontal = startSide === "left" || startSide === "right";
    if (horizontal) {
      const midX = start.x + (end.x - start.x) / 2;
      return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} H ${midX.toFixed(1)} V ${end.y.toFixed(1)} H ${end.x.toFixed(1)}`;
    }
    const midY = start.y + (end.y - start.y) / 2;
    return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} V ${midY.toFixed(1)} H ${end.x.toFixed(1)} V ${end.y.toFixed(1)}`;
  };

  const drawConnector = (stage, item) => {
    const from = stage.querySelector(`[data-node="${item.from}"]`);
    const to = stage.querySelector(`[data-node="${item.to}"]`);
    if (!from || !to) return;

    const group = stage.querySelector(`[data-dynamic-connectors="${item.layer || "front"}"]`);
    if (!group) return;

    const start = anchor(localRect(from, stage), item.fromSide, item.fromSlot || 0.5);
    const end = anchor(localRect(to, stage), item.toSide, item.slot || item.toSlot || 0.5);
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("class", `connector color-${item.color}`);
    path.setAttribute("d", orthogonalPath(start, end, item.fromSide));
    path.setAttribute("marker-end", `url(#arrow-${item.color})`);
    if (item.both) path.setAttribute("marker-start", `url(#arrow-${item.color})`);
    path.dataset.animated = "true";
    group.append(path);

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = stage.classList.contains("is-visible") ? "0" : `${length}`;
  };

  const drawAllConnectors = () => {
    document.querySelectorAll("[data-dynamic-connectors]").forEach((group) => group.replaceChildren());
    connectorManifest.forEach((item) => {
      const stage = document.querySelector(item.stage);
      if (stage) drawConnector(stage, item);
    });
  };

  const runFitChecks = () => {
    document.querySelectorAll("[data-fit-check]").forEach((element) => {
      const glyphTolerance = 12;
      const overflowX = element.scrollWidth > element.clientWidth + glyphTolerance;
      const overflowY = element.scrollHeight > element.clientHeight + glyphTolerance;
      element.classList.toggle("is-overflowing", overflowX || overflowY);
    });
  };

  const waitForAssets = async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    const pending = Array.from(document.images).map(async (img) => {
      if (img.complete) {
        try { await img.decode(); } catch (_) { /* A loaded SVG/JPG may not support decode. */ }
        return;
      }
      await new Promise((resolve) => {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });
    await Promise.all(pending);
  };

  const initObservers = () => {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    }, { rootMargin: "100px 0px", threshold: 0.05 });

    document.querySelectorAll(".infographic-stage").forEach((element) => reveal.observe(element));

    const refresh = rafThrottle(() => {
      fitStagesToViewport();
      drawAllConnectors();
      runFitChecks();
    });
    const resize = new ResizeObserver(refresh);
    document.querySelectorAll(".infographic-stage").forEach((stage) => resize.observe(stage));
    window.addEventListener("resize", refresh, { passive: true });
  };

  const initProgress = () => {
    const links = Array.from(document.querySelectorAll("[data-progress-nav] a"));
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    const update = rafThrottle(() => {
      let active = sections[0];
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top < innerHeight * 0.48) active = section;
      });
      links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${active?.id}`));
      const progress = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight));
      document.documentElement.style.setProperty("--page-progress", progress.toFixed(4));
      document.querySelector("[data-back-to-top]")?.classList.toggle("is-visible", scrollY > innerHeight);
    });
    addEventListener("scroll", update, { passive: true });
    update();
  };

  const initDebug = () => {
    const currentStage = () => Array.from(document.querySelectorAll(".infographic-stage")).reduce((best, stage) => {
      const distance = Math.abs(stage.getBoundingClientRect().top - innerHeight * 0.2);
      return !best || distance < best.distance ? { stage, distance } : best;
    }, null)?.stage;

    addEventListener("keydown", (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
      const key = event.key.toLowerCase();
      if (key === "r") currentStage()?.classList.toggle("debug-reference");
      if (key === "h") document.body.classList.toggle("debug-cards");
      if (key === "a") document.body.classList.toggle("debug-connectors");
      if (key === "g") document.body.classList.toggle("debug-grid");
      if (key === "f") document.body.classList.toggle("debug-fit");
    });
  };

  const initHighlights = () => {
    document.querySelectorAll("[data-highlight-target]").forEach((trigger) => {
      const target = document.querySelector(`[data-node="${trigger.dataset.highlightTarget}"]`);
      ["pointerenter", "focusin"].forEach((name) => trigger.addEventListener(name, () => target?.classList.add("is-related")));
      ["pointerleave", "focusout"].forEach((name) => trigger.addEventListener(name, () => target?.classList.remove("is-related")));
    });
  };

  document.addEventListener("DOMContentLoaded", async () => {
    if (new URLSearchParams(location.search).has("capture")) document.body.classList.add("capture-mode");
    document.querySelector("[data-back-to-top]")?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    initObservers();
    initProgress();
    initDebug();
    initHighlights();
    await waitForAssets();
    requestAnimationFrame(() => {
      document.querySelectorAll(".infographic-stage").forEach((stage) => stage.classList.add("is-visible"));
      fitStagesToViewport();
      drawAllConnectors();
      runFitChecks();
      document.documentElement.classList.add("exposome-ready");
      dispatchEvent(new CustomEvent("exposome:ready"));
    });
  });
})();
