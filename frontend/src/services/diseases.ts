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
    console.warn("Disease information API not available:", error)
  }
  return null
}

export async function searchDiseases(query: string): Promise<string[]> {
  try {
    if (API_BASE) {
      const response = await fetch(
        `${API_BASE}/api/diseases?search=${encodeURIComponent(query)}&limit=100`
      )
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data: { diseases?: string[] } = await response.json()
      return data.diseases || []
    }
  } catch (error) {
    console.warn("Disease search API not available:", error)
  }

  return []
}
