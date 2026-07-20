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
    console.warn("Drug information API not available:", error)
  }
  return null
}

export async function searchDrugs(query: string): Promise<string[]> {
  try {
    if (API_BASE) {
      const response = await fetch(
        `${API_BASE}/api/drugs?search=${encodeURIComponent(query)}&limit=100`
      )
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      const data: { drugs?: string[] } = await response.json()
      return data.drugs || []
    }
  } catch (error) {
    console.warn("Drug search API not available:", error)
  }

  return []
}
