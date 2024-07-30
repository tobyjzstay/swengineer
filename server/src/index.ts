require("dotenv-expand").expand(
    require("dotenv").config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}.local` : ".env" })
);

if (!process.env.NODE_ENV) {
    console.error("NODE_ENV is not set");
    process.exit(1);
}

require("./passport");

import cluster from "cluster";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import log4js from "log4js";
import mongoose from "mongoose";
import os from "os";
import passport from "passport";
import path from "path";

const logger = log4js.getLogger(process.pid.toString());
logger.level = log4js.levels.ALL;

export const app = express();

if (cluster.isPrimary && process.env.NODE_ENV !== "test") {
    for (let i = 0; i < os.cpus().length; i++) {
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

    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGODB_URI).catch((error) => {
        logger.error(error);
    });

    mongoose.connection.on("connected", () => {
        logger.info("Connected to MongoDB");
    });

    mongoose.connection.on("error", (error) => {
        logger.error(error);
    });

    // express
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // initialize passport
    app.use(passport.initialize());
    app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));

    app.use(cors({ credentials: true }));
    app.use(cookieParser());

    app.use((req, res, next) => {
        logger.debug(`${req.method} ${res.statusCode} ${req.url}`);
        next();
    });

    app.use(require("./routes/index"));

    const root = path.join(__dirname, "../../client/build");
    app.use(express.static(root));
    app.get("*", function (_req, res) {
        res.sendFile("index.html", { root });
    });

    const port = parseInt(process.env.PORT) || 0;
    const server = app.listen(port, process.env.HOSTNAME, () => {
        const address = server.address();
        const uri = typeof address === "string" ? address : "http://" + address?.address + ":" + address?.port + "/";
        logger.info("HTTP server listening at " + uri);
    });
}

export { mongoose };

