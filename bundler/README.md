## WEBPACK BUNDLER

### USAGE

Install the dependencies

```bash
npm install webpack webpack-cli --save-dev
npm install chrono-node compromise compromise-dates --save
```

Run the following command to bundle the script

```bash
npx webpack build --config compromise-webpack.config.js
npx webpack build --config chrono-webpack.config.js
```

```javascript
// compromise-webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/compromise.js", // Your main JavaScript file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "compromise-b.js",
  },
  mode: "production", // Set to "development" for easier debugging
};
```

```javascript
// chrono-webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/chrono.js", // Your main JavaScript file
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "chrono-b.js",
  },
  mode: "production", // Set to "development" for easier debugging
};
```
