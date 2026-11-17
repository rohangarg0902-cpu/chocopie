/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        choco: {
          bg: "#0B090A",
          surface: "#161315",
          card: "#1F1A1D",
          hover: "#2B2428",
          accent: "#E07A5F",
          accentHover: "#F28D72",
          gold: "#F2CC8F",
          text: "#F8F4F1",
          muted: "#A69B95",
        },
      },
    },
  },
  plugins: [],
}
