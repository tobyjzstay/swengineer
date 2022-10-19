require("dotenv").config({ path: "./server/.env" });

const fs = require("fs");
const http = require("http");
const express = require("express");
const vhost = require("vhost");
const path = require("path");
const serveIndex = require("serve-index");
const api = require("./server/index");
const cluster = require("node:cluster");

const app = express();
api.server(app); // api server

app.use("/public", express.static("public"), serveIndex("public", { icons: true, view: "details", hidden: true }));

// virtual hosts
const virtualHosts = JSON.parse(fs.readFileSync("vhosts.json", "utf8"));

virtualHosts.forEach(function (virtualHost) {
    const virtualHostApp = express();
    virtualHostApp.use(express.static(path.join(__dirname, virtualHost.path)));
    app.use(vhost(virtualHost.domain, virtualHostApp));
});

// check if cluster is primary
if (cluster.isPrimary) {
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
    const httpAddress = "localhost";
    const httpPort = 8080;

    const httpServer = http.createServer(app);
    httpServer.listen(httpPort, httpAddress, () => {
        console.log(`HTTP server listening at http://${httpAddress}:${httpPort}/`);
    });

    console.log(`Worker ${process.pid} started`);
}
