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
        secondary: "#fb7a75",
      },
    },
  },
  plugins: [],
};
