/** @type {import('tailwindcss').Config} */
import aspectRatio from "@tailwindcss/aspect-ratio";

const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      aspectRatio: {
        tall: "9 / 16",
        square: "1 / 1",
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        bounce: "bounce 0.6s infinite ease-in-out",
      },
      colors: {
        // Custom niche colors for Zone 25-14
        otaku: "#FF2D00",
        stoikr: "#FFD300",
        wd: "#3F51B5",
        peros: "#8E735B",
        crithit: "#FF5F1F",
        grid: "#39FF14",
        syndicate: "#86608E",
      },
    },
  },
  plugins: [aspectRatio],
};

export default config;
