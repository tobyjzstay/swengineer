/**
 * @author Toby Stayner <toby@swengineer.dev>
 */

const fs = require("fs");
const http = require("http");
const express = require("express");
const vhost = require("vhost");
const path = require("path");

const app = express();

// virtual hosts
const virtualHosts = JSON.parse(fs.readFileSync("vhosts.json", "utf8"));

virtualHosts.forEach(function (virtualHost) {
    const virtualHostApp = express();
    virtualHostApp.use(express.static(path.join(__dirname, virtualHost.path)));
    app.use(vhost(virtualHost.domain, virtualHostApp));
});

// create servers
const localhost = "localhost";

const httpPort = 8080;
const httpServer = http.createServer(app);
const httpListener = httpServer.listen(httpPort, localhost, () => {
    const address = httpListener.address().address;
    const port = httpListener.address().port;
    console.log(`HTTP server listening at http://${address}:${port}/`);
});
