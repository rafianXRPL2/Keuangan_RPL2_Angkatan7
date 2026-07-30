/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          1: '#fbbf24',
          2: '#f59e0b',
          3: '#d97706',
          4: '#b45309',
        },
        navy: {
          obsidian: '#0f172a',
          slate: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
