(() => {
  "use strict";

  const countdown = document.querySelector("[data-countdown-start]");
  if (!countdown) return;

  const dayMs = 24 * 60 * 60 * 1000;
  const duration = Number(countdown.dataset.countdownDays);
  const start = Date.parse(countdown.dataset.countdownStart);
  const deadline = start + duration * dayMs;
  if (!Number.isFinite(deadline) || duration <= 0) return;

  const value = countdown.querySelector("[data-countdown-value]");
  const unit = countdown.querySelector("[data-countdown-unit]");
  const timer = countdown.querySelector('[role="timer"]');
  const intro = countdown.querySelector("[data-countdown-intro]");
  const message = countdown.querySelector("[data-countdown-message]");
  let interval;
  let previousDays;

  function update() {
    // Calculate from the same absolute date on every visit and device. Never
    // restart on refresh or let delayed/background intervals slow the clock.
    const remaining = Math.max(0, deadline - Date.now());
    const days = Math.min(duration, Math.ceil(remaining / dayMs));
    if (days !== previousDays) {
      value.textContent = String(days).padStart(2, "0");
      unit.textContent = days === 1 ? "Day Left" : "Days Left";
      timer.setAttribute("aria-label", `${days} ${days === 1 ? "day" : "days"} remaining`);
      intro.textContent = days === 0 ? "The countdown is complete" : "You are early";
      message.textContent = days === 0 ? "Stay tuned!" : "We’re almost ready!";
      previousDays = days;
    }
    if (remaining === 0) clearInterval(interval);
  }

  interval = setInterval(update, 1000);
  update();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) update();
  });
  window.addEventListener("pageshow", update);
})();
