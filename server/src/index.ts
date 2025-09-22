import cluster from "cluster";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import express from "express";
import session from "express-session";
import log4js from "log4js";
import mongoose from "mongoose";
import os from "os";
import passport from "passport";

const logger = log4js.getLogger(process.pid.toString());
logger.level = process.env.LOG_LEVEL || log4js.levels.ALL;

dotenvExpand.expand(dotenv.config({ path: ".env" }));
dotenvExpand.expand(dotenv.config({ path: ".env." + process.env.NODE_ENV, override: true }));

const requiredEnvVariables = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "JWT_SECRET",
    "NODE_ENV",
    "REACT_APP_API_URL",
    "REACT_APP_BASE_URL",
    "REACT_APP_GTM_ID",
    "SESSION_SECRET",
    "SMTP_HOST",
    "SMTP_PASSWORD",
    "SMTP_PORT",
    "SMTP_USERNAME",
];
const productionEnvVariables = ["SESSION_COOKIE_DOMAIN"];
if (process.env.NODE_ENV === "production") requiredEnvVariables.push(...productionEnvVariables);

const missingEnvVariables = requiredEnvVariables.filter((envVariable) => !process.env[envVariable]);
if (missingEnvVariables.length > 0) {
    logger.error("Missing required environment variable(s): " + missingEnvVariables.join(", "));
    process.exit(1);
}

let apiUrl = process.env.REACT_APP_API_URL;
const hostname = process.env.HOSTNAME || "localhost";
const mongoUrl = process.env.MONGODB_URI || `http://localhost:27017/${process.env.NODE_ENV}`;
const port = Number(process.env.PORT) || 0;
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const tokenSize = Number(process.env.TOKEN_SIZE) || 16;
const version = process.env.REACT_APP_VERSION || `0.0.0-${process.env.NODE_ENV}`;

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
    mongoose.set("strictQuery", false);
    mongoose.connect(mongoUrl).catch((error) => {
        logger.error(error);
    });

    mongoose.connection.on("connected", () => {
        const uri = new URL(mongoUrl);
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
                mongoUrl,
                collectionName: "sessions",
                ttl: 14 * 24 * 60 * 60, // 14 days
            }),
        })
    );

    require("./passport");
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

    const server = app.listen(port, hostname, () => {
        const address = server.address();
        if (typeof address === "string") logger.info(`HTTP server listening on pipe ${address}`);
        else {
            apiUrl ??= `http://${hostname}:${address?.port}`;
            logger.info(`HTTP server listening at ${apiUrl}`);
        }
    });
}

export { apiUrl, logger, mongoose, saltRounds, tokenSize };

