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
        // ChargeSmart Dark Theme Palette
        csev: {
          // Primary teal/mint green accent
          green: '#4ade80',
          'green-dark': '#22c55e',
          'green-light': '#86efac',
          'green-glow': 'rgba(74, 222, 128, 0.3)',
          // Dark background colors
          'slate-900': '#0f172a',
          'slate-800': '#1e293b',
          'slate-700': '#334155',
          'slate-600': '#475569',
          // Text colors for dark theme
          'text-primary': '#f8fafc',
          'text-secondary': '#94a3b8',
          'text-muted': '#64748b',
          // Card/panel backgrounds
          'panel': '#1a202c',
          'panel-light': '#2d3748',
          // Border colors
          'border': '#334155',
          'border-light': '#475569',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1a202c 50%, #0f172a 100%)',
        'gradient-card': 'linear-gradient(145deg, #1e293b 0%, #1a202c 100%)',
        'glow-green': 'radial-gradient(circle at center, rgba(74, 222, 128, 0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(74, 222, 128, 0.3)',
        'glow-sm': '0 0 10px rgba(74, 222, 128, 0.2)',
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
          '0%, 100%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(74, 222, 128, 0.5)' },
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
