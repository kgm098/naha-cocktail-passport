import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          100: "#fef9e7",
          200: "#fdefc3",
          300: "#fbe08a",
          400: "#f8cc4a",
          500: "#f5b700",
          600: "#d4a017",
          700: "#b8860b",
          800: "#9a6f08",
          900: "#7c5a05",
        },
        noir: {
          50: "#1a1a1a",
          100: "#141414",
          200: "#0f0f0f",
          300: "#0a0a0a",
          400: "#050505",
          500: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #d4a017 0%, #f8cc4a 50%, #d4a017 100%)",
        "dark-gradient": "linear-gradient(180deg, #0a0a0a 0%, #141414 100%)",
      },
      animation: {
        "stamp-appear": "stampAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      keyframes: {
        stampAppear: {
          "0%": { transform: "scale(0) rotate(-15deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(212, 160, 23, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(212, 160, 23, 0.7)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
