"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { NetworkBackground } from "@/components/NetworkBackground"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-[#F8FAFC] via-white to-[#F0FDFA]">
      <NetworkBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-primary/5 border border-primary/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                AI-Powered Drug Discovery Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">AI-Powered </span>
              <span className="text-gradient">Drug Repurposing</span>
              <span className="text-foreground"> Platform</span>
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-muted leading-relaxed max-w-xl">
              Discover novel therapeutic opportunities through multi-layer biomedical
              network learning and graph foundation models.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Start Prediction
                <svg className="inline-block w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                to="/models"
                className="px-8 py-3.5 text-base font-semibold text-foreground bg-white/70 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-8 text-sm text-muted">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["#0F766E", "#2563EB", "#14B8A6"].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <span>Trusted by researchers</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>4.9/5 from 200+ reviews</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <svg viewBox="0 0 500 500" className="w-full h-full" fill="none">
                <defs>
                  <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="drug-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0F766E" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                  <linearGradient id="disease-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                  <linearGradient id="gene-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>

                <circle cx="250" cy="250" r="200" fill="url(#hero-glow)" />

                <g className="animate-float">
                  <circle cx="250" cy="250" r="55" fill="url(#drug-grad)" opacity="0.15" />
                  <circle cx="250" cy="250" r="40" fill="url(#drug-grad)" opacity="0.2" />
                  <rect x="232" y="230" width="36" height="12" rx="6" fill="white" opacity="0.9" />
                  <rect x="220" y="248" width="60" height="8" rx="4" fill="white" opacity="0.7" />
                  <rect x="228" y="262" width="44" height="8" rx="4" fill="white" opacity="0.5" />
                </g>

                <g className="animate-float-delayed">
                  <circle cx="140" cy="180" r="30" fill="url(#disease-grad)" opacity="0.2" />
                  <circle cx="140" cy="180" r="20" fill="url(#disease-grad)" opacity="0.3" />
                  <rect x="125" y="168" width="30" height="8" rx="4" fill="white" opacity="0.9" />
                  <rect x="120" y="182" width="40" height="6" rx="3" fill="white" opacity="0.6" />
                </g>

                <g style={{ animation: "float 7s ease-in-out infinite", animationDelay: "2s" }}>
                  <circle cx="360" cy="180" r="25" fill="url(#gene-grad)" opacity="0.2" />
                  <circle cx="360" cy="180" r="16" fill="url(#gene-grad)" opacity="0.3" />
                  <rect x="345" y="170" width="30" height="7" rx="3.5" fill="white" opacity="0.9" />
                  <rect x="340" y="182" width="40" height="6" rx="3" fill="white" opacity="0.6" />
                </g>

                <g className="animate-float" style={{ animationDelay: "4s" }}>
                  <circle cx="360" cy="340" r="22" fill="url(#drug-grad)" opacity="0.2" />
                  <circle cx="360" cy="340" r="14" fill="url(#drug-grad)" opacity="0.3" />
                  <rect x="348" y="332" width="24" height="6" rx="3" fill="white" opacity="0.9" />
                  <rect x="343" y="344" width="34" height="6" rx="3" fill="white" opacity="0.6" />
                </g>

                <g className="animate-float" style={{ animationDelay: "1.5s" }}>
                  <circle cx="140" cy="340" r="28" fill="url(#disease-grad)" opacity="0.2" />
                  <circle cx="140" cy="340" r="18" fill="url(#disease-grad)" opacity="0.3" />
                  <rect x="127" y="330" width="26" height="7" rx="3.5" fill="white" opacity="0.9" />
                  <rect x="120" y="344" width="40" height="6" rx="3" fill="white" opacity="0.6" />
                </g>

                <line x1="140" y1="180" x2="250" y2="250" stroke="#0F766E" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
                <line x1="360" y1="180" x2="250" y2="250" stroke="#2563EB" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
                <line x1="140" y1="340" x2="250" y2="250" stroke="#14B8A6" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
                <line x1="360" y1="340" x2="250" y2="250" stroke="#2563EB" strokeWidth="1.5" opacity="0.3" strokeDasharray="4 4" />
                <line x1="140" y1="180" x2="360" y2="180" stroke="#0F766E" strokeWidth="1" opacity="0.15" strokeDasharray="3 3" />
                <line x1="140" y1="340" x2="360" y2="340" stroke="#14B8A6" strokeWidth="1" opacity="0.15" strokeDasharray="3 3" />

                <text x="250" y="255" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="system-ui">
                  DRUG
                </text>
              </svg>

              <div className="absolute -top-4 -right-4 w-24 h-24 border border-primary/10 rounded-2xl rotate-12" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-secondary/10 rounded-2xl -rotate-6" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
