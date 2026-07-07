import { Router } from "express"

const MOCK_DISEASE_INFO = {
  "Alzheimer's Disease": {
    id: "OMIM:104300",
    name: "Alzheimer's Disease",
    description: "Alzheimer disease is a progressive neurodegenerative disorder characterized by memory loss, cognitive decline, and behavioral changes.",
    associatedGenes: ["APP", "PSEN1", "PSEN2", "APOE", "CLU", "BIN1", "PICALM"],
    prevalence: "1 in 9 individuals over 65",
    omimId: "104300",
    pathways: ["Amyloid processing", "Tau pathology", "Neuroinflammation", "Oxidative stress"],
  },
  "Type 2 Diabetes": {
    id: "OMIM:125853",
    name: "Type 2 Diabetes",
    description: "Type 2 diabetes is a metabolic disorder characterized by insulin resistance and relative insulin deficiency.",
    associatedGenes: ["TCF7L2", "PPARG", "FTO", "KCNJ11", "HNF1B"],
    prevalence: "1 in 10 adults worldwide",
    omimId: "125853",
    pathways: ["Insulin signaling", "Glucose metabolism", "Adipocytokine signaling"],
  },
}

const MOCK_DISEASES = [
  "Alzheimer's Disease", "Parkinson's Disease", "Type 2 Diabetes",
  "Breast Cancer", "Colorectal Cancer", "Rheumatoid Arthritis",
  "Multiple Sclerosis", "COVID-19", "Glioblastoma", "Hepatitis C",
  "HIV/AIDS", "Lupus Erythematosus", "Crohn's Disease", "Asthma",
  "Myocardial Infarction",
]

export const diseasesRouter = Router()

diseasesRouter.get("/diseases", (req, res) => {
  const { search } = req.query
  if (search) {
    const results = MOCK_DISEASES.filter((d) =>
      d.toLowerCase().includes(search.toLowerCase())
    )
    return res.json({ diseases: results, total: results.length })
  }
  res.json({ diseases: MOCK_DISEASES, total: MOCK_DISEASES.length })
})

diseasesRouter.get("/disease/info", (req, res) => {
  const { name } = req.query
  const info = MOCK_DISEASE_INFO[name]
  if (!info) {
    return res.status(404).json({ error: "Disease not found" })
  }
  res.json(info)
})
