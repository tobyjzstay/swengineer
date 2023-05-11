import bcryptjs from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import log4js from "log4js";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import passport from "passport";
import { internalServerError } from ".";
import { app } from "../..";
import { auth } from "../../middleware";
import { User } from "../../models/User";

const router = express.Router();
const logger = log4js.getLogger();

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

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// redirect to home page after successful login
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    const user = req.user as User;

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
    res.cookie("token", token).redirect("/");
});

router.post("/register", (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ message: "Invalid email address" });
        return;
    } else if (!password) {
        res.status(400).json({ message: "Invalid password" });
        return;
    }

    User.findOne({ email }, (err: NodeJS.ErrnoException, user: User) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const verificationToken = crypto.randomBytes(cryptoSize).toString("hex");

        const newUser = new User({
            email,
            password: bcryptjs.hashSync(password, saltRounds),
            verificationToken,
        });

        newUser.save((err: NodeJS.ErrnoException) => {
            if (err) {
                switch (err.code) {
                    case "11000":
                        res.status(400).json({
                            message: "Email address already exists",
                        });
                        logger.warn(err, new Error().stack);
                        return;
                    default:
                        internalServerError(res, err);
                        return;
                }
            } else {
                const host = req.headers.referer; // domain
                const err = sendVerificationEmail(host, verificationToken, email);
                if (err) {
                    internalServerError(res, err);
                    return;
                } else {
                    res.status(200).json({
                        message: "Verification email sent",
                    });
                }
            }
        });
    });
});

router.get("/register/:token", (req, res, next) => {
    const token = req.params.token;

    User.findOne({ verificationToken: token }, (err: NodeJS.ErrnoException, user: User) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!user) {
            next();
            return;
        }

        user.verified = true;
        user.verificationToken = undefined;

        user.save((err) => {
            if (err) {
                internalServerError(res, err);
                return;
            } else {
                res.status(200).json({
                    message: "User verified successfully",
                });
            }
        });
    });
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const redirect = req.query.redirect;

    User.findOne({
        email: email,
    }).exec((err, user) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!user) {
            res.status(404).json({
                message: "User not found",
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
        return res
            .cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ message: "Logged in successfully" });
    });
});

router.post("/logout", auth, (_req, res) => {
    delete app.locals.user;

    res.clearCookie("access_token").status(200).json({
        message: "Logged out successfully",
    });
});

router.post("/reset", (req, res) => {
    const { email, token } = req.body;

    if (email) {
        User.findOne({
            email: email,
        }).exec((err, user) => {
            if (err) {
                internalServerError(res, err);
                return;
            } else if (!user) {
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
            user.save((err: NodeJS.ErrnoException) => {
                if (err) {
                    internalServerError(res, err);
                    return;
                } else {
                    const host = req.headers?.referer?.split("reset")[0] + "reset"; // TODO: fix this undefined error
                    const ip = req.ip;
                    const err = sendResetEmail(host, token, email, ip);
                    if (err) {
                        internalServerError(res, err);
                        return;
                    } else {
                        res.status(200).json({
                            message: "Reset email sent",
                        });
                    }
                }
            });
        });
    } else
        User.findOne({ resetPasswordToken: token }, (err: NodeJS.ErrnoException, user: User) => {
            if (err) {
                internalServerError(res, err);
                return;
            } else if (!user) {
                res.status(404).json({
                    message: "User not found",
                });
                return;
            }

            const email = user.email;
            const token = crypto.randomBytes(cryptoSize).toString("hex");
            const tokenExpiration = new Date();
            tokenExpiration.setHours(tokenExpiration.getHours() + 1);

            user.resetPasswordToken = token;
            user.resetPasswordExpires = tokenExpiration;
            user.save((err: NodeJS.ErrnoException) => {
                if (err) {
                    internalServerError(res, err);
                    return;
                } else {
                    const host = req.headers.referer.split("reset")[0] + "reset"; // domain
                    const ip = req.ip;
                    const err = sendResetEmail(host, token, email, ip);
                    if (err) {
                        internalServerError(res, err);
                        return;
                    } else {
                        res.status(200).json({
                            message: "Reset email sent",
                        });
                    }
                }
            });
        });
});

router.get("/reset/:token", (req, res, next) => {
    const token = req.params.token;

    User.findOne({ resetPasswordToken: token }, (err: NodeJS.ErrnoException, user: User) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!user) {
            next();
            return;
        } else if (user.resetPasswordExpires.getTime() < new Date().getTime()) {
            res.status(401).json({
                message: "Token has expired",
            });
            return;
        } else {
            res.status(200).json({
                message: "Token is valid",
            });
        }
    });
});

router.post("/reset/:token", (req, res, next) => {
    const { password } = req.body;
    const token = req.params.token;

    User.findOne({ resetPasswordToken: token }, (err: NodeJS.ErrnoException, user: User) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!user) {
            next();
            return;
        } else if (user.resetPasswordExpires.getTime() < new Date().getTime()) {
            res.status(401).json({
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

        user.save((err) => {
            if (err) {
                internalServerError(res, err);
                return;
            } else {
                res.status(200).json({
                    message: "Password changed successfully",
                });
            }
        });
    });
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

            res.clearCookie("access_token").status(200).json({
                message: "Account deleted",
            });
        }
    });
});

function sendVerificationEmail(host: string, token: string, email: string): NodeJS.ErrnoException {
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: `"swengineer" <${process.env.GMAIL_EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "Email Verification", // subject line
        text:
            `Verify your email address to finish registering your swengineer account.\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${host}/${token}\n\n`,
    };
    smtpTransport.sendMail(mailOptions, (err) => {
        return err;
    });
    return null;
}

function sendResetEmail(host: string, token: string, email: string, ip: string): NodeJS.ErrnoException {
    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: `"swengineer" <${process.env.GMAIL_EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: "Password Reset", // subject line
        text:
            `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${host}/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
            `Email: ${email}\n` +
            `IP Address: ${ip}\n` +
            `Created: ${new Date().toString()}\n`,
    };
    smtpTransport.sendMail(mailOptions, (err) => {
        return err;
    });
    return null;
}

module.exports = router;
