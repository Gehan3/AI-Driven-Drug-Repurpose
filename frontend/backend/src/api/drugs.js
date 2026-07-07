import { Router } from "express"

const MOCK_DRUG_INFO = {
  Metformin: {
    id: "DB00331",
    name: "Metformin",
    synonyms: ["Dimethylbiguanide", "Glucophage", "Metformin HCl"],
    description: "Metformin is a biguanide antidiabetic agent used for the treatment of type 2 diabetes mellitus.",
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
    description: "Rapamycin is an mTOR inhibitor immunosuppressant agent used to prevent organ transplant rejection.",
    mechanismOfAction: "mTORC1 inhibitor; FKBP12 binding; autophagy inducer",
    targets: ["MTOR", "FKBP1A", "RPTOR"],
    sideEffects: ["Hyperlipidemia", "Thrombocytopenia", "Delayed wound healing"],
    clinicalTrials: 1856,
    drugBankId: "DB00877",
  },
}

const MOCK_DRUGS = [
  "Metformin", "Rapamycin", "Imatinib", "Rituximab", "Tocilizumab",
  "Doxycycline", "Valproic Acid", "Aspirin", "Curcumin", "Resveratrol",
  "Minocycline", "Lithium", "Tamoxifen", "Bevacizumab", "Methotrexate",
]

export const drugsRouter = Router()

drugsRouter.get("/drugs", (req, res) => {
  const { search } = req.query
  if (search) {
    const results = MOCK_DRUGS.filter((d) =>
      d.toLowerCase().includes(search.toLowerCase())
    )
    return res.json({ drugs: results, total: results.length })
  }
  res.json({ drugs: MOCK_DRUGS, total: MOCK_DRUGS.length })
})

drugsRouter.get("/drug/info", (req, res) => {
  const { name } = req.query
  const info = MOCK_DRUG_INFO[name]
  if (!info) {
    return res.status(404).json({ error: "Drug not found" })
  }
  res.json(info)
})
