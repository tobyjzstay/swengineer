import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

dotenvExpand.expand(dotenv.config({ path: ".env" }));
dotenvExpand.expand(dotenv.config({ path: ".env." + process.env.NODE_ENV, override: true }));
dotenvExpand.expand(dotenv.config({ path: ".env." + process.env.NODE_ENV + ".local", override: true }));

if (!process.env.NODE_ENV) {
    console.error("NODE_ENV is not set");
    process.exit(1);
}

require("./passport");

import cluster from "cluster";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import log4js from "log4js";
import mongoose from "mongoose";
import os from "os";
import passport from "passport";

const logger = log4js.getLogger(process.pid.toString());
logger.level = process.env.LOG_LEVEL || log4js.levels.ALL;

const version = process.env.REACT_APP_VERSION || "0.0.0-" + process.env.NODE_ENV;

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
        const uri = new URL(process.env.MONGODB_URI);
        uri.password = "*".repeat(uri.password.length);
        logger.info("Connected to MongoDB at " + uri);
    });

    mongoose.connection.on("error", (error) => {
        logger.error(error);
    });

    // express
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use(
        session({
            cookie: {
                ...(process.env.NODE_ENV === "production" && { domain: process.env.SESSION_COOKIE_DOMAIN }),
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24, // 1 day
                secure: process.env.NODE_ENV === "production",
            },
            resave: false,
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.MONGODB_URI,
                collectionName: "sessions",
                ttl: 14 * 24 * 60 * 60, // 14 days
            }),
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(cors({ credentials: true }));
    app.use(cookieParser());

    app.use((request, response, next) => {
        const requestUrl = request.url;

        response.setHeader("X-App-Version", version);

        const responseSend = response.send;
        response.send = function (body): express.Response {
            let bodyMessage: string;
            if (process.env.NODE_ENV !== "production") {
                try {
                    bodyMessage = JSON.parse(body)?.message;
                } catch (error) {}
            }
            logger.trace(
                request.method + " " + response.statusCode + (bodyMessage ? " " + bodyMessage : "") + " " + requestUrl
            );
            return responseSend.call(this, body);
        };

        next();
    });

    app.use(require("./routes/index"));

    const port = parseInt(process.env.PORT) || 0;
    const server = app.listen(port, process.env.HOSTNAME, () => {
        const address = server.address();
        const uri = typeof address === "string" ? address : "http://" + address?.address + ":" + address?.port + "/";
        logger.info("HTTP server listening at " + uri);
    });
}

export { mongoose };

