(() => {
  const languageMeta = {
    en: { htmlLang: "en" },
    ja: { htmlLang: "ja" },
    zh: { htmlLang: "zh-Hant" },
    th: { htmlLang: "th" }
  };

  const navText = {
    en: {
      customized: "Customized for you",
      applied: "Applied Solutions",
      products: "Applied Products",
      platform: "Platform",
      about: "Who We Are",
      insights: "Insights",
      contact: "Get In touch"
    },
    ja: {
      customized: "あなたに最適化",
      applied: "応用ソリューション",
      products: "応用製品",
      platform: "プラットフォーム",
      about: "私たちについて",
      insights: "インサイト",
      contact: "お問い合わせ"
    },
    zh: {
      customized: "為你客製",
      applied: "應用解決方案",
      products: "應用產品",
      platform: "平台",
      about: "關於我們",
      insights: "洞察",
      contact: "聯絡我們"
    },
    th: {
      customized: "ปรับเฉพาะคุณ",
      applied: "โซลูชันประยุกต์",
      products: "ผลิตภัณฑ์ประยุกต์",
      platform: "แพลตฟอร์ม",
      about: "เราเป็นใคร",
      insights: "บทความ",
      contact: "ติดต่อเรา"
    }
  };

  const languageSelect = document.querySelector("[data-exposome-language]");
  const navNodes = document.querySelectorAll("[data-i18n-nav]");

  function setLanguage(lang) {
    const safeLang = languageMeta[lang] ? lang : "th";
    const text = navText[safeLang];
    document.documentElement.lang = languageMeta[safeLang].htmlLang;
    localStorage.setItem("as-site-language", safeLang);
    if (languageSelect) languageSelect.value = safeLang;
    navNodes.forEach((node) => {
      const key = node.dataset.i18nNav;
      if (text[key]) node.textContent = text[key];
    });
  }

  const savedLanguage = localStorage.getItem("as-site-language");
  setLanguage(languageMeta[savedLanguage] ? savedLanguage : "th");
  languageSelect?.addEventListener("change", (event) => setLanguage(event.target.value));
})();
