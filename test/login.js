/* eslint-disable no-undef */
const app = require("../server");
const mongoose = require("../index").mongoose;
const request = require("supertest");

mongoose.connection
    .once("open", () => console.log("Connected!"))
    .on("error", (error) => {
        console.warn("Error : ", error);
    });

makeSuite("POST /register", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
});

makeSuite("POST /register", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    it("Register duplicate user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(400, done);
    });
});

makeSuite("POST /login", () => {
    it("Log in with invalid email", (done) => {
        request(app).post("/api/login").send({ email: "alice@example.com", password: "alice" }).expect(404, done);
    });
});

makeSuite("POST /login", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    it("Log in with no email", (done) => {
        request(app).post("/api/login").send({ password: "alice" }).expect(404, done);
    });
});

makeSuite("POST /login", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    it("Log in with no password", (done) => {
        request(app).post("/api/login").send({ email: "alice@example.com" }).expect(401, done);
    });
});

makeSuite("POST /login", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    it("Log in without email verification", (done) => {
        request(app).post("/api/login").send({ email: "alice@example.com", password: "alice" }).expect(403, done);
    });
});

makeSuite("POST /login", () => {
    it("Register a new user", (done) => {
        request(app).post("/api/register").send({ email: "alice@example.com", password: "alice" }).expect(200, done);
    });
    it("Log in with invalid password", (done) => {
        request(app).post("/api/login").send({ email: "alice@example.com", password: "bob" }).expect(401, done);
    });
});

// makeSuite("POST /login", () => {
//     it("Log in as invalid user", (done) => {
//         request(app).post("/api/login").send({ email: "bob.smith@example.com", password: "bob" }).expect(404, done);
//     });
// });

function makeSuite(name, tests) {
    describe(name, () => {
        before((done) => {
            mongoose.connection.collections.users.drop(() => {
                done();
            });
        });
        tests();
        after((done) => {
            done();
        });
    });
}

// clean up
after((done) => {
    mongoose.connection.collections.users.drop(() => {
        done();
    });
});
