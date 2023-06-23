const colors = require('tailwindcss/colors');

import type { Config } from 'tailwindcss'

export default {
  darkMode: ["class"],
  content: ['./public/**/*.html',
  "app/**/*.{ts,tsx}", 
  "components/**/*.{ts,tsx}"],
  
  plugins: [require("daisyui")],
} satisfies Config




