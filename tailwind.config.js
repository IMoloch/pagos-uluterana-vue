/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{vue, js, ts, jsx, tsx}'],
  theme: {
    extend: {
      colors: {
        customBlue: '#1E3A8A',
        customGreen: 'rgb(34, 197, 94)',
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light', 'dark'], // Asegúrate de que esté configurado correctamente
  },
}
