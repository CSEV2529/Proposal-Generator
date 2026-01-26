import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        csev: {
          green: '#3CB371',
          'green-dark': '#2E8B57',
          'green-light': '#90EE90',
        },
      },
    },
  },
  plugins: [],
}
export default config
