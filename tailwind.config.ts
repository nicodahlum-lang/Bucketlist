import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#1A1A1A",
        accent: {
          primary: "#7C3AED",
          secondary: "#A78BFA",
          glass: "rgba(124, 58, 237, 0.05)",
          border: "rgba(124, 58, 237, 0.15)",
        },
      },
      backgroundImage: {
        "matte-gradient": "linear-gradient(135deg, #F8F7FF, #FAF5FF)",
        "purple-glow": "radial-gradient(circle at 50% -20%, rgba(124, 58, 237, 0.1), transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
