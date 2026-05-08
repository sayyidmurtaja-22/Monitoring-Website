import fontFamily from "tailwindcss/defaultTheme";

module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }, // Efek kedip redup
        },
      },
      animation: {
        blink: "blink 1s linear infinite", // Animasi kedip 1 detik
      },
      fontFamily: {
        // "sans" adalah utility class bawaan tailwind (font-sans)
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"], // Ganti Poppins dengan font pilihan Anda
      },
    },
  },
  plugins: [],
};
