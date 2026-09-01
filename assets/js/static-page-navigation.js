(() => {
  const header = document.querySelector(".site-header, .commerce-header");
  if (!header || document.querySelector("[data-static-mobile-panel]")) return;

  const links = [
    ["customized.html", "Customized for you"],
    ["applied-solutions.html", "Applied Solutions"],
    ["products.html", "Applied Products"],
    ["platform.html", "Platform"],
    ["who-we-are.html", "Who We Are"],
    ["insights.html", "Insights"],
    ["partners.html", "Partners"],
    ["join-us.html", "Join Us"],
  ];
  const dropdownMenus = {
    "Applied Solutions": {
      ariaLabel: "Applied solution areas",
      href: "applied-solutions.html",
      items: [
        ["sensory-strategies", "Sensory Strategies"],
        ["synesthetic-flavors", "Synesthetic Flavors", "synesthetic-flavor.html"],
        ["bio-responsive-scents", "Bio-Responsive Scents"],
        ["health-wellness-scented-supplements", "Health & Wellness : Scented Supplements"],
      ],
    },
    Insights: {
      ariaLabel: "Insight topics",
      href: "insights.html",
      items: [
        ["exercise-beauty", "Exercise x Beauty"],
        ["exercise-health", "Exercise x Health", "exercise-health.html"],
        ["sleep-beauty", "Sleep x Beauty"],
        ["sleep-health", "Sleep x Health"],
      ],
    },
    Platform: {
      ariaLabel: "Platform modules",
      href: "platform.html",
      items: [
        ["travion", "Travion™"],
        ["meraxyl", "Meraxyl™"],
        ["melacor", "Melacor™"],
        ["cortiva", "Cortiva™"],
        ["morphagen", "Morphagen™"],
        ["chromagen", "Chromagen™"],
        ["olfactiva", "Olfactiva™"],
      ],
    },
  };
  const dropdownLinks = (menu, className) => menu.items
    .map(([id, label, href]) => `<a class="${className}" href="${href || `${menu.href}#${id}`}">${label}</a>`)
    .join("");

  const desktopNav = header.querySelector(".desktop-nav, .commerce-nav");
  Object.entries(dropdownMenus).forEach(([label, menu]) => {
    const desktopLink = Array.from(desktopNav?.children || [])
      .find((item) => item.matches("a") && item.textContent.trim() === label);
    if (!desktopLink) return;
    const dropdown = document.createElement("div");
    dropdown.className = "nav-dropdown";
    desktopLink.before(dropdown);
    desktopLink.classList.add("nav-dropdown-trigger");
    desktopLink.setAttribute("aria-haspopup", "true");
    desktopLink.insertAdjacentHTML("beforeend", '<span class="nav-dropdown-chevron" aria-hidden="true"></span>');
    dropdown.append(desktopLink);
    dropdown.insertAdjacentHTML("beforeend", `<div class="nav-submenu" aria-label="${menu.ariaLabel}">${dropdownLinks(menu, "nav-sublink")}</div>`);
  });

  const isCommerce = header.classList.contains("commerce-header");
  let actions = header.querySelector(".header-actions, .commerce-actions");
  if (!actions) {
    actions = document.createElement("div");
    actions.className = "header-actions";
    header.querySelector("nav")?.after(actions);
  }

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = isCommerce
    ? "commerce-icon-button menu-toggle static-menu-toggle"
    : "circle-button menu-toggle static-menu-toggle";
  toggle.setAttribute("aria-label", "Open navigation menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>';
  actions.append(toggle);

  const scrim = document.createElement("div");
  scrim.className = "mobile-scrim";
  scrim.dataset.staticMobileScrim = "";
  const panel = document.createElement("aside");
  panel.className = "mobile-panel";
  panel.dataset.staticMobilePanel = "";
  panel.setAttribute("aria-label", "Primary navigation");
  panel.innerHTML = `
    <div class="mobile-panel-head">
      <a class="brand" href="../index.html" aria-label="Arotec home">
        <img class="brand-logo" src="../assets/images/arotec-scientist-logo.png" width="250" height="229" alt="Arotec Scientist">
      </a>
      <button class="circle-button" type="button" data-static-menu-close aria-label="Close navigation menu">
        <svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg>
      </button>
    </div>
    <nav class="mobile-nav">
      ${links.map(([href, label]) => {
        const menu = dropdownMenus[label];
        return menu
          ? `<div class="mobile-nav-group"><a class="nav-link nav-dropdown-trigger" href="${href}" aria-haspopup="true">${label}<span class="nav-dropdown-chevron" aria-hidden="true"></span></a><div class="mobile-nav-submenu" aria-label="${menu.ariaLabel}">${dropdownLinks(menu, "mobile-nav-sublink")}</div></div>`
          : `<a class="nav-link" href="${href}">${label}</a>`;
      }).join("")}
    </nav>
    <a class="pill-button" href="members.html">Get In touch</a>
  `;
  document.body.append(scrim, panel);

  const close = () => {
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    panel.querySelector("[data-static-menu-close]")?.focus();
  };

  toggle.addEventListener("click", () => {
    document.body.classList.contains("menu-open") ? close() : open();
  });
  scrim.addEventListener("click", close);
  panel.querySelector("[data-static-menu-close]")?.addEventListener("click", close);
  panel.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
})();
