(() => {
  "use strict";

  const countdown = document.querySelector("[data-vagus-countdown]");
  if (!countdown) return;

  const dayMs = 86_400_000;
  const duration = Number(countdown.dataset.countdownDays);
  const start = Date.parse(countdown.dataset.countdownStart);
  const deadline = start + duration * dayMs;
  if (!Number.isFinite(deadline) || !Number.isInteger(duration) || duration <= 0) return;

  const digits = countdown.querySelectorAll("[data-countdown-digit]");
  const timer = countdown.querySelector('[role="timer"]');
  const unit = countdown.querySelector("[data-countdown-unit]");
  const message = countdown.querySelector("[data-countdown-message]");
  let previousDays;
  let previousLocale;
  let interval;

  function update() {
    const days = Math.max(0, Math.min(duration, Math.ceil((deadline - Date.now()) / dayMs)));
    const i18n = window.ArotecI18n;
    const locale = i18n?.currentLocale || "en";
    const translate = (id, fallback) => i18n?.getMessage(id, locale, { days }) || fallback;
    if (days !== previousDays || locale !== previousLocale) {
      const text = String(days).padStart(digits.length, "0");
      digits.forEach((digit, index) => { digit.textContent = text[index]; });
      timer.setAttribute("aria-label", days === 1
        ? translate("vagus.remainingOne", `${days} day remaining`)
        : translate("vagus.remaining", `${days} days remaining`));
      unit.textContent = days === 1 ? translate("vagus.day", "DAY") : translate("vagus.days", "DAYS");
      message.textContent = days === 0
        ? translate("vagus.ended", "The wait is over. Stay tuned!")
        : translate("vagus.message", "Almost there. Stay curious.");
      previousDays = days;
      previousLocale = locale;
    }
    if (days === 0) clearInterval(interval);
  }

  interval = setInterval(update, 1000);
  update();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) update(); });
  window.addEventListener("pageshow", update);
  document.addEventListener("arotec:languagechange", update);
  // Catalog validation can finish after the first tick. Re-render even when
  // both the locale and the remaining number of days are unchanged.
  window.ArotecI18n?.registerRenderer({
    id: "vagus-scent-bulb-countdown",
    render() { previousLocale = undefined; update(); },
  });
})();
