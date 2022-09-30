/* eslint-disable no-console */

require("dotenv/config");
const express = require("express");

function init() {
    const app = express();
    app.use("/", express.static("app"));
    app.listen(process.env.DEV_PORT, function() {
        console.log("Server started. Opening application in browser ... [Press CTRL + C to stop server]");
    });
}

init();