"use client"

import { motion } from "framer-motion"
import type { PredictionResult } from "@/types"
import { GlassCard } from "@/components/ui/GlassCard"
import { ConfidenceGauge } from "@/components/ConfidenceGauge"
import { DrugRankingChart } from "@/components/DrugRankingChart"
import { GeneImportanceChart } from "@/components/GeneImportanceChart"
import { ProbabilityDistribution } from "@/components/ProbabilityDistribution"

interface Props {
  result: PredictionResult
}

export function ResultsSection({ result }: Props) {
  const top = result.topPrediction
  const mode = result.mode ?? "both"
  const source = result.sourceEntity

  const label = mode === "both"
    ? "Top Candidate"
    : mode === "drug_to_disease"
      ? "Top Indication"
      : "Top Treatment"

  const subtitle = mode === "both"
    ? `for ${result.input.diseaseName}`
    : mode === "drug_to_disease"
      ? `Diseases associated with ${source?.name ?? result.input.drugName}`
      : `Drugs associated with ${source?.name ?? result.input.diseaseName}`

  const graphNodeCount = result.graphNodes?.length ?? 0
  const graphEdgeCount = result.graphEdges?.length ?? 0
  const pathwayCount = top.pathways.length
  const hasSupportingGenes = top.supportingGenes.length > 0
  const hasEvidenceComponents = top.modelSources.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Prediction Results</h2>
          <p className="text-sm text-muted mt-1">
            Processed in {result.processingTime} &middot; Ensemble Score: {(result.modelEnsembleScore * 100).toFixed(1)}% &middot;
            Mode: {mode === "both" ? "Pair Prediction" : mode === "drug_to_disease" ? "Drug to Diseases" : "Disease to Drugs"}
          </p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
          className="px-4 py-2 rounded-xl bg-green-50 border border-green-100"
        >
          <span className="text-sm font-semibold text-green-700">
            Hetionet Data
          </span>
        </motion.div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Source", "Hetionet graph"],
          ["Graph Nodes", graphNodeCount.toString()],
          ["Graph Edges", graphEdgeCount.toString()],
          ["Pathways", pathwayCount.toString()],
        ].map(([labelText, value]) => (
          <div key={labelText} className="rounded-xl border border-border/60 bg-white/70 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{labelText}</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full text-xs font-semibold text-primary mb-3">
                {label}
              </div>
              <h3 className="text-2xl font-bold">{top.drugName}</h3>
              <p className="text-sm text-muted mt-1">{subtitle}</p>
            </div>
            <ConfidenceGauge confidence={top.confidence} label="Confidence" size="md" />
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-semibold text-foreground mb-2">Supporting Genes</h4>
            <div className="flex flex-wrap gap-2">
              {top.supportingGenes.length > 0 ? top.supportingGenes.map((gene) => (
                <span
                  key={gene}
                  className="px-3 py-1 bg-accent/5 border border-accent/10 rounded-lg text-xs font-mono font-medium text-accent"
                >
                  {gene}
                </span>
              )) : (
                <span className="text-xs text-muted">Gene data available via pathway graph below</span>
              )}
            </div>
          </div>

          {hasEvidenceComponents && (
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2">Evidence Components</h4>
              <div className="space-y-2">
                {top.modelSources.map((ms) => (
                  <div key={ms.name} className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                    <div>
                      <span className="text-sm font-medium">{ms.name}</span>
                      <p className="text-xs text-muted mt-0.5">{ms.description}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {(ms.contribution * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            Hetionet Evidence
          </h4>
          <p className="text-sm text-muted leading-relaxed">
            {top.explanation}
          </p>

          {top.pathways.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <h4 className="text-sm font-semibold text-foreground mb-3">Related Pathways</h4>
              <div className="space-y-3">
                {top.pathways.map((pw) => (
                  <div key={pw.name}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{pw.name}</span>
                      <span className="text-xs text-muted font-mono">
                        {(pw.relevanceScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-border/60 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pw.relevanceScore * 100}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">
            {mode === "both" ? "Drug Ranking" : mode === "drug_to_disease" ? "Disease Ranking" : "Drug Ranking"}
          </h4>
          <DrugRankingChart predictions={result.predictions} />
        </GlassCard>

        <GlassCard className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Gene Importance</h4>
          {hasSupportingGenes ? (
            <GeneImportanceChart
              genes={top.supportingGenes.map((g, i) => ({
                gene: g,
                importance: Math.max(0.95 - i * 0.04, 0.1),
              }))}
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border/70 bg-white/50 px-4 text-center text-sm text-muted">
              No supporting gene list was returned for this top result. Check the pathway graph for available graph evidence.
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Evidence Contribution</h4>
          {hasEvidenceComponents ? (
            <ProbabilityDistribution
              components={top.modelSources.map((m) => ({
                name: m.name,
                value: m.contribution,
              }))}
            />
          ) : (
            <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border/70 bg-white/50 px-4 text-center text-sm text-muted">
              No evidence component breakdown was returned for this result.
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Why this suggestion?</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Hetionet Evidence</p>
                <p className="text-xs text-muted mt-0.5">
                  {top.explanation.length > 80 ? top.explanation.slice(0, 80) + "..." : top.explanation}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Biological Pathways</p>
                <p className="text-xs text-muted mt-0.5">
                  {top.pathways.length > 0
                    ? top.pathways.map((p) => p.name).join(", ")
                    : "See pathway graph below"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Network Evidence</p>
                <p className="text-xs text-muted mt-0.5">
                  Drug-Gene-Pathway-Disease connectivity score: {(result.modelEnsembleScore * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}
