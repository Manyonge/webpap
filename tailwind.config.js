/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      primary: "rgba(165, 126, 93, 1)",
      error: "#890404",
      link: "blue",
      info: "#416C85",
      success: "#428541",
      warning: "#D6A476",
      white: "#fff",
      grey: "grey",
      lightGrey: "lightGrey",
      black: "#000",
    },
    data: {
      checked: 'ui~="checked"',
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
    extend: {
      animation: {
        "spin-slow": "spin 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
