const shared = require('@e-krebs/react-library/tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [shared],
  content: ["./src/**/*.{html,ts,tsx}", "./node_modules/@e-krebs/react-library/dist/**/*.js"],
  theme: {
    extend: {
      colors: {
        'pocket': '#EF4056',
        'inherit': 'inherit',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'max-width': 'max-width',
      },
      backgroundImage: {
        'stripe-disabled': 'repeating-linear-gradient(-45deg, white, white 10px, #F3F4F6 10px, #F3F4F6 20px)',
      },
    },
  },
};
