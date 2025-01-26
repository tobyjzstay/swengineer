import { after, before, describe, it } from "mocha";
import { app, mongoose } from "../src/index";
import { User } from "../src/models/User";
import supertest = require("supertest");

describe("POST /register", () => {
    makeSuite("Register user", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });
    });

    makeSuite("Duplicate user", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Register duplicate user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(409);
        });
    });

    makeSuite("Email is required", () => {
        it("Register a new user with invalid email", async () => {
            await supertest(app).post("/api/auth/register").send({ email: "", password: "alice123" }).expect(400);
        });
    });

    makeSuite("Password is required", () => {
        it("Register a new user with invalid password", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "" })
                .expect(400);
        });
    });

    makeSuite("Password must be at least 8 characters", () => {
        it("Register a new user with invalid password", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(400);
        });
    });

    makeSuite("User already registered needs verification", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Resend verification token", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", verify: true })
                .expect(201);
        });

        it("Verify email with verification token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/register/" + user.verificationToken)
                .send()
                .expect(200);
        });
    });
});

describe("POST /login", () => {
    makeSuite("Unregistered user", () => {
        it("Log in with invalid email", async () => {
            await supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(404);
        });
    });

    makeSuite("Email is required", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Log in with no email", async () => {
            await supertest(app).post("/api/auth/login").send({ password: "alice123" }).expect(404);
        });
    });

    makeSuite("Password is required", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Log in with no password", async () => {
            await supertest(app).post("/api/auth/login").send({ email: "alice@example.com" }).expect(401);
        });
    });

    makeSuite("Email verification is required", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Log in without email verification", async () => {
            await supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(403);
        });
    });

    makeSuite("Invalid password", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Log in with invalid password", async () => {
            await supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "bob12345" })
                .expect(401);
        });
    });

    makeSuite("Invalid email", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Log in with invalid email", async () => {
            await supertest(app)
                .post("/api/auth/login")
                .send({ email: "bob.smith@example.com", password: "alice123" })
                .expect(404);
        });
    });

    makeSuite("Login with verified email", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Verify email with verification token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/register/" + user.verificationToken)
                .send()
                .expect(200);
        });

        it("Log in as verified user", async () => {
            await supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(200);
        });
        // TODO: check cookie?
    });
});

describe("GET /register/:token", () => {
    makeSuite("Verify token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Verify email with verification token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/register/" + user.verificationToken)
                .send()
                .expect(200);
        });
    });

    makeSuite("Invalid email verification token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Verify email with invalid verification token", async () => {
            await supertest(app).get("/api/auth/register/thisisnotavalidtoken").send().expect(404);
        });
    });
});

describe("POST /reset", () => {
    makeSuite("Valid email", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });
    });

    makeSuite("Email is required", () => {
        it("Log in with no email", async () => {
            await supertest(app).post("/api/auth/reset").send({}).expect(404);
        });
    });

    makeSuite("Invalid email", () => {
        it("Send reset password email to invalid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(404);
        });
    });
});

describe("GET /reset/:token", () => {
    makeSuite("Valid password token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Check reset password link valid", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/reset/" + user.resetPasswordToken)
                .send()
                .expect(200);
        });
    });

    makeSuite("Invalid password token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Check reset password link invalid", async () => {
            await supertest(app).get("/api/auth/reset/thisisnotavalidtoken").send().expect(404);
        });
    });

    makeSuite("Expired password token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Check expired reset password link invalid", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            // make token expired
            user.resetPasswordExpires = new Date(0);
            await user.save();
            await supertest(app)
                .get("/api/auth/reset/" + user.resetPasswordToken)
                .send()
                .expect(410);
        });
    });

    makeSuite("Password is required", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Check reset password link valid", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/reset/" + user.resetPasswordToken)
                .send()
                .expect(200);
        });

        it("Reset password with invalid password", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            supertest(app)
                .post("/api/auth/reset/" + user.resetPasswordToken)
                .send({ email: "alice@example.com" })
                .expect(400);
        });
    });

    makeSuite("Password is required", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Check reset password link valid", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/reset/" + user.resetPasswordToken)
                .send()
                .expect(200);
        });

        it("Reset password with invalid password", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .post("/api/auth/reset/" + user.resetPasswordToken)
                .send({ email: "alice@example.com", password: "alice" })
                .expect(400);
        });
    });
});

describe("POST /reset/:token", () => {
    makeSuite("Valid password token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Reset password with valid token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .post("/api/auth/reset/" + user.resetPasswordToken)
                .send({ password: "bob12345" })
                .expect(200);
        });

        it("Verify email with verification token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/register/" + user.verificationToken)
                .send()
                .expect(200);
        });

        it("Login with new password", async () => {
            await supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "bob12345" })
                .expect(200);
        });
    });

    makeSuite("Invalid password token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Reset password with invalid token", async () => {
            await supertest(app)
                .post("/api/auth/reset/thisisnotavalidtoken")
                .send({ password: "bob12345" })
                .expect(404);
        });
    });

    makeSuite("Expired password token", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Send reset password email to valid user", async () => {
            await supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200);
        });

        it("Reset password with expired token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            // make token expired
            user.resetPasswordExpires = new Date(0);
            await user.save();
            await supertest(app)
                .post("/api/auth/reset/" + user.resetPasswordToken)
                .send({ password: "bob12345" })
                .expect(410);
        });
    });
});

describe("POST /logout", () => {
    makeSuite("Log out with valid cookie", () => {
        let cookie = null;

        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Verify email with verification token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/register/" + user.verificationToken)
                .send()
                .expect(200);
        });

        it("Log in as verified user", async () => {
            const response = await supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(200);
            cookie = response.headers["set-cookie"];
        });

        it("Log out", async () => {
            await supertest(app).post("/api/auth/logout").set("Cookie", cookie).expect(200);
        });
    });
});

describe("POST /delete", () => {
    makeSuite("Delete user with valid cookie", () => {
        let cookie = null;

        it("Register a new user", async () => {
            await supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201);
        });

        it("Verify email with verification token", async () => {
            const user: User = await User.findOne({ email: "alice@example.com" });
            await supertest(app)
                .get("/api/auth/register/" + user.verificationToken)
                .send()
                .expect(200);
        });

        it("Log in as verified user", async () => {
            const response = await supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(200);
            cookie = response.headers["set-cookie"];
        });

        it("Delete user", async () => {
            await supertest(app).post("/api/auth/delete").set("Cookie", cookie).expect(200);
        });
    });
});

function makeSuite(name, tests) {
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

// clean up
async function drop(done) {
    await mongoose.connection.collections.users.drop();
    done();
}
