(() => {
  "use strict";

  const data = window.exerciseHealthData;
  if (!data) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const byId = (id) => document.getElementById(id);
  const withBreaks = (value = "") => value.split("\n").join("<br>");
  const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  const image = (src, alt, className = "") => `<img${className ? ` class="${className}"` : ""} src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
  const iconStack = (icons = [], alt = "", className = "") => `
    <div class="icon-stack ${className}">
      ${icons.map((src, index) => image(src, index === 0 ? alt : "", `stack-icon stack-icon-${index + 1}`)).join("")}
    </div>`;

  const render = (id, markup) => {
    const target = byId(id);
    if (target) target.innerHTML = markup;
  };

  render("peripheral-groups", data.peripheralSignalGroups.map((group) => `
    <article class="signal-group card-interaction">
      ${image(group.icon, "", "signal-icon")}
      <div><h4>${group.title}</h4>${list(group.items)}</div>
    </article>`).join(""));

  render("neural-pathways", data.neuralPathways.map((pathway) => `
    <article class="neural-card card-interaction">
      <h4>${pathway.title}</h4>
      <p>(${withBreaks(pathway.text)})</p>
    </article>`).join(""));

  render("neurochemical-responses", data.neurochemicalResponses.map((response) => `
    <article class="neuro-card card-interaction${response.wide ? " neuro-card-wide" : ""}">
      ${image(response.icon, "", "neuro-icon")}
      <div class="neuro-copy">
        <h4><span>${response.number}</span>${response.title}</h4>
        ${list(response.items)}
      </div>
    </article>`).join(""));

  render("inter-organ-axes", data.interOrganAxes.map((axis, index) => `
    <article class="organ-card organ-card-${index + 1} card-interaction">
      <h4>${axis.title}</h4>
      ${iconStack(axis.icons, axis.title, axis.icons.length > 1 ? "multi-icon" : "")}
      ${list(axis.items)}
    </article>`).join(""));

  render("intracellular-pathways", data.intracellularPathways.map((pathway, index) => `
    <article class="pathway-card pathway-card-${index + 1} card-interaction tone-${pathway.tone || "violet"}" tabindex="0">
      <h4>${pathway.title}${pathway.label ? `<small>${pathway.label}</small>` : ""}</h4>
      ${image(pathway.icon, "", "pathway-icon")}
      <p>${withBreaks(pathway.subtitle)}</p>
    </article>
    ${index < data.intracellularPathways.length - 1 ? '<span class="pathway-connector" aria-hidden="true"><i class="ph ph-arrow-right"></i></span>' : ""}`
  ).join(""));

  const renderModifierList = (id, items, showArrows) => {
    render(id, items.map((item) => `
      <li class="modifier-item card-interaction">
        <i class="ph ph-${item.icon}" aria-hidden="true"></i>
        <span>${item.label}</span>
        ${showArrows ? '<i class="ph ph-arrows-left-right modifier-arrows" aria-hidden="true"></i>' : ""}
      </li>`).join(""));
  };
  renderModifierList("contextual-modifiers", data.contextualModifiers, false);
  renderModifierList("response-modifiers", data.responseModifiers, true);

  render("exercise-modalities", data.exerciseModalities.map((modality) => `
    <article class="modality-card card-interaction">
      <h5>${modality.title}${modality.label ? `<small>(${modality.label})</small>` : ""}</h5>
      ${image(modality.icon, `${modality.title} exercise`, "modality-icon")}
    </article>`).join(""));

  render("physiological-sensors", data.physiologicalSensors.map((sensor) => `
    <article class="sensor-card card-interaction">
      <h4><span>${sensor.number}</span>${sensor.title}</h4>
      <div class="sensor-body">
        ${iconStack(sensor.icons, sensor.title, sensor.icons.length > 1 ? "multi-icon" : "")}
        ${list(sensor.items)}
      </div>
    </article>`).join(""));

  render("acute-responses", data.acuteResponses.map((response) => `
    <article class="acute-card card-interaction tone-${response.tone || "cool"}">
      ${response.icons ? iconStack(response.icons, response.text.replaceAll("\n", " ")) : `<i class="ph ph-${response.iconClass} acute-library-icon" aria-hidden="true"></i>`}
      <p>${withBreaks(response.text)}</p>
    </article>`).join(""));

  render("acute-outcomes", data.acuteOutcomes.map((outcome) => `
    <article class="outcome-card card-interaction">
      ${outcome.icons ? iconStack(outcome.icons, outcome.heading.replaceAll("\n", " "), outcome.icons.length > 1 ? "multi-icon" : "") : `
        <div class="metabolic-badges" aria-hidden="true">
          <span>${outcome.badges[0]}</span>${image(outcome.badgeIcon, "", "ros-badge")}
        </div>`}
      <div><h4>${withBreaks(outcome.heading)}</h4><p>${withBreaks(outcome.text)}</p></div>
    </article>`).join(""));

  const setupReveal = () => {
    const revealItems = [...document.querySelectorAll("[data-reveal], .card-interaction")];
    if (!revealItems.length) return;

    document.body.classList.add("reveal-ready");
    revealItems.forEach((item, index) => {
      item.style.setProperty("--reveal-order", String(index % 5));
    });

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -5%",
      threshold: 0.08,
    });

    revealItems.forEach((item) => observer.observe(item));
  };

  const setupTilt = () => {
    if (!finePointer.matches || reducedMotion.matches) return;

    document.querySelectorAll("[data-eh-tilt]").forEach((card) => {
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
  };

  const setupParticles = () => {
    const canvas = document.querySelector("[data-eh-particles]");
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    let particles = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const seedParticles = () => {
      const count = reducedMotion.matches ? 28 : Math.min(72, Math.max(34, Math.round((width * height) / 26000)));
      particles = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: index % 9 === 0 ? 1.8 : 0.6 + Math.random() * 1.15,
        vx: (Math.random() - 0.5) * 0.035,
        vy: (Math.random() - 0.5) * 0.025,
        alpha: 0.15 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time, staticFrame = false) => {
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
    };

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedParticles();
      draw(performance.now(), true);
    };

    const restartAnimation = () => {
      window.cancelAnimationFrame(animationFrame);
      if (reducedMotion.matches) draw(performance.now(), true);
      else animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    restartAnimation();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    reducedMotion.addEventListener?.("change", restartAnimation);
  };

  setupReveal();
  setupTilt();
  setupParticles();
  window.requestAnimationFrame(() => document.body.classList.add("is-ready"));

  document.querySelectorAll(".pathway-card").forEach((card) => {
    const connector = card.nextElementSibling?.classList.contains("pathway-connector") ? card.nextElementSibling : null;
    const illuminate = (active) => connector?.classList.toggle("is-lit", active);
    card.addEventListener("pointerenter", () => illuminate(true));
    card.addEventListener("pointerleave", () => illuminate(false));
    card.addEventListener("focus", () => illuminate(true));
    card.addEventListener("blur", () => illuminate(false));
  });
})();
