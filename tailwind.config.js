/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        karunya: {
          navy: "#0a2240",
          blue: "#0284c7",
          sky: "#0ea5e9",
          light: "#f0f7ff",
          accent: "#f59e0b",
          cyan: "#06b6d4",
          sidebar: "#ffffff",
          active: "#0072bc",
        },
      },
    },
  },
  plugins: [],
};
