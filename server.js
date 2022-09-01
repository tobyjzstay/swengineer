const http = require("http");
const express = require("express");
const api = require("./index");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded());

api.server(app);

const httpAddress = "localhost";
const httpPort = 8080;

const httpServer = http.createServer(app);
httpServer.listen(httpPort, httpAddress, () => {
    console.log(`HTTP server listening at http://${httpAddress}:${httpPort}/`);
});
