import { MOCK_DISEASE_INFO, MOCK_DISEASES } from "@/lib/mock-data"
import type { DiseaseInfo } from "@/types"

const API_BASE = import.meta.env.VITE_API_URL || ""

export async function getDiseaseInformation(
  diseaseName: string
): Promise<DiseaseInfo | null> {
  try {
    if (API_BASE) {
      const response = await fetch(
        `${API_BASE}/api/diseases?name=${encodeURIComponent(diseaseName)}`
      )
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      return await response.json()
    }
  } catch (error) {
    console.warn("API not available, using mock data:", error)
  }
  return MOCK_DISEASE_INFO[diseaseName] || null
}

export async function searchDiseases(query: string): Promise<string[]> {
  await new Promise((r) => setTimeout(r, 100))
  return MOCK_DISEASES.filter((d) =>
    d.toLowerCase().includes(query.toLowerCase())
  )
}
