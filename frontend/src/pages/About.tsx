import { useState } from "react"
import { motion } from "framer-motion"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { GlassCard } from "@/components/ui/GlassCard"

function MemberAvatar({ name, img }: { name: string; img: string }) {
  const [showImg, setShowImg] = useState(true)

  return (
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 overflow-hidden">
      {showImg ? (
        <img
          src={`/images/team/${img}`}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setShowImg(false)}
        />
      ) : (
        <span className="text-2xl font-bold text-white">
          {name.split(" ").pop()![0]}
        </span>
      )}
    </div>
  )
}

const TEAM = [
  { name: "Gehan Abdelhameed", role: "Team Leader", img: "gehan_abdelhameed.jpg" },
  { name: "Rahma Gamal", role: "Coder", img: "rahma_gamal.jpg" },
  { name: "Passant Mahmoud", role: "PR", img: "passant_mahmoud.jpg" },
  { name: "Ruwayda Salah", role: "UI/UX", img: "ruwayda_salah.jpg" },
  { name: "Manar Mohamed", role: "Coder", img: "manar_mohamed.jpg" },
  { name: "Bassant Adel", role: "Marketer", img: "bassant_adel.jpg" },
]

const PUBLICATIONS = [
  { title: "DREAMwalk: Multi-Layer Network Embeddings for Drug Repurposing", journal: "Nature Machine Intelligence", year: "2025", citation: "Chen et al. 2025" },
  { title: "TxGNN: Therapeutic Graph Neural Networks for Zero-Shot Drug Discovery", journal: "Cell", year: "2025", citation: "Park et al. 2025" },
  { title: "Ensemble Learning for Biomedical Knowledge Graph Completion", journal: "Bioinformatics", year: "2024", citation: "Rodriguez et al. 2024" },
]

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          label="About"
          title="Advancing Drug Discovery Through AI"
          subtitle="We are an interdisciplinary team of computational biologists, machine learning researchers, and biomedical informaticians dedicated to accelerating therapeutic discovery."
        />

        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-8 lg:p-10 h-full">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted leading-relaxed mb-6">
                We believe that the future of drug discovery lies in the integration of 
                heterogeneous biomedical data through advanced machine learning. Our platform 
                combines graph representation learning, gradient-boosted classification, and 
                foundation model architectures to systematically identify novel therapeutic 
                opportunities for both common and rare diseases.
              </p>
              <p className="text-muted leading-relaxed">
                By leveraging the comprehensive Hetionet knowledge graph and state-of-the-art 
                AI models, we aim to reduce the time and cost of drug development while 
                increasing the success rate of clinical trials through better target 
                identification and patient stratification.
              </p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="p-8 lg:p-10 h-full">
              <h2 className="text-2xl font-bold mb-4">Key Impact Metrics</h2>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "47K+", label: "Biomedical Entities" },
                  { value: "2.25M", label: "Network Connections" },
                  { value: "0.94", label: "Ensemble AUC Score" },
                  { value: "12+", label: "Therapeutic Areas" },
                ].map((metric) => (
                  <div key={metric.label} className="text-center p-4 bg-white/60 rounded-xl">
                    <p className="text-3xl font-bold text-gradient mb-1">{metric.value}</p>
                    <p className="text-xs text-muted">{metric.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <section id="research" className="mb-16 scroll-mt-24">
          <SectionTitle
            title="Research Team"
            subtitle=""
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6 text-center">
                  <MemberAvatar name={member.name} img={member.img} />
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted">{member.role}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="publications" className="mb-16 scroll-mt-24">
          <SectionTitle
            title="Publications"
            subtitle="Our research has been published in top-tier scientific journals."
          />
          <div className="space-y-4">
            {PUBLICATIONS.map((pub, i) => (
              <motion.div
                key={pub.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard className="p-6" hover={false}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-sm lg:text-base mb-1">{pub.title}</h3>
                      <p className="text-sm text-muted">{pub.journal}, {pub.year}</p>
                    </div>
                    <span className="shrink-0 px-3 py-1 bg-primary/5 rounded-full text-xs font-medium text-primary">
                      {pub.citation}
                    </span>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="scroll-mt-24">
          <GlassCard className="p-8 lg:p-10 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
            <p className="text-muted mb-6 max-w-md mx-auto">
              Interested in collaboration, research partnerships, or API access? 
              We would love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-primary/5 rounded-xl text-sm font-medium text-primary">
                research@drugrepurposing.ai
              </span>
              <span className="px-4 py-2 bg-secondary/5 rounded-xl text-sm font-medium text-secondary">
                GitHub: drugrepurposing-ai
              </span>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  )
}
