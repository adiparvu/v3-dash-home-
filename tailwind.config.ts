import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        bg: {
          DEFAULT: "#050A14",
          secondary: "#0B111E",
          card: "#111827",
        },
        // Glass
        glass: {
          DEFAULT: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.09)",
          border: "rgba(255,255,255,0.10)",
          strong: "rgba(255,255,255,0.12)",
        },
        // Accent
        accent: {
          green: "#4ADE80",
          cyan: "#22D3EE",
          blue: "#3B82F6",
          purple: "#7C3AED",
          orange: "#F97316",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        // Text
        text: {
          primary: "#FFFFFF",
          secondary: "#9CA3AF",
          tertiary: "#6B7280",
          accent: "#4ADE80",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-lg": "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
        glow: "0 0 20px rgba(74,222,128,0.25)",
        "glow-cyan": "0 0 20px rgba(34,211,238,0.25)",
        "glow-purple": "0 0 20px rgba(124,58,237,0.25)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
