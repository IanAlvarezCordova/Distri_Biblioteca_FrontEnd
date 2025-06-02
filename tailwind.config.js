/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class', // Permite alternar entre claro y oscuro con una clase
    theme: {
      extend: {
        colors: {
          primary: '#3B82F6', // Color principal (azul moderno)
          secondary: '#10B981', // Color secundario (verde esmeralda)
        },
      },
    },
    plugins: [],
  };