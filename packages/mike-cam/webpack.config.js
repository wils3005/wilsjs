require("dotenv").config();
const DotenvWebpackPlugin = require("dotenv-webpack");

module.exports = {
  entry: {
    phone: "./src/phone/index.ts",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: { configFile: "tsconfig.build.json" },
      },
    ],
  },
  output: {
    path: `${__dirname}/build`,
  },
  plugins: [new DotenvWebpackPlugin()],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  stats: "verbose",
};
