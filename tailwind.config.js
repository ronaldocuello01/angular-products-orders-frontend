/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        ink: "#12181F",
        paper: "#EDEBE1",
        card: "#FBFAF6",
        slate: "#4B5763",
        amber: "#D98A2B",
        teal: "#2F7D6B",
        brick: "#A63D33"
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"]
      }
    }
  },
  plugins: []
};
