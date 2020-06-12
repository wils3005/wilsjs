require("dotenv").config();
const DotenvWebpackPlugin = require("dotenv-webpack");

module.exports = {
  entry: "./client/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: `${__dirname}/public`,
  },
  plugins: [new DotenvWebpackPlugin()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  stats: "verbose",
};
