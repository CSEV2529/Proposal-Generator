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
        // ChargeSmart Dark Theme Palette (matched to Sales Enablement)
        csev: {
          // Primary green accent
          green: '#4CBC88',
          'green-dark': '#3da876',
          'green-light': '#6dd4a5',
          'green-glow': 'rgba(76, 188, 136, 0.3)',
          // Dark background colors (neutral grays, no blue tint)
          'slate-900': '#1a1a1a',
          'slate-800': '#242424',
          'slate-700': '#3a3a3a',
          'slate-600': '#505050',
          // Text colors for dark theme
          'text-primary': '#e8e8e8',
          'text-secondary': '#888888',
          'text-muted': '#505050',
          // Card/panel backgrounds
          'panel': '#242424',
          'panel-light': '#2e2e2e',
          // Border colors
          'border': '#3a3a3a',
          'border-light': '#505050',
          // Additional surface colors
          'elevated': '#2e2e2e',
          'hover': '#333333',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #242424 50%, #1a1a1a 100%)',
        'gradient-card': 'linear-gradient(145deg, #242424 0%, #2e2e2e 100%)',
        'glow-green': 'radial-gradient(circle at center, rgba(76, 188, 136, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(76, 188, 136, 0.3)',
        'glow-sm': '0 0 10px rgba(76, 188, 136, 0.2)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)',
      },
      fontFamily: {
        'heading': ['var(--font-heading)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(76, 188, 136, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(76, 188, 136, 0.5)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
