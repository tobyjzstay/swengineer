const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");

const password = process.env.PASSWORD;
const environment = process.env.ENVIRONMENT;

const uri = `mongodb+srv://admin:${password}@cluster0.gvtap.mongodb.net/${environment}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: "1" });

function server(app) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(cookieParser());

    app.use("/api", require("./routes/index"));
    app.use("/api", require("./routes/login"));
}

module.exports.mongoose = mongoose;
module.exports.server = server;
