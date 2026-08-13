(() => {
  "use strict";

  const stage = document.querySelector("[data-aging-stage]");
  const shell = document.querySelector("[data-stage-shell]");
  const navigation = document.querySelector("[data-navigation]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const dialog = document.querySelector("[data-explore-dialog]");
  const openDialogButton = document.querySelector("[data-open-explore]");
  const canvas = document.querySelector("[data-particles]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 1280px)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  function fitDesktopStage() {
    if (!stage || !shell) return;

    if (!desktopQuery.matches) {
      stage.style.removeProperty("transform");
      shell.style.removeProperty("width");
      shell.style.removeProperty("height");
      return;
    }

    const scale = Math.min(window.innerWidth / 1536, window.innerHeight / 1024);
    stage.style.transform = `scale(${scale})`;
    shell.style.width = `${1536 * scale}px`;
    shell.style.height = `${1024 * scale}px`;
  }

  function setMenu(open) {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
    const assistiveLabel = menuToggle.querySelector(".sr-only");
    if (assistiveLabel) assistiveLabel.textContent = open ? "Close navigation" : "Open navigation";
  }

  function highlightTarget(target) {
    target.classList.remove("is-highlighted");
    window.requestAnimationFrame(() => target.classList.add("is-highlighted"));
    window.setTimeout(() => target.classList.remove("is-highlighted"), 1500);
  }

  menuToggle?.addEventListener("click", () => {
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navigation?.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-target]");
    if (!link) return;
    const target = document.getElementById(link.dataset.target || "");
    if (!target) return;

    event.preventDefault();
    navigation.querySelectorAll("a").forEach((item) => {
      const active = item === link;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    setMenu(false);

    if (!desktopQuery.matches) {
      target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "center" });
    }
    highlightTarget(target);
    target.setAttribute("tabindex", "-1");
    window.setTimeout(() => target.focus({ preventScroll: true }), desktopQuery.matches ? 50 : 620);
  });

  openDialogButton?.addEventListener("click", () => {
    if (dialog?.showModal) dialog.showModal();
  });

  dialog?.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setMenu(false);
    if (dialog?.open) dialog.close();
  });

  document.addEventListener("click", (event) => {
    if (!navigation?.classList.contains("is-open")) return;
    if (navigation.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenu(false);
  });

  function setupTilt() {
    if (!finePointer.matches || reducedMotion.matches) return;
    document.querySelectorAll("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--rx", `${(-y * 2.2).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${(x * 2.8).toFixed(2)}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  function setupParticles() {
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let particles = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    function seedParticles() {
      const count = reducedMotion.matches ? 28 : Math.min(72, Math.max(34, Math.round((width * height) / 26000)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: index % 9 === 0 ? 1.8 : 0.6 + Math.random() * 1.15,
        vx: (Math.random() - 0.5) * 0.035,
        vy: (Math.random() - 0.5) * 0.025,
        alpha: 0.15 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2
      }));
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles();
      draw(performance.now(), true);
    }

    function draw(time, staticFrame = false) {
      context.clearRect(0, 0, width, height);
      const pulse = time * 0.00035;

      particles.forEach((particle, index) => {
        if (!staticFrame && !reducedMotion.matches) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < -10) particle.x = width + 10;
          if (particle.x > width + 10) particle.x = -10;
          if (particle.y < -10) particle.y = height + 10;
          if (particle.y > height + 10) particle.y = -10;
        }

        const shimmer = reducedMotion.matches ? 1 : 0.72 + Math.sin(pulse + particle.phase) * 0.28;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(70, 184, 255, ${particle.alpha * shimmer})`;
        context.shadowBlur = particle.radius > 1.5 ? 10 : 4;
        context.shadowColor = "rgba(22, 139, 255, .7)";
        context.fill();

        if (index % 7 === 0) {
          const next = particles[(index + 3) % particles.length];
          const distance = Math.hypot(next.x - particle.x, next.y - particle.y);
          if (distance < 160) {
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(next.x, next.y);
            context.strokeStyle = `rgba(42, 142, 223, ${(1 - distance / 160) * 0.13})`;
            context.lineWidth = 0.65;
            context.shadowBlur = 0;
            context.stroke();
          }
        }
      });

      if (!reducedMotion.matches && !staticFrame) animationFrame = window.requestAnimationFrame(draw);
    }

    function restartAnimation() {
      window.cancelAnimationFrame(animationFrame);
      if (reducedMotion.matches) draw(performance.now(), true);
      else animationFrame = window.requestAnimationFrame(draw);
    }

    resizeCanvas();
    restartAnimation();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    reducedMotion.addEventListener?.("change", restartAnimation);
  }

  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(fitDesktopStage);
  }, { passive: true });
  desktopQuery.addEventListener?.("change", fitDesktopStage);

  fitDesktopStage();
  setupTilt();
  setupParticles();
  window.requestAnimationFrame(() => document.body.classList.add("is-ready"));
})();
