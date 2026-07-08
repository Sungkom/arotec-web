(() => {
  const progress = document.querySelector("[data-adi-progress]");
  const navLinks = Array.from(document.querySelectorAll("[data-adi-progress-nav] a"));
  const stageScrollers = Array.from(document.querySelectorAll(".stage-scroller"));
  const stages = Array.from(document.querySelectorAll(".adi-stage"));
  const backToTop = document.querySelector("[data-adi-back-top]");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? clamp(scrollTop / max, 0, 1) : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (backToTop) backToTop.classList.toggle("is-visible", scrollTop > 620);

    const viewportLine = scrollTop + window.innerHeight * 0.38;
    let currentId = "";
    navLinks.forEach((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      if (target.offsetTop <= viewportLine) currentId = target.id;
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${currentId}`);
    });
  }

  function setupLineDraw(stage) {
    const paths = Array.from(stage.querySelectorAll(".arrow-layer path.flow-path"));
    paths.forEach((path) => {
      if (!path.getTotalLength) return;
      if (path.classList.contains("dashed") || path.classList.contains("dashed-ring")) return;
      const length = path.getTotalLength();
      if (!length) return;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.setProperty("--line-length", length);
    });
  }

  function fitStagesToViewport() {
    stageScrollers.forEach((scroller) => {
      const stage = scroller.querySelector(".adi-stage");
      if (!stage) return;

      const scrollerStyle = window.getComputedStyle(scroller);
      const paddingTop = parseFloat(scrollerStyle.paddingTop) || 0;
      const paddingRight = parseFloat(scrollerStyle.paddingRight) || 0;
      const paddingBottom = parseFloat(scrollerStyle.paddingBottom) || 0;
      const paddingLeft = parseFloat(scrollerStyle.paddingLeft) || 0;

      scroller.classList.remove("is-fit-scaled", "is-horizontal-scroll");
      scroller.style.overflowX = "";
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
      const minimumReadableScale = window.innerWidth < 640 ? 0.76 : window.innerWidth < 980 ? 0.68 : 0;
      const scale = Math.min(1, Math.max(minimumReadableScale, availableWidth / naturalWidth));
      const scaledWidth = naturalWidth * scale;
      const needsHorizontalScroll = scaledWidth > availableWidth + 1;
      const centeredLeft = needsHorizontalScroll ? paddingLeft : paddingLeft + Math.max(0, (availableWidth - scaledWidth) / 2);

      stage.style.position = "absolute";
      stage.style.top = `${paddingTop}px`;
      stage.style.left = `${centeredLeft}px`;
      stage.style.margin = "0";
      stage.style.transform = `scale(${scale})`;
      scroller.style.height = `${paddingTop + naturalHeight * scale + paddingBottom}px`;
      if (needsHorizontalScroll) {
        scroller.style.overflowX = "auto";
        scroller.classList.add("is-horizontal-scroll");
      }
      scroller.classList.add("is-fit-scaled");
    });
  }

  function revealStage(stage) {
    stage.classList.add("is-visible");
    stage.querySelectorAll(".arrow-layer path.flow-path").forEach((path) => {
      if (path.classList.contains("dashed") || path.classList.contains("dashed-ring")) return;
      path.style.strokeDashoffset = "0";
    });
  }

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

  if (reduceMotion || !("IntersectionObserver" in window)) {
    stages.forEach(revealStage);
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealStage(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -12% 0px" });

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
})();
