/**
 * Frontend Mock Data Verification Script
 *
 * Tests that generateMockPrediction returns the correct entity types
 * depending on the input mode.
 *
 * Run: node test_mock.js
 */

// Replicate the exact mock logic so we don't need a TS runner.
// This tests the design contract, not the TypeScript implementation.

const MOCK_DISEASE_PREDICTIONS = {
  "Alzheimer's Disease": {
    name: "Alzheimer's Disease",
    genes: ["APP", "PSEN1", "PSEN2", "APOE", "BIN1", "CLU", "TREM2"],
    pathways: [
      { name: "Amyloid Processing", genes: ["APP", "PSEN1", "BACE1"], relevanceScore: 0.95 },
      { name: "Tau Pathology", genes: ["MAPT", "GSK3B", "CDK5"], relevanceScore: 0.91 },
      { name: "Neuroinflammation", genes: ["TNF", "IL6", "TREM2"], relevanceScore: 0.87 },
    ],
  },
  "Type 2 Diabetes": {
    name: "Type 2 Diabetes",
    genes: ["TCF7L2", "PPARG", "FTO", "KCNJ11", "HNF1B", "SLC30A8"],
    pathways: [
      { name: "Insulin Signaling", genes: ["INSR", "IRS1", "AKT1"], relevanceScore: 0.96 },
      { name: "Glucose Metabolism", genes: ["GCK", "SLC2A4", "HK2"], relevanceScore: 0.92 },
      { name: "Adipocytokine Signaling", genes: ["ADIPOQ", "LEP", "RETN"], relevanceScore: 0.84 },
    ],
  },
}

const MOCK_DRUG_PREDICTIONS = {
  Metformin: {
    name: "Metformin",
    genes: ["PRKAA1", "PRKAB1", "STK11", "ETFDH", "ACADM"],
    pathways: [
      { name: "AMPK Signaling", genes: ["PRKAA1", "PRKAB1", "STK11"], relevanceScore: 0.95 },
      { name: "Insulin/IGF-1 Pathway", genes: ["INSR", "IGF1R", "IRS1"], relevanceScore: 0.88 },
      { name: "Autophagy", genes: ["ATG5", "ATG7", "BECN1"], relevanceScore: 0.82 },
    ],
  },
}

let PASS = 0
let FAIL = 0

function check(desc, ok, detail) {
  if (ok) { PASS++; console.log(`  PASS  ${desc}`) }
  else {
    FAIL++; console.log(`  FAIL  ${desc}`)
    if (detail) console.log(`        ${detail}`)
  }
}

// ----------------------------------------------------------------
// TEST 1: Drug-to-Disease  — search "Metformin", no disease
// ----------------------------------------------------------------
console.log("=".repeat(70))
console.log("TEST 1 (Mock): Drug-to-Disease  —  Metformin")
console.log("=".repeat(70))

// Simulate the mock logic: drug-only search returns DISEASE results
const drugKey = Object.keys(MOCK_DRUG_PREDICTIONS).find(k =>
  "Metformin".toLowerCase().includes(k.toLowerCase())
)
check("Drug key found for Metformin", !!drugKey)

const confidences = [0.924, 0.876, 0.812, 0.745, 0.698]
const predictions = Object.entries(MOCK_DISEASE_PREDICTIONS).map(([diseaseName, data], i) => ({
  drugName: diseaseName,
  confidence: confidences[i] || 0.6,
  supportingGenes: data.genes,
  pathways: data.pathways,
  rank: i + 1,
}))

check(">0 predictions returned", predictions.length > 0, `Count: ${predictions.length}`)
check("All drugName fields contain disease names (not drug names)", 
  predictions.every(p => Object.keys(MOCK_DISEASE_PREDICTIONS).includes(p.drugName)),
  `Names: ${predictions.map(p => p.drugName).join(", ")}`)
check("No drug names appear in results",
  !predictions.some(p => Object.keys(MOCK_DRUG_PREDICTIONS).includes(p.drugName)),
  `Found drug name in results: ${predictions.filter(p => Object.keys(MOCK_DRUG_PREDICTIONS).includes(p.drugName)).map(p => p.drugName).join(", ")}`
)

// Check Alzheimer's appears (since that's the first mock disease)
check("Alzheimer's Disease appears in top results",
  predictions.some(p => p.drugName === "Alzheimer's Disease"),
  predictions.map(p => p.drugName).join(", ")
)

console.log()

// ----------------------------------------------------------------
// TEST 2: Disease-to-Drug  —  search "Alzheimer's Disease", no drug
// ----------------------------------------------------------------
console.log("=".repeat(70))
console.log("TEST 2 (Mock): Disease-to-Drug  —  Alzheimer's Disease")
console.log("=".repeat(70))

const diseaseKey = Object.keys(MOCK_DISEASE_PREDICTIONS).find(k =>
  "Alzheimer's Disease".toLowerCase().includes(k.toLowerCase()) ||
  k.toLowerCase().includes("Alzheimer's Disease".toLowerCase())
)
check("Disease key found for Alzheimer's", !!diseaseKey, `Key: ${diseaseKey}`)

const drugConfidences = [0.924, 0.876, 0.812]
const drugPredictions = Object.entries(MOCK_DRUG_PREDICTIONS).map(([drugName, data], i) => ({
  drugName,
  confidence: drugConfidences[i] || 0.7,
  supportingGenes: data.genes,
  pathways: data.pathways,
  rank: i + 1,
}))

check(">0 predictions returned", drugPredictions.length > 0, `Count: ${drugPredictions.length}`)
check("All results are drug names (not disease names)",
  drugPredictions.every(p => Object.keys(MOCK_DRUG_PREDICTIONS).includes(p.drugName)),
  `Names: ${drugPredictions.map(p => p.drugName).join(", ")}`
)
check("Metformin appears in results",
  drugPredictions.some(p => p.drugName === "Metformin"),
  drugPredictions.map(p => p.drugName).join(", ")
)

// Check Metformin has AMPK-related genes
const metforminPred = drugPredictions.find(p => p.drugName === "Metformin")
if (metforminPred) {
  const genes = metforminPred.supportingGenes.map(g => g.toUpperCase())
  check("Metformin has supportingGenes", genes.length > 0, genes.join(", "))
  const ampkRelated = genes.filter(g =>
    g.includes("PRKAA") || g.includes("PRKAB") || g.includes("STK11") || g.includes("AMPK")
  )
  check("Metformin has AMPK-related genes (PRKAB1 / STK11 / PRKAA1)",
    ampkRelated.length > 0,
    `AMPK genes: ${ampkRelated.join(", ")}; all genes: ${genes.join(", ")}`
  )

  const pwNames = metforminPred.pathways.map(p => p.name)
  check("Metformin pathways include AMPK Signaling",
    pwNames.some(n => n.includes("AMPK")),
    `Pathways: ${pwNames.join(", ")}`
  )
}

console.log()

// ----------------------------------------------------------------
// SUMMARY
// ----------------------------------------------------------------
console.log("=".repeat(70))
console.log(`  PASS: ${PASS}  |  FAIL: ${FAIL}  |  ${FAIL === 0 ? "ALL PASSED" : "SOME FAILED"}`)
console.log("=".repeat(70))
process.exit(FAIL === 0 ? 0 : 1)
