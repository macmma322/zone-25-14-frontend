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
    },
  },
  plugins: [aspectRatio],
};

export default config;
