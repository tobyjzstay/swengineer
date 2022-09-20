/* eslint-disable no-undef */
const app = require("../server");
const mongoose = require("../index").mongoose;
const request = require("supertest");
const { beforeEach } = require("mocha");

mongoose.connection
    .once("open", () => console.log("Connected!"))
    .on("error", (error) => {
        console.warn("Error : ", error);
    });

beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});

describe("GET /ping", function () {
    it("Ping API server", function (done) {
        // Use supertest to run assertions for our API
        request(app).get("/api/ping").send().expect(200, done);
    });
});

describe("POST /register", () => {
    it("Register a new user", (done) => {
        request(app)
            .post("/api/register")
            .send({ email: "john.smith@example.com", password: "password" })
            .expect(200, done);
    });
});

describe("POST /register", () => {
    console.log("test");

    it("Register a new user", (done) => {
        request(app)
            .post("/api/register")
            .send({ email: "john.smith@example.com", password: "password" })
            .expect(200, done);
    });
    console.log("sdfsdf2");
    it("Register duplicate user", (done) => {
        request(app)
            .post("/api/register")
            .send({ email: "john.smith@example.com", password: "password" })
            .expect(200, done);
    });
});
