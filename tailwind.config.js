const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: 'class',
  mode: 'jit',
  plugins: [
    require('@tailwindcss/forms'),
    require("daisyui")
  ],
  content: [
    './app/routes/**/*.{js,jsx,ts,tsx}',
    './app/components/**/*.{js,jsx,ts,tsx}',
    './app/templates/**/*.{js,jsx,ts,tsx}',
  ],
  safelist: [
    
  ],
  theme: {
    colors: {
      black: colors.black,
      white: colors.white,
      gray: colors.slate,
      green: colors.green,
      blue: colors.sky,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber
    },
    extend: {
      flex: {
        'card': '0 0'
      },
      dropShadow: {
        'short': '0 1px 1px rgba(0, 0, 0, 0.75)',
      },
      borderWidth: {
        '05': '0.5px'
      },
      fontSize: {
        'button-tiny': ['11.7px', '11.7px'],
        'button-small': ['14px', '14px'],
        'button-medium': ['16.8px', '16.8px'],
        'button-large': ['20.2px', '20.2px']
      },
      height: {
        v8: '8vh',
        v16: '16vh',
        v24: '24vh',
        v32: '32vh',
        v40: '40vh',
        v48: '48vh',
        v56: '56vh',
        v68: '68vh',
        v76: '76vh',
        v84: '84vh',
        v92: '92vh',
        safe: 'calc(100vh - env(safe-area-inset-bottom))'
      },
      colors: {
        'brand-primary': 'var(--color-brand-primary)',
        'brand-primary-hover': 'var(--color-brand-primary-hover)',
        'brand-primary-on': 'var(--color-brand-primary-on)',
        white: 'var(--color-white)',
        black: 'var(--color-black)',
        silver: 'var(--color-silver)',
        background: 'var(--color-background)'
      }
    }
  },
  settings: {
    'tailwindCSS.includeLanguages': {
      plaintext: 'javascript'
    },
    'tailwindCSS.emmetCompletions': true
  }
};
