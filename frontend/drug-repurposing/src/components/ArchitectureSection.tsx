"use client"

import { motion } from "framer-motion"
import type { ArchitectureSection as ArchSection } from "@/types"
import { GlassCard } from "@/components/ui/GlassCard"
import { SectionTitle } from "@/components/ui/SectionTitle"

interface Props {
  section: ArchSection
  reversed?: boolean
}

export function ArchitectureSection({ section, reversed = false }: Props) {
  return (
    <section id={section.id} className="py-16 lg:py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label={section.subtitle}
          title={section.title}
          subtitle=""
          align="left"
        />
        <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-start ${reversed ? "lg:flex-row-reverse" : ""}`}>
          <motion.div
            initial={{ opacity: 0, x: reversed ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-muted leading-relaxed text-lg">
              {section.description}
            </p>

            <div className="grid grid-cols-2 gap-3">
              {section.benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-white/60"
                >
                  <svg className="w-4 h-4 mt-0.5 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-sm text-muted leading-relaxed">
                <span className="font-semibold text-primary">Scientific Relevance: </span>
                {section.scientificRelevance}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: reversed ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassCard className="p-6 lg:p-8">
              <h4 className="text-sm font-semibold text-muted uppercase tracking-wider mb-6">
                Technical Specifications
              </h4>
              <div className="space-y-5">
                {section.details.map((detail, i) => (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between pb-4 border-b border-border/50 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-muted">{detail.label}</span>
                    <span className="text-sm font-semibold font-mono" style={{ color: section.color }}>
                      {detail.value}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Model Status</span>
                  <span className="flex items-center gap-1.5 text-green-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Production Ready
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
