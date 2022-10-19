require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const log4js = require("log4js");
const User = require("../models/User");
const verifyToken = require("../middleware");

const router = express.Router();
const logger = log4js.getLogger();
logger.level = "all";

const cryptoSize = Number(process.env.CRYPTO_SIZE);
const saltRounds = Number(process.env.SALT_ROUNDS);

router.post("/register", function (req, res) {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ message: "Invalid email address" });
        return;
    } else if (!password) {
        res.status(400).json({ message: "Invalid password" });
        return;
    }

    User.findOne({ email: email }, function (err, user) {
        if (err) {
            logger.error(err);
            res.status(500).json({ message: "Internal server error" });
            return;
        } else if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const token = crypto.randomBytes(cryptoSize).toString("hex");

        const newUser = new User({
            email: email,
            password: bcrypt.hashSync(password, saltRounds),
            verificationToken: token,
        });

        newUser.save((err) => {
            if (err) {
                switch (err.code) {
                    case 11000:
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
                const err = sendVerificationEmail(host, token, email);
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

router.get("/register/:token", function (req, res) {
    const token = req.params.token;

    User.findOne({ verificationToken: token }, function (err, user) {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!user) {
            res.status(404).json({
                message: "Invalid token",
            });
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

router.post("/login", function (req, res) {
    const { email, password } = req.body;

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
        var passwordIsValid = password && bcrypt.compareSync(password, user.password);

        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            res.status(401).send({
                message: "Invalid password",
            });
            return;
        }

        if (!user.verified) {
            res.status(403).send({
                message: "Email address not verified",
            });
            return;
        }

        // signing token with user id
        var token = jwt.sign(
            {
                id: user.id,
            },
            process.env.API_SECRET,
            {
                expiresIn: 86400,
            }
        );

        // responding to client request success message and access token
        res.cookie("token", token).status(200).send({
            message: "Login successful",
        });
    });
});

router.post("/logout", verifyToken, function (req, res) {
    // TODO: destroy token server side

    res.clearCookie("token").status(200).send({
        message: "Logout successful",
    });
});

router.post("/reset", function (req, res) {
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
            const tokenExpiration = Date.now() + 3600000; // 1 hour

            user.resetPasswordToken = token;
            user.resetPasswordExpires = tokenExpiration;
            user.save((err) => {
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
        User.findOne({ resetPasswordToken: token }, function (err, user) {
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
            const tokenExpiration = Date.now() + 3600000; // 1 hour

            user.resetPasswordToken = token;
            user.resetPasswordExpires = tokenExpiration;
            user.save((err) => {
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

router.get("/reset/:token", function (req, res) {
    const token = req.params.token;

    User.findOne({ resetPasswordToken: token }, function (err, user) {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!user) {
            res.status(404).json({
                message: "Invalid token",
            });
            return;
        } else if (user.resetPasswordExpires < Date.now()) {
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

router.post("/reset/:token", function (req, res) {
    const { password } = req.body;
    const token = req.params.token;

    User.findOne({ resetPasswordToken: token }, function (err, user) {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!user) {
            res.status(404).json({
                message: "Invalid token",
            });
            return;
        } else if (user.resetPasswordExpires < Date.now()) {
            res.status(401).json({
                message: "Token has expired",
            });
            return;
        } else if (!password) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }

        user.password = bcrypt.hashSync(password, saltRounds);
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

router.post("/delete", verifyToken, function (req, res) {
    const user = req.user;

    User.findByIdAndDelete(user.id, (err) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else {
            res.status(200).json({
                message: "Account deleted",
            });
        }
    });
});

function sendVerificationEmail(host, token, email) {
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        },
    });
    var mailOptions = {
        from: `"swengineer" <${process.env.NODEMAILER_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Email Verification", // subject line
        text:
            `Verify your email address to finish registering your swengineer account.\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${host}/${token}\n\n`,
    };
    smtpTransport.sendMail(mailOptions, function (err) {
        return err;
    });
}

function sendResetEmail(host, token, email, ip) {
    var smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS,
        },
    });
    var mailOptions = {
        from: `"swengineer" <${process.env.NODEMAILER_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Password Reset", // subject line
        text:
            `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${host}/${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
            `Email: ${email}\n` +
            `IP Address: ${ip}\n` +
            `Created: ${new Date().toGMTString()}\n`,
    };
    smtpTransport.sendMail(mailOptions, function (err) {
        return err;
    });
}

function internalServerError(res, err) {
    res.status(500).json({
        message: "Internal server error",
    });
    logger.error(err, new Error().stack);
    return;
}

module.exports = router;
