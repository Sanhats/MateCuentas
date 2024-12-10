import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'yerba': '#6E8B3D',
        'madera': '#8B5A2B',
        'beige': '#F5F5DC',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'handwriting': ['Pacifico', 'cursive'],
      },

    },
  },
  plugins: [],
} satisfies Config;
