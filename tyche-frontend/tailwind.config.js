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
        tychePrimary: "#652C7D",
        tycheGreen: "#61A179",
        tycheWhite: "#FFFAF3",
        tycheLightGray: "#F7F7F7",
        tycheDarkGray: "#D1D1CF",
        tycheRed: "#CF3830",
        tycheOrange: "#F58C38",
        tycheBlue: "#627EEA",
        tycheDarkBlue: "#03178C",
        tycheNewSurgeGreen: "#00FFA3",
        tycheNewOceanBlue: "#03E1FF",
        tycheNewPurpleDino: "#DC1FFF",
        tycheGrayBlack: "#646464",


        //old colors
        // tycheGreen: "#435334",
        // tycheBeige: "#FAF1E4",
        // tycheBlue: "#627EEA",
        // tycheRed: "#F21616",
        // tycheWhite: "#FFFAF3",
        // tycheGray: "#646464",
      },
    },
  },
  plugins: [],
};
