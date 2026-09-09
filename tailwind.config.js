const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "class",
  plugins: [],
  theme: {
    extend: {
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.25rem" }],
        sm: ["0.9375rem", { lineHeight: "1.35rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        md: ["1.0625rem", { lineHeight: "1.6rem" }],
        lg: ["1.25rem", { lineHeight: "1.55rem" }],
        xl: ["1.5rem", { lineHeight: "1.2" }],
        "2xl": ["1.875rem", { lineHeight: "1.15" }],
      },
      colors: {
        mint: "#f2fcf8",
        darkmint: "#ebfff5",
      },
      screens: {
        sm: "420px",
        md: "600px",
        lg: "768px",
      },
    },
  },
};
