const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("node:path");
const session = require("express-session");
const cors = require("cors");

require("./passport");

const password = process.env.MONGODB_PASSWORD;
const environment = process.env.ENVIRONMENT;
const secret = process.env.PASSPORT_SECRET;

const uri = `mongodb+srv://admin:${password}@cluster0.gvtap.mongodb.net/${environment}?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: "1" });

function server(app) {
    // initialize passport
    app.use(passport.initialize());
    app.use(session({ secret: secret, resave: true, saveUninitialized: true }));

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(cors());

    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, "../client/build")));

    app.use("/api", require("./routes/index"));
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api", require("./routes/login"));
}

module.exports.mongoose = mongoose;
module.exports.server = server;
