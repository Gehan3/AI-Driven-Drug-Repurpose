import { Router } from "express"
import { searchEntities } from "./hetionetEntities.js"

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

export const diseasesRouter = Router()

diseasesRouter.get("/diseases", (req, res) => {
  const { search, name, limit } = req.query
  const { results, total } = searchEntities("disease", search || name || "", limit)
  res.json({
    diseases: results.map((disease) => disease.name),
    items: results,
    total,
  })
})

diseasesRouter.get("/disease/info", (req, res) => {
  const { name } = req.query
  const info = MOCK_DISEASE_INFO[name]
  if (!info) {
    return res.status(404).json({ error: "Disease not found" })
  }
  res.json(info)
})
