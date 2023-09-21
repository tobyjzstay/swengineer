require("dotenv").config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import log4js from "log4js";
import mongoose from "mongoose";
import cluster from "node:cluster";
import os from "node:os";
import path from "node:path";
import passport from "passport";
import serveIndex from "serve-index";

const logger = log4js.getLogger();
logger.level = "all";

require("./passport");

const ENVIRONMENT = process.env.ENVIRONMENT;
const SECRET = process.env.PASSPORT_SECRET;
const TEST = process.env.TEST;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

const LOCALHOST = "127.0.0.1";
// const DATABASE_URI = "mongodb://" + LOCALHOST + ":27017/" + ENVIRONMENT;
const DATABASE_URI = `mongodb+srv://admin:${MONGODB_PASSWORD}@cluster0.0ywr222.mongodb.net/${ENVIRONMENT}?retryWrites=true&w=majority`;
const PORT = parseInt(process.env.PORT) || 0;

export const app = express();

if (cluster.isPrimary && !TEST) {
    const cpusLength = os.cpus().length;
    for (let i = 0; i < cpusLength; i++) {
        cluster.fork();
    }

    cluster.on("online", (worker) => {
        logger.info("Worker " + worker.process.pid + " is online");
    });
    cluster.on("exit", (worker) => {
        logger.warn("Worker " + worker.process.pid + " died");
        cluster.fork();
    });
} else {
    const logger = log4js.getLogger(process.pid.toString());

    mongoose.connect(DATABASE_URI).catch((error) => {
        logger.error(error);
    });

    mongoose.connection.on("connected", () => {
        logger.info("Connected to MongoDB at " + DATABASE_URI);
    });

    mongoose.connection.on("error", (error) => {
        logger.error(error);
    });

    // express
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // initialize passport
    app.use(passport.initialize());
    app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));

    app.use(
        cors({
            credentials: true,
        })
    );
    app.use(cookieParser());

    app.use((req, _res, next) => {
        logger.debug(`${req.method} ${req.url}`);
        next();
    });

    app.use("/public", express.static("public"), serveIndex("public", { icons: true, view: "details", hidden: true }));
    app.use(require("./routes/index"));

    const root = path.join(__dirname, "../../client/build");
    app.use(express.static(root));
    app.get("*", function (req, res) {
        res.sendFile("index.html", { root });
    });

    app.use((_req, res) => {
        res.sendStatus(404);
    });

    const server = app.listen(PORT, LOCALHOST, () => {
        const address = server.address();
        const uri = typeof address === "string" ? address : "http://" + address?.address + ":" + address?.port + "/";
        logger.info("HTTP server listening at " + uri);
    });
}

module.exports.mongoose = mongoose;
