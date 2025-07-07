const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map", // faster source maps for dev
  cache: {
    type: "filesystem", // cache to speed up rebuilds
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
    clean: true, // cleans output dir before build (webpack 5 feature)
    publicPath: '/festplay/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          "thread-loader", // parallelize babel-loader
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // enable babel caching
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  optimization: {
    minimize: false, // disable minimization in dev for faster builds
  },
  /*plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development"),
    }),
  ],*/
  resolve: {
    extensions: [".js"], // resolve only js by default (faster)
  },
};
