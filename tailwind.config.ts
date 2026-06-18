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
        // Base — CSS vars for theme adaptation
        bg: {
          DEFAULT: "var(--bg-1)",
          secondary: "var(--bg-2)",
          card: "var(--glass-bg)",
        },
        // Glass — CSS vars for theme adaptation
        glass: {
          DEFAULT: "var(--glass-bg)",
          hover: "var(--glass-bg-hover)",
          border: "var(--glass-border)",
          strong: "var(--glass-bg-strong)",
        },
        // Accent — CSS vars for theme adaptation
        accent: {
          DEFAULT: "var(--accent)",
          green: "var(--accent)",
          cyan: "var(--accent-cyan)",
          blue: "#3B82F6",
          purple: "var(--accent-purple)",
          orange: "#F97316",
          amber: "#F59E0B",
          red: "#EF4444",
        },
        // Text — CSS vars so light/dark mode works automatically
        text: {
          primary: "var(--text-1)",
          secondary: "var(--text-2)",
          tertiary: "var(--text-3)",
          accent: "var(--accent)",
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
