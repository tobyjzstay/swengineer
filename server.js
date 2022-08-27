const http = require("http");
const express = require("express");

const app = express();
require("./index").server(app);

const httpAddress = "localhost";
const httpPort = 8080;

const httpServer = http.createServer(app);
httpServer.listen(httpPort, httpAddress, () => {
    console.log(`HTTP server listening at http://${httpAddress}:${httpPort}/`);
});
