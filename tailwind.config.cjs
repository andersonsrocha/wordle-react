/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      animation: {
        flip: "flip .4s linear",
        shake: "shake .6s linear",
        touch: "touch .2s ease-out",
      },
      transitionDelay: {
        0: "0ms",
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      borderWidth: {
        6: "6px",
      },
      colors: {
        primary: "#355764",
        secondary: "#1d333d",
        success: "#73d13d",
        warning: "#ffec3d",
        error: "#ff4d4f",

        key: {
          primary: "#ffffff33",
          disabled: "#1d333d66",
        },
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translateX(-1px)" },
          "20%, 80%": { transform: "translateX(2px)" },
          "30%, 50%, 70%": { transform: "translateX(-4px)" },
          "40%, 60%": { transform: "translateX(4px)" },
        },
        flip: {
          "0%": { transform: "perspective(200px) rotateY(0deg)" },
          "49.99999%": { transform: "perspective(200px) rotateY(90deg)" },
          "50%": { transform: "perspective(200px) rotateY(-90deg)" },
          "100%": { transform: "perspective(200px) rotateY(0deg)" },
        },
        touch: {
          "0%": { transform: "perspective(200px) translateZ(0)" },
          "25%": { transform: "perspective(200px) translateZ(30px)" },
          "100%": { transform: "perspective(200px) translateZ(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
