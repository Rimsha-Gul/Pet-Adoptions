/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pacifico: ["Pacifico", "cursive"],
      },
      textColor: {
        primary: "#ff5363",
        secondary: "#fb7a75",
        danger: "#e3342f",
      },
      colors: {
        primary: "#ff5363",
        secondary: {
          DEFAULT: "#fb7a75",
          100: "#fcd7c9",
          50: "#fed8d3",
          10: "#fef0e8",
        },
      },
      backgroundColor: {
        primary: "#ff5363",
      },
      borderColor: {
        primary: "#ff5363",
      },
    },
  },
  plugins: [],
};
