import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { PredictionInput, PredictionResult } from "@/types"
import { predictDrugRepurposing } from "@/services/prediction"
import { PredictionForm } from "@/components/PredictionForm"
import { ResultsSection } from "@/components/ResultsSection"
import { NetworkGraph } from "@/components/NetworkGraph"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { GlassCard } from "@/components/ui/GlassCard"

export default function Dashboard() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async (input: PredictionInput) => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictDrugRepurposing(input)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prediction failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Prediction Dashboard"
          title="Drug Repurposing Prediction Engine"
          subtitle="Enter a drug-disease pair to generate AI-powered repurposing recommendations with full model explainability."
        />

        <div className="max-w-2xl mx-auto mb-12">
          <PredictionForm onPredict={handlePredict} loading={loading} />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-secondary/20 border-t-secondary animate-spin" style={{ animationDirection: "reverse", animationDuration: "1s" }} />
              </div>
              <p className="text-lg font-semibold text-foreground">Generating Prediction</p>
              <p className="text-sm text-muted mt-1">
                Querying Hetionet knowledge graph (47K nodes, 2.25M edges) &mdash; may take up to a minute on first load
              </p>
              <div className="mt-4 flex gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">Loading graph</span>
                <span className="px-3 py-1 text-xs rounded-full bg-secondary/10 text-secondary border border-secondary/20">Traversing pathways</span>
                <span className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent border border-accent/20">Scoring candidates</span>
              </div>
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultsSection result={result} />

              <section className="mt-12">
                <SectionTitle
                  title="Pathway Graph Visualization"
                  subtitle="Drug-Gene-Pathway-Disease connections from Hetionet, showing the biological pathways linking compounds to indications."
                />
                <GlassCard className="p-4 lg:p-6">
                  <NetworkGraph nodes={result.graphNodes} edges={result.graphEdges} />
                </GlassCard>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
