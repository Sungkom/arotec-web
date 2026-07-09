(() => {
  const progress = document.querySelector("[data-adi-progress]");
  const navLinks = Array.from(document.querySelectorAll("[data-adi-progress-nav] a"));
  const stageScrollers = Array.from(document.querySelectorAll(".stage-scroller"));
  const stages = Array.from(document.querySelectorAll(".adi-stage"));
  const backToTop = document.querySelector("[data-adi-back-top]");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  const adiImageFallbacks = [
    ["ADI Aging Dynamic Index/Exposome Biological.png", "public/crops/adi/adi-ebii-molecule.png"],
    ["ADI Aging Dynamic Index/Inflammation.png", "public/crops/adi/adi-ebii-inflammation.png"],
    ["ADI Aging Dynamic Index/Oxidative stress.png", "public/crops/adi/adi-ebii-oxidative.png"],
    ["ADI Aging Dynamic Index/Metabolic stress.png", "public/crops/adi/adi-ebii-metabolic.png"],
    ["ADI Aging Dynamic Index/Molecular_cellular disruption.png", "public/crops/adi/adi-ebii-molecular.png"],
    ["ADI Aging Dynamic Index/Susceptibility.png", "public/crops/adi/adi-ebii-susceptibility.png"],
    ["ADI Aging Dynamic Index/Cumulative exposure burden.png", "public/crops/adi/adi-ebii-cumulative.png"],
    ["ADI Aging Dynamic Index/Genetics.png", "public/crops/adi/adi-ip-icons.png"],
    ["ADI Aging Dynamic Index/Epigenetic predisposition.png", "public/crops/adi/adi-ip-icons.png"],
    ["ADI Aging Dynamic Index/Sex & developmental programming.png", "public/crops/adi/adi-ip-icons.png"],
    ["ADI Aging Dynamic Index/Baseline physiology.png", "public/crops/adi/adi-ip-icons.png"],
    ["ADI Aging Dynamic Index/Innate vulnerability.png", "public/crops/adi/adi-ip-icons.png"],
    ["ADI Aging Dynamic Index/Repair capacity.png", "public/crops/adi/adi-ar-icons.png"],
    ["ADI Aging Dynamic Index/Recovery capacity.png", "public/crops/adi/adi-ar-icons.png"],
    ["ADI Aging Dynamic Index/Adaptation.png", "public/crops/adi/adi-ar-icons.png"],
    ["ADI Aging Dynamic Index/Functional reserve.png", "public/crops/adi/adi-ar-icons.png"],
    ["ADI Aging Dynamic Index/Homeostatic stability.png", "public/crops/adi/adi-ar-icons.png"],
    ["ADI Aging Dynamic Index/Stress tolerance.png", "public/crops/adi/adi-ar-icons.png"],
    ["ADI Determines Aging Trajectory/Low ADI.png", "public/crops/adi/adi-low-runner.png"],
    ["ADI Determines Aging Trajectory/Moderate ADI.png", "public/crops/adi/adi-moderate-walker.png"],
    ["ADI Determines Aging Trajectory/High ADI.png", "public/crops/adi/adi-high-elder.png"],
    ["ADI Reflects Multi-Domain Biological Aging/Physical Function.png", "public/crops/adi/adi-physical-function-icon.png"],
    ["ADI Reflects Multi-Domain Biological Aging/Metabolic Function.png", "public/crops/adi/adi-metabolic-function-icon.png"],
    ["ADI Reflects Multi-Domain Biological Aging/Cognitive Function.png", "public/crops/adi/adi-cognitive-function-icon.png"],
    ["ADI Reflects Multi-Domain Biological Aging/Homeostatic Function.png", "public/crops/adi/adi-homeostatic-function-icon.png"],
    ["ADI Predicts Health and Longevity Outcomes/Longevity.png", "public/crops/adi/adi-longevity-icon.png"],
    ["ADI Predicts Health and Longevity Outcomes/Physical.png", "public/crops/adi/adi-physical-function-outcome-icon.png"],
    ["ADI Predicts Health and Longevity Outcomes/Cognitive.png", "public/crops/adi/adi-cognitive-function-outcome-icon.png"],
    ["ADI Predicts Health and Longevity Outcomes/Metabolic.png", "public/crops/adi/adi-metabolic-health-icon.png"],
    ["ADI Predicts Health and Longevity Outcomes/Immune.png", "public/crops/adi/adi-immune-health-icon.png"],
    ["ADI Predicts Health and Longevity Outcomes/Skin.png", "public/crops/adi/adi-skin-aging-icon.png"],
    ["ADI Predicts Health and Longevity Outcomes/Quality.png", "public/crops/adi/adi-quality-of-life-icon.png"],
    ["ADI Is Dynamic and Modifiable/accelerated.png", "public/crops/adi/adi-chart-accelerated-elder.png"],
    ["ADI Is Dynamic and Modifiable/adeptive.png", "public/crops/adi/adi-chart-adaptive-walker.png"],
    ["ADI Is Dynamic and Modifiable/fealthy.png", "public/crops/adi/adi-chart-healthy-runner.png"],
    ["ADI Is Dynamic and Modifiable/Reduce EBII.png", "public/crops/adi/adi-modifiable-leaf.png"],
    ["ADI Is Dynamic and Modifiable/Improve AR.png", "public/crops/adi/adi-modifiable-shield.png"],
    ["ADI Is Dynamic and Modifiable/Optimize IP-related factors.png", "public/crops/adi/adi-modifiable-dna.png"]
  ];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const decodePath = (value) => {
    try {
      return decodeURI(value);
    } catch {
      return value;
    }
  };

  function resolveFallbackSrc(fallbackPath) {
    const prefix = window.location.pathname.includes("/pages/") ? "../" : "";
    return `${prefix}${fallbackPath}`;
  }

  function findImageFallback(src) {
    const decodedSrc = decodePath(src);
    const match = adiImageFallbacks.find(([needle]) => decodedSrc.includes(needle));
    return match ? match[1] : "";
  }

  function applyImageFallbacks() {
    document.querySelectorAll(".adi-hybrid-page img").forEach((img) => {
      const originalSrc = img.getAttribute("src") || "";
      const fallbackPath = findImageFallback(originalSrc);
      if (fallbackPath) {
        img.dataset.adiOriginalSrc = originalSrc;
        img.setAttribute("src", resolveFallbackSrc(fallbackPath));
      }

      img.addEventListener("error", () => {
        const failedSrc = img.getAttribute("src") || "";
        const retryPath = findImageFallback(failedSrc);
        if (retryPath && img.dataset.adiFallbackRetried !== "true") {
          img.dataset.adiFallbackRetried = "true";
          img.setAttribute("src", resolveFallbackSrc(retryPath));
          return;
        }
        img.dataset.adiAssetMissing = "true";
        img.style.visibility = "hidden";
        fitStagesToViewport();
      }, { once: true });
    });
  }

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

  applyImageFallbacks();
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
