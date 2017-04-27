const path = require("path");

module.exports = {
  entry: "./component/main.tsx",
  output: {
    filename: "popup.js",
    path: path.resolve(__dirname, "client/src/browser_action")
  },

  // Enable sourcemaps for debugging webpack's output.
  // devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  },

  resolveLoader: {
    modules: [
      "./node_modules"
    ]
  },

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {test: /\.tsx?$/, loader: "awesome-typescript-loader", query: {
        // Use this to point to your tsconfig.json.
        configFileName: path.resolve(__dirname, "component/tsconfig.json")
      }},

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
    ]
  }
};
