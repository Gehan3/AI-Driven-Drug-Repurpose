import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        foreground: "#111827",
        primary: "#0F766E",
        secondary: "#14B8A6",
        accent: "#2563EB",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        muted: "#64748B",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        card: "0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
        "lg-soft": "0 4px 16px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
}

export default config
