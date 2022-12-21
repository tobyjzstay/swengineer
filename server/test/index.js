const { describe, it } = require("mocha");
const request = require("supertest");
const { app } = require("../dist/index");

describe("GET /ping", function () {
    it("Ping API server", function (done) {
        // Use supertest to run assertions for our API
        request(app).get("/api/ping").send().expect(200, done);
    });
});
