/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], // Sin espacios entre extensiones
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Usar Roboto como fuente predeterminada
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"], // Asegura el tema claro
  }
}
