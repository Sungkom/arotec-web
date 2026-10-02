(() => {
  const DESIGN_WIDTH = 1617;
  const DESIGN_HEIGHT = 972;
  const stage = document.querySelector("#brain-skin-loop-stage");
  const back = document.querySelector("#connectors-back");
  const front = document.querySelector("#connectors-front");
  if (!stage || !back || !front) return;

  const layout = {
    hypothalamus: { x: 274, y: 153, width: 172, height: 44 },
    crhTop: { x: 496, y: 155, width: 84, height: 42 },
    pituitary: { x: 644, y: 153, width: 114, height: 45 },
    acthTop: { x: 814, y: 154, width: 100, height: 44 },
    adrenalGland: { x: 987, y: 145, width: 113, height: 68 },
    glucocorticoidTop: { x: 1166, y: 155, width: 163, height: 43 },
    cortisolTop: { x: 1273, y: 263, width: 99, height: 44 },
    autonomic: { x: 322, y: 330, width: 174, height: 77 },
    sympathetic: { x: 584, y: 319, width: 147, height: 44 },
    adrenalMedullary: { x: 786, y: 307, width: 256, height: 67 },
    parasympathetic: { x: 584, y: 384, width: 192, height: 45 },
    acetylcholine: { x: 837, y: 388, width: 207, height: 45 },
    pomcTop: { x: 497, y: 483, width: 104, height: 44 },
    alphaMsh: { x: 698, y: 483, width: 113, height: 44 },
    melanocytes: { x: 883, y: 483, width: 146, height: 44 },
    melanin: { x: 1088, y: 482, width: 105, height: 44 },
    limbicSystem: { x: 92, y: 546, width: 125, height: 75 },
    cortisolBottom: { x: 296, y: 571, width: 101, height: 44 },
    glucocorticoidBottom: { x: 465, y: 570, width: 180, height: 45 },
    acthBottom: { x: 687, y: 571, width: 99, height: 44 },
    pomcBottom: { x: 858, y: 570, width: 101, height: 45 },
    crhBottom: { x: 1049, y: 571, width: 78, height: 44 },
    keratinocyte: { x: 1236, y: 570, width: 172, height: 45 },
    immuneNeuronGroup: { x: 732, y: 666, width: 240, height: 67 },
    histamine: { x: 792, y: 776, width: 119, height: 44 },
    substanceP: { x: 727, y: 874, width: 207, height: 44 }
  };

  document.querySelectorAll("[data-card]").forEach((element) => {
    const box = layout[element.dataset.card];
    if (!box) return;
    Object.assign(element.style, {
      left: `${box.x}px`,
      top: `${box.y}px`,
      width: `${box.width}px`,
      height: `${box.height}px`
    });
  });

  const svgNS = "http://www.w3.org/2000/svg";
  const node = (name, attrs = {}) => {
    const element = document.createElementNS(svgNS, name);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  };

  const defs = () => `
    <defs>
      <marker id="arrow-black" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10 Z" fill="#111111" /></marker>
      <marker id="arrow-red" markerWidth="11" markerHeight="11" refX="11" refY="5.5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L11,5.5 L0,11 Z" fill="#e01b1b" /></marker>
      <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L10,5 L0,10 Z" fill="#2776bf" /></marker>
    </defs>`;

  function stagePoint(id, side) {
    const element = document.querySelector(`#${id}`);
    const stageRect = stage.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    const point = {
      left: { x: rect.left - stageRect.left, y: rect.top - stageRect.top + rect.height / 2 },
      right: { x: rect.right - stageRect.left, y: rect.top - stageRect.top + rect.height / 2 },
      top: { x: rect.left - stageRect.left + rect.width / 2, y: rect.top - stageRect.top },
      bottom: { x: rect.left - stageRect.left + rect.width / 2, y: rect.bottom - stageRect.top }
    };
    return point[side];
  }

  function elementPoint(id, side) {
    return stagePoint(id, side);
  }

  function path(d, className = "black", options = {}) {
    const element = node("path", {
      d,
      class: `connector ${className}${options.dashed ? " dashed" : ""}`,
      "marker-end": options.end === false ? "" : `url(#arrow-${className})`,
      "marker-start": options.start ? `url(#arrow-${className})` : "",
      "stroke-width": options.width || "2.3"
    });
    return element;
  }

  function lineBetween(fromId, fromSide, toId, toSide, className = "black", options = {}) {
    const a = stagePoint(fromId, fromSide);
    const b = stagePoint(toId, toSide);
    return path(`M ${a.x} ${a.y} L ${b.x} ${b.y}`, className, options);
  }

  function polyline(points, className = "black", options = {}) {
    return path(`M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")}`, className, options);
  }

  function renderConnectors() {
    back.replaceChildren();
    front.replaceChildren();
    back.insertAdjacentHTML("beforeend", defs());
    front.insertAdjacentHTML("beforeend", defs());

    const appendBack = (...items) => items.forEach((item) => back.append(item));
    const appendFront = (...items) => items.forEach((item) => front.append(item));

    const brainRight = { x: 224, y: 365 };
    const hypo = stagePoint("hypothalamus", "left");
    const autonomic = stagePoint("autonomic", "left");
    const limbicTop = stagePoint("limbic-system", "top");

    appendBack(
      polyline([[brainRight.x, brainRight.y], [240, brainRight.y], [240, hypo.y], [hypo.x, hypo.y]], "black"),
      polyline([[240, brainRight.y], [240, autonomic.y], [autonomic.x, autonomic.y]], "black"),
      polyline([[143, 508], [143, limbicTop.y]], "black"),
      polyline([[727, 896], [280, 896], [280, 206], [hypo.x, 206], [hypo.x, hypo.y]], "black"),
      lineBetween("hypothalamus", "right", "crh-top", "left"),
      lineBetween("crh-top", "right", "pituitary", "left"),
      lineBetween("pituitary", "right", "acth-top", "left"),
      lineBetween("acth-top", "right", "adrenal-gland", "left"),
      lineBetween("adrenal-gland", "right", "glucocorticoid-top", "left"),
      lineBetween("glucocorticoid-top", "bottom", "cortisol-top", "top"),
      polyline([
        [elementPoint("autonomic", "right").x, 352],
        [546, 352],
        [546, elementPoint("sympathetic", "left").y],
        [elementPoint("sympathetic", "left").x, elementPoint("sympathetic", "left").y]
      ], "black"),
      lineBetween("sympathetic", "right", "adrenal-medullary", "left"),
      polyline([[1042, 340], [1101, 340], [1101, 340], [1115, 340]], "black"),
      polyline([[1172, 340], [1379, 391]], "black"),
      polyline([
        [elementPoint("autonomic", "right").x, 399],
        [546, 399],
        [546, elementPoint("parasympathetic", "left").y],
        [elementPoint("parasympathetic", "left").x, elementPoint("parasympathetic", "left").y]
      ], "black"),
      lineBetween("parasympathetic", "right", "acetylcholine", "left"),
      polyline([[1044, 410], [1098, 410], [1098, 410], [1115, 410]], "black"),
      polyline([[1182, 410], [1379, 418]], "black"),
      lineBetween("pomc-top", "right", "alpha-msh", "left"),
      lineBetween("alpha-msh", "right", "melanocytes", "left"),
      lineBetween("melanocytes", "right", "melanin", "left"),
      lineBetween("melanin", "right", "skin-barrier-pigmentation-label", "left"),
      lineBetween("keratinocyte", "left", "crh-bottom", "right"),
      lineBetween("crh-bottom", "left", "pomc-bottom", "right"),
      lineBetween("pomc-bottom", "left", "acth-bottom", "right"),
      lineBetween("acth-bottom", "left", "glucocorticoid-bottom", "right"),
      lineBetween("glucocorticoid-bottom", "left", "cortisol-bottom", "right"),
      lineBetween("cortisol-bottom", "left", "limbic-system", "right"),
      lineBetween("immune-neuron-group", "bottom", "histamine", "top"),
      lineBetween("histamine", "bottom", "substance-p", "top"),
      polyline([[760, 874], [760, 744], [760, 733]], "black")
    );

    appendFront(
      polyline([[541, 198], [541, 475]], "blue", { dashed: true, width: 2 }),
      polyline([[1373, 286], [1389, 341], [1394, 390]], "black"),
      polyline([[1392, 499], [1340, 562], [1323, 570]], "black"),
      polyline([[1088, 615], [968, 676]], "black"),
      polyline([[119, 242], [119, 311]], "red", { width: 6 }),
      polyline([[1468, 243], [1468, 317]], "red", { width: 6 })
    );
  }

  let overlayOn = false;
  window.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() !== "r" || event.metaKey || event.ctrlKey || event.altKey) return;
    overlayOn = !overlayOn;
    stage.style.setProperty("--reference-opacity", overlayOn ? ".32" : "0");
  });

  const refresh = () => requestAnimationFrame(renderConnectors);
  window.addEventListener("load", refresh, { once: true });
  window.addEventListener("resize", refresh);
  new ResizeObserver(refresh).observe(stage);
  if (document.fonts?.ready) document.fonts.ready.then(refresh);
  refresh();

  window.brainSkinLoop = { DESIGN_WIDTH, DESIGN_HEIGHT, layout, refresh };
})();
