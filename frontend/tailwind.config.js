/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#fcf9ef", // Custom cream background based on design
        primary: "#d4af37",    // Custom mustard gold
        success: "#4ade80",
        danger: "#ef4444",
        warning: "#f97316",    // Orange for streak
      }
    },
  },
  plugins: [],
}
