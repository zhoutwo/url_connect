const path = require("path");

module.exports = {
    entry: "./component/main.js",
    output: {
        path: path.resolve(__dirname, "client/src/browser_action"),
        filename: "popup.js"
    },
    module: {
        loaders: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              loader: ["babel-loader"]
            }
        ]
    }
};
