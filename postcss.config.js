module.exports = {
    plugins: {
        tailwindcss: {},
        'postcss-preset-env': {
            stage: 4, // The stage option determines which CSS features to polyfill, based on their stability in the process of becoming official web standards. Stage 0 is the least stable (experimental), and stage 4 is the most stable (finished). Stage 1 is a good balance between stability and having access to newer features.
            autoprefixer: { grid: true }, // This enables grid translations for IE
          },
    },
  };