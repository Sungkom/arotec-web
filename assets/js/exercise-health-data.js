(() => {
  "use strict";

  const asset = (path) => `../assets/${path}`;

  window.exerciseHealthData = Object.freeze({
    peripheralSignalGroups: [
      {
        title: "Myokines / Exerkines",
        icon: asset("images/human-longevity-aging/icons/molecule-network-white.png"),
        items: ["IL-6", "irisin (FNDC5)", "IL-15", "FGF21", "apelin", "myonectin"],
      },
      {
        title: "Metabolites",
        icon: asset("exercise-beauty/icons/molecules.webp"),
        items: ["lactate", "ATP / ADP / AMP", "amino acids", "ketone bodies"],
      },
      {
        title: "Growth / Vascular Factors",
        icon: asset("neuroplasticity/neuron.webp"),
        items: ["IGF-1", "VEGF", "HGF"],
      },
    ],

    neuralPathways: [
      { title: "Afferent signals", text: "muscle, joint,\nmetabolic sensors" },
      { title: "CNS integration", text: "brainstem,\nhypothalamus,\nlimbic system,\ncortex" },
      { title: "Efferent output", text: "ANS, HPA axis,\nmotor system" },
    ],

    neurochemicalResponses: [
      {
        number: 1,
        title: "Monoaminergic system",
        icon: asset("neuroplasticity/neuron.webp"),
        items: ["Dopamine (DA)", "Serotonin (5-HT)", "Norepinephrine (NE)"],
      },
      {
        number: 2,
        title: "Excitatory–inhibitory balance",
        icon: asset("exercise-beauty/icons/scales.webp"),
        items: ["Improved glutamate–GABA balance"],
      },
      {
        number: 3,
        title: "Cholinergic signaling",
        icon: asset("neuroplasticity/neuron.webp"),
        items: ["Acetylcholine (ACh)"],
      },
      {
        number: 4,
        title: "Endogenous reward & analgesia",
        icon: asset("exercise-beauty/icons/molecules.webp"),
        items: ["endocannabinoids", "(AEA, 2-AG)", "β-endorphin"],
      },
      {
        number: 5,
        title: "Neurotrophic factors",
        icon: asset("neuroplasticity/neuron.webp"),
        items: ["BDNF", "IGF-1", "VEGF"],
        wide: true,
      },
    ],

    interOrganAxes: [
      {
        title: "Muscle–Brain axis",
        icons: [asset("exercise-beauty/icons/brain.webp")],
        items: ["neuroplasticity", "mood", "cognition", "stress resilience"],
      },
      {
        title: "Muscle–Liver axis",
        icons: [asset("exercise-health/icons/liver-v1.png")],
        items: ["glucose uptake", "glycogen regulation", "insulin sensitivity"],
      },
      {
        title: "Muscle–Adipose axis",
        icons: [asset("exercise-health/icons/adipose-cells-v1.png")],
        items: ["lipolysis", "reduced visceral fat", "adipokine modulation"],
      },
      {
        title: "Muscle–Pancreas axis",
        icons: [asset("exercise-health/icons/pancreas-v1.png")],
        items: ["insulin secretion", "glucose homeostasis"],
      },
      {
        title: "Muscle–Heart & Vascular axis",
        icons: [asset("images/exposome-2026/icons-custom/heart.png"), asset("exercise-beauty/icons/vessel.webp")],
        items: ["NO production", "angiogenesis", "blood pressure regulation"],
      },
      {
        title: "Muscle–Bone axis",
        icons: [asset("exercise-health/icons/bone-v1.png")],
        items: ["osteoblast activity", "bone remodeling"],
      },
      {
        title: "Muscle–Immune / Gut axis",
        icons: [asset("neuro-scented-therapy/icons/gut.png"), asset("hair-bioscience/icons-v2/exposure-microbiome.png")],
        items: ["immune regulation", "cytokine balance", "gut microbiota modulation"],
      },
    ],

    intracellularPathways: [
      { title: "AMPK", subtitle: "energy\nmetabolism", icon: asset("exercise-beauty/icons/molecules.webp") },
      { title: "PGC-1α", subtitle: "mitochondrial\nbiogenesis", icon: asset("exercise-beauty/icons/mitochondrion-purple.webp") },
      { title: "Akt/mTOR", subtitle: "protein\nsynthesis", icon: asset("exercise-beauty/icons/molecules.webp"), tone: "blue" },
      { title: "Nrf2", subtitle: "antioxidant\ndefense", icon: asset("images/exposome-2026/icons-custom/dna.png"), tone: "cyan" },
      { title: "Sirtuins", label: "(SIRT1)", subtitle: "autophagy /\nmitophagy", icon: asset("exercise-beauty/icons/molecules.webp"), tone: "teal" },
      { title: "NF-κB", label: "(chronic)", subtitle: "cellular repair &\nanti-inflammatory\nadaptation", icon: asset("exercise-beauty/icons/molecules.webp"), tone: "purple" },
    ],

    contextualModifiers: [
      { label: "Circadian state", icon: "clock" },
      { label: "Sleep status", icon: "moon-stars" },
      { label: "Stress load", icon: "lightning" },
      { label: "Motivation / affect", icon: "smiley" },
      { label: "Environmental context", icon: "globe-hemisphere-west" },
    ],

    responseModifiers: [
      { label: "Neuroendocrine activation", icon: "brain" },
      { label: "Autonomic tone", icon: "heartbeat" },
      { label: "Perceived exertion", icon: "gauge" },
      { label: "Exercise responsiveness", icon: "chart-line-up" },
    ],

    exerciseModalities: [
      { title: "Aerobic", label: "Endurance", icon: asset("exercise-beauty/icons/aerobic.webp") },
      { title: "Resistance", label: "Strength", icon: asset("exercise-beauty/icons/resistance.webp") },
      { title: "HIIT", label: "Interval", icon: asset("exercise-beauty/icons/hiit.webp") },
      { title: "Mobility / Balance", label: "", icon: asset("exercise-beauty/icons/mobility.webp") },
    ],

    physiologicalSensors: [
      {
        number: 1,
        title: "Mechanical Loading",
        icons: [asset("exercise-health/icons/skeletal-muscle-fiber-v1.png")],
        items: ["Muscle contraction", "Tendon & bone stress", "Mechanotransduction", "Integrin / FAK / YAP–TAZ"],
      },
      {
        number: 2,
        title: "Metabolic Stress",
        icons: [asset("exercise-beauty/icons/mitochondrion-purple.webp")],
        items: ["AMP/ATP ratio ↑", "AMPK activation", "Ca²⁺ signaling", "Lactate ↑", "Glycogen depletion"],
      },
      {
        number: 3,
        title: "Hemodynamic & Hypoxic Signals",
        icons: [asset("exercise-beauty/icons/vessel.webp"), asset("exercise-beauty/icons/oxygen.webp")],
        items: ["Blood flow & shear stress ↑", "Nitric oxide (NO) ↑", "Transient hypoxia", "HIF-1α activation"],
      },
      {
        number: 4,
        title: "Neuroendocrine Activation",
        icons: [asset("exercise-beauty/icons/brain.webp"), asset("olfactory-science/endocrine.png")],
        items: ["Sympathetic activation", "Catecholamines ↑", "Growth hormone ↑", "Cortisol (acute) ↑", "Insulin / glucagon modulation"],
      },
    ],

    acuteResponses: [
      { text: "Heart rate &\ncardiac output ↑", icons: [asset("olfactory-science/heart.png")] },
      { text: "Ventilation &\noxygen uptake ↑", icons: [asset("exercise-health/icons/lungs-v1.png")] },
      { text: "Blood flow to\nactive & key\norgans ↑", icons: [asset("exercise-beauty/icons/vessel.webp")] },
      { text: "Body\ntemperature ↑", iconClass: "thermometer-hot" },
      { text: "Hormonal\nsurge", icons: [asset("exercise-beauty/icons/molecules.webp")] },
      { text: "Metabolite\nrelease", icons: [asset("exercise-beauty/icons/molecules.webp")], tone: "warm" },
    ],

    acuteOutcomes: [
      {
        heading: "Enhanced nutrient &\noxygen delivery",
        text: "Improved perfusion and\nsubstrate availability",
        icons: [asset("exercise-beauty/icons/vessel.webp"), asset("exercise-beauty/icons/oxygen.webp")],
      },
      {
        heading: "Energy mobilization\n(glucose, fatty acids)",
        text: "Increased substrate\navailability",
        icons: [asset("exercise-health/icons/glucose-lipid-v1.png")],
      },
      {
        heading: "Metabolic by-product\nsignaling (lactate, ROS)",
        text: "Signals to inform cells",
        badges: ["Lactate"],
        badgeIcon: asset("exercise-health/icons/ros-badge-v1.png"),
      },
      {
        heading: "Neuroendocrine priming",
        text: "Elevated readiness\nfor adaptation",
        icons: [asset("exercise-beauty/icons/brain.webp")],
      },
    ],
  });
})();
