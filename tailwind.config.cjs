/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path according to your project structure
  ],
  theme: {
    extend: {
      colors: {
        background: '#f0f0f0', // Example background color
        foreground: '#222222', // Example foreground color (text color)
        // Add other custom colors as needed
      },
    },
  },
  plugins: [],
};