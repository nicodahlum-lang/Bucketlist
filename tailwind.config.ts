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
        background: "#09090B",
        foreground: "#FAFAFA",
        accent: {
          primary: "#A855F7",
          secondary: "#C084FC",
          glass: "rgba(255, 255, 255, 0.03)",
          border: "rgba(255, 255, 255, 0.08)",
        },
      },
      backgroundImage: {
        "matte-gradient": "radial-gradient(circle at center, #18181B, #09090B)",
        "purple-glow": "radial-gradient(circle at 50% -20%, rgba(168, 85, 247, 0.15), transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
