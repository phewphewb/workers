const path = require("path");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "messanger.js",
    path: path.resolve(__dirname, "build"),
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.sworker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          worker: "SharedWorker",
        },
      },
    ],
  },
};
