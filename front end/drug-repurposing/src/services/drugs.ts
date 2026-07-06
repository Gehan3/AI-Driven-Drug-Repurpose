import { MOCK_DRUG_INFO, MOCK_DRUGS } from "@/lib/mock-data"
import type { DrugInfo } from "@/types"

const API_BASE = import.meta.env.VITE_API_URL || ""

export async function getDrugInformation(
  drugName: string
): Promise<DrugInfo | null> {
  try {
    if (API_BASE) {
      const response = await fetch(
        `${API_BASE}/api/drugs?name=${encodeURIComponent(drugName)}`
      )
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      return await response.json()
    }
  } catch (error) {
    console.warn("API not available, using mock data:", error)
  }
  return MOCK_DRUG_INFO[drugName] || null
}

export async function searchDrugs(query: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_DRUGS.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase())
  )
}
