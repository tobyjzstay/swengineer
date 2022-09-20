require("dotenv").config();

const http = require("http");
const express = require("express");
const api = require("./index");

const app = express();

api.server(app);

const httpAddress = process.env.ADDRESS;
const httpPort = process.env.PORT;

const httpServer = http.createServer(app);
httpServer.listen(httpPort, httpAddress, () => {
    console.log(`HTTP server listening at http://${httpAddress}:${httpPort}/`);
});

module.exports = app;