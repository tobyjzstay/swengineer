import bcryptjs from "bcryptjs";
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
const saltRounds = Number(process.env.SALT_ROUNDS);

router.get("/", auth, (_req, res) => {
    const user = app.locals.user as User;

    const userData = user
        ? {
              id: user._id,
              email: user.email,
              created: user.created,
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

router.post("/register", async (req, res) => {
    const { email, password, verify } = req.body || {};

    if (!email) {
        res.status(400).json({ message: "Invalid email address" });
        return;
    } else if (verify && !password) {
        res.status(400).json({ message: "Invalid password" });
        return;
    }

    try {
        const user = await User.findOne({ email });

        const verificationToken = crypto.randomBytes(cryptoSize).toString("hex");
        if (user) {
            if (verify) {
                user.verificationToken = verificationToken;
                // TODO: shouldn't use save?
                user.save()
                    .then(() => {
                        const host = req.headers.referer; // domain
                        const success = sendVerificationEmail(host, verificationToken, email);
                        if (success) {
                            res.status(201).json({
                                message: "Verification email sent",
                            });
                        } else {
                            // TODO: improve this
                            internalServerError(res, null);
                        }
                    })
                    .catch((error: NodeJS.ErrnoException) => {
                        switch (error.code) {
                            default:
                                internalServerError(res, error);
                                return;
                        }
                    });
            } else res.status(409).json({ message: "User already exists" });
            return;
        }

        const newUser = new User({
            email,
            password: bcryptjs.hashSync(password, saltRounds),
            verificationToken,
        });

        newUser
            .save()
            .then(() => {
                const host = req.headers.referer; // domain
                const success = sendVerificationEmail(host, verificationToken, email);
                if (success) {
                    res.status(201).json({
                        message: "Verification email sent",
                    });
                } else {
                    internalServerError(res, null);
                }
            })
            .catch((err: NodeJS.ErrnoException) => {
                switch (err.code) {
                    case "11000":
                        res.status(400).json({
                            message: "Email address already exists",
                        });
                        logger.warn(err, new Error().stack);
                        break;
                    default:
                        internalServerError(res, err);
                        break;
                }
            });
    } catch (err: unknown) {
        internalServerError(res, err);
    }
});

router.get("/register/:token", async (req, res, next) => {
    const token = req.params.token;

    try {
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return next();
        }

        user.verified = true;
        user.verificationToken = undefined;

        user.save()
            .then(() => {
                res.status(200).json({
                    message: "User verified successfully",
                });
            })
            .catch((err: NodeJS.ErrnoException) => {
                internalServerError(res, err);
            });
        return;
    } catch (err: unknown) {
        internalServerError(res, err);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body || {};

    try {
        const user = await User.findOne({
            email: email,
        });

        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        } else if (!user.password) {
            res.status(403).json({
                message: "User has no password",
            });
            return;
        }

        // comparing passwords
        const passwordIsValid = password && bcryptjs.compareSync(password, user.password);

        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            res.status(401).json({
                message: "Invalid password",
            });
            return;
        }

        if (!user.verified) {
            res.status(403).json({
                message: "Email address not verified",
            });
            return;
        }

        // signing token with user id
        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.API_SECRET,
            {
                expiresIn: 86400,
            }
        );

        // send token as cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        })
            .status(200)
            .json({ message: "Logged in successfully" });
        return;
    } catch (err: unknown) {
        internalServerError(res, err);
    }
});

router.post("/logout", auth, async (_req, res) => {
    delete app.locals.user;

    res.clearCookie("token").status(200).json({
        message: "Logged out successfully",
    });
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

        user.password = bcryptjs.hashSync(password, saltRounds);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

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

module.exports = router;
