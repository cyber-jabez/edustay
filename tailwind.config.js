/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        lora: ["Lora", "Georgia", "'Times New Roman'", "serif"],
        sans: ["Poppins", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      colors: {
        karunya: {
          navy: "#0a2240",
          navyLight: "#0d2d52",
          blue: "#0284c7",
          sky: "#0ea5e9",
          light: "#f0f7ff",
          accent: "#f59e0b",
          cyan: "#06b6d4",
          sidebar: "#0a2240",
          active: "#0284c7",
          cardBg: "#ffffff",
          pageBg: "#f0f7ff",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)",
        cardHover: "0 4px 12px 0 rgba(2, 132, 199, 0.08)",
      },
    },
  },
  plugins: [],
};
