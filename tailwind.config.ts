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
        gold: {
          400: "#FFD700",
          500: "#FFC200",
          600: "#E6AC00",
        },
        verde: {
          400: "#00C851",
          500: "#00A040",
          600: "#007A30",
        },
        dark: {
          900: "#0A0A0F",
          800: "#12121A",
          700: "#1A1A26",
          600: "#22223A",
          500: "#2A2A4A",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "swipe-right": "swipeRight 0.3s ease-out forwards",
        "swipe-left": "swipeLeft 0.3s ease-out forwards",
        "card-enter": "cardEnter 0.3s ease-out",
        shimmer: "shimmer 2s infinite",
        "pulse-gold": "pulseGold 2s infinite",
      },
      keyframes: {
        swipeRight: {
          "0%": { transform: "rotate(0deg) translateX(0)" },
          "100%": { transform: "rotate(20deg) translateX(200%)", opacity: "0" },
        },
        swipeLeft: {
          "0%": { transform: "rotate(0deg) translateX(0)" },
          "100%": {
            transform: "rotate(-20deg) translateX(-200%)",
            opacity: "0",
          },
        },
        cardEnter: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 10px #FFD700" },
          "50%": { boxShadow: "0 0 30px #FFD700, 0 0 60px #FFD70066" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
