(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("sfv-no-js");
  root.classList.add("sfv-js");

  const ready = () => {
    const header = document.querySelector("[data-sfv-header]");
    const menuButton = document.querySelector("[data-sfv-menu]");
    const navigation = document.getElementById("sfv-navigation");
    const backToTop = document.querySelector("[data-sfv-back]");
    const heroMedia = document.querySelector("[data-sfv-parallax]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const desktopNav = window.matchMedia("(min-width: 901px)");

    const pageLinks = navigation
      ? [...navigation.querySelectorAll('a[href^="#"]')]
      : [];
    const sectionLinks = pageLinks
      .map((link) => {
        const selector = link.getAttribute("href");
        const section = selector && selector.length > 1
          ? document.getElementById(selector.slice(1))
          : null;
        return section ? { link, section } : null;
      })
      .filter(Boolean)
      .sort((a, b) => {
        const position = a.section.compareDocumentPosition(b.section);
        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });

    let menuOpen = false;
    let restoreMenuFocus = null;

    const menuFocusable = () => {
      if (!navigation) return menuButton ? [menuButton] : [];
      return [menuButton, ...navigation.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter((element) => element && !element.hasAttribute("disabled"));
    };

    const closeMenu = ({ restoreFocus = false } = {}) => {
      if (!menuButton || !navigation) return;

      menuOpen = false;
      navigation.classList.remove("is-open");
      menuButton.classList.remove("is-active");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      document.body.classList.remove("sfv-menu-open");

      if (restoreFocus && restoreMenuFocus instanceof HTMLElement) {
        restoreMenuFocus.focus({ preventScroll: true });
      }
      restoreMenuFocus = null;
    };

    const openMenu = () => {
      if (!menuButton || !navigation) return;

      restoreMenuFocus = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : menuButton;
      menuOpen = true;
      navigation.classList.add("is-open");
      menuButton.classList.add("is-active");
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close navigation menu");
      document.body.classList.add("sfv-menu-open");

      const firstLink = navigation.querySelector("a[href]");
      window.requestAnimationFrame(() => firstLink?.focus());
    };

    if (menuButton && navigation) {
      menuButton.setAttribute("aria-label", "Open navigation menu");
      menuButton.addEventListener("click", () => {
        menuOpen ? closeMenu({ restoreFocus: true }) : openMenu();
      });

      navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeMenu();
      });

      document.addEventListener("pointerdown", (event) => {
        if (
          menuOpen &&
          !navigation.contains(event.target) &&
          !menuButton.contains(event.target)
        ) {
          closeMenu();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (!menuOpen) return;

        if (event.key === "Escape") {
          event.preventDefault();
          closeMenu({ restoreFocus: true });
          return;
        }

        if (event.key !== "Tab") return;
        const focusable = menuFocusable();
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });

      const handleDesktopChange = (event) => {
        if (event.matches) closeMenu();
      };
      desktopNav.addEventListener?.("change", handleDesktopChange);
    }

    const setActiveLink = (activeLink) => {
      sectionLinks.forEach(({ link }) => {
        const active = link === activeLink;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const updateActiveNavigation = () => {
      if (!sectionLinks.length) return;

      const headerHeight = header?.offsetHeight || 0;
      const probe = window.scrollY + headerHeight + Math.min(180, window.innerHeight * 0.3);
      let current = sectionLinks[0];

      sectionLinks.forEach((item) => {
        if (item.section.offsetTop <= probe) current = item;
      });
      setActiveLink(current.link);
    };

    const updateScrollState = () => {
      const scrollTop = window.scrollY || root.scrollTop || 0;
      header?.classList.toggle("is-scrolled", scrollTop > 18);

      if (backToTop) {
        const visible = scrollTop > Math.max(620, window.innerHeight * 0.75);
        backToTop.classList.toggle("is-visible", visible);
        backToTop.setAttribute("aria-hidden", String(!visible));
        backToTop.tabIndex = visible ? 0 : -1;
      }

      updateActiveNavigation();
    };

    let scrollFrame = 0;
    const requestScrollUpdate = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateScrollState();
      });
    };

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate, { passive: true });
    updateScrollState();

    backToTop?.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches ? "auto" : "smooth"
      });
    });

    const revealTargets = [...document.querySelectorAll("[data-sfv-reveal]")];
    if (revealTargets.length) {
      if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        revealTargets.forEach((target) => target.classList.add("is-visible"));
      } else {
        root.classList.add("sfv-reveal-ready");
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        }, {
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.12
        });

        revealTargets.forEach((target, index) => {
          target.style.setProperty("--sfv-reveal-index", String(index % 4));
          revealObserver.observe(target);
        });
      }
    }

    const sensoryMap = document.querySelector("[data-sfv-map]");
    const sensoryStatus = document.querySelector("[data-sfv-sense-status]");
    const sensoryStatusTitle = sensoryStatus?.querySelector("[data-sfv-sense-title]");
    const sensoryStatusCopy = sensoryStatus?.querySelector("[data-sfv-sense-copy]");
    const sensoryNodes = sensoryMap
      ? [...sensoryMap.querySelectorAll("[data-sfv-sense]")]
      : [];

    if (sensoryNodes.length) {
      if (sensoryStatus) {
        sensoryStatus.setAttribute("role", "status");
        sensoryStatus.setAttribute("aria-live", "polite");
        sensoryStatus.setAttribute("aria-atomic", "true");
      }

      const activateSense = (node) => {
        sensoryNodes.forEach((candidate) => {
          const active = candidate === node;
          candidate.classList.toggle("is-active", active);
          candidate.setAttribute("aria-pressed", String(active));
        });
        sensoryMap?.classList.add("has-active");
        if (sensoryStatus && node.dataset.sfvSense) {
          const label = node.querySelector(".sfv-sense__copy strong")?.textContent?.trim() || "Sense";
          if (sensoryStatusTitle) sensoryStatusTitle.textContent = label;
          if (sensoryStatusCopy) sensoryStatusCopy.textContent = node.dataset.sfvSense;
        }
      };

      sensoryNodes.forEach((node, index) => {
        if (sensoryStatus?.id) node.setAttribute("aria-describedby", sensoryStatus.id);

        node.addEventListener("click", () => activateSense(node));
        node.addEventListener("focus", () => activateSense(node));
        node.addEventListener("pointerenter", () => {
          if (finePointer.matches) activateSense(node);
        });
        node.addEventListener("keydown", (event) => {
          let nextIndex = null;
          if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            nextIndex = (index + 1) % sensoryNodes.length;
          } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            nextIndex = (index - 1 + sensoryNodes.length) % sensoryNodes.length;
          } else if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex = sensoryNodes.length - 1;
          }

          if (nextIndex === null) return;
          event.preventDefault();
          sensoryNodes[nextIndex].focus();
        });
      });

      const initialSense = sensoryNodes.find((node) => node.classList.contains("is-active"))
        || sensoryNodes[0];
      activateSense(initialSense);
    }

    if (heroMedia) {
      const heroImage = heroMedia.querySelector("img");
      let parallaxFrame = 0;
      let parallaxEnabled = finePointer.matches && !reducedMotion.matches;

      const resetParallax = () => {
        if (parallaxFrame) {
          window.cancelAnimationFrame(parallaxFrame);
          parallaxFrame = 0;
        }
        heroMedia.style.setProperty("--sfv-parallax-x", "0px");
        heroMedia.style.setProperty("--sfv-parallax-y", "0px");
        if (heroImage) heroImage.style.translate = "0px 0px";
      };

      const updateParallaxCapability = () => {
        parallaxEnabled = finePointer.matches && !reducedMotion.matches;
        if (!parallaxEnabled) resetParallax();
      };

      heroMedia.addEventListener("pointermove", (event) => {
        if (!parallaxEnabled || parallaxFrame) return;
        const clientX = event.clientX;
        const clientY = event.clientY;

        parallaxFrame = window.requestAnimationFrame(() => {
          parallaxFrame = 0;
          const bounds = heroMedia.getBoundingClientRect();
          const x = ((clientX - bounds.left) / bounds.width - 0.5) * 16;
          const y = ((clientY - bounds.top) / bounds.height - 0.5) * 12;
          const translateX = `${x.toFixed(2)}px`;
          const translateY = `${y.toFixed(2)}px`;
          heroMedia.style.setProperty("--sfv-parallax-x", translateX);
          heroMedia.style.setProperty("--sfv-parallax-y", translateY);
          if (heroImage) heroImage.style.translate = `${translateX} ${translateY}`;
        });
      }, { passive: true });

      heroMedia.addEventListener("pointerleave", resetParallax);
      finePointer.addEventListener?.("change", updateParallaxCapability);
      reducedMotion.addEventListener?.("change", updateParallaxCapability);
      resetParallax();
    }

    const offeringTrack = document.querySelector(".sfv-offers__track");
    if (offeringTrack) {
      offeringTrack.setAttribute("role", "region");
      offeringTrack.setAttribute("aria-roledescription", "carousel");

      const offeringStep = () => {
        const firstCard = offeringTrack.querySelector("article");
        if (!firstCard) return Math.max(240, offeringTrack.clientWidth * 0.82);
        const styles = window.getComputedStyle(offeringTrack);
        const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
        return firstCard.getBoundingClientRect().width + gap;
      };

      offeringTrack.addEventListener("keydown", (event) => {
        let left = null;
        if (event.key === "ArrowRight") left = offeringTrack.scrollLeft + offeringStep();
        else if (event.key === "ArrowLeft") left = offeringTrack.scrollLeft - offeringStep();
        else if (event.key === "Home") left = 0;
        else if (event.key === "End") left = offeringTrack.scrollWidth;

        if (left === null) return;
        event.preventDefault();
        offeringTrack.scrollTo({
          left,
          behavior: reducedMotion.matches ? "auto" : "smooth"
        });
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})();
