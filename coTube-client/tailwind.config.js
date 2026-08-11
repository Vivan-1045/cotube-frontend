export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        cotube: {
          bg: "#020617",
          surface: "#0f172a",
          primary: "#2563eb",
          accent: "#38bdf8",
        },
      },

      boxShadow: {
        glow: "0 0 40px rgba(37, 99, 235, 0.15)",
      },
    },
  },

  plugins: [],
};