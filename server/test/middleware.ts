import { describe, it } from "mocha";
import { assertBodyMessage, makeSuite } from ".";
import { app } from "../src/index";
import { ClientErrorMessage, generateJwt } from "../src/middleware";
import { User } from "../src/models/User";
import supertest = require("supertest");

describe("GET /auth", () => {
    makeSuite("No cookie", () => {
        it("Authenticate with no cookie token", async () => {
            await supertest(app)
                .get("/auth")
                .expect(401)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_TOKEN));
        });
    });

    makeSuite("Cookie is invalid", () => {
        it("Authenticate with cookie with no token", async () => {
            const cookie = "thisisnotavalidcookie";
            await supertest(app)
                .get("/auth")
                .set("Cookie", cookie)
                .expect(401)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_TOKEN));
        });
    });

    makeSuite("Authenticate user", () => {
        it("Authenticate with valid cookie", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const cookie = ["token=" + generateJwt(user)];
            await supertest(app).get("/auth").set("Cookie", cookie).expect(200);
        });
    });

    makeSuite("Cookie token is invalid", () => {
        it("Authenticate using invalid modified cookie", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const cookie = ["token=thisisnotavalidtoken"];
            await supertest(app)
                .get("/auth")
                .set("Cookie", cookie)
                .expect(401)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_TOKEN));
        });
    });

    makeSuite("User is invalid", () => {
        it("Authenticate using cookie with invalid user ID", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const cookie = ["token=" + generateJwt(user)];
            await User.findByIdAndDelete(user.id).exec();
            await supertest(app)
                .get("/auth")
                .set("Cookie", cookie)
                .expect(403)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_USER));
        });
    });

    makeSuite("Expired cookie token", () => {
        it("Authenticate using an expired cookie", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const cookie = ["token=" + generateJwt(user, 0)];
            await supertest(app)
                .get("/auth")
                .set("Cookie", cookie)
                .expect(401)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_TOKEN));
        });
    });
});
