require("dotenv").config();
const DotenvWebpackPlugin = require("dotenv-webpack");

module.exports = {
  entry: `${__dirname}/src/index.ts`,
  mode: "development",
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: { configFile: "tsconfig.build.json" },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: `${__dirname}/build`,
  },
  plugins: [new DotenvWebpackPlugin()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  stats: "verbose",
};
