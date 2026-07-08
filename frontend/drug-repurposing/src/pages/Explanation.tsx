import { useState } from "react"
import { motion } from "framer-motion"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { GlassCard } from "@/components/ui/GlassCard"
import { ConfidenceGauge } from "@/components/ConfidenceGauge"
import { ProbabilityDistribution } from "@/components/ProbabilityDistribution"
import { NetworkGraph } from "@/components/NetworkGraph"
import { getModelExplanation } from "@/services/explanation"
import type { ModelExplanation } from "@/types"

export default function Explanation() {
  const [drugName, setDrugName] = useState("Metformin")
  const [diseaseName, setDiseaseName] = useState("Alzheimer's Disease")
  const [explanation, setExplanation] = useState<ModelExplanation | null>(null)
  const [loading, setLoading] = useState(false)

  const handleExplain = async () => {
    if (!drugName.trim() || !diseaseName.trim()) return
    setLoading(true)
    try {
      const data = await getModelExplanation(drugName, diseaseName)
      setExplanation(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Model Explainability"
          title="Why Was This Drug Recommended?"
          subtitle="Full transparency into the AI decision-making process with gene-level, pathway-level, and network-level evidence."
        />

        <div className="max-w-2xl mx-auto mb-12">
          <GlassCard className="p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Drug Name</label>
                <select
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option>Metformin</option>
                  <option>Rapamycin</option>
                  <option>Minocycline</option>
                  <option>Lithium</option>
                  <option>Curcumin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Disease Name</label>
                <select
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option>Alzheimer&apos;s Disease</option>
                  <option>Parkinson&apos;s Disease</option>
                  <option>Type 2 Diabetes</option>
                  <option>Breast Cancer</option>
                  <option>Glioblastoma</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleExplain}
              disabled={loading}
              className="mt-4 w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? "Analyzing..." : "Generate Explanation"}
            </button>
          </GlassCard>
        </div>

        {explanation && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6 flex flex-col items-center">
                <ConfidenceGauge
                  confidence={explanation.confidenceBreakdown.ensemble}
                  label="Ensemble Confidence"
                  size="sm"
                />
              </GlassCard>
              <GlassCard className="p-6 flex flex-col items-center">
                <ConfidenceGauge
                  confidence={explanation.confidenceBreakdown.dreamwalk}
                  label="DREAMwalk Score"
                  size="sm"
                />
              </GlassCard>
              <GlassCard className="p-6 flex flex-col items-center">
                <ConfidenceGauge
                  confidence={explanation.confidenceBreakdown.xgboost}
                  label="XGBoost Score"
                  size="sm"
                />
              </GlassCard>
              <GlassCard className="p-6 flex flex-col items-center">
                <ConfidenceGauge
                  confidence={explanation.confidenceBreakdown.txgnn}
                  label="TxGNN Score"
                  size="sm"
                />
              </GlassCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Reasoning Path</h3>
                <div className="space-y-4">
                  {explanation.reasoningPath.map((step) => (
                    <div key={step.step} className="relative pl-8 pb-4 border-l-2 border-primary/20 last:border-0 last:pb-0">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-white" />
                      <p className="text-sm font-medium text-foreground mb-1">{step.description}</p>
                      <ul className="space-y-1">
                        {step.evidence.map((e, i) => (
                          <li key={i} className="text-xs text-muted flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">&bull;</span>
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Model Contributions</h3>
                <ProbabilityDistribution
                  components={[
                    { name: "DREAMwalk", value: explanation.confidenceBreakdown.dreamwalk },
                    { name: "XGBoost", value: explanation.confidenceBreakdown.xgboost },
                    { name: "TxGNN", value: explanation.confidenceBreakdown.txgnn },
                  ]}
                />
                <div className="mt-6 space-y-3">
                  {explanation.modelContributions.map((mc) => (
                    <div key={mc.model} className="p-3 bg-white/60 rounded-xl">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{mc.model}</span>
                        <span className="text-sm font-semibold text-primary">
                          {(mc.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted">{mc.rationale}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Related Genes</h3>
                <div className="space-y-3">
                  {explanation.relatedGenes.map((gene) => (
                    <div key={gene.gene} className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                      <div>
                        <span className="text-sm font-medium font-mono text-accent">{gene.gene}</span>
                        <p className="text-xs text-muted mt-0.5">{gene.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-border/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full"
                            style={{ width: `${gene.associationScore * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-muted">
                          {(gene.associationScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Biological Pathways</h3>
                <div className="space-y-4">
                  {explanation.biologicalPathways.map((pw) => (
                    <div key={pw.name} className="p-4 bg-white/60 rounded-xl">
                      <h4 className="text-sm font-semibold text-foreground mb-1">{pw.name}</h4>
                      <p className="text-xs text-muted mb-2">{pw.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pw.involvedGenes.map((g) => (
                          <span
                            key={g}
                            className="px-2 py-0.5 bg-secondary/5 border border-secondary/10 rounded text-xs font-mono text-secondary"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Network Evidence</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-muted font-medium">Node Type</th>
                      <th className="text-left py-3 px-4 text-muted font-medium">Node Name</th>
                      <th className="text-right py-3 px-4 text-muted font-medium">Relationship Strength</th>
                    </tr>
                  </thead>
                  <tbody>
                    {explanation.networkEvidence.map((ne, i) => (
                      <tr key={i} className="border-b border-border/30 last:border-0">
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-primary/5 rounded text-xs font-medium text-primary">
                            {ne.nodeType}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{ne.nodeName}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-24 h-1.5 bg-border/60 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                style={{ width: `${ne.relationshipStrength * 100}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-muted">
                              {(ne.relationshipStrength * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold mb-4">Network Graph Visualization</h3>
              <NetworkGraph />
            </GlassCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}
