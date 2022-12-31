const withAnimations = require("animated-tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = withAnimations({
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      animation: {
        flipY: "flipY .4s linear",
      },
      borderWidth: {
        6: "6px",
      },
      colors: {
        primary: "#355764",
        secondary: "#1d333d",
        success: "#52c41a",
        warning: "#fa8c16",
        error: "#ff4d4f",
        key: {
          primary: "#ffffff33",
          disabled: "#1d333d66",
        },
      },
      keyframes: {
        flipY: {
          "0%": { transform: "perspective(200px) rotateY(0deg)" },
          "49.99999%": { transform: "perspective(200px) rotateY(90deg)" },
          "50%": { transform: "perspective(200px) rotateY(-90deg)" },
          "100%": { transform: "perspective(200px) rotateY(0deg)" },
        },
      },
    },
  },
  plugins: [],
});
