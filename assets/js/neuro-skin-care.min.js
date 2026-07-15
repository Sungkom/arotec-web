(() => {
  const root = document.documentElement;
  const body = document.body;
  body.classList.add("is-enhanced");

  const qaMode = new URLSearchParams(window.location.search).get("qa");
  if (qaMode === "section1-stage") {
    body.classList.add("qa-section-one-only");
  }

  const palette = {
    blue: "#1264be",
    purple: "#5b2594",
    green: "#20833c",
    orange: "#e36a15",
    red: "#ce283f",
    brown: "#914f32",
    navy: "#071b4d"
  };

  const DESIGN_WIDTH = 1536;
  const DESIGN_HEIGHT = 1024;

  const referenceLayout = {
    title: { x: 270, y: 0, width: 1000, height: 36 },
    subtitle: { x: 455, y: 36, width: 680, height: 28 },
    stressors: { x: 10, y: 65, width: 1230, height: 92 },
    centralResponse: { x: 67, y: 179, width: 918, height: 235 },
    arrowLegend: { x: 1002, y: 179, width: 236, height: 235 },
    twoCoreSystems: { x: 1260, y: 103, width: 265, height: 721 },
    peripheralTitle: { x: 330, y: 416, width: 510, height: 21 },
    cutaneousNervous: { x: 19, y: 437, width: 286, height: 256 },
    cutaneousImmune: { x: 390, y: 445, width: 313, height: 248 },
    cutaneousEndocrine: { x: 776, y: 445, width: 270, height: 248 },
    communicationPathways: { x: 1089, y: 437, width: 150, height: 263 },
    cellularResponses: { x: 11, y: 715, width: 1080, height: 141 },
    lossOfHomeostasis: { x: 12, y: 880, width: 990, height: 144 },
    lossGroup: { x: 12, y: 856, width: 990, height: 168 },
    clinicalOutcomes: { x: 1056, y: 872, width: 468, height: 151 }
  };

  function toStageBox(box) {
    return {
      position: "absolute",
      left: `${box.x}px`,
      top: `${box.y}px`,
      width: `${box.width}px`,
      height: `${box.height}px`
    };
  }

  function applySectionOneLayout() {
    const stage = document.querySelector("#skin-homeostasis-network");
    if (!stage) return;

    stage.style.setProperty("--design-width", `${DESIGN_WIDTH}px`);
    stage.style.setProperty("--design-height", `${DESIGN_HEIGHT}px`);

    const targets = {
      title: ".s1-canvas-heading h2",
      subtitle: ".s1-canvas-heading > p:last-child",
      stressors: ".stressor-stage",
      centralResponse: ".central-response-stage",
      arrowLegend: ".arrow-legend-card",
      twoCoreSystems: ".core-systems-panel",
      peripheralTitle: "[data-node=\"peripheral-network-title\"]",
      cutaneousNervous: ".nervous-system",
      cutaneousImmune: ".immune-system",
      cutaneousEndocrine: ".endocrine-system",
      communicationPathways: ".communication-card",
      cellularResponses: ".cellular-stage",
      lossGroup: ".loss-mechanisms-wrap",
      clinicalOutcomes: ".clinical-panel"
    };

    Object.entries(targets).forEach(([key, selector]) => {
      const element = stage.querySelector(selector);
      if (element) Object.assign(element.style, toStageBox(referenceLayout[key]));
    });

    stage.querySelectorAll(".neuro-card, .inner-card, .icon-label, figure, figcaption, h3, h4, p, li").forEach((element) => {
      element.dataset.fitCheck = "";
    });
    stage.classList.add("is-reference-layout");
  }

  const connectors = {
    s1: [
      { id: "psychological-to-cns", from: "stress-psychological", fromSide: "bottom", to: "central-response", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "physical-to-cns", from: "stress-physical", fromSide: "bottom", to: "central-response", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "environmental-to-cns", from: "stress-environmental", fromSide: "bottom", to: "central-response", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "uv-to-cns", from: "stress-uv", fromSide: "bottom", to: "central-response", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "pollution-to-cns", from: "stress-pollution", fromSide: "bottom", to: "central-response", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "sleep-to-cns", from: "stress-sleep", fromSide: "bottom", to: "central-response", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },

      { id: "hpa-hypothalamus-crh", from: "hpa-hypothalamus", fromSide: "bottom", to: "hpa-crh", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 1.7, markerSize: "small" },
      { id: "hpa-crh-pituitary", from: "hpa-crh", fromSide: "bottom", to: "hpa-pituitary", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 1.7, markerSize: "small" },
      { id: "hpa-pituitary-acth", from: "hpa-pituitary", fromSide: "bottom", to: "hpa-acth", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 1.7, markerSize: "small" },
      { id: "hpa-acth-adrenal", from: "hpa-acth", fromSide: "bottom", to: "hpa-adrenal", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 1.7, markerSize: "small" },
      { id: "hpa-adrenal-cortisol", from: "hpa-adrenal", fromSide: "bottom", to: "hpa-cortisol", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 1.7, markerSize: "small" },
      { id: "hpa-negative-feedback", from: "hpa-cortisol", fromSide: "left", to: "hpa-hypothalamus", toSide: "left", route: "feedback-left", color: "blue", width: 2, dashed: true, outerMargin: 44, markerSize: "small" },

      { id: "hpa-brain", from: "hpa-axis", fromSide: "right", to: "central-brain", toSide: "left", route: "horizontal", align: "source-y", color: "blue", width: 3, arrowStart: true },
      { id: "brain-autonomic", from: "central-brain", fromSide: "right", to: "autonomic-system", toSide: "left", route: "horizontal", align: "source-y", color: "blue", width: 3, arrowStart: true },
      { id: "sympathetic-neuroimmune", from: "autonomic-sympathetic", fromSide: "bottom", to: "neuroimmune-signaling", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 1.8, markerSize: "small" },
      { id: "parasympathetic-neuroimmune", from: "autonomic-parasympathetic", fromSide: "bottom", to: "neuroimmune-signaling", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 1.8, markerSize: "small" },

      { id: "hpa-to-cutaneous-nervous", from: "hpa-axis", fromSide: "bottom", to: "cutaneous-nervous", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 3 },
      { id: "brain-to-peripheral-network", from: "central-brain", fromSide: "bottom", to: "peripheral-network-title", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "neuroimmune-to-cutaneous-endocrine", from: "neuroimmune-signaling", fromSide: "bottom", to: "cutaneous-endocrine", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 3 },

      { id: "nervous-immune", from: "cutaneous-nervous", fromSide: "right", to: "cutaneous-immune", toSide: "left", route: "horizontal", align: "source-y", color: "purple", width: 3, arrowStart: true },
      { id: "immune-endocrine", from: "cutaneous-immune", fromSide: "right", to: "cutaneous-endocrine", toSide: "left", route: "horizontal", align: "source-y", color: "orange", width: 3, arrowStart: true },
      { id: "endocrine-neural-pathway", from: "cutaneous-endocrine", fromSide: "right", to: "pathway-neural", toSide: "left", route: "horizontal", align: "target-y", color: "purple", width: 2.2, markerSize: "small" },
      { id: "endocrine-humoral-pathway", from: "cutaneous-endocrine", fromSide: "right", to: "pathway-humoral", toSide: "left", route: "horizontal", align: "target-y", color: "green", width: 2.2, markerSize: "small" },
      { id: "endocrine-paracrine-pathway", from: "cutaneous-endocrine", fromSide: "right", to: "pathway-paracrine", toSide: "left", route: "horizontal", align: "target-y", color: "purple", width: 2, dashed: true, markerSize: "small" },
      { id: "endocrine-systemic-pathway", from: "cutaneous-endocrine", fromSide: "right", to: "pathway-endocrine", toSide: "left", route: "horizontal", align: "target-y", color: "blue", width: 2.2, markerSize: "small" },

      { id: "nervous-to-cellular", from: "cutaneous-nervous", fromSide: "bottom", to: "cellular-responses", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "immune-to-cellular", from: "cutaneous-immune", fromSide: "bottom", to: "cellular-responses", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "endocrine-to-cellular", from: "cutaneous-endocrine", fromSide: "bottom", to: "cellular-responses", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.6 },
      { id: "cellular-to-homeostasis-loss", from: "cellular-responses", fromSide: "bottom", to: "homeostasis-loss", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 3.2 },
      { id: "homeostasis-loss-to-clinical", from: "loss-mechanisms", fromSide: "right", to: "clinical-outcomes", toSide: "left", route: "horizontal", align: "source-y", color: "blue", width: 3.2 },

      { id: "core-brain-immune", from: "core-brain", fromSide: "bottom", to: "core-immune", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.4, markerSize: "small" },
      { id: "core-immune-skin", from: "core-immune", fromSide: "bottom", to: "core-skin", toSide: "top", route: "vertical", align: "source-x", color: "blue", width: 2.4, markerSize: "small" },
      { id: "core-nervous-endocrine", from: "core-nervous", fromSide: "right", to: "core-endocrine", toSide: "top", route: "arc", arcBend: -54, color: "purple", width: 2.4, markerSize: "small" },
      { id: "core-endocrine-immune", from: "core-endocrine", fromSide: "left", to: "core-immune-axis", toSide: "right", route: "arc", arcBend: -52, color: "orange", width: 2.4, markerSize: "small" },
      { id: "core-immune-nervous", from: "core-immune-axis", fromSide: "top", to: "core-nervous", toSide: "left", route: "arc", arcBend: -54, color: "green", width: 2.4, markerSize: "small" }
    ],
    s2: [
      ["axis-brain", "bottom", "modulating-pathways", "top", "purple", "dashed", "vertical"],
      ["modulating-pathways", "bottom", "axis-skin", "top", "purple", "dashed", "vertical"],
      ["axis-skin", "bottom", "target-cells", "top", "purple", "solid", "vertical"],
      ["target-cells", "bottom", "regulated-functions", "top", "purple", "solid", "vertical"]
    ],
    s3loop: [
      ["feedback-left-stressors", "bottom", "feedback-brain", "top", "red", "solid", "vertical"],
      ["feedback-right-stressors", "bottom", "feedback-upper-skin", "top", "red", "solid", "vertical"],
      ["feedback-brain", "right", "feedback-hpa", "left", "navy", "solid", "horizontal"],
      ["feedback-brain", "right", "feedback-ans", "left", "navy", "solid", "horizontal"],
      ["feedback-ans", "right", "feedback-sam", "left", "navy", "bidirectional", "horizontal"],
      ["feedback-hpa", "right", "feedback-upper-skin", "left", "red", "solid", "horizontal"],
      ["feedback-sam", "right", "feedback-upper-skin", "left", "navy", "solid", "horizontal"],
      ["feedback-vagus", "right", "feedback-upper-skin", "left", "blue", "solid", "horizontal"],
      ["feedback-upper-skin", "left", "feedback-chpa", "right", "purple", "solid", "horizontal"],
      ["feedback-chpa", "left", "feedback-brain", "right", "red", "dashed", "horizontal"],
      ["feedback-lower-skin", "left", "feedback-sensory", "right", "green", "solid", "horizontal"],
      ["feedback-sensory", "left", "feedback-brain", "right", "purple", "dashed", "horizontal"]
    ],
    s3: [
      ["direct-stressors", "bottom", "direct-mediators", "top", "red", "solid", "vertical"],
      ["direct-targets", "right", "direct-skin", "left", "purple", "solid", "horizontal"],
      ["direct-mediators", "bottom", "direct-skin", "top", "red", "solid", "vertical"],
      ["signaling-activation", "left", "direct-skin", "right", "blue", "bidirectional", "horizontal"],
      ["direct-skin", "bottom", "tissue-effects", "top", "blue", "solid", "vertical"],
      ["tissue-effects", "bottom", "direct-outcomes", "top", "red", "solid", "vertical"]
    ],
    s4: [
      ["barrier-stressors", "right", "barrier-mediators", "left", "red", "solid", "horizontal"],
      ["barrier-mediators", "bottom", "action-cells", "top", "purple", "solid", "vertical"],
      ["action-cells", "bottom", "molecular-responses", "top", "purple", "solid", "vertical"],
      ["molecular-responses", "bottom", "barrier-result", "top", "purple", "solid", "vertical"],
      ["barrier-mediators", "right", "barrier-comparison", "left", "purple", "solid", "horizontal"],
      ["barrier-comparison", "bottom", "barrier-consequences", "top", "purple", "solid", "vertical"],
      ["barrier-result", "right", "barrier-consequences", "left", "red", "solid", "horizontal"]
    ],
    s5: [
      ["sadi-formula", "bottom", "ebii", "top", "purple", "dashed", "vertical"],
      ["ebii", "right", "shs", "left", "purple", "solid", "horizontal"],
      ["shs", "right", "dshs", "left", "blue", "solid", "horizontal"],
      ["dshs", "right", "saf", "left", "blue", "solid", "horizontal"],
      ["saf", "right", "sadi", "left", "red", "solid", "horizontal"],
      ["sadi", "bottom", "sadi-formula", "right", "red", "dashed", "orthogonal"]
    ],
    s6: [
      ["mechanisms", "bottom", "benefits", "top", "purple", "solid", "vertical"],
      ["benefit-problem", "right", "benefit-barrier", "left", "blue", "solid", "horizontal"],
      ["benefit-problem", "right", "benefit-calm", "left", "blue", "solid", "horizontal"],
      ["benefit-problem", "right", "benefit-bright", "left", "blue", "solid", "horizontal"],
      ["benefit-problem", "right", "benefit-aging", "left", "blue", "solid", "horizontal"],
      ["benefit-problem", "right", "benefit-mind", "left", "blue", "solid", "horizontal"],
      ["benefits", "bottom", "ingredients", "top", "green", "solid", "vertical"]
    ]
  };

  const svgNS = "http://www.w3.org/2000/svg";
  applySectionOneLayout();
  const stages = Array.from(document.querySelectorAll("[data-stage]"));
  const stageState = new WeakMap();

  function createSvgElement(name, attributes = {}) {
    const element = document.createElementNS(svgNS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function localBounds(element, stageRect) {
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left - stageRect.left,
      right: rect.right - stageRect.left,
      top: rect.top - stageRect.top,
      bottom: rect.bottom - stageRect.top,
      centerX: rect.left - stageRect.left + rect.width / 2,
      centerY: rect.top - stageRect.top + rect.height / 2
    };
  }

  function getAnchor(element, side, stageRect, offsetX = 0, offsetY = 0) {
    const bounds = localBounds(element, stageRect);
    let point;
    if (side === "top") point = { x: bounds.centerX, y: bounds.top };
    else if (side === "bottom") point = { x: bounds.centerX, y: bounds.bottom };
    else if (side === "left") point = { x: bounds.left, y: bounds.centerY };
    else if (side === "right") point = { x: bounds.right, y: bounds.centerY };
    else point = { x: bounds.centerX, y: bounds.centerY };
    return { x: point.x + offsetX, y: point.y + offsetY };
  }

  function normalizeConnector(raw, stageId, index) {
    if (!Array.isArray(raw)) {
      return {
        arrowEnd: true,
        markerSize: "normal",
        width: 3,
        ...raw
      };
    }
    const [from, fromSide, to, toSide, color, style, route] = raw;
    return {
      id: `${stageId}-${from}-${to}-${index}`,
      from,
      fromSide,
      to,
      toSide,
      color,
      route,
      width: 3,
      arrowStart: style === "bidirectional",
      arrowEnd: true,
      dashed: style === "dashed",
      markerSize: "normal",
      legacy: true
    };
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function alignConnectorPoints(start, end, fromBounds, toBounds, config) {
    if (config.align === "source-x") end.x = clamp(start.x, toBounds.left + 2, toBounds.right - 2);
    if (config.align === "target-x") start.x = clamp(end.x, fromBounds.left + 2, fromBounds.right - 2);
    if (config.align === "source-y") end.y = clamp(start.y, toBounds.top + 2, toBounds.bottom - 2);
    if (config.align === "target-y") start.y = clamp(end.y, fromBounds.top + 2, fromBounds.bottom - 2);
  }

  function pathData(start, end, config) {
    const route = config.route || "straight";
    if (config.legacy && route === "horizontal") {
      const bend = Math.max(8, Math.min(72, Math.abs(end.x - start.x) * 0.42));
      const direction = end.x >= start.x ? 1 : -1;
      const controls = [{ x: start.x + bend * direction, y: start.y }, { x: end.x - bend * direction, y: end.y }];
      return { d: `M ${start.x} ${start.y} C ${controls[0].x} ${controls[0].y}, ${controls[1].x} ${controls[1].y}, ${end.x} ${end.y}`, controls };
    }
    if (config.legacy && route === "vertical") {
      const bend = Math.max(8, Math.min(72, Math.abs(end.y - start.y) * 0.42));
      const direction = end.y >= start.y ? 1 : -1;
      const controls = [{ x: start.x, y: start.y + bend * direction }, { x: end.x, y: end.y - bend * direction }];
      return { d: `M ${start.x} ${start.y} C ${controls[0].x} ${controls[0].y}, ${controls[1].x} ${controls[1].y}, ${end.x} ${end.y}`, controls };
    }
    if (route === "horizontal" || route === "vertical" || route === "straight") {
      return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, controls: [] };
    }
    if (route === "orthogonal") {
      const midX = start.x + (end.x - start.x) * 0.55;
      return { d: `M ${start.x} ${start.y} H ${midX} V ${end.y} H ${end.x}`, controls: [{ x: midX, y: start.y }, { x: midX, y: end.y }] };
    }
    if (route === "feedback-left") {
      const outerX = Math.min(start.x, end.x) - (config.outerMargin || 36);
      const direction = end.y >= start.y ? 1 : -1;
      const radius = Math.min(10, Math.abs(end.y - start.y) / 4);
      const startTurnY = start.y + radius * direction;
      const endTurnY = end.y - radius * direction;
      return {
        d: `M ${start.x} ${start.y} H ${outerX + radius} Q ${outerX} ${start.y} ${outerX} ${startTurnY} V ${endTurnY} Q ${outerX} ${end.y} ${outerX + radius} ${end.y} H ${end.x}`,
        controls: [{ x: outerX, y: start.y }, { x: outerX, y: end.y }]
      };
    }
    if (route === "arc") {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const bend = config.arcBend || 42;
      const control = {
        x: (start.x + end.x) / 2 + (-dy / distance) * bend,
        y: (start.y + end.y) / 2 + (dx / distance) * bend
      };
      return { d: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`, controls: [control] };
    }
    const bend = Math.max(8, Math.min(72, Math.abs(end.y - start.y) * 0.42));
    const direction = end.y >= start.y ? 1 : -1;
    const controls = [{ x: start.x, y: start.y + bend * direction }, { x: end.x, y: end.y - bend * direction }];
    return { d: `M ${start.x} ${start.y} C ${controls[0].x} ${controls[0].y}, ${controls[1].x} ${controls[1].y}, ${end.x} ${end.y}`, controls };
  }

  function ensureMarkers(svg, stageId) {
    const defs = createSvgElement("defs");
    Object.entries(palette).forEach(([name, color]) => {
      [["normal", 8], ["small", 6]].forEach(([sizeName, size]) => {
        const marker = createSvgElement("marker", {
          id: `${stageId}-${name}-arrow-${sizeName}`,
          viewBox: "0 0 10 10",
          refX: "10",
          refY: "5",
          markerWidth: `${size}`,
          markerHeight: `${size}`,
          orient: "auto-start-reverse",
          markerUnits: "userSpaceOnUse",
          overflow: "visible"
        });
        marker.append(createSvgElement("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: color }));
        defs.append(marker);
      });
    });
    svg.append(defs);
  }

  function appendConnectorDebug(svg, config, start, end, controls) {
    const group = createSvgElement("g", { class: "connector-debug", "data-connector-debug": config.id });
    group.append(createSvgElement("circle", { class: "debug-source", cx: start.x, cy: start.y, r: 4 }));
    group.append(createSvgElement("circle", { class: "debug-target", cx: end.x, cy: end.y, r: 4 }));
    controls.forEach((point) => group.append(createSvgElement("circle", { class: "debug-control", cx: point.x, cy: point.y, r: 3 })));
    const label = createSvgElement("text", {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2 - 6,
      "text-anchor": "middle"
    });
    label.textContent = `${config.id}: ${config.from} -> ${config.to}`;
    group.append(label);
    svg.append(group);
  }

  function clearLinkedState(state) {
    state.paths.forEach(({ path, from, to }) => {
      path.classList.remove("is-linked");
      from.classList.remove("is-linked");
      to.classList.remove("is-linked");
    });
  }

  function bindNodeHover(stage, node) {
    if (node.dataset.connectorHoverBound === "true") return;
    node.dataset.connectorHoverBound = "true";
    node.addEventListener("mouseenter", () => {
      const state = stageState.get(stage);
      if (!state) return;
      clearLinkedState(state);
      state.paths.forEach((item) => {
        if (item.from !== node && item.to !== node) return;
        item.path.classList.add("is-linked");
        item.from.classList.add("is-linked");
        item.to.classList.add("is-linked");
      });
    });
    node.addEventListener("mouseleave", () => {
      const state = stageState.get(stage);
      if (state) clearLinkedState(state);
    });
  }

  function renderStage(stage) {
    const stageId = stage.dataset.stage;
    const svg = stage.querySelector("[data-connector-layer]");
    if (!svg || !connectors[stageId]) return;
    const rect = stage.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${rect.width} ${rect.height}`);
    svg.replaceChildren();
    ensureMarkers(svg, stageId);
    const state = { paths: [] };

    connectors[stageId].forEach((rawConnector, index) => {
      const config = normalizeConnector(rawConnector, stageId, index);
      const from = stage.querySelector(`[data-node="${config.from}"]`);
      const to = stage.querySelector(`[data-node="${config.to}"]`);
      if (!from || !to) return;
      const fromBounds = localBounds(from, rect);
      const toBounds = localBounds(to, rect);
      const start = getAnchor(from, config.fromSide || "center", rect, config.fromOffsetX || 0, config.fromOffsetY || 0);
      const end = getAnchor(to, config.toSide || "center", rect, config.toOffsetX || 0, config.toOffsetY || 0);
      alignConnectorPoints(start, end, fromBounds, toBounds, config);
      const route = pathData(start, end, config);
      const colorName = config.color || "blue";
      const color = palette[colorName] || palette.blue;
      const markerId = `${stageId}-${colorName}-arrow-${config.markerSize || "normal"}`;
      const path = createSvgElement("path", {
        d: route.d,
        stroke: color,
        "data-connector-id": config.id,
        "data-from": config.from,
        "data-from-side": config.fromSide || "center",
        "data-to": config.to,
        "data-to-side": config.toSide || "center",
        "data-route": config.route || "straight",
        "data-color": colorName
      });
      path.style.setProperty("--connector-width", `${config.width || 3}px`);
      path.style.color = color;
      if (config.arrowEnd !== false) path.setAttribute("marker-end", `url(#${markerId})`);
      if (config.arrowStart) path.setAttribute("marker-start", `url(#${markerId})`);
      if (config.dashed) path.classList.add("is-dashed", "is-animated");
      svg.append(path);
      state.paths.push({ path, from, to });
      bindNodeHover(stage, from);
      bindNodeHover(stage, to);
      appendConnectorDebug(svg, config, start, end, route.controls || []);
    });

    stageState.set(stage, state);
    if (stage.classList.contains("is-stage-visible")) animatePaths(stage);
  }

  function animatePaths(stage) {
    const state = stageState.get(stage);
    if (!state) return;
    state.paths.forEach(({ path }, index) => {
      if (path.classList.contains("is-dashed") || path.dataset.drawn === "true") return;
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.transition = `stroke-dashoffset 720ms ease ${index * 55}ms`;
      requestAnimationFrame(() => {
        path.style.strokeDashoffset = "0";
        path.dataset.drawn = "true";
      });
    });
  }

  let renderFrame = 0;
  let connectorAssetsReady = false;

  function updateOverflowMarkers() {
    document.querySelectorAll(".stage-s1 [data-fit-check]").forEach((element) => {
      const isOverflowing = element.scrollHeight > element.clientHeight + 1 || element.scrollWidth > element.clientWidth + 1;
      element.classList.toggle("is-overflowing", isOverflowing);
    });
  }

  function scheduleRender() {
    if (!connectorAssetsReady) return;
    cancelAnimationFrame(renderFrame);
    renderFrame = requestAnimationFrame(() => {
      stages.forEach(renderStage);
      updateOverflowMarkers();
    });
  }

  stages.forEach((stage) => {
    const observer = new ResizeObserver(scheduleRender);
    observer.observe(stage);
    stage.querySelectorAll("[data-node]").forEach((node) => observer.observe(node));
    stage.querySelectorAll("img").forEach((image) => {
      if (!image.complete) image.addEventListener("load", scheduleRender, { once: true });
    });
  });

  const connectorImageReadiness = Array.from(document.images, (image) => {
    if (image.complete) return Promise.resolve();
    return new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true });
      image.addEventListener("error", resolve, { once: true });
    });
  });
  Promise.all([document.fonts?.ready || Promise.resolve(), ...connectorImageReadiness]).then(() => {
    connectorAssetsReady = true;
    requestAnimationFrame(() => requestAnimationFrame(scheduleRender));
  });
  window.addEventListener("resize", scheduleRender, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleRender, { passive: true });
  window.addEventListener("load", scheduleRender, { once: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const stage = entry.target;
      stage.classList.add("is-stage-visible");
      const revealItems = stage.querySelectorAll(".neuro-card, .axis-brain, .direct-skin-visual, .sadi-formula-card");
      revealItems.forEach((item, index) => {
        window.setTimeout(() => item.classList.add("is-revealed"), Math.min(index * 36, 540));
      });
      animatePaths(stage);
      revealObserver.unobserve(stage);
    });
  }, { rootMargin: "0px 0px -2%", threshold: 0.02 });
  stages.forEach((stage) => revealObserver.observe(stage));

  const sectionLinks = Array.from(document.querySelectorAll("[data-neuro-progress-nav] a"));
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

  function getStickyOffset() {
    const headerHeight = document.querySelector(".site-header")?.getBoundingClientRect().height || 0;
    const progressHeight = document.querySelector("[data-neuro-progress-nav]")?.getBoundingClientRect().height || 0;
    return headerHeight + progressHeight + 14;
  }

  function scrollToSectionHash(hash, behavior = "smooth") {
    if (!hash || hash === "#") return;
    const target = document.querySelector(hash);
    if (!target) return;
    const top = window.scrollY + target.getBoundingClientRect().top - getStickyOffset();
    window.scrollTo({ top: Math.max(0, top), behavior });
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash?.startsWith("#")) return;
      event.preventDefault();
      history.pushState(null, "", hash);
      scrollToSectionHash(hash);
    });
  });

  window.addEventListener("hashchange", () => scrollToSectionHash(window.location.hash));

  if (window.location.hash) {
    const initialHash = window.location.hash;
    const imageReadiness = Array.from(document.images, (image) => {
      if (image.complete) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    });
    Promise.all([document.fonts?.ready || Promise.resolve(), ...imageReadiness]).then(() => {
      requestAnimationFrame(() => scrollToSectionHash(initialHash, "auto"));
    });
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-32% 0px -56%", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  const progressBar = document.querySelector("[data-neuro-progress]");
  const backToTop = document.querySelector("[data-back-to-top]");
  function updatePageProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    if (progressBar) progressBar.style.width = `${value * 100}%`;
    backToTop?.classList.toggle("is-visible", window.scrollY > 900);
  }
  window.addEventListener("scroll", updatePageProgress, { passive: true });
  updatePageProgress();
  backToTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const formulaTerms = Array.from(document.querySelectorAll(".sadi-formula-card .formula > *"));
  let formulaIndex = 0;
  if (formulaTerms.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      formulaTerms.forEach((term, index) => term.classList.toggle("is-formula-active", index === formulaIndex));
      formulaIndex = (formulaIndex + 1) % formulaTerms.length;
    }, 1100);
  }

  const debugClass = {
    r: "show-reference",
    g: "show-grid",
    h: "show-outlines",
    a: "show-anchors"
  };
  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || event.target.matches("input, textarea, select")) return;
    const className = debugClass[event.key.toLowerCase()];
    if (!className) return;
    body.classList.toggle(className);
    scheduleRender();
  });

  root.style.setProperty("--neuro-js-ready", "1");
  scheduleRender();
})();
