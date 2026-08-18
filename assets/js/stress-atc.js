(() => {
  const iconBase = "../assets/";
  const iconAssets = Object.freeze({
    brain: "homeostasis/icons/outcome-brain-health.png",
    bolt: "homeostasis/icons/domain-stress-pathway.png",
    cycle: "stress-atc/icons/stress-cycle-v1.png",
    gauge: "stress-atc/icons/recovery-gauge-v1.png",
    balance: "homeostasis/icons/core-homeostasis.png",
    neuron: "homeostasis/icons/domain-neuroplasticity.png",
    heart: "homeostasis/icons/system-autonomic.png",
    mito: "homeostasis/icons/system-metabolic.png",
    cloud: "homeostasis/icons/load-chronic-stress.png",
    leaf: "homeostasis/icons/mod-adaptogens.png",
    head: "homeostasis/icons/outcome-accelerated-aging.png",
    moon: "homeostasis/icons/mod-sleep.png",
    amyloid: "homeostasis/icons/outcome-neuroinflammation.png",
    tau: "homeostasis/icons/load-aging-epigenetic.png",
    synapse: "stress-atc/icons/synaptic-dysfunction-v1.png",
    chart: "stress-atc/icons/allostatic-load-chart-v1.png",
    shield: "homeostasis/icons/system-immune.png",
    network: "homeostasis/icons/system-neuroendocrine.png"
  });

  const semanticIconAssets = Object.freeze([
    { src: "stress-atc/icons/semantic-v2/p01-acute-stress-response-v2.png", label: "Acute stress response" },
    { src: "stress-atc/icons/semantic-v2/p02-repeated-prolonged-exposure-v2.png", label: "Repeated / prolonged exposure" },
    { src: "stress-atc/icons/semantic-v2/p03-incomplete-recovery-v2.png", label: "Incomplete recovery" },
    { src: "stress-atc/icons/semantic-v2/p04-repeated-reactivation-v2.png", label: "Repeated reactivation" },
    { src: "stress-atc/icons/semantic-v2/p05-accumulating-allostatic-load-v2.png", label: "Accumulating allostatic load" },
    { src: "stress-atc/icons/semantic-v2/p06-chronic-stress-response-v2.png", label: "Chronic stress response" },
    { src: "stress-atc/icons/semantic-v2/p07-effective-recovery-v2.png", label: "Effective recovery" },
    { src: "stress-atc/icons/semantic-v2/p08-hpa-axis-v2.png", label: "HPA axis" },
    { src: "stress-atc/icons/semantic-v2/p09-sam-ans-v2.png", label: "SAM–ANS" },
    { src: "stress-atc/icons/semantic-v2/p10-central-neuromodulatory-networks-v2.png", label: "Central neuromodulatory networks" },
    { src: "stress-atc/icons/semantic-v2/p11-maladaptive-trajectory-v2.png", label: "Maladaptive trajectory" },
    { src: "stress-atc/icons/semantic-v2/p12-balance-shifts-v2.png", label: "Balance shifts" },
    { src: "stress-atc/icons/semantic-v2/p13-physiological-pathway-v2.png", label: "Physiological pathway" },
    { src: "stress-atc/icons/semantic-v2/p14-feedback-loops-v2.png", label: "Feedback loops" },
    { src: "stress-atc/icons/semantic-v2/p15-neural-psychological-pathway-v2.png", label: "Neural / psychological pathway" },
    { src: "stress-atc/icons/semantic-v2/p16-mental-neuropsychiatric-outcomes-v2.png", label: "Mental & neuropsychiatric outcomes" },
    { src: "stress-atc/icons/semantic-v2/p17-systemic-disease-outcomes-v2.png", label: "Systemic disease outcomes" },
    { src: "stress-atc/icons/semantic-v2/p18-acute-stress-response-v2.png", label: "Acute stress response" },
    { src: "stress-atc/icons/semantic-v2/p19-recovery-homeostasis-v2.png", label: "Recovery & homeostasis" },
    { src: "stress-atc/icons/semantic-v2/p20-stress-recurrence-incomplete-recovery-v2.png", label: "Stress recurrence / incomplete recovery" },
    { src: "stress-atc/icons/semantic-v2/p21-allostatic-load-accumulation-v2.png", label: "Allostatic load accumulation" },
    { src: "stress-atc/icons/semantic-v2/p22-maladaptive-allostasis-v2.png", label: "Maladaptive allostasis" },
    { src: "stress-atc/icons/semantic-v2/p23-chronic-stress-persistent-dysregulation-v2.png", label: "Chronic stress: persistent dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p24-hpa-axis-cortisol-dysregulation-v2.png", label: "HPA axis & cortisol dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p25-ans-overactivation-v2.png", label: "ANS overactivation" },
    { src: "stress-atc/icons/semantic-v2/p26-neurotransmitter-dysregulation-v2.png", label: "Neurotransmitter dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p27-neuroinflammation-impaired-neuroplasticity-v2.png", label: "Neuroinflammation & impaired neuroplasticity" },
    { src: "stress-atc/icons/semantic-v2/p28-oxidative-metabolic-dysfunction-v2.png", label: "Oxidative & metabolic dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p29-mood-anxiety-v2.png", label: "Mood / Anxiety" },
    { src: "stress-atc/icons/semantic-v2/p30-ptsd-stress-disorders-v2.png", label: "PTSD / Stress Disorders" },
    { src: "stress-atc/icons/semantic-v2/p31-sleep-disorders-v2.png", label: "Sleep Disorders" },
    { src: "stress-atc/icons/semantic-v2/p32-substance-use-disorders-v2.png", label: "Substance-Use Disorders" },
    { src: "stress-atc/icons/semantic-v2/p33-cardiovascular-disease-v2.png", label: "Cardiovascular Disease" },
    { src: "stress-atc/icons/semantic-v2/p34-metabolic-dysfunction-v2.png", label: "Metabolic Dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p35-immune-inflammatory-dysregulation-v2.png", label: "Immune / Inflammatory Dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p36-cognitive-decline-risk-factors-v2.png", label: "Cognitive Decline Risk Factors" },
    { src: "stress-atc/icons/semantic-v2/p37-pathological-loops-self-amplifying-v2.png", label: "Pathological loops — self-amplifying" },
    { src: "stress-atc/icons/semantic-v2/p38-amyloid-accumulation-v2.png", label: "Amyloid-β accumulation" },
    { src: "stress-atc/icons/semantic-v2/p39-tau-pathology-v2.png", label: "Tau pathology" },
    { src: "stress-atc/icons/semantic-v2/p40-microglial-dysregulation-v2.png", label: "Microglial dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p41-synaptic-dysfunction-v2.png", label: "Synaptic dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p42-mitochondrial-dysfunction-v2.png", label: "Mitochondrial dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p43-neurodegeneration-v2.png", label: "Neurodegeneration" },
    { src: "stress-atc/icons/semantic-v2/p44-dementia-alzheimer-s-v2.png", label: "Dementia / Alzheimer's" },
    { src: "stress-atc/icons/semantic-v2/p45-stressors-v2.png", label: "Stressors" },
    { src: "stress-atc/icons/semantic-v2/p46-activation-v2.png", label: "Activation" },
    { src: "stress-atc/icons/semantic-v2/p47-recovery-v2.png", label: "Recovery" },
    { src: "stress-atc/icons/semantic-v2/p48-repeated-stress-v2.png", label: "Repeated stress" },
    { src: "stress-atc/icons/semantic-v2/p49-dysregulation-v2.png", label: "Dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p50-allostatic-load-v2.png", label: "Allostatic load" },
    { src: "stress-atc/icons/semantic-v2/p51-hpa-axis-cortisol-dysregulation-v2.png", label: "HPA axis & cortisol dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p52-neurotransmitter-dysregulation-v2.png", label: "Neurotransmitter dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p53-neuroinflammation-v2.png", label: "Neuroinflammation" },
    { src: "stress-atc/icons/semantic-v2/p54-neuroplasticity-circadian-dysfunction-v2.png", label: "Neuroplasticity / circadian dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p55-depression-v2.png", label: "Depression" },
    { src: "stress-atc/icons/semantic-v2/p56-anxiety-disorders-v2.png", label: "Anxiety disorders" },
    { src: "stress-atc/icons/semantic-v2/p57-ptsd-stress-related-disorders-v2.png", label: "PTSD / stress-related disorders" },
    { src: "stress-atc/icons/semantic-v2/p58-sleep-disorders-v2.png", label: "Sleep disorders" },
    { src: "stress-atc/icons/semantic-v2/p59-substance-use-vulnerability-v2.png", label: "Substance-use vulnerability" },
    { src: "stress-atc/icons/semantic-v2/p60-cognitive-vulnerability-v2.png", label: "Cognitive vulnerability" },
    { src: "stress-atc/icons/semantic-v2/p61-subjective-cognitive-decline-v2.png", label: "Subjective cognitive decline" },
    { src: "stress-atc/icons/semantic-v2/p62-mild-cognitive-impairment-v2.png", label: "Mild cognitive impairment" },
    { src: "stress-atc/icons/semantic-v2/p63-increased-dementia-risk-v2.png", label: "Increased dementia risk" },
    { src: "stress-atc/icons/semantic-v2/p64-amyloid-accumulation-v2.png", label: "Amyloid accumulation" },
    { src: "stress-atc/icons/semantic-v2/p65-tau-pathology-v2.png", label: "Tau pathology" },
    { src: "stress-atc/icons/semantic-v2/p66-microglial-dysregulation-v2.png", label: "Microglial dysregulation" },
    { src: "stress-atc/icons/semantic-v2/p67-synaptic-dysfunction-v2.png", label: "Synaptic dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p68-mitochondrial-dysfunction-v2.png", label: "Mitochondrial dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p69-neurodegeneration-v2.png", label: "Neurodegeneration" },
    { src: "stress-atc/icons/semantic-v2/p70-memory-impairment-v2.png", label: "Memory impairment" },
    { src: "stress-atc/icons/semantic-v2/p71-executive-dysfunction-v2.png", label: "Executive dysfunction" },
    { src: "stress-atc/icons/semantic-v2/p72-language-problems-v2.png", label: "Language problems" },
    { src: "stress-atc/icons/semantic-v2/p73-disorientation-v2.png", label: "Disorientation" },
    { src: "stress-atc/icons/semantic-v2/p74-behavioral-psychological-symptoms-v2.png", label: "Behavioral & psychological symptoms" },
    { src: "stress-atc/icons/semantic-v2/p75-loss-of-daily-function-v2.png", label: "Loss of daily function" },
    { src: "stress-atc/icons/semantic-v2/p76-preclinical-stage-v2.png", label: "Preclinical stage" },
    { src: "stress-atc/icons/semantic-v2/p77-mild-dementia-v2.png", label: "Mild dementia" },
    { src: "stress-atc/icons/semantic-v2/p78-moderate-dementia-v2.png", label: "Moderate dementia" },
    { src: "stress-atc/icons/semantic-v2/p79-severe-dementia-v2.png", label: "Severe dementia" }
  ]);
  const icon = (name, className = "") => `<img class="medical-raster-icon ${className}" src="${iconBase}${iconAssets[name] || iconAssets.brain}" alt="" aria-hidden="true" loading="lazy" decoding="async">`;
  document.querySelectorAll("svg use[href^='#i-']").forEach((use) => {
    const svg = use.closest("svg");
    const name = (use.getAttribute("href") || "").replace("#i-", "");
    if (!svg || !iconAssets[name]) return;
    const image = document.createElement("img");
    image.className = `medical-raster-icon ${svg.getAttribute("class") || ""}`.trim();
    image.src = `${iconBase}${iconAssets[name]}`;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.setAttribute("aria-hidden", "true");
    svg.replaceWith(image);
  });
  const arrow = (tone = "") => `<svg class="flow-arrow ${tone}" viewBox="0 0 26 18" aria-hidden="true"><path d="M2 9h21M18 4l5 5-5 5"></path><circle cx="2" cy="9" r="2"></circle></svg>`;
  const listMarkup = (items) => items.map((item) => `<li>${item}</li>`).join("");
  const setList = (id, items) => {
    const node = document.getElementById(id);
    if (node) node.innerHTML = listMarkup(items);
  };

  const data = {
    transition: [
      { title: "Acute stress response", detail: "Rapid • Transient • Adaptive", icon: "bolt", tone: "green", major: true },
      { title: "Repeated / prolonged exposure", detail: "Stress recurs before full reset", icon: "cycle", tone: "cyan" },
      { title: "Incomplete recovery", detail: "Homeostasis is not fully restored", icon: "gauge", tone: "amber" },
      { title: "Repeated reactivation", detail: "Stress systems cycle on again", icon: "heart", tone: "orange" },
      { title: "Accumulating allostatic load", detail: "Regulatory burden builds", icon: "balance", tone: "orange" },
      { title: "Chronic stress response", detail: "Persistent • Dysregulated • Maladaptive", icon: "cloud", tone: "red", major: true }
    ],
    coreSystems: [
      { key: "hpa", title: "HPA axis", detail: "Endocrine", icon: "brain", tooltip: "Coordinates hypothalamic, pituitary and adrenal hormone signaling." },
      { key: "ans", title: "SAM–ANS", detail: "Autonomic", icon: "bolt", tooltip: "Mobilizes sympathetic arousal and cardiovascular readiness." },
      { key: "neural", title: "Central neuromodulatory networks", detail: "Brain", icon: "network", tooltip: "Shapes attention, threat detection, memory and affect." }
    ],
    lists: {
      "acute-hormonal": ["Cortisol ↑ (transient)", "Epinephrine ↑", "Norepinephrine ↑", "Glucagon ↑", "β-Endorphin ↑", "Insulin activity altered", "GH / prolactin context-dependent"],
      "acute-neural": ["Norepinephrine ↑", "Dopamine ↑", "Glutamate ↑ (transient)", "GABA adaptive modulation", "Serotonin rapid modulation", "Endocannabinoids ↑ (adaptive)", "Neuropeptide Y ↑ (mobilization)"],
      "chronic-hormonal": ["Cortisol ↑ / ↓ / dysregulated", "Flattened diurnal rhythm", "Glucocorticoid resistance", "Persistent catecholamine load", "HPT-axis dysregulation", "HPG-axis suppression / dysregulation", "GH / IGF-1 dysregulation", "Insulin / leptin / ghrelin dysregulation", "Melatonin disruption", "Oxytocin signaling alteration"],
      "chronic-neural": ["Serotonin dysregulation", "Dopamine dysregulation", "Persistent noradrenergic activation", "Glutamate–GABA imbalance", "Substance P ↑", "Neuropeptide Y dysregulation", "Endocannabinoid impairment", "Orexin-related hyperarousal", "BDNF ↓ / impaired neuroplasticity"],
      "phys-acute": ["Energy mobilization", "Glucose availability ↑", "Heart rate & blood pressure ↑", "Respiratory activation", "Immune-cell redistribution", "Analgesia / pain tolerance", "Temporary metabolic activation"],
      "phys-chronic": ["HPA-axis dysregulation", "Sympathetic dominance", "Parasympathetic withdrawal", "Reduced HRV", "Chronic inflammation", "Glucocorticoid resistance", "Insulin resistance", "Mitochondrial dysfunction", "Circadian disruption", "Gut & barrier dysfunction"],
      "psych-acute": ["Alertness ↑", "Vigilance ↑", "Attention & focus ↑", "Threat detection ↑", "Memory encoding modulation", "Rapid decision-making", "Temporary anxiety or arousal"],
      "psych-chronic": ["Persistent hyperarousal", "Amygdala hyperreactivity", "Threat bias", "Reduced prefrontal regulation", "Hippocampal remodeling", "Glutamate–GABA imbalance", "Reduced BDNF & neuroplasticity", "Emotional dysregulation", "Reduced stress tolerance"],
      "mental-outcomes": ["Mood & anxiety-related disorders", "Stress-related disorders (e.g., PTSD, adjustment disorder)", "Sleep & behavioral disorders", "Cognitive dysfunction", "Other psychiatric vulnerabilities"],
      "systemic-outcomes": ["Cardiovascular diseases", "Metabolic diseases", "Immune & inflammatory diseases", "Gastrointestinal disorders", "Endocrine dysfunction", "Dermatological disorders", "Chronic pain", "Neurodegenerative risk"]
    },
    framework: [
      { title: "Acute stress response", detail: "Rapid activation • Adaptive allostasis • Goal-directed behavior", icon: "bolt", tone: "green" },
      { title: "Recovery & homeostasis", detail: "Stress offset • Physiological recovery • Return to baseline", icon: "leaf", tone: "green" },
      { title: "Stress recurrence / incomplete recovery", detail: "Repeated stress before recovery is complete", icon: "cycle", tone: "amber" },
      { title: "Allostatic load accumulation", detail: "Physiological wear • Cumulative burden • Reduced reserve", icon: "gauge", tone: "amber" },
      { title: "Maladaptive allostasis", detail: "Inefficient response • Overreactivity • System vulnerability", icon: "balance", tone: "red" },
      { title: "Chronic stress: persistent dysregulation", detail: "Persistent HPA/ANS activation • Neurobiological dysregulation • Pathological risk state", icon: "cloud", tone: "red" }
    ],
    dysregulatorySystems: [
      { key: "hpa", title: "1. HPA axis & cortisol dysregulation", icon: "brain", items: ["Impaired feedback", "Blunted diurnal rhythm", "Cortisol dysregulation"] },
      { key: "ans", title: "2. ANS (SAM–ANS) overactivation", icon: "balance", items: ["Sympathetic dominance", "Reduced parasympathetic tone", "Heart rate / BP ↑"] },
      { key: "neural", title: "3. Neurotransmitter dysregulation", icon: "synapse", items: ["NE, 5-HT, DA imbalance", "Glutamate–GABA imbalance", "Neurotransmitter system dysregulation"] },
      { key: "immune", title: "4. Neuroinflammation & impaired neuroplasticity", icon: "neuron", items: ["Chronic neuroinflammation", "Microglial activation", "Reduced BDNF & synaptic plasticity"] },
      { key: "metabolic", title: "5. Oxidative & metabolic dysfunction", icon: "mito", items: ["Oxidative stress (ROS ↑)", "Mitochondrial dysfunction", "Metabolic inflexibility"] }
    ],
    clinical: {
      mental: [
        { label: "Mood / Anxiety", icon: "brain" }, { label: "PTSD / Stress Disorders", icon: "cloud" }, { label: "Sleep Disorders", icon: "moon" }, { label: "Substance-Use Disorders", icon: "cycle" }
      ],
      disease: [
        { label: "Cardiovascular Disease", icon: "heart" }, { label: "Metabolic Dysfunction", icon: "mito" }, { label: "Immune / Inflammatory Dysregulation", icon: "shield" }, { label: "Cognitive Decline Risk Factors", icon: "head" }
      ]
    },
    cognitive: ["Cognitive vulnerability", "Subjective cognitive decline", "Mild cognitive impairment", "Increased dementia risk"],
    neuro: [
      { label: "Amyloid-β accumulation", icon: "amyloid" }, { label: "Tau pathology", icon: "tau" }, { label: "Microglial dysregulation", icon: "neuron" }, { label: "Synaptic dysfunction", icon: "synapse" }, { label: "Mitochondrial dysfunction", icon: "mito" }, { label: "Neurodegeneration", icon: "brain" }, { label: "Dementia / Alzheimer's", icon: "head" }
    ],
    mechanisms: [
      { key: "hpa", title: "1. HPA axis & cortisol dysregulation", icon: "brain", items: ["Persistent HPA activation", "Impaired glucocorticoid feedback", "Cortisol dysregulation"] },
      { key: "neural", title: "2. Neurotransmitter dysregulation", icon: "synapse", items: ["NE, 5-HT, DA imbalance", "Glutamate–GABA imbalance", "Neuromodulator dysfunction"] },
      { key: "immune", title: "3. Neuroinflammation", icon: "neuron", items: ["Chronic cytokine elevation", "Microglial activation", "BBB dysfunction"] },
      { key: "circadian", title: "4. Neuroplasticity / circadian dysfunction", icon: "moon", items: ["Reduced BDNF", "Impaired synaptic plasticity", "Sleep / circadian disruption"] }
    ],
    disorders: [
      { label: "Depression", icon: "brain" }, { label: "Anxiety disorders", icon: "gauge" }, { label: "PTSD / stress-related disorders", icon: "cloud" }, { label: "Sleep disorders", icon: "moon" }, { label: "Substance-use vulnerability", icon: "cycle" }
    ],
    pathogenesis: [
      { label: "Amyloid accumulation", icon: "amyloid" }, { label: "Tau pathology", icon: "tau" }, { label: "Microglial dysregulation", icon: "neuron" }, { label: "Synaptic dysfunction", icon: "synapse" }, { label: "Mitochondrial dysfunction", icon: "mito" }
    ],
    manifestations: [
      { label: "Memory impairment", icon: "brain" }, { label: "Executive dysfunction", icon: "network" }, { label: "Language problems", icon: "head" }, { label: "Disorientation", icon: "gauge" }, { label: "Behavioral & psychological symptoms", icon: "cloud" }, { label: "Loss of daily function", icon: "chart" }
    ],
    stages: ["Preclinical stage", "Mild dementia", "Moderate dementia", "Severe dementia"]
  };

  const renderFlow = (id, items, framework = false) => {
    const root = document.getElementById(id);
    if (!root) return;
    const transitionConnectorTones = ["green", "cyan", "cyan", "cyan", "red"];
    root.innerHTML = items.map((item, index) => {
      const major = item.major || (framework && (index === 0 || index === items.length - 1));
      const node = `<article class="flow-node status-${item.tone} ${major ? "major" : ""}" tabindex="0" data-tooltip="${item.detail || item.title}">${icon(item.icon, "flow-node__icon")}<h3>${item.title}</h3>${item.detail ? `<p>${item.detail}</p>` : ""}</article>`;
      const connectorTone = framework ? items[index + 1]?.tone : transitionConnectorTones[index];
      const connector = framework
        ? `<i data-lucide="arrow-right" class="framework-arrow ${connectorTone || ""}" aria-hidden="true"></i>`
        : arrow(connectorTone);
      return node + (index < items.length - 1 ? connector : "");
    }).join("");
  };

  const frameworkSubstep = (src, label) => `<span class="framework-substep"><img class="framework-substep-icon" src="${iconBase}${src}" alt="" aria-hidden="true" loading="lazy" decoding="async"><b>${label}</b></span>`;

  const renderFrameworkFlow = () => {
    const root = document.getElementById("framework-flow");
    if (!root) return;
    const [acute, recovery, recurrence, load, maladaptive, chronic] = data.framework;
    const detailList = (detail) => `<ul>${detail.split(" • ").map((item) => `<li>${item}</li>`).join("")}</ul>`;
    const connector = (tone, extraClass = "") => `<span class="framework-arrow-slot ${extraClass}">${extraClass ? "<b>Stress<br>offset</b>" : ""}<i data-lucide="arrow-right" class="framework-arrow ${tone}" aria-hidden="true"></i></span>`;
    root.innerHTML = `
      <article class="flow-node framework-acute-card status-green major" tabindex="0" data-tooltip="${acute.detail}">
        ${icon(acute.icon, "flow-node__icon framework-semantic-seed")}
        <h3><span>A.</span> Acute stress response <small>(Adaptive)</small></h3>
        <div class="framework-acute-substeps">
          ${frameworkSubstep("homeostasis/icons/domain-stress-pathway.png", "Rapid<br>activation")}
          <i data-lucide="arrow-right" class="framework-substep-arrow" aria-hidden="true"></i>
          ${frameworkSubstep("homeostasis/icons/core-homeostasis.png", "Adaptive<br>allostasis")}
          <i data-lucide="arrow-right" class="framework-substep-arrow" aria-hidden="true"></i>
          ${frameworkSubstep("homeostasis/icons/mod-adaptogens.png", "Goal-directed<br>behavior")}
        </div>
        <p class="framework-purpose">Purpose: Survival &amp; Performance</p>
      </article>
      ${connector("green", "stress-offset-connector")}
      <article class="flow-node framework-recovery-card status-green" tabindex="0" data-tooltip="${recovery.detail}">
        <h3><span>B.</span> Recovery &amp;<br>homeostasis</h3>
        ${icon(recovery.icon, "flow-node__icon")}
        ${detailList(recovery.detail)}
      </article>
      ${connector("green")}
      <div class="framework-recurrence-wrap">
        <p class="framework-recurrence-note">If stress is repeated,<br>prolonged, or recovery<br>is inadequate</p>
        <article class="flow-node framework-recurrence-card status-red" tabindex="0" data-tooltip="${recurrence.detail}">
          ${icon(recurrence.icon, "flow-node__icon")}
          <h3>Stress recurrence<br>or incomplete recovery</h3>
        </article>
      </div>
      ${connector("red")}
      <article class="flow-node framework-load-card status-red" tabindex="0" data-tooltip="${load.detail}">
        <h3><span>C.</span> Allostatic load<br>accumulation</h3>
        ${icon(load.icon, "flow-node__icon")}
        ${detailList(load.detail)}
      </article>
      ${connector("red")}
      <article class="flow-node framework-maladaptive-card status-red" tabindex="0" data-tooltip="${maladaptive.detail}">
        <h3><span>D.</span> Maladaptive allostasis <small>(Loss of adaptation)</small></h3>
        ${icon(maladaptive.icon, "flow-node__icon")}
        ${detailList(maladaptive.detail)}
      </article>
      ${connector("red")}
      <article class="flow-node framework-chronic-card status-red" tabindex="0" data-tooltip="${chronic.detail}">
        <h3><span>E.</span> Chronic stress:<br>persistent dysregulation</h3>
        ${icon(chronic.icon, "flow-node__icon")}
        ${detailList(chronic.detail)}
      </article>`;
  };

  const renderTransitionDiagram = () => {
    const root = document.getElementById("transition-flow");
    if (!root) return;
    const acute = data.transition[0];
    const chronic = data.transition[data.transition.length - 1];
    const stages = data.transition.slice(1, -1);
    const acuteItems = ["Short-term", "Rapid activation", "Coordinated response", "Usually reversible", "Adaptive allostasis", "Complete recovery possible", "Transient neuroendocrine changes"];
    const chronicItems = ["Persistent / repeated", "Sustained or dysregulated activation", "Impaired feedback regulation", "Incomplete recovery", "Accumulated allostatic load", "Maladaptive allostasis", "Persistent neuroendocrine dysregulation"];
    const responsePanel = (item, items, kind) => `<article class="flow-node response-panel response-${kind} status-${item.tone}" tabindex="0" data-tooltip="${item.detail}"><header>${icon(item.icon, "flow-node__icon")}<div><h3>${item.title}</h3><p>${item.detail}</p></div></header><ul>${listMarkup(items)}</ul></article>`;
    const stageMarkup = stages.map((item, index) => `<article class="transition-step status-${item.tone}" tabindex="0" data-tooltip="${item.detail}">${icon(item.icon, "flow-node__icon")}<h3>${item.title}</h3></article>${index < stages.length - 1 ? arrow(index === stages.length - 2 ? "orange" : "amber") : ""}`).join("");
    root.innerHTML = `${responsePanel(acute, acuteItems, "acute")}<div class="transition-core"><h3>From adaptive allostasis <span>to maladaptive allostasis</span></h3><div class="transition-sequence">${stageMarkup}</div></div>${responsePanel(chronic, chronicItems, "chronic")}`;
  };

  renderTransitionDiagram();
  renderFrameworkFlow();

  const core = document.getElementById("core-systems");
  core.innerHTML = data.coreSystems.map((item) => `<article class="system-card" tabindex="0" data-system="${item.key}" data-tooltip="${item.tooltip}">${icon(item.icon)}<div><h3>${item.title}</h3><p>${item.detail}</p></div></article>`).join("");

  Object.entries(data.lists).forEach(([id, items]) => setList(id, items));

  const systems = document.getElementById("dysregulatory-systems");
  systems.innerHTML = data.dysregulatorySystems.map((item) => `<article class="system-card" tabindex="0" data-system="${item.key}" data-tooltip="Highlight related ${item.title.replace(/^\d+\.\s*/, "")}">${icon(item.icon)}<h3>${item.key === "ans" ? item.title.replace(" overactivation", "<br>Overactivation") : item.title}</h3><ul>${listMarkup(item.items)}</ul></article>`).join("");

  const renderIconOutcomes = (id, items) => {
    const root = document.getElementById(id);
    root.innerHTML = items.map((item) => `<div class="icon-outcome">${icon(item.icon)}<span>${item.label}</span></div>`).join("");
  };
  renderIconOutcomes("mental-disorders", data.clinical.mental);
  renderIconOutcomes("disease-outcomes", data.clinical.disease);

  const cognitive = document.getElementById("cognitive-flow");
  const cognitiveStages = [
    { title: "Cognitive vulnerability", note: "(Increased risk)", image: "stress-atc/icons/semantic-v2/p60-cognitive-vulnerability-v2.png" },
    { title: "Subjective cognitive decline (SCD)", note: "(Not all progress)", image: "stress-atc/icons/semantic-v2/p61-subjective-cognitive-decline-v2.png" },
    { title: "Mild cognitive impairment (MCI)", note: "(Increased risk)", image: "stress-atc/icons/semantic-v2/p62-mild-cognitive-impairment-v2.png" },
    { title: "Increased dementia risk", note: "(e.g., Alzheimer's)", image: "" }
  ];
  cognitive.innerHTML = cognitiveStages.map((item, index) => `<span class="step-chip">${item.image ? `<img class="cognitive-stage-icon" src="${iconBase}${item.image}" alt="" aria-hidden="true" loading="lazy" decoding="async">` : ""}<span>${item.title}<small>${item.note}</small></span></span>${index < cognitiveStages.length - 1 ? `<i data-lucide="arrow-right" class="cognitive-arrow" aria-hidden="true"></i>` : ""}`).join("");

  const neuro = document.getElementById("neuro-flow");
  const neuroImages = [
    "stress-atc/icons/semantic-v2/p38-amyloid-accumulation-v2.png",
    "stress-atc/icons/semantic-v2/p39-tau-pathology-v2.png",
    "stress-atc/icons/semantic-v2/p40-microglial-dysregulation-v2.png",
    "stress-atc/icons/semantic-v2/p41-synaptic-dysfunction-v2.png",
    "stress-atc/icons/semantic-v2/p42-mitochondrial-dysfunction-v2.png",
    "stress-atc/icons/semantic-v2/p43-neurodegeneration-v2.png",
    "stress-atc/icons/semantic-v2/p44-dementia-alzheimer-s-v2.png"
  ];
  const neuroSeeds = data.neuro.map((item) => icon(item.icon, "neuro-semantic-seed")).join("");
  const neuroProcessChain = data.neuro.slice(0, 5).map((item, index) => `<span class="neuro-process-item"><img class="neuro-stage-icon" src="${iconBase}${neuroImages[index]}" alt="" aria-hidden="true" loading="lazy" decoding="async"><small>${item.label}</small></span>${index < 4 ? `<i data-lucide="arrow-right" class="neuro-process-arrow" aria-hidden="true"></i>` : ""}`).join("");
  neuro.innerHTML = `${neuroSeeds}<div class="neuro-process-chain">${neuroProcessChain}</div><i data-lucide="arrow-right" class="neuro-major-arrow" aria-hidden="true"></i><article class="neuro-outcome-card"><img class="neuro-stage-icon" src="${iconBase}${neuroImages[5]}" alt="" aria-hidden="true" loading="lazy" decoding="async"><div><b>Neurodegeneration</b><ul><li>Neuronal loss</li><li>Network disconnection</li><li>Brain atrophy</li></ul></div></article><i data-lucide="arrow-right" class="neuro-major-arrow" aria-hidden="true"></i><article class="neuro-outcome-card neuro-dementia-card"><img class="neuro-stage-icon" src="${iconBase}${neuroImages[6]}" alt="" aria-hidden="true" loading="lazy" decoding="async"><b>Dementia / Alzheimer's disease &amp; other dementias</b></article>`;

  const mechanisms = document.getElementById("chronic-mechanisms");
  mechanisms.innerHTML = data.mechanisms.map((item) => `<article class="mechanism-card" tabindex="0" data-system="${item.key}" data-tooltip="${item.title.replace(/^\d+\.\s*/, "")}"><h4>${item.title.replace(/^\d+\.\s*/, "")}</h4>${icon(item.icon)}<ul>${listMarkup(item.items)}</ul></article>`).join("");

  const disorderCenter = document.getElementById("disorder-center");
  disorderCenter.innerHTML = data.disorders.map((item) => `<div class="disorder-item">${icon(item.icon)}<span>${item.label}</span></div>`).join("");

  const potential = document.getElementById("potential-progression");
  const progressionNotes = ["(Increased risk)", "(Not all progress)", "(Increased risk)", ""];
  const progressionLabels = ["Cognitive vulnerability", "Subjective cognitive decline (SCD)", "Mild cognitive impairment (MCI)", "Increased dementia risk"];
  potential.innerHTML = progressionLabels.map((label, index) => `<span class="progression-stage">${icon(index === 3 ? "head" : "brain")}<span>${label}${progressionNotes[index] ? `<small>${progressionNotes[index]}</small>` : ""}</span></span>${index < progressionLabels.length - 1 ? `<i data-lucide="arrow-right" class="cognitive-connector" aria-hidden="true"></i>` : ""}`).join("");

  const pathogenesis = document.getElementById("dementia-pathogenesis");
  pathogenesis.innerHTML = data.pathogenesis.map((item, index) => `<span class="process-chip">${icon(item.icon)}<small>${item.label}</small></span>${index < data.pathogenesis.length - 1 ? `<i data-lucide="arrow-right" class="process-connector" aria-hidden="true"></i>` : ""}`).join("");

  const manifestations = document.getElementById("manifestations");
  manifestations.innerHTML = data.manifestations.map((item) => `<span class="manifestation">${icon(item.icon)}<small>${item.label}</small></span>`).join("");

  const headProgression = document.getElementById("head-progression");
  headProgression.innerHTML = data.stages.map((stage, index) => `<span class="head-stage" style="--severity:${index}">${icon("head")}<small>${stage}</small></span>${index < data.stages.length - 1 ? `<i data-lucide="arrow-right" class="dementia-progress-arrow" aria-hidden="true"></i>` : ""}`).join("");

  if (window.lucide?.createIcons) {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true", "stroke-width": "1.7" } });
    document.querySelectorAll(".branch-recovery-stem, .branch-recovery-line, .core-effects-arrow, .path-input-arrow, .path-output-arrow, .connector-up, .framework-title-arrow, .framework-exposure-arrow, .framework-recovery-arrow, .framework-summary-input, .framework-stage-connector, .framework-loop-entry, .framework-loop-entry-arrow, .section03-connector, .cognitive-connector, .process-connector, .dementia-progress-arrow").forEach((connector) => {
      connector.setAttribute("preserveAspectRatio", "none");
    });
  }

  const semanticIcons = [...document.querySelectorAll("img.medical-raster-icon")];
  semanticIcons.forEach((image, index) => {
    const asset = semanticIconAssets[index];
    if (!asset) return;
    image.src = `${iconBase}${asset.src}`;
    image.dataset.iconIndex = String(index + 1);
    image.dataset.iconLabel = asset.label;
  });

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector(".nuro-nav");
  const navLinks = [...document.querySelectorAll(".nuro-nav a")];
  if (header) {
    const setHeaderState = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -5%" });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  const anchors = [
    { element: document.getElementById("transition"), href: "#transition" },
    { element: document.getElementById("mechanisms"), href: "#mechanisms" },
    { element: document.getElementById("vulnerability"), href: "#vulnerability" },
    { element: document.getElementById("dementia"), href: "#dementia" }
  ];
  if (navLinks.length) {
    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const target = anchors.find((item) => item.element === visible.target);
      navLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === target.href));
    }, { rootMargin: "-18% 0px -64%", threshold: [0, .08, .25] });
    anchors.forEach((item) => activeObserver.observe(item.element));
  }

  const systemItems = [...document.querySelectorAll("[data-system]")];
  const clearSystemFocus = () => {
    document.querySelectorAll(".core-systems, .system-grid").forEach((group) => group.classList.remove("is-filtering"));
    systemItems.forEach((item) => item.classList.remove("is-related"));
  };
  const highlightSystem = (key) => {
    document.querySelectorAll(".core-systems, .system-grid").forEach((group) => group.classList.add("is-filtering"));
    systemItems.forEach((item) => item.classList.toggle("is-related", item.dataset.system === key));
  };
  systemItems.forEach((item) => {
    item.addEventListener("pointerenter", () => highlightSystem(item.dataset.system));
    item.addEventListener("pointerleave", clearSystemFocus);
    item.addEventListener("focus", () => highlightSystem(item.dataset.system));
    item.addEventListener("blur", clearSystemFocus);
  });

  const modal = document.querySelector("[data-modal]");
  const openModalButton = document.querySelector("[data-open-modal]");
  const closeButtons = modal.querySelectorAll("[data-close-modal], [data-modal-link]");
  let returnFocus = null;
  const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
  const openModal = () => {
    returnFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close").focus();
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (returnFocus) returnFocus.focus();
  };
  if (openModalButton) openModalButton.addEventListener("click", openModal);
  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") closeModal();
    if (event.key === "Tab") {
      const focusable = [...modal.querySelectorAll(focusableSelector)].filter((element) => !element.hasAttribute("hidden"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
