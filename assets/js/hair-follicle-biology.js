(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const qaStatic = new URLSearchParams(window.location.search).get("qa") === "1";
  if (qaStatic) document.body.classList.add("qa-static");
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const navToggle = document.querySelector("[data-nav-toggle]");

  const setMenu = (open) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    const icon = navToggle.querySelector("i");
    icon?.classList.toggle("ph-list", !open);
    icon?.classList.toggle("ph-x", open);
  };

  navToggle?.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  const updateHeader = () => header?.classList.toggle("is-sticky", window.scrollY > 48);
  const keepScienceActiveAtTop = () => {
    if (window.scrollY > 180) return;
    nav?.querySelectorAll("a").forEach((link) => link.classList.toggle("active", link.getAttribute("href") === "#science"));
  };
  updateHeader();
  keepScienceActiveAtTop();
  window.addEventListener("scroll", () => { updateHeader(); keepScienceActiveAtTop(); }, { passive: true });

  const reveals = [...document.querySelectorAll(".reveal")];
  if (qaStatic || reducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblingIndex = [...entry.target.parentElement.children].indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(siblingIndex * 32, 160)}ms`;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -4%" });
    reveals.forEach((item) => revealObserver.observe(item));
  }

  const cycle = document.querySelector("[data-cycle]")?.closest(".cycle-panel");
  if (cycle && "IntersectionObserver" in window) {
    const cycleObserver = new IntersectionObserver(([entry]) => {
      cycle.classList.toggle("is-visible", entry.isIntersecting);
    }, { threshold: 0.25 });
    cycleObserver.observe(cycle);
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".follicle-nav a[href^='#']")];
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-25% 0px -64%", threshold: [0.05, 0.2, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const heroArt = document.querySelector("[data-parallax]");
  if (heroArt && !reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const hero = heroArt.closest(".hair-hero");
    hero?.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      heroArt.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    hero?.addEventListener("pointerleave", () => { heroArt.style.transform = "translate3d(0, 0, 0)"; });
  }

  const form = document.querySelector("[data-newsletter]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    const input = form.querySelector("input[type='email']");
    if (!input?.checkValidity()) {
      input?.reportValidity();
      return;
    }
    status.textContent = "Thank you — you're subscribed.";
    form.reset();
    window.setTimeout(() => { status.textContent = ""; }, 5000);
  });

  const canvas = document.querySelector("[data-particles]");
  if (!canvas || reducedMotion) return;
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let frame = 0;
  let particles = [];

  const resize = () => {
    const density = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * density);
    canvas.height = Math.floor(height * density);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(density, 0, 0, density, 0, 0);
    const count = Math.min(46, Math.max(18, Math.round(width / 30)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * Math.min(height, 720),
      radius: Math.random() * 1.4 + 0.4,
      dx: (Math.random() - 0.5) * 0.14,
      dy: (Math.random() - 0.5) * 0.1,
      alpha: Math.random() * 0.5 + 0.2,
    }));
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);
    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];
      particle.x += particle.dx;
      particle.y += particle.dy;
      if (particle.x < -4) particle.x = width + 4;
      if (particle.x > width + 4) particle.x = -4;
      if (particle.y < -4) particle.y = Math.min(height, 720) + 4;
      if (particle.y > Math.min(height, 720) + 4) particle.y = -4;
      context.beginPath();
      context.fillStyle = `rgba(89, 209, 255, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
      for (let peerIndex = index + 1; peerIndex < particles.length; peerIndex += 1) {
        const peer = particles[peerIndex];
        const distance = Math.hypot(particle.x - peer.x, particle.y - peer.y);
        if (distance > 135) continue;
        context.beginPath();
        context.strokeStyle = `rgba(38, 151, 218, ${0.13 * (1 - distance / 135)})`;
        context.lineWidth = 0.65;
        context.moveTo(particle.x, particle.y);
        context.lineTo(peer.x, peer.y);
        context.stroke();
      }
    }
    frame = window.requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(frame);
    } else {
      draw();
    }
  });
})();
