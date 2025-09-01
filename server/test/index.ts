import { describe, it } from "mocha";
import mongoose from "mongoose";
import { Response } from "supertest";
import { app } from "../src/index";
import supertest = require("supertest");

describe("GET /ping", function () {
    it("Ping API server", function (done) {
        // Use supertest to run assertions for our API
        supertest(app).get("/ping").send().expect(200, done);
    });
});

export function makeSuite(name: string, tests: () => void) {
    describe(name, () => {
        before((done) => {
            drop(done);
        });
        tests();
        after((done) => {
            drop(done);
        });
    });
}

export function assertBodyMessage(response: Response, message: string) {
    if (response.body["message"] !== message) throw new Error(`Expected: ${message}, got: ${response.body["message"]}`);
}

// clean up
async function drop(done: Mocha.Done) {
    await mongoose.connection.collections.users.drop();
    done();
}
