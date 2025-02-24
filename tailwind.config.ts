import type {Config} from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100vw', 
          }
        }
      },
      screens: {
        xs: "475px"
      },
      colors: {
        primary:  "#F09029",
        secondary: "#29BBF0",
        black: {
          "100": "#272c2e",
          DEFAULT: "#1f2425",
        },
        white: {
          "100": "#F7F7F7",
          DEFAULT: "#FFFFFF",
        },
      },
      fontFamily: {
        "inter": ["var(--font-inter-sans)"],
		"oxanium": ["var(--font-oxanium)"]
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config; 