const cookieParser = require("cookie-parser");
const express = require("express");

function server(app) {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(cookieParser());

    app.use("/", require("./routes/index"));
}

module.exports.server = server;