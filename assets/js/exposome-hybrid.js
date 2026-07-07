(() => {
  const body = document.body;
  const progress = document.querySelector("[data-ex-progress]");
  const navLinks = Array.from(document.querySelectorAll("[data-ex-progress-nav] a"));
  const stages = Array.from(document.querySelectorAll(".infographic-stage"));
  const stageScrollers = Array.from(document.querySelectorAll(".stage-scroller"));
  const backToTop = document.querySelector("[data-back-to-top]");

  const debugMap = {
    r: "show-reference",
    g: "show-grid",
    h: "show-outlines",
    a: "show-arrows"
  };

  const buttonMap = {
    reference: "show-reference",
    grid: "show-grid",
    outlines: "show-outlines",
    arrows: "show-arrows"
  };

  const syncDebugButtons = () => {
    document.querySelectorAll("[data-debug-toggle]").forEach((button) => {
      const className = buttonMap[button.dataset.debugToggle];
      button.classList.toggle("is-active", body.classList.contains(className));
    });
  };

  const toggleDebug = (className) => {
    body.classList.toggle(className);
    syncDebugButtons();
  };

  document.addEventListener("keydown", (event) => {
    const tagName = event.target?.tagName?.toLowerCase();
    if (tagName === "input" || tagName === "textarea" || tagName === "select") return;
    const className = debugMap[event.key.toLowerCase()];
    if (!className) return;
    toggleDebug(className);
  });

  document.querySelectorAll("[data-debug-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const className = buttonMap[button.dataset.debugToggle];
      if (className) toggleDebug(className);
    });
  });

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, scrollTop / max)) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 620);

    const viewportLine = scrollTop + window.innerHeight * 0.36;
    let currentId = "";
    navLinks.forEach((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      if (target.offsetTop <= viewportLine) currentId = target.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
    });
  };

  const setupLineDraw = (stage) => {
    const paths = Array.from(stage.querySelectorAll(".arrow-layer path"));
    paths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 0;
      if (!length) return;
      path.style.strokeDasharray = path.classList.contains("dashed") ? "7 7" : `${length}`;
      path.style.strokeDashoffset = path.classList.contains("dashed") ? "0" : `${length}`;
    });
  };

  const fitStagesToViewport = () => {
    stageScrollers.forEach((scroller) => {
      const stage = scroller.querySelector(".infographic-stage");
      if (!stage) return;

      const scrollerStyle = window.getComputedStyle(scroller);
      const paddingTop = parseFloat(scrollerStyle.paddingTop) || 0;
      const paddingRight = parseFloat(scrollerStyle.paddingRight) || 0;
      const paddingBottom = parseFloat(scrollerStyle.paddingBottom) || 0;
      const paddingLeft = parseFloat(scrollerStyle.paddingLeft) || 0;

      scroller.classList.remove("is-fit-scaled");
      scroller.style.height = "";
      stage.style.position = "relative";
      stage.style.top = "";
      stage.style.left = "";
      stage.style.margin = "0 auto";
      stage.style.transform = "none";
      stage.style.transformOrigin = "top left";

      const availableWidth = Math.max(1, scroller.clientWidth - paddingLeft - paddingRight);
      const naturalWidth = Math.max(stage.scrollWidth, stage.offsetWidth, 1);
      const naturalHeight = Math.max(stage.scrollHeight, stage.offsetHeight, 1);
      const scale = Math.min(1, availableWidth / naturalWidth);
      const scaledWidth = naturalWidth * scale;
      const centeredLeft = paddingLeft + Math.max(0, (availableWidth - scaledWidth) / 2);

      stage.style.position = "absolute";
      stage.style.top = `${paddingTop}px`;
      stage.style.left = `${centeredLeft}px`;
      stage.style.margin = "0";
      stage.style.transform = `scale(${scale})`;
      scroller.style.height = `${paddingTop + (naturalHeight * scale) + paddingBottom}px`;
      scroller.classList.add("is-fit-scaled");
    });
  };

  const revealStage = (stage) => {
    stage.classList.add("is-visible");
    stage.querySelectorAll(".arrow-layer path").forEach((path) => {
      if (path.classList.contains("dashed")) return;
      path.style.strokeDashoffset = "0";
    });
  };

  stages.forEach(setupLineDraw);
  fitStagesToViewport();

  stageScrollers.forEach((scroller) => {
    scroller.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", fitStagesToViewport, { once: true });
    });
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(fitStagesToViewport).catch(() => {});
  }

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    stages.forEach(revealStage);
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealStage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -14% 0px", threshold: 0.12 });

    stages.forEach((stage) => observer.observe(stage));
  }

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", () => {
    fitStagesToViewport();
    updateProgress();
  });
  fitStagesToViewport();
  updateProgress();
  syncDebugButtons();
})();
