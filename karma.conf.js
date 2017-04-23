module.exports = function(config) {
  config.set({
    basePath: "component",
    frameworks: ["mocha"],
    browsers: ["Chrome"],
    plugins: [
      "karma-chrome-launcher",
      "karma-mocha",
      "karma-sinon-chai",
      "karma-webpack"
    ],
    files: [
      // all files ending in ".spec.tsx"
      {pattern: "*.spec.tsx", watched: false},
      {pattern: "**/*.spec.tsx", watched: false}
      // each file acts as entry point for the webpack configuration
    ],

    preprocessors: {
      // add webpack as preprocessor
      "*.spec.tsx": ["webpack"],
      "**/*.spec.tsx": ["webpack"]
    },

    webpack: require("./webpack.config"),

    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      // stats: "errors-only"
    }
  });
};
