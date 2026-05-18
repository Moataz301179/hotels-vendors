/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#8B0000",
          crimson: {
            base: "#8B0000",
            light: "#1a4a7c",
            dark: "#011e3a",
          },
          gold: {
            base: "#e1a95f",
            light: "#f0c987",
            accent: "#C9A227",
          }
        },
        surface: {
          canvas: "#050505",
          1: "#0a0a0a",
          2: "#101010",
          3: "#1a1a1a",
        }
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      }
    },
  },
  plugins: [],
};
