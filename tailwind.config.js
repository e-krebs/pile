const shared = require('@e-krebs/react-library/tailwind.config.js');

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
      keyframes: {
        blowUpModal: {
          '0%': { transform: 'scale(0)' },
          '100%': { transform: 'scale(1)' }
        },
        blowDownModal: {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(0)', opacity: 0 }
        }
      },
      animation: {
        blowUpModal: 'blowUpModal 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        blowDownModal: 'blowDownModal 150ms cubic-bezier(0.4, 0, 0.2, 1)'
      }
    },
  },
};
