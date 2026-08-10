(() => {
  "use strict";

  const template = document.getElementById("research-solutions-template");
  const shell = document.getElementById("site-shell");
  const svgNamespace = "http://www.w3.org/2000/svg";
  const arrowClearance = 14;
  const productEndpointClearance = 6;
  let resizeObserver = null;
  let revealObserver = null;
  let frameId = 0;

  /* ================================================================
     Section mounting: keep the infographic after Biology of Experience
     even when the site's language renderer refreshes the page shell.
     ================================================================ */
  function mountInfographic() {
    if (!template || !shell || document.getElementById("research-solutions")) return;

    const biologySection = shell.querySelector(".wellbeing-cascade");
    if (!biologySection) return;

    biologySection.insertAdjacentElement("afterend", template.content.firstElementChild.cloneNode(true));
    hydrateIcons();
    setupRevealAnimation();
    setupTopicHighlighting();
    setupConnectorObservers();
    scheduleConnectorUpdate();
  }

  function hydrateIcons() {
    if (!window.lucide?.createIcons) return;
    window.lucide.createIcons({
      attrs: {
        "aria-hidden": "true",
        focusable: "false"
      }
    });
  }

  /* ================================================================
     Scroll reveal animation
     ================================================================ */
  function setupRevealAnimation() {
    revealObserver?.disconnect();
    const section = document.getElementById("research-solutions");
    if (!section) return;

    const animatedItems = section.querySelectorAll("[data-research-animate]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      animatedItems.forEach((item) => item.classList.add("is-visible"));
      scheduleConnectorUpdate();
      return;
    }

    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.addEventListener("transitionend", scheduleConnectorUpdate, { once: true });
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.12 });

    animatedItems.forEach((item) => revealObserver.observe(item));
  }

  /* ================================================================
     Dynamic SVG connector system
     All coordinates are measured from rendered HTML on every resize.
     ================================================================ */
  function setupConnectorObservers() {
    resizeObserver?.disconnect();
    const stage = document.querySelector("[data-research-stage]");
    if (!stage) return;

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(scheduleConnectorUpdate);
      resizeObserver.observe(stage);
      stage.querySelectorAll(".research-platform, .research-flow-grid, .research-product-card").forEach((element) => resizeObserver.observe(element));
    }
  }

  function scheduleConnectorUpdate() {
    if (frameId) window.cancelAnimationFrame(frameId);
    frameId = window.requestAnimationFrame(() => {
      frameId = 0;
      drawConnectors();
    });
  }

  function getLocalPoint(element, side, stageRect) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - stageRect.left;
    const centerY = rect.top + rect.height / 2 - stageRect.top;

    if (side === "top") return { x: centerX, y: rect.top - stageRect.top };
    if (side === "bottom") return { x: centerX, y: rect.bottom - stageRect.top };
    if (side === "left") return { x: rect.left - stageRect.left, y: centerY };
    if (side === "right") return { x: rect.right - stageRect.left, y: centerY };
    return { x: centerX, y: centerY };
  }

  function getEllipseEdgePoint(element, target, stageRect) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 - stageRect.left;
    const centerY = rect.top + rect.height / 2 - stageRect.top;
    const radiusX = rect.width / 2;
    const radiusY = rect.height / 2;
    const deltaX = target.x - centerX;
    const deltaY = target.y - centerY;
    const denominator = Math.sqrt((deltaX * deltaX) / (radiusX * radiusX) + (deltaY * deltaY) / (radiusY * radiusY));

    if (!denominator) return { x: centerX, y: centerY };
    return {
      x: centerX + deltaX / denominator,
      y: centerY + deltaY / denominator
    };
  }

  function createSvgElement(tagName, attributes = {}) {
    const element = document.createElementNS(svgNamespace, tagName);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function appendPath(svg, pathData, options = {}) {
    const path = createSvgElement("path", {
      d: pathData,
      class: `research-connector-path ${options.className || ""}`.trim(),
      stroke: options.color || "#e8fffb",
      "data-line-key": options.key || "",
      "marker-end": options.arrow ? "url(#research-arrow)" : ""
    });
    svg.appendChild(path);
    return path;
  }

  function appendDot(svg, point, color, radius = 5) {
    svg.appendChild(createSvgElement("circle", {
      class: "research-connector-dot",
      cx: point.x,
      cy: point.y,
      r: radius,
      fill: color,
      stroke: "#ffffff",
      "stroke-width": 2
    }));
  }

  function orthogonalPath(start, end, orientation = "horizontal", offset = 0) {
    if (orientation === "vertical") {
      const middleY = start.y + (end.y - start.y) * 0.5 + offset;
      return `M ${start.x} ${start.y} V ${middleY} H ${end.x} V ${end.y}`;
    }

    const middleX = start.x + (end.x - start.x) * 0.5 + offset;
    return `M ${start.x} ${start.y} H ${middleX} V ${end.y} H ${end.x}`;
  }

  function cardAccent(card) {
    return getComputedStyle(card).getPropertyValue("--accent").trim() || "#1596c4";
  }

  function drawConnectors() {
    const stage = document.querySelector("[data-research-stage]");
    const svg = stage?.querySelector("[data-research-connectors]");
    const arrowSvg = stage?.querySelector("[data-research-arrows]");
    const core = stage?.querySelector("[data-research-core]");
    const translation = stage?.querySelector("[data-research-translation]");
    const hub = stage?.querySelector("[data-research-hub]");
    if (!stage || !svg || !arrowSvg || !core || !translation || !hub) return;

    const stageRect = stage.getBoundingClientRect();
    if (!stageRect.width || !stageRect.height) return;

    svg.replaceChildren();
    arrowSvg.replaceChildren();
    svg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.setAttribute("preserveAspectRatio", "none");
    arrowSvg.setAttribute("viewBox", `0 0 ${stageRect.width} ${stageRect.height}`);
    arrowSvg.setAttribute("preserveAspectRatio", "none");

    const definitions = createSvgElement("defs");
    const marker = createSvgElement("marker", {
      id: "research-arrow",
      viewBox: "0 0 10 10",
      refX: 8,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: "auto-start-reverse"
    });
    marker.appendChild(createSvgElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#e8fffb" }));
    definitions.appendChild(marker);
    arrowSvg.appendChild(definitions);

    drawAxisConnectors(arrowSvg, stageRect, core, translation, hub);

    if (window.innerWidth < 768) {
      drawMobileConnectors(arrowSvg, stageRect, hub, stage);
      return;
    }

    drawProductConnectors(svg, arrowSvg, stageRect, hub, stage);
  }

  function drawAxisConnectors(svg, stageRect, core, translation, hub) {
    const coreBottom = getLocalPoint(core, "bottom", stageRect);
    const translationTop = getLocalPoint(translation, "top", stageRect);
    const translationBottom = getLocalPoint(translation, "bottom", stageRect);
    const hubTop = getLocalPoint(hub, "top", stageRect);

    appendPath(svg, `M ${coreBottom.x} ${coreBottom.y} V ${translationTop.y - arrowClearance}`, {
      className: "axis-path",
      arrow: true
    });
    appendPath(svg, `M ${translationBottom.x} ${translationBottom.y} V ${hubTop.y - arrowClearance}`, {
      className: "axis-path",
      arrow: true
    });
  }

  function drawProductConnectors(svg, dotSvg, stageRect, hub, stage) {
    const hubCenter = getLocalPoint(hub, "center", stageRect);
    const hubRect = hub.getBoundingClientRect();
    const cards = stage.querySelectorAll(".research-product-card");

    cards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const color = cardAccent(card);
      let start;
      let end;
      let orientation;

      if (cardRect.top >= hubRect.bottom - 8 && Math.abs((cardRect.left + cardRect.width / 2) - (hubRect.left + hubRect.width / 2)) < cardRect.width * 0.45) {
        start = getLocalPoint(hub, "bottom", stageRect);
        end = getLocalPoint(card, "top", stageRect);
        orientation = "vertical";
      } else if (cardRect.right <= hubRect.left) {
        start = getLocalPoint(hub, "left", stageRect);
        end = getLocalPoint(card, "right", stageRect);
        orientation = "horizontal";
      } else if (cardRect.left >= hubRect.right) {
        start = getLocalPoint(hub, "right", stageRect);
        end = getLocalPoint(card, "left", stageRect);
        orientation = "horizontal";
      } else if (cardRect.top > hubRect.top) {
        start = getLocalPoint(hub, "bottom", stageRect);
        end = getLocalPoint(card, "top", stageRect);
        orientation = "vertical";
      } else {
        start = hubCenter;
        end = getLocalPoint(card, "top", stageRect);
        orientation = "vertical";
      }

      if (orientation === "vertical") {
        end.y -= productEndpointClearance;
      } else {
        end.x += end.x < start.x ? productEndpointClearance : -productEndpointClearance;
        start = getEllipseEdgePoint(hub, end, stageRect);
      }

      const pathData = orientation === "vertical"
        ? orthogonalPath(start, end, orientation, (index % 2 ? 6 : -6))
        : `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

      appendPath(svg, pathData, {
        className: "product-path",
        color,
        key: card.dataset.card
      });
      appendDot(dotSvg, start, color, 5.5);
      appendDot(dotSvg, end, color, 5.5);
    });
  }

  function drawMobileConnectors(svg, stageRect, hub, stage) {
    const order = ["bio-response", "sensory", "aromaceuticals", "neuro-cosmetics", "flavors", "homeostasis", "olfactory-system"];
    let startElement = hub;

    order.forEach((cardName) => {
      const card = stage.querySelector(`[data-card="${cardName}"]`);
      if (!card) return;
      const start = getLocalPoint(startElement, "bottom", stageRect);
      const end = getLocalPoint(card, "top", stageRect);
      appendPath(svg, `M ${start.x} ${start.y} V ${end.y - arrowClearance}`, {
        className: "axis-path mobile-path",
        arrow: true
      });
      startElement = card;
    });
  }

  /* ================================================================
     Topic interaction: highlight the connector related to that topic.
     ================================================================ */
  function setupTopicHighlighting() {
    const section = document.getElementById("research-solutions");
    if (!section) return;

    const clearHighlight = () => {
      section.querySelectorAll(".research-connector-path.is-highlighted").forEach((path) => path.classList.remove("is-highlighted"));
    };

    section.querySelectorAll(".research-topic").forEach((topic) => {
      const highlight = () => {
        clearHighlight();
        section.querySelector(`[data-line-key="topic-${topic.dataset.topic}"]`)?.classList.add("is-highlighted");
        section.querySelector(`[data-line-key="${topic.dataset.targetCard}"]`)?.classList.add("is-highlighted");
      };

      topic.addEventListener("mouseenter", highlight);
      topic.addEventListener("mouseleave", clearHighlight);
      topic.addEventListener("focus", highlight);
      topic.addEventListener("blur", clearHighlight);
    });
  }

  /* Site shell updates whenever the language changes. */
  const shellObserver = shell && new MutationObserver(mountInfographic);
  shellObserver?.observe(shell, { childList: true });

  document.addEventListener("DOMContentLoaded", mountInfographic, { once: true });
  window.addEventListener("load", () => {
    mountInfographic();
    hydrateIcons();
    scheduleConnectorUpdate();
  }, { once: true });
  window.addEventListener("resize", scheduleConnectorUpdate, { passive: true });

  mountInfographic();
})();
