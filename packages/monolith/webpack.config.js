require("dotenv").config();
const DotenvWebpackPlugin = require("dotenv-webpack");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

module.exports = {
  entry: `${__dirname}/src/client/index.ts`,
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
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
    path: `${__dirname}/build/client/`,
  },
  plugins: [
    new DotenvWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "src/client/index.html",
      title: "monolith",
    }),
    new FaviconsWebpackPlugin(),
    new ManifestPlugin(),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  },
  stats: "verbose",
};
