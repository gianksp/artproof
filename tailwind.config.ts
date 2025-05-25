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
        background: "var(--background)",
        foreground: "var(--foreground)",

        brand: {
          primary: "#2E2E3A",       // Charcoal Blue (main)
          olive: "#5C715E",         // Olive accent
          yellow: "#F5C518",        // IMDb Yellow for CTA
          secondary: "#D9E2EC",     // Gray-blue soft background
          light: "#F8F9FA",         // Base light background
          textDark: "#1F2937",      // For headers
          textLight: "#6B7280",     // Subtext, muted
          success: "#2FA36D",       // Green confirmation
          error: "#C62828",         // Red for errors
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
