import { generateMockPrediction } from "@/lib/mock-data"
import type { PredictionInput, PredictionResult } from "@/types"

const API_BASE = import.meta.env.VITE_API_URL || ""
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true"

function validateEntityTypes(result: PredictionResult, input: PredictionInput): void {
  const onlyDrug = !!input.drugName && !input.diseaseName
  const onlyDisease = !!input.diseaseName && !input.drugName

  if (onlyDrug) {
    const knownDrugs = new Set([
      "Metformin", "Rapamycin", "Imatinib", "Rituximab", "Tocilizumab",
      "Doxycycline", "Valproic Acid", "Aspirin", "Curcumin", "Resveratrol",
      "Minocycline", "Lithium", "Tamoxifen", "Bevacizumab", "Methotrexate",
    ])
    const drugLike = result.predictions.filter((p) => knownDrugs.has(p.drugName))
    if (drugLike.length > 0 && result.predictions.length > 0) {
      throw new Error(
        `ENTITY-TYPE GUARD FAILED: drug_to_disease mode returned drug entities instead of diseases. ` +
        `First bad result: "${drugLike[0].drugName}". Expected disease names, got a known drug name.`
      )
    }
  }

  if (onlyDisease) {
    const knownDiseases = new Set([
      "Alzheimer's Disease", "Parkinson's Disease", "Type 2 Diabetes",
      "Breast Cancer", "Colorectal Cancer", "Rheumatoid Arthritis",
      "Multiple Sclerosis", "COVID-19", "Glioblastoma",
    ])
    const diseaseLike = result.predictions.filter((p) => knownDiseases.has(p.drugName))
    if (diseaseLike.length > 0 && result.predictions.length > 0) {
      throw new Error(
        `ENTITY-TYPE GUARD FAILED: disease_to_drug mode returned disease entities instead of drugs. ` +
        `First bad result: "${diseaseLike[0].drugName}". Expected drug name, got a known disease name.`
      )
    }
  }
}

export async function predictDrugRepurposing(
  input: PredictionInput
): Promise<PredictionResult> {
  if (USE_MOCK) {
    console.warn("[MOCK MODE] VITE_USE_MOCK=true — returning simulated data")
    const mockResult = generateMockPrediction(input)
    validateEntityTypes(mockResult, input)
    return mockResult
  }

  if (!API_BASE) {
    throw new Error(
      "Backend API URL is not configured (VITE_API_URL). " +
      "Start the backend with: cd backend && npm run dev"
    )
  }

  const response = await fetch(`${API_BASE}/api/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`API error (${response.status}): ${text || response.statusText}`)
  }
  const raw: any = await response.json()
  if (raw && raw.error) {
    throw new Error(`Model error: ${raw.error}`)
  }
  const result: PredictionResult = raw
  validateEntityTypes(result, input)
  return result
}
