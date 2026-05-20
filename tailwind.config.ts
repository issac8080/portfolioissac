import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      colors: {
        ai: {
          bg: "#0a0a0f",
          surface: "rgba(15, 15, 25, 0.7)",
          border: "rgba(125, 211, 252, 0.22)",
          glow: "#38f9d7",
          accent: "#7dd3fc",
          violet: "#c4b5fd",
          magenta: "#f0abfc",
          amber: "#fcd34d",
          rose: "#fda4af",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": {
            opacity: "1",
            boxShadow:
              "0 0 18px rgba(56, 249, 215, 0.28), 0 0 36px rgba(196, 181, 253, 0.18), 0 0 24px rgba(125, 211, 252, 0.15)",
          },
          "50%": {
            opacity: "0.88",
            boxShadow:
              "0 0 28px rgba(56, 249, 215, 0.4), 0 0 48px rgba(240, 171, 252, 0.22), 0 0 32px rgba(125, 211, 252, 0.2)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise": "url('/noise.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
