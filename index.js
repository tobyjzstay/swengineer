// const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require('mongoose');

const password = "mhP7o89t7Gx83qKe";
const uri = "mongodb+srv://admin:" + password + "@cluster0.gvtap.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: "1" });

function server(app) {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // app.use(cookieParser());

    app.use("/", require("./routes/index"));
    app.use("/api", require("./routes/login"));
}

module.exports.server = server;