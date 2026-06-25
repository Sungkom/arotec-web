(() => {
  const progressBar = document.querySelector("[data-scroll-progress]");
  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateScrollProgress = () => {
    if (!progressBar) return;

    const scrollable =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${clamp(progress, 0, 1)})`;
  };

  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
})();
