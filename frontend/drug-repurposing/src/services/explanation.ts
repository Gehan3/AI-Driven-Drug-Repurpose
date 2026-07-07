import { generateMockExplanation } from "@/lib/mock-data"
import type { ModelExplanation } from "@/types"

const API_BASE = import.meta.env.VITE_API_URL || ""

export async function getModelExplanation(
  drugName: string,
  diseaseName: string
): Promise<ModelExplanation> {
  try {
    if (API_BASE) {
      const response = await fetch(
        `${API_BASE}/api/explain?drug=${encodeURIComponent(drugName)}&disease=${encodeURIComponent(diseaseName)}`
      )
      if (!response.ok) throw new Error(`API error: ${response.status}`)
      return await response.json()
    }
  } catch (error) {
    console.warn("API not available, using mock data:", error)
  }
  return generateMockExplanation(drugName, diseaseName)
}
