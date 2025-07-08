const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  devtool: false,
  cache: {
    type: "filesystem", // cache to speed up rebuilds
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
    clean: true, // cleans output dir before build (webpack 5 feature)
    publicPath: "/festplay/static/frontend/", // ⬅️ match the URL to the static path
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
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
    
  },
};
