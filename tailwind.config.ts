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
        background: "#0B0E11",
        foreground: "#F0F2F5",
        accent: {
          primary: "#3B82F6",
          secondary: "#A855F7",
          glass: "rgba(255, 255, 255, 0.05)",
          border: "rgba(255, 255, 255, 0.1)",
        },
      },
      backgroundImage: {
        "liquid-gradient": "radial-gradient(circle at top left, #1E293B, #0B0E11)",
        "glow-mesh": "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 50%)",
      },
    },
  },
  plugins: [],
};
export default config;
