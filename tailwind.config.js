/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "rgba(165, 126, 93, 1)",
    },
    width: {
      "w-full": "width:100%;",
      "230px": "230px",
      "280px": "280px",
      "400px": "400px",
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
