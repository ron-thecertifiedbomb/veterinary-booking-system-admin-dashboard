/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ⚫ Core System
        background: "#000000",
        surface: "#0a0a0a",
        surfaceSoft: "#111111",
        border: "#1a1a1a",

        // 🧠 Text Hierarchy
        text: {
          primary: "#e5e7eb",
          secondary: "#9ca3af",
          muted: "#52525b",
          subtle: "#71717a",
        },

        // ⚡ Rondev Accent (IMPORTANT)
        accent: "#00e0ff",
        accentSoft: "#00e0ff15",
        accentBorder: "#00e0ff33",
      },

      borderRadius: {
        xl: "20px",
        "2xl": "24px",
      },

      fontSize: {
        hero: ["36px", { lineHeight: "42px" }],
      },

      letterSpacing: {
        widePlus: "0.2em",
      },
    },
  },
  plugins: [],
};
