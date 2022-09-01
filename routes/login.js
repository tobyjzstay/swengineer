const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", function (req, res) {
    const { email, password } = req.body;
    const user = new User({
        email: email,
        password: bcrypt.hashSync(password, 8),
    });

    user.save((err, user) => {
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
        }
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // comparing passwords
        var passwordIsValid = bcrypt.compareSync(password, user.password);

        // checking if password was valid and send response accordingly
        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid password",
            });
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

module.exports = router;
