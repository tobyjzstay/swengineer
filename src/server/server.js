require("dotenv").config();

const http = require("node:http");
const express = require("express");
const api = require("./index");

const app = express();

api.server(app);

const httpAddress = process.env.HTTP_ADDRESS;
const httpPort = process.env.HTTP_PORT;

const httpServer = http.createServer(app);
httpServer.listen(httpPort, httpAddress, () => {
    console.log(`HTTP server listening at http://${httpAddress}:${httpPort}/`);
});

module.exports = app;