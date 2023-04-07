const path = require("path");

module.exports = {
  entry: "./src/chrono.js", // Your main JavaScript file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "chrono-b.js",
  },
  mode: "production", // Set to "development" for easier debugging
};
