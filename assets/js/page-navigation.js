/* Site hierarchy breadcrumbs and an in-flow return to the page heading. */
(() => {
  'use strict';
  if (window.ArotecPageNavigation) return;
  window.ArotecPageNavigation = { version: '2.5.0' };
  const source = document.currentScript;
  const base = new URL('../../', source.src);
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = new URL('../css/page-navigation.css?v=20261007-refinement-1', source.src).href;
  document.head.append(sheet);
  const routes = {"index.html":{"label":"Home","parents":[],"localizedPaths":{"en":"en/index.html","th":"th/index.html","ja":"ja/index.html","zh-Hans":"zh-Hans/index.html","zh-Hant":"zh-Hant/index.html"}},"uniquely-yours.html":{"label":"Uniquely Yours","parents":["index.html"]},"pages/applied-solutions-overview.html":{"label":"Applied Solutions","parents":["index.html"]},"pages/applied-products.html":{"label":"Applied Products","parents":["index.html"]},"pages/partners.html":{"label":"Partners","parents":["index.html"]},"pages/who-we-are.html":{"label":"Who We Are","parents":["index.html"]},"pages/co-creation.html":{"label":"Co-Creation","parents":["index.html"],"localizedPaths":{"en":"en/pages/co-creation.html","th":"th/pages/co-creation.html","ja":"ja/pages/co-creation.html","zh-Hans":"zh-Hans/pages/co-creation.html","zh-Hant":"zh-Hant/pages/co-creation.html"}},"pages/join-us.html":{"label":"Join Us","parents":["index.html"]},"pages/get-in-touch.html":{"label":"Get in Touch","parents":["index.html"],"localizedPaths":{"en":"en/pages/get-in-touch.html","th":"th/pages/get-in-touch.html","ja":"ja/pages/get-in-touch.html","zh-Hans":"zh-Hans/pages/get-in-touch.html","zh-Hant":"zh-Hant/pages/get-in-touch.html"}},"pages/applied-solutions.html":{"label":"Sensory Strategies","parents":["index.html","pages/applied-solutions-overview.html"]},"pages/synesthetic-flavor.html":{"label":"Synesthetic Flavors","parents":["index.html","pages/applied-solutions-overview.html"]},"pages/bio-responsive-scents.html":{"label":"Bio-Responsive Ingredients","parents":["index.html","pages/applied-solutions-overview.html"]},"pages/health-wellness-scented-supplements.html":{"label":"Health & Wellness: Scented Supplements","parents":["index.html","pages/applied-solutions-overview.html"]},"pages/sensory-strategies-feeling.html":{"label":"It Starts with a Feeling","parents":["index.html","pages/applied-solutions-overview.html","pages/applied-solutions.html"]},"pages/sensory-strategies-brand.html":{"label":"Brand Experience","parents":["index.html","pages/applied-solutions-overview.html","pages/applied-solutions.html"]},"pages/sensory-strategies-scent.html":{"label":"Scent and Atmosphere","parents":["index.html","pages/applied-solutions-overview.html","pages/applied-solutions.html"]},"pages/sensory-strategies-multisensory.html":{"label":"Multisensory Experience","parents":["index.html","pages/applied-solutions-overview.html","pages/applied-solutions.html"]},"pages/sensory-strategies-value.html":{"label":"Experience Creates Value","parents":["index.html","pages/applied-solutions-overview.html","pages/applied-solutions.html"]},"pages/sensory-strategies-process.html":{"label":"How We Build a Sensory Strategy","parents":["index.html","pages/applied-solutions-overview.html","pages/applied-solutions.html"]},"pages/sensory-strategies-services.html":{"label":"Sensory Strategy Services","parents":["index.html","pages/applied-solutions-overview.html","pages/applied-solutions.html"]},"pages/bio-responsive-ingredients.html":{"label":"How Bio-Responsive Ingredients Work","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-research.html":{"label":"Bio-Responsive Research","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-olfactiva.html":{"label":"Olfactiva™","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-trevion.html":{"label":"Trevion™","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-meraxyl.html":{"label":"Meraxyl™","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-cortiva.html":{"label":"Cortiva™","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-melacor.html":{"label":"Melacor™","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-morphagen.html":{"label":"Morphagen™","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/bio-responsive-chromgen.html":{"label":"Chromgen™","parents":["index.html","pages/applied-solutions-overview.html","pages/bio-responsive-scents.html"]},"pages/synesthetic-flavor-cultures.html":{"label":"Flavor and Culture","parents":["index.html","pages/applied-solutions-overview.html","pages/synesthetic-flavor.html"]},"pages/synesthetic-flavor-human-experience.html":{"label":"Flavor and Human Experience","parents":["index.html","pages/applied-solutions-overview.html","pages/synesthetic-flavor.html"]},"pages/synesthetic-flavor-create-flavors.html":{"label":"Creating Flavors","parents":["index.html","pages/applied-solutions-overview.html","pages/synesthetic-flavor.html"]},"pages/synesthetic-flavor-partnership.html":{"label":"Flavor Partnership","parents":["index.html","pages/applied-solutions-overview.html","pages/synesthetic-flavor.html"]},"pages/synesthetic-flavor-more.html":{"label":"Flavor Expertise","parents":["index.html","pages/applied-solutions-overview.html","pages/synesthetic-flavor.html"]},"pages/synesthetic-flavor-better-for-you.html":{"label":"Better-for-You Flavor","parents":["index.html","pages/applied-solutions-overview.html","pages/synesthetic-flavor.html"]},"pages/autonomic-neuro.html":{"label":"Autonomic Regulation","parents":["index.html","pages/applied-products.html"]},"pages/beauty-health.html":{"label":"Beauty, Health & Wellbeing","parents":["index.html","pages/applied-products.html"]},"pages/chemical-messengers.html":{"label":"Chemical Messengers","parents":["index.html","pages/applied-products.html"]},"pages/homeostasis.html":{"label":"Homeostasis","parents":["index.html","pages/applied-products.html"]},"pages/mental-health.html":{"label":"Mental Health","parents":["index.html","pages/applied-products.html"]},"pages/pni.html":{"label":"Psychoneuroimmunology","parents":["index.html","pages/applied-products.html"]},"pages/skin-sensory-standard.html":{"label":"Skin Sensory Standard","parents":["index.html","pages/applied-products.html"]},"pages/bespoke-services.html":{"label":"Bespoke Services","parents":["index.html","pages/applied-products.html"]},"pages/vagus-scent-bulb.html":{"label":"Vagus Scent Bulb","parents":["index.html","pages/applied-products.html"]},"applied-products-countdown.html":{"label":"Vaguspa & Vagushot","parents":["index.html","pages/applied-products.html"]},"pages/exposome.html":{"label":"Exposome Science","parents":["index.html","index.html#research-focus"]},"pages/stress-atc.html":{"label":"Stress Neurobiology","parents":["index.html","index.html#research-focus"]},"pages/homeostasis-regulation.html":{"label":"Homeostasis Regulation","parents":["index.html","index.html#research-focus"]},"pages/human-longevity-aging.html":{"label":"Longevity & Aging","parents":["index.html","index.html#research-focus"]},"pages/olfactory-science.html":{"label":"Olfactory Science","parents":["index.html","index.html#research-focus"]},"pages/synesthesia-inspired-perception.html":{"label":"Synesthesia-Inspired Perception","parents":["index.html","index.html#research-focus"]},"pages/neuroplasticity.html":{"label":"Neuroplasticity","parents":["index.html","index.html#research-focus"]},"pages/neuro-scented-therapy.html":{"label":"Neuro-Scented Therapy","parents":["index.html","index.html#research-focus"]},"pages/Neuro-Skin-Science.html":{"label":"Neuro-Skin Science","parents":["index.html","index.html#research-focus"],"localizedPaths":{"en":"en/Neuro-Skin-Science.html","th":"th/Neuro-Skin-Science.html","ja":"ja/Neuro-Skin-Science.html","zh-Hans":"zh-Hans/Neuro-Skin-Science.html","zh-Hant":"zh-Hant/Neuro-Skin-Science.html"}},"pages/hair-follicle-biology.html":{"label":"Hair Follicle Biology","parents":["index.html","index.html#research-focus"]},"pages/piper-longum.html":{"label":"Piper Longum","parents":["index.html"]},"pages/neuro-skin-care.html":{"label":"Neuro-Skin Care","parents":["index.html","group:insights"]},"pages/brain-skin-neurocutaneous-loop.html":{"label":"Brain–Skin Neurocutaneous Feedback Loop","parents":["index.html","index.html#research-focus","pages/Neuro-Skin-Science.html"]},"pages/human-longevity-aging2.html":{"label":"Aging Dynamics","parents":["index.html","index.html#research-focus","pages/human-longevity-aging.html"]},"exercise-beauty.html":{"label":"Exercise × Beauty","parents":["index.html","group:insights"]},"exercise-health.html":{"label":"Exercise × Health","parents":["index.html","group:insights"]},"pages/sleep-health.html":{"label":"Sleep × Health","parents":["index.html","group:insights"]},"sleep-human-beauty/index.html":{"label":"Sleep × Beauty","parents":["index.html","group:insights"]},"pages/deep-sea-water.html":{"label":"Deep Sea Water","parents":["index.html","pages/partners.html"]},"pages/water-activator.html":{"label":"Water Activator","parents":["index.html","pages/partners.html"]},"pages/sakae.html":{"label":"Sakae","parents":["index.html","pages/partners.html"]},"pages/kobayashi.html":{"label":"Kobayashi","parents":["index.html","pages/partners.html"]},"pages/deep-sea-water-benefits.html":{"label":"Deep Sea Water Benefits","parents":["index.html","pages/partners.html","pages/deep-sea-water.html"]},"pages/deep-sea-water-applications.html":{"label":"Deep Sea Water Applications","parents":["index.html","pages/partners.html","pages/deep-sea-water.html"]},"pages/water-activator-technology.html":{"label":"Water Activator Technology","parents":["index.html","pages/partners.html","pages/water-activator.html"]},"pages/who-we-are-details.html":{"label":"What Defines Us","parents":["index.html","pages/who-we-are.html"]},"pages/scientific-foundation.html":{"label":"Scientific Foundation","parents":["index.html","pages/who-we-are.html"]},"pages/how-we-create-value.html":{"label":"How We Create Value","parents":["index.html","pages/who-we-are.html"]},"pages/global-capability-and-people.html":{"label":"Global Capability & People","parents":["index.html","pages/who-we-are.html"]},"pages/leadership-responsibility-and-future.html":{"label":"Leadership, Responsibility & Future","parents":["index.html","pages/who-we-are.html"]},"pages/customized.html":{"label":"Customized Formula","parents":["index.html"]},"pages/members.html":{"label":"Member Registration","parents":["index.html"]},"pages/admin-members.html":{"label":"Member Administration","parents":["index.html","pages/members.html"]},"pages/careers-admin.html":{"label":"Recruitment Administration","parents":["index.html","pages/join-us.html"]},"pages/contact-admin.html":{"label":"Contact Inquiries","parents":["index.html","pages/get-in-touch.html"]},"languages.html":{"label":"Choose a Language","parents":["index.html"]},"en/cookie-policy.html":{"label":"Cookie & Browser-Storage Policy","parents":["index.html"],"localizedPaths":{"en":"en/cookie-policy.html","th":"th/cookie-policy.html","ja":"ja/cookie-policy.html","zh-Hans":"zh-Hans/cookie-policy.html","zh-Hant":"zh-Hant/cookie-policy.html"}},"index.html#research-focus":{"label":"A&S Research Focus","parents":["index.html"],"localizedPaths":{"en":"en/index.html#research-focus","th":"th/index.html#research-focus","ja":"ja/index.html#research-focus","zh-Hans":"zh-Hans/index.html#research-focus","zh-Hant":"zh-Hant/index.html#research-focus"}},"group:insights":{"label":"Insights","parents":["index.html"],"group":true},"pages/sleep-beauty.html":{"label":"Sleep x Beauty","parents":["index.html","group:insights"]}};
  const aliases = {"co-creation.html":"pages/co-creation.html","deep-sea-water.html":"pages/deep-sea-water.html","en/index.html":"index.html","en/Neuro-Skin-Science.html":"pages/Neuro-Skin-Science.html","en/pages/co-creation.html":"pages/co-creation.html","en/pages/get-in-touch.html":"pages/get-in-touch.html","exercise-beauty/index.html":"exercise-beauty.html","exercise-health/index.html":"exercise-health.html","exposome.html":"pages/exposome.html","homeostasis-regulation.html":"pages/homeostasis-regulation.html","human-longevity-aging.html":"pages/human-longevity-aging.html","human-longevity-aging2.html":"pages/human-longevity-aging2.html","ja/cookie-policy.html":"en/cookie-policy.html","ja/index.html":"index.html","ja/Neuro-Skin-Science.html":"pages/Neuro-Skin-Science.html","ja/pages/co-creation.html":"pages/co-creation.html","ja/pages/get-in-touch.html":"pages/get-in-touch.html","neuro-scented-therapy.html":"pages/neuro-scented-therapy.html","neuro-skin-care.html":"pages/neuro-skin-care.html","Neuro-Skin-Science.html":"pages/Neuro-Skin-Science.html","neuroplasticity.html":"pages/neuroplasticity.html","olfactory-science.html":"pages/olfactory-science.html","pages/contact.html":"pages/members.html","pages/exercise-beauty.html":"exercise-beauty.html","pages/exercise-health.html":"exercise-health.html","pages/products.html":"pages/applied-products.html","pages/stress-neurobiology.html":"pages/stress-atc.html","sleep-health.html":"pages/sleep-health.html","stress-atc.html":"pages/stress-atc.html","stress-neurobiology.html":"pages/stress-atc.html","synesthesia-inspired-perception.html":"pages/synesthesia-inspired-perception.html","synesthetic-flavor/index.html":"pages/synesthetic-flavor.html","th/cookie-policy.html":"en/cookie-policy.html","th/index.html":"index.html","th/Neuro-Skin-Science.html":"pages/Neuro-Skin-Science.html","th/pages/co-creation.html":"pages/co-creation.html","th/pages/get-in-touch.html":"pages/get-in-touch.html","vagus-scent-bulb.html":"pages/vagus-scent-bulb.html","zh-Hans/cookie-policy.html":"en/cookie-policy.html","zh-Hans/index.html":"index.html","zh-Hans/Neuro-Skin-Science.html":"pages/Neuro-Skin-Science.html","zh-Hans/pages/co-creation.html":"pages/co-creation.html","zh-Hans/pages/get-in-touch.html":"pages/get-in-touch.html","zh-Hant/cookie-policy.html":"en/cookie-policy.html","zh-Hant/index.html":"index.html","zh-Hant/Neuro-Skin-Science.html":"pages/Neuro-Skin-Science.html","zh-Hant/pages/co-creation.html":"pages/co-creation.html","zh-Hant/pages/get-in-touch.html":"pages/get-in-touch.html"};
  const labels = {"index.html":{"en":"Home","th":"หน้าแรก","ja":"ホーム","zh-Hant":"首頁","zh-Hans":"首页"},"pages/applied-solutions-overview.html":{"en":"Applied Solutions","th":"โซลูชันประยุกต์","ja":"応用ソリューション","zh-Hant":"應用解決方案","zh-Hans":"应用解决方案"},"pages/applied-solutions.html":{"en":"Sensory Strategies","th":"กลยุทธ์ธุรกิจผ่านประสาทสัมผัส","ja":"感覚科学に基づくビジネス戦略","zh-Hant":"感官商業策略","zh-Hans":"感官商业策略"},"pages/bio-responsive-scents.html":{"en":"Bio-Responsive Ingredients","th":"ส่วนผสมตอบสนองทางชีวภาพ","ja":"生体応答性成分","zh-Hant":"生物反應性原料","zh-Hans":"生物反应性原料"},"pages/synesthetic-flavor.html":{"en":"Synesthetic Flavors","th":"กลิ่นรสข้ามประสาทสัมผัส","ja":"共感覚フレーバー","zh-Hant":"聯覺風味","zh-Hans":"联觉风味"},"pages/applied-products.html":{"en":"Applied Products","th":"ผลิตภัณฑ์ประยุกต์","ja":"応用製品","zh-Hant":"應用產品","zh-Hans":"应用产品"},"pages/partners.html":{"en":"Partners","th":"พันธมิตร","ja":"パートナー","zh-Hant":"合作夥伴","zh-Hans":"合作伙伴"},"pages/who-we-are.html":{"en":"Who We Are","th":"เกี่ยวกับเรา","ja":"私たちについて","zh-Hant":"關於我們","zh-Hans":"关于我们"},"pages/get-in-touch.html":{"en":"Get in Touch","th":"ติดต่อเรา","ja":"お問い合わせ","zh-Hant":"聯絡我們","zh-Hans":"联系我们"},"pages/co-creation.html":{"en":"Co-Creation","th":"บริการร่วมสร้าง","ja":"共創サービス","zh-Hant":"共同開發服務","zh-Hans":"共同开发服务"},"pages/deep-sea-water.html":{"en":"Deep Sea Water","th":"น้ำทะเลลึกมุโรโตะ","ja":"室戸海洋深層水","zh-Hant":"室戶海洋深層水","zh-Hans":"室户海洋深层水"},"pages/water-activator.html":{"en":"Water Activator","th":"ระบบกระตุ้นน้ำ","ja":"水活性化システム","zh-Hant":"水活化系統","zh-Hans":"水活化系统"},"pages/join-us.html":{"en":"Join Us","th":"ร่วมงานกับเรา","ja":"採用情報","zh-Hant":"加入我們","zh-Hans":"加入我们"},"pages/Neuro-Skin-Science.html":{"en":"Neuro-Skin Science","th":"การดูแลผิวบนพื้นฐานประสาทวิทยา","ja":"ニューロスキンケア","zh-Hant":"神經源護膚","zh-Hans":"神经源护肤"},"pages/human-longevity-aging.html":{"en":"Human Longevity & Aging","th":"อายุยืนและความเสื่อมตามวัย","ja":"人の長寿と老化","zh-Hant":"人類長壽與老化","zh-Hans":"人类长寿与老化"},"pages/members.html":{"en":"Member Registration","th":"ลงทะเบียนสมาชิก","ja":"会員登録","zh-Hant":"會員註冊","zh-Hans":"会员注册"},"pages/bio-responsive-ingredients.html":{"en":"How Bio-Responsive Ingredients Work","th":"ส่วนผสมตอบสนองทางชีวภาพทำงานอย่างไร","ja":"生体応答性成分の仕組み","zh-Hant":"生物反應性原料如何運作","zh-Hans":"生物反应性原料如何运作"},"index.html#research-focus":{"en":"A&S Research Focus","th":"จุดเน้นงานวิจัยของ A&S","ja":"A&S の研究領域","zh-Hant":"A&S 研究焦點","zh-Hans":"A&S 研究焦点"},"group:insights":{"en":"Insights","th":"สาระเชิงลึก","ja":"インサイト","zh-Hant":"洞察","zh-Hans":"洞察"},"pages/sleep-beauty.html":{"en":"Sleep x Beauty","th":"การนอนหลับ x ความงาม","ja":"睡眠と美","zh-Hant":"睡眠 × 美麗","zh-Hans":"睡眠 × 美丽"}};
  const mounts = {"uniquely-yours.html":{"selector":"#main div.nuro-countdown","mode":"intro-copy"},"pages/applied-solutions-overview.html":{"selector":"#main header.aso-heading","mode":"intro-copy"},"pages/applied-products.html":{"selector":"#main","mode":"main-flow-canvas-exception"},"pages/partners.html":{"selector":"#main header.partners-intro","mode":"intro-copy"},"pages/who-we-are.html":{"selector":"#main div.wwa-flight-copy","mode":"intro-copy"},"pages/co-creation.html":{"selector":"#main div.cc-hero-copy","mode":"intro-copy"},"pages/join-us.html":{"selector":"#main div.ju-hero-copy","mode":"intro-copy"},"pages/get-in-touch.html":{"selector":"#main div.ci-hero-copy","mode":"intro-copy"},"pages/applied-solutions.html":{"selector":"#main div.as-copy","mode":"intro-copy"},"pages/synesthetic-flavor.html":{"selector":"#main div.sfl-copy","mode":"intro-copy"},"pages/bio-responsive-scents.html":{"selector":"#introduction .brs-v5-hero-copy","mode":"intro-copy"},"pages/health-wellness-scented-supplements.html":{"selector":"#main div.sws-copy","mode":"intro-copy"},"pages/sensory-strategies-feeling.html":{"selector":"#main div.sf-copy","mode":"intro-copy"},"pages/sensory-strategies-brand.html":{"selector":"#main div.sb-copy","mode":"intro-copy"},"pages/sensory-strategies-scent.html":{"selector":"#main div.sc-copy","mode":"intro-copy"},"pages/sensory-strategies-multisensory.html":{"selector":"#main div.ms-copy","mode":"intro-copy"},"pages/sensory-strategies-value.html":{"selector":"#main div.sv-copy.sv-frame","mode":"intro-copy"},"pages/sensory-strategies-process.html":{"selector":"#main div.spc-copy","mode":"intro-copy"},"pages/sensory-strategies-services.html":{"selector":"#main div.sv-copy","mode":"intro-copy"},"pages/bio-responsive-ingredients.html":{"selector":"#why-bio-responsive .bri-hero-copy","mode":"intro-copy"},"pages/bio-responsive-research.html":{"selector":"#research-focus .asr-hero-copy","mode":"intro-copy"},"pages/bio-responsive-olfactiva.html":{"selector":"#main header.olf-catalog-header","mode":"intro-copy"},"pages/bio-responsive-trevion.html":{"selector":"#skin-barrier-pathway","mode":"background-flow"},"pages/bio-responsive-meraxyl.html":{"selector":"#sensitive-skin-response","mode":"background-flow"},"pages/bio-responsive-cortiva.html":{"selector":"#skin-response","mode":"background-flow"},"pages/bio-responsive-melacor.html":{"selector":"#pathway","mode":"background-flow"},"pages/bio-responsive-morphagen.html":{"selector":"#follicle-signaling","mode":"background-flow"},"pages/bio-responsive-chromgen.html":{"selector":"#pigmentation","mode":"background-flow"},"pages/synesthetic-flavor-cultures.html":{"selector":"#taiwan .scc-copy","mode":"intro-copy"},"pages/synesthetic-flavor-human-experience.html":{"selector":"#main div.he-copy","mode":"intro-copy"},"pages/synesthetic-flavor-create-flavors.html":{"selector":"#main .cf-stage-copy","mode":"intro-copy"},"pages/synesthetic-flavor-partnership.html":{"selector":"#main .sp-copy","mode":"intro-copy"},"pages/synesthetic-flavor-more.html":{"selector":"#main header.sm-intro","mode":"intro-copy"},"pages/synesthetic-flavor-better-for-you.html":{"selector":"#main div.bf-copy","mode":"intro-copy"},"pages/autonomic-neuro.html":{"selector":"#main header.an-heading","mode":"intro-copy"},"pages/beauty-health.html":{"selector":"#main header.bh-heading","mode":"intro-copy"},"pages/chemical-messengers.html":{"selector":"#main div:has(> #cm-title-01)","mode":"intro-copy"},"pages/homeostasis.html":{"selector":"#main header.hs-heading","mode":"intro-copy"},"pages/mental-health.html":{"selector":"#main header.mh-heading","mode":"intro-copy"},"pages/pni.html":{"selector":"#main div.pni-heading-copy","mode":"intro-copy"},"pages/skin-sensory-standard.html":{"selector":"#main","mode":"main-flow-canvas-exception"},"pages/bespoke-services.html":{"selector":"#main div.bespoke-copy","mode":"intro-copy"},"pages/vagus-scent-bulb.html":{"selector":"#main div.vagus-launch__content","mode":"intro-copy"},"applied-products-countdown.html":{"selector":"#main div.nuro-intro","mode":"intro-copy"},"pages/exposome.html":{"selector":"#main header.exo-heading","mode":"intro-copy"},"pages/stress-atc.html":{"selector":"#main div.sn-hero-copy","mode":"intro-copy"},"pages/homeostasis-regulation.html":{"selector":"#research","mode":"intro-copy"},"pages/human-longevity-aging.html":{"selector":"#main div.hla-hero-copy","mode":"intro-copy"},"pages/olfactory-science.html":{"selector":"#science","mode":"intro-copy"},"pages/synesthesia-inspired-perception.html":{"selector":"#main","mode":"main-flow-canvas-exception"},"pages/neuroplasticity.html":{"selector":"#main div.np26-hero-copy","mode":"intro-copy"},"pages/neuro-scented-therapy.html":{"selector":"#main div.nst-introduction-copy","mode":"intro-copy"},"pages/Neuro-Skin-Science.html":{"selector":"#main div.nss-hero-copy","mode":"intro-copy"},"pages/hair-follicle-biology.html":{"selector":"#main div.hf-hero-copy","mode":"intro-copy"},"pages/piper-longum.html":{"selector":"#main div.pl-copy.pl-research-copy","mode":"intro-copy"},"pages/neuro-skin-care.html":{"selector":"#main div.neuro-shell.neuro-hero-inner","mode":"intro-copy"},"pages/brain-skin-neurocutaneous-loop.html":{"selector":"body > .loop-heading","mode":"intro-copy"},"pages/human-longevity-aging2.html":{"selector":"#cascade","mode":"before-canvas"},"exercise-beauty.html":{"selector":"#main div.exb-intro","mode":"intro-copy"},"exercise-health.html":{"selector":"#main","mode":"main-flow-canvas-exception"},"pages/sleep-health.html":{"selector":"#main","mode":"main-flow-canvas-exception"},"sleep-human-beauty/index.html":{"selector":"#main div.shb-hero-copy.shb-reveal","mode":"intro-copy"},"pages/deep-sea-water.html":{"selector":"#origin .dsw-hero .dsw-frame","mode":"intro-copy"},"pages/water-activator.html":{"selector":"#water-activator .wa-hero-inner > .wa-copy","mode":"intro-copy"},"pages/sakae.html":{"selector":"#main div.sakae-copy","mode":"intro-copy"},"pages/kobayashi.html":{"selector":"#main div.kb-hero-copy","mode":"intro-copy"},"pages/deep-sea-water-benefits.html":{"selector":"#main header.dswb-copy","mode":"intro-copy"},"pages/deep-sea-water-applications.html":{"selector":"#main header.dswa-cosmetics-heading","mode":"intro-copy"},"pages/water-activator-technology.html":{"selector":"#aquavortex .wat-hero-inner > .wa-copy","mode":"intro-copy"},"pages/who-we-are-details.html":{"selector":"#main div.wwd-defines-content","mode":"intro-copy"},"pages/scientific-foundation.html":{"selector":"#main div.sfnd-core-content","mode":"intro-copy"},"pages/how-we-create-value.html":{"selector":"#main div.hwcv-services-copy","mode":"intro-copy"},"pages/global-capability-and-people.html":{"selector":"#main div.wwa-copy","mode":"intro-copy"},"pages/leadership-responsibility-and-future.html":{"selector":"#main div.wwa-copy","mode":"intro-copy"},"pages/customized.html":{"selector":"#main div.commerce-hero-copy","mode":"intro-copy"},"pages/members.html":{"selector":"#main .page-hero-grid > div:first-child","mode":"intro-copy"},"en/cookie-policy.html":{"selector":"#main","mode":"main-flow"},"pages/sleep-beauty.html":{"selector":"#main div.insights-hero-copy","mode":"intro-copy"}};
  const researchSection = 'index.html#research-focus';
  const languagePages = new Set(Object.keys(routes).filter(key => routes[key].parents?.some(parent => parent === researchSection || parent === 'group:insights')));
  const copy = {
    en: { trail: 'Breadcrumb', top: 'Back to top' },
    th: { trail: 'เส้นทางนำทาง', top: 'กลับด้านบน' },
    ja: { trail: 'パンくずリスト', top: 'ページの先頭へ' },
    'zh-Hant': { trail: '導覽路徑', top: '返回頂部' },
    'zh-Hans': { trail: '导航路径', top: '返回顶部' }
  };
  const locale = () => /^zh-(?:CN|Hans|SG)$/i.test(document.documentElement.lang) ? 'zh-Hans' : /^zh/i.test(document.documentElement.lang) ? 'zh-Hant' : /^(?:th|ja)$/.test(document.documentElement.lang) ? document.documentElement.lang : 'en';
  const clean = value => (value || '').replace(/[\u00ad\u200b]/g, '').replace(/\s+/g, ' ').trim();
  const attr = (node, name, value) => { if (node.getAttribute(name) !== value) node.setAttribute(name, value); };
  const visible = node => !!node?.getClientRects().length && !node.closest('[hidden], [aria-hidden="true"], dialog:not([open])') && getComputedStyle(node).display !== 'none';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const icon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg>';
  let main, nav, end, top, mountedParent, signature = '', refreshTimer = 0, frame = 0;
  let cancelResearchLanding = () => {};

  function routePath(url) {
    try {
      const resolved = new URL(url, location.href);
      if (resolved.origin !== base.origin || !resolved.pathname.startsWith(base.pathname)) return '';
      const path = decodeURIComponent(resolved.pathname.slice(base.pathname.length)) || 'index.html';
      return path.endsWith('/') ? path + 'index.html' : path;
    } catch (_) { return ''; }
  }
  function routeKey(url) { const path = routePath(url); return aliases[path] || path; }
  function linkLabel(key) {
    const candidates = new Set();
    for (const anchor of document.querySelectorAll('.site-header a[href], .commerce-header a[href], .site-menu a[href], .mega-menu a[href]')) {
      if (new URL(anchor.href, location.href).hash || routeKey(anchor.href) !== key || anchor.closest('[data-arotec-breadcrumbs]')) continue;
      const clone = anchor.cloneNode(true);
      clone.querySelectorAll('svg,i,[aria-hidden="true"],.sr-only').forEach(node => node.remove());
      const value = clean(clone.textContent);
      if (value && value.length < 180) candidates.add(value);
    }
    return candidates.size === 1 ? [...candidates][0] : '';
  }
  function label(key, current = false) {
    return labels[key]?.[locale()] || linkLabel(key) || (current && clean(document.title.split('|')[0])) || routes[key]?.label || key;
  }
  function href(key) {
    const prefix = routePath(location.href).split('/')[0];
    const localized = ['en', 'th', 'ja', 'zh-Hant', 'zh-Hans'].includes(prefix);
    const url = new URL(localized && routes[key]?.localizedPaths?.[locale()] || key, base);
    return localizedHref(url, key === 'index.html' && languagePages.has(routeKey(location.href)));
  }
  function localizedHref(value, includeHome = false) {
    const url = new URL(value, location.href);
    const path = routePath(url.href);
    const key = aliases[path] || path;
    // Locale-specific HTML already carries its language in the actual path.
    if (/^(?:en|th|ja|zh-Hant|zh-Hans)\//.test(path)) return url.href;
    if (languagePages.has(key) || key === 'index.html' && (includeHome || url.hash === '#research-focus')) {
      url.searchParams.set('lang', locale());
    }
    return url.href;
  }
  function updateLocalizedLinks() {
    // Make ordinary links carry the language too: normal clicks, new tabs,
    // copied URLs and fresh browsers all use the same explicit destination.
    for (const link of document.querySelectorAll('a[href]')) {
      if (!(link instanceof HTMLAnchorElement)) continue;
      if (link.getAttribute('href').trim().startsWith('#')) continue;
      const next = localizedHref(link.href);
      if (next !== link.href) link.href = next;
    }
  }
  function focusTarget(node) {
    if (!node) return;
    if (!node.hasAttribute('tabindex')) {
      node.setAttribute('tabindex', '-1');
      node.addEventListener('blur', () => node.removeAttribute('tabindex'), { once: true });
    }
    node.focus({ preventScroll: true });
  }
  function goTop(event) {
    event.preventDefault(); event.stopImmediatePropagation();
    const url = new URL(location.href); url.hash = '';
    if (location.hash) history.pushState(history.state, '', url);
    focusTarget(main.querySelector('h1') || document.querySelector('h1') || main);
    window.scrollTo({ top: 0, behavior: reduced.matches ? 'instant' : 'smooth' });
  }
  function makeControls() {
    nav = document.createElement('nav');
    nav.className = 'arotec-breadcrumbs';
    nav.setAttribute('data-arotec-breadcrumbs', '');
    nav.setAttribute('data-arotec-i18n-ignore', '');
    end = document.createElement('div');
    end.className = 'arotec-page-navigation-end';
    end.setAttribute('data-page-navigation-end', '');
    end.setAttribute('data-arotec-i18n-ignore', '');
    end.setAttribute('data-text-surface', 'light');
    top = document.querySelector('[data-back-to-top], [data-adi-back-top], .back-to-top, .sf-back-to-top') || document.createElement('button');
    top.classList.add('arotec-page-top');
    top.setAttribute('data-page-top', '');
    top.setAttribute('type', 'button');
    top.removeAttribute('aria-hidden'); top.removeAttribute('tabindex');
    top.addEventListener('click', goTop, { capture: true });
    // Retained legacy scripts may still update the adopted button on scroll.
    new MutationObserver(() => {
      if (top.hasAttribute('aria-hidden')) top.removeAttribute('aria-hidden');
      if (top.hasAttribute('tabindex')) top.removeAttribute('tabindex');
    }).observe(top, { attributes: true, attributeFilter: ['aria-hidden', 'tabindex'] });
    end.append(top);
  }
  function mainAnchor() {
    // Standalone diagrams use a fixed canvas inside a horizontal scroller.
    // Keep navigation outside that canvas and out of grid/flex page layouts.
    const scroll = main.closest('.loop-scroll, .aging-scroll');
    if (scroll) return { node: scroll, outside: true };
    const style = getComputedStyle(main);
    return { node: main, outside: /grid|flex/.test(style.display) || main.scrollWidth > innerWidth + 64 };
  }
  function reviewedTrailSurface(key, fallback) {
    // This reviewed scene has photography beneath the desktop trail, but
    // its mobile trail occupies a plain strip above the image. Other image
    // compositions retain their existing reviewed light/dark surface hints.
    if (key !== 'pages/applied-solutions.html' || !nav?.isConnected) return fallback;
    const image = main.querySelector('#sensory-strategies .as-backdrop');
    if (!image?.complete || !image.naturalWidth) return fallback;
    const style = getComputedStyle(image), box = image.getBoundingClientRect();
    if (style.display === 'none' || style.visibility === 'hidden' || +style.opacity === 0 || !box.width || !box.height) return fallback;
    const rectangles = [...nav.querySelectorAll('ol > li > a, ol > li > span')].flatMap(node => [...node.getClientRects()]).filter(r => r.width && r.height);
    const overPhoto = rectangles.length && rectangles.every(r => r.left >= box.left && r.right <= box.right && r.top >= box.top && r.bottom <= box.bottom);
    return overPhoto ? 'dark' : fallback;
  }
  function breadcrumbAnchor(key) {
    const loop = document.querySelector('body.brain-skin-loop-page > .loop-heading');
    if (loop) return { node: loop, outside: true, inset: false };
    if (main.matches('.pilot-policy-main')) {
      main.setAttribute('data-breadcrumb-policy-content', '');
      return { node: main, outside: true, inset: false };
    }
    const surface = surfaceFor(key);
    const rgb = surface && getComputedStyle(surface).backgroundColor.match(/[\d.]+/g)?.map(Number);
    const darkArtwork = ['applied-products-countdown.html', 'pages/vagus-scent-bulb.html', 'uniquely-yours.html', 'pages/get-in-touch.html',
      'pages/who-we-are.html', 'pages/homeostasis-regulation.html', 'pages/who-we-are-details.html', 'pages/scientific-foundation.html',
      'pages/global-capability-and-people.html', 'pages/leadership-responsibility-and-future.html'].includes(key);
    const tone = darkArtwork ? 'dark' :
      rgb && (rgb.length < 4 || rgb[3] > .9) ? (rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722 < 145 ? 'dark' : 'light') : null;
    return { node: main, outside: false, inset: false, surface: reviewedTrailSurface(key, tone) };
  }
  const surfaceState = new WeakMap();
  let activeSurface = null;
  function surfaceFor(key) {
    if (main.matches('.loop-stage, .aging-dynamics, .pilot-policy-main')) return null;
    let first = [...main.children].find(node => !node.matches('[data-arotec-breadcrumbs], script, style, link'));
    if (first?.tagName === 'ARTICLE') first = [...first.children].find(node => !node.matches('script, style, link'));
    return first && !first.matches('h1,h2,header,p,nav,svg,canvas') ? first : null;
  }
  function headerBottom() {
    const header = document.querySelector('.site-header, .commerce-header');
    const bottom = node => {
      let y = 0;
      for (let parent = node; parent; parent = parent.offsetParent) y += parent.offsetTop;
      return y + node.getBoundingClientRect().height;
    };
    return Math.max(header ? bottom(header) : 0, ...[...document.querySelectorAll('.commerce-context-bar')].filter(visible).map(bottom));
  }
  function setStyle(node, name, value, priority = '') {
    if (node.style.getPropertyValue(name) !== value || node.style.getPropertyPriority(name) !== priority) node.style.setProperty(name, value, priority);
  }
  function restoreStyle(node, name, value, priority = '') {
    if (value) setStyle(node, name, value, priority); else node.style.removeProperty(name);
  }
  function clearSurface() {
    if (!activeSurface) return;
    const previous = surfaceState.get(activeSurface);
    if (previous) for (const [name, value] of Object.entries(previous.inline)) {
      restoreStyle(activeSurface, name, value, previous.priority[name]);
    }
    if (previous?.reserve && previous.reserve !== activeSurface) restoreStyle(previous.reserve, 'padding-top', previous.reservePadding, previous.reservePriority);
    previous?.reserve?.removeAttribute('data-breadcrumb-reserve');
    activeSurface.removeAttribute('data-breadcrumb-surface');
    activeSurface = null;
  }
  function pageGutter() {
    const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--arotec-page-gutter'));
    return Number.isFinite(value) && value > 0 ? value : document.documentElement.clientWidth >= 1200 ? 150 : document.documentElement.clientWidth < 360 ? 16 : 24;
  }
  function reservationFor(key, surface) {
    // Keep the trail on the existing painted scene, never its outer filler.
    const scenes = {
      'pages/sleep-health.html': '.sh-scene',
      'pages/neuroplasticity.html': '.np26-stage',
      'pages/synesthesia-inspired-perception.html': '.sip-intro-canvas',
      'pages/deep-sea-water.html': '.dsw-hero',
      'pages/deep-sea-water-applications.html': '.dswa-cosmetics-hero',
      'exercise-health.html': '.esh-context-scene',
      'pages/bio-responsive-ingredients.html': '.bri-hero--function',
      'pages/bio-responsive-research.html': '.asr-hero--focus',
      'pages/bio-responsive-scents.html': '.brs-v8-reference-hero',
      'pages/beauty-health.html': '.bh-canvas',
      'pages/skin-sensory-standard.html': '.ss-canvas',
      'pages/synesthetic-flavor-partnership.html': '.sp-stage',
      'pages/synesthetic-flavor-create-flavors.html': '.cf-stage'
    };
    const selector = scenes[key] || '.wat-hero-banner, .wa-hero-grid';
    return surface.querySelector(selector) || surface;
  }
  function alignBreadcrumb() {
    if (!nav?.isConnected || obstructed()) return;
    const key = routeKey(location.href);
    const viewport = document.documentElement.clientWidth;
    const inset = pageGutter();
    const header = headerBottom();
    const surface = surfaceFor(key);
    if (surface !== activeSurface) clearSurface();
    if (surface && !surfaceState.has(surface)) {
      // Reserve space inside the existing painted hero, including nested image
      // surfaces, so outer section backgrounds do not become a separate band.
      const reserve = reservationFor(key, surface);
      surfaceState.set(surface, { inline: Object.fromEntries(['margin-top','padding-top'].map(name => [name, surface.style.getPropertyValue(name)])), priority: Object.fromEntries(['margin-top','padding-top'].map(name => [name, surface.style.getPropertyPriority(name)])), reserve, reservePadding: reserve.style.paddingTop, reservePriority: reserve.style.getPropertyPriority('padding-top') });
    }
    if (surface) {
      activeSurface = surface;
      surface.setAttribute('data-breadcrumb-surface', '');
      surfaceState.get(surface).reserve.setAttribute('data-breadcrumb-reserve', '');
      // These two sections originally supplied the header offset themselves.
      // The new leading flow row already accounts for that same header space.
      if (['exercise-health.html', 'pages/bio-responsive-scents.html'].includes(key) && surfaceState.get(surface).reserve !== surface) setStyle(surface, 'padding-top', '0px', 'important');
      if (key === 'pages/sleep-health.html') surface.setAttribute('data-breadcrumb-sleep-surface', '');
    }
    if (!main.matches('.aging-dynamics') && getComputedStyle(main).display === 'block') main.setAttribute('data-breadcrumb-flow-root', '');
    setStyle(nav, 'width', `${Math.max(0, viewport - inset * 2)}px`);
    const currentLeft = parseFloat(nav.style.marginInlineStart) || 0;
    const currentTop = parseFloat(nav.style.marginBlockStart) || 0;
    const box = nav.getBoundingClientRect();
    setStyle(nav, 'margin-inline-start', `${currentLeft + inset - box.left}px`);
    setStyle(nav, 'margin-block-start', `${currentTop + header + 8 - (box.top + scrollY)}px`);
    // The existing first surface supplies the background for the leading row.
    // Its added padding reserves the same height for authored content.
    if (surface) {
      const state = surfaceState.get(surface);
      const reserve = state.reserve;
      const oldPad = reserve.style.paddingTop;
      const oldMargin = surface.style.marginTop;
      const oldPadPriority = reserve.style.getPropertyPriority('padding-top');
      const oldMarginPriority = surface.style.getPropertyPriority('margin-top');
      restoreStyle(reserve, 'padding-top', state.reservePadding, state.reservePriority);
      restoreStyle(surface, 'margin-top', state.inline['margin-top'], state.priority['margin-top']);
      const style = getComputedStyle(surface);
      const padding = parseFloat(getComputedStyle(reserve).paddingTop) || 0;
      const margin = parseFloat(style.marginTop) || 0;
      const surfaceTop = surface.getBoundingClientRect().top + scrollY;
      restoreStyle(reserve, 'padding-top', oldPad, oldPadPriority);
      restoreStyle(surface, 'margin-top', oldMargin, oldMarginPriority);
      const overlap = Math.max(0, surfaceTop - header);
      setStyle(surface, 'margin-top', `${margin - overlap}px`, 'important');
      setStyle(reserve, 'padding-top', `${padding + overlap}px`, 'important');
    }
    // The Neuroplasticity copy is absolutely centered in a fixed-height scene.
    // Reserve its entire block (including the eyebrow) on short desktop windows.
    const neuroStage = key === 'pages/neuroplasticity.html' ? surface?.querySelector('.np26-stage') : null;
    const neuroCopy = neuroStage?.querySelector('.np26-hero-copy');
    if (neuroCopy && viewport >= 901) {
      const clearance = Math.max(0, nav.getBoundingClientRect().bottom + 16 - neuroStage.getBoundingClientRect().top);
      const copyHeight = neuroCopy.getBoundingClientRect().height;
      setStyle(neuroStage, '--breadcrumb-scene-min-height', `${Math.ceil(clearance + copyHeight + 24)}px`);
      setStyle(neuroCopy, '--breadcrumb-copy-center', `${Math.ceil(clearance + copyHeight / 2)}px`);
    }
    const campaign = main.querySelector('.nuro-launch, .vagus-launch');
    if (campaign) {
      const kind = key === 'applied-products-countdown.html' ? 'products' : key === 'pages/vagus-scent-bulb.html' ? 'vagus' : 'personal';
      campaign.setAttribute('data-breadcrumb-campaign-host', kind);
      nav.setAttribute('data-breadcrumb-layout', 'campaign');
      setStyle(nav, '--breadcrumb-safe-width', `${Math.max(220, viewport * .42 - inset - 24)}px`);
      if (viewport >= 1024) for (const node of campaign.querySelectorAll('.nuro-brand,.nuro-intro,.vagus-brand,#vagus-title')) {
        const old = parseFloat(node.style.getPropertyValue('--breadcrumb-clearance')) || 0;
        const natural = node.getBoundingClientRect().top + scrollY - old;
        setStyle(node, '--breadcrumb-clearance', `${Math.max(0, Math.ceil(nav.getBoundingClientRect().bottom + scrollY + 16 - natural))}px`);
      }
    }
    if (key === 'pages/applied-solutions.html') {
      const tone = reviewedTrailSurface(key, 'light');
      if (nav.getAttribute('data-text-surface') !== tone) {
        attr(nav, 'data-text-surface', tone);
        window.ArotecTextColors?.refresh(nav);
        window.ArotecArrowContrast?.refresh(2);
      }
    }
  }
  function campaignLayout() { alignBreadcrumb(); }

  function obstructed() {
    if (main?.inert || document.body.matches('.menu-open, .search-open, .sf-menu-open, .modal-open, .esh-diagram-is-open, .isb-diagram-is-open, .shm-diagram-is-open')) return true;
    return [...document.querySelectorAll('dialog[open], [role="dialog"][aria-modal="true"]')].some(node => visible(node) && getComputedStyle(node).visibility !== 'hidden' && getComputedStyle(node).opacity !== '0');
  }
  function updateLayout() {
    if (!main?.isConnected || !nav) return;
    setStyle(end, '--breadcrumb-inset', `${pageGutter()}px`);
    const blocked = obstructed();
    if (nav.inert !== blocked) nav.inert = blocked;
    if (end.inert !== blocked) end.inert = blocked;
    if (nav.isConnected && !blocked) {
      alignBreadcrumb();
    }
    const long = main.scrollHeight > innerHeight * 1.15 || document.documentElement.scrollHeight > innerHeight * 2;
    if (end.hidden === long) end.hidden = !long;
    if (top.hidden === long) top.hidden = !long;
  }
  function refresh() {
    refreshTimer = 0;
    const nextMain = document.querySelector('main');
    const path = routePath(location.href);
    const key = aliases[path] || path;
    if (!nextMain || document.querySelector('meta[http-equiv="refresh" i]') || /(?:^|\/)(?:members|admin-members|careers-admin|contact-admin)\.html$/i.test(path)) return;
    main = nextMain;
    if (!nav) makeControls();
    if (obstructed()) { updateLayout(); return; }
    updateLocalizedLinks();
    const route = routes[key];
    const parents = route?.parents || [];
    const existing = document.querySelector('nav[aria-label*="breadcrumb" i]:not([data-arotec-breadcrumbs]), nav.breadcrumb, nav.breadcrumbs');
    const anchor = mainAnchor();
    const breadcrumb = breadcrumbAnchor(key);
    if (parents.length && !existing) {
      const placed = breadcrumb.append ? breadcrumb.node.lastElementChild === nav : breadcrumb.outside ? breadcrumb.node.previousElementSibling === nav : breadcrumb.node.firstElementChild === nav;
      if (!placed) {
        if (breadcrumb.append) breadcrumb.node.append(nav); else if (breadcrumb.outside) breadcrumb.node.before(nav); else breadcrumb.node.prepend(nav);
      }
      if (nav.getAttribute('data-text-surface') !== (breadcrumb.surface || null)) signature = '';
      if (breadcrumb.surface) attr(nav, 'data-text-surface', breadcrumb.surface);
      else if (nav.hasAttribute('data-text-surface')) nav.removeAttribute('data-text-surface');
      if (breadcrumb.campaign) {
        attr(nav, 'data-breadcrumb-campaign', breadcrumb.campaign);
        attr(breadcrumb.node, 'data-breadcrumb-campaign-host', breadcrumb.campaign);
      }
      if (breadcrumb.inset !== nav.hasAttribute('data-breadcrumb-inset')) nav.toggleAttribute('data-breadcrumb-inset', breadcrumb.inset);
      // The palette remembers original paint; rebuild after changing surfaces.
      if (mountedParent !== nav.parentElement) { mountedParent = nav.parentElement; signature = ''; }
      const items = [...parents, key].map((item, index) => ({ label: label(item, index === parents.length), href: index < parents.length && !routes[item]?.group ? href(item) : '', current: index === parents.length }));
      const nextSignature = JSON.stringify([locale(), items]);
      if (signature !== nextSignature) {
        const list = document.createElement('ol'); list.setAttribute('role', 'list');
        items.forEach((item, index) => {
          const li = document.createElement('li');
          if (index) { const separator = document.createElement('span'); separator.className = 'arotec-breadcrumb-separator'; separator.setAttribute('aria-hidden', 'true'); separator.textContent = '›'; li.append(separator); }
          const node = document.createElement(item.href ? 'a' : 'span');
          node.textContent = item.label;
          if (item.href) node.href = item.href; else if (item.current) node.setAttribute('aria-current', 'page'); else node.setAttribute('data-breadcrumb-group', '');
          li.append(node); list.append(li);
        });
        nav.replaceChildren(list); signature = nextSignature;
        window.ArotecTextColors?.refresh(nav);
      }
    } else nav.remove();
    if (anchor.node.nextElementSibling !== end) anchor.node.after(end);
    attr(nav, 'aria-label', copy[locale()].trail);
    attr(nav, 'lang', document.documentElement.lang);
    attr(end, 'lang', document.documentElement.lang);
    const topLabel = copy[locale()].top;
    if (top.getAttribute('aria-label') !== topLabel || top.querySelector('span')?.textContent !== topLabel) {
      top.innerHTML = icon + '<span></span>'; top.querySelector('span').textContent = topLabel;
      attr(top, 'aria-label', topLabel); attr(top, 'title', topLabel);
    }
    updateLayout();
  }
  function scheduleRefresh() { clearTimeout(refreshTimer); refreshTimer = setTimeout(refresh, 80); }
  function requestUpdate() { if (!frame) frame = requestAnimationFrame(() => { frame = 0; updateLayout(); }); }
  function settleResearchLanding() {
    cancelResearchLanding();
    if (routeKey(location.href) !== 'index.html' || location.hash !== '#research-focus') return;
    // Home is rendered again after localization. Its mobile content-visibility
    // estimates also settle after scrolling. Keep this initial anchor landing
    // accurate briefly, and stop immediately when the visitor takes control.
    const controller = new AbortController();
    const signal = controller.signal;
    let stopped = false, first = 0, second = 0, timer = 0, observer;
    const stop = () => {
      if (stopped) return;
      stopped = true; controller.abort(); observer?.disconnect();
      cancelAnimationFrame(first); cancelAnimationFrame(second); clearTimeout(timer);
    };
    const align = () => {
      if (stopped) return;
      cancelAnimationFrame(first); cancelAnimationFrame(second);
      first = requestAnimationFrame(() => {
        second = requestAnimationFrame(() => {
          if (stopped || location.hash !== '#research-focus') return stop();
          document.getElementById('research-focus')?.scrollIntoView({ block: 'start', behavior: 'instant' });
        });
      });
    };
    cancelResearchLanding = stop;
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
      window.addEventListener(event, stop, { capture: true, passive: true, signal });
    }
    document.addEventListener('arotec:i18n-ready', align, { signal });
    window.addEventListener('load', align, { signal });
    document.fonts?.addEventListener('loadingdone', align, { signal });
    document.fonts?.ready.then(align);
    if (typeof ResizeObserver === 'function') {
      observer = new ResizeObserver(align); observer.observe(document.body);
    }
    timer = setTimeout(stop, 2500);
    align();
  }
  function start() {
    refresh();
    new ResizeObserver(() => { if (nav?.isConnected) alignBreadcrumb(); }).observe(document.documentElement);
    settleResearchLanding();
    new MutationObserver(records => {
      if (records.some(record => {
        const target = record.target.nodeType === 1 ? record.target : record.target.parentElement;
        return target && !target.closest('[data-arotec-breadcrumbs], [data-page-navigation-end]');
      })) scheduleRefresh();
    }).observe(document.body, { subtree: true, childList: true, characterData: true });
    new MutationObserver(() => { requestUpdate(); if (!obstructed()) scheduleRefresh(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    new MutationObserver(scheduleRefresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    window.addEventListener('resize', () => { requestUpdate(); scheduleRefresh(); }, { passive: true });
    window.visualViewport?.addEventListener('resize', requestUpdate, { passive: true });
    window.addEventListener('load', scheduleRefresh, { once: true });
    window.addEventListener('popstate', () => { scheduleRefresh(); settleResearchLanding(); });
    window.addEventListener('pageshow', event => { if (event.persisted) settleResearchLanding(); });
    window.addEventListener('hashchange', settleResearchLanding);
    document.addEventListener('arotec:languagechange', scheduleRefresh);
    document.addEventListener('arotec:i18n-ready', scheduleRefresh);
    document.addEventListener('close', scheduleRefresh, true);
    document.addEventListener('toggle', scheduleRefresh, true);
    if (typeof ResizeObserver === 'function') new ResizeObserver(requestUpdate).observe(document.body);
    document.fonts?.ready.then(requestUpdate);
  }
  const ready = () => { if (sheet.sheet) start(); else sheet.addEventListener('load', start, { once: true }); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true }); else ready();
})();
