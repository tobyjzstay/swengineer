require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("node:path");
const session = require("express-session");
const cors = require("cors");
// const fs = require("fs");
const http = require("node:http");
const serveIndex = require("serve-index");
const cluster = require("node:cluster");
// const vhost = require("vhost");

require("./passport");

const password = process.env.MONGODB_PASSWORD;
const environment = process.env.ENVIRONMENT;
const secret = process.env.PASSPORT_SECRET;
const multiThreaded = process.env.MULTI_THREADED === "true";

const httpAddress = "localhost";
const httpPort = process.env.HTTP_PORT;

// mongoose
const uri = `mongodb+srv://admin:${password}@cluster0.gvtap.mongodb.net/${environment}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: "1" });

// express
const app = express();

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

app.use("/public", express.static("public"), serveIndex("public", { icons: true, view: "details", hidden: true }));

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
    httpServer.listen(httpPort, httpAddress, () => {
        console.log(`HTTP server listening at http://${httpAddress}:${httpPort}/`);
    });

    console.log(`Worker ${process.pid} started`);
}

// export app and mongoose
module.exports.app = app;
module.exports.mongoose = mongoose;
