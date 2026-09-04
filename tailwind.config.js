import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8F0",
        ink: "#231815",
        primary: {
          50: "#F6F1FC",
          100: "#EBE0F8",
          200: "#D3B9EF",
          300: "#B98DE3",
          400: "#9C5AD6",
          500: "#7E1FC4",
          600: "#6B159F",
          700: "#54107D",
          800: "#3F0E60",
          900: "#2C0A44",
          950: "#1A0629",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#F7C948",
          500: "#EAAC1F",
          600: "#C88A11",
          700: "#9C6A0C",
          800: "#7A5209",
          900: "#5C3D06",
          950: "#3D2703",
        },
      },
      fontFamily: {
        display: ["Poppins", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.04)",
        card: "0 20px 50px rgba(0,0,0,0.12)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInLeft: {
          "0%": { opacity: 0, transform: "translateX(-16px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease-out both",
        "fade-in": "fadeIn 0.3s ease-out both",
        fadeIn: "fadeIn 0.3s ease-out both",
        "slide-in-left": "slideInLeft 0.4s ease-out both",
        "spin-slow": "spinSlow 3s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
