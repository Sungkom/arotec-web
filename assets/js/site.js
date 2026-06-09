(() => {
  const body = document.body;
  const pageId = body.dataset.page || "home";
  const root = body.dataset.root || "";
  const shell = document.getElementById("site-shell");
  let heroSlideTimer = null;

  const routes = [
    { id: "home", path: "index.html", nav: false },
    { id: "customized", path: "pages/customized.html", nav: true, section: "customized" },
    { id: "applied", path: "pages/applied-solutions.html", nav: true, section: "applied" },
    { id: "products", path: "pages/products.html", nav: true, section: "products" },
    { id: "platform", path: "pages/platform.html", nav: true, section: "platform" },
    { id: "about", path: "pages/who-we-are.html", nav: true, section: "about" },
    { id: "insights", path: "pages/insights.html", nav: true, section: "insights" },
    { id: "partners", path: "pages/partners.html", nav: true, section: "partners" },
    { id: "join", path: "pages/join-us.html", nav: true, section: "join" },
    { id: "contact", path: "pages/members.html", nav: false }
  ];

  const languageMeta = {
    en: { label: "EN", htmlLang: "en" },
    ja: { label: "日本語", htmlLang: "ja" },
    zh: { label: "繁中", htmlLang: "zh-Hant" },
    th: { label: "ไทย", htmlLang: "th" }
  };

  const copy = {
    en: {
      brand: { title: "Arotec", subtitle: "Science for Life" },
      nav: {
        home: "Home",
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
      common: {
        learnMore: "Learn more",
        explore: "Explore",
        exploreScience: "Explore our science",
        start: "Start personalization",
        viewProducts: "View all products",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        search: "Search",
        closeSearch: "Close search",
        searchPlaceholder: "Search pages, products, solutions",
        searchEmpty: "No results yet. Try science, sleep, products, or platform.",
        readMore: "Read more",
        submit: "Send message",
        subscribe: "Subscribe",
        emailPlaceholder: "Your email address",
        arrow: "Go"
      },
      home: {
        hero: {
          eyebrow: "Arotec Science for Life",
          title: "We engineer sensory-driven\nbioactive systems for human\nhomeostasis.",
          lead: "A&S is a science-driven innovation company developing sensory, functional, and bioactive solutions for human well-being.",
          primary: "Explore our science",
          secondary: "Customized for you",
          tags: ["Science", "Solutions", "Products"]
        },
        concept: {
          title: "Our Core Concept",
          lead: "From mechanism-driven research to personalized, sensory-driven experiences.",
          items: [
            { title: "Research", text: "Discovering mechanisms behind aging, brain and sensory interaction." },
            { title: "Mechanism", text: "Understanding how it works at biological and molecular levels." },
            { title: "Personalization", text: "Designing solutions tailored to your unique biology and lifestyle." }
          ]
        },
        research: {
          title: "Research to Mechanism",
          lead: "Understanding the science behind life.",
          cards: [
            { title: "Neuro Plasticity", subtitle: "Rewiring for a better you", text: "We study how lifestyle, nutrients, scent and bio-signals support synaptic connection, cognition and emotional balance.", image: "card-plasticity.jpg" },
            { title: "Human Aging", subtitle: "Slowing down. Living well.", text: "We investigate biological pathways of aging and develop strategies that help cells stay resilient and functional.", image: "card-aging.jpg" },
            { title: "Neuro Scented Therapy", subtitle: "Scents that talk to your brain", text: "We decode how natural scents modulate brain activity, mood, stress and sleep through olfactory pathways.", image: "card-scented.jpg" }
          ]
        },
        applied: {
          title: "Applied Solutions",
          lead: "Science-based applications for mind, body and daily life.",
          items: ["Cognitive & Mood Support", "Sleep & Stress Balance", "Healthy Aging & Longevity", "Skin & Inner Beauty", "Scented Well-being"],
          button: "Explore solutions"
        },
        products: {
          title: "Products",
          lead: "Inspired by science. Crafted with care.",
          items: ["Functional Beverages", "Skincare Series", "Scented Therapy Series", "Supplement Series", "Gift & Lifestyle"],
          button: "View all products"
        },
        personal: {
          title: "Personalized for You",
          lead: "Your biology. Your environment. Your solution.",
          steps: ["Answer a few questions", "We analyze your profile", "Get your personalized solution"],
          button: "Start personalization"
        }
      },
      pages: {
        customized: {
          eyebrow: "Customized for you",
          title: "Personalized programs built around real life",
          lead: "Arotec turns lifestyle signals, sensory preferences and wellness goals into a practical recommendation journey.",
          image: "customized-banner.jpg",
          stats: [
            { value: "3", label: "profile layers" },
            { value: "12", label: "daily-life signals" },
            { value: "1", label: "clear recommendation" }
          ],
          cardsTitle: "What we personalize",
          cardsLead: "The experience combines scientific logic with questions that people can actually answer.",
          cards: [
            { title: "Mind & mood", text: "Cognitive load, focus routines, emotional balance and preferred sensory cues." },
            { title: "Sleep & stress", text: "Rhythm, tension patterns, recovery windows and calming scent preferences." },
            { title: "Skin & aging", text: "Skin concerns, environmental exposure, inner beauty needs and longevity goals." }
          ],
          featureTitle: "Personalization flow",
          featureText: "The journey keeps the user moving from quick assessment to recommendation without feeling clinical.",
          steps: ["Choose your goal", "Answer lifestyle questions", "Match mechanism and solution", "Receive routine and product guidance"],
          ctaTitle: "Ready to design the first assessment?",
          ctaText: "Use this page as the starting point for your customer quiz, consultation form or member platform."
        },
        applied: {
          eyebrow: "Applied Solutions",
          title: "Science translated into everyday wellness programs",
          lead: "Each solution is mapped from research themes to practical routines, product sets and measurable customer needs.",
          image: "solutions-neuron.jpg",
          stats: [
            { value: "5", label: "solution areas" },
            { value: "360°", label: "mind and body view" },
            { value: "B2C", label: "and partner-ready" }
          ],
          cardsTitle: "Solution areas",
          cardsLead: "The site structure follows the solution groups shown in the reference design.",
          cards: [
            { title: "Cognitive & Mood Support", text: "Focus, mental clarity, emotional balance and workday resilience." },
            { title: "Sleep & Stress Balance", text: "Evening rituals, recovery support and nervous-system-friendly routines." },
            { title: "Healthy Aging & Longevity", text: "Preventive programs that support vitality, metabolism and healthy aging." },
            { title: "Skin & Inner Beauty", text: "Topical and internal approaches for skin health and daily confidence." },
            { title: "Scented Well-being", text: "Olfactory experiences designed for mood, relaxation and sensory memory." },
            { title: "Corporate wellness", text: "Adapted programs for partners, clinics, hotels and wellness spaces." }
          ],
          featureTitle: "How solutions are assembled",
          featureText: "Every program connects a customer need to a mechanism, a routine and a product or service touchpoint.",
          steps: ["Identify the wellness goal", "Map the relevant mechanism", "Select routine and products", "Track feedback and repeat use"],
          ctaTitle: "Build a solution page for each category",
          ctaText: "These categories can later expand into dedicated landing pages with product recommendations and enquiry forms."
        },
        products: {
          eyebrow: "Applied Products",
          title: "Product families with a science-led point of view",
          lead: "The product pages present categories clearly while keeping the premium laboratory-inspired mood from the reference.",
          image: "products-lab.jpg",
          stats: [
            { value: "5", label: "product families" },
            { value: "Lab", label: "inspired story" },
            { value: "Care", label: "driven by routine" }
          ],
          cardsTitle: "Product categories",
          cardsLead: "Each category is prepared as a card today and can become a full product listing later.",
          cards: [
            { title: "Functional Beverages", text: "Daily drinks positioned around clarity, balance, recovery and beauty." },
            { title: "Skincare Series", text: "Skin-focused formulas paired with inner beauty and environmental care stories." },
            { title: "Scented Therapy Series", text: "Aroma-based products connected to sleep, focus, mood and relaxation." },
            { title: "Supplement Series", text: "Science-backed support for aging, stress, beauty and daily vitality." },
            { title: "Gift & Lifestyle", text: "Premium sets for experience, gifting, hospitality and member programs." },
            { title: "Starter routine", text: "Bundled recommendations for new customers who need a guided entry point." }
          ],
          featureTitle: "Product detail direction",
          featureText: "Future product pages should combine formula story, use case, routine, ingredients, safety notes and clear purchase or enquiry action.",
          steps: ["Category overview", "Product story", "Routine and usage", "Purchase or enquiry"],
          ctaTitle: "Turn product cards into a catalog",
          ctaText: "The current structure is ready for product images, SKUs, prices and inventory integration."
        },
        platform: {
          eyebrow: "Platform",
          title: "A profile platform for personalized wellness decisions",
          lead: "The platform page explains how Arotec can collect customer signals, create profiles and recommend solutions at scale.",
          image: "hero-neuro.jpg",
          stats: [
            { value: "Profile", label: "assessment layer" },
            { value: "Match", label: "recommendation logic" },
            { value: "Loop", label: "feedback and learning" }
          ],
          cardsTitle: "Platform modules",
          cardsLead: "Designed for a future member system, consultation workflow or partner dashboard.",
          cards: [
            { title: "Assessment builder", text: "Create multilingual questionnaires for wellness goals and lifestyle signals." },
            { title: "Profile engine", text: "Translate answers into segments, priorities and recommended pathways." },
            { title: "Recommendation view", text: "Show routines, products and content that match the user profile." },
            { title: "Partner dashboard", text: "Support clinics, retail teams and wellness consultants with guided workflows." },
            { title: "Content pairing", text: "Connect insights and education to each stage of the customer journey." },
            { title: "Feedback loop", text: "Collect satisfaction, repeat behavior and progress signals over time." }
          ],
          featureTitle: "Platform roadmap",
          featureText: "Start with a simple assessment and grow into a full profile, CRM and recommendation system.",
          steps: ["Static assessment page", "Stored customer profile", "Automated recommendation", "Partner dashboard and analytics"],
          ctaTitle: "Plan the platform as phase two",
          ctaText: "This website creates the content foundation for a future login system and personalization engine."
        },
        about: {
          eyebrow: "Who we are",
          title: "A science-first team connecting research, senses and everyday care",
          lead: "Arotec is presented as a premium wellness science company focused on healthy aging, neuro plasticity and scent-driven well-being.",
          image: "core-texture.jpg",
          stats: [
            { value: "01", label: "mission" },
            { value: "02", label: "research culture" },
            { value: "03", label: "responsible growth" }
          ],
          cardsTitle: "Company story",
          cardsLead: "The page gives customers and partners a clear reason to trust the brand.",
          cards: [
            { title: "Our mission", text: "Make science feel practical, human and useful in daily life." },
            { title: "Our team", text: "Researchers, product makers and brand builders working across wellness touchpoints." },
            { title: "Careers", text: "A place for people who care about biology, sensory experience and thoughtful products." },
            { title: "Sustainability", text: "Responsible sourcing, careful packaging and long-term customer well-being." },
            { title: "Partnerships", text: "Open to clinics, hotels, wellness brands and research collaborators." },
            { title: "Trust", text: "Clear product claims, customer privacy and transparent communication." }
          ],
          featureTitle: "Brand principles",
          featureText: "The reference design communicates calm, intelligence and care. This page turns that feeling into brand language.",
          steps: ["Science before claims", "Personalization before mass advice", "Ritual before complexity", "Long-term well-being before quick trends"],
          ctaTitle: "Introduce Arotec with confidence",
          ctaText: "This page can later include founder profiles, certificates, lab photos and customer logos."
        },
        insights: {
          eyebrow: "Insights",
          title: "Articles, research notes and science-in-life stories",
          lead: "Insights help the brand earn trust, improve SEO and explain complex wellness ideas in a calm, readable way.",
          image: "card-aging.jpg",
          stats: [
            { value: "SEO", label: "content growth" },
            { value: "R&D", label: "research notes" },
            { value: "Life", label: "everyday stories" }
          ],
          cardsTitle: "Insight streams",
          cardsLead: "The reference footer includes Articles, Research, Science in Life and Events; those streams are prepared here.",
          cards: [
            { title: "Articles", text: "Customer-friendly explainers about sleep, stress, scent, skin and healthy aging." },
            { title: "Research", text: "Mechanism-focused notes that connect biological pathways with product thinking." },
            { title: "Science in Life", text: "Stories that show how routines, environments and sensory cues shape well-being." },
            { title: "Events", text: "Launches, talks, partner activations and wellness experiences." },
            { title: "Expert interviews", text: "Conversations with scientists, formulators, clinicians and partners." },
            { title: "Guides", text: "Practical routines and product education for repeat visitors." }
          ],
          featureTitle: "Editorial approach",
          featureText: "Keep content clear, evidence-aware and useful. The best articles should make customers feel smarter, not overwhelmed.",
          steps: ["Choose one customer question", "Explain the mechanism", "Give practical next steps", "Link to matching solution or product"],
          ctaTitle: "Publish with a steady rhythm",
          ctaText: "A monthly article plan can support search traffic and partner communication."
        },
        partners: {
          eyebrow: "Partners",
          title: "Partnerships for science-led wellness growth",
          lead: "Arotec works with clinics, wellness brands, hospitality teams and research collaborators to turn sensory bioactive science into practical experiences.",
          image: "solutions-neuron.jpg",
          stats: [
            { value: "B2B", label: "partner-ready" },
            { value: "R&D", label: "science support" },
            { value: "360", label: "experience design" }
          ],
          cardsTitle: "Partnership areas",
          cardsLead: "Each collaboration can combine product, research, content and experience design.",
          cards: [
            { title: "Clinics and wellness centers", text: "Build programs around sleep, stress, aging, skin and sensory well-being." },
            { title: "Hospitality and spa", text: "Create scent-led experiences, rituals and branded wellness touchpoints." },
            { title: "Retail and distribution", text: "Prepare product education, starter kits and customer journey materials." },
            { title: "Research partners", text: "Connect mechanism-driven studies with practical product and service concepts." },
            { title: "Corporate wellness", text: "Design science-aware routines and workshops for teams." },
            { title: "Co-development", text: "Develop formulas, concepts and experience systems with shared goals." }
          ],
          featureTitle: "Partner workflow",
          featureText: "The process starts with a clear business goal, then maps the right science, experience and product path.",
          steps: ["Define partner goal", "Select solution area", "Design experience and product set", "Launch, measure and refine"],
          ctaTitle: "Build a partner pipeline",
          ctaText: "This page can later connect to lead capture, proposal decks and partner onboarding."
        },
        join: {
          eyebrow: "Join Us",
          title: "Join a team building science for everyday well-being",
          lead: "Arotec welcomes people who care about biology, sensory experience, product design and thoughtful wellness systems.",
          image: "core-texture.jpg",
          stats: [
            { value: "Science", label: "first mindset" },
            { value: "Care", label: "human-centered work" },
            { value: "Build", label: "hands-on culture" }
          ],
          cardsTitle: "Ways to join",
          cardsLead: "The team can grow across research, product, brand, operations and partnerships.",
          cards: [
            { title: "Research and science", text: "Translate mechanisms into clear, responsible product and content direction." },
            { title: "Product development", text: "Shape formulas, routines, packaging and sensory experiences." },
            { title: "Brand and content", text: "Explain complex science in a calm, useful and beautiful way." },
            { title: "Partnerships", text: "Support clinics, retail, hospitality and wellness collaborations." },
            { title: "Operations", text: "Keep product, data and customer workflows organized and reliable." },
            { title: "Internships", text: "Create entry opportunities for curious builders and science communicators." }
          ],
          featureTitle: "What we value",
          featureText: "Arotec is built for people who like careful thinking, clear communication and work that improves daily life.",
          steps: ["Scientific curiosity", "Customer empathy", "Careful execution", "Long-term trust"],
          ctaTitle: "Prepare a careers pipeline",
          ctaText: "This page can later include open roles, application forms and team stories."
        }
      },
      contact: {
        eyebrow: "Get in touch",
        title: "Start a conversation with Arotec",
        lead: "Tell us whether you are interested in products, partnership, research, platform or a personalized wellness program.",
        methods: [
          { label: "Email", value: "hello@aands.com" },
          { label: "Phone", value: "+886 123 456 789" },
          { label: "Office", value: "Taipei, Taiwan" }
        ],
        form: {
          name: "Name",
          email: "Email",
          topic: "Topic",
          topicOptions: ["Product enquiry", "Partnership", "Research", "Platform", "Personalized program"],
          message: "Message",
          success: "Thank you. Your message is ready for the Arotec team."
        },
        faqTitle: "Useful details",
        faq: ["Partner with us", "FAQ", "Privacy and terms"]
      },
      footer: {
        insights: "Insights",
        about: "Who we are",
        contact: "Get In touch",
        informed: "Stay informed",
        informedText: "Subscribe to our newsletter for the latest insights.",
        articles: "Articles",
        research: "Research",
        scienceLife: "Science in Life",
        events: "Events",
        team: "Our team",
        careers: "Careers",
        sustainability: "Sustainability",
        partner: "Partner with us",
        faq: "FAQ",
        copyright: "© 2026 Arotec. All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Use"
      }
    },
    th: {
      brand: { title: "Arotec", subtitle: "Science for Life" },
      nav: {
        home: "หน้าแรก",
        customized: "ปรับเฉพาะคุณ",
        applied: "โซลูชันประยุกต์",
        products: "ผลิตภัณฑ์ประยุกต์",
        platform: "แพลตฟอร์ม",
        about: "รู้จักเรา",
        insights: "บทความ",
        partners: "พาร์ทเนอร์",
        join: "ร่วมงานกับเรา",
        contact: "Get In touch"
      },
      common: {
        learnMore: "เรียนรู้เพิ่มเติม",
        explore: "สำรวจ",
        exploreScience: "สำรวจวิทยาศาสตร์ของเรา",
        start: "เริ่มปรับเฉพาะบุคคล",
        viewProducts: "ดูผลิตภัณฑ์ทั้งหมด",
        openMenu: "เปิดเมนู",
        closeMenu: "ปิดเมนู",
        search: "ค้นหา",
        closeSearch: "ปิดการค้นหา",
        searchPlaceholder: "ค้นหาหน้าเว็บ ผลิตภัณฑ์ หรือโซลูชัน",
        searchEmpty: "ยังไม่พบผลลัพธ์ ลองค้นคำว่า วิทยาศาสตร์ นอนหลับ ผลิตภัณฑ์ หรือแพลตฟอร์ม",
        readMore: "อ่านต่อ",
        submit: "ส่งข้อความ",
        subscribe: "สมัครรับข่าวสาร",
        emailPlaceholder: "อีเมลของคุณ",
        arrow: "ไป"
      },
      home: {
        hero: {
          eyebrow: "Arotec Science for Life",
          title: "We engineer sensory-driven\nbioactive systems for human\nhomeostasis.",
          lead: "A&S is a science-driven innovation company developing sensory, functional, and bioactive solutions for human well-being.",
          primary: "สำรวจวิทยาศาสตร์ของเรา",
          secondary: "ปรับเฉพาะคุณ",
          tags: ["Science", "Solutions", "Products"]
        },
        concept: {
          title: "แนวคิดหลักของเรา",
          lead: "จากงานวิจัยเชิงกลไก สู่ประสบการณ์เฉพาะบุคคลที่ขับเคลื่อนด้วยประสาทสัมผัส",
          items: [
            { title: "Research", text: "ค้นหากลไกเบื้องหลังการสูงวัย สมอง และปฏิสัมพันธ์ของประสาทสัมผัส" },
            { title: "Mechanism", text: "ทำความเข้าใจการทำงานในระดับชีววิทยาและโมเลกุล" },
            { title: "Personalization", text: "ออกแบบโซลูชันให้เหมาะกับชีววิทยาและไลฟ์สไตล์ของแต่ละคน" }
          ]
        },
        research: {
          title: "Research to Mechanism",
          lead: "เข้าใจวิทยาศาสตร์ที่อยู่เบื้องหลังชีวิต",
          cards: [
            { title: "Neuro Plasticity", subtitle: "ปรับสมองเพื่อคุณที่ดีกว่า", text: "เราศึกษาว่าไลฟ์สไตล์ สารอาหาร กลิ่น และสัญญาณชีวภาพช่วยสนับสนุนการเชื่อมต่อของสมอง ความคิด และสมดุลอารมณ์ได้อย่างไร", image: "card-plasticity.jpg" },
            { title: "Human Aging", subtitle: "ชะลอวัย ใช้ชีวิตให้ดี", text: "เราศึกษาเส้นทางชีวภาพของการสูงวัย และพัฒนากลยุทธ์เพื่อช่วยให้เซลล์คงความยืดหยุ่นและทำงานได้ดี", image: "card-aging.jpg" },
            { title: "Neuro Scented Therapy", subtitle: "กลิ่นที่สื่อสารกับสมอง", text: "เราถอดรหัสว่ากลิ่นธรรมชาติส่งผลต่อการทำงานของสมอง อารมณ์ ความเครียด และการนอนผ่านเส้นทางการรับกลิ่นอย่างไร", image: "card-scented.jpg" }
          ]
        },
        applied: {
          title: "โซลูชันประยุกต์",
          lead: "การประยุกต์ใช้วิทยาศาสตร์สำหรับใจ ร่างกาย และชีวิตประจำวัน",
          items: ["สนับสนุนสมองและอารมณ์", "สมดุลการนอนและความเครียด", "สูงวัยอย่างมีสุขภาพและยืนยาว", "ผิวและความงามจากภายใน", "สุขภาวะด้วยกลิ่น"],
          button: "สำรวจโซลูชัน"
        },
        products: {
          title: "ผลิตภัณฑ์",
          lead: "ได้แรงบันดาลใจจากวิทยาศาสตร์ ผลิตด้วยความใส่ใจ",
          items: ["เครื่องดื่มฟังก์ชัน", "สกินแคร์ซีรีส์", "กลิ่นบำบัดซีรีส์", "อาหารเสริมซีรีส์", "ของขวัญและไลฟ์สไตล์"],
          button: "ดูผลิตภัณฑ์ทั้งหมด"
        },
        personal: {
          title: "Personalized for You",
          lead: "ชีววิทยาของคุณ สภาพแวดล้อมของคุณ โซลูชันของคุณ",
          steps: ["ตอบคำถามสั้น ๆ", "เราวิเคราะห์โปรไฟล์ของคุณ", "รับโซลูชันเฉพาะบุคคล"],
          button: "เริ่มปรับเฉพาะบุคคล"
        }
      },
      pages: {
        customized: {
          eyebrow: "ปรับเฉพาะคุณ",
          title: "โปรแกรมเฉพาะบุคคลที่สร้างจากชีวิตจริง",
          lead: "Arotec เปลี่ยนข้อมูลไลฟ์สไตล์ ความชอบด้านประสาทสัมผัส และเป้าหมายสุขภาวะให้เป็นเส้นทางคำแนะนำที่นำไปใช้ได้จริง",
          image: "customized-banner.jpg",
          stats: [
            { value: "3", label: "ชั้นข้อมูลโปรไฟล์" },
            { value: "12", label: "สัญญาณชีวิตประจำวัน" },
            { value: "1", label: "คำแนะนำที่ชัดเจน" }
          ],
          cardsTitle: "สิ่งที่ปรับเฉพาะบุคคล",
          cardsLead: "ประสบการณ์นี้ผสานตรรกะทางวิทยาศาสตร์กับคำถามที่ผู้ใช้ตอบได้ง่าย",
          cards: [
            { title: "สมองและอารมณ์", text: "ภาระทางความคิด รูทีนการโฟกัส สมดุลอารมณ์ และสัญญาณประสาทสัมผัสที่ชอบ" },
            { title: "นอนหลับและความเครียด", text: "จังหวะชีวิต รูปแบบความตึงเครียด ช่วงเวลาฟื้นตัว และกลิ่นที่ช่วยให้สงบ" },
            { title: "ผิวและวัย", text: "ปัญหาผิว การเผชิญสิ่งแวดล้อม ความงามจากภายใน และเป้าหมายระยะยาว" }
          ],
          featureTitle: "ขั้นตอนการปรับเฉพาะบุคคล",
          featureText: "เส้นทางนี้พาผู้ใช้จากแบบประเมินสั้น ๆ ไปสู่คำแนะนำโดยไม่ทำให้รู้สึกซับซ้อนเกินไป",
          steps: ["เลือกเป้าหมาย", "ตอบคำถามไลฟ์สไตล์", "จับคู่กลไกและโซลูชัน", "รับรูทีนและคำแนะนำผลิตภัณฑ์"],
          ctaTitle: "พร้อมออกแบบแบบประเมินชุดแรกหรือยัง",
          ctaText: "หน้านี้ใช้เป็นจุดเริ่มต้นสำหรับ quiz ลูกค้า ฟอร์มปรึกษา หรือแพลตฟอร์มสมาชิกได้"
        },
        applied: {
          eyebrow: "โซลูชันประยุกต์",
          title: "เปลี่ยนวิทยาศาสตร์ให้เป็นโปรแกรมสุขภาวะในชีวิตประจำวัน",
          lead: "แต่ละโซลูชันเชื่อมจากหัวข้องานวิจัยไปสู่รูทีน ชุดผลิตภัณฑ์ และความต้องการของลูกค้าที่วัดผลได้",
          image: "solutions-neuron.jpg",
          stats: [
            { value: "5", label: "กลุ่มโซลูชัน" },
            { value: "360°", label: "มุมมองใจและกาย" },
            { value: "B2C", label: "พร้อมต่อยอดพาร์ทเนอร์" }
          ],
          cardsTitle: "กลุ่มโซลูชัน",
          cardsLead: "โครงสร้างเว็บไซต์ยึดตามกลุ่มบริการที่เห็นในภาพอ้างอิง",
          cards: [
            { title: "สนับสนุนสมองและอารมณ์", text: "โฟกัส ความชัดเจนทางความคิด สมดุลอารมณ์ และความยืดหยุ่นระหว่างวัน" },
            { title: "สมดุลการนอนและความเครียด", text: "รูทีนก่อนนอน การฟื้นตัว และการดูแลระบบประสาทอย่างอ่อนโยน" },
            { title: "สูงวัยอย่างมีสุขภาพและยืนยาว", text: "โปรแกรมเชิงป้องกันเพื่อสนับสนุนพลังชีวิต เมตาบอลิซึม และการสูงวัยอย่างดี" },
            { title: "ผิวและความงามจากภายใน", text: "แนวทางทั้งภายนอกและภายในสำหรับสุขภาพผิวและความมั่นใจในทุกวัน" },
            { title: "สุขภาวะด้วยกลิ่น", text: "ประสบการณ์กลิ่นเพื่ออารมณ์ การผ่อนคลาย และความทรงจำทางประสาทสัมผัส" },
            { title: "องค์กรและพาร์ทเนอร์", text: "โปรแกรมสำหรับคลินิก โรงแรม ร้านค้า และพื้นที่ wellness" }
          ],
          featureTitle: "วิธีประกอบโซลูชัน",
          featureText: "ทุกโปรแกรมเชื่อมความต้องการของลูกค้าเข้ากับกลไก รูทีน และผลิตภัณฑ์หรือบริการที่เหมาะสม",
          steps: ["ระบุเป้าหมายสุขภาวะ", "จับคู่กลไกที่เกี่ยวข้อง", "เลือกรูทีนและผลิตภัณฑ์", "ติดตาม feedback และการใช้งานซ้ำ"],
          ctaTitle: "สร้างหน้าแยกสำหรับแต่ละหมวดโซลูชัน",
          ctaText: "หมวดเหล่านี้สามารถขยายเป็น landing page เฉพาะพร้อมคำแนะนำผลิตภัณฑ์และฟอร์มติดต่อได้"
        },
        products: {
          eyebrow: "ผลิตภัณฑ์",
          title: "กลุ่มผลิตภัณฑ์ที่เล่าด้วยมุมมองวิทยาศาสตร์",
          lead: "หน้าผลิตภัณฑ์นำเสนอหมวดต่าง ๆ อย่างชัดเจน พร้อมรักษาอารมณ์พรีเมียมแบบห้องแล็บจากภาพอ้างอิง",
          image: "products-lab.jpg",
          stats: [
            { value: "5", label: "กลุ่มผลิตภัณฑ์" },
            { value: "Lab", label: "เรื่องราวจากวิทยาศาสตร์" },
            { value: "Care", label: "ขับเคลื่อนด้วยรูทีน" }
          ],
          cardsTitle: "หมวดผลิตภัณฑ์",
          cardsLead: "แต่ละหมวดถูกเตรียมเป็นการ์ดในตอนนี้ และสามารถต่อยอดเป็นหน้ารายการสินค้าเต็มรูปแบบได้",
          cards: [
            { title: "เครื่องดื่มฟังก์ชัน", text: "เครื่องดื่มประจำวันสำหรับความชัดเจน สมดุล การฟื้นตัว และความงาม" },
            { title: "สกินแคร์ซีรีส์", text: "สูตรดูแลผิวที่เชื่อมกับความงามจากภายในและเรื่องราวสิ่งแวดล้อม" },
            { title: "กลิ่นบำบัดซีรีส์", text: "ผลิตภัณฑ์กลิ่นที่เชื่อมกับการนอน โฟกัส อารมณ์ และการผ่อนคลาย" },
            { title: "อาหารเสริมซีรีส์", text: "การสนับสนุนที่อิงวิทยาศาสตร์สำหรับวัย ความเครียด ความงาม และพลังชีวิต" },
            { title: "ของขวัญและไลฟ์สไตล์", text: "เซ็ตพรีเมียมสำหรับประสบการณ์ ของขวัญ hospitality และสมาชิก" },
            { title: "Starter routine", text: "ชุดเริ่มต้นสำหรับลูกค้าใหม่ที่ต้องการคำแนะนำแบบเป็นขั้นตอน" }
          ],
          featureTitle: "แนวทางหน้ารายละเอียดสินค้า",
          featureText: "หน้าสินค้าในอนาคตควรมีเรื่องราวสูตร วิธีใช้ รูทีน ส่วนผสม ข้อควรทราบ และปุ่มซื้อหรือติดต่อที่ชัดเจน",
          steps: ["ภาพรวมหมวด", "เรื่องราวผลิตภัณฑ์", "รูทีนและการใช้งาน", "ซื้อหรือติดต่อ"],
          ctaTitle: "ต่อยอดการ์ดสินค้าเป็น catalog",
          ctaText: "โครงสร้างนี้พร้อมรองรับรูปสินค้า SKU ราคา และระบบ stock ในอนาคต"
        },
        platform: {
          eyebrow: "แพลตฟอร์ม",
          title: "แพลตฟอร์มโปรไฟล์สำหรับการตัดสินใจด้านสุขภาวะแบบเฉพาะบุคคล",
          lead: "หน้าแพลตฟอร์มอธิบายว่า Arotec สามารถเก็บสัญญาณลูกค้า สร้างโปรไฟล์ และแนะนำโซลูชันในระดับ scale ได้อย่างไร",
          image: "hero-neuro.jpg",
          stats: [
            { value: "Profile", label: "ชั้นแบบประเมิน" },
            { value: "Match", label: "ตรรกะคำแนะนำ" },
            { value: "Loop", label: "feedback และการเรียนรู้" }
          ],
          cardsTitle: "โมดูลแพลตฟอร์ม",
          cardsLead: "ออกแบบเพื่อรองรับระบบสมาชิก workflow การปรึกษา หรือ dashboard สำหรับพาร์ทเนอร์ในอนาคต",
          cards: [
            { title: "Assessment builder", text: "สร้างแบบสอบถามหลายภาษาเพื่อเป้าหมายสุขภาวะและสัญญาณไลฟ์สไตล์" },
            { title: "Profile engine", text: "แปลงคำตอบเป็นกลุ่มผู้ใช้ ลำดับความสำคัญ และเส้นทางแนะนำ" },
            { title: "Recommendation view", text: "แสดงรูทีน ผลิตภัณฑ์ และคอนเทนต์ที่เหมาะกับโปรไฟล์ผู้ใช้" },
            { title: "Partner dashboard", text: "สนับสนุนคลินิก ทีมขาย และที่ปรึกษา wellness ด้วย workflow ที่ชัดเจน" },
            { title: "Content pairing", text: "เชื่อมบทความและความรู้เข้ากับแต่ละช่วงของ customer journey" },
            { title: "Feedback loop", text: "เก็บความพึงพอใจ พฤติกรรมใช้งานซ้ำ และสัญญาณความคืบหน้า" }
          ],
          featureTitle: "Roadmap แพลตฟอร์ม",
          featureText: "เริ่มจากแบบประเมินง่าย ๆ แล้วค่อยต่อยอดสู่ระบบโปรไฟล์ CRM และ recommendation เต็มรูปแบบ",
          steps: ["หน้าแบบประเมิน static", "จัดเก็บโปรไฟล์ลูกค้า", "แนะนำอัตโนมัติ", "dashboard และ analytics สำหรับพาร์ทเนอร์"],
          ctaTitle: "วางแพลตฟอร์มเป็นเฟสสอง",
          ctaText: "เว็บไซต์นี้สร้างฐานเนื้อหาให้ระบบ login และ personalization engine ในอนาคต"
        },
        about: {
          eyebrow: "รู้จักเรา",
          title: "ทีมที่เริ่มจากวิทยาศาสตร์ เชื่อมงานวิจัย ประสาทสัมผัส และการดูแลในชีวิตประจำวัน",
          lead: "Arotec ถูกนำเสนอเป็นบริษัท wellness science ระดับพรีเมียม ที่โฟกัส healthy aging, neuro plasticity และสุขภาวะผ่านกลิ่น",
          image: "core-texture.jpg",
          stats: [
            { value: "01", label: "พันธกิจ" },
            { value: "02", label: "วัฒนธรรมวิจัย" },
            { value: "03", label: "การเติบโตที่รับผิดชอบ" }
          ],
          cardsTitle: "เรื่องราวบริษัท",
          cardsLead: "หน้านี้ช่วยให้ลูกค้าและพาร์ทเนอร์เห็นเหตุผลที่ควรเชื่อมั่นในแบรนด์",
          cards: [
            { title: "พันธกิจของเรา", text: "ทำให้วิทยาศาสตร์ใช้งานได้จริง มีความเป็นมนุษย์ และมีประโยชน์ในชีวิตประจำวัน" },
            { title: "ทีมของเรา", text: "นักวิจัย ผู้พัฒนาผลิตภัณฑ์ และทีมแบรนด์ที่ทำงานข้ามศาสตร์ด้าน wellness" },
            { title: "ร่วมงานกับเรา", text: "พื้นที่สำหรับคนที่สนใจชีววิทยา ประสบการณ์ประสาทสัมผัส และผลิตภัณฑ์ที่คิดอย่างรอบคอบ" },
            { title: "ความยั่งยืน", text: "การเลือกแหล่งวัตถุดิบ บรรจุภัณฑ์ และสุขภาวะระยะยาวของลูกค้าอย่างรับผิดชอบ" },
            { title: "พาร์ทเนอร์", text: "เปิดรับคลินิก โรงแรม แบรนด์ wellness และผู้ร่วมวิจัย" },
            { title: "ความน่าเชื่อถือ", text: "การสื่อสาร claim อย่างชัดเจน เคารพ privacy และโปร่งใสกับลูกค้า" }
          ],
          featureTitle: "หลักคิดของแบรนด์",
          featureText: "ภาพอ้างอิงสื่อสารความสงบ ความฉลาด และความใส่ใจ หน้านี้เปลี่ยนความรู้สึกนั้นให้เป็นภาษาของแบรนด์",
          steps: ["วิทยาศาสตร์มาก่อนคำโฆษณา", "เฉพาะบุคคลก่อนคำแนะนำแบบกว้าง", "รูทีนก่อนความซับซ้อน", "สุขภาวะระยะยาวก่อนกระแสชั่วคราว"],
          ctaTitle: "แนะนำ Arotec อย่างมั่นใจ",
          ctaText: "หน้านี้สามารถเพิ่มโปรไฟล์ผู้ก่อตั้ง ใบรับรอง รูปห้องแล็บ และโลโก้ลูกค้าได้ในอนาคต"
        },
        insights: {
          eyebrow: "บทความ",
          title: "บทความ บันทึกงานวิจัย และเรื่องราววิทยาศาสตร์ในชีวิตจริง",
          lead: "Insights ช่วยสร้างความน่าเชื่อถือ เพิ่ม SEO และอธิบายแนวคิด wellness ที่ซับซ้อนให้อ่านง่าย",
          image: "card-aging.jpg",
          stats: [
            { value: "SEO", label: "เติบโตด้วยคอนเทนต์" },
            { value: "R&D", label: "บันทึกงานวิจัย" },
            { value: "Life", label: "เรื่องราวชีวิตจริง" }
          ],
          cardsTitle: "กลุ่มเนื้อหา",
          cardsLead: "ส่วน footer ในภาพมี Articles, Research, Science in Life และ Events จึงเตรียม stream เหล่านี้ไว้ที่นี่",
          cards: [
            { title: "Articles", text: "บทความอธิบายเรื่องการนอน ความเครียด กลิ่น ผิว และ healthy aging สำหรับลูกค้า" },
            { title: "Research", text: "บันทึกเชิงกลไกที่เชื่อมเส้นทางชีวภาพกับการคิดผลิตภัณฑ์" },
            { title: "Science in Life", text: "เรื่องเล่าที่แสดงว่ารูทีน สภาพแวดล้อม และสัญญาณประสาทสัมผัสส่งผลต่อสุขภาวะอย่างไร" },
            { title: "Events", text: "งานเปิดตัว เสวนา กิจกรรมพาร์ทเนอร์ และประสบการณ์ wellness" },
            { title: "Expert interviews", text: "บทสนทนากับนักวิทยาศาสตร์ formulators ผู้เชี่ยวชาญ และพาร์ทเนอร์" },
            { title: "Guides", text: "คู่มือรูทีนและความรู้ผลิตภัณฑ์สำหรับผู้เข้าชมซ้ำ" }
          ],
          featureTitle: "แนวทาง editorial",
          featureText: "เนื้อหาควรชัดเจน อิงหลักฐานเท่าที่เหมาะสม และใช้งานได้จริง บทความที่ดีควรทำให้ลูกค้ารู้สึกเข้าใจมากขึ้น ไม่ใช่หนักขึ้น",
          steps: ["เลือกคำถามของลูกค้า 1 เรื่อง", "อธิบายกลไก", "ให้ขั้นตอนที่ทำได้จริง", "เชื่อมไปยังโซลูชันหรือผลิตภัณฑ์ที่เหมาะสม"],
          ctaTitle: "เผยแพร่อย่างสม่ำเสมอ",
          ctaText: "แผนบทความรายเดือนช่วยสนับสนุน traffic จาก search และการสื่อสารกับพาร์ทเนอร์ได้"
        }
      },
      contact: {
        eyebrow: "ติดต่อเรา",
        title: "เริ่มคุยกับทีม Arotec",
        lead: "บอกเราว่าคุณสนใจผลิตภัณฑ์ พาร์ทเนอร์ งานวิจัย แพลตฟอร์ม หรือโปรแกรมสุขภาวะเฉพาะบุคคล",
        methods: [
          { label: "อีเมล", value: "hello@aands.com" },
          { label: "โทร", value: "+886 123 456 789" },
          { label: "สำนักงาน", value: "Taipei, Taiwan" }
        ],
        form: {
          name: "ชื่อ",
          email: "อีเมล",
          topic: "หัวข้อ",
          topicOptions: ["สอบถามผลิตภัณฑ์", "พาร์ทเนอร์", "งานวิจัย", "แพลตฟอร์ม", "โปรแกรมเฉพาะบุคคล"],
          message: "ข้อความ",
          success: "ขอบคุณครับ ข้อความของคุณพร้อมส่งต่อให้ทีม Arotec แล้ว"
        },
        faqTitle: "ข้อมูลที่เป็นประโยชน์",
        faq: ["ร่วมเป็นพาร์ทเนอร์", "คำถามที่พบบ่อย", "Privacy และ Terms"]
      },
      footer: {
        insights: "บทความ",
        about: "รู้จักเรา",
        contact: "Get In touch",
        informed: "รับข่าวสาร",
        informedText: "สมัครรับข่าวสารและ insight ล่าสุดจากเรา",
        articles: "Articles",
        research: "Research",
        scienceLife: "Science in Life",
        events: "Events",
        team: "ทีมของเรา",
        careers: "ร่วมงานกับเรา",
        sustainability: "ความยั่งยืน",
        partner: "ร่วมเป็นพาร์ทเนอร์",
        faq: "คำถามที่พบบ่อย",
        copyright: "© 2026 Arotec. All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Use"
      }
    },
    zh: {
      brand: { title: "Arotec", subtitle: "Science for Life" },
      nav: {
        home: "首頁",
        customized: "為你客製",
        applied: "應用方案",
        products: "應用產品",
        platform: "平台",
        about: "關於我們",
        insights: "洞察",
        partners: "合作夥伴",
        join: "加入我們",
        contact: "Get In touch"
      },
      common: {
        learnMore: "了解更多",
        explore: "探索",
        exploreScience: "探索我們的科學",
        start: "開始個人化",
        viewProducts: "查看所有產品",
        openMenu: "開啟選單",
        closeMenu: "關閉選單",
        search: "搜尋",
        closeSearch: "關閉搜尋",
        searchPlaceholder: "搜尋頁面、產品或方案",
        searchEmpty: "尚未找到結果。可嘗試科學、睡眠、產品或平台。",
        readMore: "閱讀更多",
        submit: "送出訊息",
        subscribe: "訂閱",
        emailPlaceholder: "你的電子郵件",
        arrow: "前往"
      },
      home: {
        hero: {
          eyebrow: "Arotec Science for Life",
          title: "We engineer sensory-driven\nbioactive systems for human\nhomeostasis.",
          lead: "A&S is a science-driven innovation company developing sensory, functional, and bioactive solutions for human well-being.",
          primary: "探索我們的科學",
          secondary: "為你客製",
          tags: ["Science", "Solutions", "Products"]
        },
        concept: {
          title: "核心概念",
          lead: "從機制導向研究，到個人化且以感官驅動的體驗。",
          items: [
            { title: "Research", text: "探索老化、大腦與感官互動背後的機制。" },
            { title: "Mechanism", text: "理解生物與分子層級上的作用方式。" },
            { title: "Personalization", text: "依據每個人的生理特徵與生活型態設計方案。" }
          ]
        },
        research: {
          title: "Research to Mechanism",
          lead: "理解生命背後的科學。",
          cards: [
            { title: "Neuro Plasticity", subtitle: "為更好的自己重塑連結", text: "我們研究生活型態、營養、氣味與生物訊號如何支持突觸連結、認知與情緒平衡。", image: "card-plasticity.jpg" },
            { title: "Human Aging", subtitle: "放慢老化，好好生活", text: "我們研究老化的生物路徑，並開發支持細胞韌性與功能的策略。", image: "card-aging.jpg" },
            { title: "Neuro Scented Therapy", subtitle: "能與大腦對話的氣味", text: "我們解析天然氣味如何透過嗅覺路徑調節腦部活動、情緒、壓力與睡眠。", image: "card-scented.jpg" }
          ]
        },
        applied: {
          title: "應用方案",
          lead: "以科學為基礎，應用於心理、身體與日常生活。",
          items: ["認知與情緒支持", "睡眠與壓力平衡", "健康老化與長壽", "肌膚與內在美", "香氛身心平衡"],
          button: "探索方案"
        },
        products: {
          title: "產品",
          lead: "靈感來自科學，細節源於關懷。",
          items: ["機能飲品", "保養系列", "香氛療法系列", "補充品系列", "禮品與生活風格"],
          button: "查看所有產品"
        },
        personal: {
          title: "Personalized for You",
          lead: "你的生理特徵，你的環境，你的方案。",
          steps: ["回答幾個問題", "我們分析你的輪廓", "取得個人化方案"],
          button: "開始個人化"
        }
      },
      pages: {},
      contact: {},
      footer: {}
    },
    ja: {
      brand: { title: "Arotec", subtitle: "Science for Life" },
      nav: {
        home: "ホーム",
        customized: "あなたに最適化",
        applied: "応用ソリューション",
        products: "応用製品",
        platform: "プラットフォーム",
        about: "私たちについて",
        insights: "インサイト",
        partners: "パートナー",
        join: "採用情報",
        contact: "Get In touch"
      },
      common: {
        learnMore: "詳しく見る",
        explore: "見る",
        exploreScience: "私たちの科学を見る",
        start: "パーソナライズを開始",
        viewProducts: "すべての製品を見る",
        openMenu: "メニューを開く",
        closeMenu: "メニューを閉じる",
        search: "検索",
        closeSearch: "検索を閉じる",
        searchPlaceholder: "ページ、製品、ソリューションを検索",
        searchEmpty: "結果がありません。science、sleep、products、platform などをお試しください。",
        readMore: "続きを読む",
        submit: "送信",
        subscribe: "登録",
        emailPlaceholder: "メールアドレス",
        arrow: "移動"
      },
      home: {
        hero: {
          eyebrow: "Arotec Science for Life",
          title: "We engineer sensory-driven\nbioactive systems for human\nhomeostasis.",
          lead: "A&S is a science-driven innovation company developing sensory, functional, and bioactive solutions for human well-being.",
          primary: "私たちの科学を見る",
          secondary: "あなたに最適化",
          tags: ["Science", "Solutions", "Products"]
        },
        concept: {
          title: "コアコンセプト",
          lead: "メカニズムに基づく研究から、感覚に寄り添うパーソナライズ体験へ。",
          items: [
            { title: "Research", text: "老化、脳、感覚の相互作用にあるメカニズムを探ります。" },
            { title: "Mechanism", text: "生物学的・分子レベルでの働きを理解します。" },
            { title: "Personalization", text: "一人ひとりの生体特性と生活習慣に合わせて設計します。" }
          ]
        },
        research: {
          title: "Research to Mechanism",
          lead: "生命の背景にある科学を理解する。",
          cards: [
            { title: "Neuro Plasticity", subtitle: "より良い自分へつなぎ直す", text: "生活習慣、栄養、香り、生体シグナルがシナプス結合、認知、感情バランスをどう支えるかを研究します。", image: "card-plasticity.jpg" },
            { title: "Human Aging", subtitle: "ゆるやかに年を重ね、よく生きる", text: "老化の生物学的経路を調べ、細胞のしなやかさと機能を支える戦略を開発します。", image: "card-aging.jpg" },
            { title: "Neuro Scented Therapy", subtitle: "脳に語りかける香り", text: "天然の香りが嗅覚経路を通じて脳活動、気分、ストレス、睡眠にどう作用するかを読み解きます。", image: "card-scented.jpg" }
          ]
        },
        applied: {
          title: "応用ソリューション",
          lead: "心、身体、日常生活のための科学ベースの応用。",
          items: ["認知と気分のサポート", "睡眠とストレスのバランス", "健康的なエイジングと長寿", "肌とインナービューティー", "香りによるウェルビーイング"],
          button: "ソリューションを見る"
        },
        products: {
          title: "製品",
          lead: "科学から着想し、丁寧に設計する。",
          items: ["機能性飲料", "スキンケアシリーズ", "香りのセラピーシリーズ", "サプリメントシリーズ", "ギフトとライフスタイル"],
          button: "すべての製品を見る"
        },
        personal: {
          title: "Personalized for You",
          lead: "あなたの生体、あなたの環境、あなたのソリューション。",
          steps: ["いくつかの質問に回答", "プロフィールを分析", "個別ソリューションを取得"],
          button: "パーソナライズを開始"
        }
      },
      pages: {},
      contact: {},
      footer: {}
    }
  };

  copy.zh.pages = {
    customized: {
      eyebrow: "為你客製",
      title: "以真實生活為核心的個人化方案",
      lead: "Arotec 將生活型態訊號、感官偏好與健康目標，轉化為清楚可行的推薦旅程。",
      image: "customized-banner.jpg",
      stats: [
        { value: "3", label: "個人輪廓層級" },
        { value: "12", label: "日常生活訊號" },
        { value: "1", label: "清楚推薦" }
      ],
      cardsTitle: "我們個人化的內容",
      cardsLead: "體驗結合科學邏輯與容易回答的生活問題。",
      cards: [
        { title: "心智與情緒", text: "認知負荷、專注節奏、情緒平衡與偏好的感官提示。" },
        { title: "睡眠與壓力", text: "生理節律、壓力型態、恢復窗口與讓人安定的香氣偏好。" },
        { title: "肌膚與老化", text: "肌膚困擾、環境暴露、內在美需求與長期健康目標。" }
      ],
      featureTitle: "個人化流程",
      featureText: "旅程讓使用者從快速評估自然進入推薦，不會感到過度醫療化或複雜。",
      steps: ["選擇你的目標", "回答生活型態問題", "配對機制與方案", "取得日常與產品建議"],
      ctaTitle: "準備好設計第一版評估了嗎",
      ctaText: "此頁可作為顧客測驗、諮詢表單或會員平台的起點。"
    },
    applied: {
      eyebrow: "應用方案",
      title: "把科學轉化為日常可用的健康方案",
      lead: "每個方案都從研究主題延伸到日常儀式、產品組合與可辨識的顧客需求。",
      image: "solutions-neuron.jpg",
      stats: [
        { value: "5", label: "方案領域" },
        { value: "360°", label: "身心整合視角" },
        { value: "B2C", label: "可支援合作通路" }
      ],
      cardsTitle: "方案領域",
      cardsLead: "網站結構對應參考圖中的應用方案分組。",
      cards: [
        { title: "認知與情緒支持", text: "專注、清晰思考、情緒平衡與工作日韌性。" },
        { title: "睡眠與壓力平衡", text: "夜間儀式、恢復支持與友善神經系統的日常安排。" },
        { title: "健康老化與長壽", text: "支持活力、代謝與健康老化的預防型方案。" },
        { title: "肌膚與內在美", text: "由外而內支持肌膚健康與每日自信。" },
        { title: "香氛身心平衡", text: "為情緒、放鬆與感官記憶而設計的嗅覺體驗。" },
        { title: "企業健康方案", text: "可延伸至診所、零售、飯店與健康空間的合作模式。" }
      ],
      featureTitle: "方案如何組成",
      featureText: "每個方案都把顧客需求連結到機制、日常儀式與產品或服務接觸點。",
      steps: ["確認健康目標", "對應相關機制", "選擇日常與產品", "追蹤回饋並持續優化"],
      ctaTitle: "為每個分類建立獨立頁面",
      ctaText: "這些分類未來可延伸為專屬 landing page，加入產品推薦與洽詢表單。"
    },
    products: {
      eyebrow: "產品",
      title: "以科學觀點打造的產品系列",
      lead: "產品頁清楚呈現分類，同時保留參考圖中高級、實驗室感的視覺氛圍。",
      image: "products-lab.jpg",
      stats: [
        { value: "5", label: "產品系列" },
        { value: "Lab", label: "科學故事" },
        { value: "Care", label: "日常照護" }
      ],
      cardsTitle: "產品分類",
      cardsLead: "每個分類目前以卡片呈現，未來可擴充為完整產品列表。",
      cards: [
        { title: "機能飲品", text: "圍繞清晰、平衡、恢復與美麗的每日飲品。" },
        { title: "保養系列", text: "將肌膚配方與內在美、環境照護故事連結。" },
        { title: "香氛療法系列", text: "連結睡眠、專注、情緒與放鬆的香氣產品。" },
        { title: "補充品系列", text: "支持老化、壓力、美麗與日常活力的科學型補充品。" },
        { title: "禮品與生活風格", text: "適合體驗、贈禮、飯店與會員方案的高級組合。" },
        { title: "入門日常", text: "為新顧客提供有指引的第一組推薦。" }
      ],
      featureTitle: "產品頁方向",
      featureText: "未來產品頁應包含配方故事、使用情境、日常方式、成分、安全資訊與清楚的購買或洽詢動作。",
      steps: ["分類總覽", "產品故事", "日常與用法", "購買或洽詢"],
      ctaTitle: "將產品卡片發展成型錄",
      ctaText: "目前架構已準備好支援產品照片、SKU、價格與庫存串接。"
    },
    platform: {
      eyebrow: "平台",
      title: "用於個人化健康決策的輪廓平台",
      lead: "平台頁說明 Arotec 如何收集顧客訊號、建立輪廓，並大規模推薦合適方案。",
      image: "hero-neuro.jpg",
      stats: [
        { value: "Profile", label: "評估層" },
        { value: "Match", label: "推薦邏輯" },
        { value: "Loop", label: "回饋與學習" }
      ],
      cardsTitle: "平台模組",
      cardsLead: "為未來會員系統、諮詢流程或合作夥伴 dashboard 而設計。",
      cards: [
        { title: "評估建立器", text: "建立多語問卷，收集健康目標與生活訊號。" },
        { title: "輪廓引擎", text: "將回答轉換為分群、優先順序與推薦路徑。" },
        { title: "推薦視圖", text: "呈現符合使用者輪廓的日常、產品與內容。" },
        { title: "合作夥伴 dashboard", text: "支援診所、零售團隊與健康顧問的工作流程。" },
        { title: "內容配對", text: "把洞察文章與顧客旅程的不同階段連結。" },
        { title: "回饋循環", text: "持續收集滿意度、重複使用與進展訊號。" }
      ],
      featureTitle: "平台藍圖",
      featureText: "先從簡單評估開始，再逐步發展成完整的輪廓、CRM 與推薦系統。",
      steps: ["靜態評估頁", "儲存顧客輪廓", "自動推薦", "合作 dashboard 與分析"],
      ctaTitle: "把平台規劃為第二階段",
      ctaText: "此網站先建立內容基礎，方便未來導入登入系統與個人化引擎。"
    },
    about: {
      eyebrow: "關於我們",
      title: "以科學為起點，連結研究、感官與日常照護的團隊",
      lead: "Arotec 被定位為高端 wellness science 品牌，專注於健康老化、神經可塑性與香氛驅動的身心平衡。",
      image: "core-texture.jpg",
      stats: [
        { value: "01", label: "使命" },
        { value: "02", label: "研究文化" },
        { value: "03", label: "負責任成長" }
      ],
      cardsTitle: "品牌故事",
      cardsLead: "此頁讓顧客與合作夥伴清楚理解品牌值得信任的原因。",
      cards: [
        { title: "我們的使命", text: "讓科學變得實用、有人味，並真正進入日常生活。" },
        { title: "我們的團隊", text: "研究者、產品開發者與品牌團隊跨 wellness 接觸點合作。" },
        { title: "加入我們", text: "歡迎關心生物學、感官體驗與細緻產品的人加入。" },
        { title: "永續", text: "重視負責任採購、包裝與顧客長期健康。" },
        { title: "合作", text: "開放與診所、飯店、wellness 品牌和研究單位合作。" },
        { title: "信任", text: "清楚的產品宣稱、顧客隱私與透明溝通。" }
      ],
      featureTitle: "品牌原則",
      featureText: "參考圖傳達安定、智慧與關懷；此頁將這種感受轉化為品牌語言。",
      steps: ["先有科學，再有宣稱", "先個人化，再大量建議", "先日常儀式，再複雜系統", "先長期健康，再短期潮流"],
      ctaTitle: "有信心地介紹 Arotec",
      ctaText: "此頁未來可加入創辦人介紹、證書、實驗室照片與客戶標誌。"
    },
    insights: {
      eyebrow: "洞察",
      title: "文章、研究筆記與生活中的科學故事",
      lead: "Insights 協助品牌建立信任、提升 SEO，並用清楚的方式解釋複雜的健康概念。",
      image: "card-aging.jpg",
      stats: [
        { value: "SEO", label: "內容成長" },
        { value: "R&D", label: "研究筆記" },
        { value: "Life", label: "日常故事" }
      ],
      cardsTitle: "內容類型",
      cardsLead: "參考圖 footer 包含 Articles、Research、Science in Life 與 Events，因此此頁已準備對應內容流。",
      cards: [
        { title: "文章", text: "用顧客容易理解的方式說明睡眠、壓力、香氣、肌膚與健康老化。" },
        { title: "研究", text: "以機制為核心的筆記，連結生物路徑與產品思考。" },
        { title: "生活中的科學", text: "說明日常儀式、環境與感官提示如何影響健康。" },
        { title: "活動", text: "發布會、講座、合作活動與 wellness 體驗。" },
        { title: "專家訪談", text: "與科學家、配方師、臨床專家與合作夥伴的對談。" },
        { title: "指南", text: "為回訪者提供實用日常與產品教育。" }
      ],
      featureTitle: "編輯方向",
      featureText: "內容應該清楚、適度重視證據且實用。好的文章讓顧客更理解，而不是更有壓力。",
      steps: ["選擇一個顧客問題", "解釋背後機制", "提供可執行步驟", "連結到合適方案或產品"],
      ctaTitle: "穩定發布內容",
      ctaText: "每月文章計畫可以支援搜尋流量與合作夥伴溝通。"
    }
  };
  copy.zh.contact = {
    eyebrow: "聯絡我們",
    title: "與 Arotec 開始對話",
    lead: "告訴我們你感興趣的是產品、合作、研究、平台，或個人化健康方案。",
    methods: [
      { label: "電子郵件", value: "hello@aands.com" },
      { label: "電話", value: "+886 123 456 789" },
      { label: "辦公室", value: "Taipei, Taiwan" }
    ],
    form: {
      name: "姓名",
      email: "電子郵件",
      topic: "主題",
      topicOptions: ["產品詢問", "合作", "研究", "平台", "個人化方案"],
      message: "訊息",
      success: "謝謝你。你的訊息已準備交給 Arotec 團隊。"
    },
    faqTitle: "實用資訊",
    faq: ["成為合作夥伴", "常見問題", "隱私與條款"]
  };
  copy.zh.footer = {
    insights: "洞察",
    about: "關於我們",
    contact: "Get In touch",
    informed: "保持更新",
    informedText: "訂閱電子報，取得最新洞察。",
    articles: "文章",
    research: "研究",
    scienceLife: "生活中的科學",
    events: "活動",
    team: "我們的團隊",
    careers: "加入我們",
    sustainability: "永續",
    partner: "成為合作夥伴",
    faq: "常見問題",
    copyright: "© 2026 Arotec. All rights reserved.",
    privacy: "隱私權政策",
    terms: "使用條款"
  };

  copy.ja.pages = {
    customized: {
      eyebrow: "あなたに最適化",
      title: "現実の生活に合わせて組み立てるパーソナルプログラム",
      lead: "Arotec は生活シグナル、感覚の好み、ウェルネス目標を、実行しやすい推薦ジャーニーへ変換します。",
      image: "customized-banner.jpg",
      stats: [
        { value: "3", label: "プロフィール層" },
        { value: "12", label: "日常シグナル" },
        { value: "1", label: "明確な推薦" }
      ],
      cardsTitle: "パーソナライズする領域",
      cardsLead: "科学的なロジックと、利用者が答えやすい生活の質問を組み合わせます。",
      cards: [
        { title: "心と気分", text: "認知負荷、集中の習慣、感情バランス、好みの感覚キュー。" },
        { title: "睡眠とストレス", text: "リズム、緊張パターン、回復時間、落ち着く香りの好み。" },
        { title: "肌とエイジング", text: "肌悩み、環境要因、インナービューティー、長期的な健康目標。" }
      ],
      featureTitle: "パーソナライズの流れ",
      featureText: "簡単な評価から推薦まで、臨床的になりすぎず自然に進められる体験です。",
      steps: ["目標を選ぶ", "生活習慣の質問に答える", "メカニズムと方案を合わせる", "日常ルーティンと製品案内を受け取る"],
      ctaTitle: "最初の評価設計を始めますか",
      ctaText: "このページは顧客クイズ、相談フォーム、会員プラットフォームの出発点になります。"
    },
    applied: {
      eyebrow: "応用ソリューション",
      title: "科学を日常のウェルネスプログラムへ翻訳する",
      lead: "各ソリューションは研究テーマから実践ルーティン、製品セット、測定しやすい顧客ニーズへつながります。",
      image: "solutions-neuron.jpg",
      stats: [
        { value: "5", label: "ソリューション領域" },
        { value: "360°", label: "心身の視点" },
        { value: "B2C", label: "パートナー展開対応" }
      ],
      cardsTitle: "ソリューション領域",
      cardsLead: "参考デザインにある分類に沿ってサイト構造を準備しています。",
      cards: [
        { title: "認知と気分のサポート", text: "集中、思考の明瞭さ、感情バランス、日中のレジリエンス。" },
        { title: "睡眠とストレスのバランス", text: "夜の習慣、回復サポート、神経系にやさしいルーティン。" },
        { title: "健康的なエイジングと長寿", text: "活力、代謝、健やかな年齢の重ね方を支える予防型プログラム。" },
        { title: "肌とインナービューティー", text: "肌の健康と毎日の自信を、外側と内側から支える考え方。" },
        { title: "香りによるウェルビーイング", text: "気分、リラックス、感覚記憶のために設計された香り体験。" },
        { title: "企業ウェルネス", text: "クリニック、店舗、ホテル、ウェルネス空間に向けた展開。" }
      ],
      featureTitle: "ソリューションの組み立て方",
      featureText: "顧客ニーズをメカニズム、ルーティン、製品またはサービス接点へ結びます。",
      steps: ["ウェルネス目標を確認", "関連メカニズムを対応", "ルーティンと製品を選択", "フィードバックを取り改善"],
      ctaTitle: "カテゴリごとのページへ展開",
      ctaText: "各カテゴリは、製品推薦と問い合わせフォームを備えた専用 landing page に拡張できます。"
    },
    products: {
      eyebrow: "製品",
      title: "科学的な視点から語る製品ファミリー",
      lead: "製品ページは分類を明確に見せながら、参考デザインのプレミアムでラボ感のある雰囲気を保ちます。",
      image: "products-lab.jpg",
      stats: [
        { value: "5", label: "製品ファミリー" },
        { value: "Lab", label: "科学のストーリー" },
        { value: "Care", label: "日常ケア" }
      ],
      cardsTitle: "製品カテゴリ",
      cardsLead: "各カテゴリは現在カードとして用意されており、後から製品一覧へ拡張できます。",
      cards: [
        { title: "機能性飲料", text: "明瞭さ、バランス、回復、美しさをテーマにした日常飲料。" },
        { title: "スキンケアシリーズ", text: "肌向けの処方を、インナービューティーと環境ケアの物語につなげます。" },
        { title: "香りのセラピーシリーズ", text: "睡眠、集中、気分、リラックスにつながる香り製品。" },
        { title: "サプリメントシリーズ", text: "エイジング、ストレス、美しさ、活力を科学的に支える製品。" },
        { title: "ギフトとライフスタイル", text: "体験、ギフト、ホテル、会員プログラムに合うプレミアムセット。" },
        { title: "スタータールーティン", text: "初めての顧客に向けたガイド付きの入口。" }
      ],
      featureTitle: "製品詳細ページの方向性",
      featureText: "今後の製品ページには、処方ストーリー、使用シーン、ルーティン、成分、安全情報、購入または問い合わせ動線を入れます。",
      steps: ["カテゴリ概要", "製品ストーリー", "ルーティンと使い方", "購入または問い合わせ"],
      ctaTitle: "製品カードをカタログへ",
      ctaText: "現在の構造は、製品画像、SKU、価格、在庫連携に対応できる準備ができています。"
    },
    platform: {
      eyebrow: "プラットフォーム",
      title: "パーソナルなウェルネス判断のためのプロフィール平台",
      lead: "Arotec が顧客シグナルを収集し、プロフィールを作成し、適したソリューションを大規模に推薦する仕組みを説明します。",
      image: "hero-neuro.jpg",
      stats: [
        { value: "Profile", label: "評価レイヤー" },
        { value: "Match", label: "推薦ロジック" },
        { value: "Loop", label: "フィードバックと学習" }
      ],
      cardsTitle: "プラットフォームモジュール",
      cardsLead: "将来の会員システム、相談ワークフロー、パートナー dashboard のために設計。",
      cards: [
        { title: "評価ビルダー", text: "ウェルネス目標と生活シグナルを集める多言語質問票を作成。" },
        { title: "プロフィールエンジン", text: "回答をセグメント、優先度、推薦パスへ変換。" },
        { title: "推薦ビュー", text: "利用者プロフィールに合うルーティン、製品、コンテンツを表示。" },
        { title: "パートナー dashboard", text: "クリニック、販売チーム、ウェルネス相談員の業務を支援。" },
        { title: "コンテンツ連携", text: "顧客ジャーニーの各段階に合わせて記事と教育内容を接続。" },
        { title: "フィードバックループ", text: "満足度、再利用、進捗シグナルを継続して収集。" }
      ],
      featureTitle: "プラットフォームロードマップ",
      featureText: "簡単な評価から始め、プロフィール、CRM、推薦システムへ育てます。",
      steps: ["静的な評価ページ", "顧客プロフィール保存", "自動推薦", "パートナー dashboard と分析"],
      ctaTitle: "平台は第2フェーズとして計画",
      ctaText: "このウェブサイトは、将来のログインシステムとパーソナライゼーションエンジンの土台になります。"
    },
    about: {
      eyebrow: "私たちについて",
      title: "科学を起点に、研究・感覚・日常ケアをつなぐチーム",
      lead: "Arotec は、健康的なエイジング、神経可塑性、香りによるウェルビーイングに焦点を当てたプレミアムな wellness science 企業として表現しています。",
      image: "core-texture.jpg",
      stats: [
        { value: "01", label: "ミッション" },
        { value: "02", label: "研究文化" },
        { value: "03", label: "責任ある成長" }
      ],
      cardsTitle: "会社のストーリー",
      cardsLead: "顧客とパートナーに、ブランドを信頼する理由を明確に伝えます。",
      cards: [
        { title: "私たちのミッション", text: "科学を実用的で人間らしく、日常に役立つものにする。" },
        { title: "私たちのチーム", text: "研究者、製品開発者、ブランドチームが wellness の接点を横断して働きます。" },
        { title: "採用", text: "生物学、感覚体験、丁寧な製品づくりに関心のある人のための場。" },
        { title: "サステナビリティ", text: "責任ある調達、包装、顧客の長期的なウェルビーイングを大切にします。" },
        { title: "パートナーシップ", text: "クリニック、ホテル、wellness ブランド、研究協力者に開かれています。" },
        { title: "信頼", text: "明確な製品表現、顧客プライバシー、透明なコミュニケーション。" }
      ],
      featureTitle: "ブランド原則",
      featureText: "参考デザインは落ち着き、知性、ケアを伝えます。このページではその感覚をブランド言語にします。",
      steps: ["主張の前に科学", "一般論の前に個別化", "複雑さの前に日常ルーティン", "短期トレンドの前に長期ウェルビーイング"],
      ctaTitle: "Arotec を自信を持って紹介",
      ctaText: "今後、創業者プロフィール、認証、ラボ写真、顧客ロゴを追加できます。"
    },
    insights: {
      eyebrow: "インサイト",
      title: "記事、研究ノート、生活の中の科学ストーリー",
      lead: "Insights は信頼を育て、SEO を強化し、複雑なウェルネス概念を読みやすく伝えます。",
      image: "card-aging.jpg",
      stats: [
        { value: "SEO", label: "コンテンツ成長" },
        { value: "R&D", label: "研究ノート" },
        { value: "Life", label: "日常ストーリー" }
      ],
      cardsTitle: "インサイトの流れ",
      cardsLead: "参考デザインの footer にある Articles、Research、Science in Life、Events に対応しています。",
      cards: [
        { title: "記事", text: "睡眠、ストレス、香り、肌、健康的なエイジングを顧客向けにわかりやすく説明。" },
        { title: "研究", text: "生物学的経路と製品思考をつなぐメカニズム中心のノート。" },
        { title: "生活の中の科学", text: "ルーティン、環境、感覚キューがウェルビーイングにどう関わるかを紹介。" },
        { title: "イベント", text: "ローンチ、トーク、パートナー施策、ウェルネス体験。" },
        { title: "専門家インタビュー", text: "科学者、処方開発者、臨床家、パートナーとの対話。" },
        { title: "ガイド", text: "再訪者に役立つルーティンと製品教育。" }
      ],
      featureTitle: "編集方針",
      featureText: "コンテンツは明確で、適度に根拠を意識し、実用的であること。良い記事は顧客を疲れさせず、理解を深めます。",
      steps: ["顧客の質問を一つ選ぶ", "メカニズムを説明", "実行できる次の行動を提示", "合う方案や製品へつなぐ"],
      ctaTitle: "安定した公開リズムを作る",
      ctaText: "月次の記事計画は検索流入とパートナー向けコミュニケーションを支えます。"
    }
  };
  copy.ja.contact = {
    eyebrow: "お問い合わせ",
    title: "Arotec との対話を始める",
    lead: "製品、パートナーシップ、研究、プラットフォーム、またはパーソナライズプログラムについてお聞かせください。",
    methods: [
      { label: "メール", value: "hello@aands.com" },
      { label: "電話", value: "+886 123 456 789" },
      { label: "オフィス", value: "Taipei, Taiwan" }
    ],
    form: {
      name: "お名前",
      email: "メール",
      topic: "トピック",
      topicOptions: ["製品について", "パートナーシップ", "研究", "プラットフォーム", "個別プログラム"],
      message: "メッセージ",
      success: "ありがとうございます。メッセージは Arotec チームに渡す準備ができました。"
    },
    faqTitle: "関連情報",
    faq: ["パートナーになる", "FAQ", "プライバシーと利用規約"]
  };
  copy.ja.footer = {
    insights: "インサイト",
    about: "私たちについて",
    contact: "Get In touch",
    informed: "最新情報を受け取る",
    informedText: "ニュースレターで最新のインサイトをお届けします。",
    articles: "記事",
    research: "研究",
    scienceLife: "生活の中の科学",
    events: "イベント",
    team: "私たちのチーム",
    careers: "採用",
    sustainability: "サステナビリティ",
    partner: "パートナーになる",
    faq: "FAQ",
    copyright: "© 2026 Arotec. All rights reserved.",
    privacy: "プライバシーポリシー",
    terms: "利用規約"
  };

  const icons = {
    arrow: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>',
    arrowLeft: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5"></path><path d="m11 6-6 6 6 6"></path></svg>',
    search: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4.2-4.2"></path></svg>',
    menu: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>',
    close: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12"></path><path d="M18 6 6 18"></path></svg>',
    atom: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2"></circle><path d="M20.2 12c0 2-3.7 3.7-8.2 3.7S3.8 14 3.8 12 7.5 8.3 12 8.3s8.2 1.7 8.2 3.7Z"></path><path d="M16.1 19.1c-1.7 1-4.9-1.7-7.2-5.6S6.4 6 8.1 5s4.9 1.7 7.2 5.6 2.5 7.5.8 8.5Z"></path><path d="M7.9 19.1c-1.7-1-.5-4.8 1.8-8.5S15.5 4 17.2 5s.5 4.8-1.8 8.5-5.8 6.6-7.5 5.6Z"></path></svg>',
    user: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>',
    brain: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5a4 4 0 0 0-4 4v1a4 4 0 0 0 1.5 7.7"></path><path d="M15 5a4 4 0 0 1 4 4v1a4 4 0 0 1-1.5 7.7"></path><path d="M9 5v14"></path><path d="M15 5v14"></path><path d="M9 10H6"></path><path d="M18 10h-3"></path><path d="M9 15H7"></path><path d="M17 15h-2"></path></svg>',
    bottle: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2h4v4l2 2v12a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8l2-2Z"></path><path d="M9 13h6"></path></svg>',
    leaf: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-8 0-14 4-14 10a6 6 0 0 0 6 6c6 0 8-8 8-16Z"></path><path d="M6 20c2-5 6-8 12-10"></path></svg>',
    mail: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m3 7 9 7 9-7"></path></svg>',
    phone: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.2 19.2 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"></path></svg>',
    pin: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
    chart: '<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5"></path><path d="M4 19h16"></path><path d="M8 16v-5"></path><path d="M12 16V8"></path><path d="M16 16v-3"></path></svg>'
  };

  const sciencePlatform = {
    en: {
      title: "Science Platform",
      lead: "Our Science Platform",
      items: [
        { title: "Exposome & Human Interface", image: "science-platform-1.jpg" },
        { title: "Neuroplasticity & Sensory Modulation", image: "science-platform-2.jpg" },
        { title: "Skin-Brain Axis", image: "science-platform-3.jpg" },
        { title: "Electrolyte Homeostasis System", image: "science-platform-4.jpg" },
        { title: "Nature/Cell", image: "science-platform-5.jpg" }
      ]
    },
    ja: {
      title: "サイエンスプラットフォーム",
      lead: "私たちのサイエンスプラットフォーム",
      items: [
        { title: "エクスポソームとヒューマンインターフェース", image: "science-platform-1.jpg" },
        { title: "神経可塑性と感覚モジュレーション", image: "science-platform-2.jpg" },
        { title: "皮膚-脳軸", image: "science-platform-3.jpg" },
        { title: "電解質ホメオスタシスシステム", image: "science-platform-4.jpg" },
        { title: "自然/細胞", image: "science-platform-5.jpg" }
      ]
    },
    zh: {
      title: "科學平台",
      lead: "我們的科學平台",
      items: [
        { title: "暴露體與人體介面", image: "science-platform-1.jpg" },
        { title: "神經可塑性與感官調節", image: "science-platform-2.jpg" },
        { title: "皮膚-大腦軸", image: "science-platform-3.jpg" },
        { title: "電解質恆定系統", image: "science-platform-4.jpg" },
        { title: "自然/細胞", image: "science-platform-5.jpg" }
      ]
    },
    th: {
      title: "แพลตฟอร์มวิทยาศาสตร์",
      lead: "แพลตฟอร์มวิทยาศาสตร์ของเรา",
      items: [
        { title: "เอกซ์โพโซมและจุดเชื่อมต่อกับมนุษย์", image: "science-platform-1.jpg" },
        { title: "ความยืดหยุ่นของสมองและการปรับสัญญาณประสาทสัมผัส", image: "science-platform-2.jpg" },
        { title: "แกนผิวหนัง-สมอง", image: "science-platform-3.jpg" },
        { title: "ระบบสมดุลอิเล็กโทรไลต์", image: "science-platform-4.jpg" },
        { title: "ธรรมชาติ/เซลล์", image: "science-platform-5.jpg" }
      ]
    }
  };

  function asset(name) {
    return new URL(`${root}assets/images/${name}`, document.baseURI).href;
  }

  function routeHref(id) {
    const route = routes.find((item) => item.id === id);
    if (route?.section) {
      return pageId === "home" ? `#${route.section}` : `${root}index.html#${route.section}`;
    }
    return route ? `${root}${route.path}` : `${root}index.html`;
  }

  function activeClass(id) {
    return id === pageId ? " active" : "";
  }

  function navLinks(text) {
    return routes
      .filter((route) => route.nav)
      .map((route) => `<a class="nav-link${activeClass(route.id)}" href="${routeHref(route.id)}">${text.nav[route.id]}</a>`)
      .join("");
  }

  function renderHeader(text, lang) {
    const options = Object.entries(languageMeta)
      .map(([code, meta]) => `<option value="${code}"${code === lang ? " selected" : ""}>${meta.label}</option>`)
      .join("");
    const chips = Object.entries(languageMeta)
      .map(([code, meta]) => `<button class="language-chip${code === lang ? " active" : ""}" data-lang-chip="${code}" type="button">${meta.label}</button>`)
      .join("");

    return `
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="${routeHref("home")}" aria-label="Arotec home">
            <img class="brand-logo" src="${asset("arotec-logo.jpg")}" alt="Arotec">
          </a>
          <nav class="desktop-nav" aria-label="Primary navigation">${navLinks(text)}</nav>
          <div class="header-actions">
            <select class="language-select" id="languageSelect" aria-label="Language">${options}</select>
            <a class="pill-button contact-pill" href="${routeHref("contact")}">${text.nav.contact}</a>
            <button class="circle-button" id="searchButton" type="button" title="${text.common.search}" aria-label="${text.common.search}">${icons.search}</button>
            <button class="circle-button menu-toggle" id="menuToggle" type="button" title="${text.common.openMenu}" aria-label="${text.common.openMenu}">${icons.menu}</button>
          </div>
        </div>
      </header>
      <div class="mobile-scrim" id="mobileScrim"></div>
      <aside class="mobile-panel" id="mobilePanel" aria-label="Mobile navigation">
        <div class="mobile-panel-head">
          <a class="brand" href="${routeHref("home")}" aria-label="Arotec home">
            <img class="brand-logo" src="${asset("arotec-logo.jpg")}" alt="Arotec">
          </a>
          <button class="circle-button" id="menuClose" type="button" title="${text.common.closeMenu}" aria-label="${text.common.closeMenu}">${icons.close}</button>
        </div>
        <nav class="mobile-nav" aria-label="Mobile primary navigation">
          <a class="nav-link${activeClass("home")}" href="${routeHref("home")}">${text.nav.home}</a>
          ${navLinks(text)}
          <a class="nav-link${activeClass("contact")}" href="${routeHref("contact")}">${text.nav.contact}</a>
        </nav>
        <div class="mobile-language" aria-label="Language">${chips}</div>
        <a class="pill-button" href="${routeHref("contact")}">${text.nav.contact}</a>
      </aside>
    `;
  }

  function renderHome(text, lang) {
    const home = text.home;
    const platform = sciencePlatform[lang] || sciencePlatform.en;
    const heroSlides = ["hero-slide-1.jpg", "hero-slide-2.jpg", "hero-slide-3.jpg"];
    const heroSlideLayers = heroSlides
      .map((image, index) => `<span class="hero-slide${index === 0 ? " is-active" : ""}" style="background-image:url('${asset(image)}')" aria-hidden="true"></span>`)
      .join("");
    const heroDots = heroSlides
      .map((_, index) => `<button class="${index === 0 ? "is-active" : ""}" data-hero-dot="${index}" type="button" aria-label="${text.common.slide || "Slide"} ${index + 1}"></button>`)
      .join("");
    const homePageSections = routes
      .filter((route) => route.nav)
      .map((route, index) => renderHomePageSection(text, route.id, index))
      .join("");

    const conceptItems = platform.items.map((item) => `
      <article class="concept-item" style="--concept-card-image:url('${asset(item.image)}')">
        <h3>${item.title}</h3>
      </article>
    `).join("");

    const researchCards = home.research.cards.map((card, index) => `
      <article class="science-card">
        <div class="science-image" style="background-image:url('${asset(card.image)}')"></div>
        <div class="science-body">
          <h3>${card.title}</h3>
          <p><strong>${card.subtitle}</strong></p>
          <p>${card.text}</p>
          <a class="inline-link" href="${routeHref("applied")}">${text.common.explore} ${index + 1} ${icons.arrow}</a>
        </div>
      </article>
    `).join("");

    return `
      <main id="main">
        <section class="hero hero-slideshow">
          <div class="hero-slides" aria-hidden="true">${heroSlideLayers}</div>
          <div class="section-shell">
            <div class="hero-content">
              <p class="eyebrow">${home.hero.eyebrow}</p>
              <h1 class="hero-title">${home.hero.title}</h1>
              <h2 class="lead">${home.hero.lead}</h2>
              <div class="button-row">
                <a class="ghost-button" href="${routeHref("insights")}">${home.hero.primary} ${icons.arrow}</a>
                <a class="pill-button" href="${routeHref("customized")}">${home.hero.secondary} ${icons.arrow}</a>
              </div>
              <div class="slider-dots" aria-label="${text.common.slideControls || "Hero slides"}">${heroDots}</div>
            </div>
          </div>
          <div class="hero-tags" aria-label="Research themes">
            ${home.hero.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="hero-slide-controls" aria-label="${text.common.slideControls || "Hero slides"}">
            <button class="hero-slide-button" data-hero-control="prev" type="button" title="${text.common.previousSlide || "Previous slide"}" aria-label="${text.common.previousSlide || "Previous slide"}">${icons.arrowLeft}</button>
            <button class="hero-slide-button" data-hero-control="next" type="button" title="${text.common.nextSlide || "Next slide"}" aria-label="${text.common.nextSlide || "Next slide"}">${icons.arrow}</button>
          </div>
        </section>

        <section class="concept section-pad" style="--concept-image:none">
          <div class="section-shell">
            <div class="center-head">
              <h2>${platform.title}</h2>
              <p class="lead">${platform.lead}</p>
            </div>
            <div class="concept-grid">${conceptItems}</div>
          </div>
        </section>

        <section class="dark-band section-pad">
          <div class="section-shell">
            <div class="center-head">
              <h2>${home.research.title}</h2>
              <p class="lead">${home.research.lead}</p>
            </div>
            <div class="research-grid">${researchCards}</div>
          </div>
        </section>

        <section class="split-showcase">
          ${renderShowcasePanel(home.applied, "applied", "solutions-neuron.jpg", false)}
          ${renderShowcasePanel(home.products, "products", "products-lab.jpg", true)}
        </section>

        <section class="personalized-band section-pad" style="--profile-image:url('${asset("personalized-profile.jpg")}')">
          <div class="section-shell cta-row">
            <div>
              <h2>${home.personal.title}</h2>
              <p class="lead">${home.personal.lead}</p>
              <div class="journey">
                ${home.personal.steps.map((step, index) => `
                  <div class="journey-step">
                    <span class="orb-icon" aria-hidden="true">${icons[index === 1 ? "brain" : index === 2 ? "bottle" : "chart"]}</span>
                    <p>${step}</p>
                  </div>
                  ${index < home.personal.steps.length - 1 ? '<span class="journey-line" aria-hidden="true"></span>' : ""}
                `).join("")}
              </div>
            </div>
            <a class="pill-button" href="${routeHref("customized")}">${home.personal.button} ${icons.arrow}</a>
          </div>
        </section>

        ${homePageSections}
      </main>
    `;
  }

  function renderHomePageSection(text, id, index) {
    const page = text.pages[id] || copy.en.pages[id];
    const sectionClass = index % 2 === 0 ? "light-section" : "dark-band";
    const cards = page.cards.map((card) => `
      <article class="content-card">
        <span class="orb-icon" aria-hidden="true">${icons.atom}</span>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
        <a class="inline-link" href="${routeHref("contact")}">${text.common.learnMore} ${icons.arrow}</a>
      </article>
    `).join("");

    return `
      <section class="home-page-section ${sectionClass} section-pad" id="${id}">
        <div class="section-shell">
          <div class="home-section-head">
            <div>
              <p class="eyebrow">${page.eyebrow}</p>
              <h2>${page.title}</h2>
              <p class="lead">${page.lead}</p>
            </div>
            <div class="stat-row">
              ${page.stats.map((stat) => `
                <div class="stat-card">
                  <strong>${stat.value}</strong>
                  <span>${stat.label}</span>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="center-head">
            <h2>${page.cardsTitle}</h2>
            <p class="lead">${page.cardsLead}</p>
          </div>
          <div class="card-grid">${cards}</div>

          <div class="home-section-feature">
            <div class="feature-panel">
              <p class="eyebrow">${page.eyebrow}</p>
              <h2>${page.featureTitle}</h2>
              <p>${page.featureText}</p>
            </div>
            <div class="timeline">
              ${page.steps.map((step, stepIndex) => `
                <article class="timeline-item">
                  <span class="timeline-index">${String(stepIndex + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>${step}</h3>
                    <p>${page.ctaText}</p>
                  </div>
                </article>
              `).join("")}
            </div>
          </div>

          <div class="home-section-cta">
            <div>
              <h2>${page.ctaTitle}</h2>
              <p class="lead">${page.ctaText}</p>
            </div>
            <a class="pill-button" href="${routeHref("contact")}">${text.nav.contact} ${icons.arrow}</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderShowcasePanel(section, routeId, image, isProducts) {
    return `
      <article class="showcase-panel${isProducts ? " products" : ""}" style="--panel-image:url('${asset(image)}')">
        <div>
          <h2>${section.title}</h2>
          <p class="lead">${section.lead}</p>
          <ul class="check-list">
            ${section.items.map((item) => `<li><span class="tiny-icon" aria-hidden="true">${icons.leaf}</span>${item}</li>`).join("")}
          </ul>
          <a class="pill-button" href="${routeHref(routeId)}">${section.button} ${icons.arrow}</a>
        </div>
      </article>
    `;
  }

  function renderGenericPage(text, id) {
    const page = text.pages[id] || copy.en.pages[id];
    const useImageHero = id === "customized";
    const cards = page.cards.map((card) => `
      <article class="content-card">
        <span class="orb-icon" aria-hidden="true">${icons.atom}</span>
        <h3>${card.title}</h3>
        <p>${card.text}</p>
        <a class="inline-link" href="${routeHref("contact")}">${text.common.learnMore} ${icons.arrow}</a>
      </article>
    `).join("");

    return `
      <main id="main">
        <section class="page-hero${useImageHero ? " page-hero-image" : ""}"${useImageHero ? ` style="--page-hero-image:url('${asset(page.image)}')"` : ""}>
          <div class="section-shell page-hero-grid${useImageHero ? " page-hero-grid-wide" : ""}">
            <div>
              <p class="eyebrow">${page.eyebrow}</p>
              <h1>${page.title}</h1>
              <p class="lead">${page.lead}</p>
              <div class="stat-row">
                ${page.stats.map((stat) => `
                  <div class="stat-card">
                    <strong>${stat.value}</strong>
                    <span>${stat.label}</span>
                  </div>
                `).join("")}
              </div>
            </div>
            ${useImageHero ? "" : `<div class="page-media" style="--page-image:url('${asset(page.image)}')" role="img" aria-label="${page.title}"></div>`}
          </div>
        </section>

        <section class="light-section section-pad">
          <div class="section-shell">
            <div class="center-head">
              <h2>${page.cardsTitle}</h2>
              <p class="lead">${page.cardsLead}</p>
            </div>
            <div class="card-grid">${cards}</div>
          </div>
        </section>

        <section class="dark-band section-pad">
          <div class="section-shell two-column">
            <div class="feature-panel">
              <p class="eyebrow">${page.eyebrow}</p>
              <h2>${page.featureTitle}</h2>
              <p>${page.featureText}</p>
              <a class="pill-button" href="${routeHref("contact")}">${text.nav.contact} ${icons.arrow}</a>
            </div>
            <div class="timeline">
              ${page.steps.map((step, index) => `
                <article class="timeline-item">
                  <span class="timeline-index">${String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>${step}</h3>
                    <p>${page.ctaText}</p>
                  </div>
                </article>
              `).join("")}
            </div>
          </div>
        </section>

        <section class="concept section-pad" style="--concept-image:url('${asset("core-texture.jpg")}')">
          <div class="section-shell cta-row">
            <div>
              <h2>${page.ctaTitle}</h2>
              <p class="lead">${page.ctaText}</p>
            </div>
            <a class="dark-button" href="${routeHref("contact")}">${text.nav.contact} ${icons.arrow}</a>
          </div>
        </section>
      </main>
    `;
  }

  function renderContact(text) {
    const contact = text.contact;
    return `
      <main id="main">
        <section class="page-hero">
          <div class="section-shell">
            <p class="eyebrow">${contact.eyebrow}</p>
            <h1>${contact.title}</h1>
            <p class="lead">${contact.lead}</p>
          </div>
        </section>
        <section class="dark-band section-pad">
          <div class="section-shell contact-grid">
            <aside class="contact-card">
              <h2>${contact.eyebrow}</h2>
              <p class="lead">${contact.lead}</p>
              <div class="contact-methods">
                ${contact.methods.map((method, index) => `
                  <div class="contact-method">
                    <span class="orb-icon" aria-hidden="true">${icons[index === 0 ? "mail" : index === 1 ? "phone" : "pin"]}</span>
                    <div>
                      <span>${method.label}</span>
                      <strong>${method.value}</strong>
                    </div>
                  </div>
                `).join("")}
              </div>
              <h3>${contact.faqTitle}</h3>
              <ul class="check-list">
                ${contact.faq.map((item) => `<li><span class="tiny-icon" aria-hidden="true">${icons.arrow}</span>${item}</li>`).join("")}
              </ul>
            </aside>
            <form class="form-card" id="contactForm">
              <div class="form-grid">
                <div class="field">
                  <label for="name">${contact.form.name}</label>
                  <input id="name" name="name" autocomplete="name" required>
                </div>
                <div class="field">
                  <label for="email">${contact.form.email}</label>
                  <input id="email" name="email" type="email" autocomplete="email" required>
                </div>
                <div class="field full">
                  <label for="topic">${contact.form.topic}</label>
                  <select id="topic" name="topic">
                    ${contact.form.topicOptions.map((option) => `<option>${option}</option>`).join("")}
                  </select>
                </div>
                <div class="field full">
                  <label for="message">${contact.form.message}</label>
                  <textarea id="message" name="message" required></textarea>
                </div>
              </div>
              <button class="pill-button" type="submit">${text.common.submit} ${icons.arrow}</button>
              <p class="form-status" id="formStatus" role="status"></p>
            </form>
          </div>
        </section>
      </main>
    `;
  }

  function renderFooter(text) {
    return `
      <footer class="site-footer">
        <div class="section-shell">
          <div class="footer-grid">
            <div class="footer-col">
              <a class="brand footer-brand" href="${routeHref("home")}" aria-label="Arotec home">
                <img class="brand-logo" src="${asset("arotec-logo.jpg")}" alt="Arotec">
              </a>
            </div>
            <div class="footer-col">
              <h3>${text.footer.insights}</h3>
              <a href="${routeHref("insights")}">${text.footer.articles}</a>
              <a href="${routeHref("insights")}">${text.footer.research}</a>
              <a href="${routeHref("insights")}">${text.footer.scienceLife}</a>
              <a href="${routeHref("insights")}">${text.footer.events}</a>
            </div>
            <div class="footer-col">
              <h3>${text.footer.about}</h3>
              <a href="${routeHref("about")}">${text.nav.about}</a>
              <a href="${routeHref("about")}">${text.footer.team}</a>
              <a href="${routeHref("about")}">${text.footer.careers}</a>
              <a href="${routeHref("about")}">${text.footer.sustainability}</a>
            </div>
            <div class="footer-col">
              <h3>${text.footer.contact}</h3>
              <a href="${routeHref("contact")}">${text.nav.contact}</a>
              <a href="${routeHref("contact")}">${text.footer.partner}</a>
              <a href="${routeHref("contact")}">${text.footer.faq}</a>
            </div>
            <div class="footer-col">
              <h3>${text.footer.informed}</h3>
              <p>${text.footer.informedText}</p>
              <form class="newsletter" id="newsletterForm">
                <input type="email" placeholder="${text.common.emailPlaceholder}" aria-label="${text.common.emailPlaceholder}" required>
                <button class="circle-button" type="submit" title="${text.common.subscribe}" aria-label="${text.common.subscribe}">${icons.arrow}</button>
              </form>
              <div class="social-row" aria-label="Social links">
                <a class="circle-button" href="#" aria-label="Instagram">IG</a>
                <a class="circle-button" href="#" aria-label="Facebook">f</a>
                <a class="circle-button" href="#" aria-label="LinkedIn">in</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <span>${text.footer.copyright}</span>
            <span class="legal-links">
              <a href="${routeHref("contact")}">${text.footer.privacy}</a>
              <a href="${routeHref("contact")}">${text.footer.terms}</a>
            </span>
          </div>
        </div>
      </footer>
    `;
  }

  function renderSearch(text) {
    return `
      <div class="search-modal" id="searchModal" aria-label="${text.common.search}" role="dialog" aria-modal="true">
        <div class="search-card">
          <div class="search-head">
            <h2>${text.common.search}</h2>
            <button class="circle-button" id="searchClose" type="button" title="${text.common.closeSearch}" aria-label="${text.common.closeSearch}">${icons.close}</button>
          </div>
          <input class="search-input" id="searchInput" type="search" placeholder="${text.common.searchPlaceholder}" autocomplete="off">
          <div class="search-results" id="searchResults"></div>
        </div>
      </div>
    `;
  }

  function searchItems(text) {
    return routes.map((route) => {
      const page = route.id === "home" ? text.home.hero : (text.pages[route.id] || copy.en.pages[route.id] || text.contact);
      return {
        id: route.id,
        title: text.nav[route.id] || page.eyebrow,
        excerpt: page.lead || page.title,
        href: routeHref(route.id)
      };
    });
  }

  function renderSearchResults(text, query = "") {
    const results = document.getElementById("searchResults");
    if (!results) return;
    const normalized = query.trim().toLowerCase();
    const items = searchItems(text).filter((item) => {
      if (!normalized) return true;
      return `${item.title} ${item.excerpt}`.toLowerCase().includes(normalized);
    });
    results.innerHTML = items.length
      ? items.map((item) => `
        <a class="search-result" href="${item.href}">
          <strong>${item.title}</strong>
          <span>${item.excerpt}</span>
        </a>
      `).join("")
      : `<p>${text.common.searchEmpty}</p>`;
  }

  function setupHeroSlideshow() {
    if (heroSlideTimer) {
      window.clearInterval(heroSlideTimer);
      heroSlideTimer = null;
    }

    const slides = Array.from(document.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll("[data-hero-dot]"));
    const controls = Array.from(document.querySelectorAll("[data-hero-control]"));
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (slides.length <= 1) return;

    let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    const showSlide = (next) => {
      next = (next + slides.length) % slides.length;
      if (next === current) return;
      slides[current]?.classList.remove("is-active");
      dots[current]?.classList.remove("is-active");
      current = next;
      slides[current]?.classList.add("is-active");
      dots[current]?.classList.add("is-active");
    };

    const startTimer = () => {
      if (reduceMotion) return;
      heroSlideTimer = window.setInterval(() => showSlide(current + 1), 15000);
    };

    const restartTimer = () => {
      if (heroSlideTimer) window.clearInterval(heroSlideTimer);
      heroSlideTimer = null;
      startTimer();
    };

    controls.forEach((button) => {
      button.addEventListener("click", () => {
        showSlide(button.dataset.heroControl === "prev" ? current - 1 : current + 1);
        restartTimer();
      });
    });

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        showSlide(Number(dot.dataset.heroDot));
        restartTimer();
      });
    });

    startTimer();
  }

  function renderPage(text, lang) {
    if (pageId === "home") return renderHome(text, lang);
    if (pageId === "contact") return renderContact(text);
    return renderGenericPage(text, pageId);
  }

  function setLanguage(lang) {
    localStorage.setItem("as-site-language", lang);
    render(lang);
  }

  function wireEvents(text, lang) {
    document.getElementById("languageSelect")?.addEventListener("change", (event) => setLanguage(event.target.value));
    document.querySelectorAll("[data-lang-chip]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.langChip));
    });

    const openMenu = () => body.classList.add("menu-open");
    const closeMenu = () => body.classList.remove("menu-open");
    document.getElementById("menuToggle")?.addEventListener("click", openMenu);
    document.getElementById("menuClose")?.addEventListener("click", closeMenu);
    document.getElementById("mobileScrim")?.addEventListener("click", closeMenu);
    document.querySelectorAll(".mobile-nav .nav-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    const openSearch = () => {
      body.classList.add("search-open");
      renderSearchResults(text);
      setTimeout(() => document.getElementById("searchInput")?.focus(), 0);
    };
    const closeSearch = () => body.classList.remove("search-open");
    document.getElementById("searchButton")?.addEventListener("click", openSearch);
    document.getElementById("searchClose")?.addEventListener("click", closeSearch);
    document.getElementById("searchInput")?.addEventListener("input", (event) => renderSearchResults(text, event.target.value));
    document.getElementById("searchModal")?.addEventListener("click", (event) => {
      if (event.target.id === "searchModal") closeSearch();
    });

    document.getElementById("contactForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      document.getElementById("formStatus").textContent = text.contact.form.success;
      event.currentTarget.reset();
    });

    document.getElementById("newsletterForm")?.addEventListener("submit", (event) => {
      event.preventDefault();
      event.currentTarget.reset();
    });

    document.onkeydown = (event) => {
      if (event.key === "Escape") {
        closeMenu();
        closeSearch();
      }
    };
  }

  function scrollToCurrentHash() {
    if (pageId !== "home" || !window.location.hash) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (!target) return;
    window.requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }

  function render(lang) {
    const text = copy[lang] || copy.th;
    document.documentElement.lang = languageMeta[lang]?.htmlLang || "th";
    document.title = `${text.nav[pageId] || text.brand.title} | Arotec ${text.brand.subtitle}`;
    shell.innerHTML = `${renderHeader(text, lang)}${renderPage(text, lang)}${renderFooter(text)}${renderSearch(text)}`;
    wireEvents(text, lang);
    setupHeroSlideshow();
    scrollToCurrentHash();
  }

  function loadNotoFonts() {
    if (document.getElementById("noto-fonts")) return;
    const inject = () => {
      if (document.getElementById("noto-fonts")) return;
      const link = document.createElement("link");
      link.id = "noto-fonts";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;600;700;800&family=Noto+Sans+TC:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap";
      document.head.appendChild(link);
    };

    if (document.readyState === "complete") {
      inject();
      return;
    }

    window.addEventListener("load", () => setTimeout(inject, 0), { once: true });
  }

  loadNotoFonts();
  const savedLanguage = localStorage.getItem("as-site-language");
  render(languageMeta[savedLanguage] ? savedLanguage : "th");
})();
