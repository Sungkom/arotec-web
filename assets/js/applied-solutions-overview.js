(() => {
  "use strict";
  const stage = document.querySelector(".aso-stage");
  const artwork = stage?.querySelector(".aso-background");
  if (stage && artwork) {
    const desktop = matchMedia("(width > 900px)");
    // Coordinates belong to the source illustration, before object-fit cropping.
    const targets = [
      ["sensory", .242, .61],
      ["flavors", .413, .54],
      ["ingredients", .5575, .64],
      ["supplements", .7205, .66],
    ];
    const ribbonTop = [
      [0, .72], [.05, .65], [.1, .63], [.15, .595], [.2, .56],
      [.25, .53], [.3, .51], [.35, .45], [.4, .405], [.43, .405],
      [.46, .44], [.5, .50], [.55, .535], [.6, .54], [.65, .54],
      [.7, .555], [.75, .60], [.8, .66], [.85, .66], [.9, .58],
      [.93, .575], [.95, .65], [1, .68],
    ];
    const edgeAt = (x) => {
      x = Math.max(0, Math.min(1, x));
      const i = ribbonTop.findIndex(([point]) => point >= x);
      if (i === 0) return ribbonTop[0][1];
      const [x0, y0] = ribbonTop[i - 1], [x1, y1] = ribbonTop[i];
      return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    };
    const set = (element, name, value) => {
      if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
    };
    let frame;
    const layout = () => {
      frame = null;
      if (!desktop.matches || !artwork.naturalWidth) return;
      const box = stage.getBoundingClientRect();
      const ratio = artwork.naturalHeight / artwork.naturalWidth;
      const contain = getComputedStyle(artwork).objectFit === "contain";
      const artHeight = (contain ? Math.min : Math.max)(box.height, box.width * ratio);
      const artWidth = artHeight / ratio;
      const artLeft = box.left + (box.width - artWidth) / 2;
      const artTop = box.top + box.height - artHeight;
      const entries = targets.map(([name, x, y]) => {
        const node = stage.querySelector(`.aso-node--${name}`);
        const range = document.createRange();
        range.selectNodeContents(node.querySelector("h2"));
        const title = range.getBoundingClientRect();
        const link = node.querySelector("a").getBoundingClientRect();
        const left = (Math.min(title.left, link.left) - artLeft) / artWidth;
        const right = (Math.max(title.right, link.right) - artLeft) / artWidth;
        const edge = Math.min(edgeAt(left), edgeAt(right), ...ribbonTop.filter(([px]) => px > left && px < right).map(([, py]) => py));
        return { node, x, y, edge, bottom: Math.max(title.bottom, link.bottom) + 20 };
      });
      // Crop only the empty floor. Longer translations may grow the scene so
      // labels, their clearance and the entire ribbon remain visible.
      const ribbonBottom = .84;
      const contentHeight = Math.ceil(Math.max(...entries.map(({ bottom, edge }) => {
        const space = bottom - box.top;
        const minimum = space + (ribbonBottom - edge) * box.width * ratio;
        return contain ? minimum : Math.max(minimum, space / (1 - ribbonBottom + edge));
      })));
      set(stage, "--aso-content-height", `${contentHeight}px`);
      const offset = Math.max(0, ...entries.map(({ bottom, edge }) => bottom - artTop - edge * artHeight));
      set(stage, "--aso-art-offset", `${offset.toFixed(2)}px`);
      entries.forEach(({ node, x, y }) => {
        const leader = node.querySelector(".aso-leader");
        const style = getComputedStyle(leader);
        const nodeBox = node.getBoundingClientRect();
        const startX = nodeBox.left + parseFloat(style.left) + .5;
        const startY = nodeBox.bottom + parseFloat(style.marginTop);
        const dx = artLeft + x * artWidth - startX;
        const dy = artTop + offset + y * artHeight - startY;
        set(leader, "--aso-leader-length", `${Math.hypot(dx, dy).toFixed(2)}px`);
        set(leader, "--aso-leader-angle", `${(-Math.atan2(dx, dy) * 180 / Math.PI).toFixed(4)}deg`);
      });
    };
    const schedule = () => { if (frame == null) frame = requestAnimationFrame(layout); };
    const observer = new ResizeObserver(schedule);
    [stage, stage.querySelector(".aso-heading"), stage.querySelector(".aso-areas")].forEach((node) => observer.observe(node));
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("arotec:languagechange", schedule);
    document.fonts.ready.then(schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    artwork.addEventListener("load", schedule);
    schedule();
  }
  document.querySelectorAll("[data-aso-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.getElementById(button.dataset.asoDialog);
      if (dialog && !dialog.open) dialog.showModal();
    });
  });
  document.querySelectorAll(".aso-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });
})();
