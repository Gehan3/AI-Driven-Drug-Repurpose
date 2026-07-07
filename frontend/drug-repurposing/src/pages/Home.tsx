import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Hero } from "@/components/Hero"
import { Pipeline } from "@/components/Pipeline"
import { ArchitectureSection } from "@/components/ArchitectureSection"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { GlassCard } from "@/components/ui/GlassCard"
import { ARCHITECTURE_SECTIONS } from "@/lib/mock-data"

export default function Home() {
  return (
    <>
      <Hero />

      <Pipeline />

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            label="Architecture"
            title="Multi-Layer Network Learning Architecture"
            subtitle="Five integrated modules working in concert to identify novel drug-disease associations through heterogeneous graph learning and ensemble intelligence."
          />
          {ARCHITECTURE_SECTIONS.map((section, idx) => (
            <ArchitectureSection
              key={section.id}
              section={section}
              reversed={idx % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-[#F0FDFA] via-white to-[#EFF6FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase text-primary bg-primary/5 rounded-full">
                Get Started
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                Ready to discover
                <span className="text-gradient"> novel therapeutics</span>?
              </h2>
              <p className="text-muted leading-relaxed">
                Leverage our multi-layer graph learning platform to identify
                promising drug repurposing candidates for your disease of interest.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <GlassCard className="p-8 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Run Prediction</h3>
                <p className="text-sm text-muted mb-6">
                  Input a drug and disease to receive AI-powered repurposing
                  recommendations with full explainability.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary transition-colors"
                >
                  Start Prediction
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard className="p-8 h-full">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Explore Models</h3>
                <p className="text-sm text-muted mb-6">
                  Dive deep into our DREAMwalk, XGBoost, and TxGNN model
                  architecture and training methodology.
                </p>
                <Link
                  to="/models"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-primary transition-colors"
                >
                  View Architecture
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
