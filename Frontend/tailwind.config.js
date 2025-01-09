/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "320px",
      md: "425px",
      lg: "768px",
      xl: "1024px",
      "2xl": "1440px",
    },

    fontFamily: {
      sans: ['"Roboto"', "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
