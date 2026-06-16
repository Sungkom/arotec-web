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
      partners: "Partners",
      join: "Join Us",
      contact: "Get In touch"
    },
    ja: {
      customized: "あなたに最適化",
      applied: "応用ソリューション",
      products: "応用製品",
      platform: "プラットフォーム",
      about: "私たちについて",
      insights: "インサイト",
      partners: "パートナー",
      join: "採用情報",
      contact: "お問い合わせ"
    },
    zh: {
      customized: "為你客製",
      applied: "應用解決方案",
      products: "應用產品",
      platform: "平台",
      about: "關於我們",
      insights: "洞察",
      partners: "合作夥伴",
      join: "加入我們",
      contact: "聯絡我們"
    },
    th: {
      customized: "ปรับเฉพาะคุณ",
      applied: "โซลูชันประยุกต์",
      products: "ผลิตภัณฑ์ประยุกต์",
      platform: "แพลตฟอร์ม",
      about: "เราเป็นใคร",
      insights: "บทความ",
      partners: "พาร์ทเนอร์",
      join: "ร่วมงานกับเรา",
      contact: "ติดต่อเรา"
    }
  };

  const pageText = {
    en: {
      title: "Exposome Science | Arotec",
      description: "Arotec Exposome Science page explaining how external hazards become internal exposures, biological dysregulation, and health outcomes.",
      skip: "Skip to content",
      hero: {
        kicker: "Arotec Science Platform",
        title: "Exposome Science<br>and Human Health",
        subtitle: "From outside exposure to inside balance to health",
        copy: "Environmental and lifestyle exposures can enter the body, trigger internal biological changes, and influence long-term health and disease risk."
      },
      columns: [
        { title: "External Hazards", subtitle: "Hazards from our environment" },
        { title: "Internal Exposure", subtitle: "What enters the body and what it triggers" },
        { title: "Biological Dysregulation", subtitle: "From imbalance to overload" },
        { title: "Health Outcomes", subtitle: "The result" }
      ],
      hazards: [
        ["Physical Hazards", "UV, heat/cold, noise, radiation, weather extremes"],
        ["Chemical Hazards", "Air pollution, heavy metals, pesticides, chemicals"],
        ["Biological Hazards", "Viruses, bacteria, fungi, allergens"],
        ["Lifestyle Hazards", "Poor diet, lack of sleep, stress, sedentary behavior, smoking, alcohol"],
        ["Social Hazards", "Inequality, isolation, poor housing, pollution/noise"],
        ["Technology Hazards", "EMF, screen time, data overload, device chemicals"]
      ],
      triggers: [
        ["Oxidative stress", "Cell damage"],
        ["Inflammation", "Tissue inflammation"],
        ["Epigenetic changes", "Gene expression alteration"],
        ["Mitochondrial dysfunction", "Energy decline"],
        ["Gut & microbiome disruption", "Dysbiosis / leaky gut"],
        ["Endocrine disruption", "Hormone imbalance"]
      ],
      dysregulation: [
        ["Nervous system dysregulation", "Mood & cognitive decline"],
        ["Endocrine imbalance", "Hormone imbalance"],
        ["Cardiovascular dysfunction", "Heart & vessel damage"],
        ["Immune overactivation", "Chronic inflammation"],
        ["Respiratory impairment", "Reduced lung function"],
        ["Digestive dysfunction", "Gut barrier dysfunction"],
        ["Metabolic dysfunction", "Weight gain & insulin resistance"],
        ["Detoxification overload", "Toxin accumulation"]
      ],
      balance: [
        "Homeostasis<br><small>Balance & resilience</small>",
        "Allostatic load<br><small>Chronic stress & reduced resilience</small>"
      ],
      outcomes: [
        ["Mental disorders", "Anxiety, depression, cognitive decline"],
        ["Cardiovascular diseases", "Hypertension, heart disease, stroke"],
        ["Respiratory diseases", "Asthma, COPD, chronic infections"],
        ["Metabolic disorders", "Obesity, diabetes, fatty liver"],
        ["Immune dysfunction", "Allergies, autoimmune disease, infections"],
        ["Endocrine imbalance", "Thyroid disorders, PCOS, infertility"],
        ["Skin & allergic diseases", "Eczema, dermatitis, food allergies"],
        ["Cancers", "Lung, breast, colon, leukemia, liver cancer"]
      ],
      why: {
        title: "Why it matters",
        copy: "Understanding the exposome helps us see the bigger picture: where exposures come from, how they affect our biology, and the health outcomes they can drive.",
        better: "Less exposure.<br>Better balance.<br>Better health."
      },
      footer: "Back to Arotec home"
    },
    ja: {
      title: "エクスポソーム科学 | Arotec",
      description: "外部ハザードが体内曝露、生物学的調節不全、健康アウトカムへつながる流れを説明するArotecのエクスポソーム科学ページです。",
      skip: "本文へ移動",
      hero: {
        kicker: "Arotec サイエンスプラットフォーム",
        title: "エクスポソーム科学<br>と人の健康",
        subtitle: "外からの曝露から内側のバランス、そして健康へ",
        copy: "環境や生活習慣からの曝露は体内に入り、内部の生物学的変化を引き起こし、長期的な健康や疾病リスクに影響します。"
      },
      columns: [
        { title: "外部ハザード", subtitle: "私たちを取り巻く環境からのハザード" },
        { title: "体内曝露", subtitle: "体内に入るものと、それが引き起こす反応" },
        { title: "生物学的調節不全", subtitle: "不均衡から過負荷へ" },
        { title: "健康アウトカム", subtitle: "その結果" }
      ],
      hazards: [
        ["物理的ハザード", "UV、暑熱・寒冷、騒音、放射線、極端な天候"],
        ["化学的ハザード", "大気汚染、重金属、農薬、化学物質"],
        ["生物学的ハザード", "ウイルス、細菌、真菌、アレルゲン"],
        ["ライフスタイルハザード", "偏った食事、睡眠不足、ストレス、運動不足、喫煙、飲酒"],
        ["社会的ハザード", "格差、孤立、住環境不良、汚染・騒音"],
        ["テクノロジーハザード", "電磁波、スクリーン時間、情報過多、デバイス由来化学物質"]
      ],
      triggers: [
        ["酸化ストレス", "細胞ダメージ"],
        ["炎症", "組織炎症"],
        ["エピジェネティック変化", "遺伝子発現の変化"],
        ["ミトコンドリア機能不全", "エネルギー低下"],
        ["腸・マイクロバイオームの乱れ", "ディスバイオーシス・リーキーガット"],
        ["内分泌かく乱", "ホルモンバランスの乱れ"]
      ],
      dysregulation: [
        ["神経系の調節不全", "気分・認知機能の低下"],
        ["内分泌バランスの乱れ", "ホルモン不均衡"],
        ["心血管機能不全", "心臓・血管ダメージ"],
        ["免疫の過剰活性", "慢性炎症"],
        ["呼吸機能の低下", "肺機能の低下"],
        ["消化機能不全", "腸管バリア機能の低下"],
        ["代謝機能不全", "体重増加・インスリン抵抗性"],
        ["解毒負荷の過剰", "毒素蓄積"]
      ],
      balance: [
        "ホメオスタシス<br><small>バランスと回復力</small>",
        "アロスタティック負荷<br><small>慢性ストレスと回復力低下</small>"
      ],
      outcomes: [
        ["精神・認知の不調", "不安、抑うつ、認知機能低下"],
        ["心血管疾患", "高血圧、心疾患、脳卒中"],
        ["呼吸器疾患", "喘息、COPD、慢性感染"],
        ["代謝障害", "肥満、糖尿病、脂肪肝"],
        ["免疫機能不全", "アレルギー、自己免疫疾患、感染症"],
        ["内分泌バランスの乱れ", "甲状腺疾患、PCOS、不妊"],
        ["皮膚・アレルギー疾患", "湿疹、皮膚炎、食物アレルギー"],
        ["がん", "肺、乳房、大腸、白血病、肝臓がん"]
      ],
      why: {
        title: "なぜ重要か",
        copy: "エクスポソームを理解すると、曝露がどこから来て、私たちの生物学にどう影響し、どの健康アウトカムにつながるかを俯瞰できます。",
        better: "曝露を少なく。<br>バランスを高める。<br>健康をより良く。"
      },
      footer: "Arotec ホームへ戻る"
    },
    zh: {
      title: "暴露體科學 | Arotec",
      description: "Arotec暴露體科學頁面，說明外部危害如何轉化為內在暴露、生物調節失衡與健康結果。",
      skip: "跳至主要內容",
      hero: {
        kicker: "Arotec 科學平台",
        title: "暴露體科學<br>與人類健康",
        subtitle: "從外在暴露到內在平衡，再到健康",
        copy: "環境與生活型態暴露可能進入身體，引發內部生物變化，並影響長期健康與疾病風險。"
      },
      columns: [
        { title: "外部危害", subtitle: "來自我們環境的危害" },
        { title: "內在暴露", subtitle: "進入身體的物質與它觸發的反應" },
        { title: "生物調節失衡", subtitle: "從失衡到過載" },
        { title: "健康結果", subtitle: "最終結果" }
      ],
      hazards: [
        ["物理危害", "紫外線、冷熱、噪音、輻射、極端天氣"],
        ["化學危害", "空氣污染、重金屬、農藥、化學物質"],
        ["生物危害", "病毒、細菌、真菌、過敏原"],
        ["生活型態危害", "飲食不良、睡眠不足、壓力、久坐、吸菸、酒精"],
        ["社會危害", "不平等、孤立、居住環境不佳、污染/噪音"],
        ["科技危害", "電磁場、螢幕時間、資料過載、裝置化學物"]
      ],
      triggers: [
        ["氧化壓力", "細胞損傷"],
        ["發炎", "組織發炎"],
        ["表觀遺傳變化", "基因表現改變"],
        ["粒線體功能失調", "能量下降"],
        ["腸道與微生物相失衡", "菌相失衡/腸漏"],
        ["內分泌干擾", "荷爾蒙失衡"]
      ],
      dysregulation: [
        ["神經系統失衡", "情緒與認知下降"],
        ["內分泌失衡", "荷爾蒙失衡"],
        ["心血管功能失調", "心臟與血管損傷"],
        ["免疫過度活化", "慢性發炎"],
        ["呼吸功能受損", "肺功能下降"],
        ["消化功能失調", "腸道屏障失調"],
        ["代謝功能失調", "體重增加與胰島素阻抗"],
        ["解毒負荷過高", "毒素累積"]
      ],
      balance: [
        "恆定調節<br><small>平衡與韌性</small>",
        "異位負荷<br><small>慢性壓力與韌性下降</small>"
      ],
      outcomes: [
        ["心理與認知障礙", "焦慮、憂鬱、認知下降"],
        ["心血管疾病", "高血壓、心臟病、中風"],
        ["呼吸系統疾病", "氣喘、COPD、慢性感染"],
        ["代謝障礙", "肥胖、糖尿病、脂肪肝"],
        ["免疫功能失調", "過敏、自體免疫疾病、感染"],
        ["內分泌失衡", "甲狀腺疾病、PCOS、不孕"],
        ["皮膚與過敏疾病", "濕疹、皮膚炎、食物過敏"],
        ["癌症", "肺癌、乳癌、大腸癌、白血病、肝癌"]
      ],
      why: {
        title: "為什麼重要",
        copy: "了解暴露體能幫助我們看見更大的圖像：暴露從哪裡來、如何影響我們的生物機制，以及可能推動哪些健康結果。",
        better: "減少暴露。<br>提升平衡。<br>改善健康。"
      },
      footer: "返回 Arotec 首頁"
    },
    th: {
      title: "วิทยาศาสตร์เอกซ์โพโซม | Arotec",
      description: "หน้า Exposome Science ของ Arotec อธิบายว่าปัจจัยเสี่ยงภายนอกเปลี่ยนเป็นการรับสัมผัสภายใน การเสียสมดุลทางชีวภาพ และผลลัพธ์ต่อสุขภาพได้อย่างไร",
      skip: "ข้ามไปยังเนื้อหา",
      hero: {
        kicker: "แพลตฟอร์มวิทยาศาสตร์ Arotec",
        title: "วิทยาศาสตร์เอกซ์โพโซม<br>และสุขภาพมนุษย์",
        subtitle: "จากการรับสัมผัสภายนอก สู่สมดุลภายใน และสุขภาพ",
        copy: "ปัจจัยแวดล้อมและไลฟ์สไตล์สามารถเข้าสู่ร่างกาย กระตุ้นการเปลี่ยนแปลงทางชีวภาพภายใน และส่งผลต่อสุขภาพระยะยาวกับความเสี่ยงของโรค"
      },
      columns: [
        { title: "ปัจจัยเสี่ยงภายนอก", subtitle: "ปัจจัยเสี่ยงจากสภาพแวดล้อมรอบตัวเรา" },
        { title: "การรับสัมผัสภายใน", subtitle: "สิ่งที่เข้าสู่ร่างกายและสิ่งที่มันกระตุ้น" },
        { title: "การเสียสมดุลทางชีวภาพ", subtitle: "จากความไม่สมดุลสู่ภาวะเกินรับ" },
        { title: "ผลลัพธ์ต่อสุขภาพ", subtitle: "ผลที่ตามมา" }
      ],
      hazards: [
        ["ปัจจัยทางกายภาพ", "รังสี UV ความร้อน/เย็น เสียงดัง รังสี สภาพอากาศสุดขั้ว"],
        ["ปัจจัยทางเคมี", "มลพิษทางอากาศ โลหะหนัก สารกำจัดศัตรูพืช สารเคมี"],
        ["ปัจจัยทางชีวภาพ", "ไวรัส แบคทีเรีย เชื้อรา สารก่อภูมิแพ้"],
        ["ปัจจัยจากไลฟ์สไตล์", "อาหารไม่สมดุล นอนน้อย ความเครียด นั่งนาน สูบบุหรี่ แอลกอฮอล์"],
        ["ปัจจัยทางสังคม", "ความเหลื่อมล้ำ ความโดดเดี่ยว ที่อยู่อาศัยไม่เหมาะสม มลพิษ/เสียงรบกวน"],
        ["ปัจจัยจากเทคโนโลยี", "คลื่นแม่เหล็กไฟฟ้า เวลาอยู่หน้าจอ ข้อมูลล้นเกิน สารเคมีจากอุปกรณ์"]
      ],
      triggers: [
        ["ความเครียดออกซิเดชัน", "ความเสียหายของเซลล์"],
        ["การอักเสบ", "การอักเสบของเนื้อเยื่อ"],
        ["การเปลี่ยนแปลงอีพีเจเนติก", "การเปลี่ยนแปลงการแสดงออกของยีน"],
        ["ไมโทคอนเดรียทำงานผิดปกติ", "พลังงานลดลง"],
        ["ลำไส้และไมโครไบโอมเสียสมดุล", "Dysbiosis / ลำไส้รั่ว"],
        ["การรบกวนระบบต่อมไร้ท่อ", "ฮอร์โมนเสียสมดุล"]
      ],
      dysregulation: [
        ["ระบบประสาทเสียสมดุล", "อารมณ์และการคิดลดลง"],
        ["ต่อมไร้ท่อเสียสมดุล", "ฮอร์โมนเสียสมดุล"],
        ["หัวใจและหลอดเลือดทำงานผิดปกติ", "ความเสียหายของหัวใจและหลอดเลือด"],
        ["ภูมิคุ้มกันทำงานเกิน", "การอักเสบเรื้อรัง"],
        ["ระบบหายใจบกพร่อง", "สมรรถภาพปอดลดลง"],
        ["ระบบย่อยอาหารผิดปกติ", "เกราะป้องกันลำไส้เสียสมดุล"],
        ["ระบบเผาผลาญผิดปกติ", "น้ำหนักเพิ่มและดื้อต่ออินซูลิน"],
        ["ภาระการขับพิษเกินรับ", "สารพิษสะสม"]
      ],
      balance: [
        "ภาวะสมดุล<br><small>สมดุลและความยืดหยุ่น</small>",
        "ภาระอัลโลสแตติก<br><small>ความเครียดเรื้อรังและความยืดหยุ่นลดลง</small>"
      ],
      outcomes: [
        ["ความผิดปกติทางอารมณ์และการคิด", "วิตกกังวล ซึมเศร้า การคิดลดลง"],
        ["โรคหัวใจและหลอดเลือด", "ความดันสูง โรคหัวใจ โรคหลอดเลือดสมอง"],
        ["โรคระบบทางเดินหายใจ", "หอบหืด COPD การติดเชื้อเรื้อรัง"],
        ["ความผิดปกติของระบบเผาผลาญ", "อ้วน เบาหวาน ไขมันพอกตับ"],
        ["ภูมิคุ้มกันผิดปกติ", "ภูมิแพ้ โรคภูมิต้านตนเอง การติดเชื้อ"],
        ["ฮอร์โมนเสียสมดุล", "โรคไทรอยด์ PCOS ภาวะมีบุตรยาก"],
        ["โรคผิวหนังและภูมิแพ้", "ผื่นผิวหนัง ผิวหนังอักเสบ แพ้อาหาร"],
        ["มะเร็ง", "ปอด เต้านม ลำไส้ใหญ่ ลิวคีเมีย ตับ"]
      ],
      why: {
        title: "ทำไมเรื่องนี้สำคัญ",
        copy: "การเข้าใจเอกซ์โพโซมช่วยให้เราเห็นภาพใหญ่ขึ้นว่า การรับสัมผัสมาจากไหน ส่งผลต่อชีววิทยาของเราอย่างไร และอาจนำไปสู่ผลลัพธ์สุขภาพแบบใด",
        better: "ลดการรับสัมผัส<br>สมดุลดีขึ้น<br>สุขภาพดีขึ้น"
      },
      footer: "กลับหน้าแรก Arotec"
    }
  };

  const languageSelect = document.querySelector("[data-exposome-language]");
  const navNodes = document.querySelectorAll("[data-i18n-nav]");
  const metaDescription = document.querySelector('meta[name="description"]');

  function setText(selector, value, html = false) {
    const node = document.querySelector(selector);
    if (!node) return;
    if (html) node.innerHTML = value;
    else node.textContent = value;
  }

  function setPair(nodes, entries, titleSelector, textSelector, html = false) {
    nodes.forEach((node, index) => {
      const entry = entries[index];
      if (!entry) return;
      const title = node.querySelector(titleSelector);
      const text = node.querySelector(textSelector);
      if (title) title.textContent = entry[0];
      if (text) {
        if (html) text.innerHTML = entry[1];
        else text.textContent = entry[1];
      }
    });
  }

  function renderPage(lang) {
    const page = pageText[lang] || pageText.th;
    document.title = page.title;
    if (metaDescription) metaDescription.setAttribute("content", page.description);

    setText(".skip-link", page.skip);
    setText(".exposome-kicker", page.hero.kicker);
    setText(".exposome-hero h1", page.hero.title, true);
    setText(".hero-subtitle", page.hero.subtitle);
    setText(".hero-copy", page.hero.copy);

    document.querySelectorAll(".pathway-column").forEach((column, index) => {
      const text = page.columns[index];
      if (!text) return;
      column.querySelector("h2").textContent = text.title;
      column.querySelector(":scope > p").textContent = text.subtitle;
    });

    setPair(document.querySelectorAll(".hazard-card"), page.hazards, "h3", "p");
    setPair(document.querySelectorAll(".trigger-list > div"), page.triggers, "b", "small");
    setPair(document.querySelectorAll(".dysregulation-list > div"), page.dysregulation, "b", "em");
    setPair(document.querySelectorAll(".outcome-grid > div"), page.outcomes, "b", "p");

    const balanceItems = document.querySelectorAll(".balance-card > span");
    balanceItems.forEach((node, index) => {
      if (page.balance[index]) node.innerHTML = page.balance[index];
    });

    setText(".why-section h2", page.why.title);
    setText(".why-section h2 + p", page.why.copy);
    setText(".better-card p", page.why.better, true);
    setText(".exposome-footer a", page.footer);
  }

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
    renderPage(safeLang);
  }

  const savedLanguage = localStorage.getItem("as-site-language");
  setLanguage(languageMeta[savedLanguage] ? savedLanguage : "th");
  languageSelect?.addEventListener("change", (event) => setLanguage(event.target.value));
})();
