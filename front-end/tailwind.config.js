/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{html,js,jsx}"],
  theme: {
    colors: {
      backgroundColor: "rgb(var(--color-bg) / <alpha-value>)",
      primaryColor: "rgb(var(--color-primary) / <alpha-value>)",
      secondaryColor: "rgb(var(--color-secondary) / <alpha-value>)",
      yellow: "rgb(var(--color-yellow) / <alpha-value>)",
      white: "rgb(var(--color-white) / <alpha-value>)",
      black: "rgb(var(--color-black) / <alpha-value>)",
      ascent: {
        1: "rgb(var(--color-ascent1) / <alpha-value>)",
        2: "rgb(var(--color-ascent2) / <alpha-value>)",
      },
    },

    screens: {
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",

      xxl: "1536px",
    },

    extend: {},
  },
  plugins: [],
};
