import { describe, it } from "mocha";
import { app } from "../src/index";
import supertest = require("supertest");

describe("GET /ping", function () {
    it("Ping API server", function (done) {
        // Use supertest to run assertions for our API
        supertest(app).get("/api/ping").send().expect(200, done);
    });
});
