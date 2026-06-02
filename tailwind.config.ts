import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0E1A",
        "bg-secondary": "#151B2B",
        "bg-card": "#191F2F",
        "bg-card-hover": "#242A3A",
        "bg-input": "#242A3A",
        "text-primary": "#E8E4DA",
        "text-secondary": "#DDE2F8",
        "text-muted": "#E4BDBA",
        "accent-blue": "#4A7AFF",
        "accent-red": "#FF4B4B",
        "accent-rose": "#FFB3AE",
        "featured-bg": "rgba(255, 75, 75, 0.89)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
