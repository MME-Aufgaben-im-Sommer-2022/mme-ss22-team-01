const path = require("path");

module.exports = {
    entry: "./app/src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "app/dist"),
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
};