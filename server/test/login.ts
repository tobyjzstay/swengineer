import { after, before, describe, it } from "mocha";
import { app, mongoose } from "../src/index";
import { User } from "../src/models/User";
import supertest = require("supertest");

describe("POST /register", () => {
    makeSuite("Register user", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });
    });

    makeSuite("Duplicate user", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });
        it("Register duplicate user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(409, done);
        });
    });
});

describe("POST /login", () => {
    makeSuite("Unregistered user", () => {
        it("Log in with invalid email", (done) => {
            supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(404, done);
        });
    });

    makeSuite("Email is required", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });
        it("Log in with no email", (done) => {
            supertest(app).post("/api/auth/login").send({ password: "alice" }).expect(404, done);
        });
    });

    makeSuite("Password is required", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });
        it("Log in with no password", (done) => {
            supertest(app).post("/api/auth/login").send({ email: "alice@example.com" }).expect(401, done);
        });
    });

    makeSuite("Email verification is required", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });
        it("Log in without email verification", (done) => {
            supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(403, done);
        });
    });

    makeSuite("Invalid password", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });
        it("Log in with invalid password", (done) => {
            supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "bob" })
                .expect(401, done);
        });
    });

    makeSuite("Invalid email", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });
        it("Log in with invalid email", (done) => {
            supertest(app)
                .post("/api/auth/login")
                .send({ email: "bob.smith@example.com", password: "alice" })
                .expect(404, done);
        });
    });

    makeSuite("Login with verified email", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Verify email with verification token", (done) => {
            getUser("alice@example.com", (user) => {
                supertest(app)
                    .get("/api/auth/register/" + user.verificationToken)
                    .send()
                    .expect(200, done);
            });
        });

        it("Log in as verified user", (done) => {
            supertest(app)
                .post("/api/auth/login")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(200, done);
        });
        // TODO: check cookie?
    });
});

describe("GET /register/:token", () => {
    makeSuite("Verify token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Verify email with verification token", (done) => {
            User.findOne({ email: "alice@example.com" }).then((user) => {
                supertest(app)
                    .get("/api/auth/register/" + user.verificationToken)
                    .send()
                    .expect(200, done);
            });
        });
    });

    makeSuite("Invalid email verification token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Verify email with invalid verification token", (done) => {
            supertest(app).get("/api/auth/register/thisisnotavalidtoken").send().expect(404, done);
        });
    });
});

describe("POST /reset", () => {
    makeSuite("Valid email", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Send reset password email to valid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200, done);
        });
    });

    makeSuite("Invalid email", () => {
        it("Send reset password email to invalid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(404, done);
        });
    });
});

describe("GET /reset/:token", () => {
    makeSuite("Valid password token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Send reset password email to valid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200, done);
        });

        it("Check reset password link valid", (done) => {
            getUser("alice@example.com", (user) => {
                supertest(app)
                    .get("/api/auth/reset/" + user.resetPasswordToken)
                    .send()
                    .expect(200, done);
            });
        });
    });

    makeSuite("Invalid password token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Send reset password email to valid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200, done);
        });

        it("Check reset password link invalid", (done) => {
            supertest(app).get("/api/auth/reset/thisisnotavalidtoken").send().expect(404, done);
        });
    });

    makeSuite("Expired password token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Send reset password email to valid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200, done);
        });

        it("Check expired reset password link invalid", (done) => {
            getUser("alice@example.com", (user) => {
                // make token expired
                user.resetPasswordExpires = new Date(0);
                user.save().then(() => {
                    supertest(app)
                        .get("/api/auth/reset/" + user.resetPasswordToken)
                        .send()
                        .expect(410, done);
                });
            });
        });
    });
});

describe("POST /reset/:token", () => {
    makeSuite("Valid password token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Send reset password email to valid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200, done);
        });

        it("Reset password with valid token", (done) => {
            getUser("alice@example.com", (user) => {
                supertest(app)
                    .post("/api/auth/reset/" + user.resetPasswordToken)
                    .send({ password: "bob" })
                    .expect(200, done);
            });
        });
    });

    makeSuite("Invalid password token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Send reset password email to valid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200, done);
        });

        it("Reset password with invalid token", (done) => {
            supertest(app).post("/api/auth/reset/thisisnotavalidtoken").send({ password: "bob" }).expect(404, done);
        });
    });

    makeSuite("Expired password token", () => {
        it("Register a new user", (done) => {
            supertest(app)
                .post("/api/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(201, done);
        });

        it("Send reset password email to valid user", (done) => {
            supertest(app).post("/api/auth/reset").send({ email: "alice@example.com" }).expect(200, done);
        });

        it("Reset password with expired token", (done) => {
            getUser("alice@example.com", (user) => {
                // make token expired
                user.resetPasswordExpires = new Date(0);
                user.save().then(() => {
                    supertest(app)
                        .post("/api/auth/reset/" + user.resetPasswordToken)
                        .send({ password: "bob" })
                        .expect(410, done);
                });
            });
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

function getUser(email, func) {
    User.findOne({ email }).then((user) => func(user));
}

// clean up
async function drop(done) {
    await mongoose.connection.collections.users.drop();
    done();
}
