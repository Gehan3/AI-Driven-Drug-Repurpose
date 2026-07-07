"use client"

import { motion } from "framer-motion"

interface Props {
  confidence: number
  label: string
  size?: "sm" | "md" | "lg"
}

export function ConfidenceGauge({ confidence, label, size = "md" }: Props) {
  const radius = size === "lg" ? 70 : size === "md" ? 56 : 42
  const strokeWidth = size === "lg" ? 8 : size === "md" ? 7 : 6
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - confidence)
  const percentage = (confidence * 100).toFixed(1)

  const color =
    confidence >= 0.8
      ? "#0F766E"
      : confidence >= 0.6
        ? "#14B8A6"
        : confidence >= 0.4
          ? "#2563EB"
          : "#F59E0B"

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: (radius + strokeWidth) * 2, height: (radius + strokeWidth) * 2 }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${(radius + strokeWidth) * 2} ${(radius + strokeWidth) * 2}`}>
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform={`rotate(-90 ${radius + strokeWidth} ${radius + strokeWidth})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className={`font-bold ${size === "lg" ? "text-3xl" : "text-xl"}`}
            style={{ color }}
          >
            {percentage}%
          </motion.span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-muted">{label}</span>
    </div>
  )
}
