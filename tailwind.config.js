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
        runLine: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        }
      },
      animation: {
        blink: "blink 1s linear infinite", // Animasi kedip 1 detik
        "run-line": "runLine 2.5s infinite linear",
        "float": "float 2s infinite ease-in-out",
      },
      fontFamily: {
        // "sans" adalah utility class bawaan tailwind (font-sans)
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"], // Ganti Poppins dengan font pilihan Anda
        pliant: ["Pliant", "sans-serif"],
      },
    },
  },
  plugins: [],
};
