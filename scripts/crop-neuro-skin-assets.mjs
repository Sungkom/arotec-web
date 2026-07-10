import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const referenceDir = path.join(projectRoot, "assets", "neuro-skin-care", "references");
const outputDir = path.join(projectRoot, "assets", "neuro-skin-care", "crops");

const crops = [
  // Section 1: skin homeostasis network
  ["01-skin-homeostasis-network.jpg", "stress-psychological.png", 22, 94, 68, 58],
  ["01-skin-homeostasis-network.jpg", "stress-physical.png", 207, 94, 46, 60],
  ["01-skin-homeostasis-network.jpg", "stress-environmental.png", 360, 94, 79, 60],
  ["01-skin-homeostasis-network.jpg", "stress-uv.png", 553, 104, 63, 48],
  ["01-skin-homeostasis-network.jpg", "stress-pollution.png", 718, 92, 64, 63],
  ["01-skin-homeostasis-network.jpg", "stress-sleep.png", 876, 92, 66, 63],
  ["01-skin-homeostasis-network.jpg", "stress-diet.png", 1018, 92, 67, 63],
  ["01-skin-homeostasis-network.jpg", "central-brain.png", 430, 225, 220, 180],
  ["01-skin-homeostasis-network.jpg", "autonomic-neuron-purple.png", 756, 256, 45, 43],
  ["01-skin-homeostasis-network.jpg", "autonomic-neuron-green.png", 876, 256, 45, 43],
  ["01-skin-homeostasis-network.jpg", "skin-nervous-system.png", 28, 466, 125, 142],
  ["01-skin-homeostasis-network.jpg", "mast-cell.png", 397, 501, 65, 65],
  ["01-skin-homeostasis-network.jpg", "macrophage.png", 466, 501, 68, 65],
  ["01-skin-homeostasis-network.jpg", "dendritic-cell.png", 535, 501, 66, 65],
  ["01-skin-homeostasis-network.jpg", "t-cell.png", 606, 501, 66, 65],
  ["01-skin-homeostasis-network.jpg", "keratinocytes.png", 38, 744, 107, 65],
  ["01-skin-homeostasis-network.jpg", "fibroblasts.png", 184, 744, 103, 65],
  ["01-skin-homeostasis-network.jpg", "melanocytes.png", 342, 741, 96, 68],
  ["01-skin-homeostasis-network.jpg", "sebocytes.png", 490, 741, 86, 68],
  ["01-skin-homeostasis-network.jpg", "hair-follicle.png", 607, 737, 109, 73],
  ["01-skin-homeostasis-network.jpg", "immune-cells.png", 731, 739, 117, 69],
  ["01-skin-homeostasis-network.jpg", "endothelial-cells.png", 908, 745, 102, 61],
  ["01-skin-homeostasis-network.jpg", "clinical-skin-aging.png", 1058, 894, 65, 76],
  ["01-skin-homeostasis-network.jpg", "clinical-sensitive-skin.png", 1131, 894, 64, 76],
  ["01-skin-homeostasis-network.jpg", "clinical-pigmentation.png", 1206, 894, 64, 76],
  ["01-skin-homeostasis-network.jpg", "clinical-acne.png", 1281, 894, 64, 76],
  ["01-skin-homeostasis-network.jpg", "clinical-atopic-dermatitis.png", 1355, 894, 66, 76],
  ["01-skin-homeostasis-network.jpg", "clinical-hair-loss.png", 1426, 894, 76, 76],

  // Section 2: brain-skin axis
  ["02-brain-skin-axis.jpg", "brain-sagittal.png", 386, 155, 257, 235],
  ["02-brain-skin-axis.jpg", "skin-cross-section-large.png", 205, 725, 554, 359],
  ["02-brain-skin-axis.jpg", "target-keratinocytes.png", 66, 1115, 116, 96],
  ["02-brain-skin-axis.jpg", "target-fibroblasts.png", 211, 1115, 120, 96],
  ["02-brain-skin-axis.jpg", "target-melanocytes.png", 360, 1115, 111, 96],
  ["02-brain-skin-axis.jpg", "target-immune-cells.png", 505, 1115, 116, 96],
  ["02-brain-skin-axis.jpg", "target-sebocytes.png", 654, 1115, 105, 96],
  ["02-brain-skin-axis.jpg", "target-endothelial-cells.png", 803, 1115, 121, 96],
  ["02-brain-skin-axis.jpg", "function-barrier.png", 65, 1285, 106, 94],
  ["02-brain-skin-axis.jpg", "function-immune.png", 200, 1285, 105, 94],
  ["02-brain-skin-axis.jpg", "function-sensory.png", 338, 1285, 105, 94],
  ["02-brain-skin-axis.jpg", "function-pigmentation.png", 476, 1285, 105, 94],
  ["02-brain-skin-axis.jpg", "function-sebum.png", 615, 1285, 103, 94],
  ["02-brain-skin-axis.jpg", "function-wound.png", 748, 1285, 104, 94],
  ["02-brain-skin-axis.jpg", "function-ecm.png", 875, 1285, 108, 94],

  // Section 3: direct impact on skin
  ["03-exposome-direct-skin-impact.jpg", "skin-tissue-large.png", 355, 405, 817, 340],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-keratinocyte.png", 31, 169, 62, 56],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-fibroblast.png", 31, 236, 62, 52],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-mast-cell.png", 31, 301, 62, 61],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-sensory-nerve.png", 31, 372, 62, 58],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-endothelial.png", 31, 438, 62, 49],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-sebocyte.png", 31, 493, 62, 58],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-melanocyte.png", 31, 557, 62, 58],
  ["03-exposome-direct-skin-impact.jpg", "direct-target-immune-cells.png", 31, 620, 62, 56],
  ["03-exposome-direct-skin-impact.jpg", "pathway-nfkb.png", 1285, 213, 52, 48],
  ["03-exposome-direct-skin-impact.jpg", "pathway-mapk.png", 1285, 266, 52, 48],
  ["03-exposome-direct-skin-impact.jpg", "pathway-stat.png", 1285, 319, 52, 48],
  ["03-exposome-direct-skin-impact.jpg", "pathway-nlrp3.png", 1285, 372, 52, 48],
  ["03-exposome-direct-skin-impact.jpg", "pathway-ros.png", 1285, 425, 52, 48],
  ["03-exposome-direct-skin-impact.jpg", "pathway-camp.png", 1285, 478, 52, 48],
  ["03-exposome-direct-skin-impact.jpg", "outcome-dryness.png", 57, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-sensitivity.png", 177, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-itching.png", 305, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-acne.png", 432, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-atopic.png", 560, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-psoriasis.png", 686, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-rosacea.png", 815, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-pigmentation.png", 942, 899, 86, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-wound-healing.png", 1065, 899, 105, 67],
  ["03-exposome-direct-skin-impact.jpg", "outcome-skin-aging.png", 1192, 899, 104, 67],

  // Section 4: barrier dysfunction
  ["04-skin-barrier-dysfunction.jpg", "exposome-head-profile.png", 177, 115, 137, 100],
  ["04-skin-barrier-dysfunction.jpg", "normal-barrier.png", 1143, 157, 150, 77],
  ["04-skin-barrier-dysfunction.jpg", "disrupted-barrier.png", 1323, 157, 151, 77],
  ["04-skin-barrier-dysfunction.jpg", "barrier-keratinocyte.png", 314, 339, 117, 90],
  ["04-skin-barrier-dysfunction.jpg", "barrier-mast-cell.png", 483, 328, 115, 103],
  ["04-skin-barrier-dysfunction.jpg", "barrier-immune-cell.png", 635, 328, 118, 103],
  ["04-skin-barrier-dysfunction.jpg", "barrier-fibroblast.png", 788, 338, 116, 90],
  ["04-skin-barrier-dysfunction.jpg", "barrier-sensory-nerve.png", 939, 328, 116, 103],
  ["04-skin-barrier-dysfunction.jpg", "lipid-synthesis.png", 307, 584, 103, 79],
  ["04-skin-barrier-dysfunction.jpg", "structural-protein.png", 452, 584, 104, 79],
  ["04-skin-barrier-dysfunction.jpg", "tight-junction.png", 596, 584, 104, 79],
  ["04-skin-barrier-dysfunction.jpg", "nmf-drops.png", 741, 584, 104, 79],
  ["04-skin-barrier-dysfunction.jpg", "inflammation-ros.png", 879, 584, 110, 79],
  ["04-skin-barrier-dysfunction.jpg", "microbiome.png", 1015, 584, 109, 79],
  ["04-skin-barrier-dysfunction.jpg", "damaged-skin-layer.png", 277, 778, 795, 135],
  ["04-skin-barrier-dysfunction.jpg", "consequence-dryness.png", 1134, 418, 93, 91],
  ["04-skin-barrier-dysfunction.jpg", "consequence-sensitivity.png", 1231, 418, 93, 91],
  ["04-skin-barrier-dysfunction.jpg", "consequence-itching.png", 1331, 418, 93, 91],
  ["04-skin-barrier-dysfunction.jpg", "consequence-inflammatory-disease.png", 1430, 418, 93, 91],
  ["04-skin-barrier-dysfunction.jpg", "consequence-acne.png", 1134, 548, 93, 91],
  ["04-skin-barrier-dysfunction.jpg", "consequence-rosacea.png", 1231, 548, 93, 91],
  ["04-skin-barrier-dysfunction.jpg", "consequence-delayed-healing.png", 1331, 548, 93, 91],
  ["04-skin-barrier-dysfunction.jpg", "consequence-premature-aging.png", 1430, 548, 93, 91],

  // Section 5: EBII to SADI
  ["05-ebii-sadi-framework.jpg", "ebii-cell.png", 25, 250, 141, 147],
  ["05-ebii-sadi-framework.jpg", "shs-barrier.png", 211, 245, 86, 104],
  ["05-ebii-sadi-framework.jpg", "shs-immune.png", 307, 245, 88, 104],
  ["05-ebii-sadi-framework.jpg", "shs-oxidative.png", 401, 245, 88, 104],
  ["05-ebii-sadi-framework.jpg", "shs-ecm.png", 497, 245, 88, 104],
  ["05-ebii-sadi-framework.jpg", "shs-microbiome.png", 591, 245, 88, 104],
  ["05-ebii-sadi-framework.jpg", "shs-neuroendocrine.png", 686, 245, 88, 104],
  ["05-ebii-sadi-framework.jpg", "vicious-cycle-skin.png", 287, 724, 105, 95],
  ["05-ebii-sadi-framework.jpg", "virtuous-cycle-skin.png", 631, 724, 105, 95],
  ["05-ebii-sadi-framework.jpg", "stage-homeostatic.png", 922, 685, 88, 83],
  ["05-ebii-sadi-framework.jpg", "stage-adaptive.png", 1076, 685, 88, 83],
  ["05-ebii-sadi-framework.jpg", "stage-accelerated.png", 1225, 685, 88, 83],
  ["05-ebii-sadi-framework.jpg", "stage-collapsed.png", 1381, 685, 88, 83],

  // Section 6: neurocosmetics
  ["06-neurocosmetics.jpg", "neurocosmetic-neurons.png", 28, 138, 300, 225],
  ["06-neurocosmetics.jpg", "neurocosmetic-skin-cell.png", 300, 255, 700, 310],
  ["06-neurocosmetics.jpg", "neurocosmetic-nucleus.png", 718, 275, 235, 228],
  ["06-neurocosmetics.jpg", "collagen-production.png", 997, 229, 137, 105],
  ["06-neurocosmetics.jpg", "improved-hydration.png", 997, 331, 137, 105],
  ["06-neurocosmetics.jpg", "enhanced-barrier.png", 997, 434, 137, 105],
  ["06-neurocosmetics.jpg", "benefit-barrier-shield.png", 340, 652, 72, 72],
  ["06-neurocosmetics.jpg", "benefit-calm-feather.png", 340, 728, 72, 72],
  ["06-neurocosmetics.jpg", "benefit-bright-face.png", 340, 804, 72, 68],
  ["06-neurocosmetics.jpg", "benefit-aging-hourglass.png", 340, 879, 72, 70],
  ["06-neurocosmetics.jpg", "benefit-mind-skin.png", 340, 954, 72, 72],
  ["06-neurocosmetics.jpg", "ingredient-neuropeptide.png", 35, 1090, 176, 113],
  ["06-neurocosmetics.jpg", "ingredient-happy-skin.png", 229, 1090, 176, 113],
  ["06-neurocosmetics.jpg", "ingredient-trp-channel.png", 425, 1090, 176, 113],
  ["06-neurocosmetics.jpg", "ingredient-brightening.png", 620, 1090, 176, 113],
  ["06-neurocosmetics.jpg", "ingredient-adaptogens.png", 815, 1090, 317, 113]
];

await fs.mkdir(outputDir, { recursive: true });

for (const [sourceName, outputName, left, top, width, height] of crops) {
  const source = path.join(referenceDir, sourceName);
  const output = path.join(outputDir, outputName);
  await sharp(source)
    .extract({ left, top, width, height })
    .resize({ width: Math.min(width * 2, 1200), withoutEnlargement: false })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
  console.log(`${outputName} <- ${sourceName} [${left}, ${top}, ${width}, ${height}]`);
}

console.log(`Created ${crops.length} cropped assets in ${outputDir}`);
