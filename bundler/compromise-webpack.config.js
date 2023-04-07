const path = require("path");

module.exports = {
  entry: "./src/compromise.js", // Your main JavaScript file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "compromise-b.js",
  },
  mode: "production", // Set to "development" for easier debugging
};
