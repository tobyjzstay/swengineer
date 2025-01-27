import { describe, it } from "mocha";
import { makeSuite } from ".";
import { app } from "../src/index";
import { generateJwt } from "../src/middleware";
import { User } from "../src/models/User";
import supertest = require("supertest");

describe("GET /auth", () => {
    makeSuite("Authenticate without cookie", () => {
        it("Authenticate with no cookie token", async () => {
            await supertest(app).get("/api/auth").expect(401);
        });
    });

    makeSuite("Authenticate using invalid cookie", () => {
        it("Authenticate with cookie with no token", async () => {
            const cookie = "thisisnotavalidcookie";
            await supertest(app).get("/api/auth").set("Cookie", cookie).expect(401);
        });
    });

    makeSuite("Authenticate using valid cookie", () => {
        let cookie = null;

        it("Log in as verified user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const response = await supertest(app)
                .post("/api/auth/login")
                .send({ email: userData.email, password: userData.password })
                .expect(200);
            cookie = response.headers["set-cookie"];
        });

        it("Authenticate with valid cookie", async () => {
            await supertest(app).get("/api/auth").set("Cookie", cookie).expect(200);
        });
    });

    makeSuite("Authenticate using invalid cookie token", () => {
        let cookie = null;

        it("Log in as verified user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const response = await supertest(app)
                .post("/api/auth/login")
                .send({ email: userData.email, password: userData.password })
                .expect(200);
            cookie = response.headers["set-cookie"];
        });

        it("Authenticate using invalid modified cookie", async () => {
            cookie = cookie.map((str: string) =>
                str
                    .split(";")
                    .map((str: string) => {
                        if (str.includes("token")) return "token=thisisnotavalidtoken";
                        else return str;
                    })
                    .join(";")
            );
            await supertest(app).get("/api/auth").set("Cookie", cookie).expect(401);
        });
    });

    makeSuite("Authenticate using invalid user cookie", () => {
        let cookie = null;

        it("Log in as verified user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const response = await supertest(app)
                .post("/api/auth/login")
                .send({ email: userData.email, password: userData.password })
                .expect(200);
            cookie = response.headers["set-cookie"];
            await User.findByIdAndDelete(user.id).exec();
        });

        it("Authenticate using cookie with invalid user ID", async () => {
            await supertest(app).get("/api/auth").set("Cookie", cookie).expect(403);
        });
    });

    makeSuite("Authenticate using expired cookie token", () => {
        let cookie = null;

        it("Log in as verified user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const response = await supertest(app)
                .post("/api/auth/login")
                .send({ email: userData.email, password: userData.password })
                .expect(200);
            cookie = response.headers["set-cookie"];
            cookie = cookie.map((str: string) =>
                str
                    .split(";")
                    .map((str: string) => {
                        if (str.includes("token")) return "token=" + generateJwt(user, 0);
                        else return str;
                    })
                    .join(";")
            );
        });

        it("Authenticate using an expired cookie", async () => {
            await supertest(app).get("/api/auth").set("Cookie", cookie).expect(401);
        });
    });
});
