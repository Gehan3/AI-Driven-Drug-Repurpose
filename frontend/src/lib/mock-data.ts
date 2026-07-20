import type {
  DrugPrediction,
  PredictionResult,
  DrugInfo,
  DiseaseInfo,
  ModelExplanation,
  PipelineStep,
  ArchitectureSection,
} from "@/types"

export const MOCK_DRUGS = [
  "Metformin", "Rapamycin", "Imatinib", "Rituximab", "Tocilizumab",
  "Doxycycline", "Valproic Acid", "Aspirin", "Curcumin", "Resveratrol",
  "Minocycline", "Lithium", "Tamoxifen", "Bevacizumab", "Methotrexate"
]

export const MOCK_DISEASES = [
  "Alzheimer's Disease", "Parkinson's Disease", "Type 2 Diabetes",
  "Breast Cancer", "Colorectal Cancer", "Rheumatoid Arthritis",
  "Multiple Sclerosis", "COVID-19", "Glioblastoma", "Hepatitis C",
  "HIV/AIDS", "Lupus Erythematosus", "Crohn's Disease", "Asthma",
  "Myocardial Infarction"
]

function makeMockModelSources(confidence: number) {
  const dreamwalk = Math.min(0.33 + confidence * 0.12, 0.45)
  const txgnn = Math.min(0.32 + confidence * 0.08, 0.40)
  const xgb = Math.max(1 - dreamwalk - txgnn, 0.15)
  return [
    { name: "DREAMwalk" as const, contribution: Math.round(dreamwalk * 100) / 100, description: "Graph embedding similarity" },
    { name: "TxGNN" as const, contribution: Math.round(txgnn * 100) / 100, description: "Foundation model inference" },
    { name: "XGBoost" as const, contribution: Math.round(xgb * 100) / 100, description: "Feature-based classification" },
  ]
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const MOCK_DISEASE_PREDICTIONS: Record<string, { name: string; genes: string[]; pathways: { name: string; genes: string[]; relevanceScore: number }[] }> = {
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
  "Parkinson's Disease": {
    name: "Parkinson's Disease",
    genes: ["SNCA", "LRRK2", "PARK2", "PINK1", "GBA", "MAPT"],
    pathways: [
      { name: "Mitochondrial Autophagy", genes: ["PINK1", "PARK2", "BNIP3L"], relevanceScore: 0.94 },
      { name: "Alpha-Synuclein Aggregation", genes: ["SNCA", "GBA", "CSTB"], relevanceScore: 0.89 },
    ],
  },
  "Breast Cancer": {
    name: "Breast Cancer",
    genes: ["BRCA1", "BRCA2", "ERBB2", "TP53", "ESR1", "PGR", "AKT1"],
    pathways: [
      { name: "Estrogen Signaling", genes: ["ESR1", "PGR", "AKT1"], relevanceScore: 0.93 },
      { name: "DNA Damage Repair", genes: ["BRCA1", "BRCA2", "TP53"], relevanceScore: 0.90 },
      { name: "PI3K/AKT Pathway", genes: ["PIK3CA", "AKT1", "PTEN"], relevanceScore: 0.86 },
    ],
  },
  "Rheumatoid Arthritis": {
    name: "Rheumatoid Arthritis",
    genes: ["TNF", "IL6", "IL1B", "CCR5", "HLA-DRB1", "PTPN22", "TRAF1"],
    pathways: [
      { name: "Inflammatory Response", genes: ["TNF", "IL6", "IL1B"], relevanceScore: 0.96 },
      { name: "T Cell Signaling", genes: ["HLA-DRB1", "PTPN22", "TRAF1"], relevanceScore: 0.88 },
      { name: "NF-kB Signaling", genes: ["NFKB1", "TNF", "RELA"], relevanceScore: 0.85 },
    ],
  },
  "Asthma": {
    name: "Asthma",
    genes: ["IL4", "IL5", "IL13", "FCER2", "ADRB2", "TSLP", "IL33"],
    pathways: [
      { name: "Th2 Differentiation", genes: ["IL4", "IL5", "IL13"], relevanceScore: 0.94 },
      { name: "Airway Inflammation", genes: ["TSLP", "IL33", "FCER2"], relevanceScore: 0.89 },
      { name: "Beta-2 Adrenergic", genes: ["ADRB2", "CREB1", "ADCY2"], relevanceScore: 0.81 },
    ],
  },
}

const MOCK_DRUG_PREDICTIONS: Record<string, { name: string; genes: string[]; pathways: { name: string; genes: string[]; relevanceScore: number }[] }> = {
  Metformin: {
    name: "Metformin",
    genes: ["PRKAA1", "PRKAB1", "STK11", "ETFDH", "ACADM"],
    pathways: [
      { name: "AMPK Signaling", genes: ["PRKAA1", "PRKAB1", "STK11"], relevanceScore: 0.95 },
      { name: "Insulin/IGF-1 Pathway", genes: ["INSR", "IGF1R", "IRS1"], relevanceScore: 0.88 },
      { name: "Autophagy", genes: ["ATG5", "ATG7", "BECN1"], relevanceScore: 0.82 },
    ],
  },
  Rapamycin: {
    name: "Rapamycin",
    genes: ["MTOR", "RPTOR", "AKT1", "FKBP1A", "ULK1"],
    pathways: [
      { name: "mTOR Signaling", genes: ["MTOR", "RPTOR", "DEPTOR"], relevanceScore: 0.97 },
      { name: "Autophagy", genes: ["ATG5", "ATG7", "BECN1"], relevanceScore: 0.91 },
      { name: "PI3K/AKT Pathway", genes: ["PIK3CA", "AKT1", "PTEN"], relevanceScore: 0.85 },
    ],
  },
  Minocycline: {
    name: "Minocycline",
    genes: ["CASP3", "CASP9", "BCL2", "BAX", "TNF"],
    pathways: [
      { name: "Apoptosis", genes: ["CASP3", "CASP9", "BCL2"], relevanceScore: 0.93 },
      { name: "Neuroinflammation", genes: ["TNF", "IL6", "IL1B"], relevanceScore: 0.87 },
    ],
  },
  "Valproic Acid": {
    name: "Valproic Acid",
    genes: ["HDAC1", "HDAC2", "GSK3B", "SLC6A1", "GAD1"],
    pathways: [
      { name: "HDAC Inhibition", genes: ["HDAC1", "HDAC2", "HDAC3"], relevanceScore: 0.96 },
      { name: "GABAergic Synapse", genes: ["GAD1", "SLC6A1", "GABRA1"], relevanceScore: 0.91 },
      { name: "Wnt/GSK3B Signaling", genes: ["GSK3B", "CTNNB1", "AXIN1"], relevanceScore: 0.84 },
    ],
  },
  Lithium: {
    name: "Lithium",
    genes: ["GSK3B", "CTNNB1", "BCL2", "BDNF", "CREB1", "IMPACT"],
    pathways: [
      { name: "Wnt/GSK3B Signaling", genes: ["GSK3B", "CTNNB1", "AXIN1"], relevanceScore: 0.95 },
      { name: "Neurotrophin Signaling", genes: ["BDNF", "NTRK2", "CREB1"], relevanceScore: 0.89 },
      { name: "Inositol Depletion", genes: ["IMPACT", "IMPA1", "IMPA2"], relevanceScore: 0.82 },
    ],
  },
  Aspirin: {
    name: "Aspirin",
    genes: ["PTGS1", "PTGS2", "NFKB1", "TNF", "IL6", "TBXA2R"],
    pathways: [
      { name: "Prostaglandin Synthesis", genes: ["PTGS1", "PTGS2", "TBXA2R"], relevanceScore: 0.97 },
      { name: "Anti-inflammatory", genes: ["NFKB1", "TNF", "IL6"], relevanceScore: 0.92 },
      { name: "Platelet Aggregation", genes: ["PTGS1", "TBXA2R", "GP1BA"], relevanceScore: 0.88 },
    ],
  },
}

const ALL_DISEASE_KEYS = Object.keys(MOCK_DISEASE_PREDICTIONS)

function pick<T>(arr: T[], seed: number, count: number): T[] {
  const copy = [...arr]
  const result: T[] = []
  for (let i = 0; i < Math.min(count, copy.length); i++) {
    const idx = (seed * (i + 1) * 2654435761) % copy.length
    result.push(copy.splice(idx, 1)[0])
  }
  return result
}

export function generateMockPrediction(input: {
  drugName: string
  diseaseName: string
  confidenceThreshold: number
  topK: number
}): PredictionResult {
  const onlyDrug = !!input.drugName && !input.diseaseName
  const onlyDisease = !!input.diseaseName && !input.drugName
  const both = !!input.drugName && !!input.diseaseName

  const mode = both ? "both" as const : onlyDrug ? "drug_to_disease" as const : "disease_to_drug" as const

  let predictions: DrugPrediction[] = []

  if (onlyDrug) {
    const drugKey = Object.keys(MOCK_DRUG_PREDICTIONS).find((k) =>
      input.drugName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(input.drugName.toLowerCase())
    )
    const seed = hashStr(input.drugName)
    const selectedDiseases = pick(ALL_DISEASE_KEYS, seed, 5)
    const offset = seed % 50
    selectedDiseases.forEach((diseaseName, i) => {
      const data = MOCK_DISEASE_PREDICTIONS[diseaseName]
      const baseConf = 0.5 + ((offset + i * 17) % 45) / 100
      const conf = Math.round(baseConf * 1000) / 1000
      predictions.push({
        drugName: diseaseName,
        confidence: conf,
        supportingGenes: [...data.genes].sort(() => 0.5 - ((seed * (i + 3)) % 100) / 100).slice(0, 5),
        modelSources: makeMockModelSources(conf),
        explanation: `[SIMULATED] ${drugKey || input.drugName} predicted for ${diseaseName} via ${data.pathways.map(p => p.name).join(", ")} (seed=${seed}).`,
        pathways: data.pathways.map(p => ({
          ...p,
          relevanceScore: Math.round((0.5 + ((seed * (i + 1) * 7) % 50) / 100) * 100) / 100,
        })),
        rank: i + 1,
      })
    })
  } else if (onlyDisease) {
    const diseaseKey = Object.keys(MOCK_DISEASE_PREDICTIONS).find((k) =>
      input.diseaseName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(input.diseaseName.toLowerCase())
    )
    const seed = hashStr(input.diseaseName)
    const drugEntries = Object.entries(MOCK_DRUG_PREDICTIONS)
    const offset = seed % 50
    drugEntries.forEach(([drugName, data], i) => {
      const baseConf = 0.5 + ((offset + i * 13) % 45) / 100
      const conf = Math.round(baseConf * 1000) / 1000
      predictions.push({
        drugName,
        confidence: conf,
        supportingGenes: [...data.genes].sort(() => 0.5 - ((seed * (i + 3)) % 100) / 100).slice(0, 5),
        modelSources: makeMockModelSources(conf),
        explanation: `[SIMULATED] ${drugName} predicted for ${diseaseKey || input.diseaseName} via ${data.pathways.map(p => p.name).join(", ")} (seed=${seed}).`,
        pathways: data.pathways.map(p => ({
          ...p,
          relevanceScore: Math.round((0.5 + ((seed * (i + 1) * 11) % 50) / 100) * 100) / 100,
        })),
        rank: i + 1,
      })
    })
  } else {
    const drugKey = Object.keys(MOCK_DRUG_PREDICTIONS).find((k) =>
      input.drugName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(input.drugName.toLowerCase())
    )
    const diseaseKey = Object.keys(MOCK_DISEASE_PREDICTIONS).find((k) =>
      input.diseaseName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(input.diseaseName.toLowerCase())
    )
    const drugData = drugKey ? MOCK_DRUG_PREDICTIONS[drugKey] : MOCK_DRUG_PREDICTIONS.Metformin
    const diseaseData = diseaseKey ? MOCK_DISEASE_PREDICTIONS[diseaseKey] : MOCK_DISEASE_PREDICTIONS["Alzheimer's Disease"]
    const seed = hashStr(input.drugName + "|" + input.diseaseName)
    const conf = 0.5 + (seed % 45) / 100
    predictions = [{
      drugName: drugData.name,
      confidence: Math.round(conf * 1000) / 1000,
      supportingGenes: [...new Set([...drugData.genes.slice(0, 3), ...diseaseData.genes.slice(0, 3)])],
      modelSources: makeMockModelSources(conf),
      explanation: `[SIMULATED] ${drugData.name} <-> ${diseaseData.name} pair analysis via ${diseaseData.pathways.map(p => p.name).join(", ")}.`,
      pathways: diseaseData.pathways,
      rank: 1,
    }]
  }

  const filtered = predictions
    .filter((p) => p.confidence >= input.confidenceThreshold)
    .slice(0, input.topK)

  return {
    _simulated: true,
    id: "mock_pred_" + Date.now(),
    input,
    predictions: filtered,
    topPrediction: filtered[0] || predictions[0],
    modelEnsembleScore: filtered[0]?.confidence ?? 0.5,
    processingTime: `${(0.5 + (hashStr(input.drugName || input.diseaseName || "") % 3000) / 1000).toFixed(2)}s`,
    timestamp: new Date().toISOString(),
    mode,
    sourceEntity: input.drugName ? { name: input.drugName, type: "drug" } : { name: input.diseaseName, type: "disease" },
    graphNodes: [
      { id: "drug:mock", type: "drug" as const, label: input.drugName || "Drug" },
      { id: "disease:mock", type: "disease" as const, label: input.diseaseName || "Disease" },
      { id: "gene:mock1", type: "gene" as const, label: "TP53" },
      { id: "gene:mock2", type: "gene" as const, label: "MTOR" },
      { id: "pathway:mock", type: "pathway" as const, label: "AMPK Signaling" },
    ],
    graphEdges: [
      { source: "drug:mock", target: "gene:mock1", weight: 0.85, type: "binds" },
      { source: "drug:mock", target: "gene:mock2", weight: 0.72, type: "binds" },
      { source: "gene:mock1", target: "pathway:mock", weight: 0.95, type: "participates" },
      { source: "gene:mock2", target: "pathway:mock", weight: 0.88, type: "participates" },
      { source: "pathway:mock", target: "disease:mock", weight: 0.82, type: "associates" },
    ],
  }
}

export const MOCK_DRUG_INFO: Record<string, DrugInfo> = {
  Metformin: {
    id: "DB00331",
    name: "Metformin",
    synonyms: ["Dimethylbiguanide", "Glucophage", "Metformin HCl"],
    description: "Metformin is a biguanide antidiabetic agent used for the treatment of type 2 diabetes mellitus. It improves glycemic control by decreasing hepatic glucose production, decreasing intestinal absorption of glucose, and improving insulin sensitivity.",
    mechanismOfAction: "AMPK activator; inhibits mitochondrial complex I; reduces hepatic gluconeogenesis",
    targets: ["PRKAA1", "PRKAB1", "ETFDH", "ACADM"],
    sideEffects: ["Gastrointestinal discomfort", "Lactic acidosis (rare)", "Vitamin B12 deficiency"],
    clinicalTrials: 3421,
    drugBankId: "DB00331",
  },
  Rapamycin: {
    id: "DB00877",
    name: "Rapamycin",
    synonyms: ["Sirolimus", "Rapamune"],
    description: "Rapamycin is an mTOR inhibitor immunosuppressant agent used to prevent organ transplant rejection. It has shown potential in longevity and neurodegeneration research.",
    mechanismOfAction: "mTORC1 inhibitor; FKBP12 binding; autophagy inducer",
    targets: ["MTOR", "FKBP1A", "RPTOR"],
    sideEffects: ["Hyperlipidemia", "Thrombocytopenia", "Delayed wound healing"],
    clinicalTrials: 1856,
    drugBankId: "DB00877",
  },
}

export const MOCK_DISEASE_INFO: Record<string, DiseaseInfo> = {
  "Alzheimer's Disease": {
    id: "OMIM:104300",
    name: "Alzheimer's Disease",
    description: "Alzheimer disease is a progressive neurodegenerative disorder characterized by memory loss, cognitive decline, and behavioral changes. Pathological hallmarks include extracellular amyloid-beta plaques and intracellular neurofibrillary tau tangles.",
    associatedGenes: ["APP", "PSEN1", "PSEN2", "APOE", "CLU", "BIN1", "PICALM"],
    prevalence: "1 in 9 individuals over 65",
    omimId: "104300",
    pathways: ["Amyloid processing", "Tau pathology", "Neuroinflammation", "Oxidative stress"],
  },
  "Type 2 Diabetes": {
    id: "OMIM:125853",
    name: "Type 2 Diabetes",
    description: "Type 2 diabetes is a metabolic disorder characterized by insulin resistance and relative insulin deficiency, leading to chronic hyperglycemia.",
    associatedGenes: ["TCF7L2", "PPARG", "FTO", "KCNJ11", "HNF1B"],
    prevalence: "1 in 10 adults worldwide",
    omimId: "125853",
    pathways: ["Insulin signaling", "Glucose metabolism", "Adipocytokine signaling"],
  },
}

export function generateMockExplanation(
  drugName: string,
  diseaseName: string
): ModelExplanation {
  const explanations: Record<string, ModelExplanation> = {
    default: {
      drugName,
      diseaseName,
      confidenceBreakdown: {
        dreamwalk: 0.42,
        xgboost: 0.23,
        txgnn: 0.35,
        ensemble: 0.924,
      },
      reasoningPath: [
        {
          step: 1,
          description: "DREAMwalk generated node embeddings placed the drug within the disease-associated subgraph",
          evidence: [
            "Graph embedding cosine similarity: 0.87",
            "Topological proximity to disease module: 2.3 hops",
          ],
        },
        {
          step: 2,
          description: "XGBoost classified drug-disease features with high confidence",
          evidence: [
            "Feature importance score: 0.89",
            "Molecular fingerprint similarity: 0.76",
          ],
        },
        {
          step: 3,
          description: "TxGNN foundation model validated therapeutic potential",
          evidence: [
            "Foundation model confidence: 0.91",
            "Known drug-disease association probability: 0.88",
          ],
        },
        {
          step: 4,
          description: "Ensemble model aggregated predictions across all architectures",
          evidence: [
            "Weighted ensemble score: 0.924",
            "Cross-model agreement: 94.2%",
          ],
        },
      ],
      networkEvidence: [
        { nodeType: "Drug", nodeName: drugName, relationshipStrength: 1.0 },
        { nodeType: "Disease", nodeName: diseaseName, relationshipStrength: 0.92 },
        { nodeType: "Gene", nodeName: "TP53", relationshipStrength: 0.87 },
        { nodeType: "Gene", nodeName: "EGFR", relationshipStrength: 0.83 },
        { nodeType: "Gene", nodeName: "VEGFA", relationshipStrength: 0.79 },
        { nodeType: "Gene", nodeName: "MTOR", relationshipStrength: 0.76 },
        { nodeType: "Pathway", nodeName: "AMPK Signaling", relationshipStrength: 0.91 },
        { nodeType: "Pathway", nodeName: "Autophagy", relationshipStrength: 0.84 },
      ],
      relatedGenes: [
        { gene: "TP53", role: "Tumor suppressor; regulates apoptosis and cellular stress response", associationScore: 0.92 },
        { gene: "EGFR", role: "Growth factor receptor; involved in cell proliferation and neuroprotection", associationScore: 0.87 },
        { gene: "VEGFA", role: "Vascular endothelial growth factor; regulates angiogenesis", associationScore: 0.83 },
        { gene: "MTOR", role: "Serine/threonine kinase; central regulator of cell growth and metabolism", associationScore: 0.79 },
        { gene: "AMPK", role: "Energy sensor; regulates cellular energy homeostasis", associationScore: 0.95 },
      ],
      biologicalPathways: [
        {
          name: "AMPK Signaling Pathway",
          description: "AMPK activation leads to reduced tau phosphorylation and improved mitochondrial bioenergetics",
          involvedGenes: ["PRKAA1", "PRKAB1", "STK11", "MTOR"],
        },
        {
          name: "Autophagy Pathway",
          description: "Enhanced autophagic clearance of amyloid-beta aggregates",
          involvedGenes: ["ATG5", "ATG7", "BECN1", "ULK1"],
        },
        {
          name: "Insulin/IGF-1 Signaling",
          description: "Improved insulin sensitivity reduces amyloid-beta accumulation",
          involvedGenes: ["INSR", "IGF1R", "IRS1", "AKT1"],
        },
      ],
      modelContributions: [
        {
          model: "DREAMwalk",
          weight: 0.42,
          rationale: "Graph embedding shows strong topological proximity between drug targets and disease-associated genes",
        },
        {
          model: "TxGNN",
          weight: 0.35,
          rationale: "Foundation model infers high therapeutic potential based on learned biomedical knowledge graph patterns",
        },
        {
          model: "XGBoost",
          weight: 0.23,
          rationale: "Molecular and phenotypic feature classification supports repurposing hypothesis",
        },
      ],
    },
  }

  return explanations.default
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 1,
    title: "Hetionet Dataset",
    description: "Comprehensive biomedical knowledge graph integrating 47,000+ nodes across drugs, diseases, genes, pathways, and anatomical entities",
    icon: "database",
    color: "#2563EB",
  },
  {
    id: 2,
    title: "Knowledge Graph Construction",
    description: "Multi-layer heterogeneous network construction with semantic edge typing and biological context preservation",
    icon: "graph",
    color: "#0F766E",
  },
  {
    id: 3,
    title: "DREAMwalk Embeddings",
    description: "Deep Representation learning via Enhanced rAndom walk on Multi-layer networks generating 128-dimensional node embeddings",
    icon: "embedding",
    color: "#14B8A6",
  },
  {
    id: 4,
    title: "XGBoost Prediction",
    description: "Gradient-boosted tree ensemble classifier leveraging molecular fingerprints, network features, and biological annotations",
    icon: "boost",
    color: "#2563EB",
  },
  {
    id: 5,
    title: "TxGNN Foundation Model",
    description: "Transformer-based Graph Neural Network pre-trained on 10M+ biomedical relationships for zero-shot drug repurposing inference",
    icon: "network",
    color: "#0F766E",
  },
  {
    id: 6,
    title: "Ensemble Intelligence",
    description: "Weighted aggregation of multi-model predictions with uncertainty quantification and calibration",
    icon: "ensemble",
    color: "#14B8A6",
  },
  {
    id: 7,
    title: "Drug Repurposing Recommendation",
    description: "Ranked therapeutic candidates with mechanistic explanations, confidence scores, and biological evidence",
    icon: "target",
    color: "#2563EB",
  },
]

export const ARCHITECTURE_SECTIONS: ArchitectureSection[] = [
  {
    id: "hetionet",
    title: "Hetionet Knowledge Graph",
    subtitle: "Biomedical Data Integration",
    description: "Hetionet integrates 47,000+ biomedical entities across 11 major types including drugs, diseases, genes, pathways, and anatomical structures, connected by over 2.25 million edges of 24 semantic relationship types. This comprehensive knowledge graph serves as the foundational data layer for all downstream predictions.",
    benefits: [
      "47,000+ integrated biomedical entities",
      "24 distinct semantic relationship types",
      "2.25M+ curated biological connections",
      "Multi-modal data unification",
    ],
    scientificRelevance: "Hetionet represents one of the most comprehensive public biomedical knowledge graphs, enabling systematic drug repurposing through network medicine principles.",
    details: [
      { label: "Nodes", value: "47,031" },
      { label: "Edges", value: "2,250,197" },
      { label: "Entity Types", value: "11" },
      { label: "Relationship Types", value: "24" },
    ],
    color: "#2563EB",
  },
  {
    id: "dreamwalk",
    title: "DREAMwalk Semantic Random Walks",
    subtitle: "Graph Representation Learning",
    description: "DREAMwalk (Deep Representation learning via Enhanced rAndoM walk) performs biased random walks on heterogeneous biomedical networks, generating 128-dimensional node embeddings that preserve both network topology and semantic relationships. The algorithm incorporates edge-type-aware sampling strategies for superior biological signal capture.",
    benefits: [
      "128-dimensional biological embeddings",
      "Edge-type-aware random walk strategy",
      "Preserves network topology and semantics",
      "Computationally efficient inference",
    ],
    scientificRelevance: "DREAMwalk embeddings capture both local and global network structure, enabling accurate prediction of novel drug-disease associations through topological similarity.",
    details: [
      { label: "Embedding Dim", value: "128" },
      { label: "Walk Length", value: "80" },
      { label: "Walks per Node", value: "10" },
      { label: "Window Size", value: "5" },
    ],
    color: "#0F766E",
  },
  {
    id: "xgboost",
    title: "XGBoost Classifier",
    subtitle: "Gradient Boosted Prediction",
    description: "XGBoost employs gradient-boosted decision trees on a comprehensive feature space combining molecular fingerprints (Morgan, MACCS), network topological features (node degree, betweenness centrality, clustering coefficient), and biological annotations (pathway membership, gene ontology terms). The model is trained on validated drug-disease associations.",
    benefits: [
      "Gradient-boosted ensemble learning",
      "Multi-modal feature integration",
      "Built-in feature importance ranking",
      "Handles class imbalance effectively",
    ],
    scientificRelevance: "XGBoost provides interpretable feature importance scores, enabling researchers to understand which molecular and network properties drive repurposing predictions.",
    details: [
      { label: "Trees", value: "500" },
      { label: "Max Depth", value: "8" },
      { label: "Learning Rate", value: "0.01" },
      { label: "Features", value: "2,847" },
    ],
    color: "#14B8A6",
  },
  {
    id: "txgnn",
    title: "TxGNN Foundation Model",
    subtitle: "Therapeutic Graph Neural Network",
    description: "TxGNN is a transformer-based graph neural network pre-trained on over 10 million biomedical relationships across multiple knowledge graphs. It employs a novel therapeutic attention mechanism that learns disease-specific drug representations, enabling zero-shot prediction for rare and understudied diseases.",
    benefits: [
      "10M+ pre-trained relationships",
      "Zero-shot prediction capability",
      "Disease-specific attention mechanism",
      "Transfer learning across therapeutic areas",
    ],
    scientificRelevance: "TxGNN represents a paradigm shift in drug repurposing by leveraging foundation model architectures to generalize across therapeutic domains with minimal fine-tuning.",
    details: [
      { label: "Parameters", value: "86M" },
      { label: "Pre-training Graphs", value: "5" },
      { label: "Attention Heads", value: "12" },
      { label: "Layers", value: "6" },
    ],
    color: "#2563EB",
  },
  {
    id: "ensemble",
    title: "Ensemble Prediction",
    subtitle: "Multi-Model Aggregation",
    description: "The ensemble module employs a weighted stacking approach combining DREAMwalk topological similarities, XGBoost feature-based predictions, and TxGNN foundation model inferences. Weights are optimized via Bayesian model averaging to maximize predictive accuracy while providing calibrated confidence estimates.",
    benefits: [
      "Bayesian model averaging",
      "Calibrated confidence scores",
      "Cross-model agreement metrics",
      "Uncertainty quantification",
    ],
    scientificRelevance: "Ensemble methods consistently outperform individual models in drug repurposing by combining complementary strengths: topological, feature-based, and deep learning approaches.",
    details: [
      { label: "Ensemble Method", value: "Bayesian Stacking" },
      { label: "Validation AUC", value: "0.94" },
      { label: "Precision@10", value: "0.88" },
      { label: "Recall@10", value: "0.92" },
    ],
    color: "#0F766E",
  },
]

export const MOCK_NETWORK_NODES = [
  { id: "metformin", type: "drug", label: "Metformin", x: 200, y: 150 },
  { id: "alzheimers", type: "disease", label: "Alzheimer's", x: 600, y: 150 },
  { id: "tp53", type: "gene", label: "TP53", x: 300, y: 300 },
  { id: "egfr", type: "gene", label: "EGFR", x: 450, y: 250 },
  { id: "vegfa", type: "gene", label: "VEGFA", x: 500, y: 350 },
  { id: "mtor", type: "gene", label: "MTOR", x: 350, y: 400 },
  { id: "ampk", type: "pathway", label: "AMPK", x: 150, y: 350 },
  { id: "autophagy", type: "pathway", label: "Autophagy", x: 700, y: 300 },
]

export const MOCK_NETWORK_EDGES = [
  { source: "metformin", target: "alzheimers", weight: 0.92 },
  { source: "metformin", target: "tp53", weight: 0.87 },
  { source: "metformin", target: "egfr", weight: 0.83 },
  { source: "metformin", target: "vegfa", weight: 0.79 },
  { source: "metformin", target: "mtor", weight: 0.76 },
  { source: "metformin", target: "ampk", weight: 0.95 },
  { source: "tp53", target: "alzheimers", weight: 0.72 },
  { source: "egfr", target: "alzheimers", weight: 0.68 },
  { source: "vegfa", target: "alzheimers", weight: 0.65 },
  { source: "mtor", target: "alzheimers", weight: 0.71 },
  { source: "ampk", target: "autophagy", weight: 0.88 },
  { source: "mtor", target: "autophagy", weight: 0.85 },
  { source: "ampk", target: "mtor", weight: 0.78 },
]
