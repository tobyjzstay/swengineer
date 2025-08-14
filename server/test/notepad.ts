import { describe, it } from "mocha";
import { makeSuite } from ".";
import { app } from "../src/index";
import { generateJwt } from "../src/middleware";
import { User } from "../src/models/User";
import supertest = require("supertest");

describe("GET /notepad", () => {
    makeSuite("Get notepads", () => {
        it("Get notepads for user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const cookie = ["token=" + generateJwt(user)];
            await supertest(app).get("/api/notepad").set("Cookie", cookie).expect(200);
        });
    });
});
