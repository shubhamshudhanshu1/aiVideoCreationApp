import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b0c",
        mute: "#6b7280",
        brand: { DEFAULT: "#ff6a00", fg: "#ffffff" },
        card: "#ffffff",
        bg: "#fafafa",
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: { soft: "0 6px 24px rgba(0,0,0,0.08)" },
    },
  },
  plugins: [],
} satisfies Config;
