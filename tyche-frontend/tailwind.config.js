/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,jsx,tsx,mdx}",
    "./src/components/**/*.{js,jsx,tsx,mdx}",
    "./src/app/**/*.{js,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tycheGreen: "#435334",
        tycheBeige: "#FAF1E4",
        tycheBlue: "#627EEA",
        tycheRed: "#F21616",
        tycheWhite: "#FFFAF3",
        tycheGray: "#646464",
      },
    },
  },
  plugins: [],
};
