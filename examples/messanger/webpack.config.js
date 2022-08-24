const path = require("path");
// TO DO move to example folder
module.exports = {
  entry: "./examples/messanger/index.js",
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
