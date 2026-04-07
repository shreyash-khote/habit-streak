/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FCF9F2", // Main cream background
        primary: "#A04040",    // Maroon/Red brand color
        nav: "#1B3022",         // Dark green bottom nav
        accent: "#FDE68A",      // Light yellow/amber for indicators
        card: "#F7F2E9",        // Soft tan for card backgrounds
        textMain: "#3A2E28",    // Deep brown for main titles
        textMuted: "#8C7A6B",   // Soft brown for secondary text
      }
    },
  },
  plugins: [],
}
