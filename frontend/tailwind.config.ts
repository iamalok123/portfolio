import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: '#BFFF00',
        surface: '#111111',
        'surface-2': '#1A1A1A',
        foreground: '#F5F5F5',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
} satisfies Config
