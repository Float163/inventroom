const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
const path = require("path");
const webpack = require("webpack");

const config = {
  mode: "development",
  entry: [
    "babel-polyfill",
    "./assets/app.jsx"
  ],
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  ],
  output: {
    publicPath: "/"
  },
  devtool: "inline-cheap-module-source-map",
  module: {
    rules: [
      // {
      //   test: /app\.scss$/,
      //   exclude: /node_modules/,
      //   use: [
      //     "style-loader",
      //     "css-loader",
      //     "sass-loader",
      //     {
      //       loader: "sass-resources-loader",
      //       options: {
      //         resources: [
      //           path.resolve(__dirname, "node_modules/materialize-css/sass/materialize.scss")
      //         ]
      //       }
      //     }
      //   ]
      // },
      // {
      //   test: /\.css$/,
      //   use: ["style-loader", "css-loader"],
      // },
    ]
  }
}

module.exports = merge(baseConfig, config);
