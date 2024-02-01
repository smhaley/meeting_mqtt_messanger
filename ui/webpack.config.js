const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
 entry: "./src/index.ts",
 module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
 },
 resolve: {
    modules: [path.resolve(__dirname, 'node_modules')], // Add this line
    extensions: [".tsx", ".ts", ".js", ".jsx"],
 },
 output: {
    filename: "bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname, "dist"),
 },
 devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4001,
 },
 plugins: [new HtmlWebpackPlugin({ template: "./index.html" })],
};
