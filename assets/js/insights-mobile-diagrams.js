(() => {
  "use strict";

  // Authored percentage anchors survive cloning; only rendered positions reflow.
  const watchLabelLayout = (target) => {
    const labels = [...target.querySelectorAll(":scope > .isb-map-label")];
    const bases = new Map(labels.map((label) => {
      for (const property of ["left", "top", "width"]) {
        const key = `isbAuthored${property[0].toUpperCase()}${property.slice(1)}`;
        if (!(key in label.dataset)) label.dataset[key] = label.style[property];
      }
      return [label, {
        left: parseFloat(label.dataset.isbAuthoredLeft),
        top: parseFloat(label.dataset.isbAuthoredTop),
        width: parseFloat(label.dataset.isbAuthoredWidth)
      }];
    }));
    const headings = labels.filter((label) => label.classList.contains("isb-map-heading"));
    const numbers = labels.filter((label) => label.classList.contains("isb-map-number"));
    const captions = labels.filter((label) => label.classList.contains("isb-map-caption"));
    let frame = 0;
    let stopped = false;
    const layout = () => {
      frame = 0;
      if (stopped || !target.isConnected || !target.clientWidth) return;
      const width = target.clientWidth;
      const height = target.clientHeight;
      for (const [label, base] of bases) {
        label.style.left = `${base.left}%`;
        label.style.top = `${base.top}%`;
        label.style.width = `${base.width}%`;
      }
      for (const number of numbers) {
        const origin = bases.get(number);
        const heading = headings.filter((label) => {
          const base = bases.get(label);
          return base.left > origin.left && base.left - origin.left < 10 && Math.abs(base.top - origin.top) < 6;
        }).sort((a, b) => {
          const score = (label) => Math.abs(bases.get(label).top - origin.top) * 4 + bases.get(label).left - origin.left;
          return score(a) - score(b);
        })[0];
        if (!heading) continue;
        heading.dataset.isbNumber = number.textContent.trim();
        const base = bases.get(heading);
        const scale = target.getBoundingClientRect().width / width || 1;
        const numberWidth = (number.firstElementChild?.getBoundingClientRect().width || 0) / scale;
        const left = Math.max(base.left / 100 * width, origin.left / 100 * width + numberWidth + width * .0055);
        heading.style.left = `${left}px`;
        heading.style.width = `${Math.max(0, (base.left + base.width) / 100 * width - left)}px`;
      }
      for (const heading of headings) {
        const base = bases.get(heading);
        const caption = captions.filter((label) => {
          const anchor = bases.get(label);
          return Math.abs(anchor.left - base.left) < 1.5 && anchor.top > base.top && anchor.top - base.top < 10;
        }).sort((a, b) => bases.get(a).top - bases.get(b).top)[0];
        if (!caption) continue;
        const anchor = bases.get(caption);
        const left = heading.offsetLeft;
        caption.style.left = `${left}px`;
        caption.style.width = `${Math.max(0, (anchor.left + anchor.width) / 100 * width - left)}px`;
        caption.style.top = `${Math.max(anchor.top / 100 * height, heading.offsetTop + heading.offsetHeight + width * .002)}px`;
      }
    };
    const schedule = () => {
      if (!stopped && !frame) frame = requestAnimationFrame(layout);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(target);
    for (const heading of headings) resize.observe(heading);
    const mutations = new MutationObserver(schedule);
    mutations.observe(target, { childList: true, characterData: true, subtree: true });
    document.fonts.ready.then(schedule);
    document.fonts.addEventListener("loadingdone", schedule);
    schedule();
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      resize.disconnect();
      mutations.disconnect();
      document.fonts.removeEventListener("loadingdone", schedule);
    };
  };

  const init = () => {
    document.querySelectorAll(".isb-mobile-diagram-canvas").forEach(watchLabelLayout);
    if (typeof HTMLDialogElement === "undefined") return;

    const mobileViewport = window.matchMedia("(width < 1280px)");
    let dialog;
    let title;
    let viewport;
    let fitButton;
    let readableButton;
    let closeButton;
    let returnFocus;
    let canvas;
    let stopCanvasLayout;
    let pointerStartedOutside = false;

    const isOutsideDialog = (event) => {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
    };

    const setReadable = (readable) => {
      dialog.classList.toggle("is-readable", readable);
      fitButton.setAttribute("aria-pressed", String(!readable));
      readableButton.setAttribute("aria-pressed", String(readable));
      if (canvas) {
        canvas.style.minWidth = readable ? "1100px" : "0";
        canvas.style.width = "100%";
        canvas.querySelectorAll("img, source").forEach((image) => {
          image.setAttribute("sizes", readable ? "1100px" : "100vw");
        });
      }
      viewport.scrollTo({ top: 0, left: readable ? Math.max(0, (viewport.scrollWidth - viewport.clientWidth) / 2) : 0, behavior: "instant" });
    };

    const close = () => {
      if (dialog?.open) dialog.close();
    };

    const makeButton = (label, className, action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = label;
      button.addEventListener("click", action);
      return button;
    };

    const createDialog = () => {
      dialog = document.createElement("dialog");
      dialog.className = "isb-diagram-dialog";
      dialog.id = "isb-mobile-diagram-dialog";
      let titleId = "isb-diagram-dialog-title";
      let suffix = 1;
      while (document.getElementById(titleId)) {
        titleId = `isb-diagram-dialog-title-${suffix++}`;
      }
      dialog.setAttribute("aria-labelledby", titleId);

      const toolbar = document.createElement("div");
      toolbar.className = "isb-diagram-dialog-toolbar";
      title = document.createElement("h2");
      title.id = titleId;
      title.className = "isb-diagram-dialog-title";
      fitButton = makeButton("Fit to screen", "isb-diagram-dialog-fit", () => setReadable(false));
      readableButton = makeButton("Readable size", "isb-diagram-dialog-readable", () => setReadable(true));
      closeButton = makeButton("Close", "isb-diagram-dialog-close", close);
      closeButton.autofocus = true;
      toolbar.append(title, fitButton, readableButton, closeButton);

      viewport = document.createElement("div");
      viewport.className = "isb-diagram-dialog-viewport";
      viewport.tabIndex = 0;
      viewport.setAttribute("role", "region");
      viewport.setAttribute("aria-label", "Enlarged diagram. Scroll to explore the diagram.");
      dialog.append(toolbar, viewport);
      document.body.append(dialog);

      dialog.addEventListener("pointerdown", (event) => {
        pointerStartedOutside = event.target === dialog && isOutsideDialog(event);
      });
      dialog.addEventListener("click", (event) => {
        if (pointerStartedOutside && event.target === dialog && isOutsideDialog(event)) close();
        pointerStartedOutside = false;
      });
      // Native dialog provides Escape handling, focus trapping and inert page content.
      dialog.addEventListener("close", () => {
        document.body.classList.remove("isb-diagram-is-open");
        stopCanvasLayout?.();
        stopCanvasLayout = null;
        viewport.replaceChildren();
        canvas = null;
        if (returnFocus?.isConnected && returnFocus.getClientRects().length) {
          returnFocus.focus({ preventScroll: true });
        }
        returnFocus = null;
      });
    };

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Element) || !mobileViewport.matches) return;
      const button = event.target.closest(".isb-mobile-diagram-open");
      const figure = button?.closest(".isb-mobile-diagram");
      const sourceCanvas = figure?.querySelector(".isb-mobile-diagram-canvas");
      if (!button || !sourceCanvas) return;
      event.preventDefault();
      if (!dialog) createDialog();
      if (dialog.open) return;

      returnFocus = button;
      title.textContent = figure.dataset.diagramTitle || "Sleep and beauty diagram";
      canvas = sourceCanvas.cloneNode(true);
      canvas.classList.add("isb-diagram-dialog-canvas");
      canvas.removeAttribute("id");
      canvas.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
      canvas.querySelectorAll("img").forEach((image) => { image.loading = "eager"; });
      viewport.replaceChildren(canvas);
      setReadable(true);
      dialog.showModal();
      stopCanvasLayout = watchLabelLayout(canvas);
      document.body.classList.add("isb-diagram-is-open");
      setReadable(true);
      closeButton.focus({ preventScroll: true });
    });

    mobileViewport.addEventListener("change", () => {
      if (!mobileViewport.matches) close();
    });
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
