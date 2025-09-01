import { describe, it } from "mocha";
import { assertBodyMessage, makeSuite } from ".";
import { app } from "../src/index";
import { generateJwt } from "../src/middleware";
import { User } from "../src/models/User";
import { ClientErrorMessage, SuccessMessage } from "../src/routes/auth";
import supertest = require("supertest");

describe("POST /register", () => {
    makeSuite("Register user", () => {
        it("Register a new user", async () => {
            await supertest(app)
                .post("/auth/register")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(201)
                .expect((response) => assertBodyMessage(response, SuccessMessage.VERIFICATION_EMAIL_SENT));
        });
    });

    makeSuite("Duplicate user", () => {
        it("Register a duplicate user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/register")
                .send({ email: userData.email, password: userData.password })
                .expect(409)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.DUPLICATE_USER));
        });
    });

    makeSuite("Email is required", () => {
        it("Register a new user with invalid email", async () => {
            await supertest(app)
                .post("/auth/register")
                .send({ email: "", password: "alice123" })
                .expect(400)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_EMAIL));
        });
    });

    makeSuite("Password is required", () => {
        it("Register a new user with invalid password", async () => {
            await supertest(app)
                .post("/auth/register")
                .send({ email: "alice@example.com", password: "" })
                .expect(400)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_PASSWORD));
        });
    });

    makeSuite("Password must be at least 8 characters", () => {
        it("Register a new user with less than 8 characters", async () => {
            await supertest(app)
                .post("/auth/register")
                .send({ email: "alice@example.com", password: "alice" })
                .expect(400)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_PASSWORD_LENGTH));
        });
    });

    makeSuite("Resend verification email", () => {
        it("Resend verification token", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateVerificationToken();
            await user.save();
            await supertest(app)
                .post("/auth/register")
                .send({ email: "alice@example.com", verify: true })
                .expect(201)
                .expect((response) => assertBodyMessage(response, SuccessMessage.VERIFICATION_EMAIL_SENT));
        });
    });
});

describe("GET /register/:token", () => {
    makeSuite("Verify user", () => {
        it("Verify email with verification token", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateVerificationToken();
            await user.save();
            await supertest(app)
                .get("/auth/register/" + user.verificationToken)
                .send()
                .expect(200)
                .expect((response) => assertBodyMessage(response, SuccessMessage.VERIFICATION_SUCCESS));
        });
    });

    makeSuite("Invalid verification token", () => {
        it("Verify user with invalid verification token", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateVerificationToken();
            await user.save();
            await supertest(app).get("/auth/register/thisisnotavalidtoken").send().expect(404);
        });
    });
});

describe("POST /login", () => {
    makeSuite("Login with verified email", () => {
        it("Log in with a verified user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/login")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(200)
                .expect((response) => assertBodyMessage(response, SuccessMessage.LOGIN_SUCCESS));
        });
        // TODO: check cookie?
    });

    makeSuite("Unregistered user", () => {
        it("Log in with invalid email", async () => {
            await supertest(app)
                .post("/auth/login")
                .send({ email: "alice@example.com", password: "alice123" })
                .expect(404)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_EMAIL));
        });
    });

    makeSuite("Email is required", () => {
        it("Log in with no email", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/login")
                .send({ password: userData.password })
                .expect(404)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_EMAIL));
        });
    });

    makeSuite("Password is required", () => {
        it("Log in with no password", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/login")
                .send({ email: userData.email })
                .expect(401)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_PASSWORD));
        });
    });

    makeSuite("Email verification is required", () => {
        it("Log in without email verification", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/login")
                .send({ email: userData.email, password: userData.password })
                .expect(403)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.UNVERIFIED_EMAIL));
        });
    });

    makeSuite("Invalid password", () => {
        it("Log in with invalid password", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/login")
                .send({ email: userData.email, password: "bob12345" })
                .expect(401)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_PASSWORD));
        });
    });

    makeSuite("Invalid email", () => {
        it("Log in with invalid email", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/login")
                .send({ email: "bob@example.com", password: userData.password })
                .expect(404)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_EMAIL));
        });
    });
});

describe("POST /reset", () => {
    makeSuite("Valid email", () => {
        it("Send reset password email to valid user", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            await user.save();
            await supertest(app)
                .post("/auth/reset")
                .send({ email: userData.email })
                .expect(200)
                .expect((response) => assertBodyMessage(response, SuccessMessage.RESET_EMAIL_SENT));
        });
    });

    makeSuite("Email is required", () => {
        it("Log in with no email", async () => {
            await supertest(app)
                .post("/auth/reset")
                .send({})
                .expect(404)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_EMAIL));
        });
    });

    makeSuite("Invalid email", () => {
        it("Send reset password email to invalid user", async () => {
            await supertest(app)
                .post("/auth/reset")
                .send({ email: "alice@example.com" })
                .expect(404)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_EMAIL));
        });
    });
});

describe("GET /reset/:token", () => {
    makeSuite("Valid reset password token", () => {
        it("Check reset password link valid", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            await user.save();
            await supertest(app)
                .get("/auth/reset/" + user.resetPasswordToken)
                .send()
                .expect(200)
                .expect((response) => assertBodyMessage(response, SuccessMessage.VALID_TOKEN));
        });
    });

    makeSuite("Invalid reset password token", () => {
        it("Check reset password link invalid", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            await user.save();
            await supertest(app).get("/auth/reset/thisisnotavalidtoken").send().expect(404);
        });
    });

    makeSuite("Expired reset password token", () => {
        it("Check expired reset password link invalid", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            user.resetPasswordExpires = new Date(0); // make token expired
            await user.save();
            await supertest(app)
                .get("/auth/reset/" + user.resetPasswordToken)
                .send()
                .expect(410)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.TOKEN_EXPIRED));
        });
    });

    makeSuite("Password is required", () => {
        it("Reset password with invalid password", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            await user.save();
            supertest(app)
                .post("/auth/reset/" + user.resetPasswordToken)
                .send({ email: userData.email })
                .expect(400)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_PASSWORD));
        });
    });

    makeSuite("Password must be at least 8 characters", () => {
        it("Reset password with password less than 8 characters", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            await user.save();
            await supertest(app)
                .post("/auth/reset/" + user.resetPasswordToken)
                .send({ email: userData.email, password: "alice" })
                .expect(400)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.INVALID_PASSWORD_LENGTH));
        });
    });
});

describe("POST /reset/:token", () => {
    makeSuite("Valid reset password token", () => {
        it("Reset password with valid reset password token", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            await user.save();
            await supertest(app)
                .post("/auth/reset/" + user.resetPasswordToken)
                .send({ password: "bob12345" })
                .expect(200)
                .expect((response) => assertBodyMessage(response, SuccessMessage.RESET_PASSWORD_SUCCESS));
        });
    });

    makeSuite("Invalid password token", () => {
        it("Reset password with invalid reset password token", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            await user.save();
            await supertest(app).post("/auth/reset/thisisnotavalidtoken").send({ password: "bob12345" }).expect(404);
        });
    });

    makeSuite("Expired password token", () => {
        it("Reset password with expired reset password token", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
            };
            const user = new User(userData);
            user.generateResetPasswordToken();
            user.resetPasswordExpires = new Date(0); // make token expired
            await user.save();
            await supertest(app)
                .post("/auth/reset/" + user.resetPasswordToken)
                .send({ password: "bob12345" })
                .expect(410)
                .expect((response) => assertBodyMessage(response, ClientErrorMessage.TOKEN_EXPIRED));
        });
    });
});

describe("POST /logout", () => {
    makeSuite("Log out", () => {
        it("Log out user with valid cookie", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const cookie = ["token=" + generateJwt(user)];
            await supertest(app)
                .post("/auth/logout")
                .set("Cookie", cookie)
                .expect(200)
                .expect((response) => assertBodyMessage(response, SuccessMessage.LOGOUT_SUCCESS));
        });
    });
});

describe("POST /delete", () => {
    makeSuite("Delete user", () => {
        it("Delete user with valid cookie", async () => {
            const userData = {
                email: "alice@example.com",
                password: "alice123",
                verified: true,
            };
            const user = new User(userData);
            await user.save();
            const cookie = ["token=" + generateJwt(user)];
            await supertest(app)
                .post("/auth/delete")
                .set("Cookie", cookie)
                .expect(200)
                .expect((response) => assertBodyMessage(response, SuccessMessage.USER_DELETED));
        });
    });
});
