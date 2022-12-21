require("dotenv").config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
// const fs = require("fs");
import session from "express-session";
import log4js from "log4js";
import mongoose from "mongoose";
import cluster from "node:cluster";
import http from "node:http";
import path from "node:path";
import passport from "passport";
import serveIndex from "serve-index";
// const vhost = require("vhost");

const logger = log4js.getLogger();
logger.level = "all";

require("./passport");

const password = process.env.MONGODB_PASSWORD;
const environment = process.env.ENVIRONMENT;
const secret = process.env.PASSPORT_SECRET;
const multiThreaded = process.env.MULTI_THREADED === "true";

const httpPort = process.env.HTTP_PORT;

// mongoose
const uri = `mongodb+srv://admin:${password}@cluster0.gvtap.mongodb.net/${environment}?retryWrites=true&w=majority`;
mongoose.set("strictQuery", true);
mongoose.connect(uri, { serverApi: "1" });

// express
export const app = express();

// initialize passport
app.use(passport.initialize());
app.use(session({ secret: secret, resave: true, saveUninitialized: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../client/build")));
app.use("/api", require("./routes/index"));
app.use("/public", express.static("../public"), serveIndex("public", { icons: true, view: "details", hidden: true }));

// virtual hosts
// const virtualHosts = JSON.parse(fs.readFileSync("vhosts.json", "utf8"));

// virtualHosts.forEach(function (virtualHost) {
//     const virtualHostApp = express();
//     virtualHostApp.use(express.static(path.join(__dirname, virtualHost.path)));
//     app.use(vhost(virtualHost.domain, virtualHostApp));
// });

// check if cluster is primary
if (multiThreaded && cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    const numCPUs = require("os").cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const httpServer = http.createServer(app);
    httpServer.listen(httpPort, () => {
        console.log(`HTTP server listening at http://localhost:${httpPort}/`);
    });

    console.log(`Worker ${process.pid} started`);
}
