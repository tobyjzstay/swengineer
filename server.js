/**
 * @author Toby Stayner <toby@swengineer.dev>
 */

const fs = require("fs");
const http = require("http");
const express = require("express");
const vhost = require("vhost");
const path = require("path");
const api = require("./swengineer-app-server");

const app = express();
api.server(app); // api server

// virtual hosts
const virtualHosts = JSON.parse(fs.readFileSync("vhosts.json", "utf8"));

virtualHosts.forEach(function (virtualHost) {
    const virtualHostApp = express();
    virtualHostApp.use(express.static(path.join(__dirname, virtualHost.path)));
    app.use(vhost(virtualHost.domain, virtualHostApp));
});

const httpAddress = "localhost";
const httpPort = 8080;

const httpServer = http.createServer(app);
httpServer.listen(httpPort, httpAddress, () => {
    console.log(`HTTP server listening at http://${httpAddress}:${httpPort}/`);
});
