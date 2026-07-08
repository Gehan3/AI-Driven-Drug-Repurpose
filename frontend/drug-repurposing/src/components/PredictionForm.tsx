"use client"

import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import type { PredictionInput, PredictionMode } from "@/types"
import { searchDrugs } from "@/services/drugs"
import { searchDiseases } from "@/services/diseases"
import { GlassCard } from "@/components/ui/GlassCard"

interface Props {
  onPredict: (input: PredictionInput) => void
  loading: boolean
}

export function PredictionForm({ onPredict, loading }: Props) {
  const [drugName, setDrugName] = useState("")
  const [diseaseName, setDiseaseName] = useState("")
  const [drugSuggestions, setDrugSuggestions] = useState<string[]>([])
  const [diseaseSuggestions, setDiseaseSuggestions] = useState<string[]>([])
  const [showDrugSuggestions, setShowDrugSuggestions] = useState(false)
  const [showDiseaseSuggestions, setShowDiseaseSuggestions] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5)
  const [topK, setTopK] = useState(5)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const mode = useMemo<PredictionMode>(() => {
    if (drugName.trim() && diseaseName.trim()) return "both"
    if (drugName.trim()) return "drug_to_disease"
    if (diseaseName.trim()) return "disease_to_drug"
    return "both"
  }, [drugName, diseaseName])

  const handleDrugChange = useCallback(async (val: string) => {
    setDrugName(val)
    if (val.length >= 1) {
      const results = await searchDrugs(val)
      setDrugSuggestions(results)
      setShowDrugSuggestions(true)
    } else {
      setDrugSuggestions([])
      setShowDrugSuggestions(false)
    }
  }, [])

  const handleDiseaseChange = useCallback(async (val: string) => {
    setDiseaseName(val)
    if (val.length >= 1) {
      const results = await searchDiseases(val)
      setDiseaseSuggestions(results)
      setShowDiseaseSuggestions(true)
    } else {
      setDiseaseSuggestions([])
      setShowDiseaseSuggestions(false)
    }
  }, [])

  const handleSubmit = () => {
    if (!drugName.trim() && !diseaseName.trim()) return
    onPredict({
      drugName: drugName.trim(),
      diseaseName: diseaseName.trim(),
      confidenceThreshold,
      topK,
      mode,
    })
  }

  return (
    <GlassCard className="p-6 lg:p-8 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Drug Repurposing Prediction</h3>
          <p className="text-sm text-muted">Enter a drug, a disease, or both to explore connections</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Drug Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={drugName}
                onChange={(e) => handleDrugChange(e.target.value)}
                onFocus={() => drugSuggestions.length > 0 && setShowDrugSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDrugSuggestions(false), 200)}
                placeholder="e.g., Metformin"
                className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
            {showDrugSuggestions && drugSuggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 py-2 bg-white border border-border/60 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {drugSuggestions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onMouseDown={() => { setDrugName(d); setShowDrugSuggestions(false) }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-primary/5 transition-colors"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Disease Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={diseaseName}
                onChange={(e) => handleDiseaseChange(e.target.value)}
                onFocus={() => diseaseSuggestions.length > 0 && setShowDiseaseSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDiseaseSuggestions(false), 200)}
                placeholder="e.g., Alzheimer's Disease"
                className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>
            {showDiseaseSuggestions && diseaseSuggestions.length > 0 && (
              <div className="absolute z-20 w-full mt-1 py-2 bg-white border border-border/60 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                {diseaseSuggestions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onMouseDown={() => { setDiseaseName(d); setShowDiseaseSuggestions(false) }}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-primary/5 transition-colors"
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${advancedOpen ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            Advanced Filters
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: advancedOpen ? "auto" : 0, opacity: advancedOpen ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="pt-2 space-y-4">
            <div>
              <label className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Confidence Threshold</span>
                <span className="text-primary font-semibold font-mono">{confidenceThreshold.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                className="w-full mt-2 h-2 bg-border/60 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>0.0</span>
                <span>1.0</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Top K Predictions
                </label>
                <select
                  value={topK}
                  onChange={(e) => setTopK(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                >
                  {[3, 5, 10, 15, 20].map((k) => (
                    <option key={k} value={k}>{k} predictions</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center px-3 py-2 bg-primary/5 rounded-xl">
                <span className="text-xs text-muted">
                  Mode: {mode === "both" ? "Drug ↔ Disease (pair prediction)" : mode === "drug_to_disease" ? "Drug → Diseases (find indications)" : "Disease → Drugs (find treatments)"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <button
          onClick={handleSubmit}
          disabled={loading || (!drugName.trim() && !diseaseName.trim())}
          className="w-full py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              {mode === "both" ? "Generate Prediction" : mode === "drug_to_disease" ? "Find Related Diseases" : "Find Related Drugs"}
            </span>
          )}
        </button>
      </div>
    </GlassCard>
  )
}
