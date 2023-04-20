require("dotenv").config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import log4js from "log4js";
import mongoose from "mongoose";
import cluster from "node:cluster";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import passport from "passport";
import serveIndex from "serve-index";

const logger = log4js.getLogger();
logger.level = "all";

require("./passport");

const ENVIRONMENT = process.env.ENVIRONMENT;
const SECRET = process.env.PASSPORT_SECRET;

const DATABASE_URI = "mongodb://127.0.0.1:27017/" + ENVIRONMENT;
const HTTP_PORT = 8080;

export const app = express();

if (cluster.isPrimary) {
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

    app.use(cors());
    app.use(cookieParser());

    app.use((req, _res, next) => {
        logger.debug(`${req.method} ${req.url}`);
        next();
    });

    app.use(express.static(path.join(__dirname, "../../client/build")));
    app.use("/public", express.static("public"), serveIndex("public", { icons: true, view: "details", hidden: true }));
    app.use("/api", require("./routes/api"));
    app.use(require("./routes/index"));

    const httpServer = http.createServer(app);
    httpServer.listen(HTTP_PORT, () => {
        logger.info(`HTTP server listening at http://localhost:${HTTP_PORT}/`);
    });
}
