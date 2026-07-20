"use client"

import { motion } from "framer-motion"

interface SectionTitleProps {
  label?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
}

export function SectionTitle({ label, title, subtitle, align = "center" }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} mb-12 lg:mb-16`}
    >
      {label && (
        <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider uppercase text-primary bg-primary/5 rounded-full">
          {label}
        </span>
      )}
      <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
