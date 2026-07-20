import { Router } from "express"

export const explainRouter = Router()

explainRouter.get("/explain", (req, res) => {
  const { drug, disease } = req.query

  res.json({
    drugName: drug || "Metformin",
    diseaseName: disease || "Alzheimer's Disease",
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
      { nodeType: "Drug", nodeName: drug || "Metformin", relationshipStrength: 1.0 },
      { nodeType: "Disease", nodeName: disease || "Alzheimer's Disease", relationshipStrength: 0.92 },
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
  })
})
