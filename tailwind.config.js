/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "rgba(165, 126, 93, 1)",
      error: "red",
      link: "blue",
    },

    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    fontFamily: {
      sans: ["poppins", "arial"],
    },
    extend: {},
  },
  plugins: [],
};
