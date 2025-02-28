/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./dist/**/*.{html,js}"
  ],
  theme: {
    container: {
      center: true, // This will center the container by default
    },
    extend: {
      // Add any custom extensions here if needed
    },
  },
  plugins: [],
}
