import { motion } from "framer-motion"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { GlassCard } from "@/components/ui/GlassCard"
import { ARCHITECTURE_SECTIONS } from "@/lib/mock-data"

const MODEL_ARCHITECTURES = [
  {
    name: "DREAMwalk",
    tagline: "Graph Representation Learning on Biomedical Networks",
    color: "#0F766E",
    layers: [
      "Input: Heterogeneous Knowledge Graph (Hetionet)",
      "Edge-Type-Aware Random Walk Sampling",
      "Skip-Gram with Negative Sampling",
      "128-Dimensional Node Embeddings",
      "Cosine Similarity Scoring",
    ],
    stats: { parameters: "12.4M", trainingData: "2.25M edges", embeddingDim: "128" },
  },
  {
    name: "XGBoost",
    tagline: "Gradient-Boosted Decision Tree Classification",
    color: "#14B8A6",
    layers: [
      "Input: Multi-Modal Feature Vector (2,847 features)",
      "Molecular Fingerprints (Morgan + MACCS)",
      "Network Topological Features",
      "Biological Annotation Encoding",
      "Boosted Tree Ensemble (500 trees)",
    ],
    stats: { parameters: "1.2M", trainingData: "10K associations", trees: "500" },
  },
  {
    name: "TxGNN",
    tagline: "Transformer Graph Neural Network Foundation Model",
    color: "#2563EB",
    layers: [
      "Input: Multi-Knowledge Graph Integration",
      "Therapeutic-Specific Attention Mechanism",
      "Cross-Graph Message Passing (6 layers)",
      "Disease-Specific Drug Representations",
      "Zero-Shot Inference Head",
    ],
    stats: { parameters: "86M", trainingData: "10M+ relationships", attentionHeads: "12" },
  },
]

export default function Models() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="Model Architecture"
          title="Inside the AI Engine"
          subtitle="Three state-of-the-art machine learning architectures working in ensemble to identify novel drug-disease associations."
        />

        <div className="space-y-8 mb-20">
          {MODEL_ARCHITECTURES.map((model, idx) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <GlassCard className="overflow-hidden">
                <div className="grid lg:grid-cols-5">
                  <div
                    className="lg:col-span-2 p-8 lg:p-10 text-white"
                    style={{ backgroundColor: model.color }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold">{model.name}</h3>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-8">{model.tagline}</p>

                    <div className="space-y-3">
                      {Object.entries(model.stats).map(([key, val]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-white/70 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <span className="font-semibold text-white/90">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 p-8 lg:p-10">
                    <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-6">Architecture Pipeline</h4>
                    <div className="space-y-0">
                      {model.layers.map((layer, i) => (
                        <div key={i} className="flex items-start gap-4 pb-5 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ backgroundColor: model.color }}
                            >
                              {i + 1}
                            </div>
                            {i < model.layers.length - 1 && (
                              <div className="w-0.5 flex-1 min-h-[20px]" style={{ backgroundColor: model.color + "30" }} />
                            )}
                          </div>
                          <div className="pt-1.5">
                            <p className="text-sm text-foreground">{layer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <SectionTitle
          title="Architecture Details"
          subtitle="Comprehensive technical specifications for each model component."
        />

        <div className="space-y-12">
          {ARCHITECTURE_SECTIONS.map((section, idx) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="scroll-mt-24"
            >
              <GlassCard className="p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <div>
                    <h3 className="text-xl font-bold">{section.title}</h3>
                    <p className="text-sm text-muted">{section.subtitle}</p>
                  </div>
                </div>

                <p className="text-muted leading-relaxed mb-8">{section.description}</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {section.details.map((detail) => (
                    <div key={detail.label} className="p-4 bg-white/60 rounded-xl">
                      <p className="text-xs text-muted mb-1">{detail.label}</p>
                      <p className="text-lg font-bold font-mono" style={{ color: section.color }}>
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">Benefits</h4>
                    <ul className="space-y-2">
                      {section.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted">
                          <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted mb-1">Scientific Relevance</p>
                    <p className="text-sm text-foreground">{section.scientificRelevance}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
