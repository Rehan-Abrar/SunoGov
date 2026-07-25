import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        urdu: ["'Noto Nastaliq Urdu'", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
