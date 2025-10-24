/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        grad:'linear-gradient(135deg, hsl(270 80% 25%), hsl(45 100% 60%))'
      }
    },
  },
  plugins: [],
}

