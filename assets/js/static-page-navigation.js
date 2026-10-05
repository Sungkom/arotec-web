(() => {
  const header = document.querySelector(".site-header, .commerce-header");
  if (!header || document.querySelector("[data-static-mobile-panel]")) return;
  header.querySelectorAll("a").forEach((link) => {
    if (/^get\s+in\s+touch$/i.test(link.textContent.trim())) link.href = "get-in-touch.html";
  });

  const links = [
    [new URL("../../uniquely-yours.html", document.currentScript.src).href, "Uniquely Yours"],
    ["applied-solutions.html", "Applied Solutions"],
    ["applied-products.html", "Applied Products"],
    ["platform.html", "Platform"],
    ["who-we-are.html", "Who We Are"],
    ["insights.html", "Insights"],
    ["partners.html", "Partners"],
    ["partners.html#b2b", "CO-CREATION"],
    ["join-us.html", "Join Us"],
  ];
  const productsCountdownUrl = new URL("../../applied-products-countdown.html", document.currentScript.src).href;
  const vagusScentBulbUrl = new URL("../../pages/vagus-scent-bulb.html", document.currentScript.src).href;
  const dropdownMenus = {
    "Applied Solutions": {
      ariaLabel: "Applied solution areas",
      href: "applied-solutions.html",
      items: [
        ["sensory-strategies", "Sensory Strategies", "applied-solutions.html"],
        ["synesthetic-flavors", "Synesthetic Flavors", "synesthetic-flavor.html"],
        ["bio-responsive-scents", "Bio-Responsive Ingredients", "bio-responsive-scents.html"],
        ["health-wellness-scented-supplements", "Health & Wellness : Scented Supplements", "health-wellness-scented-supplements.html"],
      ],
    },
    "Applied Products": {
      ariaLabel: "Applied product areas",
      href: "applied-products.html",
      items: [
        ["vagus-spa", "Vagus spa", productsCountdownUrl],
        ["vagus-scent-bulb", "Vagus scent bulb", vagusScentBulbUrl],
        ["neuro-cosmetic", "Neuro-cosmetic", productsCountdownUrl],
        ["customized-for-you", "Bespoke Services", "bespoke-services.html"],
      ],
    },
    Insights: {
      ariaLabel: "Insight topics",
      href: "insights.html",
      items: [
        ["exercise-beauty", "Exercise x Beauty"],
        ["exercise-health", "Exercise x Health", "exercise-health.html"],
        ["sleep-beauty", "Sleep x Beauty"],
        ["sleep-health", "Sleep x Health", "sleep-health.html"],
      ],
    },
    Platform: {
      ariaLabel: "Platform modules",
      href: "platform.html",
      items: [
        ["piper-longum", "Piper Longum", "platform.html"],
      ],
    },
    Partners: {
      ariaLabel: "Partner topics",
      href: "partners.html",
      items: [
        ["deep-sea-water", "Deep Sea Water"],
        ["water-activator", "Water Activator", "water-activator.html"],
        ["sakae", "Sakae", "sakae.html"],
        ["kobayashi", "Kobayashi"],
      ],
    },
  };
  const dropdownLinks = (menu, className) => menu.items
    .map(([id, label, href]) => `<a class="${className}" href="${href || `${menu.href}#${id}`}">${label}</a>`)
    .join("");

  const desktopNav = header.querySelector(".desktop-nav, .commerce-nav");
  if (desktopNav) {
    const existingLinks = Array.from(desktopNav.querySelectorAll(":scope > a"));
    const fallbackClass = existingLinks[0]?.className || "nav-link";
    const normalizedLinks = links.map(([href, label]) => {
      const existing = existingLinks.find((link) => link.textContent.trim() === label);
      const link = existing || document.createElement("a");
      link.className = existing?.className || fallbackClass;
      link.href = href;
      link.textContent = label;
      return link;
    });
    desktopNav.replaceChildren(...normalizedLinks);
  }
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

  const languageSelect = actions.querySelector(".language-select");
  const searchButton = actions.querySelector("#searchButton, [aria-label='Search']");
  if (languageSelect && searchButton) {
    actions.insertBefore(searchButton, languageSelect);
    actions.append(languageSelect);
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
    <a class="pill-button" href="get-in-touch.html">Get In touch</a>
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

;(() => {
  if (document.getElementById('applied-products-navigation-script')) return;
  const script = document.createElement('script');
  script.id = 'applied-products-navigation-script';
  script.src = new URL('applied-products-navigation.js?v=20261005-vagus-scent-bulb-v1', document.currentScript.src).href;
  script.defer = true;
  document.head.append(script);
})();

;(() => {
  if (document.querySelector('script[data-applied-solutions-navigation]')) return;
  const source = document.currentScript;
  if (!source || !source.src) return;
  const script = document.createElement('script');
  script.src = new URL('./applied-solutions-navigation.js?v=20261001-scented-supplements-v1', source.src).href;
  script.dataset.appliedSolutionsNavigation = 'true';
  script.defer = true;
  document.head.append(script);
})();

;(() => {
  if (document.querySelector('script[data-kobayashi-navigation]')) return;
  const source = document.currentScript;
  if (!source || !source.src) return;
  const script = document.createElement('script');
  script.src = new URL('./kobayashi-navigation.js?v=20260909-v1', source.src).href;
  script.dataset.kobayashiNavigation = 'true';
  script.defer = true;
  document.head.append(script);
})();
