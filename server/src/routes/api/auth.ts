import express from "express";
import jwt from "jsonwebtoken";
import log4js from "log4js";
import crypto from "node:crypto";
import passport from "passport";
import { internalServerError } from ".";
import { app } from "../..";
import { auth } from "../../middleware";
import { User } from "../../models/User";
import { sendMail } from "../../nodemailer";

const router = express.Router();
const logger = log4js.getLogger(process.pid.toString());

const cryptoSize = Number(process.env.CRYPTO_SIZE);

enum SuccessMessage {
    VERIFICATION_EMAIL_SENT = "VERIFICATION_EMAIL_SENT",
    RESET_EMAIL_SENT = "RESET_EMAIL_SENT",
    PASSWORD_CHANGED = "PASSWORD_CHANGED",
    ACCOUNT_DELETED = "ACCOUNT_DELETED",
    VERIFICATION_SUCCESS = "VERIFICATION_SUCCESS",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
}
enum ErrorMessage {
    INVALID_EMAIL = "INVALID_EMAIL",
    INVALID_PASSWORD = "INVALID_PASSWORD",
    INVALID_PASSWORD_LENGTH = "INVALID_PASSWORD_LENGTH",
    DUPLICATE_USER = "DUPLICATE_USER",
    UNVERIFIED_EMAIL = "UNVERIFIED_EMAIL",
    NO_PASSWORD = "NO_PASSWORD",
}

router.get("/", auth, (_req, res) => {
    const user = app.locals.user as User;

    const userData = user
        ? {
              id: user._id,
              email: user.email,
              created: user.createdAt,
          }
        : undefined;

    res.status(200).json({ user: userData });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// redirect to home page after successful login
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    const user = req.user as User;
    const redirect = app.locals.redirect;

    const token = jwt.sign(
        {
            id: user.id,
        },
        process.env.API_SECRET,
        {
            expiresIn: 86400,
        }
    );

    // responding to client request success message and access token
    res.cookie("token", token).redirect(redirect || "/");
});

router.post("/register", async (request, response) => {
    const { email, password, verify } = request.body || {};

    if (!email) {
        response.status(400).json({ message: ErrorMessage.INVALID_EMAIL });
        return;
    } else if (!verify) {
        if (!password) {
            response.status(400).json({ message: ErrorMessage.INVALID_PASSWORD });
            return;
        } else if (password.length < 8) {
            response.status(400).json({ message: ErrorMessage.INVALID_PASSWORD_LENGTH });
            return;
        }
    }

    try {
        let user: User = await User.findOne({ email });

        if (user) {
            if (!verify) {
                response.status(409).json({ message: ErrorMessage.DUPLICATE_USER });
                return;
            }
        } else {
            user = new User({
                email,
                password,
            });
        }
        const verificationToken = user.generateVerificationToken();
        await user.save();
        const host = request.headers.referer;
        sendVerificationEmail(host, verificationToken, email);
        response.status(201).json({ message: SuccessMessage.VERIFICATION_EMAIL_SENT });
    } catch (error: unknown) {
        internalServerError(response, error);
    }
});

router.get("/register/:token", async (request, response, next) => {
    const token = request.params.token;

    try {
        const user: User = await User.findOne({ verificationToken: token });

        if (!user) return next();

        user.verified = true;

        await user.save();
        response.status(200).json({ message: SuccessMessage.VERIFICATION_SUCCESS });
    } catch (error: unknown) {
        internalServerError(response, error);
    }
});

router.post("/login", async (request, response) => {
    const { email, password } = request.body || {};

    try {
        const user: User = await User.findOne({ email });

        if (!user) {
            response.status(404).json({ message: ErrorMessage.INVALID_EMAIL });
            return;
        } else if (!user.password) {
            response.status(403).json({ message: ErrorMessage.NO_PASSWORD });
            return;
        } else if (!(await user.comparePassword(password))) {
            response.status(401).json({ message: ErrorMessage.INVALID_PASSWORD });
            return;
        } else if (!user.verified) {
            response.status(403).json({ message: ErrorMessage.UNVERIFIED_EMAIL });
            return;
        }

        const token = generateJwt(user);
        response
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ message: SuccessMessage.LOGIN_SUCCESS });
        return;
    } catch (error: unknown) {
        internalServerError(response, error);
    }
});

router.post("/logout", auth, async (_req, res) => {
    delete app.locals.user;
    res.clearCookie("token").status(200).json({ message: SuccessMessage.LOGOUT_SUCCESS });
});

router.post("/reset", async (req, res) => {
    const { email, token } = req.body || {};

    if (email) {
        try {
            const user = await User.findOne({
                email: email,
            });

            if (!user) {
                res.status(404).json({
                    message: "User not found",
                });
                return;
            }

            const token = crypto.randomBytes(cryptoSize).toString("hex");
            const tokenExpiration = new Date();
            tokenExpiration.setHours(tokenExpiration.getHours() + 1);

            user.resetPasswordToken = token;
            user.resetPasswordExpires = tokenExpiration;
            user.save()
                .then(() => {
                    const host = req.headers?.referer?.split("reset")[0] + "reset"; // TODO: fix this undefined error
                    const ip = req.ip;
                    const success = sendResetEmail(host, token, email, ip);
                    if (success) {
                        res.status(200).json({
                            message: "Reset email sent",
                        });
                    } else {
                        // TODO: improve this
                        internalServerError(res, null);
                        return;
                    }
                })
                .catch((err: NodeJS.ErrnoException) => {
                    internalServerError(res, err);
                });
        } catch (err: unknown) {
            internalServerError(res, err);
        }
    } else
        try {
            const user = await User.findOne({ resetPasswordToken: token });

            if (!user) {
                res.status(404).json({
                    message: "User not found",
                });
                return;
            }

            const email = user.email;
            const resetPasswordToken = crypto.randomBytes(cryptoSize).toString("hex");
            const tokenExpiration = new Date();
            tokenExpiration.setHours(tokenExpiration.getHours() + 1);

            user.resetPasswordToken = resetPasswordToken;
            user.resetPasswordExpires = tokenExpiration;
            user.save()
                .then(() => {
                    const host = req.headers.referer.split("reset")[0] + "reset"; // domain
                    const ip = req.ip;
                    const success = sendResetEmail(host, resetPasswordToken, email, ip);
                    if (success) {
                        res.status(200).json({
                            message: "Reset email sent",
                        });
                    } else {
                        // TODO: improve this
                        internalServerError(res, null);
                        return;
                    }
                })
                .catch((err: NodeJS.ErrnoException) => {
                    internalServerError(res, err);
                });
        } catch (err: unknown) {
            internalServerError(res, err);
        }
});

router.get("/reset/:token", async (req, res, next) => {
    const token = req.params.token;

    try {
        const user = await User.findOne({ resetPasswordToken: token });

        if (!user) {
            next();
            return;
        } else if (user.resetPasswordExpires.getTime() < new Date().getTime()) {
            res.status(410).json({
                message: "Token has expired",
            });
            return;
        } else {
            res.status(200).json({
                message: "Token is valid",
            });
        }
    } catch (err: unknown) {
        internalServerError(res, err);
    }
});

router.post("/reset/:token", async (req, res, next) => {
    const { password } = req.body || {};
    const token = req.params.token;

    try {
        const user = await User.findOne({ resetPasswordToken: token });

        if (!user) {
            next();
            return;
        } else if (user.resetPasswordExpires.getTime() < new Date().getTime()) {
            res.status(410).json({
                message: "Token has expired",
            });
            return;
        } else if (!password) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }

        user.password = password;

        user.save()
            .then(() => {
                res.status(200).json({
                    message: "Password changed successfully",
                });
            })
            .catch((err: NodeJS.ErrnoException) => {
                internalServerError(res, err);
            });
    } catch (err: unknown) {
        internalServerError(res, err);
    }
});

router.post("/delete", auth, (req, res) => {
    const user = app.locals.user as User;

    if (!user) {
        res.status(404).json({
            message: "User not found",
        });
        return;
    }

    User.findByIdAndDelete(user.id, (err: NodeJS.ErrnoException) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else {
            delete app.locals.user;

            res.clearCookie("token").status(200).json({
                message: "Account deleted",
            });
        }
    });
});

function sendVerificationEmail(host: string, token: string, email: string) {
    return sendMail({
        to: email,
        subject: "Email Verification",
        text:
            `Verify your email address to finish registering your swengineer account.\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${host}/${token}\n\n`,
    });
}

function sendResetEmail(host: string, token: string, email: string, ip: string) {
    return sendMail({
        to: email,
        subject: "Password Reset",
        text:
            `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${host}/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
            `Email: ${email}\n` +
            `IP Address: ${ip}\n` +
            `Created: ${new Date().toString()}\n`,
    });
}

function generateJwt(user: User) {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.API_SECRET,
        {
            expiresIn: 86400,
        }
    );
}

module.exports = router;
