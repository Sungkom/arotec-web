(() => {
  "use strict";

  const init = () => {
    if (typeof HTMLDialogElement === "undefined") return;

    const mobileViewport = window.matchMedia("(width < 1200px)");
    let dialog;
    let title;
    let viewport;
    let fitButton;
    let readableButton;
    let closeButton;
    let returnFocus;
    let canvas;
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
      dialog.className = "shm-diagram-dialog";
      dialog.id = "shm-mobile-diagram-dialog";
      let titleId = "shm-diagram-dialog-title";
      let suffix = 1;
      while (document.getElementById(titleId)) {
        titleId = `shm-diagram-dialog-title-${suffix++}`;
      }
      dialog.setAttribute("aria-labelledby", titleId);

      const toolbar = document.createElement("div");
      toolbar.className = "shm-diagram-dialog-toolbar";
      title = document.createElement("h2");
      title.id = titleId;
      title.className = "shm-diagram-dialog-title";
      fitButton = makeButton("Fit to screen", "shm-diagram-dialog-fit", () => setReadable(false));
      readableButton = makeButton("Readable size", "shm-diagram-dialog-readable", () => setReadable(true));
      closeButton = makeButton("Close", "shm-diagram-dialog-close", close);
      closeButton.autofocus = true;
      toolbar.append(title, fitButton, readableButton, closeButton);

      viewport = document.createElement("div");
      viewport.className = "shm-diagram-dialog-viewport";
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
        document.body.classList.remove("shm-diagram-is-open");
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
      const button = event.target.closest(".shm-mobile-diagram-open");
      const figure = button?.closest(".shm-mobile-diagram");
      const sourceCanvas = figure?.querySelector(".shm-mobile-diagram-canvas");
      if (!button || !sourceCanvas) return;
      event.preventDefault();
      if (!dialog) createDialog();
      if (dialog.open) return;

      returnFocus = button;
      title.textContent = figure.dataset.diagramTitle || "Sleep and systemic health diagram";
      canvas = sourceCanvas.cloneNode(true);
      canvas.classList.add("shm-diagram-dialog-canvas");
      canvas.removeAttribute("id");
      canvas.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
      canvas.querySelectorAll("img").forEach((image) => { image.loading = "eager"; });
      viewport.replaceChildren(canvas);
      setReadable(true);
      dialog.showModal();
      document.body.classList.add("shm-diagram-is-open");
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
