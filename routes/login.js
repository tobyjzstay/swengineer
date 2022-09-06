require("dotenv").config();

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

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

    const user = new User({
        email: email,
        password: bcrypt.hashSync(password, saltRounds),
    });

    user.save((err) => {
        if (err) {
            res.status(500).json({
                message: err,
            });
            return;
        } else {
            res.status(200).json({
                message: "User registered successfully",
            });
        }
    });
});

router.post("/login", function (req, res) {
    const { email, password } = req.body;
    User.findOne({
        email: email,
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({
                message: err,
            });
            return;
        } else if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }

        // comparing passwords
        var passwordIsValid = bcrypt.compareSync(password, user.password);

        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            res.status(401).send({
                message: "Invalid password",
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

        // responding to client request with user profile success message and access token
        res.status(200).send({
            user: {
                id: user._id,
                email: user.email,
            },
            message: "Login successful",
            accessToken: token,
        });
    });
});

router.post("/reset", function (req, res) {
    const { email, token } = req.body;

    if (email) {
        User.findOne({
            email: email,
        }).exec((err, user) => {
            if (err) {
                res.status(500).send({
                    message: err,
                });
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
                    res.status(500).json({
                        message: err,
                    });
                    return;
                } else {
                    const host = req.headers.referer.split("reset")[0] + "reset"; // domain
                    const ip = req.ip;
                    const err = sendResetEmail(host, token, email, ip);
                    if (err) {
                        res.status(500).json({
                            message: err,
                        });
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
                res.status(500).json({
                    message: err,
                });
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
                    res.status(500).json({
                        message: err,
                    });
                    return;
                } else {
                    const host = req.headers.referer.split("reset")[0] + "reset"; // domain
                    const ip = req.ip;
                    const err = sendResetEmail(host, token, email, ip);
                    if (err) {
                        res.status(500).json({
                            message: err,
                        });
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
            res.status(500).json({
                message: err,
            });
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

    console.log(token);

    User.findOne({ resetPasswordToken: token }, function (err, user) {
        if (err) {
            res.status(500).json({
                message: err,
            });
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
                res.status(500).json({
                    message: err,
                });
                return;
            } else {
                res.status(200).json({
                    message: "Password changed successfully",
                });
            }
        });
    });
});

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

module.exports = router;
