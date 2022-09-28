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

describe("POST /register", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
});

describe("POST /register", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });

    it("Register duplicate user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
});

describe("POST /login", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    it("Log in as user", (done) => {
        request(app).post("/api/login").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    // check if cookie valid
});

describe("POST /login", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    it("Log in with invalid password", (done) => {
        request(app).post("/api/login").send({ email: "alice@example.com", password: "bob" }).expect(404, done);
    });
    it("Log in with no password", (done) => {
        request(app).post("/api/login").send({ email: "alice@example.com" }).expect(401, done);
    });
});

describe("POST /login", () => {
    it("Log in as invalid user", (done) => {
        request(app).post("/api/login").send({ email: "bob.smith@example.com", password: "bob" }).expect(404, done);
    });
});
