module.exports = {
  mode: "jit",
  purge: {
    content: ["./src/**/*.html", "./src/**/*.ts", "./src/**/*.tsx"],
    safelist: ["MuiCheckbox-root", "MuiTextField-root"],
  },
  theme: {
    extend: {
      colors: {
        'pocket': '#EF4056',
        'inherit': 'inherit'
      },
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  variants: {},
  plugins: [],
};
