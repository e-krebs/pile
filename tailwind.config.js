module.exports = {
  content: ["./src/**/*.html", "./src/**/*.ts", "./src/**/*.tsx"],
  safelist: ["MuiCheckbox-root", "MuiTextField-root"],
  theme: {
    extend: {
      colors: {
        'pocket': '#EF4056',
        'inherit': 'inherit'
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'max-width': 'max-width',
      },
      backgroundImage: {
        'stripe-disabled': 'repeating-linear-gradient(-45deg, white, white 10px, #F3F4F6 10px, #F3F4F6 20px)',
      }
    },
  },
  plugins: [],
};
