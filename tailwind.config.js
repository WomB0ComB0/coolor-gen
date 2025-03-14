/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#5465ffff',
        'cornflower-blue': '#788bffff',
        'jordy-blue': '#9bb1ffff',
        'periwinkle': '#bfd7ffff',
        'light-cyan': '#e2fdffff',
      },
    },
  },
  plugins: [],
};